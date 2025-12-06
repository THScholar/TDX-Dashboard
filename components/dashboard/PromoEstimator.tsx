import React, { useState } from 'react';
import { estimateOpenRouterPromoImpact } from '../../services/openRouterService';
import { Button } from '../Button';
import { Tag, TrendingUp, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const PromoEstimator: React.FC = () => {
  const { analyticsMode } = useTheme();
  const [promoType, setPromoType] = useState('Diskon Persen');
  const [product, setProduct] = useState('');
  const [detail, setDetail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !detail) return;
    
    setLoading(true);
    try {
      const res = await estimateOpenRouterPromoImpact(promoType, product, detail);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {analyticsMode !== 'basic' ? (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <Tag className="text-primary-400" /> Estimasi Dampak Promo
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Jangan buat promo sembarangan! Cek dulu prediksi profit dan risikonya dengan AI.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <form onSubmit={handleEstimate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Jenis Promo</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 mt-1"
                    value={promoType} onChange={e => setPromoType(e.target.value)}
                  >
                    <option>Diskon Persen (%)</option>
                    <option>Potongan Harga Tetap (Rp)</option>
                    <option>Buy 1 Get 1</option>
                    <option>Bundling Paket</option>
                    <option>Cashback</option>
                  </select>
                </div>
                <div>
                   <label className="text-sm text-slate-400">Nama Produk</label>
                   <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 mt-1"
                     placeholder="Misal: Kopi Susu Gula Aren" value={product} onChange={e => setProduct(e.target.value)} required />
                </div>
              </div>
              <div>
                 <label className="text-sm text-slate-400">Detail Promo</label>
                 <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 mt-1"
                   placeholder="Misal: Diskon 20% khusus hari Jumat" value={detail} onChange={e => setDetail(e.target.value)} required />
              </div>
              <Button type="submit" isLoading={loading} className="w-full">
                <TrendingUp size={18} /> Estimasi Dampak
              </Button>
            </form>
          </div>

          {result && (
            <div className="bg-slate-800 border border-primary-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               <h3 className="font-bold text-lg text-primary-400 mb-4 border-b border-slate-700 pb-2">Analisis AI</h3>
               <div className="prose prose-invert prose-sm text-slate-300">
                 {result.split('\n').map((line, idx) => <p key={idx} className="mb-2">{line}</p>)}
               </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
          <Sparkles size={48} className="mb-4 text-primary-500" />
          <p className="text-lg font-semibold">Mode Analitik Basic tidak menyertakan Estimasi Dampak Promo.</p>
          <p className="text-center">Silakan beralih ke Mode Analitik Advanced atau Forecast di Pengaturan untuk menggunakan fitur ini.</p>
        </div>
      )}
    </div>
  );
};