"use client";

import { FaFacebook, FaDiscord, FaXTwitter, FaYoutube, FaLinkedin, FaInstagram, FaGithub, FaTiktok, FaPinterest, FaReddit, FaTwitch, FaWeibo, FaWhatsapp, FaTelegram, FaMedium, FaSnapchat } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

export default function Footer({ data }) {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  
  useEffect(() => {
  }, [data, subscribeEmail]);

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribeEmail('');
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-8 mb-8">
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

          {data.newsletter.enabled && (
            <div className="px-4">
              <h4 style={{ color: data.colors.newsletterTitle }} className="text-base font-semibold mb-4">
                {data.newsletter.title}
              </h4>
              <p style={{ color: data.colors.newsletterText }} className="text-sm mb-4">
                {data.newsletter.text}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: data.colors.inputBackground,
                    color: data.colors.inputPlaceholder
                  }}
                  className="flex-1 px-4 py-2 rounded-md border border-gray-700 focus:outline-none"
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: data.colors.buttonBackground,
                    color: data.colors.buttonText
                  }}
                  className="px-6 py-2 rounded-md hover:opacity-90 transition-colors font-medium"
                >
                  {data.newsletter.buttonText}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            {data.socialMedia?.links && Object.entries(data.socialMedia.links).map(([key, link]) => {
              if (link && link.platform && link.url) {
                return (
                  <a
                    key={key}
                    href={`https://${link.url}`}
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