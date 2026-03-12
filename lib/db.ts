import { Pool } from 'pg';
import { createClient } from 'redis';
import { Client } from 'minio';
import 'server-only';

declare global {
  var postgres: Pool | undefined;
  var redis: ReturnType<typeof createClient> | undefined;
  var minio: Client | undefined;
}

// PostgreSQL 连接配置
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set');
}

const pool = global.postgres || new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') global.postgres = pool;

export const db = {
  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  async getClient() {
    const client = await pool.connect();
    return client;
  },
  pool,
};

// Redis 连接配置
// Redis 连接配置
export async function getRedisClient() {
  const existingClient = global.redis;

  if (existingClient?.isOpen) {
    return existingClient;
  }

  // 如果连接已断开，清理全局引用
  if (existingClient) {
    try { await existingClient.disconnect(); } catch (e) { console.error('Error disconnecting stale redis client:', e); }
    global.redis = undefined;
  }

  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL environment variable is not set');
  }

  const client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis Client Connected'));

  await client.connect();

  if (process.env.NODE_ENV !== 'production') global.redis = client;

  return client;
}

export const redis = {
  async get(key: string) {
    const client = await getRedisClient();
    return await client.get(key);
  },
  async set(key: string, value: string, expiry?: number) {
    const client = await getRedisClient();
    if (expiry) {
      return await client.setEx(key, expiry, value);
    }
    return await client.set(key, value);
  },
  async del(key: string) {
    const client = await getRedisClient();
    return await client.del(key);
  },
  async exists(key: string) {
    const client = await getRedisClient();
    return await client.exists(key);
  },
  async disconnect() {
    if (global.redis) {
      await global.redis.disconnect();
      global.redis = undefined;
    }
  },
};

// MinIO 连接配置
if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  console.warn('MinIO environment variables are not fully configured');
}

const minioClient = global.minio || new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

if (process.env.NODE_ENV !== 'production') global.minio = minioClient;

export const minio = {
  client: minioClient,

  async ensureBucket(bucketName: string) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created`);
    }
    return exists;
  },

  async uploadFile(bucketName: string, objectName: string, filePath: string, metaData?: any) {
    try {
      await this.ensureBucket(bucketName);
      await minioClient.fPutObject(bucketName, objectName, filePath, metaData);
      console.log(`File uploaded successfully: ${objectName}`);
      return { success: true, objectName };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async downloadFile(bucketName: string, objectName: string, filePath: string) {
    try {
      await minioClient.fGetObject(bucketName, objectName, filePath);
      console.log(`File downloaded successfully: ${objectName}`);
      return { success: true, filePath };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  async deleteFile(bucketName: string, objectName: string) {
    try {
      await minioClient.removeObject(bucketName, objectName);
      console.log(`File deleted successfully: ${objectName}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async getFileUrl(bucketName: string, objectName: string, expiry: number = 3600) {
    try {
      const url = await minioClient.presignedGetObject(bucketName, objectName, expiry);
      return { success: true, url };
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  async listFiles(bucketName: string, prefix?: string) {
    try {
      const stream = minioClient.listObjects(bucketName, prefix, true);
      const files: any[] = [];

      for await (const obj of stream) {
        files.push(obj);
      }

      return { success: true, files };
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },
};

// 初始化函数
export async function initializeDatabases() {
  try {
    // 测试 PostgreSQL 连接
    const client = await db.getClient();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✓ PostgreSQL connected successfully');

    // 测试 Redis 连接
    await getRedisClient();
    await redis.set('test', 'ok');
    await redis.del('test');
    console.log('✓ Redis connected successfully');

    // 测试 MinIO 连接
    await minio.ensureBucket(process.env.MINIO_BUCKET || 'records');
    console.log('✓ MinIO connected successfully');

    console.log('All databases initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// 优雅关闭
export async function closeDatabaseConnections() {
  try {
    await pool.end();
    await redis.disconnect();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}