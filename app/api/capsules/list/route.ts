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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fidParam = searchParams.get('fid');

    console.log('🔍 List API called with FID:', fidParam);

    if (!fidParam) {
      console.error('❌ No FID provided');
      return NextResponse.json(
        { success: false, message: 'FID is required' },
        { status: 400 }
      );
    }

    const fid = parseInt(fidParam);
    console.log('📦 Parsed FID:', fid, 'Type:', typeof fid);

    // Get user's capsule IDs from set
    const capsuleIds = await kv.smembers(`user:${fid}:capsules`);
    console.log(`📋 Found ${capsuleIds?.length || 0} capsule IDs for user:${fid}:capsules`);
    console.log('🔑 Capsule IDs:', capsuleIds);

    if (!capsuleIds || capsuleIds.length === 0) {
      console.log('⚠️ No capsules found for this FID');
      return NextResponse.json({
        success: true,
        capsules: []
      });
    }

    // Fetch all capsules
    const capsules: Capsule[] = [];
    
    for (const capsuleId of capsuleIds) {
      console.log(`🔍 Fetching capsule:${capsuleId}`);
      const capsule = await kv.get<Capsule>(`capsule:${capsuleId}`);
      
      if (capsule) {
        console.log(`✅ Found capsule:`, capsule);
        capsules.push(capsule);
      } else {
        console.log(`❌ Capsule not found: capsule:${capsuleId}`);
      }
    }

    // Sort by creation date (newest first)
    capsules.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`✅ Returning ${capsules.length} capsules`);

    return NextResponse.json({
      success: true,
      capsules
    });

  } catch (error) {
    console.error('❌ Error listing capsules:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch capsules' },
      { status: 500 }
    );
  }
}