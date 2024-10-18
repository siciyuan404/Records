import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 现有的身份验证中间件
async function authMiddleware(req: NextRequest) {
    console.log('authMiddleware');
    const { pathname } = req.nextUrl;

    // 如果是验证页面，直接放行
    if (pathname.startsWith('/verify')) {
        return NextResponse.next();
    }

    if (!pathname.startsWith('/sys')) {
        return NextResponse.next();
    }
    // 获取token
    const token = req.cookies.get('token')?.value;

    if (!token) {
        // 如果没有token，重定向到验证页面
        return NextResponse.redirect(new URL('/verify', req.url));
    }

    try {
        // 发送请求到验证API
        const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (verifyResponse.ok) {
            // 如果验证成功，允许访问
            return NextResponse.next();
        } else {
            // 如果验证失败，重定向到验证页面
            return NextResponse.redirect(new URL('/verify', req.url));
        }
    } catch (error) {
        console.error('Token验证过程中出错:', error);
        // 如果出现错误，重定向到验证页面
        return NextResponse.redirect(new URL('/verify', req.url));
    }
}

// 新的CORS中间件
function corsMiddleware(req: NextRequest) {

    const response = NextResponse.next();

    // 只为API路由设置CORS头
    if (req.nextUrl.pathname.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}

// 组合中间件
export async function middleware(req: NextRequest) {
    // 先应用CORS中间件
    const corsResponse = corsMiddleware(req);

    // 如果CORS中间件返回了一个不同的响应（例如，预检请求的响应），直接返回它
    if (corsResponse.status !== 200) {
        return corsResponse;
    }

    // 然后应用身份验证中间件
    return await authMiddleware(req);
}

export const config = {
    matcher: '/((?!_next/static|favicon.ico).*)',
};