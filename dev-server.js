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
app.use(express.static('.'));

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

// Generate article endpoint (placeholder)
app.post('/api/generate-article.php', checkAuth, async (req, res) => {
  const { keywords, count = 1, language = 'id' } = req.body;
  
  if (!keywords) {
    return res.json({ success: false, error: 'Keywords are required' });
  }
  
  try {
    // For now, create a simple placeholder article
    const articlesDir = path.join(__dirname, 'articles');
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    const generatedArticles = [];
    
    for (let i = 0; i < count; i++) {
      const title = `Article about ${keywords} - ${i + 1}`;
      const filename = `${keywords.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}_${i + 1}.html`;
      
      const htmlContent = `<!DOCTYPE html>
<html lang="${language === 'id' ? 'id' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="Professional article about ${keywords}">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        h1, h2, h3 { color: #e97311; }
        .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <article>
        <h1>${title}</h1>
        <div class="meta">
            <p>Published: ${new Date().toLocaleDateString()}</p>
            <p>Keywords: ${keywords}</p>
        </div>
        <h2>Introduction</h2>
        <p>This is a professionally generated article about ${keywords}. This is a placeholder content that demonstrates the article generation system.</p>
        
        <h2>Main Content</h2>
        <p>Here we would have high-quality, SEO-optimized content related to ${keywords}. The article would include relevant information, structured headings, and comprehensive coverage of the topic.</p>
        
        <h3>Key Points</h3>
        <ul>
            <li>Comprehensive coverage of ${keywords}</li>
            <li>SEO-optimized structure</li>
            <li>Professional formatting</li>
            <li>Educational content</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>This article provides valuable information about ${keywords} in a structured, professional format suitable for search engine optimization.</p>
    </article>
</body>
</html>`;
      
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

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
});

module.exports = app;