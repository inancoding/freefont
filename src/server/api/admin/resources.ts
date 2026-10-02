import { Router } from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { authenticateToken } from '../../auth/middleware.js';
import { allRows } from '../../db/connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

const IMAGE_EXTS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif']);
const SCAN_FOLDERS = ['covers', 'content', 'banners'];

interface ImageFile {
  path: string;
  url: string;
  folder: string;
  filename: string;
  size: number;
  modifiedAt: string;
}

function scanFolder(folder: string): ImageFile[] {
  const dir = join(IMAGES_DIR, folder);
  try {
    const entries = readdirSync(dir);
    return entries
      .filter((f) => IMAGE_EXTS.has(f.toLowerCase().slice(f.lastIndexOf('.'))))
      .map((filename) => {
        const fullPath = join(dir, filename);
        const stat = statSync(fullPath);
        return {
          path: `/images/${folder}/${filename}`,
          url: `/images/${folder}/${filename}`,
          folder,
          filename,
          size: stat.size,
          modifiedAt: stat.mtime.toISOString(),
        };
      });
  } catch {
    return [];
  }
}

async function getReferencedPaths(): Promise<Set<string>> {
  const referenced = new Set<string>();

  const fontRows = await allRows<{ cover_path: string | null; content: string | null }>(
    'SELECT cover_path, content FROM fonts',
  );
  for (const row of fontRows) {
    if (row.cover_path) referenced.add(row.cover_path);
    if (row.content) {
      const matches = row.content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+'[^']*')?\)/g);
      for (const m of matches) {
        const url = m[1];
        if (url && url.startsWith('/images/')) referenced.add(url);
      }
    }
  }

  const bannerRows = await allRows<{ image_path: string }>(
    'SELECT image_path FROM banners',
  );
  for (const row of bannerRows) {
    if (row.image_path) referenced.add(row.image_path);
  }

  return referenced;
}

export const resourceRouter = Router();
resourceRouter.use(authenticateToken);

resourceRouter.get('/', (_req, res) => {
  const images: ImageFile[] = [];
  for (const folder of SCAN_FOLDERS) {
    images.push(...scanFolder(folder));
  }
  images.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  res.json({ success: true, data: images });
});

resourceRouter.get('/unused', async (_req, res, next) => {
  try {
    const referenced = await getReferencedPaths();
    const allImages: ImageFile[] = [];
    for (const folder of SCAN_FOLDERS) {
      allImages.push(...scanFolder(folder));
    }
    const unused = allImages.filter((img) => !referenced.has(img.path));
    res.json({ success: true, data: unused });
  } catch (err) {
    next(err);
  }
});

resourceRouter.delete('/unused', async (_req, res, next) => {
  try {
    const referenced = await getReferencedPaths();
    const allImages: ImageFile[] = [];
    for (const folder of SCAN_FOLDERS) {
      allImages.push(...scanFolder(folder));
    }
    const unused = allImages.filter((img) => !referenced.has(img.path));
    let deleted = 0;
    for (const img of unused) {
      try {
        unlinkSync(join(IMAGES_DIR, img.folder, img.filename));
        deleted++;
      } catch {
        // skip files that can't be deleted
      }
    }
    res.json({ success: true, data: { deleted, total: unused.length } });
  } catch (err) {
    next(err);
  }
});

resourceRouter.delete('/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  if (!SCAN_FOLDERS.includes(folder)) {
    res.status(400).json({ success: false, error: 'Invalid folder' });
    return;
  }
  if (filename.includes('..') || filename.includes('/')) {
    res.status(400).json({ success: false, error: 'Invalid filename' });
    return;
  }
  const filepath = join(IMAGES_DIR, folder, filename);
  try {
    unlinkSync(filepath);
    res.json({ success: true, data: { deleted: true } });
  } catch {
    res.status(404).json({ success: false, error: 'File not found' });
  }
});
