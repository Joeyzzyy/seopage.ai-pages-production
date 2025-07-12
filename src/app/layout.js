import './globals.css'
import { headers } from 'next/headers';
import { getDomainFavicon } from '../lib/api/index';

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
  if (process.env.NODE_ENV === 'development') {
    return 'seopage.ai';
  }
  
  const headersList = headers();
  const host = headersList.get('host');
  return extractMainDomain(host) || 'altpage.ai';
}

async function getSiteConfig(domain) {
  try {
    const response = await getDomainFavicon(domain);
    return response;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return null;
  }
}

export default async function RootLayout({ children }) {
  const domain = getCurrentDomain();
  let faviconUrl = '/default-favicon.ico';
  
  try {
    const siteConfig = await getSiteConfig(domain);
    if (siteConfig?.code === 200 && siteConfig?.data?.favicon) {
      faviconUrl = siteConfig.data.favicon;
    }
  } catch (error) {
    console.error('Error in RootLayout:', error);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} style={{ overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
