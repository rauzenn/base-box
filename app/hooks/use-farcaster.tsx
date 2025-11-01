'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function useFarcaster() {
  const [context, setContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        console.log('Farcaster context loaded:', ctx);
      } catch (error) {
        console.error('Failed to load Farcaster context:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return {
    context,
    isLoading,
    fid: context?.user?.fid || null,
    username: context?.user?.username || null,
    displayName: context?.user?.displayName || null,
    pfpUrl: context?.user?.pfpUrl || null,
    sdk,
  };
}