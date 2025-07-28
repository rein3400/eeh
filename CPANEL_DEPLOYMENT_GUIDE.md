# 🚀 Express English Hub - cPanel Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Backend Issues Fixed:**
- All hardcoded localhost URLs removed
- CORS properly configured for production
- Relative API paths implemented
- Production build created
- Contact form API created

✅ **Files Ready for Upload:**
- `/app/cpanel-deployment/` folder contains all production files
- Static assets optimized and compressed
- PHP API endpoints configured
- .htaccess file for URL routing

## 📁 File Structure for cPanel Upload

```
public_html/
├── index.html (main entry point)
├── assets/ (CSS, JS, images)
├── api/ (PHP API endpoints)
├── articles/ (generated blog articles)
├── .htaccess (URL routing & security)
└── contact_submissions.log (contact form logs)
```

## 🔧 Step-by-Step Deployment

### Step 1: Upload Files
1. **Compress the deployment folder:**
   ```bash
   cd /app
   zip -r express-english-hub-cpanel.zip cpanel-deployment/
   ```

2. **Upload to cPanel:**
   - Login to your cPanel
   - Go to File Manager
   - Navigate to `public_html` folder
   - Upload `express-english-hub-cpanel.zip`
   - Extract all files to `public_html`

### Step 2: PHP Configuration
1. **Check PHP Version:**
   - Ensure PHP 7.4+ is enabled in cPanel
   - Enable required extensions: `curl`, `json`, `mbstring`

2. **Email Configuration:**
   - Edit `/api/contact.php`
   - Update line 54: `$to_email = 'your-email@domain.com';`
   - Update line 55: `$from_email = 'noreply@yourdomain.com';`

### Step 3: File Permissions
Set proper permissions via File Manager:
```
api/ folder: 755
api/*.php files: 644
articles/ folder: 755 (writable)
.htaccess: 644
```

### Step 4: Test Functionality

#### 🧪 Test Login System:
1. Go to `https://yourdomain.com/eeh-admin`
2. Login credentials:
   - Username: `Reze`
   - Password: `Denji`
3. Verify dashboard loads and articles display

#### 🧪 Test Contact Form:
1. Go to contact page
2. Fill and submit form
3. Check if email is received

#### 🧪 Test Blog Generator:
1. Login to admin
2. Go to "Blog Generator"
3. Enter keywords: "TOEFL tips, English learning"
4. Generate article and verify creation

## ⚙️ Configuration Files

### .htaccess Configuration
- ✅ URL rewriting for React Router
- ✅ API routing
- ✅ Security headers
- ✅ Cache optimization
- ✅ File compression

### Contact Form Settings
```php
// In /api/contact.php, update these:
$to_email = 'your-email@domain.com';
$from_email = 'noreply@yourdomain.com';
```

## 🔐 Security Settings

### Admin Credentials
- Default: Username `Reze`, Password `Denji`
- **IMPORTANT:** Change in `/api/login.php` lines 30-31

### Rate Limiting
- Contact form: 1 submission per minute per session
- Admin session: 24-hour timeout

## 🐛 Troubleshooting

### Login Issues:
```php
// Check PHP error logs in cPanel
// Verify CORS headers in browser network tab
// Ensure PHP session support is enabled
```

### Contact Form Issues:
```php
// Check email configuration in cPanel
// Verify mail() function is enabled
// Check contact_submissions.log for errors
```

### Article Generation Issues:
```php
// Verify cURL is enabled for external API calls
// Check articles/ folder permissions (must be writable)
// Verify OpenRouter API key in generate-article.php
```

## 📊 Monitoring & Maintenance

### Log Files Location:
- Contact submissions: `/contact_submissions.log`
- PHP errors: cPanel Error Logs
- Access logs: cPanel Access Logs

### Regular Maintenance:
1. Monitor article storage space
2. Review contact form submissions
3. Update API keys if needed
4. Backup articles folder regularly

## 🚀 Go Live Checklist

- [ ] Files uploaded to public_html
- [ ] PHP version 7.4+ enabled
- [ ] Email configuration updated
- [ ] Admin login tested
- [ ] Contact form tested
- [ ] Article generation tested
- [ ] SSL certificate installed
- [ ] Domain propagated

## 📞 Support

If you encounter issues during deployment:

1. **Check Error Logs:** cPanel → Error Logs
2. **Verify PHP Extensions:** cPanel → PHP Selector
3. **Test API Endpoints:** Use browser dev tools network tab
4. **Contact Host Support:** For server-level issues

---

**✅ Your Express English Hub TOEFL platform is now ready for production deployment on cPanel!**

All backend errors have been resolved and the application is production-ready.