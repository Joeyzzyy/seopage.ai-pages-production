'use client';
import React, { useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

const FAQTwoColumnsWithSmallTitle = ({ data, theme = 'normal' }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const styles = themeConfig[theme];
  const isChineseContent = (content) => /[\u4e00-\u9fa5]/.test(content[0]?.question);

  return (
    <div className={`${styles.section.background.primary} ${styles.section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-1/3">
            <div className={`inline-flex items-center px-3 h-6 rounded-md text-sm font-medium ${styles.button.variants.primary}`}>
              FAQ
            </div>
            <h2 className={`${styles.typography.h2.fontSize} ${styles.typography.h2.fontWeight} ${styles.typography.h2.color}`}>
              {isChineseContent(data.bottomContent) ? '常见问题解答' : 'Frequently asked questions'}
            </h2>
          </div>

          <div className="w-full md:w-2/3">
            {data.bottomContent.map((faq, index) => (
              <div key={index} className={`border-b ${styles.card.variants.primary} ${styles.card.padding.md}`}>
                <button
                  className="w-full py-4 flex justify-between items-center text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className={`${styles.typography.h3.fontSize} ${styles.typography.h3.fontWeight} ${styles.typography.h3.color}`}>
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 ${styles.text.color.accent} transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                }`}>
                  <p className={`${styles.typography.paragraph.fontSize} ${styles.typography.paragraph.color}`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQTwoColumnsWithSmallTitle;