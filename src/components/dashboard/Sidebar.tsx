"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  PieChart,
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
  ExternalLink,
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
  const { theme, toggleTheme } = useTheme();
  const { landingPrograms, landingTestimonials, landingLeads, landingPartners } = useAppStore();
  const [activeTab, setActiveTab] = useState<"UTAMA" | "WEBSITE">("UTAMA");
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Automatically switch tab to WEBSITE if currently navigating /dashboard/website
  useEffect(() => {
    if (pathname.startsWith("/dashboard/website")) {
      setActiveTab("WEBSITE");
    }
  }, [pathname]);

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
          badge: "52",
          badgeColor: "bg-lime-400 text-slate-900 font-bold",
        },
        {
          name: "Kelas",
          href: "/dashboard/kelas",
          icon: LayoutGrid,
          badge: null,
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
          badge: "29",
          badgeColor: "bg-amber-400 text-slate-900 font-bold",
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
          badge: null,
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
          badgeColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold",
        },
        {
          name: "Program & Biaya Les",
          href: "/dashboard/website?tab=programs",
          icon: BookOpen,
          badge: `${landingPrograms.length}`,
          badgeColor: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold",
        },
        {
          name: "Testimoni Wali Murid",
          href: "/dashboard/website?tab=testimonials",
          icon: HeartHandshake,
          badge: `${landingTestimonials.length}`,
          badgeColor: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold",
        },
        {
          name: "Mitra & Logo Bergulir",
          href: "/dashboard/website?tab=partners",
          icon: Building2,
          badge: `${landingPartners?.filter((p) => p.active).length || 7}`,
          badgeColor: "bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-bold",
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
          badge: `${landingLeads.filter((l) => l.status === "Baru").length} Baru`,
          badgeColor: "bg-amber-400 text-slate-950 font-extrabold",
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
          badgeColor: "bg-emerald-600 text-white font-bold",
          external: true,
        },
      ],
    },
  ];

  const currentSections = activeTab === "UTAMA" ? menuSections : websiteSections;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 lg:static h-screen bg-white dark:bg-[#0e1c16] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      } ${
        mobileOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
        {/* Mac-style Window Controls + Dark Mode & Collapse Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-full bg-[#059669] text-white items-center justify-center hover:bg-[#047857] transition-all shadow-xs"
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
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 dark:border-emerald-800 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/logo.png"
              alt="Easy Learning House"
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight truncate">
                  Easy Learning
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  v3.3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                House of Math Fingers
              </p>
            </div>
          )}
        </div>

        {/* UTAMA vs WEBSITE Tab Switcher */}
        {!collapsed && (
          <div className="bg-slate-100/80 dark:bg-[#13271f] p-1 rounded-xl grid grid-cols-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setActiveTab("UTAMA")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "UTAMA"
                  ? "bg-[#059669] text-white shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              UTAMA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("WEBSITE")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "WEBSITE"
                  ? "bg-[#059669] text-white shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-slate-100"
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
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
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
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#059669] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#13271f] hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full shrink-0 ${
                        item.badgeColor || "bg-slate-100 text-slate-700"
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

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 relative">
        <div
          className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 ${
            collapsed ? "flex-col gap-2" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              WH
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {CURRENT_USER.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                  <span>👑</span>
                  <span>{CURRENT_USER.role}</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-medium">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">
                    {CURRENT_USER.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {CURRENT_USER.email}
                  </div>
                </div>
                <Link
                  href="/dashboard/pengaturan"
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Pengaturan Akun
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar (Logout)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
