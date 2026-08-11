'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';

interface FarcasterContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
}

const LOCAL_ID_KEY = 'baseBoxLocalId';
const CONTEXT_TIMEOUT_MS = 1500;

// Base App / Warpcast dışında (normal tarayıcıda) sdk.context hiç cevap
// vermeyebilir. Bu durumda kullanıcıya kalıcı bir yerel kimlik atıyoruz,
// böylece uygulama Farcaster olmadan da normal şekilde çalışabiliyor.
function getOrCreateLocalId(): number {
  if (typeof window === 'undefined') return 0;
  const stored = window.localStorage.getItem(LOCAL_ID_KEY);
  if (stored) return parseInt(stored, 10);
  const id = 1000000 + Math.floor(Math.random() * 8999999);
  window.localStorage.setItem(LOCAL_ID_KEY, String(id));
  return id;
}

/**
 * Custom hook to get Farcaster user context.
 * Base App / Warpcast içinde açılırsa gerçek fid ve kullanıcı bilgisini döner.
 * Normal tarayıcıda açılırsa (Farcaster context gelmezse) 1.5 saniye içinde
 * yerel bir kimliğe düşer, böylece uygulama hiçbir zaman sonsuz "loading"
 * durumunda kalmaz.
 */
export function useFarcaster() {
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadContext = async () => {
      try {
        const ctx = await Promise.race([
          sdk.context,
          new Promise<any>((resolve) =>
            setTimeout(() => resolve(null), CONTEXT_TIMEOUT_MS)
          ),
        ]);

        if (cancelled) return;

        if (ctx?.user?.fid) {
          console.log('✅ Farcaster context loaded:', ctx);
          setContext(ctx);
        } else {
          console.log('ℹ️ Farcaster context yok, yerel kimlik kullanılıyor');
          setContext({ user: { fid: getOrCreateLocalId() } });
        }
      } catch (err) {
        if (cancelled) return;
        console.log('ℹ️ Farcaster context alınamadı, yerel kimlik kullanılıyor');
        setError(err as Error);
        setContext({ user: { fid: getOrCreateLocalId() } });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadContext();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    // User data
    fid: context?.user?.fid || null,
    username: context?.user?.username || null,
    displayName: context?.user?.displayName || null,
    pfpUrl: context?.user?.pfpUrl || null,

    // Full context
    context,

    // States
    isLoading,
    error,
  };
}

export default useFarcaster;
