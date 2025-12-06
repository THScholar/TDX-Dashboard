import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BarChart2, Bot, CheckCircle2, XCircle, 
  ChevronDown, Menu, X, Activity, Calculator 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-primary-500/30 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="self-center text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">TherraBiz</span>
          </Link>
          
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link to="/login">
              <button className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-800 font-medium rounded-xl text-sm px-5 py-2.5 text-center transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40">
                Masuk Dashboard
              </button>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-400 rounded-lg md:hidden hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-slate-800 rounded-lg bg-slate-900 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
              <li><a href="#features" onClick={handleNavClick} className="block py-2 px-3 text-slate-300 hover:text-primary-400 md:p-0 transition-colors">Fitur AI</a></li>
              <li><a href="#how-it-works" onClick={handleNavClick} className="block py-2 px-3 text-slate-300 hover:text-primary-400 md:p-0 transition-colors">Cara Kerja</a></li>
              <li><a href="#comparison" onClick={handleNavClick} className="block py-2 px-3 text-slate-300 hover:text-primary-400 md:p-0 transition-colors">Keunggulan</a></li>
              <li><a href="#faq" onClick={handleNavClick} className="block py-2 px-3 text-slate-300 hover:text-primary-400 md:p-0 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 text-primary-400 text-sm font-medium mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SparkleIcon className="w-4 h-4" />
            <span>Revolusi Digital untuk UMKM Indonesia</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Kelola Bisnis Lebih Cerdas <br className="hidden md:block"/> Bersama <span className="text-primary-400">Asisten AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            TherraBiz bukan sekadar dashboard pencatatan. Kami menghadirkan <strong>AI Consultant</strong> yang menganalisis data penjualan, memprediksi stok, dan memberikan strategi marketing otomatis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 group"
            >
              Coba Gratis Sekarang 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works"
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              Pelajari Cara Kerja
            </a>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-20 mx-auto max-w-6xl relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl blur opacity-20"></div>
             <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
                   <p className="text-primary-400 font-mono mb-2 text-sm tracking-widest uppercase">Live Demo Preview</p>
                   <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Real-time Analytics</h3>
                   <div className="flex gap-4">
                      <div className="px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sales: +12%
                      </div>
                      <div className="px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Insight AI: Ready
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-10 border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="100%" label="Gratis Selamanya" />
          <StatItem value="0" label="Biaya Server (Local)" />
          <StatItem value="24/7" label="AI Assistant" />
          <StatItem value="Secure" label="Data Privasi Terjamin" />
        </div>
      </section>

      {/* --- PROBLEM VS SOLUTION --- */}
      <section id="comparison" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tinggalkan Cara Lama</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Berhenti menebak-nebak kondisi bisnis Anda. Beralihlah ke keputusan berbasis data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Old Way */}
            <div className="space-y-6 p-8 rounded-2xl bg-red-950/10 border border-red-900/30">
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <XCircle /> Cara Konvensional
              </h3>
              <ul className="space-y-4">
                <ListItemNegative text="Mencatat manual di buku tulis, rawan hilang/rusak." />
                <ListItemNegative text="Tidak tahu barang mana yang paling laku atau mati." />
                <ListItemNegative text="Bingung menentukan harga promo yang menguntungkan." />
                <ListItemNegative text="Tidak tahu kemana uang habis (bocor halus)." />
              </ul>
            </div>

            {/* TherraBiz Way */}
            <div className="space-y-6 p-8 rounded-2xl bg-primary-950/10 border border-primary-500/30 relative">
              <div className="absolute -top-3 -right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Recommended
              </div>
              <h3 className="text-xl font-bold text-primary-400 flex items-center gap-2">
                <CheckCircle2 /> Dengan TherraBiz
              </h3>
              <ul className="space-y-4">
                <ListItemPositive text="Pencatatan digital otomatis, aman di browser." />
                <ListItemPositive text="AI memberitahu Produk Terlaris & Slow Moving." />
                <ListItemPositive text="Simulator Promo untuk prediksi keuntungan." />
                <ListItemPositive text="Laporan Laba Rugi real-time & otomatis." />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (BENTO STYLE) --- */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary-400 font-semibold tracking-wider uppercase text-sm">Fitur Canggih</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Lebih Dari Sekadar Kasir</h2>
            <p className="text-slate-400">Teknologi Enterprise yang disederhanakan untuk UMKM.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI Chat (Large) */}
            <div className="md:col-span-2 bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-primary-500/50 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-16 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
               <Bot className="w-12 h-12 text-primary-400 mb-6 bg-slate-900 p-2 rounded-xl" />
               <h3 className="text-2xl font-bold text-white mb-2">Therra AI Consultant</h3>
               <p className="text-slate-400 mb-6 max-w-md">
                 Bukan chatbot biasa. Therra AI mengerti konteks data penjualan Anda. Tanyakan "Bagaimana cara meningkatkan omzet bulan ini?" dan dapatkan jawaban berbasis data, bukan teori.
               </p>
               <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-slate-900 text-xs text-slate-300 border border-slate-700">Strategi Marketing</span>
                 <span className="px-3 py-1 rounded-full bg-slate-900 text-xs text-slate-300 border border-slate-700">Analisis Tren</span>
               </div>
            </div>

            {/* Feature 2: Slow Moving */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-yellow-500/50 transition-all group">
               <Activity className="w-10 h-10 text-yellow-400 mb-6 bg-slate-900 p-2 rounded-xl" />
               <h3 className="text-xl font-bold text-white mb-2">Deteksi Stok Mati</h3>
               <p className="text-slate-400 text-sm">
                 AI mendeteksi barang yang jarang laku (Slow Moving) agar Anda bisa segera melakukan cuci gudang sebelum rugi.
               </p>
            </div>

            {/* Feature 3: Promo Estimator */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-green-500/50 transition-all group">
               <Calculator className="w-10 h-10 text-green-400 mb-6 bg-slate-900 p-2 rounded-xl" />
               <h3 className="text-xl font-bold text-white mb-2">Simulator Promo</h3>
               <p className="text-slate-400 text-sm">
                 Jangan asal diskon! Simulasikan dulu dampaknya terhadap margin keuntungan dengan fitur "What-If Analysis".
               </p>
            </div>

            {/* Feature 4: Realtime Charts (Large) */}
            <div className="md:col-span-2 bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all group relative overflow-hidden">
               <div className="absolute bottom-0 left-0 p-16 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
               <BarChart2 className="w-12 h-12 text-blue-400 mb-6 bg-slate-900 p-2 rounded-xl" />
               <h3 className="text-2xl font-bold text-white mb-2">Visualisasi Data Real-Time</h3>
               <p className="text-slate-400 mb-4 max-w-lg">
                 Grafik interaktif yang update seketika saat ada transaksi baru. Pantau Omzet, Jumlah Transaksi, dan Rata-rata Keranjang Belanja dalam satu layar.
               </p>
               <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-4">
                 <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-3/4"></div>
               </div>
               <p className="text-xs text-right mt-1 text-slate-500">Growth Tracking Enabled</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Mulai Dalam 3 Menit</h2>
            <p className="text-slate-400">Tidak perlu instalasi ribet. Langsung pakai di browser.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            {/* Step 1 */}
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-400 mb-6 shadow-lg shadow-primary-500/10">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Login & Profil</h3>
              <p className="text-slate-400 text-sm px-4">Masuk ke dashboard dan isi nama toko Anda. Data tersimpan aman di perangkat Anda.</p>
            </div>
             {/* Step 2 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-x-1/2"></div>
              <div className="w-16 h-16 mx-auto bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-400 mb-6 shadow-lg shadow-primary-500/10 relative z-10">2</div>
              <h3 className="text-xl font-bold text-white mb-2">Input Transaksi</h3>
              <p className="text-slate-400 text-sm px-4">Catat penjualan harian atau pengeluaran. Bisa input manual atau import CSV.</p>
            </div>
             {/* Step 3 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-x-1/2"></div>
              <div className="w-16 h-16 mx-auto bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-400 mb-6 shadow-lg shadow-primary-500/10 relative z-10">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Dapatkan Insight</h3>
              <p className="text-slate-400 text-sm px-4">Lihat grafik otomatis terbentuk dan minta saran AI untuk meningkatkan penjualan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-4">
            <FaqItem 
              question="Apakah data saya aman?"
              answer="Sangat aman. TherraBiz menggunakan teknologi LocalStorage, artinya data penjualan Anda tersimpan HANYA di browser perangkat Anda sendiri. Kami tidak memiliki server database untuk menyimpan data Anda."
            />
            <FaqItem 
              question="Apakah benar-benar gratis?"
              answer="Ya, versi saat ini 100% gratis untuk digunakan tanpa biaya langganan bulanan."
            />
            <FaqItem 
              question="Bisakah saya export data ke Excel?"
              answer="Tentu saja. Tersedia fitur Export CSV yang kompatibel dengan Microsoft Excel atau Google Sheets untuk keperluan pembukuan lebih lanjut."
            />
            <FaqItem 
              question="Apakah butuh internet?"
              answer="Untuk fitur dasar (input data, grafik), Anda bisa menggunakannya. Namun untuk fitur AI (Chat, Insight, Prediksi), Anda memerlukan koneksi internet untuk terhubung ke otak AI."
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Siap Mengembangkan Bisnis Anda?</h2>
          <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">
            Bergabunglah dengan UMKM cerdas lainnya yang telah beralih ke manajemen berbasis data dan AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="inline-block px-10 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl"
            >
              Mulai Sekarang - Gratis
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">No credit card required • Instant setup</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">TherraBiz</div>
            <p className="text-slate-400 text-sm max-w-xs">
              Platform dashboard UMKM modern dengan integrasi kecerdasan buatan untuk membantu pebisnis lokal tumbuh lebih cepat.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Produk</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-primary-400">Fitur Utama</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-400">Cara Kerja</a></li>
              <li><a href="#comparison" className="hover:text-primary-400">Keunggulan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Dukungan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#faq" className="hover:text-primary-400">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-400">Kontak Kami</a></li>
              <li><a href="#" className="hover:text-primary-400">Privasi</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-600 text-sm pt-8 border-t border-slate-900">
          <p>&copy; {new Date().getFullYear()} TherraBiz Project. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
  </svg>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div>
    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</div>
    <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{label}</div>
  </div>
);

const ListItemNegative = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-slate-400">
    <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

const ListItemPositive = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-slate-200">
    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-800 transition-colors"
      >
        <span className="font-semibold text-slate-200">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 py-4 text-slate-400 text-sm bg-slate-900/80 border-t border-slate-800 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};