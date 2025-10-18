"use client";

import { BaseBoxBackground } from "@/components/ui/base-box-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { UserCircle, Lock, Unlock, Award, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const { user } = useFarcasterContext();

  return (
    <div className="min-h-screen pb-24">
      <BaseBoxBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Profile</h1>
          <p className="text-gray-400">Your Base Box stats</p>
        </header>

        {/* User Info Card */}
        <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#0052FF]/20 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#0052FF]/20 rounded-full flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-[#0052FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {user?.username || "Anonymous"}
              </h2>
              <p className="text-gray-400 text-sm">FID: {user?.fid || "---"}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-[#0052FF] mb-1">0</div>
              <div className="text-xs text-gray-400">Total Capsules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[#FFB800] mb-1">0</div>
              <div className="text-xs text-gray-400">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-[#00D395] mb-1">0</div>
              <div className="text-xs text-gray-400">Revealed</div>
            </div>
          </div>
        </div>

        {/* Achievements (Coming Soon) */}
        <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#0052FF]/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-[#FFB800]" />
            <h3 className="text-lg font-bold text-white">Achievements</h3>
          </div>
          <p className="text-gray-400 text-sm">Coming soon...</p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <a
            href="https://www.base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-6 py-4 bg-[#0A0E14]/60 backdrop-blur-md rounded-xl border-2 border-[#0052FF]/20 hover:border-[#0052FF] transition-all"
          >
            <span className="text-white font-medium">About Base</span>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>

          <a
            href="https://docs.base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-6 py-4 bg-[#0A0E14]/60 backdrop-blur-md rounded-xl border-2 border-[#0052FF]/20 hover:border-[#0052FF] transition-all"
          >
            <span className="text-white font-medium">Documentation</span>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        </div>

        {/* Version */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-xs">Base Box v1.0.0</p>
          <p className="text-gray-600 text-xs mt-1">Built on Base 💙</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}