'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains'; // ← BASE MAINNET!
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi'; // ← WAGMI PROVIDER EKLENDI!

const queryClient = new QueryClient();

// Wagmi config - NFT minting için gerekli
const wagmiConfig = createConfig({
  chains: [base], // Base Mainnet
  transports: {
    [base.id]: http(), // Public RPC
  },
  ssr: true, // Next.js için
});

export function OnchainProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_CDP_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ CDP API Key bulunamadı.');
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          apiKey={apiKey}
          chain={base} // ← BASE MAINNET!
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}