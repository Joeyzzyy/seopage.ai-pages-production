'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const HeroSectionWithMultipleTexts = ({ data, theme = 'normal' }) => {
  const currentTheme = themeConfig[theme];
  const [isMainlandChina, setIsMainlandChina] = React.useState(false);

  React.useEffect(() => {
    // 检测语言
    const isZhCN = navigator.language === 'zh-CN' || 
                   navigator.language === 'zh' || 
                   navigator.language.toLowerCase().startsWith('zh-hans');

    // 检测中国大陆常用时区
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const chinaPossibleTimezones = [
      'Asia/Shanghai',
      'Asia/Urumqi',
      'Asia/Chongqing',
      'Asia/Harbin',
      'Asia/Beijing'
    ];
    const isChineseTimezone = chinaPossibleTimezones.includes(timeZone);

    // 额外检测方法：尝试访问 Google 服务
    const checkGoogleAccess = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
        
        const response = await fetch('https://www.google.com/generate_204', {
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        // 如果能访问 Google，很可能不是在中国大陆
        setIsMainlandChina(isZhCN && isChineseTimezone && !response.ok);
      } catch (error) {
        // 如果访问超时或失败，配合语言和时区判断
        setIsMainlandChina(isZhCN && isChineseTimezone);
      }
    };

    checkGoogleAccess();
  }, []);

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
        w-[98%] mx-auto rounded-2xl
      `}>
        <div className="max-w-[90%] mx-auto px-4">
          <div className="relative z-10 pt-8 md:pt-12">
            <div className="max-w-[90%] mx-auto">
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                  {data.topContent.title}
                </h1>
              </div>
              
              <h2 className={`text-center text-xl md:text-2xl font-normal text-white pt-6 max-w-3xl mx-auto`}>
                {data.topContent.subTitle}
              </h2>
              
              <div className="pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                {data.topContent.showButton && (
                  <button 
                    onClick={handleButtonClick('demo')}
                    className={`w-full md:w-auto px-12 py-4 text-lg rounded-full font-semibold transition-all duration-200 ${currentTheme.button.base} bg-transparent text-white border-2 border-white hover:scale-105`}
                  >
                    {data.topContent.buttonText}
                  </button>
                )}
                
                {data.topContent.showCtaButton && (
                  <button 
                    onClick={handleButtonClick('getStarted')}
                    className={`w-full md:w-auto px-12 py-4 text-lg rounded-full font-semibold transition-all duration-200 ${currentTheme.button.base} ${currentTheme.button.variants.primary} hover:scale-105`}
                  >
                    {data.topContent.ctaButtonText}
                  </button>
                )}

                {/* Discord 按钮 */}
                {data.topContent.enableDiscord && data.topContent.discordLink && (
                  <a
                    href={data.topContent.discordLink}
                    target="_blank"
                    className="group relative w-full md:w-auto inline-flex items-center justify-center px-12 py-4 text-lg rounded-full font-semibold 
                    transition-all duration-300 
                    bg-[#5865F2] text-white overflow-hidden
                    hover:bg-[#4752C4] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(88,101,242,0.6)]
                    active:scale-95
                    border-2 border-white/30 hover:border-white
                    before:content-[''] before:absolute before:w-12 before:h-full before:top-0 before:-left-10
                    before:bg-white/20 before:blur-[2px] before:-skew-x-30
                    before:transition-transform before:duration-700
                    hover:before:translate-x-[400px]
                    after:content-[''] after:absolute after:w-full after:h-full after:top-0 after:left-0
                    after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent
                    after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[#5865F2] opacity-50 blur-2xl transition-all duration-300 group-hover:opacity-70"></div>
                    <div className="relative flex items-center will-change-transform">
                      <svg 
                        className="w-6 h-6 mr-2 transition-all duration-300 group-hover:rotate-12 will-change-transform" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="relative overflow-hidden will-change-transform">
                        Join Discord
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white/80 transition-all duration-300 
                          group-hover:w-full group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
                      </span>
                    </div>
                  </a>
                )}

                {/* Product Hunt Widget */}
                {data.topContent.enableProductHunt && data.topContent.productHuntId && (
                  <a 
                    href={`https://www.producthunt.com/posts/${data.topContent.productHuntId}`}
                    target="_blank"
                    className="w-full md:w-auto flex justify-center transition-transform duration-200 hover:scale-105"
                  >
                    {/* 默认显示大陆版本按钮，仅在确认非大陆地区时显示 PH 官方按钮 */}
                    {isMainlandChina === false ? (
                      <img 
                        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${data.topContent.productHuntId}&theme=light`}
                        alt={`${data.topContent.productHuntId} - Featured on Product Hunt`}
                        style={{ maxWidth: '250px', height: '54px' }}
                        width="250"
                        height="54"
                        className="hidden md:block"
                      />
                    ) : (
                      <div className="h-[54px] px-8 flex items-center gap-3 rounded-full bg-white border-2 border-[#EA532A] hover:bg-[#EA532A]/5 transition-all duration-300 shadow-sm hover:shadow-md">
                        <img 
                          src="/images/product-hunt-logo.png" 
                          alt="Product Hunt Logo" 
                          className="w-8 h-8"
                        />
                        <span className="text-[#EA532A] font-semibold">Featured on Product Hunt</span>
                      </div>
                    )}
                  </a>
                )}
              </div>
            </div>

            <div className="mt-16 w-full flex justify-center">
              <div className="w-[80vw] mx-auto">
                {data.topContent.bannerMediaType === 'video' ? (
                  <video 
                    src={data.topContent.bannerMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-auto object-cover rounded-2xl shadow-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img 
                    src={data.topContent.bannerMedia}
                    alt="Banner"
                    className="w-full h-auto object-cover rounded-2xl shadow-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionWithMultipleTexts;