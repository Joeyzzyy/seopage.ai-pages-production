'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';
import { format } from 'date-fns';

const TitleSection = ({ data, author, theme = 'normal', date }) => {
  const styles = themeConfig[theme];

  return (
    <div className={`
      relative z-10 
      ${styles.section.background.primary} 
      ${styles.section.padding.base}
    `}>
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
            {author && (
              <div>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                  WRITTEN BY
                </span>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                  {author}
                </span>
              </div>
            )}
            {date && (
              <div>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} block mb-1 font-medium`}>
                  PUBLISHED ON
                </span>
                <span className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                  {date && format(new Date(date), 'yyyy-MM-dd HH:mm')}
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