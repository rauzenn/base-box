'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Initialize Farcaster SDK
        const context = await sdk.context;
        console.log('✅ Farcaster SDK loaded:', context);
        
        // ⭐ CRITICAL: Tell Farcaster the app is ready
        sdk.actions.ready();
        
        setIsSDKLoaded(true);
        console.log('🎉 Base Box is ready!');
      } catch (error) {
        console.error('❌ Failed to load Farcaster SDK:', error);
        // Even if SDK fails, still render the app (for development)
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  // Show loading state while SDK initializes
  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000814]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0052FF] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">Base Box</h2>