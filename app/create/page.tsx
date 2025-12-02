'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock, Sparkles, ArrowRight, ArrowLeft, Check, Image as ImageIcon, X } from 'lucide-react';
import { AchievementToast, useAchievements } from '@/components/ui/achievement-toast';
import { useFarcaster } from '@/hooks/use-farcaster';
import BottomNav from '@/components/ui/bottom-nav';

const durations = [
  { days: 1/24, label: '⚡ 1 Hour', emoji: '⚡', color: 'from-yellow-500 to-orange-500', badge: 'Quick' },
  { days: 1, label: '📆 1 Day', emoji: '📆', color: 'from-yellow-500 to-orange-500' },
  { days: 7, label: '🌙 7 Days', emoji: '🌙', color: 'from-blue-500 to-purple-500' },
  { days: 30, label: '🍀 30 Days', emoji: '🍀', color: 'from-green-500 to-teal-500' },
  { days: 90, label: '🚀 90 Days', emoji: '🚀', color: 'from-cyan-500 to-blue-500' },
  { days: 180, label: '⭐ 180 Days', emoji: '⭐', color: 'from-pink-500 to-red-500' },
  { days: 365, label: '🌸 365 Days', emoji: '🌸', color: 'from-purple-500 to-indigo-500' }
];

export default function CreatePage() {
  const router = useRouter();
  const { fid, isLoading } = useFarcaster();
  const { newAchievement, checkAchievements, clearAchievement } = useAchievements(fid || 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(durations[2]);
  const [image, setImage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!fid) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">Unable to connect. Please use from Warpcast.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // ✅ alert() yerine state kullanıyoruz
      setErrorMessage('Image must be less than 5MB');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setErrorMessage(null); // Clear any previous errors
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateCapsule = async () => {
    if (!message.trim()) return;

    setCreating(true);
    setErrorMessage(null); // Clear previous errors
    
    try {
      console.log('🎨 [Create] Starting capsule creation...');
      console.log('🎨 [Create] FID:', fid);
      console.log('🎨 [Create] Duration:', selectedDuration.days, 'days');

      // ✅ FIXED: duration parametresini ekliyoruz
      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          message: message.trim(),
          duration: selectedDuration.days, // ✅ EKLENDI!
          image,
          imageType: image ? 'image/jpeg' : undefined, // ✅ EKLENDI!
        }),
      });

      console.log('🎨 [Create] Response status:', response.status);
      
      const data = await response.json();
      console.log('🎨 [Create] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create capsule');
      }

      if (data.success) {
        console.log('✅ [Create] Capsule created successfully!');
        
        // Check achievements
        await checkAchievements();

        // Show success and redirect
        setTimeout(() => {
          router.push('/capsules');
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to create capsule');
      }
    } catch (error: any) {
      console.error('❌ [Create] Error:', error);
      // ✅ alert() yerine state kullanıyoruz
      setErrorMessage(error.message || 'Failed to create capsule. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] pb-20">
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

      <AchievementToast achievement={newAchievement} onClose={clearAchievement} />

      {/* ✅ Error Toast (alert() yerine) */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-red-500/90 backdrop-blur-md border-2 border-red-400 rounded-xl px-6 py-4 shadow-xl max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2 fade-in-up">Create Capsule</h1>
          <p className="text-gray-400 fade-in-up" style={{ animationDelay: '0.1s' }}>
            Step {step} of 3
          </p>
        </div>

        <div className="mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="h-2 bg-[#0A0E14]/60 backdrop-blur-md rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0052FF] to-cyan-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Message */}
        {step === 1 && (
          <div className="space-y-6 fade-in-up">
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0052FF]/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#0052FF]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Your Message</h2>
                  <p className="text-sm text-gray-400">What do you want to remember?</p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                maxLength={1000}
                className="w-full h-40 bg-[#1A1F2E] border-2 border-[#0052FF]/20 focus:border-[#0052FF] rounded-xl p-4 text-white placeholder-gray-500 resize-none transition-all outline-none"
              />
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  {message.length} / 1000 characters
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Add Image (Optional)</h2>
                  <p className="text-sm text-gray-400">Max 5MB</p>
                </div>
              </div>

              {!image ? (
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
                    className="w-full py-4 border-2 border-dashed border-[#0052FF]/30 hover:border-[#0052FF] rounded-xl text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-bold">Choose Image</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full rounded-xl overflow-hidden bg-[#1A1F2E]">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <img
                        src={image}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!message.trim()}
              className="w-full py-4 bg-gradient-to-r from-[#0052FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <span>Next Step</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="space-y-6 fade-in-up">
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0052FF]/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#0052FF]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Lock Duration</h2>
                  <p className="text-sm text-gray-400">How long should it be locked?</p>
                </div>
              </div>

              <div className="space-y-3">
                {durations.map((duration, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDuration(duration)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selectedDuration.days === duration.days
                        ? 'border-[#0052FF] bg-[#0052FF]/10'
                        : 'border-[#0052FF]/20 hover:border-[#0052FF]/50 bg-[#1A1F2E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{duration.emoji}</span>
                      <span className="text-white font-bold">{duration.label}</span>
                    </div>
                    {selectedDuration.days === duration.days && (
                      <Check className="w-5 h-5 text-[#0052FF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-gradient-to-r from-[#0052FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Review</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-6 fade-in-up">
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Review Your Capsule</h2>
                  <p className="text-sm text-gray-400">Everything looks good?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1A1F2E] rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Message</p>
                  <p className="text-white font-medium">{message}</p>
                </div>

                {image && (
                  <div className="bg-[#1A1F2E] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-3">Image</p>
                    <div className="relative w-full rounded-lg overflow-hidden">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <img
                          src={image}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#1A1F2E] rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Duration</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedDuration.emoji}</span>
                    <span className="text-white font-bold">{selectedDuration.label}</span>
                  </div>
                </div>

                <div className="bg-[#1A1F2E] rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Unlock Date</p>
                  <p className="text-white font-bold">
                    {new Date(Date.now() + selectedDuration.days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={creating}
                className="flex-1 py-4 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleCreateCapsule}
                disabled={creating}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Lock Capsule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}