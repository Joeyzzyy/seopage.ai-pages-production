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
  // 移除端口号（如果有）
  const domainWithoutPort = host?.split(':')[0] || '';
  // 将域名按点分割
  const parts = domainWithoutPort.split('.');
  // 如果域名部分少于2个，直接返回原始域名
  if (parts.length < 2) {
    return domainWithoutPort;
  }
  // 如果是三级及以上域名，返回主域名（最后两部分）
  // 例如：blog.zhuyuejoey.com -> zhuyuejoey.com
  return parts.slice(-2).join('.');
}
// 添加一个新的辅助函数来获取当前域名
function getCurrentDomain() {
  const headersList = headers();
  const host = headersList.get('host');
  if (process.env.NODE_ENV === 'development') {
    return 'altpage.ai';
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
      : (process.env.NEXT_PUBLIC_HOST || `https://${currentDomain}`); // 生产环境
    
    const metadataBaseUrl = host ? new URL(host) : null;
    const canonicalUrl = getCanonicalUrl(host, currentLang, fullSlug);

    return {
      title: article.title, 
      description: article.description,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords) ,
      robots: article.deploymentStatus === 'publish' ? 'index, follow' : 'noindex, nofollow',
      openGraph: { 
        title: article.title,
        description: article.description,
        type: 'article',
        publishedTime: article.updatedAt,
        modifiedTime: article.updatedAt,  
        locale: lang,
        siteName: '',
        images: [{
          url: '',
          width: 1200,
          height: 630,
          alt: article.title
        }],
        article: {
          authors: [article.author],
          tags: article.pageStats?.genKeywords,
          section: article.category
        }
      },
      twitter: { 
        card: 'summary_large_image',
        title: article.title,
        description: article.description,
        images: article.coverImage,
        creator: ''
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': `${host}/${fullSlug}`,          // 英文版本不带语言标识符
          'zh': `${host}/zh/${fullSlug}`,       // 其他语言带语言标识符
        },
        hreflang: [
          {
            href: `${host}/${fullSlug}`,
            hrefLang: 'en'
          },
          {
            href: `${host}/zh/${fullSlug}`,
            hrefLang: 'zh'
          },
          {
            href: `${host}/${fullSlug}`,        // x-default 指向英文版本
            hrefLang: 'x-default'
          }
        ]
      },
      metadataBase: metadataBaseUrl,
      authors: [{ name: article.author }],
      category: article.category,
      other: {
        'article:published_time': article.createdAt,
        'article:modified_time': article.updatedAt,
        'article:section': article.category,
        'article:tag': joinArrayWithComma(article.pageStats?.genKeywords)
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.'
    };
  }
}