'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Lock, Unlock, Trophy, TrendingUp, Sparkles, Award, Gift } from 'lucide-react';
import { useRipple, createSparkles } from '@/components/animations/effects';
import { AchievementCard } from '@/components/ui/achievement-card';
import { BadgeShowcase } from '@/components/ui/badge-showcase';
import BottomNav from '@/components/ui/bottom-nav';
import { useFarcaster } from '../hooks/use-farcaster';

interface Stats {
  totalCapsules: number;
  revealedCapsules: number;
  longestDuration: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
  progress: number;
  max: number;
}

export default function ProfilePage() {
  const { fid, isLoading } = useFarcaster();
  const createRipple = useRipple();
  const [stats, setStats] = useState<Stats>({
    totalCapsules: 0,
    revealedCapsules: 0,
    longestDuration: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unclaimedCount, setUnclaimedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const achievementResponse = await fetch(`/api/achievements?fid=${fid}`);
      const achievementData = await achievementResponse.json();

      if (achievementData.success) {
        console.log('🏆 Achievements:', achievementData);
        setAchievements(achievementData.achievements);
        setStats(achievementData.stats);
        setUnclaimedCount(achievementData.unclaimedCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAchievement = async (achievementId: string) => {
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fid, 
          action: 'claim',
          achievementId 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('🎁 Claimed:', achievementId);
        // Refresh achievements
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to claim achievement:', error);
    }
  };

  const getAchievementLevel = () => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    
    if (unlockedCount >= 8) return { level: 'Legend', progress: 100, next: 'Max Level!' };
    if (unlockedCount >= 5) return { level: 'Master', progress: (unlockedCount / 8) * 100, next: '8 achievements' };
    if (unlockedCount >= 3) return { level: 'Collector', progress: (unlockedCount / 5) * 100, next: '5 achievements' };
    if (unlockedCount >= 1) return { level: 'Explorer', progress: (unlockedCount / 3) * 100, next: '3 achievements' };
    return { level: 'Newcomer', progress: 0, next: '1 achievement' };
  };

  const levelInfo = getAchievementLevel();
  const lockedCapsules = stats.totalCapsules - stats.revealedCapsules;

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
            <p className="text-gray-400 font-bold">Loading profile...</p>
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
          <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-[#0052FF]" />
            My Profile
          </h1>
          <p className="text-gray-400 font-medium">Your journey through time</p>
        </div>

        {/* Profile Card */}
        <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-8 mb-6 card-hover">
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 pulse">
              <User className="w-12 h-12 text-white" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-1">Time Traveler #{fid}</h2>
              <p className="text-gray-400 font-medium mb-3">Base Box Pioneer</p>
              
              {/* Achievement Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-full">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-500 font-bold text-sm">{levelInfo.level}</span>
              </div>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">Achievement Level</span>
              <span className="text-sm font-bold text-[#0052FF]">{levelInfo.next}</span>
            </div>
            <div className="w-full h-3 bg-[#1A1F2E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2 text-center">
              {Math.round(levelInfo.progress)}% Complete • {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={Lock}
            label="Total Capsules"
            value={stats.totalCapsules}
            color="blue"
            delay={0.1}
            createRipple={createRipple}
          />
          <StatCard
            icon={Lock}
            label="Locked"
            value={lockedCapsules}
            color="orange"
            delay={0.2}
            createRipple={createRipple}
          />
          <StatCard
            icon={Unlock}
            label="Revealed"
            value={stats.revealedCapsules}
            color="green"
            delay={0.3}
            createRipple={createRipple}
          />
          <StatCard
            icon={TrendingUp}
            label="Longest Lock"
            value={stats.longestDuration}
            suffix="d"
            color="purple"
            delay={0.4}
            createRipple={createRipple}
          />
        </div>

        {/* Unclaimed Alert */}
        {unclaimedCount > 0 && (
          <div className="slide-up bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 mb-6 card-hover pulse" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-1">
                  {unclaimedCount} Reward{unclaimedCount !== 1 ? 's' : ''} Available!
                </h3>
                <p className="text-yellow-400 font-medium">
                  Claim your achievement rewards below
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Badge Showcase Section */}
        <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-6 mb-6 card-hover" style={{ animationDelay: '0.6s' }}>
          <BadgeShowcase badges={achievements} />
        </div>

        {/* Achievements Section */}
        <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-6 mb-6 card-hover" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-black text-white">Achievements</h3>
            </div>
            <div className="flex items-center gap-3">
              {unclaimedCount > 0 && (
                <div className="px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500/30 rounded-full pulse">
                  <span className="text-sm font-bold text-yellow-400">
                    {unclaimedCount} to claim
                  </span>
                </div>
              )}
              <div className="px-4 py-2 bg-[#1A1F2E] border-2 border-[#0052FF]/20 rounded-full">
                <span className="text-sm font-bold text-[#0052FF]">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="stagger-item" style={{ animationDelay: `${0.1 * index}s` }}>
                <AchievementCard 
                  {...achievement} 
                  onClaim={handleClaimAchievement}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="slide-up bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 rounded-3xl p-6 card-hover" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-cyan-500" />
            <h3 className="text-xl font-black text-white">Recent Activity</h3>
          </div>

          <div className="space-y-4">
            {stats.totalCapsules > 0 && (
              <TimelineItem
                icon={Lock}
                title="Capsule Created"
                description={`You've created ${stats.totalCapsules} time capsule${stats.totalCapsules !== 1 ? 's' : ''}`}
                time="Recently"
                color="blue"
              />
            )}
            {stats.revealedCapsules > 0 && (
              <TimelineItem
                icon={Unlock}
                title="Capsules Revealed"
                description={`${stats.revealedCapsules} capsule${stats.revealedCapsules !== 1 ? 's have' : ' has'} been unlocked`}
                time="Recently"
                color="green"
              />
            )}
            <TimelineItem
              icon={Sparkles}
              title="Welcome to Base Box!"
              description="Your journey through time begins"
              time="Started"
              color="purple"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <a
            href="/create"
            onClick={(e: any) => createRipple(e)}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 btn-lift relative overflow-hidden"
          >
            <Lock className="w-5 h-5" />
            Create Capsule
          </a>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay,
  createRipple,
}: {
  icon: any;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay: number;
  createRipple: any;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-500',
  }[color];

  return (
    <div
      onClick={(e) => {
        createRipple(e);
        createSparkles(e.currentTarget, 6);
      }}
      className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6 transition-all card-hover cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl font-black text-white mb-1 number-pop">
        {value}{suffix || ''}
      </p>
      <p className="text-sm text-gray-400 font-medium">{label}</p>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  icon: Icon,
  title,
  description,
  time,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
  }[color];

  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 ${colorClasses} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}