"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function SiswaPage() {
  const { students, addStudent, updateStudent, deleteStudent, classes, branches, refreshData } = useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();

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
  });

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

      return matchSearch && matchBranch && matchClass && matchGender;
    })
    .sort((a, b) => {
      if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const handleOpenAdd = () => {
    setForm({
      name: "",
      studentCode: `${Math.floor(10000 + Math.random() * 90000)}`,
      gender: "P",
      codeLabel: "8P",
      branch: (allowedBranch || "Singkut") as any,
      className: "Kelas A",
      birthPlace: allowedBranch || "Singkut",
      birthDate: "2018-01-01",
      address: "Jl. Poros",
      gradeLevel: "Ket: Kelas 3",
      parentName: "",
      parentWhatsapp: "0812-",
      levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
      registeredDate: new Date().toISOString().split("T")[0],
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
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent(form);
    setIsAddOpen(false);
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
      {/* Top Header (Matches Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Database Siswa Math Fingers
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {students.length} Siswa
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
            <button
              type="button"
              onClick={handleOpenAdd}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="Tambah Siswa Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola pendaftaran, level bimbingan, dan data kontak wali siswa.
          </p>
        </div>
      </div>

      {/* 6 Filter Controls Bar (Matches Image 2) */}
      <div className="bg-white dark:bg-[#0f1a36] p-3.5 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, wali, HP..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Sort A-Z */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
        >
          <option value="A-Z">Nama: A - Z</option>
          <option value="Z-A">Nama: Z - A</option>
        </select>

        {/* Cabang Filter */}
        {isSuperAdmin ? (
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">Semua Cabang</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                Cabang {b.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cabang {allowedBranch}</span>
          </div>
        )}

        {/* Kelas */}
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="ALL">Semua Kelas</option>
          <option value="Kelas A">Kelas A</option>
          <option value="Kelas B">Kelas B</option>
          <option value="CLASS A1">CLASS A1</option>
          <option value="CLASS B">CLASS B</option>
          <option value="CLASS C">CLASS C</option>
          <option value="Kelas A2">Kelas A2</option>
        </select>

        {/* Gender */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="ALL">Semua Gender</option>
          <option value="P">Perempuan (P)</option>
          <option value="L">Laki-laki (L)</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="ALL">Status: Aktif</option>
          <option value="Lulus">Status: Alumni</option>
        </select>
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
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Tidak ada data siswa yang cocok dengan filter.
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
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="P">Perempuan (P)</option>
                    <option value="L">Laki-laki (L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Cabang</label>
                  <select
                    value={form.branch}
                    disabled={!isSuperAdmin}
                    onChange={(e) => setForm({ ...form, branch: e.target.value as any })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-80 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        Cabang {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Kelas Bimbingan</label>
                  <input
                    type="text"
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Tingkat Level Kurikulum</label>
                <select
                  value={form.levelCurriculum}
                  onChange={(e) => setForm({ ...form, levelCurriculum: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Level Dasar: Pengenalan Simbol Jari">Level Dasar: Pengenalan Simbol Jari</option>
                  <option value="Level 1: Penjumlahan & Pengurangan Angka Satuan">Level 1: Penjumlahan & Pengurangan Angka Satuan</option>
                  <option value="Level 2: Kombinasi Rumus Teman Kecil">Level 2: Kombinasi Rumus Teman Kecil</option>
                  <option value="Level 3: Kombinasi Rumus Teman Besar">Level 3: Kombinasi Rumus Teman Besar</option>
                  <option value="Level Utama: Perkalian & Pembagian">Level Utama: Perkalian & Pembagian</option>
                </select>
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-extrabold transition shadow-md hover:shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  {editingStudent ? "Simpan Perubahan" : "Simpan Siswa Baru"}
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
