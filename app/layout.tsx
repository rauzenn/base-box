import type { Metadata } from "next";
import "@fontsource-variable/inter"; // ✅ DOĞRU PAKET
import "./globals.css";
import { FarcasterProvider } from "@/components/ui/farcaster-provider";

export const metadata: Metadata = {
  title: "Based Streaks",
  description: "Daily #gmBase check-in. Keep the streak.",
  icons: {
    icon: "/bs_logo_512.png",
    apple: "/bs_logo_1024.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}