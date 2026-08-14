'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Lock, Unlock, Trophy, TrendingUp, Wallet as WalletIcon, Copy, Settings } from 'lucide-react';
import { useRipple } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';
import { useWallet } from '@/hooks/usewallet';
import { WalletModal } from '@/components/wallet/WalletModal';
import { WalletDropdown } from '@/components/wallet/WalletDropdown';
import { SettingsModal } from '@/components/settings/settingsmodal';

interface Stats {
  totalCapsules: number;
  revealedCapsules: number;
  longestDuration: number;
}

export default function ProfilePage() {
  // İstatistikler artık cüzdan adresine göre hesaplanıyor (fid değil).
  const { address, isConnected, balance } = useWallet();
  const createRipple = useRipple();
  const [stats, setStats] = useState<Stats>({
    totalCapsules: 0,
    revealedCapsules: 0,
    longestDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    fetchStats();
  }, [address]);

  const fetchStats = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/capsules/list?address=${address}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (data.success && data.capsules) {
        const totalCapsules = data.capsules.length;
        const revealedCapsules = data.capsules.filter(
          (c: any) => c.revealed || new Date(c.unlockDate) <= new Date()
        ).length;

        let longestDuration = 0;
        for (const c of data.capsules) {
          const created = new Date(c.createdAt);
          const unlock = new Date(c.unlockDate);
          const durationDays = Math.floor((unlock.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (durationDays > longestDuration) longestDuration = durationDays;
        }

        setStats({ totalCapsules, revealedCapsules, longestDuration });
      }
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading && address) {
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
            <p className="text-gray-400 font-bold">Loading profile...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-[#000814] pb-24">
        <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
        <div className="fixed inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 flex items-center justify-center h-screen px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-[#0052FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <WalletIcon className="w-8 h-8 text-[#0052FF]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Profilini görmek için cüzdanını bağla.</p>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0052FF] to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        {showWalletModal && <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />}
        <BottomNav />
      </div>
    );
  }

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
        <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
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
      </div>

      {/* Modals */}
      {showWalletModal && <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />}
      {showSettingsModal && <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />}

      <BottomNav />
    </div>
  );
}
