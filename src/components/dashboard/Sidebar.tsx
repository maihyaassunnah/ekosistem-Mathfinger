"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Users,
  LayoutGrid,
  QrCode,
  CheckSquare,
  BookOpen,
  History,
  Edit3,
  BookMarked,
  FileText,
  CreditCard,
  Receipt,
  Wallet,
  GraduationCap,
  Building2,
  Database,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  Sparkles,
  X,
  Globe,
  HeartHandshake,
  UserPlus,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps = {}) {
  const pathname = usePathname();
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const { theme, toggleTheme } = useTheme();
  const {
    students,
    classes,
    invoices,
    landingPrograms,
    landingTestimonials,
    landingLeads,
    landingPartners,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"UTAMA" | "WEBSITE">("UTAMA");
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Automatically switch tab to WEBSITE if currently navigating /dashboard/website
  useEffect(() => {
    if (pathname.startsWith("/dashboard/website")) {
      setActiveTab("WEBSITE");
    }
  }, [pathname]);

  // Real Counts
  const realStudentCount = students.length;
  const realClassCount = classes.length;
  const unpaidInvoicesCount = invoices.filter((i) => i.status === "BELUM BAYAR").length;
  const newLeadsCount = landingLeads.filter((l) => l.status === "Baru").length;

  const menuSections = [
    {
      group: "UTAMA",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home,
          badge: null,
        },
        {
          name: "Siswa",
          href: "/dashboard/siswa",
          icon: Users,
          badge: `${realStudentCount}`,
          badgeColor: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 font-extrabold",
        },
        {
          name: "Kelas",
          href: "/dashboard/kelas",
          icon: LayoutGrid,
          badge: realClassCount > 0 ? `${realClassCount}` : null,
          badgeColor: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-bold",
        },
        {
          name: "Kartu QR Siswa",
          href: "/dashboard/kartu-qr",
          icon: QrCode,
          badge: null,
        },
      ],
    },
    {
      group: "AKADEMIK & PRESENSI",
      items: [
        {
          name: "Absensi Hari Ini",
          href: "/dashboard/absensi",
          icon: CheckSquare,
          badge: null,
        },
        {
          name: "Jurnal Guru",
          href: "/dashboard/jurnal",
          icon: BookOpen,
          badge: null,
        },
        {
          name: "Riwayat Jurnal",
          href: "/dashboard/riwayat-jurnal",
          icon: History,
          badge: null,
        },
        {
          name: "Input Nilai",
          href: "/dashboard/input-nilai",
          icon: Edit3,
          badge: null,
        },
        {
          name: "Kurikulum & Panduan",
          href: "/dashboard/kurikulum",
          icon: BookMarked,
          badge: null,
        },
        {
          name: "Rapor Siswa",
          href: "/dashboard/rapor",
          icon: FileText,
          badge: null,
        },
      ],
    },
    {
      group: "KEUANGAN",
      items: [
        {
          name: "Pembayaran SPP",
          href: "/dashboard/spp",
          icon: CreditCard,
          badge: unpaidInvoicesCount > 0 ? `${unpaidInvoicesCount}` : null,
          badgeColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold",
        },
        {
          name: "Riwayat SPP",
          href: "/dashboard/riwayat-spp",
          icon: Receipt,
          badge: null,
        },
        {
          name: "Arus Keuangan",
          href: "/dashboard/arus-keuangan",
          icon: Wallet,
          badge: null,
        },
      ],
    },
    {
      group: "AKUN & SISTEM",
      items: [
        {
          name: "Alumni / Lulus",
          href: "/dashboard/alumni",
          icon: GraduationCap,
          badge: null,
        },
        {
          name: "Cabang & Admin",
          href: "/dashboard/cabang",
          icon: Building2,
          badge: null,
        },
        {
          name: "Database Cloud",
          href: "/dashboard/database",
          icon: Database,
          badge: "17",
          badgeColor: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold",
        },
        {
          name: "Pengaturan",
          href: "/dashboard/pengaturan",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const websiteSections = [
    {
      group: "KONTEN LANDING PAGE",
      items: [
        {
          name: "Pengaturan Beranda & Promo",
          href: "/dashboard/website",
          icon: Sparkles,
          badge: "Hero & WA",
          badgeColor: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 font-bold",
        },
        {
          name: "Program & Biaya Les",
          href: "/dashboard/website?tab=programs",
          icon: BookOpen,
          badge: `${landingPrograms.length}`,
          badgeColor: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-bold",
        },
        {
          name: "Testimoni Wali Murid",
          href: "/dashboard/website?tab=testimonials",
          icon: HeartHandshake,
          badge: `${landingTestimonials.length}`,
          badgeColor: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold",
        },
        {
          name: "Mitra & Logo Bergulir",
          href: "/dashboard/website?tab=partners",
          icon: Building2,
          badge: `${landingPartners?.filter((p) => p.active).length || 0}`,
          badgeColor: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 font-bold",
        },
      ],
    },
    {
      group: "LEADS & AKUISISI",
      items: [
        {
          name: "Pendaftar Trial Class",
          href: "/dashboard/website?tab=leads",
          icon: UserPlus,
          badge: newLeadsCount > 0 ? `${newLeadsCount} Baru` : null,
          badgeColor: "bg-blue-600 text-white font-extrabold shadow-xs shadow-blue-500/20",
        },
      ],
    },
    {
      group: "AKSES PUBLIK",
      items: [
        {
          name: "Lihat Website Publik",
          href: "/",
          icon: Globe,
          badge: "Live ↗",
          badgeColor: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold",
          external: true,
        },
      ],
    },
  ];

  const currentSections = activeTab === "UTAMA" ? menuSections : websiteSections;

  // Active user data from session or fallback
  const userName = session?.user?.name || CURRENT_USER.name;
  const userEmail = session?.user?.email || CURRENT_USER.email;
  const userRole = (session?.user as any)?.role || CURRENT_USER.role;
  const userPhoto =
    session?.user?.image ||
    CURRENT_USER.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 lg:static h-screen bg-white/95 dark:bg-[#0a1128] border-r border-blue-100/80 dark:border-[#162244] flex flex-col justify-between transition-all duration-300 shrink-0 backdrop-blur-xs ${
        collapsed ? "w-20" : "w-64"
      } ${
        mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-blue-100/80 dark:border-[#162244] space-y-4">
        {/* Mac-style Window Controls + Dark Mode & Collapse Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-blue-50 dark:hover:bg-[#132042] flex items-center justify-center transition-colors cursor-pointer"
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-blue-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-full bg-blue-600 text-white items-center justify-center hover:bg-blue-700 transition-all shadow-xs shadow-blue-500/30"
              title={collapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer"
                title="Tutup Menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Brand Header with Easy Learning House Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 dark:border-[#1d2d5a] p-0.5 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/logo.png"
              alt="Easy Learning House"
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight truncate">
                  Easy Learning
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300">
                  v3.3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                House of Math Fingers
              </p>
            </div>
          )}
        </div>

        {/* UTAMA vs WEBSITE Tab Switcher */}
        {!collapsed && (
          <div className="bg-blue-50/70 dark:bg-[#0f1a36] p-1 rounded-xl grid grid-cols-2 text-xs font-bold text-slate-600 dark:text-slate-400 border border-blue-100/80 dark:border-[#1d2d5a]">
            <button
              type="button"
              onClick={() => setActiveTab("UTAMA")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer font-extrabold ${
                activeTab === "UTAMA"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs shadow-blue-500/25"
                  : "hover:text-blue-600 dark:hover:text-white"
              }`}
            >
              UTAMA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("WEBSITE")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer font-extrabold ${
                activeTab === "WEBSITE"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-xs shadow-blue-500/25"
                  : "hover:text-blue-600 dark:hover:text-white"
              }`}
            >
              WEBSITE
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menus (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {currentSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1">
                {section.group}
              </div>
            )}
            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={item.name}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-700 dark:text-slate-200 hover:bg-blue-50/70 dark:hover:bg-[#132042] hover:text-blue-700 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full shrink-0 shadow-2xs ${
                        item.badgeColor || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer (Fixed at Bottom Left with Photo Profile) */}
      <div className="p-3 border-t border-blue-100/80 dark:border-[#162244] bg-blue-50/40 dark:bg-[#070d1e] relative">
        <div
          className={`flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-[#0f1a36] border border-blue-100 dark:border-[#1d2d5a] shadow-xs ${
            collapsed ? "flex-col gap-2" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={userPhoto}
                alt={userName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#0f1a36]" />
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-sky-400 font-bold truncate">
                  <span>👑</span>
                  <span className="truncate">{userRole}</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-[#132042] transition cursor-pointer"
              title="Menu Profil"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-52 bg-white dark:bg-[#0f1a36] border border-blue-100 dark:border-[#1d2d5a] rounded-2xl shadow-xl py-1.5 z-50 text-xs font-medium animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1d2d5a]">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {userEmail}
                  </div>
                </div>
                <Link
                  href="/dashboard/pengaturan"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#132042] font-semibold transition"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-500" />
                  Pengaturan Akun
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-emerald-500" />
                  Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
