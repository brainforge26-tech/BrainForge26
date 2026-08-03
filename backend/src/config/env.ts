import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

const rawPort = process.env.PORT;
const port = (rawPort === '5000' && process.env.NODE_ENV === 'production') ? 5001 : parseInt(rawPort || '5001', 10);

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: port,

  DATABASE_URL: getEnv('DATABASE_URL', 'postgresql://postgres:123456@localhost:5432/brainforge26?schema=public'),

  // JWT
  JWT_ACCESS_SECRET:      getEnv('JWT_ACCESS_SECRET', 'brainforge26_jwt_access_secret_key_2026_xyz'),
  JWT_ACCESS_EXPIRES_IN:  process.env.JWT_ACCESS_EXPIRES_IN  || '1d',
  JWT_REFRESH_SECRET:     getEnv('JWT_REFRESH_SECRET', 'brainforge26_jwt_refresh_secret_key_2026_xyz'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Cookie
  COOKIE_SECRET: getEnv('COOKIE_SECRET', 'brainforge26_cookie_secret_key_2026_xyz'),

  // Password reset
  RESET_PASS_TOKEN:         getEnv('RESET_PASS_TOKEN', 'brainforge26_reset_pass_token_2026_xyz'),
  RESET_PASS_TOKEN_EXPIRES: process.env.RESET_PASS_TOKEN_EXPIRES_IN || '5m',
  RESET_PASSWORD_LINK:      process.env.RESET_PASSWORD_LINK || 'https://brainforge26.tech/reset-password',

  // Email
  EMAIL_USER:  process.env.EMAIL_USER || '',
  EMAIL_PASS:  process.env.EMAIL_PASS || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'brainforge2@gmail.com',

  // Telegram Notifications
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID:   process.env.TELEGRAM_CHAT_ID   || '',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY    || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || 'https://brainforge26.tech',

  isDev():  boolean { return this.NODE_ENV === 'development'; },
  isProd(): boolean { return this.NODE_ENV === 'production';  },
};
