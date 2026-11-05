"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  Plus,
  X,
  Save,
  Trash2,
  User,
  Award,
  CheckCircle2,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface ReadingLevel {
  id: string;
  levelName: string;
  description: string | null;
  orderIndex: number;
  colorCode: string | null;
}

interface ReadingGrade {
  id: string;
  studentId: string;
  branchId: string;
  readingLevelId: string;
  assessmentDate: string;
  teacherNotes: string | null;
  kelancaran: string;
  pemahaman: string;
  pelafalan: string;
  readingLevel: ReadingLevel;
  student: { studentName: string; studentCode: string };
}

interface Student {
  id: string;
  studentName?: string;
  name?: string;
  studentCode?: string;
  branch?: string;
  branchId?: string;
  programType?: string;
  className?: string;
}

const SKILL_OPTIONS = ["Sangat Baik", "Baik", "Cukup", "Perlu Latihan"];

const SKILL_COLOR: Record<string, string> = {
  "Sangat Baik": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  Baik: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  Cukup: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  "Perlu Latihan": "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
};

export default function RaporMembacaPage() {
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [readingLevels, setReadingLevels] = useState<ReadingLevel[]>([]);
  const [readingGrades, setReadingGrades] = useState<ReadingGrade[]>([]);
  const [branches, setBranches] = useState<{ id: string; name: string; programs: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLevelId, setFormLevelId] = useState("");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [formKelancaran, setFormKelancaran] = useState("Baik");
  const [formPemahaman, setFormPemahaman] = useState("Baik");
  const [formPelafalan, setFormPelafalan] = useState("Baik");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [studentsRes, levelsRes, branchesRes] = await Promise.all([
        fetch("/api/students"), fetch("/api/reading-levels"), fetch("/api/branches"),
      ]);
      const studentsData = await studentsRes.json();
      const levelsData = await levelsRes.json();
      const branchesData = await branchesRes.json();
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setReadingLevels(Array.isArray(levelsData) ? levelsData : []);
      const membacaBranches = Array.isArray(branchesData)
        ? branchesData.filter((b: any) => b.programs && b.programs.includes("MEMBACA"))
        : [];
      setBranches(membacaBranches);
      const initialBranch = allowedBranch
        ? branchesData.find((b: any) => b.name === allowedBranch)?.id || ""
        : membacaBranches[0]?.id || "";
      setSelectedBranch(initialBranch);
      if (initialBranch) await fetchGrades(initialBranch);
    } catch (err: any) { console.error(err); }
    finally { setLoading(false); }
  }

  async function fetchGrades(branchId: string) {
    const res = await fetch(`/api/reading-grades?branchId=${branchId}`);
    const data = await res.json();
    setReadingGrades(Array.isArray(data) ? data : []);
  }

  const membacaStudents = useMemo(() =>
    students.filter((s) => {
      const branchMatch = selectedBranch ? s.branchId === selectedBranch : true;
      const programMatch = !s.programType || s.programType === "MEMBACA";
      return branchMatch && programMatch;
    }), [students, selectedBranch]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return membacaStudents;
    const q = searchQuery.toLowerCase();
    return membacaStudents.filter((s) =>
      (s.studentName || s.name || "").toLowerCase().includes(q) ||
      (s.studentCode || "").toLowerCase().includes(q));
  }, [membacaStudents, searchQuery]);

  const activeStudent = useMemo(() => filteredStudents.find((s) => s.id === selectedStudentId), [filteredStudents, selectedStudentId]);
  const studentGrades = useMemo(() => readingGrades.filter((g) => g.studentId === selectedStudentId).sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()), [readingGrades, selectedStudentId]);
  const currentLevel = useMemo(() => studentGrades.length > 0 ? studentGrades[0].readingLevel : null, [studentGrades]);
  const levelProgress = useMemo(() => currentLevel ? Math.round((currentLevel.orderIndex / readingLevels.length) * 100) : 0, [currentLevel, readingLevels]);

  async function handleBranchChange(branchId: string) {
    setSelectedBranch(branchId); setSelectedStudentId(""); await fetchGrades(branchId);
  }

  async function handleSaveAssessment() {
    if (!selectedStudentId || !formLevelId) { alert("Pilih siswa dan level membaca."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/reading-grades", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudentId, branchId: selectedBranch, readingLevelId: formLevelId, assessmentDate: formDate, kelancaran: formKelancaran, pemahaman: formPemahaman, pelafalan: formPelafalan, teacherNotes: formNotes }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      const newGrade = await res.json();
      setReadingGrades((prev) => [newGrade, ...prev]);
      setIsModalOpen(false); setFormLevelId(""); setFormNotes(""); setFormKelancaran("Baik"); setFormPemahaman("Baik"); setFormPelafalan("Baik");
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  }

  async function handleDeleteGrade(id: string) {
    if (!confirm("Hapus catatan ini?")) return;
    await fetch(`/api/reading-grades?id=${id}`, { method: "DELETE" });
    setReadingGrades((prev) => prev.filter((g) => g.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-[#0a1128] dark:via-[#0d1a3a] dark:to-[#0a1128]">
      <TopStatusBar title="Rapor Les Membaca" />
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Rapor Les Membaca</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pantau progress level membaca siswa secara bertahap</p>
          </div>
          <button type="button" onClick={() => { if (!selectedStudentId) { alert("Pilih siswa terlebih dahulu."); return; } setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Input Penilaian
          </button>
        </div>

        {(isSuperAdmin || branches.length > 1) && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Cabang Program Membaca</label>
            {branches.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm font-medium">
                ?? Belum ada cabang yang mengaktifkan program Les Membaca. Aktifkan di menu Cabang &amp; Admin.
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {branches.map((b) => (
                  <button key={b.id} type="button" onClick={() => handleBranchChange(b.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${selectedBranch === b.id ? "bg-emerald-600 text-white shadow-md" : "bg-white dark:bg-[#132042] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1d2d5a] hover:border-emerald-400"}`}>
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!isSuperAdmin && branches.length === 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-[#1d2d5a] text-center">
            <BookOpen className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="font-black text-slate-900 dark:text-white mb-1">Program Les Membaca Belum Aktif</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hubungi Super Admin untuk mengaktifkan program Les Membaca di cabang Anda.</p>
          </div>
        )}

        {(isSuperAdmin || branches.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111c3a] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-[#1d2d5a]">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{membacaStudents.length} Siswa Les Membaca</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Cari nama siswa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-[#0d1630] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {filteredStudents.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">{membacaStudents.length === 0 ? "Belum ada siswa program Membaca di cabang ini." : "Tidak ada siswa yang cocok."}</div>
                ) : filteredStudents.map((student) => {
                  const latestGrade = readingGrades.find((g) => g.studentId === student.id);
                  const name = student.studentName || student.name || "-";
                  const progress = latestGrade ? Math.round((latestGrade.readingLevel.orderIndex / readingLevels.length) * 100) : 0;
                  return (
                    <button key={student.id} type="button" onClick={() => setSelectedStudentId(student.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all cursor-pointer border-b border-slate-50 dark:border-[#162244] last:border-0 ${selectedStudentId === student.id ? "bg-emerald-50 dark:bg-emerald-950/30" : "hover:bg-slate-50 dark:hover:bg-[#0d1630]"}`}>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm">{name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="h-1.5 flex-1 bg-slate-200 dark:bg-[#1d2d5a] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{latestGrade?.readingLevel.levelName || "Belum Dinilai"}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {!activeStudent ? (
                <div className="bg-white dark:bg-[#111c3a] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] p-10 text-center shadow-sm">
                  <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">Pilih siswa dari daftar</p>
                  <p className="text-sm text-slate-400 mt-1">Klik nama siswa untuk melihat rapor membacanya</p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black shadow-sm">{(activeStudent.studentName || activeStudent.name || "?").charAt(0)}</div>
                        <div>
                          <p className="font-black text-lg leading-tight">{activeStudent.studentName || activeStudent.name}</p>
                          <p className="text-emerald-100 text-xs font-medium">{activeStudent.studentCode || "-"} · {activeStudent.className || "—"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-100 mb-0.5">Level Saat Ini</p>
                        <p className="font-black text-lg">{currentLevel?.levelName || "Belum Dinilai"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-emerald-100 mb-1"><span>Progress Membaca</span><span>{levelProgress}%</span></div>
                      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${levelProgress}%` }} /></div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
                      {readingLevels.map((level, i) => {
                        const isReached = currentLevel ? level.orderIndex <= currentLevel.orderIndex : false;
                        return (
                          <div key={level.id} className="flex items-center gap-1 shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${isReached ? "bg-white text-emerald-700 shadow-sm" : "bg-white/20 text-white/60"}`} title={level.levelName}>
                              {isReached ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                            </div>
                            {i < readingLevels.length - 1 && <div className={`h-0.5 w-3 ${isReached && currentLevel && readingLevels[i + 1]?.orderIndex <= currentLevel.orderIndex ? "bg-white" : "bg-white/20"}`} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#111c3a] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between">
                      <p className="font-black text-slate-900 dark:text-white text-sm">Riwayat Penilaian</p>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-[#0d1630] px-2 py-0.5 rounded-full">{studentGrades.length} catatan</span>
                    </div>
                    {studentGrades.length === 0 ? (
                      <div className="p-8 text-center"><Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" /><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Belum ada penilaian</p></div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-[#162244]">
                        {studentGrades.map((grade, index) => (
                          <div key={grade.id} className={`p-4 ${index === 0 ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white shadow-sm" style={{ backgroundColor: grade.readingLevel.colorCode || "#22c55e" }}>{grade.readingLevel.levelName}</span>
                                  {index === 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">? Terkini</span>}
                                  <span className="text-xs text-slate-400">{new Date(grade.assessmentDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {[{ label: "Kelancaran", value: grade.kelancaran }, { label: "Pemahaman", value: grade.pemahaman }, { label: "Pelafalan", value: grade.pelafalan }].map((skill) => (
                                    <span key={skill.label} className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold ${SKILL_COLOR[skill.value] || "bg-slate-100 text-slate-600"}`}>{skill.label}: {skill.value}</span>
                                  ))}
                                </div>
                                {grade.teacherNotes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 italic">&quot;{grade.teacherNotes}&quot;</p>}
                              </div>
                              <button type="button" onClick={() => handleDeleteGrade(grade.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111c3a] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1d2d5a] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between">
              <div><h2 className="font-black text-slate-900 dark:text-white">Input Penilaian Membaca</h2><p className="text-xs text-slate-500 mt-0.5">{activeStudent?.studentName || activeStudent?.name}</p></div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1d2d5a] text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Level Membaca yang Dicapai *</label>
                <div className="grid grid-cols-1 gap-2">
                  {readingLevels.map((level) => (
                    <button key={level.id} type="button" onClick={() => setFormLevelId(level.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${formLevelId === level.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-slate-200 dark:border-[#1d2d5a] hover:border-emerald-300"}`}>
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: level.colorCode || "#22c55e" }} />
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{level.levelName}</p>
                        {level.description && <p className="text-xs text-slate-500 mt-0.5">{level.description}</p>}
                      </div>
                      {formLevelId === level.id && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Tanggal Penilaian</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0d1630] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              {[
                { label: "Kelancaran Membaca", value: formKelancaran, setter: setFormKelancaran },
                { label: "Pemahaman Bacaan", value: formPemahaman, setter: setFormPemahaman },
                { label: "Pelafalan / Intonasi", value: formPelafalan, setter: setFormPelafalan },
              ].map((skill) => (
                <div key={skill.label}>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">{skill.label}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_OPTIONS.map((opt) => (
                      <button key={opt} type="button" onClick={() => skill.setter(opt)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${skill.value === opt ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-slate-200 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-400 hover:border-emerald-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Catatan Guru (opsional)</label>
                <textarea rows={3} value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Catatan perkembangan siswa..." className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0d1630] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="button" onClick={handleSaveAssessment} disabled={saving || !formLevelId} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
                  <Save className="w-4 h-4" />{saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
