import { NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import { verifyWalletOwnership } from '@/lib/wallet-auth';

export const runtime = 'nodejs';

interface Capsule {
  id: string;
  address: string;
  message: string;
  image?: string;
  imageType?: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔥 [API Create] Received request');
    console.log('🔥 [API Create] Duration:', body.duration, 'days');
    console.log('🔥 [API Create] Has image:', !!body.image);

    const { siweMessage, siweSignature, message, duration, image, imageType } = body;

    // GÜVENLİK: capsule'ın gerçekten bu cüzdanın sahibi tarafından
    // oluşturulduğunu EIP-4361 (SIWE) ile doğruluyoruz. Adres, client'ın
    // ayrıca gönderdiği bir alandan değil, doğrulanmış SIWE mesajının
    // içinden çıkarılıyor — client'ın "ben buyum" dediği adrese değil,
    // imzanın kanıtladığı adrese güveniyoruz.
    const ownership = await verifyWalletOwnership({ siweMessage, siweSignature });
    if (!ownership.valid || !ownership.address) {
      console.error('❌ [API Create] Wallet ownership check failed:', ownership.reason);
      return NextResponse.json(
        { success: false, message: ownership.reason || 'Wallet verification failed' },
        { status: 401 }
      );
    }

    const walletAddress = ownership.address;

    // Validation
    if (!message || message.trim() === '') {
      console.error('❌ [API Create] Missing: message');
      return NextResponse.json(
        { success: false, message: 'Missing required field: message' },
        { status: 400 }
      );
    }

    if (duration === undefined || duration === null) {
      console.error('❌ [API Create] Missing: duration');
      return NextResponse.json(
        { success: false, message: 'Missing required field: duration' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 1000) {
      console.error('❌ [API Create] Message too long:', message.length);
      return NextResponse.json(
        { success: false, message: 'Message must be under 1000 characters' },
        { status: 400 }
      );
    }

    // Validate duration (must be positive)
    if (duration <= 0) {
      console.error('❌ [API Create] Invalid duration:', duration);
      return NextResponse.json(
        { success: false, message: 'Duration must be positive' },
        { status: 400 }
      );
    }

    // Validate image size (5MB limit)
    if (image) {
      const imageSizeInBytes = (image.length * 3) / 4; // Base64 to bytes
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      
      if (imageSizeInBytes > maxSizeInBytes) {
        console.error('❌ [API Create] Image too large:', imageSizeInBytes, 'bytes');
        return NextResponse.json(
          { success: false, message: 'Image size must be under 5MB' },
          { status: 400 }
        );
      }
      
      console.log('✅ [API Create] Image size validated:', (imageSizeInBytes / 1024 / 1024).toFixed(2), 'MB');
    }

    console.log('✅ [API Create] Validation passed');

    // Generate unique capsule ID
    const timestampNow = Date.now();
    const capsuleId = `${walletAddress}-${timestampNow}`;

    console.log('🆔 [API Create] Generated capsule ID:', capsuleId);

    // Calculate dates
    const createdAt = new Date().toISOString();
    const unlockDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

    console.log('📅 [API Create] Created at:', createdAt);
    console.log('📅 [API Create] Unlock date:', unlockDate);

    // Create capsule object
    const capsule: Capsule = {
      id: capsuleId,
      address: walletAddress,
      message: message.trim(),
      createdAt,
      unlockDate,
      revealed: false
    };

    // Add image if provided
    if (image) {
      capsule.image = image;
      capsule.imageType = imageType || 'image/jpeg'; // Default to jpeg if not provided
      console.log('📸 [API Create] Image attached:', capsule.imageType);
    }

    console.log('📦 [API Create] Capsule object created');

    // Save capsule to KV
    try {
      await kv.set(`capsule:${capsuleId}`, capsule);
      console.log(`✅ [API Create] Saved to capsule:${capsuleId}`);
    } catch (error) {
      console.error('❌ [API Create] KV set failed:', error);
      throw new Error('Failed to save capsule to database');
    }

    // Add capsule ID to user's set
    try {
      await kv.sadd(`user:${walletAddress}:capsules`, capsuleId);
      // Gerçek "toplam kullanıcı" sayısı için (bkz. /api/capsules/list) —
      // aynı adres birden çok capsule oluştursa bile set'te bir kez sayılır.
      await kv.sadd('all-users', walletAddress);
      console.log(`✅ [API Create] Added to user:${walletAddress}:capsules set`);
    } catch (error) {
      console.error('❌ [API Create] KV sadd failed:', error);
      // Try to clean up the capsule we just created
      await kv.del(`capsule:${capsuleId}`);
      throw new Error('Failed to link capsule to user');
    }

    // Verify it was added
    const userCapsules = await kv.smembers(`user:${walletAddress}:capsules`);
    console.log(`🔍 [API Create] Verification: user:${walletAddress}:capsules now has ${userCapsules?.length || 0} capsules`);

    console.log('✅ [API Create] Capsule created successfully!');

    return NextResponse.json({
      success: true,
      capsule: {
        id: capsule.id,
        address: capsule.address,
        message: capsule.message,
        createdAt: capsule.createdAt,
        unlockDate: capsule.unlockDate,
        revealed: capsule.revealed,
        // Don't send full image data back, just confirmation
        hasImage: !!capsule.image,
      },
      message: 'Capsule created successfully'
    });

  } catch (error: any) {
    console.error('❌ [API Create] Error:', error);
    console.error('❌ [API Create] Stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create capsule',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}