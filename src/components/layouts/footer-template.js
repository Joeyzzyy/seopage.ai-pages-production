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

  const renderSocialIcon = (platform, url) => {
    const Icon = socialIcons[platform];
    if (!Icon) return null;

    return (
      <a 
        key={platform} 
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors duration-200"
      >
        <Icon className="h-6 w-6" />
      </a>
    );
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          <div className="col-span-2">
            <h3 style={{ color: data.colors.companyName }} className="font-semibold mb-4">
              {data.companyName}
            </h3>
            <p style={{ color: data.colors.description }} className="text-sm">
              {data.description}
            </p>
          </div>
          
          <div>
            <h4 style={{ color: data.colors.featuresTitle }} className="font-semibold mb-4">
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
                    className="hover:text-white text-sm"
                  >
                    {feature.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {data.newsletter.enabled && (
            <div className="col-span-2 md:col-start-5">
              <h4 style={{ color: data.colors.newsletterTitle }} className="font-semibold mb-4">
                {data.newsletter.title}
              </h4>
              <p style={{ color: data.colors.newsletterText }} className="text-sm mb-4">
                {data.newsletter.text}
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: data.colors.inputBackground,
                    color: data.colors.inputPlaceholder
                  }}
                  className="flex-1 px-4 py-3 rounded-lg sm:rounded-r-none border focus:ring-1 focus:outline-none transition-all duration-200"
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: data.colors.buttonBackground,
                    color: data.colors.buttonText
                  }}
                  className="px-6 py-3 rounded-lg sm:rounded-l-none hover:opacity-90 transition-colors duration-200 font-medium"
                >
                  {data.newsletter.buttonText}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}