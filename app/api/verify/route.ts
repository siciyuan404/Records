import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function generateToken() {
  const payload = { timestamp: Date.now() };
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

function verifyToken(token: string) {
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function GET(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = cookies().get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Token不存在' }, { status: 401 });
  } 
  return verifyToken(token)
    ? NextResponse.json({ valid: true }, { status: 200 })
    : NextResponse.json({ error: 'Token无效' }, { status: 401 });
}

export async function POST(request: Request) {
  const { password, token } = await request.json();

  if (token) {
    if (verifyToken(token)) {
      const newToken = generateToken();
      return NextResponse.json({ success: true, token: newToken }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Token无效' }, { status: 401 });
    }
  }

  if (password !== process.env.VERIFY_PASSWORD) {
    return NextResponse.json({ error: '密码错误' }, { status: 400 });
  }
  
  const githubApi = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  if (!githubApi || !owner || !repo) {
    return NextResponse.json({ error: '缺少必要的环境变量' }, { status: 400 });
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Authorization: `token ${githubApi}` },
  });

  if (response.ok) {
    const token = generateToken();
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
    });
    return NextResponse.json({ success: true, token }, { status: 200 });
  } else {
    return NextResponse.json({ error: '验证失败' }, { status: 400 });
  }
}