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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { capsuleId } = await request.json();

    if (!capsuleId) {
      return NextResponse.json(
        { success: false, message: 'Capsule ID required' },
        { status: 400 }
      );
    }

    const capsule = await kv.get<Capsule>(`capsule:${capsuleId}`);
    
    if (!capsule) {
      return NextResponse.json(
        { success: false, message: 'Capsule not found' },
        { status: 404 }
      );
    }

    if (capsule.revealed) {
      return NextResponse.json(
        { success: false, message: 'Already revealed' },
        { status: 400 }
      );
    }

    const updatedCapsule: Capsule = {
      ...capsule,
      revealed: true
    };

    await kv.set(`capsule:${capsuleId}`, updatedCapsule);

    console.log(`✅ Revealed: ${capsuleId}`);

    return NextResponse.json({
      success: true,
      message: 'Capsule revealed successfully',
      capsule: updatedCapsule
    });

  } catch (error) {
    console.error('❌ Reveal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reveal capsule' },
      { status: 500 }
    );
  }
}