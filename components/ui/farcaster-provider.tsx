"use client";

import { createContext, useContext, useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";

type FarcasterUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type FarcasterContextType = {
  user: FarcasterUser | null;
  isLoading: boolean;
  isSDKLoaded: boolean;
};

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isLoading: true,
  isSDKLoaded: false,
});

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const context = await sdk.context;
        setIsSDKLoaded(true);

        if (context?.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
          });
        }
      } catch (error) {
        console.log("SDK context not available (dev mode OK)");
      } finally {
        setIsLoading(false);
      }
    };

    initSDK();
  }, []);

  return (
    <FarcasterContext.Provider value={{ user, isLoading, isSDKLoaded }}>
      {children}
    </FarcasterContext.Provider>
  );
}

// ✅ EXPORT HOOK
export function useFarcasterContext() {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error("useFarcasterContext must be used within FarcasterProvider");
  }
  return context;
}