'use client';
import React from 'react';
import { FaRocket, FaShieldAlt, FaRobot, FaTools, 
  FaChartBar, FaLanguage, FaCloud, FaLock, FaUsers, FaFileAlt,
  FaPlug, FaWifi, FaCodeBranch, FaDatabase, FaSearch, FaChartLine,
  FaUsersCog, FaVial, FaMobile, FaHeadset, FaEdit, FaPencilAlt, FaDesktop, FaWindowMaximize, FaDollarSign, FaMoneyBill, FaPriceTag
} from 'react-icons/fa';
import { 
  IoCheckmarkCircle,  // 带圆圈的绿色对勾
  IoCloseCircle       // 带圆圈的红色叉号
} from "react-icons/io5";
import themeConfig from '../../../styles/themeConfig';
import PropTypes from 'prop-types';

// 创建一个图标映射对象
const iconMap = {
  // AI & 机器人相关
  FaRobot: FaRobot,
  FaAi: FaRobot,
  FaAndroid: FaRobot,

  // 用户相关
  FaUserFriends: FaUsers,
  FaUserCircle: FaUsers,
  FaUserGroup: FaUsers,
  FaUsersCog: FaUsersCog,
  FaPeopleGroup: FaUsers,
  FaUserEdit: FaUsers,
  
  // 全球化 & 语言
  FaGlobe: FaLanguage,
  FaGlobeAmericas: FaLanguage,
  FaGlobeAsia: FaLanguage,
  FaTranslate: FaLanguage,
  
  // 媒体相关
  FaVideo: FaMobile,
  FaVideoCamera: FaMobile,
  FaPlay: FaMobile,
  
  // 云服务相关
  FaCloud: FaCloud,
  FaCloudUpload: FaCloud,
  FaCloudDownload: FaCloud,
  FaServer: FaCloud,
  
  // 文件相关
  FaFolderOpen: FaFileAlt,
  FaFolder: FaFileAlt,
  FaFile: FaFileAlt,
  FaFiles: FaFileAlt,
  
  // 数据 & 分析
  FaChartLine: FaChartLine,
  FaChart: FaChartBar,
  FaChartBar: FaChartBar,
  FaChartPie: FaChartLine,
  FaAnalytics: FaChartLine,
  
  // 安全相关
  FaLock: FaLock,
  FaShield: FaShieldAlt,
  FaSecurity: FaShieldAlt,
  FaKey: FaLock,
  
  // 开发相关
  FaCode: FaCodeBranch,
  FaGit: FaCodeBranch,
  FaBranch: FaCodeBranch,
  
  // 数据库
  FaDatabase: FaDatabase,
  FaStorage: FaDatabase,
  
  // 搜索
  FaSearch: FaSearch,
  FaMagnifyingGlass: FaSearch,
  
  // 工具
  FaTools: FaTools,
  FaWrench: FaTools,
  FaCog: FaTools,
  FaGear: FaTools,
  
  // 连接性
  FaWifi: FaWifi,
  FaPlug: FaPlug,
  FaConnection: FaWifi,
  
  // 测试
  FaVial: FaVial,
  FaFlask: FaVial,
  FaTest: FaVial,
  
  // 客服
  FaHeadset: FaHeadset,
  FaSupport: FaHeadset,
  FaCustomerService: FaHeadset,
  
  // 性能
  FaRocket: FaRocket,
  FaSpeed: FaRocket,
  FaPerformance: FaRocket,
  
  // 设备相关
  FaDesktop: FaTools,
  FaUserInterface: FaTools,
  FaWindowMaximize: FaTools,
  FaDollarSign: FaRocket,
  FaMoneyBill: FaRocket,
  FaPriceTag: FaRocket,
  FaEdit: FaTools,
  FaPencilAlt: FaTools
};

const getIconByFeatureName = (featureName) => {
  // 定义特征组及其关键词
  const featureGroups = {
    AI: {
      icon: FaRobot,
      keywords: ['ai', 'artificial', 'intelligence', 'smart', 'automated', 'machine', 'learning', 'neural', 'cognitive', 'bot']
    },
    Interface: {
      icon: FaDesktop,
      keywords: ['interface', 'ui', 'ux', 'user', 'friendly', 'dashboard', 'screen', 'display', 'layout', 'design']
    },
    Editing: {
      icon: FaPencilAlt,
      keywords: ['edit', 'modify', 'change', 'customize', 'real-time', 'live', 'instant', 'update', 'adjust']
    },
    Language: {
      icon: FaLanguage,
      keywords: ['language', 'translate', 'localization', 'global', 'international', 'multi-language', 'speech']
    },
    Media: {
      icon: FaMobile,
      keywords: ['video', 'media', 'audio', 'record', 'play', 'stream', 'content', 'watch']
    },
    Collaboration: {
      icon: FaUsers,
      keywords: ['collaboration', 'team', 'group', 'share', 'together', 'social', 'community', 'collective']
    },
    Storage: {
      icon: FaCloud,
      keywords: ['storage', 'cloud', 'save', 'backup', 'store', 'data', 'upload', 'download']
    },
    Analytics: {
      icon: FaChartLine,
      keywords: ['analytics', 'statistics', 'metrics', 'measure', 'track', 'monitor', 'performance', 'report']
    },
    Support: {
      icon: FaHeadset,
      keywords: ['support', 'help', 'service', 'assist', 'customer', 'care', 'contact']
    },
    Security: {
      icon: FaShieldAlt,
      keywords: ['security', 'protect', 'safe', 'privacy', 'secure', 'guard', 'encrypt']
    },
    Pricing: {
      icon: FaDollarSign,
      keywords: ['price', 'cost', 'payment', 'affordable', 'budget', 'money', 'subscription', 'plan']
    },
    Performance: {
      icon: FaRocket,
      keywords: ['performance', 'speed', 'fast', 'quick', 'efficient', 'optimize', 'boost']
    }
  };

  // 将特征名称转换为小写并分词
  const words = featureName.toLowerCase().split(/[\s-]+/);
  
  // 计算每个特征组的匹配分数
  const scores = Object.entries(featureGroups).map(([group, { icon, keywords }]) => {
    let score = 0;
    words.forEach(word => {
      // 完全匹配得3分
      if (keywords.includes(word)) {
        score += 3;
      } else {
        // 部分匹配得1分（如果关键词包含当前词或当前词包含关键词
        keywords.forEach(keyword => {
          if (keyword.includes(word) || word.includes(keyword)) {
            score += 1;
          }
        });
      }
    });
    return { group, icon, score };
  });

  // 获取得分最高的特征组
  const bestMatch = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { score: -1 });

  // 如果没有任何匹配（得分为0），返回默认图标
  return bestMatch.score > 0 ? bestMatch.icon : FaTools;
};

const ProductComparisonTable = ({ data, theme = 'normal' }) => {
  return (
    <div className={`
      ${themeConfig[theme].section.background.primary}
      ${themeConfig[theme].section.padding.base}
      w-full
    `}>
      <div className="comparison-table-container max-w-6xl mx-auto px-4">
        <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} text-center mb-12 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600`}>
          {data.topContent?.title || data.title}
        </h2>
        
        <div className="comparison-table bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg w-full">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className={`min-w-full divide-y ${themeConfig[theme].table.border}`}>
                <thead className={`${themeConfig[theme].table.header.background} ${themeConfig[theme].table.header.text}`}>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <th className="py-5 px-4 text-left text-base font-semibold">Features</th>
                    <th className="py-5 px-3 text-center text-base font-semibold">
                      {data.topContent?.companies?.competitor || 'Competitor'}
                    </th>
                    <th className="py-5 px-3 text-center text-base font-semibold bg-blue-50 border-l-2 border-blue-400">
                      <span className="text-blue-600">{data.topContent?.companies?.us || 'Us'}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${themeConfig[theme].table.border}`}>
                  {data.bottomContent && data.bottomContent.length > 0 ? (
                    data.bottomContent.map((feature, index) => (
                      <tr 
                        key={index} 
                        className={`
                          ${themeConfig[theme].table.hover} 
                          ${themeConfig[theme].table.border}
                          ${feature.isEmpty ? 'empty-row bg-gray-50' : ''}
                        `}
                      >
                        <td className="py-4 px-4 border-t border-gray-100">
                          {!feature.isEmpty ? (
                            <div className="flex items-center gap-3">
                              {(() => {
                                const IconComponent = getIconByFeatureName(feature.name);
                                return IconComponent ? <IconComponent className="text-[#3374FF] text-xl" /> : null;
                              })()}
                              <span className="text-black/80 text-base font-medium">{feature.name}</span>
                            </div>
                          ) : (
                            <div className="empty-row-content w-full text-center text-gray-600 text-base">
                              {feature.name}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3 text-center border-t border-x border-gray-100">
                          {!feature.isEmpty && (
                            feature.competitor ? 
                              <IoCheckmarkCircle className="inline text-green-500 text-2xl" /> : 
                              <IoCloseCircle className="inline text-red-500 text-2xl" />
                          )}
                        </td>
                        <td className="py-4 px-3 text-center border-t border-gray-100 bg-blue-50/30">
                          {!feature.isEmpty && (
                            feature.us ? 
                              <IoCheckmarkCircle className="inline text-green-600 text-2xl drop-shadow-sm" /> : 
                              <IoCloseCircle className="inline text-red-500 text-2xl" />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-4 border-t border-gray-100 text-center text-base" colSpan="3">
                        No features added yet. Please add features to display here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="table-footer flex justify-center py-6 bg-gray-50 border-t border-gray-200">
            <button className="action-button bg-[#3374FF] text-white font-medium py-3 px-8 rounded-md hover:bg-[#2361e6] transition-colors text-base shadow-md hover:shadow-lg">
              {data.buttonText || '了解更多'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductComparisonTable.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.string
};

export default ProductComparisonTable;