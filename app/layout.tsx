// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MiniAppProvider } from "@/components/miniapp-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://basebox.vercel.app"),
  title: "Base Box — Lock your memories onchain",
  description:
    "Create and preserve your onchain moments with Base Box. Built for the Based community.",
  openGraph: {
    type: "website",
    url: "https://basebox.vercel.app/",
    title: "Base Box — Lock your memories onchain",
    description:
      "Create and preserve your onchain moments with Base Box. Built for the Based community.",
    images: [
      {
        url: "/og-image-FIXED.png", // absolute olur (metadataBase ile birleşir)
        width: 1200,
        height: 630,
        alt: "Base Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Box — Lock your memories onchain",
    description:
      "Create and preserve your onchain moments with Base Box. Built for the Based community.",
    images: ["/og-image-FIXED.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <MiniAppProvider>{children}</MiniAppProvider>
      </body>
    </html>
  );
}
