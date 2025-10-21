'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Clock } from 'lucide-react';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

// Inline Countdown Component
function CountdownTimer({ unlockDate }: { unlockDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(unlockDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return '🔓 Unlocked!';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
      return `${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate]);

  return (
    <div className="flex items-center gap-2 text-[#0052FF]">
      <Clock className="w-5 h-5" />
      <span className="text-lg font-black">{timeLeft}</span>
    </div>
  );
}

export default function CapsulesPage() {
  const fid = 3;
  
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'locked' | 'revealed'>('all');

  useEffect(() => {
    console.log('📦 Fetching capsules for FID:', fid);
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success && data.capsules) {
        console.log('✅ Loaded capsules:', data.capsules);
        setCapsules(data.capsules);
      } else {
        console.error('❌ Failed to load capsules:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCapsules = capsules.filter(capsule => {
    if (filter === 'locked') return !capsule.revealed;
    if (filter === 'revealed') return capsule.revealed;
    return true;
  });

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

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-3xl font-black text-white mb-2">My Capsules</h1>
          <p className="text-gray-400 font-medium">FID: {fid}</p>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 mb-6">
          <div className="flex gap-2 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                filter === 'locked'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Locked
            </button>
            <button
              onClick={() => setFilter('revealed')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                filter === 'revealed'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Revealed
            </button>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Loading capsules...</p>
            </div>
          ) : filteredCapsules.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-[#0052FF]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">No Capsules Found</h2>
              <p className="text-gray-400 font-medium mb-8">
                {filter === 'locked' && 'You have no locked capsules.'}
                {filter === 'revealed' && 'You have no revealed capsules yet.'}
                {filter === 'all' && 'Create your first time capsule!'}
              </p>
              <a
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all"
              >
                Create Capsule
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              {filteredCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className={`bg-[#0A0E14]/60 backdrop-blur-md border-2 rounded-2xl p-6 shadow-xl transition-all hover:scale-[1.02] ${
                    capsule.revealed
                      ? 'border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/20'
                      : 'border-[#0052FF]/30 hover:border-[#0052FF]/50 hover:shadow-[#0052FF]/20'
                  }`}
                >
                  {/* Icon & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      capsule.revealed
                        ? 'bg-green-500/20'
                        : 'bg-[#0052FF]/20'
                    }`}>
                      {capsule.revealed ? (
                        <Unlock className="w-7 h-7 text-green-500" />
                      ) : (
                        <Lock className="w-7 h-7 text-[#0052FF]" />
                      )}
                    </div>
                    
                    <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                      capsule.revealed
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                        : 'bg-[#0052FF]/20 text-[#0052FF] border border-[#0052FF]/30'
                    }`}>
                      {capsule.revealed ? '🔓 REVEALED' : '🔒 LOCKED'}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-4">
                    <p className="text-white font-bold text-lg line-clamp-2">
                      {capsule.message}
                    </p>
                  </div>

                  {/* Countdown or Revealed Date */}
                  {capsule.revealed ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <Clock className="w-4 h-4" />
                      <p className="text-sm font-medium">
                        Revealed: {new Date(capsule.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#1A1F2E] rounded-xl p-4">
                      <CountdownTimer unlockDate={capsule.unlockDate} />
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-mono">ID: {capsule.id}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(capsule.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0E14]/95 backdrop-blur-md border-t-2 border-[#0052FF]/20 z-50">
        <div className="h-full flex items-center justify-around px-6">
          <a href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-bold">Home</span>
          </a>
          <a href="/capsules" className="flex flex-col items-center gap-1 text-[#0052FF]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-bold">Capsules</span>
          </a>
          <a href="/create" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-bold">Create</span>
          </a>
          <a href="/reveals" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Reveals</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
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