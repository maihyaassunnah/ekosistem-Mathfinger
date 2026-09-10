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

---

## 2. Hasil Verifikasi Teknis

- **TypeScript Compilation**: Lolos 100% tanpa error (`npx tsc --noEmit` exit code 0).
- **Build & Deploy**: Berhasil dideploy ke VPS `ubuntu@43.173.12.46` via Docker Compose.
