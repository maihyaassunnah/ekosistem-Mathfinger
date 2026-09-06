"use client";

import React from "react";
import { History, Calendar, User, BookOpen } from "lucide-react";

export default function RiwayatJurnalPage() {
  const logs = [
    { date: "04 Sept 2026", class: "Kelas A (Singkut)", tutor: "Ustadzah Rina", topic: "Latihan Kombinasi Puluhan & Satuan", note: "11 siswa hadir, semua tuntas kuis harian." },
    { date: "03 Sept 2026", class: "CLASS A1 (Bangko)", tutor: "Kak Nanda", topic: "Pengenalan Simbol Jari Tangan Kiri", note: "Ananda Alesha dan Aqila sangat cepat memahami konsep." },
    { date: "02 Sept 2026", class: "Kelas B (Singkut)", tutor: "Ustadz Faisal", topic: "Simulasi Berhitung Cepat 1-Digit", note: "Perlu penguatan pada jari kelingking untuk angka 4." },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Riwayat Jurnal Guru
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Arsip kronologis pengajaran seluruh kelas dan tutor di tiap cabang
        </p>
      </div>

      <div className="space-y-4">
        {logs.map((l, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 text-[11px] font-bold">
                  {l.class}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{l.tutor}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{l.date}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{l.topic}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{l.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
