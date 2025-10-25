'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      // Wait for SDK context
      const context = await sdk.context;
      console.log('✅ Farcaster SDK context:', context);
      
      // Signal ready
      sdk.actions.ready();
      console.log('✅ sdk.actions.ready() called!');
    };

    init();
  }, []);

  return <>{children}</>;
}