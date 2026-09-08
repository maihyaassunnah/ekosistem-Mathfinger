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
  Plus,
  Trash2,
  Edit2,
  X,
  Clock,
  Activity,
  Sliders,
  TrendingUp,
  ChevronRight,
  Filter,
  UserCheck,
  Zap,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import CustomSelect from "@/components/ui/CustomSelect";
import { useAppStore, GradeItem } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function InputNilaiPage() {
  const {
    students,
    classes,
    grades,
    saveGrades,
    updateSingleGrade,
    deleteGradeSession,
    renameGradeSession,
    deleteSingleGrade,
    behaviors,
    saveStudentKeaktifan,
    deleteBehavior,
  } = useAppStore();

  const currentUser = useCurrentUser();
  const { isSuperAdmin, allowedBranch } = currentUser;

  const scopedStudents = useMemo(() => {
    const list = allowedBranch ? students.filter((s) => s.branch === allowedBranch) : students;
    return list.filter((s) => (s as any).programType !== "MEMBACA");
  }, [students, allowedBranch]);

  const scopedClasses = useMemo(() => {
    const list = allowedBranch ? classes.filter((c) => c.branch === allowedBranch) : classes;
    return list.filter((c) => (c as any).programType !== "MEMBACA");
  }, [classes, allowedBranch]);

  const [activeSubTab, setActiveSubTab] = useState<
    "input" | "keaktifan" | "leger"
  >("input");

  // Form Inputs (Tab 1)
  const [topic, setTopic] = useState("Penjumlahan Kombinasi 5 (+4, +3)");
  const [examDate, setExamDate] = useState("2026-09-06");

  // Filters (Tab 1)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");

  // Row entries state: studentId -> { isJoined, score, note }
  const [entries, setEntries] = useState<
    Record<string, { isJoined: boolean; score: number; note: string }>
  >(() => {
    const initial: Record<
      string,
      { isJoined: boolean; score: number; note: string }
    > = {};
    (allowedBranch ? students.filter((s) => s.branch === allowedBranch) : students)
      .filter((s) => (s as any).programType !== "MEMBACA")
      .forEach((s) => {
        initial[s.id] = {
          isJoined: true,
          score: 0,
          note: "Sangat cepat / fokus tinggi",
        };
      });
    return initial;
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // -------------------------------------------------------------
  // TAB 2: KEAKTIFAN SISWA STATE & MODAL
  // -------------------------------------------------------------
  const [keaktifanSearchQuery, setKeaktifanSearchQuery] = useState("");
  const [keaktifanClassFilter, setKeaktifanClassFilter] = useState("ALL");
  const [selectedStudentForKeaktifan, setSelectedStudentForKeaktifan] =
    useState<StudentItem | null>(null);
  const [keaktifanForm, setKeaktifanForm] = useState({
    accuracy: 95,
    speed: "1.8",
    focus: "Sangat Tinggi",
    topic: "Observasi Keaktifan & Ketangkasan",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [keaktifanToast, setKeaktifanToast] = useState<string | null>(null);

  const openKeaktifanModal = (student: StudentItem) => {
    setSelectedStudentForKeaktifan(student);
    const existing = behaviors.find((b) => b.studentId === student.id);
    if (existing) {
      const accMatch = existing.participation?.match(/\d+/);
      const accVal = accMatch ? parseInt(accMatch[0]) : 92;

      const speedMatch = existing.attitude?.match(/[\d.]+/);
      const speedVal = speedMatch ? speedMatch[0] : "1.8";

      setKeaktifanForm({
        accuracy: accVal,
        speed: speedVal,
        focus: existing.focus || "Sangat Tinggi",
        topic: existing.sessionTopic || "Observasi Keaktifan & Ketangkasan",
        date: existing.date || new Date().toISOString().split("T")[0],
        note: existing.note || "",
      });
    } else {
      setKeaktifanForm({
        accuracy: 92,
        speed: "1.8",
        focus: "Sangat Tinggi",
        topic: "Observasi Keaktifan & Ketangkasan",
        date: new Date().toISOString().split("T")[0],
        note: "Kecepatan jari stabil dan respon motorik optimal",
      });
    }
  };

  const handleSaveKeaktifan = async () => {
    if (!selectedStudentForKeaktifan) return;
    const student = selectedStudentForKeaktifan;
    await saveStudentKeaktifan({
      studentId: student.id,
      studentName: student.name,
      date: keaktifanForm.date,
      sessionTopic: keaktifanForm.topic,
      focus: keaktifanForm.focus,
      participation: `${keaktifanForm.accuracy}%`,
      attitude: `${keaktifanForm.speed}s / soal`,
      note: keaktifanForm.note,
    });
    setKeaktifanToast(`Observasi keaktifan untuk ${student.name} berhasil disimpan!`);
    setTimeout(() => setKeaktifanToast(null), 3500);
    setSelectedStudentForKeaktifan(null);
  };

  const filteredKeaktifanStudents = useMemo(() => {
    return scopedStudents
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(keaktifanSearchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(keaktifanSearchQuery.toLowerCase());
        const matchesClass =
          keaktifanClassFilter === "ALL" || s.className === keaktifanClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [scopedStudents, keaktifanSearchQuery, keaktifanClassFilter]);

  // -------------------------------------------------------------
  // TAB 3: LEGER NILAI MATRIKS FULL CRUD
  // -------------------------------------------------------------
  const [legerClassFilter, setLegerClassFilter] = useState("ALL");
  const [legerSearchQuery, setLegerSearchQuery] = useState("");

  // A. Add Session Modal
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    topic: "",
    examDate: new Date().toISOString().split("T")[0],
    targetClass: "ALL",
    defaultScore: 85,
  });

  // B. Rename Session Column Modal
  const [editingSession, setEditingSession] = useState<{
    oldTopic: string;
    oldExamDate: string;
    newTopic: string;
    newExamDate: string;
  } | null>(null);

  // C. Delete Session Column Modal
  const [deletingSession, setDeletingSession] = useState<{
    topic: string;
    examDate: string;
  } | null>(null);

  // D. Edit Single Cell Grade Modal
  const [editingCell, setEditingCell] = useState<{
    student: StudentItem;
    col: { topic: string; examDate: string };
    gradeId?: string;
    score: number;
    note: string;
    isJoined: boolean;
  } | null>(null);

  const [legerToast, setLegerToast] = useState<string | null>(null);

  // Unique evaluations ordered chronologically
  const evaluationColumns = useMemo(() => {
    const map = new Map<string, { key: string; topic: string; examDate: string }>();
    grades.forEach((g) => {
      const key = `${g.examDate}___${g.topic}`;
      if (!map.has(key)) {
        map.set(key, { key, topic: g.topic, examDate: g.examDate });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.examDate.localeCompare(b.examDate));
  }, [grades]);

  // Fast score lookup: studentId___examDate___topic -> GradeItem
  const gradeMap = useMemo(() => {
    const map = new Map<string, GradeItem>();
    grades.forEach((g) => {
      const key = `${g.studentId}___${g.examDate}___${g.topic}`;
      map.set(key, g);
    });
    return map;
  }, [grades]);

  // Filtered students for Leger Matrix
  const filteredLegerStudents = useMemo(() => {
    return scopedStudents
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(legerSearchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(legerSearchQuery.toLowerCase());
        const matchesClass =
          legerClassFilter === "ALL" || s.className === legerClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [scopedStudents, legerSearchQuery, legerClassFilter]);

  // Handle Add Session
  const handleCreateSession = async () => {
    if (!newSessionForm.topic.trim()) {
      alert("Silakan masukkan topik materi ujian.");
      return;
    }
    const targetStudents =
      newSessionForm.targetClass === "ALL"
        ? scopedStudents
        : scopedStudents.filter((s) => s.className === newSessionForm.targetClass);

    const newGradesToCreate: GradeItem[] = targetStudents.map((s) => ({
      id: `gr-${s.id}-${newSessionForm.examDate}-${Date.now().toString(36)}`,
      studentId: s.id,
      studentName: s.name,
      className: s.className,
      topic: newSessionForm.topic.trim(),
      examDate: newSessionForm.examDate,
      score: Number(newSessionForm.defaultScore) || 80,
      note: "Sesi uji dibuat via Leger",
      isJoined: true,
    }));

    saveGrades(newGradesToCreate);
    setLegerToast(
      `Sesi ujian "${newSessionForm.topic}" berhasil ditambahkan untuk ${targetStudents.length} siswa!`
    );
    setTimeout(() => setLegerToast(null), 3500);
    setShowAddSessionModal(false);
    setNewSessionForm({
      topic: "",
      examDate: new Date().toISOString().split("T")[0],
      targetClass: "ALL",
      defaultScore: 85,
    });
  };

  // Handle Rename Session Column
  const handleRenameSession = async () => {
    if (!editingSession) return;
    if (!editingSession.newTopic.trim()) {
      alert("Topik materi tidak boleh kosong.");
      return;
    }
    await renameGradeSession(
      editingSession.oldTopic,
      editingSession.oldExamDate,
      editingSession.newTopic.trim(),
      editingSession.newExamDate
    );
    setLegerToast(`Sesi ujian berhasil diperbarui menjadi "${editingSession.newTopic}"!`);
    setTimeout(() => setLegerToast(null), 3500);
    setEditingSession(null);
  };

  // Handle Delete Session Column
  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    await deleteGradeSession(deletingSession.topic, deletingSession.examDate);
    setLegerToast(`Sesi ujian "${deletingSession.topic}" berhasil dihapus.`);
    setTimeout(() => setLegerToast(null), 3500);
    setDeletingSession(null);
  };

  // Handle Open Cell Edit
  const handleOpenCellEdit = (
    student: StudentItem,
    col: { topic: string; examDate: string }
  ) => {
    const existing = gradeMap.get(`${student.id}___${col.examDate}___${col.topic}`);
    setEditingCell({
      student,
      col,
      gradeId: existing?.id,
      score: existing?.score !== undefined ? existing.score : 80,
      note: existing?.note || "",
      isJoined: existing?.isJoined !== undefined ? existing.isJoined : true,
    });
  };

  // Handle Save Cell Grade
  const handleSaveCellGrade = async () => {
    if (!editingCell) return;
    await updateSingleGrade({
      id: editingCell.gradeId,
      studentId: editingCell.student.id,
      studentName: editingCell.student.name,
      className: editingCell.student.className,
      topic: editingCell.col.topic,
      examDate: editingCell.col.examDate,
      score: Number(editingCell.score) || 0,
      note: editingCell.note,
      isJoined: editingCell.isJoined,
    });
    setLegerToast(
      `Nilai ${editingCell.student.name} berhasil disimpan (${editingCell.score})!`
    );
    setTimeout(() => setLegerToast(null), 3500);
    setEditingCell(null);
  };

  // Handle Delete Cell Grade
  const handleDeleteCellGrade = async () => {
    if (!editingCell) return;
    if (editingCell.gradeId) {
      await deleteSingleGrade(editingCell.gradeId);
    }
    setLegerToast(`Nilai ${editingCell.student.name} berhasil di-reset.`);
    setTimeout(() => setLegerToast(null), 3500);
    setEditingCell(null);
  };

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
        const item = gradeMap.get(`${s.id}___${col.examDate}___${col.topic}`);
        if (item !== undefined && item.score !== undefined) {
          studentTotal += item.score;
          studentCount++;
          return item.score;
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

  // -------------------------------------------------------------
  // TAB 1: INPUT NILAI HANDLERS
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return scopedStudents
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass =
          selectedClass === "ALL" || s.className === selectedClass;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [scopedStudents, searchQuery, selectedClass]);

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
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Status Bar with Supabase Live */}
      <TopStatusBar title="Input Nilai & Evaluasi" />

      {/* Main Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Input Nilai & Uji Kecepatan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rekam akurasi jawaban, kecepatan buka-tutup jari Jaritmatika, dan kelola Leger Matriks lengkap.
          </p>
        </div>

        {/* Global Action feedback toast */}
        {(keaktifanToast || legerToast) && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold animate-in fade-in shadow-xs self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{keaktifanToast || legerToast}</span>
          </div>
        )}
      </div>

      {/* 3 Sub-tabs with smooth horizontal scrolling on mobile */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-slate-200 dark:border-[#1d2d5a] text-xs font-bold overflow-x-auto no-scrollbar scrollbar-none pb-0">
        <button
          type="button"
          onClick={() => setActiveSubTab("input")}
          className={`flex items-center gap-2 pb-3 pt-1 transition-all relative cursor-pointer shrink-0 whitespace-nowrap px-1 sm:px-0 ${
            activeSubTab === "input"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Input & Riwayat Nilai</span>
          {activeSubTab === "input" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("keaktifan")}
          className={`flex items-center gap-2 pb-3 pt-1 transition-all relative cursor-pointer shrink-0 whitespace-nowrap px-1 sm:px-0 ${
            activeSubTab === "keaktifan"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Penilaian & Keaktifan Siswa</span>
          {activeSubTab === "keaktifan" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("leger")}
          className={`flex items-center gap-2 pb-3 pt-1 transition-all relative cursor-pointer shrink-0 whitespace-nowrap px-1 sm:px-0 ${
            activeSubTab === "leger"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Leger Nilai (Matriks CRUD)</span>
          {activeSubTab === "leger" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 1: INPUT NILAI KELAS (LANGSUNG)                        */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "input" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#1d2d5a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Panel Input Nilai Kelas (Langsung)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Isi materi/bab, tanggal, dan nilai siswa aktif di bawah, lalu klik Simpan Nilai.
                  </p>
                </div>
              </div>

              {saveSuccess && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold animate-in fade-in self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
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

            {/* Form Input Fields: Materi & Tanggal (1 Baris) */}
            <div className="p-3 sm:p-5 bg-slate-50/50 dark:bg-[#09130f] border-b border-slate-100 dark:border-[#1d2d5a] grid grid-cols-12 gap-2 sm:gap-4">
              <div className="col-span-7 sm:col-span-8 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate block">
                  Materi / Bab *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Misal: Penjumlahan Kombinasi 5"
                  className="w-full px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="col-span-5 sm:col-span-4 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate block">
                  Tanggal Ujian *
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Saring Berdasarkan Nama & Kelas (1 Baris) */}
            <div className="p-3 sm:p-5 space-y-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Saring Berdasarkan Nama & Kelas
              </div>

              <div className="grid grid-cols-12 gap-2">
                {/* Search Bar */}
                <div className="relative col-span-7 sm:col-span-8">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full pl-8 sm:pl-9 pr-2.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Class Select */}
                <div className="col-span-5 sm:col-span-4">
                  <CustomSelect
                    value={selectedClass}
                    onChange={setSelectedClass}
                    className="w-full"
                    size="sm"
                    options={[
                      { value: "ALL", label: "Semua Kelas" },
                      ...scopedClasses.map((c) => ({
                        value: c.name,
                        label: `${c.name} (${c.branch})`,
                      })),
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Mobile View: Clean Touch-Friendly Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {/* Mobile Select All Header */}
              <div className="p-3 bg-slate-50/90 dark:bg-[#09130f] flex items-center justify-between border-b border-slate-200/80 dark:border-[#1d2d5a]">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      filteredStudents.every((s) => entries[s.id]?.isJoined)
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Pilih Semua Siswa</span>
                </label>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {filteredStudents.filter((s) => entries[s.id]?.isJoined).length} / {filteredStudents.length} Ikut
                </span>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                  Tidak ada siswa yang sesuai filter
                </div>
              ) : (
                filteredStudents.map((s) => {
                  const isJoined = entries[s.id]?.isJoined ?? true;
                  const score = entries[s.id]?.score ?? 0;
                  const note = entries[s.id]?.note ?? "";

                  return (
                    <div
                      key={`mobile-${s.id}`}
                      className={`p-3 space-y-2 transition-colors ${
                        !isJoined
                          ? "opacity-50 bg-slate-50/50 dark:bg-slate-900/30"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isJoined}
                            onChange={() => handleToggleJoined(s.id)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                              {s.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md border border-purple-200 dark:border-purple-800 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30">
                                🏫 {s.className}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                  isJoined
                                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                }`}
                              >
                                {isJoined ? "IKUT" : "TIDAK IKUT"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Skor Input */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-[#0b1329] p-1.5 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
                          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 pl-1">
                            SKOR:
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            disabled={!isJoined}
                            value={score}
                            onChange={(e) =>
                              handleScoreChange(s.id, parseInt(e.target.value))
                            }
                            className="w-14 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] text-xs font-black text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                          />
                        </div>
                      </div>

                      {/* Catatan Field */}
                      <div>
                        <input
                          type="text"
                          disabled={!isJoined}
                          value={note}
                          onChange={(e) => handleNoteChange(s.id, e.target.value)}
                          placeholder="Catatan performa siswa..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200/80 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          filteredStudents.every((s) => entries[s.id]?.isJoined)
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
                              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isJoined
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
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
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30">
                                <span>🏫</span>
                                <span>{s.className}</span>
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
                              className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-bold text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              disabled={!isJoined}
                              value={note}
                              onChange={(e) => handleNoteChange(s.id, e.target.value)}
                              placeholder="Catatan performa / ketangkasan siswa..."
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-900"
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
            <div className="p-3.5 sm:p-4 bg-slate-50/60 dark:bg-[#09130f] border-t border-slate-200/80 dark:border-[#1d2d5a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                Menampilkan{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {filteredStudents.length}
                </span>{" "}
                siswa aktif terdaftar
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
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
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-2 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 2: OBSERVASI KEAKTIFAN SISWA (INPUT PER ANAK)           */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "keaktifan" && (
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Observasi Ketangkasan & Keaktifan Siswa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pantau kecepatan buka-tutup jari, fokus kuis 1 menit, dan respon motorik Jaritmatika per individu siswa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold">
                {behaviors.length} Siswa Terobservasi
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 bg-slate-50 dark:bg-[#0b1329] p-3 rounded-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keaktifanSearchQuery}
                onChange={(e) => setKeaktifanSearchQuery(e.target.value)}
                placeholder="Cari nama atau kode siswa..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <CustomSelect
              value={keaktifanClassFilter}
              onChange={setKeaktifanClassFilter}
              className="w-full sm:w-64"
              size="sm"
              options={[
                { value: "ALL", label: `Semua Kelas (${scopedStudents.length} Siswa)` },
                ...scopedClasses.map((c) => ({
                  value: c.name,
                  label: `${c.name} (${c.branch})`,
                })),
              ]}
            />
          </div>

          {/* Cards Grid for ALL Students */}
          {filteredKeaktifanStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              Tidak ada siswa yang sesuai filter pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKeaktifanStudents.map((s) => {
                const b = behaviors.find((item) => item.studentId === s.id);
                const rawAcc = b?.participation?.replace("%", "") || "95";
                const accNum = parseInt(rawAcc) || 90;
                const speedText = b?.attitude || "1.8s / soal";
                const focusLevel = b?.focus || "Sangat Tinggi";
                const noteText = b?.note || "Respon motorik jari lancar dan sigap.";

                const focusBadgeColor =
                  focusLevel === "Sangat Tinggi"
                    ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : focusLevel === "Tinggi"
                    ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : focusLevel === "Sedang"
                    ? "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";

                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1d2d5a] bg-slate-50/40 dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-[#0e1936] transition-all space-y-3.5 shadow-2xs"
                  >
                    {/* Top Row: Name & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {s.name}
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] font-bold text-slate-400">
                            #{s.studentCode}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold">
                            🏫 {s.className}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${focusBadgeColor}`}
                      >
                        {focusLevel}
                      </span>
                    </div>

                    {/* Metrics List */}
                    <div className="space-y-2 pt-1">
                      {/* Akurasi Gerakan Bar */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500 dark:text-slate-400">
                            Akurasi Gerakan:
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {accNum}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${accNum}%` }}
                          />
                        </div>
                      </div>

                      {/* Kecepatan Hitung */}
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">
                          Kecepatan Hitung:
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          ⚡ {speedText}
                        </span>
                      </div>

                      {/* Catatan Observasi Guru */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-[#0f1a36] p-2 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a] truncate">
                        💬 {noteText}
                      </div>
                    </div>

                    {/* Action Button: Input / Edit per Anak */}
                    <button
                      type="button"
                      onClick={() => openKeaktifanModal(s)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Input / Edit Keaktifan</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal Input Keaktifan Per Anak */}
          {selectedStudentForKeaktifan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Observasi Keaktifan Siswa
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedStudentForKeaktifan.name} ({selectedStudentForKeaktifan.className})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForKeaktifan(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Akurasi Gerakan Slider */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Akurasi Gerakan Jari:</span>
                      <span className="text-emerald-600 font-black text-sm">
                        {keaktifanForm.accuracy}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={keaktifanForm.accuracy}
                      onChange={(e) =>
                        setKeaktifanForm({
                          ...keaktifanForm,
                          accuracy: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>50% (Perlu Latihan)</span>
                      <span>100% (Sangat Presisi)</span>
                    </div>
                  </div>

                  {/* Kecepatan Hitung Input */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Kecepatan Hitung (detik per soal):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keaktifanForm.speed}
                        onChange={(e) =>
                          setKeaktifanForm({ ...keaktifanForm, speed: e.target.value })
                        }
                        placeholder="Misal: 1.8"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                        detik / soal
                      </span>
                    </div>
                  </div>

                  {/* Tingkat Fokus Selector */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tingkat Fokus Kuis:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Sangat Tinggi", "Tinggi", "Sedang", "Perlu Bimbingan"].map(
                        (lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              setKeaktifanForm({ ...keaktifanForm, focus: lvl })
                            }
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              keaktifanForm.focus === lvl
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-slate-50 dark:bg-[#0b1329] border-slate-200 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {lvl}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Topik & Tanggal */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Tanggal:
                      </label>
                      <input
                        type="date"
                        value={keaktifanForm.date}
                        onChange={(e) =>
                          setKeaktifanForm({ ...keaktifanForm, date: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Sesi / Topik:
                      </label>
                      <input
                        type="text"
                        value={keaktifanForm.topic}
                        onChange={(e) =>
                          setKeaktifanForm({ ...keaktifanForm, topic: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Catatan Observasi */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Catatan Observasi Guru:
                    </label>
                    <textarea
                      rows={2}
                      value={keaktifanForm.note}
                      onChange={(e) =>
                        setKeaktifanForm({ ...keaktifanForm, note: e.target.value })
                      }
                      placeholder="Catatan tambahan respons motorik atau daya tahan..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForKeaktifan(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveKeaktifan}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan ke Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 3: LEGER NILAI MATRIKS (FULL CRUD)                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "leger" && (
        <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Leger Nilai & Matriks Uji Kompetensi (CRUD)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                  {evaluationColumns.length} Sesi Uji Kompetensi Berurutan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Klik pada nilai siswa untuk edit/update, atau klik tombol di bawah untuk menambah sesi uji baru.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Class Filter */}
              <CustomSelect
                value={legerClassFilter}
                onChange={setLegerClassFilter}
                className="min-w-[170px]"
                size="sm"
                options={[
                  { value: "ALL", label: `Semua Kelas (${scopedStudents.length})` },
                  ...scopedClasses.map((c) => ({
                    value: c.name,
                    label: c.name,
                  })),
                ]}
              />

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={legerSearchQuery}
                  onChange={(e) => setLegerSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44"
                />
              </div>

              {/* + Tambah Sesi Uji Baru (CREATE) */}
              <button
                type="button"
                onClick={() => setShowAddSessionModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Sesi Uji
              </button>

              {/* Download CSV */}
              <button
                type="button"
                onClick={handleDownloadLegerCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                CSV Matriks
              </button>
            </div>
          </div>

          {/* Matriks Table */}
          {evaluationColumns.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1d2d5a] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Belum Ada Nilai Uji Kompetensi
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silakan klik tombol "+ Tambah Sesi Uji" di atas atau isi melalui tab "Input & Riwayat Nilai" untuk membuat kolom sesi uji pertama.
              </p>
              <button
                type="button"
                onClick={() => setShowAddSessionModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Buat Sesi Uji Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/80 dark:border-[#1d2d5a] rounded-xl shadow-xs">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300">
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
                        className="py-3 px-4 text-center border-l border-slate-200/60 dark:border-[#1d2d5a] min-w-[170px] relative group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="inline-block px-2 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold">
                              Uji {idx + 1}
                            </span>
                            {/* Column Header Actions (Edit & Delete Session) */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingSession({
                                    oldTopic: col.topic,
                                    oldExamDate: col.examDate,
                                    newTopic: col.topic,
                                    newExamDate: col.examDate,
                                  })
                                }
                                title="Edit Judul/Tanggal Sesi Ujian"
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingSession({
                                    topic: col.topic,
                                    examDate: col.examDate,
                                  })
                                }
                                title="Hapus Kolom Sesi Ujian Ini"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div
                            className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[160px]"
                            title={col.topic}
                          >
                            {col.topic}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            📅 {col.examDate}
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-center font-black text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-[#1d2d5a] bg-slate-100/70 dark:bg-slate-800/40 min-w-[100px]">
                      Rata-rata
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLegerStudents.map((s, idx) => {
                    let totalScore = 0;
                    let evaluatedCount = 0;

                    const rowScores = evaluationColumns.map((col) => {
                      const item = gradeMap.get(`${s.id}___${col.examDate}___${col.topic}`);
                      if (item !== undefined && item.score !== undefined) {
                        totalScore += item.score;
                        evaluatedCount++;
                        return item;
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
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-950 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono sticky left-0 bg-white dark:bg-[#0f1a36] z-10">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100 sticky left-12 bg-white dark:bg-[#0f1a36] z-10">
                          <span>{s.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {s.className}
                          </span>
                        </td>
                        {rowScores.map((item, cIdx) => {
                          const col = evaluationColumns[cIdx];
                          const score = item?.score;

                          return (
                            <td
                              key={cIdx}
                              className="py-2.5 px-4 text-center border-l border-slate-100 dark:border-[#1d2d5a]/60"
                            >
                              {score !== undefined ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCellEdit(s, col)}
                                  title={`Nilai ${s.name}: ${score} - Klik untuk edit`}
                                  className={`inline-block px-3 py-1 rounded-lg font-black text-xs cursor-pointer transition-transform hover:scale-105 ${
                                    score >= 85
                                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                      : score >= 70
                                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  {score}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCellEdit(s, col)}
                                  title={`Beri nilai untuk ${s.name}`}
                                  className="px-2 py-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-4 text-center font-black text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-[#1d2d5a] bg-slate-100/50 dark:bg-slate-800/30">
                          {average !== "-" ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
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

          {/* Modal A: Tambah Sesi Ujian Baru */}
          {showAddSessionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Tambah Sesi Uji Kompetensi Baru
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddSessionModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Materi / Topik Ujian *:
                    </label>
                    <input
                      type="text"
                      value={newSessionForm.topic}
                      onChange={(e) =>
                        setNewSessionForm({ ...newSessionForm, topic: e.target.value })
                      }
                      placeholder="Contoh: Perkalian Jaritmatika 6-9"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Tanggal Ujian:
                      </label>
                      <input
                        type="date"
                        value={newSessionForm.examDate}
                        onChange={(e) =>
                          setNewSessionForm({ ...newSessionForm, examDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Nilai Default (0-100):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newSessionForm.defaultScore}
                        onChange={(e) =>
                          setNewSessionForm({
                            ...newSessionForm,
                            defaultScore: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Siswa Kelas:
                    </label>
                    <CustomSelect
                      value={newSessionForm.targetClass}
                      onChange={(val) =>
                        setNewSessionForm({ ...newSessionForm, targetClass: val })
                      }
                      className="w-full"
                      size="sm"
                      options={[
                        { value: "ALL", label: `Semua Siswa Terdaftar (${students.length})` },
                        ...classes.map((c) => ({
                          value: c.name,
                          label: `${c.name} (${c.branch})`,
                        })),
                      ]}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={() => setShowAddSessionModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSession}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Buat Sesi Uji
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal B: Edit/Rename Sesi Column */}
          {editingSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Ubah Data Sesi Uji Kompetensi
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingSession(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Topik Materi Ujian:
                    </label>
                    <input
                      type="text"
                      value={editingSession.newTopic}
                      onChange={(e) =>
                        setEditingSession({ ...editingSession, newTopic: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tanggal Ujian:
                    </label>
                    <input
                      type="date"
                      value={editingSession.newExamDate}
                      onChange={(e) =>
                        setEditingSession({
                          ...editingSession,
                          newExamDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={() => setEditingSession(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRenameSession}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal C: Hapus Sesi Column Confirmation */}
          {deletingSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-sm w-full p-6 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Hapus Kolom Sesi Ujian?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Anda akan menghapus seluruh data nilai untuk sesi "
                    <strong className="text-slate-800 dark:text-slate-200">
                      {deletingSession.topic}
                    </strong>
                    " ({deletingSession.examDate}). Aksi ini akan menghapus nilai dari database.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={() => setDeletingSession(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSession}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Ya, Hapus Sesi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal D: Edit Single Cell Grade */}
          {editingCell && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-sm w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Nilai Uji: {editingCell.student.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {editingCell.col.topic} • {editingCell.col.examDate}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCell(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Skor Nilai (0 - 100) *:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingCell.score}
                      onChange={(e) =>
                        setEditingCell({
                          ...editingCell,
                          score: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-base font-extrabold text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Catatan Nilai:
                    </label>
                    <input
                      type="text"
                      value={editingCell.note}
                      onChange={(e) =>
                        setEditingCell({ ...editingCell, note: e.target.value })
                      }
                      placeholder="Catatan performa anak..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={editingCell.isJoined}
                      onChange={(e) =>
                        setEditingCell({ ...editingCell, isJoined: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Siswa Mengikuti Sesi Ujian Ini</span>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={handleDeleteCellGrade}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Reset Nilai
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCell(null)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCellGrade}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Simpan Nilai
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
