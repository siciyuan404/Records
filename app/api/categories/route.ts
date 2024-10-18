import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';

const DATA_URL = `${config.apiBaseUrl}/db.json`;

export async function GET() {
  // 禁用缓存
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  try {
    const { data } = await axios.get(DATA_URL);
    const categories = data || {};

    return NextResponse.json(categories, { headers });
  } catch (error) {
    console.error('获取分类数据时出错:', error);
    return NextResponse.json(
      { error: '获取分类数据失败', path: DATA_URL },
      { status: 500 }
    );
  }
}
