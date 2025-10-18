"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { BaseBoxBackground } from "@/components/ui/base-box-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Clock, Lock, Unlock, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useFarcasterContext();
  const [devFID, setDevFID] = useState("");
  const [showDevInput, setShowDevInput] = useState(true);
  const [stats, setStats] = useState({
    totalCapsules: 0,
    lockedCapsules: 0,
    revealedCapsules: 0,
    nextReveal: null as string | null,
  });

  const currentFID = user?.fid || (devFID ? parseInt(devFID) : null);

  // Fetch user capsule stats
  useEffect(() => {
    if (!currentFID) return;

    fetch(`/api/capsules/stats?fid=${currentFID}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setShowDevInput(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [currentFID]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <BaseBoxBackground />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 border-4 border-[#0052FF] rounded-2xl animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl font-bold">Loading Base Box...</p>
        </div>
      </div>
    );
  }

  // Dev Input
  if (showDevInput && !user && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <BaseBoxBackground />
        <div className="relative z-10 bg-[#0A0E14]/80 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full border-2 border-[#0052FF]/30 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#0052FF] rounded-2xl shadow-lg shadow-[#0052FF]/50 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-2 text-center">
            Base Box
          </h1>
          <p className="text-gray-400 text-center mb-8 font-medium">
            Keep your words on-chain, meet them in the future
          </p>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter your FID"
            value={devFID}
            onChange={(e) => setDevFID(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full px-6 py-4 bg-black/50 text-white placeholder-gray-500 rounded-xl border-2 border-[#0052FF]/30 focus:outline-none focus:border-[#0052FF] mb-4 text-lg"
          />

          <button
            onClick={() => devFID && setShowDevInput(false)}
            disabled={!devFID}
            className="w-full py-4 bg-[#0052FF] text-white font-black rounded-xl hover:bg-[#0052FF]/90 disabled:opacity-30 shadow-lg shadow-[#0052FF]/20"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // Main Home
  return (
    <div className="min-h-screen pb-24">
      <BaseBoxBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#0052FF] rounded-xl shadow-lg shadow-[#0052FF]/50 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Base Box</h1>
              <p className="text-sm text-gray-400">
                {user?.username || `FID: ${currentFID}`}
              </p>
            </div>
          </div>
        </header>

        {/* Hero Tagline */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Time remembers.
          </h2>
          <p className="text-xl text-[#0052FF]">Base preserves.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#0052FF]/20">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-8 h-8 text-[#0052FF]" />
              <div className="text-gray-400 text-sm">Locked</div>
            </div>
            <div className="text-4xl font-black text-white">
              {stats.lockedCapsules}
            </div>
          </div>

          <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#00D395]/20">
            <div className="flex items-center gap-3 mb-3">
              <Unlock className="w-8 h-8 text-[#00D395]" />
              <div className="text-gray-400 text-sm">Revealed</div>
            </div>
            <div className="text-4xl font-black text-white">
              {stats.revealedCapsules}
            </div>
          </div>
        </div>

        {/* Next Reveal Countdown */}
        {stats.nextReveal && (
          <div className="bg-gradient-to-br from-[#0052FF]/20 to-[#00D395]/20 backdrop-blur-md rounded-3xl p-8 border-2 border-[#0052FF]/30 mb-8">
            <div className="text-center mb-4">
              <Clock className="w-16 h-16 text-[#0052FF] mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">
                Next Capsule Unlocks In
              </h3>
              <div className="text-5xl font-black text-white font-mono">
                {stats.nextReveal}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <a
            href="/create"
            className="block w-full py-6 bg-[#0052FF] text-white font-black text-xl rounded-2xl text-center hover:bg-[#0052FF]/90 shadow-xl shadow-[#0052FF]/20"
          >
            Lock a New Capsule 🎁
          </a>

          <a
            href="/capsules"
            className="block w-full py-4 bg-[#0A0E14]/60 text-white font-bold rounded-xl text-center border-2 border-[#0052FF]/30 hover:border-[#0052FF]"
          >
            View All Capsules
          </a>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0052FF]" />
            Recent Activity
          </h3>
          <div className="text-gray-400 text-sm text-center py-8 border border-[#0052FF]/20 rounded-xl">
            No recent activity
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}