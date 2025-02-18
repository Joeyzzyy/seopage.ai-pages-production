'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const KeyResultsWithThreeCards = ({ data, theme = 'normal' }) => {
  const title = data?.title;
  const comparisons = data?.bottomContent || [];
  
  const isChinese = (str) => {
    return /[\u4e00-\u9fa5]/.test(str);
  };
  
  const buttonText = isChinese(title) ? "查看案例" : "Read Case Study";
  
  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  return (
    <div className={`w-full ${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-between items-center mb-12 min-h-[40px]">
          <h2 className={`text-2xl font-bold ${themeConfig[theme].typography.h2.color}`}>
            {title}
          </h2>
          {data.subTitle && (
            <p className="text-base text-[#2f3337]">{data.subTitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200">
          {comparisons.map((comparison, index) => (
            <div 
              key={index} 
              className={`flex flex-col px-6 ${
                index === 0 ? 'pl-0' : ''
              } ${
                index === comparisons.length - 1 ? 'pr-0' : ''
              }`}
            >
              {comparison.competitorName && (
                <h4 className="text-lg font-semibold text-gray-900 mb-4 min-h-[28px]">
                  {comparison.competitorName}
                </h4>
              )}

              <div className="mb-4 min-h-[80px]">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {comparison.percentage}%
                </div>
                <div className="text-base text-gray-700">
                  {comparison.metric}
                </div>
              </div>

              <p className="text-base text-gray-600 mb-4 leading-6 h-12 line-clamp-2 overflow-hidden">
                {comparison.description}
              </p>

              {comparison.competitorLogo && (
                <div className="w-full aspect-square mb-4">
                  <img 
                    src={comparison.competitorLogo} 
                    alt={comparison.competitorLogoAlt || ''} 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {comparison.buttonText && comparison.buttonLink && (
                <a
                  href={comparison.buttonLink}
                  className="text-base text-blue-600 hover:text-blue-700 font-medium min-h-[24px]"
                >
                  {comparison.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyResultsWithThreeCards;