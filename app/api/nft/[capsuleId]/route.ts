// app/api/nft/metadata/route.ts
// Basit query param versiyonu: /api/nft/metadata?id=123

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    // Get capsuleId from URL search params
    const { searchParams } = new URL(request.url);
    const capsuleId = searchParams.get('id');

    if (!capsuleId) {
      console.error('❌ [NFT Metadata] Missing capsule ID');
      return NextResponse.json(
        { error: 'Capsule ID is required. Use: /api/nft/metadata?id=YOUR_ID' },
        { status: 400 }
      );
    }

    console.log('🎨 [NFT Metadata] Fetching capsule:', capsuleId);

    // Get capsule data from Vercel KV
    const capsule = await kv.get(`capsule:${capsuleId}`);

    if (!capsule || typeof capsule !== 'object') {
      console.error('❌ [NFT Metadata] Capsule not found:', capsuleId);
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      );
    }

    const capsuleData = capsule as {
      id: string;
      fid: number;
      message: string;
      image?: string;
      createdAt: string;
      unlockDate: string;
      revealed: boolean;
    };

    console.log('✅ [NFT Metadata] Capsule found:', {
      id: capsuleData.id,
      revealed: capsuleData.revealed,
      hasImage: !!capsuleData.image,
    });

    // Calculate duration for rarity
    const createdDate = new Date(capsuleData.createdAt);
    const unlockDate = new Date(capsuleData.unlockDate);
    const durationMs = unlockDate.getTime() - createdDate.getTime();
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

    // Determine rarity based on lock duration
    let rarity = 'Common';
    if (durationDays >= 365) {
      rarity = 'Legendary';
    } else if (durationDays >= 180) {
      rarity = 'Epic';
    } else if (durationDays >= 90) {
      rarity = 'Epic';
    } else if (durationDays >= 30) {
      rarity = 'Rare';
    } else if (durationDays >= 7) {
      rarity = 'Rare';
    }

    // Generate NFT metadata (OpenSea standard)
    const metadata = {
      name: `Base Box Time Capsule #${capsuleId}`,
      description: capsuleData.revealed
        ? `A revealed time capsule from Base Box. Originally locked for ${durationDays} days and preserved onchain forever on Base blockchain.`
        : `A time capsule from Base Box, locked until ${new Date(capsuleData.unlockDate).toLocaleDateString()}. The contents will be revealed onchain when the unlock date arrives.`,
      image: capsuleData.image || `${process.env.NEXT_PUBLIC_APP_URL || 'https://basebox.vercel.app'}/icon.png`,
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://basebox.vercel.app'}/reveals`,
      attributes: [
        {
          trait_type: 'Status',
          value: capsuleData.revealed ? 'Revealed' : 'Locked',
        },
        {
          trait_type: 'Duration',
          value: `${durationDays} days`,
        },
        {
          trait_type: 'Rarity',
          value: rarity,
        },
        {
          trait_type: 'Created',
          display_type: 'date',
          value: Math.floor(createdDate.getTime() / 1000),
        },
        {
          trait_type: 'Unlock Date',
          display_type: 'date',
          value: Math.floor(unlockDate.getTime() / 1000),
        },
        {
          trait_type: 'Network',
          value: 'Base',
        },
        {
          trait_type: 'Creator FID',
          value: capsuleData.fid.toString(),
        },
      ],
      properties: {
        category: 'time-capsule',
        creator: {
          fid: capsuleData.fid,
        },
      },
    };

    console.log('✅ [NFT Metadata] Generated successfully');

    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache 1 hour
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ [NFT Metadata] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}