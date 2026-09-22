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
  ChevronDown,
  Award,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  Play,
  Layers,
  Building2,
  Zap,
  Menu,
  X,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const {
    landingHero,
    landingPrograms,
    landingTestimonials,
    landingNews,
    landingEvents,
    landingPartners,
    addLandingLead,
  } = useAppStore();

  // Dropdown Submenus & Mobile Drawer States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  // Active Story Tab State (Student Stories section)
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Video Tour Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  const handleOpenTrial = (programTitle: string = "") => {
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
      `Halo Admin Math Fingers Cabang ${trialForm.branch},\n\nSaya (${trialForm.parentName}) ingin mendaftar Coba Kelas Gratis (Trial Class) untuk anak saya:\n- Nama Anak: ${trialForm.studentName}\n- Usia/Kelas: ${trialForm.studentAge}\n- No. WA: ${trialForm.phone}\n${
        trialForm.notes ? `- Catatan: ${trialForm.notes}\n` : ""
      }\nMohon info jadwal kelas trial terdekat ya. Terima kasih!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    setShowTrialModal(false);
  };

  // Student Stories Data from Store (with fallback)
  const storiesList = (landingTestimonials && landingTestimonials.length > 0)
    ? landingTestimonials
    : [
        {
          id: "1",
          storyNumber: "01",
          title: "Dari Takut Matematika, Kini Jadi Juara Berhitung di Sekolah",
          studentName: "Ananda Farhan (Usia 8 Th)",
          parentName: "Bunda Rina Hartati (Wali Murid)",
          branch: "Singkut",
          role: "Siswa Jaritmatika Level 3 - Cabang Singkut",
          rating: 5,
          comment:
            "Dulu Farhan sering menangis kalau ada PR matematika. Setelah 4 bulan belajar formasi 10 jari di Math Fingers, dia sekarang paling cepat menghitung di kelas dan selalu dapat nilai 100!",
          avatarUrl: "/images/landing/student-story.jpg",
        },
        {
          id: "2",
          storyNumber: "02",
          title: "Metode Jari Tangan Praktis, Ujian Sekolah Tanpa Alat Bantu",
          studentName: "Kayla Az-Zahra (Usia 7 Th)",
          parentName: "Bapak Hendra, S.Pd (Wali Murid)",
          branch: "Bangko",
          role: "Siswa Jaritmatika Level 2 - Cabang Bangko",
          rating: 5,
          comment:
            "Sangat bersyukur kenal metode Math Fingers. Anak saya tidak perlu bawa sempoa fisik atau sembunyi kalkulator. 10 jari tangannya sendiri sudah jadi kalkulator alami yang selalu siap saat ujian.",
          avatarUrl: "/images/landing/student-story.jpg",
        },
        {
          id: "3",
          storyNumber: "03",
          title: "Belajar Membaca Menyenangkan, 3 Bulan Langsung Lancar Tanpa Mengeja",
          studentName: "Rayyan Al-Fatih (Usia 5 Th)",
          parentName: "Ibu Desi Ratnasari (Wali Murid)",
          branch: "Singkut",
          role: "Siswa Program Les Membaca Fonik",
          rating: 5,
          comment:
            "Metode fonik di Math Fingers sangat ceria dan ramah anak. Rayyan yang awalnya sulit fokus, kini sudah bisa membaca buku cerita sendiri dengan lancar tanpa terbata-bata.",
          avatarUrl: "/images/landing/student-story.jpg",
        },
      ];

  const safeStoryIdx = activeStoryIdx >= storiesList.length ? 0 : activeStoryIdx;
  const currentStory = storiesList[safeStoryIdx];

  // News & Activities from Store
  const newsItems = (landingNews && landingNews.length > 0)
    ? landingNews.filter((n) => n.isActive !== false)
    : [
        {
          id: "1",
          title: "Serunya Latihan Formasi 10 Jari Tangan & Senam Otak di Cabang Singkut",
          category: "KELAS JARITMATIKA",
          date: "20 Sep 2026",
          author: "Febrianti Dewi, S.Pd",
          image: "/images/landing/hero-kids.jpg",
          summary: "Mengasah ketangkasan jari tangan anak melalui senam ritmis dan simulasi hitung cepat ratusan tanpa kertas corat-coret.",
        },
        {
          id: "2",
          title: "Ujian Kenaikan Level Semester: Puluhan Siswa Raih Nilai Sempurna",
          category: "PRESTASI & SERTIFIKASI",
          date: "15 Sep 2026",
          author: "Tim Akademik Math Fingers",
          image: "/images/landing/student-story.jpg",
          summary: "Pemberian piagam penghargaan resmi dan evaluasi rapor kompetensi digital bagi siswa yang menuntaskan level dasar.",
        },
        {
          id: "3",
          title: "Tips Efektif Mendampingi Anak Belajar Matematika di Rumah Tanpa Stres",
          category: "EDUKASI ORANG TUA",
          date: "10 Sep 2026",
          author: "Ustadzah Sri Wahyuni, S.Pd.I",
          image: "/images/landing/about-teacher.jpg",
          summary: "Pendekatan positif agar anak tidak trauma angka: gunakan permainan visual dan apresiasi proses belajar jari tangan.",
        },
        {
          id: "4",
          title: "Inovasi Kartu QR Digital: Orang Tua Pantau Absensi & Nilai Siswa Real-time",
          category: "TEKNOLOGI EDUKASI",
          date: "05 Sep 2026",
          author: "Manajemen Sistem",
          image: "/images/landing/programs-bg.jpg",
          summary: "Kemudahan integrasi notifikasi presensi otomatis dan riwayat jurnal perkembangan belajar langsung ke WhatsApp wali murid.",
        },
      ];

  // Upcoming Events from Store
  const events = (landingEvents && landingEvents.length > 0)
    ? landingEvents.filter((e) => e.isActive !== false)
    : [
        {
          id: "1",
          day: "25",
          month: "SEP",
          title: "Trial Class Gratis Serentak Akhir Pekan",
          time: "14:00 – 16:00 WIB",
          location: "Cabang Singkut & Cabang Bangko",
          desc: "Sesi terbuka bagi orang tua dan ananda untuk mencoba langsung metode jari tangan dan konsultasi kurikulum.",
        },
        {
          id: "2",
          day: "01",
          month: "OKT",
          title: "Pembukaan Pendaftaran Gelombang Baru (Diskon 50%)",
          time: "08:00 – 17:00 WIB",
          location: "Pendaftaran Online & Kantor Cabang",
          desc: "Dapatkan potongan uang pendaftaran 50% dan bonus modul belajar lengkap serta kartu digital siswa.",
        },
        {
          id: "3",
          day: "18",
          month: "OKT",
          title: "Lomba Hitung Cepat 10 Jari Antar Siswa Math Fingers",
          time: "09:00 – 12:00 WIB",
          location: "Gedung Serbaguna Cabang Singkut",
          desc: "Ajang uji kecepatan, ketelitian, dan sportivitas berhitung jaritmatika dengan piala serta beasiswa belajar.",
        },
      ];

  // Navigation Menus Configuration
  const navMenus = [
    {
      id: "tentang",
      label: "Tentang Kami",
      items: [
        {
          title: "Metode 10 Jari Alami",
          desc: "Optimalisasi otak kiri & kanan tanpa sempoa",
          href: "#tentang",
        },
        {
          title: "Guru & Tutor Pengajar",
          desc: "Pendidik tersertifikasi nasional & ramah anak",
          href: "#tentang",
        },
        {
          title: "Mitra & Kerjasama",
          desc: "Kolaborasi dengan TK/PAUD & Sekolah Dasar",
          href: "#mitra",
        },
      ],
    },
    {
      id: "program",
      label: "Program Belajar",
      items: [
        {
          title: "Jaritmatika Pra-Dasar (TK/PAUD)",
          desc: "Pengenalan formasi jari & simbol angka ceria",
          href: "#program",
        },
        {
          title: "Jaritmatika Dasar & Terampil (SD)",
          desc: "Hitung cepat tambah, kurang, kali, bagi",
          href: "#program",
        },
        {
          title: "Les Membaca Fonik Cepat",
          desc: "Metode membaca lancar menyenangkan tanpa mengeja",
          href: "#program",
        },
        {
          title: "Kelas Privat Intensif",
          desc: "Bimbingan one-on-one persiapan akademik",
          href: "#program",
        },
      ],
    },
    {
      id: "cabang",
      label: "Cabang & Lokasi",
      items: [
        {
          title: "Cabang Singkut (Pusat)",
          desc: "Gedung ber-AC, parkir luas, fasilitas lengkap",
          href: "#cabang",
        },
        {
          title: "Cabang Bangko / Tabir Timur",
          desc: "Ruang kelas nyaman & akses mudah dijangkau",
          href: "#cabang",
        },
      ],
    },
    {
      id: "cerita",
      label: "Prestasi & Cerita",
      items: [
        {
          title: "Cerita Prestasi Siswa",
          desc: "Kisah inspiratif anak dari berbagai level",
          href: "#cerita",
        },
        {
          title: "Kabar & Kegiatan",
          desc: "Dokumentasi kelas & event belajar terkini",
          href: "#kabar",
        },
        {
          title: "Agenda Mendatang",
          desc: "Jadwal trial class gratis & kompetisi",
          href: "#agenda",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#070d1e] text-slate-900 dark:text-white font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Deep Emerald Green Accent) */}
      {/* ========================================================================= */}
      <div className="bg-[#047857] text-white text-[11px] font-medium py-2 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* Socials & Hotline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors p-0.5"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors p-0.5"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors p-0.5"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/6281279498907"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors p-0.5"
                title="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="hidden sm:inline-block text-emerald-300/60">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-100">
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>Hotline Singkut: +62 812-7949-8907 | Bangko: +62 813-7972-0841</span>
            </div>
          </div>

          {/* Quick Links & CTA on Top Bar */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-semibold text-emerald-100">
            <Link href="/login" className="hover:text-white transition-colors">
              Portal Siswa & Guru
            </Link>
            <span className="text-emerald-400/50">|</span>
            <a href="#cabang" className="hover:text-white transition-colors">
              Cabang Resmi
            </a>
            <span className="text-emerald-400/50">|</span>
            <button
              type="button"
              onClick={() => handleOpenTrial()}
              className="text-amber-300 hover:text-white transition-colors font-extrabold cursor-pointer"
            >
              ★ Coba Kelas Gratis
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVBAR (Clean Single-Row Layout, No buttons crowding, Theme Toggle included) */}
      {/* ========================================================================= */}
      <header className="bg-white/95 dark:bg-[#0f1a36]/95 border-b border-slate-200/90 dark:border-[#1d2d5a] sticky top-0 z-40 shadow-xs backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name (Responsive, guaranteed not to overflow on mobile screens) */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <img
                src="/logo.png"
                alt="Easy Learning House - Math Fingers"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
              <span className="font-black text-slate-900 dark:text-white tracking-tight text-sm sm:text-base lg:text-lg whitespace-nowrap">
                Easy Learning House
              </span>
              <span className="self-start sm:self-auto px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap mt-0.5 sm:mt-0">
                Math Fingers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Strictly Single Row) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 transition-colors whitespace-nowrap"
            >
              Beranda
            </Link>

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
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isOpen
                        ? "bg-emerald-50 dark:bg-[#162244] text-emerald-700 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-50 dark:hover:bg-[#162244]"
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                      }`}
                    />
                  </button>

                  {/* Dropdown Popover */}
                  {isOpen && (
                    <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="w-72 p-2 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xl space-y-1">
                        {menu.items.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-[#162244] transition-all group"
                          >
                            <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                              {sub.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {sub.desc}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Controls: Dark / Light Mode Toggle + Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0f1a36] text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#162244] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                  <span className="text-[11px] font-bold text-amber-300 hidden sm:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                  <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Gelap</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-slate-200 dark:border-[#1d2d5a] bg-slate-50/80 dark:bg-[#0f1a36]"
              aria-label="Buka Menu Samping"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE SIDE MENU DRAWER (Smooth Slide-In Animation from Right) */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileNavOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop Overlay with Blur */}
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileNavOpen(false)}
        />

        {/* Side Panel Drawer */}
        <aside
          className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-[#0c152e] border-l border-slate-200 dark:border-[#1d2d5a] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
            mobileNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Top Header */}
          <div className="p-4 border-b border-slate-200 dark:border-[#1d2d5a] flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#0f1a36]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-0.5 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Easy Learning House"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white leading-none">
                  Easy Learning House
                </div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Math Fingers Indonesia
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Quick Link: Beranda */}
            <Link
              href="/"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Beranda Utama</span>
            </Link>

            {/* Accordion Navigation Menus */}
            <div className="space-y-1.5">
              {navMenus.map((menu) => {
                const isAccordionOpen = mobileAccordion === menu.id;
                return (
                  <div
                    key={menu.id}
                    className="border border-slate-200/80 dark:border-[#1d2d5a]/60 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-[#101c3d]/50"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : menu.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span>{menu.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isAccordionOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                        }`}
                      />
                    </button>
                    {isAccordionOpen && (
                      <div className="px-3 pb-2.5 pt-1 space-y-1 border-t border-slate-100 dark:border-[#1d2d5a]/40 bg-white dark:bg-[#0c152e]">
                        {menu.items.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block px-2 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-[#162244] transition-colors"
                          >
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                              {sub.title}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-400 leading-tight mt-0.5">
                              {sub.desc}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Hotline / Contacts Card */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Hotline & WhatsApp Cabang:</span>
              </div>
              <div className="text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                <a
                  href="https://wa.me/6281279498907"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                >
                  <span>Cabang Singkut:</span>
                  <span className="font-bold">+62 812-7949-8907</span>
                </a>
                <a
                  href="https://wa.me/6281379720841"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                >
                  <span>Cabang Bangko:</span>
                  <span className="font-bold">+62 813-7972-0841</span>
                </a>
              </div>
            </div>
          </div>

          {/* Drawer Footer CTA Buttons */}
          <div className="p-4 border-t border-slate-200 dark:border-[#1d2d5a] bg-slate-50/80 dark:bg-[#0f1a36]/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                handleOpenTrial();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Daftar Coba Kelas Gratis (Trial)</span>
            </button>
            <Link
              href="/login"
              onClick={() => setMobileNavOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0c152e] hover:bg-slate-100 dark:hover:bg-[#162244] text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-colors"
            >
              <span>Masuk ke WebApp Siswa & Guru</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </Link>
          </div>
        </aside>
      </div>

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 3. HERO BANNER SECTION (High Contrast Solid Dark Background & Overlay) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-slate-950 text-white">
          {/* Background Image & Rich Dark Emerald Overlay (Guaranteed High Contrast) */}
          <div className="absolute inset-0 z-0">
            <img
              src={landingHero.heroImage || "/images/landing/hero-kids.jpg"}
              alt="Anak-anak belajar jaritmatika Math Fingers"
              className="w-full h-full object-cover object-center opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/80 to-slate-950/90" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center space-y-6">
            {/* Play Video Trigger Circle (Image 2 style) */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 border-4 border-white/80 shadow-2xl transition-all hover:scale-110 cursor-pointer"
                title="Tonton Video Pengenalan Metode Math Fingers"
              >
                <span className="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping opacity-75 pointer-events-none" />
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Tagline / Sub-badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{landingHero.tagline || "Bimbel Berhitung Cepat Jaritmatika No. 1 di Sarolangun & Merangin"}</span>
            </div>

            {/* Main Headline (Razor Sharp Contrast: White on Dark Backdrop) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-md whitespace-pre-line">
              {landingHero.headline || "SELAMAT DATANG DI \nMATH FINGERS INDONESIA"}
            </h1>

            {/* Subheadline Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-3xl mx-auto drop-shadow-sm font-normal">
              {landingHero.subheadline || "Mengoptimalkan potensi kecerdasan otak kanan dan kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, berhitung cepat akurat, dan percaya diri!"}
            </p>

            {/* Dual CTAs with Razor Sharp Contrast */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Daftar Kelas Percobaan (Trial Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
                  landingHero.whatsappGreeting
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-md font-bold text-sm transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ABOUT & METODE UNGGULAN (Image 2 style: UniCamp College of Business) */}
        {/* ========================================================================= */}
        <section id="tentang" className="py-20 lg:py-28 bg-white dark:bg-[#080f25] border-b border-slate-100 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Photo */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1d2d5a] bg-slate-100 dark:bg-[#0f1a36]">
                  <img
                    src={landingHero.aboutImage || "/images/landing/about-teacher.jpg"}
                    alt="Pembelajaran Jaritmatika Math Fingers"
                    className="w-full h-auto object-cover hover:scale-102 transition-transform duration-500"
                  />
                </div>
                {/* Decorative Badge Overlay */}
                <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-white dark:bg-[#0f1a36] p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-[#1d2d5a] flex items-center gap-3.5 max-w-xs">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {landingHero.teacherBadgeText || "8+ Tutor Pengajar"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {landingHero.teacherBadgeDesc || "Tersertifikasi Nasional & Ramah Anak"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Content */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Metode Unggulan Jaritmatika
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3 leading-tight whitespace-pre-line">
                    {landingHero.aboutTitle || "Metode 10 Jari Alami: \nKalkulator Pintar yang Selalu Melekat"}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {landingHero.aboutDesc1 || "Math Fingers hadir memberikan solusi belajar berhitung yang membahagiakan. Melalui formasi 10 jari tangan yang terstandarisasi, anak diajarkan mengolah logika matematika tanpa memerlukan alat bantu sempoa fisik atau kalkulator."}
                </p>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {landingHero.aboutDesc2 || "Metode ini secara aktif melatih sinkronisasi otak kiri (daya logika dan rumus hitung) dengan otak kanan (imajinasi visual gerak jari). Anak tidak lagi menghafal rumus secara mekanis, melainkan memahami konsep angka dengan cepat, tepat, dan gembira."}
                </p>

                {/* Key Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Tanpa Sempoa Fisik (Alat Tidak Tertinggal)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Menumbuhkan Rasa Percaya Diri di Sekolah</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Hitung Tambah, Kurang, Kali, Bagi Kilat</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Rapor & Kartu Presensi Digital QR Real-time</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenTrial()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <span>Daftar Trial Class & Konsultasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. ACTION STRIP "Mulai Langkah Prestasi" (Image 2 style: "Let's Get Started") */}
        {/* ========================================================================= */}
        <section className="bg-[#047857] py-14 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Mulai Langkah Prestasi Si Kecil Hari Ini
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
                Temukan program belajar terbaik dan jadwalkan sesi percobaan gratis untuk ananda sekarang juga.
              </p>
            </div>

            {/* 3 Action Cards (Image 2 style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <a
                href="#program"
                className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-[#162244] transition-all font-black text-sm shadow-md hover:-translate-y-1 flex items-center justify-center text-center border border-emerald-100 dark:border-[#1d2d5a] group"
              >
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  1. Pilih Program Belajar Ananda ➔
                </span>
              </a>

              <a
                href={`https://wa.me/${landingHero.whatsappNumber}?text=${encodeURIComponent(
                  "Halo Admin Math Fingers, saya ingin informasi mengenai biaya SPP dan pilihan jadwal kelas yang tersedia."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-[#162244] transition-all font-black text-sm shadow-md hover:-translate-y-1 flex items-center justify-center text-center border border-emerald-100 dark:border-[#1d2d5a] group"
              >
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  2. Info Biaya SPP & Jadwal Kelas ➔
                </span>
              </a>

              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="p-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all font-black text-sm shadow-md hover:-translate-y-1 flex items-center justify-center text-center cursor-pointer"
              >
                <span>3. Daftar Kelas Percobaan (Trial Gratis) ★</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. STUDENT STORIES & TESTIMONIALS (Image 2 style: "Student Stories") */}
        {/* ========================================================================= */}
        <section id="cerita" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0b1329] border-b border-slate-200/80 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Title and Right Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 border-b border-slate-200 dark:border-[#1d2d5a] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-emerald-600 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Cerita Wali Murid & Prestasi
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                  Kisah Nyata Siswa Math Fingers
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Daftarkan Ananda Sekarang ➔
              </button>
            </div>

            {/* Split Content: Photo on Left + Numbered List on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Featured Student Photo */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36]">
                  <img
                    src={currentStory.avatarUrl || "/images/landing/student-story.jpg"}
                    alt={currentStory.title || "Siswa Berprestasi Math Fingers"}
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="p-4 bg-white dark:bg-[#0f1a36] border-t border-slate-100 dark:border-[#1d2d5a]">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(currentStory.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 italic">
                      &quot;{currentStory.comment}&quot;
                    </p>
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                      {currentStory.parentName || currentStory.studentName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Numbered Stories List (01, 02, 03) */}
              <div className="lg:col-span-7 space-y-4">
                {storiesList.map((story, idx) => {
                  const isActive = safeStoryIdx === idx;
                  return (
                    <div
                      key={story.id}
                      onClick={() => setActiveStoryIdx(idx)}
                      className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                        isActive
                          ? "bg-white dark:bg-[#0f1a36] border-emerald-500 dark:border-emerald-400 shadow-lg scale-101"
                          : "bg-white/70 dark:bg-[#0f1a36]/60 hover:bg-white dark:hover:bg-[#0f1a36] border-slate-200/90 dark:border-[#1d2d5a] shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`text-2xl sm:text-3xl font-black font-mono shrink-0 ${
                            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"
                          }`}
                        >
                          {story.storyNumber || (idx + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <h3
                            className={`text-base sm:text-lg font-black transition-colors ${
                              isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {story.title || `Cerita Ananda ${story.studentName}`}
                          </h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">{story.studentName}</span> • {story.role || `Cabang ${story.branch}`}
                          </div>
                          {isActive && (
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-[#1d2d5a] mt-2">
                              {story.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. EXPLORE PROGRAMS & CURRICULUM (Fixed Solid Dark Stacking - 100% Readable) */}
        {/* ========================================================================= */}
        <section id="program" className="relative py-20 lg:py-28 overflow-hidden bg-slate-950 text-white">
          {/* Background Image with Solid Dark Overlay (Ensures text is never white on white) */}
          <div className="absolute inset-0 z-0">
            <img
              src={landingHero.programsBgImage || "/images/landing/programs-bg.jpg"}
              alt="Program Belajar Math Fingers"
              className="w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-950/95 to-emerald-950" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & Description (High Contrast White Text) */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/80 px-3.5 py-1 rounded-full border border-emerald-700">
                    Kurikulum Terstruktur & Bertahap
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-4 leading-tight whitespace-pre-line">
                    {landingHero.curriculumTitle || "Eksplorasi Program \nUnggulan Math Fingers"}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {landingHero.curriculumDesc || "Setiap anak memiliki ritme belajar unik. Kami menyusun kurikulum berjenjang dari usia 4 hingga 12 tahun yang diuji secara berkala dengan Rapor Kompetensi Digital dan Sertifikat Resmi."}
                </p>

                {/* Proof Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="text-xl sm:text-2xl font-black text-emerald-300">4 Level</div>
                    <div className="text-[11px] text-slate-200 mt-0.5">Jaritmatika Lengkap</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="text-xl sm:text-2xl font-black text-emerald-300">Bulanan</div>
                    <div className="text-[11px] text-slate-200 mt-0.5">Uji Kecepatan</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="text-xl sm:text-2xl font-black text-emerald-300">QR Code</div>
                    <div className="text-[11px] text-slate-200 mt-0.5">Presensi Kartu Digital</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Stacked Program Buttons (Image 2 style) */}
              <div className="lg:col-span-6 space-y-3.5">
                {(landingPrograms && landingPrograms.length > 0) ? (
                  landingPrograms.map((prog) => (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => handleOpenTrial(`${prog.levelTitle} (${prog.targetAge})`)}
                      className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-sm sm:text-base font-black group-hover:text-emerald-100 transition-colors flex items-center gap-2">
                          <span>{prog.levelTitle}</span>
                          {prog.popular && (
                            <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                              Favorit
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-100 mt-0.5 font-medium line-clamp-1">
                          {prog.targetAge} • {prog.description}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenTrial("Jaritmatika Pra-Dasar (Usia 4-6 Th)")}
                      className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-sm sm:text-base font-black group-hover:text-emerald-100 transition-colors">
                          Jaritmatika Pra-Dasar (TK / PAUD - Usia 4–6 Th)
                        </div>
                        <div className="text-xs text-emerald-100 mt-0.5 font-medium">
                          Pengenalan formasi jari, simbol angka ceria, dan motorik halus
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenTrial("Jaritmatika Dasar & Terampil (SD)")}
                      className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-sm sm:text-base font-black group-hover:text-emerald-100 transition-colors">
                          Jaritmatika Dasar & Terampil (SD Kelas 1–6)
                        </div>
                        <div className="text-xs text-emerald-100 mt-0.5 font-medium">
                          Penjumlahan & pengurangan cepat belasan hingga ratusan tanpa corat-coret
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenTrial("Jaritmatika Mahir (Perkalian & Pembagian)")}
                      className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-sm sm:text-base font-black group-hover:text-emerald-100 transition-colors">
                          Jaritmatika Mahir: Perkalian & Pembagian Jari
                        </div>
                        <div className="text-xs text-emerald-100 mt-0.5 font-medium">
                          Hitung kilat perkalian 6–99 dan pembagian bersisa tanpa menghafal tabel rumit
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenTrial("Program Les Membaca Fonik Cepat")}
                      className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div>
                        <div className="text-sm sm:text-base font-black group-hover:text-emerald-100 transition-colors">
                          Program Les Membaca Fonik Cepat Lancar
                        </div>
                        <div className="text-xs text-emerald-100 mt-0.5 font-medium">
                          Metode suku kata ceria tanpa mengeja, 3 bulan lancar membaca buku cerita
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. WHAT'S HAPPENING / NEWS & ACTIVITIES (Image 2 style: 4 Cards Grid) */}
        {/* ========================================================================= */}
        <section id="kabar" className="py-20 lg:py-28 bg-white dark:bg-[#080f25] border-b border-slate-100 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 border-b border-slate-200 dark:border-[#1d2d5a] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-emerald-600 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Kabar & Dokumentasi
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                  Kegiatan Terkini di Math Fingers
                </h2>
              </div>

              <a
                href="#agenda"
                className="px-5 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[#162244] text-xs font-bold transition-all"
              >
                Lihat Agenda Mendatang ➔
              </a>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0f1a36] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#1d2d5a] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenTrial()}
                      className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Ikuti Kegiatan Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. UPCOMING EVENTS (Image 2 style: 3 Cards Grid with Big Date Badge) */}
        {/* ========================================================================= */}
        <section id="agenda" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0b1329] border-b border-slate-200/80 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 border-b border-slate-200 dark:border-[#1d2d5a] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-emerald-600 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Agenda Belajar & Kompetisi
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                  Agenda Kegiatan Mendatang
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleOpenTrial()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Daftar Semua Agenda ➔
              </button>
            </div>

            {/* 3 Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0f1a36] rounded-2xl p-6 border border-slate-200/90 dark:border-[#1d2d5a] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Big Date Badge (Image 2 style) */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-600 dark:border-emerald-500 flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-black text-emerald-800 dark:text-emerald-300 leading-none">
                          {ev.day}
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {ev.month}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ev.desc}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 dark:border-[#1d2d5a] mt-5">
                    <button
                      type="button"
                      onClick={() => handleOpenTrial(ev.title)}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Daftar Sesi Agenda Ini ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. CABANG & FASILITAS SECTION */}
        {/* ========================================================================= */}
        <section id="cabang" className="py-20 lg:py-28 bg-white dark:bg-[#080f25] border-b border-slate-100 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Lokasi Cabang Resmi
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Pilih Cabang Terdekat di Kota Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Gedung belajar representatif, ruang kelas ber-AC, area parkir aman, dan ruang tunggu wali murid yang nyaman.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Cabang Singkut */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#0f1a36] border-2 border-emerald-500 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      SKT
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Cabang Singkut</h3>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Pusat Bimbingan</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Aktif
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Jl. Lintas Sumatera, Kec. Singkut, Kab. Sarolangun, Jambi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>+62 812-7949-8907 (Admin Febrianti Dewi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Senin – Sabtu (08.00 – 17.00 WIB)</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/6281279498907?text=Halo%20Admin%20Math%20Fingers%20Singkut,%20saya%20ingin%20konsultasi%20pendaftaran%20les."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi Admin Cabang Singkut</span>
                </a>
              </div>

              {/* Cabang Bangko */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center font-black">
                      BGK
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Cabang Bangko</h3>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Tabir Timur & Bangko Kota</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Aktif
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Jl. Mayor H. Syamsuddin Uban, Bangko, Kab. Merangin, Jambi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>+62 813-7972-0841 (Admin Cabang Bangko)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Senin – Sabtu (08.00 – 17.00 WIB)</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/6281379720841?text=Halo%20Admin%20Math%20Fingers%20Bangko,%20saya%20ingin%20konsultasi%20pendaftaran%20les."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi Admin Cabang Bangko</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. PARTNER STRIP (Image 2 style: Clean Logo Showcase) */}
        {/* ========================================================================= */}
        <section id="mitra" className="py-12 bg-slate-50 dark:bg-[#0b1329] border-b border-slate-200 dark:border-[#1d2d5a] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
              Dipercaya Oleh Berbagai Mitra Sekolah & Yayasan Pendidikan di Jambi
            </p>
            <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap opacity-90">
              {(landingPartners && landingPartners.filter((p) => p.active !== false).length > 0) ? (
                landingPartners
                  .filter((p) => p.active !== false)
                  .map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-2xs font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                        {partner.logoText || partner.name.slice(0, 3).toUpperCase()}
                      </div>
                      <span>{partner.name}</span>
                    </div>
                  ))
              ) : (
                <>
                  <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200 text-sm">
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>TK / PAUD Terpadu</span>
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200 text-sm">
                    <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>SD IT Al-Madani</span>
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200 text-sm">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Yayasan Bina Prestasi</span>
                  </div>
                  <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Koperasi Pendidikan Sarolangun</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 12. FOOTER (Deep Dark Charcoal/Slate + 4 Columns) */}
      {/* ========================================================================= */}
      <footer className="bg-[#0b1329] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1 & 2: Brand Profile */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src="/logo.png"
                    alt="Logo Math Fingers"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg tracking-tight">
                    Easy Learning House
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold">
                    Bimbel Jaritmatika Math Fingers
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Bimbingan belajar berhitung cepat metode 10 jari tangan tanpa sempoa dan tanpa kalkulator. Memaksimalkan keseimbangan otak kiri dan kanan anak usia 4 hingga 12 tahun.
              </p>

              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <div><strong>Cabang Singkut:</strong> Jl. Lintas Sumatera, Sarolangun</div>
                <div><strong>Cabang Bangko:</strong> Tabir Timur, Merangin, Jambi</div>
                <div><strong>Hotline WhatsApp:</strong> +62 812-7949-8907</div>
              </div>
            </div>

            {/* Col 3: Program Belajar */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                Program Belajar
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="#program" className="hover:text-emerald-400 transition-colors">
                    Jaritmatika Pra-Dasar (TK)
                  </a>
                </li>
                <li>
                  <a href="#program" className="hover:text-emerald-400 transition-colors">
                    Jaritmatika Dasar (SD)
                  </a>
                </li>
                <li>
                  <a href="#program" className="hover:text-emerald-400 transition-colors">
                    Jaritmatika Mahir (Perkalian)
                  </a>
                </li>
                <li>
                  <a href="#program" className="hover:text-emerald-400 transition-colors">
                    Program Les Membaca Fonik
                  </a>
                </li>
                <li>
                  <a href="#program" className="hover:text-emerald-400 transition-colors">
                    Kelas Privat & Intensif
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Informasi & Fitur */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                Informasi
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="#tentang" className="hover:text-emerald-400 transition-colors">
                    Tentang Kami & Metode
                  </a>
                </li>
                <li>
                  <a href="#cerita" className="hover:text-emerald-400 transition-colors">
                    Cerita Prestasi Siswa
                  </a>
                </li>
                <li>
                  <a href="#kabar" className="hover:text-emerald-400 transition-colors">
                    Kabar & Dokumentasi
                  </a>
                </li>
                <li>
                  <a href="#agenda" className="hover:text-emerald-400 transition-colors">
                    Agenda & Trial Class
                  </a>
                </li>
                <li>
                  <a href="#cabang" className="hover:text-emerald-400 transition-colors">
                    Lokasi & Fasilitas Cabang
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Tautan WebApp */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                Akses WebApp
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Login Siswa & Wali Murid
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Login Guru & Tutor
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Login Admin Cabang
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenTrial()}
                    className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-left"
                  >
                    ★ Daftar Coba Kelas Gratis
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Easy Learning House - Math Fingers. Seluruh hak cipta dilindungi.
            </div>
            <div className="flex items-center gap-6">
              <a href="#tentang" className="hover:text-slate-400">
                Syarat & Ketentuan
              </a>
              <a href="#tentang" className="hover:text-slate-400">
                Kebijakan Privasi
              </a>
              <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                Masuk WebApp ➔
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: FREE TRIAL CLASS REGISTRATION (Connected to PostgreSQL Leads) */}
      {/* ========================================================================= */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-[#1d2d5a] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#047857] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-200">
                  Formulir Pendaftaran
                </div>
                <h3 className="text-lg font-black mt-0.5">
                  Coba Kelas Gratis (Trial Class)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTrialModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {trialSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      Pendaftaran Berhasil Terkirim!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                      Terima kasih Ayah/Bunda. Data Ananda <strong>{trialForm.studentName}</strong> sudah masuk ke sistem Math Fingers.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleDirectWhatsAppFromModal}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi Langsung ke WhatsApp Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrialModal(false)}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitTrial} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Calon Siswa (Anak) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Farhan"
                      value={trialForm.studentName}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, studentName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Usia / Kelas *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 7 Tahun / Kelas 1 SD"
                        value={trialForm.studentAge}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, studentAge: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Singkut">Cabang Singkut</option>
                        <option value="Bangko">Cabang Bangko</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Orang Tua / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bunda Rina"
                        value={trialForm.parentName}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, parentName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxxx"
                        value={trialForm.phone}
                        onChange={(e) =>
                          setTrialForm({ ...trialForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Belum pernah les sebelumnya, ingin coba hari Sabtu"
                      value={trialForm.notes}
                      onChange={(e) =>
                        setTrialForm({ ...trialForm, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTrialModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      Kirim Pendaftaran Trial ➔
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIDEO TOUR / PENGENALAN METODE JARI */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-[#1d2d5a] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#047857] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  Video Pengenalan Metode Math Fingers
                </h3>
                <p className="text-xs text-emerald-200">
                  Formasi 10 Jari Pintar Sebagai Kalkulator Alami Anak
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video rounded-2xl bg-slate-900 overflow-hidden relative shadow-inner flex items-center justify-center">
                {landingHero.videoUrl && (landingHero.videoUrl.includes("youtube.com") || landingHero.videoUrl.includes("youtu.be")) ? (
                  <iframe
                    src={
                      landingHero.videoUrl.includes("watch?v=")
                        ? landingHero.videoUrl.replace("watch?v=", "embed/").split("&")[0]
                        : landingHero.videoUrl.includes("youtu.be/")
                        ? landingHero.videoUrl.replace("youtu.be/", "www.youtube.com/embed/")
                        : landingHero.videoUrl
                    }
                    title="Video Pengenalan Math Fingers"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : landingHero.videoUrl && (landingHero.videoUrl.startsWith("http") || landingHero.videoUrl.startsWith("/")) && !landingHero.videoUrl.includes("youtube") ? (
                  <video
                    src={landingHero.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={landingHero.heroImage || "/images/landing/hero-kids.jpg"}
                      alt="Video Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 fill-white ml-0.5" />
                      </div>
                      <div className="max-w-md">
                        <div className="text-sm font-black">
                          Demonstrasi Hitung Cepat 10 Jari Tangan
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Kunjungi kanal resmi atau hadiri sesi kelas percobaan langsung untuk melihat ananda mempraktikkan formasi jari.
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Ingin melihat langsung di ruang kelas bersama guru?
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    handleOpenTrial();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Daftar Trial Class Gratis ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
