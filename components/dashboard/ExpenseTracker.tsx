import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense, EXPENSE_UPDATE_EVENT } from '../../services/storageService';
import { categorizeExpenseAI } from '../../services/geminiService';
import { ExpenseRecord } from '../../types';
import { Button } from '../Button';
import { Wallet, PieChart as PieIcon, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadExpenses = () => setExpenses(getExpenses());

  useEffect(() => {
    loadExpenses();
    window.addEventListener(EXPENSE_UPDATE_EVENT, loadExpenses);
    return () => window.removeEventListener(EXPENSE_UPDATE_EVENT, loadExpenses);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    setIsProcessing(true);
    try {
      // 1. Get Category from AI
      const category = await categorizeExpenseAI(desc, Number(amount));
      
      // 2. Save
      const newExp: ExpenseRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        description: desc,
        amount: Number(amount),
        category: category
      };
      addExpense(newExp);
      setDesc('');
      setAmount('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare Chart Data
  const catStats: Record<string, number> = {};
  expenses.forEach(e => {
    catStats[e.category] = (catStats[e.category] || 0) + e.amount;
  });
  const chartData = Object.keys(catStats).map(k => ({ name: k, value: catStats[k] }));
  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Wallet className="text-primary-400" /> Pencatatan Pengeluaran
          </h2>
          <p className="text-slate-400 text-sm mt-1">AI akan otomatis mengkategorikan pengeluaran Anda.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Deskripsi Pengeluaran</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 mt-1 focus:ring-1 focus:ring-primary-500 outline-none"
                placeholder="Contoh: Beli token listrik, Beli stok kopi..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Nominal (Rp)</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-slate-200 mt-1 focus:ring-1 focus:ring-primary-500 outline-none"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <Button type="submit" isLoading={isProcessing} className="w-full">
              <Plus size={18} /> Tambah & Analisis AI
            </Button>
          </form>
        </div>

        {/* Recent List */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 bg-slate-900/50 text-sm font-semibold text-slate-300">Riwayat Terakhir</div>
          <div className="divide-y divide-slate-700 max-h-[300px] overflow-y-auto">
            {expenses.slice().reverse().map(exp => (
              <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-700/30">
                <div>
                  <div className="font-medium text-slate-200">{exp.description}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{exp.date} • <span className="text-primary-400">{exp.category}</span></div>
                </div>
                <div className="font-mono text-red-400">-Rp {exp.amount.toLocaleString('id-ID')}</div>
              </div>
            ))}
            {expenses.length === 0 && <div className="p-4 text-center text-slate-500 text-sm">Belum ada data.</div>}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
          <PieIcon className="text-purple-400" /> Proporsi Pengeluaran
        </h3>
        <div className="flex-1 min-h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Grafik akan muncul setelah ada data.
            </div>
          )}
        </div>
        <div className="mt-4 p-4 bg-slate-900/50 rounded-lg text-center">
          <p className="text-xs text-slate-400 mb-1">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-slate-100">
            Rp {expenses.reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};