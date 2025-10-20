import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📥 Create request:', body);
    
    const { fid, message, unlockDate } = body;

    if (!fid || !message || !unlockDate) {
      console.log('❌ Missing fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const capsuleId = `${fid}-${Date.now()}`;
    const capsule = {
      id: capsuleId,
      fid,
      message,
      createdAt: new Date().toISOString(),
      unlockDate,
      revealed: false,
    };

    console.log('💾 Saving capsule:', capsule);

    await kv.set(`capsule:${capsuleId}`, capsule);
    await kv.sadd(`user:${fid}:capsules`, capsuleId);

    console.log('✅ Capsule saved!');

    return NextResponse.json({ success: true, capsule });
  } catch (error: any) {
    console.error('❌ Create error:', error);
    return NextResponse.json({ 
      error: 'Failed to create capsule',
      details: error?.message 
    }, { status: 500 });
  }
}