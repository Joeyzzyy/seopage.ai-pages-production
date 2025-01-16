'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import themeConfig from '../../../styles/themeConfig';

const PageListCard = ({ data, theme = 'normal' }) => {
  const [imageLibraryVisible, setImageLibraryVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  
  const insights = data.bottomContent;

  // Theme related functions
  const getBgColor = () => {
    return themeConfig[theme].section.background.primary;
  };

  const getCardStyle = () => {
    return theme === 'tech'
      ? 'group flex flex-col bg-white rounded-lg border border-indigo-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 cursor-pointer'
      : 'group flex flex-col bg-white rounded-lg border border-gray-200 hover:border-[#3374FF]/20 hover:shadow-lg transition-all duration-200 cursor-pointer';
  };

  const getCaptionColor = () => {
    return theme === 'tech' ? 'text-indigo-600' : 'text-[#3374FF]';
  };

  const getCaptionBgColor = () => {
    return theme === 'tech' ? 'bg-indigo-50' : 'bg-[#3374FF]/10';
  };

  const getTitleHoverColor = () => {
    return theme === 'tech' ? 'group-hover:text-indigo-600' : 'group-hover:text-[#3374FF]';
  };

  const getTypographyStyles = () => {
    const typography = themeConfig[theme].typography;
    return {
      title: `${typography.h2.fontSize} ${typography.h2.fontWeight} ${typography.h2.color}`,
      subtitle: `${typography.h3.fontSize} ${typography.h3.fontWeight} ${typography.h3.color} mt-2 mb-8`
    };
  };

  return (
    <div className={`w-full ${getBgColor()} py-12 md:py-16`}>
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2 className={`${getTypographyStyles().title} text-center`}>
            {data.title}
          </h2>
        )}
        {data.subTitle && (
          <h3 className={`${getTypographyStyles().subtitle} text-center`}>
            {data.subTitle}
          </h3>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <a 
              key={index}
              href={insight.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={getCardStyle()}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={insight.imageUrl}
                  alt={insight.imageAlt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              
              <div className="flex flex-col flex-grow p-5">
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 text-xs font-medium ${getCaptionColor()} ${getCaptionBgColor()} rounded-full`}>
                    {insight.tag}
                  </span>
                </div>
                
                <h3 className={`text-lg font-semibold text-gray-900 ${getTitleHoverColor()} transition-colors duration-200 line-clamp-2`}>
                  {insight.title}
                </h3>
                
                {insight.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {insight.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Modal implementation will depend on your UI library choice */}
      {imageLibraryVisible && (
        <ImageLibrary
          visible={imageLibraryVisible}
          onSelect={(image) => setSelectedImage(image)}
          onClose={() => {
            setImageLibraryVisible(false);
            setSelectedImage(null);
            setCurrentEditingIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default PageListCard;
