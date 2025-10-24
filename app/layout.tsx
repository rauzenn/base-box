// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MiniAppProvider } from "@/components/miniapp-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE = "https://basebox.vercel.app";
const OG   = `${SITE}/og-image-FIXED.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Base Box — Lock your memories onchain",
  description:
    "Create and preserve your onchain moments with Base Box. Built for the Based community.",
  openGraph: {
    type: "website",
    url: `${SITE}/`,
    title: "Base Box — Lock your memories onchain",
    description:
      "Create and preserve your onchain moments with Base Box. Built for the Based community.",
    images: [{ url: OG, width: 1200, height: 630, alt: "Base Box" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Box — Lock your memories onchain",
    description:
      "Create and preserve your onchain moments with Base Box. Built for the Based community.",
    images: [OG],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* --- Explicit OG/Twitter (Embed botları kesin görsün) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}/`} />
        <meta property="og:title" content="Base Box — Lock your memories onchain" />
        <meta property="og:description" content="Create and preserve your onchain moments with Base Box. Built for the Based community." />
        <meta property="og:image" content={OG} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Base Box" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base Box — Lock your memories onchain" />
        <meta name="twitter:description" content="Create and preserve your onchain moments with Base Box. Built for the Based community." />
        <meta name="twitter:image" content={OG} />

        {/* --- Mini App embed sinyali --- */}
        <meta property="fc:miniapp" content={SITE} />
        <meta property="fc:miniapp:name" content="Base Box" />
        <meta property="fc:miniapp:image" content={OG} />
        <meta property="fc:miniapp:button:1" content="Open Base Box" />
        {/* önce launch_frame ile Present ✓ görmüştün; onu koruyorum */}
        <meta property="fc:miniapp:button:1:action" content="launch_frame" />
        <meta property="fc:miniapp:button:1:target" content={SITE} />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>{children}</MiniAppProvider>
      </body>
    </html>
  );
}
