import { PrismaClient } from '@prisma/client';
import { env } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const candidateUrls = Array.from(new Set([
  env.DATABASE_URL,
  'postgresql://postgres@localhost:5432/brainforge26?schema=public',
  'postgresql://postgres:123456@localhost:5432/brainforge26?schema=public',
  'postgresql://postgres:postgres@localhost:5432/brainforge26?schema=public',
  'postgresql://postgres:root@localhost:5432/brainforge26?schema=public',
  'postgresql://postgres:123456@localhost:5432/brainforceit?schema=public',
]));

export let prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

export async function connectDatabase(): Promise<void> {
  for (const url of candidateUrls) {
    if (!url) continue;
    try {
      process.env.DATABASE_URL = url;
      const client = new PrismaClient({
        log: ['error', 'warn'],
      });
      await client.$connect();
      await client.user.count();
      prisma = client;
      if (env.isDev()) globalForPrisma.prisma = prisma;
      console.log(`✅ PostgreSQL Database connected using URL: ${url.split('@')[1] || url}`);
      return;
    } catch {
      /* try next candidate */
    }
  }

  try {
    await prisma.$connect();
    console.log('✅ Connected using default Prisma Client');
  } catch (err: any) {
    console.error('❌ Database connection warning:', err?.message || err);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  } catch {
    /* ignore */
  }
}
