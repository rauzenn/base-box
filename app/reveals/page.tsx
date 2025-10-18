"use client";

import { BaseBoxBackground } from "@/components/ui/base-box-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Unlock, Calendar } from "lucide-react";

export default function RevealsPage() {
  return (
    <div className="min-h-screen pb-24">
      <BaseBoxBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Reveals</h1>
          <p className="text-gray-400">Your unlocked time capsules</p>
        </header>

        {/* Coming Soon */}
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#00D395]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Unlock className="w-10 h-10 text-[#00D395]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No reveals yet
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Your capsules will appear here once they unlock. Check back when the countdown ends!
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#0052FF] text-white font-bold rounded-xl hover:bg-[#0052FF]/90"
          >
            Back to Home
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}