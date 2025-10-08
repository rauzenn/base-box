import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Based Streaks",
  description: "Daily #gmBase streak tracker on Base",
  metadataBase: new URL('https://based-streaks.vercel.app'),
  openGraph: {
    title: "Based Streaks",
    description: "Daily #gmBase streak tracker on Base",
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://based-streaks.vercel.app/og-image.png',
    'fc:frame:button:1': 'Start Streak 🔥',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://based-streaks.vercel.app/main',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}