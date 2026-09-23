-- Mock font data for development

-- 1. 思源黑体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('source-han-sans', '思源黑体', 'Source Han Sans', 'Adobe / Google', '2.004', 'ofl-1.1',
 '思源黑体是 Adobe 与 Google 联合开发的开源泛 CJK 字体，支持简体中文、繁体中文、日文和韩文。',
 '黑体', 'https://github.com/adobe-fonts/source-han-sans',
 28672000, 65535, 'https://github.com/adobe-fonts/source-han-sans/releases/download/2.004R/SourceHanSansSC.zip',
 datetime('now', '-30 days'));

-- 2. 思源宋体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('source-han-serif', '思源宋体', 'Source Han Serif', 'Adobe / Google', '2.001', 'ofl-1.1',
 '思源宋体是 Adobe 与 Google 联合开发的开源泛 CJK 宋体字体，字形优美，适合正文排版。',
 '宋体', 'https://github.com/adobe-fonts/source-han-serif',
 32505856, 65535, 'https://github.com/adobe-fonts/source-han-serif/releases/download/2.001R/SourceHanSerifSC.zip',
 datetime('now', '-28 days'));

-- 3. 阿里巴巴普惠体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('alibaba-puhuiti', '阿里巴巴普惠体', 'Alibaba PuHuiTi', '阿里巴巴', '3.0', 'alibaba-puhuiti',
 '阿里巴巴普惠体是阿里巴巴集团发布的免费商用字体，包含黑体和多个字重，适用于品牌设计和日常办公。',
 '黑体', 'https://design.alibabagroup.com/font',
 15728640, 8105, 'https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-3.zip',
 datetime('now', '-25 days'));

-- 4. MiSans
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('misans', 'MiSans', 'MiSans', '小米', '1.0', 'misans',
 'MiSans 是小米公司推出的免费商用字体，设计简洁现代，支持多字重，适合 UI 设计和品牌视觉。',
 '黑体', 'https://hyperos.mi.com/font',
 12582912, 8105, 'https://cdn.cnbj1.fds.api.mi-img.com/miui-global/MiSans.zip',
 datetime('now', '-20 days'));

-- 5. OPPO Sans
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('oppo-sans', 'OPPO Sans', 'OPPO Sans', 'OPPO', '3.0', 'oppo-sans',
 'OPPO Sans 是 OPPO 公司推出的免费商用字体，字形圆润流畅，包含四个字重，适合移动端 UI 设计。',
 '黑体', 'https://www.oppo.com/cn/styleguide/fonts/',
 10485760, 8105, 'https://oppo-fonts.oss-cn-hangzhou.aliyuncs.com/OPPOSans.zip',
 datetime('now', '-18 days'));

-- 6. 霞鹜文楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('lxgw-wenkai', '霞鹜文楷', 'LXGW WenKai', '霞鹜', '1.500', 'ofl-1.1',
 '霞鹜文楷是一款基于 Klee 的开源中文字体，兼具楷书的笔意和现代排版的可读性，适合阅读和排版。',
 '楷体', 'https://github.com/lxgw/LxgwWenKai',
 18874368, 8105, 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.500/LXGWWenKai-Regular.ttf',
 datetime('now', '-15 days'));

-- 7. 鸿蒙字体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('harmonyos-sans', '鸿蒙字体', 'HarmonyOS Sans', '华为', '1.0', 'free-all',
 'HarmonyOS Sans 是华为为鸿蒙系统设计的系统字体，支持多语言，字形简洁清晰，适合屏幕显示。',
 '黑体', 'https://developer.huawei.com/consumer/cn/design/resource/',
 14680064, 8105, 'https://developer.huawei.com/fonts/HarmonyOS_Sans.zip',
 datetime('now', '-12 days'));

-- 8. 得意黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('smiley-sans', '得意黑', 'Smiley Sans', 'ATRI', '1.010', 'ofl-1.1',
 '得意黑是一款开源的斜体黑体字体，字形略带倾斜，具有动感和现代感，适合标题和海报设计。',
 '艺术体', 'https://github.com/atelier-anchor/smiley-sans',
 8388608, 8105, 'https://github.com/atelier-anchor/smiley-sans/releases/download/v1.010/SmileySans-Oblique.zip',
 datetime('now', '-8 days'));

-- 9. 站酷快乐体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zcool-kuaiile', '站酷快乐体', 'ZCOOL KuaiLe', '站酷', '1.0', 'free-all',
 '站酷快乐体是一款免费可商用的手写风格字体，字形活泼可爱，适合儿童、娱乐类设计。',
 '手写体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 6291456, 6763, 'https://img.zcool.cn/community/017f375a4f044aa8012060be67e75c.zip',
 datetime('now', '-5 days'));

-- 10. 文泉驿微米黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('wenquanyi-microhei', '文泉驿微米黑', 'WenQuanYi Micro Hei', '文泉驿', '0.2', 'gpl-3.0',
 '文泉驿微米黑是一款开源的中文黑体字体，基于 Droid Sans Fallback 改进，字形清晰，适合屏幕显示。',
 '黑体', 'https://wenq.org/',
 7340032, 27484, 'https://wenq.org/wqy2/index.cgi?MicroHei',
 datetime('now', '-3 days'));

-- Associate languages
INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '简体中文' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif','alibaba-puhuiti','misans','oppo-sans','lxgw-wenkai','harmonyos-sans','smiley-sans','zcool-kuaiile','wenquanyi-microhei');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '繁体中文' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif','lxgw-wenkai');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '日文' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '韩文' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '英文' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif','alibaba-puhuiti','misans','oppo-sans','harmonyos-sans','smiley-sans','zcool-kuaiile','wenquanyi-microhei');

-- Associate formats
INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'TTF' FROM fonts WHERE slug IN ('lxgw-wenkai','zcool-kuaiile','wenquanyi-microhei');

INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'OTF' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif','alibaba-puhuiti','misans','oppo-sans','harmonyos-sans','smiley-sans');

INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'WOFF2' FROM fonts WHERE slug IN ('source-han-sans','source-han-serif','misans','harmonyos-sans');

-- Associate weights
INSERT OR IGNORE INTO font_weights (font_id, weight)
SELECT id, w FROM fonts, (SELECT '100' AS w UNION SELECT '200' UNION SELECT '300' UNION SELECT '400' UNION SELECT '500' UNION SELECT '600' UNION SELECT '700' UNION SELECT '800' UNION SELECT '900')
WHERE slug IN ('source-han-sans','source-han-serif','alibaba-puhuiti','misans','oppo-sans','harmonyos-sans');

INSERT OR IGNORE INTO font_weights (font_id, weight)
SELECT id, '400' FROM fonts WHERE slug IN ('lxgw-wenkai','zcool-kuaiile','wenquanyi-microhei','smiley-sans');

-- Associate tags
INSERT OR IGNORE INTO font_tags (font_id, tag) VALUES
((SELECT id FROM fonts WHERE slug='source-han-sans'), '免费'),
((SELECT id FROM fonts WHERE slug='source-han-sans'), '商用'),
((SELECT id FROM fonts WHERE slug='source-han-sans'), '开源'),
((SELECT id FROM fonts WHERE slug='source-han-sans'), 'CJK'),
((SELECT id FROM fonts WHERE slug='source-han-serif'), '免费'),
((SELECT id FROM fonts WHERE slug='source-han-serif'), '商用'),
((SELECT id FROM fonts WHERE slug='source-han-serif'), '开源'),
((SELECT id FROM fonts WHERE slug='alibaba-puhuiti'), '免费'),
((SELECT id FROM fonts WHERE slug='alibaba-puhuiti'), '商用'),
((SELECT id FROM fonts WHERE slug='alibaba-puhuiti'), '品牌'),
((SELECT id FROM fonts WHERE slug='misans'), '免费'),
((SELECT id FROM fonts WHERE slug='misans'), '商用'),
((SELECT id FROM fonts WHERE slug='misans'), 'UI'),
((SELECT id FROM fonts WHERE slug='oppo-sans'), '免费'),
((SELECT id FROM fonts WHERE slug='oppo-sans'), '商用'),
((SELECT id FROM fonts WHERE slug='oppo-sans'), 'UI'),
((SELECT id FROM fonts WHERE slug='lxgw-wenkai'), '免费'),
((SELECT id FROM fonts WHERE slug='lxgw-wenkai'), '开源'),
((SELECT id FROM fonts WHERE slug='lxgw-wenkai'), '阅读'),
((SELECT id FROM fonts WHERE slug='harmonyos-sans'), '免费'),
((SELECT id FROM fonts WHERE slug='harmonyos-sans'), '商用'),
((SELECT id FROM fonts WHERE slug='harmonyos-sans'), '系统字体'),
((SELECT id FROM fonts WHERE slug='smiley-sans'), '免费'),
((SELECT id FROM fonts WHERE slug='smiley-sans'), '开源'),
((SELECT id FROM fonts WHERE slug='smiley-sans'), '标题'),
((SELECT id FROM fonts WHERE slug='zcool-kuaiile'), '免费'),
((SELECT id FROM fonts WHERE slug='zcool-kuaiile'), '手写'),
((SELECT id FROM fonts WHERE slug='zcool-kuaiile'), '可爱'),
((SELECT id FROM fonts WHERE slug='wenquanyi-microhei'), '免费'),
((SELECT id FROM fonts WHERE slug='wenquanyi-microhei'), '开源'),
((SELECT id FROM fonts WHERE slug='wenquanyi-microhei'), '屏幕显示');

-- Set download counts
INSERT OR IGNORE INTO downloads (slug, count) VALUES
('source-han-sans', 15234),
('source-han-serif', 8921),
('alibaba-puhuiti', 12456),
('misans', 9876),
('oppo-sans', 7654),
('lxgw-wenkai', 11234),
('harmonyos-sans', 6543),
('smiley-sans', 5432),
('zcool-kuaiile', 4321),
('wenquanyi-microhei', 3210);
