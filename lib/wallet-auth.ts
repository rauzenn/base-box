import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe';
import { kv } from '@/lib/redis';

// Capsule oluşturma isteklerinin gerçekten o cüzdan adresinin sahibi
// tarafından gönderildiğini EIP-4361 (Sign-In with Ethereum) standardına
// göre kanıtlıyoruz. Öncesinde endpoint client'ın gönderdiği "fid" (sonra
// "address") değerine doğrulama yapmadan güveniyordu — herkes başkasının
// adına capsule oluşturabilirdi.
//
// SIWE burada bize üç şeyi garanti eder:
//   1. İmza gerçekten bu adresin cüzdanı tarafından üretilmiş (kriptografik kanıt)
//   2. Mesaj gerçekten bu siteye (domain) ait — başka bir sitede imzalanmış
//      bir mesaj burada geçerli sayılmaz (phishing/replay koruması)
//   3. Nonce sunucu tarafından üretilmiş ve daha önce hiç kullanılmamış —
//      çalınan bir imza ikinci kez kullanılamaz (bkz. /api/auth/nonce)
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function getExpectedDomain(): string {
  // Vercel bu değişkeni otomatik sağlar (örn. "base-box.vercel.app").
  // Yerelde çalışırken NEXT_PUBLIC_APP_URL veya localhost'a düşer.
  if (process.env.VERCEL_URL) return process.env.VERCEL_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_APP_URL).host;
    } catch {
      // yoksay, aşağıdaki fallback'e düş
    }
  }
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

  if (!address || !nonce) {
    return { valid: false, reason: 'Incomplete SIWE message' };
  }

  // Domain kontrolü: mesaj gerçekten bizim sitemiz için mi imzalanmış?
  const expectedDomain = getExpectedDomain();
  if (domain && domain !== expectedDomain) {
    console.error(`❌ [wallet-auth] Domain mismatch: got "${domain}", expected "${expectedDomain}"`);
    return { valid: false, reason: 'Domain mismatch' };
  }

  if (expirationTime && expirationTime.getTime() < Date.now()) {
    return { valid: false, reason: 'Signature expired, please try again' };
  }

  // Nonce tek kullanımlık: DEL atomik olduğu için silinen anahtar sayısı 1
  // değilse ya nonce hiç üretilmemiş ya da daha önce (örn. bir önceki
  // istekte, ya da çift-tıklamada) zaten tüketilmiş demektir. Bu aynı
  // zamanda "aynı butona iki kez basınca duplicate capsule oluşmasın"
  // gereksinimini de doğal olarak karşılıyor — ikinci istek burada reddedilir.
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
