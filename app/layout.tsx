import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MiniAppProvider } from '@/components/miniapp-provider';

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Base Box - Time Capsules on Base',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box - Time Capsules',
    description: 'Lock memories onchain on Base',
    images: ['/og-image.png'],
  },
  
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/embed-image.png`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Launch Base Box',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': baseUrl,
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
        {/* Frame meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/embed-image.png`} />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Launch Base Box" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content={baseUrl} />
        
        {/* OG meta tags */}
        <meta property="og:title" content="Base Box - Time Capsules" />
        <meta property="og:description" content="Lock memories onchain on Base" />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />
        <meta property="og:url" content={baseUrl} />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}