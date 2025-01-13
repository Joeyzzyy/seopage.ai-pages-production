/** @type {import('next').NextConfig} */

const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
  transpilePackages: ['@ant-design/icons', 'antd'],
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    domains: [
      'strapi.sheet2email.com',
      'websitelm.com'  // 添加新的域名
    ],
  },
  async rewrites() {
    const VALID_LANGS = ['zh', 'es', 'fr', 'de', 'ja', 'en']
    
    return [
      {
        // 处理根路径
        source: '/',
        destination: '/en/home',
      },
      // 为每个有效语言添加一个规则
      ...VALID_LANGS.map(lang => ({
        source: `/${lang}/:path*`,
        destination: `/${lang}/:path*`,
      })),
      {
        // 处理所有其他路径
        source: '/:path*',
        destination: '/en/:path*',
      }
    ]
  },
};

module.exports = nextConfig;