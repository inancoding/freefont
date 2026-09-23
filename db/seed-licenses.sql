-- 开源协议
INSERT OR IGNORE INTO licenses (id, name, name_en, name_zh, type, url, summary, permissions, limitations) VALUES
('ofl-1.1', 'OFL 1.1', 'SIL Open Font License 1.1', 'SIL 开源字体许可协议 1.1', 'open-source',
 'https://scripts.sil.org/OFL',
 '允许自由使用、研究、修改和再分发，但不可单独销售。',
 '["使用","研究","修改","再分发","嵌入文档","捆绑分发"]',
 '["不可单独销售","衍生作品须同样使用 OFL","保留版权声明"]');

INSERT OR IGNORE INTO licenses (id, name, name_en, name_zh, type, url, summary, permissions, limitations) VALUES
('apache-2.0', 'Apache 2.0', 'Apache License 2.0', 'Apache 许可协议 2.0', 'open-source',
 'https://www.apache.org/licenses/LICENSE-2.0',
 '宽松的开源协议，允许商业使用和修改，需提供版权声明和许可协议副本。',
 '["商业使用","修改","分发","专利使用","私有使用"]',
 '["需保留版权声明","需包含许可协议副本","不含商标授权"]');

INSERT OR IGNORE INTO licenses (id, name, name_en, name_zh, type, url, summary, permissions, limitations) VALUES
('gpl-3.0', 'GPL 3.0', 'GNU General Public License v3.0', 'GNU 通用公共许可协议 3.0', 'open-source',
 'https://www.gnu.org/licenses/gpl-3.0.html',
 '强 copyleft 协议，衍生作品必须使用相同协议发布。',
 '["使用","研究","修改","再分发","商业使用"]',
 '["衍生作品必须开源","必须包含源代码或提供获取方式","需保留版权声明"]');

INSERT OR IGNORE INTO licenses (id, name, name_en, name_zh, type, url, summary, permissions, limitations) VALUES
('mit', 'MIT', 'MIT License', 'MIT 许可协议', 'open-source',
 'https://opensource.org/licenses/MIT',
 '最宽松的开源协议之一，几乎无限制。',
 '["商业使用","修改","分发","私有使用"]',
 '["需保留版权声明","无担保责任"]');

-- 厂商协议
INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('alibaba-puhuiti', '阿里巴巴普惠体授权', '阿里巴巴普惠体免费授权', 'vendor',
 '阿里巴巴普惠体允许个人和企业免费使用，包括商业用途。',
 '["个人使用","商业使用","嵌入应用","嵌入文档"]',
 '["不可转售字体文件","不可修改字体后作为独立产品分发"]');

INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('misans', 'MiSans 免费授权', 'MiSans 免费使用授权', 'vendor',
 '小米 MiSans 字体免费授权，允许个人和商业使用。',
 '["个人使用","商业使用","嵌入应用"]',
 '["不可转售字体文件"]');

INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('oppo-sans', 'OPPO Sans 免费授权', 'OPPO Sans 免费使用授权', 'vendor',
 'OPPO Sans 字体免费授权，允许个人和商业使用。',
 '["个人使用","商业使用","嵌入应用"]',
 '["不可转售字体文件"]');

INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('vivo-sans', 'vivo Sans 免费授权', 'vivo Sans 免费使用授权', 'vendor',
 'vivo Sans 字体免费授权，允许个人和商业使用。',
 '["个人使用","商业使用","嵌入应用"]',
 '["不可转售字体文件"]');

-- 自定义协议
INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('personal-free', '个人免费', '个人免费授权', 'custom',
 '仅限个人非商业用途免费使用。',
 '["个人非商业使用"]',
 '["禁止商业使用","禁止修改后分发"]');

INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('personal-commercial-free', '个人商用免费', '个人及商用免费授权', 'custom',
 '允许个人和商业用途免费使用。',
 '["个人使用","商业使用"]',
 '["不可转售字体文件","不可修改后作为独立产品分发"]');

INSERT OR IGNORE INTO licenses (id, name, name_zh, type, summary, permissions, limitations) VALUES
('free-all', '完全免费', '完全免费授权', 'custom',
 '完全免费，包括个人和商业用途，无额外限制。',
 '["个人使用","商业使用","修改","分发"]',
 '["需保留版权声明"]');
