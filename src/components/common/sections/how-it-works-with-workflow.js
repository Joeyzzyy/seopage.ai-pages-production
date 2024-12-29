'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';
import CustomButton from './widget-custom_button';
import buttonLinks from '../../ui/button/links';

const HowItWorksWithWorkflow = ({ data, author, theme = 'normal' }) => {
  const { bottomContent, topContent } = data;
  
  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };
  
  const getButtonLink = () => {
    return buttonLinks.workbench || '#';
  };
  
  return (
    <div className={`${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 md:mb-24">
          {topContent.icon && <div className="text-6xl mb-6">{topContent.icon}</div>}
          <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
            {topContent.title}
          </h2>
          {topContent.subTitle && <h3 className="text-xl text-gray-600 max-w-3xl mx-auto">{topContent.subTitle}</h3>}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-6">
          {bottomContent.map((block, index) => (
            <React.Fragment key={block.number}>
              <div className="flex flex-col items-center text-center w-full md:w-[30%] p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`text-5xl md:text-6xl font-bold mb-6 ${themeConfig[theme].text.color.accent}`}>
                  {block.number}
                </div>
                {block.title && <h4 className="text-xl font-semibold mb-3">{block.title}</h4>}
                {block.subTitle && <h5 className="text-base text-gray-600 mb-4">{block.subTitle}</h5>}
                <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} leading-relaxed`}>
                  {block.content}
                </p>
              </div>
              
              {index < bottomContent.length - 1 && (
                <div className={`hidden md:block text-4xl ${themeConfig[theme].text.color.accent}`}>
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HowItWorksWithWorkflow;