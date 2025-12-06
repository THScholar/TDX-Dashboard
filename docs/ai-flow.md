# Alur AI

Dokumen ini menjelaskan bagaimana fitur-fitur berbasis AI diimplementasikan dan berinteraksi dalam proyek TherraBiz.

## 1. Therra AI Chat
- **Fungsi**: Asisten cerdas untuk membantu pengguna dengan pertanyaan bisnis, analisis data, dan memberikan rekomendasi.
- **Implementasi**: Menggunakan model bahasa besar (LLM) melalui OpenRouterService untuk memproses input pengguna dan menghasilkan respons. Interaksi chat disimpan dalam state lokal dan ditampilkan secara real-time.
- **Integrasi**: Terhubung dengan data pengguna (nama toko) untuk personalisasi respons.

## 2. Analisis Stok (AI)
- **Fungsi**: Menganalisis data stok untuk mengidentifikasi tren, memprediksi kebutuhan, dan mengoptimalkan manajemen inventaris.
- **Implementasi**: (Detail implementasi AI untuk analisis stok akan ditambahkan di sini, misalnya, model machine learning yang digunakan, sumber data, dll.)

## 3. Prediksi Slow Moving
- **Fungsi**: Mengidentifikasi produk yang berisiko menjadi slow-moving berdasarkan pola penjualan historis dan faktor-faktor lain.
- **Implementasi**: (Detail implementasi AI untuk prediksi slow-moving akan ditambahkan di sini, misalnya, algoritma prediksi, kriteria identifikasi, dll.)

## 4. Pengeluaran (AI)
- **Fungsi**: Membantu melacak dan menganalisis pengeluaran bisnis, mungkin dengan kategorisasi otomatis atau deteksi anomali.
- **Implementasi**: Menggunakan teknik *Natural Language Processing* (NLP) untuk mengkategorikan deskripsi pengeluaran secara otomatis. Deteksi anomali dapat diterapkan untuk mengidentifikasi pengeluaran yang tidak biasa atau berpotensi mencurigakan berdasarkan pola historis.

## 5. Estimasi Promo
- **Fungsi**: Memberikan estimasi dampak promosi yang berbeda terhadap penjualan atau metrik bisnis lainnya.
- **Implementasi**: (Detail implementasi AI untuk estimasi promo akan ditambahkan di sini, misalnya, model prediktif berdasarkan data historis promosi, simulasi, dll.)