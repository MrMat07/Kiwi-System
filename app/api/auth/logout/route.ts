import { clearAuthCookie } from '../../../../lib/auth/jwt';
import { ok } from '../../../../lib/api';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, data: true });
  clearAuthCookie(response);
  return response;
}
