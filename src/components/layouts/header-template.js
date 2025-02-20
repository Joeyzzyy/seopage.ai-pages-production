"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header({ data }) {
  const [state, setState] = useState({
    isOpen: false,
    activeDropdown: null
  });

  if (!data) {
    return <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow h-[4.2rem]" />;
  }

  const router = useRouter();
  
  const handleRedirect = (url, e) => {
    e.preventDefault();
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    window.open(cleanUrl, '_blank');
  };

  const renderActionItem = (item) => {
    if (!item?.key || !item?.label) return null;

    const buttonStyles = item.variant === 'button' 
      ? 'px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer' 
      : 'hover:text-[#3374FF] cursor-pointer';

    const inlineStyles = item.variant === 'button' 
      ? {
          backgroundColor: item.backgroundColor,
          color: item.textColor
        }
      : {};

    if (item.isExternal) {
      return (
        <a
          key={item.key}
          href={item.href}
          className={`text-[15px] font-medium ${buttonStyles} transition-all duration-300`}
          style={inlineStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.label}
        </a>
      );
    }

    return (
      <a
        key={item.key}
        onClick={(e) => handleRedirect(item.href, e)}
        className={`text-[15px] font-medium ${buttonStyles} transition-all duration-300`}
        style={inlineStyles}
      >
        {item.label}
      </a>
    );
  };

  const renderMenuItem = (item) => {
    if (!item?.label) return null;

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const menuItemStyles = {
      color: item.color || 'text-gray-600',
      fontWeight: item.fontWeight || 'normal'
    };
    
    return (
      <div 
        key={item.key || item.label}
        className="relative group"
      >
        {hasChildren ? (
          <a
            href={item.link || '#'}
            style={menuItemStyles}
            className="text-[15px] hover:text-[#1890ff] transition-all duration-300 flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        ) : (
          <a
            href={item.link || `#${item.label.toLowerCase()}`}
            style={menuItemStyles}
            className="text-[15px] hover:text-[#1890ff] transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        )}

        {hasChildren && (
          <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 w-40 bg-white shadow-lg rounded-lg py-1 mt-1 transition-all duration-200">
            {item.children.map((child) => (
              <a
                key={child.key || child.label}
                href={child.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1890ff] hover:bg-gray-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleMobileMenuItemClick = (href) => {
    if (!href) return;
    setState({ ...state, isOpen: false });
    window.open(href, '_blank');
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: data.styles.backgroundType === 'gradient'
          ? `linear-gradient(${data.styles.gradientAngle}deg, ${data.styles.gradientStart}, ${data.styles.gradientEnd})`
          : data.styles.backgroundColor
      }}
    >
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex items-center justify-between h-[4.2rem]">
          <div className="flex-shrink-0 flex items-center h-full">
            <a href="/" className="flex items-center h-full py-2" target="_blank" rel="noopener noreferrer">
              {data?.logo ? (
                <Image
                  src={data.logo.src}
                  alt={data.logo.alt}
                  width={data.logo.width}
                  height={data.logo.height}
                  className="object-contain"
                  style={{  
                    width: `${data.logo.width}px`,
                    height: `${data.logo.height}px`
                  }}
                  quality={100}
                  priority
                />
              ) : null}
            </a>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            {data?.mainMenuItems && (
              <div className="flex gap-8">
                {data.mainMenuItems?.length > 0 ? (
                  data.mainMenuItems.map(renderMenuItem)
                ) : null}
              </div>
            )}
          </div>

          {data?.actionItems && (
            <div className="hidden md:flex items-center gap-4">
              {data.actionItems?.length > 0 ? (
                data.actionItems.map(renderActionItem)
              ) : null}
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setState({ ...state, isOpen: !state.isOpen })}
              className="p-2 rounded-md cursor-pointer"
            >
              <span className="sr-only">Open menu</span>
              {!state.isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {state.isOpen && (
          <div className="md:hidden absolute top-[4.2rem] left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="py-4 px-6">
              <div className="space-y-3">
                {data.mainMenuItems?.length > 0 ? (
                  data.mainMenuItems.map((item) => (
                    <div key={item.label} className="space-y-2">
                      {item.link ? (
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleMobileMenuItemClick(item.link);
                          }}
                          className="block text-[15px] font-medium cursor-pointer"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <div className="text-[15px] font-medium">{item.label}</div>
                      )}
                      
                      {item.children?.length > 0 && (
                        <div className="pl-4 space-y-2">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMobileMenuItemClick(child.href);
                              }}
                              className="block text-sm text-gray-600 hover:text-[#3374FF] cursor-pointer"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : null}
              </div>
              
              <div className="my-4 border-t border-gray-100"></div>
              
              <div className="space-y-3">
                {data.actionItems?.length > 0 ? (
                  data.actionItems.map((item) => (
                    <div key={item.key}>
                      {renderActionItem(item)}
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}