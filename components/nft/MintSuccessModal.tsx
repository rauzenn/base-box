'use client';

import { X, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface MintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  capsuleId: string;
}

export function MintSuccessModal({ isOpen, onClose, txHash, capsuleId }: MintSuccessModalProps) {
  // Confetti effect on open
  useEffect(() => {
    if (isOpen) {
      // Create confetti
      const colors = ['#0052FF', '#00D395', '#FF00FF', '#FFD700'];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-[#0A0E14] border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl shadow-[#0052FF]/20 slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center mb-2">
          NFT Minted! 🎉
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Your time capsule is now onchain forever
        </p>

        {/* NFT Info */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Capsule ID</span>
              <span className="text-white font-bold">#{capsuleId}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Network</span>
              <span className="text-[#0052FF] font-bold">Base Mainnet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Sparkles Decoration */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Your NFT is permanent on Base</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-bold transition-all shadow-lg"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View on BaseScan</span>
          </a>

          <a
            href={`https://opensea.io/assets/base/${contractAddress}/${capsuleId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/30 hover:border-[#0052FF] rounded-xl text-white font-bold transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>View on OpenSea</span>
          </a>

          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-[#0A0E14] border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl text-gray-400 hover:text-white font-bold transition-all"
          >
            Close
          </button>
        </div>

        {/* Share Message */}
        <p className="text-xs text-center text-gray-500 mt-6">
          🎉 Share your Base Box NFT on Farcaster!
        </p>
      </div>
    </div>
  );
}