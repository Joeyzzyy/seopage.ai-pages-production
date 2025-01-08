'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const PricingWithThreeCards = ({ data, author, theme = 'normal' }) => {
  const { title, bottomContent } = data;
  
  const getBgColor = () => {
    return theme === 'tech' ? 'bg-indigo-50/50' : 'bg-white';
  };

  const getCardStyle = (featured = false) => {
    const baseCard = themeConfig[theme].card;
    return featured 
      ? `${baseCard.base} ${baseCard.variants.featured} ${baseCard.padding.lg}`
      : `${baseCard.base} ${baseCard.variants.primary} ${baseCard.padding.lg}`;
  };

  const getButtonStyle = (featured = false) => {
    const baseButton = themeConfig[theme].button;
    return featured
      ? `w-full ${baseButton.base} ${baseButton.variants.primary} ${baseButton.sizes.sm}`
      : `w-full ${baseButton.base} ${baseButton.variants.secondary} ${baseButton.sizes.sm}`;
  };

  const getPriceStyle = () => {
    return `text-4xl font-bold ${themeConfig[theme].text.color.accent}`;
  };

  const getFeatureStyle = () => {
    return `flex items-center ${themeConfig[theme].text.color.primary}`;
  };

  const renderPricingCard = (plan, featured = false) => (
    <div className={getCardStyle(featured)}>
      {featured && (
        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${themeConfig[theme].button.variants.primary}`}>
          Most Popular
        </div>
      )}
      
      <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-4`}>
        {plan.title}
      </h3>
      <div className={getPriceStyle()}>
        {plan.price}
      </div>
      <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mt-2 mb-6`}>
        {plan.description}
      </p>
      
      <a 
        href={plan.buttonLink || '#'}
        className={getButtonStyle(featured)}
      >
        {plan.buttonText}
      </a>

      <div className="mt-8 space-y-4">
        {plan.features.map((feature, index) => (
          <div key={index} className={getFeatureStyle()}>
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${themeConfig[theme].section.background.primary} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} text-center mb-12`}>
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderPricingCard(bottomContent.planOne)}
          {renderPricingCard(bottomContent.planTwo, true)}
          {renderPricingCard(bottomContent.planThree)}
        </div>
      </div>
    </div>
  );
};

export default PricingWithThreeCards;