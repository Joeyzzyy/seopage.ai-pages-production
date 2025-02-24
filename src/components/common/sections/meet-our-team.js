'use client';
import React from 'react';
import { LinkedinOutlined, TwitterOutlined, GlobalOutlined } from '@ant-design/icons';
import themeConfig from '../../../styles/themeConfig';

const MeetOurTeam = ({ data, theme = 'normal' }) => {
  const { typography, section } = themeConfig[theme];

  return (
    <div className={`
      ${section.background.primary} 
      ${section.padding.base}
    `}>
      <div className="max-w-[90%] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-sm text-primary font-semibold mb-4 text-blue-600`}>
            Our Team
          </h2>
          <h3 className={`text-3xl font-bold text-gray-900 mb-4`}>
            {data.topContent.title}
          </h3>
          <p className={`text-base text-gray-600 max-w-2xl mx-auto`}>
            {data.topContent.description}
          </p>
        </div>

        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
            {data.bottomContent.map((member, index) => (
              <div 
                key={index} 
                className={`${section.background.secondary} rounded-lg shadow-sm overflow-hidden hover:bg-blue-50/50 hover:border-blue-200 border border-transparent transition-colors duration-200 min-w-[320px] w-full cursor-pointer ${data.bottomContent.length === 3 ? 'lg:col-span-1' : ''}`}
              >
                <div className="w-full h-[250px] relative pt-4">
                  <img
                    src={member.imageUrl}
                    alt={member.imageAlt}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6 flex flex-col h-[280px]">
                  <div className="flex-grow">
                    <h3 className={`${typography.h3.fontSize} ${typography.h3.fontWeight} ${typography.h3.color} mb-2 hover:text-primary text-left`}>
                      {member.name}
                    </h3>
                    <p className={`${typography.caption.fontSize} ${typography.caption.color} mb-4 text-left`}>
                      {member.title}
                    </p>
                    <p className={`${typography.paragraph.color} mb-6 text-sm leading-relaxed whitespace-pre-line text-left line-clamp-4`}>
                      {member.description}
                    </p>
                  </div>
                  <div className="flex space-x-6">
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        className="text-black hover:text-gray-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedinOutlined className="text-lg" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        className="text-black hover:text-gray-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterOutlined className="text-lg" />
                      </a>
                    )}
                    {member.socials.website && (
                      <a
                        href={member.socials.website}
                        className="text-black hover:text-gray-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GlobalOutlined className="text-lg" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetOurTeam;

