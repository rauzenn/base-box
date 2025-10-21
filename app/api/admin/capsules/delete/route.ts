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

    await kv.del(`capsule:${capsuleId}`);
    await kv.srem(`user:${capsule.fid}:capsules`, capsuleId);

    console.log(`✅ Deleted: ${capsuleId}`);

    return NextResponse.json({
      success: true,
      message: 'Capsule deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete capsule' },
      { status: 500 }
    );
  }
}