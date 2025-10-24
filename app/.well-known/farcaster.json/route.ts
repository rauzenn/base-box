import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const manifest = {
    version: "v1",
    name: "Base Box",
    iconUrl: "https://basebox.vercel.app/icon.png",
    splashImageUrl: "https://basebox.vercel.app/splash-screen.png",
    splashBackgroundColor: "#000814",
    homeUrl: "https://basebox.vercel.app",
    capabilities: ["miniapp"],
    accountAssociation: {
      header: "eyJmaWQiOjU2OTc2MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE5MTAzZEE1MkI5Q0FENDQ3MWRGOTk0ZmZCYTMwQTM2QzRjRDc2ZjUifQ",
      payload: "eyJkb21haW4iOiJiYXNlYm94LnZlcmNlbC5hcHAifQ",
      signature: "QWGXt6v00JXHTd2HWohiobFbJk5XGH8iShyq0dvxo1kibJFKBeD71t8nhnDRF6UZsgyk6sr9ssmYQLfh6Gv4ihs="
    }
  };

  return NextResponse.json(manifest);
}
