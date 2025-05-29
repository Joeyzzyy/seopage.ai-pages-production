'use client';
import React, { useEffect, useMemo, memo, useState, useCallback } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Typography, message, Button, Drawer, Input, Modal } from 'antd';
import Header from './header-template';
import Footer from './footer-template';
/* divider */
import HeroSectionWithVideo from '../common/sections/hero-section-with-video';
import HeroSectionWithMultipleTexts from '../common/sections/hero-section-with-multiple-texts';
/* divider */
import TitleSection from '../common/sections/title-section';
import TitleSectionWithImage from '../common/sections/title-section-with-image';
/* divider */
import WhyChooseUsWithSmallBlocks from '../common/sections/why-choose-us-with-small-blocks';
import WhyChooseUsWithBlocks from '../common/sections/why-choose-us-with-blocks';
import WhyChooseUsWithStory from '../common/sections/why-choose-us-with-story';
/* divider */
import HowItWorksWithWorkflow from '../common/sections/how-it-works-with-workflow';
import HowItWorksWithBlocks from '../common/sections/how-it-works-with-blocks';
/* divider */
import FeaturesTabbed from '../common/sections/features-tabbed';
/* divider */
import ProductBenefitsWithBlocks from '../common/sections/product-benefits-with-blocks';
import ProductBenefitsWithTable from '../common/sections/product-benefits-with-table';
/* divider */
import UserReviewsWithMovingCards from '../common/sections/user-reviews-with-moving-cards';
/* divider */
import MeetOurTeam from '../common/sections/meet-our-team';
/* divider */
import JobListNormal from '../common/sections/job-list-normal';
/* divider */
import FAQ from '../common/sections/faq-standard';
/* divider */
import CallToAction from '../common/sections/call-to-action';
import CallToActionComplex from '../common/sections/call-to-action-complex';
import CallToActionWithInput from '../common/sections/call-to-action-with-input';
/* divider */
import KeyResultsWithTextBlock from '../common/sections/key-results-with-text-block';
import KeyResultsWithImage from '../common/sections/key-results-with-image';
import KeyResultsWithCards from '../common/sections/key-results-with-cards';
/* divider */
import PageListCard from '../common/sections/page-list-card';
/* divider */
import SubscriptionCard from '../common/sections/subscription-card';
/* divider */
import FeatureComparisonTable from '../common/sections/feature-comparison-table';
/* divider */
import ProductComparisonTable from '../common/sections/product-comparison-table';

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
        // 检查 styleTag 是否仍然是 document.head 的子节点
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
      // 服务端环境动态加载
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM('');
      return require('dompurify')(dom.window);
    }
    // 客户端环境直接使用
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

// 组件映射表，用于动态渲染不同类型的组件
const COMPONENT_MAP = {
  TitleSection: TitleSection,
  TitleSectionWithImage: TitleSectionWithImage,
  HeroSectionWithVideo: HeroSectionWithVideo,
  HeroSectionWithMultipleTexts: HeroSectionWithMultipleTexts,
  WhyChooseUsWithSmallBlocks: WhyChooseUsWithSmallBlocks,
  WhyChooseUsWithBlocks: WhyChooseUsWithBlocks,
  WhyChooseUsWithStory: WhyChooseUsWithStory,
  HowItWorksWithWorkflow: HowItWorksWithWorkflow,
  FeaturesTabbed: FeaturesTabbed,
  ProductBenefitsWithBlocks: ProductBenefitsWithBlocks,
  UserReviewsWithMovingCards: UserReviewsWithMovingCards,
  MeetOurTeam: MeetOurTeam,
  JobList: JobListNormal,
  Faqs: FAQ,
  CallToActionComplex: CallToActionComplex,
  CallToActionWithEmailInput: CallToActionWithInput,
  ProductBenefitsWithTable: ProductBenefitsWithTable,
  KeyResultsWithTextBlock: KeyResultsWithTextBlock,
  KeyResultsWithImage: KeyResultsWithImage,
  KeyResultsWithCards: KeyResultsWithCards,
  HowItWorksWithBlocks: HowItWorksWithBlocks,
  CallToAction: CallToAction,
  PageListCard: PageListCard,
  SubscriptionCard: SubscriptionCard,
  FeatureComparisonTable: FeatureComparisonTable,
  ProductComparison: ProductComparisonTable,
};

/**
 * 通用布局组件
 * 支持两种渲染模式：
 * 1. 组件拼接模式：通过sections数组渲染多个组件
 * 2. HTML直接渲染模式：渲染完整的HTML内容
 * @param {Object} props
 * @param {Object} props.article - Article data object
 */
const CommonLayout = ({ article }) => {
  // Extract header configuration from article data
  const headerData = useMemo(() => {
    return article?.pageLayout?.pageHeaders;
  }, [article?.pageLayout?.pageHeaders]);

  // Extract footer configuration from article data
  const footerData = useMemo(() => {
    return article?.pageLayout?.pageFooters;
  }, [article?.pageLayout?.pageFooters]);

  // 确定内容是否为完整HTML - 改进版
  const isHtmlContent = article.html?.trim().startsWith('<!DOCTYPE html>') ||
                       article.html?.trim().startsWith('<html');

  // --- 添加调试日志 ---
  // console.log('[CommonLayout] isHtmlContent:', isHtmlContent); // 可以保留或移除
  // --- 结束调试日志 ---

  // 当是 HTML 内容时，直接渲染 HtmlRenderer。
  // HtmlRenderer 内部会处理 body、style 和 title。
  if (isHtmlContent) {
    return (
        <HtmlRenderer content={article.html} article={article} />
    );
  }

  // 非 HTML 内容模式保持不变
  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col">
      {headerData && (
        <Header
          data={headerData}
          memo={() => JSON.stringify(headerData)}
        />
      )}
      <div className={`flex-1 w-full max-w-[100vw] overflow-x-hidden ${headerData ? 'pt-[60px]' : ''}`}>
        {article.sections?.map((section, index) => {
          const Component = COMPONENT_MAP[section.componentName];
          if (!Component) return null;
          if (article.pageType === 'Landing Page' && section.componentName === 'TitleSection') {
            return null;
          }
          return (
            <div
              key={`${section.componentName}-${section.sectionId}`}
              className="w-full bg-white"
            >
              <Component
                data={section}
                author={article.author}
                date={article.createdAt}
              />
            </div>
          );
        })}
      </div>
      {footerData && (
        <Footer
          data={footerData}
          memo={() => JSON.stringify(footerData)}
        />
      )}
    </div>
  );
};

// Use memo to optimize component performance
export default memo(CommonLayout);