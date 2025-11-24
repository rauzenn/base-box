// Contract address (will be updated after deployment)
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '';

// Chain ID
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');

// Contract ABI - Only the functions we need
export const NFT_CONTRACT_ABI = [
  // Read functions
  {
    inputs: [{ internalType: 'uint256', name: 'capsuleId', type: 'uint256' }],
    name: 'isCapsuleMinted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'tokensOfOwner',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getCapsuleId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintingEnabled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [{ internalType: 'uint256', name: 'capsuleId', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'capsuleIds', type: 'uint256[]' }],
    name: 'mintBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'capsuleId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
    ],
    name: 'CapsuleMinted',
    type: 'event',
  },
] as const;

// Network configuration
export const BASE_MAINNET = {
  chainId: 8453,
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

// Helper functions
export function getBaseScanUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

export function getOpenSeaUrl(tokenId: string): string {
  return `https://opensea.io/assets/base/${NFT_CONTRACT_ADDRESS}/${tokenId}`;
}

export function getNFTMetadataUrl(capsuleId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://basebox.vercel.app';
  return `${baseUrl}/api/nft/${capsuleId}`;
}