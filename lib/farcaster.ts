import { sdk } from '@farcaster/miniapp-sdk'

export async function initializeFarcaster() {
  try {
    const context = await sdk.context
    
    // Localhost'ta context.user undefined olabilir
    if (context && context.user) {
      return {
        user: context.user,
        location: context.location,
      }
    }
    
    return null
  } catch (error) {
    console.error('Farcaster SDK initialization error:', error)
    return null
  }
}

export async function signalReady() {
  try {
    await sdk.actions.ready()
  } catch (error) {
    console.error('Failed to signal ready:', error)
  }
}