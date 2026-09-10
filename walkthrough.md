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

## 2. Hasil Verifikasi Teknis

- **TypeScript Compilation**: Lolos 100% tanpa error (`npx tsc --noEmit` exit code 0).
- **Build & Deploy**: Berhasil di-commit (`718f1e9`), di-push ke GitHub, dan dideploy ke VPS `ubuntu@43.173.12.46` via Docker Compose (`Container mathfingers-app Started`).
- **HTTP Status**: Endpoint `/dashboard/kurikulum` terverifikasi aktif dan terproteksi di balik Cloudflare CDN.
