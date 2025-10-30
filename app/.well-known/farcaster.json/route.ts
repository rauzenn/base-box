import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE5MTAzZEE1MkI5Q0FENDQ3MWRGOTk0ZmZCYTMwQTM2QzRjRDc2ZjUifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "QWGXt6v00JXHTd2HWohiobFbJk5XGH8iShyq0dvxo1kibJFKBeD71t8nhnDRF6UZsgyk6sr9ssmYQLfh6Gv4ihs="
    },
    frame: {
      // Required fields
      version: "1",
      name: "Base Box",
      iconUrl: "https://basebox.vercel.app/icon.png",
      homeUrl: "https://basebox.vercel.app",
      
      // Embed fields  
      imageUrl: "https://basebox.vercel.app/embed-image.png",
      buttonTitle: "🔒 Launch Base Box",
      
      // Splash screen
      splashImageUrl: "https://basebox.vercel.app/splash.png",
      splashBackgroundColor: "#000814",
      
      // Optional metadata (Farcaster spec compliant)
      subtitle: "Lock memories onchain, unlock future",
      description: "Base Box is a blockchain time capsule app on Base. Create time-locked messages, set unlock dates, and collect achievement NFTs. Perfect for predictions, goals, and preserving memories.",
      screenshotUrls: [
        "https://basebox.vercel.app/screenshots/create.png",
        "https://basebox.vercel.app/screenshots/capsules.png",
        "https://basebox.vercel.app/screenshots/reveal.png"
      ],
      primaryCategory: "social",
      tags: ["time-capsule", "blockchain", "base", "memories", "nft"],
      heroImageUrl: "https://basebox.vercel.app/hero-image.png",
      tagline: "Time remembers. Base preserves.",
      ogTitle: "Base Box - Onchain Time Capsules",
      ogDescription: "Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.",
      ogImageUrl: "https://basebox.vercel.app/og-image.png"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
}