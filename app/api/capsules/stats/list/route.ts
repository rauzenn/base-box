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
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    console.log('Fetching capsules for FID:', fid);

    const capsuleIds = await kv.smembers(`user:${fid}:capsules`) || [];
    
    console.log('Capsule IDs:', capsuleIds);

    if (capsuleIds.length === 0) {
      return NextResponse.json({ capsules: [] });
    }

    const capsules = await Promise.all(
      capsuleIds.map(async (id) => {
        const capsule = await kv.get<Capsule>(`capsule:${id}`);
        return capsule;
      })
    );

    const validCapsules = capsules
      .filter((c): c is Capsule => c !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('Valid capsules:', validCapsules.length);

    return NextResponse.json({ capsules: validCapsules });
  } catch (error: any) {
    console.error('List capsules error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch capsules',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}