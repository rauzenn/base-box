'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';

interface FarcasterContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
}

/**
 * Custom hook to get Farcaster user context
 * Returns real FID and user information from the SDK
 */
export function useFarcaster() {
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        console.log('🔄 Loading Farcaster context...');
        
        // Get context from SDK
        const ctx = await sdk.context;
        console.log('✅ Context loaded:', ctx);
        
        setContext(ctx);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Failed to load Farcaster context:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    loadContext();
  }, []);

  return {
    // User data
    fid: context?.user?.fid || null,
    username: context?.user?.username || null,
    displayName: context?.user?.displayName || null,
    pfpUrl: context?.user?.pfpUrl || null,
    
    // Full context
    context,
    
    // States
    isLoading,
    error,
  };
}