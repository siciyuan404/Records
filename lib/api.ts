import axios from 'axios';
import { ResourcesState, Resource } from '@/app/sys/add/types';
import { toast } from '@/hooks/use-toast';

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master`;

// 缓存数据类型
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// 同步结果类型
interface SyncResult {
  file: string;
  status: 'success' | 'error';
  message?: string;
}

// 添加一个简单的内存缓存
const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_DURATION = 60000; // 缓存时间，例如1分钟


// 如何使用 syncWithGithub 函数：

// 1. 添加新资源
// await syncWithGithub('add', '新资源的UUID', 新资源的数据对象);

// 2. 编辑现有资源
// await syncWithGithub('edit', '要编辑的资源UUID', 更新后的资源数据对象);

// 3. 删除资源
// await syncWithGithub('delete', '要删除的资源UUID');

// 4. 更新列表文件
// await syncWithGithub('updateList', null, 更新后的列表数据);

// 5. 同步整个资源状态
// await syncWithGithub('sync', null, null, 整个资源状态对象);

export const syncWithGithub = async (action: string, uuid?: string | null, data?: Resource | Record<string, unknown> | null, resources?: ResourcesState) => {
  if (!owner || !repo || !token) {
    console.error('GitHub配置缺失');
    return;
  }

  const syncResults: { file: string; status: 'success' | 'error'; message?: string }[] = [];

  try {
    switch (action) {
      case 'add':
      case 'edit':
        if (uuid && data) {
          await syncFile(`${uuid}.json`, data, `${action === 'add' ? '添加' : '更新'}资源 ${uuid}`, syncResults);
        }
        break;
      case 'delete':
        if (uuid) {
          await deleteFile(`${uuid}.json`, `删除资源 ${uuid}`, syncResults);
        }
        break;
      case 'updateList':
        if (data) {
          await syncFile('db/list.json', data, '更新list.json', syncResults);
        }
        break;
      case 'sync':
        if (resources) {
          await syncFile('db/resources.json', resources, 'resources.json', syncResults);
        }
        break;
      default:
        console.error('未知的同步操作:', action);
        break;
    }

    // 生成反馈消息
    const successFiles = syncResults.filter(r => r.status === 'success').map(r => r.file);
    const errorFiles = syncResults.filter(r => r.status === 'error').map(r => `${r.file} (${r.message})`);

    let feedbackMessage = '同步结果：\n';
    if (successFiles.length > 0) {
      feedbackMessage += `成功：${successFiles.join(', ')}\n`;
    }
    if (errorFiles.length > 0) {
      feedbackMessage += `失败：${errorFiles.join(', ')}\n`;
    }

    toast({
      title: errorFiles.length === 0 ? "同步成功" : "部分同步成功",
      description: feedbackMessage,
      variant: errorFiles.length === 0 ? "default" : "destructive",
    });

  } catch (error) {
    console.error('与GitHub同步时出错:', error);
    toast({
      title: "错误",
      description: "与GitHub同步失败。请重试。",
      variant: "destructive",
    });
    throw error;
  }
};

async function syncFile(path: string, content: Resource | Record<string, unknown> | ResourcesState, commitMessage: string, results: SyncResult[]) {
  try {
    await axios.put(`${baseUrl}/${path}`, {
      message: commitMessage,
      content: encodeUnicode(JSON.stringify(content, null, 2)),
      sha: await getFileSha(path),
    }, {
      headers: { Authorization: `token ${token}` },
    });
    results.push({ file: path, status: 'success' });
  } catch (error) {
    console.error(`同步 ${path} 时出错:`, error);
    results.push({ file: path, status: 'error', message: (error as Error).message });
  }
}

async function deleteFile(path: string, commitMessage: string, results: SyncResult[]) {
  try {
    await axios.delete(`${baseUrl}/${path}`, {
      data: {
        message: commitMessage,
        sha: await getFileSha(path),
      },
      headers: { Authorization: `token ${token}` },
    });
    results.push({ file: path, status: 'success' });
  } catch (error) {
    console.error(`删除 ${path} 时出错:`, error);
    results.push({ file: path, status: 'error', message: (error as Error).message });
  }
}

export const getFileSha = async (path: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${path}`, {
      headers: { Authorization: `token ${token}` },
    });
    return response.data.sha;
  } catch (error) {
    console.error('Error getting file SHA:', error);
    return null;
  }
};

function encodeUnicode(str: string) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
}

/**
 * @deprecated 请使用 RTK Query hooks (useGetCategoriesQuery) 替代
 * 此函数将在后续版本中删除
 * @see app/store/api/categoriesApi.ts
 */
export async function fetchCategories() {
  const cacheKey = 'categories';
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  cache[cacheKey] = { data, timestamp: now };
  return data;
}

/**
 * @deprecated 请使用 RTK Query hooks (useGetResourcesQuery) 替代
 * 此函数将在后续版本中删除
 * @see app/store/api/resourcesApi.ts
 */
export async function fetchResources() {
  const cacheKey = 'resources';
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const res = await fetch('/api/resources');
  if (!res.ok) {
    throw new Error('Failed to fetch resources');
  }
  const data = await res.json();
  cache[cacheKey] = { data, timestamp: now };
  return data;
}

/**
 * @deprecated 请使用 RTK Query hooks (useGetResourceByIdQuery) 替代
 * 此函数将在后续版本中删除
 * @see app/store/api/resourcesApi.ts
 */
export async function fetchResourceInfo(uuid: string) {
  const cacheKey = `resource_${uuid}`;
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(`/api/resources-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    });
    if (!res.ok) {
      throw new Error('获取资源信息失败');
    }
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error('获取资源信息时出错:', error);
    throw new Error('获取资源信息失败');
  }
};

/**
 * @deprecated 请使用 RTK Query hooks (useGetListItemsQuery) 替代
 * 此函数将在后续版本中删除
 * @see app/store/api/listApi.ts
 */
export async function fetchList() {
  const response = await fetch('/api/list', {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch list');
  }
  return response.json();
}
