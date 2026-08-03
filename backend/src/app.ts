import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { prisma } from './config/database';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

import authRouter        from './modules/auth/auth.route';
import adminRouter       from './modules/admin/admin.route';
import teamRouter        from './modules/team/team.route';
import serviceRouter     from './modules/service/service.route';
import portfolioRouter   from './modules/portfolio/portfolio.route';
import hiringRouter      from './modules/hiring/hiring.route';
import blogRouter        from './modules/blog/blog.route';
import testimonialRouter from './modules/testimonial/testimonial.route';
import faqRouter         from './modules/faq/faq.route';
import techRouter        from './modules/technology/technology.route';
import clientRouter      from './modules/client/client.route';
import contactRouter     from './modules/contact/contact.route';
import settingRouter     from './modules/setting/setting.route';
import mediaRouter       from './modules/media/media.route';

const app: Application = express();

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
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

// ─── Root & Health Check ───────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'BrainForge26 Corporate API Server Online',
  });
});

app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let dbError = null;
  try {
    const userCount = await prisma.user.count();
    dbStatus = `connected (${userCount} admin users)`;
  } catch (err: any) {
    dbError = err.message;
  }

  res.status(200).json({
    success: true,
    message: 'BrainForge26 API Operational',
    environment: env.NODE_ENV,
    database: dbStatus,
    ...(dbError && { dbError }),
    timestamp: new Date().toISOString(),
  });
});

// ─── Corporate CMS & Website API Routes ──────────────────────────────────────
app.use('/api/v1/auth',             authRouter);
app.use('/api/v1/admin',            adminRouter);
app.use('/api/v1/team',             teamRouter);
app.use('/api/v1/services',         serviceRouter);
app.use('/api/v1/portfolio',        portfolioRouter);
app.use('/api/v1/jobs',             hiringRouter);
app.use('/api/v1/blogs',            blogRouter);
app.use('/api/v1/testimonials',     testimonialRouter);
app.use('/api/v1/faqs',             faqRouter);
app.use('/api/v1/technologies',     techRouter);
app.use('/api/v1/clients',          clientRouter);
app.use('/api/v1/contact-messages', contactRouter);
app.use('/api/v1/site-settings',    settingRouter);
app.use('/api/v1/media',            mediaRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
