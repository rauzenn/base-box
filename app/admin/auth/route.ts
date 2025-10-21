import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'basebox2025';
    
    if (password === ADMIN_PASSWORD) {
      // Generate simple token (in production use JWT)
      const token = crypto.randomBytes(32).toString('hex');
      
      return NextResponse.json({ 
        success: true, 
        token 
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
}