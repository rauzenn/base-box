'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        console.log('🔄 [MiniApp] Initializing SDK...');

        // Signal host immediately to hide splash; do not block on context
        try {
          await sdk.actions.ready();
        } catch (_) {
          // ignore
        }

        // Then best-effort context load (optional)
        try {
          const context = await sdk.context;
          console.log('📱 [MiniApp] Context loaded:', context);
        } catch (err) {
          console.log('ℹ️ [MiniApp] Context not available yet:', err);
        }

        if (!mounted) return;
        console.log('✅ [MiniApp] SDK ready() called!');

        // Mark UI as ready regardless
        setIsReady(true);
      } catch (error) {
        console.error('❌ [MiniApp] Init error:', error);
        // Still mark as ready to show app
        if (mounted) setIsReady(true);
      }
    };

    // Small delay to ensure iframe is ready
    const timer = setTimeout(init, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Show loading while initializing
  if (!isReady) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000814',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #0052FF',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            Initializing...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}