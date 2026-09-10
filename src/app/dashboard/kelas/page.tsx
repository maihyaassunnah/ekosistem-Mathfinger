"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  Users,
  Sparkles,
  Search,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
  DoorOpen,
  BookOpen,
  X,
  Check,
  MapPin,
  BookText,
  UserPlus,
  UserMinus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAppStore, ClassItem } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";
import CustomSelect from "@/components/ui/CustomSelect";
import ConfirmModal from "@/components/ui/ConfirmModal";

function KelasContent() {
  const { classes, addClass, updateClass, deleteClass, students, updateStudent, branches } = useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");

  const [activeProgram, setActiveProgram] = useState<"MATEMATIKA" | "MEMBACA">(
    paramProgram === "MEMBACA" ? "MEMBACA" : "MATEMATIKA"
  );

  useEffect(() => {
    if (paramProgram === "MEMBACA") {
      setActiveProgram("MEMBACA");
    } else if (paramProgram === "MATEMATIKA") {
      setActiveProgram("MATEMATIKA");
    }
  }, [paramProgram]);

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(allowedBranch || "ALL");

  // Confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "success" | "primary";
    onConfirm: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [viewingStudentsClass, setViewingStudentsClass] = useState<ClassItem | null>(null);

  // Student Enrollment CRUD states
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>("");
  const [studentSearchInModal, setStudentSearchInModal] = useState<string>("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Helpers to get live enrolled students and candidates for a class (strictly filtered by programType)
  const getEnrolledStudents = (clsName: string, branch: string, classProgType?: "MATEMATIKA" | "MEMBACA") => {
    return students.filter((s) => {
      const branchMatch = s.branch?.toLowerCase().trim() === branch?.toLowerCase().trim();
      const classMatch = s.className && s.className.toLowerCase().trim() === clsName.toLowerCase().trim();
      const progMatch = classProgType
        ? (classProgType === "MEMBACA" ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA")
        : true;
      return branchMatch && classMatch && progMatch;
    });
  };

  const getCandidateStudents = (clsName: string, branch: string, classProgType?: "MATEMATIKA" | "MEMBACA") => {
    return students.filter((s) => {
      const branchMatch = s.branch?.toLowerCase().trim() === branch?.toLowerCase().trim();
      const notInThisClass = !s.className || s.className.toLowerCase().trim() !== clsName.toLowerCase().trim();
      const progMatch = classProgType
        ? (classProgType === "MEMBACA" ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA")
        : true;
      return branchMatch && notInThisClass && progMatch;
    });
  };

  const handleEnrollStudent = (studentId: string) => {
    if (!studentId || !viewingStudentsClass) return;
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    const classProgType = (viewingStudentsClass as any).programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
    updateStudent(studentId, { className: viewingStudentsClass.name });
    const currentList = getEnrolledStudents(viewingStudentsClass.name, viewingStudentsClass.branch, classProgType);
    const newCount = currentList.length + 1;
    updateClass(viewingStudentsClass.id, { enrolledCount: newCount });

    setViewingStudentsClass({
      ...viewingStudentsClass,
      enrolledCount: newCount,
    });

    setSelectedStudentToAdd("");
    setActionFeedback(`Berhasil memasukkan ${st.name} ke kelas ${viewingStudentsClass.name}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (!viewingStudentsClass) return;

    setConfirmModalConfig({
      isOpen: true,
      title: "Konfirmasi Keluarkan Siswa",
      message: (
        <p>
          Apakah Anda yakin ingin mengeluarkan siswa <strong>{studentName}</strong> dari kelas{" "}
          <strong>{viewingStudentsClass.name}</strong>?
        </p>
      ),
      confirmText: "Ya, Keluarkan Siswa",
      variant: "danger",
      onConfirm: () => {
        const classProgType = (viewingStudentsClass as any).programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
        updateStudent(studentId, { className: "-" });
        const currentList = getEnrolledStudents(viewingStudentsClass.name, viewingStudentsClass.branch, classProgType);
        const newCount = Math.max(0, currentList.length - 1);
        updateClass(viewingStudentsClass.id, { enrolledCount: newCount });

        setViewingStudentsClass({
          ...viewingStudentsClass,
          enrolledCount: newCount,
        });

        setActionFeedback(`${studentName} telah dikeluarkan dari kelas ${viewingStudentsClass.name}`);
        setTimeout(() => setActionFeedback(null), 3500);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  useEffect(() => {
    if (allowedBranch) {
      setSelectedBranch(allowedBranch);
    }
  }, [allowedBranch]);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    branch: (allowedBranch || "Singkut") as "Singkut" | "Bangko",
    days: "Sabtu & Ahad",
    time: "14:00 - 15:30",
    teacher: "Febrianti Dewi, S.Pd",
    room: "Ruang A1",
    level: "Level Dasar: Pengenalan Simbol Jari",
    maxCapacity: 12,
    programType: "MATEMATIKA" as "MATEMATIKA" | "MEMBACA",
  });

  // Calculate top stats based on active branch and program
  const scopedClassesForBranch =
    selectedBranch === "ALL"
      ? classes
      : classes.filter((c) => c.branch === selectedBranch);

  const mathClassesCount = scopedClassesForBranch.filter((c) => (c as any).programType !== "MEMBACA").length;
  const readingClassesCount = scopedClassesForBranch.filter((c) => (c as any).programType === "MEMBACA").length;

  const scopedClassesForStats = scopedClassesForBranch.filter((c) =>
    activeProgram === "MEMBACA"
      ? (c as any).programType === "MEMBACA"
      : (c as any).programType !== "MEMBACA"
  );

  const totalClasses = scopedClassesForStats.length;
  const totalEnrolled = scopedClassesForStats.reduce(
    (sum, c) =>
      sum +
      getEnrolledStudents(
        c.name,
        c.branch,
        (c as any).programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA"
      ).length,
    0
  );
  const totalCapacity = scopedClassesForStats.reduce((sum, c) => sum + c.maxCapacity, 0);

  // Filter classes
  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase()) ||
      c.days.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = selectedBranch === "ALL" ? true : c.branch === selectedBranch;
    const matchesProgram =
      activeProgram === "MEMBACA"
        ? (c as any).programType === "MEMBACA"
        : (c as any).programType !== "MEMBACA";

    return matchesSearch && matchesBranch && matchesProgram;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      branch: (allowedBranch || "Singkut") as any,
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacher: "Febrianti Dewi, S.Pd",
      room: "Ruang A1",
      level:
        activeProgram === "MEMBACA"
          ? "Level 1: Pra-Membaca & Pengenalan Huruf"
          : "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 12,
      programType: activeProgram,
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (c: ClassItem) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      branch: c.branch,
      days: c.days,
      time: c.time,
      teacher: c.teacher,
      room: c.room,
      level: c.level,
      maxCapacity: c.maxCapacity,
      programType: (c as any).programType || "MATEMATIKA",
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Nama kelas wajib diisi!");
      return;
    }

    setConfirmModalConfig({
      isOpen: true,
      title: "Konfirmasi Tambah Kelas Baru",
      message: (
        <div className="space-y-2">
          <p>Apakah Anda yakin ingin menambahkan kelas baru berikut?</p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-100">{formData.name}</p>
            <p className="text-slate-600 dark:text-slate-300">
              Cabang: <strong>{formData.branch}</strong> • Jadwal: {formData.days} ({formData.time})
            </p>
          </div>
        </div>
      ),
      confirmText: "Ya, Simpan Kelas",
      variant: "success",
      onConfirm: () => {
        addClass(formData as any);
        setIsAddOpen(false);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        setActionFeedback(`Kelas "${formData.name}" berhasil dibuat.`);
        setTimeout(() => setActionFeedback(null), 3500);
      },
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    if (!formData.name.trim()) {
      alert("Nama kelas wajib diisi!");
      return;
    }

    setConfirmModalConfig({
      isOpen: true,
      title: "Konfirmasi Simpan Perubahan Kelas",
      message: (
        <div className="space-y-2">
          <p>Apakah Anda yakin ingin menyimpan perubahan pada kelas <strong>{editingClass.name}</strong>?</p>
        </div>
      ),
      confirmText: "Ya, Simpan Perubahan",
      variant: "success",
      onConfirm: () => {
        updateClass(editingClass.id, formData);
        setEditingClass(null);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        setActionFeedback(`Perubahan kelas "${formData.name}" berhasil disimpan.`);
        setTimeout(() => setActionFeedback(null), 3500);
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeProgram === "MEMBACA" ? "Kelas Les Membaca" : "Kelas Les Matematika"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeProgram === "MEMBACA"
                ? "Atur jadwal kelompok membaca, level baca, tutor, dan kuota ruang kelas."
                : "Atur kelompok belajar jari tangan, pengajar, jadwal les, dan kuota siswa."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Program Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <button
              type="button"
              onClick={() => setActiveProgram("MATEMATIKA")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MATEMATIKA"
                  ? "bg-white dark:bg-[#1a294f] text-emerald-700 dark:text-emerald-300 shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              <span>🔢 Matematika</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                {mathClassesCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveProgram("MEMBACA")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MEMBACA"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25 font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              <span>📖 Membaca</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeProgram === "MEMBACA"
                    ? "bg-white/25 text-white"
                    : "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                }`}
              >
                {readingClassesCount}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-extrabold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ TAMBAH KELAS</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards (Matches Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">Total Kelas</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalClasses} <span className="text-xs font-normal text-slate-500">Kelompok</span>
            </div>
          </div>
        </div>

        {/* Card 2: Siswa Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">Siswa Terdaftar di Kelas</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalEnrolled} <span className="text-xs font-normal text-slate-500">Siswa</span>
            </div>
          </div>
        </div>

        {/* Card 3: Kapasitas Kuota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">Kapasitas Kuota Bangku</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {totalCapacity} <span className="text-xs font-normal text-slate-500">Tempat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar (Matches Image 1) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kelas, pengajar, jadwal..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {isSuperAdmin ? (
          <CustomSelect
            value={selectedBranch}
            onChange={setSelectedBranch}
            size="md"
            options={[
              { value: "ALL", label: "Semua Cabang" },
              ...branches.map((b) => ({
                value: b.name,
                label: `Cabang: ${b.name}`,
              })),
            ]}
          />
        ) : (
          <div className="w-full sm:w-auto px-4 py-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cabang {allowedBranch}</span>
          </div>
        )}
      </div>

      {/* Class Cards Grid (Matches Image 1 - 3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((c) => {
          const currentEnrolled = getEnrolledStudents(
            c.name,
            c.branch,
            (c as any).programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA"
          );
          const currentCount = currentEnrolled.length;
          const percent = Math.min(100, Math.round((currentCount / c.maxCapacity) * 100));

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              {/* Card Header: Branch Badge & Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CABANG {c.branch.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title="Edit Kelas"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModalConfig({
                          isOpen: true,
                          title: "Konfirmasi Hapus Kelas",
                          message: (
                            <div className="space-y-2">
                              <p>Apakah Anda yakin ingin menghapus kelas <strong className="text-slate-900 dark:text-white">{c.name}</strong> ({c.branch})?</p>
                              <p className="text-[11px] text-rose-500 font-semibold">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                          ),
                          confirmText: "Ya, Hapus Kelas",
                          variant: "danger",
                          onConfirm: () => {
                            deleteClass(c.id);
                            setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
                            setActionFeedback(`Kelas "${c.name}" berhasil dihapus.`);
                            setTimeout(() => setActionFeedback(null), 3500);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Class Title */}
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {c.name}
                </h2>

                {/* Info Items */}
                <div className="space-y-1.5 text-xs text-slate-600 mt-2.5 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.days}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Pengajar: <strong className="text-slate-800">{c.teacher}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      Ruangan: <strong className="text-slate-800">{c.room}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{c.level}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & View Enrolled Button */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-500">Terisi:</span>
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {currentCount} / {c.maxCapacity} Siswa ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewingStudentsClass(c);
                    setSelectedStudentToAdd("");
                    setStudentSearchInModal("");
                    setActionFeedback(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Users className="w-4 h-4" />
                  Lihat {currentCount} Siswa Terdaftar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Class */}
      {(isAddOpen || editingClass) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {editingClass ? `Edit Kelas ${editingClass.name}` : "Tambah Kelas Bimbingan Baru"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingClass(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingClass ? handleSubmitEdit : handleSubmitAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Kelas</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kelas A1"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Pilihan Cabang</label>
                  <CustomSelect
                    value={formData.branch}
                    disabled={!isSuperAdmin}
                    onChange={(val) => setFormData({ ...formData, branch: val as any })}
                    className="w-full"
                    size="md"
                    options={branches.map((b) => ({
                      value: b.name,
                      label: `Cabang: ${b.name}`,
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Hari Pertemuan</label>
                  <input
                    type="text"
                    required
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="Contoh: Sabtu & Ahad"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Jam Les</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="Contoh: 14:00 - 15:30"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Pengajar</label>
                  <input
                    type="text"
                    required
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="Contoh: Febrianti Dewi, S.Pd"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Ruangan</label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Contoh: Ruang A1"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Program Selector in Form */}
              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">
                  Program Bimbingan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "MATEMATIKA", label: "🔢 Les Matematika" },
                    { key: "MEMBACA", label: "📖 Les Membaca" },
                  ].map((prog) => (
                    <button
                      key={prog.key}
                      type="button"
                      onClick={() => {
                        const nextProg = prog.key as "MATEMATIKA" | "MEMBACA";
                        setFormData({
                          ...formData,
                          programType: nextProg,
                          level:
                            nextProg === "MEMBACA"
                              ? "Level 1: Pra-Membaca & Pengenalan Huruf"
                              : "Level Dasar: Pengenalan Simbol Jari",
                        });
                      }}
                      className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        formData.programType === prog.key
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-[#1d2d5a] text-slate-500 dark:text-slate-400 hover:border-emerald-300"
                      }`}
                    >
                      {prog.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">
                    Level Kurikulum ({formData.programType === "MEMBACA" ? "Membaca" : "Matematika"})
                  </label>
                  <CustomSelect
                    value={formData.level}
                    onChange={(val) => setFormData({ ...formData, level: val })}
                    className="w-full"
                    size="md"
                    options={
                      formData.programType === "MEMBACA"
                        ? [
                            { value: "Level 1: Pra-Membaca & Pengenalan Huruf", label: "Level 1: Pra-Membaca & Pengenalan Huruf" },
                            { value: "Level 2: Merangkai Suku Kata Sederhana", label: "Level 2: Merangkai Suku Kata Sederhana" },
                            { value: "Level 3: Merangkai Kata 2 Suku Kata", label: "Level 3: Merangkai Kata 2 Suku Kata" },
                            { value: "Level 4: Kata Bervokal & Konsonan Ganda", label: "Level 4: Kata Bervokal & Konsonan Ganda" },
                            { value: "Level 5: Membaca Kalimat Sederhana", label: "Level 5: Membaca Kalimat Sederhana" },
                            { value: "Level 6: Membaca Paragraf Pendek", label: "Level 6: Membaca Paragraf Pendek & Cerita" },
                            { value: "Level 7: Lancar Membaca & Pemahaman Teks", label: "Level 7: Lancar Membaca & Pemahaman Teks" },
                          ]
                        : [
                            { value: "Level Dasar: Pengenalan Simbol Jari", label: "Level Dasar: Pengenalan Simbol Jari" },
                            { value: "Level 1: Penjumlahan & Pengurangan Angka Satuan", label: "Level 1: Penjumlahan & Pengurangan" },
                            { value: "Level 2: Kombinasi Teman Kecil", label: "Level 2: Kombinasi Teman Kecil" },
                            { value: "Level 3: Kombinasi Teman Besar", label: "Level 3: Kombinasi Teman Besar" },
                            { value: "Level Utama: Perkalian & Pembagian", label: "Level Utama: Perkalian & Pembagian" },
                          ]
                    }
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Kapasitas</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingClass(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-extrabold cursor-pointer transition-colors"
                >
                  {editingClass ? "Simpan Perubahan" : "Buat Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View & Manage Enrolled Students (CRUD Masukkan & Keluarkan Siswa) */}
      {viewingStudentsClass && (() => {
        const classProgType = (viewingStudentsClass as any).programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
        const currentEnrolled = getEnrolledStudents(
          viewingStudentsClass.name,
          viewingStudentsClass.branch,
          classProgType
        );
        const candidates = getCandidateStudents(
          viewingStudentsClass.name,
          viewingStudentsClass.branch,
          classProgType
        );
        const filteredEnrolled = currentEnrolled.filter(
          (st) =>
            st.name.toLowerCase().includes(studentSearchInModal.toLowerCase()) ||
            st.studentCode.toLowerCase().includes(studentSearchInModal.toLowerCase()) ||
            (st.parentName && st.parentName.toLowerCase().includes(studentSearchInModal.toLowerCase()))
        );
        const percent = Math.min(
          100,
          Math.round((currentEnrolled.length / viewingStudentsClass.maxCapacity) * 100)
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[90vh] flex flex-col justify-between">
              {/* Modal Top Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                        Siswa Terdaftar – {viewingStudentsClass.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {currentEnrolled.length} Siswa
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      Cabang {viewingStudentsClass.branch} • {viewingStudentsClass.days} ({viewingStudentsClass.time}) • Tutor: {viewingStudentsClass.teacher} • Ruang: {viewingStudentsClass.room}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setViewingStudentsClass(null);
                      setActionFeedback(null);
                    }}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Capacity Status Progress Bar */}
                <div className="p-3 bg-slate-50 dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Kapasitas Kuota: <strong className="text-slate-900 dark:text-white">{currentEnrolled.length}</strong> / {viewingStudentsClass.maxCapacity} Siswa
                    </span>
                    <span
                      className={`text-[11px] font-extrabold ${
                        percent >= 100
                          ? "text-rose-600"
                          : percent >= 80
                          ? "text-amber-600"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {percent >= 100
                        ? "⚠️ Kuota Penuh"
                        : `Tersisa ${Math.max(0, viewingStudentsClass.maxCapacity - currentEnrolled.length)} Kursi`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100
                          ? "bg-rose-500"
                          : percent >= 80
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Feedback Notification */}
              {actionFeedback && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{actionFeedback}</span>
                </div>
              )}

              {/* Form Masukkan Siswa dari Data Kelas */}
              <div className="bg-emerald-50/70 dark:bg-[#0b1329] p-3.5 rounded-2xl border border-emerald-200/80 dark:border-[#1d2d5a] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>Masukkan Siswa Cabang {viewingStudentsClass.branch} ({classProgType === "MEMBACA" ? "Les Membaca" : "Les Matematika"})</span>
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {candidates.length} siswa siap dimasukkan
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <CustomSelect
                    value={selectedStudentToAdd}
                    onChange={setSelectedStudentToAdd}
                    className="flex-1"
                    size="md"
                    placeholder={`-- Pilih Siswa Cabang ${viewingStudentsClass.branch} --`}
                    options={[
                      { value: "", label: `-- Pilih Siswa Cabang ${viewingStudentsClass.branch} (${classProgType === "MEMBACA" ? "Les Membaca" : "Les Matematika"}) --` },
                      ...candidates.map((st) => ({
                        value: st.id,
                        label: `${st.name} (#${st.studentCode}) ${st.className && st.className !== "-" ? `• [Pindah dari: ${st.className}]` : `• [Belum ada kelas]`}`,
                      })),
                    ]}
                  />

                  <button
                    type="button"
                    disabled={!selectedStudentToAdd}
                    onClick={() => handleEnrollStudent(selectedStudentToAdd)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Masukkan</span>
                  </button>
                </div>
              </div>

              {/* Daftar Siswa Terdaftar Header & Search Filter */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Siswa di Kelas Ini ({currentEnrolled.length})
                </span>
                {currentEnrolled.length > 3 && (
                  <div className="relative w-44 sm:w-52">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama / kode..."
                      value={studentSearchInModal}
                      onChange={(e) => setStudentSearchInModal(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-[11px] bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Scrollable Enrolled Student List */}
              <div className="flex-1 overflow-y-auto max-h-60 sm:max-h-64 space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredEnrolled.length > 0 ? (
                  filteredEnrolled.map((st, idx) => (
                    <div
                      key={st.id}
                      className="pt-2 flex items-center justify-between text-xs gap-3 hover:bg-slate-50/80 dark:hover:bg-[#132042]/50 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="font-extrabold text-slate-900 dark:text-white truncate">
                            {st.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            #{st.studentCode} • Ortu: {st.parentName || "-"} {st.parentWhatsapp ? `(${st.parentWhatsapp})` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Aktif
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(st.id, st.name)}
                          className="px-2 py-1 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-900/60 transition-all flex items-center gap-1 cursor-pointer"
                          title={`Keluarkan ${st.name} dari kelas ${viewingStudentsClass.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Keluarkan</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-[#1d2d5a] rounded-2xl">
                    {currentEnrolled.length === 0
                      ? "Belum ada siswa yang terdaftar di kelas ini. Pilih nama siswa di bagian atas lalu klik '+ Masukkan' untuk mendaftarkan siswa."
                      : "Tidak ditemukan siswa yang cocok dengan kata kunci pencarian."}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => {
                    setViewingStudentsClass(null);
                    setActionFeedback(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Reusable ConfirmModal for Add, Edit, Delete Class & Remove Student */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        cancelText={confirmModalConfig.cancelText}
        variant={confirmModalConfig.variant}
        isLoading={confirmModalConfig.isLoading}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function KelasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold">
          Memuat data kelas...
        </div>
      }
    >
      <KelasContent />
    </Suspense>
  );
}
