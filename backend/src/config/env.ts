import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),

  DATABASE_URL: requireEnv('DATABASE_URL'),

  // JWT
  JWT_ACCESS_SECRET:      requireEnv('JWT_ACCESS_SECRET'),
  JWT_ACCESS_EXPIRES_IN:  process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
  JWT_REFRESH_SECRET:     requireEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Cookie
  COOKIE_SECRET: requireEnv('COOKIE_SECRET'),

  // Password reset
  RESET_PASS_TOKEN:         requireEnv('RESET_PASS_TOKEN'),
  RESET_PASS_TOKEN_EXPIRES: process.env.RESET_PASS_TOKEN_EXPIRES_IN || '5m',
  RESET_PASSWORD_LINK:      process.env.RESET_PASSWORD_LINK || 'http://localhost:3000/reset-password',

  // Email
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY    || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  isDev():  boolean { return this.NODE_ENV === 'development'; },
  isProd(): boolean { return this.NODE_ENV === 'production';  },
};
