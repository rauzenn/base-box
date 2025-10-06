import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json()

    if (!fid) {
      return NextResponse.json(
        { eligible: false, reason: 'Missing FID' },
        { status: 400 }
      )
    }

    const neynarApiKey = process.env.NEYNAR_API_KEY

    if (!neynarApiKey || neynarApiKey === 'demo') {
      // Demo mode - her zaman eligible dön
      return NextResponse.json({
        eligible: true,
        message: 'Demo mode: Always eligible'
      })
    }

    // Bugünün başlangıç zamanı
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = Math.floor(today.getTime() / 1000)

    // Neynar API'den kullanıcının cast'lerini çek
    const neynarResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/fid/${fid}/casts?limit=50`,
      {
        headers: {
          'api_key': neynarApiKey,
        },
      }
    )

    if (!neynarResponse.ok) {
      console.error('Neynar API error:', await neynarResponse.text())
      return NextResponse.json(
        { eligible: false, reason: 'Failed to fetch casts' },
        { status: 500 }
      )
    }

    const data = await neynarResponse.json()
    const casts = data.casts || []

    // Bugün #gmBase içeren cast var mı?
    const hasGmBaseToday = casts.some((cast: any) => {
      const castTimestamp = new Date(cast.timestamp).getTime() / 1000
      const castText = cast.text?.toLowerCase() || ''
      
      return (
        castTimestamp >= todayTimestamp &&
        (castText.includes('#gmbase') || castText.includes('gmbase'))
      )
    })

    if (hasGmBaseToday) {
      return NextResponse.json({
        eligible: true,
        message: 'Great! You posted #gmBase today'
      })
    } else {
      return NextResponse.json({
        eligible: false,
        reason: 'No #gmBase cast found today. Post one first!'
      })
    }

  } catch (error) {
    console.error('Eligibility check error:', error)
    return NextResponse.json(
      { eligible: false, reason: 'Server error' },
      { status: 500 }
    )
  }
}