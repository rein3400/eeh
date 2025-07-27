const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(cookieParser());

// In-memory session storage for development
const sessions = new Map();

// Admin credentials
const ADMIN_USERNAME = 'Reze';
const ADMIN_PASSWORD = 'Denji';

// Session timeout (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// Generate session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check authentication middleware
function checkAuth(req, res, next) {
  const sessionToken = req.headers['session-token'] || req.cookies?.session;
  const session = sessions.get(sessionToken);
  
  if (!session || (Date.now() - session.loginTime) > SESSION_TIMEOUT) {
    if (session) sessions.delete(sessionToken);
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  req.session = session;
  next();
}

// Login endpoint
app.post('/api/login.php', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({ success: false, error: 'Username and password are required' });
  }
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const sessionToken = generateSessionToken();
    const loginTime = Date.now();
    
    sessions.set(sessionToken, {
      username,
      loginTime,
      token: sessionToken
    });
    
    // Set cookie for authentication
    res.cookie('session', sessionToken, { 
      httpOnly: true, 
      maxAge: SESSION_TIMEOUT,
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      token: sessionToken,
      username: username,
      login_time: new Date(loginTime).toISOString()
    });
  } else {
    // Add delay to prevent brute force
    setTimeout(() => {
      res.json({ success: false, error: 'Invalid username or password' });
    }, 1000);
  }
});

// Auth check endpoint
app.get('/api/auth-check.php', (req, res) => {
  const sessionToken = req.cookies?.session || req.headers['session-token'];
  const session = sessions.get(sessionToken);
  
  if (!session || (Date.now() - session.loginTime) > SESSION_TIMEOUT) {
    if (session) sessions.delete(sessionToken);
    return res.json({ success: true, authenticated: false });
  }
  
  res.json({
    success: true,
    authenticated: true,
    username: session.username,
    login_time: new Date(session.loginTime).toISOString()
  });
});

// Logout endpoint
app.post('/api/auth-check.php', (req, res) => {
  const sessionToken = req.cookies?.session || req.headers['session-token'];
  if (sessionToken) {
    sessions.delete(sessionToken);
  }
  res.clearCookie('session');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Articles list endpoint
app.get('/api/articles.php', (req, res) => {
  try {
    const articlesDir = path.join(__dirname, 'articles');
    
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    const files = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.html'))
      .map(filename => {
        const filePath = path.join(articlesDir, filename);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract title from HTML content
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : filename;
        
        return {
          title,
          filename,
          created: stats.mtime.toISOString().slice(0, 19).replace('T', ' '),
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json({
      success: true,
      articles: files,
      count: files.length
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      articles: []
    });
  }
});

// Generate article endpoint (Enhanced SEO version)
app.post('/api/generate-article.php', checkAuth, async (req, res) => {
  const { keywords, count = 1, language = 'id' } = req.body;
  
  if (!keywords) {
    return res.json({ success: false, error: 'Keywords are required' });
  }
  
  try {
    const articlesDir = path.join(__dirname, 'articles');
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    const generatedArticles = [];
    
    for (let i = 0; i < count; i++) {
      const keywordArray = keywords.split(',').map(k => k.trim());
      const primaryKeyword = keywordArray[0];
      const title = generateSEOTitle(primaryKeyword, language);
      const metaDescription = generateMetaDescription(title, primaryKeyword, language);
      const filename = `${sanitizeFilename(title)}_${Date.now()}_${i + 1}.html`;
      
      const htmlContent = generateSEOOptimizedArticle({
        title,
        metaDescription,
        keywords: keywordArray,
        primaryKeyword,
        language,
        filename
      });
      
      const filePath = path.join(articlesDir, filename);
      fs.writeFileSync(filePath, htmlContent);
      
      generatedArticles.push({
        title,
        filename,
        created: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }
    
    res.json({
      success: true,
      count: generatedArticles.length,
      articles: generatedArticles
    });
    
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// SEO Title Generator
function generateSEOTitle(keyword, language) {
  const templates = {
    id: [
      `Panduan Lengkap ${keyword} untuk Pemula 2025`,
      `${keyword}: Tips dan Strategi Terbukti`,
      `Cara Sukses ${keyword} - Panduan Expert`,
      `${keyword} Indonesia: Tutorial Komprehensif`,
      `Master ${keyword} dengan 10 Langkah Mudah`,
      `Rahasia ${keyword} yang Tidak Diketahui Banyak Orang`,
      `${keyword} Terbaik: Review dan Rekomendasi`,
      `Belajar ${keyword} dari Nol sampai Mahir`,
      `${keyword} 2025: Update Terbaru dan Trend`,
      `Solusi ${keyword} Paling Efektif dan Praktis`
    ],
    en: [
      `Complete ${keyword} Guide for Beginners 2025`,
      `${keyword}: Proven Tips and Strategies`,
      `How to Master ${keyword} - Expert Guide`,
      `${keyword} Tutorial: Comprehensive Guide`,
      `Master ${keyword} in 10 Easy Steps`,
      `${keyword} Secrets Most People Don't Know`,
      `Best ${keyword}: Reviews and Recommendations`,
      `Learn ${keyword} from Zero to Expert`,
      `${keyword} 2025: Latest Updates and Trends`,
      `Most Effective ${keyword} Solutions`
    ]
  };
  
  const titleTemplates = templates[language] || templates.en;
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
}

// Meta Description Generator
function generateMetaDescription(title, keyword, language) {
  const descriptions = {
    id: [
      `Pelajari ${keyword} dengan panduan lengkap dan mudah dipahami. Tips praktis, strategi terbukti, dan contoh nyata untuk hasil maksimal. ✓ Update 2025`,
      `Ingin menguasai ${keyword}? Temukan tutorial step-by-step, tips expert, dan strategi terbaik di sini. Gratis dan mudah dipraktikkan!`,
      `Panduan ${keyword} terlengkap untuk pemula hingga advanced. Dapatkan tips, trik, dan strategi dari para ahli. Mulai sekarang juga!`,
      `Belajar ${keyword} dengan metode terbukti efektif. Tutorial komprehensif, tips praktis, dan panduan detail untuk sukses Anda.`
    ],
    en: [
      `Learn ${keyword} with complete and easy-to-understand guide. Practical tips, proven strategies, and real examples for maximum results. ✓ 2025 Update`,
      `Want to master ${keyword}? Find step-by-step tutorials, expert tips, and best strategies here. Free and easy to practice!`,
      `Complete ${keyword} guide for beginners to advanced. Get tips, tricks, and strategies from experts. Start now!`,
      `Learn ${keyword} with proven effective methods. Comprehensive tutorial, practical tips, and detailed guide for your success.`
    ]
  };
  
  const descTemplates = descriptions[language] || descriptions.en;
  return descTemplates[Math.floor(Math.random() * descTemplates.length)];
}

// SEO-Optimized Article Generator
function generateSEOOptimizedArticle({ title, metaDescription, keywords, primaryKeyword, language, filename }) {
  const currentDate = new Date().toISOString();
  const readableDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US');
  
  const content = language === 'id' ? generateIndonesianContent(title, primaryKeyword, keywords) : generateEnglishContent(title, primaryKeyword, keywords);
  
  return `<!DOCTYPE html>
<html lang="${language === 'id' ? 'id' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${keywords.join(', ')}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="Express English Hub">
    <meta name="language" content="${language}">
    <meta name="revisit-after" content="7 days">
    <meta name="rating" content="general">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="/logo.jpg">
    <meta property="og:url" content="/articles/${filename}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Express English Hub">
    <meta property="og:locale" content="${language === 'id' ? 'id_ID' : 'en_US'}">
    
    <!-- Article Meta Tags -->
    <meta property="article:published_time" content="${currentDate}">
    <meta property="article:modified_time" content="${currentDate}">
    <meta property="article:author" content="Express English Hub">
    <meta property="article:section" content="TOEFL Tips">
    ${keywords.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n    ')}
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${metaDescription}">
    <meta name="twitter:image" content="/logo.jpg">
    <meta name="twitter:site" content="@ExpressEnglishHub">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${metaDescription}",
      "image": "/logo.jpg",
      "datePublished": "${currentDate}",
      "dateModified": "${currentDate}",
      "author": {
        "@type": "Organization",
        "name": "Express English Hub",
        "url": "https://expressenglishhub.com"
      },
      "publisher": {
        "@type": "EducationalOrganization",
        "name": "Express English Hub",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.jpg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "/articles/${filename}"
      },
      "keywords": "${keywords.join(', ')}",
      "articleSection": "TOEFL Education",
      "wordCount": 1200,
      "inLanguage": "${language}",
      "about": {
        "@type": "Thing",
        "name": "${primaryKeyword}"
      }
    }
    </script>
    
    <!-- CSS Styles for SEO and Readability -->
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8; 
            max-width: 900px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
            background: #fff;
        }
        .header {
            border-bottom: 3px solid #e97311;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 { 
            color: #e97311;
            font-size: 2.2em;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 15px;
        }
        h2 { 
            color: #d4640e;
            font-size: 1.6em;
            font-weight: 600;
            margin: 35px 0 20px 0;
            padding-left: 15px;
            border-left: 4px solid #e97311;
        }
        h3 { 
            color: #b8540b;
            font-size: 1.3em;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .meta { 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 25px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .toc {
            background: #f0f7ff;
            border: 1px solid #e3f2fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .toc h3 {
            margin-top: 0;
            color: #1976d2;
        }
        .toc ul {
            padding-left: 20px;
        }
        .toc a {
            color: #1976d2;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        .highlight-box {
            background: #fff3e0;
            border-left: 5px solid #ff9800;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 5px 5px 0;
        }
        .tip {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .tip::before {
            content: "💡 ";
            font-size: 18px;
        }
        ul, ol {
            padding-left: 25px;
        }
        li {
            margin-bottom: 8px;
        }
        strong {
            color: #e97311;
            font-weight: 600;
        }
        .conclusion {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 25px;
            margin-top: 40px;
        }
        .cta {
            background: linear-gradient(135deg, #e97311 0%, #ff9800 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .cta h3 {
            color: white;
            margin-bottom: 15px;
        }
        .article-footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e97311;
            text-align: center;
            color: #666;
        }
        @media (max-width: 768px) {
            body { padding: 15px; }
            h1 { font-size: 1.8em; }
            h2 { font-size: 1.4em; }
        }
    </style>
</head>
<body>
    <article>
        <div class="header">
            <h1>${title}</h1>
            <div class="meta">
                <p><strong>${language === 'id' ? 'Dipublikasikan' : 'Published'}:</strong> ${readableDate} | 
                <strong>${language === 'id' ? 'Penulis' : 'Author'}:</strong> Express English Hub | 
                <strong>${language === 'id' ? 'Waktu Baca' : 'Reading Time'}:</strong> ${language === 'id' ? '8 menit' : '8 minutes'}</p>
                <p><strong>${language === 'id' ? 'Kata Kunci' : 'Keywords'}:</strong> ${keywords.join(', ')}</p>
            </div>
        </div>
        
        ${content}
        
        <div class="article-footer">
            <p><strong>Express English Hub</strong> - ${language === 'id' ? 'Platform TOEFL Terpercaya di Indonesia' : 'Trusted TOEFL Platform in Indonesia'}</p>
            <p>${language === 'id' ? 'Bergabung dengan ribuan siswa yang telah mencapai skor TOEFL impian mereka!' : 'Join thousands of students who have achieved their dream TOEFL scores!'}</p>
        </div>
    </article>
</body>
</html>`;
}

// Delete article endpoint
app.post('/api/delete-article.php', checkAuth, (req, res) => {
  const { filename } = req.body;
  
  if (!filename) {
    return res.json({ success: false, error: 'Filename is required' });
  }
  
  try {
    const filePath = path.join(__dirname, 'articles', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.json({ success: false, error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve articles
app.get('/articles/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'articles', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Article not found');
  }
  
  res.sendFile(filePath);
});

// Serve static files (after API routes)
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
});

module.exports = app;