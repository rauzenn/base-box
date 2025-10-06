import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API working',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })
}