import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  Target,
  Globe,
  Award,
  TrendingUp,
  Users,
  MessageCircle,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Tag,
  Heart,
  Bookmark
} from 'lucide-react';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [visiblePosts, setVisiblePosts] = useState<Set<number>>(new Set());
  const [dynamicArticles, setDynamicArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const postsPerPage = 6;
  const blogRef = useRef<HTMLElement>(null);

  // Load dynamic articles from backend
  useEffect(() => {
    loadDynamicArticles();
  }, []);

  const loadDynamicArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/articles.php');
      const data = await response.json();
      if (data.success && data.articles) {
        const formattedArticles = data.articles.map((article: any, index: number) => ({
          id: 1000 + index, // Start from 1000 to avoid conflicts with static posts
          title: article.title,
          excerpt: `Artikel yang dihasilkan secara otomatis menggunakan AI untuk memberikan insight terbaru tentang TOEFL dan pembelajaran bahasa Inggris.`,
          content: `Baca artikel lengkap dengan mengklik tombol di bawah ini.`,
          author: "AI Content Generator",
          date: article.created.split(' ')[0], // Get only date part
          category: "AI Generated",
          readTime: "5 min",
          image: "🤖",
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 50) + 10,
          tags: ["AI Generated", "TOEFL", "Auto Content"],
          filename: article.filename,
          isDynamic: true
        }));
        setDynamicArticles(formattedArticles);
      }
    } catch (error) {
      console.error('Error loading dynamic articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animations
  const animations = {
    fadeInUp: {
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'all 0.6s ease',
    },
    fadeInLeft: {
      opacity: 0,
      transform: 'translateX(-30px)',
      transition: 'all 0.6s ease',
    },
    scaleIn: {
      opacity: 0,
      transform: 'scale(0.9)',
      transition: 'all 0.5s ease',
    },
  };

  // CSS Keyframes
  const keyframes = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease forwards; }
    .animate-fade-in-left { animation: fadeInLeft 0.6s ease forwards; }
    .animate-scale-in { animation: scaleIn 0.5s ease forwards; }
    .animate-pulse-gentle { animation: pulse 2s ease-in-out infinite; }
  `;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Intersection Observer for animations
  const useIntersectionObserver = useCallback((ref: React.RefObject<HTMLElement>, callback: IntersectionObserverCallback, options = {}) => {
    useEffect(() => {
      const observer = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, callback]);
  }, []);

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips Efektif Meningkatkan Skor TOEFL Reading",
      excerpt: "Pelajari strategi terbukti untuk menguasai section reading TOEFL dan meraih skor tinggi dengan teknik skimming dan scanning yang tepat.",
      content: "Reading section adalah salah satu bagian terpenting dalam tes TOEFL. Dengan strategi yang tepat, Anda dapat meningkatkan skor secara signifikan...",
      author: "Dr. Sarah Johnson",
      date: "2024-12-10",
      category: "Tips",
      readTime: "8 min",
      image: "📚",
      views: 1250,
      likes: 89,
      tags: ["TOEFL", "Reading", "Tips", "Strategy"]
    },
    {
      id: 2,
      title: "Perbedaan TOEFL ITP vs iBT: Mana yang Tepat untuk Anda?",
      excerpt: "Memahami perbedaan mendasar antara TOEFL ITP dan iBT untuk memilih jenis tes yang sesuai dengan kebutuhan akademik dan karir Anda.",
      content: "TOEFL ITP dan iBT memiliki karakteristik yang berbeda. Artikel ini akan membantu Anda memahami perbedaan keduanya...",
      author: "Prof. Michael Chen",
      date: "2024-12-08",
      category: "Panduan",
      readTime: "12 min",
      image: "🎯",
      views: 2100,
      likes: 156,
      tags: ["TOEFL ITP", "TOEFL iBT", "Comparison", "Guide"]
    },
    {
      id: 3,
      title: "Cara Mengatasi Nervous Saat Tes TOEFL Speaking",
      excerpt: "Teknik psikologi dan persiapan mental untuk mengatasi kecemasan saat menghadapi section speaking TOEFL dan tampil percaya diri.",
      content: "Speaking section seringkali menjadi momok bagi test takers. Berikut adalah strategi untuk mengatasi nervous dan tampil maksimal...",
      author: "Dr. Lisa Wang",
      date: "2024-12-05",
      category: "Tips",
      readTime: "6 min",
      image: "🎤",
      views: 890,
      likes: 67,
      tags: ["Speaking", "Psychology", "Confidence", "Tips"]
    },
    {
      id: 4,
      title: "Beasiswa Luar Negeri dengan Skor TOEFL: Panduan Lengkap",
      excerpt: "Daftar beasiswa internasional yang membutuhkan skor TOEFL dan tips untuk memenuhi persyaratan minimum yang diperlukan.",
      content: "Banyak beasiswa bergengsi mensyaratkan skor TOEFL tertentu. Artikel ini membahas berbagai peluang beasiswa...",
      author: "Amanda Rodriguez",
      date: "2024-12-03",
      category: "Beasiswa",
      readTime: "15 min",
      image: "🏆",
      views: 3200,
      likes: 245,
      tags: ["Scholarship", "International", "Requirements", "Opportunities"]
    },
    {
      id: 5,
      title: "Strategi Time Management untuk TOEFL Listening",
      excerpt: "Teknik manajemen waktu yang efektif untuk section listening TOEFL agar dapat menjawab semua soal dengan optimal.",
      content: "Time management adalah kunci sukses dalam TOEFL listening. Pelajari teknik-teknik yang telah terbukti efektif...",
      author: "James Thompson",
      date: "2024-12-01",
      category: "Tips",
      readTime: "10 min",
      image: "⏰",
      views: 1560,
      likes: 112,
      tags: ["Listening", "Time Management", "Strategy", "Efficiency"]
    },
    {
      id: 6,
      title: "Universitas Top Dunia yang Menerima TOEFL ITP",
      excerpt: "Daftar universitas ternama di berbagai negara yang menerima skor TOEFL ITP untuk program sarjana dan pascasarjana.",
      content: "TOEFL ITP diterima oleh banyak universitas terkemuka. Berikut adalah daftar lengkap universitas yang menerima TOEFL ITP...",
      author: "Dr. Robert Kim",
      date: "2024-11-28",
      category: "Universitas",
      readTime: "20 min",
      image: "🌍",
      views: 2800,
      likes: 198,
      tags: ["Universities", "Acceptance", "Global", "Education"]
    },
    {
      id: 7,
      title: "Vocabulary Building untuk TOEFL: 1000 Kata Wajib",
      excerpt: "Kumpulan 1000 vocabulary penting yang sering muncul dalam tes TOEFL beserta teknik menghafal yang efektif.",
      content: "Vocabulary yang kuat adalah fondasi sukses TOEFL. Artikel ini menyajikan 1000 kata penting yang harus dikuasai...",
      author: "Dr. Emily Davis",
      date: "2024-11-25",
      category: "Vocabulary",
      readTime: "25 min",
      image: "📖",
      views: 4100,
      likes: 312,
      tags: ["Vocabulary", "Word List", "Memory Techniques", "Essential"]
    },
    {
      id: 8,
      title: "TOEFL Writing: Template dan Struktur Essay yang Efektif",
      excerpt: "Template dan struktur essay yang terbukti efektif untuk meraih skor tinggi di section writing TOEFL.",
      content: "Writing section membutuhkan struktur yang jelas dan template yang tepat. Pelajari framework yang telah terbukti...",
      author: "Prof. David Wilson",
      date: "2024-11-22",
      category: "Writing",
      readTime: "18 min",
      image: "✍️",
      views: 2650,
      likes: 187,
      tags: ["Writing", "Templates", "Essay Structure", "Framework"]
    },
    {
      id: 9,
      title: "Success Story: Dari Skor 450 ke 550 dalam 3 Bulan",
      excerpt: "Kisah inspiratif seorang mahasiswa yang berhasil meningkatkan skor TOEFL ITP dari 450 ke 550 hanya dalam 3 bulan.",
      content: "Baca kisah inspiratif Maria yang berhasil meningkatkan skor TOEFL secara dramatis dengan strategi yang tepat...",
      author: "Maria Gonzalez",
      date: "2024-11-20",
      category: "Success Story",
      readTime: "12 min",
      image: "🌟",
      views: 1890,
      likes: 143,
      tags: ["Success Story", "Improvement", "Motivation", "Achievement"]
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Artikel', count: blogPosts.length },
    { id: 'Tips', name: 'Tips & Strategi', count: blogPosts.filter(post => post.category === 'Tips').length },
    { id: 'Panduan', name: 'Panduan', count: blogPosts.filter(post => post.category === 'Panduan').length },
    { id: 'Beasiswa', name: 'Beasiswa', count: blogPosts.filter(post => post.category === 'Beasiswa').length },
    { id: 'Success Story', name: 'Success Story', count: blogPosts.filter(post => post.category === 'Success Story').length },
    { id: 'Universitas', name: 'Universitas', count: blogPosts.filter(post => post.category === 'Universitas').length }
  ];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Featured posts (top 3 most viewed)
  const featuredPosts = [...blogPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e97311] to-orange-600 py-20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Blog & Artikel TOEFL</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Blog TOEFL
                <span className="block text-orange-200 text-2xl md:text-3xl mt-2">
                  Tips, Panduan & Inspirasi untuk Sukses TOEFL
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Temukan artikel terbaru, tips efektif, dan panduan lengkap untuk membantu Anda 
                meraih skor TOEFL impian dan mewujudkan mimpi studi luar negeri.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari artikel, tips, atau topik..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 text-orange-200">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="text-sm">{blogPosts.length}+ Artikel</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">10K+ Pembaca</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="text-sm">Update Mingguan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Artikel Terpopuler
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Artikel yang paling banyak dibaca dan memberikan dampak nyata bagi pembaca
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    ...animations.fadeInUp
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{post.image}</span>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block bg-[#e97311] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#e97311] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-[#e97311] text-white py-3 rounded-lg hover:bg-[#d4640e] transition-colors font-semibold flex items-center justify-center group">
                      Baca Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Blog Section */}
        <section ref={blogRef} className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Kategori</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === category.id
                            ? 'bg-[#e97311] text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white text-[#e97311]'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Popular Tags */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tag Populer</h4>
                    <div className="flex flex-wrap gap-2">
                      {['TOEFL', 'Tips', 'Strategy', 'Reading', 'Speaking', 'Writing', 'Listening', 'Scholarship'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchTerm(tag)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#e97311] hover:text-white transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                {/* Results Info */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory === 'all' ? 'Semua Artikel' : categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Menampilkan {filteredPosts.length} artikel
                      {searchTerm && ` untuk "${searchTerm}"`}
                    </p>
                  </div>
                  
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-[#e97311] hover:text-[#d4640e] font-medium"
                    >
                      Hapus Filter
                    </button>
                  )}
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {currentPosts.map((post, index) => (
                    <article 
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        ...animations.scaleIn
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{post.image}</span>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-[#e97311] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#e97311] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="bg-[#e97311] text-white px-6 py-2 rounded-lg hover:bg-[#d4640e] transition-colors font-semibold flex items-center group">
                            Baca
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === page
                            ? 'bg-[#e97311] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
                    <p className="text-gray-600 mb-4">
                      Coba ubah kata kunci pencarian atau pilih kategori lain
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="bg-[#e97311] text-white px-6 py-3 rounded-lg hover:bg-[#d4640e] transition-colors font-semibold"
                    >
                      Lihat Semua Artikel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-[#e97311] to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Dapatkan Update Artikel Terbaru
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Berlangganan newsletter kami dan dapatkan tips TOEFL terbaru, panduan belajar, 
              dan informasi beasiswa langsung di email Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="bg-white text-[#e97311] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Berlangganan
              </button>
            </div>

            <div className="mt-6 flex justify-center items-center space-x-6 text-orange-200 text-sm">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Tips Mingguan</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                <span>Konten Eksklusif</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span>Update Beasiswa</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;

