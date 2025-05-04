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

// --- 添加新的辅助函数 ---
// 提取主域名 (例如: blog.example.com -> example.com)
function extractMainDomain(host) {
  // 移除端口号（如果有）
  const domainWithoutPort = host?.split(':')[0] || '';
  // 将域名按点分割
  const parts = domainWithoutPort.split('.');
  // 如果域名部分少于2个，直接返回原始域名
  if (parts.length < 2) {
    return domainWithoutPort;
  }
  // 返回主域名（最后两部分）
  return parts.slice(-2).join('.');
}

// 获取当前请求的主域名作为 identifier
function getCurrentDomain() {
  const headersList = headers();
  const host = headersList.get('host');
  // 如果是本地环境，返回默认域名或根据需要调整
  if (process.env.NODE_ENV === 'development') {
    // 注意：这里可能需要根据你的本地设置调整默认值
    // 如果你的 API 在本地开发时期望特定的 identifier，请在此处设置
    // 例如，如果 API 期望 'websitelm.com'
    // return 'websitelm.com';
    // 或者，如果 API 可以处理本地的 host (移除端口后)
    return extractMainDomain(host); // 或者直接返回移除端口的 host
  }
  // 生产环境提取主域名
  return extractMainDomain(host);
}
// --- 结束添加新的辅助函数 ---

// 辅助函数：获取当前请求的 Host (保留端口) 和协议 (用于 URL 构建)
function getCurrentHostAndProtocol() {
  const headersList = headers();
  const hostHeader = headersList.get('host'); // 保留端口, 用于构建 URL
  const host = hostHeader?.split(':')[0] || null; // 仅用于可能的日志或旧逻辑，identifier 现在由 getCurrentDomain 获取
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  return { host, protocol, hostHeader }; // 返回 hostHeader 用于 URL
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
  // subfoldername 来自路径
  const { subfoldername: pathSubfolder, lang: rawLang, slug: rawSlug } = params;

  // --- 获取 Identifier (主域名) ---
  const identifier = getCurrentDomain(); // <--- 使用新的辅助函数获取主域名

  if (!identifier) {
     console.error('[Subfolder Page] Could not determine identifier (main domain).');
     return notFound();
  }

  // --- 获取 Host 和 Protocol (用于 Schema URL) ---
  // 注意：这里获取的是带端口的 hostHeader，用于构建规范 URL
  const { protocol, hostHeader } = getCurrentHostAndProtocol();
  if (!hostHeader) {
      console.error('[Subfolder Page] Could not determine host for schema URL.');
      // 考虑是否在无法生成 schema URL 时也返回 notFound() 或提供默认值
      // return notFound();
  }

  // --- 检查路径中的 subfolder ---
  if (!pathSubfolder) {
     console.error('[Subfolder Page] Path subfolder segment is missing.');
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
    // 使用新的 identifier (主域名) 调用 API
    console.log(`[Subfolder Page] Calling getPageBySlug with: slug='${fullSlug}', lang='${currentLang}', identifier='${identifier}'`); // <--- 使用主域名 identifier
    const articleData = await getPageBySlug(fullSlug, currentLang, identifier); // <--- 使用主域名 identifier

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
    // 使用 pathSubfolder 和 hostHeader (带端口) 构建规范 URL 路径部分
    const canonicalUrl = hostHeader ? getSubfolderCanonicalUrl(protocol, hostHeader, pathSubfolder, currentLang, slugArray) : ''; // <--- 使用 hostHeader (带端口)

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
        '@id': canonicalUrl // 使用基于 hostHeader 的规范链接
      },
      image: article.coverImage || undefined,
      articleBody: article.content,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      articleSection: article.category,
    };

    return (
      <>
        {/* 仅在成功生成 URL 时渲染 Schema */}
        {canonicalUrl && (
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
    // 在错误日志中包含新的 identifier (主域名)
    console.error(`Error in Subfolder ArticlePage (Identifier: ${identifier}, Params: ${JSON.stringify(params)}):`, error); // <--- 使用主域名 identifier
    return notFound();
  }
}

// 元数据生成 (子目录)
export async function generateMetadata({ params }) {
  const { subfoldername: pathSubfolder, lang: rawLang, slug: rawSlug } = params;

  // --- 获取 Identifier (主域名) ---
  const identifier = getCurrentDomain(); // <--- 使用新的辅助函数获取主域名

  if (!identifier) {
     console.error('[Subfolder Metadata] Could not determine identifier (main domain).');
     return { title: 'Error', description: 'Invalid request', robots: 'noindex, nofollow' };
  }

  // --- 获取 Host 和 Protocol (用于元数据 URL 构建) ---
  const headersList = headers();
  const hostHeader = headersList.get('host'); // <--- 获取完整 host (带端口) 用于 URL
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https');

  if (!hostHeader) {
     console.error('[Subfolder Metadata] Could not determine host for URL generation.');
     return { title: 'Error', description: 'Could not determine host.', robots: 'noindex, nofollow' };
  }

  // --- 检查路径中的 subfolder ---
  if (!pathSubfolder) {
     console.error('[Subfolder Metadata] Path subfolder segment is missing.');
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
    // 使用新的 identifier (主域名) 调用 API
    console.log(`[Subfolder Metadata] Calling getPageBySlug with: slug='${fullSlug}', lang='${currentLang}', identifier='${identifier}'`); // <--- 使用主域名 identifier
    const articleData = await getPageBySlug(fullSlug, currentLang, identifier); // <--- 使用主域名 identifier

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

    // --- 构建元数据 URL ---
    // 使用 hostHeader (带端口) 构建基础 URL
    const baseUrl = `${protocol}://${hostHeader}`;
    const metadataBaseUrl = new URL(baseUrl);

    // --- 生成规范链接和 Hreflang ---
    // 使用 hostHeader (带端口) 构建 URL
    const alternates = { languages: {}, hreflang: [] };
    let canonicalUrl = '';

    SUPPORTED_LANGUAGES.forEach(altLang => {
      // 使用 pathSubfolder 和 hostHeader 构建 URL
      const href = getSubfolderCanonicalUrl(protocol, hostHeader, pathSubfolder, altLang, slugArray); // <--- 使用 hostHeader
      alternates.languages[altLang] = href;
      alternates.hreflang.push({ href, hrefLang: altLang });

      if (altLang === currentLang) {
        canonicalUrl = href; // 设置当前页面的规范链接
      }
    });

    // 添加 x-default (指向英文版)
    // 使用 pathSubfolder 和 hostHeader 构建 URL
    const xDefaultHref = getSubfolderCanonicalUrl(protocol, hostHeader, pathSubfolder, 'en', slugArray); // <--- 使用 hostHeader
    alternates.hreflang.push({ href: xDefaultHref, hrefLang: 'x-default' });
    alternates.canonical = canonicalUrl; // 添加 canonical 属性

    // 在日志中包含新的 identifier (主域名)
    console.log(`[Subfolder Metadata] Identifier: ${identifier}, Canonical: ${canonicalUrl}`); // <--- 使用主域名 identifier
    console.log(`[Subfolder Metadata] Alternates:`, alternates);

    return {
      title: article.title,
      description: article.description,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      robots: article.publishStatus === 'publish' ? 'index, follow' : 'noindex, nofollow',
      openGraph: {
        title: article.title,
        description: article.description,
        url: canonicalUrl, // 使用基于 hostHeader 的规范链接
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
      alternates: alternates, // 使用基于 hostHeader 的 alternates
      metadataBase: metadataBaseUrl, // 使用基于 hostHeader 的 metadataBase
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
    // 在错误日志中包含新的 identifier (主域名)
    console.error(`Error in Subfolder generateMetadata (Identifier: ${identifier}, Params: ${JSON.stringify(params)}):`, error); // <--- 使用主域名 identifier
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.',
      robots: 'noindex, nofollow'
    };
  }
}