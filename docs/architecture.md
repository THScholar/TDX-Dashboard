# Arsitektur Proyek

Dokumen ini menjelaskan struktur dan komponen utama dari proyek TherraBiz, sebuah dashboard manajemen bisnis cerdas untuk UMKM. Arsitektur proyek dirancang untuk modularitas, skalabilitas, dan pengalaman pengguna yang responsif.

## 1. Gambaran Umum

TherraBiz adalah aplikasi web *single-page application* (SPA) yang dibangun menggunakan React. Aplikasi ini beroperasi sepenuhnya di sisi klien (frontend) dan berinteraksi dengan layanan eksternal (seperti API AI) untuk fungsionalitas tertentu. Manajemen data lokal dilakukan melalui `localStorage`.

## 2. Komponen Utama

### 2.1. Frontend (Sisi Klien)

*   **Kerangka Kerja (Framework)**:
    *   **React**: Digunakan untuk membangun antarmuka pengguna yang interaktif dan reaktif. Komponen-komponen React memungkinkan pengembangan UI yang modular dan dapat digunakan kembali.
    *   **Vite**: Sebagai *build tool* dan *dev server* yang cepat, Vite digunakan untuk mengoptimalkan proses pengembangan dan *bundling* aplikasi.

*   **Manajemen State Global**:
    *   **React Context API (`ThemeContext`)**: Digunakan untuk mengelola state global aplikasi seperti tema (`theme`), mode tata letak (`layout`), dan mode analitik (`analyticsMode`). Ini memastikan bahwa pengaturan ini dapat diakses dan diperbarui dari komponen mana pun dalam aplikasi tanpa *prop drilling*.
    *   **`localStorage`**: Digunakan untuk menyimpan pengaturan pengguna dan data aplikasi secara persisten di sisi klien, seperti profil toko, data penjualan, dan tugas harian.

*   **Styling**:
    *   **Tailwind CSS**: Digunakan sebagai kerangka kerja CSS *utility-first* untuk styling yang cepat dan konsisten. Kelas-kelas utilitas Tailwind diterapkan secara kondisional berdasarkan state tema dan tata letak.
    *   **CSS Variables**: Digunakan dalam `index.html` untuk mendefinisikan warna dasar yang dapat berubah sesuai tema, memastikan konsistensi visual di seluruh aplikasi.

*   **Navigasi**:
    *   **React Router DOM**: Mengelola routing di sisi klien, memungkinkan navigasi antar halaman dashboard tanpa memuat ulang seluruh aplikasi.

*   **Struktur Komponen**:
    *   **`components/dashboard`**: Berisi komponen-komponen spesifik untuk dashboard, seperti `DashboardLayout`, `SalesManager`, `InventoryTurnover`, `WhatIfAnalysis`, `AiChat`, dll.
    *   **`components/ui`**: Berisi komponen UI generik yang dapat digunakan kembali di seluruh aplikasi, seperti `Button`, `Toast`, dll.

### 2.2. Integrasi Layanan Eksternal

*   **Layanan AI (OpenRouter)**: Aplikasi berinteraksi dengan API OpenRouter untuk fitur-fitur berbasis AI seperti simulasi "What-If", rekomendasi tugas, dan analisis lainnya. Interaksi ini dilakukan melalui `services/openRouterService.ts`.

## 3. Alur Data

1.  **Inisialisasi Aplikasi**: Saat aplikasi dimuat, `ThemeContext` membaca pengaturan tema, tata letak, dan mode analitik dari `localStorage`.
2.  **Interaksi Pengguna**: Pengguna berinteraksi dengan komponen UI (misalnya, mengubah tema, memasukkan data penjualan, atau memicu simulasi AI).
3.  **Pembaruan State Lokal**: Perubahan pada pengaturan aplikasi (tema, tata letak, mode analitik) diperbarui di `ThemeContext` dan disimpan ke `localStorage`.
4.  **Pembaruan Data Lokal**: Data bisnis (misalnya, data penjualan, pengeluaran) dikelola dan disimpan di `localStorage` melalui `services/storageService.ts`.
5.  **Interaksi AI**: Untuk fitur AI, data yang relevan (misalnya, data penjualan historis, skenario "What-If") dikirim ke API OpenRouter melalui `services/openRouterService.ts`. Hasil analisis dari OpenRouter kemudian ditampilkan di UI.
6.  **Render UI**: Komponen React merender ulang berdasarkan perubahan state lokal dan data yang diterima dari layanan eksternal, memastikan tampilan yang dinamis dan responsif.

## 4. Prinsip Desain

*   **Modularitas**: Aplikasi dibagi menjadi komponen-komponen kecil dan mandiri untuk memudahkan pengembangan, pemeliharaan, dan pengujian.
*   **Reusabilitas**: Komponen UI generik dan logika bisnis dirancang agar dapat digunakan kembali di berbagai bagian aplikasi.
*   **Responsivitas**: Desain aplikasi dioptimalkan untuk berbagai ukuran layar menggunakan Tailwind CSS, memastikan pengalaman pengguna yang konsisten di perangkat desktop dan seluler.
*   **Keterpisahan Kekhawatiran (Separation of Concerns)**: Logika UI, manajemen state, dan interaksi API dipisahkan ke dalam modul dan layanan yang berbeda untuk menjaga kode tetap bersih dan mudah dikelola.
