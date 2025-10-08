import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      <div className="text-center text-white px-8">
        <div className="mb-8">
          <span className="text-9xl">🔥</span>
        </div>
        
        <h1 className="text-7xl font-bold mb-4 tracking-tight">
          Based Streaks
        </h1>
        
        <p className="text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Daily #gmBase streak tracker on Base
        </p>
        
        <div className="space-y-4">
          <p className="text-xl opacity-90">
            Track your daily #gmBase casts
          </p>
          <p className="text-xl opacity-90">
            Earn badges for consistency
          </p>
          <p className="text-xl opacity-90">
            Compete on the leaderboard
          </p>
        </div>

        <div className="mt-12 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md mx-auto">
          <p className="text-lg mb-4">
            ✨ Open this in <strong>Farcaster</strong> to start!
          </p>
          <p className="text-sm opacity-80">
            Or visit directly:
          </p>
          <Link 
            href="/main"
            className="inline-block mt-4 px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Launch App
          </Link>
        </div>

        <div className="mt-16 text-sm opacity-70">
          <p>Built on Base · Powered by Farcaster</p>
        </div>
      </div>
    </div>
  )
}