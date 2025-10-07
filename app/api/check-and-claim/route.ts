import { NextResponse } from 'next/server';
import {
  hasClaimed,
  markDayClaimed,
  getUserParticipation,
  createParticipation,
  updateUserStreak,
  addToLeaderboard,
  grantBadge
} from '@/lib/kv';
import { getCurrentDayIndex } from '@/lib/season';
import { verifyDailyCast } from '@/lib/farcaster';

export const dynamic = 'force-dynamic';

const BADGE_MILESTONES = [7, 14, 21, 30];
const BASE_POINTS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, seasonId = 'season_1' } = body;

    if (!fid) {
      return NextResponse.json(
        { ok: false, error: 'Missing fid' },
        { status: 400 }
      );
    }

    const fidNum = parseInt(fid);
    const dayIdx = getCurrentDayIndex(seasonId);

    // Check if already claimed today
    const alreadyClaimed = await hasClaimed(fidNum, seasonId, dayIdx);
    if (alreadyClaimed) {
      return NextResponse.json({
        ok: false,
        error: 'Already claimed today'
      });
    }

    // Verify cast with #gmBase
    const castVerification = await verifyDailyCast(fidNum, seasonId, dayIdx);
    
    if (!castVerification.ok) {
      return NextResponse.json({
        ok: false,
        error: castVerification.error || 'No qualifying cast found'
      });
    }

    // Get or create participation
    let participation = await getUserParticipation(fidNum, seasonId);
    
    if (!participation) {
      participation = {
        seasonId,
        fid: fidNum,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        firstSuccessDayIdx: dayIdx,
        lastClaimedDayIdx: null,
        badges: []
      };
      await createParticipation(participation);
    }

    // Check if streak should continue or reset
    const lastDay = participation.lastClaimedDayIdx;
    let newStreak = participation.currentStreak;
    
    if (lastDay === null) {
      // First claim ever
      newStreak = 1;
    } else if (dayIdx === lastDay + 1) {
      // Consecutive day
      newStreak = participation.currentStreak + 1;
    } else if (dayIdx > lastDay + 1) {
      // Streak broken, reset
      newStreak = 1;
    }

    const newTotalXp = participation.totalXp + BASE_POINTS;
    const newLongestStreak = Math.max(newStreak, participation.longestStreak);

    // Mark day as claimed
    await markDayClaimed(fidNum, seasonId, dayIdx, castVerification.castHash!);

    // Update participation
    await updateUserStreak(fidNum, seasonId, {
      totalXp: newTotalXp,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastClaimedDayIdx: dayIdx
    });

    // Update leaderboard
    await addToLeaderboard(seasonId, fidNum, newTotalXp);

    // Check for badge milestones
    const grantedBadges: number[] = [];
    for (const milestone of BADGE_MILESTONES) {
      if (
        newStreak === milestone &&
        !participation.badges.includes(milestone)
      ) {
        await grantBadge(fidNum, seasonId, milestone);
        grantedBadges.push(milestone);
      }
    }

    return NextResponse.json({
      ok: true,
      points: BASE_POINTS,
      currentStreak: newStreak,
      totalXp: newTotalXp,
      grantedBadges,
      message: `Day ${newStreak} streak! Keep going! 🔥`
    });
  } catch (error) {
    console.error('POST /api/check-and-claim error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}