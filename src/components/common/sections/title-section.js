'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const TitleSection = ({ data, author, theme = 'normal' }) => {
  const containsChinese = (text) => {
    return /[\u4e00-\u9fa5]/.test(text);
  };

  const styles = themeConfig[theme];
  const isChineseTitle = containsChinese(data?.title || '');
  const authorLabel = isChineseTitle ? '作者' : 'WRITTEN BY';
  const dateLabel = isChineseTitle ? '发布日期' : 'PUBLISHED ON';

  return (
    <div className={`relative z-10 ${styles.section.padding.base} flex items-center ${styles.section.background.primary}`}>
      <header className="w-full">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          {data?.title && (
            <h1 className={`${styles.typography.h1.fontSize} ${styles.typography.h1.fontWeight} ${styles.typography.h1.color} mb-4`}>
              {data.title}
            </h1>
          )}
          {data?.subTitle && (
            <h2 className={`${styles.typography.h2.fontSize} ${styles.typography.h2.fontWeight} ${styles.typography.h2.color} mb-6`}>
              {data.subTitle}
            </h2>
          )}
          <div className="flex justify-center gap-8">
            {data?.bottomContent.author && (
              <div>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                  {authorLabel}
                </span>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                  {author}
                </span>
              </div>
            )}
            {data?.bottomContent.publishDate && (
              <div>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                  {dateLabel}
                </span>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                  {data.bottomContent.publishDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default TitleSection;