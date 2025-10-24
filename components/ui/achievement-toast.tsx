'use client';

import { useEffect, useState } from 'react';
import { Trophy, X, Sparkles, Gift } from 'lucide-react';
import { createConfetti, createSparkles } from '@/components/animations/effects';

interface AchievementToastProps {
  achievement: {
    id: string;
    title: string;
    icon: string;
    reward: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  } | null;
  onClose: () => void;
  onClaim?: (achievementId: string) => void;
}

export function AchievementToast({ achievement, onClose, onClaim }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      // Trigger celebration effects
      setTimeout(() => {
        createConfetti(achievement.rarity === 'legendary' ? 100 : 60);
        createSparkles(document.body, achievement.rarity === 'legendary' ? 30 : 20);
      }, 300);

      // No auto-close - user must claim or close manually
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleClaim = async () => {
    if (!achievement || !onClaim || isClaiming) return;
    
    setIsClaiming(true);
    
    // Extra celebration for claim!
    createConfetti(80);
    createSparkles(document.body, 30);
    
    await onClaim(achievement.id);
    
    // Close after claim
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  if (!achievement) return null;

  const rarityConfig = {
    common: {
      gradient: 'from-gray-500 to-gray-600',
      glow: 'shadow-gray-500/50',
      border: 'border-gray-500/30',
      buttonGradient: 'from-gray-500 to-gray-600'
    },
    rare: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      border: 'border-blue-500/30',
      buttonGradient: 'from-blue-500 to-cyan-500'
    },
    epic: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      border: 'border-purple-500/30',
      buttonGradient: 'from-purple-500 to-pink-500'
    },
    legendary: {
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-500/30',
      buttonGradient: 'from-yellow-500 to-orange-500'
    }
  };

  const config = rarityConfig[achievement.rarity];

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className={`bg-[#0A0E14]/95 backdrop-blur-xl border-2 ${config.border} rounded-2xl p-6 shadow-2xl ${config.glow} min-w-[340px] max-w-md`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center pulse`}>
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">Achievement Unlocked!</h3>
              <p className="text-xs text-gray-400 font-medium capitalize">{achievement.rarity} Achievement</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} bg-opacity-20 border-2 ${config.border} rounded-xl flex items-center justify-center`}>
            <span className="text-4xl animate-bounce">{achievement.icon}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-black text-xl mb-1">{achievement.title}</h4>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className={`w-4 h-4 ${achievement.rarity === 'legendary' ? 'text-yellow-400' : 'text-blue-400'}`} />
              <span className="text-gray-400 font-medium">{achievement.reward}</span>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        {onClaim && (
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className={`w-full py-4 bg-gradient-to-r ${config.buttonGradient} rounded-xl font-black text-white shadow-lg hover:shadow-xl transition-all btn-lift relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isClaiming ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Claiming...</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>Claim Reward</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        <p className="text-center text-xs text-gray-500 font-medium mt-3">
          {onClaim ? 'Click to claim your reward!' : 'Achievement automatically unlocked'}
        </p>
      </div>
    </div>
  );
}

// Achievement Manager Hook
export function useAchievements(fid: number) {
  const [newAchievement, setNewAchievement] = useState<any>(null);

  const checkAchievements = async () => {
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid })
      });

      const data = await response.json();

      if (data.success && data.newlyUnlocked.length > 0) {
        // Show first unlocked achievement
        setNewAchievement(data.newlyUnlocked[0]);
        
        // If multiple achievements, show them one by one
        if (data.newlyUnlocked.length > 1) {
          for (let i = 1; i < data.newlyUnlocked.length; i++) {
            setTimeout(() => {
              setNewAchievement(data.newlyUnlocked[i]);
            }, i * 8000); // 8s delay between multiple achievements
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const claimAchievement = async (achievementId: string) => {
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fid, 
          action: 'claim',
          achievementId 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('🎁 Achievement claimed:', achievementId);
      }

      return data;
    } catch (error) {
      console.error('Failed to claim achievement:', error);
    }
  };

  return {
    newAchievement,
    checkAchievements,
    claimAchievement,
    clearAchievement: () => setNewAchievement(null)
  };
}