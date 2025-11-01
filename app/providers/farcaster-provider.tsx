'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Wait for SDK context
        const context = await sdk.context;
        console.log('✅ Farcaster SDK loaded:', context);
        
        // Signal ready - try multiple times if needed
        try {
          await sdk.actions.ready();
          console.log('✅ Ready signal sent');
        } catch (readyError) {
          console.warn('⚠️ Ready call failed, trying again:', readyError);
          // Try one more time
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('✅ Ready signal sent (retry)');
            } catch (e) {
              console.error('❌ Ready failed after retry:', e);
            }
          }, 500);
        }
        
        setIsSDKLoaded(true);
        console.log('🎉 Base Box initialized!');
      } catch (error) {
        console.error('❌ SDK initialization failed:', error);
        // Still render app
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#000814' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #0052FF', 
            borderTop: '4px solid transparent', 
            borderRadius: '50%', 
            margin: '0 auto 16px', 
            animation: 'spin 1s linear infinite' 
          }} />
          <h2 style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '8px' 
          }}>
            Base Box
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Initializing Farcaster...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}