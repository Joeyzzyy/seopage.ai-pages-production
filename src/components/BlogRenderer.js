'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogHeader } from './BlogHeader';
import { BlogFooter } from './BlogFooter';

// Enhanced content styles for blog posts
const blogContentStyles = `
  .blog-content-links a {
    color: #2563eb !important;
    text-decoration: underline !important;
    font-weight: 500;
  }
  .blog-content-links a:hover {
    color: #1d4ed8 !important;
    text-decoration: underline !important;
  }
  .blog-content-links a:visited {
    color: #7c3aed !important;
  }
  
  
  /* Enhanced typography for better readability */
  .blog-article-content {
    line-height: 1.8 !important;
    font-size: 18px !important;
    color: #374151 !important;
  }
  
  .blog-article-content h1 {
    font-size: 2.5rem !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    margin-top: 2rem !important;
    margin-bottom: 1.5rem !important;
    color: #111827 !important;
    border-bottom: 3px solid #3b82f6 !important;
    padding-bottom: 0.5rem !important;
  }
  
  .blog-article-content h2 {
    font-size: 2rem !important;
    font-weight: 700 !important;
    line-height: 1.3 !important;
    margin-top: 2.5rem !important;
    margin-bottom: 1.25rem !important;
    color: #1f2937 !important;
    border-left: 4px solid #3b82f6 !important;
    padding-left: 1rem !important;
  }
  
  .blog-article-content h3 {
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    margin-top: 2rem !important;
    margin-bottom: 1rem !important;
    color: #374151 !important;
  }
  
  .blog-article-content h4 {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    margin-top: 1.5rem !important;
    margin-bottom: 0.75rem !important;
    color: #4b5563 !important;
  }
  
  .blog-article-content h5 {
    font-size: 1.125rem !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
    margin-top: 1.25rem !important;
    margin-bottom: 0.5rem !important;
    color: #6b7280 !important;
  }
  
  .blog-article-content h6 {
    font-size: 1rem !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
    margin-top: 1rem !important;
    margin-bottom: 0.5rem !important;
    color: #6b7280 !important;
  }
  
  .blog-article-content p {
    margin-bottom: 1.5rem !important;
    line-height: 1.8 !important;
  }
  
  .blog-article-content ul, .blog-article-content ol {
    margin-bottom: 1.5rem !important;
    padding-left: 2rem !important;
    margin-top: 1rem !important;
  }
  
  .blog-article-content ul {
    list-style-type: disc !important;
    list-style-position: outside !important;
  }
  
  .blog-article-content ol {
    list-style-type: decimal !important;
    list-style-position: outside !important;
  }
  
  .blog-article-content li {
    margin-bottom: 0.75rem !important;
    line-height: 1.7 !important;
    display: list-item !important;
  }
  
  .blog-article-content li p {
    margin: 0 !important;
    display: inline !important;
  }
  
  /* 确保列表项内的加粗文本保持加粗效果 - 使用更高优先级 */
  .blog-article-content li strong,
  .blog-article-content li b,
  .blog-article-content ul li strong,
  .blog-article-content ul li b,
  .blog-article-content ol li strong,
  .blog-article-content ol li b {
    font-weight: 700 !important;
    color: #111827 !important;
    font-style: normal !important;
  }
  
  /* 列表项内的强调文本 */
  .blog-article-content li em,
  .blog-article-content li i,
  .blog-article-content ul li em,
  .blog-article-content ul li i,
  .blog-article-content ol li em,
  .blog-article-content ol li i {
    font-style: italic !important;
    color: #4b5563 !important;
  }
  
  .blog-article-content blockquote {
    border-left: 4px solid #e5e7eb !important;
    padding-left: 1.5rem !important;
    margin: 2rem 0 !important;
    font-style: italic !important;
    color: #6b7280 !important;
    background-color: #f9fafb !important;
    padding: 1.5rem !important;
    border-radius: 0.5rem !important;
  }
  
  .blog-article-content code {
    background-color: #f3f4f6 !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.25rem !important;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
    font-size: 0.875rem !important;
    color: #dc2626 !important;
    border: 1px solid #e5e7eb !important;
    display: inline-block !important;
    white-space: nowrap !important;
  }
  
  .blog-article-content pre {
    background-color: #1f2937 !important;
    color: #f9fafb !important;
    padding: 1.5rem !important;
    border-radius: 0.5rem !important;
    overflow-x: auto !important;
    margin: 1.5rem 0 !important;
    border: 1px solid #374151 !important;
    position: relative !important;
  }
  
  .blog-article-content pre code {
    background-color: transparent !important;
    color: #f9fafb !important;
    padding: 0 !important;
    border: none !important;
    display: block !important;
    white-space: pre !important;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }
  
  /* 防止代码块被点击时刷新页面 */
  .blog-article-content pre,
  .blog-article-content code {
    user-select: text !important;
    pointer-events: auto !important;
    cursor: text !important;
  }
  
  /* 确保代码块内的链接不会触发页面跳转 */
  .blog-article-content pre a,
  .blog-article-content code a {
    color: #60a5fa !important;
    text-decoration: none !important;
    pointer-events: none !important;
  }
  
  .blog-article-content hr {
    border: none !important;
    height: 2px !important;
    background: linear-gradient(to right, #3b82f6, #8b5cf6) !important;
    margin: 3rem 0 !important;
  }
  
  .blog-article-content strong,
  .blog-article-content b {
    font-weight: 700 !important;
    color: #111827 !important;
  }
  
  .blog-article-content em,
  .blog-article-content i {
    font-style: italic !important;
    color: #4b5563 !important;
  }
  
  /* 确保所有嵌套元素内的加粗文本都保持加粗 - 最高优先级 */
  .blog-article-content * strong,
  .blog-article-content * b,
  .blog-article-content ul * strong,
  .blog-article-content ul * b,
  .blog-article-content ol * strong,
  .blog-article-content ol * b,
  .blog-article-content li * strong,
  .blog-article-content li * b {
    font-weight: 700 !important;
    color: #111827 !important;
    font-style: normal !important;
  }
  
  /* 确保所有嵌套元素内的强调文本都保持斜体 */
  .blog-article-content * em,
  .blog-article-content * i,
  .blog-article-content ul * em,
  .blog-article-content ul * i,
  .blog-article-content ol * em,
  .blog-article-content ol * i,
  .blog-article-content li * em,
  .blog-article-content li * i {
    font-style: italic !important;
    color: #4b5563 !important;
  }
  
  .blog-article-content u {
    text-decoration: underline !important;
    text-decoration-color: #3b82f6 !important;
    text-decoration-thickness: 2px !important;
  }
  
  /* 表格样式 - 优化版 */
  .blog-article-content table {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    margin: 2.5rem 0 !important;
    font-size: 15px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid #e5e7eb !important;
    background-color: #ffffff !important;
  }
  
  .blog-article-content thead {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%) !important;
    border-bottom: 2px solid #e2e8f0 !important;
  }
  
  .blog-article-content th {
    padding: 1.125rem 1.5rem !important;
    text-align: center !important;
    vertical-align: middle !important;
    font-weight: 800 !important;
    color: #1e293b !important;
    font-size: 16px !important;
    letter-spacing: 0.025em !important;
    border-bottom: 2px solid #e2e8f0 !important;
    white-space: nowrap !important;
    line-height: 1.5 !important;
  }
  
  .blog-article-content th:first-child {
    border-top-left-radius: 12px !important;
  }
  
  .blog-article-content th:last-child {
    border-top-right-radius: 12px !important;
  }
  
  .blog-article-content td {
    padding: 1rem 1.5rem !important;
    color: #475569 !important;
    line-height: 1.7 !important;
    border-bottom: 1px solid #f1f5f9 !important;
    vertical-align: middle !important;
    text-align: center !important;
  }
  
  .blog-article-content tbody tr {
    transition: all 0.2s ease !important;
    background-color: #ffffff !important;
  }
  
  .blog-article-content tbody tr:hover {
    background-color: #f8fafc !important;
    transform: scale(1.001) !important;
  }
  
  .blog-article-content tbody tr:last-child td {
    border-bottom: none !important;
  }
  
  .blog-article-content tbody tr:last-child td:first-child {
    border-bottom-left-radius: 12px !important;
  }
  
  .blog-article-content tbody tr:last-child td:last-child {
    border-bottom-right-radius: 12px !important;
  }
  
  /* 表格内的段落 - 移除 margin 确保垂直居中 */
  .blog-article-content table p {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* 表格内的强调文本 */
  .blog-article-content table strong {
    color: #0f172a !important;
    font-weight: 600 !important;
  }
  
  /* 表格响应式 */
  @media (max-width: 768px) {
    .blog-article-content table {
      font-size: 13px !important;
      border-radius: 8px !important;
    }
    
    .blog-article-content th,
    .blog-article-content td {
      padding: 0.875rem 1rem !important;
    }
    
    .blog-article-content th {
      font-size: 12px !important;
      white-space: normal !important;
    }
  }
  
  /* 表格容器 - 添加水平滚动 */
  .blog-article-content table {
    display: table !important;
    overflow-x: auto !important;
  }
  
  /* 正文中的图片样式 */
  .blog-article-content .image-container {
    margin: 1.5rem 0 !important;
    text-align: center !important;
  }
  
  .blog-article-content .image-container img {
    max-width: 60% !important;
    max-height: 400px !important;
    width: auto !important;
    height: auto !important;
    border-radius: 0.5rem !important;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06) !important;
    transition: transform 0.2s ease !important;
  }
  
  .blog-article-content .image-container img:hover {
    transform: scale(1.01) !important;
  }
  
  .blog-article-content .image-container p {
    margin-top: 0.5rem !important;
    font-size: 0.875rem !important;
    color: #6b7280 !important;
    font-style: italic !important;
  }
  
  .blog-article-content .inline-image {
    max-width: 200px !important;
    max-height: 150px !important;
    width: auto !important;
    height: auto !important;
    border-radius: 0.25rem !important;
    margin: 0.5rem 0.5rem 0.5rem 0 !important;
    display: inline-block !important;
    vertical-align: middle !important;
  }
`;

// Navigation component for blog posts
function BlogTableOfContents({ htmlContent }) {
  const [isVisible, setIsVisible] = useState(true);
  const [extractedSections, setExtractedSections] = useState([]);
  const [hasConclusion, setHasConclusion] = useState(false);

  useEffect(() => {
    if (htmlContent) {
      const timer = setTimeout(() => {
        const contentElement = document.querySelector('.blog-article-content');
        
        if (contentElement) {
          const h2Elements = contentElement.querySelectorAll('h2');
          const extracted = [];
          let conclusionFound = false;
          
          Array.from(h2Elements).forEach((h2, index) => {
            const title = h2.textContent || h2.innerText || `Section ${index + 1}`;
            
            if (title.toLowerCase().includes('conclusion') || 
                title.toLowerCase().includes('总结') || 
                title.toLowerCase().includes('结论')) {
              conclusionFound = true;
              h2.id = 'conclusion';
            } else {
              h2.id = `section-${extracted.length}`;
              extracted.push({
                h2: title,
                id: `section-${extracted.length}`
              });
            }
          });
          
          setExtractedSections(extracted);
          setHasConclusion(conclusionFound);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [htmlContent]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToConclusion = () => {
    const element = document.getElementById('conclusion');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!extractedSections || extractedSections.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-32 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Table of Contents"
      >
        <svg 
          className={`w-5 h-5 transition-transform ${isVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className={`fixed top-44 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      }`} style={{ maxWidth: '280px', maxHeight: '60vh' }}>
        <div className="p-4">
          <div className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            Table of Contents
          </div>
          <div className="space-y-1 overflow-y-auto" style={{ maxHeight: '50vh' }}>
            {extractedSections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className="w-full text-left text-sm px-3 py-2 rounded hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                <span className="block truncate">{section.h2}</span>
              </button>
            ))}
            {hasConclusion && (
              <button
                onClick={scrollToConclusion}
                className="w-full text-left text-sm px-3 py-2 rounded hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                <span className="block truncate">Conclusion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Blog 内容渲染组件
 * 专门处理 blog 类型的文章内容
 */
const BlogContentRenderer = ({ content, article }) => {
  // 解析 JSON 格式的 HTML 内容
  const { parsedContent, htmlContent } = useMemo(() => {
    if (!content) return { parsedContent: null, htmlContent: '' };
    
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.content) {
        return {
          parsedContent: parsed,
          htmlContent: parsed.content
        };
      }
    } catch (e) {
      // 如果不是 JSON，直接使用原始内容
      return {
        parsedContent: null,
        htmlContent: content
      };
    }
    
    return { parsedContent: null, htmlContent: content };
  }, [content]);

  // 处理所有链接在新标签页打开
  useEffect(() => {
    const handleLinks = () => {
      const contentElement = document.querySelector('.blog-article-content');
      if (contentElement) {
        const links = contentElement.querySelectorAll('a');
        links.forEach(link => {
          // 检查是否是外部链接
          const href = link.getAttribute('href');
          if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('//'))) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        });
      }
    };

    // 延迟执行，确保内容已渲染
    const timer = setTimeout(handleLinks, 100);
    return () => clearTimeout(timer);
  }, [htmlContent]);

  // 生成博客结构化数据
  const blogStructuredData = useMemo(() => {
    const title = parsedContent?.title || article?.title || 'Untitled';
    const description = parsedContent?.description || article?.description || '';
    const author = parsedContent?.author || article?.author || 'SeoPage.ai Team';
    const publishDate = article?.created_at || new Date().toISOString();
    const modifiedDate = article?.updated_at || publishDate;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `https://seopage.ai/blog/${article?.id || 'unknown'}`,
      "headline": title,
      "description": description,
      "image": parsedContent?.heroImage ? {
        "@type": "ImageObject",
        "url": parsedContent.heroImage,
        "width": 1200,
        "height": 630
      } : undefined,
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://seopage.ai"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SeoPage.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://seopage.ai/images/competitors-logo-homescreen/seopage-ai-logo.png",
          "width": 300,
          "height": 60
        },
        "url": "https://seopage.ai"
      },
      "datePublished": publishDate,
      "dateModified": modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://seopage.ai/blog/${article?.id || 'unknown'}`
      },
      "articleSection": "Blog",
      "keywords": parsedContent?.keywords || "SEO, Blog, Marketing, Digital Marketing",
      "wordCount": htmlContent ? htmlContent.split(' ').length : 0
    };
  }, [parsedContent, article, htmlContent]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 添加博客结构化数据脚本 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData, null, 0)
        }}
      />
      
      <style dangerouslySetInnerHTML={{ __html: blogContentStyles }} />
      
      {/* 博客专用 Header */}
      <BlogHeader />
      
      <BlogTableOfContents htmlContent={htmlContent} />

      <main className="w-[70%] max-w-none mx-auto px-4 py-4 flex-grow pt-20">
        {/* 文章元信息 */}
        <div className="mb-4 flex items-center text-sm text-gray-600">
          {parsedContent?.cluster && (
            <>
              <span className="text-blue-600 font-medium">{parsedContent.cluster}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <time dateTime={article?.created_at} className="text-gray-500">
            {article?.created_at ? new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </time>
          {article?.updated_at && article?.updated_at !== article?.created_at && (
            <>
              <span className="mx-2">•</span>
              <span className="text-gray-500">
                Updated: {new Date(article.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </>
          )}
          {parsedContent?.author && (
            <>
              <span className="mx-2">•</span>
              <span className="text-gray-500">By {parsedContent.author}</span>
            </>
          )}
        </div>
        
        {/* 文章标题 */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">
          {parsedContent?.title || article?.title || 'Untitled'}
        </h1>
        
        {/* Hero 图片 */}
        {parsedContent?.heroImage && (
          <div className="w-2/3 mx-auto mb-8 flex justify-center items-center">
            <img
              src={parsedContent.heroImage}
              alt={parsedContent.title || 'Hero image'}
              className="w-full h-auto object-contain max-h-[500px]"
              loading="eager"
            />
          </div>
        )}


        {/* 文章内容 */}
        <div className="mb-8">
          {htmlContent ? (
            <div 
              className="w-full blog-content-links blog-article-content" 
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              onClick={(e) => {
                // 处理链接点击事件
                if (e.target.tagName === 'A') {
                  const href = e.target.getAttribute('href');
                  if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('//'))) {
                    e.target.setAttribute('target', '_blank');
                    e.target.setAttribute('rel', 'noopener noreferrer');
                  }
                }
                // 防止代码块内的点击事件冒泡
                if (e.target.tagName === 'CODE' || e.target.tagName === 'PRE' || e.target.closest('code') || e.target.closest('pre')) {
                  e.stopPropagation();
                }
              }}
            />
          ) : (
            <div className="bg-red-100 p-4 mb-6 text-sm rounded-lg">
              ❌ No HTML content available
            </div>
          )}
        </div>
        
        {/* CTA 部分 */}
        <div className="border-t border-gray-200 pt-8 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your SEO Strategy?</h3>
            <p className="text-lg text-gray-600 mb-6">Discover how SEOPage.ai can help you create high-converting pages that drive organic traffic and boost your search rankings.</p>
            <a 
              href="https://seopage.ai" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started with SEOPage.ai
            </a>
          </div>
        </div>
      </main>
      
      {/* 博客专用 Footer */}
      <BlogFooter />
    </div>
  );
};

/**
 * Blog 布局组件
 * 专门用于渲染 blog 类型的文章
 */
const BlogLayout = ({ article }) => {
  return (
    <BlogContentRenderer content={article.html} article={article} />
  );
};

export default BlogLayout;
