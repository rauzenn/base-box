import { NextResponse } from 'next/server'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://based-streaks.vercel.app'
  
  const manifest = {
    // Account association (will be added after signing)
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || ''
    },
    
    frame: {
      version: '1',
      name: 'Based Streaks',
      subtitle: 'Daily #gmBase streak tracker on Base',
      description: 'Track your daily #gmBase casts, earn badges for consistency, and compete on the leaderboard!',
      
      // Images
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#4F46E5',
      
      // URLs
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
      
      // Categories
      primaryCategory: 'social',
      categories: ['social', 'gaming', 'productivity'],
      
      // Screenshot URLs (for store listing)
      screenshotUrls: [
        `${appUrl}/screenshot-1.png`,
        `${appUrl}/screenshot-2.png`
      ]
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300' // 5 minutes
    }
  })
}