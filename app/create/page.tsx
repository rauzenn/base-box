'use client';

import React, { useState } from 'react';
import { Lock, MessageSquare, Clock, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const durationOptions = [
    { days: 1, label: '1 Day', emoji: '⚡' },
    { days: 7, label: '1 Week', emoji: '🌙' },
    { days: 30, label: '1 Month', emoji: '🎯' },
    { days: 90, label: '3 Months', emoji: '🚀' },
    { days: 180, label: '6 Months', emoji: '⭐' },
    { days: 365, label: '1 Year', emoji: '🔮' },
  ];

  const calculateUnlockDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleLockCapsule = async () => {
    setIsLoading(true);
    
    try {
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + duration);

      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid: 3, // Mock FID - gerçekte Farcaster context'ten gelecek
          message,
          unlockDate: unlockDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to capsules
        alert('🎉 Capsule locked successfully!');
        router.push('/capsules');
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Lock capsule error:', error);
      alert('❌ Failed to lock capsule');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-b from-[#000814] to-[#001428] p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-3">Create Capsule 🔒</h1>
          <p className="text-gray-400 text-lg">Lock a message for your future self</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-12">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${
                  step >= s 
                    ? 'bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white scale-110 shadow-lg shadow-blue-500/50' 
                    : 'bg-gray-800 text-gray-600'
                }`}>
                  {s}
                </div>
                <span className={`text-xs mt-2 font-bold ${step >= s ? 'text-[#0052FF]' : 'text-gray-600'}`}>
                  {s === 1 ? 'Message' : s === 2 ? 'Duration' : 'Confirm'}
                </span>
              </div>
              {s < 3 && (
                <div className={`h-1 w-24 mx-3 rounded transition-all duration-300 ${
                  step > s ? 'bg-gradient-to-r from-[#0052FF] to-[#00D395]' : 'bg-gray-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Message */}
        {step === 1 && (
          <div className="bg-[#0A0E14]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#0052FF]/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0052FF]/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#0052FF]" />
              </div>
              <h2 className="text-2xl font-black text-white">Your Message</h2>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dear future me..."
              className="w-full h-56 bg-black/60 text-white text-lg rounded-2xl p-6 border-2 border-[#0052FF]/20 focus:border-[#0052FF] transition-all resize-none outline-none placeholder:text-gray-600"
              maxLength={500}
            />
            
            <div className="flex justify-between items-center mt-6">
              <span className={`text-sm font-bold ${message.length > 450 ? 'text-[#FFB800]' : 'text-gray-500'}`}>
                {message.length}/500 characters
              </span>
              <button
                onClick={() => message.length > 10 && setStep(2)}
                disabled={message.length <= 10}
                className="bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white px-10 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="bg-[#0A0E14]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#0052FF]/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0052FF]/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#0052FF]" />
              </div>
              <h2 className="text-2xl font-black text-white">Lock Duration</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {durationOptions.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setDuration(opt.days)}
                  className={`p-6 rounded-2xl font-bold text-base transition-all transform hover:scale-105 ${
                    duration === opt.days
                      ? 'bg-gradient-to-br from-[#0052FF] to-[#00D395] text-white shadow-2xl shadow-blue-500/50'
                      : 'bg-black/60 text-gray-400 border-2 border-gray-700 hover:border-[#0052FF]/50'
                  }`}
                >
                  <div className="text-4xl mb-3">{opt.emoji}</div>
                  <div className="font-black">{opt.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white px-6 py-4 rounded-xl font-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="bg-[#0A0E14]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#0052FF]/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0052FF]/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#0052FF]" />
              </div>
              <h2 className="text-2xl font-black text-white">Review & Lock</h2>
            </div>
            
            <div className="bg-gradient-to-br from-[#0052FF]/10 to-[#00D395]/10 rounded-2xl p-6 mb-6 border border-[#0052FF]/30">
              <div className="bg-black/60 rounded-xl p-6 mb-4">
                <p className="text-white text-lg leading-relaxed">{message}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00D395]">
                  <Calendar className="w-5 h-5" />
                  <span className="font-bold">
                    Unlocks: {calculateUnlockDate(duration)}
                  </span>
                </div>
                <div className="text-[#0052FF] font-bold">
                  {duration} day{duration > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={handleLockCapsule}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#0052FF] to-[#00D395] text-white px-6 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Locking...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Lock Capsule
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}