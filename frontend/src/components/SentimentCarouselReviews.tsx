import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Minus, Calendar, MapPin, BookOpen } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  title: string;
  review: string;
  date: string;
  course?: string;
  location?: string;
  verified: boolean;
  bermanfaat: number;
}

interface SentimentSlide {
  sentiment: 'positive' | 'neutral' | 'negative';
  title: string;
  icon: React.ReactNode;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  reviews: Review[];
  percentage: number;
}

const SentimentCarouselReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const allReviews: Review[] = [
    {
      id: 1,
      name: "Sarah Putri Maharani",
      rating: 5,
      title: "Platform terbaik untuk persiapan TOEFL iBT!",
      review: "Express English Hub benar-benar mengubah hidup saya! Dari skor 85 menjadi 108 dalam 3 bulan. Bagian berbicara yang sebelumnya adalah mimpi buruk kini menjadi kekuatan. Sistem umpan balik AI-nya sangat akurat. Instruktur Dr. Sarah Johnson juga sangat responsif. Sangat berharga dan sangat direkomendasikan!",
      date: "15 Januari 2025",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Jakarta",
      verified: true,
      bermanfaat: 47
    },
    {
      id: 2,
      name: "Ni Made Ayu Lestari",
      rating: 5,
      title: "Harga terjangkau tetapi kualitas premium!",
      review: "Sebagai mahasiswa dengan anggaran terbatas, platform ini menjadi solusi terbaik! Harga terjangkau tetapi kualitas tidak kalah dengan yang mahal. Aplikasi seluler memungkinkan belajar di mana pun. Berhasil memperoleh TOEFL iBT 95 untuk beasiswa ke Selandia Baru. Sangat puas dan direkomendasikan!",
      date: "8 Januari 2025",
      course: "Reading Mastery TOEFL iBT",
      location: "Denpasar",
      verified: true,
      bermanfaat: 31
    },
    {
      id: 3,
      name: "Putri Maharani Salsabila",
      rating: 5,
      title: "Dari putus asa menjadi percaya diri!",
      review: "Dulu berbicara saya sangat kacau, kepercayaan diri sangat rendah. Namun setelah mengikuti program di sini, segalanya berubah! Simulator berbicara realistis dan umpan balik konstruktif. Saat ini skor berbicara 26/30, total TOEFL iBT 112! Universitas impian, saya datang! Sangat direkomendasikan bagi yang kesulitan dengan berbicara!",
      date: "2 Januari 2025",
      course: "Speaking Confidence TOEFL iBT",
      location: "Yogyakarta",
      verified: true,
      bermanfaat: 52
    },
    {
      id: 4,
      name: "Dimas Prasetyo Nugroho",
      rating: 5,
      title: "Luar biasa! Sangat direkomendasikan!",
      review: "Platform ini sangat terpercaya! Yang tadinya awam dengan TOEFL, sekarang percaya diri untuk tes sesungguhnya. Tes diagnostik di awal langsung menunjukkan kelemahan. Rencana studi personal, semua instruktur adalah ahli. Setelah 4 bulan belajar, tes simulasi secara konsisten 105+. Siap menaklukkan TOEFL iBT!",
      date: "15 Desember 2024",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Malang",
      verified: true,
      bermanfaat: 43
    },
    {
      id: 5,
      name: "Ahmad Rizky Pratama",
      rating: 4,
      title: "Bagus tapi ada yang perlu diperbaiki",
      review: "Platform yang solid untuk belajar TOEFL. Tes latihan realistis, pelacakan kemajuan terperinci. Namun ada masalah: pemuatan video terkadang lambat, dukungan pelanggan agak lambat merespons, kualitas audio pada beberapa latihan mendengarkan kurang jernih. Meskipun demikian, skor naik dari 520 ke 580. Cukup puas secara keseluruhan.",
      date: "12 Januari 2025",
      course: "Listening Skills TOEFL ITP",
      location: "Bandung",
      verified: true,
      bermanfaat: 23
    },
    {
      id: 6,
      name: "Aisyah Nur Rahmawati",
      rating: 4,
      title: "Good content, needs more interaction",
      review: "Materi komprehensif dan laporan analitis terperinci. Namun kurang interaktif, mungkin bisa ditambahkan sesi langsung atau fitur studi kelompok. Umpan balik penulisan bisa lebih spesifik. Skor meningkat dari 78 ke 92, konten jelas berfungsi. Hanya membutuhkan sentuhan insan.",
      date: "18 Desember 2024",
      course: "Reading Comprehension TOEFL ITP",
      location: "Semarang",
      verified: true,
      bermanfaat: 21
    },
    {
      id: 7,
      name: "Rendi Kurniawan Putra",
      rating: 4,
      title: "Solid platform with minor issues",
      review: "Platform yang baik untuk persiapan TOEFL serius. Sistem terorganisir dengan baik, pelacakan kemajuan terperinci. Terdapat masalah teknis: server terkadang lambat saat jam sibuk, aplikasi seluler sesekali mengalami gangguan. Dari sisi konten sangat memuaskan. Dari TOEFL ITP 480 menjadi 550 dalam 6 minggu.",
      date: "2 Desember 2024",
      course: "Listening Skills TOEFL ITP",
      location: "Tangerang",
      verified: true,
      bermanfaat: 24
    },
    {
      id: 8,
      name: "Bayu Setiawan Wijaya",
      rating: 3,
      title: "Decent content, poor customer service",
      review: "Konten yang baik dan komprehensif, materi terbaru. Namun layanan pelanggan mengecewakan. Masalah teknis saat tes latihan, dukungan lambat merespons dan solusi kurang memuaskan. Untuk harga yang dibayar, diharapkan layanan yang lebih baik. Agak kecewa dengan pelayanannya.",
      date: "5 Januari 2025",
      course: "Structure & Written Expression TOEFL ITP",
      location: "Surabaya",
      verified: true,
      bermanfaat: 18
    },
    {
      id: 9,
      name: "Eko Prasetyo Wibowo",
      rating: 3,
      title: "Average experience, nothing special",
      review: "Platform baik namun tidak ada yang luar biasa. Materi standar, tidak ada yang terlalu inovatif. Harga tidak kompetitif dibandingkan pesaing. Dukungan pelanggan responsif namun tidak terlalu membantu. Skor naik sedikit namun tidak ada peningkatan dramatis. Biasa saja, tidak istimewa.",
      date: "28 Oktober 2024",
      course: "Listening Skills TOEFL ITP",
      location: "Semarang",
      verified: true,
      bermanfaat: 11
    },
    {
      id: 10,
      name: "Kevin Tanujaya Lim",
      rating: 2,
      title: "Audio quality issues ruin the experience",
      review: "Kualitas audio pada latihan mendengarkan sangat buruk. Terdapat kebisingan latar belakang, volume tidak konsisten, rekaman bitrate rendah. Untuk persiapan TOEFL, kualitas audio sangat krusial! Sudah mengeluh berkali-kali namun belum ada peningkatan. Sangat kecewa dengan kualitas audio, tidak direkomendasikan untuk latihan mendengarkan.",
      date: "22 Desember 2024",
      course: "Listening Skills TOEFL ITP",
      location: "Pontianak",
      verified: true,
      bermanfaat: 15
    },
    {
      id: 11,
      name: "Budianto Wijaya",
      rating: 5,
      title: "Fitur simulasi ujian yang sangat realistis!",
      review: "Simulasi ujian di sini benar-benar mirip dengan aslinya. Timer, navigasi, dan jenis soalnya persis seperti TOEFL iBT. Ini sangat membantu saya terbiasa dengan tekanan ujian dan mengatur waktu dengan lebih baik. Skor mock test saya selalu akurat dengan hasil sebenarnya.",
      date: "18 April 2025",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Jakarta",
      verified: true,
      bermanfaat: 39
    },
    {
      id: 12,
      name: "Kartika Sari",
      rating: 5,
      title: "Materi Speaking yang mendalam dan praktikal.",
      review: "Sebagai seseorang yang grogi saat speaking, materi di sini sangat menolong. Ada banyak latihan dengan AI bot yang bisa memberikan feedback instan pada pelafalan dan intonasi. Sangat meningkatkan kepercayaan diri saya.",
      date: "22 April 2025",
      course: "Speaking Confidence TOEFL iBT",
      location: "Surabaya",
      verified: true,
      bermanfaat: 37
    },
    {
      id: 13,
      name: "Hadi Susanto",
      rating: 5,
      title: "Progress saya terpantau jelas, sangat memotivasi!",
      review: "Dashboard progress sangat intuitif. Saya bisa melihat grafik peningkatan skor di setiap section dan juga weakness area yang perlu diperbaiki. Ini membuat belajar lebih terarah dan saya jadi lebih semangat mencapai target.",
      date: "25 April 2025",
      course: "Reading Mastery TOEFL iBT",
      location: "Bandung",
      verified: true,
      bermanfaat: 36
    },
    {
      id: 14,
      name: "Dewi Lestari",
      rating: 4,
      title: "Konten reading sangat bagus, tapi kosa kata bisa ditambah.",
      review: "Latihan reading sangat menantang dan efektif. Strategi yang diajarkan juga mudah diterapkan. Hanya saja, akan lebih baik jika ada fitur kamus terintegrasi atau list kosa kata penting yang bisa diakses langsung dari soal.",
      date: "28 April 2025",
      course: "Reading Comprehension TOEFL ITP",
      location: "Yogyakarta",
      verified: true,
      bermanfaat: 29
    },
    {
      id: 15,
      name: "Taufik Hidayat",
      rating: 4,
      title: "Platform stabil, perlu lebih banyak latihan menulis.",
      review: "Secara keseluruhan platform sangat stabil dan cepat. Tidak ada masalah teknis yang berarti. Untuk bagian writing, saya berharap ada lebih banyak variasi prompt dan contoh esai yang bisa dianalisis.",
      date: "1 Mei 2025",
      course: "Advanced Writing TOEFL iBT",
      location: "Semarang",
      verified: true,
      bermanfaat: 26
    },
    {
      id: 16,
      name: "Linda Permata",
      rating: 3,
      title: "Akses materi sometimes lambat di jam sibuk.",
      review: "Materi belajar sangat berkualitas, tapi terkadang di malam hari saat traffic tinggi, loading materi atau video agak lambat. Ini agak mengganggu alur belajar. Semoga bandwidth server bisa ditingkatkan.",
      date: "4 Mei 2025",
      course: "Listening Skills TOEFL ITP",
      location: "Denpasar",
      verified: true,
      bermanfaat: 14
    },
    {
      id: 17,
      name: "Agus Santoso",
      rating: 3,
      title: "Fokus ke beginner agak kurang, butuh materi advance.",
      review: "Sebagai orang yang sudah punya basic TOEFL, saya merasa beberapa materi terlalu dasar. Akan bagus jika ada modul atau path khusus untuk level intermediate dan advanced agar bisa langsung belajar materi yang lebih kompleks.",
      date: "7 Mei 2025",
      course: "Structure & Written Expression TOEFL ITP",
      location: "Medan",
      verified: true,
      bermanfaat: 10
    },
    {
      id: 18,
      name: "Siti Rahayu",
      rating: 2,
      title: "UI desain kurang modern, perlu refresh.",
      review: "Fungsionalitas platform oke, tapi desainnya terasa agak ketinggalan jaman. Tampilan kurang menarik dan navigasi kadang kurang intuitif. Mungkin bisa diperbarui agar lebih fresh dan user-friendly.",
      date: "10 Mei 2025",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Palembang",
      verified: true,
      bermanfaat: 6
    },
    {
      id: 19,
      name: "Dino Prasetyo",
      rating: 2,
      title: "Beberapa link latihan rusak atau tidak berfungsi.",
      review: "Saya menemukan beberapa link ke latihan tambahan atau referensi eksternal yang tidak bisa diakses atau 'page not found'. Ini cukup mengganggu karena saya jadi tidak bisa menyelesaikan latihan dengan maksimal.",
      date: "13 Mei 2025",
      course: "Reading Mastery TOEFL iBT",
      location: "Malang",
      verified: true,
      bermanfaat: 8
    },
    {
      id: 20,
      name: "Putri Anggraini",
      rating: 1,
      title: "Tidak ada fitur download materi, menyulitkan offline.",
      review: "Sangat disayangkan tidak ada opsi untuk mengunduh materi atau video. Ini menyulitkan saya yang sering belajar di daerah dengan koneksi internet kurang stabil atau saat bepergian. Fitur luring sangat dibutuhkan.",
      date: "16 Mei 2025",
      course: "Listening Skills TOEFL ITP",
      location: "Pontianak",
      verified: true,
      bermanfaat: 4
    },
    {
      id: 21,
      name: "Rian Hermawan",
      rating: 5,
      title: "Materi grammar dijelaskan dengan sangat jelas!",
      review: "Bagian tata bahasa yang dulunya momok, sekarang menjadi lebih mudah dipahami berkat penjelasan yang sederhana dan contoh yang relevan. Latihannya juga langsung aplikatif. Saya menjadi lebih percaya diri untuk bagian struktur.",
      date: "20 Mei 2025",
      course: "Structure & Written Expression TOEFL ITP",
      location: "Aceh",
      verified: true,
      bermanfaat: 41
    },
    {
      id: 22,
      name: "Nurul Hidayah",
      rating: 5,
      title: "Tim support sangat responsif dan membantu.",
      review: "Saya mengalami kendala saat masuk dan tim dukungan langsung sigap membantu. Respons mereka cepat dan solusinya efektif. Pengalaman layanan pelanggan yang sangat memuaskan.",
      date: "23 Mei 2025",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Lampung",
      verified: true,
      bermanfaat: 34
    },
    {
      id: 23,
      name: "Andi Saputra",
      rating: 5,
      title: "Harga sangat bersaing dengan kualitas yang ditawarkan.",
      review: "Dibandingkan platform lain, Express English Hub menawarkan harga yang sangat kompetitif tanpa mengurangi kualitas materi. Ini sangat cocok untuk pelajar dengan anggaran terbatas yang mencari hasil maksimal.",
      date: "26 Mei 2025",
      course: "Reading Mastery TOEFL iBT",
      location: "Padang",
      verified: true,
      bermanfaat: 32
    },
    {
      id: 24,
      name: "Mita Rosita",
      rating: 4,
      title: "Pembaharuan materi kurang sering.",
      review: "Konten yang ada memang bagus, tapi akan lebih baik jika ada pembaharuan materi secara berkala, mengikuti tren soal TOEFL terbaru. Terutama untuk topik-topik writing dan speaking.",
      date: "29 Mei 2025",
      course: "Advanced Writing TOEFL iBT",
      location: "Pekanbaru",
      verified: true,
      bermanfaat: 19
    },
    {
      id: 25,
      name: "Bayu Permana",
      rating: 4,
      title: "Audio untuk listening kadang kurang bervariasi.",
      review: "Kualitas audio sudah baik, namun saya merasa variasi suara dan kecepatan bicara pada latihan mendengarkan terkadang kurang. Akan lebih representatif jika terdapat lebih banyak aksen dan gaya bicara yang berbeda.",
      date: "1 Juni 2025",
      course: "Listening Skills TOEFL ITP",
      location: "Balikpapan",
      verified: true,
      bermanfaat: 17
    },
    {
      id: 26,
      name: "Cahaya Indah",
      rating: 3,
      title: "Kurangnya interaksi langsung dengan instruktur.",
      review: "Meskipun terdapat fitur Tanya Jawab, saya berharap terdapat sesi interaksi langsung dengan instruktur. Hal ini akan sangat membantu untuk bertanya langsung dan mendapatkan umpan balik secara waktu nyata, terutama untuk berbicara.",
      date: "4 Juni 2025",
      course: "Speaking Confidence TOEFL iBT",
      location: "Manado",
      verified: true,
      bermanfaat: 11
    },
    {
      id: 27,
      name: "Eka Putra",
      rating: 3,
      title: "Desain mobile app perlu dioptimalkan.",
      review: "Aplikasi seluler terkadang kurang responsif di beberapa jenis ponsel. Tata letak elemen-dokumen juga seringkali berantakan. Pengalaman penggunaan di seluler kurang mulus dibandingkan di desktop.",
      date: "7 Juni 2025",
      course: "Reading Comprehension TOEFL ITP",
      location: "Makassar",
      verified: true,
      bermanfaat: 9
    },
    {
      id: 28,
      name: "Wulan Febriani",
      rating: 2,
      title: "Sering ada error saat submit latihan.",
      review: "Beberapa kali saya mengalami kesalahan saat mencoba menyerahkan jawaban latihan atau tes simulasi. Pesan kesalahannya tidak jelas dan kemajuan saya jadi tidak tersimpan. Ini sangat mengganggu dan membuang waktu.",
      date: "10 Juni 2025",
      course: "Structure & Written Expression TOEFL ITP",
      location: "Cirebon",
      verified: true,
      bermanfaat: 5
    },
    {
      id: 29,
      name: "Galih Pratama",
      rating: 2,
      title: "Tidak ada opsi kustomisasi rencana belajar.",
      review: "Semua diberikan dalam paket yang sudah ditentukan. Akan sangat membantu jika pengguna dapat menyesuaikan rencana belajar mereka sendiri sesuai dengan kelemahan dan target skor. Ini akan membuat belajar lebih personal.",
      date: "13 Juni 2025",
      course: "Complete TOEFL iBT Bootcamp",
      location: "Purwokerto",
      verified: true,
      bermanfaat: 3
    },
    {
      id: 30,
      name: "Nia Kurniasih",
      rating: 1,
      title: "Sistem scoring AI untuk writing kurang akurat.",
      review: "Saya mencoba fitur penilaian AI untuk esai penulisan, namun hasilnya seringkali tidak sesuai dengan ekspektasi atau umpan balik dari tutor manusia. Terkadang skor tinggi padahal banyak kesalahan, atau sebaliknya. Perlu kalibrasi lebih lanjut.",
      date: "16 Juni 2025",
      course: "Advanced Writing TOEFL iBT",
      location: "Bekasi",
      verified: true,
      bermanfaat: 2
    },
  ];

  // Analisis sentimen berdasarkan rating dan kata kunci
  const analyzeSentiment = (review: Review): 'positive' | 'neutral' | 'negative' => {
    const positiveKeywords = ['puas', 'bagus', 'recommended', 'excellent', 'amazing', 'perfect', 'helpful', 'great', 'mantap', 'terbaik', 'luar biasa', 'worth', 'berhasil', 'suka'];
    const negativeKeywords = ['kecewa', 'buruk', 'tidak recommended', 'disappointing', 'poor', 'bad', 'tidak puas', 'jelek', 'bermasalah', 'tidak worth'];
    
    const reviewText = (review.title + ' ' + review.review).toLowerCase();
    const positiveCount = positiveKeywords.filter(keyword => reviewText.includes(keyword)).length;
    const negativeCount = negativeKeywords.filter(keyword => reviewText.includes(keyword)).length;

    if (review.rating >= 4 && positiveCount > negativeCount) return 'positive';
    if (review.rating <= 2 || negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Kategorikan ulasan berdasarkan sentimen
  const categorizeReviews = (): SentimentSlide[] => {
    const positive = allReviews.filter(review => analyzeSentiment(review) === 'positive');
    const neutral = allReviews.filter(review => analyzeSentiment(review) === 'neutral');
    const negative = allReviews.filter(review => analyzeSentiment(review) === 'negative');

    return [
      {
        sentiment: 'positive',
        title: 'Ulasan Positif',
        icon: <ThumbsUp className="h-6 w-6" />,
        emoji: '😊',
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        reviews: positive.slice(0, 4),
        percentage: Math.round((positive.length / allReviews.length) * 100)
      },
      {
        sentiment: 'neutral',
        title: 'Ulasan Netral',
        icon: <Minus className="h-6 w-6" />,
        emoji: '😐',
        bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        reviews: neutral.slice(0, 4),
        percentage: Math.round((neutral.length / allReviews.length) * 100)
      },
      {
        sentiment: 'negative',
        title: 'Ulasan Negatif',
        icon: <ThumbsDown className="h-6 w-6" />,
        emoji: '😞',
        bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        reviews: negative.slice(0, 4),
        percentage: Math.round((negative.length / allReviews.length) * 100)
      }
    ];
  };

  const slides = categorizeReviews();

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ulasan Berdasarkan Sentimen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi pengalaman pengguna berdasarkan kategori sentimen untuk mendapatkan perspektif yang komprehensif tentang platform kami.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Current Slide */}
          <div className={`${currentSlideData.bgColor} rounded-2xl border-2 ${currentSlideData.borderColor} p-8 mb-8 transition-all duration-500`}>
            {/* Slide Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl">{currentSlideData.emoji}</span>
                <div className={`${currentSlideData.textColor}`}>
                  {currentSlideData.icon}
                </div>
                <h3 className={`text-2xl font-bold ${currentSlideData.textColor}`}>
                  {currentSlideData.title}
                </h3>
              </div>
              <div className={`text-lg font-semibold ${currentSlideData.textColor} mb-2`}>
                {currentSlideData.percentage}% dari total ulasan
              </div>
              <div className="text-gray-600">
                {currentSlideData.reviews.length} ulasan representatif ditampilkan
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSlideData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#e97311] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">({review.rating}/5)</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                      {review.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {review.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Title */}
                  <h5 className="font-semibold text-gray-900 mb-2 text-sm">
                    "{review.title}"
                  </h5>

                  {/* Review Content */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                    {review.review}
                  </p>

                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {review.course && (
                      <div className="flex items-center text-xs">
                        <BookOpen className="h-3 w-3 text-[#e97311] mr-1" />
                        <span className="font-medium text-[#e97311] truncate">{review.course}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">{review.bermanfaat} bermanfaat</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-[#e97311]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex space-x-3">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    index === currentSlide
                      ? slide.sentiment === 'positive'
                        ? 'bg-green-600 text-white'
                        : slide.sentiment === 'negative'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label={`Go to ${slide.title}`}
                >
                  <span className="text-lg">{slide.emoji}</span>
                  <span className="text-sm font-medium hidden sm:inline">
                    {slide.title}
                  </span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {slide.percentage}%
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-[#e97311]"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlaying ? '⏸️ Pause Auto-play' : '▶️ Resume Auto-play'}
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Ringkasan Sentimen Ulasan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {slides.map((slide, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-2xl">{slide.emoji}</span>
                  <div className={slide.textColor}>
                    {slide.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {slide.percentage}%
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {slide.title}
                </div>
                <div className="text-xs text-gray-500">
                  {slide.reviews.length}+ ulasan
                </div>
              </div>
            ))}
          </div>

          {/* Sentiment Progress Bar */}
          <div className="mb-4">
            <div className="flex rounded-full overflow-hidden h-4">
              <div 
                className="bg-green-500 transition-all duration-500" 
                style={{ width: `${slides[0].percentage}%` }}
              ></div>
              <div 
                className="bg-gray-400 transition-all duration-500" 
                style={{ width: `${slides[1].percentage}%` }}
              ></div>
              <div 
                className="bg-red-500 transition-all duration-500" 
                style={{ width: `${slides[2].percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Berdasarkan analisis ulasan pengguna Express English Hub
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SentimentCarouselReviews;