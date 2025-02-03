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
  
  const cleanContent = content.replace(/\r\n/g, '\n');
  
  const result = [];
  let currentIndex = 0;
  
  const tagRegex = /<(\/?)(\w+)(?:\s+[^>]*)?>/g;
  let match;
  let stack = [];
  let lastTag = null;
  
  while ((match = tagRegex.exec(cleanContent)) !== null) {
    const [fullMatch, isClosing, tagName] = match;
    
    if (match.index > currentIndex) {
      const text = cleanContent.slice(currentIndex, match.index);
      if (text) {
        result.push({
          type: 'text',
          content: text
        });
      }
    }
    
    const tag = tagName.toLowerCase();
    if (!isClosing) {
      switch (tag) {
        case 'p':
          // 如果上一个标签是 p 的闭合标签，只添加一个换行
          if (lastTag === 'p') {
            result.push({
              type: 'text',
              content: '\n' // 只添加一个换行
            });
          }
          stack.push({
            type: 'p',
            startIndex: result.length
          });
          break;
          
        case 'br':
          result.push({
            type: 'text',
            content: '\n'
          });
          break;
          
        case 'img':
          const src = fullMatch.match(/src="([^"]*)"/)?.[1] || '';
          const alt = fullMatch.match(/alt="([^"]*)"/)?.[1] || '';
          result.push({
            type: 'image',
            src,
            alt
          });
          break;
          
        case 'span':
          const classMatch = fullMatch.match(/class="([^"]*)"/);
          const className = classMatch ? classMatch[1] : '';
          stack.push({
            type: 'span',
            className,
            startIndex: result.length
          });
          break;
          
        case 'video':
          const videoSrc = fullMatch.match(/src="([^"]*)"/)?.[1] || '';
          result.push({
            type: 'video',
            src: videoSrc,
            controls: true,
            preload: 'metadata'
          });
          break;
          
        case 'a':
          stack.push({
            type: 'link',
            href: fullMatch.match(/href="([^"]*)"/)?.[1] || '',
            startIndex: result.length
          });
          break;
          
        case 'strong':
        case 'b':
          stack.push({
            type: 'bold',
            startIndex: result.length
          });
          break;
          
        case 'i':
          stack.push({
            type: 'italic',
            startIndex: result.length
          });
          break;
        
        case 'ul':
        case 'ol':
          stack.push({
            type: 'list',
            startIndex: result.length
          });
          break;
          
        case 'li':
          result.push({
            type: 'text',
            content: '\n• ' // 添加列表项标记
          });
          break;
          
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          result.push({
            type: 'text',
            content: '\n\n'
          });
          stack.push({
            type: 'heading',
            level: parseInt(tag[1]),
            startIndex: result.length
          });
          break;
      }
    } else {
      const openTag = stack.pop();
      if (openTag) {
        const content = result.slice(openTag.startIndex);
        result.length = openTag.startIndex;
        
        switch (tag) {
          case 'p':
            // 添加段落内容
            result.push(...content);
            // 不在这里添加额外的换行，让下一个开始标签处理
            break;
            
          case 'span':
            const textContent = content.map(item => item.content).join('');
            result.push({
              type: 'text',
              content: textContent,
              className: openTag.className
            });
            break;
            
          case 'a':
            result.push({
              type: 'link',
              href: openTag.href,
              content: content.map(item => item.content).join('')
            });
            break;
            
          case 'strong':
          case 'b':
            result.push({
              type: 'bold',
              nested: content.length > 1,
              children: content,
              content: content.map(item => item.content).join('')
            });
            break;
            
          case 'i':
            result.push({
              type: 'italic',
              nested: content.length > 1,
              children: content,
              content: content.map(item => item.content).join('')
            });
            break;
          
          case 'ul':
          case 'ol':
            result.push({
              type: 'text',
              content: '\n'
            });
            break;
          
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            result.push({
              type: 'text',
              content: '\n\n'
            });
            break;
        }
      }
    }
    
    lastTag = tag;
    currentIndex = match.index + fullMatch.length;
  }
  
  // 处理剩余文本
  if (currentIndex < cleanContent.length) {
    result.push({
      type: 'text',
      content: cleanContent.slice(currentIndex)
    });
  }
  
  // 清理连续的换行
  const cleanedResult = [];
  let skipNext = false;
  
  for (let i = 0; i < result.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    
    const current = result[i];
    const next = result[i + 1];
    
    if (current.type === 'text' && next?.type === 'text' &&
        current.content === '\n' && next.content === '\n') {
      // 遇到连续换行时只保留一个
      cleanedResult.push({
        type: 'text',
        content: '\n'
      });
      skipNext = true;
    } else {
      cleanedResult.push(current);
    }
  }
  
  return cleanedResult;
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
              className="text-xl font-bold text-gray-900 block mb-4"
            >
              {part.content}
            </span>
          );
        }
        // 处理换行
        return part.content.split('\n').map((text, i, arr) => (
          <React.Fragment key={`${index}-${i}`}>
            {text}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ));
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
                    <div key={`section-${index}`} className="mb-10 last:mb-0" id={`section-${index}`}>
                      <div className="text-lg md:text-xl leading-[1.8] text-gray-700">
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