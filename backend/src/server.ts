import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
  const app = createApp();

  try {
    await connectDatabase();
  } catch (err) {
    console.error('Database connection warning during bootstrap:', err);
  }

  // Bind explicitly to 0.0.0.0 for IPv4 Nginx proxy_pass compatibility
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        BrainForceIT API Server           ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Environment : ${env.NODE_ENV.padEnd(26)}║`);
    console.log(`║  Port        : ${String(env.PORT).padEnd(26)}║`);
    console.log(`║  Host        : 0.0.0.0                  ║`);
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
