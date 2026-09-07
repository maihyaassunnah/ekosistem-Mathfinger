"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Send,
  Trash2,
  Calendar,
  User,
  Check,
  X,
  BookText,
} from "lucide-react";
import { useAppStore, JournalItem } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";

function JurnalGuruContent() {
  const { journals, addJournal, deleteJournal, classes, students } = useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");
  const isMembaca = paramProgram === "MEMBACA";

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [studentFilter, setStudentFilter] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const scopedStudents = (allowedBranch ? students.filter((s) => s.branch === allowedBranch) : students).filter((s) =>
    isMembaca ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA"
  );
  const scopedClasses = (allowedBranch ? classes.filter((c) => c.branch === allowedBranch) : classes).filter((c) =>
    isMembaca ? (c as any).programType === "MEMBACA" : (c as any).programType !== "MEMBACA"
  );

  // Form state
  const [form, setForm] = useState({
    studentName: scopedStudents[0]?.name || "Aishwa Rahma Annida",
    className: scopedClasses[0]?.name || "Kelas A",
    branch: (allowedBranch || "Singkut") as "Singkut" | "Bangko",
    topic: isMembaca ? "Kelancaran Membaca Suku Kata" : "Pengurangan (jari turun)",
    content: isMembaca
      ? "Alhamdulillah, hari ini Ananda dapat mengikuti bimbingan membaca dengan lancar. Pelafalan suku kata sudah tepat dan percaya diri. Pertahankan semangat belajarnya ya! 📖✨"
      : "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar. Pertahankan semangat belajarnya ya! 💪✨",
    teacher: "Febrianti Dewi, S.Pd",
    date: new Date().toISOString().split("T")[0],
  });

  const filteredJournals = journals.filter((j) => {
    const matchBranch = allowedBranch ? j.branch === allowedBranch : true;
    const matchSearch =
      j.topic.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase()) ||
      j.studentName.toLowerCase().includes(search.toLowerCase());

    const matchClass = classFilter === "ALL" ? true : j.className === classFilter;
    const matchStudent = studentFilter === "ALL" ? true : j.studentName === studentFilter;

    const st = students.find((s) => s.name.toLowerCase() === j.studentName.toLowerCase());
    const matchProgram = isMembaca
      ? (st as any)?.programType === "MEMBACA"
      : (st as any)?.programType !== "MEMBACA";

    return matchBranch && matchSearch && matchClass && matchStudent && matchProgram;
  });

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addJournal(form);
    setIsAddOpen(false);
  };

  const handleSendWA = (j: JournalItem) => {
    const text = encodeURIComponent(
      `Halo Orang Tua dari ${j.studentName},\n\nBerikut catatan jurnal guru les Mathfingers (${j.className}):\nMateri: ${j.topic}\n\n"${j.content}"\n\nPengajar: ${j.teacher}\nLes Mathfingers Cabang ${j.branch}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header (Matches Image 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isMembaca ? "Catatan Jurnal Guru (Les Membaca)" : "Catatan Jurnal Guru (Les Matematika)"}
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isMembaca ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
              {isMembaca ? "📖 Les Membaca" : "🔢 Les Matematika"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input satu kali jurnal untuk semua siswa aktif yang hadir secara bersamaan berdasarkan hari atau kelompok kelas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Buat Jurnal Harian Kelas
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0f1a36] p-3.5 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari materi jurnal, catatan, atau nama siswa..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="ALL">Semua Kelas</option>
            {scopedClasses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs font-bold text-slate-900 dark:text-white max-w-[180px]"
          >
            <option value="ALL">Semua Siswa</option>
            {scopedStudents.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Pill */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-xs font-extrabold text-slate-800 dark:text-slate-200 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          MINGGU, 30 AGUSTUS 2026
        </div>
      </div>

      {/* 2-Column Grid of Jurnal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJournals.map((j) => (
          <div
            key={j.id}
            className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3.5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Header: Name, Class Badge, Actions */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {j.studentName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                    {j.className}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendWA(j)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    title="Kirim ke WhatsApp Wali"
                  >
                    <Send className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Kirim
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Hapus catatan jurnal ini?")) {
                        deleteJournal(j.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Hapus Jurnal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Topic Header */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Materi: {j.topic}</span>
              </div>

              {/* Note Content */}
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{j.content}&rdquo;
              </div>
            </div>

            {/* Footer: Teacher Name & Ref Code */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Tutor: {j.teacher}</span>
              </div>
              <span className="text-[10px] text-slate-400">ID #{j.id.slice(0, 6)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Jurnal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Buat Jurnal Harian Kelas Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nama Siswa</label>
                  <select
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.branch})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pilihan Kelas</label>
                  <select
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.branch})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Topik / Materi Silabus</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder="Contoh: Pengurangan (jari turun)"
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan Evaluasi Guru</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tuliskan evaluasi harian siswa..."
                  className="w-full p-3 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 leading-relaxed focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Guru Pengajar</label>
                  <input
                    type="text"
                    required
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JurnalGuruPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat jurnal guru...</div>}>
      <JurnalGuruContent />
    </Suspense>
  );
}
