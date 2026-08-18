// @vercel/kv paketi ve Vercel KV ürünü tamamen kaldırıldı (Aralık 2024'te
// mevcut store'lar otomatik olarak Upstash Redis'e taşındı). Bu dosya onun
// yerini alıyor. API'si @vercel/kv ile neredeyse birebir aynı (zaten
// @vercel/kv da Upstash Redis'in ince bir sarmalayıcısıydı), o yüzden
// projenin geri kalanında `kv.set(...)`, `kv.get(...)` vb. çağrıları
// hiç değişmeden çalışmaya devam ediyor — sadece import kaynağı değişti:
//   import { kv } from '@vercel/kv'   →   import { kv } from '@/lib/redis'
//
// Redis.fromEnv() önce UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN'a
// bakar, onlar yoksa KV_REST_API_URL / KV_REST_API_TOKEN'a düşer (Vercel'in
// Upstash entegrasyonu projeye bu isimlerden birini otomatik ekler).
import { Redis } from '@upstash/redis';

export const kv = Redis.fromEnv();
