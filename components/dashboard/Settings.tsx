import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeOption, LayoutOption, AnalyticsMode } from '../../types';
import { Monitor, Layout, Check, BarChart2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, layout, analyticsMode, setTheme, setLayout, setAnalyticsMode } = useTheme();

  const themes: { id: ThemeOption; name: string; color: string }[] = [
    { id: 'dark', name: 'Dark Default', color: '#0f172a' },
    { id: 'light', name: 'Light Mode', color: '#f8fafc' },
    { id: 'cyber', name: 'Cyber Blue', color: '#020410' },
    { id: 'pastel', name: 'Soft Pastel', color: '#fff5ee' },
  ];

  const layouts: { id: LayoutOption; name: string; desc: string }[] = [
    { id: 'modern', name: 'Modern View', desc: 'Tampilan standar dengan elemen glassmorphism.' },
    { id: 'simple', name: 'Simple View', desc: 'Minimalis, fokus pada angka.' },
    { id: 'analytic', name: 'Analytic View', desc: 'Lebih banyak grafik di halaman depan.' },
    { id: 'compact', name: 'Compact View', desc: 'Jarak elemen lebih rapat untuk layar kecil.' },
  ];

  const analyticModes: { id: AnalyticsMode; name: string; desc: string }[] = [
    { id: 'basic', name: 'Basic Mode', desc: 'Grafik standar & ringkasan.' },
    { id: 'advanced', name: 'Advanced Mode', desc: 'Insight AI lebih detail & grafik mendalam.' },
    { id: 'forecast', name: 'Forecast Mode', desc: 'Fokus pada prediksi & proyeksi masa depan.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Pengaturan Dashboard</h2>
        <p className="text-slate-400 text-sm">Sesuaikan gaya visual dan kedalaman analisis TherraBiz.</p>
      </div>

      {/* Analytics Mode Section (NEW) */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
           <BarChart2 size={20} className="text-primary-400" /> Mode Analitik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticModes.map((m) => (
            <button
              key={m.id}
              onClick={() => setAnalyticsMode(m.id)}
              className={`
                p-4 rounded-xl border transition-all text-left relative
                 ${analyticsMode === m.id ? 'bg-primary-900/20 border-primary-500' : 'bg-transparent border-slate-600 hover:bg-slate-700/30'}
              `}
            >
              <span className={`block font-bold mb-1 ${analyticsMode === m.id ? 'text-primary-400' : 'text-slate-200'}`}>
                {m.name}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              {analyticsMode === m.id && (
                <div className="absolute top-3 right-3 text-primary-500"><Check size={16} /></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Monitor size={20} className="text-primary-400" /> Tema Aplikasi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`
                relative p-4 rounded-xl border transition-all text-left group overflow-hidden
                ${theme === t.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-600 hover:border-slate-500'}
              `}
            >
              <div 
                className="w-full h-12 rounded-lg mb-3 shadow-inner" 
                style={{ backgroundColor: t.color }} 
              />
              <span className={`block font-medium ${theme === t.id ? 'text-primary-400' : 'text-slate-300'}`}>
                {t.name}
              </span>
              {theme === t.id && (
                <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-0.5 text-white">
                  <Check size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
           <Layout size={20} className="text-primary-400" /> Mode Layout
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id)}
              className={`
                flex items-start gap-4 p-4 rounded-xl border transition-all text-left
                 ${layout === l.id ? 'bg-primary-900/10 border-primary-500' : 'bg-transparent border-slate-600 hover:bg-slate-700/30'}
              `}
            >
              <div className={`mt-1 p-2 rounded-lg ${layout === l.id ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-700 text-slate-400'}`}>
                <Layout size={20} />
              </div>
              <div>
                <span className={`block font-bold mb-1 ${layout === l.id ? 'text-primary-400' : 'text-slate-200'}`}>
                  {l.name}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{l.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};