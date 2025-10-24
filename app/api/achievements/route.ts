import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Achievement definitions
const ACHIEVEMENTS = [
  // Milestone Achievements
  {
    id: 'first_capsule',
    title: 'Time Traveler',
    description: 'Lock your first capsule',
    icon: '🎖️',
    reward: 'Early Adopter Badge',
    rarity: 'common' as const,
    max: 1,
    checkCondition: (stats: any) => stats.totalCapsules >= 1
  },
  {
    id: 'capsule_5',
    title: 'Collector',
    description: 'Lock 5 capsules',
    icon: '⭐',
    reward: 'Collector Badge',
    rarity: 'rare' as const,
    max: 5,
    checkCondition: (stats: any) => stats.totalCapsules >= 5
  },
  {
    id: 'capsule_10',
    title: 'Time Master',
    description: 'Lock 10 capsules',
    icon: '👑',
    reward: 'Master Badge',
    rarity: 'epic' as const,
    max: 10,
    checkCondition: (stats: any) => stats.totalCapsules >= 10
  },
  {
    id: 'capsule_25',
    title: 'Legend',
    description: 'Lock 25 capsules',
    icon: '💎',
    reward: 'Legend Status',
    rarity: 'legendary' as const,
    max: 25,
    checkCondition: (stats: any) => stats.totalCapsules >= 25
  },
  
  // Reveal Achievements
  {
    id: 'first_reveal',
    title: 'The Unsealer',
    description: 'Reveal your first capsule',
    icon: '🔓',
    reward: 'First Reveal Badge',
    rarity: 'common' as const,
    max: 1,
    checkCondition: (stats: any) => stats.revealedCapsules >= 1
  },
  {
    id: 'reveal_5',
    title: 'Memory Keeper',
    description: 'Reveal 5 capsules',
    icon: '📖',
    reward: 'Keeper Badge',
    rarity: 'rare' as const,
    max: 5,
    checkCondition: (stats: any) => stats.revealedCapsules >= 5
  },
  
  // Time-Based Achievements
  {
    id: 'patient_one',
    title: 'Patient One',
    description: 'Lock a capsule for 365 days',
    icon: '⏳',
    reward: 'Patience Badge',
    rarity: 'epic' as const,
    max: 1,
    checkCondition: (stats: any) => stats.longestDuration >= 365
  },
  {
    id: 'long_term',
    title: 'Long-Term Thinker',
    description: 'Lock a capsule for 180+ days',
    icon: '🌟',
    reward: 'Thinker Badge',
    rarity: 'rare' as const,
    max: 1,
    checkCondition: (stats: any) => stats.longestDuration >= 180
  },
  
  // Special Achievements
  {
    id: 'pioneer',
    title: 'Pioneer',
    description: 'Join in the first 100 users',
    icon: '🚀',
    reward: 'Founder Badge',
    rarity: 'legendary' as const,
    max: 1,
    checkCondition: (stats: any) => stats.userId <= 100
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Create capsule in first month',
    icon: '🌱',
    reward: 'OG Badge',
    rarity: 'epic' as const,
    max: 1,
    checkCondition: (stats: any) => stats.joinedEarly === true
  }
];

// GET - Fetch user achievements
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    // Get user's unlocked achievements
    const unlockedSet = await kv.smembers(`user:${fid}:achievements`);
    const unlocked = Array.isArray(unlockedSet) ? unlockedSet : [];
    
    // Get user's claimed achievements
    const claimedSet = await kv.smembers(`user:${fid}:achievements:claimed`);
    const claimed = Array.isArray(claimedSet) ? claimedSet : [];
    
    // Get user stats
    const capsules = await kv.smembers(`user:${fid}:capsules`);
    const capsuleCount = Array.isArray(capsules) ? capsules.length : 0;

    let revealedCount = 0;
    let longestDuration = 0;

    // Calculate stats from capsules
    if (capsuleCount > 0) {
      for (const capsuleId of capsules) {
        const capsule = await kv.get<any>(`capsule:${capsuleId}`);
        if (capsule) {
          if (capsule.revealed || new Date(capsule.unlockDate) <= new Date()) {
            revealedCount++;
          }
          
          const created = new Date(capsule.createdAt);
          const unlock = new Date(capsule.unlockDate);
          const durationDays = Math.floor((unlock.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (durationDays > longestDuration) {
            longestDuration = durationDays;
          }
        }
      }
    }

    const stats = {
      totalCapsules: capsuleCount,
      revealedCapsules: revealedCount,
      longestDuration,
      userId: parseInt(fid),
      joinedEarly: true
    };

    // Build achievements with progress and claim status
    const achievements = ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      const isClaimed = claimed.includes(ach.id);
      let progress = 0;

      if (!isUnlocked) {
        if (ach.id.startsWith('capsule_')) {
          progress = Math.min(stats.totalCapsules, ach.max);
        } else if (ach.id.startsWith('reveal_')) {
          progress = Math.min(stats.revealedCapsules, ach.max);
        } else if (ach.checkCondition(stats)) {
          progress = ach.max;
        }
      } else {
        progress = ach.max;
      }

      return {
        ...ach,
        unlocked: isUnlocked,
        claimed: isClaimed,
        progress
      };
    });

    // Count unclaimed achievements
    const unclaimedCount = achievements.filter(a => a.unlocked && !a.claimed).length;

    return NextResponse.json({ 
      success: true,
      achievements,
      stats,
      unclaimedCount
    });
  } catch (error) {
    console.error('❌ Achievements GET error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch achievements' 
    }, { status: 500 });
  }
}

// POST - Check and unlock achievements
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, action } = body;

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    // Handle claim action
    if (action === 'claim') {
      const { achievementId } = body;
      
      if (!achievementId) {
        return NextResponse.json({ error: 'Achievement ID required' }, { status: 400 });
      }

      // Check if achievement is unlocked
      const unlocked = await kv.smembers(`user:${fid}:achievements`);
      if (!Array.isArray(unlocked) || !unlocked.includes(achievementId)) {
        return NextResponse.json({ 
          success: false,
          error: 'Achievement not unlocked' 
        }, { status: 400 });
      }

      // Check if already claimed
      const claimed = await kv.smembers(`user:${fid}:achievements:claimed`);
      if (Array.isArray(claimed) && claimed.includes(achievementId)) {
        return NextResponse.json({ 
          success: false,
          error: 'Achievement already claimed' 
        }, { status: 400 });
      }

      // Claim achievement
      await kv.sadd(`user:${fid}:achievements:claimed`, achievementId);
      
      // Get achievement details
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);

      console.log(`🎁 Achievement claimed: ${achievement?.title} by FID ${fid}`);

      return NextResponse.json({ 
        success: true,
        claimed: true,
        achievement: achievement ? {
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          reward: achievement.reward,
          rarity: achievement.rarity
        } : null
      });
    }

    // Default: Check achievements
    console.log('🏆 Checking achievements for FID:', fid);

    const unlockedSet = await kv.smembers(`user:${fid}:achievements`);
    const unlocked = Array.isArray(unlockedSet) ? unlockedSet : [];

    const capsules = await kv.smembers(`user:${fid}:capsules`);
    const capsuleCount = Array.isArray(capsules) ? capsules.length : 0;

    let revealedCount = 0;
    let longestDuration = 0;

    if (capsuleCount > 0) {
      for (const capsuleId of capsules) {
        const capsule = await kv.get<any>(`capsule:${capsuleId}`);
        if (capsule) {
          if (capsule.revealed || new Date(capsule.unlockDate) <= new Date()) {
            revealedCount++;
          }
          
          const created = new Date(capsule.createdAt);
          const unlock = new Date(capsule.unlockDate);
          const durationDays = Math.floor((unlock.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (durationDays > longestDuration) {
            longestDuration = durationDays;
          }
        }
      }
    }

    const stats = {
      totalCapsules: capsuleCount,
      revealedCapsules: revealedCount,
      longestDuration,
      userId: parseInt(fid),
      joinedEarly: true
    };

    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlocked.includes(achievement.id)) {
        continue;
      }

      if (achievement.checkCondition(stats)) {
        await kv.sadd(`user:${fid}:achievements`, achievement.id);
        newlyUnlocked.push({
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          reward: achievement.reward,
          rarity: achievement.rarity
        });
        console.log(`🎉 Unlocked achievement: ${achievement.title} for FID ${fid}`);
      }
    }

    return NextResponse.json({ 
      success: true,
      newlyUnlocked,
      totalUnlocked: unlocked.length + newlyUnlocked.length
    });
  } catch (error) {
    console.error('❌ Achievement error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process achievements' 
    }, { status: 500 });
  }
}