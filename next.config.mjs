/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      // Map legacy domains to remotePatterns
      ...[
        'picsum.photos',
        'api.btstu.cn',
        '4040000.xyz',
        'challenges.cloudflare.com',
        'img.4040000.xyz',
        'cdn.cloudflare.steamstatic.com',
        'telegram.org',
        'images-ext-1.discordapp.net',
        'camo.githubusercontent.com',
        'yuzu-mirror.github.io',
        'calibre-ebook.com',
        'rufus.ie',
        'www.charlesproxy.com',
        'www.spacedesk.net',
        'opengraph.githubassets.com'
      ].map(domain => ({
        protocol: 'https',
        hostname: domain,
      }))
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  serverExternalPackages: ['sharp'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001', 'records-git-fix-hydration-errors-mxrain.vercel.app'],
    },
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
