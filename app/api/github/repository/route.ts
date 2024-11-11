import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // TODO: 实现获取仓库信息的逻辑
    return NextResponse.json({ message: '仓库信息获取成功' });
}

export async function POST(request: NextRequest) {
    // TODO: 实现创建仓库的逻辑
    return NextResponse.json({ message: '仓库创建成功' });
} 