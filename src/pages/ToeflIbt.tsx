import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { seoConfig } from '../utils/seoConfig';
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
  Headphones,
  Edit3,
  Mic
} from 'lucide-react';

// Inline animations
const animations = {
  fadeInUp: {
    animation: 'fadeInUp 0.6s ease-out forwards',
  },
  scaleIn: {
    animation: 'scaleIn 0.5s ease-out forwards',
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
`;

const ToeflIbt = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleOnlineRegistration = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfIjU2ZlkbdiH1mcfN2U6khlsRg-k3x-KrEkkPDGS_J2rZRsA/formResponse', '_blank');
  };

  const stats = [
    { number: "11,500+", label: "Universitas Menerima", icon: <Globe className="h-5 w-5" /> },
    { number: "160+", label: "Negara", icon: <MapPin className="h-5 w-5" /> },
    { number: "4-8", label: "Hari Hasil", icon: <Clock className="h-5 w-5" /> },
    { number: "2", label: "Tahun Berlaku", icon: <Calendar className="h-5 w-5" /> }
  ];

  const testStructure = [
    {
      section: "Reading",
      duration: "54-72 menit",
      scoreRange: "0-30",
      icon: <BookOpen className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Baca artikel akademik harian dari berbagai disiplin ilmu",
        "Pelajari strategi skimming dan scanning yang efektif",
        "Latihan soal inference dan vocabulary in context"
      ]
    },
    {
      section: "Listening",
      duration: "41-57 menit",
      scoreRange: "0-30",
      icon: <Headphones className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Dengarkan kuliah TED Talks dan academic podcasts",
        "Latihan note-taking dengan struktur yang jelas",
        "Fokus pada main ideas dan supporting details"
      ]
    },
    {
      section: "Speaking",
      duration: "17 menit",
      scoreRange: "0-30",
      icon: <Mic className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Latihan daily conversation dengan native speakers",
        "Record dan evaluate speaking performance sendiri",
        "Gunakan template untuk setiap jenis task"
      ]
    },
    {
      section: "Writing",
      duration: "50 menit",
      scoreRange: "0-30",
      icon: <Edit3 className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Pelajari struktur essay yang efektif",
        "Latihan integrated writing dengan listening + reading",
        "Develop strong thesis statement dan arguments"
      ]
    }
  ];

  const advantages = [
    {
      title: "Penerimaan Global",
      description: "Diterima oleh 11,500+ universitas di 160+ negara",
      icon: <Globe className="h-8 w-8 text-[#e97311]" />,
      features: ["Universitas top dunia", "Visa applications", "Immigration purposes"]
    },
    {
      title: "4 Skills Assessment",
      description: "Mengukur kemampuan Reading, Listening, Speaking, dan Writing",
      icon: <Target className="h-8 w-8 text-[#e97311]" />,
      features: ["Comprehensive evaluation", "Real academic scenarios", "Integrated tasks"]
    },
    {
      title: "Internet-Based",
      description: "Format modern dengan teknologi terdepan",
      icon: <Zap className="h-8 w-8 text-[#e97311]" />,
      features: ["User-friendly interface", "Immediate feedback", "Digital convenience"]
    },
    {
      title: "MyBest Scores",
      description: "Kombinasi skor terbaik dari 2 tahun terakhir",
      icon: <Trophy className="h-8 w-8 text-[#e97311]" />,
      features: ["Best performance", "Multiple attempts", "Enhanced opportunities"]
    }
  ];

  const globalAcceptance = [
    {
      region: "Amerika Utara",
      countries: ["Amerika Serikat", "Kanada"],
      usage: "100% universitas top 100, visa F-1/J-1/M-1, Green Card applications"
    },
    {
      region: "Eropa",
      countries: ["Inggris", "Jerman", "Prancis", "Belanda", "Swedia"],
      usage: "Russell Group universities, EU student visas, research programs"
    },
    {
      region: "Asia Pasifik",
      countries: ["Australia", "Singapura", "Jepang", "Korea Selatan", "Hong Kong"],
      usage: "Group of Eight universities, skilled migration, professional licensing"
    },
    {
      region: "Lainnya",
      countries: ["160+ negara di seluruh dunia"],
      usage: "International programs, exchange students, global opportunities"
    }
  ];

  const preparationTips = [
    {
      section: "Reading",
      duration: "54-72 menit",
      score: "0-30",
      icon: <BookOpen className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Baca artikel akademik harian dari berbagai disiplin ilmu",
        "Pelajari strategi skimming dan scanning yang efektif",
        "Latihan soal inference dan vocabulary in context",
        "Perbanyak academic vocabulary dengan flashcards",
        "Time management: 18 menit per teks bacaan"
      ]
    },
    {
      section: "Listening",
      duration: "41-57 menit",
      score: "0-30",
      icon: <Headphones className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Dengarkan kuliah TED Talks dan academic podcasts",
        "Latihan note-taking dengan struktur yang jelas",
        "Fokus pada main ideas dan supporting details",
        "Pahami academic discourse markers",
        "Latihan dengan accent Amerika Utara"
      ]
    },
    {
      section: "Speaking",
      duration: "17 menit",
      score: "0-30",
      icon: <Mic className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Latihan daily conversation dengan native speakers",
        "Record dan evaluate speaking performance sendiri",
        "Gunakan template untuk setiap jenis task",
        "Fokus pada pronunciation dan intonation",
        "Time management yang sangat ketat (15-30 detik prep)"
      ]
    },
    {
      section: "Writing",
      duration: "50 menit",
      score: "0-30",
      icon: <Edit3 className="h-6 w-6 text-[#e97311]" />,
      tips: [
        "Pelajari struktur essay yang efektif",
        "Latihan integrated writing dengan listening + reading",
        "Develop strong thesis statement dan arguments",
        "Gunakan transition words dan cohesive devices",
        "Grammar accuracy dan sentence variety"
      ]
    }
  ];

  const studyResources = [
    {
      category: "Buku Resmi ETS",
      items: [
        "• Official Guide to TOEFL iBT",
        "• Official TOEFL iBT Tests Volume 1 & 2",
        "• ETS Vocabulary Builder",
        "• Speaking and Writing Workout"
      ]
    },
    {
      category: "Platform Online",
      items: [
        "• Express English Hub (Platform ini)",
        "• TOEFL Practice Online (TPO)",
        "• Magoosh TOEFL Prep",
        "• Kaplan TOEFL Prep"
      ]
    },
    {
      category: "Apps & Tools",
      items: [
        "• TOEFL Go! Official App",
        "• Anki for vocabulary",
        "• Grammarly for writing",
        "• Voice recorder apps"
      ]
    }
  ];

  const faqs = [
    {
      question: "Apa perbedaan utama antara TOEFL iBT dan TOEFL ITP?",
      answer: "TOEFL iBT adalah tes berbasis internet yang diterima secara global untuk keperluan akademik dan visa internasional, mengukur 4 skills (Reading, Listening, Speaking, Writing). TOEFL ITP adalah tes berbasis kertas untuk keperluan institusi domestik, hanya mengukur 3 skills (tanpa Speaking)."
    },
    {
      question: "Berapa lama hasil TOEFL iBT berlaku?",
      answer: "Hasil TOEFL iBT berlaku selama 2 tahun dari tanggal tes. Skor dapat digunakan untuk aplikasi universitas, visa, dan keperluan profesional selama periode tersebut."
    },
    {
      question: "Apakah TOEFL iBT diterima untuk aplikasi visa?",
      answer: "Ya, TOEFL iBT diterima secara luas untuk aplikasi visa pelajar, visa kerja, dan keperluan imigrasi di berbagai negara termasuk Amerika Serikat, Kanada, Australia, dan negara-negara Eropa."
    },
    {
      question: "Bagaimana sistem penilaian TOEFL iBT?",
      answer: "TOEFL iBT menggunakan skala 0-120, dengan setiap bagian (Reading, Listening, Speaking, Writing) dinilai 0-30. Skor total adalah jumlah dari keempat bagian tersebut."
    },
    {
      question: "Apakah bisa mengulang tes TOEFL iBT?",
      answer: "Ya, Anda dapat mengulang tes TOEFL iBT kapan saja, namun harus menunggu minimal 3 hari setelah tes sebelumnya. Tidak ada batasan jumlah pengulangan dalam setahun."
    },
    {
      question: "Apa itu MyBest Scores di TOEFL iBT?",
      answer: "MyBest Scores adalah fitur yang menggabungkan skor terbaik dari setiap bagian tes dalam periode 2 tahun terakhir, memberikan representasi terbaik dari kemampuan bahasa Inggris Anda kepada institusi."
    }
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group"
                     style={{
                       transform: 'translateY(-8px)',
                       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                       transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                     }}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full group-hover:bg-opacity-20 transition-colors">
                      {React.cloneElement(stat.icon, { className: "text-blue-600" })}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About TOEFL iBT Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang TOEFL iBT</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Standar emas untuk mengukur kemampuan bahasa Inggris akademik di tingkat universitas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apa itu TOEFL iBT?</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    TOEFL iBT (Internet-Based Test) adalah tes kemampuan bahasa Inggris yang mengukur kemampuan Anda untuk menggunakan dan memahami bahasa Inggris dalam konteks akademik. Tes ini dirancang untuk mengevaluasi seberapa baik Anda dapat menggabungkan keterampilan mendengar, membaca, berbicara, dan menulis.
                  </p>
                  <p>
                    Sebagai tes yang paling diterima secara luas di dunia, TOEFL iBT digunakan oleh universitas, agen imigrasi, dan organisasi profesional untuk menilai kemampuan bahasa Inggris calon mahasiswa dan profesional internasional.
                  </p>
                  <p>
                    Tes ini menggunakan konten akademik autentik dari kuliah universitas, diskusi kelas, dan materi bacaan untuk memberikan penilaian yang akurat tentang kesiapan Anda untuk sukses di lingkungan berbahasa Inggris.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Keunggulan TOEFL iBT</h4>
                  <ul className="space-y-2">
                    {[
                      "Diterima oleh 11.500+ universitas di 160+ negara",
                      "Format internet-based yang modern dan user-friendly",
                      "Mengukur 4 keterampilan terintegrasi secara komprehensif",
                      "Hasil tersedia dalam 4-8 hari kerja",
                      "Penilaian objektif dengan technology AI terdepan",
                      "MyBest Scores untuk performa optimal"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl text-center group hover:bg-white hover:shadow-lg transition-all duration-300"
                       style={{
                         animationDelay: `${index * 0.1}s`,
                         ...animations.scaleIn
                       }}>
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {advantage.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{advantage.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{advantage.description}</p>
                    <ul className="space-y-1">
                      {advantage.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-xs text-gray-500">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Test Structure Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Struktur Tes TOEFL iBT</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empat bagian terintegrasi yang mengukur kemampuan bahasa Inggris akademik Anda secara komprehensif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {testStructure.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.fadeInUp
                     }}>
                  <div className="flex items-center mb-4">
                    {section.icon}
                    <h3 className="text-2xl font-bold text-gray-900 ml-3">{section.section}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Durasi</span>
                      <div className="font-semibold text-blue-600">{section.duration}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Skor</span>
                      <div className="font-semibold text-purple-600">{section.scoreRange}</div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Test Details Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detail Waktu Tes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bagian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Soal/Tugas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reading</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3-4 teks (36-56 soal)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">54-72 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">0-30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Listening</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3-4 kuliah, 2-3 percakapan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">41-57 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">0-30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Break</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Speaking</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4 tugas</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">0-30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Writing</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 tugas</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">0-30</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">3 jam</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">0-120</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Global Acceptance Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Penerimaan Global TOEFL iBT</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Diterima oleh institusi terkemuka di seluruh dunia untuk berbagai keperluan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {globalAcceptance.map((region, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.fadeInUp
                     }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{region.region}</h3>
                  <div className="space-y-2 mb-4">
                    {region.countries.map((country, countryIndex) => (
                      <div key={countryIndex} className="text-blue-600 font-medium">{country}</div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{region.usage}</p>
                </div>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Siap Meraih Impian Global Anda?</h3>
              <p className="text-lg mb-6 opacity-90">
                Bergabunglah dengan jutaan siswa di seluruh dunia yang telah mempercayai TOEFL iBT untuk membuka pintu kesempatan internasional.
              </p>
              <button
                onClick={handleOnlineRegistration}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center"
              >
                <Globe className="mr-2 h-5 w-5" />
                Mulai Persiapan Sekarang
              </button>
            </div>
          </div>
        </section>

        {/* Preparation Tips Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tips Persiapan Komprehensif</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strategi terbukti untuk mencapai skor target TOEFL iBT Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {preparationTips.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.scaleIn
                     }}>
                  <div className="flex items-center mb-4">
                    {section.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{section.section}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{section.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-purple-600 font-medium">{section.score}</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Study Resources */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sumber Belajar Terpercaya</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {studyResources.map((resource, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{resource.category}</h4>
                    <ul className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-xl text-gray-600">
                Jawaban untuk pertanyaan umum tentang TOEFL iBT
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
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
              <p className="text-gray-600 mb-4">Butuh informasi lebih lanjut?</p>
              <button
                onClick={handleOnlineRegistration}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Hubungi Tim Kami
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ToeflIbt;

