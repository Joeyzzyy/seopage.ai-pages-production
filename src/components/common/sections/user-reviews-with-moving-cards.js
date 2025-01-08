'use client';
import React, { useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

const UserReviewsWithMovingCards = ({ data, theme = 'normal' }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const title = data.title;
  const reviews = data.bottomContent;
  const themeStyle = themeConfig[theme];

  const getCardStyle = (position) => {
    const baseStyle = `${themeStyle.card.variants.primary} ${themeStyle.card.padding.md}`;

    return `absolute ${baseStyle} rounded-lg transition-all duration-700 ease-in-out cursor-pointer
      w-[500px] min-h-[220px] 
      ${position === 0 
        ? 'z-20 scale-100 opacity-100 translate-x-0' 
        : position === -1
          ? 'z-10 scale-95 opacity-70 -translate-x-[120%]'
          : position === 1
            ? 'z-10 scale-95 opacity-70 translate-x-[120%]'
            : 'opacity-0 scale-90'
      }`;
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className={`
      ${themeStyle.section.background.primary} 
      ${themeStyle.section.padding.base}
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`${themeStyle.typography.h2.fontSize} ${themeStyle.typography.h2.fontWeight} ${themeStyle.typography.h2.color} text-center mb-8`}>
          {title}
        </h2>

        <div className="relative flex justify-center items-center min-h-[300px] overflow-hidden">
          {reviews.map((review, index) => {
            let position = index - activeIndex;
            if (position < -2) position += reviews.length;
            if (position > 2) position -= reviews.length;
            
            if (position >= -1 && position <= 1) {
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={getCardStyle(position)}
                >
                  <div className="flex justify-end mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill={theme === 'tech' ? 'url(#star-gradient)' : '#3374FF'}
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  <div className="flex items-center mb-4">
                    <img 
                      src={review.avatarUrl}
                      alt={review.avatarAlt}
                      className="w-12 h-12 rounded-full object-contain p-1"
                    />
                    <div className="ml-4">
                      <h3 className={themeStyle.text.color.primary}>{review.name}</h3>
                      <p className={themeStyle.text.color.secondary}>{review.position}</p>
                    </div>
                  </div>
                  
                  <h4 className={`text-lg font-semibold ${themeStyle.text.color.primary} mb-2`}>
                    {review.title}
                  </h4>
                  <p className={`${themeStyle.typography.paragraph.color} whitespace-pre-line`}>
                    {review.content}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default UserReviewsWithMovingCards;