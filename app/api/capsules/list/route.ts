console.log('🟢 LIST ROUTE LOADED');

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export async function GET(request: Request) {
  console.log('🔵 LIST ENDPOINT HIT!');
  
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    console.log('📥 Fetching capsules for FID:', fid);

    // Get user's capsule IDs
    const capsuleIds = await kv.smembers(`user:${fid}:capsules`) || [];
    
    console.log('📦 Found capsule IDs:', capsuleIds);

    if (capsuleIds.length === 0) {
      console.log('ℹ️ No capsules found');
      return NextResponse.json({ capsules: [] });
    }

    // Get all capsule data
    const capsules = await Promise.all(
      capsuleIds.map(async (id) => {
        const capsule = await kv.get<Capsule>(`capsule:${id}`);
        return capsule;
      })
    );

    // Filter out null values and sort by creation date
    const validCapsules = capsules
      .filter((c): c is Capsule => c !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('✅ Returning', validCapsules.length, 'capsules');

    return NextResponse.json({ capsules: validCapsules });
  } catch (error: any) {
    console.error('❌ LIST ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch capsules',
      details: error?.message 
    }, { status: 500 });
  }
}