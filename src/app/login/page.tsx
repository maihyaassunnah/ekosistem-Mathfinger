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
import { signIn } from "next-auth/react";

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

        {/* Form or Google Tab */}
        {tab === "google" ? (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Masuk Cepat & Aman dengan Akun Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Gunakan akun Gmail Anda untuk langsung masuk ke sistem manajemen Math Fingers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-slate-400"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Lanjutkan dengan Akun Google
            </button>
          </div>
        ) : (
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

            {/* Quick Google Login Divider & Button */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">
                Atau
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Akun Google
            </button>
          </form>
        )}

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
