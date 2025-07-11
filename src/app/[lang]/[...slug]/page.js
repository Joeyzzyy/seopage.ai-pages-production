import { getPageBySlug } from '../../../lib/api/index';
import { notFound } from 'next/navigation';
import { ClientWrapper } from '../../../components/layouts/client-wrapper';
import { headers } from 'next/headers';
import CommonLayout from '../../../components/layouts/layout';
import Script from 'next/script'

// 1. 确保动态渲染
export const dynamic = 'force-dynamic'
// 2. 启用动态路由参数
export const dynamicParams = true
// 3. 完全禁用缓存
export const fetchCache = 'force-no-store'
// 4. 设置零秒缓存
export const revalidate = 0
// 添加支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'zh'];
// 添加一个新的辅助函数来处理域名
function extractMainDomain(host) {
  // 新增处理带www的情况
  const domainWithoutPort = host?.split(':')[0] || '';
  return domainWithoutPort
    .replace(/^www\./, '') // 移除www前缀
    .split('.')
    .slice(-2)
    .join('.');
}
// 添加一个新的辅助函数来获取当前域名
function getCurrentDomain() {
  const headersList = headers();
  // 优先使用X-Forwarded-Host头（Vercel会设置这个头）
  const host = headersList.get('x-forwarded-host') || headersList.get('host');
  
  // 开发环境直接返回固定域名
  if (process.env.NODE_ENV === 'development') {
    return 'seopage.ai';
  }
  
  // 生产环境处理逻辑增加Vercel判断
  if (host?.includes('vercel.app')) {
    // 如果使用自定义域名部署，Vercel会保留原始域名在x-vercel-ip-country头中
    const vercelCustomDomain = headersList.get('x-vercel-ip-country');
    return vercelCustomDomain || extractMainDomain(host);
  }
  
  return extractMainDomain(host);
}

// 主页面组件
export default async function ArticlePage({ params }) {
  try {
    const domain = getCurrentDomain();
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const currentLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
    const fullSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
    console.log('current domain', domain)
    const articleData = await getPageBySlug(fullSlug, currentLang, domain);

    console.log('current articleData', articleData)

    if (
      !articleData?.data &&
      articleData.data.deploymentStatus !== 'publish'
    ) {
      console.error(`Article not found or not published for slug: ${slug}`);
      return notFound();
    }
    
    const article = articleData.data;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.updatedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'WebsiteLM',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
      },
      image: article.coverImage,
      articleBody: article.content,
      keywords: article.pageStats?.genKeywords,
      articleSection: article.category,
      timeRequired: `PT${article.readingTime}M`
    };

    return (
      <>
        <Script id="article-schema" type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </Script>
          <main className="flex-grow" lang={currentLang}>
            <CommonLayout article={article} />
          </main>
      </>
    );
  } catch (error) {
    console.error('Error in ArticlePage:', error);
    throw error;
  }
}

// 添加一个新的辅助函数来处理数组并返回逗号分隔的字符串
function joinArrayWithComma(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(',') : '';
}

// 添加一个新的辅助函数来获取规范链接
function getCanonicalUrl(host, lang, fullSlug) {
  // 确保 host 没有尾部斜杠
  const baseUrl = host.replace(/\/$/, '');
  
  // 规范化 slug（移除首尾斜杠）
  const normalizedSlug = fullSlug.replace(/^\/+|\/+$/g, '');
  
  // 对于英文页面，使用不带语言标识符的URL作为规范链接
  if (lang === 'en') {
    return `${baseUrl}/${normalizedSlug}`;
  }
  
  // 其他语言使用带语言标识符的URL
  return `${baseUrl}/${lang}/${normalizedSlug}`;
}

export async function generateMetadata({ params }) {
  try {
    const domain = getCurrentDomain();
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const currentLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
    const fullSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
    const articleData = await getPageBySlug(fullSlug, currentLang, domain);
    if (
      !articleData?.data ||
      articleData.data.deploymentStatus !== 'publish'
    ) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
        robots: 'noindex, nofollow' 
      };
    }
    const article = articleData.data;
    // 获取当前环境的域名
    const currentDomain = getCurrentDomain();
    // 根据环境确定合适的 host
    const host = process.env.NODE_ENV === 'development' 
      ? `http://localhost:3001`  // 开发环境使用 localhost
      : (process.env.NEXT_PUBLIC_HOST || `