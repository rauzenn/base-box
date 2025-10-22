import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "/Users/han/Desktop/base-box/app/globals.css";
import { BaseBoxBackground } from "@/components/ui/base-box-background";
import { BottomNav } from "@/components/ui/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Box",
  description: "Time capsules on Base blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BaseBoxBackground />
        <main className="relative z-10">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}