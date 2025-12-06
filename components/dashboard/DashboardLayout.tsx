import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Bot, Sparkles, Calculator, LogOut, Menu, X, Save, Settings as SettingsIcon, BrainCircuit, Activity, Tag, BarChart4, Wallet } from 'lucide-react';
import { NavItem } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { getStoreProfile } from '../../services/storageService';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ringkasan', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Data Penjualan', path: '/dashboard/sales', icon: Save },
  { label: 'Grafik & Analitik', path: '/dashboard/charts', icon: LineChart },
  { label: 'Analisis Stok (AI)', path: '/dashboard/inventory', icon: Activity },
  { label: 'Prediksi Slow Moving', path: '/dashboard/slow-moving', icon: BarChart4 },
  { label: 'Pengeluaran (AI)', path: '/dashboard/expenses', icon: Wallet },
  { label: 'Estimasi Promo', path: '/dashboard/promo', icon: Tag },
  { label: 'What-If Simulator', path: '/dashboard/simulator', icon: BrainCircuit },
  { label: 'Therra AI Chat', path: '/dashboard/chat', icon: () => <span className="font-bold text-lg">T</span> },
  { label: 'Smart Insight', path: '/dashboard/insight', icon: Sparkles },
  { label: 'Kalkulator', path: '/dashboard/calculator', icon: Calculator },
  { label: 'Pengaturan', path: '/dashboard/settings', icon: SettingsIcon },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, layout, enableDummyData } = useTheme(); // Use theme, layout and enableDummyData from context
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (enableDummyData) {
      setStoreName('Toko Dummy');
    } else {
      const profile = getStoreProfile();
      setStoreName(profile.storeName);
    }
  }, [enableDummyData]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // Apply theme DATA ATTRIBUTE here so it only affects Dashboard
    <div data-theme={theme} className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden transition-colors duration-300 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 w-64 h-full bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dashboard
            <span className="block text-base font-semibold text-slate-400">{storeName}</span>
          </h1>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-2 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar pb-20">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname === item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 text-sm
                  ${isActive 
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-medium' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
                `}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm"
            style={{ color: 'var(--color-logout-text)' }}
          >
            <LogOut size={18} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative bg-slate-900 transition-colors duration-300 ${
        layout === 'modern' ? 'font-sans' :
        layout === 'simple' ? 'font-mono' :
        layout === 'analytic' ? 'font-serif' :
        'font-sans' // Default to font-sans for compact or unknown
      }`}>
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
          <h1 className="font-bold text-lg text-slate-200">
            Dashboard
            <span className="block text-sm font-semibold text-slate-400">{storeName}</span>
          </h1>
          <button onClick={toggleSidebar} className="text-slate-400">
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className={`flex-1 overflow-y-auto scroll-smooth ${layout === 'compact' ? 'p-2 md:p-4' : layout === 'analytic' ? 'p-6 md:p-10' : 'p-4 md:p-8'}`}>
          <div className="max-w-6xl mx-auto w-full pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};