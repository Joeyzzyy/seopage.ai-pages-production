'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';
import Image from 'next/image';

const KeyResultsWithImage = ({ data, theme = 'normal' }) => {
  const dataSet = data?.leftContent || [];
  const image = data?.rightContent || {};
  const title = data?.title;

  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const getNumberColor = () => {
    return themeConfig[theme].text.color.accent;
  };

  return (
    <div className={`${getBgColor()} py-20`}>
      <div className="max-w-6xl mx-auto px-8 w-[85%]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-20">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {title && (
              <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-1`}>
                {title}
              </h2>
            )}
            {data?.subTitle && (
              <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-8`}>
                {data.subTitle}
              </p>
            )}
            
            <div className="flex flex-col gap-4">
              {dataSet.map((item, index) => (
                <div key={index} className="px-4 py-3 border border-gray-200 rounded-lg">
                  <div className={`${themeConfig[theme].typography.h2.fontSize} font-bold ${getNumberColor()} mb-1`}>
                    {item.percentage}
                  </div>
                  <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full pt-[85%] rounded-lg overflow-hidden bg-white">
              {image.imageUrl && (
                <Image 
                  src={image.imageUrl}
                  alt={image.imageAlt || ''}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyResultsWithImage;