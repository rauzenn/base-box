"use client";

import { Mission } from "@/lib/missions";
import { useState } from "react";

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  onSelect: () => void;
}

const difficultyColors = {
  easy: {
    border: "border-[#00D395]",
    bg: "bg-[#00D395]/10",
    text: "text-[#00D395]",
    glow: "shadow-[#00D395]/20"
  },
  medium: {
    border: "border-[#0052FF]",
    bg: "bg-[#0052FF]/10",
    text: "text-[#0052FF]",
    glow: "shadow-[#0052FF]/20"
  },
  hard: {
    border: "border-[#FFB800]",
    bg: "bg-[#FFB800]/10",
    text: "text-[#FFB800]",
    glow: "shadow-[#FFB800]/20"
  },
  legendary: {
    border: "border-[#FF6B35]",
    bg: "bg-[#FF6B35]/10",
    text: "text-[#FF6B35]",
    glow: "shadow-[#FF6B35]/20"
  }
};

export function MissionCard({ mission, isSelected, onSelect }: MissionCardProps) {
  const [showExamples, setShowExamples] = useState(false);
  const colors = difficultyColors[mission.difficulty];

  return (
    <div
      onClick={onSelect}
      className={`
        relative rounded-2xl p-6 cursor-pointer transition-all duration-300
        ${isSelected 
          ? `${colors.border} border-2 ${colors.bg} scale-105 ${colors.glow} shadow-xl` 
          : "border border-gray-700 bg-[#12161E] hover:border-gray-600 hover:scale-102"
        }
      `}
    >
      {/* Difficulty Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.bg} ${colors.text}`}>
          {mission.difficulty}
        </div>
        <div className="text-gray-400 text-sm">
          ⏱️ {mission.estimatedTime}
        </div>
      </div>

      {/* Icon & Title */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{mission.icon}</span>
        <h3 className="text-xl font-bold text-white">{mission.title}</h3>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {mission.description}
      </p>

      {/* Hashtag */}
      <div className="flex items-center justify-between mb-4">
        <code className={`px-3 py-1 rounded-lg text-sm font-mono ${colors.bg} ${colors.text}`}>
          {mission.hashtag}
        </code>
        <div className={`text-lg font-bold ${colors.text}`}>
          +{mission.xp} XP
        </div>
      </div>

      {/* Show Examples Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowExamples(!showExamples);
        }}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {showExamples ? "Hide examples ▲" : "Show examples ▼"}
      </button>

      {/* Examples (collapsible) */}
      {showExamples && (
        <div className="mt-4 space-y-2 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Example Posts:</p>
          {mission.examples.map((example, idx) => (
            <div key={idx} className="text-sm text-gray-400 bg-[#070A0E] rounded-lg p-3 border border-gray-800">
              "{example}"
            </div>
          ))}
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold`}>
          ✓
        </div>
      )}
    </div>
  );
}