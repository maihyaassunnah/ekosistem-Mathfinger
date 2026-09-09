"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Phone,
  BookOpen,
  QrCode,
  Download,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  Share2,
  MapPin,
  RefreshCw,
  BookText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";
import CustomSelect from "@/components/ui/CustomSelect";

// Helper format nomor WhatsApp standar Indonesia (08xx-xxxx-xxxx)
function formatPhoneNumber(phone: string): string {
  if (!phone) return "-";
  const clean = phone.replace(/[^0-9]/g, "");
  if (!clean) return phone;
  let normalized = clean;
  if (normalized.startsWith("62")) {
    normalized = "0" + normalized.slice(2);
  }
  if (normalized.length === 10) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 7)}-${normalized.slice(7)}`;
  } else if (normalized.length === 11) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 7)}-${normalized.slice(7)}`;
  } else if (normalized.length === 12) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8)}`;
  } else if (normalized.length >= 13) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8, 12)}${normalized.slice(12) ? `-${normalized.slice(12)}` : ""}`;
  }
  return clean;
}

function SiswaContent() {
  const { students, addStudent, updateStudent, deleteStudent, classes, branches, refreshData } = useAppStore();
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

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSyncDB = async () => {
    setIsSyncing(true);
    try {
      await refreshData();
      setSyncToast("Data siswa berhasil disinkronkan dengan database PostgreSQL!");
    } catch {
      setSyncToast("Sinkronisasi database selesai.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 3500);
    }
  };

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"A-Z" | "Z-A">("A-Z");
  const [branchFilter, setBranchFilter] = useState(allowedBranch || "ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (allowedBranch) {
      setBranchFilter(allowedBranch);
    }
  }, [allowedBranch]);

  useEffect(() => {
    setClassFilter("ALL");
  }, [activeProgram]);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [viewingGuide, setViewingGuide] = useState<StudentItem | null>(null);
  const [viewingDetail, setViewingDetail] = useState<StudentItem | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    studentCode: "",
    gender: "P" as "P" | "L",
    codeLabel: "8P",
    branch: "Singkut" as "Singkut" | "Bangko",
    className: "Kelas A",
    birthPlace: "Singkut",
    birthDate: "2018-01-01",
    address: "Jl. Poros Singkut",
    gradeLevel: "Ket: Kelas 4",
    parentName: "",
    parentWhatsapp: "",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: new Date().toISOString().split("T")[0],
    programType: "MATEMATIKA" as "MATEMATIKA" | "MEMBACA",
  });

  // Program counts scoped by branch
  const branchScopedForCounts =
    branchFilter === "ALL" ? students : students.filter((s) => s.branch === branchFilter);
  const mathCount = branchScopedForCounts.filter((s) => (s as any).programType !== "MEMBACA").length;
  const readingCount = branchScopedForCounts.filter((s) => (s as any).programType === "MEMBACA").length;

  // Filter & Sort Logic
  const filteredStudents = students
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.includes(searchTerm) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentWhatsapp.includes(searchTerm);

      const matchBranch = branchFilter === "ALL" ? true : s.branch === branchFilter;
      const matchClass = classFilter === "ALL" ? true : s.className === classFilter;
      const matchGender = genderFilter === "ALL" ? true : s.gender === genderFilter;
      const matchProgram =
        activeProgram === "MEMBACA"
          ? (s as any).programType === "MEMBACA"
          : (s as any).programType !== "MEMBACA";

      return matchSearch && matchBranch && matchClass && matchGender && matchProgram;
    })
    .sort((a, b) => {
      if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    const readingClassDefault =
      classes.find(
        (c) => (c as any).programType === "MEMBACA" && (allowedBranch ? c.branch === allowedBranch : true)
      )?.name || "Kelas Membaca 1";
    const mathClassDefault =
      classes.find(
        (c) => (c as any).programType !== "MEMBACA" && (allowedBranch ? c.branch === allowedBranch : true)
      )?.name || "Kelas A";

    const defaultBranch = (allowedBranch || (branchFilter !== "ALL" ? branchFilter : (branches[0]?.name || "Singkut"))) as any;

    setForm({
      name: "",
      studentCode: activeProgram === "MEMBACA" ? `MB-${Math.floor(100 + Math.random() * 900)}` : `${Math.floor(10000 + Math.random() * 90000)}`,
      gender: "P",
      codeLabel: "8P",
      branch: defaultBranch,
      className: activeProgram === "MEMBACA" ? readingClassDefault : mathClassDefault,
      birthPlace: defaultBranch,
      birthDate: "2019-01-01",
      address: "Jl. Poros Singkut",
      gradeLevel: activeProgram === "MEMBACA" ? "Level 1: Pra-Membaca & Pengenalan Huruf" : "Ket: Kelas 3",
      parentName: "",
      parentWhatsapp: "0812-",
      levelCurriculum:
        activeProgram === "MEMBACA"
          ? "Level 1: Pra-Membaca & Pengenalan Huruf"
          : "Level Dasar: Pengenalan Simbol Jari",
      registeredDate: new Date().toISOString().split("T")[0],
      programType: activeProgram,
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (st: StudentItem) => {
    setEditingStudent(st);
    setForm({
      name: st.name,
      studentCode: st.studentCode,
      gender: st.gender,
      codeLabel: st.codeLabel,
      branch: st.branch,
      className: st.className,
      birthPlace: st.birthPlace,
      birthDate: st.birthDate,
      address: st.address,
      gradeLevel: st.gradeLevel,
      parentName: st.parentName,
      parentWhatsapp: st.parentWhatsapp,
      levelCurriculum: st.levelCurriculum,
      registeredDate: st.registeredDate,
      programType: ((st as any).programType || "MATEMATIKA") as "MATEMATIKA" | "MEMBACA",
    });
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Nama siswa wajib diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      const finalProgram = form.programType || activeProgram;
      const payload = {
        ...form,
        programType: finalProgram,
        gradeLevel: finalProgram === "MEMBACA" ? form.levelCurriculum : form.gradeLevel,
      };
      await addStudent(payload);
      setIsAddOpen(false);
      setSyncToast(`Siswa "${form.name}" berhasil ditambahkan ke Les ${finalProgram === "MEMBACA" ? "Membaca" : "Matematika"}!`);
      const finalBranch = (allowedBranch as any) || form.branch || "Singkut";
      setForm({
        name: "",
        studentCode:
          finalProgram === "MEMBACA"
            ? `MB-${Math.floor(100 + Math.random() * 900)}`
            : `${Math.floor(10000 + Math.random() * 90000)}`,
        gender: "P",
        codeLabel: "8P",
        branch: finalBranch,
        className: finalProgram === "MEMBACA" ? "Kelas Membaca 1" : "Kelas A",
        birthPlace: finalBranch,
        birthDate: "2019-01-01",
        address: "Jl. Poros Singkut",
        gradeLevel:
          finalProgram === "MEMBACA"
            ? "Level 1: Pra-Membaca & Pengenalan Huruf"
            : "Ket: Kelas 3",
        parentName: "",
        parentWhatsapp: "0812-",
        levelCurriculum:
          finalProgram === "MEMBACA"
            ? "Level 1: Pra-Membaca & Pengenalan Huruf"
            : "Level Dasar: Pengenalan Simbol Jari",
        registeredDate: new Date().toISOString().split("T")[0],
        programType: finalProgram,
      });
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Gagal menambahkan siswa. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSyncToast(null), 3500);
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, form);
      setEditingStudent(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
      setShowCheckboxes(false);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="space-y-3">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeProgram === "MEMBACA" ? "Data Siswa Les Membaca" : "Data Siswa Les Matematika"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeProgram === "MEMBACA"
              ? "Manajemen data siswa, level baca (Pra-Membaca s/d Lancar), dan kontak wali murid program membaca."
              : "Kelola pendaftaran, level bimbingan jari tangan, dan data kontak wali siswa."}
          </p>
        </div>

        {/* Action Row: Program Toggle Pills on Left, and [Jumlah + Sync DB Icon + Plus Button] on Right (Strictly 1 Row) */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1 flex-nowrap">
          {/* Program Toggle Pill */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveProgram("MATEMATIKA")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MATEMATIKA"
                  ? "bg-white dark:bg-[#1a294f] text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Matematika</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                {mathCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveProgram("MEMBACA")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MEMBACA"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Membaca</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeProgram === "MEMBACA"
                    ? "bg-white/25 text-white"
                    : "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                }`}
              >
                {readingCount}
              </span>
            </button>
          </div>

          {/* Right Controls: Jumlah Siswa (angka saja), Icon-Only Sync DB, and Tambah Siswa (All in 1 line) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Jumlah Siswa Badge (Angka Saja, Tanpa kata "Siswa") */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-black shadow-2xs shrink-0 whitespace-nowrap"
              title={`${filteredStudents.length} Siswa Terdaftar`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{filteredStudents.length}</span>
            </span>

            {/* Sync DB: Icon Only */}
            <button
              type="button"
              onClick={handleSyncDB}
              disabled={isSyncing}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
              title="Sinkronisasi Database PostgreSQL"
              aria-label="Sinkron DB"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            {/* Button Tambah Siswa with Green Plus (+) Icon */}
            <button
              type="button"
              onClick={handleOpenAdd}
              title={activeProgram === "MEMBACA" ? "Tambah Siswa Membaca" : "Tambah Siswa Baru"}
              aria-label={activeProgram === "MEMBACA" ? "Tambah Siswa Membaca" : "Tambah Siswa Baru"}
              className="inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-[#0f1a36] border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0 gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
              <span className="hidden md:inline text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                Tambah Siswa
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls - Mobile Compact 3-row layout */}
      <div className="bg-white dark:bg-[#0f1a36] p-3 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-2">
        {/* Row 1: Search + Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa, wali, HP..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <CustomSelect
            value={sortOrder}
            onChange={(val) => setSortOrder(val as any)}
            size="sm"
            className="shrink-0 w-24"
            options={[
              { value: "A-Z", label: "A–Z" },
              { value: "Z-A", label: "Z–A" },
            ]}
          />
        </div>

        {/* Row 2: Cabang + Kelas */}
        <div className="grid grid-cols-2 gap-2">
          {isSuperAdmin ? (
            <CustomSelect
              value={branchFilter}
              onChange={setBranchFilter}
              size="sm"
              className="w-full"
              options={[
                { value: "ALL", label: "Semua Cabang" },
                ...branches.map((b) => ({
                  value: b.name,
                  label: `Cabang: ${b.name}`,
                })),
              ]}
            />
          ) : (
            <div className="px-2.5 py-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{allowedBranch}</span>
            </div>
          )}
          <CustomSelect
            value={classFilter}
            onChange={setClassFilter}
            size="sm"
            className="w-full"
            options={[
              { value: "ALL", label: "Semua Kelas" },
              ...classes
                .filter((c) =>
                  activeProgram === "MEMBACA"
                    ? (c as any).programType === "MEMBACA"
                    : (c as any).programType !== "MEMBACA"
                )
                .map((c) => ({
                  value: c.name,
                  label: c.name,
                })),
            ]}
          />
        </div>

        {/* Row 3: Gender + Status */}
        <div className="grid grid-cols-2 gap-2">
          <CustomSelect
            value={genderFilter}
            onChange={setGenderFilter}
            size="sm"
            className="w-full"
            options={[
              { value: "ALL", label: "Semua Gender" },
              { value: "P", label: "Perempuan" },
              { value: "L", label: "Laki-laki" },
            ]}
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            size="sm"
            className="w-full"
            options={[
              { value: "ALL", label: "Aktif" },
              { value: "Lulus", label: "Alumni" },
            ]}
          />
        </div>
      </div>

      {/* Selection Action Bar */}
      {showCheckboxes && selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
              {selectedIds.length} Siswa Terpilih
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm(`Hapus ${selectedIds.length} data siswa yang dipilih?`)) {
                  selectedIds.forEach((id) => deleteStudent(id));
                  setSelectedIds([]);
                  setShowCheckboxes(false);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedIds([]);
                setShowCheckboxes(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Database Table (Matches Image 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              {showCheckboxes && (
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-emerald-600 cursor-pointer w-4 h-4 accent-emerald-600"
                    title={selectedIds.length === filteredStudents.length ? "Batal pilih semua" : "Pilih semua"}
                  />
                </th>
              )}
              <th className="p-3.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {!showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {
                        setShowCheckboxes(true);
                        setSelectedIds(filteredStudents.map((s) => s.id));
                      }}
                      title="Klik untuk memilih siswa"
                      className="rounded text-emerald-600 cursor-pointer w-4 h-4 accent-emerald-600"
                    />
                  )}
                  <span className="w-6 text-right font-bold text-slate-400">NO</span>
                  <span className="w-40 sm:w-48 text-left font-bold text-slate-400 pl-1">NAMA SISWA</span>
                  <span className="w-6 text-center font-bold text-slate-400">JK</span>
                  <span className="w-8 text-center font-bold text-slate-400">LABEL</span>
                  <span className="w-16 text-center font-bold text-slate-400">CABANG</span>
                  <span className="w-20 text-center font-bold text-slate-400">KELAS</span>
                  {showCheckboxes && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCheckboxes(false);
                        setSelectedIds([]);
                      }}
                      className="ml-auto text-[10px] text-rose-500 hover:text-rose-700 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md cursor-pointer transition-all"
                      title="Tutup mode pilih"
                    >
                      ✕ Selesai
                    </button>
                  )}
                </div>
              </th>
              <th className="p-3.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="w-28 sm:w-36 text-left font-bold text-slate-400">ORANG TUA</span>
                  <span className="w-3 text-center font-bold text-slate-300">•</span>
                  <span className="text-left font-bold text-slate-400">NO. WHATSAPP</span>
                </div>
              </th>
              <th className="p-3.5">LEVEL</th>
              <th className="p-3.5">MATERI AKTIF</th>
              <th className="p-3.5">GABUNG SEJAK</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 text-center">AKSI</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={showCheckboxes ? 8 : 7} className="p-12 text-center text-slate-400">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                      Belum ada data siswa {activeProgram === "MEMBACA" ? "Les Membaca" : "Les Matematika"}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mulai daftarkan siswa {activeProgram === "MEMBACA" ? "bimbingan membaca fonik" : "bimbingan jaritmatika"} dengan mengklik tombol di bawah.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Siswa {activeProgram === "MEMBACA" ? "Membaca" : "Matematika"} Sekarang</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Checkbox (only visible when activated) */}
                  {showCheckboxes && (
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(st.id)}
                        onChange={() => toggleSelect(st.id)}
                        className="rounded text-emerald-600 cursor-pointer w-4 h-4 accent-emerald-600"
                      />
                    </td>
                  )}

                  {/* Siswa Info Column: STRICTLY ONE LINE with No. Urut & Vertically Aligned Badges */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* No. Urut di samping nama */}
                      <span className="w-6 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0 select-none">
                        {idx + 1}.
                      </span>

                      {/* Nama Siswa: Lebar konsisten agar baris badge sejajar dari atas ke bawah */}
                      <button
                        type="button"
                        onClick={() => setViewingDetail(st)}
                        className="w-40 sm:w-48 truncate font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer shrink-0 pl-1"
                        title={`${st.name} (Klik untuk detail lengkap)`}
                      >
                        {st.name}
                      </button>

                      {/* Jenis Kelamin (Fixed Width Slot) */}
                      <span className="w-6 h-5 flex items-center justify-center rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {st.gender}
                      </span>

                      {/* Label Usia/Sesi (Fixed Width Slot) */}
                      <span className="w-8 h-5 flex items-center justify-center rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                        {st.codeLabel}
                      </span>

                      {/* Cabang (Fixed Width Slot) */}
                      <span className="w-16 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0 capitalize">
                        {st.branch.toLowerCase()}
                      </span>

                      {/* Kelas (Fixed Width Slot) */}
                      <span className="w-20 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                        ★ {st.className}
                      </span>
                    </div>
                  </td>

                  {/* Ortu / HP: Single Line with Aligned WA Number */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs">
                      {/* Nama Orang Tua (Fixed Width agar kolom WA sejajar lurus vertikal) */}
                      <span
                        className="w-28 sm:w-36 truncate font-bold text-slate-800 dark:text-slate-200 shrink-0 pl-0.5"
                        title={st.parentName}
                      >
                        {st.parentName}
                      </span>
                      <span className="w-3 text-center text-slate-300 dark:text-slate-600 shrink-0 select-none">•</span>
                      {/* Nomor WhatsApp (Rapi 08xx-xxxx-xxxx dengan Pill Badge) */}
                      <a
                        href={`https://wa.me/${st.parentWhatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-mono text-[11px] font-semibold transition-all hover:scale-[1.02] shadow-2xs shrink-0"
                        title={`Chat WhatsApp Wali Murid (${st.parentName})`}
                      >
                        <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="tracking-tight">{formatPhoneNumber(st.parentWhatsapp)}</span>
                      </a>
                    </div>
                  </td>

                  {/* Level: Single Line */}
                  <td className="p-3.5 whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-emerald-700 dark:text-emerald-400">{st.levelCurriculum.split(":")[0]}</span>
                    {st.levelCurriculum.split(":")[1] ? (
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 ml-1">
                        - {st.levelCurriculum.split(":")[1].trim()}
                      </span>
                    ) : null}
                  </td>

                  {/* Materi Aktif Button: Single Line */}
                  <td className="p-3.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setViewingGuide(st)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Panduan</span>
                    </button>
                  </td>

                  {/* Gabung Sejak */}
                  <td className="p-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium text-xs">
                    {st.registeredDate}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                      Aktif
                    </span>
                  </td>

                  {/* Action Icons: Prominent Eye (Detail) Button */}
                  <td className="p-3.5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => setViewingDetail(st)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer shadow-2xs"
                        title="Lihat Detail Lengkap (NIS & Alamat)"
                        aria-label="Detail Siswa"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(st)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
                        title="Edit Siswa"
                        aria-label="Edit Siswa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href="/dashboard/kartu-qr"
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-all"
                        title="Kartu QR"
                        aria-label="Kartu QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus data siswa ${st.name}?`)) {
                            deleteStudent(st.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer"
                        title="Hapus Siswa"
                        aria-label="Hapus Siswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Student */}
      {(isAddOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-[#1d2d5a] flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] shrink-0">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {editingStudent ? `Edit Siswa: ${editingStudent.name}` : "Tambah Siswa Baru"}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Lengkapi data formulir siswa di bawah ini
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm cursor-pointer"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={editingStudent ? handleSubmitEdit : handleSubmitAdd} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 overscroll-contain flex-1">
                {/* 1. Nama Lengkap & ID Kode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nama lengkap anak..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      ID Kode Siswa
                    </label>
                    <input
                      type="text"
                      required
                      value={form.studentCode}
                      onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold font-mono text-slate-900 dark:text-white text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* 2. Gender, Cabang, Kelas Bimbingan */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Gender
                    </label>
                    <CustomSelect
                      value={form.gender}
                      onChange={(val) => setForm({ ...form, gender: val as any })}
                      className="w-full"
                      size="md"
                      options={[
                        { value: "P", label: "Perempuan (P)" },
                        { value: "L", label: "Laki-laki (L)" },
                      ]}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Cabang
                    </label>
                    <CustomSelect
                      value={form.branch}
                      disabled={!isSuperAdmin}
                      onChange={(val) => setForm({ ...form, branch: val as any })}
                      className="w-full"
                      align="right"
                      size="md"
                      options={branches.map((b) => ({
                        value: b.name,
                        label: b.name,
                      }))}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Kelas Bimbingan
                    </label>
                    <CustomSelect
                      value={form.className}
                      onChange={(val) => setForm({ ...form, className: val })}
                      className="w-full"
                      size="md"
                      options={[
                        ...classes
                          .filter((c) =>
                            form.programType === "MEMBACA"
                              ? (c as any).programType === "MEMBACA"
                              : (c as any).programType !== "MEMBACA"
                          )
                          .map((c) => ({
                            value: c.name,
                            label: `${c.name} (${c.branch})`,
                          })),
                        { value: "Kelas A", label: "Kelas A" },
                        { value: "Kelas Membaca 1", label: "Kelas Membaca 1" },
                        { value: "Kelas Membaca 2", label: "Kelas Membaca 2" },
                      ]}
                    />
                  </div>
                </div>

                {/* 3. Nama Wali & WhatsApp Orang Tua */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.parentName}
                      onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                      placeholder="Nama wali..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      WhatsApp Orang Tua <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.parentWhatsapp}
                      onChange={(e) => setForm({ ...form, parentWhatsapp: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* 4. Tempat & Tanggal Lahir & Keterangan Kelas Sekolah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Tempat & Tanggal Lahir
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={form.birthPlace}
                        onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                        placeholder="Kota lahir"
                        className="w-full px-3 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                      <input
                        type="date"
                        value={form.birthDate}
                        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                        className="w-full px-2 sm:px-3 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                      Keterangan Kelas Sekolah
                    </label>
                    <input
                      type="text"
                      value={form.gradeLevel}
                      onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                      placeholder="Contoh: Kelas 3 SD"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* 5. Alamat Lengkap */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Alamat domisili, jalan, atau desa..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                {/* 6. Tingkat Level Kurikulum */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                    Tingkat Level Kurikulum ({form.programType === "MEMBACA" ? "Membaca" : "Matematika"})
                  </label>
                  <CustomSelect
                    value={form.levelCurriculum}
                    onChange={(val) => setForm({ ...form, levelCurriculum: val })}
                    className="w-full"
                    menuClassName="w-full max-w-full"
                    size="md"
                    options={
                      form.programType === "MEMBACA"
                        ? [
                            { value: "Level 1: Pra-Membaca & Pengenalan Huruf", label: "Level 1: Pra-Membaca & Pengenalan Huruf (A-Z)" },
                            { value: "Level 2: Merangkai Suku Kata Sederhana", label: "Level 2: Merangkai Suku Kata Sederhana (ba, bi, bu...)" },
                            { value: "Level 3: Merangkai Kata 2 Suku Kata", label: "Level 3: Merangkai Kata 2 Suku Kata (buku, bola...)" },
                            { value: "Level 4: Merangkai Kata Bervokal & Konsonan Ganda", label: "Level 4: Kata Bervokal & Konsonan (ny, ng, kh...)" },
                            { value: "Level 5: Membaca Kalimat Sederhana", label: "Level 5: Membaca Kalimat Sederhana" },
                            { value: "Level 6: Membaca Paragraf Pendek", label: "Level 6: Membaca Paragraf Pendek & Cerita" },
                            { value: "Level 7: Lancar Membaca & Pemahaman Teks", label: "Level 7: Lancar Membaca & Pemahaman Teks" },
                          ]
                        : [
                            { value: "Level Dasar: Pengenalan Simbol Jari", label: "Level Dasar: Pengenalan Simbol Jari" },
                            { value: "Level 1: Penjumlahan & Pengurangan Angka Satuan", label: "Level 1: Penjumlahan & Pengurangan Angka Satuan" },
                            { value: "Level 2: Kombinasi Rumus Teman Kecil", label: "Level 2: Kombinasi Rumus Teman Kecil" },
                            { value: "Level 3: Kombinasi Rumus Teman Besar", label: "Level 3: Kombinasi Rumus Teman Besar" },
                            { value: "Level Utama: Perkalian & Pembagian", label: "Level Utama: Perkalian & Pembagian" },
                          ]
                    }
                  />
                </div>

                {/* 7. Program Type */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs mb-1.5">
                    Pilihan Program Les
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: "MATEMATIKA", label: "🔢 Les Matematika", desc: "Metode Jarimatika" },
                      { key: "MEMBACA", label: "📖 Les Membaca", desc: "Metode Fonik Praktis" },
                    ].map((prog) => (
                      <button
                        key={prog.key}
                        type="button"
                        onClick={() => {
                          const nextProg = prog.key as "MATEMATIKA" | "MEMBACA";
                          setForm({
                            ...form,
                            programType: nextProg,
                            levelCurriculum:
                              nextProg === "MEMBACA"
                                ? "Level 1: Pra-Membaca & Pengenalan Huruf"
                                : "Level Dasar: Pengenalan Simbol Jari",
                          });
                        }}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer text-left flex flex-col gap-0.5 ${
                          form.programType === prog.key
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-600 dark:text-slate-400 hover:border-emerald-300"
                        }`}
                      >
                        <span className="font-extrabold text-xs sm:text-sm">{prog.label}</span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{prog.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-50 dark:bg-[#0b1329] border-t border-slate-200 dark:border-[#1d2d5a] shrink-0 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingStudent(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm sm:text-xs cursor-pointer active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 text-white font-black transition cursor-pointer disabled:opacity-50 text-sm sm:text-xs active:scale-[0.98]"
                >
                  {isSubmitting ? "Menyimpan..." : editingStudent ? "Simpan Perubahan" : "Simpan Siswa Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Siswa Lengkap (Menampilkan NIS, Alamat, Wali & Kurikulum) */}
      {viewingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1d2d5a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Detail Lengkap Siswa</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Informasi identitas, alamat, dan kurikulum</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDetail(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Student Identity Card */}
            <div className="p-4 bg-slate-50 dark:bg-[#070d1e] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                  {viewingDetail.name}
                </h4>
                {/* Prominent NIS Badge */}
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                  NIS: #{viewingDetail.studentCode}
                </span>
              </div>

              {/* Status & Attributes Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {viewingDetail.gender === "P" ? "Perempuan (P)" : "Laki-laki (L)"}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Label: {viewingDetail.codeLabel}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Cabang: {viewingDetail.branch}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ★ {viewingDetail.className}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-600 text-white">
                  ✓ Aktif
                </span>
              </div>
            </div>

            {/* Alamat Lengkap Card (Prominently displayed with MapPin) */}
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Alamat Tempat Tinggal:
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 leading-relaxed">
                  {viewingDetail.address || "Belum ada data alamat tercatat"}
                </p>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Orang Tua / Wali</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">
                  {viewingDetail.parentName}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">WhatsApp Wali Murid</span>
                <a
                  href={`https://wa.me/${viewingDetail.parentWhatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5 hover:underline font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{formatPhoneNumber(viewingDetail.parentWhatsapp)}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tempat & Tanggal Lahir</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">
                  {viewingDetail.birthPlace}, {viewingDetail.birthDate}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Keterangan Jenjang</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">
                  {viewingDetail.gradeLevel || "-"}
                </span>
              </div>
            </div>

            {/* Kurikulum Info Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-[#1d2d5a]">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Program & Level Kurikulum:</span>
              <div className="font-extrabold text-emerald-700 dark:text-emerald-300 text-xs mt-0.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{(viewingDetail as any).programType === "MEMBACA" ? "Les Membaca Fonik" : "Les Matematika Jaritmatika"} &bull; {viewingDetail.levelCurriculum}</span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/${viewingDetail.parentWhatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const st = viewingDetail;
                  setViewingDetail(null);
                  handleOpenEdit(st);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-indigo-500" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingDetail(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan Level */}
      {viewingGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Panduan Level Kurikulum
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingGuide(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-[#1d2d5a]">
                <div className="font-bold text-slate-900 dark:text-white">{viewingGuide.name}</div>
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold">{viewingGuide.levelCurriculum}</div>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="font-bold text-slate-800">Target Belajar:</div>
                <ul className="pl-4 list-disc space-y-1">
                  <li>Formasi jari tangan kanan (Satuan 0 - 9)</li>
                  <li>Formasi jari tangan kiri (Puluhan 10 - 90)</li>
                  <li>Simulasi kecepatan hitung tanpa alat hitung/kalkulator</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingGuide(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
      {/* Floating Success Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />
          <span>{syncToast}</span>
        </div>
      )}
    </div>
  );
}

export default function SiswaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold">
          Memuat data siswa...
        </div>
      }
    >
      <SiswaContent />
    </Suspense>
  );
}
