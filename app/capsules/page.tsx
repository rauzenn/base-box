'use client';

import { useState, useEffect } from 'react';
import { Lock, Clock, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';
import { useFarcaster } from '../hooks/use-farcaster';

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

type FilterType = 'all' | 'locked' | 'revealed';

export default function CapsulesPage() {
  const { fid, isLoading } = useFarcaster();
  const createRipple = useRipple();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success) {
        console.log('📦 Fetched capsules:', data.capsules);
        setCapsules(data.capsules);
      }
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCapsules = capsules.filter((capsule) => {
    if (filter === 'all') return true;
    if (filter === 'locked') return !capsule.revealed && new Date(capsule.unlockDate) > new Date();
    if (filter === 'revealed') return capsule.revealed || new Date(capsule.unlockDate) <= new Date();
    return true;
  });

  const getTimeRemaining = (unlockDate: string) => {
    const now = new Date().getTime();
    const unlock = new Date(unlockDate).getTime();
    const diff = unlock - now;

    if (diff <= 0) return 'Ready to unlock!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const isUnlocked = (capsule: Capsule) => {
    return capsule.revealed || new Date(capsule.unlockDate) <= new Date();
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
            <div className="w-16 h-16 border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
            <p className="text-gray-400 font-bold">Loading capsules...</p>
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
              <Lock className="w-8 h-8 text-[#0052FF]" />
              My Capsules
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-full">
              <Calendar className="w-4 h-4 text-[#0052FF]" />
              <span className="text-white font-bold text-sm">{capsules.length} total</span>
            </div>
          </div>
          <p className="text-gray-400 font-medium">Your locked messages & memories</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-2">
          <Sparkles className="w-5 h-5 text-gray-500 ml-2" />
          {(['all', 'locked', 'revealed'] as FilterType[]).map((type) => {
            const count = type === 'all' 
              ? capsules.length
              : type === 'locked'
              ? capsules.filter(c => !isUnlocked(c)).length
              : capsules.filter(c => isUnlocked(c)).length;

// Loading state
if (isLoading) {
  return (
    <div className="min-h-screen bg-[#000814] pb-24">
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
          <p className="text-gray-400 font-bold">Loading...</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

// No FID error state
if (!fid) {
  return (
    <div className="min-h-screen bg-[#000814] pb-24">
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      
      <div className="relative z-10 flex items-center justify-center h-screen text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Farcaster Required</h2>
          <p className="text-gray-400">Please open this app in Farcaster</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

            return (
              <button
                key={type}
                onClick={(e) => {
                  createRipple(e);
                  setFilter(type);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all relative overflow-hidden ${
                  filter === type
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1F2E]'
                }`}
              >
                {type === 'all' && `All (${count})`}
                {type === 'locked' && `Locked (${count})`}
                {type === 'revealed' && `Revealed (${count})`}
              </button>
            );
          })}
        </div>

        {/* Capsules Grid */}
        {filteredCapsules.length === 0 ? (
          <div className="text-center py-20 fade-in-up">
            <div className="w-24 h-24 bg-[#1A1F2E] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No capsules found</h3>
            <p className="text-gray-400 mb-8">
              {filter === 'all'
                ? 'Create your first time capsule!'
                : `No ${filter} capsules yet.`}
            </p>
            <a
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-xl hover:shadow-blue-500/50 transition-all btn-lift"
            >
              <Lock className="w-5 h-5" />
              Create Capsule
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule, index) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                index={index}
                isUnlocked={isUnlocked(capsule)}
                getTimeRemaining={getTimeRemaining}
                onImageClick={setSelectedImage}
                createRipple={createRipple}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Capsule Card Component
function CapsuleCard({
  capsule,
  index,
  isUnlocked,
  getTimeRemaining,
  onImageClick,
  createRipple,
}: {
  capsule: any;
  index: number;
  isUnlocked: boolean;
  getTimeRemaining: (date: string) => string;
  onImageClick: (image: string) => void;
  createRipple: any;
}) {
  return (
    <div
      className={`stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 rounded-2xl overflow-hidden transition-all card-hover ${
        isUnlocked
          ? 'border-green-500/30 shadow-xl shadow-green-500/10'
          : 'border-[#0052FF]/20 hover:border-[#0052FF]/40'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Thumbnail */}
      {capsule.image && (
        <div
          onClick={() => isUnlocked && onImageClick(capsule.image!)}
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: '56.25%' }}
        >
          {isUnlocked ? (
            // UNLOCKED: Show actual image
            <>
              <div className="absolute inset-0 bg-[#1A1F2E] cursor-pointer group">
                <img
                  src={capsule.image}
                  alt="Capsule memory"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Badge */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-cyan-500/30">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Photo
                </div>
              </div>
            </>
          ) : (
            // LOCKED: Show gradient background (NO IMAGE!)
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-[#0A0E14] flex items-center justify-center">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent animate-pulse" />
              
              {/* Lock icon and text */}
              <div className="relative text-center z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <p className="text-white text-lg font-black">Locked</p>
                <p className="text-white/60 text-sm font-medium mt-1">Image hidden until reveal</p>
              </div>

              {/* Photo Badge (locked version) */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-1.5 text-xs text-white/60 font-bold">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Photo
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
              isUnlocked
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}
          >
            {isUnlocked ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Unlocked
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Locked
              </>
            )}
          </div>
        </div>

        {/* Message Preview */}
        <div>
          <p className="text-white font-medium line-clamp-3 leading-relaxed">
            {isUnlocked ? capsule.message : '🔒 Message locked until unlock date'}
          </p>
        </div>

        {/* Time Info */}
        <div className="pt-3 border-t-2 border-gray-800 space-y-2">
          {!isUnlocked && (
            <div className="flex items-center gap-2 text-sm text-[#0052FF] font-bold">
              <Clock className="w-4 h-4" />
              <span>{getTimeRemaining(capsule.unlockDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {isUnlocked ? 'Unlocked' : 'Unlocks'} on{' '}
              {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isUnlocked && (
          <a
            href="/reveals"
            onClick={(e) => createRipple(e)}
            className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-bold rounded-xl transition-all text-center btn-lift relative overflow-hidden"
          >
            View Full Message
          </a>
        )}
      </div>
    </div>
  );
}

// Image Modal Component
function ImageModal({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <span className="text-white text-2xl">×</span>
        </button>

        {/* Image */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#1A1F2E] border-2 border-[#0052FF]/30">
          <img
            src={image}
            alt="Capsule memory full view"
            className="w-full h-auto object-contain max-h-[85vh]"
          />
        </div>
      </div>
    </div>
  );
}