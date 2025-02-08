'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import themeConfig from '../../../styles/themeConfig';

const WhyChooseUsWithBlocks = ({ data, author, theme = 'normal' }) => {
  const router = useRouter();

  const handleRedirect = (e) => {
    e.preventDefault();
    router.push('https://app.websitelm.com');
  };

  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const getImageStyle = () => {
    return theme === 'tech'
      ? 'w-auto h-auto object-contain rounded-xl border border-blue-100'
      : 'w-auto h-auto object-contain rounded-lg border border-gray-100';
  };

  const getButtonLink = () => {
    return buttonLinks.workbench || '#';
  };

  const { topContent, bottomContent } = data;
  return (
    <div className={`${getBgColor()} py-12 md:py-16`}>
      <div className="max-w-[80%] mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
            {topContent.title}
          </h2>
          <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} max-w-2xl mx-auto`}>
            {topContent.description}
          </p>
        </div>

        {bottomContent.map((content, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12 last:mb-0 items-center">
            {index % 2 === 0 ? (
              <>
                <div className="w-full md:w-1/2 flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-4`}>
                      {content.title}
                    </h3>
                    <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                      {content.content}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open(content.buttonLink, '_blank')}
                    className={`w-fit ${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.primary} ${themeConfig[theme].button.hover} mt-24`}
                  >
                    {content.buttonText}
                  </button>
                </div>
                <div className="w-full md:w-1/2">
                  <img 
                    src={content.imageUrl || '/images/placeholder.png'}
                    alt={content.imageAlt || content.title}
                    className={getImageStyle()}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2">
                  <img 
                    src={content.imageUrl || '/images/placeholder.png'}
                    alt={content.imageAlt || content.title}
                    className={getImageStyle()}
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-4`}>
                      {content.title}
                    </h3>
                    <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                      {content.content}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open(content.buttonLink, '_blank')}
                    className={`w-fit ${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.primary} ${themeConfig[theme].button.hover} mt-24`}
                  >
                    {content.buttonText}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUsWithBlocks;