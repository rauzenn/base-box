'use client'

import { useEffect, useState } from 'react'
import sdk from '@farcaster/frame-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)

  useEffect(() => {
    const initSDK = async () => {
      try {
        await sdk.actions.ready()
        console.log('✅ Farcaster SDK initialized successfully')
        console.log('📱 Context:', sdk.context)
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