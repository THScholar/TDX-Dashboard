import React, { useState } from 'react';
import { getSalesData } from '../../services/storageService';
import { generateBusinessInsights } from '../../services/geminiService';
import { Button } from '../Button';
import { Sparkles, BarChart2 } from 'lucide-react';

export const AiInsights: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const data = getSalesData();
    
    if (data.length === 0) {
      setInsight("Belum ada data penjualan yang cukup untuk dianalisis. Silakan tambahkan data di menu Data Penjualan.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateBusinessInsights(data);
      setInsight(result);
    } catch (error) {
      setInsight("Gagal mengambil insight. Pastikan koneksi internet lancar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-primary-400/20 to-purple-500/20 ring-1 ring-primary-500/30 mb-2">
          <Sparkles className="text-primary-400" size={32} />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
          Smart Business Insights
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Biarkan AI menganalisis data penjualan Anda untuk menemukan tren tersembunyi, peluang pertumbuhan, dan strategi marketing yang efektif.
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={handleGenerate} 
            isLoading={isLoading}
            className="mx-auto px-8 py-4 text-lg bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 border-0"
          >
            {isLoading ? 'Sedang Menganalisis...' : 'Generate Insight Sekarang'}
          </Button>
        </div>
      </div>

      {insight && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 md:p-8 shadow-2xl shadow-primary-900/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <BarChart2 className="text-primary-400" />
              <h3 className="font-semibold text-lg text-slate-200">Laporan Analisis AI</h3>
            </div>
            
            <div className="prose prose-invert prose-slate max-w-none">
              {/* Simple rendering for markdown-like text since we don't have react-markdown installed in this env */}
              {insight.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold text-primary-400 mb-4">{line.replace('# ', '')}</h1>
                if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold text-slate-200 mt-6 mb-3">{line.replace('## ', '')}</h2>
                if (line.startsWith('* ') || line.startsWith('- ')) return <li key={idx} className="ml-4 text-slate-300 list-disc">{line.replace(/^[*|-]\s/, '')}</li>
                if (line.match(/^\d\./)) return <div key={idx} className="font-medium text-slate-300 mt-2">{line}</div>
                if (line.trim() === '') return <br key={idx} />
                return <p key={idx} className="text-slate-400 leading-relaxed">{line}</p>
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};