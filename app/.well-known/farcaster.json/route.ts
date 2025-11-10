import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://basebox.vercel.app';
  
  const manifest = {
    // Account association (VERIFIED)
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGY3ZjU3OWQ3RTJlNEQ1MTZEN2FmMDc1ZDk0NzIyRTY1YmU3ZDM5MDYifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "WBiRz0TjMVgzBKGeQGcCq2vOQbf6QRrZpYnDg3TVYEt5yqEWGL9Ey14fXMLVnrZvbmYxiojPp1HO9gblx+qvHBw="
    },
    
    // Frame configuration
    frame: {
      version: "next",
      name: "Base Box",
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#000814",
      homeUrl: baseUrl,
      webhookUrl: `${baseUrl}/api/webhook`,
    },
    
    // REQUIRED: Version (must be "next")
    version: "next",
    
    // REQUIRED: Primary Category
    primaryCategory: "social",
    
    // REQUIRED: Tags
    tags: ["time-capsule", "memories", "base", "nft"],
    
    // App metadata
    name: "Base Box",
    shortName: "Base Box",
    description: "Lock your memories onchain. Set unlock dates from 1 hour to 1 year. Collect achievements and mint NFTs on Base.",
    
    // Images
    imageUrl: `${baseUrl}/hero-image.png`,
    iconUrl: `${baseUrl}/icon.png`,
    
    // Social
    domain: "basebox.vercel.app",
    homeUrl: baseUrl,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}