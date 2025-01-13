import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone()
  
  // 处理 sitemap.xml
  if (url.pathname === '/sitemap.xml') {
    return NextResponse.next()
  }
  
  // 处理首页重定向
  if (url.pathname === '/home') {
    return NextResponse.redirect(new URL('/', url.origin))
  }
  
  if (url.pathname === '/') {
    url.pathname = '/home'
    return NextResponse.rewrite(url)
  }

  // 修改语言路径处理逻辑
  // 移除末尾的斜杠，但保留根路径的斜杠
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }

  const pathSegments = url.pathname.split('/').filter(Boolean)
  if (pathSegments.length >= 1) {
    const firstSegment = pathSegments[0]
    
    // 如果第一段是语言代码，直接通过
    if (['zh', 'es', 'fr', 'de', 'ja'].includes(firstSegment)) {
      return NextResponse.next()
    }
    
    // 如果是 'en'，移除语言前缀
    if (firstSegment === 'en') {
      const newPathname = '/' + pathSegments.slice(1).join('/')
      url.pathname = newPathname
      return NextResponse.rewrite(url)
    }
    
    // 如果不是语言代码，添加默认语言前缀 'en'
    url.pathname = `/en${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/sitemap.xml',
    '/:path*',
    '/:path*/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};