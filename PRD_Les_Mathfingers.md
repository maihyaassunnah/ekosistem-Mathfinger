# PRODUCT REQUIREMENT DOCUMENT (PRD)

**Nama Project:** Web Application Management & Public Landing Page – Les Mathfingers  
**Versi:** 1.1  
**Tipe Aplikasi:** Web-Based Application (SaaS / Multi-Branch Management)  
**Status:** Ready for Development  

---

## 1. Executive Summary & Product Vision

### 1.1 Summary
Aplikasi Manajemen Les Mathfingers adalah platform berbasis web terpadu (*all-in-one web application*) yang dirancang untuk mengelola operasional bimbel berstruktur multi-cabang. Aplikasi ini mencakup *public landing page* untuk akuisisi siswa baru, portal administrasi multi-cabang, pencatatan keuangan (SPP & buku), pelacakan progres akademik tingkat (*level*), serta modul presensi siswa fleksibel (*QR Code Scan* & *Manual Input*).

### 1.2 Core Goals
* **Efisiensi Operasional Multi-Cabang:** Sentralisasi kontrol oleh Pusat (Super Admin) dengan tetap memberikan otonomi operasional yang terstruktur pada tiap Cabang (Admin Cabang & Tutor).
* **Fleksibilitas & Akurasi Presensi:** Mempercepat proses absensi di kelas/lokasi melalui pemindaian QR Code unik per siswa atau pencatatan manual oleh tutor.
* **Otomatisasi Keuangan:** Mengurangi *human error* dan keterlambatan pembayaran SPP lewat integrasi *Payment Gateway* dan pengingat otomatis via WhatsApp/Email.
* **Pengalaman Pengguna Professional:** Antarmuka web yang bersih (*clean*), fungsional, responsif, dan bebas dari ornamen visual berlebihan (*non-gimmicky design*).

---

## 2. User Roles & Permission Matrix

Aplikasi membagi hak akses ke dalam **4 Peran Utama** dengan hierarki dan batasan wewenang sebagai berikut:

| Modul / Fitur | Super Admin (Pusat) | Admin Cabang | Tutor | Visitor / OrtU |
| :--- | :---: | :---: | :---: | :---: |
| **Kelola Multi-Cabang & Sistem** | Full Control | - | - | - |
| **Laporan Keuangan Konsolidasi** | Full Access | - | - | - |
| **Kelola Siswa & Tutor Cabang** | Full Access | Cabang Sendiri | View Class Only | - |
| **Absensi QR Code & Manual** | View / Audit | Full Control | Input / Scan Class | - |
| **Kelola SPP & Penjualan Buku** | Setup Rate Global | Transaction & Manual Audit | - | - |
| **Landing Page & Online Registration** | Manage Content | View Inbound Leads | - | Public Access |

### 2.1 Deskripsi Peran

1. **Super Admin (Owner / Management Pusat)**
   * Membuka, mengedit, dan merestrukturisasi data cabang.
   * Mengelola akun Admin Cabang.
   * Mengakses dashboard eksekutif dan laporan keuangan lintas cabang (*aggregate analytics*).
   * Menentukan standar biaya SPP dasar, harga buku/modul, dan struktur kurikulum *Level Mathfingers*.

2. **Admin Cabang**
   * Mengelola seluruh aktivitas operasional pada cabang terkait.
   * Menyetujui pendaftaran siswa baru, mengalokasikan siswa ke jadwal dan tutor.
   * Memverifikasi pembayaran manual (Tunai/Transfer Bank) dan memantau status transaksi *Payment Gateway*.
   * Mencetak kartu/ID QR Code siswa untuk absensi.

3. **Tutor**
   * Mengakses *Tutor Dashboard* via *laptop* atau *tablet/smartphone*.
   * Melakukan absensi kelas dengan pemindaian QR Code siswa atau centang manual.
   * Menginput evaluasi perkembangan siswa (*Progress Note*) dan merekomendasikan kenaikan *level*.

4. **Public Visitor / Calon Orang Tua Siswa**
   * Mengakses Landing Page profil Les Mathfingers.
   * Mengisi formulir pendaftaran online dan memilih lokasi cabang terdekat.

---

## 3. Detailed Feature Specifications

### 3.1 Public Landing Page & Online Registration
* **Landing Page Architecture:**
  * **Header/Hero Section:** Informasi nilai utama (*value proposition*) metode Mathfingers, visual kegiatan pembelajaran yang rapi, dan tombol pendaftaran utama (*Call-to-Action*).
  * **Metode & Kurikulum:** Penjelasan ringkas mengenai jenjang *Level 1* hingga *Level Utama*, keunggulan berhitung cepat dengan jari, serta struktur pembelajaran.
  * **Direktori Cabang:** Pencarian cabang terdekat dilengkapi alamat, peta lokasi, dan kontak WhatsApp cabang.
  * **Informasi Biaya Transparan:** Rincian komponen biaya SPP bulanan dan paket buku/kit pembelajaran.
* **Formulir Pendaftaran Online:**
  * Field: Nama Lengkap Orang Tua, Nomor WhatsApp, Nama Anak, Usia/Tanggal Lahir, Pilihan Cabang, Pilihan Hari/Jadwal.
  * *Workflow Output:* Pilihan langsung bayar via *Payment Gateway* atau pilih pembayaran tunai saat verifikasi di cabang.

### 3.2 Modul Absensi Siswa (Dual-Mode: QR & Manual)
Modul ini dirancang agar pencatatan presensi berjalan cepat tanpa hambatan teknis di lapangan.

```
+-----------------------------------------------------------------------+
|                       MODUL PRESENSI SISWA                            |
+-----------------------------------+-----------------------------------+
|       OPSI A: SCAN QR CODE        |       OPSI B: INPUT MANUAL        |
+-----------------------------------+-----------------------------------+
| 1. Siswa membawa Kartu ID QR.     | 1. Tutor membuka daftar kelas.    |
| 2. Kamera device Tutor/Admin      | 2. Tutor mencentang status siswa  |
|    memindai QR Code.              |    (Hadir, Izin, Sakit, Alpha).   |
| 3. Sistem memverifikasi ID &      | 3. Tutor menambahkan catatan      |
|    mencatat timestamp otomatis.   |    singkat perkembangan siswa.    |
+-----------------------------------+-----------------------------------+
```

* **Presensi Mode QR Code:**
  * Setiap siswa yang terdaftar aktif memiliki *Unique QR Code Identifier*.
  * Admin Cabang dapat mengunduh dan mencetak *ID Card / Badge* QR Code siswa.
  * Modul kamera web berbasis HTML5/JS terintegrasi di aplikasi (tanpa perlu install aplikasi pihak ketiga).
  * Pemindaian otomatis mencatatkan jam masuk, status "Hadir", dan memotong sisa kuota pertemuan/perhitungan kehadiran bulan berjalan.
* **Presensi Mode Manual:**
  * Tampilan tabel kelas berbasis daftar per sesi.
  * Fitur penggantian status cepat dengan tombol toggle / radio button (*Hadir*, *Izin*, *Sakit*, *Alpha*).
  * Kolom catatan khusus per siswa untuk lembar evaluasi harian (misal: "Sudah lancar penjumlahan 2 digit").

### 3.3 Modul Keuangan & Penagihan (SPP Bulanan & Pembayaran Buku)
* **Skema Penagihan (Invoicing):**
  * **Tagihan SPP Bulanan:** Sistem megenerasi tagihan bulanan otomatis berdasarkan tanggal masuk siswa atau skema tanggal jatuh tempo tetap (misal: setiap tanggal 1–5 awal bulan).
  * **Tagihan Buku/Modul:** Diterbitkan saat pendaftaran awal atau ketika siswa mendapatkan rekomendasi naik *level*.
* **Dual Payment System:**
  * **Manual Processing:** Admin Cabang menerima uang tunai atau bukti transfer bank, kemudian mengubah status *Invoice* menjadi `PAID` secara manual.
  * **Payment Gateway Integration:** Terintegrasi dengan provider **Midtrans** / **Xendit** (pendaftaran gratis, *pay-per-transaction*). Memfasilitasi QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), dan E-Wallet.
* **Pengingat Tagihan Otomatis (Automatic Reminder):**
  * Terintegrasi dengan WhatsApp Gateway API (Fonnte / Wablas).
  * Jadwal pengiriman pesan otomatis:
    * **H-3 Jatuh Tempo:** Pesan pengingat halus rincian tagihan SPP + *Link Payment Gateway*.
    * **H+1 Jatuh Tempo:** Pesan pengingat keterlambatan pembayaran.
    * **Instant Receipt:** Notifikasi WhatsApp berisi tanda terima digital begitu status pembayaran menjadi `PAID`.

### 3.4 Modul Akademik & Kelola Level Mathfingers
* **Tracking Level Siswa:**
  * Pelacakan status level aktif setiap siswa (contoh: *Level Basic 1*, *Level Basic 2*, *Level Intermediate*, dst.).
  * Riwayat historis kenaikan level beserta tanggal penyelesaian modul.
* **Alokasi Jadwal & Tutor:**
  * Manajemen plot kelas reguler per hari, jam, dan ruang kelas di masing-masing cabang.
  * Batas kuota siswa per kelas reguler untuk menjaga efektivitas pengajaran.

---

## 4. UI/UX Design System Guidelines

Untuk memastikan antarmuka aplikasi berkesan **professional, clean, elegan, dan tidak 'lebay'**, pengembangan UI wajib mengikuti panduan berikut:

* **Visual Aesthetics:**
  * Minimalis, mengutamakan *whitespace* yang seimbang, hirarki tipografi yang jelas, serta menghindari animasi/dekorasi yang mengganggu efisiensi kerja.
  * Menggunakan sistem komponen konsisten (Card, Table, Data Grid, Status Badge).
* **Palette Warna Utama:**
  * **Primary Neutral:** Clean Dark Slate (`#1E293B`) untuk teks dan header utama.
  * **Primary Brand Accent:** Deep Muted Navy/Blue (`#0F172A` / `#2563EB`) untuk tombol aksi utama.
  * **Background Neutral:** Soft Grey Off-White (`#F8FAFC` / `#F1F5F9`) untuk latar belakang aplikasi.
  * **Status Accents (Subtle):**
    * *Paid / Hadir:* Muted Green (`#166534` bg `#DCFCE7`)
    * *Unpaid / Alpha:* Soft Red (`#991B1B` bg `#FEE2E2`)
    * *Pending / Izin:* Soft Amber (`#92400E` bg `#FEF3C7`)
* **Typography:** Modern Sans-Serif font family (Inter, Plus Jakarta Sans, atau System Native Stack) dengan proporsi teks standar administrasi.

---

## 5. Technical Architecture & Data Schema

### 5.1 Technology Stack Recommendations
* **Frontend Framework:** Next.js (React) - Memberikan performa SEO maksimal untuk Landing Page dan SSR/CSR yang cepat untuk Dashboard Administrasi.
* **Backend & Database:** Node.js (Express/NestJS) atau Laravel dengan database **PostgreSQL** atau **MySQL**.
* **QR Code Processing:** `html5-qrcode` library untuk pemindaian via browser tanpa dependency aplikasi eksternal.
* **Payment Gateway API:** Midtrans Snap / Xendit Invoice API.
* **WhatsApp Notification Engine:** Fonnte API / Wablas API.

### 5.2 Entity Relationship Diagram (Database Schema Summary)

1. **`branches`**
   * `id` (PK, UUID)
   * `branch_code` (VARCHAR)
   * `branch_name` (VARCHAR)
   * `address` (TEXT)
   * `phone` (VARCHAR)
   * `created_at` (TIMESTAMP)

2. **`users`**
   * `id` (PK, UUID)
   * `branch_id` (FK, Nullable for Super Admin)
   * `full_name` (VARCHAR)
   * `email` (VARCHAR, Unique)
   * `password_hash` (VARCHAR)
   * `role` (ENUM: 'super_admin', 'branch_admin', 'tutor')
   * `status` (ENUM: 'active', 'inactive')

3. **`students`**
   * `id` (PK, UUID)
   * `branch_id` (FK)
   * `student_code` (VARCHAR, Unique)
   * `qr_identifier` (VARCHAR, Unique)
   * `student_name` (VARCHAR)
   * `parent_name` (VARCHAR)
   * `parent_whatsapp` (VARCHAR)
   * `current_level_id` (FK)
   * `status` (ENUM: 'active', 'inactive', 'graduated')

4. **`levels`**
   * `id` (PK, UUID)
   * `level_name` (VARCHAR)
   * `description` (TEXT)
   * `book_price` (DECIMAL)
   * `default_spp_price` (DECIMAL)

5. **`invoices`**
   * `id` (PK, UUID)
   * `invoice_number` (VARCHAR, Unique)
   * `student_id` (FK)
   * `branch_id` (FK)
   * `type` (ENUM: 'spp', 'book', 'registration')
   * `amount` (DECIMAL)
   * `due_date` (DATE)
   * `status` (ENUM: 'unpaid', 'paid', 'expired')
   * `payment_method` (ENUM: 'manual_cash', 'manual_transfer', 'gateway')
   * `paid_at` (TIMESTAMP, Nullable)

6. **`attendances`**
   * `id` (PK, UUID)
   * `student_id` (FK)
   * `branch_id` (FK)
   * `tutor_id` (FK)
   * `attendance_date` (DATE)
   * `attendance_time` (TIME)
   * `method` (ENUM: 'qr_scan', 'manual')
   * `status` (ENUM: 'hadir', 'izin', 'sakit', 'alpha')
   * `notes` (TEXT, Nullable)

---

## 6. Implementation Roadmap & Milestones

* **Phase 1: Core Setup & System Architecture (Minggu 1-2)**
  * Database Schema Migration & Authentication Setup (Multi-role RBAC).
  * Dashboard Layout & Design System Implementation.
* **Phase 2: Master Data & Multi-Branch Management (Minggu 3-4)**
  * CRUD Cabang, User Management (Admin & Tutor), dan Master Student Database.
  * Generasi Unique QR Code per siswa.
* **Phase 3: Absensi Dual-Mode & Akademik (Minggu 5-6)**
  * Pengembangan pemindai QR Code berbasis browser.
  * Antarmuka input absensi manual per kelas & laporan rekap presensi.
* **Phase 4: Billing, Payment Gateway, & WA Engine (Minggu 7-8)**
  * Integrasi Midtrans/Xendit untuk pembayaran otomatis.
  * Modul pembayaran manual untuk Admin Cabang.
  * Integrasi Fonnte/Wablas untuk pengingat tagihan bulanan.
* **Phase 5: Public Landing Page & Online Registration (Minggu 9)**
  * Pembuatan Landing Page terintegrasi form pendaftaran online.
* **Phase 6: QA Testing, UAT, & Deployment (Minggu 10)**
  * Testing integrasi multi-cabang, audit keamanan, dan peluncuran produk.
