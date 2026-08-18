'use client';

import { useCallback, useMemo } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSignMessage,
} from 'wagmi';
import { formatEther } from 'viem';

// Base App artık Farcaster Mini App altyapısını kullanmıyor (9 Nisan 2026'dan
// beri). Cüzdan katmanı artık tamamen wagmi üzerinden yürüyor:
//   WagmiProvider → Base chain → baseAccount connector + injected connector
//                 → useAccount() → wallet address = kullanıcı kimliği
//
// Bu hook, sayfa bileşenlerinin kullandığı API'yi (address, isConnected,
// balance, connect, disconnect, signMessage) DEĞİŞTİRMEDEN wagmi'ye
// bağlıyor — böylece create/capsules/reveals/profile sayfalarının hiçbiri
// tekrar dokunulmaya gerek kalmadan gerçek wagmi altyapısını kullanıyor.
export function useWallet() {
  const { address, isConnected, isConnecting: isAccountConnecting, isReconnecting, chain, chainId } = useAccount();
  const { connectAsync, connectors, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const { data: balanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const baseAccountConnector = useMemo(
    () => connectors.find((c) => c.id === 'baseAccount'),
    [connectors]
  );
  const injectedConnector = useMemo(
    () => connectors.find((c) => c.id === 'injected'),
    [connectors]
  );

  // preferred: 'baseAccount' (varsayılan, Base App / "Sign in with Base")
  //            'injected' (MetaMask, Coinbase Wallet uzantısı vb.)
  const connect = useCallback(
    async (preferred: 'baseAccount' | 'injected' = 'baseAccount') => {
      const connector =
        (preferred === 'injected' ? injectedConnector : baseAccountConnector) ??
        connectors[0];

      if (!connector) {
        throw new Error('Hiçbir cüzdan bağlayıcısı bulunamadı.');
      }

      const result = await connectAsync({ connector });
      return result.accounts[0];
    },
    [baseAccountConnector, injectedConnector, connectors, connectAsync]
  );

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!address) {
        throw new Error('Wallet not connected');
      }
      return signMessageAsync({ message });
    },
    [address, signMessageAsync]
  );

  return {
    address: address ?? null,
    isConnected,
    isConnecting: isAccountConnecting || isConnectPending || isReconnecting,
    balance: balanceData ? formatEther(balanceData.value) : null,
    chainId: chainId ?? chain?.id ?? null,
    chainName: chain?.name ?? null,
    connectError: connectError?.message ?? null,
    hasBaseAccount: !!baseAccountConnector,
    hasInjected: !!injectedConnector,
    connect,
    disconnect,
    signMessage,
  };
}
