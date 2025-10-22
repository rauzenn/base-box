'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Unlock, Calendar, TrendingUp, Target, Award } from 'lucide-react';

interface UserStats {
  totalCapsules: number;
  lockedCapsules: number;
  revealedCapsules: number;
  longestDuration: number;
  avgDuration: number;
  predictionAccuracy: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function ProfilePage() {
  const fid = 3;
  const username = 'timecapsule.eth';
  const address = '0x742d...5f8a';
  const joinDate = '2024-12-01';

  const [stats, setStats] = useState<UserStats>({
    totalCapsules: 12,
    lockedCapsules: 8,
    revealedCapsules: 4,
    longestDuration: 365,
    avgDuration: 90,
    predictionAccuracy: 75
  });

  const achievements: Achievement[] = [
    {
      id: 'first_capsule',
      title: 'Time Traveler',
      description: 'Created your first time capsule',
      icon: '🎖️',
      unlocked: true
    },
    {
      id: 'reveal_first',
      title: 'The Unsealer',
      description: 'Revealed your first capsule',
      icon: '🔓',
      unlocked: true
    },
    {
      id: 'early_adopter',
      title: 'Pioneer',
      description: 'Joined Base Box early',
      icon: '⭐',
      unlocked: true
    },
    {
      id: 'collector',
      title: 'Collector',
      description: 'Created 5 time capsules',
      icon: '🔒',
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#000814] pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 p-6 fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Profile</h1>
          <p className="text-gray-400 font-medium">Your Base Box stats and achievements</p>
        </div>

        {/* User Info Card */}
        <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-6 mb-8 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl pulse">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-1">{username}</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">FID: {fid}</span>
                <span className="text-gray-600">•</span>
                <button className="text-[#0052FF] font-bold hover:text-cyan-500 transition-colors">
                  {address} 📋
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Joined {joinDate}</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-xs font-bold ml-2">
                  PIONEER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl p-4 card-hover">
            <Lock className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-3xl font-black text-blue-500 mb-1">{stats.totalCapsules}</div>
            <p className="text-gray-400 text-xs font-bold">Total Capsules</p>
          </div>

          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-yellow-500/30 rounded-2xl p-4 card-hover" style={{ animationDelay: '0.1s' }}>
            <Lock className="w-6 h-6 text-yellow-500 mb-2" />
            <div className="text-3xl font-black text-yellow-500 mb-1">{stats.lockedCapsules}</div>
            <p className="text-gray-400 text-xs font-bold">Locked</p>
          </div>

          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-4 card-hover" style={{ animationDelay: '0.2s' }}>
            <Unlock className="w-6 h-6 text-green-500 mb-2" />
            <div className="text-3xl font-black text-green-500 mb-1">{stats.revealedCapsules}</div>
            <p className="text-gray-400 text-xs font-bold">Revealed</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl p-4 card-hover" style={{ animationDelay: '0.3s' }}>
            <Calendar className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-3xl font-black text-purple-500 mb-1">{stats.longestDuration}d</div>
            <p className="text-gray-400 text-xs font-bold">Longest Duration</p>
          </div>

          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-pink-500/30 rounded-2xl p-4 card-hover" style={{ animationDelay: '0.4s' }}>
            <TrendingUp className="w-6 h-6 text-pink-500 mb-2" />
            <div className="text-3xl font-black text-pink-500 mb-1">{stats.avgDuration}d</div>
            <p className="text-gray-400 text-xs font-bold">Avg Duration</p>
          </div>

          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-cyan-500/30 rounded-2xl p-4 card-hover" style={{ animationDelay: '0.5s' }}>
            <Target className="w-6 h-6 text-cyan-500 mb-2" />
            <div className="text-3xl font-black text-cyan-500 mb-1">{stats.predictionAccuracy}%</div>
            <p className="text-gray-400 text-xs font-bold">Prediction Accuracy</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="stagger-item mb-8" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-black text-white">Achievements</h2>
            </div>
            <button className="text-[#0052FF] font-bold text-sm hover:text-cyan-500 transition-colors">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 rounded-2xl p-4 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-500/30 card-hover'
                    : 'border-gray-800 opacity-50'
                }`}
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="text-white font-black text-sm mb-1">{achievement.title}</h3>
                <p className="text-gray-400 text-xs mb-2">{achievement.description}</p>
                {achievement.unlocked ? (
                  <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                    <span>✓</span> Unlocked
                  </div>
                ) : (
                  <div className="text-gray-600 text-xs font-bold">🔒 Locked</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0E14]/95 backdrop-blur-md border-t-2 border-[#0052FF]/20 z-50">
        <div className="h-full flex items-center justify-around px-6">
          <a href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-bold">Home</span>
          </a>
          <a href="/capsules" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-bold">Capsules</span>
          </a>
          <a href="/create" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-bold">Create</span>
          </a>
          <a href="/reveals" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Reveals</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-[#0052FF] scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-bold">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}