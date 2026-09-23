import { Router } from 'express';
import { findLicenses, findLicenseById } from '../db/queries.js';

export const licenseRouter = Router();

licenseRouter.get('/', async (_req, res, next) => {
  try {
    const licenses = await findLicenses();
    res.json({ success: true, data: licenses });
  } catch (err) {
    next(err);
  }
});

licenseRouter.get('/:id', async (req, res, next) => {
  try {
    const license = await findLicenseById(req.params.id!);
    if (!license) {
      res.status(404).json({ success: false, error: 'License not found' });
      return;
    }
    res.json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
});
