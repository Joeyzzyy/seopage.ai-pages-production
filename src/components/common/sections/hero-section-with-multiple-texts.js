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

  return (
    <div className="py-10">
      <section className={`
        bg-gradient-to-b from-[#3374FF] to-[#1F4699]
        ${currentTheme.section.padding.large}
        w-[95%] mx-auto rounded-2xl
      `}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative z-10 pt-8 md:pt-12">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {data.topContent.title}
              </h1>
            </div>
            
            <h2 className={`text-center text-xl md:text-2xl font-semibold text-white pt-3 max-w-3xl mx-auto`}>
              {data.topContent.subTitle}
            </h2>
            
            <div className="pt-8 flex justify-center gap-4">
              {data.topContent.showButton && (
                <button 
                  onClick={handleButtonClick('demo')}
                  className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${currentTheme.button.base} bg-transparent text-white border-2 border-white hover:scale-105`}
                >
                  {data.topContent.buttonText}
                </button>
              )}
              
              {data.topContent.showCtaButton && (
                <button 
                  onClick={handleButtonClick('getStarted')}
                  className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${currentTheme.button.base} ${currentTheme.button.variants.primary} hover:scale-105`}
                >
                  {data.topContent.ctaButtonText}
                </button>
              )}

              {/* Product Hunt Widget */}
              {data.topContent.enableProductHunt && data.topContent.productHuntId && (
                <a 
                  href={`https://www.producthunt.com/posts/${data.topContent.productHuntId}?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-${data.topContent.productHuntId}`}
                  target="_blank"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <img 
                    src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${data.topContent.productHuntId}&theme=light`}
                    alt={`${data.topContent.productHuntId} - Featured on Product Hunt`}
                    style={{ width: '250px', height: '54px' }}
                    width="250"
                    height="54"
                  />
                </a>
              )}
            </div>

            {/* 修改banner图显示区域，使用data中的图片URL */}
            <div className="mt-12 w-full flex justify-center">
              <img 
                src={data.topContent.bannerImage || "https://picsum.photos/1200/600"}
                alt="Banner"
                className="w-[95%] h-auto object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionWithMultipleTexts;