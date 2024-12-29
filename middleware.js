import { NextResponse } from 'next/server';

async function getDomainConfig(hostname) {
  try {
    const config = await fetch(`/api/internal/domain-config?hostname=${hostname}`)
    return config.json()
  } catch (error) {
    console.error('Failed to fetch domain config:', error)
    return null
  }
}

export async function middleware(request) {
  const hostname = request.headers.get('host') || ''
  
  // 获取域名配置
  const domainConfig = await getDomainConfig(hostname)
  
  if (!domainConfig) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  const { pathname } = request.nextUrl
  const [_, lang, ...rest] = pathname.split('/')
  
  // 重写URL，使用客户ID和内容类型
  const url = new URL(`/${domainConfig.clientId}/${domainConfig.contentType}/${lang}/${rest.join('/')}`, request.url)
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}