import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from '@/app/providers/farcaster-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock messages for your future self on Base blockchain',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://basebox.vercel.app'),
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      name: 'Base Box',
      iconUrl: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
      homeUrl: process.env.NEXT_PUBLIC_APP_URL,
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
      buttonTitle: '🔒 Create Capsule',
      splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
      splashBackgroundColor: '#000814',
    }),
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