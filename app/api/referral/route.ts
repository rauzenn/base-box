import { NextRequest, NextResponse } from "next/server";

// In-memory storage (will be replaced with KV)
const referralCodes = new Map<string, number>(); // code -> referrer FID
const referrals = new Map<number, {
  code: string;
  referred: Array<{ fid: number; status: "pending" | "completed"; joinedAt: string }>;
  totalRewards: number;
}>();

const REFERRAL_BONUS_XP = 50;
const REQUIRED_STREAK_DAYS = 3;

function generateReferralCode(fid: number): string {
  // Generate unique code: BASED-{FID}-{random}
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BASED-${fid}-${random}`;
}

// GET - Get user's referral info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID required" },
      { status: 400 }
    );
  }

  const fidNum = parseInt(fid);
  let referralData = referrals.get(fidNum);

  // Generate code if doesn't exist
  if (!referralData) {
    const code = generateReferralCode(fidNum);
    referralData = {
      code,
      referred: [],
      totalRewards: 0
    };
    referrals.set(fidNum, referralData);
    referralCodes.set(code, fidNum);
  }

  return NextResponse.json({
    code: referralData.code,
    referralLink: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralData.code}`,
    totalReferrals: referralData.referred.length,
    completedReferrals: referralData.referred.filter(r => r.status === "completed").length,
    totalRewards: referralData.totalRewards,
    bonusPerReferral: REFERRAL_BONUS_XP
  });
}

// POST - Use referral code (when new user joins)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, newUserFid } = body;

    if (!code || !newUserFid) {
      return NextResponse.json(
        { success: false, message: "Code and FID required" },
        { status: 400 }
      );
    }

    // Check if code exists
    const referrerFid = referralCodes.get(code);
    if (!referrerFid) {
      return NextResponse.json({
        success: false,
        message: "Invalid referral code"
      });
    }

    // Check if user already used a referral
    // TODO: Add check to prevent multiple referral usage

    // Add to referrer's list
    const referralData = referrals.get(referrerFid);
    if (referralData) {
      referralData.referred.push({
        fid: newUserFid,
        status: "pending",
        joinedAt: new Date().toISOString()
      });
      referrals.set(referrerFid, referralData);
    }

    return NextResponse.json({
      success: true,
      message: `Referral code applied! Complete ${REQUIRED_STREAK_DAYS}-day streak to earn rewards.`,
      referrerFid
    });

  } catch (error) {
    console.error("Referral error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT - Mark referral as completed (called when referred user hits 3 days)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { referredFid, referrerFid } = body;

    const referralData = referrals.get(referrerFid);
    if (!referralData) {
      return NextResponse.json({
        success: false,
        message: "Referrer not found"
      });
    }

    // Find the referral
    const referral = referralData.referred.find(r => r.fid === referredFid);
    if (!referral || referral.status === "completed") {
      return NextResponse.json({
        success: false,
        message: "Referral not found or already completed"
      });
    }

    // Mark as completed
    referral.status = "completed";
    referralData.totalRewards += REFERRAL_BONUS_XP;
    referrals.set(referrerFid, referralData);

    // TODO: Also add XP to referrer's totalXP in main storage

    return NextResponse.json({
      success: true,
      message: `Referral completed! +${REFERRAL_BONUS_XP} XP earned`,
      totalRewards: referralData.totalRewards
    });

  } catch (error) {
    console.error("Referral completion error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}