import { NextRequest, NextResponse } from "next/server";

// In-memory storage (will be replaced with KV later)
const userStreaks = new Map<number, {
  currentStreak: number;
  maxStreak: number;
  totalXP: number;
  lastClaimDate: string;
  badges: string[];
}>();

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

// Milestone badges
const BADGES = [
  { days: 7, name: "Seed", emoji: "🌱" },
  { days: 14, name: "Flame", emoji: "🔥" },
  { days: 21, name: "Diamond", emoji: "💎" },
  { days: 30, name: "Crown", emoji: "👑" }
];

async function verifyFarcasterPost(fid: number, hashtag: string): Promise<boolean> {
  // TODO: Implement Neynar API verification
  // For now, we'll simulate verification
  
  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
  
  if (!NEYNAR_API_KEY || NEYNAR_API_KEY === "demo") {
    // Dev mode: always return true
    console.log(`[DEV MODE] Skipping verification for FID ${fid}, hashtag ${hashtag}`);
    return true;
  }

  try {
    // Get user's recent casts from Neynar
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

    // Check if any cast from today contains the hashtag
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

    // Get or create user data
    let userData = userStreaks.get(fid);
    if (!userData) {
      userData = {
        currentStreak: 0,
        maxStreak: 0,
        totalXP: 0,
        lastClaimDate: "",
        badges: []
      };
      userStreaks.set(fid, userData);
    }

    // Check if already claimed today
    const today = new Date().toISOString().split("T")[0];
    if (userData.lastClaimDate === today) {
      return NextResponse.json({
        success: false,
        message: "Already claimed today! Come back tomorrow 🔥",
        currentStreak: userData.currentStreak,
        maxStreak: userData.maxStreak,
        totalXP: userData.totalXP
      });
    }

    // Verify Farcaster post
    const requiredHashtag = MISSION_HASHTAGS[missionType as keyof typeof MISSION_HASHTAGS] || "#BasedVibes";
    const postVerified = await verifyFarcasterPost(fid, requiredHashtag);

    if (!postVerified) {
      return NextResponse.json({
        success: false,
        message: `Post with ${requiredHashtag} not found. Please post on Farcaster first!`,
        currentStreak: userData.currentStreak,
        maxStreak: userData.maxStreak,
        totalXP: userData.totalXP
      });
    }

    // Calculate if streak continues
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (userData.lastClaimDate === yesterdayStr || userData.currentStreak === 0) {
      // Streak continues
      userData.currentStreak += 1;
    } else {
      // Streak broken, restart
      userData.currentStreak = 1;
    }

    // Update max streak
    if (userData.currentStreak > userData.maxStreak) {
      userData.maxStreak = userData.currentStreak;
    }

    // Award XP based on mission type
    const missionXP = MISSION_XP[missionType as keyof typeof MISSION_XP] || 10;
    userData.totalXP += missionXP;

    // Check for milestone badges
    const newBadges: string[] = [];
    for (const badge of BADGES) {
      if (userData.currentStreak === badge.days && !userData.badges.includes(badge.name)) {
        userData.badges.push(badge.name);
        newBadges.push(badge.name);
        // Bonus XP for badge
        const bonusXP = badge.days * 2;
        userData.totalXP += bonusXP;
      }
    }

    // Update last claim date
    userData.lastClaimDate = today;

    // Save updated data
    userStreaks.set(fid, userData);

    return NextResponse.json({
      success: true,
      message: newBadges.length > 0 
        ? `Streak claimed! +${missionXP} XP. Badge unlocked: ${newBadges.join(", ")} 🎉`
        : `Streak claimed! +${missionXP} XP 🔥`,
      currentStreak: userData.currentStreak,
      maxStreak: userData.maxStreak,
      totalXP: userData.totalXP,
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

// GET endpoint for fetching user stats
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID required" },
      { status: 400 }
    );
  }

  const userData = userStreaks.get(parseInt(fid));

  if (!userData) {
    return NextResponse.json({
      currentStreak: 0,
      maxStreak: 0,
      totalXP: 0,
      badges: []
    });
  }

  return NextResponse.json(userData);
}