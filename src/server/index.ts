import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { loginHandler } from './auth/middleware.js';
import { fontRouter } from './api/fonts.js';
import { licenseRouter } from './api/licenses.js';
import { adminFontRouter } from './api/admin/fonts.js';
import { adminLicenseRouter } from './api/admin/licenses.js';
import { uploadRouter } from './api/admin/upload.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PORT = parseInt(process.env.PORT || '3001', 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use('/images', express.static(join(ROOT, 'public', 'images')));

app.post('/api/auth/login', loginHandler);
app.use('/api/fonts', fontRouter);
app.use('/api/licenses', licenseRouter);
app.use('/api/admin/fonts', adminFontRouter);
app.use('/api/admin/licenses', adminLicenseRouter);
app.use('/api/admin/upload', uploadRouter);

const distPath = join(ROOT, 'dist');
if (existsSync(distPath)) {
  app.use('/admin/assets', express.static(join(distPath, 'admin', 'assets')));
  app.use('/assets', express.static(join(distPath, 'assets')));

  app.use('/admin', express.static(join(distPath, 'admin')));
  app.use(express.static(distPath));

  app.get('/admin/{*splat}', (_req, res) => {
    res.sendFile(join(distPath, 'admin', 'index.html'));
  });

  app.get('/{*splat}', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
