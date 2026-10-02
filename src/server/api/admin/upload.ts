import { Router } from 'express';
import multer from 'multer';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, unlinkSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import { authenticateToken } from '../../auth/middleware.js';
import { uploadZipToGithub } from '../../github/client.js';
import { computeDownloadUrls } from '../../utils/download-urls.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const TMP_DIR = join(ROOT, 'tmp');

if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });
if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });

function randomFilename(ext: string): string {
  return randomBytes(16).toString('hex') + ext;
}

const zipStorage = multer.diskStorage({
  destination: TMP_DIR,
  filename: (_req, file, cb) => cb(null, `zip-${Date.now()}${extname(file.originalname)}`),
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const subfolder = _req.body.subfolder;
    const dest = subfolder ? join(IMAGES_DIR, subfolder) : IMAGES_DIR;
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, randomFilename(ext));
  },
});

const uploadZip = multer({ storage: zipStorage, limits: { fileSize: 500 * 1024 * 1024 } });
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.webp', '.png', '.jpg', '.jpeg'];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only WebP, PNG, JPG images allowed'));
  },
});

export const uploadRouter = Router();
uploadRouter.use(authenticateToken);

uploadRouter.post('/zip', uploadZip.single('file'), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: 'No file uploaded' });
    return;
  }

  const { slug, version } = req.body;
  if (!slug || !version) {
    unlinkSync(file.path);
    res.status(400).json({ success: false, error: 'slug and version are required' });
    return;
  }

  try {
    const content = readFileSync(file.path);
    const sha256 = createHash('sha256').update(content).digest('hex');
    const fileSize = content.length;

    await uploadZipToGithub(file.path, slug, version);
    unlinkSync(file.path);

    const downloadUrls = computeDownloadUrls(slug, version, fileSize);
    res.json({
      success: true,
      data: {
        downloadUrls,
        sha256,
        fileSize,
      },
    });
  } catch (err) {
    if (existsSync(file.path)) unlinkSync(file.path);
    next(err);
  }
});

uploadRouter.post('/image', uploadImage.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: 'No file uploaded' });
    return;
  }

  const subfolder = req.body.subfolder || '';
  const relativePath = subfolder ? `/images/${subfolder}/${file.filename}` : `/images/${file.filename}`;

  res.json({
    success: true,
    data: {
      path: relativePath,
      url: relativePath,
    },
  });
});

uploadRouter.post('/fetch-image', async (req, res, next) => {
  const { url, subfolder } = req.body as { url?: string; subfolder?: string };
  if (!url) {
    res.status(400).json({ success: false, error: 'url is required' });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(502).json({ success: false, error: `Failed to fetch image: ${response.status}` });
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const extMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const mimeType = contentType.split(';')[0]?.trim() || '';
    const ext = extMap[mimeType] || extname(new URL(url).pathname) || '.png';

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = randomFilename(ext);

    const folder = subfolder || 'content';
    const dest = join(IMAGES_DIR, folder);
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
    const filepath = join(dest, filename);
    writeFileSync(filepath, buffer);

    const relativePath = `/images/${folder}/${filename}`;
    res.json({
      success: true,
      data: {
        path: relativePath,
        url: relativePath,
      },
    });
  } catch (err) {
    next(err);
  }
});
