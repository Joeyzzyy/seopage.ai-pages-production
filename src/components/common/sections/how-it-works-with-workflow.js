'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const HowItWorksWithWorkflow = ({ data, theme = 'normal' }) => {
  const { bottomContent, topContent } = data;
  
  const commonStyles = {
    heading: `${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color}`,
    paragraph: `${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`,
    accent: themeConfig[theme].text.color.accent
  };

  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };
  
  return (
    <div className={`
      bg-[#e6eeff]
      ${themeConfig[theme].section.padding.base}
      py-16 md:py-24
    `}>
      <div className="w-[80%] mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Section */}
          <div className="w-full md:w-1/2">
            <h2 className={`${commonStyles.heading} mb-2`}>
              {topContent.title}
            </h2>
            {topContent.description && (
              <p className="text-gray-500 text-lg mb-8">
                {topContent.description}
              </p>
            )}
            {topContent.subTitle && (
              <h3 className="text-xl text-gray-600 leading-relaxed mb-6">
                {topContent.subTitle}
              </h3>
            )}
            {/* Example Image */}
            <div className="mb-8 aspect-[4/3] overflow-hidden rounded-xl">
              <img 
                src={topContent.imageUrl}
                alt={topContent.imageAlt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Button Group */}
            {(topContent.showButton || topContent.showCtaButton) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {topContent.showButton && (
                  <a
                    href={topContent.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium
                      hover:bg-blue-700 transition-colors duration-300 text-center">
                    {topContent.buttonText}
                  </a>
                )}
                {topContent.showCtaButton && (
                  <a
                    href={topContent.ctaButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 text-blue-600 font-medium hover:text-blue-700 
                      transition-colors duration-300 flex items-center">
                    {topContent.ctaButtonText}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 md:flex md:items-center">
            <div className="flex flex-col divide-y divide-gray-200">
              {bottomContent.map((block, index) => (
                <div key={block.number} 
                  className="flex gap-6 py-8 first:pt-0 last:pb-0">
                  <div className="text-lg font-medium text-gray-900 shrink-0 w-12">
                    {block.number}
                  </div>
                  <div>
                    {block.title && (
                      <h4 className="text-lg font-semibold mb-2 tracking-wide">
                        {block.title}
                      </h4>
                    )}
                    {block.subTitle && (
                      <h5 className="text-base text-gray-500 mb-2">
                        {block.subTitle}
                      </h5>
                    )}
                    <p className={`${commonStyles.paragraph} leading-relaxed 
                      whitespace-pre-line`}>
                      {block.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksWithWorkflow;