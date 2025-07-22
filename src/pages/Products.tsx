import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe,
  Send,
  CheckCircle,
  Users,
  Award,
  Target,
  Clock,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Trophy,
  BookOpen,
  Video,
  Brain,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

// Inline animations
const animations = {
  fadeInUp: {
    animation: 'fadeInUp 0.6s ease-out forwards',
  },
  scaleIn: {
    animation: 'scaleIn 0.5s ease-out forwards',
  },
  popIn: {
    animation: 'popIn 0.6s ease-out forwards',
  },
  slideIn: {
    animation: 'slideIn 0.8s ease-out forwards',
  }
};

const keyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  50% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.float-animation {
  animation: float 3s ease-in-out infinite;
}
`;

interface Product {
  id: number;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  category: string;
  duration: string;
  rating: number;
  students: number;
  tags: string[];
  image: string;
  highlight?: string;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlay && !isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, isHovered]);

  const handleOnlineRegistration = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfIjU2ZlkbdiH1mcfN2U6khlsRg-k3x-KrEkkPDGS_J2rZRsA/formResponse', '_blank');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Produk yang sama persis dengan One Stop English Education
  const products: Product[] = [
    {
      id: 1,
      title: "TOEFL Preparation Test",
      description: "Tes Preparation secara online untuk mengukur sampai berapa skor tes sebelum mengambil real test untuk TOEFL ITP®",
      features: [
        "Tes simulasi TOEFL ITP®",
        "Hasil skor prediksi",
        "Analisis kemampuan per section",
        "Rekomendasi pembelajaran",
        "Akses online 24/7"
      ],
      badge: "SIMULASI",
      category: "preparation",
      duration: "115 menit",
      rating: 4.7,
      students: 1500,
      tags: ["Online", "Simulasi", "Prediksi Skor"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      highlight: "Ukur kemampuan Anda sebelum tes sesungguhnya"
    },
    {
      id: 2,
      title: "4 Hours One Day Before Test",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "4 jam intensive training",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Strategi last minute",
        "Tips & tricks khusus",
        "Materi eksklusif"
      ],
      badge: "INTENSIVE",
      category: "course-test",
      duration: "4 jam + tes",
      rating: 4.8,
      students: 800,
      tags: ["Intensive", "TOEFL Master", "Include Test"],
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
      highlight: "Persiapan intensif sehari sebelum tes"
    },
    {
      id: 3,
      title: "7 Days Short Course",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "7 hari pembelajaran intensif",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Materi lengkap semua section",
        "Practice tests harian",
        "Progress monitoring"
      ],
      badge: "POPULER",
      category: "course-test",
      duration: "7 hari + tes",
      rating: 4.9,
      students: 1200,
      tags: ["7 Hari", "Intensif", "Include Test"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      highlight: "Program singkat dengan hasil maksimal"
    },
    {
      id: 4,
      title: "10 Meeting Intensive",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "10 pertemuan intensif",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Personal attention",
        "Flexible scheduling",
        "Comprehensive materials"
      ],
      badge: "RECOMMENDED",
      category: "course-test",
      duration: "10 pertemuan + tes",
      rating: 4.9,
      students: 950,
      tags: ["10 Meeting", "Personal", "Flexible"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      highlight: "Pembelajaran personal dengan jadwal fleksibel"
    },
    {
      id: 5,
      title: "15 Meeting Intensive",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "15 pertemuan intensif",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Deep learning approach",
        "Advanced strategies",
        "Score guarantee program"
      ],
      badge: "ADVANCED",
      category: "course-test",
      duration: "15 pertemuan + tes",
      rating: 4.9,
      students: 750,
      tags: ["15 Meeting", "Advanced", "Score Guarantee"],
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop",
      highlight: "Program lanjutan dengan garansi skor"
    },
    {
      id: 6,
      title: "20 Meeting Intensive",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "20 pertemuan intensif",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Comprehensive coverage",
        "Multiple practice tests",
        "Premium support"
      ],
      badge: "COMPREHENSIVE",
      category: "course-test",
      duration: "20 pertemuan + tes",
      rating: 4.8,
      students: 600,
      tags: ["20 Meeting", "Comprehensive", "Premium"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      highlight: "Program komprehensif untuk hasil terbaik"
    },
    {
      id: 7,
      title: "30 Meeting Intensive",
      description: "Program kursus singkat bersama dengan TOEFL Master. Kursus telah include biaya tes TOEFL ITP® Resmi ETS dan Preparation",
      features: [
        "30 pertemuan intensif",
        "TOEFL Master instructor",
        "Include tes TOEFL ITP® resmi",
        "Complete mastery program",
        "Individual coaching",
        "Lifetime support"
      ],
      badge: "ULTIMATE",
      category: "course-test",
      duration: "30 pertemuan + tes",
      rating: 5.0,
      students: 400,
      tags: ["30 Meeting", "Ultimate", "Lifetime Support"],
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
      highlight: "Program ultimate untuk penguasaan sempurna"
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua Program', count: products.length },
    { id: 'preparation', label: 'Preparation Test', count: products.filter(p => p.category === 'preparation').length },
    { id: 'course-test', label: 'Course + Test', count: products.filter(p => p.category === 'course-test').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'SIMULASI': return 'bg-blue-500 text-white';
      case 'INTENSIVE': return 'bg-orange-500 text-white';
      case 'POPULER': return 'bg-[#e87211] text-white';
      case 'RECOMMENDED': return 'bg-green-500 text-white';
      case 'ADVANCED': return 'bg-purple-500 text-white';
      case 'COMPREHENSIVE': return 'bg-indigo-500 text-white';
      case 'ULTIMATE': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const stats = [
    { number: "8000+", label: "Siswa Berhasil", icon: <Users className="h-5 w-5" /> },
    { number: "98%", label: "Tingkat Kepuasan", icon: <Heart className="h-5 w-5" /> },
    { number: "4.9", label: "Rating Rata-rata", icon: <Star className="h-5 w-5" /> },
    { number: "15+", label: "Tahun Pengalaman", icon: <Award className="h-5 w-5" /> }
  ];

  const faqs = [
    {
      question: "Apakah ada garansi skor atau uang kembali?",
      answer: "tidak ada garansi"
    },
    {
      question: "Berapa lama waktu persiapan yang direkomendasikan?",
      answer: "Waktu persiapan bervariasi tergantung level awal Anda. Untuk pemula, kami merekomendasikan 2-3 bulan persiapan intensif. Untuk yang sudah memiliki dasar, 4-6 minggu sudah cukup."
    },
    {
      question: "Bagaimana sistem pembelajaran online bekerja?",
      answer: "Platform pembelajaran online kami menggunakan AI-integrated system yang menyesuaikan dengan kemampuan Anda. Tersedia video HD, practice tests unlimited, progress tracking real-time, dan akses 24/7."
    },
    {
      question: "Apakah sertifikat TOEFL dari Express English Hub diakui?",
      answer: "Ya, semua tes TOEFL yang kami selenggarakan adalah resmi dari ETS (Educational Testing Service) Amerika Serikat, sehingga sertifikatnya diakui secara resmi oleh institusi pendidikan dan pemerintah."
    },
    {
      question: "Bisakah mengikuti kelas secara fleksibel?",
      answer: "Tentu! Kami menyediakan berbagai pilihan jadwal fleksibel, termasuk self-paced learning, live interactive sessions, dan recorded materials yang bisa diakses kapan saja."
    }
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#e87211]/10 via-white to-[#e87211]/20 pt-20 sm:pt-24 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={isVisible ? animations.fadeInUp : {}}>
                Program Persiapan Tes <span className="text-[#e87211]">TOEFL ITP®</span>
              </h1>
              <p className={`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                 style={isVisible ? {...animations.fadeInUp, animationDelay: '0.2s'} : {}}>
                Pilih program yang sesuai dengan kebutuhan dan target skor Anda. Dari preparation test hingga intensive course dengan TOEFL Master.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 float-animation"
                     style={{ animationDelay: `${index * 0.5}s` }}>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="bg-[#e87211]/10 p-2 sm:p-3 rounded-full">
                      {React.cloneElement(stat.icon, { className: "text-[#e87211] h-4 w-4 sm:h-5 sm:w-5" })}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#e87211] mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <span className="text-gray-700 font-medium self-center text-center sm:text-left mb-2 sm:mb-0">Filter Kategori:</span>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                      selectedCategory === category.id
                        ? 'bg-[#e87211] text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">{category.label} ({category.count})</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]} ({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Unique Carousel Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Program Persiapan Tes TOEFL ITP®
              </h2>
              <p className="text-xl text-gray-600">
                Pilih program yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative"
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}>
              
              {/* Carousel Controls */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className="flex items-center space-x-2 bg-[#e87211] text-white px-4 py-2 rounded-lg hover:bg-[#d4640e] transition-colors"
                  >
                    {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isAutoPlay ? 'Pause' : 'Play'}</span>
                  </button>
                  <span className="text-gray-600">
                    {currentSlide + 1} / {products.length}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Carousel Content */}
              <div className="relative overflow-hidden rounded-2xl">
                <div 
                  ref={carouselRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {products.map((product, index) => (
                    <div key={product.id} className="w-full flex-shrink-0">
                      <div className="bg-gradient-to-br from-[#e87211] to-[#d4640e] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                          {/* Left Side - Content */}
                          <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
                            {/* Badge */}
                            {product.badge && (
                              <div className="mb-4">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getBadgeColor(product.badge)}`}>
                                  {product.badge}
                                </span>
                              </div>
                            )}

                            {/* Title */}
                            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                              {product.title}
                            </h3>

                            {/* Highlight */}
                            <p className="text-[#f09a53] text-lg mb-6 italic">
                              {product.highlight}
                            </p>


                            {/* Duration & Rating */}
                            <div className="flex items-center space-x-6 mb-6">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5" />
                                <span>{product.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span>{product.rating}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>{product.students}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-[#f09a53] mb-6 leading-relaxed">
                              {product.description}
                            </p>

                            {/* CTA Button */}
                            <button
                              onClick={handleOnlineRegistration}
                              className="bg-white text-[#e87211] px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
                            >
                              Daftar Program
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                          </div>

                          {/* Right Side - Image & Features */}
                          <div className="relative">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-full h-full object-cover opacity-20"
                              />
                              <div className="absolute inset-0 bg-gradient-to-l from-[#e87211]/50 to-transparent"></div>
                            </div>

                            {/* Features Overlay */}
                            <div className="relative p-8 lg:p-12 h-full flex flex-col justify-center">
                              <h4 className="text-white text-xl font-bold mb-6">Fitur Program:</h4>
                              <ul className="space-y-3">
                                {product.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-start text-white">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm lg:text-base">{feature}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-6">
                                {product.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-[#e87211] w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Grid View for Filtered Products */}
            {selectedCategory !== 'all' && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Program {categories.find(c => c.id === selectedCategory)?.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <div key={product.id} 
                         className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                         style={{
                           animationDelay: `${index * 0.1}s`,
                           ...animations.scaleIn
                         }}>
                      
                      {/* Image Section with Orange Overlay */}
                      <div className="relative h-48 bg-gradient-to-br from-[#e87211] to-[#d4640e] overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover opacity-20"
                        />
                        
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.badge)}`}>
                              {product.badge}
                            </span>
                          </div>
                        )}

                        {/* Duration Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {product.duration}
                          </div>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {product.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {product.description}
                        </p>

                        {/* Rating & Students */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{product.students} siswa</span>
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-6">
                          {product.features.slice(0, 3).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                          onClick={handleOnlineRegistration}
                          className="w-full bg-[#e87211] text-white py-4 rounded-lg hover:bg-[#d4640e] transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg group-hover:shadow-xl"
                        >
                          Daftar Program
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih Express English Hub?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Kami adalah The Authorized TOEFL Test Center ETS yang telah berpengalaman sejak 2014
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-[#e87211]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 hover:bg-[#e87211]/20 transition-colors">
                  <Shield className="h-8 w-8 text-[#e87211] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Resmi ETS</h3>
                <p className="text-gray-600">The Authorized TOEFL Test Center dengan sertifikat resmi</p>
              </div>

              <div className="text-center group">
                <div className="bg-[#e87211]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 hover:bg-[#e87211]/20 transition-colors">
                  <Trophy className="h-8 w-8 text-[#e87211] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">TOEFL Master</h3>
                <p className="text-gray-600">Instruktur berpengalaman dan tersertifikasi</p>
              </div>

              <div className="text-center group">
                <div className="bg-[#e87211]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 hover:bg-[#e87211]/20 transition-colors">
                  <Globe className="h-8 w-8 text-[#e87211] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">28+ Cabang</h3>
                <p className="text-gray-600">Jaringan luas di seluruh Indonesia</p>
              </div>

              <div className="text-center group">
                <div className="bg-[#e87211]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 hover:bg-[#e87211]/20 transition-colors">
                  <Zap className="h-8 w-8 text-[#e87211] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hasil Cepat</h3>
                <p className="text-gray-600">Unofficial Score Report langsung tersedia</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-xl text-gray-600">
                Temukan jawaban untuk pertanyaan umum tentang paket layanan kami
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Masih ada pertanyaan lain?</p>
              <button
                onClick={handleOnlineRegistration}
                className="bg-[#e87211] text-white px-8 py-3 rounded-lg hover:bg-[#d4640e] transition-colors font-semibold inline-flex items-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Hubungi Kami
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Products;
