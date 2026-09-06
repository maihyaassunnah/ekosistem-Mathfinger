"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  Database,
  TrendingUp,
  Settings,
  MapPin,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  School,
  FileSpreadsheet,
  Phone,
  BookOpen,
  QrCode,
  CheckSquare,
  Receipt,
  Award,
  Layers,
  FileText,
  Wallet,
  History,
  GraduationCap,
  Sun,
  Moon,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Clock,
  Menu,
} from "lucide-react";
import {
  CURRENT_USER,
  BRANCHES_DATA,
  DASHBOARD_STATS,
} from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

export default function DashboardPage() {
  const { students, branches, invoices, branchAdmins, classes } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const [selectedBranch, setSelectedBranch] = useState<"ALL" | "Singkut" | "Bangko">("ALL");

  // Mobile/Tablet specific state
  const [mobileBranch, setMobileBranch] = useState<"Singkut" | "Bangko">("Singkut");
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuickServices, setShowQuickServices] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSyncToast, setShowSyncToast] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  // Auto rotate banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const totalStudentsCount = students.length;
  const activeStudentsCount =
    selectedBranch === "ALL"
      ? students.length
      : students.filter((s) => s.branch === selectedBranch).length;

  const paidInvoices = invoices.filter((i) => i.status === "LUNAS");
  const unpaidInvoices = invoices.filter((i) => i.status === "BELUM BAYAR");
  const totalSppCollected = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSppPending = unpaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const sppRate = invoices.length > 0 ? Math.round((paidInvoices.length / invoices.length) * 100) : 100;

  const filteredStats = {
    activeStudents: activeStudentsCount,
    totalStudents: totalStudentsCount,
    sppCollected: totalSppCollected,
    sppPending: totalSppPending,
    sppPercentage: sppRate,
    branchCount: branches.length,
    adminCount: branchAdmins.length,
  };

  const bannerSlides = [
    {
      title: "Kelola SPP & Kuitansi Digital",
      subtitle:
        "Terbitkan kuitansi resmi PDF berstempel dan kirim notifikasi tagihan SPP otomatis ke wali murid.",
      pill: "⚡ Slip & Kuitansi Otomatis",
      btn1: { label: "⚡ Kelola SPP", href: "/dashboard/spp" },
      btn2: { label: "📅 Data Siswa", href: "/dashboard/siswa" },
    },
    {
      title: "Presensi Digital Kartu QR",
      subtitle:
        "Scan instan kartu QR siswa dan rekap kehadiran real-time terhubung ke wali murid.",
      pill: "🪪 Presensi Realtime",
      btn1: { label: "📷 Scan QR", href: "/dashboard/absensi" },
      btn2: { label: "🪪 Cetak Kartu", href: "/dashboard/kartu-qr" },
    },
    {
      title: "Rapor Digital & Jurnal Guru",
      subtitle:
        "Catat materi tiap pertemuan dan pantau grafik kemahiran 10 jari anak secara transparan.",
      pill: "📊 Rapor Kompetensi",
      btn1: { label: "📈 Lihat Rapor", href: "/dashboard/rapor" },
      btn2: { label: "📝 Jurnal Guru", href: "/dashboard/jurnal" },
    },
  ];

  // 16 Popular services for the 4x4 grid
  const popularServices = [
    {
      label: "Presensi...",
      href: "/dashboard/absensi",
      icon: CheckSquare,
      color: "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60",
    },
    {
      label: "Data Siswa",
      href: "/dashboard/siswa",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60",
    },
    {
      label: "Tagihan SPP",
      href: "/dashboard/spp",
      icon: Receipt,
      color: "bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60",
    },
    {
      label: "Input Nilai",
      href: "/dashboard/input-nilai",
      icon: Award,
      color: "bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60",
    },
    {
      label: "Jadwal...",
      href: "/dashboard/kelas",
      icon: Layers,
      color: "bg-indigo-50 text-indigo-500 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/60",
    },
    {
      label: "Kartu QR",
      href: "/dashboard/kartu-qr",
      icon: QrCode,
      color: "bg-cyan-50 text-cyan-600 border border-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-900/60",
    },
    {
      label: "Jurnal Guru",
      href: "/dashboard/jurnal",
      icon: FileText,
      color: "bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/60",
    },
    {
      label: "Rapor Siswa",
      href: "/dashboard/rapor",
      icon: TrendingUp,
      color: "bg-violet-50 text-violet-600 border border-violet-100 dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-900/60",
    },
    {
      label: "Kelola...",
      href: "/dashboard/cabang",
      icon: Building2,
      color: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-sky-400 dark:border-blue-900/60",
    },
    {
      label: "Database...",
      href: "/dashboard/database",
      icon: Database,
      color: "bg-sky-50 text-sky-600 border border-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-900/60",
    },
    {
      label: "Keuangan...",
      href: "/dashboard/arus-keuangan",
      icon: Wallet,
      color: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60",
    },
    {
      label: "Riwayat SPP",
      href: "/dashboard/riwayat-spp",
      icon: History,
      color: "bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-900/60",
    },
    {
      label: "Alumni Lulus",
      href: "/dashboard/alumni",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60",
    },
    {
      label: "Materi &...",
      href: "/dashboard/kurikulum",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60",
    },
    {
      label: "Riwayat...",
      href: "/dashboard/riwayat-jurnal",
      icon: Clock,
      color: "bg-cyan-50 text-cyan-600 border border-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-900/60",
    },
    {
      label: "Pengatura...",
      href: "/dashboard/pengaturan",
      icon: Settings,
      color: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-[#1d2d5a]",
    },
  ];

  const filteredStudentsSearch = searchQuery.trim()
    ? students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.levelCurriculum.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* ========================================================= */}
      {/* MOBILE & TABLET APP VIEW (EXACT MATCH TO ATTACHED SCREENSHOT) */}
      {/* ========================================================= */}
      <div className="lg:hidden max-w-md md:max-w-xl mx-auto px-4 pt-3 pb-24 space-y-4 font-sans">
        {/* 1. TOP STATUS / APP HEADER */}
        <div className="flex items-center justify-between">
          {/* Logo with colorful "Math Finger" letters */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#0f1a36] p-0.5 border border-blue-100 dark:border-blue-900/40 shadow-2xs flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Math Finger"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight font-sans flex items-center select-none">
              <span className="text-[#0ea5e9]">M</span>
              <span className="text-[#f59e0b]">a</span>
              <span className="text-blue-600">t</span>
              <span className="text-[#3b82f6]">h</span>
              <span className="ml-1 text-[#06b6d4]">F</span>
              <span className="text-[#ec4899]">i</span>
              <span className="text-[#3b82f6]">n</span>
              <span className="text-[#f59e0b]">g</span>
              <span className="text-blue-600">e</span>
              <span className="text-[#8b5cf6]">r</span>
            </div>
          </div>

          {/* Syncing... dropdown pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSyncToast(!showSyncToast)}
              className="bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-blue-100/80 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span>Realtime</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            </button>

            {showSyncToast && (
              <div className="absolute right-0 top-full mt-1.5 w-60 p-3 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xl z-50 text-xs space-y-1 animate-in fade-in">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Realtime Cloud Sync
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Data presensi & SPP terhubung realtime ({students.length} siswa tersinkronisasi).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. SUB-HEADER: BRANCH SELECTOR & QUICK ACTIONS */}
        <div className="flex items-center justify-between pt-1">
          {/* Branch Pill with Pin Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBranchPicker(!showBranchPicker)}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>Cabang {mobileBranch}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-[190px]">
                  {mobileBranch === "Singkut"
                    ? "Depan Ponpes Ihya' As-Sunnah..."
                    : "Jl. Jenderal Sudirman No. 45..."}
                </div>
              </div>
            </button>

            {/* Branch Switcher Dropdown Popover */}
            {showBranchPicker && (
              <div className="absolute left-0 top-full mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xl z-50 space-y-1 animate-in fade-in">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Pilih Cabang Aktif
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileBranch("Singkut");
                    setSelectedBranch("Singkut");
                    setShowBranchPicker(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                    mobileBranch === "Singkut"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>Cabang Singkut</span>
                  {mobileBranch === "Singkut" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileBranch("Bangko");
                    setSelectedBranch("Bangko");
                    setShowBranchPicker(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                    mobileBranch === "Bangko"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>Cabang Bangko</span>
                  {mobileBranch === "Bangko" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          {/* 4 Circular Action Buttons: Theme, Search, Bell, Profile */}
          <div className="flex items-center gap-2">
            {/* 1. Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] flex items-center justify-center text-amber-500 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 2. Quick Search */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cari Data"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 3. Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xl z-50 text-xs space-y-2 animate-in fade-in">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>Notifikasi Terbaru</span>
                    <span className="text-[10px] text-blue-600 font-bold">2 Baru</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                      <div className="font-bold text-slate-800 dark:text-slate-200">Presensi Masuk</div>
                      <div className="text-slate-500 dark:text-slate-400">14 Siswa terkonfirmasi hadir hari ini.</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                      <div className="font-bold text-slate-800 dark:text-slate-200">Kuitansi SPP Lunas</div>
                      <div className="text-slate-500 dark:text-slate-400">Pembayaran SPP Kenzo Alvaro telah terekam.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Profile Photo / Avatar */}
            <Link
              href="/dashboard/pengaturan"
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                WH
              </div>
            </Link>
          </div>
        </div>

        {/* 3. HERO CAROUSEL BANNER (EXACT DARK CARD WITH 2 CTAS & INDICATORS) */}
        <div className="relative">
          <div className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#064e3b] to-slate-950 border border-emerald-800/40 min-h-[170px] flex flex-col justify-between space-y-3">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5">
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {bannerSlides[currentSlide].title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2">
                {bannerSlides[currentSlide].subtitle}
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300">
                  {bannerSlides[currentSlide].pill}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex items-center gap-2 pt-1">
              <Link
                href={bannerSlides[currentSlide].btn1.href}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>{bannerSlides[currentSlide].btn1.label}</span>
              </Link>
              <Link
                href={bannerSlides[currentSlide].btn2.href}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <span>{bannerSlides[currentSlide].btn2.label}</span>
              </Link>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2.5">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? "w-5 h-1.5 rounded-full bg-blue-600"
                    : "w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4. LAYANAN POPULER CABANG (4x4 GRID OF 16 CARDS) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
              Layanan Populer Cabang
            </h3>
            <button
              type="button"
              onClick={() => setShowQuickServices(!showQuickServices)}
              className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showQuickServices ? "Tutup" : "Buka"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {showQuickServices && (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 animate-in fade-in duration-200">
              {popularServices.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <Link
                    key={idx}
                    href={service.href}
                    className="p-2 sm:p-2.5 rounded-2xl bg-white/90 dark:bg-[#0f1a36]/90 backdrop-blur-xs border border-slate-200/90 dark:border-[#1d2d5a] flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs hover:scale-[1.03] transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-transform group-hover:scale-105 ${service.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate w-full group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                      {service.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Search Modal Overlay */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 pt-16">
            <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Pencarian Cepat Siswa & Fitur
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchQuery("");
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Ketik nama siswa / menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 font-medium placeholder:text-slate-400"
                />
              </div>

              {searchQuery && (
                <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                  {filteredStudentsSearch.length > 0 ? (
                    filteredStudentsSearch.map((student) => (
                      <Link
                        key={student.id}
                        href={`/dashboard/siswa?id=${student.id}`}
                        onClick={() => setShowSearchModal(false)}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{student.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {student.levelCurriculum} • Cabang {student.branch}
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-3 text-slate-400 text-xs">
                      Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP WORKSPACE VIEW (VISIBLE ON LARGE SCREENS >= lg)   */}
      {/* ========================================================= */}
      <div className="hidden lg:block p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Top Header Bar with Easy Learning House Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] p-1 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Easy Learning House"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ringkasan konsolidasi operasional bimbel Easy Learning House - Math Fingers
              </p>
            </div>
          </div>
        </div>

      {/* Hero Banner Super Admin */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                PUSAT KENDALI SUPER ADMIN
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                <Calendar className="w-3.5 h-3.5" />
                Minggu, 6 September 2026
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold">
                {branches.length} Cabang Aktif
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {CURRENT_USER.name} <span className="text-xl">👑</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5">
                Panel eksekutif pusat untuk mengelola data cabang, akun admin cabang, keuangan SPP global, serta memantau perkembangan seluruh siswa Math Fingers.
              </p>
            </div>

            {/* Branch Filter Pills */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase flex items-center gap-1">
                <span>▼</span>
                <span>FOKUS TAMPILAN DATA CABANG:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBranch("ALL")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedBranch === "ALL"
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-slate-800/90 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Semua Cabang (Pusat)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBranch("Singkut")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedBranch === "Singkut"
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-slate-800/90 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Singkut
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBranch("Bangko")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedBranch === "Bangko"
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-slate-800/90 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Bangko
                </button>

                <Link
                  href="/dashboard/cabang"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Kelola Cabang
                </Link>
              </div>
            </div>
          </div>

          {/* Right Brand Card with Easy Learning House Logo */}
          <div className="lg:w-72 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                <img
                  src="/logo.png"
                  alt="Easy Learning House"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-base">Easy Learning House</div>
                <div className="text-[10px] text-emerald-200 font-medium">Math Fingers Indonesia</div>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-normal">
              Sistem Pusat Math Fingers Multi-Cabang Cloud Ready
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-300 font-semibold border-t border-white/10">
              <span>Status: Online</span>
              <span>v3.3 Multi-Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Pusat Kendali Cepat Super Admin (6 Quick Action Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-blue-500">✨</span>
            <span>PUSAT KENDALI CEPAT SUPER ADMIN</span>
          </h2>
          <span className="text-[11px] text-slate-400">Akses langsung fitur esensial</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1 */}
          <Link
            href="/dashboard/cabang"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Cabang & Admin
              </div>
              <div className="text-[10px] text-slate-400 truncate">Tambah & atur cabang</div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/dashboard/siswa"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Data Siswa
              </div>
              <div className="text-[10px] text-slate-400 truncate">Semua data siswa</div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/dashboard/spp"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-amber-300 dark:hover:border-amber-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Rekap SPP Global
              </div>
              <div className="text-[10px] text-slate-400 truncate">Arus kas & tunggakan</div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/dashboard/database"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Database Cloud
              </div>
              <div className="text-[10px] text-slate-400 truncate">Editor cloud database</div>
            </div>
          </Link>

          {/* Card 5 */}
          <Link
            href="/dashboard/rapor"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-purple-300 dark:hover:border-purple-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Rapor & Nilai
              </div>
              <div className="text-[10px] text-slate-400 truncate">Evaluasi & cetak PDF</div>
            </div>
          </Link>

          {/* Card 6 */}
          <Link
            href="/dashboard/pengaturan"
            className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] hover:border-pink-300 dark:hover:border-pink-900 hover:shadow-md transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-600 transition-colors">
                Pengaturan
              </div>
              <div className="text-[10px] text-slate-400 truncate">Biaya SPP & kurikulum</div>
            </div>
          </Link>
        </div>
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cabang Terdaftar */}
        <div className="bg-white dark:bg-[#0f1a36] p-5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>CABANG TERDAFTAR</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {filteredStats.branchCount} <span className="text-sm font-semibold text-slate-500">Cabang</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#1d2d5a] mt-3">
              <span>{filteredStats.adminCount} Admin & Asisten</span>
              <Link href="/dashboard/cabang" className="text-blue-600 dark:text-sky-400 font-bold hover:underline">
                Kelola &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Total Siswa Aktif */}
        <div className="bg-white dark:bg-[#0f1a36] p-5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>TOTAL SISWA AKTIF</span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {filteredStats.activeStudents} <span className="text-sm font-semibold text-blue-600 dark:text-sky-400">Siswa Aktif</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#1d2d5a] mt-3">
              <span>0 Alumni Lulus</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{filteredStats.totalStudents} Total</span>
            </div>
          </div>
        </div>

        {/* Card 3: SPP Terkumpul */}
        <div className="bg-white dark:bg-[#0f1a36] p-5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>SPP TERKUMPUL</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-blue-600 dark:text-sky-400">
              Rp {filteredStats.sppCollected.toLocaleString("id-ID")}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#1d2d5a] mt-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
                Tunggakan: Rp {filteredStats.sppPending.toLocaleString("id-ID")}
              </span>
              <span className="font-bold text-blue-600 dark:text-sky-400">{filteredStats.sppPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Kelas & Kurikulum */}
        <div className="bg-white dark:bg-[#0f1a36] p-5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>KELAS & KURIKULUM</span>
            <span className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {classes.length} <span className="text-sm font-semibold text-slate-500">Kelas Aktif</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#1d2d5a] mt-3">
              <span>Kurikulum 10 Jari</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Level 1 - 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Manajemen Seluruh Cabang Bimbingan */}
      <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#1d2d5a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Hub Manajemen Seluruh Cabang Bimbingan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih cabang untuk memfokuskan data atau mengelola operasional cabang secara spesifik
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/cabang"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Cabang Baru
          </Link>
        </div>

        {/* Branch Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => {
            const branchStudentCount = students.filter((s) => s.branch === b.name).length;
            const branchInvoices = invoices.filter((i) => {
              const student = students.find((s) => s.name === i.studentName);
              return student?.branch === b.name;
            });
            const branchRevenue = branchInvoices
              .filter((i) => i.status === "LUNAS")
              .reduce((acc, curr) => acc + curr.amount, 0);

            return (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-[#1d2d5a] hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {b.code}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-sky-400 bg-blue-100/60 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Cabang Aktif
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{b.address}</span>
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-[#1d2d5a] grid grid-cols-3 text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{branchStudentCount}</div>
                    <div className="text-[10px] text-slate-400">Siswa Aktif</div>
                  </div>
                  <div>
                    <div className="font-bold text-blue-600 dark:text-sky-400">
                      Rp {(branchRevenue / 1000).toLocaleString("id-ID")}k
                    </div>
                    <div className="text-[10px] text-slate-400">Kas SPP</div>
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/siswa?branch=${b.name}`}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-sky-400 hover:underline pt-1"
                    >
                      Detail Siswa
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </>
);
}
