"use client";

import React from "react";
import { GraduationCap, Award, Calendar } from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function AlumniPage() {
  const { allowedBranch } = useCurrentUser();

  const allAlumni = [
    {
      name: "Muhammad Rizky Pratama",
      code: "10023",
      branch: "Singkut",
      gradDate: "Juli 2026",
      highestLevel: "Level Utama: Tuntas Master Hitung Jari",
      parent: "Bpk. Hendra",
    },
    {
      name: "Nabila Putri Maharani",
      code: "10034",
      branch: "Bangko",
      gradDate: "Agustus 2026",
      highestLevel: "Level 4: Mahir Perkalian Cepat",
      parent: "Ibu Rahmawati",
    },
  ];

  const alumni = allowedBranch
    ? allAlumni.filter((a) => a.branch === allowedBranch)
    : allAlumni;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Alumni & Kelulusan Siswa
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Daftar siswa yang telah menuntaskan seluruh tingkatan kurikulum Mathfingers
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4">
        {alumni.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Belum ada data kelulusan alumni untuk cabang ini.
          </div>
        ) : (
          alumni.map((a, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base">{a.name}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{a.highestLevel}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cabang {a.branch} • Lulus: {a.gradDate} • Wali: {a.parent}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 shrink-0">
                🎓 Lulus Bersertifikat
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
