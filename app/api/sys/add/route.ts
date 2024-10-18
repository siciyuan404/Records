import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/appConfig';

// GET请求也做一个
export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const uuid = url.searchParams.get('uuid');
    try {
        if (!uuid) {
            return NextResponse.json({ error: '缺少 UUID 参数' }, { status: 400 });
        }

        const DATA_URL = `${config.apiBaseUrl}/${uuid}.json`;

        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`获取数据失败: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('获取资源数据时出错:', error);
        return NextResponse.json({ error: '获取资源数据失败', path: `${config.apiBaseUrl}/${uuid}.json` }, { status: 500 });
    }
}




export async function POST(request: NextRequest) {
    const { uuid } = await request.json();
    try {

        if (!uuid) {
            return NextResponse.json({ error: '缺少 UUID 参数' }, { status: 400 });
        }

        const DATA_URL = `${config.apiBaseUrl}/${uuid}.json`;

        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`获取数据失败: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('获取资源数据时出错:', error);
        return NextResponse.json({ error: '获取资源数据失败', path: `${config.apiBaseUrl}/${uuid}.json` }, { status: 500 });
    }
}


