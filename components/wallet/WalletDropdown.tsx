'use client';

import { useState, useRef, useEffect } from 'react';
import { Wallet, Copy, LogOut, ChevronDown, Check } from 'lucide-react';
import { useWallet } from '@/hooks/usewallet';
import { useFarcaster } from '@/hooks/use-farcaster';

export function WalletDropdown() {
  const { address, balance, disconnect } = useWallet();
  const { context } = useFarcaster();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('lastWalletType');
    setIsOpen(false);
  };

  if (!address) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Wallet Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#0052FF]/20 hover:bg-[#0052FF]/30 border-2 border-[#0052FF]/30 hover:border-[#0052FF] rounded-xl transition-all"
      >
        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full" />
        <span className="text-white font-bold text-sm">{formatAddress(address)}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0A0E14] border-2 border-[#0052FF]/30 rounded-2xl shadow-2xl shadow-[#0052FF]/20 overflow-hidden animate-slide-up z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0052FF]/10 to-purple-500/10 border-b-2 border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full" />
              <div className="flex-1">
                <h3 className="text-white font-black text-lg">Wallet Connected</h3>
                <p className="text-sm text-gray-400">Connected with Farcaster wallet</p>
              </div>
            </div>

            {/* User Info (if Farcaster context available) */}
            {context?.user && (
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Display Name</p>
                  <p className="text-white font-bold">{context.user.displayName || 'Unnamed'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Username</p>
                  <p className="text-blue-400 font-bold">@{context.user.username || 'unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Farcaster ID</p>
                  <p className="text-white font-bold">{context.user.fid}</p>
                </div>
              </div>
            )}

            {/* Balance */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Balances</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-xs font-bold">≡</span>
                  <span className="text-white text-sm font-bold">{parseFloat(balance || '0').toFixed(4)} ETH</span>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Wallet Address</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-mono">{formatAddress(address)}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-[#0052FF]/20 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="p-4">
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 font-bold rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}