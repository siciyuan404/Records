import { NextResponse } from 'next/server';
import * as LucideIcons from 'lucide-react';

export async function GET() {
  try {

    // 获取所有导出的图标名称
    const iconNames = Object.keys(LucideIcons).filter(
      (name) => typeof (LucideIcons as Record<string, unknown>)[name] === 'function'
    );

    if (iconNames.length === 0) {
      return NextResponse.json(
        { error: "未找到任何图标" },
        { status: 404 }
      );
    }

    return NextResponse.json(iconNames);
  } catch (error) {
    console.error('获取图标列表时出错:', error);
    // 处理可能的错误
    return NextResponse.json(
      { error: "未找到任何图标" },
      { status: 500 }
    );
  }
}
