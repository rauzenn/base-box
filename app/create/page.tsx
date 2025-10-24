'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock, Sparkles, ArrowRight, ArrowLeft, Check, Image as ImageIcon, X } from 'lucide-react';
import { useRipple, createSparkles, createConfetti } from '@/components/animations/effects';
import { AchievementToast, useAchievements } from '@/components/ui/achievement-toast';

// Note: Use achievement-toast-WITH-CLAIM.tsx version for claim functionality

const durations = [
  { days: 1/24, label: '⚡ 1 Hour', emoji: '⚡', color: 'from-yellow-500 to-orange-500', badge: 'Quick' },
  { days: 1, label: '📅 1 Day', emoji: '📅', color: 'from-yellow-500 to-orange-500' },
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { newAchievement, checkAchievements, clearAchievement } = useAchievements(fid);
  
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Image state
  const [image, setImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const maxLength = 500;
  const remainingChars = maxLength - message.length;
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxImageSize) {
      setImageError('Image must be under 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setImageType(file.type);
      console.log('📸 Image loaded:', file.type, (file.size / 1024 / 1024).toFixed(2), 'MB');
    };
    reader.onerror = () => {
      setImageError('Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageType(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      console.log('🚀 Creating capsule with image:', { 
        fid, 
        message: message.substring(0, 30), 
        duration: selectedDuration,
        hasImage: !!image 
      });

      const payload: any = {
        fid,
        message: message.trim(),
        duration: selectedDuration
      };

      // Add image if exists
      if (image && imageType) {
        payload.image = image;
        payload.imageType = imageType;
      }

      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('📦 API Response:', data);

      if (data.success) {
        console.log('✅ Capsule created successfully!');
        
        // Epic success animation!
        createConfetti(60);
        createSparkles(document.body, 24);

        // Check for new achievements
        setTimeout(async () => {
          await checkAchievements();
        }, 1000);
        
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

      {/* Achievement Toast */}
      <AchievementToast achievement={newAchievement} onClose={clearAchievement} />

      <div className="relative z-10 p-6 fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Create Capsule</h1>
          <p className="text-gray-400 font-medium">Lock a message & memory for your future self</p>
        </div>

        {/* Progress Steps */}
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

        {/* Step 1: Message & Image */}
        {step === 1 && (
          <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 shadow-2xl card-hover">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#0052FF]" />
              <h2 className="text-2xl font-black text-white">Your Message & Memory</h2>
            </div>

            {/* Message Input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to your future self... What do you want to remember? What are your predictions?"
              maxLength={maxLength}
              className="w-full h-48 px-6 py-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20 resize-none font-medium text-lg transition-all mb-4"
            />

            <div className="flex items-center justify-between mb-6">
              <p className={`text-sm font-bold transition-all ${
                remainingChars < 50 ? 'text-red-500 bounce' : 'text-gray-400'
              }`}>
                {remainingChars} characters remaining
              </p>
              <p className="text-sm text-gray-500">
                {message.length} / {maxLength}
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="border-t-2 border-gray-800 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-6 h-6 text-cyan-500" />
                <h3 className="text-lg font-black text-white">Add a Memory (Optional)</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                📸 Attach a photo, screenshot, or image to your time capsule (max 5MB)
              </p>

              {/* Image Preview or Upload Button */}
              {image ? (
                <div className="relative card-hover rounded-2xl overflow-hidden border-2 border-cyan-500/30">
                  {/* FIXED: 16:9 Aspect Ratio Container */}
                  <div className="relative w-full bg-[#1A1F2E]" style={{ paddingBottom: '56.25%' }}>
                    <img 
                      src={image} 
                      alt="Capsule memory" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-all btn-lift z-10"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Image Info Badge */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                    <p className="text-xs text-white font-bold">
                      ✅ Image attached
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-[#0052FF]/30 hover:border-[#0052FF] rounded-2xl transition-all btn-lift flex flex-col items-center gap-3 bg-[#1A1F2E]/50"
                  >
                    <ImageIcon className="w-12 h-12 text-[#0052FF]" />
                    <div>
                      <p className="text-white font-bold mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500">JPG, PNG, GIF, WebP (max 5MB)</p>
                    </div>
                  </button>
                </div>
              )}

              {imageError && (
                <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                  <p className="text-red-500 text-sm font-bold">⚠️ {imageError}</p>
                </div>
              )}
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  {/* Quick Badge (for 1h) */}
                  {duration.badge && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-black text-xs font-black rounded-full">
                      {duration.badge}
                    </div>
                  )}
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

              {/* Image Preview - FIXED */}
              {image && (
                <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Your Memory</label>
                  <div className="card-hover rounded-2xl overflow-hidden border-2 border-cyan-500/30">
                    {/* FIXED: 16:9 Aspect Ratio Container */}
                    <div className="relative w-full bg-[#1A1F2E]" style={{ paddingBottom: '56.25%' }}>
                      <img 
                        src={image} 
                        alt="Capsule memory" 
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="fade-in-up" style={{ animationDelay: image ? '0.2s' : '0.1s' }}>
                <label className="block text-sm font-bold text-gray-400 mb-2">Lock Duration</label>
                <div className="bg-[#1A1F2E] rounded-2xl p-6 card-hover">
                  <p className="text-[#0052FF] font-black text-xl">
                    {durations.find(d => d.days === selectedDuration)?.label}
                  </p>
                </div>
              </div>

              {/* Unlock Date */}
              <div className="fade-in-up" style={{ animationDelay: image ? '0.3s' : '0.2s' }}>
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