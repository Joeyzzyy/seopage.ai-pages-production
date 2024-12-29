'use client';
import React from 'react';
import { Input } from 'antd';
import themeConfig from '../../../styles/themeConfig';

const CallToActionWithInput = ({ data, theme = 'normal' }) => {
  const { typography, section } = themeConfig[theme];

  return (
    <div className={`${section.background.primary} ${section.padding.base} flex items-center justify-center px-4`}>
      <div className="max-w-4xl w-full space-y-6">
        <div className={`${section.background.secondary} rounded-2xl p-8 relative overflow-hidden`}>
          <div className="relative z-10">
            <h2 className={`${typography.h2.fontSize} ${typography.h2.fontWeight} ${typography.h2.color} mb-6 text-center`}>
              {data.title}
            </h2>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder={data?.bottomContent?.inputPlaceholder || '请输入'}
                className="flex-1 bg-white border-none text-sm h-[52px] px-6"
              />
              <button className={`${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.primary}`}>
                {data?.buttonText || '提交'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionWithInput;

