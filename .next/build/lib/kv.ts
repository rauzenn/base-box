import { kv } from '@vercel/kv'

export interface UserData {
  fid: number
  currentStreak: number
  maxStreak: number
  lastClaimDate: string | null
  totalClaims: number
  badges: number[]
  referralCount: number
}

export async function getUser(fid: number): Promise<UserData | null> {
  const user = await kv.get<UserData>(`user:${fid}`)
  return user
}

export async function setUser(fid: number, data: UserData): Promise<void> {
  await kv.set(`user:${fid}`, data)
}

export async function updateUserStreak(
  fid: number,
  newStreak: number,
  badge?: number
): Promise<UserData> {
  const user = await getUser(fid)
  const today = new Date().toISOString().split('T')[0]

  const updatedUser: UserData = {
    fid,
    currentStreak: newStreak,
    maxStreak: Math.max(newStreak, user?.maxStreak || 0),
    lastClaimDate: today,
    totalClaims: (user?.totalClaims || 0) + 1,
    badges: badge ? [...(user?.badges || []), badge] : (user?.badges || []),
    referralCount: user?.referralCount || 0,
  }

  await setUser(fid, updatedUser)
  return updatedUser
}