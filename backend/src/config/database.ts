import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from './env';

// Create pg connection pool
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

// Create Prisma adapter using pg pool
const adapter = new PrismaPg(pool);

// Singleton Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.isDev() ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.isDev()) {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log('✅ Database connected');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
  console.log('🔌 Database disconnected');
}
