"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
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
  BookText,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

function SidebarInner({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentProgram = searchParams?.get("program");

  const currentUser = useCurrentUser();
  const { isSuperAdmin, isBranchAssistant, allowedBranch } = currentUser;
  const { theme, toggleTheme } = useTheme();
  const {
    students,
    classes,
    invoices,
    branches,
    landingPrograms,
    landingTestimonials,
    landingLeads,
    landingPartners,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"UTAMA" | "MEMBACA" | "WEBSITE">("UTAMA");
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if branch has Membaca / Matematika program
  const currentBranch = branches?.find((b) => b.name === allowedBranch);
  const hasMembacaProgram =
    isSuperAdmin ||
    (currentBranch?.programs ? currentBranch.programs.includes("MEMBACA") : true);
  const hasMatematikaProgram =
    isSuperAdmin ||
    (currentBranch?.programs ? currentBranch.programs.includes("MATEMATIKA") : true);

  // Available tabs calculation
  const availableTabs: ("UTAMA" | "MEMBACA" | "WEBSITE")[] = [];
  if (hasMatematikaProgram) availableTabs.push("UTAMA");
  if (hasMembacaProgram) availableTabs.push("MEMBACA");
  if (isSuperAdmin) availableTabs.push("WEBSITE");

  // Automatically switch tab based on current pathname & query parameter
  useEffect(() => {
    if (isSuperAdmin && pathname.startsWith("/dashboard/website")) {
      setActiveTab("WEBSITE");
    } else if (pathname.startsWith("/dashboard/rapor-membaca") || currentProgram === "MEMBACA") {
      setActiveTab("MEMBACA");
    } else if (currentProgram === "MATEMATIKA") {
      setActiveTab("UTAMA");
    } else if (!currentProgram && activeTab === "WEBSITE" && !pathname.startsWith("/dashboard/website")) {
      setActiveTab("UTAMA");
    }
  }, [pathname, currentProgram, isSuperAdmin, activeTab]);

  // Branch-scoped Collections
  const scopedStudents = allowedBranch
    ? students.filter((s) => s.branch === allowedBranch)
    : students;
  const scopedClasses = allowedBranch
    ? classes.filter((c) => c.branch === allowedBranch)
    : classes;
  const scopedInvoices = allowedBranch
    ? invoices.filter((inv) => {
        const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
        return st?.branch === allowedBranch;
      })
    : invoices;

  // Program-isolated Counts for Matematika
  const mathStudents = scopedStudents.filter((s) => (s as any).programType !== "MEMBACA");
  const mathClasses = scopedClasses.filter((c) => (c as any).programType !== "MEMBACA");
  const mathInvoices = scopedInvoices.filter((inv) => {
    const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
    return (st as any)?.programType !== "MEMBACA";
  });
  const mathStudentCount = mathStudents.length;
  const mathClassCount = mathClasses.length;
  const unpaidMathInvoicesCount = mathInvoices.filter((i) => i.status === "BELUM BAYAR").length;

  // Program-isolated Counts for Membaca
  const readingStudents = scopedStudents.filter((s) => (s as any).programType === "MEMBACA");
  const readingClasses = scopedClasses.filter((c) => (c as any).programType === "MEMBACA");
  const readingInvoices = scopedInvoices.filter((inv) => {
    const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
    return (st as any)?.programType === "MEMBACA";
  });
  const readingStudentCount = readingStudents.length;
  const readingClassCount = readingClasses.length;
  const unpaidReadingInvoicesCount = readingInvoices.filter((i) => i.status === "BELUM BAYAR").length;

  const newLeadsCount = landingLeads.filter((l) => l.status === "Baru").length;

  // 1. TAB UTAMA (Les Matematika)
  const menuSections = [
    {
      group: "UTAMA (MATEMATIKA)",
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
          badge: `${mathStudentCount}`,
          badgeColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold",
        },
        {
          name: "Kelas",
          href: "/dashboard/kelas",
          icon: LayoutGrid,
          badge: mathClassCount > 0 ? `${mathClassCount}` : null,
          badgeColor: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-emerald-300 font-bold",
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
    ...(!isBranchAssistant && !currentUser.isTutor
      ? [
          {
            group: "KEUANGAN",
            items: [
              {
                name: "Pembayaran SPP",
                href: "/dashboard/spp",
                icon: CreditCard,
                badge: unpaidMathInvoicesCount > 0 ? `${unpaidMathInvoicesCount}` : null,
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
        ]
      : []),
    {
      group: "AKUN & SISTEM",
      items: [
        {
          name: "Alumni / Lulus",
          href: "/dashboard/alumni",
          icon: GraduationCap,
          badge: null,
        },
        ...(isSuperAdmin
          ? [
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
                badgeColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold",
              },
              {
                name: "Pengaturan",
                href: "/dashboard/pengaturan",
                icon: Settings,
                badge: null,
              },
            ]
          : []),
      ],
    },
  ];

  // 2. TAB MEMBACA (Les Membaca)
  const membacaSections = [
    {
      group: "LES MEMBACA",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard?program=MEMBACA",
          icon: Home,
          badge: null,
        },
        {
          name: "Siswa",
          href: "/dashboard/siswa?program=MEMBACA",
          icon: Users,
          badge: `${readingStudentCount}`,
          badgeColor: "bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-extrabold",
        },
        {
          name: "Kelas",
          href: "/dashboard/kelas?program=MEMBACA",
          icon: LayoutGrid,
          badge: readingClassCount > 0 ? `${readingClassCount}` : null,
          badgeColor: "bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-bold",
        },
        {
          name: "Kartu QR Siswa",
          href: "/dashboard/kartu-qr?program=MEMBACA",
          icon: QrCode,
          badge: null,
        },
      ],
    },
    {
      group: "AKADEMIK & EVALUASI",
      items: [
        {
          name: "Absensi Hari Ini",
          href: "/dashboard/absensi?program=MEMBACA",
          icon: CheckSquare,
          badge: null,
        },
        {
          name: "Jurnal Guru",
          href: "/dashboard/jurnal?program=MEMBACA",
          icon: BookOpen,
          badge: null,
        },
        {
          name: "Riwayat Jurnal",
          href: "/dashboard/riwayat-jurnal?program=MEMBACA",
          icon: History,
          badge: null,
        },
        {
          name: "Rapor Membaca",
          href: "/dashboard/rapor-membaca",
          icon: BookText,
          badge: "Level 1-7",
          badgeColor: "bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-bold",
        },
      ],
    },
    ...(!isBranchAssistant && !currentUser.isTutor
      ? [
          {
            group: "KEUANGAN",
            items: [
              {
                name: "Pembayaran SPP",
                href: "/dashboard/spp?program=MEMBACA",
                icon: CreditCard,
                badge: unpaidReadingInvoicesCount > 0 ? `${unpaidReadingInvoicesCount}` : null,
                badgeColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold",
              },
              {
                name: "Riwayat SPP",
                href: "/dashboard/riwayat-spp?program=MEMBACA",
                icon: Receipt,
                badge: null,
              },
              {
                name: "Arus Keuangan",
                href: "/dashboard/arus-keuangan?program=MEMBACA",
                icon: Wallet,
                badge: null,
              },
            ],
          },
        ]
      : []),
    {
      group: "AKUN & SISTEM",
      items: [
        {
          name: "Alumni / Lulus",
          href: "/dashboard/alumni?program=MEMBACA",
          icon: GraduationCap,
          badge: null,
        },
        ...(isSuperAdmin
          ? [
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
                badgeColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold",
              },
              {
                name: "Pengaturan",
                href: "/dashboard/pengaturan",
                icon: Settings,
                badge: null,
              },
            ]
          : []),
      ],
    },
  ];

  // 3. TAB WEBSITE (Landing Page CMS - Super Admin Only)
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
          badgeColor: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-emerald-300 font-bold",
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
          badgeColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold",
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
          badgeColor: "bg-emerald-600 text-white font-extrabold shadow-xs shadow-emerald-500/20",
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

  const currentSections =
    activeTab === "MEMBACA"
      ? membacaSections
      : activeTab === "WEBSITE" && isSuperAdmin
      ? websiteSections
      : menuSections;

  // Active user data from centralized hook
  const userName = currentUser.name;
  const userEmail = currentUser.email;
  const userRole = currentUser.role;
  const userPhoto =
    currentUser.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  // Check if nav item is currently active
  const isItemActive = (href: string) => {
    if (href.includes("?")) {
      const [itemPath, itemQuery] = href.split("?");
      const itemParams = new URLSearchParams(itemQuery);
      const itemProgram = itemParams.get("program");
      const itemTab = itemParams.get("tab");

      if (itemProgram) {
        return pathname === itemPath && currentProgram === itemProgram;
      }
      if (itemTab) {
        return pathname === itemPath && searchParams?.get("tab") === itemTab;
      }
      return pathname === itemPath;
    }

    if (activeTab === "MEMBACA") {
      return pathname === href && (currentProgram === "MEMBACA" || href === "/dashboard/rapor-membaca");
    }
    if (activeTab === "UTAMA") {
      return pathname === href && (!currentProgram || currentProgram === "MATEMATIKA");
    }
    return pathname === href;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 lg:static h-screen bg-white/95 dark:bg-[#0a1128] border-r border-emerald-100/80 dark:border-[#162244] flex flex-col justify-between transition-all duration-300 shrink-0 backdrop-blur-xs ${
        collapsed ? "w-20" : "w-64"
      } ${
        mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-emerald-100/80 dark:border-[#162244] space-y-4">
        {/* Window Controls + Dark Mode & Collapse Button */}
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
              className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-emerald-50 dark:hover:bg-[#132042] flex items-center justify-center transition-colors cursor-pointer"
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-full bg-emerald-600 text-white items-center justify-center hover:bg-emerald-700 transition-all shadow-xs shadow-emerald-500/30"
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
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 dark:border-[#1d2d5a] p-0.5 flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  v3.3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                House of Math Fingers
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Tab Switcher:
            - Super Admin: UTAMA, MEMBACA, WEBSITE (3 tabs)
            - Admin Cabang (Matematika & Membaca): UTAMA, MEMBACA (2 tabs)
            - Admin Cabang (1 Program): 1 tab (No switch needed)
        */}
        {!collapsed && availableTabs.length > 1 && (
          <div
            className={`bg-emerald-50/70 dark:bg-[#0f1a36] p-1 rounded-xl grid ${
              availableTabs.length === 3 ? "grid-cols-3" : "grid-cols-2"
            } text-xs font-bold text-slate-600 dark:text-slate-400 border border-emerald-100/80 dark:border-[#1d2d5a]`}
          >
            {availableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 rounded-lg transition-all cursor-pointer font-extrabold text-center truncate px-1 text-[11px] sm:text-xs ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25"
                    : "hover:text-emerald-600 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
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
              const isActive = isItemActive(item.href);

              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={item.name}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25"
                      : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50/70 dark:hover:bg-[#132042] hover:text-emerald-700 dark:hover:text-white"
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
                        isActive
                          ? "bg-white/25 text-white font-extrabold"
                          : item.badgeColor ||
                            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
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
      <div className="p-3 border-t border-emerald-100/80 dark:border-[#162244] bg-emerald-50/40 dark:bg-[#070d1e] relative">
        <div
          className={`flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-[#0f1a36] border border-emerald-100 dark:border-[#1d2d5a] shadow-xs ${
            collapsed ? "flex-col gap-2" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={userPhoto}
                alt={userName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white dark:ring-[#0f1a36]" />
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
                  <span>{isSuperAdmin ? "👑" : "🏢"}</span>
                  <span className="truncate">
                    {userRole} {allowedBranch ? `(${allowedBranch})` : "(Pusat)"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-slate-400 hover:text-emerald-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-[#132042] transition cursor-pointer"
              title="Menu Profil"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-52 bg-white dark:bg-[#0f1a36] border border-emerald-100 dark:border-[#1d2d5a] rounded-2xl shadow-xl py-1.5 z-50 text-xs font-medium animate-in fade-in">
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
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#132042] font-semibold transition"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-600" />
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

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside className="w-64 h-screen bg-white dark:bg-[#0a1128] border-r border-emerald-100/80 dark:border-[#162244]" />
      }
    >
      <SidebarInner {...props} />
    </Suspense>
  );
}
