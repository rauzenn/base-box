import { NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import { isValidAdminRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';

interface Capsule {
  id: string;
  address: string;
  message: string;
  createdAt: string;
  unlockDate: string;
  revealed: boolean;
}

export async function POST(request: Request) {
  try {
    // Eskiden herhangi bir boş olmayan Authorization header'ı yeterliydi.
    // Artık token gerçekten admin login'den geçmiş mi diye KV'den doğrulanıyor.
    if (!(await isValidAdminRequest(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { capsuleId } = await request.json();

    if (!capsuleId) {
      return NextResponse.json(
        { success: false, message: 'Capsule ID required' },
        { status: 400 }
      );
    }

    const capsule = await kv.get<Capsule>(`capsule:${capsuleId}`);
    
    if (!capsule) {
      return NextResponse.json(
        { success: false, message: 'Capsule not found' },
        { status: 404 }
      );
    }

    await kv.del(`capsule:${capsuleId}`);
    // Capsule'lar artık cüzdan adresine göre indeksleniyor (eskiden fid'e göreydi).
    await kv.srem(`user:${capsule.address}:capsules`, capsuleId);

    console.log(`✅ Deleted: ${capsuleId}`);

    return NextResponse.json({
      success: true,
      message: 'Capsule deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete capsule' },
      { status: 500 }
    );
  }
}