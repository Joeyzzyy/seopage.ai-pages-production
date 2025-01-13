'use client';
import React, { useEffect, useRef, useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

// 添加解析HTML字符串的辅助函数
const parseHtmlContent = (htmlString) => {
  if (!htmlString) return [];
  
  const result = [];
  let currentIndex = 0;
  // 修改正则表达式以更准确地匹配 img 标签
  const imgRegex = /<img\s+[^>]*?src="([^"]*)"[^>]*?alt="([^"]*)"[^>]*>/g;
  
  let match;
  while ((match = imgRegex.exec(htmlString)) !== null) {
    // 添加标签前的文本
    if (match.index > currentIndex) {
      const textContent = htmlString.slice(currentIndex, match.index).trim();
      if (textContent) {
        result.push({
          type: 'text',
          content: textContent
        });
      }
    }
    
    // 添加图片
    result.push({
      type: 'image',
      src: match[1],    // 第一个捕获组是 src
      alt: match[2]     // 第二个捕获组是 alt
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // 添加最后剩余的文本
  if (currentIndex < htmlString.length) {
    const textContent = htmlString.slice(currentIndex).trim();
    if (textContent) {
      result.push({
        type: 'text',
        content: textContent
      });
    }
  }
  
  return result;
};

const KeyResultsWithTextBlock = ({ data, theme = 'normal' }) => {
  const { leftContent, rightContent } = data;
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const renderContent = (content) => {
    // 检查内容是否包含 HTML 标签
    const hasHtmlTags = /<[^>]*>/g.test(content);
    
    // 如果是纯文本，直接返回
    if (!hasHtmlTags) {
      return (
        <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-4`}>
          {content}
        </p>
      );
    }

    // 处理 HTML 内容
    const parsedContent = parseHtmlContent(content);
    return parsedContent.map((item, index) => {
      switch (item.type) {
        case 'text':
          return item.content ? (
            <p key={`text-${index}`} className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-4`}>
              {item.content}
            </p>
          ) : null;
        case 'image':
          return (
            <div key={`image-${index}`} className="my-4">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
                onClick={() => setSelectedImage({ src: item.src, alt: item.alt })}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
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
                        {content.contentTitle}
                      </h3>
                      <div className="text-lg md:text-xl leading-[1.8] text-gray-700">
                        {renderContent(content.contentText)}
                      </div>
                    </div>
                  ))}
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
    </>
  );
};

export default KeyResultsWithTextBlock;