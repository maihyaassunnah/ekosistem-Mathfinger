"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { AppStoreProvider } from "@/lib/store";
import { Menu, BookOpen, Sun, Moon, Home, Users, CheckSquare, Award } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";

  return (
    <div className="h-screen w-full flex overflow-hidden bg-math-pattern text-slate-900 dark:text-slate-100 font-sans relative">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-label="Tutup Menu"
        />
      )}

      {/* Sidebar (Responsive off-canvas on mobile/tablet, sticky/static on desktop) */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Mobile & Tablet Header Bar (Visible on < lg, hidden on /dashboard home as it has native app header) */}
        {!isDashboardHome && (
          <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#0a1128]/95 backdrop-blur-md border-b border-blue-100/80 dark:border-[#162244] shrink-0 z-30 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-[#132042] transition-colors cursor-pointer"
                title="Buka Navigasi"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-blue-100 dark:border-[#1d2d5a] flex items-center justify-center font-bold shadow-2xs">
                  <img
                    src="/logo.png"
                    alt="Easy Learning House"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-black text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                    Easy Learning
                  </span>
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-sky-300 text-[9px] font-bold">
                    v3.3
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-[#132042] transition-colors cursor-pointer"
                title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-600" />
                )}
              </button>

              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                MF
              </div>
            </div>
          </header>
        )}

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 pb-20 lg:pb-0">
          {children}
        </main>

        {/* Mobile & Tablet Bottom Navigation Dock (Persistent App Bar) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0a1128]/95 backdrop-blur-xl border-t border-blue-100/80 dark:border-[#162244] px-3 pt-1.5 pb-2.5 shadow-2xl">
          <div className="max-w-md md:max-w-xl mx-auto flex items-end justify-around relative">
            {/* 1. Home (Elevated circle when on /dashboard or clicked) */}
            <Link
              href="/dashboard"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-11 h-11 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border-4 border-white dark:border-[#0a1128] ${
                  pathname === "/dashboard"
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white ring-2 ring-blue-500/30"
                    : "bg-slate-100 dark:bg-[#132042] text-slate-600 dark:text-slate-300"
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-extrabold mt-0.5 ${
                  pathname === "/dashboard"
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Home
              </span>
            </Link>

            {/* 2. Siswa */}
            <Link
              href="/dashboard/siswa"
              className="flex flex-col items-center py-1 group cursor-pointer"
            >
              <Users
                className={`w-5 h-5 ${
                  pathname.startsWith("/dashboard/siswa")
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-semibold mt-0.5 ${
                  pathname.startsWith("/dashboard/siswa")
                    ? "text-blue-600 dark:text-sky-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Siswa
              </span>
            </Link>

            {/* 3. Absensi */}
            <Link
              href="/dashboard/absensi"
              className="flex flex-col items-center py-1 group cursor-pointer"
            >
              <CheckSquare
                className={`w-5 h-5 ${
                  pathname.startsWith("/dashboard/absensi")
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-semibold mt-0.5 ${
                  pathname.startsWith("/dashboard/absensi")
                    ? "text-blue-600 dark:text-sky-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Absensi
              </span>
            </Link>

            {/* 4. Nilai */}
            <Link
              href="/dashboard/input-nilai"
              className="flex flex-col items-center py-1 group cursor-pointer"
            >
              <Award
                className={`w-5 h-5 ${
                  pathname.startsWith("/dashboard/input-nilai") || pathname.startsWith("/dashboard/rapor")
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-semibold mt-0.5 ${
                  pathname.startsWith("/dashboard/input-nilai") || pathname.startsWith("/dashboard/rapor")
                    ? "text-blue-600 dark:text-sky-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Nilai
              </span>
            </Link>

            {/* 5. Lainnya (with blue badge 14, triggers sidebar drawer) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center py-1 group cursor-pointer relative"
            >
              <div className="relative">
                <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-black flex items-center justify-center shadow-xs">
                  14
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Lainnya
              </span>
            </button>
          </div>

          {/* iOS Bottom Indicator Bar */}
          <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2" />
        </nav>
      </div>
    </div>
  );
}
