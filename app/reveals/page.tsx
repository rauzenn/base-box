'use client';

import { useState, useEffect } from 'react';
import { Unlock, Calendar, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useRipple, createSparkles, createConfetti, createParticleBurst } from '@/components/animations/effects';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export default function RevealsPage() {
  const fid = 3;
  const createRipple = useRipple();
  
  const [revealedCapsules, setRevealedCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fid) {
      fetchRevealedCapsules();
    }
  }, [fid]);

  const fetchRevealedCapsules = async () => {
    try {
      setLoading(true);
      console.log('🔓 Fetching revealed capsules for FID:', fid);

      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success && data.capsules) {
        const revealed = data.capsules.filter((c: Capsule) => c.revealed);
        
        revealed.sort((a: Capsule, b: Capsule) => 
          new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime()
        );

        setRevealedCapsules(revealed);
        console.log(`✅ Loaded ${revealed.length} revealed capsules`);
      }
    } catch (error) {
      console.error('❌ Error fetching revealed capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (createdAt: string, unlockDate: string) => {
    const created = new Date(createdAt);
    const unlocked = new Date(unlockDate);
    const diffMs = unlocked.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Less than a day';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const handleCapsuleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    // Epic animation sequence
    createRipple(e);
    createSparkles(card, 16);
    createParticleBurst(card, '#00D395', 24);
    
    setTimeout(() => {
      createConfetti(40);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#000814] pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 211, 149, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 211, 149, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10">
        {/* Header with Glow */}
        <div className="p-6 pb-8 fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl glow-pulse">
              <Unlock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Revealed Capsules</h1>
              <p className="text-gray-400 font-medium">Messages from your past</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Loading revealed capsules...</p>
            </div>
          ) : revealedCapsules.length === 0 ? (
            // Empty State with Animation
            <div className="text-center py-20 fade-in-up">
              <div className="w-24 h-24 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl pulse">
                <Unlock className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">No Revealed Capsules Yet</h2>
              <p className="text-gray-400 font-medium mb-8 max-w-md mx-auto">
                Your revealed time capsules will appear here. Create locked capsules and wait for them to unlock!
              </p>
              <a
                href="/create"
                onClick={(e) => createRipple(e as any)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white shadow-xl hover:shadow-green-500/50 transition-all btn-lift relative overflow-hidden"
              >
                <Sparkles className="w-5 h-5" />
                Lock Your First Capsule
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ) : (
            // Revealed Capsules Grid with Stagger
            <div className="space-y-4 pb-6">
              {revealedCapsules.map((capsule, index) => (
                <div
                  key={capsule.id}
                  onClick={handleCapsuleClick}
                  className="stagger-item interactive card-hover bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-6 shadow-xl hover:border-green-500/50 hover:shadow-green-500/20 transition-all relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center unlock-rotate">
                        <Unlock className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Revealed
                        </p>
                        <p className="text-sm font-mono text-gray-400">{capsule.id}</p>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg scale-hover">
                      <p className="text-xs text-green-500 font-bold uppercase tracking-wider">
                        🔓 Unlocked
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6 relative z-10">
                    <p className="text-white font-medium text-lg leading-relaxed">
                      {capsule.message}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-800 relative z-10">
                    <div className="flex items-center gap-2 scale-hover">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Locked</p>
                        <p className="text-sm text-gray-400 font-mono">
                          {formatDate(capsule.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-gray-600 bounce" />
                      <div className="px-3 py-1 bg-[#1A1F2E] rounded-lg">
                        <p className="text-xs text-gray-400 font-bold">
                          {getDuration(capsule.createdAt, capsule.unlockDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 scale-hover">
                      <Unlock className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Revealed</p>
                        <p className="text-sm text-green-500 font-mono">
                          {formatDate(capsule.unlockDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NFT Placeholder */}
                  <div className="mt-4 pt-4 border-t border-gray-800 relative z-10">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        🎁 <span className="pulse">NFT minting coming soon...</span>
                      </p>
                      <button
                        disabled
                        className="px-4 py-2 bg-[#1A1F2E] border border-gray-800 rounded-lg text-xs text-gray-600 font-bold cursor-not-allowed"
                      >
                        Mint NFT (Soon)
                      </button>
                    </div>
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
          <a href="/reveals" className="flex flex-col items-center gap-1 text-[#0052FF]">
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