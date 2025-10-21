console.log('🟢 CREATE ROUTE LOADED');

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('🔵 CREATE ENDPOINT HIT!');
  
  try {
    const body = await request.json();
    console.log('📥 Received:', JSON.stringify(body));
    
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

    console.log('💾 Saving capsule:', capsuleId);

    await kv.set(`capsule:${capsuleId}`, capsule);
    await kv.sadd(`user:${fid}:capsules`, capsuleId);

    console.log('✅ SUCCESS! Capsule saved');

    return NextResponse.json({ success: true, capsule });
  } catch (error: any) {
    console.error('❌ CREATE ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to create capsule',
      details: error?.message 
    }, { status: 500 });
  }
}