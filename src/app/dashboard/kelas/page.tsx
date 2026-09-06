"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAppStore, ClassItem } from "@/lib/store";

export default function KelasPage() {
  const { classes, addClass, updateClass, deleteClass, students } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [viewingStudentsClass, setViewingStudentsClass] = useState<ClassItem | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    branch: "Singkut" as "Singkut" | "Bangko",
    days: "Sabtu & Ahad",
    time: "14:00 - 15:30",
    teacher: "Febrianti Dewi, S.Pd",
    room: "Ruang A1",
    level: "Level Dasar: Pengenalan Simbol Jari",
    maxCapacity: 12,
  });

  // Calculate top stats
  const totalClasses = classes.length;
  const totalEnrolled = classes.reduce((sum, c) => sum + c.enrolledCount, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + c.maxCapacity, 0);

  // Filter classes
  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase()) ||
      c.days.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = selectedBranch === "ALL" ? true : c.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      branch: "Singkut",
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacher: "Febrianti Dewi, S.Pd",
      room: "Ruang A1",
      level: "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 12,
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
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addClass(formData);
    setIsAddOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, formData);
      setEditingClass(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Banner Card (Matches Image 1) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Kelas Bimbingan
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur kelompok belajar, pengajar, jadwal les, ruangan, dan kuota siswa tiap cabang.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + TAMBAH KELAS BARU
        </button>
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
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-sky-400 flex items-center justify-center shrink-0">
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

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="ALL">Semua Cabang</option>
          <option value="Singkut">Cabang Singkut</option>
          <option value="Bangko">Cabang Bangko</option>
        </select>
      </div>

      {/* Class Cards Grid (Matches Image 1 - 3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((c) => {
          const percent = Math.min(100, Math.round((c.enrolledCount / c.maxCapacity) * 100));

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              {/* Card Header: Branch Badge & Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
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
                        if (confirm(`Yakin ingin menghapus ${c.name}?`)) {
                          deleteClass(c.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
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
                    <span className="text-blue-700 dark:text-sky-300">
                      {c.enrolledCount} / {c.maxCapacity} Siswa ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingStudentsClass(c)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Users className="w-4 h-4" />
                  Lihat {c.enrolledCount} Siswa Terdaftar
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Pilihan Cabang</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value as any })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Singkut">Singkut</option>
                    <option value="Bangko">Bangko</option>
                  </select>
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Tingkat Level Kurikulum</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Level Dasar: Pengenalan Simbol Jari">Level Dasar: Pengenalan Simbol Jari</option>
                    <option value="Level 1: Penjumlahan & Pengurangan Angka Satuan">Level 1: Penjumlahan & Pengurangan</option>
                    <option value="Level 2: Kombinasi Teman Kecil">Level 2: Kombinasi Teman Kecil</option>
                    <option value="Level 3: Kombinasi Teman Besar">Level 3: Kombinasi Teman Besar</option>
                    <option value="Level Utama: Perkalian & Pembagian">Level Utama: Perkalian & Pembagian</option>
                  </select>
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
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white font-extrabold cursor-pointer transition-colors"
                >
                  {editingClass ? "Simpan Perubahan" : "Buat Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Enrolled Students */}
      {viewingStudentsClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Siswa Terdaftar - {viewingStudentsClass.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cabang {viewingStudentsClass.branch} • {viewingStudentsClass.days} ({viewingStudentsClass.time})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingStudentsClass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
              {students
                .filter((s) => s.branch === viewingStudentsClass.branch)
                .slice(0, viewingStudentsClass.enrolledCount || 5)
                .map((st, idx) => (
                  <div key={st.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-slate-400 font-bold">{idx + 1}</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">#{st.studentCode} • Ortu: {st.parentName}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      Aktif
                    </span>
                  </div>
                ))}
            </div>

            <button
              type="button"
              onClick={() => setViewingStudentsClass(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
