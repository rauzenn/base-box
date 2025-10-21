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
    const body = await request.json();
    console.log('📥 Received data:', body);

    const { fid, message, duration } = body;

    // Validation with detailed logging
    if (!fid) {
      console.error('❌ Missing: fid');
      return NextResponse.json(
        { success: false, message: 'Missing required field: fid' },
        { status: 400 }
      );
    }

    if (!message || message.trim() === '') {
      console.error('❌ Missing: message');
      return NextResponse.json(
        { success: false, message: 'Missing required field: message' },
        { status: 400 }
      );
    }

    if (duration === undefined || duration === null) {
      console.error('❌ Missing: duration');
      return NextResponse.json(
        { success: false, message: 'Missing required field: duration' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed:', { fid, message: message.substring(0, 30), duration });

    // Generate unique capsule ID
    const timestamp = Date.now();
    const capsuleId = `${fid}-${timestamp}`;

    console.log('🆔 Generated capsule ID:', capsuleId);

    // Calculate unlock date
    const createdAt = new Date().toISOString();
    const unlockDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

    // Create capsule object
    const capsule: Capsule = {
      id: capsuleId,
      fid: parseInt(fid),
      message,
      createdAt,
      unlockDate,
      revealed: false
    };

    console.log('📦 Capsule object:', capsule);

    // Save capsule to KV
    await kv.set(`capsule:${capsuleId}`, capsule);
    console.log(`✅ Saved to capsule:${capsuleId}`);

    // CRITICAL: Add capsule ID to user's set
    await kv.sadd(`user:${fid}:capsules`, capsuleId);
    console.log(`✅ Added to user:${fid}:capsules set`);

    // Verify it was added
    const userCapsules = await kv.smembers(`user:${fid}:capsules`);
    console.log(`🔍 Verification: user:${fid}:capsules now has ${userCapsules?.length || 0} capsules`);

    return NextResponse.json({
      success: true,
      capsule,
      message: 'Capsule created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating capsule:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to create capsule' },
      { status: 500 }
    );
  }
}