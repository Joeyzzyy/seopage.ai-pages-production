'use client';

import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const ProductBenefitsWithFourBlocks = ({ data, theme = 'normal' }) => {
  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };

  const getButtonStyle = () => {
    return `${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.secondary}`;
  };

  const getModuleStyle = (index) => {
    return `${themeConfig[theme].card.base} ${themeConfig[theme].card.variants.primary}`;
  };

  return (
    <div className={`
      ${getBgColor()}
      ${themeConfig[theme].section.padding.base}
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-2/5">
            <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
              {data.leftContent.title}
            </h2>
            <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-6 whitespace-pre-line`}>
              {data.leftContent.description}
            </p>
            <a 
              href={data.leftContent.buttonLink?.startsWith('http') 
              ? data.leftContent.buttonLink 
              : `https://${data.leftContent.buttonLink}` || '#'}
              className={getButtonStyle()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.leftContent.buttonText}
            </a>
          </div>

          <div className="w-full md:w-3/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.rightContent.map((module, index) => (
                <div 
                  key={index} 
                  className={`${getModuleStyle(index)} ${themeConfig[theme].card.padding.md}`}
                >
                  {module.icon && (
                    <div className="text-2xl mb-2">
                      {module.icon}
                    </div>
                  )}
                  <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-2`}>
                    {module.title}
                  </h3>
                  <h4 className={`${themeConfig[theme].typography.h4.fontSize} ${themeConfig[theme].typography.h4.fontWeight} ${themeConfig[theme].typography.h4.color} mb-2`}>
                    {module.subTitle}
                  </h4>
                  <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} whitespace-pre-line`}>
                    {module.content}
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

export default ProductBenefitsWithFourBlocks;