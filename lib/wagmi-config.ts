// Base'in resmi wagmi kurulum standardına göre yapılandırılmış cüzdan
// katmanı. Referans: docs.base.org/base-account/framework-integrations/wagmi/setup
//
// - baseAccount: Base App içindeki gömülü cüzdan / Base Account (akıllı
//   cüzdan, passkey tabanlı). Base App'in kendi tarayıcısında ve normal
//   tarayıcıda "Sign in with Base" akışıyla çalışır.
// - injected: Kullanıcının tarayıcısına yüklediği MetaMask, Coinbase Wallet
//   uzantısı gibi standart EIP-1193 cüzdanlar için.
//
// multiInjectedProviderDiscovery: false — Base'in kendi dokümantasyonundaki
// önerilen ayar; birden fazla injected cüzdan aynı anda algılanıp çakışmasın
// diye kapatılıyor, bağlantı injected() connector'ı üzerinden açıkça yapılıyor.
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

export function getWagmiConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    multiInjectedProviderDiscovery: false,
    connectors: [
      baseAccount({
        appName: 'Base Box',
      }),
      injected(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL || undefined),
      [baseSepolia.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getWagmiConfig>;
  }
}
