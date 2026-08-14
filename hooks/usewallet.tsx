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

      console.log('🔵 [Wallet] Starting Farcaster wallet connection...');

      // Wait for SDK to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get Ethereum provider from Farcaster SDK
      const provider = sdk.wallet.ethProvider;
      
      console.log('🔵 [Wallet] Provider status:', {
        exists: !!provider,
        type: typeof provider,
        methods: provider ? Object.keys(provider) : []
      });
      
      if (!provider) {
        throw new Error('Farcaster wallet provider not available. Make sure you are in a Farcaster client.');
      }

      console.log('🔵 [Wallet] Requesting accounts...');

      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      console.log('🔵 [Wallet] Accounts:', accounts);

      const address = accounts[0];
      console.log('✅ [Wallet] Account connected:', address);

      // Get balance
      const balanceHex = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      console.log('🔵 [Wallet] Balance (hex):', balanceHex);
      
      const balanceInEth = formatEther(BigInt(balanceHex));
      console.log('✅ [Wallet] Balance (ETH):', balanceInEth);

      setWallet({
        address,
        balance: balanceInEth,
        isConnected: true,
        isConnecting: false,
        provider,
      });

      console.log('✅ [Wallet] Wallet state updated successfully');

      return address;
    } catch (error) {
      console.error('❌ [Wallet] Farcaster wallet connection failed:', error);
      console.error('❌ [Wallet] Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  // Connect external wallet (MetaMask, etc.)
  const connectExternalWallet = useCallback(async () => {
    try {
      setWallet(prev => ({ ...prev, isConnecting: true }));

      console.log('🟢 [Wallet] Starting external wallet connection...');

      if (!window.ethereum) {
        throw new Error('No external wallet found. Please install MetaMask or another Web3 wallet.');
      }

      console.log('🟢 [Wallet] External wallet detected:', {
        isMetaMask: window.ethereum.isMetaMask,
        chainId: window.ethereum.chainId,
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('🟢 [Wallet] Accounts:', accounts);

      const address = accounts[0];
      console.log('✅ [Wallet] External wallet connected:', address);

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      console.log('🟢 [Wallet] Balance (hex):', balanceHex);
      
      const balanceInEth = formatEther(BigInt(balanceHex));
      console.log('✅ [Wallet] Balance (ETH):', balanceInEth);

      setWallet({
        address,
        balance: balanceInEth,
        isConnected: true,
        isConnecting: false,
        provider: window.ethereum,
      });

      console.log('✅ [Wallet] Wallet state updated successfully');

      return address;
    } catch (error) {
      console.error('❌ [Wallet] External wallet connection failed:', error);
      console.error('❌ [Wallet] Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    console.log('🔴 [Wallet] Disconnecting wallet...');
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
      provider: null,
    });
    localStorage.removeItem('lastWalletType');
    console.log('✅ [Wallet] Disconnected successfully');
  }, []);

  // Auto-connect on mount (if previously connected)
  useEffect(() => {
    const lastWalletType = localStorage.getItem('lastWalletType');
    
    if (lastWalletType === 'farcaster') {
      console.log('🔄 [Wallet] Auto-connecting Farcaster wallet...');
      connectFarcasterWallet().catch(err => {
        console.error('❌ [Wallet] Auto-connect failed:', err);
        localStorage.removeItem('lastWalletType');
      });
    } else if (lastWalletType === 'external') {
      console.log('🔄 [Wallet] Auto-connecting external wallet...');
      connectExternalWallet().catch(err => {
        console.error('❌ [Wallet] Auto-connect failed:', err);
        localStorage.removeItem('lastWalletType');
      });
    }
  }, [connectFarcasterWallet, connectExternalWallet]);

  // Bağlı cüzdanla bir mesaj imzalar. Capsule oluşturma gibi işlemlerde
  // "bu adres gerçekten senin" kanıtı olarak backend'e gönderilir.
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!wallet.provider || !wallet.address) {
      throw new Error('Wallet not connected');
    }

    const signature = await wallet.provider.request({
      method: 'personal_sign',
      params: [message, wallet.address],
    });

    return signature as string;
  }, [wallet.provider, wallet.address]);

  return {
    ...wallet,
    connectFarcasterWallet,
    connectExternalWallet,
    disconnect,
    signMessage,
  };
}