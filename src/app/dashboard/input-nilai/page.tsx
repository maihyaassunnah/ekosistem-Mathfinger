"use client";

import React, { useState, useMemo } from "react";
import {
  Edit3,
  Sparkles,
  FileSpreadsheet,
  Award,
  Search,
  Check,
  Save,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import { useAppStore, GradeItem } from "@/lib/store";

export default function InputNilaiPage() {
  const { students, classes, grades, saveGrades } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<
    "input" | "keaktifan" | "leger"
  >("input");

  // Form Inputs
  const [topic, setTopic] = useState("Penjumlahan Kombinasi 5 (+4, +3)");
  const [examDate, setExamDate] = useState("2026-09-06");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"A-Z" | "Z-A">("A-Z");
  const [selectedLetter, setSelectedLetter] = useState<string>("Semua");

  // Row entries state: studentId -> { isJoined, score, note }
  const [entries, setEntries] = useState<
    Record<string, { isJoined: boolean; score: number; note: string }>
  >(() => {
    const initial: Record<
      string,
      { isJoined: boolean; score: number; note: string }
    > = {};
    students.forEach((s) => {
      initial[s.id] = {
        isJoined: true,
        score: 0,
        note: "Sangat cepat / fokus tinggi",
      };
    });
    return initial;
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Alphabet list matching image
  const alphabetList = [
    "Semua",
    "A",
    "D",
    "E",
    "F",
    "G",
    "H",
    "K",
    "M",
    "N",
    "Q",
    "R",
    "S",
    "Y",
    "Z",
  ];

  // Leger Nilai dynamic matrix states
  const [legerClassFilter, setLegerClassFilter] = useState("ALL");
  const [legerSearchQuery, setLegerSearchQuery] = useState("");

  // Unique evaluations ordered chronologically (side-by-side sequential columns)
  const evaluationColumns = useMemo(() => {
    const map = new Map<string, { key: string; topic: string; examDate: string }>();
    grades.forEach((g) => {
      const key = `${g.examDate}___${g.topic}`;
      if (!map.has(key)) {
        map.set(key, { key, topic: g.topic, examDate: g.examDate });
      }
    });
    // Chronological order (earliest to latest) so new inputs line up sequentially
    return Array.from(map.values()).sort((a, b) => a.examDate.localeCompare(b.examDate));
  }, [grades]);

  // Fast score lookup: studentId___examDate___topic -> score
  const gradeLookup = useMemo(() => {
    const map = new Map<string, number>();
    grades.forEach((g) => {
      const key = `${g.studentId}___${g.examDate}___${g.topic}`;
      map.set(key, g.score);
    });
    return map;
  }, [grades]);

  // Filtered students for Leger Matrix
  const filteredLegerStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(legerSearchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(legerSearchQuery.toLowerCase());
        const matchesClass =
          legerClassFilter === "ALL" || s.className === legerClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, legerClassFilter, legerSearchQuery]);

  const handleDownloadLegerCSV = () => {
    if (evaluationColumns.length === 0) {
      alert("Belum ada data nilai uji kompetensi untuk diunduh.");
      return;
    }
    const headers = [
      "No",
      "ID Siswa",
      "Nama Siswa",
      "Kelas",
      ...evaluationColumns.map(
        (col, idx) => `Uji ${idx + 1}: ${col.topic} (${col.examDate})`
      ),
      "Rata-rata",
    ];

    const rows = filteredLegerStudents.map((s, idx) => {
      let studentTotal = 0;
      let studentCount = 0;
      const scores = evaluationColumns.map((col) => {
        const score = gradeLookup.get(`${s.id}___${col.examDate}___${col.topic}`);
        if (score !== undefined) {
          studentTotal += score;
          studentCount++;
          return score;
        }
        return "-";
      });
      const avg =
        studentCount > 0 ? (studentTotal / studentCount).toFixed(1) : "-";
      return [
        idx + 1,
        `"${s.studentCode}"`,
        `"${s.name}"`,
        `"${s.className}"`,
        ...scores,
        avg,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Leger_Nilai_MathFingers_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass =
          selectedClass === "ALL" || s.className === selectedClass;
        const matchesLetter =
          selectedLetter === "Semua" ||
          s.name.toUpperCase().startsWith(selectedLetter);
        return matchesSearch && matchesClass && matchesLetter;
      })
      .sort((a, b) => {
        if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      });
  }, [students, searchQuery, selectedClass, selectedLetter, sortOrder]);

  const handleToggleJoined = (studentId: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        isJoined: !prev[studentId]?.isJoined,
      },
    }));
  };

  const handleScoreChange = (studentId: string, val: number) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: Math.max(0, Math.min(100, isNaN(val) ? 0 : val)),
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleToggleSelectAll = () => {
    const allCurrentlyChecked = filteredStudents.every(
      (s) => entries[s.id]?.isJoined
    );
    setEntries((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        next[s.id] = {
          ...next[s.id],
          isJoined: !allCurrentlyChecked,
        };
      });
      return next;
    });
  };

  const handleSave = () => {
    const itemsToSave: GradeItem[] = filteredStudents
      .filter((s) => entries[s.id]?.isJoined)
      .map((s) => ({
        id: `grade-${s.id}-${examDate}-${topic.replace(/\s+/g, "-")}`,
        studentId: s.id,
        studentName: s.name,
        className: s.className,
        topic,
        examDate,
        score: entries[s.id]?.score || 0,
        note: entries[s.id]?.note || "",
        isJoined: true,
      }));

    saveGrades(itemsToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Status Bar with Supabase Live */}
      <TopStatusBar title="Input Nilai" />

      {/* Main Title Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Input Nilai & Uji Kecepatan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Rekam akurasi jawaban dan kecepatan berhitung (detik) siswa secara langsung di bawah ini.
        </p>
      </div>

      {/* 3 Sub-tabs (Matching Screenshot 1) */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab("input")}
          className={`flex items-center gap-2 pb-3.5 transition-all relative ${
            activeSubTab === "input"
              ? "text-[#059669] dark:text-[#10b981]"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Input & Riwayat Nilai
          {activeSubTab === "input" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] dark:bg-[#10b981] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("keaktifan")}
          className={`flex items-center gap-2 pb-3.5 transition-all relative ${
            activeSubTab === "keaktifan"
              ? "text-[#059669] dark:text-[#10b981]"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Penilaian & Keaktifan Siswa
          {activeSubTab === "keaktifan" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] dark:bg-[#10b981] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("leger")}
          className={`flex items-center gap-2 pb-3.5 transition-all relative ${
            activeSubTab === "leger"
              ? "text-[#059669] dark:text-[#10b981]"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Leger Nilai (Matriks)
          {activeSubTab === "leger" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] dark:bg-[#10b981] rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === "input" && (
        <div className="space-y-6">
          {/* Main Card: Panel Input Nilai Kelas (Langsung) */}
          <div className="bg-white dark:bg-[#0e1c16] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Panel Input Nilai Kelas (Langsung)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Isi materi/bab, tanggal, dan nilai siswa aktif di bawah, lalu klik Simpan Nilai.
                  </p>
                </div>
              </div>

              {saveSuccess && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Nilai Masuk ke Leger Berurutan!</span>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab("leger")}
                    className="underline hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer ml-1"
                  >
                    Lihat Leger →
                  </button>
                </div>
              )}
            </div>

            {/* Form Input Fields */}
            <div className="p-5 bg-slate-50/50 dark:bg-[#09130f] border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Materi / Bab Uji Kompetensi *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Misal: Penjumlahan Kombinasi 5 (+4, +3)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1812] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Tanggal Ujian *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b1812] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>
            </div>

            {/* Saring Berdasarkan Nama / Kelas / Abjad */}
            <div className="p-5 space-y-4 border-b border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Saring Berdasarkan Nama / Kelas / Abjad
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>

                {/* Class Select */}
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                >
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.branch})
                    </option>
                  ))}
                </select>

                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "A-Z" | "Z-A")}
                  className="w-full sm:w-36 px-3 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                >
                  <option value="A-Z">Nama: A - Z</option>
                  <option value="Z-A">Nama: Z - A</option>
                </select>
              </div>

              {/* Inisial Abjad Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mr-1">
                  Inisial Abjad:
                </span>
                {alphabetList.map((letter) => {
                  const isActive = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setSelectedLetter(letter)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#059669] text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Table (Matching Screenshot 1) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          filteredStudents.every(
                            (s) => entries[s.id]?.isJoined
                          )
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">IKUT</th>
                    <th className="py-3 px-4">NAMA SISWA</th>
                    <th className="py-3 px-4 w-32">SKOR (0-100)</th>
                    <th className="py-3 px-4 min-w-[280px]">CATATAN TAMBAHAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-400 dark:text-slate-500"
                      >
                        Tidak ada siswa yang sesuai filter
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isJoined = entries[s.id]?.isJoined ?? true;
                      const score = entries[s.id]?.score ?? 0;
                      const note = entries[s.id]?.note ?? "";

                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                            !isJoined ? "opacity-50" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isJoined}
                              onChange={() => handleToggleJoined(s.id)}
                              className="rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isJoined
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {isJoined ? "YA" : "TIDAK"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {s.name}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                                {s.className}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={!isJoined}
                              value={score}
                              onChange={(e) =>
                                handleScoreChange(s.id, parseInt(e.target.value))
                              }
                              className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1812] text-xs font-bold text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#059669] disabled:bg-slate-100 dark:disabled:bg-slate-900"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              disabled={!isJoined}
                              value={note}
                              onChange={(e) =>
                                handleNoteChange(s.id, e.target.value)
                              }
                              placeholder="Catatan performa / ketangkasan siswa..."
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1812] text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669] disabled:bg-slate-100 dark:disabled:bg-slate-900"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Save Action Bar */}
            <div className="p-4 bg-slate-50/60 dark:bg-[#09130f] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Menampilkan{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {filteredStudents.length}
                </span>{" "}
                siswa aktif terdaftar
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEntries((prev) => {
                      const reset: typeof prev = {};
                      students.forEach((s) => {
                        reset[s.id] = {
                          isJoined: true,
                          score: 0,
                          note: "Sangat cepat / fokus tinggi",
                        };
                      });
                      return reset;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1812] hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Nilai Uji Kompetensi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "keaktifan" && (
        <div className="bg-white dark:bg-[#0e1c16] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Observasi Ketangkasan & Keaktifan Siswa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pantau kecepatan buka-tutup jari, fokus kuis 1 menit, dan respon motorik Jaritmatika.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b1812] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {s.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {s.className}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Akurasi Gerakan:</span>
                    <span className="font-bold text-emerald-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kecepatan Hitung:</span>
                    <span className="font-bold text-emerald-600">1.8s / soal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tingkat Fokus:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Sangat Tinggi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "leger" && (
        <div className="bg-white dark:bg-[#0e1c16] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Leger Nilai & Matriks Uji Kompetensi
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  {evaluationColumns.length} Sesi Uji Kompetensi Berurutan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Setiap nilai yang di-input otomatis masuk dan berjejer ke samping secara berurutan beserta rata-rata siswa.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Class Filter */}
              <select
                value={legerClassFilter}
                onChange={(e) => setLegerClassFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1812] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#059669]"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={legerSearchQuery}
                  onChange={(e) => setLegerSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1812] text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#059669] w-36 sm:w-48"
                />
              </div>

              {/* Download CSV */}
              <button
                type="button"
                onClick={handleDownloadLegerCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh CSV Matriks
              </button>
            </div>
          </div>

          {/* Matriks Table */}
          {evaluationColumns.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Belum Ada Nilai Uji Kompetensi
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silakan masukkan nilai di tab "Input Nilai Siswa", lalu klik "Simpan Nilai Uji Kompetensi" agar kolom evaluasi muncul di sini secara berurutan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-3 px-3 font-extrabold w-12 text-center sticky left-0 bg-slate-50 dark:bg-[#09130f] z-10">
                      No
                    </th>
                    <th className="py-3 px-4 font-extrabold sticky left-12 bg-slate-50 dark:bg-[#09130f] z-10 min-w-[180px]">
                      Nama Siswa
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center min-w-[100px]">
                      Kelas
                    </th>
                    {evaluationColumns.map((col, idx) => (
                      <th
                        key={col.key}
                        className="py-3 px-4 text-center border-l border-slate-200/60 dark:border-slate-800 min-w-[150px]"
                      >
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                            Uji {idx + 1}
                          </span>
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[160px]" title={col.topic}>
                            {col.topic}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            📅 {col.examDate}
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-center font-black text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 min-w-[100px]">
                      Rata-rata
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLegerStudents.map((s, idx) => {
                    let totalScore = 0;
                    let evaluatedCount = 0;

                    const rowScores = evaluationColumns.map((col) => {
                      const score = gradeLookup.get(`${s.id}___${col.examDate}___${col.topic}`);
                      if (score !== undefined) {
                        totalScore += score;
                        evaluatedCount++;
                        return score;
                      }
                      return undefined;
                    });

                    const average =
                      evaluatedCount > 0
                        ? (totalScore / evaluatedCount).toFixed(1)
                        : "-";

                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-[#0b1812] transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono sticky left-0 bg-white dark:bg-[#0e1c16] z-10">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100 sticky left-12 bg-white dark:bg-[#0e1c16] z-10">
                          <div className="flex items-center gap-2">
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {s.className}
                          </span>
                        </td>
                        {rowScores.map((score, cIdx) => (
                          <td
                            key={cIdx}
                            className="py-2.5 px-4 text-center border-l border-slate-100 dark:border-slate-800/60"
                          >
                            {score !== undefined ? (
                              <span
                                className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${
                                  score >= 85
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                    : score >= 70
                                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {score}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-mono">
                                -
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="py-2.5 px-4 text-center font-black text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10">
                          {average !== "-" ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                              {average}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
