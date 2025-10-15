import { NextRequest, NextResponse } from "next/server";

// This should import from shared storage
// For now, we'll make a simple endpoint that calls other APIs

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID required" },
      { status: 400 }
    );
  }

  try {
    // Fetch user streak data
    const streakResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/check-and-claim?fid=${fid}`,
      { method: "GET" }
    );
    const streakData = await streakResponse.json();

    // Fetch referral data
    const referralResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/referral?fid=${fid}`,
      { method: "GET" }
    );
    const referralData = await referralResponse.json();

    return NextResponse.json({
      ...streakData,
      referral: referralData
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    
    // Fallback to basic data
    return NextResponse.json({
      currentStreak: 0,
      maxStreak: 0,
      totalXP: 0,
      badges: [],
      referral: {
        code: null,
        totalReferrals: 0,
        totalRewards: 0
      }
    });
  }
}