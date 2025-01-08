import { NextResponse } from 'next/server';

export function middleware(request) {
  // 获取当前URL
  const url = request.nextUrl.clone()
  
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};