import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Target,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Clock,
  ChevronDown,
  Globe,
  Shield,
  Zap,
  Brain,
  Video,
  Trophy,
  MessageCircle,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Send,
  Edit3
} from 'lucide-react';

// Inline CSS animations as style objects
const animations = {
  fadeInUp: {
    animation: 'fadeInUp 0.6s ease-out forwards',
  },
  fadeInLeft: {
    animation: 'fadeInLeft 0.6s ease-out forwards',
  },
  fadeInRight: {
    animation: 'fadeInRight 0.6s ease-out forwards',
  },
  scaleIn: {
    animation: 'scaleIn 0.5s ease-out forwards',
  },
  popIn: {
    animation: 'popIn 0.6s ease-out forwards',
  },
  countUp: {
    animation: 'countUp 0.8s ease-out forwards',
  },
  subtleBounce: {
    animation: 'subtleBounce 0.6s ease-in-out',
  },
  gentlePulse: {
    animation: 'gentlePulse 2s ease-in-out infinite',
  },
  backgroundFlow: {
    backgroundSize: '200% 200%',
    animation: 'backgroundFlow 8s ease-in-out infinite',
  },
  floatParallax: {
    animation: 'floatParallax 6s ease-in-out infinite',
  },
  neonGlow: {
    animation: 'neonGlow 2s ease-in-out infinite alternate',
  }
};

// CSS keyframes as a style tag - Updated with new color scheme
const keyframes = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
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
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes subtleBounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}
@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
@keyframes backgroundFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes floatParallax {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-10px) translateX(5px); }
  50% { transform: translateY(-5px) translateX(-5px); }
  75% { transform: translateY(-15px) translateX(3px); }
}
@keyframes neonGlow {
  from { 
    box-shadow: 0 0 5px #e87211, 0 0 10px #e87211, 0 0 15px #e87211;
  }
  to { 
    box-shadow: 0 0 10px #e87211, 0 0 20px #e87211, 0 0 30px #e87211;
  }
}
`;

const features = [
  {
    icon: <Brain className="h-8 w-8 text-[#e87211]" />,
    title: "AI-Integrated Learning",
    description: "Sistem pembelajaran terintegrasi AI yang menyesuaikan dengan kemampuan dan kebutuhan belajar Anda",
    benefits: ["Personalized learning path", "Real-time progress tracking", "Adaptive difficulty"]
  },
  {
    icon: <Trophy className="h-8 w-8 text-[#e87211]" />,
    title: "Top 10 TOEFL Trainers",
    description: "Belajar langsung dari 10 trainer TOEFL terbaik di Indonesia dengan pengalaman internasional",
    benefits: ["Expert guidance", "Proven track record", "International experience"]
  },
  {
    icon: <Video className="h-8 w-8 text-[#e87211]" />,
    title: "Flexible Learning Options",
    description: "Pilihan belajar fleksibel: self-paced online atau instructor-led dengan sesi Zoom interaktif",
    benefits: ["Self-paced learning", "Live interactive sessions", "Recorded materials"]
  },
  {
    icon: <Target className="h-8 w-8 text-[#e87211]" />,
    title: "Comprehensive Test Packages",
    description: "Paket lengkap persiapan + tes TOEFL ITP/iBT dengan pendampingan menyeluruh",
    benefits: ["Complete preparation", "Official testing", "Full support"]
  }
];

const famousQuotes = [
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "The only thing that interferes with my learning is my education.",
    author: "Albert Einstein"
  },
  {
    quote: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo"
  }
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [animatedStats, setAnimatedStats] = useState(false);
  
  const statsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const quotesRef = useRef<HTMLElement>(null);

  // Intersection Observer Hook
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

  // Stats animation callback
  const handleStatsIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animatedStats) {
        setAnimatedStats(true);
        // Trigger number counter animation
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('animate-count-up');
          }, index * 100);
        });
      }
    });
  }, [animatedStats]);

  // General section visibility callback
  const handleSectionIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('data-section');
        if (sectionId) {
          setVisibleSections(prev => new Set([...prev, sectionId]));
        }
      }
    });
  }, []);

  // Setup intersection observers
  useIntersectionObserver(statsRef, handleStatsIntersection);
  useIntersectionObserver(featuresRef, handleSectionIntersection);
  useIntersectionObserver(productsRef, handleSectionIntersection);
  useIntersectionObserver(quotesRef, handleSectionIntersection);

  useEffect(() => {
    setIsVisible(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % famousQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "700+", label: "Siswa Berhasil", icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { number: "97%", label: "Tingkat Kepuasan", icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { number: "4.6", label: "Rating Kepuasan", icon: <Star className="h-5 w-5 sm:h-6 sm:w-6" /> }
  ];

  const products = [
    {
      id: 1,
      title: "TOEFL ITP® Test Level 1",
      price: "Mulai dari Rp 650.000",
      originalPrice: null,
      description: "Tes TOEFL ITP® resmi dari ETS Amerika Serikat dengan sertifikat yang diakui institusi pendidikan",
      features: [
        "Provider: ETS Amerika Serikat",
        "Remote Proctoring System",
        "Unofficial Score Report (PDF) - langsung download",
        "Berkas fisik dikirim 14-20 hari kerja",
        "Masa berlaku 2 tahun",
        "Untuk LPDP, BUMN, CPNS, Beasiswa"
      ],
      badge: "RESMI ETS",
      category: "test-only"
    }
  ];

  const handleOnlineRegistration = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfIjU2ZlkbdiH1mcfN2U6khlsRg-k3x-KrEkkPDGS_J2rZRsA/formResponse', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section - Enhanced with Emotional Wording and Elegant Design */}
        <section className="relative bg-gradient-to-br from-white via-orange-50 to-white pt-20 pb-32 min-h-screen flex items-center overflow-hidden">
          {/* Elegant Background Elements */}
          <div className="absolute inset-0">
            {/* Subtle geometric patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-20 left-10 w-32 h-32 border border-[#e87211] rounded-full"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-[#e87211] rounded-full opacity-20"></div>
              <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-[#e87211] rotate-45"></div>
              <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-[#e87211] to-orange-300 rounded-full opacity-30"></div>
            </div>
            
            {/* Flowing lines */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
                <path d="M0,400 Q300,200 600,400 T1200,400" stroke="#e87211" strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M0,500 Q400,300 800,500 T1200,500" stroke="#e87211" strokeWidth="1" fill="none" opacity="0.2"/>
              </svg>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="text-center">
              {/* Brand with elegant styling */}
              <div className="mb-12">
                <div className="inline-block">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#e87211] tracking-[0.2em] mb-2 relative">
                    EXPRESS ENGLISH HUB
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#e87211] to-transparent"></div>
                  </h1>
                  <p className="text-sm text-gray-500 tracking-widest uppercase mt-4">Your Gateway to Global Opportunities</p>
                </div>
              </div>
              
              {/* Emotional Main Heading */}
              <div className="mb-12">
                <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
                    style={isVisible ? animations.fadeInUp : {}}>
                  <span className="block mb-4">Saatnya Mewujudkan</span>
                  <span className="block text-[#e87211] bg-gradient-to-r from-[#e87211] to-orange-400 bg-clip-text text-transparent">
                    Mimpi Terbesar Anda
                  </span>
                </h1>
                
                {/* Emotional Subtitle */}
                <div className={`max-w-4xl mx-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                     style={isVisible ? {...animations.fadeInUp, animationDelay: '0.3s'} : {}}>
                  <p className="text-xl sm:text-2xl text-gray-700 mb-6 leading-relaxed font-light">
                    Setiap langkah menuju <span className="text-[#e87211] font-semibold">studi luar negeri</span> dimulai dari sini.
                  </p>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                    Bergabunglah dengan ratusan siswa yang telah merasakan transformasi hidup melalui 
                    <span className="text-[#e87211] font-semibold"> persiapan TOEFL terbaik</span> bersama kami.
                  </p>
                </div>
              </div>

              {/* Emotional Value Proposition */}
              <div className={`mb-12 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                   style={isVisible ? {...animations.fadeInUp, animationDelay: '0.5s'} : {}}>
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#e87211] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Dipercaya ratusan siswa</h3>
                      <p className="text-gray-600 text-sm">Lebih dari 700+ siswa telah meraih impian mereka</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#e87211] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Metode Terbukti</h3>
                      <p className="text-gray-600 text-sm">Strategi pembelajaran yang telah teruji efektif</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#e87211] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Peluang Global</h3>
                      <p className="text-gray-600 text-sm">Buka pintu kesempatan di universitas dunia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant CTA Section */}
              <div className={`${isVisible ? 'opacity-100' : 'opacity-0'}`}
                   style={isVisible ? {...animations.fadeInUp, animationDelay: '0.7s'} : {}}>
                <div className="mb-8">
                  <p className="text-lg text-gray-600 mb-6 font-light">
                    Jangan biarkan impian Anda hanya menjadi angan-angan
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                      onClick={handleOnlineRegistration}
                      className="group relative bg-gradient-to-r from-[#e87211] to-orange-400 text-white px-10 py-5 rounded-2xl hover:from-[#d4640e] hover:to-orange-500 transition-all duration-500 font-bold text-lg shadow-2xl hover:shadow-orange-200 transform hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center">
                        Mulai Perjalanan Anda
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-[#e87211] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                    
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-500 mb-1">Konsultasi gratis tersedia</p>
                      <p className="text-xs text-gray-400">Tanpa komitmen</p>
                    </div>
                  </div>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-[#e87211]" />
                    <span>Sertifikat Resmi ETS</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-[#e87211]" />
                    <span>Rating 4.9/5</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#e87211]" />
                    <span>700+ Alumni Sukses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements for elegance */}
          <div className="absolute top-1/4 left-8 w-2 h-2 bg-[#e87211] rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-12 w-3 h-3 bg-orange-300 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-[#e87211] rounded-full opacity-80 animate-pulse" style={{animationDelay: '2s'}}></div>
        </section>

        {/* What You Get Section - Updated Content */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Apa yang kalian dapatkan
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold">
                di <span className="bg-[#e87211] text-white px-4 py-2 rounded">Express English Hub</span>
              </h3>
            </div>
            
            <div className="space-y-16">
              {/* Feature 1: Kurikulum TOEFL terlengkap */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="flex items-start mb-6">
                    <div className="bg-[#e87211] text-white rounded-lg px-4 py-2 font-bold text-xl mr-4">
                      #01
                    </div>
                    <CheckCircle className="h-6 w-6 text-[#e87211] mt-1" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#e87211] mb-4">
                    Kurikulum TOEFL terlengkap,
                  </h3>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    dari dasar, strategi, hingga praktik.
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Materi komprehensif untuk Reading, Listening, Speaking, Writing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Strategi jitu untuk setiap bagian tes TOEFL</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Latihan soal dan simulasi tes yang realistis</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-[#e87211] p-4 text-center">
                      <h5 className="font-bold text-[#e87211] mb-2">Reading Mastery</h5>
                      <p className="text-sm text-gray-700">Advanced comprehension techniques</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e87211] p-4 text-center">
                      <h5 className="font-bold text-[#e87211] mb-2">Listening Skills</h5>
                      <p className="text-sm text-gray-700">Strategic note-taking methods</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e87211] p-4 text-center">
                      <h5 className="font-bold text-[#e87211] mb-2">Speaking Confidence</h5>
                      <p className="text-sm text-gray-700">Structured response framework</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e87211] p-4 text-center">
                      <h5 className="font-bold text-[#e87211] mb-2">Writing Excellence</h5>
                      <p className="text-sm text-gray-700">Academic writing mastery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Strategi skor tinggi TOEFL pribadi */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="flex items-start mb-6">
                    <div className="bg-[#e87211] text-white rounded-lg px-4 py-2 font-bold text-xl mr-4">
                      #02
                    </div>
                    <CheckCircle className="h-6 w-6 text-[#e87211] mt-1" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#e87211] mb-4">
                    Strategi skor tinggi
                  </h3>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    TOEFL pribadi
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Dapatkan contoh strategi TOEFL berdasarkan profil kemampuan</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Template persiapan jangka panjang ala expert</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Cocok bagi pemula yang ingin upgrade skornya</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-white rounded-xl border-2 border-[#e87211] p-6">
                    <div className="text-center mb-4">
                      <h5 className="font-bold text-[#e87211] text-lg">Personal Score Strategy</h5>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-gray-200 rounded p-3">
                        <span className="text-gray-900">Reading</span>
                        <span className="text-[#e87211] font-bold">25-30</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-200 rounded p-3">
                        <span className="text-gray-900">Listening</span>
                        <span className="text-[#e87211] font-bold">25-30</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-200 rounded p-3">
                        <span className="text-gray-900">Speaking</span>
                        <span className="text-[#e87211] font-bold">22-26</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-200 rounded p-3">
                        <span className="text-gray-900">Writing</span>
                        <span className="text-[#e87211] font-bold">24-28</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Practice tests & feedback eksklusif */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="flex items-start mb-6">
                    <div className="bg-[#e87211] text-white rounded-lg px-4 py-2 font-bold text-xl mr-4">
                      #03
                    </div>
                    <CheckCircle className="h-6 w-6 text-[#e87211] mt-1" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#e87211] mb-4">
                    Practice tests & feedback eksklusif
                  </h3>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    real time
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Insight langsung dari para expert</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Update mingguan tentang progress dan improvement</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#e87211] mr-3" />
                      <span className="text-gray-700">Bukan cuma teori, kamu dapat feedback langsung</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-white rounded-xl border-2 border-[#e87211] p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#e87211] mb-2">15+</div>
                        <div className="text-sm text-gray-700">Practice Tests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#e87211] mb-2">24/7</div>
                        <div className="text-sm text-gray-700">Expert Support</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#e87211] mb-2">100%</div>
                        <div className="text-sm text-gray-700">Personalized</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#e87211] mb-2">∞</div>
                        <div className="text-sm text-gray-700">Retakes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section - Updated Style */}
        <section ref={statsRef} className="py-16 bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300 bg-white rounded-xl border border-[#e87211] p-6" 
                     style={animations.neonGlow}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#e87211] bg-opacity-20 p-3 rounded-full group-hover:bg-opacity-30 transition-colors">
                      {React.cloneElement(stat.icon, { className: "h-6 w-6 text-[#e87211]" })}
                    </div>
                  </div>
                  <div className={`text-4xl font-bold text-[#e87211] mb-2 stat-number ${animatedStats ? 'animate-count-up' : ''}`} 
                       style={{animationDelay: `${index * 0.1}s`, ...animations.countUp}}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section - Updated Content and Style */}
        <section ref={quotesRef} data-section="quotes" id="what-they-say" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Quote Content */}
                <div className="lg:w-2/3">
                  <div className="relative">
                    {famousQuotes.map((quote, index) => (
                      <div 
                        key={index}
                        className={`${index === currentQuote ? 'active' : ''}`}
                        style={{
                          position: index === currentQuote ? 'relative' : 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          opacity: index === currentQuote ? 1 : 0,
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                      >
                        <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-relaxed">
                          "{quote.quote}"
                        </blockquote>
                        <div className="text-gray-600 text-lg">
                          - {quote.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                

              </div>
            </div>
          </div>
        </section>

        {/* Products Section - Updated Style and Content */}
        <section ref={productsRef} data-section="products" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Paket Test TOEFL ITP
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tes TOEFL ITP resmi dengan sertifikat yang diakui institusi pendidikan
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border-2 border-[#e87211] p-8 relative transform hover:-translate-y-2 transition-all duration-300"
                       style={animations.neonGlow}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e87211] text-white px-4 py-1 rounded-full text-sm font-bold">
                        PAKET UTAMA
                      </span>
                    </div>
                    
                    {product.badge && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6 mt-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                      <div className="text-4xl font-bold text-[#e87211] mb-4">{product.price}</div>
                      <p className="text-gray-600">{product.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-[#e87211] mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleOnlineRegistration}
                      className="w-full bg-[#e87211] text-white py-4 rounded-lg hover:bg-[#d4640e] transition-all duration-300 font-bold text-lg transform hover:scale-105"
                      style={animations.neonGlow}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="bg-gray-200 border border-[#e87211] text-[#e87211] px-8 py-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg inline-flex items-center group"
              >
                Lihat Paket Lainnya
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Registration Process Section - Updated Style */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Cara Mudah Mendaftar
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Daftar secara online melalui formulir digital kami dan mulai perjalanan menuju impian Anda
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-100 border-2 border-[#e87211] rounded-2xl p-8 mb-12" style={animations.neonGlow}>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-[#e87211] mb-4">Online Registration</h3>
                    <p className="text-lg mb-6 text-gray-700">
                      Daftar secara online melalui formulir digital kami. Proses cepat, mudah, dan akan segera ditindaklanjuti oleh tim kami dalam 24 jam.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center bg-gray-200 border border-[#e87211] rounded-lg p-3">
                        <div className="bg-[#e87211] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
                        <span>Isi formulir online</span>
                      </div>
                      <div className="flex items-center bg-gray-200 border border-[#e87211] rounded-lg p-3">
                        <div className="bg-[#e87211] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
                        <span>Tim kami akan menghubungi Anda</span>
                      </div>
                      <div className="flex items-center bg-gray-200 border border-[#e87211] rounded-lg p-3">
                        <div className="bg-[#e87211] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
                        <span>Mulai persiapan TOEFL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 text-center">
                    <button
                      onClick={handleOnlineRegistration}
                      className="bg-[#e87211] text-white px-8 py-4 rounded-lg hover:bg-[#d4640e] transition-all duration-300 font-bold text-lg transform hover:scale-105 inline-flex items-center"
                      style={animations.neonGlow}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Daftar Online Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Updated Style */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Temukan jawaban untuk pertanyaan umum tentang program kami
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white border border-[#e87211] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Berapa lama waktu persiapan yang dibutuhkan?
                </h3>
                <p className="text-gray-700">
                  Waktu persiapan bervariasi tergantung level awal Anda. Rata-rata siswa membutuhkan 2-3 bulan untuk persiapan intensif.
                </p>
              </div>

              <div className="bg-white border border-[#e87211] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Apakah ada garansi skor TOEFL?
                </h3>
                <p className="text-gray-700">
                Kami tidak memberikan garansi skor atau pengembalian uang. Hasil tes bergantung pada kemampuan individu dan usaha selama persiapan.
                </p>
              </div>

              <div className="bg-white border border-[#e87211] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Bagaimana sistem pembelajaran online?
                </h3>
                <p className="text-gray-700">
                  Pembelajaran online menggunakan platform interaktif dengan video HD, materi digital, dan sesi live dengan trainer berpengalaman.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

