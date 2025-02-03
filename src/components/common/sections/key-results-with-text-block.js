'use client';
import React, { useEffect, useRef, useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

// 修改提取标题的函数，返回所有匹配的副标题
const extractContentTitle = (contentText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentText, 'text/html');
  const subtitleSpans = doc.querySelectorAll('span.content-subtitle');
  // 返回所有副标题文本组成的数组
  return Array.from(subtitleSpans).map(span => span.textContent);
};

// 修改 parseHtmlContent 函数以支持链接标签
const parseContent = (content) => {
  if (!content) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
  
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // 处理文本节点，保留换行
      return node.textContent ? [{
        type: 'text',
        content: node.textContent
      }] : [];
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      switch (tagName) {
        case 'p':
          // 处理段落，保持段落间的空行
          const processedNodes = Array.from(node.childNodes).flatMap(processNode);
          return [...processedNodes, { type: 'text', content: '\n' }];
          
        case 'br':
          return [{ type: 'text', content: '\n' }];
          
        case 'img':
          return [{
            type: 'image',
            src: node.getAttribute('src'),
            alt: node.getAttribute('alt') || ''
          }];
          
        case 'a':
          return [{
            type: 'link',
            href: node.getAttribute('href'),
            content: node.textContent
          }];
          
        case 'strong':
        case 'b':
          const boldChildren = Array.from(node.childNodes).flatMap(processNode);
          return [{
            type: 'bold',
            nested: boldChildren.length > 1,
            children: boldChildren,
            content: node.textContent
          }];
          
        case 'span':
          if (node.classList.contains('content-subtitle')) {
            return [{
              type: 'text',
              content: node.textContent,
              className: 'content-subtitle'
            }];
          }
          return Array.from(node.childNodes).flatMap(processNode);
          
        default:
          return Array.from(node.childNodes).flatMap(processNode);
      }
    }
    
    return [];
  };
  
  return Array.from(doc.body.firstChild.childNodes).flatMap(processNode);
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

  // 修改 renderContent 函数以支持链接渲染
  const renderContent = (content) => {
    return content.map((part, index) => {
      if (part.type === 'text') {
        if (part.className === 'content-subtitle') {
          return (
            <span 
              key={index}
              className="content-subtitle text-xl font-bold text-gray-900 block mb-4"
            >
              {part.content}
            </span>
          );
        }
        
        // 确保每个换行都被渲染为 <br>
        if (part.content === '\n') {
          return <br key={index} />;
        }
        
        return <span key={index}>{part.content}</span>;
      }
      switch (part.type) {
        case 'image':
          return (
            <img
              key={`image-${index}`}
              src={part.src}
              alt={part.alt}
              className="max-w-full h-auto my-4 rounded-lg shadow-sm"
              onClick={() => setSelectedImage({ src: part.src, alt: part.alt })}
            />
          );
        
        case 'link':
          return (
            <a
              key={`link-${index}`}
              href={part.href}
              className="text-blue-500 hover:text-blue-700 hover:underline font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.content}
            </a>
          );
        
        case 'video':
          return (
            <div key={`video-${index}`} className="video-container my-4">
              <video
                src={part.src}
                controls={part.controls}
                preload={part.preload}
                className="embedded-video w-full rounded-lg"
              />
            </div>
          );
        
        case 'italic':
          return part.nested ? (
            <i key={`italic-${index}`} className="italic">
              {part.children.map((child, childIndex) => renderContent([child])[0])}
            </i>
          ) : (
            <i key={`italic-${index}`} className="italic">
              {part.content}
            </i>
          );
        
        case 'bold':
          return part.nested ? (
            <b key={`bold-${index}`} className="font-bold">
              {part.children.map((child, childIndex) => renderContent([child])[0])}
            </b>
          ) : (
            <b key={`bold-${index}`} className="font-bold">
              {part.content}
            </b>
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
                <div className="bg-white shadow rounded-lg p-8 mb-4 border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-4">
                    {isChineseContent(rightContent) ? '目录' : 'Table of Contents'}
                  </h3>
                  <ul className="space-y-2">
                    {rightContent.map((content, index) => {
                      const titles = extractContentTitle(content.contentText);
                      return titles.map((title, titleIndex) => (
                        <li key={`toc-${index}-${titleIndex}`}>
                          <button
                            onClick={() => scrollToSection(`section-${index}`)}
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-sm text-left py-2 px-3 w-full rounded-md transition-all duration-200"
                          >
                            {title}
                          </button>
                        </li>
                      ));
                    })}
                  </ul>
                </div>

                {shouldShowKeyResults() && (
                  <div className="bg-white shadow rounded-lg p-8 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">
                      {isChineseContent(rightContent) ? '关键指标' : 'Key Results'}
                    </h3>
                    {leftContent
                      .filter(result => result.display)
                      .map((result, index) => (
                        <div key={index} className="mb-8 last:mb-0 hover:bg-gray-50 p-4 rounded-md transition-all duration-200">
                          <div className="text-6xl font-bold mb-2 text-blue-600">
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
                    <div 
                      key={`section-${index}`} 
                      id={`section-${index}`}
                      className="mb-10 last:mb-0"
                    >
                      <div className="text-lg md:text-xl leading-[1.8] text-gray-700 whitespace-pre-line">
                        {renderContent(parseContent(content.contentText))}
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