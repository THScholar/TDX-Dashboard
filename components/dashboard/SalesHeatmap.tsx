import React, { useMemo, useState, useEffect } from 'react';
import { SaleRecord } from '../../types';
import { getSalesData, SALES_UPDATE_EVENT } from '../../services/storageService';
import { Calendar } from 'lucide-react';

export const SalesHeatmap: React.FC = () => {
  const [filter, setFilter] = useState<'year' | 'month'>('month');
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);

  const loadData = () => {
    setSalesData(getSalesData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener(SALES_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(SALES_UPDATE_EVENT, loadData);
  }, []);

  // Use local time for date comparison to avoid UTC shifts
  const toLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  };

  // Generate calendar grid
  const today = new Date();
  const startDate = new Date();
  
  if (filter === 'month') {
    startDate.setDate(today.getDate() - 29); // Last 30 days (including today)
  } else {
    startDate.setFullYear(today.getFullYear() - 1); 
  }

  // Create map of date -> intensity
  const dateMap = useMemo(() => {
    const map = new Map<string, number>();
    const maxRevenue = Math.max(...salesData.map(s => s.revenue), 1);

    salesData.forEach(sale => {
      // Normalize intensity 1-4
      const intensity = Math.ceil((sale.revenue / maxRevenue) * 4);
      map.set(sale.date, intensity);
    });
    return map;
  }, [salesData]);

  // Generate dates array strictly
  const dates = [];
  let current = new Date(startDate);
  
  // Create a loop that safely adds days without skipping due to DST/Timezone
  while (current <= today) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getIntensityClass = (dateStr: string) => {
    const intensity = dateMap.get(dateStr) || 0;
    switch (intensity) {
      case 1: return 'bg-primary-900/50';
      case 2: return 'bg-primary-700/70';
      case 3: return 'bg-primary-500';
      case 4: return 'bg-primary-400';
      default: return 'bg-slate-800/50 hover:bg-slate-700 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-200">Aktivitas Penjualan</h3>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setFilter('month')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'month' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            30 Hari
          </button>
          <button 
            onClick={() => setFilter('year')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'year' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            1 Tahun
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex flex-wrap gap-1.5 justify-start md:justify-center">
        {dates.map((date) => {
          const dateStr = toLocalDateString(date);
          const hasData = dateMap.has(dateStr);
          const title = `${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}: ${hasData ? 'Ada Transaksi' : 'Nihil'}`;

          return (
            <div
              key={dateStr}
              title={title}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-all cursor-pointer border border-transparent hover:border-slate-400 hover:scale-110 ${getIntensityClass(dateStr)}`}
            ></div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400">
        <span>Sepi</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary-900/50 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary-700/70 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary-400 rounded-sm"></div>
        </div>
        <span>Ramai</span>
      </div>
    </div>
  );
};