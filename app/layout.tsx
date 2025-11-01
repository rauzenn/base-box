import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from './providers/farcaster-provider'; // ⭐ EKLE

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// ✅ Farcaster Mini App Embed Configuration
// Version MUST be a string "1", not number!
const farcasterEmbed = {
  version: "1", // ✅ STRING!
  imageUrl: "https://basebox.vercel.app/og-image.png", // Mevcut image (1200x630)
  button: {
    title: "🔒 Create Time Capsule",
    action: {
      type: "launch_miniapp",
      name: "Base Box",
      url: "https://basebox.vercel.app",
      splashImageUrl: "https://basebox.vercel.app/splash.png",
      splashBackgroundColor: "#000814"
    }
  }
};

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
  metadataBase: new URL('https://basebox.vercel.app'),
  openGraph: {
    title: 'Base Box - Time Capsules',
    description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
    url: 'https://basebox.vercel.app',
    siteName: 'Base Box',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Base Box - Onchain Time Capsules',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box - Time Capsules',
    description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://basebox.vercel.app/embed-image.png',
    'fc:frame:button:1': '🔒 Launch Base Box',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://basebox.vercel.app',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}
