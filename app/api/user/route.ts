import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fid = searchParams.get('fid')

    if (!fid) {
      return NextResponse.json(
        { error: 'Missing FID' },
        { status: 400 }
      )
    }

    // Kullanıcı verilerini al
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('User fetch error:', userError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // Kullanıcı yoksa boş veri dön
    if (!user) {
      return NextResponse.json({
        fid,
        streak: 0,
        hasClaimedToday: false,
        badges: [],
        rank: null,
        totalClaims: 0
      })
    }

    // Bugün claim edilmiş mi?
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    const hasClaimedToday = user.last_claim_date === todayStr

    // Kullanıcının badge'lerini al
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        badges (
          id,
          name,
          emoji,
          description
        )
      `)
      .eq('user_id', user.id)

    const badges = userBadges?.map((ub: any) => ub.badges) || []

    // Leaderboard sıralamasını hesapla
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gt('current_streak', user.current_streak)

    const rank = count !== null ? count + 1 : null

    return NextResponse.json({
      fid: user.fid,
      streak: user.current_streak,
      maxStreak: user.max_streak,
      hasClaimedToday,
      badges,
      rank,
      totalClaims: user.total_claims,
      referralCount: user.referral_count
    })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}