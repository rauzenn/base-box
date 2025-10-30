import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const manifest = {
    // Account association - mevcut
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE5MTAzZEE1MkI5Q0FENDQ3MWRGOTk0ZmZCYTMwQTM2QzRjRDc2ZjUifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "QWGXt6v00JXHTd2HWohiobFbJk5XGH8iShyq0dvxo1kibJFKBeD71t8nhnDRF6UZsgyk6sr9ssmYQLfh6Gv4ihs="
    },
    // ✅ "miniapp" olmalı - "frame" değil!
    miniapp: {
      version: "1", // ✅ STRING!
      name: "Base Box",
      icon: "lock",
      homeUrl: "https://basebox.vercel.app",
      imageUrl: "https://basebox.vercel.app/icon.png", // Manifest icon (512x512)
      buttonTitle: "Open Base Box",
      splashImageUrl: "https://basebox.vercel.app/splash.png", // 512x512
      splashBackgroundColor: "#000814",
      webhookUrl: ""
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, must-revalidate' // 5 dakika cache
    }
  });
}