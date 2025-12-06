import React, { useEffect, useState, useCallback } from 'react';
import { getSalesData, getUserName, SALES_UPDATE_EVENT } from '../../services/storageService';
import { SaleRecord } from '../../types';
import { DollarSign, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Package, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesHeatmap } from './SalesHeatmap';
import { TaskGenerator } from './TaskGenerator';
import { GoalTracker } from './GoalTracker';
import { useTheme } from '../../contexts/ThemeContext';

export const DashboardHome: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [userName, setUserName] = useState('Owner');
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { layout, analyticsMode } = useTheme();

  const loadData = useCallback(() => {
    // 1. Load Data
    const data = getSalesData();
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setSales(sortedData);
    setUserName(getUserName());

    // 2. Calculate Growth
    if (data.length >= 2) {
      const mid = Math.floor(data.length / 2);
      const recent = data.slice(mid);
      const previous = data.slice(0, mid);
      
      const recentRev = recent.reduce((acc, curr) => acc + curr.revenue, 0);
      const prevRev = previous.reduce((acc, curr) => acc + curr.revenue, 0);
      
      if (prevRev > 0) {
        setRevenueGrowth(((recentRev - prevRev) / prevRev) * 100);
      }
    }
  }, []);

  useEffect(() => {
    loadData();

    // 3. Realtime Clock Interval
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 4. Listen for real-time updates (Same Tab)
    window.addEventListener(SALES_UPDATE_EVENT, loadData);
    
    // 5. Listen for updates from other tabs
    window.addEventListener('storage', loadData);

    return () => {
      clearInterval(timer);
      window.removeEventListener(SALES_UPDATE_EVENT, loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [loadData]);

  // Format Date: "Senin, 6 Desember 2023"
  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format Time: "14:30:45"
  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTransactions = sales.reduce((acc, curr) => acc + curr.transactions, 0);
  const avgTicketSize = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Top Products Logic
  const productStats: Record<string, number> = {};
  sales.forEach(s => {
    const prodName = s.topProduct || 'Unknown';
    productStats[prodName] = (productStats[prodName] || 0) + 1;
  });
  
  const topProducts = Object.entries(productStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count, percentage: (count / sales.length) * 100 }));

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <div className={`bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group ${layout === 'compact' ? 'py-4' : ''}`}>
      <div className={`absolute -right-6 -top-6 p-8 opacity-5 rounded-full ${color} group-hover:opacity-10 transition-all transform group-hover:scale-110`}>
        <Icon size={80} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-100 mb-1">{value}</h3>
        <p className="text-slate-400 text-sm font-medium tracking-wide mb-1">{title}</p>
        {subtitle && layout !== 'compact' && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Realtime Clock */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-md relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            Halo, <span className="bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent">{userName}</span>! 👋
          </h2>
          <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm md:text-base">
            <Clock size={16} className="text-primary-400" />
            <span className="font-mono font-medium text-slate-200">{formattedTime} WIB</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className="flex gap-3 relative z-10">
          <Link to="/dashboard/sales">
            <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-600 flex items-center gap-2">
              <Calendar size={16} /> Kelola Data
            </button>
          </Link>
          {analyticsMode !== 'basic' && (
            <Link to="/dashboard/insight">
              <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2">
                <TrendingUp size={16} /> Analisis AI
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Stats Row */}
      <div className={`grid gap-6 ${layout === 'compact' ? 'grid-cols-1 md:grid-cols-2 gap-4' : layout === 'analytic' ? 'grid-cols-1 md:grid-cols-4 gap-8' : 'grid-cols-1 md:grid-cols-3'}`}>
        <StatCard 
          title="Total Omzet" 
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} 
          subtitle="Akumulasi pendapatan tercatat"
          icon={DollarSign} 
          color="text-emerald-400" 
          trend={revenueGrowth}
        />
        <StatCard 
          title="Total Transaksi" 
          value={`${totalTransactions} Transaksi`} 
          subtitle="Jumlah aktivitas penjualan"
          icon={ShoppingBag} 
          color="text-blue-400" 
        />
        <StatCard 
          title="Rata-rata Order" 
          value={`Rp ${Math.round(avgTicketSize).toLocaleString('id-ID')}`} 
          subtitle="Nilai per pelanggan"
          icon={TrendingUp} 
          color="text-purple-400" 
        />
      </div>

      {/* NEW: Secondary Feature Row (Goals, Tasks, Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GoalTracker />
          <TaskGenerator />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SalesHeatmap />
          
          {/* Recent Revenue Chart */}
           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-lg text-slate-200">Tren Pendapatan</h3>
                <p className="text-sm text-slate-400">Visualisasi omzet</p>
              </div>
              <Link to="/dashboard/charts" className="text-primary-400 text-sm hover:underline flex items-center gap-1">
                Detail <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-slate-800)', borderColor: 'var(--color-slate-950)', color: 'var(--color-text-main)' }}
                    itemStyle={{ color: 'var(--color-primary-400)' }}
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-primary-500)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-slate-400" size={20} />
            <h3 className="font-semibold text-lg text-slate-200">Riwayat Transaksi Terakhir</h3>
          </div>
          <Link to="/dashboard/sales" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Lihat Semua &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Produk Utama</th>
                <th className="px-6 py-4 text-center">Qty Nota</th>
                <th className="px-6 py-4 text-right">Total Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sales.length > 0 ? (
                // Show last 5 records, reversed
                [...sales].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(-5)
                  .reverse()
                  .map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-medium">{sale.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                        {sale.topProduct}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-center">{sale.transactions}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400 text-right font-mono">
                      Rp {sale.revenue.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data transaksi yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};