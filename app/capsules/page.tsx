"use client";

import { useState } from "react";
import { BaseBoxBackground } from "@/components/ui/base-box-background";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useFarcasterContext } from "@/components/ui/farcaster-provider";
import { Lock, Calendar, MessageSquare } from "lucide-react";

export default function CreateCapsule() {
  const { user } = useFarcasterContext();
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("30"); // days
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!user?.fid || !message.trim()) return;
    
    setCreating(true);

    try {
      const res = await fetch("/api/capsules/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          message: message.trim(),
          durationDays: parseInt(duration),
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`Capsule locked! Unlocks on ${new Date(data.unlockDate).toLocaleDateString()}`);
        setMessage("");
      } else {
        alert(data.message || "Failed to create capsule");
      }
    } catch (err) {
      alert("Error creating capsule");
    } finally {
      setCreating(false);
    }
  };

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
              <h1 className="text-2xl font-black text-white">Lock a Capsule</h1>
              <p className="text-sm text-gray-400">
                What will your future self say?
              </p>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="space-y-6">
          {/* Message Input */}
          <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#0052FF]/20">
            <label className="flex items-center gap-2 text-white font-bold mb-3">
              <MessageSquare className="w-5 h-5 text-[#0052FF]" />
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a prediction, memory, or message for the future..."
              rows={6}
              maxLength={500}
              className="w-full px-4 py-3 bg-black/50 text-white placeholder-gray-500 rounded-xl border-2 border-[#0052FF]/30 focus:outline-none focus:border-[#0052FF] resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {message.length}/500
            </div>
          </div>

          {/* Duration Selector */}
          <div className="bg-[#0A0E14]/60 backdrop-blur-md rounded-2xl p-6 border-2 border-[#0052FF]/20">
            <label className="flex items-center gap-2 text-white font-bold mb-4">
              <Calendar className="w-5 h-5 text-[#0052FF]" />
              Lock Duration
            </label>
            
            <div className="grid grid-cols-5 gap-3">
              {["1", "7", "30", "90", "365"].map((days) => (
                <button
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    duration === days
                      ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/30"
                      : "bg-black/50 text-gray-400 border border-[#0052FF]/30 hover:border-[#0052FF]"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Unlocks on{" "}
              <span className="text-[#0052FF] font-bold">
                {new Date(
                  Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-gradient-to-br from-[#0052FF]/10 to-transparent rounded-xl p-4 border border-[#0052FF]/20">
            <p className="text-gray-400 text-sm mb-2 font-bold">
              💡 Example Messages:
            </p>
            <ul className="text-gray-500 text-xs space-y-1">
              <li>"Base will hit $100B TVL by 2026"</li>
              <li>"ETH price prediction: $10,000"</li>
              <li>"Dear future me, remember why you started building..."</li>
              <li>"This is my first Base transaction ever!"</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreate}
            disabled={creating || !message.trim()}
            className="w-full py-6 bg-[#0052FF] text-white font-black text-xl rounded-2xl hover:bg-[#0052FF]/90 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-[#0052FF]/20"
          >
            {creating ? "Locking..." : "Lock Capsule 🔒"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}