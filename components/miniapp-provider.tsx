'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        // Wait for SDK context
        const context = await sdk.context;
        console.log('✅ Farcaster SDK context loaded:', context);
        
        // Signal ready to parent
        sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called!');
      } catch (error) {
        console.error('❌ SDK initialization error:', error);
        // Still signal ready even on error for web preview
        try {
          sdk.actions.ready();
        } catch {}
      }
    };

    init();
  }, []);

  return <>{children}</>;
}