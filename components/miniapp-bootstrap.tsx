'use client';

import { useEffect } from 'react';

export function MiniAppBootstrap() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const isMini =
        url.pathname.startsWith('/mini') ||
        url.searchParams.get('miniApp') === 'true';

      if (isMini) {
        import('@farcaster/miniapp-sdk').then(({ default: sdk }) => {
          // Ensure Mini App host hides splash
          sdk.actions.ready();
        }).catch(() => {
          // noop
        });
      }
    } catch {
      // noop
    }
  }, []);

  return null;
}


