import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO,
  });
}