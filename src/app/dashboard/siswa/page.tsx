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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeProgram === "MEMBACA" ? "Data Siswa Les Membaca" : "Data Siswa Les Matematika"}
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {filteredStudents.length} Siswa
            </span>
            <button
              type="button"
              onClick={handleSyncDB}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Tarik data siswa terbaru dari database PostgreSQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{isSyncing ? "Sinkron..." : "Sinkron DB"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeProgram === "MEMBACA"
              ? "Manajemen data siswa, level baca (Pra-Membaca s/d Lancar), dan kontak wali murid program membaca."
              : "Kelola pendaftaran, level bimbingan jari tangan, dan data kontak wali siswa."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Program Toggle Pill */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveProgram("MATEMATIKA")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MATEMATIKA"
                  ? "bg-white dark:bg-[#1a294f] text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>🔢 Matematika</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                {mathCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveProgram("MEMBACA")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeProgram === "MEMBACA"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                {readingCount}
              </span>
            </button>
          </div>

          {/* Prominent Tambah Siswa Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/25 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{activeProgram === "MEMBACA" ? "+ Tambah Siswa Membaca" : "+ Tambah Siswa Baru"}</span>
          </button>
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

      {/* Database Table (Matches Image 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded text-emerald-600 cursor-pointer"
                />
              </th>
              <th className="p-3.5">SISWA</th>
              <th className="p-3.5">ORANG TUA / HP</th>
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
                <td colSpan={8} className="p-12 text-center text-slate-400">
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
              filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Checkbox */}
                  <td className="p-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(st.id)}
                      onChange={() => toggleSelect(st.id)}
                      className="rounded text-emerald-600 cursor-pointer"
                    />
                  </td>

                  {/* Siswa Info Column */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {st.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          #{st.studentCode}
                        </span>
                        <span className="px-1 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {st.gender}
                        </span>
                        <span className="px-1 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {st.codeLabel}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          {st.branch.toLowerCase()}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ★ {st.className}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Alamat: {st.address}
                      </div>
                    </div>
                  </td>

                  {/* Ortu / HP */}
                  <td className="p-3.5">
                    <div className="font-bold text-slate-800">{st.parentName}</div>
                    <a
                      href={`https://wa.me/${st.parentWhatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold hover:underline text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      {st.parentWhatsapp}
                    </a>
                  </td>

                  {/* Level */}
                  <td className="p-3.5 font-bold text-slate-800">
                    <div>{st.levelCurriculum.split(":")[0]}:</div>
                    <div className="text-[10px] font-normal text-slate-500 truncate max-w-[140px]">
                      {st.levelCurriculum.split(":")[1] || ""}
                    </div>
                  </td>

                  {/* Materi Aktif Button */}
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => setViewingGuide(st)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:hover:bg-[#132042] text-slate-700 hover:text-emerald-600 dark:hover:text-sky-400 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Pilih / Lihat Panduan
                    </button>
                  </td>

                  {/* Gabung Sejak */}
                  <td className="p-3.5 text-slate-500 font-medium">
                    {st.registeredDate}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      Aktif
                    </span>
                  </td>

                  {/* Action Icons (Matches Image 2) */}
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => alert(`Ekspor data ${st.name}`)}
                        className="p-1 hover:text-slate-700"
                        title="Unduh Data"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(st)}
                        className="p-1 hover:text-indigo-600"
                        title="Edit Siswa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href="/dashboard/kartu-qr"
                        className="p-1 hover:text-emerald-600"
                        title="Kartu QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setViewingDetail(st)}
                        className="p-1 hover:text-emerald-600"
                        title="Detail Siswa"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus data siswa ${st.name}?`)) {
                            deleteStudent(st.id);
                          }
                        }}
                        className="p-1 hover:text-emerald-600"
                        title="Hapus Siswa"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1d2d5a]">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                {editingStudent ? `Edit Siswa: ${editingStudent.name}` : "Tambah Siswa Baru"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingStudent ? handleSubmitEdit : handleSubmitAdd} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama anak..."
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">ID Kode Siswa</label>
                  <input
                    type="text"
                    required
                    value={form.studentCode}
                    onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Gender</label>
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
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Cabang</label>
                  <CustomSelect
                    value={form.branch}
                    disabled={!isSuperAdmin}
                    onChange={(val) => setForm({ ...form, branch: val as any })}
                    className="w-full"
                    size="md"
                    options={branches.map((b) => ({
                      value: b.name,
                      label: `Cabang: ${b.name}`,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Kelas Bimbingan</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    required
                    value={form.parentName}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                    placeholder="Nama wali..."
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    required
                    value={form.parentWhatsapp}
                    onChange={(e) => setForm({ ...form, parentWhatsapp: e.target.value })}
                    placeholder="0812..."
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Tempat & Tanggal Lahir</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.birthPlace}
                      onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                      placeholder="Kota"
                      className="p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                      className="p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Keterangan Kelas Sekolah</label>
                  <input
                    type="text"
                    value={form.gradeLevel}
                    onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                    placeholder="Ket: Kelas 4"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">
                  Tingkat Level Kurikulum ({form.programType === "MEMBACA" ? "Membaca" : "Matematika"})
                </label>
                <CustomSelect
                  value={form.levelCurriculum}
                  onChange={(val) => setForm({ ...form, levelCurriculum: val })}
                  className="w-full"
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

              {/* Program Type */}
              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Program Les</label>
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
                        setForm({
                          ...form,
                          programType: nextProg,
                          levelCurriculum:
                            nextProg === "MEMBACA"
                              ? "Level 1: Pra-Membaca & Pengenalan Huruf"
                              : "Level Dasar: Pengenalan Simbol Jari",
                        });
                      }}
                      className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        form.programType === prog.key
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-[#1d2d5a] text-slate-500 dark:text-slate-400 hover:border-emerald-300"
                      }`}
                    >
                      {prog.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingStudent(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md text-white font-extrabold transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : editingStudent ? "Simpan Perubahan" : "Simpan Siswa Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Siswa */}
      {viewingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Profil Lengkap Siswa</h3>
              <button
                type="button"
                onClick={() => setViewingDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{viewingDetail.name}</div>
                <div className="text-emerald-700 dark:text-emerald-300 font-medium">#{viewingDetail.studentCode} • Cabang {viewingDetail.branch}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-2">
                <div>Wali: <strong>{viewingDetail.parentName}</strong></div>
                <div>WhatsApp: <strong>{viewingDetail.parentWhatsapp}</strong></div>
                <div>Kelas: <strong>{viewingDetail.className}</strong></div>
                <div>Status: <span className="text-emerald-700 dark:text-emerald-300 font-bold">Aktif</span></div>
                <div>Lahir: {viewingDetail.birthPlace}, {viewingDetail.birthDate}</div>
                <div>Tingkat: {viewingDetail.gradeLevel}</div>
              </div>
              <div className="text-slate-600 pt-1">
                Alamat: {viewingDetail.address}
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Kurikulum:</div>
                <div className="font-bold text-slate-800">{viewingDetail.levelCurriculum}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Tutup
            </button>
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
