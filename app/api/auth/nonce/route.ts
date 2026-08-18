import { NextResponse } from 'next/server';
import { generateSiweNonce } from 'viem/siwe';
import { kv } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SIWE (Sign-In with Ethereum) akışının ilk adımı: her capsule oluşturma
// isteğinden önce client buradan tek kullanımlık bir nonce alır, imzalanacak
// mesaja gömer. Sunucu, imzayı doğrularken bu nonce'un gerçekten burada
// üretildiğini ve daha önce kullanılmadığını kontrol eder — böylece
// çalınmış/kopyalanmış bir imza tekrar tekrar (replay) kullanılamaz.
export async function GET() {
  const nonce = generateSiweNonce();

  // 5 dakika geçerli — kullanıcı imzalamayı bu süre içinde tamamlamalı.
  await kv.set(`siwe:nonce:${nonce}`, true, { ex: 300 });

  return NextResponse.json({ nonce });
}
