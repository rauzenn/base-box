import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // Get top users from leaderboard (sorted set, highest score first)
    const topFids = await kv.zrange("leaderboard:global", 0, limit - 1, {
      rev: true, // Reverse order (highest first)
      withScores: true
    });

    // topFids format: [fid, score, fid, score, ...]
    const leaderboard = [];
    
    for (let i = 0; i < topFids.length; i += 2) {
      const fid = topFids[i] as string;
      const totalXP = topFids[i + 1] as number;
      
      // Fetch user details
      const userData = await kv.hgetall(`user:${fid}`);
      
      if (userData) {
        leaderboard.push({
          rank: Math.floor(i / 2) + 1,
          fid: parseInt(fid),
          totalXP,
          currentStreak: parseInt(userData.currentStreak as string) || 0,
          maxStreak: parseInt(userData.maxStreak as string) || 0,
          badges: userData.badges 
            ? (typeof userData.badges === 'string' ? JSON.parse(userData.badges as string) : userData.badges)
            : []
        });
      }
    }

    return NextResponse.json({
      success: true,
      leaderboard,
      total: leaderboard.length
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}