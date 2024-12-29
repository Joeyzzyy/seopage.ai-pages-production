'use client'
import React from 'react';
import themeConfig from '@/styles/themeConfig';

const CustomButton = ({ 
  children,
  className = '',
  href,
  theme = 'normal',
  variant = 'secondary',
  size = 'md',
  ...props 
}) => {
  const styles = themeConfig[theme].button;
  
  const buttonClasses = `
    ${styles.base}
    ${styles.variants[variant]}
    ${styles.sizes[size]}
    ${className}
  `.trim();

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
