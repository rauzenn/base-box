import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';

function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    
    if (!ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    if (password === ADMIN_PASSWORD) {
      const sessionToken = generateSessionToken();
      
      console.log('✅ Admin login successful');
      
      return NextResponse.json({
        success: true,
        token: sessionToken,
        message: 'Login successful'
      });
    } else {
      console.log('❌ Invalid password');
      
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ Admin auth error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}