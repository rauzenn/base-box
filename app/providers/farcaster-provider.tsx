'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        console.log('✅ Farcaster SDK loaded:', context);
        sdk.actions.setTheme('dark');
        sdk.actions.ready();
        setIsSDKLoaded(true);
        console.log('🎉 Base Box is ready!');
      } catch (error) {
        console.error('❌ Failed to load Farcaster SDK:', error);
        setIsSDKLoaded(true);
      }
    };
    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000814]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0052FF] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">Base Box</h2>
          <p className="text-white/60">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}