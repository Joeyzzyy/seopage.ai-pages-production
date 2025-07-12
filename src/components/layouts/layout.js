'use client';
import React, { useEffect, useMemo, memo } from 'react';
import parse from 'html-react-parser';

/**
 * HTML Content Renderer Component
 * Handles and renders HTML content with editable tags
 * @param {Object} props
 * @param {string} props.content - HTML string content
 * @param {Object} props.article - Article data object (新增)
 */
const HtmlRenderer = ({ content, article }) => {
  // 提取body、style和title内容（修改后的逻辑）
  const { bodyContent, extractedStyle, extractedTitle } = useMemo(() => {
    if (!content) return { bodyContent: '', extractedStyle: '', extractedTitle: null };
    const decoded = content;
    const bodyMatch = decoded.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const styleMatch = decoded.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const titleMatch = decoded.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const rawBody = bodyMatch ? bodyMatch[1] : decoded;
    const rawStyle = styleMatch ? styleMatch[1] : '';
    const rawTitle = titleMatch ? titleMatch[1] : null;

    // 公共转义处理
    const commonUnescape = (str) => str
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    let processedBody = commonUnescape(rawBody);

    // 如果需要移除水印，处理HTML内容（确保服务端和客户端一致）
    if (article?.removeWatermark === true) {
      // 水印移除的正则表达式
      const watermarkPatterns = [
        /\s*\|\s*Independently Generated via\s*<a[^>]*href="https:\/\/www\.altpage\.ai"[^>]*>.*?<\/a>/gi,
        /\s*\|\s*Independently Generated via\s*<a[^>]*altpage\.ai[^>]*>.*?<\/a>/gi,
        /\s*\|\s*Independently Generated via.*?altpage\.ai.*?(?=\s|$)/gi,
        /\s*\|\s*Independently Generated via\s*&lt;a[^&]*altpage\.ai[^&]*&gt;.*?&lt;\/a&gt;/gi,
        /\|\s*Independently Generated via[^<]*<[^>]*altpage\.ai[^>]*>[^<]*<\/a>/gi
      ];
      
      watermarkPatterns.forEach((pattern) => {
        processedBody = processedBody.replace(pattern, '');
      });
    }

    return {
      bodyContent: processedBody,
      extractedStyle: commonUnescape(rawStyle),
      extractedTitle: rawTitle ? commonUnescape(rawTitle) : null
    };
  }, [content, article?.removeWatermark]);

  // 动态插入样式（现有效果）
  useEffect(() => {
    if (extractedStyle) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = extractedStyle;
      document.head.appendChild(styleTag);

      // 清理函数
      return () => {
        if (styleTag.parentNode === document.head) {
          document.head.removeChild(styleTag);
        }
      };
    }
  }, [extractedStyle]);

  // 新增：动态更新文档标题
  useEffect(() => {
    if (extractedTitle) {
      document.title = extractedTitle;
    }
  }, [extractedTitle]);

  // 简化后的解析配置
  const parseOptions = useMemo(() => ({
    replace: (domNode) => {
      return domNode;
    }
  }), []);

  // 动态加载 JSDOM（仅服务端）
  const createDOMPurify = () => {
    if (typeof window === 'undefined') {
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM('');
      return require('dompurify')(dom.window);
    }
    return require('dompurify');
  };

  const purified = createDOMPurify();

  return (
    <div className="html-content w-full relative" suppressHydrationWarning>
      {/* 样式注入 */}
      {extractedStyle && (
        <style
          dangerouslySetInnerHTML={{
            __html: purified.sanitize(extractedStyle, {
              FORBID_TAGS: ['script', 'link'],
              FORBID_ATTR: ['onload', 'onerror']
            })
          }}
        />
      )}
      {/* Body 内容渲染 */}
      {parse(bodyContent || '', parseOptions)}
    </div>
  );
};

/**
 * 只渲染 HTML 内容的通用布局组件
 * @param {Object} props
 * @param {Object} props.article - Article data object
 */
const CommonLayout = ({ article }) => {
  return (
    <HtmlRenderer content={article.html} article={article} />
  );
};

export default memo(CommonLayout);