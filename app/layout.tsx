import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from './providers/farcaster-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box',
  description: 'Lock your memories onchain',
  openGraph: {
    title: 'Base Box',
    description: 'Lock your memories onchain',
    images: [{
      url: 'https://basebox.vercel.app/og-image.png',
      width: 1200,
      height: 630,
    }],
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
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://basebox.vercel.app/embed-image.png" />
        <meta property="fc:frame:button:1" content="Launch App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://basebox.vercel.app" />
      </head>
      <body className={inter.className}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}