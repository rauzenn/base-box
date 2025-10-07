import { NextResponse } from 'next/server';
import { getUser, getUserParticipation, getUserRank } from '@/lib/kv';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const seasonId = searchParams.get('seasonId') || 'season_1';

    if (!fid) {
      return NextResponse.json(
        { ok: false, error: 'Missing fid parameter' },
        { status: 400 }
      );
    }

    const fidNum = parseInt(fid);
    
    // Get user data
    const user = await getUser(fidNum);
    
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get participation data
    const participation = await getUserParticipation(fidNum, seasonId);
    
    // Get rank
    const rank = await getUserRank(seasonId, fidNum);

    return NextResponse.json({
      ok: true,
      user: {
        fid: user.fid,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        walletAddress: user.walletAddress
      },
      currentSeason: {
        id: seasonId,
        totalXp: participation?.totalXp || 0,
        currentStreak: participation?.currentStreak || 0,
        longestStreak: participation?.longestStreak || 0,
        badges: participation?.badges || [],
        rank: rank || null
      }
    });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}