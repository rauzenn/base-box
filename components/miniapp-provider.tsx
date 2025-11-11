'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log('🔵 [MiniApp] Starting SDK initialization...');
        
        // CRITICAL: Wait for context first
        const context = await sdk.context;
        console.log('✅ [MiniApp] Context loaded:', context);
        
        // CRITICAL: Call ready() - this MUST happen
        sdk.actions.ready();
        console.log('✅ [MiniApp] ready() called successfully!');
        
        // Extra logging to verify
        console.log('📊 [MiniApp] SDK state:', {
          contextLoaded: !!context,
          readyCalled: true,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ [MiniApp] SDK initialization failed:', error);
        
        // Still call ready() even if context fails
        // This prevents splash screen from sticking
        try {
          sdk.actions.ready();
          console.log('⚠️ [MiniApp] ready() called in error handler');
        } catch (readyError) {
          console.error('❌ [MiniApp] ready() also failed:', readyError);
        }
      }
    };

    // Start initialization immediately
    initSDK();
  }, []);

  // Always render children immediately
  // Don't wait for SDK - let it initialize in background
  return <>{children}</>;
}