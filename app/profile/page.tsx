'use client';

import React, { useState } from 'react';
import { User, Award, Lock, Unlock, TrendingUp, Calendar, Zap, ExternalLink, Copy, Check, Activity, Target } from 'lucide-react';

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  suffix?: string;
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const user = {
    fid: 3,
    username: 'timecapsule.eth',
    address: '0x742d...5f8a',
    joinedDate: '2024-12-01',
    stats: {
      total: 12,
      locked: 8,
      revealed: 4,
      longestDuration: 365,
      avgDuration: 90,
      predictionAccuracy: 75
    },
    achievements: [
      { id: 1, unlocked: true, icon: '🎖️', title: 'Time Traveler' },
      { id: 2, unlocked: true, icon: '🔓', title: 'The Unsealer' },
      { id: 3, unlocked: true, icon: '🌟', title: 'Pioneer' },
      { id: 4, unlocked: false, icon: '⭐', title: 'Collector' },
    ],
    recentActivity: [
      { type: 'reveal', message: 'Revealed capsule #004', date: '2 hours ago' },
      { type: 'mint', message: 'Locked capsule #012', date: '1 day ago' },
      { type: 'achievement', message: 'Unlocked Pioneer badge', date: '3 days ago' },
    ]
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatCard = ({ icon: Icon, label, value, color, suffix = '' }: StatCardProps) => (
    <div className="bg-[#0A0E14]/60 backdrop-blur-lg rounded-2xl p-6 border-2 border-opacity-30 hover:border-opacity-50 transition-all" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" style={{ color }} />
        <span className="text-3xl font-black" style={{ color }}>
          {value}{suffix}
        </span>
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Profile</h1>
          <p className="text-gray-400">Your Base Box stats and achievements</p>
        </div>

        <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-[#0052FF]/30 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#00D395] flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-2">{user.username}</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-400">FID: {user.fid}</span>
                <span className="text-gray-600">•</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-[#0052FF] hover:text-blue-400 transition-all"
                >
                  <span className="font-mono text-sm">{user.address}</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-[#00D395]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {user.joinedDate}
                </span>
                <span className="px-3 py-1 bg-[#0052FF]/20 text-[#0052FF] rounded-full text-xs font-bold">
                  PIONEER
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Lock} label="Total Capsules" value={user.stats.total} color="#0052FF" />
          <StatCard icon={Lock} label="Locked" value={user.stats.locked} color="#FFB800" />
          <StatCard icon={Unlock} label="Revealed" value={user.stats.revealed} color="#00D395" />
          <StatCard icon={Calendar} label="Longest Duration" value={user.stats.longestDuration} color="#9D4EDD" suffix="d" />
          <StatCard icon={TrendingUp} label="Avg Duration" value={user.stats.avgDuration} color="#FF6B9D" suffix="d" />
          <StatCard icon={Target} label="Prediction Accuracy" value={user.stats.predictionAccuracy} color="#00D395" suffix="%" />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-2xl font-black text-white">Achievements</h2>
            </div>
            <button className="text-[#0052FF] hover:text-blue-400 text-sm font-bold flex items-center gap-2">
              View All
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-[#0A0E14]/60 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-[#FFD700]/50 hover:border-[#FFD700] hover:shadow-xl hover:shadow-yellow-500/20 cursor-pointer'
                    : 'border-gray-700 opacity-50'
                }`}
              >
                <div className="text-4xl mb-3 text-center">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className={`text-center text-sm font-bold ${
                  achievement.unlocked ? 'text-white' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </div>
                {achievement.unlocked && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-[#00D395]">✓ Unlocked</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-7 h-7 text-[#0052FF]" />
            <h2 className="text-2xl font-black text-white">Recent Activity</h2>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-lg rounded-2xl border-2 border-[#0052FF]/20 overflow-hidden">
            {user.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 hover:bg-[#0052FF]/5 transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'reveal' ? 'bg-[#00D395]/20 text-[#00D395]' :
                  activity.type === 'mint' ? 'bg-[#0052FF]/20 text-[#0052FF]' :
                  'bg-[#FFD700]/20 text-[#FFD700]'
                }`}>
                  {activity.type === 'reveal' && <Unlock className="w-5 h-5" />}
                  {activity.type === 'mint' && <Lock className="w-5 h-5" />}
                  {activity.type === 'achievement' && <Award className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.message}</div>
                  <div className="text-gray-500 text-sm">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">Base Box v1.0.0</p>
          <p>Built on Base 💙</p>
        </div>
      </div>
    </div>
  );
}