import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Badge contract address (deploy edilecek)
const BADGE_CONTRACT_ADDRESS = process.env.BADGE_CONTRACT_ADDRESS as `0x${string}`;

// Badge IDs
const BADGE_IDS = {
  seed: 1,      // 7 days
  flame: 2,     // 14 days
  diamond: 3,   // 21 days
  crown: 4      // 30 days
};

// Badge milestones
const BADGE_MILESTONES = {
  1: 7,
  2: 14,
  3: 21,
  4: 30
};

// Contract ABI (mintBadge function)
const MINT_BADGE_ABI = [
  {
    inputs: [
      { name: "fid", type: "uint256" },
      { name: "to", type: "address" },
      { name: "badgeId", type: "uint256" },
      { name: "signature", type: "bytes" }
    ],
    name: "mintBadge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

/**
 * Generate backend signature for minting
 */
async function generateMintSignature(
  fid: number,
  toAddress: string,
  badgeId: number
): Promise<string> {
  // TODO: Implement proper signature generation with backend private key
  // For now, return mock signature
  
  const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY;
  if (!BACKEND_PRIVATE_KEY) {
    throw new Error("Backend private key not configured");
  }

  // Create message hash
  const messageHash = `${fid}${toAddress}${badgeId}`;
  
  // In production, use proper signing:
  // const account = privateKeyToAccount(BACKEND_PRIVATE_KEY as `0x${string}`);
  // const signature = await account.signMessage({ message: messageHash });
  
  return "0x" + "00".repeat(65); // Mock signature for now
}

/**
 * Check if user is eligible for badge
 */
async function checkEligibility(
  fid: number,
  badgeId: number
): Promise<{ eligible: boolean; reason?: string }> {
  try {
    // Fetch user streak data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/me?fid=${fid}`
    );
    const data = await response.json();

    const requiredDays = BADGE_MILESTONES[badgeId as keyof typeof BADGE_MILESTONES];
    
    if (data.currentStreak < requiredDays) {
      return {
        eligible: false,
        reason: `Need ${requiredDays} day streak. Current: ${data.currentStreak}`
      };
    }

    // Check if already minted
    // TODO: Query blockchain to see if user already has this badge
    
    return { eligible: true };
  } catch (error) {
    return { eligible: false, reason: "Error checking eligibility" };
  }
}

/**
 * POST: Request NFT badge mint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fid, walletAddress, badgeId } = body;

    // Validation
    if (!fid || !walletAddress || !badgeId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (badgeId < 1 || badgeId > 4) {
      return NextResponse.json(
        { success: false, message: "Invalid badge ID" },
        { status: 400 }
      );
    }

    // Check eligibility
    const eligibility = await checkEligibility(fid, badgeId);
    if (!eligibility.eligible) {
      return NextResponse.json({
        success: false,
        message: eligibility.reason || "Not eligible for this badge"
      });
    }

    // Generate signature
    const signature = await generateMintSignature(fid, walletAddress, badgeId);

    // In production: Call smart contract to mint
    // For now, return signature for frontend to use
    
    return NextResponse.json({
      success: true,
      message: "Badge ready to mint!",
      data: {
        contractAddress: BADGE_CONTRACT_ADDRESS,
        badgeId,
        signature,
        fid,
        to: walletAddress
      }
    });

  } catch (error) {
    console.error("Mint error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * GET: Check if badge is already minted
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get("fid");
  const badgeId = searchParams.get("badgeId");

  if (!fid || !badgeId) {
    return NextResponse.json(
      { error: "FID and badgeId required" },
      { status: 400 }
    );
  }

  // TODO: Query blockchain to check if minted
  // For now, return mock data
  
  return NextResponse.json({
    fid: parseInt(fid),
    badgeId: parseInt(badgeId),
    isMinted: false, // Mock - check blockchain in production
    eligibleToMint: true // Mock - check eligibility in production
  });
}