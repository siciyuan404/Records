import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultAuthConfig as authConfig } from '@/lib/auth/config'
import { verifyToken as jwtVerifyToken } from '@/lib/auth/jwt'

// 添加一个简单的内存缓存
const tokenCache = new Map<string, number>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

async function verifyTokenWithCache(token: string | undefined, origin: string): Promise<boolean> {
  if (!token) return false

  const now = Date.now()
  if (tokenCache.has(token)) {
    const cacheTime = tokenCache.get(token)!
    if (now - cacheTime < CACHE_DURATION) {
      return true // 使用缓存的结果
    }
  }

  const isValid = await jwtVerifyToken(token, origin, authConfig)
  if (isValid) {
    tokenCache.set(token!, now) // 缓存验证结果
  }
  return isValid
}

// 身份验证中间件
async function authMiddleware(req: NextRequest) {
  // 全局开关检查
  if (!authConfig.enabled) return NextResponse.next()

  const { pathname } = req.nextUrl
  
  // 公开路径检查
  if (authConfig.paths.public.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 受保护路径检查
  const isProtected = authConfig.paths.protected.some(p => pathname.startsWith(p))
  if (isProtected) {
    const token = req.cookies.get(authConfig.tokens.access.cookieName)?.value
    
    if (!(await verifyTokenWithCache(token, req.nextUrl.origin))) {
      const redirectUrl = new URL(authConfig.paths.redirectTo, req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

// CORS中间件
function corsMiddleware(req: NextRequest) {
  const response = NextResponse.next()

  // 只为API路由设置CORS头
  if (req.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

// 组合中间件
export async function middleware(req: NextRequest) {
  try {
    // 先应用 CORS 中间件
    const corsResponse = corsMiddleware(req)
    
    // 如果 CORS 中间件返回了非 200 状态码，直接返回该响应
    if (corsResponse.status !== 200) {
      return corsResponse
    }
    
    // 应用身份验证中间件
    const authResponse = await authMiddleware(req)
    
    // 合并 CORS 头部到身份验证响应
    Object.entries(corsResponse.headers.entries()).forEach(([key, value]) => {
      authResponse.headers.set(key, value)
    })
    
    return authResponse
  } catch (error) {
    console.error('中间件执行错误:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

// 配置中间件匹配规则
export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)',
}
