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
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Dev mode input (only if no user after loading)
  if (showDevInput && !user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070A0E] via-[#0C101A] to-[#070A0E] flex items-center justify-center p-6">
        <div className="bg-[#12161E] rounded-3xl p-12 max-w-md w-full border border-[#FF6B35]/20 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            🔥 Based Streaks
          </h1>
          <div className="bg-[#FFB800]/10 border border-[#FFB800] rounded-xl p-4 mb-6">
            <p className="text-[#FFB800] text-sm text-center">
              ⚠️ Development Mode Only
            </p>
            <p className="text-gray-400 text-xs text-center mt-2">
              In production, users will be automatically authenticated via Farcaster
            </p>
          </div>
          <input
            type="number"
            placeholder="Enter your FID for testing"
            value={devFID}
            onChange={(e) => setDevFID(e.target.value)}
            className="w-full px-6 py-4 bg-[#070A0E] text-white rounded-xl border border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] mb-4 text-lg"
          />
          <button
            onClick={() => {
              if (devFID) {
                setShowDevInput(false);
                localStorage.setItem('dev_fid', devFID); // Save for refresh
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white font-bold rounded-xl hover:scale-105 transition-transform text-lg shadow-lg hover:shadow-[#FF6B35]/50"
          >
            Enter Dev Mode
          </button>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Auto-fill with test FID
                setDevFID("569760");
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Use test FID (569760)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070A0E] via-[#0C101A] to-[#070A0E]">
      {/* Header */}
      <header className="bg-[#070A0E] border-b border-[#FF6B35]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🔥 <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB800] bg-clip-text text-transparent">Based Streaks</span>
          </h1>
          <div className="text-sm text-gray-400">
            FID: {currentFID}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HERO FLAME CARD */}
        <div className="relative bg-gradient-to-br from-[#12161E] to-[#070A0E] rounded-3xl p-12 mb-8 border border-[#FF6B35]/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-[#FF6B35]/20 via-transparent to-transparent animate-pulse" />
          
          <div className="relative z-10">
            {/* Living Flame Visualization */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-t from-[#FF6B35] via-[#FFB800] to-[#FFDC64] opacity-40 animate-pulse" />
                
                <div className="relative text-center">
                  <div className="text-9xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
                    🔥
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-black text-white drop-shadow-2xl">
                      {streak}
                    </span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mt-8 mb-2">
                Day {streak}
              </h2>
              <p className="text-gray-400 text-xl">
                Keep the flame alive!
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Current Streak</div>
                <div className="text-3xl font-bold text-[#FFB800]">{streak}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Max Streak</div>
                <div className="text-3xl font-bold text-[#00D395]">{maxStreak}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Total XP</div>
                <div className="text-3xl font-bold text-[#0052FF]">{totalXP}</div>
              </div>
            </div>

            {/* Progress to next milestone */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress to 30 days</span>
                <span>{streak}/30</span>
              </div>
              <div className="h-3 bg-[#070A0E] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] transition-all duration-500 rounded-full"
                  style={{ width: `${(streak / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            {!showMissionSelector ? (
              <button
                onClick={() => setShowMissionSelector(true)}
                className="w-full py-6 bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white font-bold text-2xl rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/50"
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
                  className="w-full py-6 bg-gradient-to-r from-[#0052FF] to-[#4169E1] text-white font-bold text-2xl rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl hover:shadow-[#0052FF]/50"
                >
                  Post on Farcaster 📝
                </button>
                
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full py-6 bg-gradient-to-r from-[#00D395] to-[#0052FF] text-white font-bold text-2xl rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:shadow-[#00D395]/50"
                >
                  {claiming ? "Verifying..." : "Verify & Claim Streak ✅"}
                </button>
              </div>
            )}

            <p className="text-center text-gray-400 mt-4 text-sm">
              Complete daily missions to keep your streak alive
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
                className="text-gray-400 hover:text-white transition-colors"
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
          {/* Season Rewards */}
          <div className="bg-[#12161E] rounded-2xl p-8 border border-[#0052FF]/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏆</span>
              <h3 className="text-2xl font-bold text-white">Season Rewards</h3>
            </div>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <span>7 days → Seed Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span>14 days → Flame Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span>21 days → Diamond Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <span>30 days → Crown Badge</span>
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-[#12161E] rounded-2xl p-8 border border-[#00D395]/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🤝</span>
              <h3 className="text-2xl font-bold text-white">Referral Program</h3>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              Invite friends to join Based Streaks! Both of you earn bonus XP when they complete their first 3-day streak.
            </p>
            <div className="bg-[#070A0E] rounded-xl p-4 border border-[#00D395]">
              <span className="text-[#00D395] font-bold text-2xl">+50 XP</span>
              <span className="text-gray-400 ml-2">per successful referral</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-[#12161E] rounded-2xl p-8 border border-[#FFB800]/30">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🏆 Top Based Builders
          </h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: "0xbee.eth", xp: 520, emoji: "👑" },
              { rank: 2, name: "han.base", xp: 500, emoji: "💎" },
              { rank: 3, name: "basedguy", xp: 485, emoji: "🔥" }
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between bg-[#070A0E] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    user.rank === 1 ? "bg-yellow-500" : 
                    user.rank === 2 ? "bg-gray-400" : 
                    "bg-orange-600"
                  }`}>
                    {user.rank}
                  </div>
                  <span className="text-xl">{user.emoji}</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="bg-[#FF6B35] px-4 py-2 rounded-lg font-bold text-white">
                  {user.xp} XP
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-[#070A0E] text-[#FFB800] font-bold rounded-xl border border-[#FFB800] hover:bg-[#FFB800]/10 transition">
            View Full Leaderboard →
          </button>
        </div>
      </main>
    </div>
  );
}