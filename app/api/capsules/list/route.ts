import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    console.log('═══════════════════════════════════════');
    console.log('📋 [List API] Request received');
    console.log('📋 [List API] FID:', fid);
    console.log('📋 [List API] Time:', new Date().toISOString());
    console.log('═══════════════════════════════════════');

    if (!fid) {
      console.error('❌ [List API] Missing FID parameter');
      return NextResponse.json(
        { success: false, message: 'FID required' },
        { status: 400 }
      );
    }

    // Step 1: Get capsule IDs from user's set
    const userSetKey = `user:${fid}:capsules`;
    console.log('📋 [List API] Fetching from:', userSetKey);
    
    const capsuleIds = await kv.smembers(userSetKey);
    console.log('📋 [List API] Raw response:', capsuleIds);
    console.log('📋 [List API] Found', capsuleIds?.length || 0, 'capsule IDs');

    if (!capsuleIds || capsuleIds.length === 0) {
      console.log('📋 [List API] No capsules found - returning empty array');
      console.log('📋 [List API] Request completed in', Date.now() - startTime, 'ms');
      return NextResponse.json({
        success: true,
        capsules: []
      });
    }

    // Step 2: Log all IDs
    console.log('📋 [List API] Capsule IDs to fetch:');
    capsuleIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    // Step 3: Fetch all capsules
    console.log('📋 [List API] Fetching capsule data...');
    const capsulePromises = capsuleIds.map(async (capsuleId) => {
      try {
        const key = `capsule:${capsuleId}`;
        console.log('   Fetching:', key);
        
        const capsule = await kv.get(key);
        
        if (!capsule) {
          console.warn('   ⚠️ Not found:', key);
          return null;
        }
        
        console.log('   ✅ Loaded:', key);
        return capsule;
      } catch (error) {
        console.error('   ❌ Error loading:', capsuleId, error);
        return null;
      }
    });

    const capsules = await Promise.all(capsulePromises);
    console.log('📋 [List API] Loaded', capsules.filter(c => c !== null).length, 'capsules');

    // Step 4: Filter nulls and sort
    const validCapsules = capsules
      .filter(c => c !== null)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

    console.log('📋 [List API] Valid capsules:', validCapsules.length);
    console.log('📋 [List API] Request completed in', Date.now() - startTime, 'ms');
    console.log('═══════════════════════════════════════');

    return NextResponse.json(
      {
        success: true,
        capsules: validCapsules
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );

  } catch (error: any) {
    console.error('═══════════════════════════════════════');
    console.error('❌ [List API] Fatal error:', error);
    console.error('❌ [List API] Stack:', error.stack);
    console.error('═══════════════════════════════════════');
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list capsules',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}