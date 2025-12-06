import React, { useState } from 'react';
import { analyzeOpenRouterInventoryTurnover } from '../../services/openRouterService';
import { Button } from '../Button';
import { Activity, ArrowRightCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sparkles } from 'lucide-react';

export const InventoryTurnover: React.FC = () => {
  const { analyticsMode } = useTheme();
  const [cogs, setCogs] = useState<number>(0);
  const [begStock, setBegStock] = useState<number>(0);
  const [endStock, setEndStock] = useState<number>(0);
  const [result, setResult] = useState<{rate: number, advice: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!cogs || !begStock || !endStock) return;
    setLoading(true);
    
    const avgInv = (begStock + endStock) / 2;
    const rate = cogs / avgInv;
    
    try {
      const advice = await analyzeOpenRouterInventoryTurnover(rate, "Bulan Ini");
      setResult({ rate, advice });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {analyticsMode !== 'basic' ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <Activity className="text-primary-400" /> Analisis Perputaran Stok
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Hitung Inventory Turnover Rate (ITR) untuk mengetahui seberapa cepat barang Anda terjual.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-white mb-1 block">HPP Total (Periode Ini)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200"
                  value={cogs || ''} onChange={e => setCogs(Number(e.target.value))} placeholder="Rp..." />
              </div>
              <div>
                <label className="text-sm text-white mb-1 block">Nilai Stok Awal (Periode Ini)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200"
                  value={begStock || ''} onChange={e => setBegStock(Number(e.target.value))} placeholder="Rp..." />
              </div>
              <div>
                <label className="text-sm text-white mb-1 block">Nilai Stok Akhir (Periode Ini)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200"
                  value={endStock || ''} onChange={e => setEndStock(Number(e.target.value))} placeholder="Rp..." />
              </div>
              <div className="flex items-end">
                <Button onClick={calculate} isLoading={loading} className="w-full">
                  Hitung & Analisis
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-primary-500/30 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-white text-sm uppercase tracking-widest mb-2">Turnover Rate</h3>
              <div className="text-5xl font-bold text-white mb-6">
                {result.rate.toFixed(2)}x
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 inline-block text-left max-w-lg">
                <div className="flex gap-3">
                  <ArrowRightCircle className="text-primary-400 shrink-0 mt-1" />
                  <p className="text-white italic">"{result.advice}"</p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
          <Sparkles size={48} className="mb-4 text-primary-500" />
          <p className="text-lg font-semibold">Mode Analitik Basic tidak menyertakan Analisis Perputaran Stok.</p>
          <p className="text-center">Silakan beralih ke Mode Analitik Advanced atau Forecast di Pengaturan untuk menggunakan fitur ini.</p>
        </div>
      )}
    </div>
  );
};