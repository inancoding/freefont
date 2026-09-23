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

-- 11. 方正仿宋
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('fangzheng-fangsong', '方正仿宋', 'FZ FangSong', '方正字库', '1.0', 'free-all',
 '方正仿宋是一款经典的中文仿宋字体，笔画纤细均匀，适合正文排版和印刷。',
 '宋体', 'https://www.foundertype.com/',
 5242880, 8105, 'https://example.com/fangzheng-fangsong.zip',
 datetime('now', '-32 days'));

-- 12. 站酷高端黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zcool-gaoduanhei', '站酷高端黑', 'ZCOOL GaoDuanHei', '站酷', '1.0', 'free-all',
 '站酷高端黑是一款免费可商用的黑体字体，字形简洁有力，适合标题和海报设计。',
 '黑体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 9437184, 8105, 'https://example.com/zcool-gaoduanhei.zip',
 datetime('now', '-35 days'));

-- 13. 站酷文艺体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zcool-wenyi', '站酷文艺体', 'ZCOOL WenYi', '站酷', '1.0', 'free-all',
 '站酷文艺体是一款具有艺术感的免费字体，笔画流畅自然，适合文艺类设计。',
 '艺术体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 7340032, 6763, 'https://example.com/zcool-wenyi.zip',
 datetime('now', '-38 days'));

-- 14. 站酷小薇logo体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zcool-xiaowei', '站酷小薇logo体', 'ZCOOL XiaoWei', '站酷', '1.0', 'free-all',
 '站酷小薇logo体是一款适合品牌标识设计的免费字体，字形优雅精致。',
 '艺术体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 6815744, 6763, 'https://example.com/zcool-xiaowei.zip',
 datetime('now', '-40 days'));

-- 15. 站酷酷黑体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zcool-koohei', '站酷酷黑体', 'ZCOOL KuHei', '站酷', '1.0', 'free-all',
 '站酷酷黑体是一款现代感十足的免费黑体字体，笔画粗犷有力，适合标题设计。',
 '黑体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 8912896, 8105, 'https://example.com/zcool-koohei.zip',
 datetime('now', '-42 days'));

-- 16. 思源等宽
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('source-han-mono', '思源等宽', 'Source Han Mono', 'Adobe', '1.002', 'ofl-1.1',
 '思源等宽是一款开源的等宽中文字体，适合代码编辑和终端显示。',
 '黑体', 'https://github.com/adobe-fonts/source-han-mono',
 25165824, 65535, 'https://example.com/source-han-mono.zip',
 datetime('now', '-45 days'));

-- 17. 更纱黑体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('sarasa-gothic', '更纱黑体', 'Sarasa Gothic', 'be5invis', '0.42', 'ofl-1.1',
 '更纱黑体是一款基于思源黑体和 Inter 的开源等宽字体，中英文混排效果优秀。',
 '黑体', 'https://github.com/be5invis/Sarasa-Gothic',
 45088768, 65535, 'https://example.com/sarasa-gothic.zip',
 datetime('now', '-48 days'));

-- 18. 江西拙楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('jiangxi-zhuokai', '江西拙楷', 'JiangXi ZhuoKai', '江西拙迹', '1.0', 'free-all',
 '江西拙楷是一款免费商用的楷书字体，笔画朴拙自然，具有书法韵味。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 10485760, 8105, 'https://example.com/jiangxi-zhuokai.zip',
 datetime('now', '-50 days'));

-- 19. 字体圈欣意冠黑体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zqt-guanhei', '字体圈欣意冠黑体', 'ZQT GuanHei', '字体圈', '1.0', 'free-all',
 '字体圈欣意冠黑体是一款免费商用的现代黑体字体，字形端庄大气。',
 '黑体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 11534336, 8105, 'https://example.com/zqt-guanhei.zip',
 datetime('now', '-52 days'));

-- 20. 演示悠然小楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-youran-xiaokai', '演示悠然小楷', 'YanShi YouRan XiaoKai', '立青工作室', '1.0', 'free-all',
 '演示悠然小楷是一款免费的小楷字体，笔画清秀雅致，适合古风设计。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 9961472, 6763, 'https://example.com/yanshi-youran-xiaokai.zip',
 datetime('now', '-55 days'));

-- 21. 演示秋鸿楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-qiuhongkai', '演示秋鸿楷', 'YanShi QiuHongKai', '立青工作室', '1.0', 'free-all',
 '演示秋鸿楷是一款免费的楷书字体，笔画舒展流畅，适合标题和海报。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 12058624, 6763, 'https://example.com/yanshi-qiuhongkai.zip',
 datetime('now', '-58 days'));

-- 22. 演示佛系体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-foxiti', '演示佛系体', 'YanShi FoXiTi', '立青工作室', '1.0', 'free-all',
 '演示佛系体是一款具有禅意的免费字体，笔画圆润柔和，适合文艺设计。',
 '艺术体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 8388608, 6763, 'https://example.com/yanshi-foxiti.zip',
 datetime('now', '-60 days'));

-- 23. 沐瑶软笔手写体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('muyao-ruanbi', '沐瑶软笔手写体', 'MuYao RuanBi', '沐瑶字库', '1.0', 'free-all',
 '沐瑶软笔手写体是一款免费的手写风格字体，笔画自然流畅，适合个性化设计。',
 '手写体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 7864320, 6763, 'https://example.com/muyao-ruanbi.zip',
 datetime('now', '-62 days'));

-- 24. 沐瑶随心手写体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('muyao-suixin', '沐瑶随心手写体', 'MuYao SuiXin', '沐瑶字库', '1.0', 'free-all',
 '沐瑶随心手写体是一款随性自然的手写字体，笔画灵动活泼，适合创意设计。',
 '手写体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 8126464, 6763, 'https://example.com/muyao-suixin.zip',
 datetime('now', '-65 days'));

-- 25. 庞门正道标题体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('pangmen-zhengdao-biaoti', '庞门正道标题体', 'PangMen ZhengDao BiaoTi', '庞门正道', '2.0', 'free-all',
 '庞门正道标题体是一款免费商用的标题字体，笔画粗犷有力，视觉冲击力强。',
 '黑体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 13631488, 8105, 'https://example.com/pangmen-zhengdao-biaoti.zip',
 datetime('now', '-68 days'));

-- 26. 庞门正道轻楷体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('pangmen-zhengdao-qingkai', '庞门正道轻楷体', 'PangMen ZhengDao QingKai', '庞门正道', '1.0', 'free-all',
 '庞门正道轻楷体是一款轻盈优雅的楷体字体，适合正文排版和文艺设计。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 10223616, 8105, 'https://example.com/pangmen-zhengdao-qingkai.zip',
 datetime('now', '-70 days'));

-- 27. 钟齐手迹
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zhongqi-shouji', '钟齐手迹', 'ZhongQi ShouJi', '钟齐字库', '1.0', 'free-all',
 '钟齐手迹是一款具有书法韵味的手写字体，笔画苍劲有力，适合艺术创作。',
 '书法体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 9175040, 6763, 'https://example.com/zhongqi-shouji.zip',
 datetime('now', '-72 days'));

-- 28. 钟齐志田手迹
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('zhongqi-zhitian', '钟齐志田手迹', 'ZhongQi ZhiTian', '钟齐字库', '1.0', 'free-all',
 '钟齐志田手迹是一款自然流畅的手写字体，笔画舒展自如，适合个性化设计。',
 '书法体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 9699328, 6763, 'https://example.com/zhongqi-zhitian.zip',
 datetime('now', '-75 days'));

-- 29. 清松手写体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('qingsong-shouxie', '清松手写体', 'QingSong ShouXie', '游清松', '1.0', 'free-all',
 '清松手写体是一款清新自然的手写字体，笔画轻盈灵动，适合文艺设计。',
 '手写体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 7602176, 6763, 'https://example.com/qingsong-shouxie.zip',
 datetime('now', '-78 days'));

-- 30. 清松手写体2
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('qingsong-shouxie2', '清松手写体2', 'QingSong ShouXie 2', '游清松', '2.0', 'free-all',
 '清松手写体2是升级版的手写字体，增加了更多字符，笔画更加丰富。',
 '手写体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 8650752, 8105, 'https://example.com/qingsong-shouxie2.zip',
 datetime('now', '-80 days'));

-- 31. 杨任东竹石体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yangrendong-zhushi', '杨任东竹石体', 'YangRenDong ZhuShi', '杨任东', '1.0', 'free-all',
 '杨任东竹石体是一款具有书法艺术感的免费字体，笔画如竹石般挺拔。',
 '书法体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 11010048, 6763, 'https://example.com/yangrendong-zhushi.zip',
 datetime('now', '-82 days'));

-- 32. 杨任东竹石体2
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yangrendong-zhushi2', '杨任东竹石体2', 'YangRenDong ZhuShi 2', '杨任东', '2.0', 'free-all',
 '杨任东竹石体2是升级版，增加了字符数量，优化了笔画细节。',
 '书法体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 12582912, 8105, 'https://example.com/yangrendong-zhushi2.zip',
 datetime('now', '-85 days'));

-- 33. 汇文明朝体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('huiwen-mingchao', '汇文明朝体', 'HuiWen MingChao', '汇文字库', '1.0', 'free-all',
 '汇文明朝体是一款复古风格的宋体字体，具有明代刻本韵味，适合古籍排版。',
 '宋体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 14155776, 8105, 'https://example.com/huiwen-mingchao.zip',
 datetime('now', '-88 days'));

-- 34. 汇文宋体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('huiwen-songti', '汇文宋体', 'HuiWen SongTi', '汇文字库', '1.0', 'free-all',
 '汇文宋体是一款经典的中文宋体字体，笔画清晰规范，适合正文阅读。',
 '宋体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 13107200, 8105, 'https://example.com/huiwen-songti.zip',
 datetime('now', '-90 days'));

-- 35. 文泉驿正黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('wenquanyi-zenhei', '文泉驿正黑', 'WenQuanYi Zen Hei', '文泉驿', '0.9', 'gpl-3.0',
 '文泉驿正黑是一款开源的中文黑体字体，字形端正清晰，适合屏幕显示。',
 '黑体', 'https://wenq.org/',
 8912896, 27484, 'https://example.com/wenquanyi-zenhei.zip',
 datetime('now', '-92 days'));

-- 36. 文泉驿点阵宋体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('wenquanyi-bitmap-song', '文泉驿点阵宋体', 'WenQuanYi Bitmap Song', '文泉驿', '0.1', 'gpl-3.0',
 '文泉驿点阵宋体是一款开源的点阵宋体字体，在小字号下显示清晰。',
 '宋体', 'https://wenq.org/',
 6553600, 27484, 'https://example.com/wenquanyi-bitmap-song.zip',
 datetime('now', '-95 days'));

-- 37. 方正楷体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('fangzheng-kaiti', '方正楷体', 'FZ KaiTi', '方正字库', '1.0', 'free-all',
 '方正楷体是一款经典的中文楷书字体，笔画规范优美，适合教育和出版。',
 '楷体', 'https://www.foundertype.com/',
 11534336, 8105, 'https://example.com/fangzheng-kaiti.zip',
 datetime('now', '-98 days'));

-- 38. 方正黑体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('fangzheng-heiti', '方正黑体', 'FZ HeiTi', '方正字库', '1.0', 'free-all',
 '方正黑体是一款经典的中文黑体字体，笔画简洁有力，适合标题和正文。',
 '黑体', 'https://www.foundertype.com/',
 10485760, 8105, 'https://example.com/fangzheng-heiti.zip',
 datetime('now', '-100 days'));

-- 39. 方正宋体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('fangzheng-songti', '方正宋体', 'FZ SongTi', '方正字库', '1.0', 'free-all',
 '方正宋体是一款经典的中文宋体字体，笔画规范清晰，适合正文排版。',
 '宋体', 'https://www.foundertype.com/',
 9961472, 8105, 'https://example.com/fangzheng-songti.zip',
 datetime('now', '-102 days'));

-- 40. 汉仪尚巍手书
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('hanyi-shangwei-shoushu', '汉仪尚巍手书', 'HYShangWei ShouShu', '汉仪字库', '1.0', 'free-all',
 '汉仪尚巍手书是一款具有艺术感的手写字体，笔画洒脱自然，适合创意设计。',
 '手写体', 'https://www.hanyi.com.cn/',
 12058624, 6763, 'https://example.com/hanyi-shangwei-shoushu.zip',
 datetime('now', '-105 days'));

-- 41. 汉仪乐酷体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('hanyi-leku', '汉仪乐酷体', 'HYLeKu', '汉仪字库', '1.0', 'free-all',
 '汉仪乐酷体是一款活泼可爱的艺术字体，笔画圆润有趣，适合儿童和娱乐设计。',
 '艺术体', 'https://www.hanyi.com.cn/',
 8388608, 6763, 'https://example.com/hanyi-leku.zip',
 datetime('now', '-108 days'));

-- 42. 汉仪雪君体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('hanyi-xuejun', '汉仪雪君体', 'HYXueJun', '汉仪字库', '1.0', 'free-all',
 '汉仪雪君体是一款优雅大气的艺术字体，笔画流畅自然，适合标题设计。',
 '艺术体', 'https://www.hanyi.com.cn/',
 9437184, 6763, 'https://example.com/hanyi-xuejun.zip',
 datetime('now', '-110 days'));

-- 43. 蒙纳超刚黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('monna-chaoganghei', '蒙纳超刚黑', 'MNa ChaoGangHei', '蒙纳字库', '1.0', 'free-all',
 '蒙纳超刚黑是一款现代感极强的黑体字体，笔画粗犷有力，适合海报设计。',
 '黑体', 'https://www.monotype.com/',
 15728640, 8105, 'https://example.com/monna-chaoganghei.zip',
 datetime('now', '-112 days'));

-- 44. 蒙纳简黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('monna-jianhei', '蒙纳简黑', 'MNa JianHei', '蒙纳字库', '1.0', 'free-all',
 '蒙纳简黑是一款简洁现代的黑体字体，笔画清晰规范，适合UI设计。',
 '黑体', 'https://www.monotype.com/',
 11010048, 8105, 'https://example.com/monna-jianhei.zip',
 datetime('now', '-115 days'));

-- 45. 蒙纳圆黑
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('monna-yuanhei', '蒙纳圆黑', 'MNa YuanHei', '蒙纳字库', '1.0', 'free-all',
 '蒙纳圆黑是一款圆润可爱的黑体字体，笔画柔和亲切，适合儿童设计。',
 '黑体', 'https://www.monotype.com/',
 10485760, 8105, 'https://example.com/monna-yuanhei.zip',
 datetime('now', '-118 days'));

-- 46. 锐字潮牌真帅体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('ruizi-chaopai-zhenshuai', '锐字潮牌真帅体', 'RZ ChaoPai ZhenShuai', '锐字潮牌', '1.0', 'free-all',
 '锐字潮牌真帅体是一款时尚潮流的艺术字体，笔画个性十足，适合潮流设计。',
 '艺术体', 'https://www.ruizi.com/',
 13631488, 6763, 'https://example.com/ruizi-chaopai-zhenshuai.zip',
 datetime('now', '-120 days'));

-- 47. 锐字真言体
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('ruizi-zhenyan', '锐字真言体', 'RZ ZhenYan', '锐字潮牌', '1.0', 'free-all',
 '锐字真言体是一款庄重有力的标题字体，笔画刚劲挺拔，适合品牌设计。',
 '黑体', 'https://www.ruizi.com/',
 14680064, 8105, 'https://example.com/ruizi-zhenyan.zip',
 datetime('now', '-122 days'));

-- 48. 演示春风楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-chunfengkai', '演示春风楷', 'YanShi ChunFengKai', '立青工作室', '1.0', 'free-all',
 '演示春风楷是一款清新优雅的楷书字体，笔画如春风般柔和，适合文艺设计。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 11534336, 6763, 'https://example.com/yanshi-chunfengkai.zip',
 datetime('now', '-125 days'));

-- 49. 演示夏荷楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-xiahekai', '演示夏荷楷', 'YanShi XiaHeKai', '立青工作室', '1.0', 'free-all',
 '演示夏荷楷是一款清新自然的楷书字体，笔画流畅优美，适合标题设计。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 12058624, 6763, 'https://example.com/yanshi-xiahekai.zip',
 datetime('now', '-128 days'));

-- 50. 演示秋霜楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-qiushuangkai', '演示秋霜楷', 'YanShi QiuShuangKai', '立青工作室', '1.0', 'free-all',
 '演示秋霜楷是一款端庄大气的楷书字体，笔画舒展有力，适合正式场合。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 12582912, 6763, 'https://example.com/yanshi-qiushuangkai.zip',
 datetime('now', '-130 days'));

-- 51. 演示冬雪楷
INSERT OR IGNORE INTO fonts (slug, name_zh, name_en, vendor, version, license_id, description, category, official_url, file_size, glyph_count, download_url, added_at) VALUES
('yanshi-dongxuekai', '演示冬雪楷', 'YanShi DongXueKai', '立青工作室', '1.0', 'free-all',
 '演示冬雪楷是一款清冷优雅的楷书字体，笔画简洁利落，适合冬季主题设计。',
 '楷体', 'https://www.zcool.com.cn/special/zcoolfonts/',
 13107200, 6763, 'https://example.com/yanshi-dongxuekai.zip',
 datetime('now', '-132 days'));

-- Associate languages
INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '简体中文' FROM fonts WHERE slug IN ('fangzheng-fangsong','zcool-gaoduanhei','zcool-wenyi','zcool-xiaowei','zcool-koohei','source-han-mono','sarasa-gothic','jiangxi-zhuokai','zqt-guanhei','yanshi-youran-xiaokai','yanshi-qiuhongkai','yanshi-foxiti','muyao-ruanbi','muyao-suixin','pangmen-zhengdao-biaoti','pangmen-zhengdao-qingkai','zhongqi-shouji','zhongqi-zhitian','qingsong-shouxie','qingsong-shouxie2','yangrendong-zhushi','yangrendong-zhushi2','huiwen-mingchao','huiwen-songti','wenquanyi-zenhei','wenquanyi-bitmap-song','fangzheng-kaiti','fangzheng-heiti','fangzheng-songti','hanyi-shangwei-shoushu','hanyi-leku','hanyi-xuejun','monna-chaoganghei','monna-jianhei','monna-yuanhei','ruizi-chaopai-zhenshuai','ruizi-zhenyan','yanshi-chunfengkai','yanshi-xiahekai','yanshi-qiushuangkai','yanshi-dongxuekai');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '繁体中文' FROM fonts WHERE slug IN ('source-han-mono','sarasa-gothic','fangzheng-kaiti','fangzheng-heiti','fangzheng-songti');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '日文' FROM fonts WHERE slug IN ('source-han-mono','sarasa-gothic');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '韩文' FROM fonts WHERE slug IN ('source-han-mono','sarasa-gothic');

INSERT OR IGNORE INTO font_languages (font_id, language)
SELECT id, '英文' FROM fonts WHERE slug IN ('fangzheng-fangsong','zcool-gaoduanhei','zcool-wenyi','zcool-xiaowei','zcool-koohei','source-han-mono','sarasa-gothic','jiangxi-zhuokai','zqt-guanhei','pangmen-zhengdao-biaoti','pangmen-zhengdao-qingkai','wenquanyi-zenhei','wenquanyi-bitmap-song','fangzheng-kaiti','fangzheng-heiti','fangzheng-songti','hanyi-shangwei-shoushu','hanyi-leku','hanyi-xuejun','monna-chaoganghei','monna-jianhei','monna-yuanhei','ruizi-chaopai-zhenshuai','ruizi-zhenyan');

-- Associate formats
INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'TTF' FROM fonts WHERE slug IN ('fangzheng-fangsong','zcool-gaoduanhei','zcool-wenyi','zcool-xiaowei','zcool-koohei','jiangxi-zhuokai','zqt-guanhei','yanshi-youran-xiaokai','yanshi-qiuhongkai','yanshi-foxiti','muyao-ruanbi','muyao-suixin','pangmen-zhengdao-biaoti','pangmen-zhengdao-qingkai','zhongqi-shouji','zhongqi-zhitian','qingsong-shouxie','qingsong-shouxie2','yangrendong-zhushi','yangrendong-zhushi2','huiwen-mingchao','huiwen-songti','wenquanyi-zenhei','wenquanyi-bitmap-song','fangzheng-kaiti','fangzheng-heiti','fangzheng-songti','hanyi-shangwei-shoushu','hanyi-leku','hanyi-xuejun','monna-chaoganghei','monna-jianhei','monna-yuanhei','ruizi-chaopai-zhenshuai','ruizi-zhenyan','yanshi-chunfengkai','yanshi-xiahekai','yanshi-qiushuangkai','yanshi-dongxuekai');

INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'OTF' FROM fonts WHERE slug IN ('source-han-mono','sarasa-gothic');

INSERT OR IGNORE INTO font_formats (font_id, format)
SELECT id, 'WOFF2' FROM fonts WHERE slug IN ('source-han-mono','sarasa-gothic','fangzheng-kaiti','fangzheng-heiti','fangzheng-songti');

-- Associate weights
INSERT OR IGNORE INTO font_weights (font_id, weight)
SELECT id, w FROM fonts, (SELECT '100' AS w UNION SELECT '200' UNION SELECT '300' UNION SELECT '400' UNION SELECT '500' UNION SELECT '600' UNION SELECT '700' UNION SELECT '800' UNION SELECT '900')
WHERE slug IN ('source-han-mono','sarasa-gothic','fangzheng-heiti','fangzheng-songti','monna-jianhei','monna-yuanhei');

INSERT OR IGNORE INTO font_weights (font_id, weight)
SELECT id, '400' FROM fonts WHERE slug IN ('fangzheng-fangsong','zcool-gaoduanhei','zcool-wenyi','zcool-xiaowei','zcool-koohei','jiangxi-zhuokai','zqt-guanhei','yanshi-youran-xiaokai','yanshi-qiuhongkai','yanshi-foxiti','muyao-ruanbi','muyao-suixin','pangmen-zhengdao-biaoti','pangmen-zhengdao-qingkai','zhongqi-shouji','zhongqi-zhitian','qingsong-shouxie','qingsong-shouxie2','yangrendong-zhushi','yangrendong-zhushi2','huiwen-mingchao','huiwen-songti','wenquanyi-zenhei','wenquanyi-bitmap-song','fangzheng-kaiti','hanyi-shangwei-shoushu','hanyi-leku','hanyi-xuejun','monna-chaoganghei','ruizi-chaopai-zhenshuai','ruizi-zhenyan','yanshi-chunfengkai','yanshi-xiahekai','yanshi-qiushuangkai','yanshi-dongxuekai');

-- Associate tags
INSERT OR IGNORE INTO font_tags (font_id, tag) VALUES
((SELECT id FROM fonts WHERE slug='fangzheng-fangsong'), '免费'),
((SELECT id FROM fonts WHERE slug='fangzheng-fangsong'), '商用'),
((SELECT id FROM fonts WHERE slug='fangzheng-fangsong'), '正文'),
((SELECT id FROM fonts WHERE slug='zcool-gaoduanhei'), '免费'),
((SELECT id FROM fonts WHERE slug='zcool-gaoduanhei'), '商用'),
((SELECT id FROM fonts WHERE slug='zcool-gaoduanhei'), '标题'),
((SELECT id FROM fonts WHERE slug='zcool-wenyi'), '免费'),
((SELECT id FROM fonts WHERE slug='zcool-wenyi'), '商用'),
((SELECT id FROM fonts WHERE slug='zcool-wenyi'), '文艺'),
((SELECT id FROM fonts WHERE slug='zcool-xiaowei'), '免费'),
((SELECT id FROM fonts WHERE slug='zcool-xiaowei'), '商用'),
((SELECT id FROM fonts WHERE slug='zcool-xiaowei'), '品牌'),
((SELECT id FROM fonts WHERE slug='zcool-koohei'), '免费'),
((SELECT id FROM fonts WHERE slug='zcool-koohei'), '商用'),
((SELECT id FROM fonts WHERE slug='zcool-koohei'), '标题'),
((SELECT id FROM fonts WHERE slug='source-han-mono'), '免费'),
((SELECT id FROM fonts WHERE slug='source-han-mono'), '商用'),
((SELECT id FROM fonts WHERE slug='source-han-mono'), '开源'),
((SELECT id FROM fonts WHERE slug='source-han-mono'), '等宽'),
((SELECT id FROM fonts WHERE slug='sarasa-gothic'), '免费'),
((SELECT id FROM fonts WHERE slug='sarasa-gothic'), '商用'),
((SELECT id FROM fonts WHERE slug='sarasa-gothic'), '开源'),
((SELECT id FROM fonts WHERE slug='sarasa-gothic'), '等宽'),
((SELECT id FROM fonts WHERE slug='jiangxi-zhuokai'), '免费'),
((SELECT id FROM fonts WHERE slug='jiangxi-zhuokai'), '商用'),
((SELECT id FROM fonts WHERE slug='jiangxi-zhuokai'), '书法'),
((SELECT id FROM fonts WHERE slug='zqt-guanhei'), '免费'),
((SELECT id FROM fonts WHERE slug='zqt-guanhei'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-youran-xiaokai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-youran-xiaokai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-youran-xiaokai'), '古风'),
((SELECT id FROM fonts WHERE slug='yanshi-qiuhongkai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-qiuhongkai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-qiuhongkai'), '标题'),
((SELECT id FROM fonts WHERE slug='yanshi-foxiti'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-foxiti'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-foxiti'), '禅意'),
((SELECT id FROM fonts WHERE slug='muyao-ruanbi'), '免费'),
((SELECT id FROM fonts WHERE slug='muyao-ruanbi'), '商用'),
((SELECT id FROM fonts WHERE slug='muyao-ruanbi'), '手写'),
((SELECT id FROM fonts WHERE slug='muyao-suixin'), '免费'),
((SELECT id FROM fonts WHERE slug='muyao-suixin'), '商用'),
((SELECT id FROM fonts WHERE slug='muyao-suixin'), '手写'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-biaoti'), '免费'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-biaoti'), '商用'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-biaoti'), '标题'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-qingkai'), '免费'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-qingkai'), '商用'),
((SELECT id FROM fonts WHERE slug='pangmen-zhengdao-qingkai'), '正文'),
((SELECT id FROM fonts WHERE slug='zhongqi-shouji'), '免费'),
((SELECT id FROM fonts WHERE slug='zhongqi-shouji'), '商用'),
((SELECT id FROM fonts WHERE slug='zhongqi-shouji'), '书法'),
((SELECT id FROM fonts WHERE slug='zhongqi-zhitian'), '免费'),
((SELECT id FROM fonts WHERE slug='zhongqi-zhitian'), '商用'),
((SELECT id FROM fonts WHERE slug='zhongqi-zhitian'), '书法'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie'), '免费'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie'), '商用'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie'), '手写'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie2'), '免费'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie2'), '商用'),
((SELECT id FROM fonts WHERE slug='qingsong-shouxie2'), '手写'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi'), '免费'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi'), '商用'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi'), '书法'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi2'), '免费'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi2'), '商用'),
((SELECT id FROM fonts WHERE slug='yangrendong-zhushi2'), '书法'),
((SELECT id FROM fonts WHERE slug='huiwen-mingchao'), '免费'),
((SELECT id FROM fonts WHERE slug='huiwen-mingchao'), '商用'),
((SELECT id FROM fonts WHERE slug='huiwen-mingchao'), '复古'),
((SELECT id FROM fonts WHERE slug='huiwen-songti'), '免费'),
((SELECT id FROM fonts WHERE slug='huiwen-songti'), '商用'),
((SELECT id FROM fonts WHERE slug='huiwen-songti'), '正文'),
((SELECT id FROM fonts WHERE slug='wenquanyi-zenhei'), '免费'),
((SELECT id FROM fonts WHERE slug='wenquanyi-zenhei'), '开源'),
((SELECT id FROM fonts WHERE slug='wenquanyi-zenhei'), '屏幕显示'),
((SELECT id FROM fonts WHERE slug='wenquanyi-bitmap-song'), '免费'),
((SELECT id FROM fonts WHERE slug='wenquanyi-bitmap-song'), '开源'),
((SELECT id FROM fonts WHERE slug='wenquanyi-bitmap-song'), '点阵'),
((SELECT id FROM fonts WHERE slug='fangzheng-kaiti'), '免费'),
((SELECT id FROM fonts WHERE slug='fangzheng-kaiti'), '商用'),
((SELECT id FROM fonts WHERE slug='fangzheng-kaiti'), '教育'),
((SELECT id FROM fonts WHERE slug='fangzheng-heiti'), '免费'),
((SELECT id FROM fonts WHERE slug='fangzheng-heiti'), '商用'),
((SELECT id FROM fonts WHERE slug='fangzheng-heiti'), '标题'),
((SELECT id FROM fonts WHERE slug='fangzheng-songti'), '免费'),
((SELECT id FROM fonts WHERE slug='fangzheng-songti'), '商用'),
((SELECT id FROM fonts WHERE slug='fangzheng-songti'), '正文'),
((SELECT id FROM fonts WHERE slug='hanyi-shangwei-shoushu'), '免费'),
((SELECT id FROM fonts WHERE slug='hanyi-shangwei-shoushu'), '商用'),
((SELECT id FROM fonts WHERE slug='hanyi-shangwei-shoushu'), '手写'),
((SELECT id FROM fonts WHERE slug='hanyi-leku'), '免费'),
((SELECT id FROM fonts WHERE slug='hanyi-leku'), '商用'),
((SELECT id FROM fonts WHERE slug='hanyi-leku'), '可爱'),
((SELECT id FROM fonts WHERE slug='hanyi-xuejun'), '免费'),
((SELECT id FROM fonts WHERE slug='hanyi-xuejun'), '商用'),
((SELECT id FROM fonts WHERE slug='hanyi-xuejun'), '标题'),
((SELECT id FROM fonts WHERE slug='monna-chaoganghei'), '免费'),
((SELECT id FROM fonts WHERE slug='monna-chaoganghei'), '商用'),
((SELECT id FROM fonts WHERE slug='monna-chaoganghei'), '海报'),
((SELECT id FROM fonts WHERE slug='monna-jianhei'), '免费'),
((SELECT id FROM fonts WHERE slug='monna-jianhei'), '商用'),
((SELECT id FROM fonts WHERE slug='monna-jianhei'), 'UI'),
((SELECT id FROM fonts WHERE slug='monna-yuanhei'), '免费'),
((SELECT id FROM fonts WHERE slug='monna-yuanhei'), '商用'),
((SELECT id FROM fonts WHERE slug='monna-yuanhei'), '可爱'),
((SELECT id FROM fonts WHERE slug='ruizi-chaopai-zhenshuai'), '免费'),
((SELECT id FROM fonts WHERE slug='ruizi-chaopai-zhenshuai'), '商用'),
((SELECT id FROM fonts WHERE slug='ruizi-chaopai-zhenshuai'), '潮流'),
((SELECT id FROM fonts WHERE slug='ruizi-zhenyan'), '免费'),
((SELECT id FROM fonts WHERE slug='ruizi-zhenyan'), '商用'),
((SELECT id FROM fonts WHERE slug='ruizi-zhenyan'), '品牌'),
((SELECT id FROM fonts WHERE slug='yanshi-chunfengkai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-chunfengkai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-chunfengkai'), '文艺'),
((SELECT id FROM fonts WHERE slug='yanshi-xiahekai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-xiahekai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-xiahekai'), '标题'),
((SELECT id FROM fonts WHERE slug='yanshi-qiushuangkai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-qiushuangkai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-qiushuangkai'), '正式'),
((SELECT id FROM fonts WHERE slug='yanshi-dongxuekai'), '免费'),
((SELECT id FROM fonts WHERE slug='yanshi-dongxuekai'), '商用'),
((SELECT id FROM fonts WHERE slug='yanshi-dongxuekai'), '冬季');

-- Set download counts
INSERT OR IGNORE INTO downloads (slug, count) VALUES
('fangzheng-fangsong', 2876),
('zcool-gaoduanhei', 18234),
('zcool-wenyi', 6543),
('zcool-xiaowei', 5987),
('zcool-koohei', 14567),
('source-han-mono', 7654),
('sarasa-gothic', 9876),
('jiangxi-zhuokai', 4321),
('zqt-guanhei', 3876),
('yanshi-youran-xiaokai', 8765),
('yanshi-qiuhongkai', 7234),
('yanshi-foxiti', 5432),
('muyao-ruanbi', 6789),
('muyao-suixin', 6123),
('pangmen-zhengdao-biaoti', 16789),
('pangmen-zhengdao-qingkai', 4567),
('zhongqi-shouji', 3456),
('zhongqi-zhitian', 3210),
('qingsong-shouxie', 7890),
('qingsong-shouxie2', 7123),
('yangrendong-zhushi', 5678),
('yangrendong-zhushi2', 5234),
('huiwen-mingchao', 2987),
('huiwen-songti', 3654),
('wenquanyi-zenhei', 11234),
('wenquanyi-bitmap-song', 2345),
('fangzheng-kaiti', 13456),
('fangzheng-heiti', 15678),
('fangzheng-songti', 12890),
('hanyi-shangwei-shoushu', 8234),
('hanyi-leku', 4567),
('hanyi-xuejun', 5123),
('monna-chaoganghei', 6789),
('monna-jianhei', 7456),
('monna-yuanhei', 5890),
('ruizi-chaopai-zhenshuai', 9123),
('ruizi-zhenyan', 8567),
('yanshi-chunfengkai', 4890),
('yanshi-xiahekai', 4321),
('yanshi-qiushuangkai', 3987),
('yanshi-dongxuekai', 3654);

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
