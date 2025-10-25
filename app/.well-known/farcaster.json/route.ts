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
      version: "next",
      imageUrl: "https://basebox.vercel.app/og-image.png",
      button: {
        title: "Launch Base Box",
        action: {
          type: "launch_frame",
          name: "Base Box",
          url: "https://basebox.vercel.app",
          splashImageUrl: "https://basebox.vercel.app/splash.png",
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