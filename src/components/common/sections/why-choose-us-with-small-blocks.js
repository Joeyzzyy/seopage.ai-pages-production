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
        <div className="text-center mb-12">
          <h2 className={`text-4xl ${currentTheme.typography.h2.fontWeight} ${currentTheme.typography.h2.color} mb-3`}>
            {title}
          </h2>
          <p className={`text-base ${currentTheme.typography.paragraph.color} max-w-2xl mx-auto`}>
            {description}
          </p>
        </div>

        <div className="flex justify-between items-start">
          {bottomContent.map((module, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 text-center flex flex-col">
                {/* 上层 - 标题 */}
                <div className="mb-3">
                  <p className="text-gray-500 text-sm">{module.topText}</p>
                </div>
                
                {/* 中层 - 主要内容 */}
                <div className="mb-3">
                  <div className="text-3xl font-semibold">
                    {module.middleText}
                  </div>
                </div>
                
                {/* 下层 - 描述 */}
                <div>
                  <p className="text-gray-500 text-sm">{module.bottomText}</p>
                </div>
              </div>
              {index < bottomContent.length - 1 && (
                <div className="h-32 w-px bg-gray-200 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsWithSmallBlocks;