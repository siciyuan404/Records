import axios, { AxiosError, AxiosInstance } from 'axios';

// Constants
const DEFAULT_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'mxrain';
const DEFAULT_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'xyz';
const GITHUB_API_BASE_URL = 'https://api.github.com/repos';
const MAX_CONCURRENT_REQUESTS = 3; // GitHub API 并发限制

// Types
interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

interface GitHubRequestOptions {
  owner: string;
  repo: string;
  path: string;
}

interface GitHubFileOperation extends GitHubRequestOptions {
  content: string;
  sha?: string;
}

interface BatchUpdateResult {
  path: string;
  success: boolean;
  error?: string;
}

class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: any
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

// 用于控制并发的辅助类
class ConcurrencyManager {
  private queue: Array<() => void> = [];
  private runningTasks = 0;

  constructor(private maxConcurrent: number) {}

  async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.runningTasks >= this.maxConcurrent) {
      await new Promise<void>(resolve => {
        this.queue.push(resolve);
      });
    }

    this.runningTasks++;
    try {
      return await task();
    } finally {
      this.runningTasks--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next?.();
      }
    }
  }
}

class GitHubUtils {
  private readonly axiosInstance: AxiosInstance;
  private readonly token: string;
  private readonly concurrencyManager: ConcurrencyManager;

  constructor(token = process.env.GITHUB_TOKEN) {
    if (!token) {
      throw new GitHubApiError('GitHub token is required');
    }

    this.token = token;
    this.concurrencyManager = new ConcurrencyManager(MAX_CONCURRENT_REQUESTS);
    this.axiosInstance = axios.create({
      baseURL: GITHUB_API_BASE_URL,
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      timeout: 10000
    });

    this.axiosInstance.interceptors.response.use(
      response => response,
      this.handleApiError
    );
  }

  private handleApiError(error: AxiosError): never {
    if (error.response) {
      throw new GitHubApiError(
        `GitHub API Error: ${error.message}`,
        error.response.status,
        error.response.data
      );
    }
    if (error.request) {
      throw new GitHubApiError('No response received from GitHub API');
    }
    throw new GitHubApiError(`Request failed: ${error.message}`);
  }

  private buildUrl({ owner, repo, path }: GitHubRequestOptions): string {
    return `/${owner}/${repo}/contents/${path}`;
  }

  private async request<T>(
    method: 'GET' | 'PUT' | 'DELETE',
    options: GitHubRequestOptions,
    data?: any
  ): Promise<T> {
    return this.concurrencyManager.add(async () => {
      const url = this.buildUrl(options);
      return (await this.axiosInstance.request<T>({ method, url, data })).data;
    });
  }

  // 获取文件内容（包含 SHA）
  async getFileContent({
    owner = DEFAULT_OWNER,
    repo = DEFAULT_REPO,
    path
  }: GitHubRequestOptions): Promise<GitHubFile | null> {
    try {
      return await this.request<GitHubFile>('GET', { owner, repo, path });
    } catch (error) {
      if (error instanceof GitHubApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  // 批量获取文件内容
  async getMultipleFiles(
    files: GitHubRequestOptions[]
  ): Promise<Map<string, GitHubFile | null>> {
    const results = new Map<string, GitHubFile | null>();

    await Promise.all(
      files.map(async file => {
        try {
          const content = await this.getFileContent(file);
          results.set(file.path, content);
        } catch (error) {
          console.error(`Failed to get file ${file.path}:`, error);
          results.set(file.path, null);
        }
      })
    );

    return results;
  }

  // 批量更新文件
  async updateMultipleFiles(
    files: Array<GitHubFileOperation>
  ): Promise<BatchUpdateResult[]> {
    const results: BatchUpdateResult[] = [];
    const fileContents = await this.getMultipleFiles(files);

    for (const file of files) {
      const result: BatchUpdateResult = {
        path: file.path,
        success: false
      };

      try {
        const existingFile = fileContents.get(file.path);
        if (!existingFile) {
          // 如果文件不存在，创建新文件
          await this.createFile(file);
          result.success = true;
        } else {
          // 如果文件存在，更新文件
          await this.updateFile({
            ...file,
            sha: existingFile.sha
          });
          result.success = true;
        }
      } catch (error) {
        result.success = false;
        result.error = error instanceof Error ? error.message : 'Unknown error';
      }

      results.push(result);
    }

    return results;
  }

  // 创建单个文件
  async createFile({
    owner = DEFAULT_OWNER,
    repo = DEFAULT_REPO,
    path,
    content
  }: GitHubFileOperation): Promise<boolean> {
    await this.request('PUT', { owner, repo, path }, {
      message: `Create file: ${path}`,
      content: Buffer.from(content).toString('base64')
    });
    return true;
  }

  // 更新单个文件
  async updateFile({
    owner = DEFAULT_OWNER,
    repo = DEFAULT_REPO,
    path,
    content,
    sha
  }: GitHubFileOperation & { sha: string }): Promise<boolean> {
    if (!sha) {
      throw new GitHubApiError('SHA is required for updating files');
    }

    await this.request('PUT', { owner, repo, path }, {
      message: `Update file: ${path}`,
      content: Buffer.from(content).toString('base64'),
      sha
    });
    return true;
  }

  // 批量创建文件
  async createMultipleFiles(
    files: Array<GitHubFileOperation>
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    await Promise.all(
      files.map(async file => {
        try {
          const success = await this.createFile(file);
          results.set(file.path, success);
        } catch (error) {
          results.set(file.path, false);
          console.error(`Failed to create file ${file.path}:`, error);
        }
      })
    );

    return results;
  }

  // 获取文件 SHA
  async getFileSha({
    owner = DEFAULT_OWNER,
    repo = DEFAULT_REPO,
    path
  }: GitHubRequestOptions): Promise<string | null> {
    const file = await this.getFileContent({ owner, repo, path });
    return file?.sha ?? null;
  }

  // 删除文件
  async deleteFile({
    owner = DEFAULT_OWNER,
    repo = DEFAULT_REPO,
    path,
    sha
  }: GitHubRequestOptions & { sha: string }): Promise<boolean> {
    if (!sha) {
      throw new GitHubApiError('SHA is required for deleting files');
    }

    await this.request('DELETE', { owner, repo, path }, { sha });
    return true;
  }
}

export default new GitHubUtils();