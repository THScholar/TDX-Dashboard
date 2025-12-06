import { SaleRecord, ChatMessage } from "../types";
import { getStoreProfile, checkMessageLimit, incrementMessageCount } from "./storageService";

// OPENROUTER CONFIGURATION
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
const SITE_NAME = "TherraBiz Dashboard";

// Model configuration - utilizing Google's model via OpenRouter as default
export const MODEL_NAME = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

// Helper function to call OpenRouter API
const callOpenRouter = async (messages: any[], temperature: number = 0.7) => {
  if (!OPENROUTER_API_KEY) {
    console.error("API Key is missing.");
    throw new Error("API Key tidak ditemukan. Pastikan process.env.API_KEY sudah diset.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL_NAME,
        "messages": messages,
        "temperature": temperature
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter API Error:", err);
      return null;
    }

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Call OpenRouter Failed:", error);
    return null;
  }
};

// --- Chat Service ---

export const getGeminiChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  userName: string = "Owner"
): Promise<string> => {
  try {
    if (checkMessageLimit()) {
      return "Maaf, Anda telah melebihi batas pesan harian (50 pesan). Silakan coba lagi besok.";
    }
    incrementMessageCount();
    const profile = getStoreProfile();
    
    // 1. System Prompt
    const systemMessage = {
      role: "system",
      content: `You are Therra AI, the smart business assistant embedded in the "TherraBiz" UMKM Dashboard. 
        You are talking to "${profile.ownerName}", owner of the store "${profile.storeName}".
        Your role is to help them analyze their sales data, suggest marketing strategies, and manage their business within TherraBiz.
        Provide concise, actionable, and relevant business advice. 
        Keep answers under 150 words unless asked for details. 
        Use Indonesian language.`
    };

    // 2. Map history to OpenRouter format (OpenAI compatible)
    // Our local type uses 'model', OpenAI/OpenRouter uses 'assistant'
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text
    }));

    // 3. New Message
    const userMessage = { role: "user", content: newMessage };

    // 4. Combine
    const messages = [systemMessage, ...formattedHistory, userMessage];

    const responseText = await callOpenRouter(messages);
    return responseText || "Maaf, saya tidak dapat memproses permintaan saat ini.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Terjadi kesalahan saat menghubungi Therra AI. Pastikan API Key valid.";
  }
};

// --- Business Insights ---

export const generateBusinessInsights = async (data: SaleRecord[]): Promise<string> => {
  try {
    const dataString = JSON.stringify(data.slice(-20)); // Limit context
    const prompt = `
      Berikut adalah data penjualan UMKM saya dalam format JSON:
      ${dataString}

      Tolong berikan analisis singkat yang mencakup:
      1. Ringkasan performa (Total omzet, rata-rata transaksi).
      2. Analisis tren (naik/turun).
      3. Produk unggulan.
      4. 3 Rekomendasi strategi marketing konkret berdasarkan data ini.
      
      Format jawaban dengan Markdown yang rapi.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response || "Tidak ada insight yang dapat dihasilkan.";
  } catch (error) {
    return "Gagal menganalisis data.";
  }
};

// --- What-If Simulator ---

export const generateWhatIfAnalysis = async (data: SaleRecord[], scenario: string): Promise<string> => {
  try {
    const summary = JSON.stringify(data.slice(-10));
    const prompt = `
      Saya pemilik bisnis UMKM. Ini 10 data transaksi terakhir saya: ${summary}.
      
      Skenario 'What-If': "${scenario}"
      
      Sebagai konsultan bisnis AI, simulasikan dampaknya terhadap omzet, profit, dan kepuasan pelanggan saya.
      Berikan jawaban dalam poin-poin yang logis dan angka perkiraan (prediksi kasar) jika memungkinkan.
      Gunakan Bahasa Indonesia.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response || "Gagal melakukan simulasi.";
  } catch (error) {
    return "Terjadi kesalahan simulasi.";
  }
};

// --- Daily Tasks ---

export const generateSuggestedTasks = async (data: SaleRecord[]): Promise<string[]> => {
  try {
    const summary = JSON.stringify(data.slice(-7)); 
    const prompt = `
      Berdasarkan data penjualan 7 hari terakhir ini: ${summary}.
      Buatkan 5 tugas harian (To-Do List) yang spesifik dan actionable untuk hari ini agar penjualan meningkat.
      Contoh: "Cek stok Kopi Susu", "Buat status WhatsApp promo".
      Hanya berikan list JSON string array murni tanpa markdown code block. Contoh: ["Tugas 1", "Tugas 2"]
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    const cleanText = response?.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText || "[]");
  } catch (error) {
    return ["Cek inventaris barang", "Rekap ulang nota hari ini", "Bersihkan area usaha", "Update status promo di sosmed", "Cek kepuasan pelanggan"];
  }
};

// --- Goal Advice ---

export const generateGoalAdvice = async (current: number, target: number, daysLeft: number): Promise<string> => {
  try {
    const prompt = `
      Target omzet bulan ini: Rp ${target}.
      Pencapaian saat ini: Rp ${current}.
      Sisa hari: ${daysLeft} hari.
      
      Berikan satu paragraf pendek (maksimal 3 kalimat) berisi semangat dan satu tips taktis cepat untuk mengejar sisa target tersebut. Bahasa Indonesia, gaya motivator bisnis santai.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response || "Tetap semangat! Lakukan promosi kilat untuk mengejar target.";
  } catch (error) {
    return "Fokus dan konsisten adalah kunci. Semangat!";
  }
};

// --- NEW FEATURE 2: Slow Moving Prediction ---

export const analyzeSlowMovingItems = async (data: SaleRecord[]): Promise<string> => {
  try {
    // Simplify data to list of products
    const productCounts: Record<string, number> = {};
    data.forEach(d => {
      const p = d.topProduct;
      productCounts[p] = (productCounts[p] || 0) + 1;
    });
    
    const summary = JSON.stringify(productCounts);
    const prompt = `
      Berikut adalah frekuensi penjualan produk saya: ${summary}.
      
      Identifikasi produk yang "Slow Moving" (jarang laku).
      Berikan analisis dalam format JSON Array objek:
      [
        { "product": "Nama Produk", "risk": "Tinggi/Sedang", "reason": "Alasan singkat", "suggestion": "Saran promo" }
      ]
      Hanya return JSON valid tanpa markdown.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    const cleanText = response?.replace(/```json/g, '').replace(/```/g, '').trim();
    return cleanText || "[]";
  } catch (error) {
    console.error("Slow Moving AI Error", error);
    return "[]";
  }
};

// --- NEW FEATURE 3: Expense Categorization ---

export const categorizeExpenseAI = async (description: string, amount: number): Promise<string> => {
  try {
    const prompt = `
      Saya mengeluarkan uang sebesar Rp ${amount} untuk keperluan: "${description}".
      
      Kategorikan pengeluaran ini ke dalam SALAH SATU kategori berikut:
      - Operasional
      - Bahan Baku
      - Marketing
      - Gaji
      - Sewa & Utilitas
      - Lainnya
      
      Hanya jawab dengan satu kata kategori saja.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response?.trim() || "Lainnya";
  } catch (error) {
    return "Lainnya";
  }
};

// --- NEW FEATURE 7: Inventory Turnover ---

export const analyzeInventoryTurnover = async (turnoverRate: number, period: string): Promise<string> => {
  try {
    const prompt = `
      Inventory Turnover Rate (ITR) bisnis saya untuk periode ${period} adalah ${turnoverRate.toFixed(2)} kali.
      
      Apakah ini Cepat, Normal, atau Lambat untuk standar UMKM Ritel umum?
      Berikan 2 kalimat saran singkat untuk memperbaiki atau mempertahankan angka ini.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response || "Analisis tidak tersedia.";
  } catch (error) {
    return "Periksa kembali stok gudang Anda secara berkala.";
  }
};

// --- NEW FEATURE 9: Promo Estimator ---

export const estimatePromoImpact = async (promoType: string, productName: string, depth: string): Promise<string> => {
  try {
    const prompt = `
      Saya ingin membuat promo "${promoType}" untuk produk "${productName}" dengan detail "${depth}".
      
      Sebagai ahli strategi harga, berikan estimasi:
      1. Potensi kenaikan volume penjualan (dalam %).
      2. Risiko penurunan margin profit (Rendah/Sedang/Tinggi).
      3. Satu kalimat rekomendasi apakah promo ini layak dijalankan.
      
      Jawab dalam format poin-poin singkat Bahasa Indonesia.
    `;

    const messages = [{ role: "user", content: prompt }];
    const response = await callOpenRouter(messages);

    return response || "Gagal melakukan estimasi promo.";
  } catch (error) {
    return "Terjadi kesalahan estimasi.";
  }
};