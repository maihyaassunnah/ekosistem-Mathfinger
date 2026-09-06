"use client";

import React, { useState } from "react";
import {
  Database,
  Server,
  ShieldCheck,
  ExternalLink,
  Table,
  CheckCircle2,
  RefreshCw,
  Layers,
  Globe,
  Users,
  GraduationCap,
  Calendar,
  Award,
  CreditCard,
  Building,
  Sparkles,
  MessageSquare,
  Handshake,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function DatabasePage() {
  const {
    students,
    classes,
    branches,
    branchAdmins,
    journals,
    grades,
    curriculumModules,
    invoices,
    transactions,
    landingPrograms,
    landingTestimonials,
    landingPartners,
    landingLeads,
  } = useAppStore();

  const [lastChecked, setLastChecked] = useState(new Date().toLocaleTimeString("id-ID"));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastChecked(new Date().toLocaleTimeString("id-ID"));
      setIsRefreshing(false);
    }, 600);
  };

  const tablesOperational = [
    { name: "branches", label: "Cabang Les", count: branches.length, icon: Building, color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40" },
    { name: "users", label: "Admin & Tutor", count: branchAdmins.length, icon: Users, color: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40" },
    { name: "levels", label: "Level & Kurikulum", count: curriculumModules.length, icon: Layers, color: "text-blue-700 bg-blue-50 dark:text-sky-300 dark:bg-blue-950/40" },
    { name: "students", label: "Siswa Aktif", count: students.length, icon: GraduationCap, color: "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40" },
    { name: "classes", label: "Jadwal & Rombel", count: classes.length, icon: Calendar, color: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40" },
    { name: "attendances", label: "Presensi Harian", count: "Realtime", icon: UserCheck, color: "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/40" },
    { name: "teacher_journals", label: "Jurnal Mengajar", count: journals.length, icon: Table, color: "text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800" },
    { name: "student_grades", label: "Nilai & Evaluasi", count: grades.length, icon: Award, color: "text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40" },
    { name: "student_behaviors", label: "Sikap & Keaktifan", count: "Realtime", icon: Sparkles, color: "text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950/40" },
    { name: "invoices", label: "Tagihan & SPP", count: invoices.length, icon: CreditCard, color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40" },
    { name: "cash_mutations", label: "Mutasi Kasir", count: "Realtime", icon: CreditCard, color: "text-blue-700 bg-blue-50 dark:text-sky-300 dark:bg-blue-950/40" },
    { name: "cash_transactions", label: "Buku Kas & Transaksi", count: transactions.length, icon: CreditCard, color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40" },
  ];

  const tablesWebsite = [
    { name: "website_hero", label: "Hero & Promo Banner", count: 1, icon: Globe, color: "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40" },
    { name: "website_programs", label: "Katalog Program", count: landingPrograms.length, icon: Layers, color: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40" },
    { name: "website_testimonials", label: "Ulasan & Testimoni", count: landingTestimonials.length, icon: MessageSquare, color: "text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-950/40" },
    { name: "website_partners", label: "Mitra Kolaborasi", count: landingPartners.length, icon: Handshake, color: "text-blue-700 bg-blue-50 dark:text-sky-300 dark:bg-blue-950/40" },
    { name: "website_leads", label: "Calon Siswa (Trial)", count: landingLeads.length, icon: Users, color: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Pusat Manajemen Database PostgreSQL
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:text-sky-300 dark:border-blue-900/60">
              17 Tabel Terkoneksi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Database PostgreSQL 16 terpusat untuk seluruh Operasional Bimbel & Website CMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            Perbarui Status ({lastChecked})
          </button>

          <a
            href="https://db.mathfingers.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-600/25 transition shadow-sm"
          >
            <Database className="w-4 h-4" />
            Buka PGWeb Viewer
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Cloud & Server Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-900/60">
              PORT 5432
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">PostgreSQL 16 Service</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Database server VPS Mathfingers dengan skema multi-cabang terindeks & volume persisten.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400">
            <CheckCircle2 className="w-4 h-4" />
            Terhubung & Aktif (mathfingers_db)
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
              PORT 8081
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">PGWeb Visual GUI</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Interface web PostgreSQL mandiri bebas login, siap inspeksi data tabel secara visual.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
            <CheckCircle2 className="w-4 h-4" />
            db.mathfingers.my.id
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60">
              SSL / HTTPS
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Nginx Reverse Proxy</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Proksi subdomain aman dengan enkripsi SSL/TLS Let&apos;s Encrypt di VPS 43.173.12.46.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
            DNS A Record Terpropagasi
          </div>
        </div>
      </div>

      {/* Section 1: Tabel Operasional & Akademik */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Tabel Operasional, Akademik & Keuangan (12 Tabel)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Data inti cabang, siswa, kelas, absensi, rapor, hingga mutasi kasir
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tablesOperational.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="bg-white dark:bg-[#0f1a36] rounded-2xl p-4 border border-slate-200 dark:border-[#1d2d5a] shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">public.{t.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white">{t.count}</div>
                  <div className="text-[10px] text-blue-600 dark:text-sky-400 font-bold flex items-center gap-0.5 justify-end">
                    <CheckCircle2 className="w-3 h-3" /> Aktif
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Tabel Website CMS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Tabel Website Landing Page CMS (5 Tabel)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Kelola konten homepage, katalog program, testimoni, mitra, dan leads formulir pendaftaran
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {tablesWebsite.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="bg-white dark:bg-[#0f1a36] rounded-2xl p-4 border border-slate-200 dark:border-[#1d2d5a] shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">public.{t.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white">{t.count}</div>
                  <div className="text-[10px] text-blue-600 dark:text-sky-400 font-bold flex items-center gap-0.5 justify-end">
                    <CheckCircle2 className="w-3 h-3" /> Aktif
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct PGWeb Quick Action Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold border border-blue-500/30">
            <Database className="w-3.5 h-3.5" />
            Custom Domain Active
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Akses Visual PGWeb di db.mathfingers.my.id
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Gunakan antarmuka PGWeb untuk mengekspor data ke CSV/JSON, menjalankan raw SQL query,
            atau memantau struktur tabel secara real-time tanpa perlu aplikasi desktop pihak ketiga.
          </p>
        </div>

        <a
          href="https://db.mathfingers.my.id"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
        >
          <ExternalLink className="w-4 h-4" />
          Buka Visual Database GUI
        </a>
      </div>
    </div>
  );
}
