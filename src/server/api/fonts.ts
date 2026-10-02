import { Router } from 'express';
import { findFonts, findFontBySlug, findRecommendFonts, incrementDownload } from '../db/queries.js';
import { computeDownloadUrls } from '../utils/download-urls.js';
import type { FontListParams } from '@shared/types/index.js';

export const fontRouter = Router();

fontRouter.get('/', async (req, res, next) => {
  try {
    const params: FontListParams = {};
    if (req.query.search) params.search = req.query.search as string;
    if (req.query.category) params.category = req.query.category as string;
    if (req.query.language) params.language = req.query.language as string;
    if (req.query.license) params.license = req.query.license as string;
    if (req.query.tag) params.tag = req.query.tag as string;
    params.sort = (req.query.sort as FontListParams['sort']) || 'added_at';
    params.order = (req.query.order as FontListParams['order']) || 'desc';
    params.page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    params.pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20;
    const result = await findFonts(params);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

fontRouter.get('/:slug', async (req, res, next) => {
  try {
    const font = await findFontBySlug(req.params.slug!);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    res.json({ success: true, data: font });
  } catch (err) {
    next(err);
  }
});

fontRouter.get('/:slug/download-urls', async (req, res, next) => {
  try {
    const font = await findFontBySlug(req.params.slug!);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    const urls = computeDownloadUrls(font.slug, font.version, font.fileSize, font.cloudDriveUrl);
    res.json({ success: true, data: urls });
  } catch (err) {
    next(err);
  }
});

fontRouter.get('/:slug/recommend', async (req, res, next) => {
  try {
    const font = await findFontBySlug(req.params.slug!);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    if (!font.category) {
      res.json({ success: true, data: [] });
      return;
    }
    const fonts = await findRecommendFonts(font.category, font.slug, 10);
    res.json({ success: true, data: fonts });
  } catch (err) {
    next(err);
  }
});

fontRouter.post('/:slug/download', async (req, res, next) => {
  try {
    const font = await findFontBySlug(req.params.slug!);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    await incrementDownload(font.slug);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
