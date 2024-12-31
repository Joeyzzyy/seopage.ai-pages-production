'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const FAQs = ({ data, theme = 'normal' }) => {
  const styles = themeConfig[theme];

  return (
    <div className={`${styles.section.background.secondary} ${styles.section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`${styles.typography.h2.fontSize} ${styles.typography.h2.fontWeight} ${styles.typography.h2.color} text-center mb-12`}>
          {data.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.bottomContent.map((faq, index) => (
            <div key={index} className={`${styles.card.variants.primary} ${styles.card.padding.md}`}>
              <h3 className={`${styles.typography.h3.fontSize} ${styles.typography.h3.fontWeight} ${styles.typography.h3.color} mb-4`}>
                {faq.question}
              </h3>
              <p className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} whitespace-pre-line`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;