import { cookies } from 'next/headers';

export type SessionUser = {
  userId:    string;
  email:     string;
  role:      'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'CLIENT';
};

export type Session =
  | { authenticated: true;  user: SessionUser; accessToken: string }
  | { authenticated: false; user: null; accessToken: null };

/**
 * Server-side session reader.
 * Decodes the JWT payload without verifying signature (verification happens
 * on the backend for every API call). Used only for UI rendering decisions.
 */
export async function getSession(): Promise<Session> {
  const cookieStore  = await cookies();
  const accessToken  = cookieStore.get('accessToken')?.value;
  const userRoleCook = cookieStore.get('userRole')?.value;

  if (!accessToken) return { authenticated: false, user: null, accessToken: null };

  try {
    // Decode JWT payload (base64) — no verification needed here
    const [, payloadB64] = accessToken.split('.');
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8'),
    ) as { userId: string; email: string; role: string; exp: number };

    // Check expiry
    if (Date.now() / 1000 > payload.exp) {
      return { authenticated: false, user: null, accessToken: null };
    }

    return {
      authenticated: true,
      accessToken,
      user: {
        userId: payload.userId,
        email:  payload.email,
        role:   (userRoleCook ?? payload.role) as SessionUser['role'],
      },
    };
  } catch {
    return { authenticated: false, user: null, accessToken: null };
  }
}

/** Throws a redirect if user is not authenticated */
export async function requireSession(): Promise<{ user: SessionUser; accessToken: string }> {
  const session = await getSession();
  if (!session.authenticated) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  // TypeScript can't infer that redirect() never returns, so assert here
  const s = session as Extract<Session, { authenticated: true }>;
  return { user: s.user, accessToken: s.accessToken };
}

/** Throws a redirect if user doesn't have the required role */
export async function requireRole(
  ...roles: SessionUser['role'][]
): Promise<{ user: SessionUser; accessToken: string }> {
  const result = await requireSession();
  if (!roles.includes(result.user.role)) {
    const { redirect } = await import('next/navigation');
    redirect('/');
  }
  return result;
}
