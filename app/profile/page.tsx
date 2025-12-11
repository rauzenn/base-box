'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Lock, Unlock, Trophy, TrendingUp, Sparkles, Award, Gift, Wallet as WalletIcon, Copy, ExternalLink, Settings } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import { AchievementCard } from '@/components/ui/achievement-card';
import { BadgeShowcase } from '@/components/ui/badge-showcase';
import BottomNav from '@/components/ui/bottom-nav';
import { useFarcaster } from '@/hooks/use-farcaster';
import { useWallet } from '@/hooks/usewallet';
import { WalletModal } from '@/components/wallet/WalletModal';
import { WalletDropdown } from '@/components/wallet/WalletDropdown';
import { SettingsModal } from '@/components/settings/settingsmodal';

interface Stats {
  totalCapsules: number;
  revealedCapsules: number;
  longestDuration: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
  progress: number;
  max: number;
}

export default function ProfilePage() {
  const { fid, isLoading: farcasterLoading } = useFarcaster();
  const { address, isConnected, balance } = useWallet();
  const createRipple = useRipple();
  const [stats, setStats] = useState<Stats>({
    totalCapsules: 0,
    revealedCapsules: 0,
    longestDuration: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unclaimedCount, setUnclaimedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ✅ FIXED: FID dependency added
  useEffect(() => {
    if (!fid) {
      console.log('👤 [Profile] Waiting for FID...');
      return;
    }
    
    console.log('👤 [Profile] FID available:', fid);
    fetchData();
  }, [fid]); // ← FID DEPENDENCY ADDED!

  const fetchData = async () => {
    // ✅ FIXED: Check FID before fetching
    if (!fid) {
      console.error('👤 [Profile] Cannot fetch without FID');
      setLoading(false);
      return;
    }

    try {
      console.log('👤 [Profile] Fetching achievements for FID:', fid);
      
      const achievementResponse = await fetch(`/api/achievements?fid=${fid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // ✅ ADDED: Disable cache
      });

      console.log('👤 [Profile] Response status:', achievementResponse.status);
      
      const achievementData = await achievementResponse.json();
      console.log('👤 [Profile] Response data:', achievementData);

      if (achievementData.success) {
        console.log('👤 [Profile] Stats:', achievementData.stats);
        console.log('👤 [Profile] Achievements:', achievementData.achievements.length);
        console.log('👤 [Profile] Unclaimed:', achievementData.unclaimedCount);
        
        setAchievements(achievementData.achievements);
        setStats(achievementData.stats);
        setUnclaimedCount(achievementData.unclaimedCount || 0);
      } else {
        console.error('👤 [Profile] API error:', achievementData.error);
      }
    } catch (error) {
      console.error('👤 [Profile] Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAchievement = async (achievementId: string) => {
    if (!fid) return;

    try {
      console.log('🎁 [Profile] Claiming achievement:', achievementId);
      
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fid, 
          action: 'claim',
          achievementId 
        })
      });

      const data = await response.json();
      console.log('🎁 [Profile] Claim response:', data);
      
      if (data.success) {
        console.log('🎁 [Profile] Claimed successfully:', achievementId);
        // Refresh achievements
        await fetchData();
      } else {
        console.error('🎁 [Profile] Claim failed:', data.error);
      }
    } catch (error) {
      console.error('🎁 [Profile] Failed to claim achievement:', error);
    }
  };

  const getAchievementLevel = () => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    
    if (unlockedCount >= 8) return { level: 'Legend', progress: 100, next: 'Max Level!' };
    if (unlockedCount >= 6) return { level: 'Master', progress: 75, next: '2 more to Legend' };
    if (unlockedCount >= 4) return { level: 'Expert', progress: 50, next: '2 more to Master' };
    if (unlockedCount >= 2) return { level: 'Novice', progress: 25, next: '2 more to Expert' };
    return { level: 'Newcomer', progress: 0, next: '2 to unlock Novice' };
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return num.toFixed(4);
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
              {farcasterLoading ? 'Connecting...' : 'Loading profile...'}
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
            <p className="text-gray-400 mb-6">Unable to load profile. Please use from Warpcast.</p>
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

  const achievementLevel = getAchievementLevel();
  const lockedCount = stats.totalCapsules - stats.revealedCapsules;

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

      <div className="relative z-10 p-6 max-w-2xl mx-auto">
        {/* Header with Settings */}
        <div className="flex items-center justify-between mb-8 fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 pulse">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                Profile
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                FID: {fid}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              createRipple(e);
              setShowSettingsModal(true);
            }}
            className="w-12 h-12 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl flex items-center justify-center transition-all"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Wallet Section */}
        {isConnected && address ? (
          <div className="mb-6 fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Connected Wallet</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm">{formatAddress(address)}</p>
                      <button
                        onClick={copyAddress}
                        className="p-1 hover:bg-[#0052FF]/10 rounded transition"
                      >
                        {copied ? (
                          <span className="text-xs text-green-400">✓</span>
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <WalletDropdown />
              </div>
              
              {balance && (
                <div className="pt-3 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Balance</span>
                    <span className="text-white font-bold">{formatBalance(balance)} ETH</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6 fade-in-up" style={{ animationDelay: '0.05s' }}>
            <button
              onClick={(e) => {
                createRipple(e);
                setShowWalletModal(true);
              }}
              className="w-full bg-gradient-to-r from-[#0052FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl hover:shadow-[#0052FF]/50 flex items-center justify-center gap-3"
            >
              <WalletIcon className="w-5 h-5" />
              Connect Wallet
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-4 hover:border-[#0052FF]/40 transition-all">
            <div className="w-10 h-10 bg-[#0052FF]/20 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-[#0052FF]" />
            </div>
            <p className="text-2xl font-black text-white mb-1">{stats.totalCapsules}</p>
            <p className="text-xs text-gray-400 font-medium">Total</p>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-cyan-500/20 rounded-2xl p-4 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white mb-1">{lockedCount}</p>
            <p className="text-xs text-gray-400 font-medium">Locked</p>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/20 rounded-2xl p-4 hover:border-green-500/40 transition-all">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
              <Unlock className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-black text-white mb-1">{stats.revealedCapsules}</p>
            <p className="text-xs text-gray-400 font-medium">Revealed</p>
          </div>
        </div>

        {/* Longest Lock */}
        <div className="mb-6 fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center pulse">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Longest Lock</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stats.longestDuration} Days
                  </p>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-purple-500/40" />
            </div>
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-lg">{achievementLevel.level}</p>
                  <p className="text-xs text-gray-400 font-medium">{achievementLevel.next}</p>
                </div>
              </div>
              {unclaimedCount > 0 && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse">
                  <p className="text-xs text-white font-black">{unclaimedCount} New!</p>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#1A1F2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${achievementLevel.progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500 font-bold">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </p>
              <p className="text-xs text-gray-500 font-bold">{achievementLevel.progress}%</p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-6 fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                reward={achievement.reward}
                rarity={achievement.rarity}
                unlocked={achievement.unlocked}
                claimed={achievement.claimed}
                progress={achievement.progress}
                max={achievement.max}
                onClaim={handleClaimAchievement}
              />
            ))}
          </div>
        </div>

        {/* Badge Showcase */}
        {achievements.filter(a => a.unlocked).length > 0 && (
          <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-cyan-400" />
                Badge Collection
              </h2>
            </div>
            <BadgeShowcase badges={achievements.filter(a => a.unlocked)} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showWalletModal && <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />}
      {showSettingsModal && <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />}

      <BottomNav />
    </div>
  );
}