# TherraBiz - Therra Dashboard eXperience

![TherraBiz Logo](/src/images/therra.png) <!-- Placeholder for logo -->

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Screenshots / Demo](#2-screenshots--demo)
3.  [Features](#3-features)
4.  [Quickstart](#4-quickstart)
5.  [Project Structure](#5-project-structure)
6.  [Contribution Guide](#6-contribution-guide)
7.  [License](#7-license)
8.  [Attribution](#8-attribution)
9.  [Docs](#9-docs)
10. [Quality](#10-quality)

## 1. Introduction

TherraBiz (Therra Dashboard eXperience) adalah sebuah dashboard manajemen bisnis cerdas yang dirancang khusus untuk UMKM. Dengan antarmuka yang intuitif dan fitur analitik yang kuat, TherraBiz membantu pemilik usaha memantau kinerja, mengidentifikasi tren, dan membuat keputusan berdasarkan data untuk pertumbuhan bisnis yang berkelanjutan.

Proyek ini dibangun dengan fokus pada pengalaman pengguna yang responsif dan efisien, memanfaatkan teknologi modern untuk memberikan wawasan bisnis yang mendalam.

## 2. Screenshots / Demo

![Dashboard Screenshot](/src/images/dashboard.png) <!-- Placeholder for dashboard screenshot -->
![Settings Screenshot](/src/images/settings.png) <!-- Placeholder for settings screenshot -->

<!-- You can embed a GIF or video here for a live demo -->
<!-- <img src="link-to-your-demo.gif" alt="TherraBiz Live Demo" /> -->

## 3. Features

TherraBiz menawarkan berbagai fitur untuk mendukung operasional dan analisis bisnis UMKM:

*   **Dashboard Interaktif**: Visualisasi data penjualan, pendapatan, dan metrik penting lainnya secara real-time.
*   **Manajemen Produk**: Tambah, edit, dan kelola daftar produk dengan mudah.
*   **Analitik Penjualan**: Laporan penjualan mendalam, tren produk terlaris, dan analisis performa.
*   **Manajemen Pelanggan**: Data pelanggan, riwayat pembelian, dan segmentasi.
*   **Pengaturan Kustomisasi**: Sesuaikan tema, tata letak, dan mode analitik sesuai preferensi pengguna.
*   **Notifikasi UI Kustom**: Pemberitahuan yang elegan dan tidak mengganggu untuk interaksi pengguna.
*   **Mode Analitik Cerdas**: Basic, Advanced (AI-powered insights), dan Forecast untuk proyeksi masa depan.
*   **Data Dummy**: Opsi untuk mengaktifkan/menonaktifkan data contoh untuk pengujian dan demonstrasi.

## 4. Quickstart

Untuk menjalankan proyek TherraBiz secara lokal, ikuti langkah-langkah berikut:

### Prasyarat

Pastikan Anda memiliki perangkat lunak berikut terinstal di sistem Anda:

*   Node.js (v18 atau lebih tinggi)
*   npm atau Yarn

### Instalasi
```
1.  **Clone repositori:**
    ```bash
    git clone https://github.com/THScholar/TDX-Dashboard
    cd TDX-Dashboard
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```
3.  **Konfigurasi Environment:**
    Buat file `.env` di root proyek dan tambahkan variabel lingkungan berikut (wajib):
    ```
    VITE_OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
    ```
    *(Ganti `YOUR_OPENROUTER_API_KEY` dengan kunci API OpenRouter Anda.)*

### Menjalankan Aplikasi

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000` (atau port lain yang dikonfigurasi).

### Build Produksi

```bash
npm run build
# atau
yarn build
```

Output build akan tersedia di direktori `dist/`.

## 5. Project Structure

```
TDX/
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── Settings.tsx
│   │   └── ui/
│   │       └── Toast.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

*   `src/components/ui/Toast.tsx`: Komponen notifikasi UI kustom.
*   `src/components/dashboard/Settings.tsx`: Halaman pengaturan dashboard.
*   `src/contexts/ThemeContext.tsx`: Konteks untuk manajemen tema dan pengaturan aplikasi.
*   `src/index.tsx`: Titik masuk utama aplikasi.

## 6. Contribution Guide

Kami menyambut kontribusi dari komunitas! Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1.  Fork repositori ini.
2.  Buat branch baru (`git checkout -b feature/nama-fitur`).
3.  Lakukan perubahan Anda.
4.  Commit perubahan Anda (`git commit -m 'feat: Tambahkan fitur baru'`).
5.  Push ke branch Anda (`git push origin feature/nama-fitur`).
6.  Buka Pull Request.

Pastikan kode Anda mengikuti standar linting dan pengujian yang ada.

## 7. License

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 8. Attribution

*   **TherraBiz**: Dibuat oleh Team TH Nexus
*   **Ikon**: [Lucide React](https://lucide.dev/)
*   **Animasi**: [Framer Motion](https://www.framer.com/motion/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Bundler**: [Vite](https://vitejs.dev/)

## 9. Docs

Dokumentasi lebih lanjut mengenai arsitektur, alur AI, dan detail fitur dapat ditemukan di sini:

*   [Arsitektur Proyek](docs/architecture.md) <!-- Placeholder -->
*   [Alur AI](docs/ai-flow.md) <!-- Placeholder -->
*   [Detail Fitur](docs/features.md) <!-- Placeholder -->

## 10. Quality

Kami berkomitmen untuk menjaga kualitas kode yang tinggi. Proyek ini mengikuti praktik terbaik dalam pengembangan web, termasuk:

*   **Code Linting**: Menggunakan ESLint untuk menjaga konsistensi gaya kode.
*   **Type Checking**: Menggunakan TypeScript untuk memastikan keamanan tipe.
*   **Pengujian**: <!-- Placeholder: Informasi tentang pengujian (misalnya, Jest, React Testing Library) -->
*   **Performa**: Dioptimalkan untuk kecepatan dan responsivitas.

## Pengembang & Desainer

*   **Developer**: Muhamad Dzarel Alghifari
*   **Design**: Fadly Akbar & Muhammad Fahri
