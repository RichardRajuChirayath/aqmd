import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (verifyAdminPassword(password)) {
      await setAdminSession();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
