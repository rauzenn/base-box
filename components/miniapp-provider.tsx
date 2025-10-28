'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        // Check if in miniapp
        const isInMiniApp = await sdk.isInMiniApp();
        console.log('✅ Is in Mini App:', isInMiniApp);
        
        if (isInMiniApp) {
          // Get context
          const context = await sdk.context;
          console.log('✅ SDK Context loaded:', context);
          
          // Signal ready
          sdk.actions.ready();
          console.log('✅ sdk.actions.ready() called!');
        } else {
          console.log('ℹ️ Not in Mini App - running in web browser');
        }
      } catch (error) {
        console.error('❌ SDK initialization error:', error);
      }
    };

    init();
  }, []);

  return <>{children}</>;
}