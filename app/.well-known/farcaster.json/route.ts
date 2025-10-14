import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || ""
    },
    frame: {
      version: "1",
      name: "Based Streaks",
      subtitle: "Track your gmBase streaks",
      description: "Track your daily gmBase casts, earn badges for consistency, and compete on the leaderboard",
      iconUrl: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/splash.png`,
      splashBackgroundColor: "#4F46E5",
      homeUrl: process.env.NEXT_PUBLIC_APP_URL,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
      primaryCategory: "social",
      categories: ["social", "gaming", "productivity"],
      screenshotUrls: [
        `${process.env.NEXT_PUBLIC_APP_URL}/screenshot-1.png`,
        `${process.env.NEXT_PUBLIC_APP_URL}/screenshot-2.png`
      ]
    }
  };

  return NextResponse.json(manifest);
}