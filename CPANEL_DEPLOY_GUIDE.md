# 🚀 Panduan Deploy ke cPanel - Express English Hub

Website TOEFL preparation Anda sudah siap untuk deploy ke cPanel hosting!

## ✅ Yang Sudah Disiapkan:

1. **Production Build**: Semua file sudah dioptimasi dan siap produksi
2. **Apache Configuration**: File `.htaccess` untuk routing SPA
3. **Performance**: Asset compression dan caching headers
4. **Security**: Security headers untuk perlindungan XSS dan clickjacking
5. **SEO**: Meta tags dan struktur sudah optimal

---

## 📁 File yang Siap Upload:

Semua file yang perlu diupload ada di folder `dist/`:

```
dist/
├── index.html          # Halaman utama
├── .htaccess          # Konfigurasi Apache (PENTING!)
├── logo.jpg           # Logo website
├── bg.jpg             # Background image
└── assets/            # File CSS & JS yang sudah dioptimasi
    ├── index-Bh3rbnCX.css
    ├── index-vG1uyktB.js
    ├── vendor-Bm7FCeSL.js
    ├── router-CwukqiiY.js
    ├── icons-C_GGxL09.js
    └── animation-DDDKYQSc.js
```

---

## 🎯 Cara Deploy ke cPanel (3 Langkah):

### **Langkah 1: Akses File Manager cPanel**

1. Login ke **cPanel** hosting Anda
2. Cari dan klik **"File Manager"**
3. Navigasi ke folder **`public_html`** (atau folder domain Anda)
4. Jika ada file existing, backup atau hapus terlebih dahulu

### **Langkah 2: Upload File**

**Pilihan A: Upload Manual (Recommended)**
1. Di File Manager, klik **"Upload"**
2. Upload semua file dari folder `dist/` ke folder `public_html`
3. Pastikan struktur folder tetap sama
4. **PENTING**: Pastikan file `.htaccess` ter-upload (kadang tersembunyi)

**Pilihan B: Upload ZIP**
1. Compress folder `dist/` menjadi `website.zip`
2. Upload `website.zip` ke `public_html`
3. Extract di cPanel File Manager
4. Pindahkan semua file dari folder hasil extract ke root `public_html`
5. Hapus file ZIP dan folder kosong

### **Langkah 3: Verifikasi**

1. **Cek File**: Pastikan semua file ada di `public_html`
2. **Cek .htaccess**: Pastikan file `.htaccess` ada dan readable
3. **Test Website**: Buka domain Anda di browser
4. **Test Routing**: Coba akses berbagai halaman (contoh: yourdomain.com/products)

---

## ✅ Checklist Deployment:

- [ ] Semua file dari folder `dist/` sudah ter-upload
- [ ] File `.htaccess` ada dan tidak corrupt
- [ ] Index.html bisa diakses via domain
- [ ] Routing berfungsi (coba akses /products, /contact, dll)
- [ ] Images (logo.jpg, bg.jpg) loading dengan benar
- [ ] CSS dan styling tampil dengan baik
- [ ] Tidak ada error di browser console

---

## 🔧 Troubleshooting:

### **Problem: Halaman tidak ditemukan (404) saat akses routing**
**Solusi**: 
- Pastikan file `.htaccess` ter-upload
- Cek permission file `.htaccess` (harus 644)
- Pastikan hosting support mod_rewrite (kebanyakan hosting support)

### **Problem: File CSS/JS tidak load**
**Solusi**:
- Cek struktur folder assets masih utuh
- Clear browser cache
- Cek permission files (644 untuk files, 755 untuk folders)

### **Problem: Images tidak tampil**
**Solusi**:
- Pastikan `logo.jpg` dan `bg.jpg` ter-upload
- Cek permission images (644)
- Cek console browser untuk error 404

### **Problem: Website loading lambat**
**Solusi**:
- File `.htaccess` sudah include compression dan caching
- Pastikan hosting support mod_deflate dan mod_expires
- Contact hosting provider jika masih lambat

---

## 🌟 Fitur yang Aktif Setelah Deploy:

✅ **Multi-page Navigation**: Home, Products, TOEFL ITP, TOEFL iBT, Blog, Contact
✅ **Responsive Design**: Mobile, tablet, desktop semua optimal
✅ **Fast Loading**: Asset sudah di-compress dan di-cache
✅ **SEO Ready**: Meta tags lengkap untuk search engine
✅ **Security**: XSS protection dan security headers aktif
✅ **Browser Caching**: 1 tahun cache untuk asset, 1 jam untuk HTML

---

## 📞 Support:

Jika ada masalah saat deployment:
1. Cek file `.htaccess` tidak corrupt
2. Pastikan hosting support Apache dengan mod_rewrite
3. Contact hosting provider jika ada issue server
4. Clear browser cache sebelum test

---

## 📝 Catatan Penting:

- **Jangan hapus file `.htaccess`** - ini penting untuk routing
- **Backup website lama** sebelum upload yang baru
- **Test di berbagai browser** setelah upload
- **Gunakan HTTPS** jika domain sudah ada SSL certificate

---

**🎉 Website Anda siap go live!**

**Total waktu deploy: < 10 menit**
**Zero technical configuration needed!**

---

*Express English Hub - TOEFL Preparation Platform is ready for production! 🚀*