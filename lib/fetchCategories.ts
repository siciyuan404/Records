import axios from 'axios';

export async function fetchCategories() {
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;


  if (!owner || !repo) {
    console.error('GitHub 所有者或仓库名未设置');
    throw new Error('环境变量缺失: NEXT_PUBLIC_GITHUB_OWNER 或 NEXT_PUBLIC_GITHUB_REPO');
  }

  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const rawUrl = `https://raw.gitmirror.com/${owner}/${repo}/master`;

  
  try {
    const response = await axios.get(`${rawUrl}/src/db/db.json`);
    return response.data;
  } catch (error) {
    console.error('获取数据时出错:', error);
    throw error;
  }
}