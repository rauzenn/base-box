import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://basebox.vercel.app';
  
  const manifest = {
    // REQUIRED: Account Association
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGY3ZjU3OWQ3RTJlNEQ1MTZEN2FmMDc1ZDk0NzIyRTY1YmU3ZDM5MDYifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "WBiRz0TjMVgzBKGeQGcCq2vOQbf6QRrZpYnDg3TVYEt5yqEWGL9Ey14fXMLVnrZvbmYxiojPp1HO9gblx+qvHBw="
    },
    
    // REQUIRED: Frame Configuration
    frame: {
      version: "next",
      name: "Base Box",
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#000814",
      homeUrl: baseUrl,
    },
    
    // REQUIRED: Version (must be "next")
    version: "next",
    
    // REQUIRED: Primary Category (single string, not array)
    primaryCategory: "social",
    
    // REQUIRED: Tags (array of strings)
    tags: ["time-capsule", "memories", "base", "nft"],
    
    // App Metadata
    name: "Base Box",
    description: "Lock your memories onchain. Set unlock dates from 1 hour to 1 year. Collect achievements on Base.",
    
    // Images
    imageUrl: `${baseUrl}/hero-image.png`,
    iconUrl: `${baseUrl}/icon.png`,
    
    // URLs
    homeUrl: baseUrl,
    
    // Optional but recommended: Screenshots
    screenshots: [
      {
        url: `${baseUrl}/screenshots/create.png`,
        label: "Create a time capsule"
      },
      {
        url: `${baseUrl}/screenshots/capsules.png`,
        label: "View your capsules"
      },
      {
        url: `${baseUrl}/screenshots/reveal.png`,
        label: "Reveal your memories"
      }
    ],
  };

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Force no cache for testing
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

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