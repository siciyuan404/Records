import axios, { AxiosResponse } from 'axios';


const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'mxrain';
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'xyz';
const token = process.env.GITHUB_TOKEN || '';

const GITHUB_API_URL = `https://api.github.com/repos/${owner}/${repo}/contents`;


interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

interface GitHubResponse {
  content: string;
  encoding: string;
}

class GitHubUtils {
  private token: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      throw new Error('GitHub token not found in environment variables');
    }
  }

  private async request(method: 'GET' | 'PUT' | 'DELETE', url: string, data?: any): Promise<AxiosResponse> {
    return axios({
      method,
      url,
      headers: {
        Authorization: `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      data
    });
  }

  // 获取文件内容
  async getFileContent(owner: string, repo: string, path: string): Promise<GitHubFile | null> {
    try {
      const response = await this.request('GET', `https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
      return response.data as GitHubFile;
    } catch (error) {
      console.error('获取文件内容失败', error);
      return null;
    }
  }

  // 创建文件
  async createFile(owner: string, repo: string, path: string, content: string): Promise<boolean> {
    try {
      await this.request('PUT', `https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        message: 'Create file',
        content: Buffer.from(content).toString('base64')
      });
      return true;
    } catch (error) {
      console.error('创建文件失败', error);
      return false;
    }
  }

  //获取sha
  async getFileSha(owner: string, repo: string, path: string): Promise<string | null> {
    const file = await this.getFileContent(owner, repo, path);
    return file?.sha || null;
  }
  


  // 更新文件
  async updateFile(owner: string, repo: string, path: string, content: string, sha: string): Promise<boolean> {
    try {
      await this.request('PUT', `https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        message: 'Update file',
        content: Buffer.from(content).toString('base64'),
        sha
      });
      return true;
    } catch (error) {
      console.error('更新文件失败', error);
      return false;
    }
  }

  // 删除文件
  async deleteFile(owner: string, repo: string, path: string, sha: string): Promise<boolean> {
    try {
      await this.request('DELETE', `https://api.github.com/repos/${owner}/${repo}/contents/${path}?sha=${sha}`);
      return true;
    } catch (error) {
      console.error('删除文件失败', error);
      return false;
    }
  }

  // 批量操作文件 (仅演示创建文件，其他操作类似)
  async createMultipleFiles(owner: string, repo: string, files: { path: string; content: string }[]): Promise<boolean[]> {
    const results: boolean[] = [];
    for (const file of files) {
      const success = await this.createFile(owner, repo, file.path, file.content);
      results.push(success);
    }
    return results;
  }
}
