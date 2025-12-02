import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_NAME = 'kiwi_token';

export type AuthPayload = {
  userId: number;
  email: string;
  role: 'admin' | 'operador';
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthPayloadFromRequest(request: NextRequest): AuthPayload | null {
  const bearer = request.headers.get('authorization');
  const tokenFromHeader = bearer?.startsWith('Bearer ')
    ? bearer.split(' ')[1]
    : undefined;
  const token = tokenFromHeader || request.cookies.get(TOKEN_NAME)?.value;
  return verifyToken(token || undefined);
}

export function getAuthPayloadFromCookies(): AuthPayload | null {
  const token = cookies().get(TOKEN_NAME)?.value;
  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });
}

export function clearAuthCookie() {
  cookies().set({
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax'
  });
}
