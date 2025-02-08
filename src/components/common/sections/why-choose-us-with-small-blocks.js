'use client';

import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const WhyChooseUsWithSmallBlocks = ({ data, theme = 'normal' }) => {
  const { topContent, bottomContent } = data;
  const { title, description } = topContent;
  const currentTheme = themeConfig[theme];

  return (
    <div className={`
      w-[95%] mx-auto
      bg-[#f5f6f7]
      rounded-2xl
      ${currentTheme.section.padding.base}
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className={`text-2xl md:text-4xl ${currentTheme.typography.h2.fontWeight} ${currentTheme.typography.h2.color} mb-3`}>
            {title}
          </h2>
          <p className={`text-sm md:text-base ${currentTheme.typography.paragraph.color} max-w-2xl mx-auto`}>
            {description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {bottomContent.map((module, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 text-center flex flex-col mb-8 md:mb-0">
                {/* 上层 - 标题 */}
                <div className="mb-2 md:mb-3">
                  <p className="text-gray-500 text-xs md:text-sm">{module.topText}</p>
                </div>
                
                {/* 中层 - 主要内容 */}
                <div className="mb-2 md:mb-3">
                  <div className="text-xl md:text-3xl font-semibold">
                    {module.middleText}
                  </div>
                </div>
                
                {/* 下层 - 描述 */}
                <div>
                  <p className="text-gray-500 text-xs md:text-sm">{module.bottomText}</p>
                </div>
              </div>
              {index < bottomContent.length - 1 && (
                <div className="hidden md:block h-32 w-px bg-gray-200 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsWithSmallBlocks;