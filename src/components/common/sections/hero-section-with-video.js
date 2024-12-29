'use client';
import React, { useState, useRef } from 'react';
import themeConfig from '../../../styles/themeConfig';

const HeroSectionWithVideo = ({ data, theme = 'normal', buttonLink = '#' }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const topContent = data.topContent;
  const currentTheme = themeConfig[theme];
  
  const getBgColor = () => {
    return currentTheme.section.background.primary;
  };

  const getButtonStyle = () => {
    return `${currentTheme.button.base} ${currentTheme.button.variants.secondary}`;
  };

  const getVideoContainerStyle = () => {
    return theme === 'tech'
      ? `${currentTheme.card.base} ${currentTheme.card.variants.primary}`
      : `${currentTheme.card.base} ${currentTheme.card.variants.plain}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className={`relative ${getBgColor()} ${currentTheme.section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className={`${currentTheme.typography.h1.fontSize} ${currentTheme.typography.h1.fontWeight} ${currentTheme.typography.h1.color} mb-4`}>
            {topContent.title}
          </h1>
          <p className={`${currentTheme.typography.paragraph.fontSize} ${currentTheme.typography.paragraph.color} mb-6 max-w-2xl`}>
            {topContent.subtitle}
          </p>
          <a 
            href={topContent.buttonLink?.startsWith('http') 
              ? topContent.buttonLink 
              : `https://${topContent.buttonLink}` || buttonLink}
            className={getButtonStyle()}
          >
            {topContent.buttonText}
          </a>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className={getVideoContainerStyle()}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={topContent.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionWithVideo;
