'use client';

import { ReactNode, useState } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type State } from 'wagmi';
import { getWagmiConfig } from '@/lib/wagmi-config';

interface OnchainProviderProps {
  children: ReactNode;
  // Sunucuda cookie'den okunan wagmi durumu (bağlı cüzdan, seçili connector vb.)
  // Bu sayede sayfa yenilendiğinde ya da uygulama yeniden açıldığında
  // kullanıcı tekrar "Connect Wallet"a basmak zorunda kalmadan otomatik
  // olarak yeniden bağlanır (spec'te istenen "reconnect" davranışı).
  initialState?: State;
}

export function OnchainProvider({ children, initialState }: OnchainProviderProps) {
  const [config] = useState(() => getWagmiConfig());
  const [queryClient] = useState(() => new QueryClient());
  const apiKey = process.env.NEXT_PUBLIC_CDP_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ CDP API Key bulunamadı (NEXT_PUBLIC_CDP_API_KEY).');
  }

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={apiKey} chain={base}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
