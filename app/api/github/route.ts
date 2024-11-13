import { NextResponse } from 'next/server';

// 定义请求体的类型
interface UpdateFileRequest {
  action: 'updateFile';
  owner: string;
  repo: string;
  path: string;
  content: string; // 已经进行 Base64 编码
  sha: string;
}

export async function POST(request: Request) {
  try {
    const body: UpdateFileRequest = await request.json();

    if (body.action !== 'updateFile') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const { owner, repo, path, content, sha } = body;

    // GitHub API 的文件更新端点
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // 获取 GitHub 个人访问令牌
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'GitHub token is not configured.' }, { status: 500 });
    }

    // 构建请求体
    const commitMessage = `同步变更记录 - ${new Date().toLocaleString()}`;
    const payload = {
      message: commitMessage,
      content: content,
      sha: sha,
    };

    // 发送 PATCH 请求到 GitHub API
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'GitHub 同步失败' }, { status: response.status });
    }

    return NextResponse.json({ message: 'GitHub 同步成功', data });
  } catch (error: any) {
    console.error('GitHub API 错误:', error);
    return NextResponse.json({ error: '内部服务器错误' }, { status: 500 });
  }
} 