import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';

const DATA_URL = `${config.apiBaseUrl}/uuid_resource_curd.json`;

export async function GET() {
  try {
    const { data } = await axios.get(DATA_URL, {
      timeout: 5000,
    });
    return NextResponse.json(data);
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
    return NextResponse.json(
      { error: '获取资源数据失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}
