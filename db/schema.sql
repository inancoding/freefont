-- 字体表
CREATE TABLE IF NOT EXISTS fonts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_zh TEXT,
  name_en TEXT,
  vendor TEXT NOT NULL,
  version TEXT NOT NULL,
  license_id TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  official_url TEXT,
  cover_path TEXT,
  preview_path TEXT,
  file_size INTEGER,
  glyph_count INTEGER,
  sha256 TEXT,
  download_url TEXT,
  cloud_drive_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  added_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  FOREIGN KEY (license_id) REFERENCES licenses(id)
);

-- 授权协议表
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_zh TEXT,
  type TEXT NOT NULL DEFAULT 'custom',
  url TEXT,
  summary TEXT,
  permissions TEXT,
  limitations TEXT
);

-- 下载统计表
CREATE TABLE IF NOT EXISTS downloads (
  slug TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TEXT,
  FOREIGN KEY (slug) REFERENCES fonts(slug) ON DELETE CASCADE
);

-- 关联表
CREATE TABLE IF NOT EXISTS font_languages (
  font_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  PRIMARY KEY (font_id, language),
  FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS font_formats (
  font_id INTEGER NOT NULL,
  format TEXT NOT NULL,
  PRIMARY KEY (font_id, format),
  FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS font_weights (
  font_id INTEGER NOT NULL,
  weight TEXT NOT NULL,
  PRIMARY KEY (font_id, weight),
  FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS font_tags (
  font_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (font_id, tag),
  FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
);

-- 管理员表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_fonts_category ON fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_license ON fonts(license_id);
CREATE INDEX IF NOT EXISTS idx_fonts_added_at ON fonts(added_at);
CREATE INDEX IF NOT EXISTS idx_fonts_status ON fonts(status);
CREATE INDEX IF NOT EXISTS idx_font_tags_tag ON font_tags(tag);
CREATE INDEX IF NOT EXISTS idx_font_languages_lang ON font_languages(language);
CREATE INDEX IF NOT EXISTS idx_banners_active_sort ON banners(is_active, sort_order);
