"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  Filter,
  UserCheck,
  Building2,
  LayoutGrid,
  Users,
  BookOpen,
  ArrowUpDown,
  X,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Layers,
  TrendingUp,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import CustomSelect from "@/components/ui/CustomSelect";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAppStore, LevelProgressionConfig, StudentLevelRecord } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

// Helper formatting Indonesian dates
function formatIndonesianDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
      ];
      return `${day} ${months[month]} ${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr || "-";
  }
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function KenaikanLevelContent() {
  const {
    students,
    classes,
    branches,
    levelColumns,
    studentLevelRecords,
    addLevelColumn,
    updateLevelColumn,
    deleteLevelColumn,
    setStudentLevelRecord,
    deleteStudentLevelRecord,
    batchUpdateStudentLevelRecords,
  } = useAppStore();

  const currentUser = useCurrentUser();
  const { isSuperAdmin, isBranchAdmin, allowedBranch } = currentUser;
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>(allowedBranch || "ALL");
  const [selectedProgram, setSelectedProgram] = useState<"ALL" | "MATEMATIKA" | "MEMBACA">(
    paramProgram === "MEMBACA" ? "MEMBACA" : "ALL"
  );
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "ALL">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"A-Z" | "Z-A" | "LEVEL_ASC" | "LEVEL_DESC">("A-Z");

  // Synchronize branch from user
  useEffect(() => {
    if (allowedBranch) {
      setSelectedBranch(allowedBranch);
    }
  }, [allowedBranch]);

  useEffect(() => {
    if (paramProgram === "MEMBACA") {
      setSelectedProgram("MEMBACA");
    }
  }, [paramProgram]);

  // Modal States
  // 1. Quick Cell Date Picker Modal
  const [quickDateModal, setQuickDateModal] = useState<{
    open: boolean;
    student?: StudentItem;
    level?: LevelProgressionConfig;
    passedDate: string;
    notes: string;
  }>({
    open: false,
    passedDate: getTodayString(),
    notes: "",
  });

  // 2. Student Full Level Edit Modal
  const [studentModal, setStudentModal] = useState<{
    open: boolean;
    student?: StudentItem;
    records: Record<string, { passedDate: string; notes: string }>;
  }>({
    open: false,
    records: {},
  });

  // 3. Add Level Column Modal
  const [addLevelModal, setAddLevelModal] = useState({
    open: false,
    name: "",
    description: "",
  });

  // 4. Manage Levels Modal
  const [manageLevelsModal, setManageLevelsModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<{ id: string; name: string; description: string } | null>(null);

  // 5. Confirm Delete Level Modal
  const [confirmDeleteLevel, setConfirmDeleteLevel] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Branch options
  const branchOptions = useMemo(() => {
    const list = [{ value: "ALL", label: "Semua Cabang" }];
    branches.forEach((b) => {
      list.push({ value: b.name, label: `Cabang ${b.name}` });
    });
    return list;
  }, [branches]);

  // Class options
  const classOptions = useMemo(() => {
    const list = [{ value: "ALL", label: "Semua Kelas" }];
    const branchFilteredClasses = selectedBranch !== "ALL"
      ? classes.filter((c) => c.branch === selectedBranch)
      : classes;
    branchFilteredClasses.forEach((c) => {
      if (!list.some((item) => item.value === c.name)) {
        list.push({ value: c.name, label: c.name });
      }
    });
    return list;
  }, [classes, selectedBranch]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Branch filter
      if (selectedBranch !== "ALL" && s.branch !== selectedBranch) return false;

      // Program filter
      if (selectedProgram !== "ALL") {
        const prog = (s as any).programType || "MATEMATIKA";
        if (prog !== selectedProgram) return false;
      }

      // Class filter
      if (selectedClass !== "ALL" && s.className !== selectedClass) return false;

      // Status filter
      if (statusFilter === "ACTIVE") {
        if (s.status && s.status !== "ACTIVE" && s.status !== "Aktif") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesCode = (s.studentCode || "").toLowerCase().includes(q);
        const matchesClass = (s.className || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesClass) return false;
      }

      return true;
    });
  }, [students, selectedBranch, selectedProgram, selectedClass, statusFilter, searchQuery]);

  // Map of student level records: `studentId_levelId` -> StudentLevelRecord
  const recordMap = useMemo(() => {
    const map = new Map<string, StudentLevelRecord>();
    studentLevelRecords.forEach((r) => {
      map.set(`${r.studentId}_${r.levelId}`, r);
    });
    return map;
  }, [studentLevelRecords]);

  // Calculate student's highest achieved level
  const getStudentHighestLevel = (studentId: string): { levelNumber: number; name: string; date?: string } => {
    let highest: { levelNumber: number; name: string; date?: string } = {
      levelNumber: 0,
      name: "Belum Ada",
    };

    levelColumns.forEach((col) => {
      const rec = recordMap.get(`${studentId}_${col.id}`);
      if (rec && rec.passedDate) {
        if (col.levelNumber > highest.levelNumber) {
          highest = {
            levelNumber: col.levelNumber,
            name: col.name,
            date: rec.passedDate,
          };
        }
      }
    });

    return highest;
  };

  // Sorted Students
  const sortedStudents = useMemo(() => {
    const copy = [...filteredStudents];
    if (sortOrder === "A-Z") {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "Z-A") {
      copy.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "LEVEL_ASC") {
      copy.sort((a, b) => {
        const lvlA = getStudentHighestLevel(a.id).levelNumber;
        const lvlB = getStudentHighestLevel(b.id).levelNumber;
        return lvlA - lvlB;
      });
    } else if (sortOrder === "LEVEL_DESC") {
      copy.sort((a, b) => {
        const lvlA = getStudentHighestLevel(a.id).levelNumber;
        const lvlB = getStudentHighestLevel(b.id).levelNumber;
        return lvlB - lvlA;
      });
    }
    return copy;
  }, [filteredStudents, sortOrder, recordMap, levelColumns]);

  // Statistics
  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    let totalRecords = 0;
    let thisMonthCount = 0;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    filteredStudents.forEach((st) => {
      levelColumns.forEach((col) => {
        const rec = recordMap.get(`${st.id}_${col.id}`);
        if (rec && rec.passedDate) {
          totalRecords += 1;
          if (rec.passedDate.startsWith(currentMonth)) {
            thisMonthCount += 1;
          }
        }
      });
    });

    const highestLevelStudentCount = filteredStudents.filter((st) => {
      const highest = getStudentHighestLevel(st.id);
      return highest.levelNumber >= 3;
    }).length;

    return {
      totalStudents,
      totalRecords,
      thisMonthCount,
      highestLevelStudentCount,
    };
  }, [filteredStudents, levelColumns, recordMap]);

  // Handlers
  const handleOpenQuickDate = (student: StudentItem, level: LevelProgressionConfig) => {
    const existing = recordMap.get(`${student.id}_${level.id}`);
    setQuickDateModal({
      open: true,
      student,
      level,
      passedDate: existing?.passedDate || getTodayString(),
      notes: existing?.notes || "",
    });
  };

  const handleSaveQuickDate = async () => {
    if (!quickDateModal.student || !quickDateModal.level) return;
    await setStudentLevelRecord(
      quickDateModal.student.id,
      quickDateModal.level.id,
      quickDateModal.passedDate,
      quickDateModal.notes
    );
    showToast(`Tanggal kenaikan ${quickDateModal.level.name} berhasil disimpan untuk ${quickDateModal.student.name}!`);
    setQuickDateModal((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteQuickDate = async () => {
    if (!quickDateModal.student || !quickDateModal.level) return;
    await deleteStudentLevelRecord(quickDateModal.student.id, quickDateModal.level.id);
    showToast(`Catatan ${quickDateModal.level.name} dihapus.`);
    setQuickDateModal((prev) => ({ ...prev, open: false }));
  };

  // Open Full Student Modal
  const handleOpenStudentModal = (student: StudentItem) => {
    const records: Record<string, { passedDate: string; notes: string }> = {};
    levelColumns.forEach((col) => {
      const rec = recordMap.get(`${student.id}_${col.id}`);
      records[col.id] = {
        passedDate: rec?.passedDate || "",
        notes: rec?.notes || "",
      };
    });
    setStudentModal({
      open: true,
      student,
      records,
    });
  };

  const handleSaveStudentModal = async () => {
    if (!studentModal.student) return;
    const arrayRecords = Object.entries(studentModal.records).map(([levelId, data]) => ({
      levelId,
      passedDate: data.passedDate,
      notes: data.notes,
    }));
    await batchUpdateStudentLevelRecords(studentModal.student.id, arrayRecords);
    showToast(`Riwayat kenaikan level untuk ${studentModal.student.name} berhasil diperbarui!`);
    setStudentModal((prev) => ({ ...prev, open: false }));
  };

  // Add Level Column
  const handleCreateLevel = () => {
    if (!addLevelModal.name.trim()) return;
    addLevelColumn(addLevelModal.name, addLevelModal.description);
    showToast(`Kolom "${addLevelModal.name}" berhasil ditambahkan!`);
    setAddLevelModal({ open: false, name: "", description: "" });
  };

  // Update Level Column
  const handleSaveEditLevel = () => {
    if (!editingLevel || !editingLevel.name.trim()) return;
    updateLevelColumn(editingLevel.id, editingLevel.name, editingLevel.description);
    showToast(`Level "${editingLevel.name}" berhasil diperbarui!`);
    setEditingLevel(null);
  };

  // Delete Level Column
  const handleExecuteDeleteLevel = () => {
    if (!confirmDeleteLevel.id) return;
    deleteLevelColumn(confirmDeleteLevel.id);
    showToast(`Kolom level berhasil dihapus.`);
    setConfirmDeleteLevel({ open: false, id: "", name: "" });
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 p-3 sm:p-5 lg:p-7 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Status Bar Component */}
      <TopStatusBar title="Kenaikan Level Siswa" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl shadow-emerald-900/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              Catatan Akademik & Sertifikasi Level
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Kenaikan Level Siswa
            </h1>
            <p className="text-emerald-50 text-sm max-w-2xl leading-relaxed">
              Pencatatan riwayat & tanggal kenaikan level siswa per cabang. Pantau progres kenaikan dari Level 1, 2, 3 hingga level lanjutan secara rapi dan akurat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextNum = levelColumns.length + 1;
                setAddLevelModal({
                  open: true,
                  name: `Level ${nextNum}`,
                  description: `Kompetensi Level ${nextNum}`,
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Tambah Level
            </button>

            <button
              type="button"
              onClick={() => setManageLevelsModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold transition-colors cursor-pointer"
              title="Kelola Daftar Level"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Kelola Level
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold transition-colors cursor-pointer"
              title="Cetak Laporan / PDF"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#0d162f] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Siswa Terdaftar</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalStudents} <span className="text-xs font-normal text-slate-400">anak</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d162f] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kenaikan Level Bulan Ini</p>
            <p className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 mt-0.5">
              {stats.thisMonthCount} <span className="text-xs font-normal text-slate-400">rekor</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d162f] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Rekor Kenaikan</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {stats.totalRecords} <span className="text-xs font-normal text-slate-400">level</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d162f] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lulus Level 3+ (Mahir)</p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {stats.highestLevelStudentCount} <span className="text-xs font-normal text-slate-400">anak</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Controls Panel */}
      <div className="bg-white dark:bg-[#0d162f] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#1c2a4f] bg-slate-50/50 dark:bg-[#0a1125] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Cabang Filter */}
            {isSuperAdmin ? (
              <div className="min-w-[170px]">
                <CustomSelect
                  value={selectedBranch}
                  onChange={(val) => setSelectedBranch(val)}
                  options={branchOptions}
                />
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Building2 className="w-3.5 h-3.5" />
                Cabang {allowedBranch || "Singkut"}
              </div>
            )}

            {/* Program Filter */}
            <div className="min-w-[150px]">
              <CustomSelect
                value={selectedProgram}
                onChange={(val) => setSelectedProgram(val as any)}
                options={[
                  { value: "ALL", label: "Semua Program" },
                  { value: "MATEMATIKA", label: "Matematika" },
                  { value: "MEMBACA", label: "Membaca" },
                ]}
              />
            </div>

            {/* Kelas Filter */}
            <div className="min-w-[140px]">
              <CustomSelect
                value={selectedClass}
                onChange={(val) => setSelectedClass(val)}
                options={classOptions}
              />
            </div>

            {/* Sort Order */}
            <div className="min-w-[140px]">
              <CustomSelect
                value={sortOrder}
                onChange={(val) => setSortOrder(val as any)}
                options={[
                  { value: "A-Z", label: "Nama A - Z" },
                  { value: "Z-A", label: "Nama Z - A" },
                  { value: "LEVEL_DESC", label: "Level Tertinggi" },
                  { value: "LEVEL_ASC", label: "Level Terendah" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Informative Ribbon */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#162244]">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              Klik tombol tanggal pada kolom level untuk mengisi atau mengubah tanggal kelulusan level siswa.
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Menampilkan {sortedStudents.length} siswa
          </span>
        </div>
      </div>

      {/* Main Level Progression Matrix Table */}
      <div className="bg-white dark:bg-[#0d162f] rounded-2xl border border-slate-200/80 dark:border-[#1c2a4f] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#0a1125] border-b border-slate-200 dark:border-[#1c2a4f] text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 min-w-[220px]">Nama Siswa</th>
                {selectedBranch === "ALL" && (
                  <th className="py-3.5 px-4 w-28">Cabang</th>
                )}
                <th className="py-3.5 px-4 w-28">Kelas</th>

                {/* Dynamic Level Columns: Level 1, Level 2, Level 3, ... */}
                {levelColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-3 min-w-[140px] text-center bg-emerald-50/40 dark:bg-emerald-950/20 border-l border-r border-slate-200/70 dark:border-[#1c2a4f]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                        {col.name}
                      </span>
                      {col.description && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate max-w-[120px]" title={col.description}>
                          {col.description}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                <th className="py-3.5 px-4 text-center w-36">Level Saat Ini</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#162244]">
              {sortedStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5 + levelColumns.length}
                    className="py-12 text-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 opacity-40" />
                      <p className="font-medium text-sm">Tidak ada siswa yang sesuai dengan filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedStudents.map((st, idx) => {
                  const highest = getStudentHighestLevel(st.id);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#101b3a]/50 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Nama Siswa */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {st.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                {st.name}
                              </span>
                              {(st as any).programType === "MEMBACA" && (
                                <span className="px-1.5 py-0.2 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                                  Baca
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block truncate">
                              ID: {st.studentCode || "-"} • {st.gender === "L" ? "Laki-laki" : "Perempuan"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cabang (if viewing all) */}
                      {selectedBranch === "ALL" && (
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {st.branch}
                          </span>
                        </td>
                      )}

                      {/* Kelas */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#142042] text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {st.className || "-"}
                        </span>
                      </td>

                      {/* Level Columns */}
                      {levelColumns.map((col) => {
                        const rec = recordMap.get(`${st.id}_${col.id}`);
                        const hasDate = Boolean(rec && rec.passedDate);

                        return (
                          <td
                            key={col.id}
                            className="py-3 px-3 text-center border-l border-r border-slate-100 dark:border-[#162244]"
                          >
                            {hasDate ? (
                              <button
                                type="button"
                                onClick={() => handleOpenQuickDate(st, col)}
                                className="w-full inline-flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 transition-all cursor-pointer group/btn"
                                title={`Lulus ${col.name}: ${formatIndonesianDate(rec?.passedDate)}. Klik untuk ubah.`}
                              >
                                <div className="flex items-center gap-1 text-xs font-black">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>{formatIndonesianDate(rec?.passedDate)}</span>
                                </div>
                                {rec?.notes && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate max-w-[110px] font-normal">
                                    {rec.notes}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenQuickDate(st, col)}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-[#1f2f58] hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
                                title={`Belum ada tanggal untuk ${col.name}. Klik untuk mencatat.`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>Isi Tgl</span>
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Highest Level Indicator */}
                      <td className="py-3.5 px-4 text-center">
                        {highest.levelNumber > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                            <Sparkles className="w-3 h-3" />
                            {highest.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Belum naik level
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentModal(st)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#152347] dark:hover:bg-[#1b2d5c] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="Edit semua level untuk siswa ini"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Riwayat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: QUICK DATE PICKER POPUP                     */}
      {/* ---------------------------------------------------- */}
      {quickDateModal.open && quickDateModal.student && quickDateModal.level && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0d162f] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-[#1c2a4f] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162244] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Catat Kenaikan {quickDateModal.level.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                    {quickDateModal.student.name} • {quickDateModal.student.className}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickDateModal((prev) => ({ ...prev, open: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tanggal Lulus Level (Tanggal, Bulan, Tahun)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={quickDateModal.passedDate}
                    onChange={(e) => setQuickDateModal((prev) => ({ ...prev, passedDate: e.target.value }))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c2a4f] bg-slate-50/50 dark:bg-[#0a1125] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setQuickDateModal((prev) => ({ ...prev, passedDate: getTodayString() }))}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#162244] hover:bg-slate-200 dark:hover:bg-[#1f3060] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    Hari Ini
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Format tampilan: {formatIndonesianDate(quickDateModal.passedDate)}
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Nilai kuis 98, siap lanjut Level berikutnya"
                  value={quickDateModal.notes}
                  onChange={(e) => setQuickDateModal((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#1c2a4f] bg-slate-50/50 dark:bg-[#0a1125] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#162244]">
              {recordMap.get(`${quickDateModal.student.id}_${quickDateModal.level.id}`) ? (
                <button
                  type="button"
                  onClick={handleDeleteQuickDate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Catatan
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuickDateModal((prev) => ({ ...prev, open: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#142042] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickDate}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: EDIT FULL RIWAYAT SISWA                     */}
      {/* ---------------------------------------------------- */}
      {studentModal.open && studentModal.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0d162f] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-[#1c2a4f] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162244] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {studentModal.student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Riwayat Kenaikan Level
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {studentModal.student.name} ({studentModal.student.branch} • {studentModal.student.className})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStudentModal((prev) => ({ ...prev, open: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Centang dan isi tanggal lulus untuk setiap level yang telah diselesaikan siswa ini:
            </p>

            <div className="space-y-3">
              {levelColumns.map((col) => {
                const currentData = studentModal.records[col.id] || { passedDate: "", notes: "" };
                const isPassed = Boolean(currentData.passedDate);

                return (
                  <div
                    key={col.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPassed
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50/50 dark:bg-[#0a1125] border-slate-200 dark:border-[#1c2a4f]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`chk-${col.id}`}
                          checked={isPassed}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setStudentModal((prev) => ({
                              ...prev,
                              records: {
                                ...prev.records,
                                [col.id]: {
                                  ...prev.records[col.id],
                                  passedDate: checked ? getTodayString() : "",
                                },
                              },
                            }));
                          }}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label
                          htmlFor={`chk-${col.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                        >
                          {col.name}
                        </label>
                      </div>

                      {col.description && (
                        <span className="text-[11px] text-slate-400">
                          {col.description}
                        </span>
                      )}
                    </div>

                    {isPassed && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/50 animate-in fade-in">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Tanggal Lulus (Tgl/Bln/Thn)
                          </label>
                          <input
                            type="date"
                            value={currentData.passedDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStudentModal((prev) => ({
                                ...prev,
                                records: {
                                  ...prev.records,
                                  [col.id]: {
                                    ...prev.records[col.id],
                                    passedDate: val,
                                  },
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#1c2a4f] bg-white dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Catatan / Nilai
                          </label>
                          <input
                            type="text"
                            placeholder="Catatan kelulusan..."
                            value={currentData.notes}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStudentModal((prev) => ({
                                ...prev,
                                records: {
                                  ...prev.records,
                                  [col.id]: {
                                    ...prev.records[col.id],
                                    notes: val,
                                  },
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#1c2a4f] bg-white dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#162244]">
              <button
                type="button"
                onClick={() => setStudentModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#142042] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStudentModal}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Riwayat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: TAMBAH KOLOM LEVEL BARU                     */}
      {/* ---------------------------------------------------- */}
      {addLevelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0d162f] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-[#1c2a4f] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162244] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Tambah Kolom Level
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tambahkan level berikutnya (misal Level 4, Level 5, dst.)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddLevelModal((prev) => ({ ...prev, open: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Kolom Level <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Level 4 atau Level Mahir"
                  value={addLevelModal.name}
                  onChange={(e) => setAddLevelModal((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c2a4f] bg-slate-50/50 dark:bg-[#0a1125] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Keterangan / Topik Level
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perkalian & Pembagian Cepat Jari"
                  value={addLevelModal.description}
                  onChange={(e) => setAddLevelModal((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c2a4f] bg-slate-50/50 dark:bg-[#0a1125] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#162244]">
              <button
                type="button"
                onClick={() => setAddLevelModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#142042] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateLevel}
                disabled={!addLevelModal.name.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambahkan Kolom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 4: KELOLA DAFTAR LEVEL                         */}
      {/* ---------------------------------------------------- */}
      {manageLevelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0d162f] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-[#1c2a4f] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162244] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#162244] text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Kelola Kolom Level
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Edit nama atau hapus kolom level yang tidak diperlukan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setManageLevelsModal(false);
                  setEditingLevel(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editing Box */}
            {editingLevel ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Ubah Level: {editingLevel.name}
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingLevel.name}
                    onChange={(e) => setEditingLevel({ ...editingLevel, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#1c2a4f] bg-white dark:bg-[#070d1e] text-slate-900 dark:text-slate-100"
                    placeholder="Nama Level..."
                  />
                  <input
                    type="text"
                    value={editingLevel.description}
                    onChange={(e) => setEditingLevel({ ...editingLevel, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#1c2a4f] bg-white dark:bg-[#070d1e] text-slate-900 dark:text-slate-100"
                    placeholder="Deskripsi Level..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLevel(null)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-400"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditLevel}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : null}

            {/* List of Levels */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {levelColumns.map((col, idx) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0a1125] border border-slate-200/70 dark:border-[#1c2a4f]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {col.name}
                      </p>
                      {col.description && (
                        <p className="text-[11px] text-slate-400">{col.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingLevel({ id: col.id, name: col.name, description: col.description || "" })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                      title="Edit Nama Level"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {levelColumns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteLevel({ open: true, id: col.id, name: col.name })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="Hapus Kolom Level"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-[#162244]">
              <button
                type="button"
                onClick={() => {
                  setManageLevelsModal(false);
                  setEditingLevel(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#142042] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Level Modal */}
      <ConfirmModal
        isOpen={confirmDeleteLevel.open}
        title={`Hapus Kolom ${confirmDeleteLevel.name}?`}
        message={`Apakah Anda yakin ingin menghapus kolom ${confirmDeleteLevel.name}? Data tanggal kenaikan level ini untuk semua siswa akan terhapus.`}
        confirmText="Hapus Kolom"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleExecuteDeleteLevel}
        onClose={() => setConfirmDeleteLevel({ open: false, id: "", name: "" })}
      />
    </div>
  );
}

export default function KenaikanLevelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat halaman Kenaikan Level...</div>}>
      <KenaikanLevelContent />
    </Suspense>
  );
}
