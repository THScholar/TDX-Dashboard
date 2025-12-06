import React, { useState, useEffect } from 'react';
import { getSalesData } from '../../services/storageService';
import { analyzeSlowMovingItems } from '../../services/geminiService';
import { Button } from '../Button';
import { AlertTriangle, BarChart4, RefreshCw, Box } from 'lucide-react';

export const SlowMovingPrediction: React.FC = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const data = getSalesData();
    setHasData(data.length > 0);
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const data = getSalesData();
    if (data.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      const resultJson = await analyzeSlowMovingItems(data);
      const parsed = JSON.parse(resultJson);
      setPredictions(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart4 className="text-primary-400" /> Prediksi Slow-Moving Items
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          AI menganalisis tren historis untuk mengidentifikasi produk yang lambat laku agar Anda tidak menimbun stok mati.
        </p>
      </div>

      {!hasData ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <Box className="mx-auto text-slate-500 mb-2" size={48} />
          <p className="text-slate-400">Belum ada data penjualan untuk dianalisis.</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                   <AlertTriangle size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-100">Analisis Risiko Stok</h3>
                   <p className="text-xs text-slate-400">Klik tombol untuk memindai database penjualan.</p>
                 </div>
              </div>
              <Button onClick={handleAnalyze} isLoading={isLoading}>
                <RefreshCw size={18} /> Jalankan Analisis AI
              </Button>
            </div>

            {predictions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl
                      ${item.risk === 'Tinggi' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                    `}>
                      Risiko: {item.risk}
                    </div>
                    <h4 className="font-bold text-lg text-slate-200">{item.product}</h4>
                    <p className="text-sm text-slate-400">{item.reason}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <p className="text-xs text-primary-400 font-medium">💡 Saran AI: {item.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                  Hasil analisis akan muncul di sini.
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};