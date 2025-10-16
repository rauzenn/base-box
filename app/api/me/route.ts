import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json(
        { error: "FID required" },
        { status: 400 }
      );
    }

    // Fetch user data from KV
    const userData = await kv.hgetall(`user:${fid}`);

    if (!userData || Object.keys(userData).length === 0) {
      // Return default values for new users
      return NextResponse.json({
        currentStreak: 0,
        maxStreak: 0,
        totalXP: 0,
        badges: [],
        lastClaimDate: null
      });
    }

    // Parse badges array (stored as JSON string)
    const badges = userData.badges 
      ? (typeof userData.badges === 'string' ? JSON.parse(userData.badges as string) : userData.badges)
      : [];

    return NextResponse.json({
      currentStreak: parseInt(userData.currentStreak as string) || 0,
      maxStreak: parseInt(userData.maxStreak as string) || 0,
      totalXP: parseInt(userData.totalXP as string) || 0,
      badges,
      lastClaimDate: userData.lastClaimDate || null
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}