const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const baseUrl = 'https://expressenglishhub.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/products', priority: '0.9', changefreq: 'monthly' },
    { url: '/toefl-itp', priority: '0.9', changefreq: 'monthly' },
    { url: '/toefl-ibt', priority: '0.9', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' }
  ];
  
  // Get dynamic articles
  const articlesDir = path.join(__dirname, 'articles');
  const articles = [];
  
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.html'));
    
    files.forEach(filename => {
      const filePath = path.join(articlesDir, filename);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from content
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : filename;
      
      // Extract meta description
      const descMatch = content.match(/<meta name="description" content="(.*?)"/i);
      const description = descMatch ? descMatch[1] : '';
      
      // Extract keywords
      const keywordsMatch = content.match(/<meta name="keywords" content="(.*?)"/i);
      const keywords = keywordsMatch ? keywordsMatch[1] : '';
      
      articles.push({
        url: `/articles/${filename}`,
        title,
        description,
        keywords,
        lastmod: stats.mtime.toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'monthly'
      });
    });
  }
  
  // Generate XML sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
    <image:image>
      <image:loc>${baseUrl}/logo.jpg</image:loc>
      <image:title>Express English Hub - TOEFL Preparation</image:title>
      <image:caption>Professional TOEFL preparation platform</image:caption>
    </image:image>
  </url>`;
  });
  
  // Add article pages
  articles.forEach(article => {
    sitemap += `
  <url>
    <loc>${baseUrl}${article.url}</loc>
    <lastmod>${article.lastmod}</lastmod>
    <changefreq>${article.changefreq}</changefreq>
    <priority>${article.priority}</priority>
    <mobile:mobile/>
    <news:news>
      <news:publication>
        <news:name>Express English Hub</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.lastmod}</news:publication_date>
      <news:title>${article.title}</news:title>
      <news:keywords>${article.keywords}</news:keywords>
    </news:news>
    <image:image>
      <image:loc>${baseUrl}/logo.jpg</image:loc>
      <image:title>${article.title}</image:title>
      <image:caption>${article.description}</image:caption>
    </image:image>
  </url>`;
  });
  
  sitemap += '\n</urlset>';
  
  // Write sitemap.xml
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
  
  // Generate robots.txt with updated sitemap reference
  const robotsTxt = `User-agent: *
Allow: /

# Enhanced Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin or sensitive pages
Disallow: /eeh-admin
Disallow: /api/
Disallow: /*.json$

# Allow important pages for SEO crawling
Allow: /
Allow: /products
Allow: /toefl-itp  
Allow: /toefl-ibt
Allow: /contact
Allow: /blog
Allow: /articles/

# Crawl optimization
Crawl-delay: 1

# Additional directives for better SEO
User-agent: Googlebot
Allow: /

User-agent: Bingbot  
Allow: /

User-agent: Slurp
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`;

  fs.writeFileSync(path.join(__dirname, 'public', 'robots.txt'), robotsTxt);
  
  console.log(`✅ Sitemap generated with ${staticPages.length + articles.length} URLs`);
  console.log(`📄 Articles included: ${articles.length}`);
  
  return {
    total: staticPages.length + articles.length,
    articles: articles.length,
    static: staticPages.length
  };
}

// Auto-generate sitemap
if (require.main === module) {
  generateSitemap();
}

module.exports = generateSitemap;