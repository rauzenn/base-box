'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const load = async () => {
      try {
        // Wait for SDK to be ready
        await sdk.context;
        
        // Call ready IMMEDIATELY
        sdk.actions.ready();
        
        console.log('✅ SDK ready called!');
      } catch (error) {
        console.error('❌ SDK error:', error);
      }
    };

    load();
  }, []);

  return <>{children}</>;
}