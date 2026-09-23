import { Router } from 'express';
import multer from 'multer';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, unlinkSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { authenticateToken } from '../../auth/middleware.js';
import { uploadZipToGithub } from '../../github/client.js';
import { computeDownloadUrls } from '../../utils/download-urls.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const TMP_DIR = join(ROOT, 'tmp');

if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });
if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });

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
    const name = _req.body.name || file.originalname;
    cb(null, name);
  },
});

const uploadZip = multer({ storage: zipStorage, limits: { fileSize: 100 * 1024 * 1024 } });
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

    const downloadUrls = computeDownloadUrls(slug, version);
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
