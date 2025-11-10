import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for Farcaster Mini App events
 * Handles app lifecycle events like install, uninstall, notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Webhook received:', {
      event: body.event,
      fid: body.data?.fid,
      timestamp: new Date().toISOString(),
    });
    
    // Handle different event types
    switch (body.event) {
      case 'frame.added':
        console.log('✅ App added by user:', body.data.fid);
        // You can store user data, send welcome notification, etc.
        break;
        
      case 'frame.removed':
        console.log('❌ App removed by user:', body.data.fid);
        // Clean up user data if needed
        break;
        
      case 'notifications.enabled':
        console.log('🔔 Notifications enabled:', body.data.fid);
        // Store notification token
        break;
        
      case 'notifications.disabled':
        console.log('🔕 Notifications disabled:', body.data.fid);
        // Remove notification token
        break;
        
      default:
        console.log('❓ Unknown event:', body.event);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully'
    }, { 
      status: 200 
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error'
    }, { 
      status: 500 
    });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}