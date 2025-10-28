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
  
  // Open Graph
  openGraph: {
    title: 'Base Box',
    description: 'Lock messages & memories onchain',
    url: APP_URL,
    siteName: 'Base Box',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Base Box - Time Capsules on Base'
    }],
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box',
    description: 'Lock messages & memories onchain',
    images: ['/og-image.png'],
  },
  
  // Farcaster Frame metadata
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${APP_URL}/og-image.png`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Launch Base Box',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': APP_URL,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}