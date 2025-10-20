'use client';

import React from 'react';
import { Sparkles, Gift, Unlock, Download, Share2, ExternalLink } from 'lucide-react';

interface Capsule {
  id: number;
  tokenId: string;
  message: string;
  unlockDate: string;
  createdAt: string;
}

interface RevealModalProps {
  capsule: Capsule | null;
  isRevealing: boolean;
  revealed: boolean;
  onClose: () => void;
}

export function RevealModal({ capsule, isRevealing, revealed, onClose }: RevealModalProps) {
  if (!capsule) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {isRevealing ? (
          <div className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-[#0052FF] rounded-full animate-ping opacity-75" />
              <div className="absolute inset-4 border-4 border-[#00D395] rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-8 border-4 border-[#FFD700] rounded-full animate-ping opacity-25" style={{ animationDelay: '0.4s' }} />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Gift className="w-32 h-32 text-[#0052FF] animate-bounce" />
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4">Revealing...</h2>
            <p className="text-gray-400">Unlocking your time capsule NFT</p>
          </div>
        ) : revealed ? (
          <div className="bg-gradient-to-br from-[#0A0E14] to-[#001428] rounded-3xl border-2 border-[#0052FF]/50 overflow-hidden">
            <div className="p-8 text-center border-b border-[#0052FF]/20">
              <div className="inline-flex items-center gap-3 bg-[#00D395]/10 px-6 py-3 rounded-full mb-4">
                <Sparkles className="w-6 h-6 text-[#00D395]" />
                <span className="text-[#00D395] font-bold text-lg">NFT Minted Successfully!</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                Time Capsule {capsule.tokenId}
              </h2>
              <p className="text-gray-400">Your moment preserved on Base blockchain</p>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-br from-[#0052FF]/20 to-[#00D395]/20 rounded-2xl p-8 mb-6">
                <div className="aspect-square bg-[#0A0E14] rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Unlock className="w-24 h-24 text-[#00D395] mx-auto mb-4" />
                    <div className="text-white font-black text-6xl mb-2">{capsule.tokenId}</div>
                    <div className="text-[#0052FF] font-bold">BASE BOX CAPSULE</div>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-xl p-6">
                  <p className="text-white text-center italic">&quot;{capsule.message}&quot;</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-gray-500 text-sm mb-1">Token ID</div>
                  <div className="text-white font-bold">{capsule.tokenId}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-gray-500 text-sm mb-1">Network</div>
                  <div className="text-[#0052FF] font-bold">Base</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-gray-500 text-sm mb-1">Unlocked</div>
                  <div className="text-white font-bold">{capsule.unlockDate}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-gray-500 text-sm mb-1">Standard</div>
                  <div className="text-white font-bold">ERC-721</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 bg-[#0052FF] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all">
                  <Download className="w-5 h-5" />
                  Save
                </button>
                <button className="flex items-center justify-center gap-2 bg-black/50 text-white py-3 rounded-xl font-bold hover:bg-black/70 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="flex items-center justify-center gap-2 bg-black/50 text-white py-3 rounded-xl font-bold hover:bg-black/70 transition-all">
                  <ExternalLink className="w-5 h-5" />
                  View
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#00D395]/10 border-t border-[#00D395]/20">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white py-3 rounded-xl font-bold"
              >
                Back to Capsules
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}