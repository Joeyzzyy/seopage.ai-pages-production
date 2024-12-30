import { NextResponse } from 'next/server';

/**
 * 域名配置映射表
 * defaultLang: 默认语言
 * supportedLangs: 支持的语言列表
 * pathMapping: URL路径映射关系
 */
const customDomains = {
  'websitelm.com': {
    defaultLang: 'en',
    supportedLangs: ['en', 'zh'],
    pathMapping: {
      '/': 'home',
      '/features': 'features',
      // 可以添加更多路径映射
    }
  },
  'localhost:3000': {
    defaultLang: 'en',
    supportedLangs: ['en', 'zh'],
    pathMapping: {
      '/': 'home',
      '/features': 'features',
    }
  },
  'localhost:3001': {
    defaultLang: 'en',
    supportedLangs: ['en', 'zh'],
    pathMapping: {
      '/': 'home',
      '/features': 'features',
    }
  }
};

export function middleware(request) {
  console.log('Middleware is triggered!');

  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host');
  
  console.log('Debug - Request:', {
    pathname,
    hostname,
    url: request.nextUrl.toString()
  });

  const customDomain = customDomains[hostname];
  
  if (customDomain || hostname === 'localhost:3000' || hostname === 'localhost:3001') {
    const domainConfig = customDomain || customDomains[hostname];
    const url = request.nextUrl.clone();
    
    // 提取获取语言的逻辑为一个函数
    const getLang = () => {
      const lang = request.cookies.get('NEXT_LOCALE')?.value || 
                  request.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || 
                  domainConfig.defaultLang;
      return domainConfig.supportedLangs.includes(lang) ? lang : domainConfig.defaultLang;
    };

    // 创建响应并设置cookie的函数
    const createResponse = (url, lang) => {
      const response = NextResponse.rewrite(url);
      if (!request.cookies.get('NEXT_LOCALE')) {
        response.cookies.set('NEXT_LOCALE', lang, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30天
        });
      }
      return response;
    };

    const pathParts = pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    
    // 检查是否是根路径访问
    if (pathname === '/') {
      const finalLang = getLang();
      const mappedSlug = domainConfig.pathMapping['/'];  // 获取 'home'
      
      // 构建新的URL对象用于重写
      const rewriteUrl = new URL(request.url);
      rewriteUrl.pathname = `/${finalLang}/${mappedSlug}`;
      
      console.log('根路径重写:', {
        originalUrl: request.url,
        newPath: rewriteUrl.pathname,
        finalLang,
        mappedSlug
      });
      
      // 使用rewrite而不是redirect，确保URL保持为/但内容来自/en/home
      return NextResponse.rewrite(rewriteUrl);
    }

    // 检查第一个路径段是否是支持的语言代码
    const isLangPath = domainConfig.supportedLangs.includes(firstPart);
    
    if (isLangPath) {
      // URL已经符合 /{lang}/{slug} 格式，无需重写
      return NextResponse.next();
    } else {
      // 处理不带语言代码的路径 (如 /about, /features)
      const finalLang = getLang();
      
      // 获取映射后的路径（如果在映射表中存在）或使用原始路径
      const mappedSlug = domainConfig.pathMapping[pathname] || pathname.substring(1);
      
      // 构建内部路由路径
      const internalUrl = request.nextUrl.clone();
      internalUrl.pathname = `/${finalLang}/${mappedSlug}`;
      
      return createResponse(internalUrl, finalLang);
    }
  }

  // 如果不是自定义域名或本地开发环境，直接放行
  return NextResponse.next();
}

/**
 * 配置 middleware 匹配的路径
 * 包含所有路径，但排除特定的系统路径
 */
export const config = {
  matcher: [
    '/',
    '/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};