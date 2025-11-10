'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock, Sparkles, ArrowRight, ArrowLeft, Check, Image as ImageIcon, X } from 'lucide-react';
import { AchievementToast, useAchievements } from '@/components/ui/achievement-toast';
import { useFarcaster } from '../hooks/use-farcaster';
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
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
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
    try {
      const unlockDate = new Date(Date.now() + selectedDuration.days * 24 * 60 * 60 * 1000);

      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          message: message.trim(),
          unlockDate: unlockDate.toISOString(),
          image,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Check achievements
        await checkAchievements();

        // Show success and redirect
        setTimeout(() => {
          router.push('/capsules');
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to create capsule');
      }
    } catch (error) {
      console.error('Error creating capsule:', error);
      alert('❌ Failed to create capsule. Please try again.');
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
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to your future self..."
                className="w-full h-64 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none transition-all"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-500 text-sm">{message.length} / 1000 characters</p>
                {message.length > 900 && (
                  <p className="text-sm font-medium text-orange-500">{1000 - message.length} left</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <ImageIcon className="w-5 h-5 text-cyan-500" />
                Add Image (Optional)
              </label>
              
              {!image ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-dashed border-blue-500/30 rounded-2xl hover:border-blue-500 transition-all flex flex-col items-center gap-3"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400 font-medium">Click to upload image</span>
                  <span className="text-gray-500 text-sm">Max 5MB</span>
                </button>
              ) : (
                <div className="relative">
                  <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    <img 
                      src={image} 
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain bg-[#0A0E14]/60"
                    />
                  </div>
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!message.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-lift flex items-center justify-center gap-2 relative overflow-hidden"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <label className="flex items-center gap-2 text-white font-bold mb-4">
                <Clock className="w-5 h-5 text-purple-500" />
                Lock Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                {durations.map((duration) => (
                  <button
                    key={duration.days}
                    onClick={() => setSelectedDuration(duration)}
                    className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all card-hover ${
                      selectedDuration.days === duration.days
                        ? 'border-blue-500 bg-blue-500/20 scale-105'
                        : 'border-white/10 bg-[#0A0E14]/60 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{duration.emoji}</div>
                    <div className="text-white font-bold">{duration.label.split(' ').slice(1).join(' ')}</div>
                    {duration.badge && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
                        {duration.badge}
                      </span>
                    )}
                    {selectedDuration.days === duration.days && (
                      <Check className="absolute top-2 left-2 w-5 h-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-white/10 rounded-2xl font-bold text-white hover:border-white/30 transition-all btn-lift flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all btn-lift flex items-center justify-center gap-2 relative overflow-hidden"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                <Check className="w-5 h-5 text-green-500" />
                Review Your Capsule
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Message</p>
                  <p className="text-white whitespace-pre-wrap">{message}</p>
                </div>

                {image && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Image</p>
                    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <img 
                        src={image} 
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-contain bg-[#0A0E14]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-sm mb-2">Duration</p>
                  <p className="flex items-center gap-2 text-white">
                    <span className="text-2xl">{selectedDuration.emoji}</span>
                    <span className="font-bold">{selectedDuration.label}</span>
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Unlock Date</p>
                  <p className="text-white font-medium">
                    {new Date(Date.now() + selectedDuration.days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                disabled={creating}
                className="flex-1 py-4 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-white/10 rounded-2xl font-bold text-white hover:border-white/30 transition-all disabled:opacity-50 btn-lift flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleCreateCapsule}
                disabled={creating}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 btn-lift flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
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

      <BottomNav />
    </div>
  );
}