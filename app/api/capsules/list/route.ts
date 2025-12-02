import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// CRITICAL: Mark as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    console.log('📋 [List API] Request received, FID:', fid);

    if (!fid) {
      console.error('❌ [List API] Missing FID');
      return NextResponse.json(
        { success: false, message: 'FID required' },
        { status: 400 }
      );
    }

    // ✅ FIXED: Get capsule IDs from user's set
    const capsuleIds = await kv.smembers(`user:${fid}:capsules`);
    console.log('📋 [List API] Found capsule IDs:', capsuleIds?.length || 0, 'capsules');

    if (!capsuleIds || capsuleIds.length === 0) {
      console.log('📋 [List API] No capsules for user');
      return NextResponse.json({
        success: true,
        capsules: []
      });
    }

    console.log('📋 [List API] Capsule IDs:', capsuleIds);

    // ✅ FIXED: Get capsules using correct key format
    const capsules = await Promise.all(
      capsuleIds.map(async (capsuleId) => {
        try {
          // Key format: capsule:569760-1733155200000
          const capsule = await kv.get(`capsule:${capsuleId}`);
          
          if (!capsule) {
            console.warn('⚠️ [List API] Capsule not found:', capsuleId);
            return null;
          }
          
          console.log('✅ [List API] Loaded capsule:', capsuleId);
          return capsule;
        } catch (error) {
          console.error('❌ [List API] Error loading capsule:', capsuleId, error);
          return null;
        }
      })
    );

    // Filter out nulls and sort by createdAt
    const validCapsules = capsules
      .filter(c => c !== null)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

    console.log('✅ [List API] Returning', validCapsules.length, 'capsules');

    return NextResponse.json({
      success: true,
      capsules: validCapsules
    });

  } catch (error) {
    console.error('❌ [List API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to list capsules' },
      { status: 500 }
    );
  }
}