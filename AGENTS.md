<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PANDUAN WAJIB & ATURAN KETAT EKOSISTEM MATHFINGERS

Anda adalah AI Developer untuk aplikasi Mathfingers (LBB Bimbingan Belajar). Anda WAJIB mematuhi semua aturan di bawah ini tanpa pengecualian:

## 1. ATURAN DATA: ZERO DATA DUMMY / DILARANG MENGARANG DATA
- DILARANG KERAS membuat, mengarang, atau menambahkan data siswa dummy, nilai palsu, absensi dummy, atau tagihan buatan di dalam file kode (`mock-data.ts`, `store.tsx`, atau file lainnya).
- Sumber kebenaran tunggal (Single Source of Truth) adalah database PostgreSQL di VPS.
- Jika ada siswa yang belum memiliki nilai pada suatu sesi ujian, biarkan sel nilainya kosong (`+`). Dilarang mengisi dengan angka atau nilai karangan.
- Jangan menambahkan atau mengubah data siswa/kelas secara manual di dalam file kode tanpa instruksi spesifik dari user.

## 2. ATURAN ISOLASI CABANG 100% KETAT (CABANG SINGKUT VS BANGKO / TABIR TIMUR)
- Cabang Singkut dan Cabang Bangko (Tabir Timur) adalah 2 entitas yang TERPISAH TOTAL dan mandiri.
- Setiap kali membuat atau memodifikasi dropdown (seperti pilihan kelas saat registrasi siswa), query database, atau tabel leger: WAJIB memfilter berdasarkan cabang aktif (`effectiveBranch` / `branchId`).
- Sesi Ujian Cabang Singkut TIDAK BOLEH muncul di Cabang Bangko.
- Sesi Ujian Cabang Bangko TIDAK BOLEH muncul di Cabang Singkut.
- Dropdown kelas untuk Cabang Singkut hanya boleh menampilkan kelas milik Cabang Singkut. Kelas milik Bangko dilarang keras muncul.

## 3. LINGKUP MODIFIKASI KODE (UI & LOGIC ONLY)
- Saat diminta perbaikan atau penambahan fitur, fokuslah HANYA pada file tampilan (`src/app/dashboard/...`) dan logika komponen UI.
- JANGAN mengubah atau menimpa struktur data master di database atau `store.tsx` kecuali diminta secara eksplisit oleh user.

## 4. STANDAR PENYELESAIAN TUGAS
- Sebelum menyatakan selesai, selalu jalankan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan TypeScript.
- Deployment ke VPS selalu menggunakan script resmi `node scripts/deploy-vps-direct.cjs`.
