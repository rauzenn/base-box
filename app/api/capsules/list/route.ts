import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// CRITICAL: Mark as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { success: false, message: 'FID required' },
        { status: 400 }
      );
    }

    // Get all capsule keys for this user
    const pattern = `capsule:${fid}:*`;
    const keys = await kv.keys(pattern);

    if (!keys || keys.length === 0) {
      return NextResponse.json({
        success: true,
        capsules: []
      });
    }

    // Get all capsules
    const capsules = await Promise.all(
      keys.map(async (key) => {
        const capsule = await kv.get(key);
        return capsule;
      })
    );

    // Filter and sort
    const validCapsules = capsules
      .filter(c => c !== null)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    return NextResponse.json({
      success: true,
      capsules: validCapsules
    });

  } catch (error) {
    console.error('❌ Error listing capsules:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to list capsules' },
      { status: 500 }
    );
  }
}