'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Sparkles } from 'lucide-react';
import { useRipple } from '@/components/animations/effects';
import sdk from '@farcaster/frame-sdk';

interface Stats {
  locked: number;
  revealed: number;
}

export default function HomePage() {
  const fid = 3;
  const createRipple = useRipple();
  
  const [stats, setStats] = useState<Stats>({ locked: 0, revealed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMMEDIATE SDK READY CALL
    const initSDK = async () => {
      try {
        await sdk.context;
        sdk.actions.ready();
        console.log('✅ Home: SDK ready called');
      } catch (error) {
        console.error('❌ SDK error:', error);
      }
    };

    initSDK();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success && data.capsules) {
        const locked = data.capsules.filter((c: any) => !c.revealed).length;
        const revealed = data.capsules.filter((c: any) => c.revealed).length;
        setStats({ locked, revealed });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 pulse">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Base Box</h1>
              <p className="text-gray-400 font-medium">Time remembers. Base preserves.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl p-6 card-hover">
            <Lock className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-4xl font-black text-blue-500 mb-2 number-pop">
              {loading ? '-' : stats.locked}
            </div>
            <p className="text-gray-400 font-bold text-sm">Locked</p>
          </div>

          <div className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-6 card-hover" style={{ animationDelay: '0.1s' }}>
            <Unlock className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-4xl font-black text-green-500 mb-2 number-pop">
              {loading ? '-' : stats.revealed}
            </div>
            <p className="text-gray-400 font-bold text-sm">Revealed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 stagger-item" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/create"
              onClick={(e) => createRipple(e as any)}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/50 transition-all btn-lift interactive"
            >
              <Lock className="w-8 h-8 text-white mb-3" />
              <p className="text-white font-black text-lg">Lock New Capsule</p>
              <p className="text-white/80 text-sm mt-1">Create a message</p>
            </a>

            <a
              href="/capsules"
              onClick={(e) => createRipple(e as any)}
              className="relative overflow-hidden bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-2xl p-6 hover:border-[#0052FF] transition-all btn-lift interactive"
            >
              <Sparkles className="w-8 h-8 text-[#0052FF] mb-3" />
              <p className="text-white font-black text-lg">View All Capsules</p>
              <p className="text-gray-400 text-sm mt-1">See your collection</p>
            </a>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 stagger-item" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-black text-white mb-4">How It Works</h2>
          
          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6 card-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">🔒 Lock Messages</h3>
                <p className="text-gray-400 text-sm">
                  Write messages to your future self, make predictions, set goals. Lock them on-chain.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-cyan-500/20 rounded-2xl p-6 card-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">⏰ Set Duration</h3>
                <p className="text-gray-400 text-sm">
                  Choose when to unlock: 1 hour to 1 year. Your capsule is time-locked on Base.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/20 rounded-2xl p-6 card-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">🎁 Reveal NFT</h3>
                <p className="text-gray-400 text-sm">
                  When unlocked, get an NFT proof of your time capsule. Forever on Base blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0E14]/95 backdrop-blur-md border-t-2 border-[#0052FF]/20 z-50">
        <div className="h-full flex items-center justify-around px-6">
          <a href="/" className="flex flex-col items-center gap-1 text-[#0052FF] scale-hover">
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
          <a href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
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