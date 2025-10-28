import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MiniAppProvider } from '@/components/miniapp-provider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const APP_URL = 'https://basebox.vercel.app';

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock messages & memories onchain. Time capsules on Base blockchain.',
  
  metadataBase: new URL(APP_URL),
  
  openGraph: {
    title: 'Base Box',
    description: 'Lock messages & memories onchain',
    url: APP_URL,
    siteName: 'Base Box',
    images: [{
      url: `${APP_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Base Box'
    }],
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box',
    description: 'Lock messages & memories onchain',
    images: [`${APP_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${APP_URL}/og-image.png`} />
        <meta property="fc:frame:button:1" content="Launch Base Box" />
        <meta property="fc:frame:button:1:action" content="launch_frame" />
        <meta property="fc:frame:button:1:target" content={APP_URL} />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}