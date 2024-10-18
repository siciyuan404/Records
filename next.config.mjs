/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', '*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      }
      // 可以添加更多的模式
    ],
  },
  // 如果需要，可以在这里添加其他配置
  eslint: {
    // 在生产构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
