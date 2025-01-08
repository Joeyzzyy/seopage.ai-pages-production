'use client';

import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const HowItWorksWithBlocks = ({ data, author, theme = 'normal' }) => {
  const { leftContent, rightContent } = data;
  
  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };

  const getButtonStyle = () => {
    return `${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.secondary} ${themeConfig[theme].button.sizes.md}`;
  };

  const getBlockStyle = () => {
    return `${themeConfig[theme].card.base} ${themeConfig[theme].card.variants.primary} ${themeConfig[theme].card.padding.md}`;
  };

  const getNumberStyle = () => {
    return `${themeConfig[theme].text.color.accent} text-lg font-semibold mb-2`;
  };

  return (
    <div className={`${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-1/3">
            <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
              {leftContent.title}
            </h2>
            <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-6`}>
              {leftContent.content}
            </p>
            <a 
              href={leftContent.buttonLink}
              className={getButtonStyle()}
            >
              {leftContent.buttonText}
            </a>
          </div>

          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {rightContent.map((block, index) => (
                <div key={index} className={getBlockStyle()}>
                  <div className={getNumberStyle()}>
                    {`0${index + 1}`}
                  </div>
                  <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-2`}>
                    {block.contentTitle}
                  </h3>
                  <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                    {block.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksWithBlocks;