'use client';

import { Lock, Unlock, TrendingUp, Calendar, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, locked: 0, revealed: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // API'den stats çek (şimdilik mock)
    setStats({ total: 0, locked: 0, revealed: 0 });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0052FF] to-[#00D395] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4">Base Box</h1>
          <p className="text-2xl text-gray-400 mb-2">Time remembers.</p>
          <p className="text-3xl font-black bg-gradient-to-r from-[#0052FF] to-[#00D395] bg-clip-text text-transparent">
            Base preserves.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#0052FF]/30 hover:border-[#0052FF]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <Lock className="w-7 h-7 text-[#0052FF]" />
              <span className="text-5xl font-black text-[#0052FF]">{stats.locked}</span>
            </div>
            <div className="text-gray-400 font-bold text-lg">Locked</div>
          </div>

          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#00D395]/30 hover:border-[#00D395]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <Unlock className="w-7 h-7 text-[#00D395]" />
              <span className="text-5xl font-black text-[#00D395]">{stats.revealed}</span>
            </div>
            <div className="text-gray-400 font-bold text-lg">Revealed</div>
          </div>
        </div>

        {/* Next Reveal Countdown */}
        {stats.locked > 0 && (
          <div className="bg-gradient-to-br from-[#0052FF]/10 to-[#00D395]/10 rounded-2xl p-6 border-2 border-[#0052FF]/30 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0052FF]/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0052FF]" />
              </div>
              <h3 className="text-white font-black text-xl">Next Reveal</h3>
            </div>
            <div className="flex items-center gap-2 text-[#0052FF]">
              <Zap className="w-5 h-5" />
              <span className="text-2xl font-black">5d 12h 30m</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4 mb-12">
          <Link href="/create">
            <button className="w-full bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
              <Lock className="w-6 h-6" />
              Lock New Capsule
            </button>
          </Link>

          <Link href="/capsules">
            <button className="w-full bg-black/50 text-white py-6 rounded-2xl font-bold text-lg border-2 border-[#0052FF]/30 hover:border-[#0052FF] transition-all flex items-center justify-center gap-3">
              <Unlock className="w-5 h-5" />
              View All Capsules
            </button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0052FF]/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0052FF]" />
            </div>
            <h2 className="text-3xl font-black text-white">Recent Activity</h2>
          </div>
          
          <div className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-12 border-2 border-[#0052FF]/20 text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">No recent activity</p>
            <p className="text-gray-500">Create your first capsule to get started!</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A0E14]/60 backdrop-blur-lg rounded-xl p-6 border border-[#0052FF]/20 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="text-white font-bold mb-2">Lock Messages</h4>
            <p className="text-gray-400 text-sm">Store messages for your future self</p>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-lg rounded-xl p-6 border border-[#0052FF]/20 text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h4 className="text-white font-bold mb-2">Set Duration</h4>
            <p className="text-gray-400 text-sm">Choose when to unlock your capsule</p>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-lg rounded-xl p-6 border border-[#0052FF]/20 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h4 className="text-white font-bold mb-2">Reveal NFT</h4>
            <p className="text-gray-400 text-sm">Get an NFT proof when unlocking</p>
          </div>
        </div>
      </div>
    </div>
  );
}