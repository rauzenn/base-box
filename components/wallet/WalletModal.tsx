'use client';

import { useState } from 'react';
import { Wallet, X, AlertCircle } from 'lucide-react';
import { useWallet } from '@/hooks/usewallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectFarcasterWallet, connectExternalWallet, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleFarcasterConnect = async () => {
    try {
      setError(null);
      console.log('👆 [Modal] User clicked Farcaster wallet');
      
      await connectFarcasterWallet();
      localStorage.setItem('lastWalletType', 'farcaster');
      
      console.log('✅ [Modal] Farcaster wallet connected, closing modal');
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to connect Farcaster wallet';
      console.error('❌ [Modal] Farcaster connection failed:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleExternalConnect = async () => {
    try {
      setError(null);
      console.log('👆 [Modal] User clicked external wallet');
      
      await connectExternalWallet();
      localStorage.setItem('lastWalletType', 'external');
      
      console.log('✅ [Modal] External wallet connected, closing modal');
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to connect external wallet';
      console.error('❌ [Modal] External connection failed:', errorMessage);
      setError(errorMessage);
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
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
          <Wallet className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Choose a wallet to connect and access Base Box
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

        {/* Wallet Options */}
        <div className="space-y-4">
          {/* Farcaster Wallet */}
          <button
            onClick={handleFarcasterConnect}
            disabled={isConnecting}
            className="w-full flex items-center gap-4 p-5 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/30 hover:border-[#0052FF] rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-[#0052FF]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="32" height="32" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="1000" height="1000" fill="#0052FF"/>
                <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z" fill="white"/>
                <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="white"/>
                <path d="M675.556 746.667V253.333H853.333L882.222 351.111H906.667V746.667C918.94 746.667 928.889 756.616 928.889 768.889V795.556H933.333C945.606 795.556 955.556 805.505 955.556 817.778V844.444H706.667V817.778C706.667 805.505 716.616 795.556 728.889 795.556H733.333V768.889C733.333 756.616 723.384 746.667 711.111 746.667H675.556Z" fill="white"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-black text-white">Farcaster Wallet</h3>
              <p className="text-sm text-gray-400">
                {isConnecting ? 'Connecting...' : 'Connect with Farcaster'}
              </p>
            </div>
            {isConnecting ? (
              <div className="w-8 h-8">
                <div className="w-full h-full border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-[#0052FF]/30 group-hover:border-[#0052FF] transition-colors" />
            )}
          </button>

          {/* External Wallet (MetaMask/BaseApp) */}
          <button
            onClick={handleExternalConnect}
            disabled={isConnecting}
            className="w-full flex items-center gap-4 p-5 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/30 hover:border-[#0052FF] rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-[#0052FF]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8 text-[#0052FF]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-black text-white">External Wallet</h3>
              <p className="text-sm text-gray-400">
                {isConnecting ? 'Connecting...' : 'MetaMask, Coinbase, etc.'}
              </p>
            </div>
            {isConnecting ? (
              <div className="w-8 h-8">
                <div className="w-full h-full border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-[#0052FF]/30 group-hover:border-[#0052FF] transition-colors" />
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