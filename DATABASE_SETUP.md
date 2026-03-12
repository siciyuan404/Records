# PostgreSQL、Redis 和 MinIO 配置指南

本文档介绍如何在项目中使用 PostgreSQL、Redis 和 MinIO。

## 前置要求

- Docker Desktop（推荐）或已安装的 PostgreSQL、Redis 和 MinIO
- Node.js 和 npm

## 快速开始

### 1. 启动 Docker 服务

使用 Docker Compose 启动所有服务：

```bash
npm run docker:up
```

这将启动：
- PostgreSQL (端口 5432)
- Redis (端口 6379)
- MinIO (端口 9000 和 9001)

### 2. 配置环境变量

复制 `.env.template` 并重命名为 `.env`，然后配置以下变量：

```env
# PostgreSQL 配置
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/records
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=records
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis 配置
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO 配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_BUCKET=records
```

### 3. 初始化数据库

运行初始化脚本创建数据库表：

```bash
npm run db:init
```

这将创建以下表：
- `users` - 用户表
- `resources` - 资源表
- `categories` - 分类表
- `tags` - 标签表
- `download_records` - 下载记录表
- `file_storage` - 文件存储表

### 4. 运行使用示例（可选）

查看数据库使用示例：

```bash
npm run db:example
```

## 使用方法

### 在代码中使用数据库

```typescript
import { db, redis, minio } from '@/lib/db';

// PostgreSQL 查询
const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Redis 缓存
await redis.set('key', 'value', 3600); // 设置缓存，1小时过期
const cached = await redis.get('key');

// MinIO 文件上传
await minio.uploadFile('records', 'file.txt', './file.txt');
```

### API 路由示例

```typescript
// app/api/resources/route.ts
import { NextResponse } from 'next/server';
import { db, redis } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // 尝试从缓存获取
  const cacheKey = `resource:${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  // 从数据库获取
  const result = await db.query('SELECT * FROM resources WHERE id = $1', [id]);

  if (result.rows.length > 0) {
    // 缓存结果
    await redis.set(cacheKey, JSON.stringify(result.rows[0]), 3600);
    return NextResponse.json(result.rows[0]);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
```

## 服务访问地址

启动服务后，可以通过以下地址访问：

- **PostgreSQL**: `localhost:5432`
  - 用户名: `postgres`
  - 密码: `postgres`
  - 数据库: `records`

- **Redis**: `localhost:6379`

- **MinIO Console**: `http://localhost:9001`
  - 用户名: `minioadmin`
  - 密码: `minioadmin123`

- **MinIO API**: `http://localhost:9000`

## 停止服务

停止所有 Docker 服务：

```bash
npm run docker:down
```

## 常见问题

### Docker 连接失败

确保 Docker Desktop 正在运行，并且端口没有被占用。

### 数据库连接失败

检查 `.env` 文件中的配置是否正确，确保服务已启动。

### MinIO 上传失败

确保 bucket 已创建，或者让代码自动创建（`minio.ensureBucket()`）。

## 数据库表结构

### users
- `id` - 主键
- `username` - 用户名
- `email` - 邮箱
- `password_hash` - 密码哈希
- `created_at` - 创建时间
- `updated_at` - 更新时间

### resources
- `id` - 主键
- `uuid` - 唯一标识符
- `title` - 标题
- `description` - 描述
- `category_id` - 分类ID（外键）
- `tags` - 标签数组
- `download_links` - 下载链接（JSON）
- `images` - 图片（JSON）
- `metadata` - 元数据（JSON）
- `created_at` - 创建时间
- `updated_at` - 更新时间

### categories
- `id` - 主键
- `name` - 名称
- `slug` - URL 友好名称
- `description` - 描述
- `icon` - 图标
- `sort_order` - 排序
- `created_at` - 创建时间
- `updated_at` - 更新时间

### tags
- `id` - 主键
- `name` - 标签名
- `color` - 颜色
- `created_at` - 创建时间

### download_records
- `id` - 主键
- `resource_id` - 资源ID（外键）
- `user_id` - 用户ID（外键）
- `ip_address` - IP地址
- `user_agent` - 用户代理
- `downloaded_at` - 下载时间

### file_storage
- `id` - 主键
- `resource_id` - 资源ID（外键）
- `bucket_name` - MinIO bucket 名称
- `object_name` - 对象名称
- `original_name` - 原始文件名
- `file_size` - 文件大小
- `mime_type` - MIME 类型
- `uploaded_at` - 上传时间

## 更多信息

- PostgreSQL: https://www.postgresql.org/docs/
- Redis: https://redis.io/docs/
- MinIO: https://min.io/docs/