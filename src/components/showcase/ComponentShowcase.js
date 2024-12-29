'use client';
import React, { useState } from 'react';
import { exampleData } from './example-data';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import TitleSection from '../common/sections/title-section';
import TitleSectionWithImage from '../common/sections/title-section-with-image';
import PricingWithThreeCards from '../common/sections/pricing-with-three-cards';
import HowItWorksWithWorkflow from '../common/sections/how-it-works-with-workflow';
import WhyChooseUsWithSmallBlocks from '../common/sections/why-choose-us-with-small-blocks';
import CallToAction from '../common/sections/call-to-action';
import CallToActionWithImage from '../common/sections/call-to-action-with-image';
import HowItWorksWithThreeBlocks from '../common/sections/how-it-works-with-three-blocks';
import ProductBenefitsWithFourBlocks from '../common/sections/product-benefits-with-blocks';
import ProductBenefitsWithATable from '../common/sections/product-benefits-with-table';
import WhyChooseUsWithBlocks from '../common/sections/why-choose-us-with-blocks';
import HeroSectionWithVideo from '../common/sections/hero-section-with-video';
import Faqs from '../common/sections/faqs';
import FaqTwoColumnsWithSmallTitle from '../common/sections/faq-two-columns-with-small-title';
import FaqTwoColumnsWithBigTitle from '../common/sections/faq-two-columns-with-big-title';
import ProductComparisonTable from '../common/sections/product-comparison-table';
import KeyResultsWithTextBlock from '../common/sections/key-results-with-text-block';
import MoreInsightsWithFourCards from '../common/sections/more-insights-with-four-cards';
import TrustedByLogos from '../common/sections/trusted-by-logos';
import UserReviews from '../common/sections/user-reviews';
import UserReviewsMovingCards from '../common/sections/user-reviews-with-moving-cards';
import UserReviewsSquareCards from '../common/sections/user-reviews-with-square-cards';
import KeyResultsWithThreeCards from '../common/sections/key-results-with-three-cards';
import KeyResultsWithImage from '../common/sections/key-results-with-image';
import CallToActionComplex from '../common/sections/call-to-action-complex';
import HeroSectionWithMultipleTexts from '../common/sections/hero-section-with-mutiple-texts';
import CallToActionWithInput from '../common/sections/call-to-action-with-input';
import JobListNormal from '../common/sections/job-list-normal';
import MeetOurTeam from '../common/sections/meet-our-team';
import FeaturesTabbed from '../common/sections/features-tabbed';
import WhyChooseUsWithStory from '../common/sections/why-choose-us-with-story';

const ComponentShowcase = () => {
  const [expandedCodes, setExpandedCodes] = useState({});
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState('normal');
  const componentRefs = {};

  const toggleCode = (key) => {
    setExpandedCodes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToComponent = (key) => {
    componentRefs[key]?.scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  };

  return (
    <>
      <div className="relative min-h-screen bg-slate-900 w-full pt-[4.2rem]">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 w-full">
          <div className="w-[90%] mx-auto py-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white tracking-tight">Component Library</h1>
            </div>
            
            <p className="mt-4 text-lg text-slate-300 max-w-3xl">
              Explore our comprehensive collection of pre-built components designed for creating modern, responsive web applications.
            </p>
            <p className="mt-2 text-base text-slate-400">
              Currently featuring {Object.keys(exampleData).length} components
            </p>
          </div>  
        </div>

        {/* Main Content */}
        <div className="w-[90%] mx-auto py-12">
          {Object.entries(exampleData).map(([key, data]) => (
            <div key={key} className="mb-8" ref={el => componentRefs[key] = el}>
              <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
                {/* Component Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white break-words">
                    <span className="mr-2 text-slate-400">#{data.order}</span>
                    {data.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <p className="text-slate-300 text-sm">
                      <span className="font-medium">Recommended Position:</span> {data.recommendedPosition}
                    </p>
                    <div className="hidden sm:block h-4 w-px bg-slate-700"></div>
                    <button
                      onClick={() => toggleCode(key)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {expandedCodes[key] ? 'Hide Data Structure' : 'View Data Structure'}
                    </button>
                  </div>
                </div>

                {/* Component Description */}
                <div className="px-6 py-4 bg-slate-850 border-b border-slate-700">
                  <p className="text-slate-300">{data.description}</p>
                  
                  {/* Data Structure Preview */}
                  {expandedCodes[key] && (
                    <div className="mt-4 bg-slate-900 rounded-lg border border-slate-700">
                      <SyntaxHighlighter 
                        language="json"
                        style={github}
                        className="text-sm"
                      >
                        {JSON.stringify(data.props, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>

                {/* Component Preview */}
                <div className="p-0 overflow-x-auto bg-white rounded-b-xl">
                  <div className={`${
                    key === 'heroSectionWithVideo' ? 'max-w-full md:max-w-[900px] lg:max-w-[1200px] mx-auto' : ''
                  } w-full`}>
                    {key === 'TitleSection' && <TitleSection data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'TitleSectionWithImage' && <TitleSectionWithImage data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'HeroSectionWithMultipleTexts' && <HeroSectionWithMultipleTexts data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'HowItWorksWithWorkflow' && <HowItWorksWithWorkflow data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'HowItWorksWithThreeBlocks' && <HowItWorksWithThreeBlocks data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'WhyChooseUsWithBlocks' && <WhyChooseUsWithBlocks data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'WhyChooseUsWithSmallBlocks' && <WhyChooseUsWithSmallBlocks data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'CallToActionWithImage' && <CallToActionWithImage data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'CallToAction' && <CallToAction data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'ProductBenefitsWithFourBlocks' && <ProductBenefitsWithFourBlocks data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'ProductBenefitsWithATable' && <ProductBenefitsWithATable data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'HeroSectionWithVideo' && <HeroSectionWithVideo data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'Faqs' && <Faqs data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'FaqTwoColumnsWithSmallTitle' && <FaqTwoColumnsWithSmallTitle data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'FaqTwoColumnsWithBigTitle' && <FaqTwoColumnsWithBigTitle data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'UserReviews' && <UserReviews data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'UserReviewsMovingCards' && <UserReviewsMovingCards data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'UserReviewsSquareCards' && <UserReviewsSquareCards data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'KeyResultsWithThreeCards' && <KeyResultsWithThreeCards data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'KeyResultsWithImage' && <KeyResultsWithImage data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'KeyResultsWithTextBlock' && <KeyResultsWithTextBlock data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'MoreInsightsWithFourCards' && <MoreInsightsWithFourCards data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'TrustedByLogos' && <TrustedByLogos data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'ProductComparisonTable' && <ProductComparisonTable data={data.props} author="WebsiteLM" theme={theme} />}
                    {/* {key === 'PricingWithThreeCards' && <PricingWithThreeCards data={data.props} author="WebsiteLM" theme={theme} />} */}
                    {key === 'CallToActionComplex' && <CallToActionComplex data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'CallToActionWithInput' && <CallToActionWithInput data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'JobListNormal' && <JobListNormal data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'MeetOurTeam' && <MeetOurTeam data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'FeaturesTabbed' && <FeaturesTabbed data={data.props} author="WebsiteLM" theme={theme} />}
                    {key === 'WhyChooseUsWithStory' && <WhyChooseUsWithStory data={data.props} author="WebsiteLM" theme={theme} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Menu - Update floating navigation menu style */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
          {/* Theme Switcher */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-3 border border-slate-700">
            <div className="flex flex-col gap-2">
              <span className="text-slate-300 text-sm">Theme:</span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="normal"
                    checked={theme === 'normal'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-slate-300 text-sm">Default</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value="tech"
                    checked={theme === 'tech'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-slate-300 text-sm">Tech</span>
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          {isNavOpen ? (
            <div className="bg-slate-800 rounded-lg shadow-lg p-3 w-[280px] border border-slate-700">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                <h3 className="font-medium text-slate-300 text-sm">Navigation</h3>
                <button
                  onClick={() => setIsNavOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {Object.entries(exampleData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => scrollToComponent(key)}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-md"
                  >
                    {data.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsNavOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ComponentShowcase; 