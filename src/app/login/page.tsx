"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Sun,
  Moon,
  QrCode,
  User,
  Lock,
  Eye,
  EyeOff,
  Info,
  Check,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"password" | "google">("password");
  const [email, setEmail] = useState("wahyudinhafiz123@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      name: "Wahyudin Hafiz, S.Pd",
      role: "Super Admin (Pusat)",
      email: "wahyudinhafiz123@gmail.com",
      avatarBg: "bg-slate-800 text-white font-bold",
      initials: "WH",
    },
    {
      name: "Admin Singkut",
      role: "Admin Cabang",
      email: "singkut.mathfingers@gmail.com",
      avatarBg: "bg-emerald-700 text-white font-bold",
      initials: "SK",
    },
    {
      name: "Admin Bangko",
      role: "Admin Cabang",
      email: "bangko.mathfingers@gmail.com",
      avatarBg: "bg-purple-700 text-white font-bold",
      initials: "BK",
    },
    {
      name: "Tutor Kelas",
      role: "Pengajar",
      email: "tutor1.mathfingers@gmail.com",
      avatarBg: "bg-blue-700 text-white font-bold",
      initials: "TR",
    },
  ];

  const handleSelectAccount = (index: number) => {
    setSelectedAvatar(index);
    setEmail(demoAccounts[index].email);
    setPassword("password123");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#059669] via-[#047857] to-[#064E3B] flex flex-col justify-between items-center py-6 px-4 relative overflow-x-hidden">
      {/* Top Controls Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              Gelap
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5" />
              Terang
            </>
          )}
        </button>

        <Link
          href="/dashboard/absensi"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-medium transition-all shadow-xs"
        >
          <QrCode className="w-3.5 h-3.5" />
          Presensi QR Siswa
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[28px] shadow-2xl p-6 sm:p-8 my-auto relative z-10 border border-emerald-100">
        {/* Easy Learning House Logo Header */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-emerald-100 p-2 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Easy Learning House Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="text-center space-y-1 mb-5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Easy Learning House
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              v3.3
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Sistem Terpadu Bimbingan Belajar & Presensi Math Fingers
          </p>
        </div>


        {/* Auth Method Tabs */}
        <div className="bg-slate-100/90 p-1 rounded-xl grid grid-cols-2 text-xs font-semibold mb-5 text-slate-600">
          <button
            type="button"
            onClick={() => setTab("password")}
            className={`py-2 rounded-lg transition-all ${
              tab === "password"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setTab("google")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === "google"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            <span className="font-bold text-red-500">G</span>
            Google Auth
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Username atau Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#lupa-sandi"
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
              >
                Lupa sandi?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            Masuk ke Mathfingers V2
          </button>
        </form>

        {/* Quick Avatar Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              ✨ Pilih Akun Cabang Terdaftar:
            </span>
            <span className="text-slate-400 text-[10px]">Pilih profil</span>
          </div>

          <div className="flex items-center justify-start gap-3">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAccount(idx)}
                title={`${acc.name} (${acc.role})`}
                className={`relative group p-0.5 rounded-full transition-all ${
                  selectedAvatar === idx
                    ? "ring-2 ring-emerald-500 ring-offset-2 scale-105"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs shadow-xs ${acc.avatarBg}`}
                >
                  {acc.initials}
                </div>
                {selectedAvatar === idx && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-600 mt-2 font-medium">
            Login sebagai: <span className="text-emerald-700 font-semibold">{demoAccounts[selectedAvatar].name}</span> ({demoAccounts[selectedAvatar].role})
          </div>
        </div>

        {/* Remember Session Checkbox */}
        <div className="mt-4 flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
            Ingat Sesi Login Perangkat Ini
          </label>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-xs text-white/70 text-center z-10">
        © {new Date().getFullYear()} Les Mathfingers Management System • V2.0 Cloud VPS
      </div>
    </div>
  );
}
