import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

interface AdminStats {
  totalCapsules: number;
  lockedCapsules: number;
  revealedCapsules: number;
  totalUsers: number;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Admin: Fetching capsules...');

    const capsuleKeys = await kv.keys('capsule:*');
    
    console.log(`📦 Found ${capsuleKeys?.length || 0} keys`);

    if (!capsuleKeys || capsuleKeys.length === 0) {
      return NextResponse.json({
        success: true,
        capsules: [],
        stats: {
          totalCapsules: 0,
          lockedCapsules: 0,
          revealedCapsules: 0,
          totalUsers: 0
        }
      });
    }

    const capsules: Capsule[] = [];
    const uniqueFids = new Set<number>();
    
    for (const key of capsuleKeys) {
      const capsule = await kv.get<Capsule>(key);
      if (capsule) {
        capsules.push(capsule);
        uniqueFids.add(capsule.fid);
      }
    }

    const lockedCapsules = capsules.filter(c => !c.revealed).length;
    const revealedCapsules = capsules.filter(c => c.revealed).length;

    const stats: AdminStats = {
      totalCapsules: capsules.length,
      lockedCapsules,
      revealedCapsules,
      totalUsers: uniqueFids.size
    };

    capsules.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log('✅ Loaded:', stats);

    return NextResponse.json({
      success: true,
      capsules,
      stats
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch capsules' },
      { status: 500 }
    );
  }
}