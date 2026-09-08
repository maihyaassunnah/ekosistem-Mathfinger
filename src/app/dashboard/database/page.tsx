"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Code2,
  Sliders,
  Terminal,
  X,
  Search,
  ArrowRight,
  Maximize2,
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

  const [activeTab, setActiveTab] = useState<"summary" | "studio">("summary");
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [lastChecked, setLastChecked] = useState(new Date().toLocaleTimeString("id-ID"));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastChecked(new Date().toLocaleTimeString("id-ID"));
      setIsRefreshing(false);
    }, 600);
  };

  const tablesOperational = [
    {
      name: "branches",
      model: "Branch",
      label: "Cabang Les",
      count: branches.length,
      icon: Building,
      color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
      link: "/dashboard/cabang",
      data: branches.map((b) => ({ id: b.id, Nama: b.name, Kode: b.code, Alamat: b.address, Telepon: b.phone })),
    },
    {
      name: "branch_settings",
      model: "BranchSetting",
      label: "Rekening & TTD Cabang",
      count: branches.length,
      icon: CreditCard,
      color: "text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/40",
      link: "/dashboard/pengaturan",
      data: branches.map((b) => ({
        id: b.id,
        Cabang: b.name,
        Bank: b.bankName || "-",
        NoRekening: b.accountNumber || "-",
        AtasNama: b.accountHolder || "-",
        AdminTTD: b.adminName || "-",
        StatusTTD: b.signatureUrl ? "✅ Ada (Tersimpan)" : "❌ Belum Diatur",
      })),
    },
    {
      name: "users",
      model: "User",
      label: "Admin & Tutor",
      count: branchAdmins.length,
      icon: Users,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/cabang",
      data: branchAdmins.map((u) => ({ id: u.id, Nama: u.fullName, Email: u.email, Peran: u.role, Cabang: u.branchName, Status: u.status })),
    },
    {
      name: "levels",
      model: "Level",
      label: "Level & Kurikulum",
      count: curriculumModules.length,
      icon: Layers,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/kurikulum",
      data: curriculumModules.map((l) => ({ id: l.id, Level: l.levelTitle, Urutan: l.orderIndex, Ringkasan: l.shortDesc })),
    },
    {
      name: "students",
      model: "Student",
      label: "Siswa Aktif",
      count: students.length,
      icon: GraduationCap,
      color: "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40",
      link: "/dashboard/siswa",
      data: students.map((s) => ({ id: s.id, Nama: s.name, Kode: s.studentCode, Program: (s as any).programType === "MEMBACA" ? "📖 MEMBACA" : "🔢 MATEMATIKA", Kelas: s.className || "-", Cabang: s.branch, Wali: s.parentName })),
    },
    {
      name: "classes",
      model: "Class",
      label: "Jadwal & Rombel",
      count: classes.length,
      icon: Calendar,
      color: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40",
      link: "/dashboard/kelas",
      data: classes.map((c) => ({ id: c.id, Kelas: c.name, Program: (c as any).programType === "MEMBACA" ? "📖 MEMBACA" : "🔢 MATEMATIKA", Cabang: c.branch, Hari: c.days, Jam: c.time, Tutor: c.teacher, Ruang: c.room, Terisi: `${c.enrolledCount}/${c.maxCapacity}` })),
    },
    {
      name: "attendances",
      model: "Attendance",
      label: "Presensi Harian",
      count: "Realtime",
      icon: UserCheck,
      color: "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/40",
      link: "/dashboard/absensi",
      data: [],
    },
    {
      name: "teacher_journals",
      model: "TeacherJournal",
      label: "Jurnal Mengajar",
      count: journals.length,
      icon: Table,
      color: "text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800",
      link: "/dashboard/jurnal",
      data: journals.map((j) => ({ id: j.id, Siswa: j.studentName, Program: (j as any).programType === "MEMBACA" ? "📖 MEMBACA" : "🔢 MATEMATIKA", Kelas: j.className, Topik: j.topic, Tanggal: j.date, Guru: j.teacher })),
    },
    {
      name: "student_grades",
      model: "StudentGrade",
      label: "Nilai & Evaluasi",
      count: grades.length,
      icon: Award,
      color: "text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40",
      link: "/dashboard/input-nilai",
      data: grades.map((g) => ({ id: g.id, Siswa: g.studentName, Kelas: g.className, Sesi: g.topic, Nilai: g.score, Tanggal: g.examDate })),
    },
    {
      name: "student_behaviors",
      model: "StudentBehavior",
      label: "Sikap & Keaktifan",
      count: "Realtime",
      icon: Sparkles,
      color: "text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950/40",
      link: "/dashboard/input-nilai",
      data: [],
    },
    {
      name: "invoices",
      model: "Invoice",
      label: "Tagihan & SPP",
      count: invoices.length,
      icon: CreditCard,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/spp",
      data: invoices.map((inv) => ({ id: inv.id, Invoice: inv.invoiceNo, Siswa: inv.studentName, Program: (inv as any).programType === "MEMBACA" ? "📖 MEMBACA" : "🔢 MATEMATIKA", Periode: inv.period, Jumlah: `Rp ${inv.amount.toLocaleString()}`, Status: inv.status })),
    },
    {
      name: "cash_mutations",
      model: "CashMutation",
      label: "Mutasi Kasir",
      count: "Realtime",
      icon: CreditCard,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/arus-keuangan",
      data: [],
    },
    {
      name: "cash_transactions",
      model: "CashTransaction",
      label: "Buku Kas & Transaksi",
      count: transactions.length,
      icon: CreditCard,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/arus-keuangan",
      data: transactions.map((t) => ({ id: t.id, Tipe: t.type, Judul: t.title, Kategori: t.category, Jumlah: `Rp ${t.amount.toLocaleString()}`, Cabang: t.branch, Tanggal: t.date })),
    },
  ];

  const tablesWebsite = [
    {
      name: "website_hero",
      model: "WebsiteHero",
      label: "Hero & Promo Banner",
      count: 1,
      icon: Globe,
      color: "text-sky-700 bg-sky-50 dark:text-emerald-300 dark:bg-sky-950/40",
      link: "/dashboard/website",
      data: [],
    },
    {
      name: "website_programs",
      model: "WebsiteProgram",
      label: "Katalog Program",
      count: landingPrograms.length,
      icon: Layers,
      color: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40",
      link: "/dashboard/website?tab=programs",
      data: landingPrograms.map((p) => ({ id: p.id, Program: p.levelTitle, Usia: p.targetAge, SPP: `Rp ${p.monthlyFee.toLocaleString()}`, Daftar: `Rp ${p.registrationFee.toLocaleString()}` })),
    },
    {
      name: "website_testimonials",
      model: "WebsiteTestimonial",
      label: "Ulasan & Testimoni",
      count: landingTestimonials.length,
      icon: MessageSquare,
      color: "text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-950/40",
      link: "/dashboard/website?tab=testimonials",
      data: landingTestimonials.map((t) => ({ id: t.id, Wali: t.parentName, Siswa: t.studentName, Rating: `${t.rating} ⭐`, Komentar: t.comment })),
    },
    {
      name: "website_partners",
      model: "WebsitePartner",
      label: "Mitra Kolaborasi",
      count: landingPartners.length,
      icon: Handshake,
      color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
      link: "/dashboard/website?tab=partners",
      data: landingPartners.map((p) => ({ id: p.id, Mitra: p.name, Kategori: p.category, Singkatan: p.logoText, Status: p.active ? "Aktif" : "Nonaktif" })),
    },
    {
      name: "website_leads",
      model: "WebsiteLead",
      label: "Calon Siswa (Trial)",
      count: landingLeads.length,
      icon: Users,
      color: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40",
      link: "/dashboard/website?tab=leads",
      data: landingLeads.map((l) => ({ id: l.id, Siswa: l.studentName, Usia: l.studentAge, Ortu: l.parentName, WA: l.phone, Cabang: l.branch, Status: l.status })),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Pusat Manajemen Database Prisma & PostgreSQL
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              18 Tabel Terkoneksi
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Database PostgreSQL 16 terpusat dengan skema Prisma ORM & Editor Visual Prisma Studio
          </p>
        </div>

        {/* Program Segregation Status Pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Isolasi Program: Matematika & Membaca Terpisah</span>
          </span>
        </div>

        {/* View Mode Switcher: Summary vs Prisma Studio GUI */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-1 bg-slate-100 dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "summary"
                  ? "bg-white dark:bg-[#1a294f] text-emerald-700 dark:text-emerald-300 shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Ringkasan Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "studio"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25 font-black"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Prisma Studio GUI (Langsung)</span>
            </button>
          </div>

          <a
            href="http://localhost:5555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
            title="Buka Prisma Studio di tab browser baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Studio di Tab Baru</span>
          </a>
        </div>
      </div>

      {/* TAB 1: PRISMA STUDIO EMBEDDED GUI */}
      {activeTab === "studio" && (
        <div className="space-y-3 animate-in fade-in">
          {/* Helper Control Bar */}
          <div className="bg-emerald-50/80 dark:bg-[#0f1a36] p-3 rounded-2xl border border-emerald-200 dark:border-[#1d2d5a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Prisma Studio Aktif di:</span>
              <code className="px-2 py-0.5 rounded-md bg-white dark:bg-[#0b1329] border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
                http://localhost:5555
              </code>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-[#132042] transition flex items-center gap-1 cursor-pointer"
                title="Muat Ulang Prisma Studio"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload</span>
              </button>
              <a
                href="http://localhost:5555"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Layar Penuh (Tab Baru)</span>
              </a>
            </div>
          </div>

          {/* Embedded Iframe */}
          <div className="w-full h-[78vh] rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-[#1d2d5a] shadow-xl bg-white dark:bg-[#0b1329] relative">
            <iframe
              key={iframeKey}
              src="http://localhost:5555"
              className="w-full h-full border-0"
              title="Prisma Studio Dashboard"
            />
          </div>
        </div>
      )}

      {/* TAB 2: SUMMARY VIEW */}
      {activeTab === "summary" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Cloud & Server Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. PostgreSQL */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-5 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                  PORT 5432
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">PostgreSQL 16 Engine</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Database utama terpusat dengan schema Prisma di VPS Mathfingers (43.173.12.46).
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Terhubung & Aktif (mathfingers_db)
              </div>
            </div>

            {/* 2. Prisma Studio Editor */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-5 border border-emerald-300 dark:border-emerald-800 shadow-xs space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                  PORT 5555
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Prisma Studio GUI Editor</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Editor data visual resmi dari Prisma untuk edit baris, tambah, filter, dan hapus data secara langsung.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Siap di localhost:5555
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("studio")}
                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Buka Editor →
                </button>
              </div>
            </div>

            {/* 3. PGWeb */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl p-5 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60">
                  PORT 8081
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">PGWeb Visual Viewer</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Antarmuka web mandiri untuk inspeksi skema dan ekspor data CSV di db.mathfingers.my.id.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> db.mathfingers.my.id
                </span>
                <a
                  href="https://db.mathfingers.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black text-sky-600 hover:text-sky-700 underline flex items-center gap-0.5"
                >
                  Buka <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 1: Tabel Operasional & Akademik */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Tabel Operasional, Akademik & Keuangan (12 Tabel)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Klik pada tabel mana saja untuk melihat data atau mengeditnya langsung di Prisma Studio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {tablesOperational.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.name}
                    onClick={() => {
                      setSelectedTable(t);
                      setTableSearch("");
                    }}
                    className="bg-white dark:bg-[#0f1a36] rounded-2xl p-4 border border-slate-200 dark:border-[#1d2d5a] shadow-2xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {t.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            public.{t.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {t.count}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                        <span>Inspeksi & Edit</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">Model: {t.model}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Tabel Website CMS */}
          <div className="space-y-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Tabel Website Landing Page CMS (5 Tabel)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Kelola konten landing page, program bimbel, testimoni, mitra, dan leads formulir pendaftaran
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {tablesWebsite.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.name}
                    onClick={() => {
                      setSelectedTable(t);
                      setTableSearch("");
                    }}
                    className="bg-white dark:bg-[#0f1a36] rounded-2xl p-4 border border-slate-200 dark:border-[#1d2d5a] shadow-2xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {t.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            public.{t.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {t.count}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                        <span>Inspeksi & Edit</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">Model: {t.model}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cara Edit Database Prisma Langsung - Panduan Lengkap */}
          <div className="rounded-3xl bg-slate-900 dark:bg-[#0b1329] p-6 sm:p-8 text-white border border-slate-800 dark:border-[#1d2d5a] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Panduan Lengkap: 3 Cara Edit Database Prisma Secara Langsung</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Cara 1: Di Dashboard ini */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black text-emerald-400">
                  1. Melalui Tab Prisma Studio di Atas
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cukup klik tombol tab <strong>&quot;Prisma Studio GUI (Langsung)&quot;</strong> di pojok kanan atas halaman ini. Anda bisa langsung mengklik sel data, menambah baris baru, mengedit nilai kolom, dan klik <em>&quot;Save 1 change&quot;</em>.
                </p>
              </div>

              {/* Cara 2: Di Komputer Lokal */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black text-amber-400">
                  2. Di Terminal Komputer Anda
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Buka terminal di folder proyek dan jalankan perintah:
                </p>
                <pre className="p-2 rounded-xl bg-black/40 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                  npx prisma studio
                </pre>
                <p className="text-[11px] text-slate-400">
                  Browser akan otomatis terbuka di <code className="text-white">http://localhost:5555</code>.
                </p>
              </div>

              {/* Cara 3: Di Server VPS */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black text-sky-400">
                  3. Di Server VPS Produksi
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jalankan perintah ini di terminal server VPS untuk membukanya ke jaringan:
                </p>
                <pre className="p-2 rounded-xl bg-black/40 text-sky-300 font-mono text-[11px] overflow-x-auto">
                  npx prisma studio --port 5555 --hostname 0.0.0.0 --browser none
                </pre>
                <p className="text-[11px] text-slate-400">
                  Lalu akses melalui IP VPS Anda: <code className="text-white">http://43.173.12.46:5555</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Data Inspector Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[90vh] flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedTable.color}`}>
                    <selectedTable.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                        Tabel: {selectedTable.label}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        public.{selectedTable.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Model Prisma: <strong>{selectedTable.model}</strong> • Total: {selectedTable.count} Baris Data
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTable(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari data dalam tabel..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {selectedTable.link && (
                    <Link
                      href={selectedTable.link}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Buka di Menu Aplikasi</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                  <a
                    href={`http://localhost:5555/model/${selectedTable.model}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Edit di Prisma Studio ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Table Records Preview */}
            <div className="flex-1 overflow-auto max-h-72 border border-slate-100 dark:border-[#1d2d5a] rounded-2xl">
              {Array.isArray(selectedTable.data) && selectedTable.data.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#0b1329] text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-200 dark:border-[#1d2d5a]">
                    <tr>
                      <th className="p-3">#</th>
                      {Object.keys(selectedTable.data[0]).map((col) => (
                        <th key={col} className="p-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {selectedTable.data
                      .filter((row: any) =>
                        tableSearch
                          ? JSON.stringify(row).toLowerCase().includes(tableSearch.toLowerCase())
                          : true
                      )
                      .map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-[#132042]/50 transition-colors">
                          <td className="p-3 font-bold text-slate-400">{rIdx + 1}</td>
                          {Object.keys(selectedTable.data[0]).map((col) => (
                            <td key={col} className="p-3 text-slate-800 dark:text-slate-200 max-w-xs truncate">
                              {row[col] !== undefined && row[col] !== null ? String(row[col]) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <p>Data tabel disinkronkan secara dinamis melalui Prisma Client.</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    Gunakan tombol &quot;Edit di Prisma Studio ↗&quot; untuk melihat seluruh kolom dan mengedit isi tabel secara visual.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pilih baris di Prisma Studio untuk mengubah data, menambah baris, atau menghapus baris.
              </span>
              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
