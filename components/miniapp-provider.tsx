'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log('🔄 Initializing Farcaster SDK...');
        
        // Wait for context to be available
        const context = await sdk.context;
        console.log('📱 Farcaster Context loaded:', context);
        
        // Call ready immediately after context is loaded
        await sdk.actions.ready({});
        console.log('✅ SDK ready() called successfully!');
      } catch (error) {
        console.error('❌ SDK initialization error:', error);
      }
    };

    initSDK();
  }, []);

  return <>{children}</>;
}