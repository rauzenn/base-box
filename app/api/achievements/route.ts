import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const ACHIEVEMENTS = [
  {
    id: 'first_capsule',
    title: 'Time Traveler',
    description: 'Lock your first capsule',
    icon: '🎖️',
    reward: 'Early Adopter Badge',
    rarity: 'common',
    max: 1
  },
  {
    id: 'first_reveal',
    title: 'The Unsealer',
    description: 'Reveal your first capsule',
    icon: '🔓',
    reward: 'First Reveal NFT',
    rarity: 'common',
    max: 1
  },
  {
    id: 'capsule_5',
    title: 'Collector',
    description: 'Lock 5 capsules',
    icon: '📦',
    reward: 'Collector Badge',
    rarity: 'rare',
    max: 5
  },
  {
    id: 'pioneer',
    title: 'Pioneer',
    description: 'Join in the first 100 users',
    icon: '🌟',
    reward: 'Founder Badge',
    rarity: 'epic',
    max: 1
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    // Get user's unlocked achievements
    const unlocked = await kv.smembers(`user:${fid}:achievements`) || [];
    
    // Get user stats for progress
    const stats = await kv.get<{ total: number; revealed: number }>(`user:${fid}:stats`) || { total: 0, revealed: 0 };

    // Build achievements with progress
    const achievements = ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: unlocked.includes(ach.id),
      progress: ach.id === 'capsule_5' ? Math.min(stats.total, 5) : (unlocked.includes(ach.id) ? 1 : 0)
    }));

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Achievements error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}