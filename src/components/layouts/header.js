"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/locales/kreado-header-text';

const rightLinkText = {
  en: "Home",
  zh: "首页"
};

export const Navigation = ({ theme = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('en');

  const themeStyles = {
    light: {
      text: 'text-gray-900',
      hoverText: 'hover:text-blue-600',
      mobileText: 'text-gray-900',
    },
    dark: {
      text: 'text-white',
      hoverText: 'hover:text-blue-300',
      mobileText: 'text-white',
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (key) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
    setTimeoutId(newTimeoutId);
  };

  // 移动端菜单切换
  const toggleMobileSubmenu = (key) => {
    setMobileSubmenu(mobileSubmenu === key ? null : key);
  };

  // 监听路径变化并更新当前语言
  useEffect(() => {
    const pathParts = pathname.split('/');
    const lang = pathParts[1] === 'zh' ? 'zh' : 'en';
    setCurrentLang(lang);
  }, [pathname]);

  const handleLanguageChange = (newLang) => {
    const pathParts = pathname.split('/');
    if (currentLang === newLang) return;
    
    pathParts[1] = newLang;
    const newPath = pathParts.join('/');
    window.location.href = newPath;
  };

  // 获取当前语言的菜单项
  const currentMenuItems = menuItems[currentLang];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="max-w-[1450px] mx-auto px-6">
        {/* 主导航 */}
        <div className="flex justify-between h-[4.2rem]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/kreado-logo.webp"
                alt="Kreado Logo"
                width={110}
                height={53}
                className="h-9 w-auto"
                quality={100}
                priority
              />
            </Link>
          </div>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {currentMenuItems.map((item) => (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => item.submenu && handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    target={item.submenu ? undefined : "_blank"}
                    rel={item.submenu ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (item.submenu) {
                        e.preventDefault();
                      }
                    }}
                    className={`text-[15px] font-medium transition-all duration-300 flex items-center ${
                      hasScrolled || activeDropdown
                        ? themeStyles.light.text + ' ' + themeStyles.light.hoverText
                        : themeStyles[theme].text + ' ' + themeStyles[theme].hoverText
                    }`}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.key ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* 桌面端下拉菜单 - 保持原有逻辑 */}
                  {item.submenu && activeDropdown === item.key && (
                    <div 
                      className="fixed top-[4.2rem] left-0 right-0 w-full bg-[#FAFBFF] -mt-[1px]"
                      onMouseEnter={() => handleMouseEnter(item.key)}
                      onMouseLeave={handleMouseLeave}
                    >
                        <div className="max-w-[1450px] mx-auto px-6 py-8">
                            <div className="flex">
                                {/* 左侧区域 - 根据不同的 key 显示不同内容 */}
                                <div className="w-[280px] flex-shrink-0 pr-8 border-r border-gray-200">
                                    {item.key === 'features' ? (
                                        // Features 的原有内容
                                        <>
                                            <Image
                                                src="/images/kreado-header-menu.webp"
                                                width={240}
                                                height={135}
                                                alt="Latest Updates"
                                                className="rounded-lg w-full"
                                            />
                                            <h3 className="text-base font-medium tracking-wide text-gray-700 my-6 flex items-center">
                                                {item.submenu.updates.title}
                                            </h3>
                                            <div className="space-y-4">
                                                {item.submenu.updates.items.map((update, index) => (
                                                    <div key={index}>
                                                        <a 
                                                            href={update.href} 
                                                            className="text-sm text-gray-600/90 hover:text-blue-600 transition-colors duration-200"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {update.title}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        // Resource 的新内容
                                        <>
                                            <h3 className="text-base font-medium tracking-wide text-gray-700 mb-6">
                                                {item.submenu.updates.title}
                                            </h3>
                                            <div className="space-y-3">
                                                {item.submenu.updates.items.map((update, index) => (
                                                    <div key={index}>
                                                        {update.type === "row" ? (
                                                            <div className="flex items-center space-x-4 mt-4">
                                                                {update.items.map((rowItem, rowIndex) => (
                                                                    <Fragment key={rowIndex}>
                                                                        <a 
                                                                            key={`${rowIndex}-${rowItem.title}`}
                                                                            href={rowItem.href} 
                                                                            className="text-sm text-gray-600/90 hover:text-blue-600 transition-colors duration-200 flex items-center"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            {rowItem.title === "HelpCenter" && (
                                                                                <span className="mr-2">🎯</span>
                                                                            )}
                                                                            {rowItem.title === "Email" && (
                                                                                <span className="mr-2">✉️</span>
                                                                            )}
                                                                            {rowItem.title}
                                                                        </a>
                                                                        {rowIndex === 0 && (
                                                                            <div key={`divider-${rowIndex}`} className="h-4 w-px bg-gray-200"></div>
                                                                        )}
                                                                    </Fragment>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <a 
                                                                href={update.href} 
                                                                className="text-sm text-gray-600/90 hover:text-blue-600 transition-colors duration-200 block pb-3 border-b border-gray-100"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {update.title}
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {item.key === 'features' && item.submenu.updates.action && (
                                        <a 
                                            href={item.submenu.updates.action.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 border border-gray-200 text-gray-500 px-6 py-2 rounded-md hover:bg-gray-50/70 hover:border-gray-300 transition-all duration-300 w-full text-center block"
                                        >
                                            {item.submenu.updates.action.label}
                                        </a>
                                    )}
                                </div>
                                
                                {/* 右侧功能区域 */}
                                <div className="flex-1 pl-8">
                                    <div className="flex">
                                        {item.submenu.categories.map((category, categoryIndex) => (
                                            <div 
                                                key={categoryIndex} 
                                                className={`${
                                                    categoryIndex > 0 ? 'ml-8 pl-8 border-l border-gray-200' : ''
                                                } ${
                                                    item.key === "resource" 
                                                        ? 'w-full'
                                                        : category.title === "VIDEO CREATIVE" 
                                                            ? 'w-[45%]' 
                                                            : category.title === "AI TOOLS"
                                                                ? 'w-[30%]'
                                                                : 'w-[25%]'
                                                }`}
                                            >
                                                <h3 className="text-base font-medium tracking-wide text-gray-700 mb-6">{category.title}</h3>
                                                <div className={`grid ${
                                                    item.key === "resource"
                                                        ? 'grid-cols-4'
                                                        : category.title === "VIDEO CREATIVE" 
                                                            ? 'grid-cols-2' 
                                                            : 'grid-cols-1'
                                                } gap-4`}>
                                                    {category.items.map((item, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50/50 transition-all duration-300 cursor-pointer"
                                                            onClick={() => {
                                                                if (item.href) {
                                                                    window.open(item.href, '_blank', 'noopener,noreferrer');
                                                                }
                                                            }}
                                                        >
                                                            <div>
                                                                <h4 className="font-medium text-gray-800 text-sm mb-1">
                                                                    {item.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-500/80">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧链接 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="https://www.kreadoai.com/ai/workbench"
              className={`text-base transition duration-300 ${
                hasScrolled || activeDropdown 
                  ? themeStyles.light.text + ' ' + themeStyles.light.hoverText
                  : themeStyles[theme].text + ' ' + themeStyles[theme].hoverText
              }`}
            >
              {rightLinkText[currentLang]}
            </Link>

            {/* 语言切换器 */}
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded transition-colors duration-200 ${
                  currentLang === 'en' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                EN
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-2 py-1 rounded transition-colors duration-200 ${
                  currentLang === 'zh' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                中文
              </button>
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                hasScrolled ? themeStyles.light.text : themeStyles[theme].text
              }`}
            >
              <span className="sr-only">Open menu</span>
              {!isOpen ? (
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

        {/* 移动端菜单面板 */}
        {isOpen && (
          <div className="md:hidden bg-[#FAFBFF] border-t border-gray-200">
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.key} className="relative">
                    {/* 主菜单项 */}
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        if (item.submenu) {
                          toggleMobileSubmenu(item.key);
                        } else {
                          window.open(item.href, '_blank');
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {item.submenu && (
                        <svg
                          className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                            mobileSubmenu === item.key ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>

                    {/* 移动端子菜单 */}
                    {item.submenu && mobileSubmenu === item.key && (
                      <div className="mt-3 space-y-4">
                        {/* Updates 部分 */}
                        <div className="px-3">
                          {item.key === 'features' && (
                            <div className="mb-4">
                              <Image
                                src="/images/kreado-header-menu.webp"
                                width={160}
                                height={90}
                                alt="Latest Updates"
                                className="rounded-lg w-full max-w-[160px]"
                              />
                            </div>
                          )}
                          <h3 className="text-base font-medium tracking-wide text-gray-700 mb-3">
                            {item.submenu.updates.title}
                          </h3>
                          <div className="space-y-3">
                            {item.submenu.updates.items.map((updateItem, index) => (
                              <div key={index}>
                                {updateItem.type === "row" ? (
                                  <div className="flex items-center space-x-4 mt-4">
                                    {updateItem.items.map((rowItem, rowIndex) => (
                                      <Fragment key={rowIndex}>
                                        <a 
                                          href={rowItem.href} 
                                          className="text-sm text-gray-600/90 hover:text-blue-600 transition-colors duration-200 flex items-center"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {rowItem.title === "HelpCenter" && (
                                            <span className="mr-2">🎯</span>
                                          )}
                                          {rowItem.title === "Email" && (
                                            <span className="mr-2">✉️</span>
                                          )}
                                          {rowItem.title}
                                        </a>
                                        {rowIndex === 0 && (
                                          <div className="h-4 w-px bg-gray-200"></div>
                                        )}
                                      </Fragment>
                                    ))}
                                  </div>
                                ) : (
                                  <a 
                                    href={updateItem.href} 
                                    className="text-sm text-gray-600/90 hover:text-blue-600 transition-colors duration-200 block pb-3 border-b border-gray-100"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {updateItem.title}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Categories 部分 */}
                        {item.submenu.categories.map((category, index) => (
                          <div key={index} className="border-t border-gray-100 pt-4">
                            <div className="px-3">
                              <h3 className="text-base font-medium tracking-wide text-gray-700 mb-3">
                                {category.title}
                              </h3>
                              <div className="grid grid-cols-1 gap-3">
                                {category.items.map((subItem, subIndex) => (
                                  <a
                                    key={subIndex}
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50/50 transition-all duration-300"
                                  >
                                    <div>
                                      <h4 className="font-medium text-gray-800 text-sm mb-1">
                                        {subItem.title}
                                      </h4>
                                      <p className="text-xs text-gray-500/80">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Action 按钮 */}
                        {item.key === 'features' && item.submenu.updates.action && (
                          <div className="px-3">
                            <a 
                              href={item.submenu.updates.action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 border border-gray-200 text-gray-500 px-6 py-2 rounded-md hover:bg-gray-50/70 hover:border-gray-300 transition-all duration-300 w-full text-center block"
                            >
                              {item.submenu.updates.action.label}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Header = ({ theme }) => {
  return <Navigation theme={theme} />;
};

export default Header;