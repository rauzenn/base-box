"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { CountdownTimer } from "@/components/ui/countdown-timer";

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
      })
      .catch((err) => console.error("Error:", err));
  }, [currentFID]);

  // Calculate Builder Score
  useEffect(() => {
    if (totalXP || streak) {
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

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0052FF] flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Dev Input
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

          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter your FID"
            value={devFID}
            onChange={(e) => setDevFID(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full px-6 py-4 bg-white/20 text-white placeholder-white/60 rounded-xl border-2 border-white/30 focus:outline-none focus:border-white mb-4 text-lg"
          />

          <button
            onClick={() => devFID && setShowDevInput(false)}
            disabled={!devFID}
            className="w-full py-4 bg-white text-[#0052FF] font-black rounded-xl hover:bg-white/90 disabled:opacity-30"
          >
            Enter
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
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
            <div className="text-white/70 text-sm">Builder Score</div>
            <div className="text-3xl font-black text-white">{builderScore}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
            <div className="text-white/70 text-sm">Your Streak</div>
            <div className="text-3xl font-black text-white">{streak}</div>
          </div>
        </div>

        {/* Just Based Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg" />
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg" />
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg" />
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Just Based
          </h1>
        </div>

        {/* Countdown or Claim */}
        {showCountdown ? (
          <CountdownTimer />
        ) : (
          <div className="mb-8">
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full py-8 bg-white text-[#0052FF] font-black text-3xl rounded-3xl hover:bg-white/90 shadow-2xl disabled:opacity-50 border-4 border-white/50"
            >
              {claiming ? "Checking..." : "Check & Claim ✅"}
            </button>
            <p className="text-white/70 text-sm text-center mt-4">
              Boost your daily Base TX count
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
            <div className="text-white/70 text-xs mb-2">Current</div>
            <div className="text-3xl font-black text-white">{streak}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
            <div className="text-white/70 text-xs mb-2">Max</div>
            <div className="text-3xl font-black text-white">{maxStreak}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 text-center">
            <div className="text-white/70 text-xs mb-2">XP</div>
            <div className="text-3xl font-black text-white">{totalXP}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm">
          <p>All for less than a penny (0.000002eth)</p>
        </div>
      </div>
    </div>
  );
}