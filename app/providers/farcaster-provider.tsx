'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('🔄 Initializing Farcaster SDK...');
        
        // CRITICAL: Call ready() FIRST, before accessing context
        await sdk.actions.ready();
        console.log('✅ Ready signal sent successfully!');
        
        // Now access context (no await needed in newer SDK)
        const context = sdk.context;
        console.log('✅ Farcaster context:', context);
        
        setIsSDKLoaded(true);
        console.log('🎉 Base Box initialized!');
      } catch (error) {
        console.error('❌ SDK initialization failed:', error);
        
        // Fallback: Try ready() one more time
        try {
          console.log('🔄 Retrying ready() call...');
          await sdk.actions.ready();
          console.log('✅ Ready signal sent on retry!');
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
        }
        
        // Still render app even if SDK fails
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
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
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