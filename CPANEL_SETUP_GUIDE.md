# TOEFL Blog Platform - cPanel Deployment Guide

## Requirements
- PHP 7.4 or higher
- cURL extension enabled
- File write permissions

## Installation Steps

1. Upload all files to your cPanel public_html directory
2. Set proper permissions:
   - articles/ folder: 755 (read/write/execute for owner)
   - api/ folder: 755
   - All PHP files: 644

3. Ensure .htaccess is properly uploaded and functional

4. Test the admin panel by visiting: yourdomain.com/eeh-admin

## Features

### Admin Panel
- Articles management
- AI-powered blog generator using Google Gemini 2.5 Flash
- WordPress-style interface
- File-based article storage

### Blog Generator
- Generates high-quality articles from keywords
- Supports Indonesian and English
- SEO-optimized HTML output
- Automatic file naming and organization

### Articles System
- HTML files automatically accessible via /articles/filename.html
- Integrated with main blog page
- Easy file management through admin interface

## API Endpoints

- POST /api/generate-article.php - Generate new articles
- GET /api/articles.php - List all articles
- POST /api/delete-article.php - Delete specific article

## Security Notes

- OpenRouter API key is stored server-side
- Input validation and sanitization implemented
- File access restricted to HTML files only
- Path traversal protection enabled

## Troubleshooting

1. If articles don't generate:
   - Check PHP error logs
   - Verify cURL is enabled
   - Ensure internet connectivity

2. If files don't save:
   - Check articles/ folder permissions
   - Verify disk space availability

3. If admin panel doesn't load:
   - Check .htaccess configuration
   - Verify React build is complete