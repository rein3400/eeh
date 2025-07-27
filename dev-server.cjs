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

// Indonesian Content Generator
function generateIndonesianContent(title, primaryKeyword, keywords) {
  return `
        <div class="toc">
            <h3>📋 Daftar Isi</h3>
            <ul>
                <li><a href="#pendahuluan">Pendahuluan</a></li>
                <li><a href="#mengapa-penting">Mengapa ${primaryKeyword} Penting?</a></li>
                <li><a href="#panduan-lengkap">Panduan Lengkap ${primaryKeyword}</a></li>
                <li><a href="#tips-strategi">Tips dan Strategi Terbukti</a></li>
                <li><a href="#kesalahan-umum">Kesalahan yang Harus Dihindari</a></li>
                <li><a href="#resources">Sumber Daya Tambahan</a></li>
                <li><a href="#kesimpulan">Kesimpulan</a></li>
            </ul>
        </div>
        
        <h2 id="pendahuluan">🎯 Pendahuluan</h2>
        <p>Dalam era globalisasi ini, <strong>${primaryKeyword}</strong> menjadi salah satu keterampilan yang sangat penting untuk dikuasai. Banyak orang mencari informasi tentang <strong>${keywords.join(', ')}</strong> untuk meningkatkan kemampuan mereka.</p>
        
        <div class="highlight-box">
            <p><strong>Tahukah Anda?</strong> Menguasai ${primaryKeyword} dapat meningkatkan peluang karir hingga 300% dan membuka akses ke beasiswa internasional senilai miliaran rupiah.</p>
        </div>
        
        <p>Artikel ini akan membahas secara komprehensif tentang ${primaryKeyword}, memberikan panduan praktis, tips terbukti, dan strategi yang dapat langsung Anda terapkan.</p>
        
        <h2 id="mengapa-penting">🔥 Mengapa ${primaryKeyword} Sangat Penting?</h2>
        <p>Ada beberapa alasan mengapa ${primaryKeyword} menjadi keterampilan yang wajib dikuasai di tahun 2025:</p>
        
        <ul>
            <li><strong>Peluang Karir Global:</strong> Perusahaan multinasional sangat menghargai kandidat yang menguasai ${primaryKeyword}</li>
            <li><strong>Akses Pendidikan Internasional:</strong> Universitas terbaik dunia mensyaratkan kemampuan ${primaryKeyword}</li>
            <li><strong>Pengembangan Diri:</strong> Meningkatkan confidence dan kemampuan komunikasi</li>
            <li><strong>Networking Internasional:</strong> Membuka kesempatan berkolaborasi dengan profesional global</li>
        </ul>
        
        <div class="tip">
            <strong>Pro Tip:</strong> Investasi waktu 30 menit per hari untuk ${primaryKeyword} dapat memberikan hasil signifikan dalam 3-6 bulan.
        </div>
        
        <h2 id="panduan-lengkap">📚 Panduan Lengkap ${primaryKeyword}</h2>
        <p>Berikut adalah panduan step-by-step yang telah terbukti efektif untuk menguasai ${primaryKeyword}:</p>
        
        <h3>Langkah 1: Persiapan dan Assessment</h3>
        <p>Sebelum memulai, penting untuk mengetahui level kemampuan Anda saat ini. Lakukan self-assessment untuk menentukan starting point yang tepat.</p>
        
        <h3>Langkah 2: Perencanaan Studi Sistematis</h3>
        <p>Buat jadwal belajar yang realistis dan konsisten. Fokus pada ${keywords.slice(0, 3).join(', ')} sebagai fondasi utama.</p>
        
        <h3>Langkah 3: Implementasi Strategi Terbukti</h3>
        <p>Gunakan metode yang telah terbukti efektif untuk mempercepat proses pembelajaran Anda.</p>
        
        <div class="cta">
            <h3>🚀 Siap Meningkatkan Kemampuan Anda?</h3>
            <p>Bergabung dengan Express English Hub dan raih skor TOEFL impian Anda bersama mentor berpengalaman!</p>
        </div>
        
        <h2 id="tips-strategi">💡 Tips dan Strategi Terbukti</h2>
        <p>Berikut adalah tips yang telah membantu ribuan siswa berhasil menguasai ${primaryKeyword}:</p>
        
        <ol>
            <li><strong>Konsistensi adalah Kunci:</strong> Lakukan latihan rutin setiap hari, minimal 30 menit</li>
            <li><strong>Gunakan Sumber Terpercaya:</strong> Pilih materi pembelajaran yang berkualitas tinggi</li>
            <li><strong>Practice Makes Perfect:</strong> Lakukan simulasi dan latihan soal secara intensif</li>
            <li><strong>Join Study Group:</strong> Belajar bersama teman dapat meningkatkan motivasi</li>
            <li><strong>Track Progress:</strong> Monitor perkembangan untuk mengetahui area yang perlu diperbaiki</li>
        </ol>
        
        <h3>Strategi Khusus untuk ${primaryKeyword}</h3>
        <p>Untuk mencapai hasil maksimal dalam ${primaryKeyword}, terapkan strategi berikut:</p>
        
        <ul>
            <li>Fokus pada weaknesses dan perkuat strengths</li>
            <li>Gunakan teknik active learning untuk retention yang lebih baik</li>
            <li>Manfaatkan technology untuk pembelajaran yang lebih efektif</li>
            <li>Regular evaluation dan adjustment strategi sesuai progress</li>
        </ul>
        
        <h2 id="kesalahan-umum">❌ Kesalahan yang Harus Dihindari</h2>
        <p>Banyak orang membuat kesalahan dalam belajar ${primaryKeyword}. Hindari kesalahan berikut:</p>
        
        <div class="highlight-box">
            <h4>5 Kesalahan Fatal dalam ${primaryKeyword}:</h4>
            <ol>
                <li>Tidak memiliki target yang jelas dan terukur</li>
                <li>Belajar tanpa sistem dan perencanaan matang</li>
                <li>Mengabaikan fundamental dan ingin cepat ke advanced</li>
                <li>Tidak konsisten dalam jadwal belajar</li>
                <li>Terlalu fokus pada theory tanpa practice</li>
            </ol>
        </div>
        
        <h2 id="resources">📖 Sumber Daya Tambahan</h2>
        <p>Untuk mendukung pembelajaran ${primaryKeyword} Anda, manfaatkan sumber daya berikut:</p>
        
        <h3>Rekomendasi Platform Online</h3>
        <ul>
            <li><strong>Express English Hub:</strong> Platform terpercaya dengan mentor berpengalaman</li>
            <li><strong>Official Practice Tests:</strong> Soal-soal resmi untuk simulasi</li>
            <li><strong>Mobile Apps:</strong> Aplikasi untuk latihan di waktu senggang</li>
            <li><strong>YouTube Channels:</strong> Video tutorial gratis berkualitas tinggi</li>
        </ul>
        
        <h3>Tips Memilih Sumber Belajar</h3>
        <p>Pastikan sumber belajar yang Anda pilih memiliki karakteristik berikut:</p>
        <ul>
            <li>Update dengan standar terbaru</li>
            <li>Dibuat oleh expert bersertifikat</li>
            <li>Memiliki track record yang terbukti</li>
            <li>Menyediakan feedback dan assessment</li>
        </ul>
        
        <div class="conclusion">
            <h2 id="kesimpulan">🎉 Kesimpulan</h2>
            <p>Menguasai <strong>${primaryKeyword}</strong> memang membutuhkan dedikasi dan strategi yang tepat. Dengan mengikuti panduan komprehensif ini, Anda telah memiliki roadmap yang jelas untuk mencapai tujuan Anda.</p>
            
            <p>Ingatlah bahwa kesuksesan dalam ${primaryKeyword} tidak datang dalam semalam. Konsistensi, kerja keras, dan strategi yang tepat adalah kunci utama. Mulai dari sekarang, terapkan tips dan strategi yang telah dibagikan dalam artikel ini.</p>
            
            <p><strong>Key Takeaways:</strong></p>
            <ul>
                <li>${primaryKeyword} adalah investasi jangka panjang untuk masa depan</li>
                <li>Konsistensi dan perencanaan matang sangat penting</li>
                <li>Gunakan sumber daya terpercaya dan berkualitas</li>
                <li>Monitor progress secara regular</li>
                <li>Jangan takut untuk meminta bantuan expert</li>
            </ul>
        </div>`;
}

// English Content Generator
function generateEnglishContent(title, primaryKeyword, keywords) {
  return `
        <div class="toc">
            <h3>📋 Table of Contents</h3>
            <ul>
                <li><a href="#introduction">Introduction</a></li>
                <li><a href="#why-important">Why ${primaryKeyword} is Important?</a></li>
                <li><a href="#complete-guide">Complete ${primaryKeyword} Guide</a></li>
                <li><a href="#tips-strategies">Proven Tips and Strategies</a></li>
                <li><a href="#common-mistakes">Common Mistakes to Avoid</a></li>
                <li><a href="#resources">Additional Resources</a></li>
                <li><a href="#conclusion">Conclusion</a></li>
            </ul>
        </div>
        
        <h2 id="introduction">🎯 Introduction</h2>
        <p>In today's globalized world, <strong>${primaryKeyword}</strong> has become one of the most essential skills to master. Many people are searching for information about <strong>${keywords.join(', ')}</strong> to enhance their abilities.</p>
        
        <div class="highlight-box">
            <p><strong>Did You Know?</strong> Mastering ${primaryKeyword} can increase career opportunities by up to 300% and open access to international scholarships worth billions.</p>
        </div>
        
        <p>This article will comprehensively discuss ${primaryKeyword}, providing practical guidance, proven tips, and strategies that you can immediately apply.</p>
        
        <h2 id="why-important">🔥 Why ${primaryKeyword} is Extremely Important?</h2>
        <p>There are several reasons why ${primaryKeyword} has become a mandatory skill to master in 2025:</p>
        
        <ul>
            <li><strong>Global Career Opportunities:</strong> Multinational companies highly value candidates who master ${primaryKeyword}</li>
            <li><strong>International Education Access:</strong> Top world universities require ${primaryKeyword} proficiency</li>
            <li><strong>Personal Development:</strong> Increases confidence and communication skills</li>
            <li><strong>International Networking:</strong> Opens opportunities to collaborate with global professionals</li>
        </ul>
        
        <div class="tip">
            <strong>Pro Tip:</strong> Investing 30 minutes daily in ${primaryKeyword} can yield significant results within 3-6 months.
        </div>
        
        <h2 id="complete-guide">📚 Complete ${primaryKeyword} Guide</h2>
        <p>Here's a proven step-by-step guide to master ${primaryKeyword}:</p>
        
        <h3>Step 1: Preparation and Assessment</h3>
        <p>Before starting, it's important to know your current skill level. Conduct a self-assessment to determine the right starting point.</p>
        
        <h3>Step 2: Systematic Study Planning</h3>
        <p>Create a realistic and consistent study schedule. Focus on ${keywords.slice(0, 3).join(', ')} as your main foundation.</p>
        
        <h3>Step 3: Implementation of Proven Strategies</h3>
        <p>Use methods that have been proven effective to accelerate your learning process.</p>
        
        <div class="cta">
            <h3>🚀 Ready to Boost Your Skills?</h3>
            <p>Join Express English Hub and achieve your dream TOEFL score with experienced mentors!</p>
        </div>
        
        <h2 id="tips-strategies">💡 Proven Tips and Strategies</h2>
        <p>Here are tips that have helped thousands of students successfully master ${primaryKeyword}:</p>
        
        <ol>
            <li><strong>Consistency is Key:</strong> Practice daily for at least 30 minutes</li>
            <li><strong>Use Reliable Sources:</strong> Choose high-quality learning materials</li>
            <li><strong>Practice Makes Perfect:</strong> Conduct intensive simulations and exercises</li>
            <li><strong>Join Study Groups:</strong> Learning with peers can boost motivation</li>
            <li><strong>Track Progress:</strong> Monitor development to identify areas for improvement</li>
        </ol>
        
        <h3>Special Strategies for ${primaryKeyword}</h3>
        <p>To achieve maximum results in ${primaryKeyword}, apply these strategies:</p>
        
        <ul>
            <li>Focus on weaknesses while strengthening your strengths</li>
            <li>Use active learning techniques for better retention</li>
            <li>Leverage technology for more effective learning</li>
            <li>Regular evaluation and strategy adjustment based on progress</li>
        </ul>
        
        <h2 id="common-mistakes">❌ Mistakes to Avoid</h2>
        <p>Many people make mistakes when learning ${primaryKeyword}. Avoid these common errors:</p>
        
        <div class="highlight-box">
            <h4>5 Fatal Mistakes in ${primaryKeyword}:</h4>
            <ol>
                <li>Not having clear and measurable targets</li>
                <li>Learning without system and proper planning</li>
                <li>Ignoring fundamentals and wanting to jump to advanced</li>
                <li>Being inconsistent with study schedule</li>
                <li>Focusing too much on theory without practice</li>
            </ol>
        </div>
        
        <h2 id="resources">📖 Additional Resources</h2>
        <p>To support your ${primaryKeyword} learning, utilize these resources:</p>
        
        <h3>Recommended Online Platforms</h3>
        <ul>
            <li><strong>Express English Hub:</strong> Trusted platform with experienced mentors</li>
            <li><strong>Official Practice Tests:</strong> Official questions for simulation</li>
            <li><strong>Mobile Apps:</strong> Applications for practice during spare time</li>
            <li><strong>YouTube Channels:</strong> High-quality free tutorial videos</li>
        </ul>
        
        <h3>Tips for Choosing Learning Resources</h3>
        <p>Make sure your chosen learning resources have these characteristics:</p>
        <ul>
            <li>Updated with latest standards</li>
            <li>Created by certified experts</li>
            <li>Has proven track record</li>
            <li>Provides feedback and assessment</li>
        </ul>
        
        <div class="conclusion">
            <h2 id="conclusion">🎉 Conclusion</h2>
            <p>Mastering <strong>${primaryKeyword}</strong> indeed requires dedication and the right strategy. By following this comprehensive guide, you now have a clear roadmap to achieve your goals.</p>
            
            <p>Remember that success in ${primaryKeyword} doesn't come overnight. Consistency, hard work, and proper strategy are the main keys. Starting now, apply the tips and strategies shared in this article.</p>
            
            <p><strong>Key Takeaways:</strong></p>
            <ul>
                <li>${primaryKeyword} is a long-term investment for the future</li>
                <li>Consistency and proper planning are crucial</li>
                <li>Use trusted and quality resources</li>
                <li>Monitor progress regularly</li>
                <li>Don't hesitate to seek expert help</li>
            </ul>
        </div>`;
}

// Sanitize filename function
function sanitizeFilename(filename) {
  // Remove HTML tags and special characters
  return filename
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 60);
}