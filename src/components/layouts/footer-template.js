"use client";

import { FaFacebook, FaDiscord, FaXTwitter, FaYoutube, FaLinkedin, FaInstagram, FaGithub, FaTiktok, FaPinterest, FaReddit, FaTwitch, FaWeibo, FaWhatsapp, FaTelegram, FaMedium, FaSnapchat } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

export default function Footer({ data }) {
  useEffect(() => {
    console.log('Footer socialMedia data:', data?.socialMedia);
  }, [data]);

  const socialIcons = {
    twitter: FaXTwitter,
    youtube: FaYoutube,
    linkedin: FaLinkedin,
    discord: FaDiscord,
    facebook: FaFacebook,
    instagram: FaInstagram,
    github: FaGithub,
    tiktok: FaTiktok,
    pinterest: FaPinterest,
    reddit: FaReddit,
    twitch: FaTwitch,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    medium: FaMedium,
    snapchat: FaSnapchat
  };

  const renderSocialIcon = (platform) => {
    const Icon = socialIcons[platform];
    if (!Icon) return null;
    return <Icon className="h-6 w-6" />;
  };

  if (!data) {
    return null;
  }

  return (
    <footer style={{
      backgroundColor: data.styles.backgroundType === 'gradient'
        ? `linear-gradient(${data.styles.gradientAngle}deg, ${data.styles.gradientStart}, ${data.styles.gradientEnd})`
        : data.styles.backgroundColor
    }}>
      <div className="w-[80%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mb-8">
          <div className="px-4">
            <h3 style={{ color: data.colors.companyName }} className="text-xl font-semibold mb-4">
              {data.companyName}
            </h3>
            <p style={{ color: data.colors.description }} className="text-sm mb-4">
              {data.description}
            </p>
          </div>
          
          <div className="px-4">
            <h4 style={{ color: data.colors.featuresTitle }} className="text-base font-semibold mb-4">
              {data.features.title}
            </h4>
            <ul className="space-y-2">
              {data.features.items.map((feature, index) => (
                <li key={index}>
                  <a 
                    href={feature.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: data.colors.featureLinks }}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {feature.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            {data.socialMedia?.links && Object.entries(data.socialMedia.links).map(([key, link]) => {
              if (link && link.platform && link.url) {
                return (
                  <a
                    key={key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: data.socialMedia?.iconColor || '#9CA3AF' }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {renderSocialIcon(link.platform)}
                  </a>
                );
              }
              return null;
            })}
          </div>
          
          <p style={{ color: data.colors.copyright }} className="text-sm">
            {data.copyright || `© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}