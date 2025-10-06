'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Flame, Trophy, Users, Zap, Calendar, Award } from 'lucide-react'

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
}

interface BadgeItem {
  name: string
  emoji: string
  id: number
}

export default function MainApp() {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [streak, setStreak] = useState<number>(0)
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false)
  const [badges, setBadges] = useState<BadgeItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
  const loadUserData = async () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('farcaster_user')
      let currentUser = null
      
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        currentUser = userData.user
      } else {
        currentUser = {
          fid: 12345,
          username: 'basedanon',
          displayName: 'Based Anon',
          pfpUrl: 'https://i.imgur.com/example.png'
        }
      }
      
      setUser(currentUser)

      // Database'den kullanıcı verilerini çek
      try {
        const response = await fetch(`/api/user?fid=${currentUser.fid}`)
        const data = await response.json()
        
        if (data && !data.error) {
          setStreak(data.streak || 0)
          setHasClaimedToday(data.hasClaimedToday || false)
          setBadges(data.badges || [])
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }
  }

  loadUserData()
}, [])

  const checkAndClaim = async () => {
    if (!user) {
      alert('Please connect your Farcaster account first!')
      return
    }

    setLoading(true)
    
    try {
      const eligibilityResponse = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: user.fid })
      })

      const eligibilityData = await eligibilityResponse.json()

      if (!eligibilityData.eligible) {
        alert(eligibilityData.reason || 'You need to post #gmBase today first!')
        setLoading(false)
        return
      }

      const claimResponse = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: user.fid })
      })

      const claimData = await claimResponse.json()

      if (claimData.success) {
        setStreak(claimData.newStreak)
        setHasClaimedToday(true)
        
        if (claimData.newBadge) {
          setBadges((prev: BadgeItem[]) => [...prev, claimData.newBadge])
          alert(`🎉 New Badge Unlocked: ${claimData.newBadge.name}`)
        } else {
          alert(`✅ Streak Claimed! Current streak: ${claimData.newStreak} days`)
        }
      } else {
        alert(claimData.error || 'Claim failed!')
      }
    } catch (error) {
      console.error('Claim error:', error)
      alert('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const getStreakEmoji = (streakCount: number): string => {
    if (streakCount >= 100) return '💎'
    if (streakCount >= 30) return '👑'
    if (streakCount >= 7) return '🔥'
    return '🌅'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-blue-500">
              <AvatarImage src={user?.pfpUrl} />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || 'BA'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">
                {user?.displayName || 'Based Anon'}
              </h2>
              <p className="text-sm text-gray-600">
                @{user?.username || 'demo'}
              </p>
            </div>
          </div>
          {user && (
            <Badge variant="secondary" className="text-xs">
              FID: {user.fid}
            </Badge>
          )}
        </div>

        <Card className="mb-6 border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Your Streak
            </CardTitle>
            <CardDescription>Keep the fire burning!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-7xl font-black text-blue-600 mb-2">
                {getStreakEmoji(streak)} {streak}
              </div>
              <p className="text-gray-600 font-medium">
                {streak === 0 ? 'Start your journey!' : `${streak} day${streak !== 1 ? 's' : ''} strong`}
              </p>
            </div>

            <Button 
              onClick={checkAndClaim}
              disabled={hasClaimedToday || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking...
                </span>
              ) : hasClaimedToday ? (
                '✅ Claimed Today!'
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Check & Claim
                </span>
              )}
            </Button>

            {hasClaimedToday && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Come back tomorrow for another streak!
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Your Badges ({badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Start your streak to earn badges!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge: BadgeItem, idx: number) => (
                  <div key={idx} className="text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      {badge.emoji}
                    </div>
                    <p className="text-xs mt-2 font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-xs text-gray-600">Days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{badges.length}</p>
              <p className="text-xs text-gray-600">Badges</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-600">Referrals</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}