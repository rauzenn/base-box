import { NextRequest, NextResponse } from "next/server";

// This will be imported from the same in-memory store
// For now, we'll simulate it
// TODO: Share state with check-and-claim API or use KV

interface LeaderboardEntry {
  fid: number;
  username: string;
  totalXP: number;
  currentStreak: number;
  badges: string[];
}

// Mock data for now - will be replaced with real data from KV
const mockLeaderboard: LeaderboardEntry[] = [
  { fid: 123456, username: "0xbee.eth", totalXP: 520, currentStreak: 30, badges: ["Crown"] },
  { fid: 234567, username: "han.base", totalXP: 500, currentStreak: 28, badges: ["Diamond"] },
  { fid: 345678, username: "basedguy", totalXP: 485, currentStreak: 25, badges: ["Diamond"] },
  { fid: 456789, username: "bluebuild", totalXP: 470, currentStreak: 22, badges: ["Bee"] },
  { fid: 567890, username: "seedling", totalXP: 450, currentStreak: 20, badges: ["Bee"] }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  // TODO: Fetch from KV and sort by totalXP
  // For now, return mock data sorted by XP
  const leaderboard = [...mockLeaderboard]
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, limit)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

  return NextResponse.json({
    leaderboard,
    season: 1,
    totalUsers: mockLeaderboard.length
  });
}