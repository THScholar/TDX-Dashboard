import React, { useState, useEffect } from 'react';
import { SaleRecord } from '../../types';
import { getSalesData, addSaleRecord, updateSaleRecord, deleteSaleRecord } from '../../services/storageService';
import { Button } from '../Button';
import { Plus, Edit, Trash2, Download, Search, X, AlertTriangle } from 'lucide-react';

export const SalesManager: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  // Default date to today's date in YYYY-MM-DD format
  const [currentRecord, setCurrentRecord] = useState<Partial<SaleRecord>>({
    date: new Date().toISOString().split('T')[0]
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setSales(getSalesData());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord.date || !currentRecord.revenue) return;

    const record: SaleRecord = {
      id: currentRecord.id || Date.now().toString(),
      date: currentRecord.date,
      revenue: Number(currentRecord.revenue),
      transactions: Number(currentRecord.transactions || 0),
      topProduct: currentRecord.topProduct || '-',
      notes: currentRecord.notes || '',
    };

    if (isEditing) {
      const updated = updateSaleRecord(record);
      setSales(updated);
    } else {
      const updated = addSaleRecord(record);
      setSales(updated);
    }
    resetForm();
  };

  const handleEdit = (record: SaleRecord) => {
    setCurrentRecord(record);
    setIsEditing(true);
    setShowForm(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = () => {
    if (deleteId) {
      const updated = deleteSaleRecord(deleteId);
      setSales(updated);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    // Reset form but keep date as today for convenience
    setCurrentRecord({
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const exportCSV = () => {
    // 1. Definisi Separator (Titik Koma untuk Excel Indo/Eropa)
    const SEPARATOR = ';';

    // 2. Definisi Header (Tanpa escape, fix di baris pertama)
    const headers = ['ID', 'Tanggal', 'Omzet (Rp)', 'Jumlah Transaksi', 'Produk Unggulan', 'Catatan'];
    const headerRow = headers.join(SEPARATOR);

    // 3. Helper untuk escape data (Value)
    // Menangani separator, kutip dua, dan baris baru
    const escapeCsv = (value: string | number | undefined | null) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);

      // Cek apakah mengandung karakter yang merusak format CSV
      if (
        stringValue.includes(SEPARATOR) || 
        stringValue.includes('"') || 
        stringValue.includes('\n') || 
        stringValue.includes('\r')
      ) {
        // Ganti kutip dua (") menjadi double kutip dua ("")
        // Bungkus seluruh string dengan kutip dua
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // 4. Map data ke baris CSV
    const rows = sales.map(s => [
      escapeCsv(s.id),
      escapeCsv(s.date),
      escapeCsv(s.revenue),
      escapeCsv(s.transactions),
      escapeCsv(s.topProduct),
      escapeCsv(s.notes)
    ].join(SEPARATOR));

    // 5. Gabungkan Header dan Rows dengan Newline
    // Tambahkan BOM (\uFEFF) di awal string agar Excel membaca sebagai UTF-8
    const csvContent = '\uFEFF' + [headerRow, ...rows].join('\n');

    // 6. Buat Blob dan Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therrabiz-laporan-penjualan-${new Date().toISOString().split('T')[0]}.csv`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredSales = sales.filter(s => 
    s.topProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.date.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2 bg-red-400/10 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Hapus Data?</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Batal</Button>
              <Button variant="danger" onClick={executeDelete}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Data Penjualan</h2>
          <p className="text-slate-400 text-sm">Kelola pencatatan transaksi harian Anda.</p>
        </div>
        <div className="flex gap-3">
           <Button onClick={exportCSV} variant="secondary" className="text-sm">
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={() => setShowForm(true)} className="text-sm">
            <Plus size={16} /> Tambah Data
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-slate-200">{isEditing ? 'Edit Data' : 'Tambah Data Baru'}</h3>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-200"><X size={20}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Tanggal</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={currentRecord.date || ''}
                onChange={e => setCurrentRecord({...currentRecord, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Omzet (Rp)</label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={currentRecord.revenue || ''}
                onChange={e => setCurrentRecord({...currentRecord, revenue: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Jumlah Transaksi</label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={currentRecord.transactions || ''}
                onChange={e => setCurrentRecord({...currentRecord, transactions: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Produk Terlaris</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={currentRecord.topProduct || ''}
                onChange={e => setCurrentRecord({...currentRecord, topProduct: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Catatan Tambahan</label>
              <textarea 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                rows={2}
                value={currentRecord.notes || ''}
                onChange={e => setCurrentRecord({...currentRecord, notes: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
              <Button type="submit">{isEditing ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan produk atau catatan..." 
            className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 outline-none w-full placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 uppercase text-xs font-semibold text-slate-300">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Omzet</th>
                <th className="px-6 py-4">Transaksi</th>
                <th className="px-6 py-4">Produk Top</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center flex flex-col items-center justify-center text-slate-500">
                    <Search size={32} className="mb-2 opacity-50" />
                    <p>Tidak ada data yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-200">{sale.date}</td>
                    <td className="px-6 py-4 text-primary-400 font-mono">Rp {sale.revenue.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{sale.transactions}</td>
                    <td className="px-6 py-4">{sale.topProduct}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleEdit(sale)} 
                           className="p-2 bg-slate-700 hover:bg-primary-500 hover:text-white rounded-lg transition-all text-slate-300"
                           title="Edit"
                         >
                           <Edit size={16}/>
                         </button>
                         <button 
                           onClick={() => confirmDelete(sale.id)} 
                           className="p-2 bg-slate-700 hover:bg-red-500 hover:text-white rounded-lg transition-all text-slate-300"
                           title="Hapus"
                         >
                           <Trash2 size={16}/>
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};