import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
  const app = createApp();

  // Connect to PostgreSQL via Prisma
  try {
    await connectDatabase();
  } catch (err) {
    console.error('Database connection warning during bootstrap:', err);
  }

  const server = app.listen(env.PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        BrainForceIT API Server           ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Environment : ${env.NODE_ENV.padEnd(26)}║`);
    console.log(`║  Port        : ${String(env.PORT).padEnd(26)}║`);
    console.log(`║  Health      : /api/health               ║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('✅ Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
});
