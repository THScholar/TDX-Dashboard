import React, { useEffect, useState, useCallback } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getSalesData, SALES_UPDATE_EVENT } from '../../services/storageService';
import { SaleRecord } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

export const ChartsView: React.FC = () => {
  const { analyticsMode } = useTheme();
  const [data, setData] = useState<SaleRecord[]>([]);
  const [productDistribution, setProductDistribution] = useState<{name: string, value: number}[]>([]);
  const [aovData, setAovData] = useState<any[]>([]);

  // Warna untuk Pie Chart
  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const loadChartData = useCallback(() => {
    const rawData = getSalesData();
    
    // 1. Sort data by date
    const sortedSales = [...rawData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setData(sortedSales);

    // 2. Prepare Product Distribution Data (Pie Chart)
    const productStats: Record<string, number> = {};
    rawData.forEach(item => {
      // Kita hitung frekuensi kemunculan sebagai Top Product
      const product = item.topProduct || 'Lainnya';
      productStats[product] = (productStats[product] || 0) + 1;
    });
    const pieData = Object.keys(productStats).map(key => ({
      name: key,
      value: productStats[key]
    }));
    setProductDistribution(pieData);

    // 3. Prepare AOV (Average Order Value) Data
    const calculatedAov = sortedSales.map(item => ({
      date: item.date,
      aov: item.transactions > 0 ? Math.round(item.revenue / item.transactions) : 0
    }));
    setAovData(calculatedAov);
  }, []);

  useEffect(() => {
    loadChartData();

    // Listen for data updates to refresh charts real-time (Same Tab)
    window.addEventListener(SALES_UPDATE_EVENT, loadChartData);
    
    // Listen for storage updates (Cross Tab - e.g. open in new window)
    window.addEventListener('storage', loadChartData);
    
    return () => {
      window.removeEventListener(SALES_UPDATE_EVENT, loadChartData);
      window.removeEventListener('storage', loadChartData);
    };
  }, [loadChartData]);

  const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
          <p className="text-slate-200 font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} style={{ color: entry.color }} className="text-sm">
               {entry.name}: {prefix}{Number(entry.value).toLocaleString('id-ID')}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Grafik Analisis Bisnis</h2>
        <p className="text-slate-400 text-sm">Visualisasi mendalam performa bisnis Anda secara real-time.</p>
      </div>

      {/* Container Layout: Vertical Stack (List ke bawah) */}
      <div className="flex flex-col gap-8">
        
        {/* 1. Revenue Chart (Line) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Tren Omzet (Revenue)</h3>
              <p className="text-xs text-slate-400">Pergerakan pendapatan harian</p>
            </div>
            <div className="bg-primary-500/10 p-2 rounded-lg">
              <span className="text-primary-400 text-xs font-bold">Line Chart</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip content={<CustomTooltip prefix="Rp " />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Omzet" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
       

        {/* 2. Transactions Chart (Bar) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg w-full">
          <div className="flex items-center justify-between mb-6">
             <div>
              <h3 className="text-lg font-semibold text-slate-200">Volume Transaksi</h3>
              <p className="text-xs text-slate-400">Jumlah nota/customer per hari</p>
            </div>
             <div className="bg-purple-500/10 p-2 rounded-lg">
              <span className="text-purple-400 text-xs font-bold">Bar Chart</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip cursor={{fill: '#334155', opacity: 0.4}} content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="transactions" 
                  name="Jumlah Transaksi" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. AOV Chart (Area) - NEW (Hanya tampil di Mode Analitik Advanced/Forecast) */}
        {analyticsMode !== 'basic' && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Rata-rata Nilai Transaksi (AOV)</h3>
              <p className="text-xs text-slate-400">Rata-rata belanja per customer (Omzet / Transaksi)</p>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <span className="text-emerald-400 text-xs font-bold">Area Chart</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aovData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip content={<CustomTooltip prefix="Rp " />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="aov" 
                  name="Rata-rata Order (Rp)" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorAov)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}

        {/* 4. Product Distribution (Pie) - NEW (Hanya tampil di Mode Analitik Advanced/Forecast) */}
        {analyticsMode !== 'basic' && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Distribusi Produk Terlaris</h3>
              <p className="text-xs text-slate-400">Frekuensi produk menjadi Top Product harian</p>
            </div>
             <div className="bg-orange-500/10 p-2 rounded-lg">
              <span className="text-orange-400 text-xs font-bold">Pie Chart</span>
            </div>
          </div>
          <div className="h-[400px] w-full flex justify-center">
            {productDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full text-slate-500">
                 Belum ada data produk.
               </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};