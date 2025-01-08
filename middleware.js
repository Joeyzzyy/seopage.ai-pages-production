import { NextResponse } from 'next/server';

export function middleware(request) {
  // 获取当前URL
  const url = request.nextUrl.clone()
  
  // 添加 sitemap.xml 的访问控制
  if (url.pathname === '/sitemap.xml') {
    // 当域名是 websitelm.com，只允许该域名访问 sitemap
    if (url.hostname === 'websitelm.com') {
      return NextResponse.next()
    }
    // 其他域名访问 sitemap.xml 时返回 404
    return new NextResponse(null, { status: 404 })
  }
  
  // 检查是否是 /home 路径
  if (url.pathname === '/home') {
    // 重定向到根路径
    return NextResponse.redirect(new URL('/', url.origin))
  }
  
  // 如果是根路径，内部重写到 /home
  if (url.pathname === '/') {
    url.pathname = '/home'
    return NextResponse.rewrite(url)
  }

  // 其他请求放行
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/:path*',
    '/sitemap.xml',  // 添加 sitemap.xml 到 matcher
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};