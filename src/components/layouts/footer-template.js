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
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-white font-semibold mb-4">{data.companyName}</h3>
            <p className="text-gray-300 text-sm">{data.description}</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              {data.features.map((feature, index) => (
                <li key={index}>
                  <a 
                    href={feature.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    {feature.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-start-5">
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              {data.newsletter?.text}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg sm:rounded-r-none bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg sm:rounded-l-none hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {data.newsletter?.buttonText || 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex justify-center md:justify-start">
            <div className="flex space-x-6">
              {Object.entries(data.socialMedia || {}).map(([platform, url]) => 
                renderSocialIcon(platform, url)
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}