"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Check,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  ShieldCheck,
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  GraduationCap,
  Sun,
  Moon,
  Menu,
  Heart,
  Brain,
  Smile,
  Zap,
  Building2,
  Navigation,
  ExternalLink,
  Layers,
  BadgeCheck,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAppStore, LandingProgramItem } from "@/lib/store";

const TEACHERS = [
  {
    name: "Ustadzah Sri Wahyuni, S.Pd.I",
    role: "Master Trainer Jaritmatika & Kurikulum",
    branch: "Singkut & Bangko",
    experience: "7+ Tahun Pengalaman",
    specialty: "Formasi Jari & Sinkronisasi Otak Kiri-Kanan",
    avatarColor: "from-emerald-600 to-teal-500",
  },
  {
    name: "Febrianti Dewi, S.Pd",
    role: "Senior Tutor Jaritmatika",
    branch: "Cabang Singkut",
    experience: "4+ Tahun Pengalaman",
    specialty: "Level Pra-Dasar & Motorik Halus Usia Dini",
    avatarColor: "from-emerald-600 to-teal-500",
  },
  {
    name: "Bapak Faisal Rahman, S.Kom",
    role: "Instruktur & Koordinator Cabang",
    branch: "Cabang Bangko",
    experience: "5+ Tahun Pengalaman",
    specialty: "Level Dasar, Perkalian Cepat & Disiplin Hitung",
    avatarColor: "from-emerald-600 to-teal-500",
  },
  {
    name: "Dewi Safitri, S.H",
    role: "Tutor Jaritmatika Terampil",
    branch: "Cabang Bangko",
    experience: "3+ Tahun Pengalaman",
    specialty: "Level Terampil & Persiapan Uji Kecepatan",
    avatarColor: "from-emerald-600 to-teal-500",
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const {
    landingHero,
    landingPrograms,
    landingTestimonials,
    addLandingLead,
    landingPartners,
    students,
  } = useAppStore();

  // Dropdown Submenus & Mobile Accordion States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  // Active Branch on Interactive Map
  const [activeMapBranch, setActiveMapBranch] = useState<"Singkut" | "Bangko">("Singkut");

  // Trial Registration Modal State
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialForm, setTrialForm] = useState({
    studentName: "",
    studentAge: "",
    parentName: "",
    phone: "",
    branch: "Singkut" as "Singkut" | "Bangko",
    notes: "",
  });

  // Selected program when clicking "Daftar Level Ini"
  const [selectedProgramTitle, setSelectedProgramTitle] = useState<string>("");

  const handleOpenTrial = (programTitle: string = "") => {
    setSelectedProgramTitle(programTitle);
    setTrialForm((prev) => ({
      ...prev,
      notes: programTitle ? `Berminat pada program: ${programTitle}` : "",
    }));
    setTrialSuccess(false);
    setShowTrialModal(true);
  };

  const handleSubmitTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialForm.studentName || !trialForm.phone || !trialForm.parentName) return;

    addLandingLead({
      studentName: trialForm.studentName,
      studentAge: trialForm.studentAge || "Belum diisi",
      parentName: trialForm.parentName,
      phone: trialForm.phone,
      branch: trialForm.branch,
      notes: trialForm.notes,
    });

    setTrialSuccess(true);
  };

  const handleDirectWhatsAppFromModal = () => {
    const cleanPhone =
      trialForm.branch === "Singkut" ? "6281279498907" : "6281379720841";

    const message = encodeURIComponent(
      `Halo Admin Math Fingers Cabang ${trialForm.branch},\n\nSaya (${trialForm.parentName}) baru saja mendaftar Coba Kelas Gratis (Trial Class) untuk anak saya:\n- Nama Anak: ${trialForm.studentName}\n- Usia/Kelas: ${trialForm.studentAge}\n- No. WA: ${trialForm.phone}\n${
        trialForm.notes ? `- Catatan: ${trialForm.notes}\n` : ""
      }\nMohon info jadwal trial terdekat ya. Terima kasih!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    setShowTrialModal(false);
  };

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apa perbedaan metode Jaritmatika Math Fingers dengan sempoa biasa?",
      a: "Sempoa memerlukan alat fisik yang rentan tertinggal atau hilang. Di Math Fingers, anak diajarkan memaksimalkan 10 jari tangannya sendiri sebagai kalkulator alami yang selalu melekat. Selain itu, formasi jari tangan Math Fingers melatih sinkronisasi otak kiri (logika hitung) dan otak kanan (imajinasi visual), sehingga anak berhitung cepat secara intuitif.",
    },
    {
      q: "Mulai usia berapa anak bisa mendaftar di Math Fingers?",
      a: "Anak dapat mulai belajar sejak usia 4 tahun (jenjang TK/PAUD) di Level Pra-Dasar. Pada usia dini, materi disampaikan melalui pendekatan bermain, kartu flashcard simbol, dan senam jari ceria untuk mengasah motorik halus sebelum masuk ke penjumlahan angka.",
    },
    {
      q: "Apakah ada kelas percobaan gratis (Trial Class) sebelum mendaftar?",
      a: "Ya, betul sekali! Kami menyediakan 1 sesi Kelas Percobaan Gratis (Free Trial Class) di Cabang Singkut maupun Cabang Bangko. Orang tua dan ananda dapat mencoba langsung suasana belajar dan melihat bagaimana konsep jari tangan diajarkan sebelum memutuskan mendaftar.",
    },
    {
      q: "Bagaimana jadwal belajar dan fleksibilitas kelasnya?",
      a: "Setiap kelas berlangsung 2x seminggu dengan durasi 60-90 menit per sesi. Tersedia pilihan jadwal hari kerja (Senin & Rabu, Selasa & Kamis) atau kelas akhir pekan (Sabtu & Ahad) pada sesi siang maupun sore.",
    },
    {
      q: "Bagaimana orang tua memantau perkembangan belajar anak?",
      a: "Math Fingers menerapkan sistem presensi berbasis QR Code digital kartu siswa. Setiap perkembangan materi dicatat pada Jurnal Guru dan diuji melalui Uji Kecepatan Bulanan dengan Rapor Digital yang dibagikan berkala ke WhatsApp orang tua.",
    },
  ];

  interface NavSubItem {
    title: string;
    desc: string;
    href?: string;
    action?: () => void;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    external?: boolean;
  }

  interface NavMenuItem {
    id: string;
    label: string;
    items: NavSubItem[];
  }

  const navMenus: NavMenuItem[] = [
    {
      id: "tentang",
      label: "Tentang Kami",
      items: [
        {
          title: "Keunggulan Metode",
          desc: "Formasi 10 jari cerdas tanpa alat sempoa fisik",
          href: "#keunggulan",
          icon: Zap,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Guru & Tutor Pengajar",
          desc: "8+ Pendidik tersertifikasi nasional & ramah anak",
          href: "#guru",
          icon: Users,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Mitra Kerja Sama",
          desc: "Sekolah dasar, TK/PAUD & yayasan rekanan",
          href: "#partner",
          icon: Building2,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Keseimbangan Otak",
          desc: "Sinkronisasi kerja otak kiri dan kanan anak",
          href: "#keunggulan",
          icon: Brain,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
      ],
    },
    {
      id: "program",
      label: "Program & Biaya",
      items: [
        {
          title: "Level Belajar",
          desc: "Pra-Dasar, Dasar, Terampil, hingga Mahir",
          href: "#program",
          icon: Layers,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Biaya & Paket Les",
          desc: "Biaya SPP bulanan terjangkau & transparan",
          href: "#biaya",
          icon: CreditCard,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Coba Kelas Gratis (Trial)",
          desc: "1x Sesi percobaan tanpa dipungut biaya",
          action: () => handleOpenTrial(),
          icon: Sparkles,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
      ],
    },
    {
      id: "cabang",
      label: "Cabang & Lokasi",
      items: [
        {
          title: "Cabang Singkut",
          desc: "Jl. Lintas Sumatera Km. 1, Sarolangun",
          href: "#cabang",
          icon: MapPin,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Cabang Bangko",
          desc: "Jl. Jenderal Sudirman No. 45, Merangin",
          href: "#cabang",
          icon: MapPin,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Peta Google Maps",
          desc: "Peta rute interaktif & petunjuk jalan",
          href: "#maps",
          icon: Navigation,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
      ],
    },
    {
      id: "bantuan",
      label: "Pusat Bantuan",
      items: [
        {
          title: "Testimoni Wali Murid",
          desc: "Ulasan nyata orang tua siswa berprestasi",
          href: "#testimoni",
          icon: Star,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Tanya Jawab (FAQ)",
          desc: "Jawaban pertanyaan umum seputar les",
          href: "#faq",
          icon: HelpCircle,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
        {
          title: "Konsultasi WhatsApp",
          desc: "Tanya jadwal & konsultasi langsung ke admin",
          href: `https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
            landingHero.whatsappGreeting
          )}`,
          external: true,
          icon: MessageCircle,
          color: "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100/80 dark:border-emerald-900/60",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#070d1e] text-[#0F172A] dark:text-[#f8fafc] transition-colors duration-200 selection:bg-emerald-600 selection:text-white">
      {/* 1. TOP PROMO ANNOUNCEMENT BAR */}
      {landingHero.promoActive && (
        <div className="bg-gradient-to-r from-[#0041a8] via-[#0062ff] to-[#0052d4] text-white text-xs font-semibold py-2.5 px-4 text-center shadow-xs relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase">
              {landingHero.targetDiscount || "PROMO"}
            </span>
            <span>{landingHero.promoBanner}</span>
            <button
              type="button"
              onClick={() => handleOpenTrial()}
              className="underline underline-offset-2 hover:text-amber-200 font-bold ml-1 cursor-pointer transition-colors"
            >
              Klaim Sekarang ➜
            </button>
          </div>
        </div>
      )}

      {/* 2. TOP STICKY NAVBAR */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0f1a36]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo with Easy Learning House */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white border border-emerald-100 p-1 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Easy Learning House"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                  Easy Learning House
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Math Fingers
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Bimbel Berhitung Cepat Jaritmatika
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdown Submenus */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navMenus.map((menu) => {
              const isOpen = activeDropdown === menu.id;
              return (
                <div
                  key={menu.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(menu.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : menu.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isOpen
                        ? "bg-slate-100 dark:bg-[#162244] text-emerald-600 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#11231c] hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Popover */}
                  {isOpen && (
                    <div className="absolute top-full left-0 pt-1.5 z-50 animate-in fade-in slide-in-from-top-1.5 duration-150">
                      <div className="w-72 p-2 rounded-2xl bg-white/95 dark:bg-[#0c1813]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-1">
                        {menu.items.map((sub, sIdx) => {
                          const SubIcon = sub.icon;
                          if (sub.action) {
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => {
                                  setActiveDropdown(null);
                                  sub.action?.();
                                }}
                                className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-emerald-50/70 dark:hover:bg-[#162244] transition-all group cursor-pointer"
                              >
                                <div className={`p-2 rounded-xl shrink-0 ${sub.color}`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1">
                                    {sub.title}
                                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                    {sub.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          }
                          return (
                            <a
                              key={sIdx}
                              href={sub.href}
                              target={sub.external ? "_blank" : undefined}
                              rel={sub.external ? "noopener noreferrer" : undefined}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#162244] transition-all group cursor-pointer"
                            >
                              <div className={`p-2 rounded-xl shrink-0 ${sub.color}`}>
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  {sub.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                  {sub.desc}
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Trial CTA Button */}
            <button
              type="button"
              onClick={() => handleOpenTrial()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
              <span>Coba Gratis</span>
            </button>

            {/* Portal Login WebApp Button */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0062ff] hover:bg-[#0052d4] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Masuk WebApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Menu Navigasi"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1a36] px-4 py-4 space-y-3 shadow-xl animate-in fade-in">
            <div className="space-y-1">
              {navMenus.map((menu) => {
                const isAccordionOpen = mobileAccordion === menu.id;
                return (
                  <div key={menu.id} className="border-b border-slate-100 dark:border-slate-800/80 pb-1">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : menu.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#162244]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{menu.label}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isAccordionOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>

                    {isAccordionOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1 animate-in fade-in duration-150">
                        {menu.items.map((sub, sIdx) => {
                          const SubIcon = sub.icon;
                          if (sub.action) {
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => {
                                  setMobileNavOpen(false);
                                  sub.action?.();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-left"
                              >
                                <div className={`p-1.5 rounded-lg shrink-0 ${sub.color}`}>
                                  <SubIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold">{sub.title}</span>
                              </button>
                            );
                          }
                          return (
                            <a
                              key={sIdx}
                              href={sub.href}
                              target={sub.external ? "_blank" : undefined}
                              rel={sub.external ? "noopener noreferrer" : undefined}
                              onClick={() => setMobileNavOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162244] hover:text-emerald-600"
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${sub.color}`}>
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-semibold">{sub.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleOpenTrial();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Daftar Coba Kelas Gratis</span>
              </button>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0062ff] text-white text-xs font-bold shadow-xs"
              >
                <span>Masuk ke WebApp Siswa/Guru</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 3. HERO PROMOTIONAL SECTION */}
        <section className="relative overflow-hidden py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Background Decorative Blur Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/5 blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
              <span>{landingHero.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
              {landingHero.headline}
            </h1>

            {/* Subheadline Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {landingHero.subheadline}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0062ff] hover:bg-[#0052d4] text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Daftar Coba Kelas Gratis (Trial)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
                  landingHero.whatsappGreeting
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#162244] transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>

            {/* Dynamic Realtime Stats Proof Bar (Siswa & Guru) */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {/* Stat 1: Siswa Aktif */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60">
                    <Users className="w-4 h-4" />
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Realtime
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {students?.length || 52}+
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  Siswa Aktif Terbimbing
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Presensi digital kartu QR & jurnal guru berkala
                </div>
              </div>

              {/* Stat 2: Guru & Tutor */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60">
                    <Award className="w-4 h-4" />
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Bersertifikat
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  8+
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  Guru & Tutor Jaritmatika
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Standarisasi metode hitung cepat & ramah anak
                </div>
              </div>

              {/* Stat 3: Cabang Belajar */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Resmi
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  2 Cabang
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  Singkut & Bangko
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Gedung ber-AC, parkir aman, & ruang tunggu
                </div>
              </div>

              {/* Stat 4: Kepuasan Wali Murid */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60">
                    <Star className="w-4 h-4 fill-amber-400 dark:fill-amber-400 text-emerald-600 dark:text-emerald-300" />
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Rating 4.9
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  98.8%
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  Kepuasan Wali Murid
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Peningkatan nyata fokus & ketangkasan berhitung
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Keyframes Style for Marquee Animation */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* MITRA & PARTNER KERJA SAMA (ROLLING LOGO MARQUEE) SECTION */}
        <section
          id="partner"
          className="py-10 bg-slate-100/70 dark:bg-[#07130e] border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 text-center space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Mitra & Jaringan Kerja Sama
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Dipercaya Oleh Berbagai Sekolah & Lembaga Pendidikan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Logo mitra binaan resmi yang bekerja sama dengan Math Fingers dalam pembelajaran Jaritmatika.
            </p>
          </div>

          {/* Infinite Rolling Logos Track */}
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-4 animate-marquee py-2 w-max">
              {[
                ...landingPartners.filter((p) => p.active),
                ...landingPartners.filter((p) => p.active),
              ].map((partner, idx) => (
                <div
                  key={`${partner.id}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all shrink-0 select-none group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-400 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    {partner.logoText || partner.name.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {partner.name}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {partner.category}
                    </div>
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-emerald-600 ml-1 p-1"
                      title="Buka Tautan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partnership WA Link */}
          <div className="mt-5 text-center">
            <a
              href={`https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
                "Halo Admin Math Fingers, sekolah/lembaga kami tertarik menjalin kerja sama kemitraan program les Jaritmatika."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
            >
              <span>Tertarik Bermitra dengan Sekolah / Instansi Anda? Ajukan Kerja Sama Kemitraan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* 4. KEUNGGULAN METODE JARITMATIKA SECTION */}
        <section
          id="keunggulan"
          className="py-16 sm:py-20 bg-white dark:bg-[#0f1a36] border-y border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
                Mengapa Memilih Math Fingers?
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Metode Hitung Alami yang Melatih Kecepatan & Kecerdasan Otak
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Tanpa sempoa, tanpa menghafal rumus mati. Math Fingers mengubah 10 jari anak menjadi instrumen berhitung super cepat, presisi, dan menyenangkan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-emerald-500 transition-colors shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold shadow-2xs">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Alat Hitung Selalu Melekat
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  10 jari tangan anak adalah anugerah terhebat. Tidak perlu cemas alat sempoa tertinggal atau baterai kalkulator habis saat ulangan.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-emerald-500 transition-colors shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold shadow-2xs">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Seimbangkan Otak Kiri & Kanan
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Gerakan motorik formasi jari tangan menstimulasi otak kanan (daya ingat spasial visual) bersamaan dengan logika angka di otak kiri.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-emerald-500 transition-colors shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold shadow-2xs">
                  <Smile className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Belajar Ceria Bebas Stres
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Konsep belajar ramah anak dipadukan dengan senam jari, kartu kuis interaktif, dan tutor yang penuh empati dan kesabaran.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-emerald-500 transition-colors shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold shadow-2xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Monitoring Rapor & Presensi QR
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Presensi digital instan via scan QR kartu murid, jurnal catatan guru tiap pertemuan, dan laporan rapor digital yang transparan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TIM PENGAJAR & GURU JARITMATIKA TERSERTIFIKASI SECTION */}
        <section
          id="guru"
          className="py-16 sm:py-20 bg-white dark:bg-[#0f1a36] border-b border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" />
                Tenaga Pendidik Berdedikasi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Belajar Langsung dari Guru Jaritmatika Tersertifikasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Seluruh tutor Math Fingers telah mengantongi sertifikasi pengajaran Jaritmatika resmi, berjiwa sabar, dan memiliki pendekatan ramah anak yang membuat matematika jadi menyenangkan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEACHERS.map((teacher, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0a1711] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* Avatar with initials & branch badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${teacher.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                      >
                        {teacher.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {teacher.branch}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mt-0.5">
                        {teacher.role}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Fokus: <strong className="text-slate-700 dark:text-slate-300">{teacher.specialty}</strong>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                      {teacher.experience}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tutor Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info badge */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#0c2017] border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0062ff] text-white flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  Setiap guru mencatat <strong>Jurnal Pembelajaran</strong> tiap sesi pertemuan yang dipantau langsung oleh kepala cabang dan wali murid.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="px-4 py-2 rounded-xl bg-[#0062ff] hover:bg-[#0052d4] text-white font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer shrink-0"
              >
                Coba Kelas Belajar Bersama Guru Kami ➜
              </button>
            </div>
          </div>
        </section>

        {/* 5. PROGRAM BELAJAR & JENJANG LEVEL SECTION */}
        <section id="program" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
              Jenjang Belajar Terstruktur
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Pilihan Program & Level Sesuai Usia Anak
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Disusun secara bertahap mulai dari pengenalan simbol jari usia dini hingga trik perkalian dan pembagian cepat kompetisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landingPrograms.map((prog) => (
              <div
                key={prog.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 bg-white dark:bg-[#0f1a36] ${
                  prog.popular
                    ? "border-2 border-[#0062ff] shadow-xl ring-2 ring-emerald-500/20 relative"
                    : "border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                }`}
              >
                {prog.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0062ff] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    Paling Diminati
                  </div>
                )}

                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">
                      {prog.levelTitle}
                    </h3>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300 mt-0.5">
                      {prog.targetAge}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      Rp {prog.monthlyFee.toLocaleString("id-ID")}
                      <span className="text-xs font-medium text-slate-400"> /bulan</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Biaya Registrasi: Rp {prog.registrationFee.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Yang Didapatkan Siswa:
                    </div>
                    {prog.benefits.map((benefit, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOpenTrial(prog.levelTitle)}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer ${
                      prog.popular
                        ? "bg-[#0062ff] hover:bg-[#0052d4] text-white"
                        : "bg-slate-100 dark:bg-[#162244] hover:bg-slate-200 dark:hover:bg-[#1a382c] text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    Daftar Coba Level Ini ➜
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. BIAYA & PAKET LES TRANSPARAN SECTION */}
        <section
          id="biaya"
          className="py-16 sm:py-20 bg-slate-100/60 dark:bg-[#0b1812] border-y border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
                Investasi Pendidikan Terjangkau
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Paket Fasilitas Lengkap Tanpa Biaya Tersembunyi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Semua siswa baru langsung mendapatkan starter pack belajar eksklusif untuk mendukung latihan di kelas dan di rumah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Item 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Buku Modul & Flashcard Eksklusif
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Modul bergambar bertahap yang didesain khusus agar anak mudah mengulang gerakan jari bersama ayah bunda di rumah.
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Kartu ID QR Code Absensi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Kartu pelajar resmi dengan QR Code unik. Menumbuhkan kedisiplinan dan absensi cepat tercatat di dashboard orang tua.
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Sertifikat Kelulusan Resmi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sertifikat resmi setiap kenaikan level yang menjadi bukti kompetensi berhitung cepat dan apresiasi atas prestasi anak.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CABANG & JADWAL KELAS SECTION */}
        <section id="cabang" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
              Pusat Kegiatan Belajar
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              2 Cabang Resmi Math Fingers di Jambi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Kunjungi cabang terdekat atau hubungi admin masing-masing cabang untuk jadwal kelas percobaan gratis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cabang Singkut */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Cabang 1: Sarolangun
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Kelas Buka
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Math Fingers Cabang Singkut
                </h3>
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Jl. Lintas Sumatera Km. 1, Singkut, Kec. Singkut, Kab. Sarolangun, Jambi 37482
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <span>
                    Jadwal: <strong>Sabtu & Ahad (14:00 - 15:30 WIB)</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <span>
                    Admin Cabang: <strong>Ibu Rina Marlina, S.Pd</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/6281279498907?text=Halo%20Admin%20Math%20Fingers%20Singkut,%20saya%20ingin%20info%20pendaftaran%20les"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WA Cabang Singkut</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setTrialForm((prev) => ({ ...prev, branch: "Singkut" }));
                    handleOpenTrial("Cabang Singkut");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#162244]"
                >
                  Daftar Trial
                </button>
              </div>
            </div>

            {/* Cabang Bangko */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Cabang 2: Merangin
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Kelas Buka
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Math Fingers Cabang Bangko
                </h3>
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Jl. Jenderal Sudirman No. 45, Pematang Kandis, Kec. Bangko, Kab. Merangin, Jambi 37314
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <span>
                    Jadwal: <strong>Senin s/d Ahad (Sesi Siang & Sore)</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <span>
                    Admin Cabang: <strong>Bapak Faisal Rahman, S.Kom</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/6281379720841?text=Halo%20Admin%20Math%20Fingers%20Bangko,%20saya%20ingin%20info%20pendaftaran%20les"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WA Cabang Bangko</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setTrialForm((prev) => ({ ...prev, branch: "Bangko" }));
                    handleOpenTrial("Cabang Bangko");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#162244]"
                >
                  Daftar Trial
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PETA LOKASI & NAVIGASI GOOGLE MAPS SECTION */}
        <section
          id="maps"
          className="py-16 sm:py-20 bg-slate-50 dark:bg-[#07130e] border-y border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Navigation className="w-4 h-4" />
                Peta Lokasi & Denah Google Maps
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Kunjungi Bimbel Math Fingers Terdekat
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Pilih cabang untuk melihat denah lokasi interaktif Google Maps, fasilitas gedung, dan langsung dapatkan rute arah perjalanan.
              </p>
            </div>

            {/* Branch Selector Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveMapBranch("Singkut")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMapBranch === "Singkut"
                      ? "bg-[#0062ff] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Cabang 1: Singkut (Sarolangun)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMapBranch("Bangko")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMapBranch === "Bangko"
                      ? "bg-[#0062ff] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Cabang 2: Bangko (Merangin)</span>
                </button>
              </div>
            </div>

            {/* Maps & Details Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Map Embed Container */}
              <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-200 dark:bg-slate-800 min-h-[380px] sm:min-h-[440px] relative">
                <iframe
                  title={`Google Maps ${activeMapBranch}`}
                  src={
                    activeMapBranch === "Singkut"
                      ? "https://maps.google.com/maps?q=Singkut,+Sarolangun,+Jambi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      : "https://maps.google.com/maps?q=Bangko,+Merangin,+Jambi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  }
                  className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1a36]/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Lokasi Aktif: Cabang {activeMapBranch}</span>
                </div>
              </div>

              {/* Branch Info & Action Card */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {activeMapBranch === "Singkut" ? "Kabupaten Sarolangun" : "Kabupaten Merangin"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Buka Setiap Hari
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      Math Fingers Cabang {activeMapBranch}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {activeMapBranch === "Singkut"
                          ? "Jl. Lintas Sumatera Km. 1, Singkut, Kec. Singkut, Kab. Sarolangun, Jambi 37482"
                          : "Jl. Jenderal Sudirman No. 45, Pematang Kandis, Kec. Bangko, Kab. Merangin, Jambi 37314"}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                      <span>
                        Jadwal:{" "}
                        <strong>
                          {activeMapBranch === "Singkut"
                            ? "Sabtu & Ahad (14:00 - 15:30 WIB)"
                            : "Senin s/d Ahad (Sesi Siang & Sore)"}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                      <span>
                        Admin Cabang:{" "}
                        <strong>
                          {activeMapBranch === "Singkut"
                            ? "Ibu Rina Marlina, S.Pd"
                            : "Bapak Faisal Rahman, S.Kom"}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0 mt-0.5" />
                      <span>
                        Fasilitas:{" "}
                        <strong>Ruang Ber-AC, Ruang Tunggu Wali Murid, WiFi, & Parkir Aman</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Direct Google Maps Direction Link */}
                  <a
                    href={
                      activeMapBranch === "Singkut"
                        ? "https://maps.google.com/?q=Singkut+Sarolangun+Jambi"
                        : "https://maps.google.com/?q=Bangko+Merangin+Jambi"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors shadow-xs"
                  >
                    <Navigation className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                    <span>Petunjuk Arah Google Maps ↗</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={
                        activeMapBranch === "Singkut"
                          ? "https://wa.me/6281279498907?text=Halo%20Admin%20Math%20Fingers%20Singkut,%20saya%20ingin%20info%20pendaftaran%20les"
                          : "https://wa.me/6281379720841?text=Halo%20Admin%20Math%20Fingers%20Bangko,%20saya%20ingin%20info%20pendaftaran%20les"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WA</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setTrialForm((prev) => ({ ...prev, branch: activeMapBranch }));
                        handleOpenTrial(`Cabang ${activeMapBranch}`);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Coba Gratis</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONI WALI MURID SECTION */}
        <section
          id="testimoni"
          className="py-16 sm:py-24 bg-white dark:bg-[#0f1a36] border-y border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
                Cerita Sukses Siswa
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Apa Kata Orang Tua Murid Math Fingers?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Peningkatan rasa percaya diri dan ketangkasan berhitung anak adalah kebahagiaan terbesar kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landingTestimonials.map((testi) => (
                <div
                  key={testi.id}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0b1812] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 dark:fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;{testi.comment}&quot;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        {testi.parentName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Wali dari {testi.studentName}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {testi.branch}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ ACCORDION SECTION */}
        <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-widest">
              Pertanyaan yang Sering Diajukan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Tanya Jawab Seputar Les Jaritmatika
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1a36] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-emerald-600/70 dark:text-emerald-300/70 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. FINAL CONVERSION BANNER */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-[#0041a8] via-[#0062ff] to-[#0052d4] text-white p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Kelas Percobaan Terbatas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Beri Hadiah Kepercayaan Diri Seumur Hidup Lewat Jaritmatika!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Daftarkan si kecil untuk mengikuti 1 sesi Free Trial Class sekarang juga. Lihat sendiri betapa cerianya ia saat menemukan cara berhitung cepat dengan jarinya!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-emerald-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Daftar Coba Kelas Gratis ➜
              </button>
              <a
                href={`https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
                  "Halo Admin Math Fingers, saya ingin konsultasi pendaftaran les jaritmatika untuk anak saya."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-300/30 text-white font-bold text-sm transition-all"
              >
                Chat WhatsApp Admin
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f1a36] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 dark:border-emerald-800 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/logo.png"
                  alt="Easy Learning House"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tight">
                  Easy Learning House
                </span>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                  Math Fingers Jaritmatika Indonesia
                </p>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Bimbingan belajar Jaritmatika terpadu di Sarolangun dan Merangin. Mengembangkan keterampilan berhitung cepat, konsentrasi, dan daya ingat anak melalui formasi 10 jari tangan alami.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[11px] tracking-wider">
              Lokasi Cabang
            </div>
            <div className="text-slate-600 dark:text-slate-400 space-y-1">
              <div>📍 Cabang 1: Singkut, Sarolangun</div>
              <div>📍 Cabang 2: Bangko, Merangin</div>
              <div>💬 WA: 0812-7949-8907</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[11px] tracking-wider">
              Akses Sistem
            </div>
            <div className="space-y-1.5">
              <Link
                href="/login"
                className="inline-block text-emerald-600 dark:text-emerald-300 hover:underline font-bold"
              >
                Portal Masuk WebApp (Siswa/Guru) ➜
              </Link>
              <div>
                <Link
                  href="/dashboard"
                  className="text-slate-500 dark:text-slate-400 hover:underline"
                >
                  Dashboard WebApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Bimbel Math Fingers. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-2">
            <span>Metode Jaritmatika Indonesia</span>
            <span>•</span>
            <span>Singkut & Bangko</span>
          </div>
        </div>
      </footer>

      {/* 12. INTERACTIVE TRIAL CLASS REGISTRATION MODAL */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowTrialModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {!trialSuccess ? (
              <form onSubmit={handleSubmitTrial} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Free Trial Class • Tanpa Komitmen</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Daftar Coba Kelas Gratis
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Isi formulir singkat di bawah ini. Admin cabang kami akan segera menghubungi Anda via WhatsApp untuk mengatur jadwal sesi coba jaritmatika ananda.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Calon Siswa (Ananda) *
                    </label>
                    <input
                      type="text"
                      required
                      value={trialForm.studentName}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, studentName: e.target.value })
                      }
                      placeholder="Contoh: Kenzo Alvaro"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Usia / Kelas Sekolah *
                      </label>
                      <input
                        type="text"
                        required
                        value={trialForm.studentAge}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, studentAge: e.target.value })
                        }
                        placeholder="Contoh: 7 Thn / Kelas 2 SD"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Pilihan Cabang *
                      </label>
                      <select
                        value={trialForm.branch}
                        onChange={(e) =>
                          setTrialForm({
                            ...trialForm,
                            branch: e.target.value as "Singkut" | "Bangko",
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      >
                        <option value="Singkut">Cabang Singkut (Sarolangun)</option>
                        <option value="Bangko">Cabang Bangko (Merangin)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={trialForm.parentName}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, parentName: e.target.value })
                      }
                      placeholder="Contoh: Bunda Maya"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={trialForm.phone}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, phone: e.target.value })
                      }
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={trialForm.notes}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, notes: e.target.value })
                      }
                      placeholder="Contoh: Ingin trial hari Sabtu sore"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0062ff] hover:bg-[#0052d4] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Ajukan Coba Kelas Gratis Sekarang</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    Alhamdulillah, Pendaftaran Terkirim!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Data ananda <strong>{trialForm.studentName}</strong> sudah tersimpan di sistem Math Fingers Cabang {trialForm.branch}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-[#162244] text-left text-xs space-y-1 text-slate-700 dark:text-slate-300 border border-emerald-100 dark:border-emerald-900">
                  <div>• Calon Siswa: <strong>{trialForm.studentName}</strong> ({trialForm.studentAge})</div>
                  <div>• Orang Tua: <strong>{trialForm.parentName}</strong></div>
                  <div>• Cabang Tujuan: <strong>Cabang {trialForm.branch}</strong></div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDirectWhatsAppFromModal}
                    className="w-full py-3 rounded-xl bg-[#0062ff] hover:bg-[#0052d4] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Lanjutkan Konfirmasi via WhatsApp Cabang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTrialModal(false)}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Tutup Jendela Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
