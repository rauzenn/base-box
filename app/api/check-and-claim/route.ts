import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BADGE_MILESTONES = [7, 14, 21, 30]
const BASE_POINTS = 10

// In-memory storage for development (will be replaced with KV later)
const mockDB: Record<string, any> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fid, seasonId = 'season_1' } = body

    console.log('📥 Check & Claim request:', { fid, seasonId })

    // Validate
    if (!fid) {
      return NextResponse.json(
        { ok: false, error: 'Missing fid' },
        { status: 400 }
      )
    }

    const fidNum = parseInt(fid)
    const userKey = `${seasonId}:${fidNum}`

    // Get or create user participation
    let participation = mockDB[userKey]
    
    if (!participation) {
      participation = {
        seasonId,
        fid: fidNum,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastClaimedDay: null,
        badges: []
      }
      mockDB[userKey] = participation
      console.log('✨ New user created:', userKey)
    }

    // Simple day tracking (using current date)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    // Check if already claimed today
    if (participation.lastClaimedDay === today) {
      console.log('⚠️ Already claimed today')
      return NextResponse.json({
        ok: false,
        error: 'Already claimed today'
      })
    }

    // Calculate streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = participation.currentStreak

    if (participation.lastClaimedDay === null) {
      // First time claim
      newStreak = 1
      console.log('🎉 First claim ever!')
    } else if (participation.lastClaimedDay === yesterdayStr) {
      // Consecutive day
      newStreak = participation.currentStreak + 1
      console.log('🔥 Streak continues!', newStreak)
    } else {
      // Streak broken, restart
      newStreak = 1
      console.log('💔 Streak broken, restarting')
    }

    const newTotalXp = participation.totalXp + BASE_POINTS
    const newLongestStreak = Math.max(newStreak, participation.longestStreak)

    // Check for new badges
    const grantedBadges: number[] = []
    for (const milestone of BADGE_MILESTONES) {
      if (
        newStreak === milestone &&
        !participation.badges.includes(milestone)
      ) {
        participation.badges.push(milestone)
        grantedBadges.push(milestone)
        console.log('🏅 Badge earned:', milestone)
      }
    }

    // Update participation
    participation.currentStreak = newStreak
    participation.totalXp = newTotalXp
    participation.longestStreak = newLongestStreak
    participation.lastClaimedDay = today

    console.log('✅ Updated participation:', participation)

    return NextResponse.json({
      ok: true,
      points: BASE_POINTS,
      currentStreak: newStreak,
      totalXp: newTotalXp,
      grantedBadges,
      message: `Day ${newStreak} streak! Keep going! 🔥`
    })

  } catch (error) {
    console.error('❌ POST /api/check-and-claim error:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}