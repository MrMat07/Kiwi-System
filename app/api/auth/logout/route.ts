import { clearAuthCookie } from '../../../../lib/auth/jwt';
import { ok } from '../../../../lib/api';

export async function POST() {
  clearAuthCookie();
  return ok(true);
}
