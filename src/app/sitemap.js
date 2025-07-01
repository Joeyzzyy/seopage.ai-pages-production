import { headers } from 'next/headers';

export default async function sitemap() {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  // 根据当前域名获取页面数据
  const domain = extractMainDomain(host);
  const pages = await getPagesByDomain(domain);
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...pages.map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
  ];
} 