# SOFTWARE DEVELOPMENT LIFE CYCLE (SDLC)

**Nama Project:** Web Application Management & Public Landing Page – Les Mathfingers  
**Metodologi:** Agile Scrum (Sprints of 2 Weeks)  
**Total Estimasi Durasi:** 10 Minggu (5 Sprint)  
**Versi Dokumen:** 1.0  
**Status:** Approved for Project Governance  

---

## 1. SDLC Framework Overview

Pengembangan aplikasi web Les Mathfingers mengadopsi kerangka kerja **Agile Scrum**. Pendekatan ini dipilih agar tim dapat melakukan iterasi secara cepat, menguji modul operasional bertahap (seperti absensi QR dan *billing engine*), serta mengakomodasi penyesuaian kebutuhan cabang secara dinamis sebelum rilis produksi penuh.

### 1.1 Tim & Distribusi Peran (Scrum Team)
* **Product Owner (PO):** Owner / Management Agency Les Mathfingers (Memvalidasi backlog, kriteria penerimaan, dan alur bisnis cabang).
* **Scrum Master / Project Manager (PM):** Mengawal jalannya sprint, menghapus hambatan teknis (*blockers*), dan memfasilitasi scrum rituals.
* **UI/UX Designer:** Merancang prototipe antarmuka yang bersih, minimalis, dan fungsional (Design system Shadcn/Tailwind).
* **Full-Stack / Backend Engineer:** Membangun core logic multi-cabang, API, database PostgreSQL, dan integrasi pihak ketiga (Payment & WhatsApp).
* **Frontend Engineer:** Membangun public landing page (SSR Next.js), dashboard admin responsive, dan implementasi client-side QR scanner.
* **Quality Assurance (QA) Engineer:** Pengujian fungsional, performa beban, uji keamanan pembayaran, dan audit skenario absensi.

---

## 2. SDLC Phases & Workflow

```
+---------------------------------------------------------------------------------------+
|                                    PHASE 1: PLANNING & PRD                            |
|                          (Sprint 0 - Inisiasi Arsitektur & Backlog)                   |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                                  PHASE 2: DESIGN (UI/UX)                              |
|                          (Wireframing, Design System, Responsive Prototypes)          |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                             PHASE 3: ITERATIVE SPRINTS (DEVELOPMENT)                  |
|                                                                                       |
|  [ Sprint 1 ] -->  [ Sprint 2 ] -->  [ Sprint 3 ] -->  [ Sprint 4 ] -->  [ Sprint 5 ] |
|  Core & Auth       Multi-Branch      Absensi QR        Billing, Midtrans   Landing Page|
|  Database Schema   & Siswa           & Manual          & WA Engine         & Polish   |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                           PHASE 4: TESTING & QUALITY ASSURANCE                        |
|                     (Integration Testing, Payment Webhook Audit, UAT)                 |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                               PHASE 5: DEPLOYMENT & RELEASE                           |
|                       (Production CI/CD, Database Migration, Live Launch)             |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                              PHASE 6: MAINTENANCE & EVOLUTION                         |
|                        (Monitoring, SLA, Bug Fixing, Database Backup)                 |
+---------------------------------------------------------------------------------------+
```

---

## 3. Sprint Breakdown & Milestones (10-Week Roadmap)

### Sprint 0: Inception, Environment & Architecture Setup (Minggu 0)
* Finalisasi dokumen PRD, SRS, dan System Architecture.
* Setup Git Repository (GitHub/GitLab) dengan Branching Strategy (`main`, `staging`, `feature/*`).
* Setup CI/CD pipeline dasar, linter, formatter (Prettier, ESLint), dan runtime environment (Docker/Node.js).
* Setup database PostgreSQL dan Redis instance di environment development.

---

### Sprint 1: Core System, Authentication & RBAC (Minggu 1 - 2)
* **Tujuan:** Membangun fondasi sistem, autentikasi multi-peran, dan isolasi tenant dasar.
* **Deliverables:**
  * Implementasi skema Prisma/PostgreSQL untuk tabel `users`, `branches`, dan `levels`.
  * Sistem autentikasi berbasis JWT / NextAuth dengan *HttpOnly secure cookies*.
  * Middleware Role-Based Access Control (Super Admin vs Admin Cabang vs Tutor).
  * Shell layout dashboard dengan palette netral dan profesional (Shadcn UI + Tailwind CSS).

---

### Sprint 2: Manajemen Multi-Cabang, Siswa & Kelas (Minggu 3 - 4)
* **Tujuan:** Menyediakan fungsi operasional data induk (*master data*) cabang, siswa, dan tutor.
* **Deliverables:**
  * Modul Super Admin: Buat, edit, aktifkan/nonaktifkan cabang dan akun Admin Cabang.
  * Modul Admin Cabang: Input, edit, filter data siswa aktif dan penetapan tutor kelas reguler.
  * Modul Level: Tracking status level Mathfingers tiap siswa dan riwayat kenaikan tingkat.
  * Generasi otomatis *Unique QR Identifier* untuk tiap siswa yang terdaftar.
  * Fitur cetak/ekspor Kartu Absensi Siswa berformat PDF dengan QR Code.

---

### Sprint 3: Modul Absensi Dual-Mode (QR Scan & Manual) (Minggu 5 - 6)
* **Tujuan:** Implementasi alur presensi kelas yang cepat, akurat, dan fleksibel di lapangan.
* **Deliverables:**
  * Integrasi library `html5-qrcode` pada sisi browser Tutor & Admin (akses kamera langsung).
  * Modul input absensi manual berbasis daftar kelas harian (status: Hadir, Izin, Sakit, Alpha).
  * Backend validator: pencegahan presensi ganda di hari yang sama dan pencatatan *timestamp*.
  * Kolom evaluasi harian (*Tutor Progress Notes*) untuk mencatat performa siswa per sesi.
  * Rekapitulasi absensi per cabang, per kelas, dan per siswa (ekspor ke format Excel/PDF).

---

### Sprint 4: Billing Engine, Payment Gateway, & WhatsApp Engine (Minggu 7 - 8)
* **Tujuan:** Otomatisasi penagihan SPP bulanan, penjualan buku, dan pengingat digital.
* **Deliverables:**
  * Modul Penagihan: Scheduler generasi otomatis *Invoice* SPP bulanan setiap tanggal tertentu.
  * Modul Kasir Manual: Input pembayaran tunai/transfer langsung di cabang oleh Admin Cabang.
  * Integrasi Payment Gateway (Midtrans / Xendit Snap API): QRIS, Virtual Account bank, dan e-Wallet.
  * Webhook Handler: Verifikasi SHA512 signature, update otomatis status invoice menjadi `PAID`.
  * Integrasi WhatsApp Gateway (Fonnte / Wablas):
    * Pengiriman notifikasi tagihan H-3 jatuh tempo beserta tautan pembayaran.
    * Pengiriman notifikasi pengingat keterlambatan (H+1).
    * Pengiriman tanda terima digital otomatis (*Instant Digital Receipt*).

---

### Sprint 5: Public Landing Page, Form Pendaftaran & Final UAT (Minggu 9 - 10)
* **Tujuan:** Peluncuran portal publik siswa baru, audit pengujian menyeluruh, dan rilis produksi.
* **Deliverables:**
  * Landing page publik (Hero section, keunggulan Mathfingers, level kurikulum, daftar cabang).
  * Formulir pendaftaran online terintegrasi langsung ke antrean verifikasi Admin Cabang terdekat.
  * Opsi pembayaran uang pangkal/buku langsung via Payment Gateway atau bayar di tempat.
  * Pengujian menyeluruh (Security audit, UAT bersama Owner dan Admin Cabang).
  * Deployment ke server produksi (Vercel/VPS + Managed DB), konfigurasi domain, SSL, dan backup database otomatis.

---

## 4. Quality Assurance & Testing Strategy

Untuk memastikan aplikasi stabil di lingkungan multi-cabang, strategi QA dibagi menjadi 4 pilar:

| Jenis Pengujian | Target Cakupan | Tools / Metode |
| :--- | :--- | :--- |
| **Unit Testing** | Validasi formula billing, parser token JWT, fungsi generator QR code. | Jest / Vitest |
| **Integration Testing** | Endpoint API, isolasi multi-cabang (tenant leak check), webhook payment. | Supertest / Playwright API |
| **End-to-End (E2E)** | Alur pendaftaran online $ightarrow$ pembayaran $ightarrow$ siswa aktif $ightarrow$ absensi QR. | Playwright / Cypress |
| **User Acceptance Test (UAT)** | Skenario riil di cabang bersama Super Admin, Admin Cabang, dan Tutor. | Google Sheets UAT Script & Form Feedback |

### Kriteria Kelulusan UAT (Acceptance Criteria):
1. **Tenant Isolation:** Admin Cabang A tidak dapat melihat atau memodifikasi data siswa/keuangan Cabang B sama sekali.
2. **Attendance Reliability:** Scanner QR Code mampu mengenali ID siswa dalam waktu $< 1.5$ detik pada pencahayaan ruangan normal.
3. **Payment Sync:** Status tagihan langsung berubah menjadi `PAID` dalam tempo $< 5$ detik setelah webhook Payment Gateway diterima.
4. **WhatsApp Dispatch:** Pesan tagihan dan struk pembayaran terkirim dengan tingkat keberhasilan $\ge 98\%$.

---

## 5. Deployment, CI/CD, & Release Strategy

### 5.1 Branching Strategy (GitFlow)
* `main`: Kode produksi yang sudah stabil dan lolos seluruh tahapan UAT.
* `staging`: Lingkungan pengujian pra-produksi yang mencerminkan data riil.
* `develop`: Integrasi utama fitur-fitur yang sedang dikembangkan.
* `feature/<feature-name>`: Pengerjaan modul spesifik oleh engineer.

### 5.2 CI/CD Pipeline Flow
```
[ Developer Push ke Feature Branch ]
                  |
                  v
[ GitHub Actions / GitLab CI ]
  ├── 1. Run Linter & Formatter Check
  ├── 2. TypeScript Compilation Check
  └── 3. Execute Automated Unit Tests
                  |
        (Lolos Semua Test)
                  v
[ Pull Request Approval & Merge ke Staging ]
                  |
                  v
[ Auto-Deploy ke Staging Environment ]
                  |
             (UAT Sign-off)
                  v
[ Release Tag & Merge ke Main ]
                  |
                  v
[ Auto-Deploy ke Production (Vercel / VPS Docker) ]
```

---

## 6. Post-Launch Maintenance & Support (SLA)

* **Monitoring & Observability:** Setup Sentry untuk pencatatan *application runtime error* dan UptimeRobot / BetterStack untuk pemantauan ketersediaan sistem.
* **Database Backup Policy:**
  * Backup harian otomatis (*automated snapshot*) dengan retensi 30 hari.
  * Backup mingguan *off-site* ke object storage terpisah (Cloudflare R2 / AWS S3).
* **Severity Levels & Tanggap Insiden:**
  * **Critical (Sistem Down / Pembayaran Macet):** Waktu respon $< 1$ jam, perbaikan maksimal 4 jam.
  * **Major (Fitur Absensi / WA Error):** Waktu respon $< 3$ jam, perbaikan maksimal 12 jam.
  * **Minor (Tampilan / Glitch Kosmetik):** Waktu respon $< 24$ jam, masuk ke backlog sprint rilis reguler berikutnya.
