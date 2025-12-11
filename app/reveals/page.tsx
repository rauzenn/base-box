'use client';

import { useState, useEffect } from 'react';
import { Unlock, Calendar, Download, Image as ImageIcon, Sparkles, Share2, Clock, Wallet as WalletIcon, Settings } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';
import { useFarcaster } from '@/hooks/use-farcaster';
import { useWallet } from '@/hooks/usewallet';
import { WalletModal } from '@/components/wallet/WalletModal';
import { SettingsModal } from '@/components/settings/settingsmodal';
import { MintButton } from '@/components/nft/MintButton';

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

export default function RevealsPage() {
  const { fid, isLoading: farcasterLoading } = useFarcaster(); // ✅ FIXED: Use real FID
  const createRipple = useRipple();
  const { address, isConnected } = useWallet();
  
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // ✅ FIXED: FID dependency added
  useEffect(() => {
    if (!fid) {
      console.log('🔓 [Reveals] Waiting for FID...');
      return;
    }
    
    console.log('🔓 [Reveals] FID available:', fid);
    fetchRevealedCapsules();
  }, [fid]); // ← FID DEPENDENCY ADDED!

  const fetchRevealedCapsules = async () => {
    // ✅ FIXED: Check FID before fetching
    if (!fid) {
      console.error('🔓 [Reveals] Cannot fetch without FID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔓 [Reveals] Fetching revealed capsules for FID:', fid);
      
      const response = await fetch(`/api/capsules/list?fid=${fid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // ✅ ADDED: Disable cache
      });

      console.log('🔓 [Reveals] Response status:', response.status);
      
      const data = await response.json();
      console.log('🔓 [Reveals] Response data:', data);

      if (data.success) {
        const revealed = data.capsules.filter(
          (c: Capsule) => c.revealed || new Date(c.unlockDate) <= new Date()
        );
        console.log('🔓 [Reveals] Found', revealed.length, 'revealed capsules');
        setCapsules(revealed);
      } else {
        console.error('🔓 [Reveals] API error:', data.message);
      }
    } catch (error) {
      console.error('🔓 [Reveals] Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSinceLocked = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const downloadImage = (imageData: string, capsuleId: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `base-box-memory-${capsuleId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ IMPROVED: Combined loading state
  if (farcasterLoading || loading) {
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
              {farcasterLoading ? 'Connecting...' : 'Loading reveals...'}
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
        {/* Header with Wallet & Settings */}
        <div className="mb-8 fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20 pulse">
                <Unlock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  Reveals
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                  Your unlocked memories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              {!isConnected ? (
                <button
                  onClick={(e) => {
                    createRipple(e);
                    setIsWalletModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl flex items-center gap-2 transition-all"
                >
                  <WalletIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-400">Connect</span>
                </button>
              ) : (
                <div className="px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-green-400">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={(e) => {
                  createRipple(e);
                  setIsSettingsModalOpen(true);
                }}
                className="w-10 h-10 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl flex items-center justify-center transition-all"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>

              {/* Total Counter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/20 rounded-xl">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-black text-lg">{capsules.length}</span>
                </div>
                <span className="text-gray-400 text-sm font-bold">revealed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <div className="text-center py-20 fade-in-up">
            <div className="w-24 h-24 bg-[#1A1F2E] rounded-full flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No revealed capsules yet</h3>
            <p className="text-gray-400 mb-8">
              Come back when your time capsules are ready to unlock!
            </p>
            <button
              onClick={(e) => {
                createRipple(e);
                window.location.href = '/capsules';
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#0052FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-[#0052FF]/50 scale-hover relative overflow-hidden"
            >
              View My Capsules
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {capsules.map((capsule, index) => (
              <div
                key={capsule.id}
                className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl overflow-hidden transition-all card-hover shadow-lg shadow-green-500/5 hover:shadow-green-500/10"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="p-5 border-b-2 border-gray-800 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center pulse">
                        <Sparkles className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-black text-sm">Unlocked Memory</h3>
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {getTimeSinceLocked(capsule.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1F2E] rounded-lg border-2 border-green-500/20">
                      <Calendar className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-gray-400 font-bold">
                        {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Image */}
                  {capsule.image && (
                    <div className="relative w-full rounded-xl overflow-hidden bg-[#1A1F2E] border-2 border-green-500/30">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <img
                          src={capsule.image}
                          alt="Memory"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Image Actions Overlay */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            createRipple(e);
                            setSelectedCapsule(capsule);
                          }}
                          className="w-10 h-10 bg-[#1A1F2E]/90 backdrop-blur-md hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl flex items-center justify-center transition-all"
                        >
                          <ImageIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            createRipple(e);
                            downloadImage(capsule.image!, capsule.id);
                          }}
                          className="w-10 h-10 bg-[#1A1F2E]/90 backdrop-blur-md hover:bg-green-500/20 border-2 border-green-500/20 hover:border-green-500 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Download className="w-5 h-5 text-green-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="bg-[#1A1F2E] border-2 border-green-500/20 rounded-xl p-4">
                    <p className="text-white font-medium leading-relaxed whitespace-pre-wrap">
                      {capsule.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {/* Mint NFT Button */}
                    {isConnected && address && (
                      <MintButton 
                        capsuleId={capsule.id}
                        capsuleData={capsule}
                      />
                    )}

                    {/* Share Button */}
                    <button
                      onClick={(e) => createRipple(e)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl transition-all font-bold text-gray-400 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedCapsule && selectedCapsule.image && (
        <div
          onClick={() => setSelectedCapsule(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedCapsule.image}
              alt="Full size"
              className="w-full h-auto rounded-2xl"
            />
            <button
              onClick={() => setSelectedCapsule(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-full flex items-center justify-center transition-all"
            >
              <span className="text-white text-2xl leading-none">×</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />

      <BottomNav />
    </div>
  );
}