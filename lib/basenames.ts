// lib/basenames.ts - Basenames Integration for Based Streaks

import { createPublicClient, http, namehash } from 'viem';
import { base } from 'viem/chains';

// L2 Resolver contract address on Base
const L2_RESOLVER_ADDRESS = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD';

// Create public client for Base
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org'),
});

/**
 * Get basename for an address
 * @param address - Ethereum address (0x...)
 * @returns basename (e.g., "rauzen.base.eth") or null
 */
export async function getBasename(address: string): Promise<string | null> {
  try {
    if (!address || !address.startsWith('0x')) return null;

    // Query the reverse resolver
    const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
    const node = namehash(reverseNode);

    const name = await publicClient.readContract({
      address: L2_RESOLVER_ADDRESS,
      abi: [
        {
          inputs: [{ name: 'node', type: 'bytes32' }],
          name: 'name',
          outputs: [{ name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'name',
      args: [node],
    });

    return name && name.endsWith('.base.eth') ? name : null;
  } catch (error) {
    console.error('Error fetching basename:', error);
    return null;
  }
}

/**
 * Format display name with basename or address
 * @param address - User's address
 * @param basename - Optional basename
 * @returns Formatted display name
 */
export function formatDisplayName(
  address: string | undefined,
  basename: string | null | undefined
): string {
  if (basename) {
    return basename;
  }
  
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  return 'Unknown User';
}

/**
 * Get Basename profile URL
 * @param basename - e.g., "rauzen.base.eth"
 * @returns URL to basename profile
 */
export function getBasenameProfileUrl(basename: string): string {
  return `https://www.base.org/names/${basename}`;
}

/**
 * Check if user has a basename
 * @param address - User's address
 * @returns boolean
 */
export async function hasBasename(address: string): Promise<boolean> {
  const basename = await getBasename(address);
  return basename !== null;
}

/**
 * Get basename with caching (use in React with useSWR or similar)
 */
export const basenameCache = new Map<string, string | null>();

export async function getCachedBasename(address: string): Promise<string | null> {
  if (basenameCache.has(address)) {
    return basenameCache.get(address) || null;
  }

  const basename = await getBasename(address);
  basenameCache.set(address, basename);
  return basename;
}