import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, User, Store } from 'lucide-react';
import { Button } from '../Button';
import { saveStoreProfile } from '../../services/storageService';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !storeName.trim()) {
      setError('Mohon lengkapi nama dan nama toko.');
      return;
    }

    if (password === 'TherraBizDemo') {
      // Save profile info
      saveStoreProfile({ ownerName: name, storeName: storeName });
      
      // We do NOT seed dummy data anymore. Dashboard starts empty.
      
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
           <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome!
          </h1>
          <p className="text-slate-400 text-sm">Masuk ke TherraBiz Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Pemilik</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-primary-500 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                placeholder="Nama Anda..."
                required
              />
            </div>
          </div>

          {/* Input Nama Toko */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Toko / UMKM</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Store size={18} />
              </div>
              <input
                type="text"
                value={storeName}
                onChange={(e) => { setStoreName(e.target.value); setError(''); }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-primary-500 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                placeholder="Contoh: Kopi Kenangan..."
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password Akses</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-primary-500'} rounded-xl py-3 pl-10 pr-10 text-slate-200 outline-none focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600`}
                placeholder="Masukkan password..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full py-3 text-lg justify-center mt-2">
            Masuk Dashboard <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm font-medium block mb-4">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
};