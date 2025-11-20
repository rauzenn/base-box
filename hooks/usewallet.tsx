'use client';

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import { formatEther } from 'viem';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    provider: null,
  });

  // Get Farcaster wallet provider
  const connectFarcasterWallet = useCallback(async () => {
    try {
      setWallet(prev => ({ ...prev, isConnecting: true }));

      // Get Ethereum provider from Farcaster SDK
      const provider = sdk.wallet.ethProvider;
      
      if (!provider) {
        throw new Error('Farcaster wallet provider not available');
      }

      console.log('🔵 Starting Farcaster wallet connection...');

      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      console.log('✅ Account connected:', address);

      // Get balance
      const balanceHex = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      const balanceInEth = formatEther(BigInt(balanceHex));

      setWallet({
        address,
        balance: balanceInEth,
        isConnected: true,
        isConnecting: false,
        provider,
      });

      return address;
    } catch (error) {
      console.error('❌ Farcaster wallet connection failed:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  // Connect external wallet (MetaMask, etc.)
  const connectExternalWallet = useCallback(async () => {
    try {
      setWallet(prev => ({ ...prev, isConnecting: true }));

      if (!window.ethereum) {
        throw new Error('No external wallet found');
      }

      console.log('🟢 Starting external wallet connection...');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      console.log('✅ External wallet connected:', address);

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      const balanceInEth = formatEther(BigInt(balanceHex));

      setWallet({
        address,
        balance: balanceInEth,
        isConnected: true,
        isConnecting: false,
        provider: window.ethereum,
      });

      return address;
    } catch (error) {
      console.error('❌ External wallet connection failed:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    console.log('🔴 Disconnecting wallet...');
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
      provider: null,
    });
  }, []);

  // Auto-connect on mount (if previously connected)
  useEffect(() => {
    const lastWalletType = localStorage.getItem('lastWalletType');
    
    if (lastWalletType === 'farcaster') {
      connectFarcasterWallet().catch(console.error);
    } else if (lastWalletType === 'external') {
      connectExternalWallet().catch(console.error);
    }
  }, [connectFarcasterWallet, connectExternalWallet]);

  return {
    ...wallet,
    connectFarcasterWallet,
    connectExternalWallet,
    disconnect,
  };
}