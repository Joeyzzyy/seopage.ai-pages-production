'use client';
import React, { useEffect, useRef, useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

// 简化提取标题的函数
const extractContentTitle = (content) => {
  if (!content || typeof window === 'undefined') return [];
  
  // 使用 DOMParser 直接解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const subtitleSpans = doc.querySelectorAll('span.content-subtitle');
  
  return Array.from(subtitleSpans).map(span => span.textContent);
};

// 处理HTML内容，为content-subtitle添加ID
const processHtml = (html) => {
  if (!html || typeof window === 'undefined') return html || '';
  
  // 移除开头的空 p 标签
  let processedHtml = html.replace(/^(<p><\/p>)+/, '');
  
  // 替换其他空段落为带有非断行空格的段落
  processedHtml = processedHtml.replace(/(?!^)<p><\/p>/g, '<p>&nbsp;</p>');
  
  // 为content-subtitle添加ID
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedHtml, 'text/html');
  const subtitleSpans = doc.querySelectorAll('span.content-subtitle');
  
  subtitleSpans.forEach((span, index) => {
    const sectionId = `section-${index}`;
    span.setAttribute('id', sectionId);
  });
  
  return new XMLSerializer().serializeToString(doc);
};

const KeyResultsWithTextBlock = ({ data, theme = 'normal' }) => {
  const { rightContent } = data;
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedContent, setProcessedContent] = useState('');
  const [titles, setTitles] = useState([]);
  
  useEffect(() => {
    // 在客户端处理HTML内容
    setProcessedContent(processHtml(rightContent));
    // 在客户端提取标题
    setTitles(extractContentTitle(rightContent));
  }, [rightContent]);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    
    const handleScroll = () => {
      if (!container || !sticky) return;
      
      const containerRect = container.getBoundingClientRect();
      const stickyRect = sticky.getBoundingClientRect();
      const topOffset = 128;
      
      const containerTop = window.pageYOffset + containerRect.top;
      const containerBottom = containerTop + containerRect.height;
      
      const currentScroll = window.pageYOffset;

      if (currentScroll + topOffset < containerTop) {
        sticky.style.position = 'absolute';
        sticky.style.top = '0';
        sticky.style.bottom = 'auto';
      } else if (currentScroll + topOffset + stickyRect.height > containerBottom) {
        sticky.style.position = 'absolute';
        sticky.style.top = `${containerRect.height - stickyRect.height}px`;
        sticky.style.bottom = 'auto';
      } else {
        sticky.style.position = 'fixed';
        sticky.style.top = `${topOffset}px`;
        sticky.style.bottom = 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative max-w-[90vw] max-h-[90vh]">
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  // 设置图片点击事件
  useEffect(() => {
    const handleImageClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setSelectedImage({
          src: e.target.src,
          alt: e.target.alt
        });
      }
    };
    
    document.querySelector('.article-content')?.addEventListener('click', handleImageClick);
    
    return () => {
      document.querySelector('.article-content')?.removeEventListener('click', handleImageClick);
    };
  }, [processedContent]);

  return (
    <>
      <div className={`${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-[350px_1fr] gap-20" ref={containerRef}>
            <div className="relative w-[350px]">
              <div ref={stickyRef} className="sticky top-128 inline-block" style={{ width: '350px' }}>
                <div className="bg-white shadow rounded-lg p-8 mb-4 border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-4">
                    Table of Contents
                  </h3>
                  <ul className="space-y-2">
                    {titles.map((title, index) => (
                      <li key={`toc-${index}`}>
                        <button
                          onClick={() => scrollToSection(`section-${index}`)}
                          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-sm text-left py-2 px-3 w-full rounded-md transition-all duration-200"
                        >
                          {title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <main className="main-content">
                <article className="article max-w-[800px] pr-4">
                  {/* 使用处理过的HTML内容 */}
                  <div 
                    className="text-lg md:text-xl leading-[1.8] text-gray-700 article-content"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                </article>            
              </main>
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        src={selectedImage?.src}
        alt={selectedImage?.alt}
        onClose={() => setSelectedImage(null)}
      />
      
      {/* 添加必要的 CSS 样式 */}
      <style jsx global>{`
        .article-content p {
          margin-bottom: 1em;
        }
        
        /* 确保空段落也有高度 */
        .article-content p:empty {
          min-height: 1.5em !important;
          display: block !important;
          margin-bottom: 1em !important;
          visibility: visible !important;
        }
        
        .article-content b, 
        .article-content strong {
          font-weight: bold;
        }
        
        .article-content i,
        .article-content em {
          font-style: italic;
        }
        
        .article-content a {
          color: #1890ff;
          text-decoration: none;
        }
        
        .article-content a:hover {
          text-decoration: underline;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        
        .article-content .video-container {
          margin: 1rem 0;
        }
        
        .article-content .embedded-video {
          max-width: 100%;
          border-radius: 0.5rem;
        }
        
        /* 恢复 h1-h5 标签的样式 */
        .article-content h1 {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          margin: 1.5em 0 0.5em 0 !important;
          color: #111827 !important;
          line-height: 1.2 !important;
        }
        
        .article-content h2 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin: 1.5em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.3 !important;
        }
        
        .article-content h3 {
          font-size: 1.75rem !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.5em 0 !important;
          color: #374151 !important;
          line-height: 1.4 !important;
        }
        
        .article-content h4 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.5em 0 !important;
          color: #4b5563 !important;
          line-height: 1.4 !important;
        }
        
        .article-content h5 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.5em 0 !important;
          color: #6b7280 !important;
          line-height: 1.4 !important;
        }
        
        /* 重置所有可能影响content-subtitle的样式 */
        .article-content p {
          margin: 0;
          padding: 0;
          font-size: inherit;
          font-weight: inherit;
        }
        
        /* 为content-subtitle设置统一且具体的样式 */
        .article-content .content-subtitle {
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          display: block !important;
          line-height: 1.4 !important;
          margin: 1.5em 0 0.5em 0 !important;
        }
        
        /* 移除所有特殊情况下的样式覆盖 */
        .article-content h2 .content-subtitle,
        .article-content h3 .content-subtitle,
        .article-content p .content-subtitle {
          font-size: 24px !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.5em 0 !important;
        }
      `}</style>
    </>
  );
};

export default KeyResultsWithTextBlock;