import { verifyMessage } from 'viem';

// Capsule oluşturma isteklerinin gerçekten o cüzdan adresinin sahibi
// tarafından gönderildiğini kanıtlamak için kullanılıyor. Öncesinde
// endpoint, client'ın gönderdiği "fid" değerine hiçbir doğrulama
// yapmadan güveniyordu — bu yüzden herkes başkasının adına capsule
// oluşturabilir ya da başkasının capsule'larını okuyabilirdi.

const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000; // 5 dakika — eski bir imzanın tekrar tekrar kullanılmasını (replay) engeller

export function buildCapsuleAuthMessage(address: string, timestamp: number): string {
  return `Base Box: verify wallet\naddress: ${address.toLowerCase()}\ntimestamp: ${timestamp}`;
}

export async function verifyWalletOwnership({
  address,
  signature,
  timestamp,
}: {
  address?: string;
  signature?: string;
  timestamp?: number;
}): Promise<{ valid: boolean; reason?: string }> {
  if (!address || !signature || !timestamp) {
    return { valid: false, reason: 'Missing wallet signature data' };
  }

  const age = Date.now() - timestamp;
  if (age < 0 || age > MAX_SIGNATURE_AGE_MS) {
    return { valid: false, reason: 'Signature expired, please try again' };
  }

  const message = buildCapsuleAuthMessage(address, timestamp);

  try {
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });
    return isValid ? { valid: true } : { valid: false, reason: 'Invalid wallet signature' };
  } catch (err) {
    console.error('❌ [wallet-auth] Signature verification failed:', err);
    return { valid: false, reason: 'Signature verification failed' };
  }
}
