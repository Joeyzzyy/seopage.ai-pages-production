'use client';
import React, { useRef, useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

const HeroSectionWithVideo = ({ data, theme = 'normal', buttonLink = '#' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const topContent = data?.topContent || {};
  const currentTheme = themeConfig[theme];

  // Debug log to check what data we're receiving
  console.log('topContent:', topContent);

  const handleVideoStateChange = (e) => {
    const video = e.target;
    console.log('Video state changed:', video.paused ? 'paused' : 'playing');
    setIsPlaying(!video.paused);
  };

  return (
    <div className={`relative w-full ${currentTheme.section.background.primary}`}>
      <div className="w-[95%] mx-auto relative">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {/* Video */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
            src={topContent.videoUrl}
            autoPlay
            loop
            playsInline
            controls
            muted
            onPlay={handleVideoStateChange}
            onPause={handleVideoStateChange}
          />

          {/* Overlay content - 从顶部20%开始，高度为40% */}
          {!isPlaying && (
            <div className="absolute top-[20%] left-0 right-0 h-[40%] z-20 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-center">
              <div className="text-center p-6 max-w-2xl">
                {topContent.title && (
                  <h1 className="text-white text-4xl font-bold mb-4">
                    {topContent.title}
                  </h1>
                )}
                
                {topContent.description && (
                  <p className="text-white mb-6 whitespace-pre-line">
                    {topContent.description}
                  </p>
                )}
                
                {topContent.buttonText && (
                  <a 
                    href={topContent.buttonLink?.startsWith('http') 
                      ? topContent.buttonLink 
                      : `https://${topContent.buttonLink}` || buttonLink}
                    className={`${currentTheme.button.base} ${currentTheme.button.variants.primary}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {topContent.buttonText}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionWithVideo;
