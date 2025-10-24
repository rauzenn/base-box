'use client';

import React, { useState } from 'react';
import { Gift, Lock, Check, Sparkles } from 'lucide-react';
import { createSparkles, createConfetti } from '@/components/animations/effects';

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
  progress: number;
  max: number;
  onClaim?: (achievementId: string) => Promise<void>;
}

export function AchievementCard({ 
  id,
  title, 
  description, 
  icon, 
  reward, 
  rarity, 
  unlocked, 
  claimed,
  progress, 
  max,
  onClaim
}: AchievementCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);

  const rarityConfig = {
    common: {
      border: 'border-gray-600/30',
      glow: 'hover:border-gray-500',
      gradient: 'from-gray-500 to-gray-600',
      label: 'Common',
      labelColor: 'text-gray-400',
      buttonGradient: 'from-gray-500 to-gray-600'
    },
    rare: {
      border: 'border-blue-600/30',
      glow: 'hover:border-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      label: 'Rare',
      labelColor: 'text-blue-400',
      buttonGradient: 'from-blue-500 to-cyan-500'
    },
    epic: {
      border: 'border-purple-600/30',
      glow: 'hover:border-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      label: 'Epic',
      labelColor: 'text-purple-400',
      buttonGradient: 'from-purple-500 to-pink-500'
    },
    legendary: {
      border: 'border-yellow-600/30',
      glow: 'hover:border-yellow-500',
      gradient: 'from-yellow-500 to-orange-500',
      label: 'Legendary',
      labelColor: 'text-yellow-400',
      buttonGradient: 'from-yellow-500 to-orange-500'
    }
  };

  const config = rarityConfig[rarity];
  const progressPercent = (progress / max) * 100;
  const isComplete = progress >= max;

  const handleClaim = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClaim || isClaiming) return;
    
    // Celebration effects
    createSparkles(e.currentTarget as HTMLElement, 20);
    createConfetti(60);
    
    setIsClaiming(true);
    
    try {
      await onClaim(id);
    } catch (error) {
      console.error('Failed to claim:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div 
      className={`bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 transition-all card-hover relative overflow-hidden ${
        unlocked 
          ? claimed
            ? 'border-green-500/30 shadow-lg shadow-green-500/10'
            : 'border-yellow-500/30 shadow-lg shadow-yellow-500/10 pulse'
          : config.border + ' ' + config.glow
      }`}
    >
      {/* Glow effect for unclaimed */}
      {unlocked && !claimed && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 animate-pulse" />
      )}

      {/* Rarity Badge */}
      <div className="relative flex items-center justify-between mb-4">
        <div className={`px-3 py-1 bg-[#1A1F2E] border border-${rarity === 'common' ? 'gray' : rarity}-600/30 rounded-full`}>
          <span className={`text-xs font-bold ${config.labelColor}`}>
            {config.label}
          </span>
        </div>
        
        {unlocked && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            claimed 
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30 animate-pulse'
          }`}>
            {claimed ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-bold text-green-400">Claimed</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">Ready!</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Icon */}
      <div className="relative text-center mb-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${
          unlocked 
            ? claimed
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30'
              : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30'
            : 'bg-[#1A1F2E] border-2 border-gray-800'
        } transition-all`}>
          <span className={`text-4xl ${unlocked ? 'scale-hover' : 'grayscale opacity-50'}`}>
            {unlocked ? icon : '🔒'}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative text-center mb-4">
        <h3 className={`font-black text-lg mb-1 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm font-medium">
          {description}
        </p>
      </div>
      
      {/* Progress Bar (if not unlocked) */}
      {!unlocked && (
        <div className="relative mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500 font-medium">Progress</span>
            <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-[#0052FF]'}`}>
              {progress}/{max}
            </span>
          </div>
          <div className="h-2.5 bg-[#1A1F2E] rounded-full overflow-hidden border border-gray-800">
            <div
              className={`h-full bg-gradient-to-r ${
                isComplete ? 'from-green-500 to-emerald-500' : config.gradient
              } transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Reward / Claim Button */}
      {unlocked && !claimed && onClaim ? (
        <button
          onClick={handleClaim}
          disabled={isClaiming}
          className={`relative w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-black text-white transition-all shadow-xl hover:shadow-2xl btn-lift disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden bg-gradient-to-r ${config.buttonGradient}`}
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
      ) : (
        <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 ${
          unlocked && claimed
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-[#1A1F2E] border-gray-800'
        }`}>
          <Gift className={`w-4 h-4 ${unlocked && claimed ? 'text-green-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-bold ${unlocked && claimed ? 'text-green-400' : 'text-gray-500'}`}>
            {reward}
          </span>
        </div>
      )}
    </div>
  );
}