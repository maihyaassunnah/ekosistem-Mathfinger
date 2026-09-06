"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Edit2,
  Trash2,
  Key,
  CheckCircle2,
  UserPlus,
  Mail,
  Lock,
  Search,
} from "lucide-react";
import { useAppStore, BranchAdminItem } from "@/lib/store";
import { BranchItem } from "@/lib/mock-data";

export default function CabangDanAdminPage() {
  const {
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    branchAdmins,
    addBranchAdmin,
    updateBranchAdmin,
    deleteBranchAdmin,
    students,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"CABANG" | "ADMIN">("CABANG");

  // Branch Form Modal State
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [branchForm, setBranchForm] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // Admin Form Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<BranchAdminItem | null>(null);
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    branchName: "Singkut" as "Singkut" | "Bangko" | "Semua Cabang (Pusat)",
    role: "Admin Cabang" as "Super Admin" | "Admin Cabang" | "Asisten Cabang",
    status: "Aktif" as "Aktif" | "Nonaktif",
    avatarUrl: "",
  });

  // Handle Branch CRUD
  const handleOpenAddBranch = () => {
    setBranchForm({
      code: "",
      name: "",
      address: "",
      phone: "0812-",
      status: "ACTIVE",
    });
    setIsAddBranchOpen(true);
  };

  const handleOpenEditBranch = (b: BranchItem) => {
    setEditingBranch(b);
    setBranchForm({
      code: b.code,
      name: b.name,
      address: b.address,
      phone: b.phone,
      status: b.status,
    });
  };

  const handleSubmitBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch(editingBranch.id, branchForm);
      setEditingBranch(null);
    } else {
      addBranch(branchForm);
      setIsAddBranchOpen(false);
    }
  };

  // Handle Admin CRUD
  const handleOpenAddAdmin = () => {
    setAdminForm({
      fullName: "",
      email: "",
      password: "password123",
      phone: "0812-",
      branchName: (branches[0]?.name as any) || "Singkut",
      role: "Admin Cabang",
      status: "Aktif",
      avatarUrl: "",
    });
    setIsAddAdminOpen(true);
  };

  const handleOpenEditAdmin = (a: BranchAdminItem) => {
    setEditingAdmin(a);
    setAdminForm({
      fullName: a.fullName,
      email: a.email,
      password: a.password || "password123",
      phone: a.phone,
      branchName: a.branchName,
      role: a.role,
      status: a.status,
      avatarUrl: a.avatarUrl || "",
    });
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAdmin) {
      updateBranchAdmin(editingAdmin.id, {
        fullName: adminForm.fullName,
        email: adminForm.email,
        phone: adminForm.phone,
        branchName: adminForm.branchName,
        role: adminForm.role,
        status: adminForm.status,
        password: adminForm.password,
        avatarUrl: adminForm.avatarUrl,
      });
      setEditingAdmin(null);
    } else {
      addBranchAdmin({
        fullName: adminForm.fullName,
        email: adminForm.email,
        phone: adminForm.phone,
        branchName: adminForm.branchName,
        role: adminForm.role,
        status: adminForm.status,
        password: adminForm.password,
        avatarUrl: adminForm.avatarUrl,
      });
      setIsAddAdminOpen(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Cabang & Akun Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sentralisasi manajemen lokasi cabang bimbingan dan penerbitan hak akses admin cabang
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab("CABANG")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "CABANG"
                ? "bg-blue-600 text-white shadow-xs"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Kelola Cabang ({branches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ADMIN")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "ADMIN"
                ? "bg-blue-600 text-white shadow-xs"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Akun Admin Cabang ({branchAdmins.length})
          </button>
        </div>
      </div>

      {activeTab === "CABANG" ? (
        /* TAB 1: KELOLA CABANG */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Daftar Seluruh Cabang Terdaftar
            </span>

            <button
              type="button"
              onClick={handleOpenAddBranch}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Buka Cabang Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((b) => {
              const studentCount = students.filter((s) => s.branch === b.name).length;
              const adminCount = branchAdmins.filter((a) => a.branchName === b.name).length;

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-extrabold text-base shadow-xs">
                          {b.code}
                        </div>
                        <div>
                          <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">
                            Cabang {b.name}
                          </h2>
                          <p className="text-xs text-slate-400">Kode Cabang: #{b.code}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {b.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditBranch(b)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Edit Cabang"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus cabang ${b.name}?`)) {
                              deleteBranch(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-[#132042] cursor-pointer"
                          title="Hapus Cabang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-[#1d2d5a]/60 mt-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{b.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Kontak: {b.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>
                          Admin Penanggung Jawab: <strong>{adminCount} Akun Terhubung</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-[#1d2d5a]/60 text-center">
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {studentCount || b.activeStudents}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Siswa Terdaftar
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-[#1d2d5a]/60 text-center">
                      <div className="text-2xl font-extrabold text-blue-600 dark:text-sky-400">
                        {adminCount}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Admin Cabang Aktif
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TAB 2: KELOLA AKUN ADMIN CABANG */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Daftar Akun Petugas & Admin Cabang
            </span>

            <button
              type="button"
              onClick={handleOpenAddAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              + Tambah Akun Admin Cabang
            </button>
          </div>

          {/* Admin Accounts Table */}
          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-[#0b1329] font-bold text-xs text-slate-500 uppercase tracking-wider grid grid-cols-12">
              <div className="col-span-4">Nama Petugas Admin</div>
              <div className="col-span-3">Email & WhatsApp</div>
              <div className="col-span-2">Penugasan Cabang</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>

            {branchAdmins.map((adm) => (
              <div
                key={adm.id}
                className="p-4 grid grid-cols-12 items-center text-xs hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#1d2d5a]">
                    {adm.avatarUrl ? (
                      <img src={adm.avatarUrl} alt={adm.fullName} className="w-full h-full object-cover" />
                    ) : (
                      adm.fullName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{adm.fullName}</div>
                    {adm.role === "Super Admin" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded-md">
                        👑 Super Admin
                      </span>
                    ) : (
                      <div className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold">{adm.role}</div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="col-span-3 space-y-0.5">
                  <div className="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{adm.email}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{adm.phone}</span>
                  </div>
                </div>

                {/* Cabang */}
                <div className="col-span-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                      adm.branchName === "Semua Cabang (Pusat)"
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200"
                        : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    {adm.branchName === "Semua Cabang (Pusat)"
                      ? "🏛️ Semua Cabang (Pusat)"
                      : `Cabang ${adm.branchName}`}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateBranchAdmin(adm.id, {
                        status: adm.status === "Aktif" ? "Nonaktif" : "Aktif",
                      })
                    }
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      adm.status === "Aktif"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {adm.status}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1 text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleOpenEditAdmin(adm)}
                    className="p-1.5 rounded-lg hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit Admin"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Password baru dikirim ke email: ${adm.email}`)}
                    className="p-1.5 rounded-lg hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Reset Password"
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus akun admin ${adm.fullName}?`)) {
                        deleteBranchAdmin(adm.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-[#132042] cursor-pointer"
                    title="Hapus Akun"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add / Edit Branch */}
      {(isAddBranchOpen || editingBranch) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {editingBranch ? `Edit Cabang ${editingBranch.name}` : "Buka Cabang Baru"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddBranchOpen(false);
                  setEditingBranch(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBranch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Cabang</label>
                  <input
                    type="text"
                    required
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    placeholder="Contoh: Sarolangun"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Kode Cabang (3 Huruf)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={branchForm.code}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: SRL"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Alamat Kantor Cabang</label>
                <textarea
                  rows={2}
                  required
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  placeholder="Alamat jalan, kelurahan, kecamatan..."
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={branchForm.phone}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  placeholder="0812-..."
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddBranchOpen(false);
                    setEditingBranch(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  {editingBranch ? "Simpan Perubahan" : "Buat Cabang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Branch Admin Account */}
      {(isAddAdminOpen || editingAdmin) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {editingAdmin ? `Edit Akun: ${editingAdmin.fullName}` : "Tambah Akun Admin Cabang"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddAdminOpen(false);
                  setEditingAdmin(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdmin} className="space-y-3.5 text-xs">
              {/* Info Banner untuk Autentikasi Google & Password */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <span className="text-base leading-none">🔐</span>
                <div className="leading-snug">
                  <strong className="font-bold text-emerald-950 dark:text-emerald-100">Akses Login Terintegrasi:</strong>
                  <p className="text-emerald-800 dark:text-emerald-300 text-[10.5px] mt-0.5">
                    Akun yang Anda daftarkan di sini dapat masuk ke aplikasi menggunakan <strong>Email & Password</strong> ATAU menggunakan <strong>Akun Google</strong> (jika Anda mendaftarkan alamat Gmail). Akun yang belum terdaftar di sini tidak akan diizinkan login.
                  </p>
                </div>
              </div>

              {/* Foto Profil dari Galeri */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-[#1d2d5a]/60 space-y-2">
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                  Foto Profil Akun (Pilih dari Galeri)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-2xs">
                    {adminForm.avatarUrl ? (
                      <img
                        src={adminForm.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black flex items-center justify-center text-sm">
                        {adminForm.fullName
                          ? adminForm.fullName.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all">
                        <span>🖼️ Unggah Foto Galeri</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAdminForm((prev) => ({
                                  ...prev,
                                  avatarUrl: reader.result as string,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {adminForm.avatarUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setAdminForm((prev) => ({ ...prev, avatarUrl: "" }))
                          }
                          className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Dapat memilih foto dari galeri HP atau komputer (JPG, PNG, WebP).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nama Lengkap Admin / Guru</label>
                <input
                  type="text"
                  required
                  value={adminForm.fullName}
                  onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                  placeholder="Contoh: Siti Aisyah, S.Pd"
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Email Akun</label>
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="nama@gmail.com"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Gunakan Gmail agar bisa login Google
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Kata Sandi (Password)</label>
                  <input
                    type="text"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="password123"
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Untuk opsi login manual
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Penugasan Cabang</label>
                  <select
                    value={adminForm.branchName}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, branchName: e.target.value as any })
                    }
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Semua Cabang (Pusat)">Semua Cabang (Pusat)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        Cabang {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Peran / Jabatan</label>
                  <select
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as any })}
                    className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin Cabang">Admin Cabang</option>
                    <option value="Asisten Cabang">Asisten Cabang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 font-extrabold mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="0812-..."
                  className="w-full p-2.5 bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddAdminOpen(false);
                    setEditingAdmin(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white font-extrabold cursor-pointer transition-colors"
                >
                  {editingAdmin ? "Simpan Akun" : "Terbitkan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
