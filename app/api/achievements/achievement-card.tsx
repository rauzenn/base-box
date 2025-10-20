'use client';

import React from 'react';
import { Gift } from 'lucide-react';

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
  const rarityColors = {
    common: 'border-gray-600',
    rare: 'border-blue-600',
    epic: 'border-purple-600',
    legendary: 'border-yellow-600'
  };

  const progressPercent = (progress / max) * 100;

  return (
    <div className={`bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all ${
      unlocked ? 'border-[#00D395]/50 hover:border-[#00D395]' : rarityColors[rarity]
    }`}>
      <div className="text-4xl mb-3 text-center">
        {unlocked ? icon : '🔒'}
      </div>
      <h3 className="text-white font-bold text-center mb-2">{title}</h3>
      <p className="text-gray-400 text-sm text-center mb-4">{description}</p>
      
      {!unlocked && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">Progress</span>
            <span className="text-[#0052FF] font-bold">{progress}/{max}</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0052FF] to-[#00D395] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
      
      <div className={`flex items-center justify-center gap-2 text-sm ${
        unlocked ? 'text-[#00D395]' : 'text-gray-500'
      }`}>
        <Gift className="w-4 h-4" />
        <span className="font-bold">{reward}</span>
      </div>
    </div>
  );
}