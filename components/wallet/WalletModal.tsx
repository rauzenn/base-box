'use client';

import { useState } from 'react';
import { Wallet, X, AlertCircle } from 'lucide-react';
import { useWallet } from '@/hooks/usewallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting, hasInjected } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<'baseAccount' | 'injected' | null>(null);

  const handleConnect = async (preferred: 'baseAccount' | 'injected') => {
    try {
      setError(null);
      setPending(preferred);
      await connect(preferred);
      onClose();
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to connect wallet';
      console.error('❌ [Modal] Connection failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setPending(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-[#0A0E14] border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl shadow-[#0052FF]/20 slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0052FF] to-cyan-500 rounded-3xl flex items-center justify-center">
          <Wallet className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Choose how you want to connect to Base Box
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-400 mb-1">Connection Failed</p>
              <p className="text-xs text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-3">
          {/* Base Account — primary, works everywhere (Base App + normal browser via passkey) */}
          <button
            onClick={() => handleConnect('baseAccount')}
            disabled={isConnecting}
            className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-[#0052FF]/20 to-cyan-500/10 hover:from-[#0052FF]/30 hover:to-cyan-500/20 border-2 border-[#0052FF] rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-[#0052FF] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-black text-white">Sign in with Base</h3>
              <p className="text-sm text-gray-400">
                {pending === 'baseAccount' ? 'Connecting...' : 'Base App or Base Account'}
              </p>
            </div>
            {pending === 'baseAccount' ? (
              <div className="w-8 h-8">
                <div className="w-full h-full border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-[#0052FF]/30 group-hover:border-[#0052FF] transition-colors" />
            )}
          </button>

          {/* Injected wallet — MetaMask, Coinbase Wallet extension, etc. */}
          <button
            onClick={() => handleConnect('injected')}
            disabled={isConnecting}
            className="w-full flex items-center gap-4 p-5 bg-[#1A1F2E] hover:bg-[#0052FF]/10 border-2 border-gray-700 hover:border-[#0052FF]/50 rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-[#0052FF]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-black text-white">Other Wallet</h3>
              <p className="text-sm text-gray-400">
                {pending === 'injected'
                  ? 'Connecting...'
                  : hasInjected
                  ? 'MetaMask, Coinbase Wallet extension...'
                  : 'No browser wallet detected'}
              </p>
            </div>
            {pending === 'injected' ? (
              <div className="w-8 h-8">
                <div className="w-full h-full border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-gray-700 group-hover:border-[#0052FF]/50 transition-colors" />
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By connecting your wallet, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
