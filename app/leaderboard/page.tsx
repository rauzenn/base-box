"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import Image from "next/image";

export default function Home() {
  const { user, isLoading } = useFarcasterContext();
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [devFID, setDevFID] = useState("");
  const [showDevInput, setShowDevInput] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [builderScore, setBuilderScore] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");

  const currentFID = user?.fid || (devFID ? parseInt(devFID) : null);

  // Fetch user stats
  useEffect(() => {
    if (!currentFID) return;

    fetch(`/api/me?fid=${currentFID}`)
      .then((r) => r.json())
      .then((data) => {
        setStreak(data.currentStreak || 0);
        setMaxStreak(data.maxStreak || 0);
        setTotalXP(data.totalXP || 0);
        setShowDevInput(false);
        
        // Check if already claimed today
        const today = new Date().toISOString().split("T")[0];
        if (data.lastClaimDate === today) {
          setShowCountdown(true);
        }
      });
  }, [currentFID]);

  // Simulate Builder Score (Talent Protocol'den çekilebilir)
  useEffect(() => {
    if (totalXP) {
      setBuilderScore(Math.floor(totalXP * 0.5 + streak * 10));
    }
  }, [totalXP, streak]);

  const handleClaim = async () => {
    if (!currentFID) return;
    setClaiming(true);

    try {
      const res = await fetch("/api/check-and-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: currentFID, missionType: "medium" }),
      });

      const data = await res.json();
      if (data.success) {
        setStreak(data.currentStreak);
        setMaxStreak(data.maxStreak);
        setTotalXP(data.totalXP);
        setShowCountdown(true);
        alert(data.message);
      } else {
        alert(data.message || "Failed to claim");
      }
    } catch (err) {
      alert("Error claiming streak");
    } finally {
      setClaiming(false);
    }
  };

  const connectWallet = () => {
    // Rainbowkit modal'ını aç (sonra entegre ederiz)
    alert("Wallet connect coming soon! Use Farcaster for now.");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0052FF] flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl font-bold">Loading Based Streaks...</p>
        </div>
      </div>
    );
  }

  // Dev mode input
  if (showDevInput && !user && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <AnimatedBackground />
        <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full border-4 border-white/30 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-black text-[#0052FF]">BS</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-2 text-center">
            Based Streaks
          </h1>
          <p className="text-white/80 text-center mb-8 font-medium">
            Just Based. Daily.
          </p>

          <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-4 mb-6">
            <p className="text-yellow-200 text-sm text-center font-medium">
              ⚠️ Development Mode
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter your FID"
            value={devFID}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setDevFID(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && devFID) {
                setShowDevInput(false);
                e.preventDefault();
              }
            }}
            className="w-full px-6 py-4 bg-white/20 text-white placeholder-white/60 rounded-xl border-2 border-white/30 focus:outline-none focus:border-white mb-4 text-lg backdrop-blur-sm"
          />

          <button
            onClick={() => {
              if (devFID && devFID.length > 0) {
                setShowDevInput(false);
              }
            }}
            disabled={!devFID || devFID.length === 0}
            className="w-full py-4 bg-white text-[#0052FF] font-black rounded-xl hover:bg-white/90 transition-all text-lg shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Enter
          </button>

          <button
            onClick={() => setDevFID("569760")}
            className="w-full mt-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Use test FID (569760)
          </button>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* User Profile Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <div className="text-white font-bold">
                    {user?.username || `FID: ${currentFID}`}
                  </div>
                  <div className="text-white/60 text-sm">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "No wallet"}
                  </div>
                </div>
              </div>
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-lg border-2 border-white/30 hover:bg-white/30 transition-all"
              >
                Connect Wallet
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
              <div className="text-white/70 text-sm mb-1">Builder Score:</div>
              <div className="text-3xl font-black text-white">{builderScore}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
              <div className="text-white/70 text-sm mb-1">Your Streak:</div>
              <div className="text-3xl font-black text-white">{streak}</div>
            </div>
          </div>

          {/* Just Based Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white rounded-xl" />
              <div className="w-12 h-12 bg-white rounded-xl" />
              <div className="w-12 h-12 bg-white rounded-xl" />
              <div className="w-12 h-12 bg-white rounded-xl" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-wider">
              Just Based
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Countdown or Claim Button */}
          {showCountdown ? (
            <CountdownTimer />
          ) : (
            <div className="text-center">
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-8 bg-white text-[#0052FF] font-black text-3xl rounded-3xl hover:bg-white/90 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white/50"
              >
                {claiming ? "Checking..." : "Check & Claim ✅"}
              </button>
              <p className="text-white/70 text-sm mt-4">
                Boost your daily Base TX count and hit a new streak
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
              <div className="text-white/70 text-xs mb-2">Current</div>
              <div className="text-3xl font-black text-white">{streak}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
              <div className="text-white/70 text-xs mb-2">Max</div>
              <div className="text-3xl font-black text-white">{maxStreak}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
              <div className="text-white/70 text-xs mb-2">Total XP</div>
              <div className="text-3xl font-black text-white">{totalXP}</div>
            </div>
          </div>

          {/* Global Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20 text-center">
            <div className="text-white/70 text-sm mb-2">📊 Global Streak count:</div>
            <div className="text-4xl font-black text-white">Coming Soon</div>
          </div>

          {/* Footer */}
          <div className="text-center text-white/60 text-sm">
            <p>
              Boost your daily Base TX count and hit a new contract.
            </p>
            <p className="mt-2">
              All for less than a penny (0.000002eth).
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}