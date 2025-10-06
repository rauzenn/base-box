import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/kv'

const BADGE_MAP: { [key: number]: { name: string; emoji: string; description: string } } = {
  1: { name: 'First GM', emoji: '🌅', description: 'Posted your first #gmBase' },
  2: { name: 'Stay Based', emoji: '🔥', description: 'Maintained a 7-day streak' },
  3: { name: 'Based OG', emoji: '👑', description: 'Achieved a 30-day streak' },
  4: { name: 'Eternal Baser', emoji: '💎', description: 'Legendary 100-day streak' },
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fidParam = searchParams.get('fid')

    if (!fidParam) {
      return NextResponse.json(
        { error: 'Missing FID' },
        { status: 400 }
      )
    }

    const fid = parseInt(fidParam)
    const user = await getUser(fid)

    if (!user) {
      return NextResponse.json({
        fid,
        streak: 0,
        maxStreak: 0,
        hasClaimedToday: false,
        badges: [],
        rank: null,
        totalClaims: 0,
        referralCount: 0
      })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    const hasClaimedToday = user.lastClaimDate === todayStr

    const badges = user.badges.map(badgeId => BADGE_MAP[badgeId]).filter(Boolean)

    return NextResponse.json({
      fid: user.fid,
      streak: user.currentStreak,
      maxStreak: user.maxStreak,
      hasClaimedToday,
      badges,
      rank: null,
      totalClaims: user.totalClaims,
      referralCount: user.referralCount
    })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}