'use client';

import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const ProductBenefitsWithATable = ({ data, theme = 'normal' }) => {
  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const getButtonStyle = () => {
    return `${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.secondary}`;
  };

  return (
    <div className={`${getBgColor()} py-12 md:py-16`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <div className="grid border border-gray-200 rounded-lg">
              {data.leftContent.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 border-b last:border-b-0 ${
                    theme === 'tech' 
                      ? `${themeConfig.tech.card.background} hover:bg-gray-50/80 transition-colors` 
                      : `${themeConfig.normal.card.background} hover:bg-gray-50/80 transition-colors`
                  }`}
                >
                  <div className={`w-16 py-2 flex-shrink-0 text-center border-r ${themeConfig[theme].text.icon}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 pl-4">
                    <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color}`}>
                      {item.contentTitle}
                    </h3>
                    <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className={`text-3xl mb-4 ${themeConfig[theme].text.icon}`}>{data.rightContent.icon}</div>
            <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color}`}>
              {data.rightContent.title}
            </h2>
            <p className={`${themeConfig[theme].text.paragraph} ${themeConfig[theme].text.secondary} mb-6`}>
              {data.rightContent.subTitle}
            </p>
            <a 
              href={data.rightContent.buttonLink?.startsWith('http') 
                ? data.rightContent.buttonLink 
                : `https://${data.rightContent.buttonLink}` || '#'}
              className={getButtonStyle()}
            >
              {data.rightContent.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBenefitsWithATable;