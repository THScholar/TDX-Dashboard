import React, { useState } from 'react';
import { Calculator as CalcIcon, RefreshCw } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [cost, setCost] = useState<number>(0);
  const [margin, setMargin] = useState<number>(30);
  const [overhead, setOverhead] = useState<number>(0);

  const hpp = cost + overhead;
  const profit = hpp * (margin / 100);
  const sellingPrice = hpp + profit;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <CalcIcon className="text-primary-400" /> Kalkulator Harga Jual
        </h2>
        <p className="text-slate-400 mt-2">Hitung harga jual ideal produk Anda berdasarkan modal dan target margin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-slate-200 border-b border-slate-700 pb-2">Input Biaya</h3>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Modal Bahan Baku (HPP Dasar)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                value={cost || ''}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Biaya Operasional / Kemasan</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                value={overhead || ''}
                onChange={(e) => setOverhead(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Target Margin Keuntungan (%)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="200" 
                className="flex-1 accent-primary-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
              <span className="w-16 text-right font-mono text-primary-400 font-bold">{margin}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-primary-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <h3 className="font-semibold text-slate-200 border-b border-slate-700 pb-2 relative z-10">Hasil Perhitungan</h3>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total HPP:</span>
              <span className="text-slate-200">Rp {hpp.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Keuntungan per Unit:</span>
              <span className="text-green-400 font-medium">+ Rp {profit.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="pt-4 border-t border-slate-700 mt-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Harga Jual Ideal</p>
              <p className="text-3xl font-bold text-white">Rp {sellingPrice.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <button 
            onClick={() => {setCost(0); setOverhead(0); setMargin(30);}}
            className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> Reset Kalkulator
          </button>
        </div>
      </div>
    </div>
  );
};