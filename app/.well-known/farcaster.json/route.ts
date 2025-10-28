import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const APP_URL = 'https://basebox.vercel.app';
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE5MTAzZEE1MkI5Q0FENDQ3MWRGOTk0ZmZCYTMwQTM2QzRjRDc2ZjUifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "QWGXt6v00JXHTd2HWohiobFbJk5XGH8iShyq0dvxo1kibJFKBeD71t8nhnDRF6UZsgyk6sr9ssmYQLfh6Gv4ihs="
    },
    miniapp: {
      name: "Base Box",
      iconUrl: `${APP_URL}/icon.png`,
      homeUrl: APP_URL,
      primaryCategory: "social",
      tags: ["blockchain", "time-capsule", "nft", "base", "memories"]
    },
    embed: {
      imageUrl: `${APP_URL}/og-image.png`,
      button: {
        title: "Launch Base Box",
        action: {
          type: "launch_frame",
          name: "Base Box",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#000814"
        }
      }
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
}