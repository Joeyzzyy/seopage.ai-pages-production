"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header({ data }) {
  const isMounted = useRef(false);
  const renderCount = useRef(0);
  const prevDataRef = useRef(null);
  const debugEnabled = process.env.NODE_ENV === 'development';

  const [state, setState] = useState({
    isOpen: false,
    activeDropdown: null
  });

  const memoizedData = useMemo(() => ({
    mainMenu: data?.mainMenu || [],
    actionItems: data?.actionItems || [],
    logo: data?.logo
  }), [data]);

  useEffect(() => {
    if (!debugEnabled) return;

    if (!isMounted.current) {
      isMounted.current = true;
      prevDataRef.current = data;
      return;
    }

    const hasDataChanged = prevDataRef.current === null || 
      JSON.stringify(prevDataRef.current) !== JSON.stringify(data);

    if (hasDataChanged) {
      console.group('=== Header Component Debug ===');
      console.log(`Render #${renderCount.current++}:`, {
        dataChanged: hasDataChanged,
        previous: prevDataRef.current,
        current: data
      });
      console.groupEnd();
      
      prevDataRef.current = data;
    }

    return () => {
      if (debugEnabled && renderCount.current > 0) {
        console.log(`Header cleanup - Render #${renderCount.current}`);
      }
    };
  }, [data]);

  if (!data) {
    return <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow h-[4.2rem]" />;
  }

  const router = useRouter();
  
  const handleRedirect = (url, e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  const renderActionItem = (item) => {
    if (!item?.key || !item?.label) return null;

    const buttonStyles = item.buttonType === 'primary' 
      ? 'text-white bg-[#3374FF] hover:bg-[#3374FF]/90 px-4 py-2 rounded-lg' 
      : 'hover:text-[#3374FF]';

    if (item.isExternal) {
      return (
        <a
          key={item.key}
          href={item.href}
          className={`text-[15px] font-medium ${buttonStyles} transition-all duration-300`}
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
      >
        {item.label}
      </a>
    );
  };

  const renderMenuItem = (item) => {
    if (!item?.label) return null;

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    
    return (
      <div 
        key={item.label}
        className="relative"
        onMouseEnter={() => setState({ ...state, activeDropdown: item.label })}
        onMouseLeave={() => setState({ ...state, activeDropdown: null })}
      >
        {hasChildren ? (
          <Link
            href="#"
            className="text-[15px] font-medium hover:text-[#3374FF] transition-all duration-300 flex items-center"
          >
            {item.label}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        ) : (
          <a
            href={`#${item.label.toLowerCase()}`}
            className="text-[15px] font-medium hover:text-[#3374FF] transition-all duration-300 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        )}

        {/* Dropdown Menu */}
        {hasChildren && state.activeDropdown === item.label && (
          <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-1">
            {item.children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex justify-between h-[4.2rem]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center" target="_blank" rel="noopener noreferrer">
              {data?.logo ? (
                <Image
                  src={data.logo.src}
                  alt={data.logo.alt}
                  width={data.logo.width}
                  height={data.logo.height}
                  className="h-9 w-auto"
                  quality={100}
                  priority
                />
              ) : null}
            </a>
          </div>

          {/* Desktop Navigation */}
          
          <div className="hidden md:flex items-center justify-between flex-1 pl-8">
            {/* 主导航菜单 */}
            {data?.mainMenu && (
              <div className="flex space-x-8">
                {data.mainMenu?.length > 0 ? (
                  data.mainMenu.map(renderMenuItem)
                ) : null}
              </div>
            )}
            {/* Action Items - 固定在右侧 */}
            {data?.actionItems && (
              <div className="flex items-center space-x-6 ml-auto">
                {data.actionItems?.length > 0 ? (
                  data.actionItems.map(renderActionItem)
                ) : null}
              </div>
            )}
          </div>
         

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setState({ ...state, isOpen: !state.isOpen })}
              className="p-2 rounded-md"
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

        {/* 添加移动端菜单 */}
        {state.isOpen && (
          <div className="md:hidden absolute top-[4.2rem] left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="py-4 px-6">
              <div className="space-y-3">
                {data.mainMenu?.length > 0 ? (
                  data.mainMenu.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="text-[15px] font-medium">{item.label}</div>
                      {item.children?.length > 0 && (
                        <div className="pl-4 space-y-2">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              className="block text-sm text-gray-600 hover:text-[#3374FF]"
                              target="_blank"
                              rel="noopener noreferrer"
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