"use client";

import React, { useState, useEffect, useRef } from "react";
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
  CreditCard,
  PenTool,
  Upload,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAppStore } from "@/lib/store";

export default function PengaturanPage() {
  const currentUser = useCurrentUser();
  const { isSuperAdmin, allowedBranch } = currentUser;
  const { branchAdmins, updateBranchAdmin, branches, updateBranch } = useAppStore();

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

  // Branch bank & signature management
  const availableBranches = isSuperAdmin
    ? branches
    : branches.filter(
        (b) =>
          b.name?.toLowerCase() === allowedBranch?.toLowerCase() ||
          b.name?.toLowerCase() === allowedBranch?.replace(/^Cabang\s+/i, "").toLowerCase()
      );

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const activeBranch =
    branches.find((b) => b.id === selectedBranchId) || availableBranches[0] || branches[0];

  const [branchBankName, setBranchBankName] = useState("");
  const [branchAccountNumber, setBranchAccountNumber] = useState("");
  const [branchAccountHolder, setBranchAccountHolder] = useState("");
  const [branchAdminName, setBranchAdminName] = useState("");
  const [branchSignatureUrl, setBranchSignatureUrl] = useState("");
  const [isSavingBranch, setIsSavingBranch] = useState(false);
  const [branchAlert, setBranchAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Canvas signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasCanvasSignature, setHasCanvasSignature] = useState(false);

  useEffect(() => {
    if (activeBranch) {
      if (!selectedBranchId) {
        setSelectedBranchId(activeBranch.id);
      }
      setBranchBankName(activeBranch.bankName || (activeBranch.name === "Singkut" ? "BCA" : "BRI"));
      setBranchAccountNumber(
        activeBranch.accountNumber || (activeBranch.name === "Singkut" ? "7825-119-021" : "0123-01-002345-50-8")
      );
      setBranchAccountHolder(activeBranch.accountHolder || `Math Fingers ${activeBranch.name}`);
      setBranchAdminName(
        activeBranch.adminName || (activeBranch.name === "Singkut" ? "Febrianti Dewi, S.Pd" : "M. Hafiz, S.Pd")
      );
      setBranchSignatureUrl(activeBranch.signatureUrl || "");
      clearCanvas();
    }
  }, [activeBranch?.id, branches]);

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

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#047857"; // Emerald-700
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasCanvasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasCanvasSignature(false);
  };

  const applyCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasCanvasSignature) return;
    const dataUrl = canvas.toDataURL("image/png");
    setBranchSignatureUrl(dataUrl);
    setBranchAlert({
      type: "success",
      message: "Tanda tangan kanvas berhasil diterapkan! Klik 'Simpan Pengaturan Cabang' untuk menyimpan permanen.",
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBranchAlert({
          type: "error",
          message: "Ukuran file tanda tangan terlalu besar (maksimal 2 MB).",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranchSignatureUrl(reader.result as string);
        setBranchAlert({
          type: "success",
          message: "Gambar tanda tangan berhasil dimuat! Klik 'Simpan Pengaturan Cabang' untuk menyimpan.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranchSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBranch) return;

    setIsSavingBranch(true);
    setBranchAlert(null);

    try {
      updateBranch(activeBranch.id, {
        bankName: branchBankName,
        accountNumber: branchAccountNumber,
        accountHolder: branchAccountHolder,
        adminName: branchAdminName,
        signatureUrl: branchSignatureUrl,
      });

      setBranchAlert({
        type: "success",
        message: `Pengaturan rekening & TTD untuk Cabang ${activeBranch.name} berhasil disimpan!`,
      });
      setTimeout(() => setBranchAlert(null), 4000);
    } catch (err: any) {
      setBranchAlert({
        type: "error",
        message: err.message || "Gagal menyimpan pengaturan cabang.",
      });
    } finally {
      setIsSavingBranch(false);
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[950px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Pengaturan Sistem & Profil
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Kelola profil pengguna, foto akun galeri, nomor kontak, rekening pembayaran SPP, dan TTD admin per cabang.
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

      {/* 1. Profile & Account Card */}
      <form onSubmit={handleSave} className="space-y-6">
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
              <span>{isSaving ? "Menyimpan ke Database..." : "Simpan Profil Akun"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Branch Bank Account & Signature Configuration Card */}
      <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-4 gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Pengaturan Rekening & Tanda Tangan Cabang
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Atur rekening pembayaran SPP, nama admin cabang, dan tanda tangan digital untuk masing-masing cabang.
            </p>
          </div>
          {isSuperAdmin && (
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 w-fit">
              👑 Super Admin Control
            </span>
          )}
        </div>

        {branchAlert && (
          <div
            className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all ${
              branchAlert.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            {branchAlert.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{branchAlert.message}</span>
          </div>
        )}

        {/* Branch Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            Pilih Cabang yang Diatur:
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] overflow-x-auto">
            {availableBranches.map((b) => {
              const isSelected = activeBranch?.id === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Cabang {b.name}</span>
                  {b.bankName && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {b.bankName}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Branch Settings Form */}
        <form onSubmit={handleSaveBranchSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Rekening Bank */}
            <div className="p-4.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-[#1d2d5a] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-[#1d2d5a] pb-2.5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Rekening Pembayaran SPP (Cabang {activeBranch?.name})
                </h3>
              </div>

              {/* Quick Select Bank Buttons */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Pilihan Bank Cepat:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["BCA", "BRI", "Mandiri", "BNI", "BSI", "Bank Jambi", "SeaBank"].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setBranchBankName(bank)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        branchBankName.toUpperCase() === bank.toUpperCase()
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Bank / Saluran Pembayaran:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BCA / BRI / Mandiri / BSI"
                  value={branchBankName}
                  onChange={(e) => setBranchBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nomor Rekening / No. Virtual Account:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 7825-119-021 atau 0123-01-002345-50-8"
                  value={branchAccountNumber}
                  onChange={(e) => setBranchAccountNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Atas Nama Pemilik Rekening (A/N):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Math Fingers Singkut / Bu Admin"
                  value={branchAccountHolder}
                  onChange={(e) => setBranchAccountHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] space-y-1">
                <div className="text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Pratinjau di Pesan WhatsApp:
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                  • Metode Pembayaran: *Tunai / Transfer ({branchBankName || "Bank"}: {branchAccountNumber || "Nomor"} a.n {branchAccountHolder || "Math Fingers"})*
                </div>
              </div>
            </div>

            {/* Right: Nama Admin & TTD Digital */}
            <div className="p-4.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-[#1d2d5a] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-[#1d2d5a] pb-2.5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-600" />
                  Nama & TTD Admin Cabang {activeBranch?.name}
                </h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Lengkap Admin Penanggung Jawab:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Febrianti Dewi, S.Pd"
                  value={branchAdminName}
                  onChange={(e) => setBranchAdminName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* TTD Signature Canvas / Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <PenTool className="w-3 h-3 text-emerald-600" />
                    Gores TTD di Kanvas Layar:
                  </label>
                  <span className="text-[10px] text-slate-400">Mouse atau Sentuh Layar</span>
                </div>

                <div className="relative border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-2xl overflow-hidden bg-white shadow-inner flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={360}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair w-full max-w-[360px] h-[120px] touch-none"
                  />
                  {!hasCanvasSignature && !branchSignatureUrl && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-[11px] font-medium">
                      ✍️ Silakan goreskan tanda tangan di sini
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Hapus Goresan</span>
                    </button>
                    <button
                      type="button"
                      onClick={applyCanvasSignature}
                      disabled={!hasCanvasSignature}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-40"
                    >
                      <Check className="w-3 h-3" />
                      <span>Terapkan Goresan</span>
                    </button>
                  </div>

                  {/* File Upload Option */}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all border border-slate-200 dark:border-slate-700">
                    <Upload className="w-3 h-3 text-emerald-600" />
                    <span>Unggah File TTD (PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSignatureUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Signature Preview */}
              {branchSignatureUrl && (
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <img
                        src={branchSignatureUrl}
                        alt="Tanda Tangan Admin"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                        ✓ TTD Digital Aktif
                      </div>
                      <div className="text-xs font-black text-slate-900 mt-0.5">
                        {branchAdminName || "Nama Admin Cabang"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Admin Cabang {activeBranch?.name}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBranchSignatureUrl("")}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                    title="Hapus Tanda Tangan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingBranch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/30 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSavingBranch
                  ? "Menyimpan Data Cabang..."
                  : `Simpan Pengaturan Cabang ${activeBranch?.name || ""}`}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Database & Cloud Status Information */}
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
    </div>
  );
}
