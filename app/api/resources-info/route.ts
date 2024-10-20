import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';

async function fetchResourceData(uuid: string) {
  const DATA_URL = `${config.apiBaseUrl}/${uuid}.json`;
  try {
    const { data } = await axios.get(DATA_URL, { timeout: 5000 });
    return data;
  } catch (error: unknown) {
    console.error('获取资源数据时出错:', (error as Error).message);
    if (axios.isAxiosError(error)) {
      console.error('请求详情:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
    }
    throw error;
  }
}

// GET请求处理函数
export async function GET(request: NextRequest) {
    const uuid = request.nextUrl.searchParams.get('uuid');
    if (!uuid) {
        return NextResponse.json({ error: '缺少 UUID 参数' }, { status: 400 });
    }

    try {
        const data = await fetchResourceData(uuid);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '获取资源数据失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST请求处理函数
export async function POST(request: NextRequest) {
    const { uuid } = await request.json();
    if (!uuid) {
        return NextResponse.json({ error: '缺少 UUID 参数' }, { status: 400 });
    }

    try {
        const data = await fetchResourceData(uuid);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '获取资源数据失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}



