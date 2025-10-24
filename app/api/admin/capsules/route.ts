import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Admin: Fetching all capsules');

    // Get all capsule keys
    const keys = await kv.keys('capsule:*');
    console.log(`Found ${keys.length} capsule keys`);

    // Fetch all capsules
    const capsules = [];
    for (const key of keys) {
      const capsule = await kv.get(key);
      if (capsule) {
        capsules.push(capsule);
      }
    }

    // Sort by creation date (newest first)
    capsules.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`✅ Returning ${capsules.length} capsules`);

    return NextResponse.json({
      success: true,
      capsules,
      count: capsules.length
    });

  } catch (error) {
    console.error('❌ Admin capsules error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch capsules',
      capsules: []
    }, { status: 500 });
  }
}