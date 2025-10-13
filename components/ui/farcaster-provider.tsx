'use client'

import { useEffect, useState } from 'react'
import sdk from '@farcaster/miniapp-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)

  useEffect(() => {
    const initSDK = async () => {
      try {
        const context = await sdk.context
        console.log('✅ Farcaster SDK initialized successfully')
        console.log('📱 User:', context.user)
        console.log('🆔 FID:', context.user?.fid)
        setIsSDKLoaded(true)
      } catch (error) {
        console.error('❌ SDK initialization error:', error)
        // Fallback mode for development
        setIsSDKLoaded(true)
      }
    }

    initSDK()
  }, [])

  return <>{children}</>
}