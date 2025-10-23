'use client';

import { useState, useEffect } from 'react';
import { Unlock, Calendar, Download, Image as ImageIcon, Sparkles, Share2, Clock } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';

interface Capsule {
  id: string;
  fid: number;
  message: string;
  image?: string;
  imageType?: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export default function RevealsPage() {
  const fid = 3;
  const createRipple = useRipple();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);

  useEffect(() => {
    fetchRevealedCapsules();
  }, []);

  const fetchRevealedCapsules = async () => {
    try {
      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success) {
        const revealed = data.capsules.filter(
          (c: Capsule) => c.revealed || new Date(c.unlockDate) <= new Date()
        );
        console.log('🔓 Revealed capsules:', revealed);
        setCapsules(revealed);
      }
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSinceLocked = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const downloadImage = (imageData: string, capsuleId: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `base-box-memory-${capsuleId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] pb-24">
        <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
        <div className="fixed inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <p className="text-gray-400 font-bold">Loading revealed capsules...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] pb-24">
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <Unlock className="w-8 h-8 text-green-400" />
              Revealed Capsules
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold text-sm">{capsules.length} revealed</span>
            </div>
          </div>
          <p className="text-gray-400 font-medium">Your unlocked messages & memories</p>
        </div>

        {/* Content */}
        {capsules.length === 0 ? (
          <div className="text-center py-20 fade-in-up">
            <div className="w-24 h-24 bg-[#1A1F2E] rounded-full flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No revealed capsules yet</h3>
            <p className="text-gray-400 mb-8">
              Your time capsules will appear here once they're unlocked
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {capsules.map((capsule, index) => (
              <RevealedCapsuleCard
                key={capsule.id}
                capsule={capsule}
                index={index}
                getTimeSinceLocked={getTimeSinceLocked}
                onImageClick={() => setSelectedCapsule(capsule)}
                onDownload={downloadImage}
                createRipple={createRipple}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {selectedCapsule && selectedCapsule.image && (
        <FullImageModal
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
          onDownload={downloadImage}
          createRipple={createRipple}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Revealed Capsule Card Component
function RevealedCapsuleCard({
  capsule,
  index,
  getTimeSinceLocked,
  onImageClick,
  onDownload,
  createRipple,
}: {
  capsule: any;
  index: number;
  getTimeSinceLocked: (date: string) => string;
  onImageClick: () => void;
  onDownload: (image: string, id: string) => void;
  createRipple: any;
}) {
  return (
    <div 
      className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-green-500/30 rounded-2xl overflow-hidden shadow-xl shadow-green-500/5 hover:shadow-green-500/10 transition-all card-hover"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b-2 border-gray-800 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center pulse">
              <Unlock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">Time Capsule Revealed</h3>
              <p className="text-sm text-gray-400 font-medium">
                Locked {getTimeSinceLocked(capsule.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1F2E] rounded-lg border-2 border-[#0052FF]/20">
              <Calendar className="w-3.5 h-3.5 text-[#0052FF]" />
              <span className="text-xs text-gray-400 font-bold">
                {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image Display */}
        {capsule.image && (
          <div className="space-y-3 fade-in-up">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-500" />
                Memory Photo
              </h4>
              <button
                onClick={(e) => {
                  createRipple(e);
                  onDownload(capsule.image!, capsule.id);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] text-gray-300 hover:text-white text-sm font-bold rounded-xl transition-all btn-lift relative overflow-hidden"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>

            {/* Image Container - FIXED ASPECT RATIO */}
            <div
              onClick={onImageClick}
              className="relative w-full rounded-2xl overflow-hidden bg-[#1A1F2E] border-2 border-cyan-500/30 cursor-pointer group"
            >
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={capsule.image}
                  alt="Revealed memory"
                  className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-bold">
                    Click to view full size
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="space-y-3 fade-in-up" style={{ animationDelay: capsule.image ? '0.1s' : '0s' }}>
          <h4 className="text-sm font-black text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Message from the Past
          </h4>
          <div className="bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-2xl p-6 card-hover">
            <p className="text-white font-medium leading-relaxed whitespace-pre-wrap">{capsule.message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 fade-in-up" style={{ animationDelay: capsule.image ? '0.2s' : '0.1s' }}>
          <button 
            onClick={(e) => createRipple(e)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] text-white font-bold rounded-xl transition-all btn-lift relative overflow-hidden"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {capsule.image && (
            <button
              onClick={(e) => {
                createRipple(e);
                onImageClick();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-blue-500/50 btn-lift relative overflow-hidden"
            >
              <ImageIcon className="w-4 h-4" />
              View Full Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Full Image Modal Component
function FullImageModal({
  capsule,
  onClose,
  onDownload,
  createRipple,
}: {
  capsule: any;
  onClose: () => void;
  onDownload: (image: string, id: string) => void;
  createRipple: any;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2 fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Unlock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">Memory Photo</h3>
              <p className="text-sm text-gray-400 font-medium">
                {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-12 h-12 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-full flex items-center justify-center transition-all btn-lift"
          >
            <span className="text-white text-2xl font-bold leading-none">×</span>
          </button>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#1A1F2E] border-2 border-cyan-500/30 slide-up">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={capsule.image!}
              alt="Full size memory"
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 mt-4 px-2 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex-1">
            <p className="text-sm text-gray-400 font-medium line-clamp-2">{capsule.message}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                createRipple(e);
                onDownload(capsule.image!, capsule.id);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-blue-500/50 btn-lift relative overflow-hidden"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button 
              onClick={(e) => createRipple(e)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] text-white font-bold rounded-xl transition-all btn-lift relative overflow-hidden"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}