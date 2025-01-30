'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const HeroSectionWithMultipleTexts = ({ data, theme = 'normal' }) => {
  const currentTheme = themeConfig[theme];

  const handleButtonClick = (type) => (e) => {
    e.preventDefault();
    if (type === 'demo' && data.topContent.buttonLink) {
      window.open(data.topContent.buttonLink, '_blank');
    } else if (type === 'getStarted' && data.topContent.ctaButtonLink) {
      window.open(data.topContent.ctaButtonLink, '_blank');
    }
  };

  const renderTitle = (title, highlightWordCount = 2) => {
    const words = title.split(' ');
    const lastWords = words.slice(-highlightWordCount).join(' ');
    const restOfTitle = words.slice(0, -highlightWordCount).join(' ');

    return (
      <>
        <span className={`${currentTheme.typography.h1.color}`}>
          {restOfTitle}{' '}
        </span>
        <span className={`inline-block -rotate-1 px-2 py-1 bg-gradient-to-r from-[#3374FF]/[0.75] via-[#3374FF]/[0.5] to-[#3374FF]/[0.75] text-white`}>
          {lastWords}
        </span>
      </>
    );
  };

  return (
    <section className={`
      ${currentTheme.section.background.primary} 
      ${currentTheme.section.padding.large}
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative z-10 pt-8 md:pt-12">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              {renderTitle(data.topContent.title, data.topContent.highlightWordCount)}
            </h1>
          </div>
          
          <h2 className={`text-center ${currentTheme.typography.h2.fontSize} ${currentTheme.typography.h2.fontWeight} ${currentTheme.typography.h2.color} pt-3 max-w-3xl mx-auto`}>
            {data.topContent.subTitle}
          </h2>
          
          <div className="pt-8 flex justify-center gap-4">
            {data.topContent.showButton && (
              <button 
                onClick={handleButtonClick('demo')}
                className={`${currentTheme.button.base} ${currentTheme.button.variants.secondary} hover:scale-105`}
              >
                {data.topContent.buttonText}
              </button>
            )}
            
            {data.topContent.showCtaButton && (
              <button 
                onClick={handleButtonClick('getStarted')}
                className={`${currentTheme.button.base} ${currentTheme.button.variants.primary} hover:scale-105`}
              >
                {data.topContent.ctaButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionWithMultipleTexts;