'use client';

import React, { useState } from 'react';
import { Trophy, Lock, Sparkles } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
}

interface BadgeShowcaseProps {
  badges: Badge[];
}

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const claimedBadges = badges.filter(b => b.claimed);
  const totalBadges = badges.length;
  const claimedCount = claimedBadges.length;

  const rarityConfig = {
    common: {
      gradient: 'from-gray-500 to-gray-600',
      glow: 'shadow-gray-500/50',
      border: 'border-gray-500/30',
      bg: 'bg-gray-500/10'
    },
    rare: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10'
    },
    epic: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10'
    },
    legendary: {
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/10'
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Badge Collection</h3>
            <p className="text-sm text-gray-400 font-medium">
              {claimedCount} of {totalBadges} badges collected
            </p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - claimedCount / totalBadges)}`}
              className="text-yellow-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-white">{Math.round((claimedCount / totalBadges) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge, index) => {
          const config = rarityConfig[badge.rarity];
          const isClaimed = badge.claimed;
          const isHovered = hoveredBadge === badge.id;

          return (
            <div
              key={badge.id}
              className="relative stagger-item"
              style={{ animationDelay: `${index * 0.05}s` }}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {/* Badge Card */}
              <div
                className={`relative aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                  isClaimed
                    ? `${config.border} bg-gradient-to-br ${config.bg} hover:scale-110 hover:${config.glow} shadow-lg`
                    : 'border-gray-800 bg-[#1A1F2E] hover:border-gray-700'
                }`}
              >
                {/* Rarity Glow */}
                {isClaimed && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10`} />
                )}

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isClaimed ? (
                    <span className={`text-5xl transition-transform ${isHovered ? 'scale-125' : 'scale-100'}`}>
                      {badge.icon}
                    </span>
                  ) : (
                    <Lock className="w-8 h-8 text-gray-700" />
                  )}
                </div>

                {/* Locked Overlay */}
                {!isClaimed && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-black text-gray-600">???</span>
                  </div>
                )}

                {/* Rarity Badge (top-right) */}
                {isClaimed && (
                  <div className={`absolute top-1 right-1 w-6 h-6 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Name (below card) */}
              <div className="mt-2 text-center">
                <p className={`text-xs font-bold line-clamp-1 ${
                  isClaimed ? 'text-white' : 'text-gray-600'
                }`}>
                  {isClaimed ? badge.title : '???'}
                </p>
              </div>

              {/* Hover Tooltip */}
              {isHovered && isClaimed && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 animate-fade-in">
                  <div className={`bg-[#0A0E14]/95 backdrop-blur-xl border-2 ${config.border} rounded-xl p-3 shadow-2xl`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-sm line-clamp-1">{badge.title}</p>
                        <p className={`text-xs font-bold capitalize ${config.border.replace('border-', 'text-')}`}>
                          {badge.rarity}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed">
                      {badge.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <p className="text-xs text-gray-500 font-medium">
                        🎁 {badge.reward}
                      </p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className={`w-3 h-3 bg-[#0A0E14] border-r-2 border-b-2 ${config.border} transform rotate-45`} />
                  </div>
                </div>
              )}

              {/* Locked Tooltip */}
              {isHovered && !isClaimed && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 animate-fade-in">
                  <div className="bg-[#0A0E14]/95 backdrop-blur-xl border-2 border-gray-800 rounded-xl p-3 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <p className="text-white font-black text-sm">Locked Badge</p>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                      {badge.description}
                    </p>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="w-3 h-3 bg-[#0A0E14] border-r-2 border-b-2 border-gray-800 transform rotate-45" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {claimedCount === 0 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#1A1F2E] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-gray-700" />
          </div>
          <p className="text-gray-400 font-bold mb-2">No badges collected yet</p>
          <p className="text-gray-500 text-sm">
            Complete achievements and claim rewards to earn badges!
          </p>
        </div>
      )}

      {/* Rarity Legend */}
      {claimedCount > 0 && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t-2 border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">Common</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">Rare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">Legendary</span>
          </div>
        </div>
      )}
    </div>
  );
}