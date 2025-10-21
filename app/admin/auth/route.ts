import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Edge yerine nodejs
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'basebox2025';
    
    console.log('🔐 Login attempt');
    console.log('Received password:', password);
    console.log('Expected password:', ADMIN_PASSWORD);
    
    if (password === ADMIN_PASSWORD) {
      // Simple token generation
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      console.log('✅ Login successful');
      
      return NextResponse.json({ 
        success: true, 
        token 
      });
    } else {
      console.log('❌ Wrong password');
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error.message 
    }, { status: 500 });
  }
}