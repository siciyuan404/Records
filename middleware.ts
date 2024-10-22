import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 现有的身份验证中间件
async function authMiddleware(req: NextRequest) {
    const { pathname } = req.nextUrl; //这一步是获取请求的路径
    // 如果是验证页面，我们需要特殊处理
    if (pathname.startsWith('/verify')) {
        const token = req.cookies.get('token')?.value;
        if (token) {
            // 如果有token，验证它
            try {
                const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
                    method: 'GET',
                    headers: {
                        'Cookie': `token=${token}`
                    }
                });
                if (verifyResponse.ok) {
                    // 如果token有效，重定向到/sys
                    return NextResponse.redirect(new URL('/sys', req.url));
                }
            } catch (error) {
                console.error('Token验证错误:', error);
            }
        }
        // 如果没有token或token无效，允许访问验证页面
        return NextResponse.next();
    }

    // 对于/sys路径，我们需要确保用户已认证
    if (pathname.startsWith('/sys')) {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/verify', req.url));
        }
        try {
            const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
                method: 'GET',
                headers: {
                    'Cookie': `token=${token}`
                }
            });
            if (!verifyResponse.ok) {
                return NextResponse.redirect(new URL('/verify', req.url));
            }
        } catch (error) {
            console.error('Token验证错误:', error);
            return NextResponse.redirect(new URL('/verify', req.url));
        }
    }

    // 对于其他路径，直接放行
    return NextResponse.next();
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
    try {
        // 先应用 CORS 中间件
        const corsResponse = corsMiddleware(req);
        
        // 如果 CORS 中间件返回了非 200 状态码，直接返回该响应
        if (corsResponse.status !== 200) {
            return corsResponse;
        }
        
        // 应用身份验证中间件
        const authResponse = await authMiddleware(req);
        
        // 合并 CORS 头部到身份验证响应
        Object.entries(corsResponse.headers.entries()).forEach(([key, value]) => {
            authResponse.headers.set(key, value);
        });
        
        return authResponse;
    } catch (error) {
        console.error('中间件执行错误:', error);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

// 检查config是否正确
export const config = {
    matcher: '/((?!_next/static|favicon.ico).*)',
};
