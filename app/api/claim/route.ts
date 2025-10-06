import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Kullanıcıyı database'den al veya oluştur
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('User fetch error:', userError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    // Kullanıcı yoksa oluştur
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            fid,
            current_streak: 0,
            max_streak: 0,
            total_claims: 0,
            referral_count: 0,
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error('User creation error:', createError)
        return NextResponse.json(
          { success: false, error: 'Failed to create user' },
          { status: 500 }
        )
      }

      user = newUser
    }

    // Bugün zaten claim edilmiş mi?
    if (user.last_claim_date === todayStr) {
      return NextResponse.json({
        success: false,
        error: 'Already claimed today!'
      })
    }

    // Streak hesapla
    let newStreak = 1
    if (user.last_claim_date) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (user.last_claim_date === yesterdayStr) {
        newStreak = user.current_streak + 1
      }
    }

    const maxStreak = Math.max(newStreak, user.max_streak)

    // Kullanıcıyı güncelle
    const { error: updateError } = await supabase
      .from('users')
      .update({
        current_streak: newStreak,
        max_streak: maxStreak,
        last_claim_date: todayStr,
        total_claims: user.total_claims + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('fid', fid)

    if (updateError) {
      console.error('User update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update streak' },
        { status: 500 }
      )
    }

    // Claim history'ye ekle
    await supabase.from('claims').insert([
      {
        user_id: user.id,
        fid,
        streak_count: newStreak,
      },
    ])

    // Yeni badge kazanıldı mı?
    let newBadge = null
    const earnedBadge = BADGE_TIERS.find((tier) => tier.streak === newStreak)

    if (earnedBadge) {
      // Badge'i user_badges tablosuna ekle
      const { error: badgeError } = await supabase
        .from('user_badges')
        .insert([
          {
            user_id: user.id,
            badge_id: earnedBadge.id,
          },
        ])

      if (!badgeError) {
        newBadge = earnedBadge
      }
    }

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