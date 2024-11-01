import { NextResponse } from 'next/server';
import GitHubUtils from '@/lib/githubUtils';

export async function POST(request: Request) {
  try {
    const { action, owner, repo, path, content, sha, files } = await request.json();

    switch (action) {
      case 'getContent':
        const fileContent = await GitHubUtils.getFileContent({ owner, repo, path });
        return NextResponse.json({ success: true, data: fileContent });

      case 'getMultipleFiles':
        const multipleFiles = await GitHubUtils.getMultipleFiles(files);
        return NextResponse.json({ 
          success: true, 
          data: Object.fromEntries(multipleFiles) 
        });

      case 'updateMultipleFiles':
        const results = await GitHubUtils.updateMultipleFiles(files);
        return NextResponse.json({ success: true, data: results });

      case 'createFile':
        const created = await GitHubUtils.createFile({ owner, repo, path, content });
        return NextResponse.json({ success: created });

      case 'updateFile':
        const updated = await GitHubUtils.updateFile({ owner, repo, path, content, sha });
        return NextResponse.json({ success: updated });

      case 'deleteFile':
        const deleted = await GitHubUtils.deleteFile({ owner, repo, path, sha });
        return NextResponse.json({ success: deleted });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 