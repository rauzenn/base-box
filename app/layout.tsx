import type { Metadata } from "next";
import "./globals.css";

// Farcaster Mini App manifest - TEK BİR JSON OBJESI
const farcasterManifest = {
  version: "1",
  name: "Base Box",
  icon: "lock",
  splashImageUrl: "https://basebox.vercel.app/og-image.png",
  splashBackgroundColor: "#0052FF",
  homeUrl: "https://basebox.vercel.app",
};

export const metadata: Metadata = {
  title: "Base Box - Time Capsules on Base",
  description: "Lock your messages onchain. Reveal them in the future. Built on Base blockchain.",
  openGraph: {
    title: "Base Box - Time Capsules on Base",
    description: "Lock your messages onchain. Reveal them in the future. Built on Base blockchain.",
    url: "https://basebox.vercel.app",
    siteName: "Base Box",
    images: [
      {
        url: "https://basebox.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Base Box - Time Capsules on Base",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Box - Time Capsules on Base",
    description: "Lock your messages onchain. Reveal them in the future.",
    images: ["https://basebox.vercel.app/og-image.png"],
  },
  // Farcaster manifest - ÖNEMLİ: "other" property'sine JSON string olarak ekliyoruz
  other: {
    "fc:miniapp": JSON.stringify(farcasterManifest),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster manifest'i manuel olarak da ekleyelim - name attribute ile */}
        <meta 
          name="fc:miniapp" 
          content={JSON.stringify(farcasterManifest)} 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}