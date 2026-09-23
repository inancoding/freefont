import { Router } from 'express';
import { z } from 'zod/v4';
import { authenticateToken } from '../../auth/middleware.js';
import { validate } from '../../middleware/validate.js';
import { createLicense, updateLicense, findLicenses } from '../../db/queries.js';
import type { CreateLicenseData } from '../../db/queries.js';

export const adminLicenseRouter = Router();
adminLicenseRouter.use(authenticateToken);

const licenseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  type: z.enum(['open-source', 'vendor', 'custom']),
  url: z.string().url().optional().or(z.literal('')),
  summary: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
});

adminLicenseRouter.post('/', validate(licenseSchema), async (req, res, next) => {
  try {
    const data = req.body as CreateLicenseData;
    const license = await createLicense(data);
    res.status(201).json({ success: true, data: license });
  } catch (err) {
    if (err instanceof Error && err.message.includes('UNIQUE constraint')) {
      res.status(409).json({ success: false, error: 'License ID already exists' });
      return;
    }
    next(err);
  }
});

adminLicenseRouter.put('/:id', validate(licenseSchema.partial()), async (req, res, next) => {
  try {
    const data = req.body as Partial<CreateLicenseData>;
    const id = req.params.id as string;
    const license = await updateLicense(id, data);
    if (!license) {
      res.status(404).json({ success: false, error: 'License not found' });
      return;
    }
    res.json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
});

adminLicenseRouter.get('/', async (_req, res, next) => {
  try {
    const licenses = await findLicenses();
    res.json({ success: true, data: licenses });
  } catch (err) {
    next(err);
  }
});
