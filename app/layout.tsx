import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MiniAppProvider } from '@/components/miniapp-provider';
import { FarcasterProvider } from '@/app/providers/farcaster-provider';
import { MiniAppBootstrap } from '@/components/miniapp-bootstrap';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const baseUrl = 'https://base-box.vercel.app';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Static embed JSON - no JSON.stringify issues
  const embedJson = `{"version":"next","imageUrl":"${baseUrl}/embed-image.png","button":{"title":"Launch Base Box","action":{"type":"launch_frame","name":"Base Box","url":"${baseUrl}","splashImageUrl":"${baseUrl}/splash.png","splashBackgroundColor":"#000814"}}}`;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* CRITICAL: fc:miniapp meta tag */}
        <meta name="fc:miniapp" content={embedJson} />
        <meta name="fc:frame" content={embedJson} />
      </head>
      <body className={inter.className}>
        <MiniAppBootstrap />
        <MiniAppProvider>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </MiniAppProvider>
      </body>
    </html>
    );

}

