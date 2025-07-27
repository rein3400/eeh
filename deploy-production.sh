#!/bin/bash

# TOEFL Blog Platform - Production Deploy Script
# This script prepares the application for cPanel deployment

echo "🚀 Starting production deployment preparation..."

# Create deployment directory
echo "📁 Creating deployment structure..."
rm -rf production-ready
mkdir -p production-ready

# Copy built React app
echo "⚛️ Copying React build files..."
cp -r dist/* production-ready/

# Copy PHP API files
echo "🐘 Copying PHP API files..."
cp -r api production-ready/

# Copy articles directory (create if not exists)
echo "📄 Setting up articles directory..."
cp -r articles production-ready/ 2>/dev/null || mkdir -p production-ready/articles

# Copy configuration files
echo "⚙️ Copying configuration files..."
cp .htaccess production-ready/
cp test-backend.html production-ready/
cp README_CPANEL.md production-ready/README.md

# Create additional required files for cPanel
echo "📋 Creating cPanel-specific files..."

# Create a sample article if articles directory is empty
if [ ! "$(ls -A production-ready/articles)" ]; then
    cp articles/*.html production-ready/articles/ 2>/dev/null || echo "No sample articles to copy"
fi

# Create deployment info file
cat > production-ready/DEPLOYMENT_INFO.txt << EOL
TOEFL Blog Platform - Production Ready
=====================================

Deployment Date: $(date)
Build Version: 1.0.0
Features:
- AI Blog Generator (Google Gemini 2.5 Flash)
- Articles Management System  
- WordPress-style Admin Panel
- SEO Optimized Articles
- Responsive Design

Installation:
1. Upload all files to public_html
2. Set articles/ folder permissions to 755
3. Visit yourdomain.com/test-backend.html to test
4. Access admin at yourdomain.com/eeh-admin

API Key: Already configured server-side
Backend: PHP with cURL support required
Frontend: Static React build (no Node.js needed)
EOL

# Set proper permissions preview (for cPanel reference)
cat > production-ready/SET_PERMISSIONS.txt << EOL
Set these permissions in cPanel File Manager:

Folders (755):
- articles/
- api/

Files (644):
- All PHP files in api/
- .htaccess
- All HTML files

Note: Most cPanel hosting automatically sets correct permissions,
but if you encounter issues, use these settings.
EOL

echo "✅ Production deployment ready!"
echo "📦 Files prepared in: production-ready/"
echo ""
echo "🚀 Next steps:"
echo "1. Zip the 'production-ready' folder"
echo "2. Upload to your cPanel public_html"
echo "3. Extract the files"
echo "4. Visit yourdomain.com/test-backend.html to test"
echo "5. Access admin panel at yourdomain.com/eeh-admin"
echo ""
echo "🎯 Your TOEFL blog platform is ready for cPanel hosting!"