'use client';

import { useState, useEffect } from 'react';
import { Lock, Clock, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';
import { useFarcaster } from '@/hooks/use-farcaster';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  image?: string;
  imageType?: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

type FilterType = 'all' | 'locked' | 'revealed';

export default function CapsulesPage() {
  const { fid, isLoading: farcasterLoading } = useFarcaster();
  const createRipple = useRipple();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ FIXED: FID dependency added + only fetch when FID is available
  useEffect(() => {
    if (!fid) {
      console.log('📦 [Capsules] Waiting for FID...');
      return;
    }
    
    console.log('📦 [Capsules] FID available:', fid);
    fetchCapsules();
  }, [fid]); // ← FID DEPENDENCY ADDED!

  const fetchCapsules = async () => {
    if (!fid) {
      console.error('📦 [Capsules] Cannot fetch without FID');
      setLoading(false);
      return;
    }

    try {
      console.log('📦 [Capsules] Fetching capsules for FID:', fid);
      
      const response = await fetch(`/api/capsules/list?fid=${fid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // ✅ ADDED: Disable cache
      });

      console.log('📦 [Capsules] Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 [Capsules] Response data:', data);

      if (data.success) {
        console.log('📦 [Capsules] Fetched', data.capsules.length, 'capsules');
        setCapsules(data.capsules);
      } else {
        console.error('📦 [Capsules] API error:', data.message);
      }
    } catch (error) {
      console.error('📦 [Capsules] Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCapsules = capsules.filter((capsule) => {
    if (filter === 'all') return true;
    if (filter === 'locked') return !capsule.revealed && new Date(capsule.unlockDate) > new Date();
    if (filter === 'revealed') return capsule.revealed || new Date(capsule.unlockDate) <= new Date();
    return true;
  });

  const getTimeRemaining = (unlockDate: string) => {
    const now = new Date().getTime();
    const unlock = new Date(unlockDate).getTime();
    const diff = unlock - now;

    if (diff <= 0) return 'Ready to unlock!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const isUnlocked = (capsule: Capsule) => {
    return capsule.revealed || new Date(capsule.unlockDate) <= new Date();
  };

  // ✅ IMPROVED: Combined loading state
  if (farcasterLoading || (loading && !capsules.length)) {
    return (
      <div className="min-h-screen bg-[#000814] pb-24">
        <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
        <div className="fixed inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
            <p className="text-gray-400 font-bold">
              {farcasterLoading ? 'Connecting...' : 'Loading capsules...'}
            </p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ✅ ADDED: No FID error state
  if (!fid) {
    return (
      <div className="min-h-screen bg-[#000814] pb-24">
        <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
        <div className="fixed inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative z-10 flex items-center justify-center h-screen px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Connection Error</h2>
            <p className="text-gray-400 mb-6">Unable to connect. Please use from Warpcast.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] pb-24">
      {/* Animated Background */}
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

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 pulse">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  My Capsules
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                  Your locked messages & memories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-xl">
              <div className="w-8 h-8 bg-[#0052FF]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#0052FF] font-black text-lg">{capsules.length}</span>
              </div>
              <span className="text-gray-400 text-sm font-bold">total</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-3 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-2">
            {(['all', 'locked', 'revealed'] as FilterType[]).map((f) => {
              const counts = {
                all: capsules.length,
                locked: capsules.filter(c => !isUnlocked(c)).length,
                revealed: capsules.filter(c => isUnlocked(c)).length
              };

              return (
                <button
                  key={f}
                  onClick={(e) => {
                    createRipple(e);
                    setFilter(f);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all capitalize relative overflow-hidden ${
                    filter === f
                      ? 'bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {f} ({counts[f]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Capsules Grid */}
        {filteredCapsules.length === 0 ? (
          <div className="text-center py-20 fade-in-up">
            <div className="w-24 h-24 bg-[#1A1F2E] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No capsules found</h3>
            <p className="text-gray-400 mb-8">
              {filter === 'all' 
                ? 'Create your first time capsule!'
                : `No ${filter} capsules yet`
              }
            </p>
            <button
              onClick={(e) => {
                createRipple(e);
                window.location.href = '/create';
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#0052FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-[#0052FF]/50 scale-hover relative overflow-hidden"
            >
              Create Capsule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCapsules.map((capsule, index) => {
              const unlocked = isUnlocked(capsule);
              
              return (
                <div
                  key={capsule.id}
                  className={`stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 rounded-2xl overflow-hidden transition-all card-hover ${
                    unlocked 
                      ? 'border-green-500/30 shadow-green-500/5 hover:shadow-green-500/10'
                      : 'border-[#0052FF]/20 shadow-[#0052FF]/5 hover:shadow-[#0052FF]/10'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className={`p-5 border-b-2 border-gray-800 ${
                    unlocked 
                      ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10'
                      : 'bg-gradient-to-r from-[#0052FF]/10 to-cyan-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center pulse ${
                          unlocked ? 'bg-green-500/20' : 'bg-[#0052FF]/20'
                        }`}>
                          {unlocked ? (
                            <Sparkles className="w-5 h-5 text-green-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-[#0052FF]" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-black text-sm">
                            {unlocked ? 'Unlocked' : 'Locked'}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">
                            {unlocked 
                              ? getTimeRemaining(capsule.unlockDate)
                              : new Date(capsule.createdAt).toLocaleDateString()
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1F2E] rounded-lg border-2 border-[#0052FF]/20">
                        <Calendar className="w-3 h-3 text-[#0052FF]" />
                        <span className="text-xs text-gray-400 font-bold">
                          {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Image Thumbnail */}
                    {capsule.image && (
                      <div 
                        onClick={() => setSelectedImage(capsule.image!)}
                        className="relative w-full rounded-xl overflow-hidden bg-[#1A1F2E] border-2 border-cyan-500/30 cursor-pointer group"
                      >
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <img
                            src={capsule.image}
                            alt="Capsule"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Preview */}
                    <div className="bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-xl p-4">
                      <p className="text-white font-medium line-clamp-3">
                        {unlocked ? capsule.message : '🔒 Locked until unlock date'}
                      </p>
                    </div>

                    {/* Time Remaining */}
                    {!unlocked && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[#0052FF]" />
                        <span className="text-gray-400 font-bold">
                          {getTimeRemaining(capsule.unlockDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-full flex items-center justify-center transition-all"
            >
              <span className="text-white text-2xl leading-none">×</span>
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}