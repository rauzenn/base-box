'use client'

import { useEffect, useState } from 'react'
import sdk from '@farcaster/miniapp-sdk'
import { Button } from '@/components/ui/button'

export default function MainApp() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [badges, setBadges] = useState<number[]>([])
  const [message, setMessage] = useState('')

  // Initialize Farcaster Mini App SDK
  useEffect(() => {
    const load = async () => {
      try {
        setContext(sdk.context)
        setIsSDKLoaded(true)
      } catch (error) {
        console.error('SDK init error:', error)
        // Fallback for development/testing
        setIsSDKLoaded(true)
      }
    }
    load()
  }, [])

  // Get user from SDK context or fallback
  const user = context?.user || {
    fid: 1234, // Fallback for testing
    displayName: 'Based Anon',
    username: 'basedanon',
    pfpUrl: undefined
  }

  const fid = user?.fid

  const checkAndClaim = async () => {
    if (!fid) {
      setMessage('Please open in Farcaster!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/check-and-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid, seasonId: 'season_1' })
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

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔥</div>
          <p className="text-xl text-gray-600">Loading Mini App...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
            <span className="text-3xl mb-2 block">📅</span>
            <p className="text-3xl font-bold text-gray-900">{streak}</p>
            <p className="text-sm text-gray-600 mt-1">Days</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <span className="text-3xl mb-2 block">🏅</span>
            <p className="text-3xl font-bold text-gray-900">{badges.length}</p>
            <p className="text-sm text-gray-600 mt-1">Badges</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <span className="text-3xl mb-2 block">👥</span>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">Referrals</p>
          </div>
        </div>
      </div>
    </div>
  )
}