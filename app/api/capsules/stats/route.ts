import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json(
        { error: "FID required" },
        { status: 400 }
      );
    }

    // Get user's capsules from KV
    const capsuleIds = await kv.smembers(`user:${fid}:capsules`) || [];
    
    let lockedCount = 0;
    let revealedCount = 0;
    let nextRevealTime: number | null = null;

    for (const capsuleId of capsuleIds) {
      const capsule = await kv.hgetall(`capsule:${capsuleId}`);
      
      if (!capsule) continue;

      const unlockDate = parseInt(capsule.unlockDate as string);
      const now = Date.now();

      if (unlockDate > now) {
        lockedCount++;
        if (!nextRevealTime || unlockDate < nextRevealTime) {
          nextRevealTime = unlockDate;
        }
      } else {
        revealedCount++;
      }
    }

    // Format next reveal countdown
    let nextRevealFormatted: string | null = null;
    if (nextRevealTime) {
      const diff = nextRevealTime - Date.now();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      nextRevealFormatted = `${days}d ${hours}h ${minutes}m`;
    }

    return NextResponse.json({
      totalCapsules: capsuleIds.length,
      lockedCapsules: lockedCount,
      revealedCapsules: revealedCount,
      nextReveal: nextRevealFormatted,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}