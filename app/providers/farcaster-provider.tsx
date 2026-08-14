'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

// Base App / Warpcast içinde açılırsa splash ekranını kapatır (ready sinyali).
// Normal bir tarayıcıda hiçbir etkisi yoktur ve sessizce geçilir.
// Uygulama içeriği hiçbir koşulda bu sinyali beklemek için bloklanmaz.
export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    sdk.actions.ready().catch(() => {
      // Farcaster/Base App host'u yoksa (normal tarayıcı) burası tetiklenir, görmezden gel.
    });
  }, []);

  return <>{children}</>;
}