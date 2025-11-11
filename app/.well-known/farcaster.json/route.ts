import { NextResponse } from 'next/server';

/**
 * Farcaster Mini App Manifest
 * Test version - minimal working config
 */
export async function GET() {
  console.log('🔵 Manifest endpoint called:', new Date().toISOString());
  
  const baseUrl = 'https://basebox.vercel.app';
  
  const manifest = {
    // Account association - VERIFIED
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGY3ZjU3OWQ3RTJlNEQ1MTZEN2FmMDc1ZDk0NzIyRTY1YmU3ZDM5MDYifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "WBiRz0TjMVgzBKGeQGcCq2vOQbf6QRrZpYnDg3TVYEt5yqEWGL9Ey14fXMLVnrZvbmYxiojPp1HO9gblx+qvHBw="
    },
    
    // REQUIRED: Version
    version: "next",
    
    // REQUIRED: Primary Category
    primaryCategory: "social",
    
    // REQUIRED: Tags (array of strings)
    tags: ["time-capsule", "memories", "base"],
    
    // Frame config
    frame: {
      version: "next",
      name: "Base Box",
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#000814",
      homeUrl: baseUrl,
    },
    
    // App info
    name: "Base Box",
    description: "Lock your memories onchain",
    imageUrl: `${baseUrl}/hero-image.png`,
    homeUrl: baseUrl,
  };

  // Log manifest to Vercel logs
  console.log('📦 Manifest:', JSON.stringify(manifest, null, 2));

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // NO CACHE - force fresh data
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
