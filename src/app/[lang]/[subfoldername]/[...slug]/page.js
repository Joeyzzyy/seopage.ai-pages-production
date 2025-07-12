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
  const customHost = headersList.get('x-alterpage-host'); // <--- 读取自定义 Header X-AlterPage-Host
  const forwardedHost = headersList.get('x-forwarded-host'); // 仍然可以读取，作为备选或调试
  const host = headersList.get('host');
  console.log(`[Debug Headers] X-AlterPage-Host: ${customHost}, X-Forwarded-Host: ${forwardedHost}, Host: ${host}`); // 更新日志

  // --- 优先使用自定义 Header ---
  const originalHost = customHost || forwardedHost || host; // 优先自定义 X-AlterPage-Host
  console.log(`[Debug getCurrentDomain] Using originalHost: ${originalHost}`);

  // 如果是本地环境，返回默认域名或根据需要调整
  if (process.env.NODE_ENV === 'development') {
    // 本地开发时，可能没有 x-forwarded-host，直接用 host 提取或返回默认值
    const devHost = host; // 使用从 headers3 获取的 host
    console.log(`[Debug getCurrentDomain] Development mode, using devHost: ${devHost}`); // <-- 新增日志
    // return 'websitelm.com'; // 或者根据本地 host 提取
    const devIdentifier = extractMainDomain(devHost);
    console.log(`[Debug getCurrentDomain] Development identifier: ${devIdentifier}`); // <-- 新增日志
    return devIdentifier;
  }
  // 生产环境基于原始 Host (或转发的 Host) 提取主域名
  const identifier = extractMainDomain(originalHost);
  console.log(`[Debug getCurrentDomain] Production identifier: ${identifier}`); // <-- 新增日志
  return identifier;
}
// --- 结束添加新的辅助函数 ---

// 辅助函数：获取当前请求的 Host (保留端口) 和协议 (用于 URL 构建)
function getCurrentHostAndProtocol() {
  const headersList = headers();
  const customHost = headersList.get('x-alterpage-host'); // <--- 读取自定义 Header X-AlterPage-Host
  const forwardedHost = headersList.get('x-forwarded-host');
  const hostFromHeader = headersList.get('host');
  console.log(`[Debug Headers for URL] X-AlterPage-Host: ${customHost}, X-Forwarded-Host: ${forwardedHost}, Host: ${hostFromHeader}`); // 更新日志

  // --- 优先使用自定义 Header ---
  const hostHeader = customHost || forwardedHost || hostFromHeader; // 优先自定义 X-AlterPage-Host
  console.log(`[Debug getCurrentHostAndProtocol] Using hostHeader for URL: ${hostHeader}`);

  // host 变量现在意义不大，因为 identifier 由 getCurrentDomain 获取
  const host = hostHeader?.split(':')[0] || null;
  // 协议仍然优先读取 X-Forwarded-Proto
  const forwardedProto = headersList.get('x-forwarded-proto');
  const protocol = forwardedProto || (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  console.log(`[Debug getCurrentHostAndProtocol] X-Forwarded-Proto: ${forwardedProto}, Using protocol: ${protocol}`); // <-- 新增日志

  return { host, protocol, hostHeader }; // 返回原始 hostHeader 用于 URL
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
  console.log(`[Subfolder Page Start] Params: ${JSON.stringify(params)}`); // <-- 新增日志

  // --- 获取 Identifier (主域名) ---
  const identifier = getCurrentDomain(); // 函数内部已有日志
  console.log(`[Subfolder Page] Determined Identifier: ${identifier}`); // <-- 新增日志

  if (!identifier) {
     console.error('[Subfolder Page] Could not determine identifier (main domain).');
     return notFound();
  }

  // --- 获取 Host 和 Protocol (用于 Schema URL) ---
  // 注意：这里获取的是原始的、带端口的 hostHeader，用于构建规范 URL
  const { protocol, hostHeader } = getCurrentHostAndProtocol(); // 函数内部已有日志
  console.log(`[Subfolder Page] Determined Protocol: ${protocol}, Host Header for URL: ${hostHeader}`); // <-- 新增日志

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
    console.log(`[Subfolder Page] Calling getPageBySlug with: slug='${fullSlug}', lang='${currentLang}', identifier='${identifier}'`); // 日志已包含 identifier
    const articleData = await getPageBySlug(fullSlug, currentLang, identifier);

    if (
      !articleData?.data ||
      articleData.data.deploymentStatus !== 'publish'
    ) {
      console.error(`[Subfolder Page] Article not found/published. Slug: ${fullSlug}, Identifier: ${identifier}`);
      return notFound();
    }

    const article = articleData.data;

    // --- 生成 Schema ---
    // 使用 pathSubfolder 和 hostHeader (带端口) 构建规范 URL 路径部分
    const canonicalUrl = hostHeader ? getSubfolderCanonicalUrl(protocol, hostHeader, pathSubfolder, currentLang, slugArray) : '';
    console.log(`[Subfolder Page] Generated Canonical URL for Schema: ${canonicalUrl}`); // <-- 新增日志

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
    console.error(`Error in Subfolder ArticlePage (Identifier: ${identifier}, Params: ${JSON.stringify(params)}):`, error); // 日志已包含 identifier
    return notFound();
  }
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang = 'en', pageid } = resolvedParams;
    
    const articleData = await getPageBySlug(pageid, lang);
    
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
    }

    return {
      title: article.title, 
      description: description || article.description,
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
        canonical: `https://${domain}/${article.slug}`,
      },
      metadataBase: new URL(`https://your-domain.com`),
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