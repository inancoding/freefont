import { Router } from 'express';
import { z } from 'zod/v4';
import { authenticateToken } from '../../auth/middleware.js';
import { validate } from '../../middleware/validate.js';
import { createFont, updateFont, deleteFont, findFonts } from '../../db/queries.js';
import type { CreateFontData } from '../../db/queries.js';

export const adminFontRouter = Router();
adminFontRouter.use(authenticateToken);

const fontSchema = z.object({
  slug: z.string().min(3).max(64).regex(/^[a-z][a-z0-9-]*[a-z0-9]$/),
  nameZh: z.string().optional(),
  nameEn: z.string().optional(),
  vendor: z.string().min(1),
  version: z.string().min(1),
  licenseId: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  officialUrl: z.string().url().optional().or(z.literal('')),
  coverPath: z.string().optional(),
  previewPath: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
  glyphCount: z.number().int().positive().optional(),
  sha256: z.string().optional(),
  downloadUrl: z.string().optional(),
  cloudDriveUrl: z.string().optional(),
  languages: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  weights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

adminFontRouter.post('/', validate(fontSchema), async (req, res, next) => {
  try {
    const data = req.body as CreateFontData;
    const font = await createFont(data);
    res.status(201).json({ success: true, data: font });
  } catch (err) {
    if (err instanceof Error && err.message.includes('UNIQUE constraint')) {
      res.status(409).json({ success: false, error: 'Font slug already exists' });
      return;
    }
    next(err);
  }
});

adminFontRouter.put('/:slug', validate(fontSchema.partial()), async (req, res, next) => {
  try {
    const data = req.body as Partial<CreateFontData>;
    const slug = req.params.slug as string;
    const font = await updateFont(slug, data);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    res.json({ success: true, data: font });
  } catch (err) {
    next(err);
  }
});

adminFontRouter.delete('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug as string;
    const deleted = await deleteFont(slug);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});

adminFontRouter.get('/', async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 50;
    const result = await findFonts({ page, pageSize });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});
