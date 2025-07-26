import React, { useState, useEffect } from 'react';
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
  ChevronUp
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
  }
};

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleWhatsAppContact = () => {
    window.open('https://api.whatsapp.com/send/?phone=6285225972995&text&type=phone_number&app_absent=0', '_blank');
  };

  const handleOnlineRegistration = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfIjU2ZlkbdiH1mcfN2U6khlsRg-k3x-KrEkkPDGS_J2rZRsA/formResponse', '_blank');
  };

  const contactMethods = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Whatsapp",
      description: "Hubungi kami langsung melalui WhatsApp untuk informasi lebih lanjut",
      contact: "",
      action: "Hubungi Kami",
      color: "bg-[#006400] hover:bg-[#004d00]",
      onClick: handleWhatsAppContact,
      features: ["Proses cepat", "Mudah", "Konsultasi gratis"]
    }
  ];

  const stats = [
    { number: "8500+", label: "Siswa Berhasil", icon: <Users className="h-5 w-5" /> },
    { number: "98%", label: "Tingkat Kepuasan", icon: <Heart className="h-5 w-5" /> },
    { number: "24", label: "Jam Respon", icon: <Clock className="h-5 w-5" /> },
    { number: "15+", label: "Tahun Pengalaman", icon: <Award className="h-5 w-5" /> }
  ];

  const services = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#e97311]" />,
      title: "TOEFL ITP & iBT Testing",
      description: "Tes resmi ETS dengan sertifikat yang diakui",
      features: ["Tes resmi ETS", "Sertifikat terakreditasi", "Hasil cepat"]
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-600" />,
      title: "AI-Integrated Learning",
      description: "Sistem pembelajaran adaptif dengan teknologi AI",
      features: ["Personalized learning", "Real-time tracking", "Adaptive difficulty"]
    },
    {
      icon: <Video className="h-6 w-6 text-green-600" />,
      title: "Live Online Classes",
      description: "Sesi interaktif dengan trainer berpengalaman",
      features: ["Live interaction", "Expert trainers", "Flexible schedule"]
    },
    {
      icon: <Target className="h-6 w-6 text-purple-600" />,
      title: "Score Guarantee",
      description: "Garansi pencapaian target skor atau sesi tambahan",
      features: ["Target guarantee", "Extra sessions", "Full support"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Putri",
      university: "University of Melbourne",
      score: "TOEFL 110",
      text: "Tim Express English Hub sangat responsif serta mendukung. Proses pendaftaran mudah dan hasilnya memuaskan!",
      image: "👩‍🎓"
    },
    {
      name: "Ahmad Rizki",
      university: "MIT",
      score: "TOEFL 115",
      text: "Pelayanan yang istimewa dari awal konsultasi hingga setelah tes. Sangat direkomendasikan!",
      image: "👨‍🎓"
    },
    {
      name: "Dina Maharani",
      university: "Stanford University",
      score: "TOEFL 108",
      text: "Sistem dukungan yang luar biasa. Tim selalu siap membantu.",
      image: "👩‍💼"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Konsultasi Gratis",
      description: "Isi formulir online dan dapatkan konsultasi gratis untuk menentukan program yang tepat",
      icon: <MessageCircle className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Assessment & Planning",
      description: "Tim kami akan memproses layanan anda",
      icon: <Target className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Mulai Program",
      description: "Akses materi pembelajaran, ikuti kelas, dan mulai persiapan intensif",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Tes & Sertifikat",
      description: "Ikuti tes resmi dan dapatkan sertifikat yang diakui secara global",
      icon: <Award className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main>
        {/* Hero Section - Aligned with Home.tsx */}
        <header className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16 sm:py-24">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-[#e97311] bg-opacity-10 rounded-full" style={animations.floatParallax}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 bg-opacity-10 rounded-full" style={{...animations.floatParallax, animationDelay: '-2s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className={`text-left transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Hubungi Kami
                <span className="block text-[#e97311] text-2xl md:text-3xl mt-4">
                  Wujudkan Impian TOEFL Anda
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
                Tim expert kami siap membantu Anda meraih skor TOEFL impian dengan pendampingan penuh.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="bg-[#e97311] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-[#d4640e] transition-all duration-300 font-semibold text-lg inline-flex items-center justify-center group shadow-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Hubungi via WhatsApp
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-3">
                    <div className="bg-[#006400]/10 p-3 rounded-full group-hover:bg-[#006400]/20 transition-colors">
                      {React.cloneElement(stat.icon, { className: "h-5 w-5 text-[#006400]" })}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#e97311] mb-1">
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

        {/* Contact Methods */}
        <section id="contact-info" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cara Menghubungi Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hubungi kami melalui WhatsApp untuk informasi lebih lanjut tentang layanan TOEFL kami
              </p>
            </div>

            <div className="flex justify-center mb-16">
              <div className="max-w-lg w-full">
                {contactMethods.map((method, index) => (
                  <div key={index} className="bg-white border-2 border-[#006400] rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
                    <div className="bg-[#006400]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#006400]/20 transition-colors">
                      <div className="text-[#006400]">
                        {method.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    {method.contact && <p className="font-medium text-gray-900 mb-6">{method.contact}</p>}
                    
                    {/* Features */}
                    <div className="mb-6">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={method.onClick}
                      className={`w-full text-white py-4 rounded-lg transition-all duration-300 font-semibold text-lg bg-[#006400] hover:bg-[#004d00] shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    >
                      {method.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Proses Mudah dalam 4 Langkah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative mb-4">
                      <div className="bg-[#006400] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">{step.step}</span>
                      </div>
                      <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#006400] group-hover:text-white transition-colors duration-300">
                        {step.icon}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Overview */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Layanan Kami</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 group">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Apa Kata Mereka Tentang Layanan Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pengalaman nyata dari siswa yang telah merasakan pelayanan terbaik kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{testimonial.image}</div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.university}</p>
                    <p className="text-sm font-medium text-[#e97311]">{testimonial.score}</p>
                  </div>
                  <blockquote className="text-gray-700 text-sm italic text-center">
                    "{testimonial.text}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#e97311] to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan TOEFL Anda?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ratusan siswa yang telah mempercayai Express English Hub 
              untuk meraih impian studi dan karir global mereka.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOnlineRegistration}
                className="bg-white text-[#e97311] px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg inline-flex items-center justify-center group shadow-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6 text-orange-200 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Konsultasi Gratis</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Respon 24 Jam</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Garansi Kepuasan</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
