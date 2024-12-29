'use client';
import React, { useEffect, useRef } from 'react';
import themeConfig from '../../../styles/themeConfig';

// 添加解析HTML字符串的辅助函数
const parseHtmlContent = (htmlString) => {
  if (!htmlString) return [];
  
  const result = [];
  let currentIndex = 0;
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g;
  
  let match;
  while ((match = linkRegex.exec(htmlString)) !== null) {
    // 添加链接前的文本
    if (match.index > currentIndex) {
      result.push({
        type: 'text',
        content: htmlString.slice(currentIndex, match.index)
      });
    }
    
    // 处理链接URL
    let href = match[1];
    // 如果链接不是以 http:// 或 https:// 开头，添加 https://
    if (!href.match(/^https?:\/\//)) {
      href = `https://${href}`;
    }
    
    // 添加链接
    result.push({
      type: 'link',
      href: href,
      content: match[2]
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // 添加最后剩余的文本
  if (currentIndex < htmlString.length) {
    result.push({
      type: 'text',
      content: htmlString.slice(currentIndex)
    });
  }
  
  return result;
};

const KeyResultsWithTextBlock = ({ data, theme = 'normal' }) => {
  const { leftContent, rightContent } = data;
  const containerRef = useRef(null);
  const stickyRef = useRef(null);

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
      
      const stopPosition = containerBottom - stickyRect.height;
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

  const isChineseContent = (content) => {
    return /[\u4e00-\u9fa5]/.test(content[0]?.contentTitle);
  };

  // 添加检查是否显示 Key Results 模块的函数
  const shouldShowKeyResults = () => {
    if (!leftContent || !Array.isArray(leftContent)) {
      return false;
    }
    return leftContent.some(result => result.display === true);
  };

  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const getBlockStyle = () => {
    return theme === 'tech'
      ? `${themeConfig[theme].card.variants.primary}`
      : `${themeConfig[theme].card.variants.primary}`;
  };

  const getHighlightStyle = () => {
    return themeConfig[theme].text.color.accent;
  };

  const getListItemStyle = () => {
    return themeConfig[theme].text.color.primary;
  };

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return (
        <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
          {content}
        </p>
      );
    }

    const parsedContent = parseHtmlContent(content);
    return parsedContent.map((item, index) => {
      switch (item.type) {
        case 'text':
          return (
            <p key={index} className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-4`}>
              {item.content}
            </p>
          );
        case 'list':
          return (
            <ul key={index} className="space-y-2 mb-4">
              {item.items.map((listItem, i) => (
                <li key={i} className={getListItemStyle()}>
                  <svg className="w-5 h-5 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{listItem}</span>
                </li>
              ))}
            </ul>
          );
        case 'highlight':
          return (
            <span key={index} className={getHighlightStyle()}>
              {item.content}
            </span>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className={`${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-[350px_1fr] gap-20" ref={containerRef}>
          <div className="relative w-[350px]">
            <div ref={stickyRef} className="sticky top-128 inline-block" style={{ width: '350px' }}>
              <div className="bg-gray-50 p-8 rounded-lg mb-4 w-full">
                <h3 className="text-xl font-bold mb-4">
                  {isChineseContent(rightContent) ? '目录' : 'Table of Contents'}
                </h3>
                <ul className="space-y-2">
                  {rightContent.map((content, index) => (
                    <li key={`toc-${index}`}>
                      <button
                        onClick={() => scrollToSection(`section-${index}`)}
                        className="text-gray-600 hover:text-blue-600 text-sm text-left"
                      >
                        {content.contentTitle}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {shouldShowKeyResults() && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-bold mb-6">
                    {isChineseContent(rightContent) ? '关键指标' : 'Key Results'}
                  </h3>
                  {leftContent
                    .filter(result => result.display)
                    .map((result, index) => (
                      <div key={index} className="mb-8 last:mb-0">
                        <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {result.percentage}%
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.description}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <main className="main-content">
              <article className="article max-w-[800px] pr-4">
                {rightContent.map((content, index) => (
                  <div key={index} className="mb-10 last:mb-0" id={`section-${index}`}>
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                      {parseHtmlContent(content.contentTitle).map((part, i) => (
                        part.type === 'link' ? (
                          <a 
                            key={i}
                            href={part.href}
                            className="text-blue-500 hover:text-blue-700 hover:underline font-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {part.content}
                          </a>
                        ) : (
                          <span key={i}>{part.content}</span>
                        )
                      ))}
                    </h3>
                    <div className="text-lg md:text-xl leading-[1.8] text-gray-700 whitespace-pre-line">
                      {parseHtmlContent(content.contentText).map((part, i) => (
                        part.type === 'link' ? (
                          <a 
                            key={i}
                            href={part.href}
                            className="text-blue-500 hover:text-blue-700 hover:underline font-bold"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {part.content}
                          </a>
                        ) : (
                          <span key={i}>{part.content}</span>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </article>            
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyResultsWithTextBlock;