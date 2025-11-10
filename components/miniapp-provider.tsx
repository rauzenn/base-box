'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log('🔄 Initializing Farcaster SDK...');
        
        // Wait for SDK context
        const context = await sdk.context;
        console.log('📱 Context loaded:', context);
        
        // Call ready - CRITICAL!
        sdk.actions.ready();
        console.log('✅ SDK ready() called successfully!');
        
        setIsSDKLoaded(true);
      } catch (error) {
        console.error('❌ SDK initialization failed:', error);
        // Still set loaded to true to show app
        setIsSDKLoaded(true);
      }
    };

    initializeSDK();
  }, []);

  // Don't render children until SDK is ready
  if (!isSDKLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000814',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '4px solid #0052FF',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return <>{children}</>;
}