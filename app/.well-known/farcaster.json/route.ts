import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const manifest = {
    version: "v1",
    name: "Base Box",
    iconUrl: "https://base-box.vercel.app/icon.png",
    splashImageUrl: "https://base-box.vercel.app/splash.png",
    splashBackgroundColor: "#000814",
    homeUrl: "https://base-box.vercel.app",
    capabilities: ["miniapp"],
    
    // Account association - TO BE FILLED after signing
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    }
  };

  return NextResponse.json(manifest);
}