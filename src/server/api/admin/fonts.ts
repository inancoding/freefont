import { Router } from 'express';
import { z } from 'zod/v4';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { authenticateToken } from '../../auth/middleware.js';
import { validate } from '../../middleware/validate.js';
import { createFont, updateFont, deleteFont, findFonts, findFontBySlug, batchCreateFonts } from '../../db/queries.js';
import type { CreateFontData } from '../../db/queries.js';

export const adminFontRouter = Router();
adminFontRouter.use(authenticateToken);

const uploadExcel = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const IMPORT_COLUMNS: { header: string; field: string; required: boolean }[] = [
  { header: 'Slug', field: 'slug', required: true },
  { header: '中文名', field: 'nameZh', required: false },
  { header: '英文名', field: 'nameEn', required: false },
  { header: '版本', field: 'version', required: true },
  { header: '厂商', field: 'vendor', required: true },
  { header: '许可', field: 'licenseId', required: true },
  { header: '分类', field: 'category', required: false },
  { header: '官方网站', field: 'officialUrl', required: false },
  { header: '简介', field: 'description', required: false },
  { header: '语言', field: 'languages', required: false },
  { header: '格式', field: 'formats', required: false },
  { header: '字重', field: 'weights', required: false },
  { header: '标签', field: 'tags', required: false },
  { header: '字数', field: 'glyphCount', required: false },
];

const SLUG_REGEX = /^[a-z][a-z0-9-]*[a-z0-9]$/;

function parseCsvField(val: unknown): string[] {
  if (!val) return [];
  const str = String(val).trim();
  if (!str) return [];
  return str.split(/[,，、;；\s]+/).filter(Boolean);
}

function parseExcelRow(row: Record<string, unknown>): { data: CreateFontData | null; errors: string[] } {
  const errors: string[] = [];
  const get = (header: string): string | undefined => {
    const v = row[header];
    if (v === undefined || v === null || String(v).trim() === '') return undefined;
    return String(v).trim();
  };

  const slug = get('Slug');
  const vendor = get('厂商');
  const version = get('版本');
  const licenseId = get('许可');

  if (!slug) errors.push('Slug 不能为空');
  else if (slug.length < 3 || slug.length > 64) errors.push('Slug 长度需 3-64 字符');
  else if (!SLUG_REGEX.test(slug)) errors.push('Slug 格式不正确（仅小写字母、数字、连字符）');

  if (!vendor) errors.push('厂商不能为空');
  if (!version) errors.push('版本不能为空');
  if (!licenseId) errors.push('许可不能为空');

  if (errors.length > 0) return { data: null, errors };

  const glyphCountStr = get('字数');
  const glyphCount = glyphCountStr ? parseInt(glyphCountStr, 10) : undefined;
  const languages = parseCsvField(row['语言']);
  const formats = parseCsvField(row['格式']);
  const weights = parseCsvField(row['字重']);
  const tags = parseCsvField(row['标签']);

  const data: CreateFontData = {
    slug: slug!,
    vendor: vendor!,
    version: version!,
    licenseId: licenseId!,
    status: 'draft',
  };

  const nameZh = get('中文名');
  if (nameZh) data.nameZh = nameZh;
  const nameEn = get('英文名');
  if (nameEn) data.nameEn = nameEn;
  const category = get('分类');
  if (category) data.category = category;
  const officialUrl = get('官方网站');
  if (officialUrl) data.officialUrl = officialUrl;
  const description = get('简介');
  if (description) data.description = description;
  if (languages.length > 0) data.languages = languages;
  if (formats.length > 0) data.formats = formats;
  if (weights.length > 0) data.weights = weights;
  if (tags.length > 0) data.tags = tags;
  if (glyphCount && !isNaN(glyphCount)) data.glyphCount = glyphCount;

  return { data, errors: [] };
}

adminFontRouter.get('/import/template', (_req, res) => {
  const wb = XLSX.utils.book_new();
  const headers = IMPORT_COLUMNS.map((c) => c.header);
  const ws = XLSX.utils.aoa_to_sheet([headers]);

  const colWidths = headers.map((h) => ({ wch: Math.max(h.length * 2, 12) }));
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, '字体导入');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename="font-import-template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(Buffer.from(buf));
});

adminFontRouter.post('/import', uploadExcel.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: '请上传 Excel 文件' });
      return;
    }

    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]!]!;
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

    if (rows.length === 0) {
      res.status(400).json({ success: false, error: 'Excel 文件为空' });
      return;
    }

    const dataList: CreateFontData[] = [];
    const rowErrors: { row: number; errors: string[] }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const { data, errors } = parseExcelRow(rows[i]!);
      if (data) {
        dataList.push(data);
      } else {
        rowErrors.push({ row: i + 2, errors });
      }
    }

    const result = await batchCreateFonts(dataList);

    res.json({
      success: true,
      data: {
        ...result,
        rowErrors,
        total: rows.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

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
  status: z.enum(['draft', 'published']).optional(),
  languages: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  weights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

adminFontRouter.post('/', validate(fontSchema), async (req, res, next) => {
  try {
    const data = req.body as CreateFontData;
    if (!data.status) data.status = 'published';
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
    const status = req.query.status as string;
    const params: import('../../db/queries.js').FontListParams = { page, pageSize };
    if (status === 'draft' || status === 'published') params.status = status;
    const result = await findFonts(params);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

adminFontRouter.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug as string;
    const font = await findFontBySlug(slug);
    if (!font) {
      res.status(404).json({ success: false, error: 'Font not found' });
      return;
    }
    res.json({ success: true, data: font });
  } catch (err) {
    next(err);
  }
});
