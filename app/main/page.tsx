"use client";

import { useState, useEffect } from "react";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { MissionCard } from "@/components/ui/mission-card";
import { getAllMissions, type MissionDifficulty } from "@/lib/missions";

export default function MainPage() {
  const { user, isLoading } = useFarcasterContext();
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [devFID, setDevFID] = useState("");
  const [showDevInput, setShowDevInput] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionDifficulty>("medium");
  const [showMissionSelector, setShowMissionSelector] = useState(false);

  const currentFID = user?.fid || (devFID ? parseInt(devFID) : null);
  const missions = getAllMissions();

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
      });
  }, [currentFID]);

  const handleClaim = async () => {
    if (!currentFID) return;
    setClaiming(true);
    
    try {
      const res = await fetch("/api/check-and-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fid: currentFID,
          missionType: selectedMission 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setStreak(data.currentStreak);
        setMaxStreak(data.maxStreak);
        setTotalXP(data.totalXP);
        setShowMissionSelector(false);
      } else {
        alert(data.message || "Failed to claim");
      }
    } catch (err) {
      alert("Error claiming streak");
    } finally {
      setClaiming(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0E] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-[#0052FF] rounded-2xl" />
        </div>
      </div>
    );
  }

  // Dev mode input
  if (showDevInput && !user && !isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0E] flex items-center justify-center p-6">
        <div className="bg-[#0C101A] rounded-3xl p-12 max-w-md w-full border border-[#0052FF]/30 shadow-2xl">
          {/* Base Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#0052FF] rounded-2xl shadow-lg shadow-[#0052FF]/50" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Based Streaks
          </h1>
          <p className="text-[#0052FF] text-center mb-8 font-medium">
            Build on Base. Daily.
          </p>
          
          <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl p-4 mb-6">
            <p className="text-[#FFB800] text-sm text-center font-medium">
              ⚠️ Development Mode
            </p>
            <p className="text-gray-400 text-xs text-center mt-2">
              Production: Auto-authenticated via Farcaster
            </p>
          </div>
          
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter your FID"
            value={devFID}
            onChange={(e) => {
              // Only allow numbers
              const value = e.target.value.replace(/[^0-9]/g, '');
              setDevFID(value);
            }}
            onKeyDown={(e) => {
              // Prevent any non-numeric input
              if (e.key === 'Enter' && devFID) {
                setShowDevInput(false);
                e.preventDefault();
              }
            }}
            className="w-full px-6 py-4 bg-[#070A0E] text-white rounded-xl border border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF] mb-4 text-lg"
          />
          
          <button
            onClick={() => {
              if (devFID && devFID.length > 0) {
                setShowDevInput(false);
              }
            }}
            disabled={!devFID || devFID.length === 0}
            className="w-full py-4 bg-[#0052FF] text-white font-bold rounded-xl hover:bg-[#0052FF]/90 transition-all text-lg shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Enter
          </button>
          
          <button
            onClick={() => setDevFID("569760")}
            className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Use test FID (569760)
          </button>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-[#070A0E]">
      {/* Header */}
      <header className="bg-[#0C101A] border-b border-[#0052FF]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* BASE SQUARE LOGO */}
            <div className="w-10 h-10 bg-[#0052FF] rounded-lg shadow-lg shadow-[#0052FF]/30" />
            <h1 className="text-2xl font-bold text-white">
              Based Streaks
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              {user?.username || `FID: ${currentFID}`}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HERO: BASE SQUARES STACK */}
        <div className="relative bg-gradient-to-br from-[#0C101A] to-[#070A0E] rounded-3xl p-12 mb-8 border border-[#0052FF]/30 shadow-2xl overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="border border-[#0052FF]" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10">
            {/* BASE SQUARES VISUALIZATION */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                {/* Glow effect */}
                <div className="absolute -inset-8 bg-[#0052FF]/20 blur-3xl rounded-full animate-pulse" />
                
                {/* Stack of Base squares */}
                <div className="relative flex flex-col-reverse items-center gap-2">
                  {[...Array(Math.min(Math.max(streak, 1), 10))].map((_, i) => {
                    const size = 80 - (i * 4);
                    const opacity = 1 - (i * 0.1);
                    return (
                      <div
                        key={i}
                        className="bg-[#0052FF] rounded-2xl transition-all duration-300"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          opacity: opacity,
                          boxShadow: `0 0 ${20 + i * 5}px rgba(0, 82, 255, ${opacity * 0.5})`
                        }}
                      />
                    );
                  })}
                  
                  {/* Streak number overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-black text-white drop-shadow-2xl">
                      {streak}
                    </span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-2">
                Day {streak}
              </h2>
              <p className="text-gray-400 text-xl flex items-center gap-2">
                Building Based
                <span className="inline-block w-6 h-6 bg-[#0052FF] rounded-md" />
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-[#070A0E] rounded-xl p-6 border border-[#0052FF]/20">
                <div className="text-gray-400 text-sm mb-2">Current Streak</div>
                <div className="text-4xl font-bold text-[#0052FF]">{streak}</div>
              </div>
              <div className="bg-[#070A0E] rounded-xl p-6 border border-[#00D395]/20">
                <div className="text-gray-400 text-sm mb-2">Max Streak</div>
                <div className="text-4xl font-bold text-[#00D395]">{maxStreak}</div>
              </div>
              <div className="bg-[#070A0E] rounded-xl p-6 border border-[#FFB800]/20">
                <div className="text-gray-400 text-sm mb-2">Total XP</div>
                <div className="text-4xl font-bold text-[#FFB800]">{totalXP}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Progress to Crown Badge</span>
                <span className="font-mono">{streak}/30 days</span>
              </div>
              <div className="h-4 bg-[#070A0E] rounded-full overflow-hidden border border-[#0052FF]/20">
                <div 
                  className="h-full bg-gradient-to-r from-[#0052FF] to-[#00D395] transition-all duration-500"
                  style={{ width: `${(streak / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            {!showMissionSelector ? (
              <button
                onClick={() => setShowMissionSelector(true)}
                className="w-full py-6 bg-[#0052FF] text-white font-bold text-2xl rounded-2xl hover:bg-[#0052FF]/90 transition-all shadow-xl shadow-[#0052FF]/30 hover:shadow-[#0052FF]/50 hover:scale-[1.02]"
              >
                Choose Your Mission 🎯
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const mission = missions.find(m => m.difficulty === selectedMission);
                    const hashtag = mission?.hashtag || "#BasedVibes";
                    const text = `${hashtag} - Building on Base 💙`;
                    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full py-6 bg-[#8A63D2] text-white font-bold text-2xl rounded-2xl hover:bg-[#8A63D2]/90 transition-all shadow-xl"
                >
                  Post on Farcaster 📝
                </button>
                
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full py-6 bg-gradient-to-r from-[#00D395] to-[#0052FF] text-white font-bold text-2xl rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {claiming ? "Verifying..." : "Verify & Claim Streak ✅"}
                </button>
              </div>
            )}

            <p className="text-center text-gray-500 mt-4 text-sm">
              Complete daily missions to build your Base streak
            </p>
          </div>
        </div>

        {/* MISSION SELECTOR */}
        {showMissionSelector && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Pick Your Mission 🎯</h2>
              <button
                onClick={() => setShowMissionSelector(false)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isSelected={selectedMission === mission.difficulty}
                  onSelect={() => setSelectedMission(mission.difficulty)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rewards Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Season Rewards with Mint Buttons */}
          <div className="bg-[#0C101A] rounded-2xl p-8 border border-[#0052FF]/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0052FF] rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-white">NFT Badges</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { days: 7, name: "Seed", emoji: "🌱", id: 1 },
                { days: 14, name: "Flame", emoji: "🔥", id: 2 },
                { days: 21, name: "Diamond", emoji: "💎", id: 3 },
                { days: 30, name: "Crown", emoji: "👑", id: 4 }
              ].map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    streak >= badge.days
                      ? 'bg-[#0052FF]/20 border-2 border-[#0052FF]'
                      : 'bg-[#070A0E] border border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{badge.emoji}</span>
                    <div>
                      <div className="text-white font-bold">{badge.name} Badge</div>
                      <div className="text-gray-400 text-sm">{badge.days} days</div>
                    </div>
                  </div>
                  
                  {streak >= badge.days ? (
                    <button 
                      onClick={() => alert(`Mint ${badge.name} Badge - Coming soon!`)}
                      className="px-6 py-2 bg-[#0052FF] text-white text-sm font-bold rounded-lg hover:bg-[#0052FF]/80 transition-colors shadow-lg"
                    >
                      Mint FREE
                    </button>
                  ) : (
                    <div className="text-gray-600 text-sm font-mono">
                      {badge.days - streak} days left
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-[#0052FF]/10 border border-[#0052FF]/20 rounded-xl p-4">
              <p className="text-sm text-gray-300 text-center">
                💙 <span className="text-[#0052FF] font-bold">Free mints on Base</span> · ERC-1155 NFT badges
              </p>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-[#0C101A] rounded-2xl p-8 border border-[#00D395]/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#00D395] rounded-xl flex items-center justify-center text-2xl">
                🤝
              </div>
              <h3 className="text-2xl font-bold text-white">Referral Program</h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Invite friends to Based Streaks. When they complete a 3-day streak, you both earn bonus XP!
            </p>
            
            <div className="bg-[#070A0E] rounded-xl p-6 border border-[#00D395] mb-4">
              <div className="text-[#00D395] font-bold text-4xl mb-2">+50 XP</div>
              <div className="text-gray-400 text-sm">per successful referral</div>
            </div>
            
            <button className="w-full py-3 bg-[#00D395]/10 text-[#00D395] font-bold rounded-xl border border-[#00D395] hover:bg-[#00D395]/20 transition-colors">
              Get Your Referral Link →
            </button>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-[#0C101A] rounded-2xl p-8 border border-[#FFB800]/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-white">Top Builders</h3>
            </div>
            <span className="text-sm text-gray-400">Season 1</span>
          </div>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: "0xbee.eth", xp: 520, badge: "👑" },
              { rank: 2, name: "han.base", xp: 500, badge: "💎" },
              { rank: 3, name: "basedguy", xp: 485, badge: "🔥" }
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between bg-[#070A0E] rounded-xl p-4 border border-gray-800 hover:border-[#0052FF]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    user.rank === 1 ? "bg-[#FFB800]" : 
                    user.rank === 2 ? "bg-gray-400" : 
                    "bg-[#CD7F32]"
                  } text-black`}>
                    {user.rank}
                  </div>
                  <span className="text-xl">{user.badge}</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="bg-[#0052FF] px-4 py-2 rounded-lg font-bold text-white text-sm">
                  {user.xp} XP
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 bg-[#070A0E] text-[#FFB800] font-bold rounded-xl border border-[#FFB800] hover:bg-[#FFB800]/10 transition-colors">
            View Full Leaderboard →
          </button>
        </div>
      </main>
    </div>
  );
}