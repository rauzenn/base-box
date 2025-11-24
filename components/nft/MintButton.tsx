'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useMintNFT } from '@/hooks/useMintNFT';
import { MintSuccessModal } from './MintSuccessModal';

interface MintButtonProps {
  capsuleId: string;
  capsuleData: {
    message: string;
    image?: string;
    unlockDate: string;
    createdAt: string;
  };
}

export function MintButton({ capsuleId, capsuleData }: MintButtonProps) {
  const { mint, isMinting, error, txHash, isSuccess } = useMintNFT();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Show success modal when transaction is confirmed
  useEffect(() => {
    if (isSuccess && txHash) {
      setShowSuccessModal(true);
    }
  }, [isSuccess, txHash]);

  const handleMint = async () => {
    try {
      console.log('🎨 [MintButton] Starting mint for capsule:', capsuleId);
      const result = await mint(capsuleId);
      
      if (result.success) {
        console.log('✅ [MintButton] Mint initiated!', result);
      }
    } catch (err) {
      console.error('❌ [MintButton] Mint failed:', err);
    }
  };

  // If already minted successfully, show success state
  if (isSuccess && txHash) {
    return (
      <>
        <button
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-bold shadow-xl transition-all"
          disabled
        >
          <CheckCircle className="w-5 h-5" />
          <span>NFT Minted Successfully!</span>
        </button>

        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-xl text-[#0052FF] font-bold hover:bg-[#0052FF]/10 transition-all mt-3"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on BaseScan</span>
        </a>

        <MintSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          txHash={txHash}
          capsuleId={capsuleId}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 rounded-2xl text-white font-bold shadow-xl hover:shadow-purple-500/50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isMinting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Minting NFT...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Mint as NFT</span>
          </>
        )}
      </button>

      {/* Minting Info */}
      <div className="p-4 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#0052FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#0052FF]" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1">Free NFT Minting</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mint your time capsule as an NFT on Base blockchain. 
              <span className="text-[#0052FF] font-bold"> Free minting</span> - only pay gas fees (~$0.01).
            </p>
          </div>
        </div>

        {/* Network Info */}
        <div className="mt-3 pt-3 border-t border-[#0052FF]/20 flex items-center justify-between text-xs">
          <span className="text-gray-500">Network</span>
          <span className="text-white font-bold">Base Mainnet</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Cost</span>
          <span className="text-green-400 font-bold">FREE + Gas (~$0.01)</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-400 mb-1">Minting Failed</p>
            <p className="text-xs text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Transaction Hash (during minting) */}
      {isMinting && txHash && (
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-[#0052FF] hover:text-cyan-400 transition-colors"
        >
          <span>View transaction</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}