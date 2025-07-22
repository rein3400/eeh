# Express English Hub - TOEFL Preparation Platform

Sebuah platform persiapan TOEFL ITP & iBT yang komprehensif dengan antarmuka yang responsif dan modern.

## 🚀 Fitur

- **Multi-page Application**: Home, Products, TOEFL ITP, TOEFL iBT, Blog, Contact
- **Responsive Design**: Optimized untuk semua ukuran layar
- **Performance**: Lazy loading, code splitting, dan optimasi bundle
- **Modern Tech Stack**: Vite + React + TypeScript + Tailwind CSS
- **SEO Friendly**: Meta tags dan struktur yang dioptimalkan

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Routing**: React Router DOM

## 📦 Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy ke Netlify

### Opsi 1: Drag & Drop (Recommended)

1. Jalankan `npm run build` di local
2. Buka [Netlify](https://app.netlify.com)
3. Drag & drop folder `dist` ke Netlify dashboard
4. Website langsung live!

### Opsi 2: Git Integration

1. Push kode ke GitHub/GitLab/Bitbucket
2. Connect repository di Netlify
3. Build settings sudah dikonfigurasi otomatis:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Opsi 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy directly
npm run build
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
/app
├── public/              # Static assets
│   ├── logo.jpg        # Logo image
│   ├── bg.jpg          # Background image
│   └── _redirects      # Netlify routing config
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── dist/              # Production build output
├── netlify.toml       # Netlify configuration
└── package.json
```

## ⚙️ Configuration Files

- **`netlify.toml`**: Netlify build and deployment settings
- **`public/_redirects`**: SPA routing configuration
- **`vite.config.ts`**: Vite build configuration
- **`tailwind.config.js`**: Tailwind CSS configuration

## 🔧 Optimizations

- ✅ Code splitting dengan React lazy loading
- ✅ Asset optimization dan compression
- ✅ Tree shaking untuk bundle size minimal  
- ✅ Modern ES6+ dengan backward compatibility
- ✅ SEO meta tags dan Open Graph
- ✅ Performance headers dan caching

## 🚀 Live Demo

Setelah deploy, website akan tersedia di URL Netlify Anda.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan hubungi tim Express English Hub.

---

**Ready for production deployment on Netlify! 🎉**