import { cookies } from 'next/headers';

export type SessionUser = {
  userId: string;
  email: string;
  role: 'ADMIN';
};

export type Session =
  | { authenticated: true; user: SessionUser; accessToken: string }
  | { authenticated: false; user: null; accessToken: null };

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { authenticated: false, user: null, accessToken: null };

  try {
    const [, payloadB64] = accessToken.split('.');
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8'),
    ) as { userId: string; email: string; role: string; exp: number };

    if (Date.now() / 1000 > payload.exp) {
      return { authenticated: false, user: null, accessToken: null };
    }

    return {
      authenticated: true,
      accessToken,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: 'ADMIN',
      },
    };
  } catch {
    return { authenticated: false, user: null, accessToken: null };
  }
}

export async function requireSession(): Promise<{ user: SessionUser; accessToken: string }> {
  const session = await getSession();
  if (!session.authenticated) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  const s = session as Extract<Session, { authenticated: true }>;
  return { user: s.user, accessToken: s.accessToken };
}

export async function requireRole(
  ...roles: string[]
): Promise<{ user: SessionUser; accessToken: string }> {
  const result = await requireSession();
  if (!roles.includes(result.user.role)) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return result;
}
