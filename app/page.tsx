'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Clock, Sparkles, TrendingUp, Zap, Gift, Rocket, Shield, Users, ArrowRight, Star, Trophy } from 'lucide-react';
import { useRipple, createSparkles, createConfetti } from '@/components/animations/effects';
import BottomNav from '@/components/ui/bottom-nav';

interface Stats {
  totalCapsules: number;
  revealedToday: number;
  totalUsers: number;
}

export default function HomePage() {
  const fid = 3;
  const createRipple = useRipple();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState<Stats>({ 
    totalCapsules: 0, 
    revealedToday: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchStats();
    
    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/capsules/list?fid=${fid}`);
      const data = await response.json();

      if (data.success && data.capsules) {
        const total = data.capsules.length;
        const revealed = data.capsules.filter((c: any) => c.revealed || new Date(c.unlockDate) <= new Date()).length;
        
        setStats({ 
          totalCapsules: total,
          revealedToday: revealed,
          totalUsers: 1 // Mock data for now
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    createRipple(e);
    createSparkles(e.currentTarget, 20);
    createConfetti(40);
  };

  return (
    <div className="min-h-screen bg-[#000814] pb-24 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#000814] via-[#001428] to-[#000814]" />
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 82, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 82, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
        }}
      />

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="px-6 pt-12 pb-20 fade-in-up">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A0E14]/60 backdrop-blur-xl border-2 border-[#0052FF]/30 rounded-full mb-8 pulse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-black text-lg">Base Box</span>
              <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                <span className="text-xs font-bold text-blue-400">v1.0</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="inline-block animate-gradient bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto]">
                Lock Messages
              </span>
              <br />
              <span className="text-white">On Base Chain</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl text-gray-300 font-bold mb-4">
              Time remembers. <span className="text-cyan-400">Base</span> preserves.
            </p>
            <p className="text-lg text-gray-400 font-medium mb-12 max-w-2xl mx-auto">
              Create time capsules, lock memories onchain, and reveal them when the time is right. 
              Built for the <span className="text-blue-400 font-bold">Based</span> community.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="/create"
                onClick={handleCTAClick}
                className="group relative w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-black text-xl text-white shadow-2xl hover:shadow-blue-500/50 transition-all overflow-hidden btn-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Create Capsule</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a
                href="/capsules"
                onClick={(e) => createRipple(e)}
                className="w-full sm:w-auto px-8 py-5 bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/30 hover:border-[#0052FF] rounded-2xl font-bold text-lg text-white transition-all btn-lift relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>View Collection</span>
                </div>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Onchain</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Stats Dashboard */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Community Stats</h2>
              <p className="text-gray-400 font-medium">Real-time blockchain data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={Lock}
                label="Total Capsules"
                value={stats.totalCapsules}
                suffix=""
                color="blue"
                loading={loading}
                delay={0}
              />
              <StatCard
                icon={Unlock}
                label="Revealed Today"
                value={stats.revealedToday}
                suffix=""
                color="green"
                loading={loading}
                delay={0.1}
              />
              <StatCard
                icon={Users}
                label="Time Travelers"
                value={stats.totalUsers}
                suffix="+"
                color="purple"
                loading={loading}
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-3">How It Works</h2>
              <p className="text-gray-400 font-medium text-lg">Three simple steps to time travel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Lock}
                number="01"
                title="Lock Your Message"
                description="Write a message to your future self. Add photos, predictions, goals. Everything stays private."
                color="blue"
                delay={0}
              />
              <FeatureCard
                icon={Clock}
                number="02"
                title="Set the Timer"
                description="Choose when to unlock: 1 day to 1 year. Your capsule is sealed on Base blockchain."
                color="cyan"
                delay={0.1}
              />
              <FeatureCard
                icon={Gift}
                number="03"
                title="Reveal & Collect"
                description="When time's up, unlock your capsule and mint an NFT proof. Forever on Base."
                color="green"
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-3">Built Different</h2>
              <p className="text-gray-400 font-medium text-lg">Powered by Base blockchain</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenefitCard
                icon={Shield}
                title="100% Onchain"
                description="Every capsule lives on Base. Decentralized, immutable, forever."
                gradient="from-blue-500 to-cyan-500"
              />
              <BenefitCard
                icon={Zap}
                title="Gas-Free Experience"
                description="Create and reveal capsules with minimal fees. Base makes it affordable."
                gradient="from-purple-500 to-pink-500"
              />
              <BenefitCard
                icon={Lock}
                title="Private by Default"
                description="Your messages stay encrypted until reveal. Only you can unlock them."
                gradient="from-green-500 to-emerald-500"
              />
              <BenefitCard
                icon={Trophy}
                title="Achievement System"
                description="Unlock badges and rewards as you create more capsules. Flex your collection."
                gradient="from-yellow-500 to-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl p-12 shadow-2xl">
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, white 1px, transparent 1px),
                    linear-gradient(to bottom, white 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}
              />

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-bold text-sm">Join the Based community</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Ready to Time Travel?
                </h2>
                <p className="text-xl text-white/90 font-medium mb-8 max-w-2xl mx-auto">
                  Lock your first message onchain and start building your collection today.
                </p>

                <a
                  href="/create"
                  onClick={handleCTAClick}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-gray-100 rounded-2xl font-black text-xl text-[#0052FF] shadow-2xl hover:shadow-white/20 transition-all btn-lift"
                >
                  <Rocket className="w-6 h-6" />
                  <span>Create First Capsule</span>
                  <Sparkles className="w-6 h-6" />
                </a>

                <p className="text-white/70 text-sm font-medium mt-6">
                  No wallet? No problem. Get started in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Community */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 font-medium mb-6">Built with 💙 on Base</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-400 font-medium text-sm">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-400 font-medium text-sm">Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-400 font-medium text-sm">Open Source</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
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
  loading,
  delay
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  color: 'blue' | 'green' | 'purple';
  loading: boolean;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!loading && value > 0) {
      let current = 0;
      const increment = value / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [loading, value]);

  const colorConfig: Record<'blue' | 'green' | 'purple', { gradient: string; text: string; border: string }> = {
    blue: { gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-400', border: 'border-blue-500/30' },
    green: { gradient: 'from-green-500 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' },
    purple: { gradient: 'from-purple-500 to-pink-500', text: 'text-purple-400', border: 'border-purple-500/30' }
  };

  const config = colorConfig[color];

  return (
    <div 
      className={`stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 ${config.border} rounded-2xl p-8 card-hover relative overflow-hidden`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl`} />
      
      <div className="relative">
        <div className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <div className={`text-5xl font-black ${config.text} mb-2 number-pop`}>
          {loading ? '-' : `${displayValue}${suffix}`}
        </div>
        
        <p className="text-gray-400 font-bold">{label}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
  color,
  delay
}: {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
  color: 'blue' | 'cyan' | 'green';
  delay: number;
}) {
  const colorConfig: Record<'blue' | 'cyan' | 'green', string> = {
    blue: 'from-blue-500 to-cyan-500',
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-green-500 to-emerald-500'
  };

  return (
    <div 
      className="stagger-item bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 hover:border-[#0052FF]/40 rounded-3xl p-8 transition-all card-hover group relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Number Badge */}
      <div className="absolute top-6 right-6 w-12 h-12 bg-[#1A1F2E] rounded-full flex items-center justify-center">
        <span className="text-gray-500 font-black text-lg">{number}</span>
      </div>

      {/* Icon */}
      <div className={`w-16 h-16 bg-gradient-to-br ${colorConfig[color]} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed">{description}</p>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({
  icon: Icon,
  title,
  description,
  gradient
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="bg-[#0A0E14]/60 backdrop-blur-md border-2 border-[#0052FF]/20 rounded-2xl p-6 hover:border-[#0052FF]/40 transition-all card-hover group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}