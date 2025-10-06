import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUserStreak } from '/Users/han/Desktop/based-streaks/.next/build/lib/kv.ts'

interface BadgeTier {
  streak: number
  name: string
  emoji: string
  id: number
}

const BADGE_TIERS: BadgeTier[] = [
  { streak: 1, name: 'First GM', emoji: '🌅', id: 1 },
  { streak: 7, name: 'Stay Based', emoji: '🔥', id: 2 },
  { streak: 30, name: 'Based OG', emoji: '👑', id: 3 },
  { streak: 100, name: 'Eternal Baser', emoji: '💎', id: 4 },
]

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json()

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'Missing FID' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    // Kullanıcıyı KV'den al
    const user = await getUser(fid)

    // Bugün zaten claim edilmiş mi?
    if (user && user.lastClaimDate === todayStr) {
      return NextResponse.json({
        success: false,
        error: 'Already claimed today!'
      })
    }

    // Streak hesapla
    let newStreak = 1
    if (user && user.lastClaimDate) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Dün claim edilmişse streak devam ediyor
      if (user.lastClaimDate === yesterdayStr) {
        newStreak = user.currentStreak + 1
      }
    }

    // Yeni badge kazanıldı mı?
    let newBadge = null
    const earnedBadge = BADGE_TIERS.find((tier) => tier.streak === newStreak)
    const badgeId = earnedBadge ? earnedBadge.id : undefined

    if (earnedBadge) {
      newBadge = earnedBadge
    }

    // KV'ye kaydet
    await updateUserStreak(fid, newStreak, badgeId)

    return NextResponse.json({
      success: true,
      newStreak,
      newBadge,
      message: newBadge ? 'New badge unlocked!' : 'Streak claimed!',
    })
  } catch (error) {
    console.error('Claim error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}