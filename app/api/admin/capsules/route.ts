import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// CRITICAL: Mark as dynamic to use request.headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Simple token validation
    if (!token || token.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all capsule keys
    const keys = await kv.keys('capsule:*');
    
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

    // Filter out null values and sort by timestamp
    const validCapsules = capsules
      .filter(c => c !== null)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    return NextResponse.json({
      success: true,
      capsules: validCapsules,
      total: validCapsules.length
    });

  } catch (error) {
    console.error('❌ Error listing capsules:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to list capsules' },
      { status: 500 }
    );
  }
}