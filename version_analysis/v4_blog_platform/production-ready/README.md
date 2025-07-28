# 🚀 TOEFL Blog Platform with AI Generator

Admin panel yang powerful untuk platform TOEFL dengan fitur blog generator menggunakan AI Google Gemini 2.5 Flash.

## ✨ Fitur Utama

### 🎯 Admin Panel Modern
- **Articles Management**: Kelola artikel dengan mudah
- **AI Blog Generator**: Generate artikel berkualitas tinggi dengan keyword
- **WordPress-style Interface**: Interface yang familiar dan mudah digunakan
- **File-based Storage**: Sistem penyimpanan artikel berbasis file HTML

### 🤖 AI Blog Generator
- **Google Gemini 2.5 Flash**: Model AI terdepan untuk content generation
- **Multi-language Support**: Bahasa Indonesia dan English
- **SEO Optimized**: Artikel otomatis SEO-friendly
- **Bulk Generation**: Generate multiple artikel sekaligus
- **Custom Keywords**: Generate berdasarkan keyword yang diinginkan

### 📁 Articles System
- **Auto-accessible**: File HTML di folder articles otomatis dapat diakses
- **SEO Structure**: Struktur HTML lengkap dengan meta tags
- **Responsive Design**: Template artikel responsive
- **Easy Management**: CRUD operations untuk artikel

## 🏗️ Struktur Aplikasi

```
/app/
├── dist/                    # Built React application
├── api/                     # PHP backend APIs
│   ├── generate-article.php # AI article generator
│   ├── articles.php         # List articles
│   ├── delete-article.php   # Delete articles
│   └── test-php.php        # PHP test endpoint
├── articles/               # Generated HTML articles
├── src/                    # React source code
│   ├── pages/
│   │   ├── AdminDashboard.tsx # Admin interface
│   │   └── Blog.tsx         # Blog page with dynamic loading
│   └── components/         # React components
├── .htaccess              # Apache routing rules
└── test-backend.html      # Backend testing interface
```

## 🚀 Quick Start untuk cPanel

### 1. Upload Files
- Upload semua file ke `public_html` directory di cPanel
- Pastikan struktur folder tetap terjaga

### 2. Set Permissions
```bash
chmod 755 articles/
chmod 755 api/
chmod 644 api/*.php
chmod 644 .htaccess
```

### 3. Test Backend
- Buka: `yourdomain.com/test-backend.html`
- Test semua API endpoints
- Generate artikel test

### 4. Access Admin Panel
- URL: `yourdomain.com/eeh-admin`
- Generate artikel menggunakan AI
- Kelola artikel yang sudah ada

## 🎮 Cara Penggunaan

### Generate Artikel Baru
1. Masuk ke admin panel (`/eeh-admin`)
2. Klik "Blog Generator" di sidebar
3. Masukkan keywords (contoh: "TOEFL preparation, study tips")
4. Pilih jumlah artikel (1-10)
5. Pilih bahasa (Indonesian/English)
6. Klik "Generate Articles"

### Kelola Artikel
1. Klik "Articles" di sidebar admin
2. Lihat daftar artikel yang sudah ada
3. Klik ikon mata untuk preview artikel
4. Klik ikon sampah untuk hapus artikel

### Akses Artikel
- Artikel otomatis dapat diakses di: `yourdomain.com/articles/filename.html`
- Artikel juga terintegrasi dengan halaman blog utama
- SEO-friendly URLs dan structure

## 🔧 API Endpoints

### POST /api/generate-article.php
Generate artikel baru menggunakan AI
```json
{
  "keywords": "TOEFL preparation tips",
  "count": 2,
  "language": "id"
}
```

### GET /api/articles.php
Dapatkan daftar semua artikel
```json
{
  "success": true,
  "articles": [...],
  "count": 5
}
```

### POST /api/delete-article.php
Hapus artikel tertentu
```json
{
  "filename": "artikel_toefl_2024-12-15_10-30-00_1.html"
}
```

## 🔐 Keamanan

- ✅ API key tersimpan aman di server-side
- ✅ Input validation dan sanitization
- ✅ Path traversal protection
- ✅ File type restrictions
- ✅ CORS headers configured

## 🎨 Customization

### Mengubah Template Artikel
Edit file `/api/generate-article.php` bagian prompts untuk mengubah struktur dan style artikel.

### Mengubah Interface Admin
Edit file `/src/pages/AdminDashboard.tsx` untuk kustomisasi interface admin panel.

### Menambah Kategori Blog
Edit file `/src/pages/Blog.tsx` untuk menambah kategori baru.

## 🐛 Troubleshooting

### Artikel tidak ter-generate
1. Cek PHP error logs di cPanel
2. Pastikan cURL extension aktif
3. Test koneksi internet server
4. Verifikasi API key masih valid

### File tidak tersimpan
1. Cek permissions folder `articles/`
2. Pastikan ada disk space available
3. Cek PHP file upload limits

### Admin panel tidak load
1. Cek file `.htaccess` sudah upload
2. Pastikan React build sudah complete
3. Cek browser console untuk errors

## 📞 Support

Jika ada masalah, cek file `test-backend.html` untuk debugging dan testing API endpoints.

## 🎯 Target Performance

- ⚡ **Page Load**: < 2 seconds
- 🤖 **AI Generation**: 10-30 seconds per artikel
- 📱 **Mobile Ready**: Responsive design
- 🔍 **SEO Score**: 90+ pada PageSpeed Insights

---

**Ready to deploy!** 🚀 Platform ini siap untuk production di cPanel hosting manapun.