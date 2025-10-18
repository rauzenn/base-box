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

    // Get user's capsule IDs
    const capsuleIds = await kv.smembers(`user:${fid}:capsules`) || [];

    // Fetch all capsules
    const capsules = [];
    for (const capsuleId of capsuleIds) {
      const capsule = await kv.hgetall(`capsule:${capsuleId}`);
      if (capsule) {
        capsules.push({
          id: capsule.id,
          message: capsule.message,
          createdAt: parseInt(capsule.createdAt as string),
          unlockDate: parseInt(capsule.unlockDate as string),
          revealed: capsule.revealed === "true",
        });
      }
    }

    // Sort by creation date (newest first)
    capsules.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({
      capsules,
      total: capsules.length,
    });
  } catch (error) {
    console.error("List capsules error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}