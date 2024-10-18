
export const config = {
  GITHUB_OWNER: 'mxrain',
  GITHUB_REPO: '404zyt',
  // 在这里添加你的配置项`https://raw.gitmirror.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/refs/heads/master/src/db/zyt`;
  // 如果process.env.NEXT_PUBLIC_GITHUB_OWNER和process.env.NEXT_PUBLIC_GITHUB_REPO为空，则使用默认值mxrain 
  apiBaseUrl: `https://raw.gitmirror.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'mxrain'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || '404zyt'}/refs/heads/master/src/db`,

  maxRetries: 3,
  timeout: 5000,
  // 添加更多配置项...
};
