const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const domains = [
  'https://websitelm.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

domains.forEach(domain => {
  console.log(`Generating sitemap for ${domain}`);
  
  // 为每个域名生成 sitemap
  execSync(`cross-env SITE_URL=${domain} next-sitemap`, {
    stdio: 'inherit'
  });
  
  // 重命名生成的文件以区分不同域名
  const domainName = new URL(domain).host;
  fs.renameSync(
    path.join(process.cwd(), 'public/sitemap.xml'),
    path.join(process.cwd(), `public/sitemap-${domainName}.xml`)
  );
}); 