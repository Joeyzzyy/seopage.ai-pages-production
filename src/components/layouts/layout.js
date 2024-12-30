'use client';
import React, { useEffect, useMemo, memo } from 'react';
import TitleSection from '../common/sections/title-section';
import TitleSectionWithImage from '../common/sections/title-section-with-image';
import HeroSectionWithVideo from '../common/sections/hero-section-with-video';
import HeroSectionWithMultipleTexts from '../common/sections/hero-section-with-mutiple-texts';
import WhyChooseUsWithSmallBlocks from '../common/sections/why-choose-us-with-small-blocks';
import WhyChooseUsWithBlocks from '../common/sections/why-choose-us-with-blocks';
import WhyChooseUsWithStory from '../common/sections/why-choose-us-with-story';
import HowItWorksWithWorkflow from '../common/sections/how-it-works-with-workflow';
import FeaturesTabbed from '../common/sections/features-tabbed';
import ProductBenefitsWithBlocks from '../common/sections/product-benefits-with-blocks';
import UserReviewsWithMovingCards from '../common/sections/user-reviews-with-moving-cards';
import MeetOurTeam from '../common/sections/meet-our-team';
import JobListNormal from '../common/sections/job-list-normal';
import FAQTwoColumnsWithSmallTitle from '../common/sections/faq-two-columns-with-small-title';
import FAQTwoColumnsWithBigTitle from '../common/sections/faq-two-columns-with-big-title';
import Faqs from '../common/sections/faqs';
import CallToActionComplex from '../common/sections/call-to-action-complex';
import CallToActionWithInput from '../common/sections/call-to-action-with-input';
import ProductBenefitsWithTable from '../common/sections/product-benefits-with-table';
import Header from './header-template';
import Footer from './footer-template';

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
  Faqs: FAQTwoColumnsWithSmallTitle,
  CallToActionComplex: CallToActionComplex,
  CallToActionWithEmailInput: CallToActionWithInput,
  ProductBenefitsWithTable: ProductBenefitsWithTable
};

const generateSchemaMarkup = (article) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.publishDate,
    image: article.ogImage,
    dateModified: article.updateDate,
    publisher: {
      '@type': 'Organization',
      name: 'WebsiteLM'
    }
  };
};

const CommonLayout = ({ article, keywords }) => {
  const headerData = useMemo(() => {
    return article?.pageLayout?.pageHeaders;
  }, [article?.pageLayout?.pageHeaders]);

  const footerData = useMemo(() => {
    return article?.pageLayout?.pageFooters;
  }, [article?.pageLayout?.pageFooters]);

  useEffect(() => {
  }, [article]);

  if (!article) {
    return null;
  }

  const sections = article?.sections || [];
  const author = article?.author || 'default';

  return (
    <div suppressHydrationWarning>
      {headerData && (
        <Header 
          data={headerData} 
          memo={() => JSON.stringify(headerData)}
        />
      )}

      <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {sections.map(section => {
          const Component = COMPONENT_MAP[section.componentName];
          if (!Component) return null;
          
          return (
            <Component 
              key={`${section.componentName}-${section.position}`} 
              data={section}
              author={author}
              date={article.createdAt}
            />
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

export default memo(CommonLayout);