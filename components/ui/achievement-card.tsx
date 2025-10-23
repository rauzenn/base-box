'use client';

import React from 'react';
import { Gift, Lock, Check } from 'lucide-react';

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  max: number;
}

export function AchievementCard({ 
  title, 
  description, 
  icon, 
  reward, 
  rarity, 
  unlocked, 
  progress, 
  max 
}: AchievementCardProps) {
  const rarityConfig = {
    common: {
      border: 'border-gray-600/30',
      glow: 'hover:border-gray-500',
      gradient: 'from-gray-500 to-gray-600',
      label: 'Common',
      labelColor: 'text-gray-400'
    },
    rare: {
      border: 'border-blue-600/30',
      glow: 'hover:border-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      label: 'Rare',
      labelColor: 'text-blue-400'
    },
    epic: {
      border: 'border-purple-600/30',
      glow: 'hover:border-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      label: 'Epic',
      labelColor: 'text-purple-400'
    },
    legendary: {
      border: 'border-yellow-600/30',
      glow: 'hover:border-yellow-500',
      gradient: 'from-yellow-500 to-orange-500',
      label: 'Legendary',
      labelColor: 'text-yellow-400'
    }
  };

  const config = rarityConfig[rarity];
  const progressPercent = (progress / max) * 100;
  const isComplete = progress >= max;

  return (
    <div 
      className={`bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 transition-all card-hover ${
        unlocked 
          ? 'border-green-500/30 shadow-lg shadow-green-500/10' 
          : config.border + ' ' + config.glow
      }`}
    >
      {/* Rarity Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 bg-[#1A1F2E] border border-${rarity === 'common' ? 'gray' : rarity}-600/30 rounded-full`}>
          <span className={`text-xs font-bold ${config.labelColor}`}>
            {config.label}
          </span>
        </div>
        
        {unlocked && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-bold text-green-400">Unlocked</span>
          </div>
        )}
      </div>

      {/* Icon */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${
          unlocked 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30' 
            : 'bg-[#1A1F2E] border-2 border-gray-800'
        } transition-all`}>
          <span className={`text-4xl ${unlocked ? 'scale-hover' : 'grayscale opacity-50'}`}>
            {unlocked ? icon : '🔒'}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="text-center mb-4">
        <h3 className={`font-black text-lg mb-1 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm font-medium">
          {description}
        </p>
      </div>
      
      {/* Progress Bar (if not unlocked) */}
      {!unlocked && (
        <div className="mb-4">
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
      
      {/* Reward */}
      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 ${
        unlocked 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-[#1A1F2E] border-gray-800'
      }`}>
        <Gift className={`w-4 h-4 ${unlocked ? 'text-green-400' : 'text-gray-500'}`} />
        <span className={`text-sm font-bold ${unlocked ? 'text-green-400' : 'text-gray-500'}`}>
          {reward}
        </span>
      </div>
    </div>
  );
}