'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';
import Image from 'next/image';

const TitleSectionWithImage = ({ data, author, theme = 'normal' }) => {
  const containsChinese = (text) => {
    return /[\u4e00-\u9fa5]/.test(text);
  };

  const styles = themeConfig[theme];

  const getImageContainerStyle = () => {
    return theme === 'tech'
      ? `relative w-full pt-[75%] rounded-lg overflow-hidden ${styles.card.variants.primary}`
      : `relative w-full pt-[75%] rounded-lg overflow-hidden ${styles.card.variants.primary}`;
  };

  const isChineseTitle = containsChinese(data?.title || '');
  const authorLabel = isChineseTitle ? '作者' : 'WRITTEN BY';
  const dateLabel = isChineseTitle ? '发布日期' : 'PUBLISHED ON';

  return (
    <div className={`
      relative z-10 
      ${styles.section.background.primary} 
      ${styles.section.padding.base} 
      flex items-center
    `}>
      <header className="w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full md:w-1/2">
              <div className="max-w-xl">
                {data?.title && (
                  <h1 className={`${styles.typography.h1.fontSize} ${styles.typography.h1.fontWeight} ${styles.typography.h1.color} mb-4`}>
                    {data.title}
                  </h1>
                )}
                
                {data?.subTitle && (
                  <h2 className={`${styles.typography.h3.fontSize} ${styles.typography.h3.fontWeight} ${styles.typography.h3.color} mb-6`}>
                    {data.subTitle}
                  </h2>
                )}
                
                <div className="flex gap-8">
                  {data?.leftContent.author && (
                    <div>
                      <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                        {authorLabel}
                      </span>
                      <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                        {data.leftContent.author}
                      </span>
                    </div>
                  )}
                  {data?.leftContent.publishDate && (
                    <div>
                      <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                        {dateLabel}
                      </span>
                      <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                        {data.leftContent.publishDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className={getImageContainerStyle()}>
                {data?.rightContent?.imageUrl && (
                  <Image 
                    src={data.rightContent.imageUrl}
                    alt={data.rightContent.imageAlt || ''}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>  
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TitleSectionWithImage;