import { kv } from '@vercel/kv';

// ====================
// TYPES - BASE BOX
// ====================

export interface Capsule {
  id: string;
  fid: number;
  message: string;
  image?: string;
  imageType?: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface UserStats {
  fid: number;
  totalCapsules: number;
  revealedCapsules: number;
  achievements: Achievement[];
  joinedAt: string;
}

// ====================
// CAPSULE FUNCTIONS
// ====================

/**
 * Get all capsules for a user
 */
export async function getUserCapsules(fid: number): Promise<Capsule[]> {
  try {
    const pattern = `capsule:${fid}:*`;
    const keys = await kv.keys(pattern);
    
    if (!keys || keys.length === 0) {
      return [];
    }

    const capsules: Capsule[] = [];
    for (const key of keys) {
      const data = await kv.hgetall(key);
      if (data) {
        capsules.push(data as unknown as Capsule);
      }
    }

    // Sort by createdAt desc
    return capsules.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting user capsules:', error);
    return [];
  }
}

/**
 * Get a specific capsule
 */
export async function getCapsule(fid: number, capsuleId: string): Promise<Capsule | null> {
  try {
    const key = `capsule:${fid}:${capsuleId}`;
    const data = await kv.hgetall(key);
    return data ? (data as unknown as Capsule) : null;
  } catch (error) {
    console.error('Error getting capsule:', error);
    return null;
  }
}

/**
 * Create a capsule
 */
export async function createCapsule(capsule: Capsule): Promise<void> {
  const key = `capsule:${capsule.fid}:${capsule.id}`;
  await kv.hset(key, capsule as any);
  
  // Add to user's capsule set
  await kv.sadd(`user:${capsule.fid}:capsules`, capsule.id);
}

/**
 * Delete a capsule
 */
export async function deleteCapsule(fid: number, capsuleId: string): Promise<void> {
  const key = `capsule:${fid}:${capsuleId}`;
  await kv.del(key);
  
  // Remove from user's capsule set
  await kv.srem(`user:${fid}:capsules`, capsuleId);
}

/**
 * Update capsule (e.g., mark as revealed)
 */
export async function updateCapsule(
  fid: number,
  capsuleId: string,
  updates: Partial<Capsule>
): Promise<void> {
  const key = `capsule:${fid}:${capsuleId}`;
  await kv.hset(key, updates as any);
}

// ====================
// STATS FUNCTIONS
// ====================

/**
 * Get user statistics
 */
export async function getUserStats(fid: number): Promise<UserStats | null> {
  try {
    const capsules = await getUserCapsules(fid);
    const revealed = capsules.filter(c => c.revealed).length;
    
    // Get achievements (from separate key)
    const achievementsData = await kv.hgetall(`user:${fid}:achievements`);
    const achievements: Achievement[] = achievementsData 
      ? Object.values(achievementsData).map(a => 
          typeof a === 'string' ? JSON.parse(a) : a
        )
      : [];

    // Get join date
    const userData = await kv.hgetall(`user:${fid}`);
    const joinedAt = userData?.joinedAt as string || new Date().toISOString();

    return {
      fid,
      totalCapsules: capsules.length,
      revealedCapsules: revealed,
      achievements,
      joinedAt
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// ====================
// ACHIEVEMENT FUNCTIONS
// ====================

/**
 * Grant an achievement to a user
 */
export async function grantAchievement(
  fid: number,
  achievement: Achievement
): Promise<void> {
  const key = `user:${fid}:achievements`;
  const achievementData = {
    ...achievement,
    unlockedAt: new Date().toISOString()
  };
  
  await kv.hset(key, {
    [achievement.id]: JSON.stringify(achievementData)
  });
}

/**
 * Get user achievements
 */
export async function getUserAchievements(fid: number): Promise<Achievement[]> {
  try {
    const key = `user:${fid}:achievements`;
    const data = await kv.hgetall(key);
    
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    return Object.values(data).map(a => 
      typeof a === 'string' ? JSON.parse(a) : a
    );
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
}

/**
 * Check if user has achievement
 */
export async function hasAchievement(fid: number, achievementId: string): Promise<boolean> {
  const key = `user:${fid}:achievements`;
  const data = await kv.hget(key, achievementId);
  return data !== null;
}

// ====================
// LEADERBOARD FUNCTIONS
// ====================

/**
 * Add user to global leaderboard (by total capsules)
 */
export async function updateLeaderboard(fid: number, totalCapsules: number): Promise<void> {
  await kv.zadd('leaderboard:global', {
    score: totalCapsules,
    member: fid.toString()
  });
}

/**
 * Get global leaderboard
 */
export async function getLeaderboard(limit = 100): Promise<Array<{ fid: number; count: number }>> {
  try {
    const results = await kv.zrange('leaderboard:global', 0, limit - 1, {
      rev: true,
      withScores: true
    });

    const leaderboard: Array<{ fid: number; count: number }> = [];
    for (let i = 0; i < results.length; i += 2) {
      leaderboard.push({
        fid: parseInt(results[i] as string),
        count: results[i + 1] as number
      });
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

/**
 * Get user's rank on leaderboard
 */
export async function getUserRank(fid: number): Promise<number | null> {
  try {
    const rank = await kv.zrevrank('leaderboard:global', fid.toString());
    return rank !== null ? rank + 1 : null;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}

// ====================
// USER FUNCTIONS
// ====================

/**
 * Get or create user
 */
export async function getUser(fid: number): Promise<{ fid: number; joinedAt: string }> {
  const key = `user:${fid}`;
  let userData = await kv.hgetall(key);
  
  if (!userData || Object.keys(userData).length === 0) {
    // Create new user
    const newUser = {
      fid,
      joinedAt: new Date().toISOString()
    };
    await kv.hset(key, newUser as any);
    return newUser;
  }
  
  return userData as any;
}

/**
 * Update user data
 */
export async function updateUser(fid: number, updates: Record<string, any>): Promise<void> {
  const key = `user:${fid}`;
  await kv.hset(key, updates);
}

// ====================
// ANALYTICS FUNCTIONS (Optional)
// ====================

/**
 * Increment global stats
 */
export async function incrementGlobalStat(statName: string, amount = 1): Promise<void> {
  await kv.incrby(`stats:global:${statName}`, amount);
}

/**
 * Get global stats
 */
export async function getGlobalStats(): Promise<{
  totalCapsules: number;
  totalReveals: number;
  totalUsers: number;
}> {
  const [totalCapsules, totalReveals, totalUsers] = await Promise.all([
    kv.get('stats:global:totalCapsules'),
    kv.get('stats:global:totalReveals'),
    kv.get('stats:global:totalUsers')
  ]);

  return {
    totalCapsules: (totalCapsules as number) || 0,
    totalReveals: (totalReveals as number) || 0,
    totalUsers: (totalUsers as number) || 0
  };
}