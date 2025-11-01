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
        
        // AWAIT ready call
        await sdk.actions.ready({});
        
        setIsSDKLoaded(true);
        console.log('🎉 Base Box is ready!');
      } catch (error) {
        console.error('❌ Failed to load Farcaster SDK:', error);
        // Still mark as loaded even on error
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000814' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #0052FF', borderTop: '4px solid transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Base Box</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}