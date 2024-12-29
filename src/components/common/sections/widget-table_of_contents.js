'use client';

import React, { useState, useEffect } from 'react';

const TableOfContents = ({ theme = 'normal' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState([]);

  const getBgColor = () => {
    return theme === 'tech' 
      ? 'bg-indigo-50 bg-opacity-95'
      : 'bg-white bg-opacity-95';
  };

  const getBorderStyle = () => {
    return theme === 'tech'
      ? 'border border-indigo-100'
      : 'border border-gray-200';
  };

  const getButtonStyle = () => {
    return theme === 'tech'
      ? 'bg-indigo-600 hover:bg-indigo-700'
      : 'bg-blue-600 hover:bg-blue-700';
  };

  const getHeadingStyle = () => {
    return theme === 'tech'
      ? 'hover:bg-indigo-50 text-indigo-900'
      : 'hover:bg-gray-50 text-gray-900';
  };

  const getBadgeStyle = () => {
    return theme === 'tech'
      ? 'bg-indigo-100 text-indigo-600'
      : 'bg-gray-100 text-gray-500';
  };

  useEffect(() => {
    // 获取所有标题元素
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5');
    const headingsData = Array.from(elements).map(element => ({
      title: element.textContent,
      level: parseInt(element.tagName.charAt(1)),
      id: element.id
    }));
    setHeadings(headingsData);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className={`${getBgColor()} ${getBorderStyle()} rounded-lg shadow-lg max-w-xs`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${getButtonStyle()} text-white rounded-full p-3 shadow-lg transition-all duration-200`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="p-4">
            {headings.map((heading, index) => (
              <div
                key={index}
                className={`${getHeadingStyle()} cursor-pointer p-2 rounded-md`}
              >
                <span className={`${getBadgeStyle()} inline-block px-1.5 py-0.5 text-xs rounded-full mr-2`}>
                  H{heading.level}
                </span>
                {heading.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOfContents;