import { runQuery, allRows, getRow, saveDb } from './connection.js';

export interface FontListParams {
  search?: string;
  category?: string;
  language?: string;
  license?: string;
  tag?: string;
  sort?: 'added_at' | 'download_count' | 'name';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface FontRow {
  id: number;
  slug: string;
  name_zh: string | null;
  name_en: string | null;
  vendor: string;
  version: string;
  license_id: string;
  description: string | null;
  content: string | null;
  category: string | null;
  official_url: string | null;
  cover_path: string | null;
  preview_path: string | null;
  file_size: number | null;
  glyph_count: number | null;
  sha256: string | null;
  download_url: string | null;
  cloud_drive_url: string | null;
  added_at: string;
  updated_at: string | null;
  download_count: number;
  languages: string;
  formats: string;
  weights: string;
  tags: string;
}

export interface LicenseRow {
  id: string;
  name: string;
  name_en: string | null;
  name_zh: string | null;
  type: string;
  url: string | null;
  summary: string | null;
  permissions: string;
  limitations: string;
}

function splitCsv(val: string | null): string[] {
  if (!val) return [];
  return val.split(',').filter(Boolean);
}

function toCamelFont(row: FontRow) {
  return {
    id: row.id,
    slug: row.slug,
    nameZh: row.name_zh,
    nameEn: row.name_en,
    vendor: row.vendor,
    version: row.version,
    licenseId: row.license_id,
    description: row.description,
    content: row.content,
    category: row.category,
    officialUrl: row.official_url,
    coverPath: row.cover_path,
    previewPath: row.preview_path,
    fileSize: row.file_size,
    glyphCount: row.glyph_count,
    sha256: row.sha256,
    downloadUrl: row.download_url,
    cloudDriveUrl: row.cloud_drive_url,
    addedAt: row.added_at,
    updatedAt: row.updated_at,
    downloadCount: row.download_count,
    languages: splitCsv(row.languages),
    formats: splitCsv(row.formats),
    weights: splitCsv(row.weights),
    tags: splitCsv(row.tags),
  };
}

function toCamelLicense(row: LicenseRow) {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    nameZh: row.name_zh,
    type: row.type,
    url: row.url,
    summary: row.summary,
    permissions: JSON.parse(row.permissions || '[]') as string[],
    limitations: JSON.parse(row.limitations || '[]') as string[],
  };
}

const FONT_LIST_SQL = `
  SELECT f.*,
    COALESCE(d.count, 0) as download_count,
    GROUP_CONCAT(DISTINCT fl.language) as languages,
    GROUP_CONCAT(DISTINCT ff.format) as formats,
    GROUP_CONCAT(DISTINCT fw.weight) as weights,
    GROUP_CONCAT(DISTINCT ft.tag) as tags
  FROM fonts f
  LEFT JOIN downloads d ON d.slug = f.slug
  LEFT JOIN font_languages fl ON fl.font_id = f.id
  LEFT JOIN font_formats ff ON ff.font_id = f.id
  LEFT JOIN font_weights fw ON fw.font_id = f.id
  LEFT JOIN font_tags ft ON ft.font_id = f.id
`;

export async function findFonts(params: FontListParams = {}) {
  const {
    search, category, language, license, tag,
    sort = 'added_at', order = 'desc',
    page = 1, pageSize = 20,
  } = params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    conditions.push(`(f.name_zh LIKE ? OR f.name_en LIKE ? OR f.vendor LIKE ? OR f.id IN (SELECT font_id FROM font_tags WHERE tag LIKE ?))`);
    const s = `%${search}%`;
    values.push(s, s, s, s);
  }
  if (category) {
    conditions.push('f.category = ?');
    values.push(category);
  }
  if (license) {
    conditions.push('f.license_id = ?');
    values.push(license);
  }

  let sql = FONT_LIST_SQL + ' WHERE 1=1';
  if (conditions.length > 0) sql += ' AND ' + conditions.join(' AND ');
  sql += ' GROUP BY f.id';

  if (language) {
    sql += ` HAVING languages LIKE ?`;
    values.push(`%${language}%`);
  }
  if (tag) {
    sql += (language ? ' AND' : ' HAVING') + ' tags LIKE ?';
    values.push(`%${tag}%`);
  }

  const sortColumn = sort === 'download_count' ? 'download_count'
    : sort === 'name' ? 'f.name_zh'
    : 'f.added_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

  const countSql = `SELECT COUNT(DISTINCT f.id) as total FROM fonts f
    LEFT JOIN font_languages fl ON fl.font_id = f.id
    LEFT JOIN font_tags ft ON ft.font_id = f.id
    WHERE 1=1 ${conditions.length ? 'AND ' + conditions.join(' AND ') : ''}`;
  const totalRow = await getRow<{ total: number }>(countSql, values);
  const total = totalRow?.total ?? 0;

  sql += ` LIMIT ? OFFSET ?`;
  values.push(pageSize, (page - 1) * pageSize);

  const rows = await allRows<FontRow>(sql, values);
  return {
    data: rows.map(toCamelFont),
    total,
    page,
    pageSize,
  };
}

export async function findFontBySlug(slug: string) {
  const sql = FONT_LIST_SQL + ` WHERE f.slug = ? GROUP BY f.id`;
  const row = await getRow<FontRow>(sql, [slug]);
  if (!row) return null;
  return toCamelFont(row);
}

export async function findRecommendFonts(category: string, excludeSlug: string, limit = 10) {
  const sql = FONT_LIST_SQL + ` WHERE f.category = ? AND f.slug != ? GROUP BY f.id ORDER BY f.added_at DESC LIMIT ?`;
  const rows = await allRows<FontRow>(sql, [category, excludeSlug, limit]);
  return rows.map(toCamelFont);
}

export async function findFontById(id: number) {
  const sql = FONT_LIST_SQL + ` WHERE f.id = ? GROUP BY f.id`;
  const row = await getRow<FontRow>(sql, [id]);
  if (!row) return null;
  return toCamelFont(row);
}

export interface CreateFontData {
  slug: string;
  nameZh?: string;
  nameEn?: string;
  vendor: string;
  version: string;
  licenseId: string;
  description?: string;
  content?: string;
  category?: string;
  officialUrl?: string;
  coverPath?: string;
  previewPath?: string;
  fileSize?: number;
  glyphCount?: number;
  sha256?: string;
  downloadUrl?: string;
  cloudDriveUrl?: string;
  languages?: string[];
  formats?: string[];
  weights?: string[];
  tags?: string[];
}

export async function createFont(data: CreateFontData) {
  await runQuery(`
    INSERT INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, content, category, official_url, cover_path, preview_path, file_size, glyph_count, sha256, download_url, cloud_drive_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.slug, data.nameZh ?? null, data.nameEn ?? null, data.vendor, data.version,
    data.licenseId, data.description ?? null, data.content ?? null, data.category ?? null,
    data.officialUrl ?? null, data.coverPath ?? null, data.previewPath ?? null,
    data.fileSize ?? null, data.glyphCount ?? null, data.sha256 ?? null,
    data.downloadUrl ?? null, data.cloudDriveUrl ?? null,
  ]);

  await runQuery('INSERT INTO downloads (slug, count) VALUES (?, 0)', [data.slug]);

  const font = await findFontBySlug(data.slug);
  if (!font) throw new Error('Font created but not found');

  await insertAssociations(font.id, data);
  await saveDb();
  return font;
}

export async function updateFont(slug: string, data: Partial<CreateFontData>) {
  const existing = await findFontBySlug(slug);
  if (!existing) throw new Error('Font not found');

  const fields: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Record<string, string> = {
    nameZh: 'name_zh', nameEn: 'name_en', vendor: 'vendor', version: 'version',
    licenseId: 'license_id', description: 'description', content: 'content',
    category: 'category', officialUrl: 'official_url', coverPath: 'cover_path',
    previewPath: 'preview_path', fileSize: 'file_size', glyphCount: 'glyph_count',
    sha256: 'sha256', downloadUrl: 'download_url', cloudDriveUrl: 'cloud_drive_url',
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (key in data) {
      fields.push(`${col} = ?`);
      values.push((data as Record<string, unknown>)[key] ?? null);
    }
  }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    values.push(slug);
    await runQuery(`UPDATE fonts SET ${fields.join(', ')} WHERE slug = ?`, values);
  }

  if (data.languages || data.formats || data.weights || data.tags) {
    const assocData: { languages?: string[]; formats?: string[]; weights?: string[]; tags?: string[] } = {};
    if (data.languages) assocData.languages = data.languages;
    if (data.formats) assocData.formats = data.formats;
    if (data.weights) assocData.weights = data.weights;
    if (data.tags) assocData.tags = data.tags;
    await insertAssociations(existing.id, assocData);
  }

  await saveDb();
  return findFontBySlug(slug);
}

async function insertAssociations(fontId: number, data: { languages?: string[]; formats?: string[]; weights?: string[]; tags?: string[] }) {
  if (data.languages) {
    await runQuery('DELETE FROM font_languages WHERE font_id = ?', [fontId]);
    for (const lang of data.languages) {
      await runQuery('INSERT INTO font_languages (font_id, language) VALUES (?, ?)', [fontId, lang]);
    }
  }
  if (data.formats) {
    await runQuery('DELETE FROM font_formats WHERE font_id = ?', [fontId]);
    for (const fmt of data.formats) {
      await runQuery('INSERT INTO font_formats (font_id, format) VALUES (?, ?)', [fontId, fmt]);
    }
  }
  if (data.weights) {
    await runQuery('DELETE FROM font_weights WHERE font_id = ?', [fontId]);
    for (const w of data.weights) {
      await runQuery('INSERT INTO font_weights (font_id, weight) VALUES (?, ?)', [fontId, w]);
    }
  }
  if (data.tags) {
    await runQuery('DELETE FROM font_tags WHERE font_id = ?', [fontId]);
    for (const t of data.tags) {
      await runQuery('INSERT INTO font_tags (font_id, tag) VALUES (?, ?)', [fontId, t]);
    }
  }
}

export async function deleteFont(slug: string) {
  const font = await findFontBySlug(slug);
  if (!font) return false;

  await runQuery('DELETE FROM font_tags WHERE font_id = ?', [font.id]);
  await runQuery('DELETE FROM font_weights WHERE font_id = ?', [font.id]);
  await runQuery('DELETE FROM font_formats WHERE font_id = ?', [font.id]);
  await runQuery('DELETE FROM font_languages WHERE font_id = ?', [font.id]);
  await runQuery('DELETE FROM downloads WHERE slug = ?', [slug]);
  await runQuery('DELETE FROM fonts WHERE slug = ?', [slug]);
  await saveDb();
  return true;
}

export async function findLicenses() {
  const rows = await allRows<LicenseRow>('SELECT * FROM licenses ORDER BY type, name');
  return rows.map(toCamelLicense);
}

export async function findLicensesPaginated(page = 1, pageSize = 20) {
  const totalRow = await getRow<{ total: number }>('SELECT COUNT(*) as total FROM licenses');
  const total = totalRow?.total ?? 0;
  const rows = await allRows<LicenseRow>(
    'SELECT * FROM licenses ORDER BY type, name LIMIT ? OFFSET ?',
    [pageSize, (page - 1) * pageSize],
  );
  return { data: rows.map(toCamelLicense), total, page, pageSize };
}

export async function findLicenseById(id: string) {
  const row = await getRow<LicenseRow>('SELECT * FROM licenses WHERE id = ?', [id]);
  if (!row) return null;
  return toCamelLicense(row);
}

export interface CreateLicenseData {
  id: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  type: 'open-source' | 'vendor' | 'custom';
  url?: string;
  summary?: string;
  permissions?: string[];
  limitations?: string[];
}

export async function createLicense(data: CreateLicenseData) {
  await runQuery(`
    INSERT INTO licenses (id, name, name_en, name_zh, type, url, summary, permissions, limitations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.id, data.name, data.nameEn ?? null, data.nameZh ?? null, data.type,
    data.url ?? null, data.summary ?? null,
    JSON.stringify(data.permissions ?? []),
    JSON.stringify(data.limitations ?? []),
  ]);
  await saveDb();
  return findLicenseById(data.id);
}

export async function updateLicense(id: string, data: Partial<CreateLicenseData>) {
  const existing = await findLicenseById(id);
  if (!existing) throw new Error('License not found');

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.nameEn !== undefined) { fields.push('name_en = ?'); values.push(data.nameEn); }
  if (data.nameZh !== undefined) { fields.push('name_zh = ?'); values.push(data.nameZh); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type); }
  if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }
  if (data.summary !== undefined) { fields.push('summary = ?'); values.push(data.summary); }
  if (data.permissions !== undefined) { fields.push('permissions = ?'); values.push(JSON.stringify(data.permissions)); }
  if (data.limitations !== undefined) { fields.push('limitations = ?'); values.push(JSON.stringify(data.limitations)); }

  if (fields.length > 0) {
    values.push(id);
    await runQuery(`UPDATE licenses SET ${fields.join(', ')} WHERE id = ?`, values);
    await saveDb();
  }
  return findLicenseById(id);
}

export async function incrementDownload(slug: string) {
  await runQuery(`
    INSERT INTO downloads (slug, count, updated_at) VALUES (?, 1, datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET count = count + 1, updated_at = datetime('now')
  `, [slug]);
  await saveDb();
}

export async function getDownloadCount(slug: string): Promise<number> {
  const row = await getRow<{ count: number }>('SELECT count FROM downloads WHERE slug = ?', [slug]);
  return row?.count ?? 0;
}

export interface BannerRow {
  id: number;
  title: string;
  description: string | null;
  image_path: string;
  link_url: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string | null;
}

function toCamelBanner(row: BannerRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imagePath: row.image_path,
    linkUrl: row.link_url,
    sortOrder: row.sort_order,
    isActive: !!row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findBanners() {
  const rows = await allRows<BannerRow>('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
  return rows.map(toCamelBanner);
}

export async function findBannersPaginated(page = 1, pageSize = 20) {
  const totalRow = await getRow<{ total: number }>('SELECT COUNT(*) as total FROM banners');
  const total = totalRow?.total ?? 0;
  const rows = await allRows<BannerRow>(
    'SELECT * FROM banners ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?',
    [pageSize, (page - 1) * pageSize],
  );
  return { data: rows.map(toCamelBanner), total, page, pageSize };
}

export async function findActiveBanners() {
  const rows = await allRows<BannerRow>('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  return rows.map(toCamelBanner);
}

export async function findBannerById(id: number) {
  const row = await getRow<BannerRow>('SELECT * FROM banners WHERE id = ?', [id]);
  if (!row) return null;
  return toCamelBanner(row);
}

export interface CreateBannerData {
  title: string;
  description?: string;
  imagePath: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createBanner(data: CreateBannerData) {
  await runQuery(`
    INSERT INTO banners (title, description, image_path, link_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.title,
    data.description ?? null,
    data.imagePath,
    data.linkUrl ?? null,
    data.sortOrder ?? 0,
    data.isActive !== false ? 1 : 0,
  ]);
  await saveDb();
  const row = await getRow<BannerRow>('SELECT * FROM banners WHERE id = last_insert_rowid()');
  return row ? toCamelBanner(row) : null;
}

export async function updateBanner(id: number, data: Partial<CreateBannerData>) {
  const existing = await findBannerById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description ?? null); }
  if (data.imagePath !== undefined) { fields.push('image_path = ?'); values.push(data.imagePath); }
  if (data.linkUrl !== undefined) { fields.push('link_url = ?'); values.push(data.linkUrl ?? null); }
  if (data.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(data.sortOrder); }
  if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive ? 1 : 0); }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    values.push(id);
    await runQuery(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
    await saveDb();
  }
  return findBannerById(id);
}

export async function deleteBanner(id: number) {
  const existing = await findBannerById(id);
  if (!existing) return false;
  await runQuery('DELETE FROM banners WHERE id = ?', [id]);
  await saveDb();
  return true;
}
