'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function OnchainProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_CDP_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ CDP API Key bulunamadı.');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider 
        apiKey={apiKey}
        chain={baseSepolia}
      >
        {children}
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}