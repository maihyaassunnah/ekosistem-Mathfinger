"use client";

import React from "react";
import { History, Calendar, User, BookOpen, MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function RiwayatJurnalPage() {
  const { journals } = useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();

  const scopedJournals = allowedBranch
    ? journals.filter((j) => j.branch === allowedBranch)
    : journals;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Riwayat Jurnal Guru
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Arsip kronologis pengajaran seluruh kelas dan tutor di tiap cabang
          </p>
        </div>

        {!isSuperAdmin && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-300 self-start">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cabang {allowedBranch}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {scopedJournals.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] text-slate-400 text-xs font-semibold">
            Belum ada catatan jurnal untuk cabang ini.
          </div>
        ) : (
          scopedJournals.map((l, idx) => (
            <div
              key={l.id || idx}
              className="bg-white dark:bg-[#0f1a36] rounded-3xl p-5 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-[11px] font-bold">
                    {l.className} ({l.branch})
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {l.teacher}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    • Siswa: {l.studentName}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {l.date}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {l.topic}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{l.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
