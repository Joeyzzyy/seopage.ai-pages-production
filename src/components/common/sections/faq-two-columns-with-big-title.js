'use client';
import React, { useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

const FAQTwoColumnsWithBigTitle = ({ data, theme = 'normal' }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const styles = themeConfig[theme];

  return (
    <div className={`
      ${styles.section.background.primary} 
      ${styles.section.padding.base}
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`${styles.typography.h2.fontSize} ${styles.typography.h2.fontWeight} ${styles.typography.h2.color} text-center mb-12`}>
          {data.title || 'Frequently Asked Questions'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {data.bottomContent.map((faq, index) => (
            <div key={index} className={`${styles.card.variants.primary} ${styles.card.padding.md}`}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className={`${styles.typography.h3.fontSize} ${styles.typography.h3.fontWeight} ${styles.typography.h3.color}`}>
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 ${styles.text.color.accent} transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div>
                  <p className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color} pb-4 whitespace-pre-line`}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQTwoColumnsWithBigTitle;