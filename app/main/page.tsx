'use client'

import { useEffect, useState } from 'react'
import sdk from '@farcaster/miniapp-sdk'
import { Button } from '@/components/ui/button'

export default function MainApp() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [badges, setBadges] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const [devMode, setDevMode] = useState(false)
  const [inputFid, setInputFid] = useState('')

  // Initialize SDK and get user
  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context
        console.log('✅ SDK Context:', context)
        
        if (context.user) {
          console.log('👤 User found:', context.user)
          setUser(context.user)
        } else {
          console.log('⚠️ No user in context - enabling dev mode')
          setDevMode(true)
        }
        
        setIsReady(true)
      } catch (error) {
        console.error('❌ SDK init error:', error)
        setDevMode(true)
        setIsReady(true)
      }
    }
    
    init()
  }, [])

  // Dev mode: manual FID entry
  const connectDevMode = () => {
    const fid = parseInt(inputFid)
    if (fid && fid > 0) {
      setUser({
        fid,
        displayName: `User ${fid}`,
        username: `user${fid}`,
        pfpUrl: undefined
      })
      setMessage('✅ Dev mode: FID set!')
    } else {
      setMessage('❌ Please enter a valid FID')
    }
  }

  const checkAndClaim = async () => {
    if (!user?.fid) {
      setMessage('Please connect first!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/check-and-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: user.fid, seasonId: 'season_1' })
      })

      const data = await response.json()

      if (data.ok) {
        setStreak(data.currentStreak)
        setTotalXp(data.totalXp)
        if (data.grantedBadges?.length > 0) {
          setBadges([...badges, ...data.grantedBadges])
        }
        setMessage(data.message || 'Claimed successfully! 🔥')
      } else {
        setMessage(data.error || 'Failed to claim')
      }
    } catch (error) {
      console.error('Claim error:', error)
      setMessage('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔥</div>
          <p className="text-xl text-gray-600">Loading Mini App...</p>
        </div>
      </div>
    )
  }

  // If no user and dev mode enabled
  if (!user && devMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-6xl mb-6 text-center">🔥</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Based Streaks</h1>
          <p className="text-sm text-amber-600 mb-6 text-center">
            ⚠️ Development Mode
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Farcaster ID:
            </label>
            <input
              type="number"
              value={inputFid}
              onChange={(e) => setInputFid(e.target.value)}
              placeholder="e.g., 569760"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Find your FID on <a href="https://warpcast.com/~/settings" target="_blank" className="text-blue-600 underline">Warpcast Settings</a>
            </p>
          </div>
          
          <Button
            onClick={connectDevMode}
            disabled={!inputFid}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
          >
            🚀 Start Tracking
          </Button>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> This is development mode. For production, the app needs proper Farcaster manifest signing.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main app UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.pfpUrl ? (
                <img
                  src={user.pfpUrl}
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.displayName?.[0] || '?'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-500">FID: {user.fid}</p>
              </div>
            </div>
            {devMode && (
              <div className="text-amber-600 text-xs font-medium">
                ⚠️ Dev Mode
              </div>
            )}
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔥</span>
            <h2 className="text-2xl font-bold text-gray-900">Your Streak</h2>
          </div>

          <p className="text-gray-600 mb-6">Keep the fire burning!</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-6xl">🌅</span>
            <span className="text-8xl font-bold text-blue-600">{streak}</span>
          </div>

          <p className="text-center text-gray-600 mb-6">
            {streak === 0 ? 'Start your journey!' : `${streak} day streak! Keep going!`}
          </p>

          <Button
            onClick={checkAndClaim}
            disabled={loading}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚡</span>
                Checking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>⚡</span>
                Check & Claim
              </span>
            )}
          </Button>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('successfully') || message.includes('streak') || message.includes('🔥')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p className="text-center font-medium">{message}</p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h2 className="text-2xl font-bold text-gray-900">Your Badges ({badges.length})</h2>
          </div>

          {badges.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Start your streak to earn badges!
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge} className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <span className="text-4xl">🏅</span>
                  <span className="text-sm font-bold text-gray-700">{badge} Days</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <span className="text-3xl mb-2 block">🔥</span>
            <p className="text-3xl font-bold text-gray-900">{streak}</p>
            <p className="text-sm text-gray-600 mt-1">Days</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <span className="text-3xl mb-2 block">🏅</span>
            <p className="text-3xl font-bold text-gray-900">{badges.length}</p>
            <p className="text-sm text-gray-600 mt-1">Badges</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <span className="text-3xl mb-2 block">⚡</span>
            <p className="text-3xl font-bold text-gray-900">{totalXp}</p>
            <p className="text-sm text-gray-600 mt-1">XP</p>
          </div>
        </div>

      </div>
    </div>
  )
}