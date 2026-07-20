import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from '../config/env';
import { errorHandler, notFoundHandler } from '../middlewares/errorHandler';
import authRouter      from '../modules/auth/auth.route';
import adminRouter     from '../modules/admin/admin.route';
import projectRouter   from '../modules/project/project.route';
import pricingRouter   from '../modules/pricing/pricing.route';
import { developerRouter, usersRouter } from '../modules/developer/developer.route';
import clientRouter    from '../modules/client/client.route';

export function createApp(): Application {
  const app = express();

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Body Parsing ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── Cookie Parser ───────────────────────────────────────────────────────────
  app.use(cookieParser(env.COOKIE_SECRET));

  // ─── Logger ──────────────────────────────────────────────────────────────────
  if (env.isDev()) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // ─── Health Check ────────────────────────────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'BrainForceIT API is running',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── API Routes ──────────────────────────────────────────────────────────────
  app.use('/api/v1/auth',       authRouter);
  app.use('/api/v1/admin',      adminRouter);
  app.use('/api/v1/projects',   projectRouter);
  app.use('/api/v1/pricing',    pricingRouter);
  app.use('/api/v1/developer',  developerRouter);
  app.use('/api/v1/users',      usersRouter);
  app.use('/api/v1/client',     clientRouter);

  // ─── 404 Handler ─────────────────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ─── Global Error Handler ────────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
