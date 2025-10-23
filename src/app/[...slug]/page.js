import { getPageBySlug } from '../../lib/api/index'; 
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // 
import CommonLayout from '../../components/layouts/layout'; 
import BlogLayout from '../../components/BlogRenderer';
import Script from 'next/script';

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const fetchCache = 'force-no-store'
export const revalidate = 0
const SUPPORTED_LANGUAGES = ['en', 'zh'];

function getCurrentDomain() {
  const headersList = headers();
  const proxyHeaders = [
    'x-original-host',
    'x-forwarded-host',
    'x-vercel-deployment-url'
  ];
  const originalHost = proxyHeaders.reduce((acc, header) => 
    acc || headersList.get(header), 
  null);
  const host = originalHost || headersList.get('host');
  if (process.env.NODE_ENV === 'development') {
    return 'seopage.ai';
  }
  return extractMainDomainWithProxy(host);
}

function extractMainDomainWithProxy(host) {
  if (!host) return 'seopage.ai'; // 默认值
  const cleanHost = host
    .replace(/https?:\/\//, '')
    .replace(/\/.*/, '')
    .split(':')[0];

  const parts = cleanHost.split('.');
  if (parts.length > 2 && parts[parts.length-2] === 'vercel') {
    return process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'seopage.ai';
  }
  
  return parts.length > 2 
    ? parts.slice(-2).join('.')
    : cleanHost;
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { lang, slug } = resolvedParams;
  const fullSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  if (fullSlug === 'test-rendering') {
    return (
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        background: '#fff'
      }}>
        <h1 style={{
          fontSize: '2.5rem', // 字体小一点
          color: 'green',     // 绿色
          fontWeight: 'bold'
        }}>
          Configured Successfully
        </h1>
      </main>
    );
  }

  try {
    const domain = getCurrentDomain();
    const currentLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
    const articleData = await getPageBySlug(fullSlug, 'en', domain);

    console.log('current articleData', articleData)

    if (
      !articleData?.data &&
      articleData.data.deploymentStatus !== 'publish'
    ) {
      console.error(`Article not found or not published for slug: ${slug}`);
      return notFound();
    }
    
    const article = articleData.data;

    // 检测是否为博客类型 - 增强检测逻辑
    const isBlogType = article?.pageType === 'blog' || 
                      article?.category === 'blog' || 
                      article?.type === 'blog' ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"pageType":"blog"')) ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"content":')) ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"type":"blog"')) ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"cluster":')) ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"author":'));
    
    console.log('Blog type detection:', {
      pageType: article?.pageType,
      category: article?.category,
      type: article?.type,
      isBlogType,
      htmlContainsContent: article?.html?.includes('"content":'),
      htmlContainsCluster: article?.html?.includes('"cluster":'),
      htmlContainsAuthor: article?.html?.includes('"author":')
    });

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
            {isBlogType ? (
              <BlogLayout article={article} />
            ) : (
              <CommonLayout article={article} />
            )}
          </main>
      </>
    );
  } catch (error) {
    console.error('Error in ArticlePage:', error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug } = resolvedParams;
    const domain = getCurrentDomain();
    const fullSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
    const articleData = await getPageBySlug(fullSlug, lang, domain);
    
    if (!articleData?.data) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
      };
    }

    const article = articleData.data;
    console.log('article.html:', article.html);

    let description = '';
    let keywords = '';
    let htmlTitle = '';
    if (article.html && typeof article.html === 'string') {
      // 兼容属性顺序的正则
      const descMatch = article.html.match(
        /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
      );
      description = descMatch ? (descMatch[1] || descMatch[2]) : '';
      const keywordsMatch = article.html.match(
        /<meta\s+[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']keywords["'][^>]*>/i
      );
      keywords = keywordsMatch ? (keywordsMatch[1] || keywordsMatch[2]) : '';
      console.log('正则提取到的 description:', description);
      console.log('正则提取到的 keywords:', keywords);
      const titleMatch = article.html.match(
        /<title>([^<]*)<\/title>/i
      );
      htmlTitle = titleMatch ? titleMatch[1] : '';
      console.log('正则提取到的 title:', htmlTitle);
    }

    // 在generateMetadata函数中添加favicon提取
    const faviconMatch = article.html.match(
      /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["'][^>]*>/i
    );
    const faviconUrl = faviconMatch ? faviconMatch[1] : null;

    return {
      title: htmlTitle, 
      description: description || article.description,
      // 添加favicon
      icons: {
        icon: faviconUrl || '/default-favicon.ico',
      },
      keywords: "AI SEO, competitor traffic, alternative pages, SEO automation, high-intent traffic, AltPage.ai, marketing, comparison pages",
      robots: 'index, follow',
      openGraph: { 
        title: article.title,
        description: description || article.description,
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
        }]
      },
      twitter: { 
        card: 'summary_large_image',
        title: article.title,
        description: description || article.description,
        images: article.coverImage,
        creator: ''
      },
      alternates: {
        canonical: article.siteUrl
          ? (article.siteUrl.startsWith('http') ? `${article.siteUrl}/${article.slug}` : `https://${article.siteUrl}/${article.slug}`)
          : '',
      },
      metadataBase: new URL(`https://${domain}`),
      authors: [{ name: article.author }],
      category: article.category
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.'
    };
  }
}