import './globals.css'
import { headers } from 'next/headers';

// 复用相同的域名处理函数
function extractMainDomain(host) {
  const domainWithoutPort = host?.split(':')[0] || '';
  const parts = domainWithoutPort.split('.');
  if (parts.length < 2) {
    return domainWithoutPort;
  }
  return parts.slice(-2).join('.');
}

function getCurrentDomain() {
  const headersList = headers();
  const host = headersList.get('host');
  return extractMainDomain(host) || 'websitelm.com';
}

async function getSiteConfig(domain) {
  try {
    // 使用与文章相同的API获取站点配置
    const response = await fetch(`https://api.${domain}/v1/site-config`);
    if (!response.ok) throw new Error('Failed to fetch site config');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return null;
  }
}

export default async function RootLayout({ children, keywords, robots }) {
  const domain = getCurrentDomain();
  let faviconUrl = '/default-favicon.ico';  // 默认favicon
  
  // try {
  //   const siteConfig = await getSiteConfig(domain);
  //   if (siteConfig?.data?.favicon) {
  //     faviconUrl = siteConfig.data.favicon;
  //   }
  // } catch (error) {
  //   console.error('Error in RootLayout:', error);
  // }

  return (
    <html lang="en">
      <head>
        <meta name="keywords" content={keywords} />
        <link 
          rel="icon" 
          href={faviconUrl} 
          type="image/x-icon"
        />
        <link 
          rel="shortcut icon" 
          href={faviconUrl} 
          type="image/x-icon"
        />
      </head>
      <body suppressHydrationWarning={true} style={{ overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
