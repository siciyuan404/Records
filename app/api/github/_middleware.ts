import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 示例：添加身份验证逻辑
    const token = request.headers.get('Authorization');
    if (!token) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    return NextResponse.next();
} 