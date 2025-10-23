'use client';

import { useEffect, useState } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';
import { createConfetti, createSparkles } from '@/components/animations/effects';

interface AchievementToastProps {
  achievement: {
    title: string;
    icon: string;
    reward: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  } | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      // Show toast
      setIsVisible(true);

      // Trigger celebration effects
      setTimeout(() => {
        createConfetti(achievement.rarity === 'legendary' ? 100 : 60);
        createSparkles(document.body, achievement.rarity === 'legendary' ? 30 : 20);
      }, 300);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!achievement) return null;

  const rarityConfig = {
    common: {
      gradient: 'from-gray-500 to-gray-600',
      glow: 'shadow-gray-500/50',
      border: 'border-gray-500/30'
    },
    rare: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      border: 'border-blue-500/30'
    },
    epic: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      border: 'border-purple-500/30'
    },
    legendary: {
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-500/30'
    }
  };

  const config = rarityConfig[achievement.rarity];

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className={`bg-[#0A0E14]/95 backdrop-blur-xl border-2 ${config.border} rounded-2xl p-6 shadow-2xl ${config.glow} min-w-[320px] max-w-md`}>
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

        {/* Progress indicator */}
        <div className="w-full h-1.5 bg-[#1A1F2E] rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${config.gradient} animate-slide-in`}
            style={{ animation: 'slideIn 5s linear' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
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
            }, i * 6000);
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  return {
    newAchievement,
    checkAchievements,
    clearAchievement: () => setNewAchievement(null)
  };
}