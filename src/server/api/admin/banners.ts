import { Router } from 'express';
import { z } from 'zod/v4';
import { authenticateToken } from '../../auth/middleware.js';
import { validate } from '../../middleware/validate.js';
import { findBanners, createBanner, updateBanner, deleteBanner } from '../../db/queries.js';
import type { CreateBannerData } from '../../db/queries.js';

export const adminBannerRouter = Router();
adminBannerRouter.use(authenticateToken);

const bannerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().or(z.literal('')),
  imagePath: z.string().min(1),
  linkUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

adminBannerRouter.get('/', async (_req, res, next) => {
  try {
    const banners = await findBanners();
    res.json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
});

adminBannerRouter.post('/', validate(bannerSchema), async (req, res, next) => {
  try {
    const data = req.body as CreateBannerData;
    const banner = await createBanner(data);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
});

adminBannerRouter.put('/:id', validate(bannerSchema.partial()), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body as Partial<CreateBannerData>;
    const banner = await updateBanner(id, data);
    if (!banner) {
      res.status(404).json({ success: false, error: 'Banner not found' });
      return;
    }
    res.json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
});

adminBannerRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await deleteBanner(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Banner not found' });
      return;
    }
    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});
