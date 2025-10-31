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
  description: 'Lock messages for your future self on Base blockchain',
  openGraph: {
    title: 'Base Box - Time Capsules on Base',
    description: 'Lock messages for your future self on Base blockchain',
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
      <body className={inter.className}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}
