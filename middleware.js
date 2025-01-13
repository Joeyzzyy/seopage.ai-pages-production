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

  // 处理语言路径
  const pathSegments = url.pathname.split('/').filter(Boolean)
  if (pathSegments.length >= 1) {
    const firstSegment = pathSegments[0]
    
    // 如果第一段是语言代码
    if (['zh', 'es', 'fr', 'de', 'ja', 'en'].includes(firstSegment)) {
      // 保持现有路径不变
      return NextResponse.next()
    } else {
      // 如果不是语言代码，添加默认语言前缀
      url.pathname = `/en${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/sitemap.xml',
    '/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};