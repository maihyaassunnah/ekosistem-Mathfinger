"use client";

import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  FileSpreadsheet,
  Download,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Receipt,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import { useAppStore, CashMutationItem } from "@/lib/store";

export default function RiwayatSppPage() {
  const { students, invoices, cashMutations } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<"buku_besar" | "leger">(
    "buku_besar"
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState("ALL");

  // Filtered mutations
  const filteredMutations = useMemo(() => {
    return cashMutations.filter((m) => {
      const matchSearch =
        m.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.period.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStudent =
        selectedStudent === "ALL" || m.studentName === selectedStudent;

      const matchMethod =
        selectedMethod === "ALL" || m.method === selectedMethod;

      return matchSearch && matchStudent && matchMethod;
    });
  }, [cashMutations, searchQuery, selectedStudent, selectedMethod]);

  // Export JSON
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredMutations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `jurnal_mutasi_mathfingers_${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Status Bar */}
      <TopStatusBar title="Riwayat Pembayaran" />

      {/* Main Title Banner & Export Button (Matching Screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-blue-600 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Buku Besar & Riwayat Pembayaran
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Laporan mutasi kas masuk, rekapitulasi realisasi iuran pendaftaran, SPP, buku, dan sisa piutang outstanding.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Ekspor Jurnal Mutasi (JSON)
        </button>
      </div>

      {/* 4 Financial Cards (Matching Screenshot 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL TAGIHAN */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL TAGIHAN
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Rp 10.430.000
            </div>
            <div className="text-[11px] text-slate-400">Akumulasi iuran terbit</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: KAS MASUK (REALISASI) */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              KAS MASUK (REALISASI)
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              Rp 7.605.000
            </div>
            <div className="text-[11px] text-slate-400">Lunas + Hasil Cicilan</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: OUTSTANDING (PIUTANG) */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              OUTSTANDING (PIUTANG)
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Rp 2.825.000
            </div>
            <div className="text-[11px] text-slate-400">Tagihan belum terbayar</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: TINGKAT KOLEKTIBILITAS */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TINGKAT KOLEKTIBILITAS
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              72.9%
            </div>
            <div className="text-[11px] text-slate-400">Persentase keberhasilan bayar</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subtabs: Riwayat Transaksi & Buku Besar vs Leger Pembayaran Siswa */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-[#1d2d5a] text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab("buku_besar")}
          className={`pb-3.5 transition-all relative ${
            activeSubTab === "buku_besar"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          Riwayat Transaksi & Buku Besar
          {activeSubTab === "buku_besar" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("leger")}
          className={`flex items-center gap-1.5 pb-3.5 transition-all relative ${
            activeSubTab === "leger"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          Leger Pembayaran Siswa
          {activeSubTab === "leger" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === "buku_besar" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white dark:bg-[#0f1a36] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No Invoice, nama siswa, catatan..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Siswa</option>
                {students.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Metode Pembayaran</option>
                <option value="CICILAN">Cicilan</option>
                <option value="TUNAI">Tunai</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
          </div>

          {/* Table (Matching Screenshot 5) */}
          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200/80 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">TANGGAL TERIMA</th>
                    <th className="py-3 px-4">NO INVOICE</th>
                    <th className="py-3 px-4">SISWA</th>
                    <th className="py-3 px-4">KETERANGAN / PERIODE</th>
                    <th className="py-3 px-4">METODE & JENIS</th>
                    <th className="py-3 px-4">KETERANGAN</th>
                    <th className="py-3 px-4 text-right">NOMINAL MASUK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMutations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada catatan mutasi transaksi yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredMutations.map((mut) => (
                      <tr
                        key={mut.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {mut.date}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {mut.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {mut.studentName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          {mut.period}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {mut.method}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 italic">
                          {mut.description}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                          + Rp {mut.amount.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "leger" && (
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/logo.png"
                  alt="Easy Learning House"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Easy Learning House - Matriks Leger Pembayaran SPP
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status pelunasan iuran bulanan seluruh siswa aktif bimbingan Math Fingers.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Cetak Rekap
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] font-bold text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3 text-center">Juli 2026</th>
                  <th className="py-3 px-3 text-center">Agustus 2026</th>
                  <th className="py-3 px-3 text-center">September 2026</th>
                  <th className="py-3 px-3 text-center">Oktober 2026</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.slice(0, 10).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{s.className}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 text-[10px] font-bold">
                        LUNAS
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 text-[10px] font-bold">
                        LUNAS
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {idx % 2 === 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 text-[10px] font-bold">
                          LUNAS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          BELUM BAYAR
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 text-[10px]">
                      Belum Terbit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
