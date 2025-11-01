'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Load context
        await sdk.context;
        
        // Call ready - this is critical!
        sdk.actions.ready();
        
        console.log('✅ SDK Ready');
        setIsReady(true);
      } catch (error) {
        console.error('SDK Error:', error);
        setIsReady(true); // Still render app
      }
    };

    initSDK();
  }, []);

  // No loading screen - let it load instantly
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}