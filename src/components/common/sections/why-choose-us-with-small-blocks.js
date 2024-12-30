'use client';

import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const WhyChooseUsWithSmallBlocks = ({ data, theme = 'normal' }) => {
  const { topContent, bottomContent } = data;
  const { icon, title, description } = topContent;
  const currentTheme = themeConfig[theme];

  return (
    <div className={`${currentTheme.section.background.primary} ${currentTheme.section.padding.wide}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {icon && (
            <div className="text-7xl mb-4">{icon}</div>
          )}
          <h2 className={`${currentTheme.typography.h2.fontSize} ${currentTheme.typography.h2.fontWeight} ${currentTheme.typography.h2.color} mb-4`}>
            {title}
          </h2>
          <p className={`${currentTheme.typography.paragraph.fontSize} ${currentTheme.typography.paragraph.color} max-w-2xl mx-auto`}>
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bottomContent.map((module, index) => (
            <div 
              key={index} 
              className={`${currentTheme.card.base} ${currentTheme.card.variants.primary} ${currentTheme.card.padding.lg} group flex flex-col items-center text-center`}
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {module.icon}
              </div>
              <h3 className={`${currentTheme.typography.h3.fontSize} ${currentTheme.typography.h3.fontWeight} ${currentTheme.typography.h3.color} mb-2`}>
                {module.title}
              </h3>
              <p className={`${currentTheme.typography.paragraph.fontSize} ${currentTheme.typography.paragraph.color}`}>
                {module.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsWithSmallBlocks;