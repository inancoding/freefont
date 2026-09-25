import { Router } from 'express';
import { findActiveBanners } from '../db/queries.js';

export const bannerRouter = Router();

bannerRouter.get('/', async (_req, res, next) => {
  try {
    const banners = await findActiveBanners();
    res.json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
});
