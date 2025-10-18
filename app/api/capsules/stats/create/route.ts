import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fid, message, durationDays } = body;

    if (!fid || !message || !durationDays) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique capsule ID
    const capsuleId = `${fid}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate unlock date
    const unlockDate = Date.now() + durationDays * 24 * 60 * 60 * 1000;

    // Store capsule in KV
    await kv.hset(`capsule:${capsuleId}`, {
      id: capsuleId,
      fid: fid.toString(),
      message,
      createdAt: Date.now().toString(),
      unlockDate: unlockDate.toString(),
      revealed: "false",
    });

    // Add capsule ID to user's set
    await kv.sadd(`user:${fid}:capsules`, capsuleId);

    // Add to global capsules (for community feed)
    await kv.zadd("capsules:global", {
      score: unlockDate,
      member: capsuleId,
    });

    return NextResponse.json({
      success: true,
      capsuleId,
      unlockDate,
      message: "Capsule locked successfully!",
    });
  } catch (error) {
    console.error("Create capsule error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}