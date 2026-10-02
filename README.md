# freefont - 开源免费字体聚合站

收录与分享开源免费字体的全栈平台。管理端上传字体 ZIP 自动推送 GitHub，前端展示多 CDN 下载链接。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Element Plus + Tailwind CSS |
| 后端 | Node.js + Express 5 + TypeScript |
| 数据库 | SQLite（sql.js） |
| 构建 | Vite 6 |
| 包管理 | pnpm |

## 架构

```
GitHub 仓库 releases 分支               云服务器
┌─────────────────────┐               ┌──────────────────────────┐
│  slug/slug-ver.zip  │  CDN 加速下载  │  Express（端口 3001）     │
│  （普通字体 ZIP）    │ ────────────→ │  ├── /api/* REST API      │
│                     │               │  ├── 静态文件（Vue SPA）  │
│  超大文件走 Release  │               │  └── 图片（public/images）│
│  附件（如 source-han │               └──────────────────────────┘
│  -seri > 100MB）    │
└─────────────────────┘
```

- **GitHub releases 分支**：普通字体 ZIP 提交到 `releases` 分支，通过 jsDelivr / GitHack CDN 加速下载
- **GitHub Releases 附件**：超过 100MB 的超大字体（如 source-han-seri）走传统 Release 附件
- **云服务器**：运行 Node.js 全栈应用，SQLite 为唯一数据源
- **下载链接**：GitHub Raw、jsDelivr CDN、GitHack CDN、百度网盘（可选）

## 项目结构

```
freefont/
├── src/
│   ├── client/          # 用户前端（Vue 3 SPA）
│   ├── admin/           # 管理前端（Vue 3 SPA）
│   ├── server/          # Express 后端
│   │   ├── api/         # API 路由（公开 + 管理）
│   │   ├── auth/        # JWT 认证
│   │   ├── db/          # 数据库查询
│   │   ├── github/      # GitHub API 客户端
│   │   └── utils/       # 工具函数
│   └── shared/          # 前后端共享类型
├── db/                  # SQLite 数据库 + 迁移脚本
├── public/images/       # 上传图片存储
├── admin/               # 管理端 HTML 入口
├── dist/                # 构建产物（gitignore）
└── docs/                # 文档
```

## 快速开始

### 环境要求

- Node.js >= 22
- pnpm

### 安装

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env.development
```

编辑 `.env.development`，填写必要配置：

| 变量 | 说明 | 必填 |
|---|---|---|
| `PORT` | 服务端口，默认 3001 | 否 |
| `JWT_SECRET` | JWT 签名密钥 | 是 |
| `ADMIN_USERNAME` | 管理员用户名 | 是 |
| `ADMIN_PASSWORD` | 管理员密码 | 是 |
| `GITHUB_TOKEN` | GitHub Personal Access Token（需 repo 权限） | 上传功能需要 |
| `GITHUB_OWNER` | GitHub 仓库所有者 | 上传功能需要 |
| `GITHUB_REPO` | GitHub 仓库名 | 上传功能需要 |

### 初始化数据库

```bash
pnpm run db:migrate
```

### 启动开发服务器

```bash
pnpm run dev
```

- 前端开发服务器：`http://localhost:3000`
- API 服务器：`http://localhost:3001`
- 管理后台：`http://localhost:3000/admin`

### 构建生产版本

```bash
pnpm run build
pnpm start
```

## 环境配置说明

项目使用 Node.js 内置 `--env-file` 加载环境变量，无需 dotenv：

| 文件 | 用途 | 是否提交 |
|---|---|---|
| `.env.example` | 配置模板，带注释说明 | 是 |
| `.env.development` | 开发环境配置 | 是 |
| `.env.production` | 生产环境配置（含真实密钥） | 否 |
| `.env` | 本地覆盖（优先级最高） | 否 |

## 生产部署（宝塔面板）

### 1. 服务器准备

安装 Node.js 22+、Nginx、PM2。

### 2. 部署项目

```bash
cd /www/wwwroot
git clone <仓库地址> free-font
cd free-font
cp .env.example .env.production
# 编辑 .env.production 填写真实配置
nano .env.production
pnpm install --frozen-lockfile
pnpm run db:migrate:prod
pnpm run build
```

### 3. PM2 启动

```bash
pm2 start dist/server/index.js --name free-font --node-args="--env-file=.env.production"
pm2 save
pm2 startup
```

### 4. Nginx 反向代理

宝塔新建网站，添加反向代理指向 `http://127.0.0.1:3001`。

或在网站 Nginx 配置中添加：

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    client_max_body_size 100m;
}
```

### 5. 数据库备份

宝塔计划任务，每天执行：

```bash
#!/bin/bash
BACKUP_DIR=/www/backup/free-font
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sqlite3 /www/wwwroot/free-font/db/free-font.db ".backup '${BACKUP_DIR}/free-font-${DATE}.db'"
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
```

### 6. 更新部署

```bash
cd /www/wwwroot/free-font
git pull
pnpm install --frozen-lockfile
pnpm run db:migrate:prod
pnpm run build
pm2 restart free-font
```

## 主要功能

### 用户端

- 字体列表（分页、分类筛选、排序）
- 字体详情（预览图、介绍、多 CDN 下载链接）
- 下载次数统计
- 首页轮播图

### 管理端

- 字体管理（增删改查、ZIP 上传自动推送 GitHub）
- 许可证管理
- 轮播图管理
- 富文本编辑器（粘贴网页内容自动转 Markdown，图片自动上传到本地）
- JWT 认证（8 小时过期，前端自动检测）

## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发环境（前端 + 后端） |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm db:migrate` | 运行数据库迁移（开发环境） |
| `pnpm db:migrate:prod` | 运行数据库迁移（生产环境） |
| `pnpm db:reset` | 重置数据库（删除后重建） |
| `pnpm typecheck` | 类型检查 |

## 许可证

[CC0-1.0](LICENSE)
