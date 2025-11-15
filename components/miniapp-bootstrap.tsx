'use client';

import { useEffect } from 'react';

export function MiniAppBootstrap() {
  useEffect(() => {
    try {
      import('@farcaster/miniapp-sdk')
        .then((mod) => {
          const sdk = (mod as any).default ?? (mod as any).sdk ?? mod;
          // Ensure Mini App host hides splash as soon as app mounts
          if (sdk?.actions?.ready) {
            // Not awaiting is fine; host will accept the signal
            sdk.actions.ready();
          }
        })
        .catch(() => {
          // noop
        });
    } catch {
      // noop
    }
  }, []);

  return null;
}


