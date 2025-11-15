'use client';

import { useEffect } from 'react';

export function MiniAppBootstrap() {
  useEffect(() => {
    const run = async () => {
      try {
        const mod = await import('@farcaster/miniapp-sdk');
        const sdk = (mod as any).sdk ?? (mod as any).default ?? mod;
        if (sdk?.actions?.ready) {
          await sdk.actions.ready();
        }
      } catch {
        // noop
      }
    };
    run();
  }, []);

  return null;
}


