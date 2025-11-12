import { NextResponse } from 'next/server';
import { 
  getUser, 
  getUserCapsules,  // ✅ Doğru fonksiyon adı (listUserCapsules değil)
  getUserAchievements, 
  getUserRank 
} from '@/lib/kv';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Type definition for Capsule
interface Capsule {
  id: string;
  fid: number;
  message: string;
  image?: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

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

    // Get user capsules - ✅ getUserCapsules kullan
    const capsules: Capsule[] = await getUserCapsules(fidNum);
    
    // Get achievements
    const achievements = await getUserAchievements(fidNum);
    
    // Get leaderboard rank
    const rank = await getUserRank(fidNum);

    // Calculate stats
    const totalCapsules = capsules.length;
    const revealedCapsules = capsules.filter((c: Capsule) => c.revealed).length; // ✅ Type eklendi
    const lockedCapsules = totalCapsules - revealedCapsules;
    
    // Find longest lock duration
    let longestDuration = 0;
    capsules.forEach((capsule: Capsule) => { // ✅ Type eklendi
      const duration = new Date(capsule.unlockDate).getTime() - new Date(capsule.createdAt).getTime();
      if (duration > longestDuration) {
        longestDuration = duration;
      }
    });

    return NextResponse.json({
      ok: true,
      user: {
        fid: user.fid,
        joinedAt: user.joinedAt
      },
      stats: {
        totalCapsules,
        lockedCapsules,
        revealedCapsules,
        longestDuration, // milliseconds
        achievementsUnlocked: achievements.length,
        leaderboardRank: rank
      },
      recentCapsules: capsules
        .sort((a: Capsule, b: Capsule) => // ✅ Type eklendi
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5), // Last 5 capsules
      achievements
    });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}