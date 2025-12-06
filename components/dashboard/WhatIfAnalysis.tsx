import React, { useState } from 'react';
import { getSalesData } from '../../services/storageService';
import { generateOpenRouterWhatIfAnalysis } from '../../services/openRouterService';
import { Button } from '../Button';
import { BrainCircuit, PlayCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const WhatIfAnalysis: React.FC = () => {
  const { analyticsMode } = useTheme();
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;

    setIsLoading(true);
    try {
      const data = getSalesData();
      const result = await generateOpenRouterWhatIfAnalysis(data, scenario);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Gagal melakukan simulasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {analyticsMode !== 'basic' ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <BrainCircuit className="text-primary-400" /> Simulator "What-If"
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Simulasikan skenario bisnis (diskon, kenaikan harga, produk baru) dan biarkan AI memprediksi dampaknya.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <form onSubmit={handleSimulate}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Skenario Apa yang Ingin Anda Uji?
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-primary-500 outline-none"
                  placeholder="Contoh: Jika saya menaikkan harga kopi 10%, bagaimana dampaknya?"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
                <Button type="submit" isLoading={isLoading} className="whitespace-nowrap">
                  <PlayCircle size={18} /> Simulasi
                </Button>
              </div>
            </form>
          </div>

          {analysis && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-primary-500/30 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
              <h3 className="font-semibold text-lg text-primary-400 mb-4 border-b border-slate-700 pb-2">
                Hasil Prediksi AI
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-white">
                {analysis.split('\n').map((line, idx) => (
                   <p key={idx} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
          <Sparkles size={48} className="mb-4 text-primary-500" />
          <p className="text-lg font-semibold">Mode Analitik Basic tidak menyertakan Simulator "What-If".</p>
          <p className="text-center">Silakan beralih ke Mode Analitik Advanced atau Forecast di Pengaturan untuk menggunakan fitur ini.</p>
        </div>
      )}
    </div>
  );
};
