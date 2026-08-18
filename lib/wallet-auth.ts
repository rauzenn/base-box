import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe';
import { kv } from '@/lib/redis';

// Capsule oluşturma isteklerinin gerçekten o cüzdan adresinin sahibi tarafından
// gönderildiğini EIP-4361 (Sign-In with Ethereum) standardına göre doğruluyoruz.
//
// SIWE bize şunları garanti eder:
//   1. İmza gerçekten bu adresin cüzdanı tarafından üretilmiş.
//   2. Mesaj bu uygulamanın domain'i için imzalanmış.
//   3. Nonce sunucu tarafından üretilmiş ve tek kullanımlık.
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function getExpectedDomain(): string {
  // Production'da VERCEL_URL, ziyaret edilen deployment'ın benzersiz URL'sidir
  // (ör. base-box-abc123.vercel.app). Kullanıcı ise stable production domain'i
  // (ör. basebox.vercel.app) üzerinden gelebilir. Bu ikisini karşılaştırmak
  // SIWE'de gereksiz bir domain mismatch üretir.
  //
  // Öncelik sırası:
  // 1. Açıkça tanımlanmış uygulama URL'si
  // 2. Vercel'in stable production domain'i
  // 3. Preview/deployment URL'si
  // 4. Local development
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_APP_URL).host;
    } catch {
      // aşağıdaki fallback'lere devam et
    }
  }

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) return process.env.VERCEL_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return 'localhost:3000';
}

export async function verifyWalletOwnership({
  siweMessage,
  siweSignature,
}: {
  siweMessage?: string;
  siweSignature?: string;
}): Promise<{ valid: boolean; address?: string; reason?: string }> {
  if (!siweMessage || !siweSignature) {
    return { valid: false, reason: 'Missing SIWE message or signature' };
  }

  let parsed;
  try {
    parsed = parseSiweMessage(siweMessage);
  } catch {
    return { valid: false, reason: 'Malformed SIWE message' };
  }

  const { address, nonce, domain, expirationTime } = parsed;

  if (!address || !nonce || !domain) {
    return { valid: false, reason: 'Incomplete SIWE message' };
  }

  // Domain kontrolü: mesaj gerçekten bizim sitemiz için mi imzalanmış?
  const expectedDomain = getExpectedDomain();
  if (domain !== expectedDomain) {
    console.error(`❌ [wallet-auth] Domain mismatch: got "${domain}", expected "${expectedDomain}"`);
    return { valid: false, reason: 'Domain mismatch' };
  }

  if (expirationTime && expirationTime.getTime() < Date.now()) {
    return { valid: false, reason: 'Signature expired, please try again' };
  }

  // Nonce tek kullanımlık: daha önce tüketilmiş veya hiç üretilmemiş nonce reddedilir.
  const deletedCount = await kv.del(`siwe:nonce:${nonce}`);
  if (deletedCount !== 1) {
    return { valid: false, reason: 'Nonce invalid, expired, or already used' };
  }

  try {
    const isValid = await verifySiweMessage(publicClient, {
      message: siweMessage,
      signature: siweSignature as `0x${string}`,
    });

    if (!isValid) {
      return { valid: false, reason: 'Invalid wallet signature' };
    }

    return { valid: true, address: address.toLowerCase() };
  } catch (err) {
    console.error('❌ [wallet-auth] Signature verification failed:', err);
    return { valid: false, reason: 'Signature verification failed' };
  }
}
