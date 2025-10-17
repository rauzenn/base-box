"use client";

import { useState, useEffect } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-4 border-white/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Brewing your next
        </h3>
        <h3 className="text-2xl font-bold text-white">Based Morning...</h3>
      </div>

      <div className="text-7xl font-black text-white mb-6 font-mono text-center tracking-tight">
        {timeLeft || "00:00:00"}
      </div>

      <div className="flex justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="animate-pulse"
        >
          <path
            d="M30 40 L30 80 Q30 90 40 90 L80 90 Q90 90 90 80 L90 40 Z"
            fill="white"
            fillOpacity="0.9"
            stroke="white"
            strokeWidth="3"
          />
          <path
            d="M90 50 Q105 50 105 65 Q105 80 90 80"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <path
            d="M40 30 Q45 20 40 10"
            stroke="white"
            strokeWidth="2"
            className="animate-pulse"
          />
          <path
            d="M60 30 Q65 20 60 10"
            stroke="white"
            strokeWidth="2"
            className="animate-pulse"
          />
          <path
            d="M80 30 Q85 20 80 10"
            stroke="white"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}