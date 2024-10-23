import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';
import { cachedFetch } from '@/lib/cacheUtils';

const GITHUB_API_URL = `${config.GITHUB_API_URL}/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/db/tags.json`;

export async function GET() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');

  try {
    const tags = await cachedFetch('tags', async () => {
      const response = await axios.get(GITHUB_API_URL, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'Awesome-Octocat-App',
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          ref: 'main'
        }
      });

      if (response.status === 200) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return JSON.parse(content);
      } else {
        throw new Error('GitHub API 请求失败');
      }
    });

    return NextResponse.json(tags, { headers });
  } catch (error) {
    console.error('获取标签数据时出错:', error);
    return NextResponse.json(
      { error: '获取标签数据失败', path: GITHUB_API_URL },
      { status: 500 }
    );
  }
}
