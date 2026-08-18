import { kv } from '@/lib/redis';

// Admin oturum token'ları burada, gerçekten KV'de tutulur ve doğrulanır.
// Önceki kod sadece "token 10+ karakter mi" diye bakıyordu — bu, admin
// şifresinden hiç geçmeden herhangi bir string ile admin panelinin
// açılabilmesi anlamına geliyordu. Artık token'ın gerçekten
// /api/admin/auth tarafından üretilip üretilmediği kontrol ediliyor.

const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 saat

export async function createAdminSession(token: string): Promise<void> {
  await kv.set(`admin_session:${token}`, { createdAt: Date.now() }, { ex: ADMIN_SESSION_TTL_SECONDS });
}

export async function isValidAdminRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return false;

  const session = await kv.get(`admin_session:${token}`);
  return !!session;
}
