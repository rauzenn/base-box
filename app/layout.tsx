import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MiniAppProvider } from '@/components/miniapp-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const baseUrl = 'https://basebox.vercel.app';

// Embed metadata for social sharing (CRITICAL!)
const embedMetadata = {
  version: "next",
  imageUrl: `${baseUrl}/embed-image.png`, // Must be 3:2 aspect ratio!
  button: {
    title: "Launch Base Box",
    action: {
      type: "launch_frame",
      name: "Base Box",
      url: baseUrl,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#000814"
    }
  }
};

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
      },
    ],
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
  
  // CRITICAL: fc:miniapp and fc:frame meta tags
  other: {
    'fc:miniapp': JSON.stringify(embedMetadata),
    'fc:frame': JSON.stringify(embedMetadata), // Backward compatibility
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
        {/* CRITICAL: Embed metadata for Farcaster */}
        <meta name="fc:miniapp" content={JSON.stringify(embedMetadata)} />
        <meta name="fc:frame" content={JSON.stringify(embedMetadata)} />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}