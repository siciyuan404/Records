import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';
const DATA_URL = `${config.apiBaseUrl}/uuid_resource_curd.json`;

export async function GET() {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取资源数据时出错:', error);
    return NextResponse.json({ error: '获取资源数据失败', path: DATA_URL }, { status: 500 });
  }
}