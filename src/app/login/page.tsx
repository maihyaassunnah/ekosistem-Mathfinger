"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sun,
  Moon,
  QrCode,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"password" | "google">("password");
  const [email, setEmail] = useState("wahyudinhafiz123@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const demoAccounts = [
    {
      name: "Wahyudin Hafiz, S.Pd",
      role: "Super Admin (Pusat)",
      email: "wahyudinhafiz123@gmail.com",
      avatarBg: "bg-emerald-600 text-white font-bold",
      initials: "WH",
    },
    {
      name: "Febrianti Dewi, S.Pd",
      role: "Admin Singkut",
      email: "febriantidewi043@gmail.com",
      avatarBg: "bg-emerald-700 text-white font-bold",
      initials: "SK",
    },
    {
      name: "Dewi Safitri, S.H",
      role: "Admin Bangko",
      email: "dwsafitri97@gmail.com",
      avatarBg: "bg-teal-700 text-white font-bold",
      initials: "BK",
    },
    {
      name: "Asisten Singkut",
      role: "Asisten Cabang",
      email: "asisten.singkut@mathfingers.com",
      avatarBg: "bg-indigo-600 text-white font-bold",
      initials: "AS",
    },
    {
      name: "Asisten Bangko",
      role: "Asisten Cabang",
      email: "asisten.bangko@mathfingers.com",
      avatarBg: "bg-purple-600 text-white font-bold",
      initials: "AB",
    },
  ];

  const handleSelectAccount = (index: number) => {
    setSelectedAvatar(index);
    setEmail(demoAccounts[index].email);
    setPassword("password123");
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Email atau kata sandi tidak cocok, atau akun Anda belum diaktifkan.");
        setIsLoading(false);
      } else {
        try {
          const matched = demoAccounts.find((d) => d.email.toLowerCase() === email.toLowerCase().trim());
          const userName = email.toLowerCase().includes("febri")
            ? "Ustadzah Febri"
            : matched
            ? matched.name
            : email.split("@")[0];
          const userRole = matched?.role.includes("Super Admin")
            ? "SUPER_ADMIN"
            : matched?.role.includes("Asisten")
            ? "BRANCH_ASSISTANT"
            : "BRANCH_ADMIN";
          const userBranch = matched?.role.includes("Singkut")
            ? "Singkut"
            : matched?.role.includes("Bangko")
            ? "Tabir Timur"
            : "Semua Cabang (Pusat)";

          localStorage.setItem(
            "mf_logged_user",
            JSON.stringify({
              name: userName,
              email: email.trim(),
              role: userRole,
              branchName: userBranch,
            })
          );
        } catch {}
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Terjadi gangguan saat menghubungkan ke server. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#064e3b] via-[#070d1e] to-[#040814] dark:from-[#064e3b] dark:via-[#070d1e] dark:to-[#040814] flex flex-col justify-between items-center py-6 px-4 relative overflow-x-hidden">
      {/* Top Controls Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              Mode Gelap
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              Mode Terang
            </>
          )}
        </button>

        <Link
          href="/dashboard/absensi"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all shadow-xs"
        >
          <QrCode className="w-3.5 h-3.5" />
          Presensi QR Siswa
        </Link>
      </div>

      {/* Main Login Card - High Contrast & Crystal Clear Text */}
      <div className="w-full max-w-[450px] bg-white dark:bg-[#0f1a36] rounded-[32px] shadow-2xl p-6 sm:p-8 my-auto relative z-10 border-2 border-emerald-500/30 dark:border-emerald-500/40 transition-all">
        {/* Logo Header with Emerald badge */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#0b1329] shadow-md border-2 border-emerald-500/30 p-2 flex items-center justify-center">
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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Easy Learning House
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              v3.4
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Sistem Terpadu Bimbingan Belajar & Presensi Math Fingers
          </p>
        </div>

        {/* Access Restriction Notice */}
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="font-extrabold">Area Terbatas:</strong> Hanya akun admin & tutor yang telah terdaftar resmi di sistem yang dapat masuk.
          </p>
        </div>

        {/* URL Error Alerts */}
        {urlError === "AccessDenied" && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold">Akses Google Ditolak!</strong>
              <p className="text-[11px] mt-0.5 leading-snug">
                Akun Gmail Anda belum didaftarkan di sistem. Silakan hubungi Super Admin untuk mendaftarkan email Google Anda.
              </p>
            </div>
          </div>
        )}

        {/* Custom Form Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold">Gagal Masuk</strong>
              <p className="text-[11px] mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Auth Method Tabs */}
        <div className="bg-slate-100 dark:bg-[#0b1329] p-1.5 rounded-2xl grid grid-cols-2 text-xs font-bold mb-5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1d2d5a]">
          <button
            type="button"
            onClick={() => {
              setTab("password");
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer font-extrabold ${
              tab === "password"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("google");
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-extrabold ${
              tab === "google"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="font-black text-white">G</span>
            Google Auth
          </button>
        </div>

        {/* Form or Google Tab */}
        {tab === "google" ? (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#0b1329] border border-emerald-200 dark:border-[#1d2d5a] text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0f1a36] shadow-xs border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto">
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
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Masuk Cepat dengan Akun Google
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                Gunakan akun Gmail Anda yang sudah didaftarkan oleh Super Admin di menu cabang & staf.
              </p>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-[#132042] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 font-extrabold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer"
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
              Lanjutkan dengan Akun Google Terdaftar
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1.5">
                Email Terdaftar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="nama@email.com"
                  style={{ color: theme === "dark" ? "#ffffff" : "#0a192f" }}
                  className="w-full pl-10 pr-3.5 py-3 bg-white dark:bg-[#0b1329] border-2 border-slate-300 dark:border-slate-500 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#lupa-sandi"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan password Anda..."
                  style={{ color: theme === "dark" ? "#ffffff" : "#0a192f" }}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#0b1329] border-2 border-slate-300 dark:border-slate-500 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* UNPIX Dual Action: Submit Button & Biometric Icon Button in Emerald */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                Login
              </button>

              <button
                type="button"
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="w-12 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#0b1329] dark:hover:bg-[#132042] border-2 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                title="Login Cepat Biometrik"
              >
                <Fingerprint className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Google Login Divider & Button */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Atau
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-[#132042] text-slate-800 dark:text-white border-2 border-slate-300 dark:border-slate-600 font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
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
              Masuk dengan Akun Google Terdaftar
            </button>
          </form>
        )}

        {/* Quick Avatar Selector */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-2.5">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              ✨ Pilih Akun Terdaftar di Sistem:
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px]">Klik avatar</span>
          </div>

          <div className="flex items-center justify-start gap-3 overflow-x-auto pb-1">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAccount(idx)}
                title={`${acc.name} (${acc.role})`}
                className={`relative group p-0.5 rounded-full transition-all shrink-0 cursor-pointer ${
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
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-[#0f1a36] shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-200 mt-2 font-semibold">
            Akun: <span className="text-emerald-700 dark:text-emerald-400 font-black">{demoAccounts[selectedAvatar].name}</span> ({demoAccounts[selectedAvatar].role})
          </div>
        </div>

        {/* Remember Session Checkbox */}
        <div className="mt-4 flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 dark:bg-[#0b1329] cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
            Ingat Sesi Login Perangkat Ini
          </label>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-xs text-white/90 text-center z-10 font-bold">
        © {new Date().getFullYear()} Les Mathfingers Management System • V2.0 Cloud VPS
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0a1128] flex items-center justify-center text-white text-sm">
          Memuat halaman login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
