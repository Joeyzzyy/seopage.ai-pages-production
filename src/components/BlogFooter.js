'use client';
import React from 'react';
import Image from 'next/image';

// 链接数据
const footerLinks = [
  {
    title: "Alternatives",
    links: [
      { label: "How to Create High-Converting Alternative To Pages", url: "https://seopage.ai/alternatives/how-to-create-high-converting-alternative-to-pages" },
      { label: "SEO.ai Alternatives", url: "https://seopage.ai/alternatives/seo-ai-alternatives" },
      { label: "SeoPage.ai vs Ctrify", url: "https://seopage.ai/alternatives/seopageai-vs-ctrify" },
      { label: "SeoPage.ai vs SEO.ai", url: "https://seopage.ai/alternatives/seopageai-vs-seo-ai" },
      { label: "SeoPage.ai vs Jasper", url: "https://seopage.ai/alternatives/seopageai-vs-jasper" },
      { label: "SeoPage.ai vs AISEO.ai", url: "https://seopage.ai/alternatives/seopageai-vs-aiseo-ai" },
      { label: "SeoPage.ai vs Writesonic", url: "https://seopage.ai/alternatives/seopageai-vs-writesonic" },
      { label: "Surfer SEO Alternatives", url: "https://seopage.ai/alternatives/surfer-alternatives" },
      { label: "Frase Alternatives", url: "https://seopage.ai/alternatives/frase-alternatives" },
      { label: "Clearscope Alternatives", url: "https://seopage.ai/alternatives/clearscope-alternatives" },
      { label: "MarketMuse Alternatives", url: "https://seopage.ai/alternatives/marketmuse-alternatives" },
      { label: "Writesonic Alternatives", url: "https://seopage.ai/alternatives/writesonic-alternatives" },
      { label: "Jasper Alternatives", url: "https://seopage.ai/alternatives/jasper-alternatives" },
      { label: "Scalenut Alternatives", url: "https://seopage.ai/alternatives/scalenut-alternatives" }
    ]
  },
  {
    title: "Best Of",
    links: [
      { label: "How to Create High-Converting Best Of Pages", url: "https://seopage.ai/bestofs/how-to-create-high-converting-best-of-pages" },
      { label: "Top 7 AI SEO Tools 2025", url: "https://seopage.ai/bestofs/top-seven-ai-seo-tools-2025" },
      { label: "Alternative Pages SEO Tools Performance", url: "https://seopage.ai/bestofs/alternative-pages-seo-tools-performance-analysis-2025" },
      { label: "B2B SaaS SEO Tools Performance Study", url: "https://seopage.ai/bestofs/b2b-saas-seo-tools-performance-study-2025" },
      { label: "Best Competitive Intelligence Tools", url: "https://seopage.ai/bestofs/best-competitive-intelligence-tools-for-seo-2025" },
      { label: "Best AI Content Creation Tools", url: "https://seopage.ai/bestofs/best-ai-content-creation-tools-for-seo-2025" }
    ]
  },
  {
    title: "FAQs",
    links: [
      { label: "How to Create High-Converting FAQ Pages", url: "https://seopage.ai/faqs/how-to-create-high-converting-faq-pages" },
      { label: "SeoPage.ai FAQ Guide", url: "https://seopage.ai/faqs/seopage-ai-faq-guide" },
      { label: "Alternative Pages FAQ", url: "https://seopage.ai/faqs/alternative-pages-complete-faq-guide" },
      { label: "AI Content Creation Expert FAQ", url: "https://seopage.ai/faqs/ai-content-creation-expert-faq-guide" },
      { label: "Best-Of Pages Expert FAQ", url: "https://seopage.ai/faqs/best-of-pages-expert-faq-guide" },
      { label: "Programmatic SEO Complete FAQ", url: "https://seopage.ai/faqs/programmatic-seo-complete-faq-guide" },
      { label: "SeoPage.ai Features & Capabilities FAQ", url: "https://seopage.ai/faqs/seopage-ai-features-capabilities-faq-guide" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { label: "How to Create Solution Page Guide", url: "https://seopage.ai/solutions/how-to-create-solution-page-the-ultimate-guide-for-2025" },
      { label: "SeoPage.ai Ultimate Content Automation", url: "https://seopage.ai/solutions/seopage-ai-ultimate-content-automation-platform" },
      { label: "SeoPage.ai Comprehensive SEO Solution", url: "https://seopage.ai/solutions/seopage-ai-comprehensive-seo-solution-for-b2b-saas" }
    ]
  },
  {
    title: "Testimonials",
    links: [
      { label: "How to Create High-Converting Testimonials", url: "https://seopage.ai/testimonials/how-to-create-high-converting-testimonials-page" },
      { label: "SeoPage.ai Testimonials", url: "https://seopage.ai/testimonials/seopage-ai-testimonials" }
    ]
  },
  {
    title: "Reports",
    links: [
      { label: "How to Build AI Reports Center", url: "https://seopage.ai/reports/how-to-build-ai-reports-center" },
      { label: "SeoPage.ai Reports", url: "https://seopage.ai/reports/seopageai-reports" }
    ]
  }
];

export const BlogFooter = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 链接区域 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-300 leading-relaxed"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部版权信息 */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
          <div className="flex items-center">
            <a 
              href="https://seopage.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src="/images/seopageai-logo.png"
                alt="SEOPage.ai"
                width={120}
                height={24}
                className="h-6 w-auto"
                style={{
                  imageRendering: 'crisp-edges',
                  imageRendering: '-webkit-optimize-contrast'
                }}
              />
            </a>
          </div>
          <div className="text-sm text-gray-600">
            @ 2025 SEOPage.ai All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
