# 免费字体收录项目 - 需求文档

## 项目版本

**当前版本**: v3.0（第二次重构）

| 版本 | 说明 |
|------|------|
| v1 | 初始版本 |
| v2 | 第一次重构 |
| v3 | 第二次重构（当前）- Vue3 + TypeScript + Tailwind CSS |

---

## 项目概述

构建一个免费字体收录与分享平台。**GitHub 仅作为字体文件（ZIP）的存储仓库**，不部署网站。网站部署在**国内云服务器**，使用 **SQLite 数据库 + Node.js 后端 + Vue 3 前端** 的全栈架构。

### 架构总览

```
GitHub 仓库（仅存储）                    国内云服务器（网站）
┌──────────────────────┐                ┌─────────────────────────────────┐
│  zips/*.zip          │   下载链接指向  │  Node.js 后端 + Vue 3 前端       │
│  fonts/*.json (备份)  │ ──────────────→│  ├── SQLite 数据库（唯一数据源）  │
│  licenses/ (备份)     │                │  ├── /api/* REST API             │
│                      │                │  ├── 静态文件（Vue 构建产物）     │
│  CI: auto-release    │                │  └── 图片（public/images/）      │
│  创建 tag + Release  │                │                                  │
└──────────────────────┘                └─────────────────────────────────┘
```

- **GitHub**：存储字体 ZIP 文件 + CI 自动创建 Release/Tag（供下载链接使用）
- **国内云服务器**：运行完整网站，所有数据从 SQLite 读取，不依赖 GitHub API
- **下载链接**：指向 GitHub（raw.githubusercontent.com / jsDelivr），这是唯一需要访问 GitHub 的部分

---

## 1. 存储与分发

### 1.1 字体存储
- 使用 GitHub 仓库作为字体 ZIP 文件的**唯一存储**
- 每发布一款字体创建 1 条对应的 GitHub Release
- 字体文件以 ZIP 格式存储在仓库 `zips/` 目录
- **国内服务器不保存 ZIP 文件**，仅作为中转（上传后 push 到 GitHub 即删除）

### 1.2 数据存储
- **SQLite 数据库**：存储字体信息、授权协议、下载统计等所有数据
- 数据库文件位于 `db/free-font.db`
- 支持通过 UI 或 CLI 直接操作数据库，无需重新构建

### 1.3 服务器存储

| 文件类型 | 存储位置 | 谁提供访问 | 服务器需要保存 |
|----------|----------|-----------|---------------|
| 字体 ZIP | GitHub `zips/` | GitHub raw / jsDelivr | 不需要（仅中转） |
| 封面图/预览图 | 服务器 `public/images/` | 国内服务器 | 需要 |
| Markdown 图片 | 服务器 `public/images/{slug}/` | 国内服务器 | 需要 |
| SQLite 数据库 | 服务器 `db/` | 后端 API | 需要 |

### 1.4 下载方式
| 渠道 | 说明 |
|------|------|
| GitHub 直链 | 直接从 GitHub Release 下载 |
| jsDelivr CDN | 全球加速下载 |
| Githack CDN | 备用加速下载 |
| 网盘分享 | 管理员手动填写网盘链接（百度网盘、阿里云盘等） |

---

## 2. 技术栈

### 2.1 前端技术选型
- **构建工具**: Vite
- **框架**: Vue 3 + TypeScript
- **样式**: Tailwind CSS
- **路由**: Vue Router
- **状态管理**: Pinia
- **Markdown 编辑器**: md-editor-v3

### 2.2 后端技术选型
- **运行时**: Node.js >= 22
- **框架**: Express 或 Fastify
- **数据库**: SQLite（使用 sql.js 或 better-sqlite3）
- **语言**: TypeScript

### 2.3 部署方式

**国内云服务器部署（唯一方案）**

放弃 GitHub Pages，只部署一套国内服务器网站。GitHub 仅作为字体文件存储仓库。

#### 三模块架构

```
┌─────────────────────────────────────────────────────────────┐
│  国内云服务器                                                │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  用户前端        │  │  管理前端        │  │  后端 API    │ │
│  │  (Vue 3 SPA)    │  │  (Vue 3 SPA)    │  │  (Node.js)  │ │
│  │                 │  │                 │  │             │ │
│  │  /              │  │  /admin         │  │  /api/*     │ │
│  │  /fonts/:slug   │  │  /admin/fonts   │  │             │ │
│  │  /licenses      │  │  /admin/upload  │  │  ┌────────┐ │ │
│  │  /about         │  │                 │  │  │SQLite  │ │ │
│  │                 │  │                 │  │  │free-   │ │ │
│  │  只读，公开访问  │  │  需登录         │  │  │font.db │ │ │
│  └────────┬────────┘  └────────┬────────┘  │  └────────┘ │ │
│           │                    │            └──────┬──────┘ │
│           └────────────────────┼───────────────────┘        │
└────────────────────────────────┼─────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │  GitHub 仓库（仅存储）   │
                    │  zips/*.zip             │
                    │  CI: auto-release       │
                    └─────────────────────────┘
```

| 模块 | 路径 | 职责 | 权限 |
|------|------|------|------|
| **用户前端** | `/` | 浏览字体、搜索筛选、查看详情、下载 | 公开 |
| **管理前端** | `/admin` | 新增/编辑字体、上传 ZIP/图片、管理协议 | 需登录 |
| **后端 API** | `/api/*` | 数据读写、文件上传、下载统计 | 按接口区分 |

#### 后端 API 设计

```
公开接口（用户前端）：
  GET  /api/fonts           → 字体列表（支持搜索、筛选、排序）
  GET  /api/fonts/:slug     → 字体详情（含 Markdown）
  GET  /api/licenses        → 协议列表
  GET  /api/licenses/:id    → 协议详情
  POST /api/fonts/:slug/download → 记录下载数，返回下载链接

管理接口（需认证，管理前端）：
  POST   /api/admin/fonts        → 新增字体
  PUT    /api/admin/fonts/:slug  → 编辑字体
  DELETE /api/admin/fonts/:slug  → 删除字体
  POST   /api/admin/upload/zip   → 上传 ZIP（转发到 GitHub）
  POST   /api/admin/upload/image → 上传图片（保存到服务器）
  POST   /api/admin/licenses     → 新增协议
  PUT    /api/admin/licenses/:id → 编辑协议
```

#### 认证方案

- 环境变量配置管理员密码/密钥
- 登录后返回 JWT token
- 管理前端存 localStorage，请求时带 Authorization header

#### 服务器存储

```
国内服务器：
  ├── db/free-font.db          ← SQLite（必须）
  ├── public/images/           ← 封面图、预览图、详情图（必须）
  │   ├── {slug}-cover.webp
  │   ├── {slug}-preview.webp
  │   └── {slug}/
  └── /tmp/                    ← 上传临时目录（自动清理）
```

**优势**：
- 无双站同步问题
- SQLite 是唯一数据源，新增字体直接写库
- 部署流程简化为一套
- 国内访问完全不受 GitHub 影响（除下载链接外）
- 服务器不存 ZIP，存储压力小

### 2.4 数据库设计

```sql
-- 字体表
CREATE TABLE fonts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_zh TEXT,
  name_en TEXT,
  vendor TEXT NOT NULL,
  version TEXT NOT NULL,
  license_id TEXT NOT NULL,
  description TEXT,
  content TEXT,           -- Markdown 详细介绍
  category TEXT,
  official_url TEXT,
  cover_path TEXT,
  preview_path TEXT,
  file_size INTEGER,
  glyph_count INTEGER,
  sha256 TEXT,
  download_url TEXT,
  cloud_drive_url TEXT,
  added_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (license_id) REFERENCES licenses(id)
);

-- 授权协议表
CREATE TABLE licenses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  type TEXT,              -- open-source / vendor / custom
  verified INTEGER,
  redistributable INTEGER,
  commercial_use INTEGER,
  requires_license_text INTEGER,
  constraints TEXT,       -- JSON array
  notes TEXT
);

-- 下载统计表
CREATE TABLE downloads (
  slug TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TEXT
);

-- 关联表：语言、格式、字重、标签
CREATE TABLE font_languages (font_id INTEGER, language TEXT);
CREATE TABLE font_formats (font_id INTEGER, format TEXT);
CREATE TABLE font_weights (font_id INTEGER, weight TEXT);
CREATE TABLE font_tags (font_id INTEGER, tag TEXT);
```

### 2.5 数据获取方式

**国内云服务器部署**：
- 前端通过 `/api/*` 请求后端 API
- 后端直接查询 SQLite 数据库返回数据
- 下载时自动更新下载统计
- 所有数据加载不依赖 GitHub（除下载链接外）

### 2.6 构建要求
- 支持 SSG（静态站点生成）用于 SEO
- 首屏关键数据可预渲染，其余运行时加载
- 支持按需加载字体详情页

---

## 3. 字体发布流程

### 3.1 管理员 UI 新增（主要方式）

```
管理员操作                    国内服务器                        GitHub
───────────                  ─────────                       ─────
1. 上传 ZIP + 封面图 + 填表单
        │
        ▼
2. 提交 ──────────→  3. 保存图片到 public/images/
                     4. 保存元数据到 SQLite
                     5. 调用 GitHub API ──────────────→ 创建 commit
                        (repos.createOrUpdateFileContents)    (zips/slug-v.zip)
                     6. 立即返回下载链接 ←─────────────── tag 格式已知，
                        （不等 CI 完成）                      链接可预计算
                                                             CI 异步创建
                                                             Release
```

**下载链接预计算**：tag 命名规则为 `<slug>-v<version>`，push 后即可计算链接，无需等待 CI：

```
tag = `${slug}-v${version}`
artifact = `${slug}-${version}.zip`

GitHub 直链:  raw.githubusercontent.com/<owner>/<repo>/<tag>/zips/<artifact>
jsDelivr:     cdn.jsdelivr.net/gh/<owner>/<repo>@<tag>/zips/<artifact>
```

### 3.2 Git 提交推送（备用方式）

直接推送字体 JSON 和 ZIP 文件到 GitHub 仓库，CI 自动创建 Release。
此方式不经过国内服务器，下载数不会被统计。

### 3.3 CI 自动化流程
```
push 到 main → CI 校验 → auto-release.yml 创建 tag + Release
```

- auto-release.yml 通过 `workflow_run` 监听 CI 完成事件
- 用 `git diff` 检测变化的字体文件
- 用 `git ls-remote --tags` 避免重复创建

---

## 4. 字体信息结构

### 4.1 基础信息
| 字段 | 类型 | 说明 |
|------|------|------|
| slug | string | 唯一标识，用于 URL 和文件名 |
| name.zh | string | 中文名称 |
| name.en | string | 英文名称 |
| version | string | 版本号 |
| description | string | 简短介绍 |

#### Slug 命名规范

当前方案：全小写字母、数字和 `-` 的组合（如 `alibaba-puhuiti`）

**方案对比**：

| 方案 | 示例 | 优点 | 缺点 |
|------|------|------|------|
| **英文拼音** (推荐) | `alibaba-puhuiti` | URL 友好、SEO 好、跨平台兼容 | 需要手动转换 |
| 保留中文 | `阿里巴巴普惠体` | 直观易读 | URL 编码后很长，兼容性问题 |
| 拼音首字母 | `albhpt` | 简短 | 不可读，难以记忆 |
| UUID | `a1b2c3d4` | 唯一性保证 | 完全不可读 |

**推荐方案**：继续使用英文拼音 + 连字符

规则：
- 全小写字母、数字、`-`
- 以字母开头，以字母或数字结尾
- 连续 `-` 合并为一个
- 长度限制：3-64 字符
- 示例：`alibaba-puhuiti`、`lxgw-wenkai`、`harmonyos-sans`

### 4.2 分类信息
| 字段 | 类型 | 可选值 |
|------|------|--------|
| languages | string[] | 简体中文、繁体中文、英文、日文、韩文 |
| category | string | 黑体、宋体、楷体、书法体、手写体、艺术体、手绘体 |
| tags | string[] | 标题、正文、代码、古籍、可变字体、多语言、UI 等（可扩展） |

### 4.3 媒体与文件
| 字段 | 类型 | 说明 |
|------|------|------|
| cover | string | 封面图片路径（网站首页展示） |
| formats | string[] | 字体格式（ttf、otf、woff2 等） |
| weights | string[] | 字重列表 |
| fileSize | number | 文件大小（字节） |
| glyphCount | number | 字数 |

### 4.4 授权与来源
| 字段 | 类型 | 说明 |
|------|------|------|
| license | string | 授权协议标识（关联协议数据库） |
| vendor | string | 厂商/作者名称 |
| sourceUrl | string | 来源链接（公众号、官网等） |
| cloudDriveUrl | string | 网盘分享链接（可选） |

### 4.5 详细介绍
- 使用 Markdown 编辑器（md-editor-v3）编写
- 支持文字、图片、链接、列表等格式
- Markdown 内容存储在 SQLite 数据库 `fonts.content` 字段
- 前端从 `/api/fonts/:slug` 获取完整信息（含 Markdown）
- 备份源文件存储在 `fonts/{slug}.md`

**图片引用规则**：
- Markdown 中的图片必须存储在 `public/images/{slug}/` 目录
- 使用相对路径引用：`![说明](/images/{slug}/demo.png)`
- **禁止**引用 GitHub raw 链接（国内无法稳定访问）

### 4.6 统计信息
| 字段 | 类型 | 说明 |
|------|------|------|
| downloadCount | number | 下载数（可通过 GitHub API 获取或手动维护） |
| publishDate | string | 发布时间 |
| updateDate | string | 最后更新时间 |

---

## 5. 授权协议数据库

### 5.1 协议类型
| 类别 | 示例 |
|------|------|
| 开源协议 | OFL 1.1、Apache 2.0、GPL、MIT |
| 厂商协议 | MiSans、阿里巴巴普惠体、OPPO Sans、vivo Sans |
| 自定义协议 | 个人免费、个人免费/商用免费、个人商用均免费 |

### 5.2 协议结构
```typescript
interface License {
  id: string;           // 唯一标识
  name: string;         // 协议名称
  nameEn?: string;      // 英文名称
  nameZh?: string;      // 中文名称/翻译
  type: 'open-source' | 'vendor' | 'custom';
  url?: string;         // 协议全文链接
  summary: string;      // 协议摘要
  permissions: string[];  // 允许的行为
  limitations: string[];  // 限制条件
}
```

### 5.3 协议展示
- 英文协议显示英文原文 + 中文翻译
- 协议页面展示完整协议内容
- 字体详情页关联显示对应协议

### 5.4 协议管理
- 支持新增协议
- 协议数据独立存储，便于维护
- 协议变更不影响已关联字体

---

## 6. 字体新增方式

### 6.1 UI 方式（主要）
- 管理界面（`/admin`）提供表单
- 上传 ZIP → 服务器中转 push 到 GitHub（不保存在服务器）
- 上传封面图/预览图 → 保存到服务器 `public/images/`
- 填写字体信息 → 写入 SQLite
- 提交后立即返回下载链接（链接格式已知，不等 CI）

### 6.2 CLI 方式（备用）
```bash
# 交互式新增
pnpm run add-font

# 或直接指定 JSON
pnpm run add-font -- --file=path/to/font.json
```

功能：
- 自动校验字体信息
- 通过 GitHub API 上传 ZIP 到仓库
- 写入 SQLite 数据库

---

## 7. 封面图片

### 7.1 实现方式
- 封面图片生成在独立项目 `font2image` 中实现
- 本项目不集成字体渲染功能
- 封面图片作为静态资源存储在 `public/images/`

### 7.2 图片规格
- 封面图：用于网站首页展示
- 预览图：用于字体详情页展示文字效果
- 格式：WebP（优先）或 PNG
- 命名：`{slug}-cover.webp`、`{slug}-preview.webp`

---

## 8. 项目结构

```
free-font/
├── db/                   # 数据库相关
│   ├── free-font.db      # SQLite 数据库文件（不入库）
│   ├── schema.sql        # 数据库表结构
│   └── migrate.ts        # 数据迁移脚本（JSON → SQLite）
├── fonts/                # 字体 JSON 数据（备份/导入源）
│   ├── alibaba-puhuiti.json
│   └── ...
├── public/
│   └── images/           # 封面、预览图和 Markdown 引用的图片（服务器保存）
│       ├── {slug}-cover.webp
│       ├── {slug}-preview.webp
│       └── {slug}/       # 字体详情页图片
├── src/
│   ├── client/           # 用户前端（Vue 3）
│   │   ├── App.vue
│   │   ├── pages/
│   │   │   ├── Home.vue
│   │   │   ├── FontDetail.vue
│   │   │   ├── LicenseList.vue
│   │   │   └── About.vue
│   │   ├── components/
│   │   ├── stores/
│   │   ├── composables/
│   │   ├── router/
│   │   └── utils/
│   │
│   ├── admin/            # 管理前端（Vue 3）
│   │   ├── App.vue
│   │   ├── pages/
│   │   │   ├── Dashboard.vue
│   │   │   ├── FontCreate.vue
│   │   │   ├── FontEdit.vue
│   │   │   └── LicenseEdit.vue
│   │   ├── components/
│   │   ├── stores/
│   │   ├── composables/
│   │   └── router/
│   │
│   └── server/           # 后端（Node.js）
│       ├── index.ts      # 入口
│       ├── api/
│       │   ├── fonts.ts      # 公开字体接口
│       │   ├── licenses.ts   # 公开协议接口
│       │   └── admin/        # 管理接口（需认证）
│       │       ├── fonts.ts
│       │       ├── licenses.ts
│       │       └── upload.ts
│       ├── db/
│       │   ├── connection.ts
│       │   └── queries.ts
│       ├── github/
│       │   └── client.ts    # GitHub API 操作（上传 ZIP）
│       ├── auth/
│       │   └── middleware.ts # JWT 认证中间件
│       └── middleware/
│
├── scripts/
│   └── validate.ts     # 数据校验
├── .github/
│   └── workflows/
│       ├── ci.yml          # 数据校验
│       └── auto-release.yml # 自动创建 Release/Tag
└── dist/               # 构建输出（部署到国内服务器）
    ├── index.html       # 用户前端
    ├── admin/           # 管理前端
    └── ...              # 后端（Node.js 运行）
```

**说明**：
- 用户前端和管理前端共用一个 Vite 项目（多入口），共用组件和工具函数
- `zips/` 目录不在服务器上，ZIP 仅存在于 GitHub 仓库
- `fonts/*.json` 保留作为备份/导入源，运行时以 SQLite 为准

---

## 9. 搜索与筛选

### 9.1 搜索功能
- 支持按字体名称（中英文）搜索
- 支持按厂商/作者名称搜索
- 支持按标签搜索
- 实时搜索（输入即搜）或回车搜索

### 9.2 筛选功能
- 按字体类型筛选（简体中文、繁体中文、英文、日文、韩文）
- 按字体风格筛选（黑体、宋体、楷体、书法体、手写体、艺术体、手绘体）
- 按授权协议筛选
- 按标签筛选
- 支持多条件组合筛选

### 9.3 排序功能
- 按发布时间排序（最新/最早）
- 按下载数排序
- 按名称排序（A-Z / Z-A）

---

## 10. 待确认事项

- [x] 样式框架选择 → **Tailwind CSS**
- [x] 状态管理方案 → **Pinia**
- [x] Markdown 编辑器选择 → **md-editor-v3**
- [x] 是否需要搜索功能 → **需要**
- [x] 下载数统计方案 → **SQLite 数据库实时统计**
- [x] 数据存储方案 → **SQLite 数据库**
- [x] 部署方式 → **放弃 GitHub Pages，只部署国内云服务器**
- [x] ZIP 存储 → **GitHub 唯一存储，服务器不保存（仅中转）**
- [x] 图片存储 → **服务器保存（public/images/）**
- [x] 新增字体推送到 GitHub → **通过 GitHub API（createOrUpdateFileContents）**
- [x] 下载链接 → **预计算（tag 格式已知），不等 CI**
- [x] 前端架构 → **三模块：用户前端 + 管理前端 + 后端 API**
- [ ] UI 新增字体的权限控制方案（JWT 方案已定，细节待实现）
- [ ] 是否需要字体对比功能
- [ ] 是否需要收藏/推荐功能

---

## 11. 迁移计划

### 阶段一：数据库与后端（已完成基础）
- [x] 设计 SQLite 数据库 schema
- [x] 编写数据迁移脚本（JSON → SQLite）
- [x] 迁移现有 32 款字体和 11 个授权协议
- [ ] 实现后端 API（Express/Fastify）
- [ ] 实现公开接口（字体列表、详情、协议、下载统计）
- [ ] 实现管理接口（新增/编辑/删除字体、上传）
- [ ] 实现 GitHub API 集成（上传 ZIP、预计算下载链接）
- [ ] 实现 JWT 认证

### 阶段二：前端重构
- [ ] 初始化 Vite + Vue3 + TypeScript 项目（多入口）
- [ ] 实现用户前端：字体列表页、详情页、协议页、关于页
- [ ] 实现管理前端：Dashboard、字体新增/编辑、图片上传
- [ ] 实现搜索和筛选功能
- [ ] 实现下载统计显示
- [ ] 实现响应式布局

### 阶段三：部署与自动化
- [ ] 配置国内云服务器部署
- [ ] 完善 CI/CD 流程（校验 → auto-release）
- [ ] 移除旧的 EJS 静态站和 GitHub Pages 相关代码

### 阶段四：优化
- [ ] 性能优化（懒加载、图片优化、API 缓存）
- [ ] SEO 优化（SSR 或预渲染）
- [ ] 国际化支持
