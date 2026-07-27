import { Router } from 'express';
import * as DC from './developer.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

// ── Developer self-service routes ─────────────────────────────────────────────
export const developerRouter = Router();

developerRouter.use(authenticate, authorize('DEVELOPER'));

developerRouter.get('/me',                       DC.getMyProfile);
developerRouter.patch('/me',                     DC.updateMyProfile);
developerRouter.get('/me/projects',              DC.getMyProjects);
developerRouter.patch('/me/resume',              DC.updateResume);
developerRouter.get('/me/portfolio',             DC.getPortfolioItems);
developerRouter.post('/me/portfolio',            DC.addPortfolioItem);
developerRouter.patch('/me/portfolio/:itemId',   DC.updatePortfolioItem);
developerRouter.delete('/me/portfolio/:itemId',  DC.deletePortfolioItem);

import * as CC from '../client/client.controller';

// ── Users/developers routes (manager + admin) ─────────────────────────────────
export const usersRouter = Router();

usersRouter.get('/developers',     authenticate, authorize('MANAGER','ADMIN'), DC.listDevelopers);
usersRouter.get('/developers/:id', authenticate, authorize('MANAGER','ADMIN'), DC.getDeveloperById);
usersRouter.get('/clients',        authenticate, authorize('MANAGER','ADMIN'), CC.listClients);
