// Farcaster cast verification via Neynar API

import { getDayWindow } from './season';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || 'demo';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export interface CastVerificationResult {
  ok: boolean;
  castHash?: string;
  error?: string;
}

/**
 * Verify if user posted a qualifying cast today
 */
export async function verifyDailyCast(
  fid: number,
  seasonId: string,
  dayIdx: number
): Promise<CastVerificationResult> {
  try {
    // Get day window
    const { start, end } = getDayWindow(seasonId, dayIdx);

    // If in demo mode, return mock success
    if (NEYNAR_API_KEY === 'demo') {
      console.log('[DEMO MODE] Skipping real cast verification');
      return {
        ok: true,
        castHash: `0xdemo${fid}${dayIdx}`
      };
    }

    // Fetch user's recent casts
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/feed/user/casts?fid=${fid}&limit=25&includeReplies=false`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Neynar API error:', response.status, response.statusText);
      return {
        ok: false,
        error: 'Failed to fetch casts from Neynar'
      };
    }

    const data = await response.json();
    const casts = data.casts || [];

    // Find qualifying cast
    for (const cast of casts) {
      const castTime = new Date(cast.timestamp);
      const text = cast.text?.toLowerCase() || '';

      // Check if within window
      if (castTime < start || castTime >= end) {
        continue;
      }

      // Check for #gmBase tag
      if (text.includes('#gmbase')) {
        // Additional heuristics
        if (text.length < 3) {
          continue; // Too short
        }

        return {
          ok: true,
          castHash: cast.hash
        };
      }
    }

    return {
      ok: false,
      error: 'No qualifying cast with #gmBase found today'
    };
  } catch (error) {
    console.error('verifyDailyCast error:', error);
    return {
      ok: false,
      error: 'Verification failed'
    };
  }
}

/**
 * Get user profile from Neynar
 */
export async function getFarcasterUser(fid: number) {
  if (NEYNAR_API_KEY === 'demo') {
    return {
      fid,
      username: `user${fid}`,
      displayName: `User ${fid}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`
    };
  }

  try {
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user) {
      return null;
    }

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      avatarUrl: user.pfp_url
    };
  } catch (error) {
    console.error('getFarcasterUser error:', error);
    return null;
  }
}