import { kv } from '@vercel/kv';

// Types
export interface User {
  fid: number;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  walletAddress?: string;
  joinedAt: number;
  lastSeenAt: number;
}

export interface Participation {
  seasonId: string;
  fid: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  firstSuccessDayIdx: number | null;
  lastClaimedDayIdx: number | null;
  badges: number[];
}

export interface DayEvent {
  seasonId: string;
  fid: number;
  dayIdx: number;
  castHash: string;
  points: number;
  verifiedAt: number;
}

// ====================
// USER FUNCTIONS
// ====================

export async function getUser(fid: number): Promise<User | null> {
  const key = `user:${fid}`;
  const data = await kv.hgetall(key);
  if (!data || Object.keys(data).length === 0) return null;
  return data as unknown as User;
}

export async function createUser(user: User): Promise<void> {
  const key = `user:${user.fid}`;
  await kv.hset(key, user as any);
}

export async function updateUser(fid: number, updates: Partial<User>): Promise<void> {
  const key = `user:${fid}`;
  await kv.hset(key, updates as any);
}

// ====================
// PARTICIPATION FUNCTIONS
// ====================

export async function getUserParticipation(
  fid: number,
  seasonId: string
): Promise<Participation | null> {
  const key = `participation:${seasonId}:${fid}`;
  const data = await kv.hgetall(key);
  if (!data || Object.keys(data).length === 0) {
    return null;
  }
  
  // Parse badges JSON string to array
  const badges = typeof data.badges === 'string' 
    ? JSON.parse(data.badges) 
    : (data.badges || []);
  
  return {
    ...data,
    badges
  } as unknown as Participation;
}

export async function createParticipation(participation: Participation): Promise<void> {
  const key = `participation:${participation.seasonId}:${participation.fid}`;
  await kv.hset(key, {
    ...participation,
    badges: JSON.stringify(participation.badges)
  } as any);
}

export async function updateUserStreak(
  fid: number,
  seasonId: string,
  data: {
    totalXp?: number;
    currentStreak?: number;
    longestStreak?: number;
    lastClaimedDayIdx?: number;
    badges?: number[];
  }
): Promise<void> {
  const key = `participation:${seasonId}:${fid}`;
  const updates: any = { ...data };
  
  if (data.badges) {
    updates.badges = JSON.stringify(data.badges);
  }
  
  await kv.hset(key, updates);
}

// ====================
// DAY EVENT FUNCTIONS
// ====================

export async function hasClaimed(
  fid: number,
  seasonId: string,
  dayIdx: number
): Promise<boolean> {
  const key = `claimed:${seasonId}:${fid}:${dayIdx}`;
  const exists = await kv.get(key);
  return exists !== null;
}

export async function markDayClaimed(
  fid: number,
  seasonId: string,
  dayIdx: number,
  castHash: string
): Promise<void> {
  const key = `claimed:${seasonId}:${fid}:${dayIdx}`;
  // Expire after 31 days (season length + buffer)
  await kv.set(key, castHash, { ex: 86400 * 31 });
  
  // Store full event for analytics
  const eventKey = `event:${seasonId}:${fid}:${dayIdx}`;
  await kv.hset(eventKey, {
    seasonId,
    fid,
    dayIdx,
    castHash,
    points: 10,
    verifiedAt: Date.now()
  });
}

// ====================
// LEADERBOARD FUNCTIONS
// ====================

export async function addToLeaderboard(
  seasonId: string,
  fid: number,
  xp: number
): Promise<void> {
  await kv.zadd(`leaderboard:${seasonId}`, {
    score: xp,
    member: fid.toString()
  });
}

export async function getLeaderboard(
  seasonId: string,
  limit = 100
): Promise<Array<{ fid: number; xp: number }>> {
  const results = await kv.zrange(`leaderboard:${seasonId}`, 0, limit - 1, {
    rev: true,
    withScores: true
  });

  // Results come as [member1, score1, member2, score2, ...]
  const leaderboard: Array<{ fid: number; xp: number }> = [];
  for (let i = 0; i < results.length; i += 2) {
    leaderboard.push({
      fid: parseInt(results[i] as string),
      xp: results[i + 1] as number
    });
  }
  
  return leaderboard;
}

export async function getUserRank(seasonId: string, fid: number): Promise<number | null> {
  const rank = await kv.zrevrank(`leaderboard:${seasonId}`, fid.toString());
  return rank !== null ? rank + 1 : null; // Convert to 1-based ranking
}

// ====================
// BADGE FUNCTIONS
// ====================

export async function grantBadge(
  fid: number,
  seasonId: string,
  badgeId: number
): Promise<void> {
  const participation = await getUserParticipation(fid, seasonId);
  if (!participation) return;
  
  if (!participation.badges.includes(badgeId)) {
    participation.badges.push(badgeId);
    await updateUserStreak(fid, seasonId, {
      badges: participation.badges
    });
  }
}

// ====================
// REFERRAL FUNCTIONS
// ====================

export async function createReferralCode(fid: number): Promise<string> {
  // Simple code: base36 encoding of fid + random suffix
  const code = `${fid.toString(36)}${Math.random().toString(36).substr(2, 4)}`;
  await kv.hset(`referral:${code}`, {
    inviterFid: fid,
    createdAt: Date.now()
  });
  return code;
}

export async function getReferralInfo(code: string): Promise<{ inviterFid: number } | null> {
  const data = await kv.hgetall(`referral:${code}`);
  if (!data || !data.inviterFid) return null;
  return data as any;
}

export async function trackReferral(
  code: string,
  invitedFid: number
): Promise<void> {
  const key = `referral_track:${code}:${invitedFid}`;
  await kv.set(key, Date.now());
}