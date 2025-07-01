import { headers } from 'next/headers';
import { getPagesByDomain } from '../../lib/api/index'; // 假设有这个API

function extractMainDomain(host) {
  const domainWithoutPort = host?.split(':')[0] || '';
  const parts = domainWithoutPort.split('.');
  if (parts.length < 2) {
    return domainWithoutPort;
  }
  return parts.slice(-2).join('.');
}

function getCurrentDomain() {
  if (process.env.NODE_ENV === 'development') {
    return 'altpage.ai';
  }
  
  const headersList = headers();
  const host = headersList.get('host');
  return extractMainDomain(host) || 'altpage.ai';
}

export async function GET() {
  const domain = getCurrentDomain();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${headers().get('host')}`;
  
  // 获取该域名下的所有页面
  const pages = await getPagesByDomain(domain);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 