import React, { useState, useEffect } from 'react';
import { getSalesData, getSalesGoals, saveSalesGoal, SALES_UPDATE_EVENT } from '../../services/storageService';
import { generateGoalAdvice } from '../../services/geminiService';
import { Target, Lightbulb, Edit2 } from 'lucide-react';
import { Button } from '../Button';

export const GoalTracker: React.FC = () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [target, setTarget] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const refreshData = () => {
    // Load Goals
    const goals = getSalesGoals();
    const thisMonthGoal = goals.find(g => g.month === currentMonth);
    if (thisMonthGoal) setTarget(thisMonthGoal.targetAmount);

    // Calculate Revenue
    const sales = getSalesData();
    const revenue = sales
      .filter(s => s.date.startsWith(currentMonth))
      .reduce((acc, curr) => acc + curr.revenue, 0);
    setCurrentRevenue(revenue);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener(SALES_UPDATE_EVENT, refreshData);
    return () => window.removeEventListener(SALES_UPDATE_EVENT, refreshData);
  }, []);

  const handleSaveTarget = () => {
    saveSalesGoal({
      month: currentMonth,
      targetAmount: target
    });
    setIsEditing(false);
    fetchAdvice();
  };

  const fetchAdvice = async () => {
    if (target > 0) {
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const today = new Date().getDate();
      const daysLeft = daysInMonth - today;
      
      const tip = await generateGoalAdvice(currentRevenue, target, daysLeft);
      setAdvice(tip);
    }
  };

  const progress = target > 0 ? Math.min((currentRevenue / target) * 100, 100) : 0;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <Target className="text-red-400" /> Target Bulanan
          </h3>
          <p className="text-xs text-slate-400">Periode: {currentMonth}</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-white">
          <Edit2 size={16} />
        </button>
      </div>

      {isEditing ? (
        <div className="flex gap-2 mb-4">
          <input 
            type="number" 
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            placeholder="Set Target Rp..."
          />
          <Button size="sm" onClick={handleSaveTarget}>Simpan</Button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Tercapai</span>
            <span className="text-slate-200 font-mono">
              {progress.toFixed(1)}% ({currentRevenue.toLocaleString('id-ID')} / {target.toLocaleString('id-ID')})
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-red-500'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* AI Advice Bubble */}
      {target > 0 && !isEditing && (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 flex gap-3 items-start">
          <Lightbulb className="text-yellow-400 shrink-0 mt-1" size={16} />
          <div className="text-xs text-slate-300">
            {advice ? advice : <span className="opacity-50 italic">Menunggu tips AI...</span>}
            {!advice && <button onClick={fetchAdvice} className="text-primary-400 ml-2 hover:underline">Dapatkan Tips</button>}
          </div>
        </div>
      )}
    </div>
  );
};