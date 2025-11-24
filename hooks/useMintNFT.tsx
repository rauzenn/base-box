'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, CHAIN_ID } from '@/lib/contracts/BaseBoxNFT';

interface MintResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useMintNFT() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Wagmi hooks for contract interaction
  const { 
    writeContract, 
    data: hash,
    isPending: isWritePending 
  } = useWriteContract();

  const { 
    isSuccess: isConfirmed,
    isLoading: isConfirming 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = useCallback(async (capsuleId: string): Promise<MintResult> => {
    try {
      setIsMinting(true);
      setError(null);
      setTxHash(null);

      console.log('🎨 [useMintNFT] Starting mint process...');
      console.log('🎨 [useMintNFT] Capsule ID:', capsuleId);

      // 1. Check wallet connection
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet first');
      }

      console.log('✅ [useMintNFT] Wallet connected:', address);

      // 2. Check/switch to correct network
      if (chain?.id !== CHAIN_ID) {
        console.log('⚠️ [useMintNFT] Wrong network, switching to Base...');
        
        try {
          await switchChain?.({ chainId: CHAIN_ID });
          console.log('✅ [useMintNFT] Switched to Base Mainnet');
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            throw new Error('Please add Base Mainnet to your wallet');
          }
          throw new Error('Please switch to Base Mainnet in your wallet');
        }
      }

      console.log('✅ [useMintNFT] Network correct:', CHAIN_ID);

      // 3. Check contract address
      if (!NFT_CONTRACT_ADDRESS) {
        throw new Error('NFT contract not deployed yet. Please check environment variables.');
      }

      console.log('🔵 [useMintNFT] Contract address:', NFT_CONTRACT_ADDRESS);

      // 4. Write contract (mint)
      console.log('🔵 [useMintNFT] Calling mint function...');
      
      const result = await writeContract({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_CONTRACT_ABI,
        functionName: 'mint',
        args: [BigInt(capsuleId)],
      });

      console.log('✅ [useMintNFT] Transaction sent');

      // Store hash for tracking
      if (hash) {
        setTxHash(hash);
        console.log('✅ [useMintNFT] Transaction hash:', hash);
      }

      // Wait for confirmation (handled by useWaitForTransactionReceipt)
      console.log('⏳ [useMintNFT] Waiting for confirmation...');

      return {
        success: true,
        txHash: hash || undefined,
      };

    } catch (err: any) {
      console.error('❌ [useMintNFT] Mint failed:', err);
      
      let errorMessage = 'Failed to mint NFT. Please try again.';
      
      if (err.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (err.message?.includes('already minted')) {
        errorMessage = 'This capsule has already been minted as an NFT';
      } else if (err.message?.includes('connect')) {
        errorMessage = 'Please connect your wallet first';
      } else if (err.message?.includes('switch')) {
        errorMessage = 'Please switch to Base Mainnet';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      // Don't set minting to false immediately
      // Let the transaction confirmation handle it
    }
  }, [address, isConnected, chain, switchChain, writeContract, hash]);

  // Monitor transaction confirmation
  if (isConfirmed && !isSuccess) {
    console.log('✅ [useMintNFT] Transaction confirmed!');
    setIsSuccess(true);
    setIsMinting(false);
  }

  // Update minting state based on write pending
  if (isWritePending && !isMinting) {
    setIsMinting(true);
  }

  return {
    mint,
    isMinting: isMinting || isWritePending || isConfirming,
    error,
    txHash: hash || txHash,
    isSuccess: isConfirmed || isSuccess,
  };
}