#!/bin/bash

# Base Box - Farcaster SDK Integration Script
# This script updates all pages to use real FID from Farcaster

echo "🚀 Base Box - Farcaster SDK Integration"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root. Please run from base-box directory."
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing Farcaster SDK...${NC}"
npm install @farcaster/frame-sdk
echo -e "${GREEN}✅ SDK installed${NC}"
echo ""

echo -e "${BLUE}📁 Step 2: Creating new files...${NC}"

# Create Provider
mkdir -p app/providers
cat > app/providers/farcaster-provider.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        console.log('✅ Farcaster SDK loaded:', context);
        sdk.actions.setTheme('dark');
        sdk.actions.ready();
        setIsSDKLoaded(true);
        console.log('🎉 Base Box is ready!');
      } catch (error) {
        console.error('❌ Failed to load Farcaster SDK:', error);
        setIsSDKLoaded(true);
      }
    };
    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000814]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0052FF] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">Base Box</h2>
          <p className="text-white/60">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
EOF
echo -e "${GREEN}  ✅ app/providers/farcaster-provider.tsx${NC}"

# Create Hook
mkdir -p app/hooks
cat > app/hooks/use-farcaster.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';

export function useFarcaster() {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        console.log('📱 Farcaster context loaded:', ctx);
      } catch (error) {
        console.error('❌ Failed to load Farcaster context:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return {
    context,
    isLoading,
    fid: context?.user?.fid || null,
    username: context?.user?.username || null,
    displayName: context?.user?.displayName || null,
    pfpUrl: context?.user?.pfpUrl || null,
    sdk,
  };
}
EOF
echo -e "${GREEN}  ✅ app/hooks/use-farcaster.tsx${NC}"
echo ""

echo -e "${BLUE}🔧 Step 3: Updating layout.tsx...${NC}"
# Backup original
cp app/layout.tsx app/layout.tsx.backup
# Update layout
sed -i "s|import './globals.css';|import './globals.css';\nimport { FarcasterProvider } from './providers/farcaster-provider';|" app/layout.tsx
sed -i 's|<body className={inter.className}>|<body className={inter.className}>\n        <FarcasterProvider>|' app/layout.tsx
sed -i 's|{children}|{children}\n        </FarcasterProvider>|' app/layout.tsx
echo -e "${GREEN}  ✅ Layout updated (backup: app/layout.tsx.backup)${NC}"
echo ""

echo -e "${BLUE}🔧 Step 4: Updating all pages...${NC}"

# For each page, we need to:
# 1. Add useFarcaster import
# 2. Replace const fid = 3 with const { fid, isLoading } = useFarcaster()
# 3. Add loading/error states

PAGES=("create" "capsules" "reveals" "profile")

for page in "${PAGES[@]}"; do
    PAGE_FILE="app/$page/page.tsx"
    if [ -f "$PAGE_FILE" ]; then
        # Backup
        cp "$PAGE_FILE" "$PAGE_FILE.backup"
        
        # Add import (after 'use client' and other imports)
        sed -i "/^import.*from 'next\/navigation';/a import { useFarcaster } from '../hooks/use-farcaster';" "$PAGE_FILE"
        
        # Replace const fid = 3;
        sed -i "s/const fid = 3;/const { fid, isLoading } = useFarcaster();/" "$PAGE_FILE"
        
        echo -e "${GREEN}  ✅ app/$page/page.tsx updated${NC}"
    else
        echo -e "${YELLOW}  ⚠️  app/$page/page.tsx not found${NC}"
    fi
done

echo ""
echo -e "${YELLOW}⚠️  Note: You need to manually add loading/error states to each page${NC}"
echo ""

echo -e "${GREEN}✅ All files updated!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Review the changes in each file"
echo "  2. Add loading/error states to pages (see example below)"
echo "  3. Test locally: npm run dev"
echo "  4. Commit and deploy: git push origin main"
echo ""
echo -e "${YELLOW}Example loading/error state:${NC}"
cat << 'EXAMPLE'

  // Add this right after const { fid, isLoading } = useFarcaster();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!fid) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Farcaster Required</h2>
          <p className="text-gray-400">Please open this app in Farcaster</p>
        </div>
      </div>
    );
  }

EXAMPLE

echo ""
echo -e "${GREEN}🎉 Farcaster SDK integration complete!${NC}"
