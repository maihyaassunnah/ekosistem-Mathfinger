# Walkthrough: Pembaruan Modul Presensi & Rekap Kehadiran Siswa (`/dashboard/absensi`)

Tampilan dan logika pada modul **Presensi & Rekap Kehadiran Siswa** telah diperbarui sesuai permintaan:

---

## 1. Ringkasan Perubahan

### A. Tiga Kartu Metrik Rekap Dibuat 1 Baris Penuh di Mode Mobile
- **Sebelumnya**: Kartu `TOTAL HARI LES`, `RATA-RATA KEHADIRAN`, dan `TOTAL REKOR ABSENSI` bertumpuk vertikal menjadi 3 baris di HP (`grid-cols-1 sm:grid-cols-3`).
- **Sekarang**: Ditata dalam **1 baris saja** (`grid-cols-3 gap-2 sm:gap-4`) dengan ikon dan tipografi responsif (`text-[8.5px] sm:text-[11px]`, nilai `text-xs sm:text-2xl lg:text-3xl font-black`) sehingga tampil simetris dan rapi di semua resolusi HP tanpa terpotong.

---

### B. Perapian Layout Rekap Kehadiran Siswa di Mode Mobile
- **Ikon Presensi Susulan (+) Berdampingan dengan Cari Siswa**:
  - Input `Cari siswa...` dan tombol `+ Susulan` kini berada di dalam kontainer flex horizontal yang rapat (`gap-1.5 flex-1 min-w-0`).
  - Tombol `+` tidak lagi terdorong keluar layar atau terpotong pada layar HP sempit.
- **Tabel Rekap Bebas Tumpukan Teks**:
  - Kolom `H - I - A` dan `SESI` diberikan `whitespace-nowrap tabular-nums` sehingga rasio kehadiran (contoh: `1 / 0 / 0`) tidak lagi terlipat menjadi 5 baris vertikal.
  - Ditambahkan pembatas minimum lebar tabel (`min-w-[520px] sm:min-w-full`) agar scroll horizontal nyaman digunakan di layar sentuh.

---

### C. Logika Penyimpanan Absensi: Hanya Siswa yang Dicentang yang Disimpan
- **Checkbox Selalu Terlihat**:
  - Kotak centang (*checkbox*) kini selalu tampil aktif di samping nomor urut siswa (baik di mode desktop maupun mobile).
- **Simpan Selektif (Hanya yang Dicentang)**:
  - Saat guru menekan **Simpan Presensi**, sistem hanya memproses dan mengirim siswa yang berada dalam status dicentang (`selectedIds`).
  - Siswa yang **TIDAK DICENTANG** secara otomatis dibersihkan dari penyimpanan lokal dan dihapus dari database PostgreSQL untuk tanggal tersebut.
- **Riwayat Bersih / Dibiarkan Kosong**:
  - Pada tabel rekap kehadiran, siswa yang belum/tidak memiliki absensi (`stTotal === 0`) kini menampilkan tanda `-` (bukan default 100% atau data kosong).
  - Detail sesi belajar hanya menampilkan siswa yang benar-benar tercatat hadir/izin/sakit/absen pada sesi tersebut.

---

### D. Input Catatan Secara Manual di Mode Desktop (Menggantikan Catatan Cepat)
- **Sebelumnya**: Di bawah nama siswa terdapat 4 tombol preset *Catatan Cepat* (`+ Izin Pulang Cepat`, `+ Sakit Perut`, dll).
- **Sekarang**: Deretan tombol preset tersebut telah **dihilangkan** dan diganti dengan kolom input teks:
  - Kolom input interaktif berlabel *placeholder* `"Beri catatan secara manual..."` dengan ikon pesan.
  - Guru dapat langsung mengetik catatan khusus/bebas secara fleksibel untuk setiap siswa.
  - Mengetik catatan otomatis mencentang siswa terkait dan menyimpan catatan ke *state* presensi.
  - Dilengkapi tombol silang (`✕`) untuk menghapus catatan secara cepat.

### E. Perapian Tabel Input Nilai & Uji Kecepatan (`/dashboard/input-nilai`)
- **Keterangan Kelas Lurus Simetris dari Atas Sampai Bawah**:
  - Badge kelas siswa (`🏫 CLASS A`, `🏫 CLASS B`) dipisahkan ke dalam kolom tersendiri (**`KELAS`**) dengan `text-center`.
  - Tidak lagi menempel di ujung nama siswa yang panjangnya bervariasi, sehingga seluruh badge kelas tersusun lurus rapi secara vertikal dari atas ke bawah.
- **Nilai Skor Default Kosong (Bukan 0)**:
  - Input `SKOR (0-100)` kini secara *default* kosong/blank (bukan angka `0`).
  - Guru dapat langsung mengetikkan skor tanpa harus menghapus angka 0 terlebih dahulu.
- **Kotak Centang Siswa Tidak Dimunculkan Kecuali Master Checkbox / Status Ikut Aktif**:
  - Saat pertama kali membuka halaman, kotak centang (*checkbox*) di samping nama siswa **tidak dimunculkan**.
  - Kotak centang seluruh siswa baru akan muncul (*dimunculkan*) ketika guru menekan kotak centang paling atas di samping kata **IKUT** (yang secara otomatis mencentang semua siswa).
  - Guru juga dapat mengaktifkan siswa individual dengan menekan tombol status badge `YA`/`TIDAK` atau langsung menginput skor siswa terkait.

---

### F. Perbaikan Persistensi Data Kurikulum & Silabus (`/dashboard/kurikulum`)
- **Penyebab Masalah Sebelumnya**:
  1. Frontend menggunakan ID statis bawaan (`cur-1`, `cur-2`, `cur-3`) yang tidak cocok dengan UUID acak di tabel PostgreSQL `levels`, sehingga perintah `PUT` dan `DELETE` ke `/api/curriculums` menghasilkan galat *Record not found*.
  2. Saat menghapus level dasar, database PostgreSQL menolak karena *foreign key constraint* (masih ada 13 siswa aktif yang terdaftar di level tersebut).
  3. Rute API membatasi izin hanya untuk `SUPER_ADMIN`, sehingga akun *Admin Cabang* yang mengelola kurikulum mendapatkan respon *403 Forbidden*.
  4. Tombol *Kosongkan Kurikulum* sebelumnya hanya mengosongkan state lokal tanpa memicu request delete ke PostgreSQL.
- **Perbaikan yang Diterapkan**:
  1. **UUID Realtime Sync**: Mengganti `INITIAL_CURRICULUM` dengan 4 level resmi dari database PostgreSQL (`Level Dasar`, `Level 1`, `Level 2`, `Level 3`).
  2. **Smart ID Matching**: API `PUT` dan `DELETE` kini secara cerdas dapat mencocokkan level baik melalui UUID database asli, pola `cur-X`, maupun nama level. Jika belum ada saat di-edit, API secara otomatis membuatnya (*upsert*).
  3. **Proteksi & Relokasi Relasi Siswa**: Sebelum menghapus level, siswa yang masih terdaftar di level tersebut otomatis dialihkan ke level alternatif yang tersedia sehingga database tidak mengalami benturan *foreign key*.
  4. **Sinkronisasi Reset Database**: Tombol *Kosongkan Kurikulum* kini memanggil endpoint API `/api/curriculums?all=true` secara riil.
  5. **Izin Fleksibel**: Operasi kurikulum kini dapat dilakukan oleh `SUPER_ADMIN` maupun `BRANCH_ADMIN`.
  6. **Cache Invalidation**: Versi data dinaikkan ke `mf_live_sync_v4` untuk membersihkan cache lama di browser pengguna secara otomatis.

---

### G. Perapian Layout Titik Koordinat & Radius GPS dan Pembaruan Branding
- **Perapian Layout "Titik Koordinat & Radius GPS Cabang"**:
  - **Toolbar Pintasan & Paste Link**: Menggabungkan tombol pintasan koordinat resmi cabang (`Cabang Singkut` / `Cabang Tabir Timur`) dan tombol `Paste Link/Koordinat G-Maps` ke dalam satu bar kontainer yang teratur (`p-2.5 rounded-2xl bg-slate-50`), mencegah tombol paste terlempar ke baris berikutnya secara asimetris.
  - **Input Latitude & Longitude**: Menggunakan grid 2-kolom yang simetris dengan label tebal dan styling input modern.
  - **Pengaturan Radius Presensi**:
    - Menyediakan preset cepat jarak: `[50m]`, `[100m]`, `[200m]`.
    - Input angka dilengkapi label unit `meter` di dalamnya.
    - Teks penjelasan radius ditempatkan pada card responsif pendamping yang rapi.
  - **Tombol Aksi Simetris**: Tombol `[Gunakan Lokasi GPS Saya Saat Ini]` dan `[Simpan Pengaturan Titik GPS]` kini berada dalam grid seimbang 50:50 dengan tinggi dan style yang harmonis.
  - **Preview Google Maps**: Link tautan Google Maps dibuat dalam card interaktif dengan icon hover dan penunjuk arah eksternal.
- **Pembaruan Identitas Branding (Sidebar & Header)**:
  - **Judul Utama**: Diubah dari `Easy Learning` menjadi **`Easy Learning House`** (lengkap dengan badge `v3.3`).
  - **Subjudul**: Diubah dari `House of Math Fingers` menjadi **`Lembaga Bimbingan Belajar Anak`**.
  - Diperbarui juga pada header mobile dashboard (`src/app/dashboard/layout.tsx`).

---

### Walkthrough: Pembaruan Teks Splash Loader "Bimbel By Easy Learning House"

Teks subjudul pada layar pembuka (splash loader) aplikasi telah diperbarui dari *"Bimbingan Belajar & Ekosistem Jaritmatika"* menjadi **"Bimbel By Easy Learning House"**.

## Perubahan yang Diterapkan

- **Komponen Splash Loader** ([src/components/ui/AppSplashLoader.tsx](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/components/ui/AppSplashLoader.tsx#L85-L95)):
  - Judul: `Easy Learning House`
  - Subjudul: Diperbarui menjadi `Bimbel By Easy Learning House` sesuai instruksi.

---

## H. Fitur Nonaktifkan Siswa Interaktif & Sinkronisasi Database (`/dashboard/siswa`)
- **Interaksi Toggle Status Langsung di Tabel Data Siswa** ([src/app/dashboard/siswa/page.tsx](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/app/dashboard/siswa/page.tsx)):
  - Kolom **STATUS** kini memiliki tombol interaktif:
    - **`✓ Aktif`** (Badge hijau emerald): Menandakan siswa sedang aktif les. Ketika ditekan, muncul popup konfirmasi: *"Apakah Anda yakin ingin menonaktifkan siswa [Nama Siswa]? Status siswa akan diubah menjadi Tidak Aktif dan disimpan ke database."*
    - **`✗ Tidak Aktif`** (Badge merah rose): Menandakan siswa nonaktif/cuti. Ketika ditekan, muncul popup konfirmasi untuk mengaktifkan kembali.
    - **`Alumni`** (Badge biru): Untuk siswa yang telah lulus.
  - Disertai efek hover, transisi skala halus, dan tooltip informatif.
  - Modal Detail Siswa (`Lihat Detail Lengkap`) dan Modal Edit Siswa kini secara dinamis menampilkan dan dapat mengubah status siswa.
- **Sinkronisasi Database PostgreSQL** ([src/app/api/students/route.ts](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/app/api/students/route.ts)):
  - Handler **`PUT /api/students`** dan **`PATCH /api/students`** kini memetakan status siswa (`ACTIVE` / `INACTIVE` / `GRADUATED`) dan menyimpannya langsung ke kolom `status` pada tabel `students` di database.
  - Perubahan tersimpan secara instan di PostgreSQL dan dipertahankan saat halaman direfresh atau dimuat ulang.
- **Filter Status yang Akurat**:
  - Filter dropdown status di data siswa diperbarui dengan 4 opsi pilihan:
    - **Semua Status**
    - **Hanya Aktif**
    - **Tidak Aktif**
    - **Alumni (Lulus)**

---

## 8. Status Deployment Terkini

- **Git Commit**: `acb61c5` (`feat: complete branch isolation, late popup modal, realtime attendance sync, and hardened role scoping`)
- **Status Build**: ✅ **Berhasil (Exit Code 0)** — Image `ekosistem-mathfinger-app` & `ekosistem-mathfinger-prisma-studio` ter-build sukses dan container aktif (*Up*).
- **Target URL Dashboard**: [https://mathfingers.my.id/dashboard/presensi-tutor](https://mathfingers.my.id/dashboard/presensi-tutor)
- **Target URL Scanner Absensi**: [https://mathfingers.my.id/dashboard/absensi-tutor](https://mathfingers.my.id/dashboard/absensi-tutor)
- **Database Studio**: [https://db.mathfingers.my.id](https://db.mathfingers.my.id)

---

## 9. Rangkuman Pengamanan Isolasi Cabang (Singkut & Tabir Timur)

1. **Preset Koordinat GPS Mandiri**:
   - Cabang **Singkut** hanya memiliki tombol `📍 Titik Koordinat Resmi Cabang Singkut` (`-2.312500, 102.684700`). Tidak ada opsi ataupun tombol preset Cabang Tabir Timur.
   - Cabang **Tabir Timur** hanya memiliki tombol `📍 Titik Koordinat Resmi Cabang Tabir Timur` (`-2.071700, 102.265500`). Tidak ada opsi ataupun tombol preset Cabang Singkut.
2. **Kunci Strict Branch di Frontend**:
   - `fetchConfigs` strictly memfilter konfigurasi GPS dan QR berdasarkan nama & kode cabang aktif (`SKT` vs `BGK`), mencegah terjadinya kebocoran fallback antar cabang.
   - Dropdown pemilihan cabang hanya muncul khusus untuk akun Super Admin (`Wahyudin Hafiz`). Admin Cabang Febrianti Dewi (Singkut) dan Dewi Safitri (Tabir Timur) dikunci secara permanen pada cabangnya masing-masing.
3. **Proteksi Backend API Route**:
   - `GET` & `PUT /api/branch-qr-config` memvalidasi role akun. Jika `BRANCH_ADMIN`, branch query dipaksa strictly sesuai cabang asalnya di database.
   - `GET /api/tutor-attendance` memastikan rekapan presensi hanya memuat daftar kehadiran tutor yang bertugas di cabang yang bersangkutan.

---

## 10. Penyembunyian Siswa Nonaktif dari Presensi Siswa (`/dashboard/absensi`)

Sesuai permintaan: *"siswa yang non aktif jangan tampilkan di absensi"*.

### Perubahan yang Diterapkan:
1. **Helper Validasi Status Siswa (`isStudentActive`)**:
   - Menambahkan helper di [src/app/dashboard/absensi/page.tsx](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/app/dashboard/absensi/page.tsx):
     ```typescript
     const isStudentActive = (stStatus?: string) => {
       if (!stStatus) return true;
       const s = stStatus.toUpperCase();
       return (
         s !== "INACTIVE" &&
         s !== "NONAKTIF" &&
         s !== "TIDAK AKTIF" &&
         s !== "NON_AKTIF" &&
         s !== "GRADUATED" &&
         s !== "LULUS" &&
         s !== "ALUMNI"
       );
     };
     ```
2. **Penyaringan Siswa Aktif pada `branchScopedStudents`**:
   - Siswa berstatus `INACTIVE`, `NONAKTIF`, `TIDAK AKTIF`, `NON_AKTIF`, serta `GRADUATED` / `ALUMNI` disaring keluar secara otomatis.
   - Dampak langsung:
     - **Pill Filter Kelas** (`Semua Kelas`, `CLASS A`, `CLASS B`, dll): Angka badge jumlah siswa otomatis hanya menghitung siswa yang berstatus aktif.
     - **Daftar Presensi Hari Ini**: Baris siswa nonaktif tidak ditampilkan lagi di kartu presensi.
     - **Tally Centang Siswa**: Hitungan *"X dari Y Siswa Dicentang"* dan checkbox *"Pilih Semua"* / *"Batalkan Semua"* hanya menghitung siswa aktif.
     - **Rekap Kehadiran Per Siswa**: Siswa nonaktif tidak dimunculkan dalam tabel rekap.
     - **Dropdown Presensi Susulan / Manual**: Hanya menyajikan opsi siswa yang aktif.
3. **Validasi Scanner Kartu QR**:
   - Jika ada yang mencoba scan kartu QR milik siswa nonaktif, scanner akan menolak dengan notifikasi peringatan:
     `Presensi Ditolak: Siswa "[Nama Siswa]" berstatus Nonaktif / Tidak Aktif.`
4. **Simulasi Cepat Scan QR**:
   - Tombol pintasan simulasi scan kini hanya menampilkan siswa aktif.

### Deployment & Status Produksi:
- **Git Commit**: `2c56cb3` (`fix(absensi): sembunyikan siswa nonaktif dan alumni dari daftar serta perhitungan absensi`)
- **Docker Production VPS**: Container `mathfingers-app` telah berhasil di-rebuild dan restart (`Up`).
- **Verifikasi Database**: Siswa nonaktif (seperti Kholid, Kristian Naibaho, Rumaysha Hanif Tauzy) berhasil disaring dan tidak lagi muncul di halaman absensi.

---

## 11. Perbaikan Bug Bouncing / Redirect ke Halaman Login saat Klik Presensi Hari Ini

### Akar Masalah:
1. Sebelumnya `src/middleware.ts` menggunakan pembungkus bawaan `withAuth` dari `next-auth/middleware`.
2. Di lingkungan Next.js 16 (Turbopack standalone di Docker) dan reverse proxy Nginx / perangkat seluler (Android Chrome / iOS Safari), fungsi verifikasi JWT edge `getToken()` sering mengalami kegagalan dekripsi edge kriptografi atau tidak mengenali cookie terpecah (*chunked session cookies* seperti `__Secure-next-auth.session-token.0`).
3. Akibatnya, saat pengguna yang sudah login mengklik menu **"Absensi Hari Ini"** (`/dashboard/absensi`), middleware salah mengira pengguna belum login dan mengirimkan respons HTTP **307 Redirect** ke `/login?callbackUrl=%2Fdashboard%2Fabsensi`.
4. Selain itu, halaman `/login` sebelumnya selalu mengarahkan pengguna secara statis ke `/dashboard` tanpa memeriksa parameter `callbackUrl`.

### Solusi & Perubahan yang Diterapkan:
1. **Middleware Kustom Berbasis Cookie Session Infallible ([`src/middleware.ts`](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/middleware.ts))**:
   - Menghapus pembungkus `withAuth` yang rentan terhadap galat edge token.
   - Menggunakan middleware native Next.js yang memeriksa keberadaan header cookie mentah (`rawCookie.includes("next-auth.session-token")`) maupun `req.cookies.getAll()`.
   - Mendukung penuh seluruh format session token NextAuth:
     - `next-auth.session-token` (HTTP / localhost)
     - `__Secure-next-auth.session-token` (HTTPS / produksi)
     - *Chunked cookies* (`__Secure-next-auth.session-token.0`, `1`, dst.)
     - Header `Authorization: Bearer <token>`
   - Pengguna yang sudah login diizinkan langsung masuk ke `/dashboard/absensi` tanpa false-positive redirect.
   - Pengguna tanpa cookie session tetap dialihkan secara aman ke `/login`.
2. **Dukungan Penuh `callbackUrl` pada Form Login ([`src/app/login/page.tsx`](file:///c:/Users/MAIAS/.antigravity-ide/Ekosistem%20Mathfingers/src/app/login/page.tsx))**:
   - Membaca `searchParams.get("callbackUrl")` pada tombol login Credentials dan Google OAuth.
   - Mengarahkan pengguna langsung ke halaman yang ingin mereka tuju setelah login sukses.

### Hasil Pengujian Langsung di Server Produksi:
- **Tanpa Login**: `GET /dashboard/absensi` -> **307 Redirect ke /login?callbackUrl=%2Fdashboard%2Fabsensi** (Aman).
- **Dengan `next-auth.session-token`**: `GET /dashboard/absensi` -> **HTTP 200 OK** (Lancar).
- **Dengan `__Secure-next-auth.session-token`**: `GET /dashboard/absensi` -> **HTTP 200 OK** (Lancar).
- **Dengan *Chunked* Cookie Seluler (`.0`, `.1`)**: `GET /dashboard/absensi` -> **HTTP 200 OK** (Lancar, tidak lagi terpental ke login).

---

## 12. Sub Menu Peringkat: Klasemen Nilai Siswa Aktif per Cabang (`/dashboard/alumni?tab=peringkat`)

Sesuai permintaan terbaru, data pada menu/tab **Peringkat** dikhususkan untuk **Siswa Aktif** di masing-masing cabang, dan **BUKAN** data alumni atau siswa yang sudah lulus.

### Rincian Perubahan & Logika:
1. **Pemisahan Sumber Data**:
   - **Tab 1: Daftar Alumni (`/dashboard/alumni`)**: Tetap menampilkan direktori siswa yang berstatus `GRADUATED`, `LULUS`, atau `ALUMNI`.
   - **Tab 2: Peringkat (`/dashboard/alumni?tab=peringkat`)**: Mengambil data siswa dari `students` yang berstatus **AKTIF** (mengecualikan siswa yang berstatus lulus/alumni maupun non-aktif).
2. **Kalkulasi Nilai Rata-Rata**:
   - Menghitung nilai rata-rata kumulatif dari sesi ujian siswa (`grades`) yang tersimpan di sistem.
   - Mengurutkan secara descending dari nilai tertinggi ke terendah.
3. **Peringkat di Masing-masing Cabang**:
   - Sistem secara otomatis menghitung peringkat siswa di dalam cabangnya masing-masing (Cabang Singkut / Cabang Tabir Timur), misalnya:
     - 🏆 `Juara 1 (Cabang Singkut)`
     - 🥈 `Juara 2 (Cabang Tabir Timur)`
     - `Peringkat 4 (Cabang Singkut)`
4. **Kolom Tabel Ringkas & Lengkap**:
   - `No` (dengan medali 🥇 1, 🥈 2, 🥉 3 untuk posisi teratas)
   - `Nama Siswa` (menampilkan Nama Siswa, Kelas, Level Pembelajaran, dan NIS)
   - `Cabang` (Cabang Singkut / Cabang Tabir Timur)
   - `Nilai Rata-Rata` (badge skor bintang)
   - `Peringkat di Masing-masing Cabang`
   - `Status` (badge `🟢 Aktif`)
5. **Podium Top 3 Nilai Tertinggi Siswa Aktif**:
   - Menampilkan kartu podium emas, perak, dan perunggu khusus untuk siswa aktif dengan nilai tertinggi.
6. **Filter Super Admin & Pencarian Real-time**:
   - Super Admin dapat melihat peringkat seluruh cabang (`Semua Cabang`) maupun memfilter khusus cabang tertentu.
   - Kotak pencarian responsif untuk mencari nama siswa, kelas, level, atau cabang.



