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
  Edit3
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

const ToeflItp = () => {
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
    { number: "115", label: "Menit Durasi", icon: <Clock className="h-5 w-5" /> },
    { number: "310-677", label: "Rentang Skor", icon: <Target className="h-5 w-5" /> },
    { number: "14-21", label: "Hari Hasil", icon: <Calendar className="h-5 w-5" /> },
    { number: "2", label: "Tahun Berlaku", icon: <Award className="h-5 w-5" /> }
  ];

  const testStructure = [
    {
      section: "Listening Comprehension",
      questions: "50 soal",
      duration: "35 menit",
      scoreRange: "31-68",
      icon: <Headphones className="h-6 w-6 text-[#e97311]" />,
      description: "Percakapan pendek, percakapan panjang, dan ceramah akademik",
      tips: [
        "Mendengarkan podcast bahasa Inggris setiap hari",
        "Fokus pada gagasan utama dan detail pendukung", 
        "Berlatih pencatatan yang efektif"
      ]
    },
    {
      section: "Structure & Written Expression",
      questions: "40 soal",
      duration: "25 menit", 
      scoreRange: "31-68",
      icon: <Edit3 className="h-6 w-6 text-[#e97311]" />,
      description: "Tata bahasa dan struktur kalimat bahasa Inggris",
      tips: [
        "Mempelajari tata bahasa dasar secara mendalam",
        "Berlatih soal struktur secara rutin",
        "Memahami pola kalimat kompleks"
      ]
    },
    {
      section: "Reading Comprehension", 
      questions: "50 soal",
      duration: "55 menit",
      scoreRange: "31-67",
      icon: <BookOpen className="h-6 w-6 text-[#e97311]" />,
      description: "Pemahaman bacaan teks akademik dan umum",
      tips: [
        "Membaca artikel akademik dari berbagai topik",
        "Memperbanyak kosakata dengan kartu kilas",
        "Berlatih skimming dan scanning"
      ]
    }
  ];

  const advantages = [
    {
      title: "Biaya Terjangkau",
      description: "Lebih ekonomis dibanding TOEFL iBT",
      icon: <Target className="h-8 w-8 text-[#e97311]" />,
      features: ["$45-$65 per tes", "Cocok untuk budget terbatas", "Value for money"]
    },
    {
      title: "Format Berbasis Kertas", 
      description: "Format familiar yang mudah diikuti",
      icon: <Edit3 className="h-8 w-8 text-[#e97311]" />,
      features: ["Tidak perlu komputer", "Antarmuka familiar", "Masalah teknis lebih sedikit"]
    },
    {
      title: "Hasil Cepat",
      description: "Skor tersedia setelah tes",
      icon: <Clock className="h-8 w-8 text-[#e97311]" />,
      features: ["Quick turnaround", "Fast processing", "Immediate planning"]
    },
    {
      title: "Ideal untuk Institusi",
      description: "Perfect untuk evaluasi internal", 
      icon: <Shield className="h-8 w-8 text-[#e97311]" />,
      features: ["Placement testing", "Progress monitoring", "Program evaluation"]
    }
  ];

  const institutions = [
    {
      category: "Universitas Negeri",
      examples: ["Universitas Indonesia (UI)", "Institut Teknologi Bandung (ITB)", "Universitas Gadjah Mada (UGM)", "Institut Teknologi Sepuluh Nopember (ITS)"],
      usage: "Program S2/S3, beasiswa dalam negeri, pertukaran mahasiswa"
    },
    {
      category: "Lembaga Bahasa", 
      examples: ["IALF", "LBI FIB UI", "English First (EF)", "Wall Street English"],
      usage: "Placement test, program evaluation, sertifikasi"
    },
    {
      category: "Institusi Pendidikan",
      examples: ["Sekolah internasional", "Program bilingual", "Kursus bahasa"],
      usage: "Evaluasi kemampuan, monitoring progress"
    }
  ];

  const preparationResources = [
    {
      category: "Buku Persiapan",
      items: [
        "Official Guide to the TOEFL ITP Test",
        "Barron's TOEFL ITP", 
        "Cambridge Preparation for the TOEFL Test",
        "Longman Preparation Course for TOEFL"
      ]
    },
    {
      category: "Platform Daring",
      items: [
        "Express English Hub (Platform ini)",
        "ETS Official Practice Tests",
        "Magoosh TOEFL Prep",
        "Khan Academy English"
      ]
    },
    {
      category: "Aplikasi Seluler",
      items: [
        "TOEFL Practice Test",
        "English Grammar Test", 
        "Vocabulary Builder",
        "Listening Practice Apps"
      ]
    }
  ];

  const faqs = [
    {
      question: "Apa perbedaan utama antara TOEFL ITP dan TOEFL iBT?",
      answer: "TOEFL ITP adalah tes berbasis kertas yang digunakan untuk evaluasi internal institusi, sedangkan TOEFL iBT adalah tes berbasis internet yang diterima secara internasional untuk keperluan akademik dan imigrasi. TOEFL ITP lebih terjangkau dan cocok untuk keperluan domestik."
    },
    {
      question: "Berapa lama hasil TOEFL ITP berlaku?",
      answer: "Hasil TOEFL ITP berlaku selama 2 tahun dari tanggal tes. Namun, beberapa institusi mungkin memiliki kebijakan yang berbeda mengenai masa berlaku skor, jadi sebaiknya konfirmasi dengan institusi tujuan Anda."
    },
    {
      question: "Apakah TOEFL ITP diterima untuk aplikasi visa?", 
      answer: "TOEFL ITP umumnya tidak diterima untuk aplikasi visa atau keperluan imigrasi internasional. Untuk keperluan tersebut, biasanya diperlukan TOEFL iBT atau IELTS. Namun, TOEFL ITP sangat cocok untuk keperluan akademik domestik."
    },
    {
      question: "Bagaimana sistem penilaian TOEFL ITP?",
      answer: "TOEFL ITP menggunakan skala 310-677. Skor dihitung berdasarkan performa di tiga bagian: Listening (31-68), Structure & Written Expression (31-68), dan Reading (31-67). Skor total merupakan konversi dari ketiga bagian tersebut."
    },
    {
      question: "Berapa kali dapat mengulang tes TOEFL ITP?",
      answer: "Tidak ada batasan jumlah pengulangan tes TOEFL ITP. Namun, frekuensi penyelenggaraan tergantung pada institusi penyelenggara. Umumnya, Anda dapat mengulang tes setelah periode tertentu yang ditentukan oleh institusi."
    },
    {
      question: "Apakah terdapat batasan usia untuk mengikuti TOEFL ITP?",
      answer: "Tidak ada batasan usia minimum untuk TOEFL ITP. Namun, peserta di bawah 18 tahun memerlukan persetujuan orang tua atau wali. Tes ini cocok untuk siswa SMA, mahasiswa, dan profesional."
    },
    {
      question: "Apakah ada garansi skor atau uang kembali?",
      answer: "Kami tidak memberikan garansi skor atau pengembalian uang. Hasil tes bergantung pada kemampuan individu dan usaha selama persiapan."
    },
  ];

  return (
    <>
      <SEO 
        title={seoConfig.toeflItp.title}
        description={seoConfig.toeflItp.description}
        keywords={seoConfig.toeflItp.keywords}
        url={seoConfig.toeflItp.url}
      />
      <style>{keyframes}</style>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-16 pb-20">
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
                    <div className="bg-[#e97311] bg-opacity-10 p-3 rounded-full group-hover:bg-opacity-20 transition-colors">
                      {React.cloneElement(stat.icon, { className: "text-[#e97311]" })}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#e97311] mb-2">
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

        {/* About TOEFL ITP Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang TOEFL ITP</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Memahami format, struktur, dan kegunaan TOEFL ITP untuk kebutuhan akademik Anda
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apa itu TOEFL ITP?</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    TOEFL ITP (Institutional Testing Program) adalah versi tes TOEFL berbasis kertas yang digunakan oleh institusi pendidikan untuk keperluan internal seperti penempatan mahasiswa, monitoring kemajuan belajar, dan evaluasi program bahasa Inggris.
                  </p>
                  <p>
                    Tes ini mengukur kemampuan bahasa Inggris akademik dalam tiga area utama: Listening Comprehension, Structure & Written Expression, dan Reading Comprehension. Format paper-based membuatnya familiar dan mudah diikuti oleh peserta.
                  </p>
                  <p>
                    TOEFL ITP menggunakan soal-soal dari tes TOEFL sebelumnya yang telah terbukti valid dan reliabel, memberikan standar penilaian yang konsisten dan dapat diandalkan dengan biaya yang lebih terjangkau.
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Keunggulan TOEFL ITP</h4>
                  <ul className="space-y-2">
                    {[
                      "Biaya lebih terjangkau dibanding TOEFL iBT",
                      "Format paper-based yang familiar dan mudah", 
                      "Hasil tersedia setelah tes",
                      "Ideal untuk evaluasi internal institusi",
                      "Standar ETS yang terpercaya",
                      "Cocok untuk placement dan monitoring"
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Struktur Tes TOEFL ITP</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Memahami format dan bagian-bagian dalam tes TOEFL ITP secara detail
              </p>
            </div>

            <div className="space-y-8 mb-16">
              {testStructure.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.fadeInUp
                     }}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="lg:w-2/3">
                      <div className="flex items-center mb-4">
                        {section.icon}
                        <h3 className="text-2xl font-bold text-gray-900 ml-3">{section.section}</h3>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Jumlah Soal</span>
                          <div className="font-semibold text-[#e97311]">{section.questions}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Durasi</span>
                          <div className="font-semibold text-[#e97311]">{section.duration}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Skor</span>
                          <div className="font-semibold text-purple-600">{section.scoreRange}</div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{section.description}</p>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tips Persiapan:</h4>
                        <ul className="space-y-1">
                          {section.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Soal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rentang Skor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {testStructure.map((section, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{section.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{section.questions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{section.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">{section.scoreRange}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">140</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">115 menit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">310-677</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Institutions Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Institusi yang Menggunakan TOEFL ITP</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Berbagai institusi pendidikan terkemuka menggunakan TOEFL ITP untuk evaluasi internal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {institutions.map((institution, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.fadeInUp
                     }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{institution.category}</h3>
                  <div className="space-y-2 mb-4">
                    {institution.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="text-[#e97311] font-medium">{example}</div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{institution.usage}</p>
                </div>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-[#e97311] to-[#d4640e] rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Cocok untuk Kebutuhan Akademik Domestik</h3>
              <p className="text-lg mb-6 opacity-90">
                TOEFL ITP adalah pilihan ideal untuk evaluasi kemampuan bahasa Inggris dalam konteks pendidikan domestik dengan biaya yang terjangkau dan proses yang efisien.
              </p>
              <button
                onClick={handleOnlineRegistration}
                className="bg-white text-[#e97311] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Daftar TOEFL ITP
              </button>
            </div>
          </div>
        </section>

        {/* Preparation Resources Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Sumber Belajar & Persiapan</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Strategi efektif dan sumber daya terpercaya untuk mempersiapkan TOEFL ITP
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {preparationResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       ...animations.scaleIn
                     }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{resource.category}</h3>
                  <ul className="space-y-3">
                    {resource.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Comprehensive Tips */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tips Persiapan Komprehensif</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testStructure.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center mb-4">
                      {section.icon}
                      <h4 className="text-lg font-semibold text-gray-900 ml-3">{section.section}</h4>
                    </div>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
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
                Jawaban untuk pertanyaan umum tentang TOEFL ITP
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
              <p className="text-gray-600 mb-4">Butuh informasi lebih lanjut tentang TOEFL ITP?</p>
              <button
                onClick={handleOnlineRegistration}
                className="bg-[#e97311] text-white px-8 py-3 rounded-lg hover:bg-[#d4640e] transition-colors font-semibold inline-flex items-center"
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

export default ToeflItp;

