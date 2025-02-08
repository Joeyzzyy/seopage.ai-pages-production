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
    return `${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.primary}`;
  };

  const getModuleStyle = (index) => {
    return `${themeConfig[theme].card.base} ${themeConfig[theme].card.variants.primary}`;
  };

  return (
    <div className={`
      ${getBgColor()}
      ${themeConfig[theme].section.padding.base}
    `}>
      <div className="w-4/5 mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
            {data.leftContent.title}
          </h2>
          <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-6 whitespace-pre-line max-w-3xl mx-auto`}>
            {data.leftContent.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <h4 className={`${themeConfig[theme].typography.h4.fontSize} ${themeConfig[theme].typography.h4.fontWeight} ${themeConfig[theme].typography.h4.color} mb-4`}>
                {module.subTitle}
              </h4>
              <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} whitespace-pre-line`}>
                {module.content}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
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
      </div>
    </div>
  );
};

export default ProductBenefitsWithFourBlocks;