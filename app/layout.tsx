import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import './globals.css';
import { FarcasterProvider } from '@/app/providers/farcaster-provider';
import { OnchainProvider } from './providers/onchain-provider'; 
import { ThemeProvider } from '@/context/ThemeContext';
import { getWagmiConfig } from '@/lib/wagmi-config';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const baseUrl = 'https://basebox.vercel.app';

export const metadata: Metadata = {
  title: 'Base Box - Onchain Time Capsules',
  description: 'Lock your memories onchain. Set unlock dates from 1 hour to 1 year. Built on Base.',
  metadataBase: new URL(baseUrl),
  
  openGraph: {
    title: 'Base Box - Time Capsules',
    description: 'Lock memories onchain on Base',
    url: baseUrl,
    siteName: 'Base Box',
    images: [{ url: '/og-image.png', width: 1200, height: 800 }],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box',
    description: 'Lock memories onchain',
    images: ['/og-image.png'],
  },
  
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const embedJson = `{"version":"next","imageUrl":"${baseUrl}/embed-image.png","button":{"title":"Launch Base Box","action":{"type":"launch_frame","name":"Base Box","url":"${baseUrl}","splashImageUrl":"${baseUrl}/splash.png","splashBackgroundColor":"#000814"}}}`;

  // Kullanıcı daha önce cüzdanını bağlamışsa (cookie'de tutulan wagmi
  // durumu üzerinden), sayfa ilk yüklendiğinde sunucu tarafında bu bilgiyi
  // okuyup client'a aktarıyoruz. Böylece "Connect Wallet" ekranı bir anlığına
  // yanıp sönmüyor, kullanıcı yeniden bağlanmak zorunda kalmıyor.
  const wagmiInitialState = cookieToInitialState(
    getWagmiConfig(),
    (await headers()).get('cookie')
  );

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* ⭐ BASE APP VERIFICATION - CRITICAL FOR LAUNCH ⭐ */}
        <meta name="base:app_id" content="697d2228e3ab76ae45abd7be" />
        <meta name="base:theme" content="dark" />
        <meta name="base:image" content="https://basebox.vercel.app/icon.png" />
        
        {/* Farcaster MiniApp Metadata — Base App bunu artık okumuyor (bkz.
            docs.base.org/apps/guides/migrate-to-standard-web-app), ama
            uygulama Warpcast gibi Farcaster istemcilerinden de açılırsa
            diye zararsız bir şekilde bırakıldı. */}
        <meta name="fc:miniapp" content={embedJson} />
        <meta name="fc:frame" content={embedJson} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <OnchainProvider initialState={wagmiInitialState}>
            <FarcasterProvider>
              {children}
            </FarcasterProvider>
          </OnchainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}