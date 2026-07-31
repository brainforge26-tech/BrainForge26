export * from './routes';

// ─── API ──────────────────────────────────────────────────────────────────────
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';
export const API_BASE_URL = API_URL;

// ─── App meta ─────────────────────────────────────────────────────────────────
export const APP_NAME        = 'BrainForceIT';
export const APP_DESCRIPTION = 'Premium IT Agency — Software, Projects & Talent';
export const APP_URL         = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:     'ADMIN',
  MANAGER:   'MANAGER',
  DEVELOPER: 'DEVELOPER',
  CLIENT:    'CLIENT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Project statuses ─────────────────────────────────────────────────────────
export const PROJECT_STATUS = {
  PENDING:     'PENDING',
  ACTIVE:      'ACTIVE',
  ON_HOLD:     'ON_HOLD',
  COMPLETED:   'COMPLETED',
  CANCELLED:   'CANCELLED',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  PENDING:   'Pending',
  ACTIVE:    'Active',
  ON_HOLD:   'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE      = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ─── File upload ──────────────────────────────────────────────────────────────
export const MAX_FILE_SIZE_MB  = 10;
export const MAX_FILE_SIZE     = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGES   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_DOCS     = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// ─── Query keys ───────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  auth:         ['auth']         as const,
  me:           ['auth', 'me']   as const,
  users:        ['users']        as const,
  managers:     ['managers']     as const,
  developers:   ['developers']   as const,
  clients:      ['clients']      as const,
  projects:     ['projects']     as const,
  pricing:      ['pricing']      as const,
  notifications:['notifications'] as const,
  messages:     ['messages']     as const,
  hiring:       ['hiring']       as const,
} as const;
