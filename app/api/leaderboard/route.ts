import { NextResponse } from 'next/server';
import { getLeaderboard, getUserParticipation } from '@/lib/kv';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId') || 'season_1';
    const limitParam = searchParams.get('limit') || '100';
    const limit = Math.min(parseInt(limitParam), 1000);

    // Get leaderboard from KV
    const leaderboardData = await getLeaderboard(seasonId, limit);

    // Enrich with participation data
    const items = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const participation = await getUserParticipation(entry.fid, seasonId);
        
        return {
          rank: index + 1,
          fid: entry.fid,
          totalXp: entry.xp,
          currentStreak: participation?.currentStreak || 0,
          longestStreak: participation?.longestStreak || 0,
          badges: participation?.badges || []
        };
      })
    );

    return NextResponse.json({
      ok: true,
      seasonId,
      items
    });
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}