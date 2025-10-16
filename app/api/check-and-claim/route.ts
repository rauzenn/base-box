import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const MISSION_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
  legendary: 100
};

const MISSION_HASHTAGS = {
  easy: "#BasedVibes",
  medium: "#BasedDiscovery",
  hard: "#BasedBuilder",
  legendary: "#BasedCreator"
};

const BADGES = [
  { days: 7, name: "Seed", emoji: "🌱" },
  { days: 14, name: "Flame", emoji: "🔥" },
  { days: 21, name: "Diamond", emoji: "💎" },
  { days: 30, name: "Crown", emoji: "👑" }
];

async function verifyFarcasterPost(fid: number, hashtag: string): Promise<boolean> {
  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
  
  if (!NEYNAR_API_KEY || NEYNAR_API_KEY === "demo") {
    console.log(`[DEV MODE] Skipping verification for FID ${fid}, hashtag ${hashtag}`);
    return true;
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/casts?fid=${fid}&limit=25`,
      {
        headers: {
          "api_key": NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error("Neynar API error:", response.statusText);
      return false;
    }

    const data = await response.json();
    const casts = data.casts || [];

    const today = new Date().toISOString().split("T")[0];
    const todayCasts = casts.filter((cast: any) => {
      const castDate = new Date(cast.timestamp).toISOString().split("T")[0];
      return castDate === today;
    });

    const hasHashtag = todayCasts.some((cast: any) => {
      const text = cast.text?.toLowerCase() || "";
      return text.includes(hashtag.toLowerCase());
    });

    return hasHashtag;
  } catch (error) {
    console.error("Error verifying post:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fid, missionType } = body;

    if (!fid) {
      return NextResponse.json(
        { success: false, message: "FID required" },
        { status: 400 }
      );
    }

    // Fetch user data from KV
    const userKey = `user:${fid}`;
    let userData = await kv.hgetall(userKey);

    // Initialize new user
    if (!userData || Object.keys(userData).length === 0) {
      userData = {
        currentStreak: "0",
        maxStreak: "0",
        totalXP: "0",
        lastClaimDate: "",
        badges: "[]"
      };
    }

    // Parse data
    let currentStreak = parseInt(userData.currentStreak as string) || 0;
    let maxStreak = parseInt(userData.maxStreak as string) || 0;
    let totalXP = parseInt(userData.totalXP as string) || 0;
    let lastClaimDate = userData.lastClaimDate as string || "";
    let badges = userData.badges 
      ? (typeof userData.badges === 'string' ? JSON.parse(userData.badges as string) : userData.badges)
      : [];

    // Check if already claimed today
    const today = new Date().toISOString().split("T")[0];
    if (lastClaimDate === today) {
      return NextResponse.json({
        success: false,
        message: "Already claimed today! Come back tomorrow 🔥",
        currentStreak,
        maxStreak,
        totalXP
      });
    }

    // Verify Farcaster post
    const requiredHashtag = MISSION_HASHTAGS[missionType as keyof typeof MISSION_HASHTAGS] || "#BasedVibes";
    const postVerified = await verifyFarcasterPost(fid, requiredHashtag);

    if (!postVerified) {
      return NextResponse.json({
        success: false,
        message: `Post with ${requiredHashtag} not found. Please post on Farcaster first!`,
        currentStreak,
        maxStreak,
        totalXP
      });
    }

    // Calculate streak continuation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastClaimDate === yesterdayStr || currentStreak === 0) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    // Update max streak
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    // Award XP
    const missionXP = MISSION_XP[missionType as keyof typeof MISSION_XP] || 10;
    totalXP += missionXP;

    // Check for milestone badges
    const newBadges: string[] = [];
    for (const badge of BADGES) {
      if (currentStreak === badge.days && !badges.includes(badge.name)) {
        badges.push(badge.name);
        newBadges.push(badge.name);
        const bonusXP = badge.days * 2;
        totalXP += bonusXP;
      }
    }

    // Update last claim date
    lastClaimDate = today;

    // Save to KV
    await kv.hset(userKey, {
      currentStreak: currentStreak.toString(),
      maxStreak: maxStreak.toString(),
      totalXP: totalXP.toString(),
      lastClaimDate,
      badges: JSON.stringify(badges)
    });

    // Update leaderboard (sorted set by totalXP)
    await kv.zadd("leaderboard:global", {
      score: totalXP,
      member: fid.toString()
    });

    return NextResponse.json({
      success: true,
      message: newBadges.length > 0 
        ? `Streak claimed! +${missionXP} XP. Badge unlocked: ${newBadges.join(", ")} 🎉`
        : `Streak claimed! +${missionXP} XP 🔥`,
      currentStreak,
      maxStreak,
      totalXP,
      xpGained: missionXP,
      newBadges
    });

  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching user stats (kept for compatibility)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID required" },
      { status: 400 }
    );
  }

  const userKey = `user:${fid}`;
  const userData = await kv.hgetall(userKey);

  if (!userData || Object.keys(userData).length === 0) {
    return NextResponse.json({
      currentStreak: 0,
      maxStreak: 0,
      totalXP: 0,
      badges: []
    });
  }

  const badges = userData.badges 
    ? (typeof userData.badges === 'string' ? JSON.parse(userData.badges as string) : userData.badges)
    : [];

  return NextResponse.json({
    currentStreak: parseInt(userData.currentStreak as string) || 0,
    maxStreak: parseInt(userData.maxStreak as string) || 0,
    totalXP: parseInt(userData.totalXP as string) || 0,
    badges
  });
}