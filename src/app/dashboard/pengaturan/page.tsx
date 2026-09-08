"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Shield,
  Key,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Building2,
  Database,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAppStore } from "@/lib/store";

export default function PengaturanPage() {
  const currentUser = useCurrentUser();
  const { branchAdmins, updateBranchAdmin } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Match current user in branchAdmins list
  const matchedAdmin = branchAdmins.find(
    (a) => a.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  useEffect(() => {
    setFullName(currentUser.name || "");
    setEmail(currentUser.email || "");
    setAvatarUrl(currentUser.avatarUrl || matchedAdmin?.avatarUrl || "");
    setPhone(matchedAdmin?.phone && matchedAdmin.phone !== "-" ? matchedAdmin.phone : "0853-8478-0910");
  }, [currentUser, matchedAdmin]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setStatusAlert({
          type: "error",
          message: "Ukuran file terlalu besar. Maksimal 4 MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusAlert(null);

    try {
      const adminId = matchedAdmin?.id;

      // Update in PostgreSQL via /api/admins
      if (adminId) {
        const payload: any = {
          id: adminId,
          fullName,
          phone,
          avatarUrl,
        };
        if (password.trim()) {
          payload.password = password.trim();
        }

        const res = await fetch("/api/admins", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Gagal menyimpan perubahan ke server.");
        }

        updateBranchAdmin(adminId, {
          fullName,
          phone,
          avatarUrl,
        });
      }

      // Update local storage so sidebar immediately reflects new name/avatar
      try {
        const currentSaved = localStorage.getItem("mf_logged_user");
        const parsed = currentSaved ? JSON.parse(currentSaved) : {};
        localStorage.setItem(
          "mf_logged_user",
          JSON.stringify({
            ...parsed,
            name: fullName,
            email,
            avatarUrl,
          })
        );
      } catch {}

      setStatusAlert({
        type: "success",
        message: "Profil dan foto berhasil diperbarui di database!",
      });
      setPassword("");
      setTimeout(() => {
        setStatusAlert(null);
        // Soft reload to refresh session avatar
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setStatusAlert({
        type: "error",
        message: err.message || "Terjadi kesalahan saat menyimpan profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials =
    (fullName || currentUser.name || "WH")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "WH";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Pengaturan Sistem & Profil
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Kelola profil pengguna, foto akun galeri, nomor kontak, serta informasi database cloud.
        </p>
      </div>

      {statusAlert && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all ${
            statusAlert.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          {statusAlert.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{statusAlert.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Foto & Informasi Akun
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
              {currentUser.role || "Administrator"}
            </span>
          </div>

          {/* Avatar Photo Management */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-[#1d2d5a]">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 ring-4 ring-emerald-500/20 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <span className="text-white font-black text-xl select-none">
                {userInitials}
              </span>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Foto Profil Pengguna
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pilih foto dari galeri HP atau komputer Anda (format JPG, PNG, WEBP).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Unggah Foto Galeri</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Email Administrator
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-100 dark:bg-slate-800/60 font-medium text-slate-600 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Nomor WhatsApp / Telepon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 0853-8478-0910"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Kata Sandi Baru (Kosongkan jika tidak diubah)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#1d2d5a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>
                Wilayah Cabang:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {currentUser.allowedBranch || "Semua Cabang (Pusat)"}
                </strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/30 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan ke Database..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </div>

        {/* Database & Cloud Status Information */}
        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Status Cloud Database & Sinkronisasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">Database Server</div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">PostgreSQL 16</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Terhubung & Aktif
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-[#1d2d5a] space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Sinkronisasi Realtime</div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">Cloud Prisma ORM</div>
              <div className="text-[10px] text-slate-500 font-medium">Otomatis Simpan Perubahan</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-[#1d2d5a] space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Versi Sistem</div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">v3.3 Multi-Branch</div>
              <div className="text-[10px] text-slate-500 font-medium">Mathfingers Production VPS</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
