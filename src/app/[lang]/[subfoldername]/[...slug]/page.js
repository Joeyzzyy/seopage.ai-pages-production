import { getPageBySlug } from '../../../../lib/api/index'; // 调整 API 导入路径
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // 需要 headers 来获取 host 用于构建 URL
import CommonLayout from '../../../../components/layouts/layout'; // 调整布局导入路径
import Script from 'next/script';

// 1. 确保动态渲染
export const dynamic = 'force-dynamic';
// 2. 启用动态路由参数
export const dynamicParams = true;
// 3. 完全禁用缓存
export const fetchCache = 'force-no-store';
// 4. 设置零秒缓存
export const revalidate = 0;

const SUPPORTED_LANGUAGES = ['en', 'zh'];

// 辅助函数：获取当前请求的 Host (移除端口) 和协议
function getCurrentHostAndProtocol() {
  const headersList = headers();
  const hostHeader = headersList.get('host'); // 保留端口
  const host = hostHeader?.split(':')[0] || null;
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  return { host, protocol, hostHeader };
}

// 辅助函数：处理数组并返回逗号分隔的字符串
function joinArrayWithComma(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(',') : '';
}

// 辅助函数：为子目录结构生成规范链接
function getSubfolderCanonicalUrl(protocol, host, subfolder, lang, slugParts) {
  const baseUrl = `${protocol}://${host}`; // host 是根域名
  const actualSlug = slugParts.join('/');
  // 子目录结构总是包含 subfolder 和 lang
  return `${baseUrl}/${subfolder}/${lang}/${actualSlug}`;
}

// 主页面组件 (子目录)
export default async function ArticlePageSubfolder({ params }) {
  // subfoldername 是标识符
  const { subfoldername: identifier, lang: rawLang, slug: rawSlug } = params;

  if (!identifier) {
     console.error('[Subfolder Page] Subfoldername (identifier) is missing.');
     return notFound();
  }

  const currentLang = SUPPORTED_LANGUAGES.includes(rawLang) ? rawLang : 'en';
  const slugArray = (Array.isArray(rawSlug) ? rawSlug : [rawSlug]).filter(Boolean);

  if (slugArray.length === 0) {
     console.log(`[Subfolder Page] Slug array is empty. Identifier: ${identifier}, Lang: ${currentLang}`);
     return notFound();
  }
  const fullSlug = slugArray.join('/');

  try {
    console.log(`[Subfolder Page] Calling getPageBySlug with: slug='${fullSlug}', lang='${currentLang}', identifier='${identifier}'`);
    const articleData = await getPageBySlug(fullSlug, currentLang, identifier);

    if (
      !articleData?.data ||
      (
        articleData.data.publishStatus !== 'publish' &&
        articleData.data.deploymentStatus !== 'publish'
      )
    ) {
      console.error(`[Subfolder Page] Article not found/published. Slug: ${fullSlug}, Identifier: ${identifier}`);
      return notFound();
    }

    const article = articleData.data;

    // --- 生成 Schema ---
    // 需要计算规范链接
    const { host, protocol, hostHeader } = getCurrentHostAndProtocol();
    if (!host) {
        console.error('[Subfolder Page] Could not determine host for schema.');
        // 无法生成 schema 或返回错误
    }
    const canonicalUrl = host ? getSubfolderCanonicalUrl(protocol, hostHeader || host, identifier, currentLang, slugArray) : '';

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author || 'Unknown Author'
      },
      publisher: {
        '@type': 'Organization',
        name: article.publisherName || 'WebsiteLM',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl // 使用规范链接
      },
      image: article.coverImage || undefined,
      articleBody: article.content,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      articleSection: article.category,
    };

    return (
      <>
        {canonicalUrl && ( // 仅在成功生成 URL 时渲染 Schema
          <Script id="article-schema" type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </Script>
        )}
        <main className="flex-grow" lang={currentLang}>
          <CommonLayout article={article} />
        </main>
      </>
    );

  } catch (error) {
    console.error(`Error in Subfolder ArticlePage (Identifier: ${identifier}, Params: ${JSON.stringify(params)}):`, error);
    return notFound();
  }
}

// 元数据生成 (子目录)
export async function generateMetadata({ params }) {
  const { subfoldername: identifier, lang: rawLang, slug: rawSlug } = params; // subfoldername 是标识符

  if (!identifier) {
     console.error('[Subfolder Metadata] Subfoldername (identifier) is missing.');
     return { title: 'Error', description: 'Invalid request', robots: 'noindex, nofollow' };
  }

  const currentLang = SUPPORTED_LANGUAGES.includes(rawLang) ? rawLang : 'en';
  const slugArray = (Array.isArray(rawSlug) ? rawSlug : [rawSlug]).filter(Boolean);

  if (slugArray.length === 0) {
     console.log(`[Subfolder Metadata] Slug array is empty. Identifier: ${identifier}, Lang: ${currentLang}`);
     return { title: 'Not Found', robots: 'noindex, nofollow' };
  }
  const fullSlug = slugArray.join('/');

  try {
    console.log(`[Subfolder Metadata] Calling getPageBySlug with: slug='${fullSlug}', lang='${currentLang}', identifier='${identifier}'`);
    const articleData = await getPageBySlug(fullSlug, currentLang, identifier);

    if (
      !articleData?.data ||
      (
        articleData.data.publishStatus !== 'publish' &&
        articleData.data.deploymentStatus !== 'publish'
      )
    ) {
      console.log(`[Subfolder Metadata] Article not found/published. Slug: ${fullSlug}, Identifier: ${identifier}`);
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
        robots: 'noindex, nofollow'
      };
    }
    const article = articleData.data;

    const { host, protocol, hostHeader } = getCurrentHostAndProtocol();
    if (!host) {
       console.error('[Subfolder Metadata] Could not determine host.');
       return { title: 'Error', description: 'Could not determine host.', robots: 'noindex, nofollow' };
    }

    const baseUrl = `${protocol}://${hostHeader || host}`; // 使用包含端口的 host (如果存在)
    const metadataBaseUrl = new URL(baseUrl);

    // --- 生成规范链接和 Hreflang ---
    const alternates = { languages: {}, hreflang: [] };
    let canonicalUrl = '';

    SUPPORTED_LANGUAGES.forEach(altLang => {
      // 使用辅助函数生成 URL
      const href = getSubfolderCanonicalUrl(protocol, hostHeader || host, identifier, altLang, slugArray);
      alternates.languages[altLang] = href;
      alternates.hreflang.push({ href, hrefLang: altLang });

      if (altLang === currentLang) {
        canonicalUrl = href; // 设置当前页面的规范链接
      }
    });

    // 添加 x-default (指向英文版)
    const xDefaultHref = getSubfolderCanonicalUrl(protocol, hostHeader || host, identifier, 'en', slugArray);
    alternates.hreflang.push({ href: xDefaultHref, hrefLang: 'x-default' });
    alternates.canonical = canonicalUrl; // 添加 canonical 属性

    console.log(`[Subfolder Metadata] Identifier: ${identifier}, Canonical: ${canonicalUrl}`);
    console.log(`[Subfolder Metadata] Alternates:`, alternates);

    return {
      title: article.title,
      description: article.description,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      robots: article.publishStatus === 'publish' ? 'index, follow' : 'noindex, nofollow',
      openGraph: {
        title: article.title,
        description: article.description,
        url: canonicalUrl,
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
        locale: currentLang,
        images: article.coverImage ? [{
          url: article.coverImage, width: 1200, height: 630, alt: article.title
        }] : undefined,
        article: {
          authors: article.author ? [article.author] : undefined,
          tags: article.pageStats?.genKeywords,
          section: article.category
        }
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description,
        images: article.coverImage || undefined,
      },
      alternates: alternates,
      metadataBase: metadataBaseUrl,
      authors: article.author ? [{ name: article.author }] : undefined,
      category: article.category,
      other: {
        'article:published_time': article.createdAt,
        'article:modified_time': article.updatedAt,
        'article:section': article.category,
        'article:tag': joinArrayWithComma(article.pageStats?.genKeywords)
      }
    };
  } catch (error) {
    console.error(`Error in Subfolder generateMetadata (Identifier: ${identifier}, Params: ${JSON.stringify(params)}):`, error);
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.',
      robots: 'noindex, nofollow'
    };
  }
}