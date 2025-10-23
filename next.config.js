const path = require('path');

/** @type {import('next').NextConfig} */

const nextConfig = {
  headers: async () => [
    {
      // 静态资源（图片、图标等）设置较短缓存时间
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        },
      ],
    },
    {
      source: '/icons/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        },
      ],
    },
    {
      // 其他资源保持原有缓存策略
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
  // 移除 Ant Design 相关的 transpilePackages
  // transpilePackages: ['@ant-design/icons', 'antd'],
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  serverExternalPackages: ['jsdom'],
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 移除 antd 相关的缓存组配置
            // antd: {
            //   name: 'antd',
            //   test: /[\\/]node_modules[\\/]antd[\\/]/,
            //   priority: 10,
            // },
          },
        },
      };
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        child_process: false
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'html-react-parser': path.resolve('./node_modules/html-react-parser')
    };
    return config;
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'websitelm-us-east-2.s3.us-west-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'websitelm.com'
      },
      {
        protocol: 'https',
        hostname: '*',
      }
    ],
    domains: ['websitelm-us-east-2.s3.us-west-2.amazonaws.com'],
  },
  // 添加域名配置
  async rewrites() {
    return {
      beforeFiles: [
        
      ]
    }
  }
};

module.exports = nextConfig;