import type { Metadata } from "next";
import "@fontsource/inter/variable.css";
import "./globals.css";
import { FarcasterProvider } from "@/components/ui/farcaster-provider";

export const metadata: Metadata = {
  title: "Based Streaks",
  description: "Daily #gmBase check-in. Keep the streak.",
  icons: {
    icon: "/bs_logo_512.png",
    apple: "/bs_logo_1024.png",
  },
  openGraph: {
    title: "Based Streaks",
    description: "Daily #gmBase check-in. Keep the streak.",
    images: ["/bs_splash.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}