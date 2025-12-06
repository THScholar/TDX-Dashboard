import React, { useState, useEffect } from 'react';
import { DailyTask } from '../../types';
import { getDailyTasks, saveDailyTasks, getSalesData } from '../../services/storageService';
import { generateSuggestedTasks } from '../../services/geminiService';
import { Button } from '../Button';
import { CheckCircle2, ListTodo, RefreshCw } from 'lucide-react';

export const TaskGenerator: React.FC = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = getDailyTasks();
    const today = new Date().toISOString().split('T')[0];
    // Filter to keep only today's tasks or recent ones
    const relevantTasks = saved.filter(t => t.date === today || !t.isCompleted);
    setTasks(relevantTasks);
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const sales = getSalesData();
      const suggestions = await generateSuggestedTasks(sales);
      
      const newTasks: DailyTask[] = suggestions.map((text, idx) => ({
        id: Date.now().toString() + idx,
        text,
        isCompleted: false,
        date: new Date().toISOString().split('T')[0],
        generatedAt: Date.now()
      }));

      const updated = [...tasks, ...newTasks];
      setTasks(updated);
      saveDailyTasks(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updated);
    saveDailyTasks(updated);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden h-[400px] flex flex-col">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900 shrink-0">
        <div>
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <ListTodo className="text-primary-400" /> Rekomendasi Tugas Harian
          </h3>
          <p className="text-xs text-slate-400">Aksi nyata untuk hari ini</p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleGenerate} isLoading={isLoading} className="!p-2">
          <RefreshCw size={18} />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>Belum ada tugas hari ini.</p>
            <button onClick={handleGenerate} className="text-primary-400 text-sm hover:underline mt-2">
              Generate Tugas dengan AI
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className={`
                p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 group
                ${task.isCompleted 
                  ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                  : 'bg-slate-700/30 border-slate-600 hover:border-primary-500/50'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0
                ${task.isCompleted ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-500 group-hover:border-primary-400'}
              `}>
                {task.isCompleted && <CheckCircle2 size={12} />}
              </div>
              <span className={`text-sm ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};