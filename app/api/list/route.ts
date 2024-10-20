import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';

const GITHUB_API_URL = `${config.GITHUB_API_URL}/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/db/list.json`;

export async function GET() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');

  try {
    const response = await axios.get(GITHUB_API_URL, {
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'User-Agent': 'Awesome-Octocat-App',
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        ref: 'main'
      }
    });

    if (response.status === 200) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const listData = JSON.parse(content);
      return NextResponse.json(listData, { headers });
    } else {
      throw new Error('GitHub API 请求失败');
    }
  } catch (error) {
    console.error('获取列表数据时出错:', error);
    return NextResponse.json(
      { error: '获取列表数据失败', path: GITHUB_API_URL },
      { status: 500 }
    );
  }
}
