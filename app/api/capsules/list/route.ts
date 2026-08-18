import { NextResponse } from 'next/server';
import { kv } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// CORS headers for Farcaster iframe
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Handle OPTIONS request (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const rawAddress = searchParams.get('address');
    const address = rawAddress ? rawAddress.toLowerCase() : null;

    console.log('═══════════════════════════════════════');
    console.log('📋 [List API] Request received');
    console.log('📋 [List API] Address:', address);
    console.log('📋 [List API] Time:', new Date().toISOString());
    console.log('═══════════════════════════════════════');

    if (!address) {
      console.error('❌ [List API] Missing address parameter');
      return NextResponse.json(
        { success: false, message: 'Wallet address required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Step 1: Get capsule IDs from user's set
    const userSetKey = `user:${address}:capsules`;
    console.log('📋 [List API] Fetching from:', userSetKey);
    
    const capsuleIds = await kv.smembers(userSetKey);
    console.log('📋 [List API] Raw response:', capsuleIds);
    console.log('📋 [List API] Found', capsuleIds?.length || 0, 'capsule IDs');

    if (!capsuleIds || capsuleIds.length === 0) {
      console.log('📋 [List API] No capsules found - returning empty array');
      console.log('📋 [List API] Request completed in', Date.now() - startTime, 'ms');
      const totalUsers = await kv.scard('all-users').catch(() => 0);
      return NextResponse.json(
        { success: true, capsules: [], totalUsers },
        { headers: corsHeaders }
      );
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

    // GÜVENLİK: unlock tarihi henüz gelmemiş capsule'ların gerçek içeriğini
    // (mesaj, görsel) hiç göndermiyoruz. Öncesinde tam içerik client'a
    // gidiyordu ve "kilitli mi" kararı sadece tarayıcıda veriliyordu — yani
    // biri network sekmesinden ya da cihaz saatini ileri alarak içeriği
    // erken görebiliyordu. Şimdi bu kontrol sunucu saatiyle (Date.now())
    // yapılıyor, client'a hiç güvenilmiyor.
    const now = Date.now();
    const safeCapsules = validCapsules.map((c: any) => {
      const isUnlocked = c.revealed || new Date(c.unlockDate).getTime() <= now;
      if (isUnlocked) return c;

      const { message, image, imageType, ...lockedFields } = c;
      return { ...lockedFields, locked: true };
    });

    console.log('📋 [List API] Valid capsules:', validCapsules.length);
    console.log('📋 [List API] Request completed in', Date.now() - startTime, 'ms');
    console.log('═══════════════════════════════════════');

    // "all-users" seti her başarılı capsule oluşturmada güncelleniyor
    // (bkz. capsules/create/route.ts) — bu yüzden buradaki sayı gerçek,
    // önceden hardcoded "1" idi.
    const totalUsers = await kv.scard('all-users').catch(() => 0);

    return NextResponse.json(
      { success: true, capsules: safeCapsules, totalUsers },
      { headers: corsHeaders }
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
      { status: 500, headers: corsHeaders }
    );
  }
}