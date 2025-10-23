'use client';
import React from 'react';

// 样式定义
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  html { scroll-behavior: smooth; }
`;

export const BlogHeader = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 select-none transition-all duration-300 shadow-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo区域 - 左侧 */}
            <a 
              href="https://seopage.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:scale-105 transition-transform duration-200 flex items-center"
            >
              <img 
                src="/images/seopageai-logo.png"
                alt="SEOPAGE.AI" 
                className="h-6 w-auto sm:h-7 md:h-8"
                style={{
                  imageRendering: 'crisp-edges',
                  imageRendering: '-webkit-optimize-contrast'
                }}
              />
            </a>

            {/* CTA 按钮 - 右侧 */}
            <a 
              href="https://seopage.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 hover:border-blue-700 px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Generate 5 pages for free
            </a>
          </div>
        </div>
      </header>
      
      {/* 占位元素 */}
      <div className="h-16"></div>
      
      <style>{animationStyles}</style>
    </> 
  );
};
