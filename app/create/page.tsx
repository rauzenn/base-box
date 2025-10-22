'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useRipple, createSparkles, createConfetti } from '@/components/animations/effects';

const durations = [
  { days: 1, label: '⚡ 1 Day', emoji: '⚡', color: 'from-yellow-500 to-orange-500' },
  { days: 7, label: '🌙 7 Days', emoji: '🌙', color: 'from-blue-500 to-purple-500' },
  { days: 30, label: '🎯 30 Days', emoji: '🎯', color: 'from-green-500 to-teal-500' },
  { days: 90, label: '🚀 90 Days', emoji: '🚀', color: 'from-cyan-500 to-blue-500' },
  { days: 180, label: '⭐ 180 Days', emoji: '⭐', color: 'from-pink-500 to-red-500' },
  { days: 365, label: '🔮 365 Days', emoji: '🔮', color: 'from-purple-500 to-indigo-500' }
];

export default function CreatePage() {
  const router = useRouter();
  const fid = 3;
  const createRipple = useRipple();
  
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  const handleNext = () => {
    if (step === 1 && message.trim().length > 0) {
      setStep(2);
    } else if (step === 2 && selectedDuration !== null) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreateCapsule = async () => {
    if (!message.trim() || selectedDuration === null) {
      alert('Please complete all fields');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Creating capsule:', { fid, message: message.substring(0, 30), duration: selectedDuration });

      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid,
          message: message.trim(),
          duration: selectedDuration
        })
      });

      const data = await response.json();
      console.log('📦 API Response:', data);

      if (data.success) {
        console.log('✅ Capsule created successfully!');
        
        // Epic success animation!
        createConfetti(60);
        createSparkles(document.body, 24);
        
        setTimeout(() => {
          router.push('/capsules');
        }, 1500);
      } else {
        console.error('❌ Failed to create capsule:', data.message);
        alert(`Failed to create capsule: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ Error creating capsule:', error);
      alert('Error creating capsule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUnlockDate = () => {
    if (!selectedDuration) return '';
    const date = new Date();
    date.setDate(date.getDate() + selectedDuration);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#000814] pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 p-6 fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Create Capsule</h1>
          <p className="text-gray-400 font-medium">Lock a message for your future self</p>
        </div>

        {/* Progress Steps with Animation */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 scale-hover ${
                step >= num
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/50 pulse'
                  : 'bg-[#1A1F2E] text-gray-500'
              } ${step === num ? 'scale-110' : 'scale-100'}`}>
                {step > num ? <Check className="w-6 h-6" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-24 h-1 mx-2 transition-all duration-500 ${
                  step > num ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-[#1A1F2E]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Message */}
        {step === 1 && (
          <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl card-hover">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#0052FF]" />
              <h2 className="text-2xl font-black text-white">Your Message</h2>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to your future self... What do you want to remember? What are your predictions?"
              maxLength={maxLength}
              className="w-full h-64 px-6 py-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20 resize-none font-medium text-lg transition-all"
            />

            <div className="flex items-center justify-between mt-4">
              <p className={`text-sm font-bold transition-all ${
                remainingChars < 50 ? 'text-red-500 bounce' : 'text-gray-400'
              }`}>
                {remainingChars} characters remaining
              </p>
              <p className="text-sm text-gray-500">
                {message.length} / {maxLength}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#0052FF]" />
              <h2 className="text-2xl font-black text-white">Lock Duration</h2>
            </div>

            <p className="text-gray-400 font-medium mb-8">
              How long should this message remain locked?
            </p>

            <div className="grid grid-cols-2 gap-4">
              {durations.map((duration, index) => (
                <button
                  key={duration.days}
                  onClick={(e) => {
                    createRipple(e);
                    setSelectedDuration(duration.days);
                    createSparkles(e.currentTarget, 6);
                  }}
                  className={`stagger-item p-6 rounded-2xl border-2 transition-all relative overflow-hidden btn-lift ${
                    selectedDuration === duration.days
                      ? `bg-gradient-to-r ${duration.color} border-transparent shadow-2xl text-white scale-105`
                      : 'bg-[#1A1F2E] border-[#0052FF]/20 hover:border-[#0052FF] text-gray-400 hover:text-white'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-2">{duration.emoji}</div>
                  <p className="font-black text-lg">{duration.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-[#0052FF]" />
              <h2 className="text-2xl font-black text-white">Review & Lock</h2>
            </div>

            <div className="space-y-6">
              {/* Message Preview */}
              <div className="fade-in-up">
                <label className="block text-sm font-bold text-gray-400 mb-2">Your Message</label>
                <div className="bg-[#1A1F2E] rounded-2xl p-6 card-hover">
                  <p className="text-white font-medium leading-relaxed">{message}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-bold text-gray-400 mb-2">Lock Duration</label>
                <div className="bg-[#1A1F2E] rounded-2xl p-6 card-hover">
                  <p className="text-[#0052FF] font-black text-xl">
                    {durations.find(d => d.days === selectedDuration)?.label}
                  </p>
                </div>
              </div>

              {/* Unlock Date */}
              <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-bold text-gray-400 mb-2">Unlocks On</label>
                <div className="bg-[#1A1F2E] rounded-2xl p-6 flex items-center gap-3 card-hover">
                  <Clock className="w-6 h-6 text-cyan-500" />
                  <p className="text-cyan-500 font-black text-lg">{getUnlockDate()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={(e) => {
                createRipple(e);
                handleBack();
              }}
              className="flex-1 px-8 py-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-xl font-bold text-white hover:border-[#0052FF] transition-all flex items-center justify-center gap-2 btn-lift relative overflow-hidden"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={(e) => {
                createRipple(e);
                handleNext();
              }}
              disabled={(step === 1 && !message.trim()) || (step === 2 && selectedDuration === null)}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-lift relative overflow-hidden"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                createRipple(e);
                handleCreateCapsule();
              }}
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-lift relative overflow-hidden"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Locking...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Lock Capsule
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0E14]/95 backdrop-blur-md border-t-2 border-[#0052FF]/20 z-50">
        <div className="h-full flex items-center justify-around px-6">
          <a href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-bold">Home</span>
          </a>
          <a href="/capsules" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-bold">Capsules</span>
          </a>
          <a href="/create" className="flex flex-col items-center gap-1 text-[#0052FF]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-bold">Create</span>
          </a>
          <a href="/reveals" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Reveals</span>
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all scale-hover">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-bold">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}