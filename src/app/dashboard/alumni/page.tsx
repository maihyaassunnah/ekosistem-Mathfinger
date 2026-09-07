"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Award, Calendar } from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAppStore } from "@/lib/store";

function AlumniContent() {
  const { allowedBranch } = useCurrentUser();
  const { students } = useAppStore();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");
  const isMembaca = paramProgram === "MEMBACA";

  const allAlumni = useMemo(() => {
    const graduated = students
      .filter((s) => s.status === "GRADUATED")
      .filter((s) => (isMembaca ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA"))
      .map((s) => ({
        name: s.name,
        code: s.studentCode,
        branch: s.branch,
        gradDate: "September 2026",
        highestLevel:
          s.levelCurriculum ||
          (isMembaca
            ? "Level 7: Membaca Lancar & Menulis Pemahaman"
            : "Level Utama: Tuntas Master Hitung Jari"),
        parent: s.parentName,
      }));

    if (graduated.length > 0) return graduated;

    if (isMembaca) {
      return [
        {
          name: "Kenzo Alfarizi",
          code: "M-1001",
          branch: "Singkut",
          gradDate: "Agustus 2026",
          highestLevel: "Level 7: Tuntas Membaca Lancar Cerita & Pemahaman",
          parent: "Bpk. Rahmat",
        },
      ];
    }

    return [
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
  }, [students, isMembaca]);

  const alumni = allowedBranch
    ? allAlumni.filter((a) => a.branch === allowedBranch)
    : allAlumni;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isMembaca ? "Alumni & Kelulusan (Les Membaca)" : "Alumni & Kelulusan (Les Matematika)"}
          </h1>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isMembaca
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            }`}
          >
            {isMembaca ? "📖 Les Membaca" : "🔢 Les Matematika"}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Daftar siswa yang telah menuntaskan seluruh tingkatan kurikulum {isMembaca ? "les membaca" : "Mathfingers"}
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4">
        {alumni.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Belum ada data kelulusan alumni {isMembaca ? "les membaca" : "les matematika"} untuk cabang ini.
          </div>
        ) : (
          alumni.map((a, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs ${
                    isMembaca ? "bg-purple-600" : "bg-emerald-600"
                  }`}
                >
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base">{a.name}</div>
                  <div
                    className={`text-xs font-semibold ${
                      isMembaca ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {a.highestLevel}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cabang {a.branch} • Lulus: {a.gradDate} • Wali: {a.parent}
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 border ${
                  isMembaca
                    ? "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/60"
                    : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                }`}
              >
                🎓 Lulus Bersertifikat
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AlumniPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat alumni...</div>}>
      <AlumniContent />
    </Suspense>
  );
}
