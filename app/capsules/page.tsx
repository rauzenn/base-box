'use client';

import React, { useState } from 'react';
import { Lock, Package, Clock } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/countdown-timer';

export default function CapsulesPage() {
  const [filter, setFilter] = useState('all');

  // Mock data - unlockDate ekledik
  const capsules = [
    { 
      id: 1, 
      locked: true, 
      unlockDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      preview: 'My predictions for 2025...' 
    },
    { 
      id: 2, 
      locked: true, 
      unlockDate: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString(),
      preview: 'Dear future me, remember...' 
    },
    { 
      id: 3, 
      locked: false, 
      unlockDate: '2024-12-15',
      message: 'I thought ETH would hit $5k...' 
    },
  ];

  const filteredCapsules = capsules.filter(c => {
    if (filter === 'locked') return c.locked;
    if (filter === 'revealed') return !c.locked;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] p-6 pb-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">My Capsules</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {['all', 'locked', 'revealed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white shadow-lg'
                  : 'bg-black/50 text-gray-400 hover:text-white hover:bg-black/70'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Capsule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              className="bg-[#0A0E14]/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#0052FF]/20 hover:border-[#0052FF]/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                {capsule.locked ? (
                  <div className="w-14 h-14 bg-[#0052FF]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lock className="w-7 h-7 text-[#0052FF]" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-[#00D395]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-7 h-7 text-[#00D395]" />
                  </div>
                )}
                <span className={`px-4 py-2 rounded-full text-xs font-black ${
                  capsule.locked ? 'bg-[#0052FF]/20 text-[#0052FF]' : 'bg-[#00D395]/20 text-[#00D395]'
                }`}>
                  {capsule.locked ? '🔒 LOCKED' : '🔓 REVEALED'}
                </span>
              </div>
              
              <p className="text-gray-300 text-base mb-4 line-clamp-2 font-medium">
                {capsule.locked ? capsule.preview : capsule.message}
              </p>
              
              {capsule.locked ? (
                <div className="bg-black/40 rounded-xl p-4 border border-[#0052FF]/20">
                  <CountdownTimer unlockDate={capsule.unlockDate} />
                </div>
              ) : (
                <div className="text-gray-500 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Revealed on {new Date(capsule.unlockDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No capsules yet</h3>
            <p className="text-gray-400 mb-8">Create your first time capsule!</p>
            <button className="bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
              Create Capsule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}