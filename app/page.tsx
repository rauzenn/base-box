'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Zap } from 'lucide-react'

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    // Direkt ana sayfaya yönlendir
    const timer = setTimeout(() => {
      router.push('/main')
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12 text-orange-400 animate-pulse" />
            <h1 className="text-6xl font-black text-white tracking-tight">
              BASED
            </h1>
            <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-orange-400 rounded"></div>
            <h2 className="text-3xl font-bold text-blue-200 tracking-wider">
              STREAKS
            </h2>
            <div className="h-1 w-12 bg-orange-400 rounded"></div>
          </div>
        </div>
        <p className="text-blue-100 text-lg mt-6 font-medium">
          Build your streak. Earn badges. Stay Based.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-300 border-t-white rounded-full animate-spin"></div>
        <p className="text-blue-100 text-sm animate-pulse">
          Loading your Base journey...
        </p>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-blue-300 text-xs">Powered by Base × Farcaster</p>
        <p className="text-blue-400 text-xs mt-1">#gmBase every day anon</p>
      </div>
    </div>
  )
}