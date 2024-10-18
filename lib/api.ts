import axios from 'axios';
import { ResourcesState, Resource } from '../app/sys/add/types';
import { toast } from '@/hooks/use-toast';

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master`;



export const fetchData = async () => {
  try {
    const [resourcesRes, categoriesRes, tagsRes, listRes] = await Promise.all([
      axios.get<ResourcesState>(`${rawUrl}/src/db/uuid_resource_curd.json`),
      axios.get(`${rawUrl}/src/db/db.json`),
      axios.get(`${rawUrl}/src/db/tabs.json`),
      axios.get(`${rawUrl}/src/db/list.json`)
    ]);
    return {
      resources: resourcesRes.data,
      categories: categoriesRes.data,
      tags: tagsRes.data,
      listData: listRes.data,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch data. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const syncWithGithub = async (action: string, uuid?: string | null, data?: any, resources?: ResourcesState) => {
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
          await syncFile(`src/db/zyt/${uuid}.json`, data, `${action === 'add' ? '添加' : '更新'}资源 ${uuid}`, syncResults);
        }
        break;
      case 'delete':
        if (uuid) {
          await deleteFile(`src/db/zyt/${uuid}.json`, `删除资源 ${uuid}`, syncResults);
        }
        break;
      case 'updateList':
        if (data) {
          await syncFile('src/db/list.json', data, '更新list.json', syncResults);
        }
        break;
      case 'sync':
        if (resources) {
          await syncFile('src/db/uuid_resource_curd.json', resources, '同步uuid_resource_curd.json', syncResults);
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

async function syncFile(path: string, content: any, commitMessage: string, results: any[]) {
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

async function deleteFile(path: string, commitMessage: string, results: any[]) {
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

export async function fetchCategories() {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export async function fetchResources() {
  const res = await fetch('/api/resources');
  if (!res.ok) {
    throw new Error('Failed to fetch resources');
  }
  return res.json();
};

// uuid.json

export async function fetchResourceInfo(uuid: string) {
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
    return res.json();
  } catch (error) {
    console.error('获取资源信息时出错:', error);
    throw new Error('获取资源信息失败');
  }
};

// list.json

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
