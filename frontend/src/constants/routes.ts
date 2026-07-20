// ─── Public routes ────────────────────────────────────────────────────────────
export const ROUTES = {
  home:          '/',
  login:         '/login',
  register:      '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // ── Admin ────────────────────────────────────────────────────────────────
  admin: {
    root:      '/admin',
    managers:  '/admin/managers',
    projects:  '/admin/projects',
    analytics: '/admin/analytics',
    settings:  '/admin/settings',
  },

  // ── Manager ──────────────────────────────────────────────────────────────
  manager: {
    root:       '/manager',
    projects:   '/manager/projects',
    developers: '/manager/developers',
    clients:    '/manager/clients',
    hiring:     '/manager/hiring',
    pricing:    '/manager/pricing',
    homepage:   '/manager/homepage',
    messages:   '/manager/messages',
  },

  // ── Developer ────────────────────────────────────────────────────────────
  developer: {
    root:      '/developer',
    projects:  '/developer/projects',
    profile:   '/developer/profile',
    messages:  '/developer/messages',
    documents: '/developer/documents',
  },

  // ── Client ───────────────────────────────────────────────────────────────
  client: {
    root:      '/client',
    projects:  '/client/projects',
    invoices:  '/client/invoices',
    payments:  '/client/payments',
    messages:  '/client/messages',
    profile:   '/client/profile',
  },
} as const;
