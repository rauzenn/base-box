'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Mini App SDK
    sdk.actions.ready();
    console.log('🚀 Mini App SDK initialized');
  }, []);

  return <>{children}</>;
}