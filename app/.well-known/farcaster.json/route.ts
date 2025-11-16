import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const appUrl = 'https://basebox.vercel.app';
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE5MTAzZEE1MkI5Q0FENDQ3MWRGOTk0ZmZCYTMwQTM2QzRjRDc2ZjUifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "QWGXt6v00JXHTd2HWohiobFbJk5XGH8iShyq0dvxo1kibJFKBeD71t8nhnDRF6UZsgyk6sr9ssmYQLfh6Gv4ihs="
    },
    frame: {
      // ============================================
      // REQUIRED FIELDS
      // ============================================
      version: "1", // ✅ MUST BE "1" for Base Build
      name: "Base Box",
      iconUrl: `${appUrl}/icon.png`, // 512x512px
      homeUrl: appUrl,
      
      // ============================================
      // DISPLAY & BRANDING
      // ============================================
      imageUrl: `${appUrl}/og-image.png`, // 1200x630 (1.91:1)
      splashImageUrl: `${appUrl}/splash.png`, // 512x512px
      splashBackgroundColor: "#000814", // Dark blue Base Box theme
      
      // ============================================
      // DESCRIPTIONS (Character Limits)
      // ============================================
      subtitle: "Lock memories onchain", // Max 32 chars ✅
      description: description: "Lock messages and memories onchain with custom unlock dates. Build your time capsule collection and earn achievement NFTs on Base blockchain."
      tagline: "Time remembers. Base keeps.", // Max 32 chars ✅
      
      // ============================================
      // OPEN GRAPH METADATA
      // ============================================
      ogTitle: "Base Box - Time Capsules", // Max 32 chars ✅
      ogDescription: "Lock your memories onchain and unlock them in the future on Base blockchain", // Max 128 chars ✅
      ogImageUrl: `${appUrl}/og-image.png`, // 1200x630
      heroImageUrl: `${appUrl}/hero-image.png`, // 1200x630
      
      // ============================================
      // SCREENSHOTS (iPhone 13 Pro Max size)
      // ============================================
      screenshotUrls: [
        `${appUrl}/screenshots/create.png`, // 1284x2778
        `${appUrl}/screenshots/capsules.png`, // 1284x2778
        `${appUrl}/screenshots/reveal.png` // 1284x2778
      ],
      
      // ============================================
      // BUTTON CONFIGURATION
      // ============================================
      buttonTitle: "Launch Base Box", // Max 32 chars ✅
      button: {
        title: "Launch Base Box",
        action: {
          type: "launch_frame",
          name: "Base Box",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#000814"
        }
      },
      
      // ============================================
      // WEBHOOK (for notifications)
      // ============================================
      webhookUrl: `${appUrl}/api/webhook`,
      
      // ============================================
      // CATEGORY & TAGS
      // ============================================
      primaryCategory: "utility", // Options: social, game, utility, defi, nft
      
      // ✅ FIXED: Max 5 tags, lowercase, no special chars, max 20 chars each
      tags: [
        "timecapsule",  // 11 chars ✅ (removed hyphen)
        "blockchain",   // 10 chars ✅
        "base",         // 4 chars ✅
        "memories",     // 8 chars ✅
        "nft"           // 3 chars ✅
      ]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, must-revalidate' // Cache 1 hour
    }
  });
}
