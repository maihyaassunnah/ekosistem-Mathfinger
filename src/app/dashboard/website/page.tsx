"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  HeartHandshake,
  Users,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  Phone,
  MessageCircle,
  Save,
  RotateCcw,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  DollarSign,
  AlertCircle,
  Megaphone,
  Building2,
  Handshake,
  Link as LinkIcon,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import {
  useAppStore,
  LandingHeroConfig,
  LandingProgramItem,
  LandingTestimonialItem,
  LandingLeadItem,
  LandingPartnerItem,
} from "@/lib/store";

function WebsiteManagementContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "hero";

  const {
    landingHero,
    updateLandingHero,
    landingPrograms,
    addLandingProgram,
    updateLandingProgram,
    deleteLandingProgram,
    landingTestimonials,
    addLandingTestimonial,
    deleteLandingTestimonial,
    landingLeads,
    updateLandingLeadStatus,
    deleteLandingLead,
    landingPartners,
    addLandingPartner,
    updateLandingPartner,
    deleteLandingPartner,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  // Sync activeTab when query param changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Form states for Hero
  const [heroForm, setHeroForm] = useState<LandingHeroConfig>(landingHero);

  useEffect(() => {
    setHeroForm(landingHero);
  }, [landingHero]);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingHero(heroForm);
    setSaveAlert("Pengaturan Beranda & Promo berhasil disimpan!");
    setTimeout(() => setSaveAlert(null), 3500);
  };

  // Program modal state
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programForm, setProgramForm] = useState<Omit<LandingProgramItem, "id">>({
    levelTitle: "",
    targetAge: "",
    description: "",
    monthlyFee: 100000,
    registrationFee: 150000,
    benefits: [""],
    popular: false,
  });

  const openAddProgram = () => {
    setEditingProgramId(null);
    setProgramForm({
      levelTitle: "",
      targetAge: "",
      description: "",
      monthlyFee: 100000,
      registrationFee: 150000,
      benefits: ["", "", ""],
      popular: false,
    });
    setShowProgramModal(true);
  };

  const openEditProgram = (prog: LandingProgramItem) => {
    setEditingProgramId(prog.id);
    setProgramForm({
      levelTitle: prog.levelTitle,
      targetAge: prog.targetAge,
      description: prog.description,
      monthlyFee: prog.monthlyFee,
      registrationFee: prog.registrationFee,
      benefits: [...prog.benefits],
      popular: !!prog.popular,
    });
    setShowProgramModal(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBenefits = programForm.benefits.filter((b) => b.trim().length > 0);
    if (editingProgramId) {
      updateLandingProgram(editingProgramId, {
        ...programForm,
        benefits: cleanBenefits,
      });
      setSaveAlert("Program berhasil diperbarui!");
    } else {
      addLandingProgram({
        ...programForm,
        benefits: cleanBenefits,
      });
      setSaveAlert("Program baru berhasil ditambahkan!");
    }
    setShowProgramModal(false);
    setTimeout(() => setSaveAlert(null), 3500);
  };

  // Testimonial modal state
  const [showTestiModal, setShowTestiModal] = useState(false);
  const [testiForm, setTestiForm] = useState<Omit<LandingTestimonialItem, "id">>({
    parentName: "",
    studentName: "",
    branch: "Cabang Singkut",
    rating: 5,
    comment: "",
  });

  const handleSaveTesti = (e: React.FormEvent) => {
    e.preventDefault();
    addLandingTestimonial(testiForm);
    setShowTestiModal(false);
    setTestiForm({
      parentName: "",
      studentName: "",
      branch: "Cabang Singkut",
      rating: 5,
      comment: "",
    });
    setSaveAlert("Testimoni baru berhasil ditambahkan!");
    setTimeout(() => setSaveAlert(null), 3500);
  };

  // Lead filter state
  const [leadBranchFilter, setLeadBranchFilter] = useState<string>("Semua");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("Semua");

  const filteredLeads = landingLeads.filter((l) => {
    if (leadBranchFilter !== "Semua" && l.branch !== leadBranchFilter) return false;
    if (leadStatusFilter !== "Semua" && l.status !== leadStatusFilter) return false;
    return true;
  });

  const openWhatsAppLead = (lead: LandingLeadItem) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0")
      ? "62" + cleanPhone.slice(1)
      : cleanPhone.startsWith("62")
      ? cleanPhone
      : "62" + cleanPhone;

    const message = encodeURIComponent(
      `Halo Ibu/Bapak ${lead.parentName}, salam kenal dari Bimbingan Belajar Math Fingers Cabang ${lead.branch}.\n\nKami menerima pengajuan Coba Kelas Gratis (Trial Class) untuk Ananda *${lead.studentName}* (${lead.studentAge}).\n\nApakah ada waktu luang untuk kami jadwalkan sesi pengenalan jaritmatikanya? Terima kasih!`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  // Partner modal state
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerFilter, setPartnerFilter] = useState<string>("Semua");
  const [partnerForm, setPartnerForm] = useState<Omit<LandingPartnerItem, "id">>({
    name: "",
    category: "Sekolah Dasar Mitra",
    logoText: "",
    website: "",
    active: true,
  });

  const openAddPartner = () => {
    setEditingPartnerId(null);
    setPartnerForm({
      name: "",
      category: "Sekolah Dasar Mitra",
      logoText: "",
      website: "",
      active: true,
    });
    setShowPartnerModal(true);
  };

  const openEditPartner = (p: LandingPartnerItem) => {
    setEditingPartnerId(p.id);
    setPartnerForm({
      name: p.name,
      category: p.category,
      logoText: p.logoText,
      website: p.website || "",
      active: p.active,
    });
    setShowPartnerModal(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) return;

    if (editingPartnerId) {
      updateLandingPartner(editingPartnerId, partnerForm);
      setSaveAlert("Data mitra kerja sama berhasil diperbarui!");
    } else {
      addLandingPartner(partnerForm);
      setSaveAlert("Mitra kerja sama baru berhasil ditambahkan!");
    }
    setShowPartnerModal(false);
    setTimeout(() => setSaveAlert(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {saveAlert && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d2d5a]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-slate-800 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Kelola Website & Promosi Les
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Atur tampilan promosi Jaritmatika, program les, ulasan wali murid, dan follow-up calon siswa baru.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1d2d5a] overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "hero"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Beranda & Banner Promo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("programs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "programs"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Program & Biaya Les</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px]">
            {landingPrograms.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "testimonials"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Testimoni Wali Murid</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px]">
            {landingTestimonials.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "leads"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pendaftar Trial Class</span>
          {landingLeads.filter((l) => l.status === "Baru").length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
              {landingLeads.filter((l) => l.status === "Baru").length} Baru
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("partners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "partners"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Mitra & Logo Bergulir</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px]">
            {landingPartners.length}
          </span>
        </button>
      </div>

      {/* TAB 1: HERO & PROMO CONFIGURATION */}
      {activeTab === "hero" && (
        <form onSubmit={handleSaveHero} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Promo Banner Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Banner Pengumuman & Diskon Promo (Top Bar)
                    </h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={heroForm.promoActive}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, promoActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tampilkan Banner</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Teks Pengumuman Promo
                    </label>
                    <input
                      type="text"
                      value={heroForm.promoBanner}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, promoBanner: e.target.value })
                      }
                      placeholder="Contoh: 🎉 PROMO SPESIAL: GRATIS Kelas Percobaan & Diskon 50%!"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Label Badge Diskon (Contoh: &quot;50% OFF&quot; atau &quot;PROMO SPESIAL&quot;)
                    </label>
                    <input
                      type="text"
                      value={heroForm.targetDiscount}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, targetDiscount: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Headline & Subtitle Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Headline & Deskripsi Utama Beranda
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tagline / Badge Atas
                    </label>
                    <input
                      type="text"
                      value={heroForm.tagline}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, tagline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Judul Utama (Headline Promosi)
                    </label>
                    <input
                      type="text"
                      value={heroForm.headline}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, headline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Subjudul / Penjelasan Manfaat Metode Jaritmatika
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.subheadline}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, subheadline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Configuration */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Kontak WhatsApp Konsultasi Cepat
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor WhatsApp Tujuan (Awali dengan 62)
                    </label>
                    <input
                      type="text"
                      value={heroForm.whatsappNumber}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, whatsappNumber: e.target.value })
                      }
                      placeholder="6281279498907"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Pesan Awal WhatsApp Saat Diklik
                    </label>
                    <input
                      type="text"
                      value={heroForm.whatsappGreeting}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, whatsappGreeting: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Beranda</span>
                </button>
              </div>
            </div>

            {/* Right Col: Live Card Preview */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Live Preview Beranda
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Real-time
                  </span>
                </div>

                {heroForm.promoActive && (
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold text-center leading-tight">
                    {heroForm.promoBanner}
                  </div>
                )}

                <div className="space-y-3 pt-2 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-[#1d2d5a]">
                    {heroForm.tagline}
                  </span>

                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                    {heroForm.headline}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {heroForm.subheadline}
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <div className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                      Daftar Coba Gratis (Trial)
                    </div>
                    <div className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-700 dark:text-slate-300">
                      Konsultasi WhatsApp Cabang
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PROGRAM & BIAYA LES */}
      {activeTab === "programs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daftar Program & Jenjang Level Les
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Program ini akan ditampilkan pada landing page publik beserta rincian tarif SPP dan pendaftaran.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddProgram}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Level Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {landingPrograms.map((prog) => (
              <div
                key={prog.id}
                className={`p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border transition-all relative flex flex-col justify-between ${
                  prog.popular
                    ? "border-emerald-600 shadow-md ring-1 ring-emerald-600"
                    : "border-slate-200 dark:border-[#1d2d5a] shadow-xs"
                }`}
              >
                {prog.popular && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    Paling Diminati
                  </span>
                )}

                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      {prog.levelTitle}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {prog.targetAge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                    <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                      Rp {prog.monthlyFee.toLocaleString("id-ID")}
                      <span className="text-xs font-normal text-slate-400"> /bln</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Registrasi: Rp {prog.registrationFee.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Fasilitas:
                    </div>
                    {prog.benefits.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <button
                    type="button"
                    onClick={() => openEditProgram(prog)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus program "${prog.levelTitle}"?`)) {
                        deleteLandingProgram(prog.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#132042] transition-colors"
                    title="Hapus Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Add/Edit Program */}
          {showProgramModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {editingProgramId ? "Edit Program Bimbel" : "Tambah Program Bimbel Baru"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProgramModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveProgram} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Jenjang Level
                    </label>
                    <input
                      type="text"
                      required
                      value={programForm.levelTitle}
                      onChange={(e) =>
                        setProgramForm({ ...programForm, levelTitle: e.target.value })
                      }
                      placeholder="Contoh: Level 1: Dasar"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Target Usia / Jenjang Sekolah
                    </label>
                    <input
                      type="text"
                      required
                      value={programForm.targetAge}
                      onChange={(e) =>
                        setProgramForm({ ...programForm, targetAge: e.target.value })
                      }
                      placeholder="Contoh: Usia 6 - 8 Tahun (SD Kelas 1 - 2)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Deskripsi Program
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={programForm.description}
                      onChange={(e) =>
                        setProgramForm({ ...programForm, description: e.target.value })
                      }
                      placeholder="Penjelasan ringkas materi dan hasil capaian murid..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Tarif SPP Bulanan (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        value={programForm.monthlyFee}
                        onChange={(e) =>
                          setProgramForm({
                            ...programForm,
                            monthlyFee: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Biaya Registrasi (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        value={programForm.registrationFee}
                        onChange={(e) =>
                          setProgramForm({
                            ...programForm,
                            registrationFee: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Fasilitas / Keunggulan (Satu per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={programForm.benefits.join("\n")}
                      onChange={(e) =>
                        setProgramForm({
                          ...programForm,
                          benefits: e.target.value.split("\n"),
                        })
                      }
                      placeholder="Buku Modul Latihan Jari&#10;Kartu QR Presensi&#10;Laporan Rapor Digital"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={programForm.popular}
                      onChange={(e) =>
                        setProgramForm({ ...programForm, popular: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tandai sebagai &quot;Paling Diminati&quot;</span>
                  </label>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                    <button
                      type="button"
                      onClick={() => setShowProgramModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                    >
                      Simpan Program
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TESTIMONI WALI MURID */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Ulasan & Testimoni Orang Tua Murid
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Testimoni ini membangun kepercayaan calon wali murid saat berkunjung ke website bimbel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTestiModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Testimoni</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {landingTestimonials.map((testi) => (
              <div
                key={testi.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {testi.branch}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                    &quot;{testi.comment}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {testi.parentName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Orang tua dari {testi.studentName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Hapus testimoni ini?")) {
                        deleteLandingTestimonial(testi.id);
                      }
                    }}
                    className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#132042]"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Add Testimonial */}
          {showTestiModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Tambah Testimoni Wali Murid
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTestiModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveTesti} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Orang Tua / Wali
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.parentName}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, parentName: e.target.value })
                      }
                      placeholder="Contoh: Bunda Rini Astuti"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Anak (Usia/Level)
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.studentName}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, studentName: e.target.value })
                      }
                      placeholder="Contoh: Aishwa (7 thn)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Cabang
                      </label>
                      <select
                        value={testiForm.branch}
                        onChange={(e) =>
                          setTestiForm({ ...testiForm, branch: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                      >
                        <option value="Cabang Singkut">Cabang Singkut</option>
                        <option value="Cabang Bangko">Cabang Bangko</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Rating Bintang
                      </label>
                      <select
                        value={testiForm.rating}
                        onChange={(e) =>
                          setTestiForm({ ...testiForm, rating: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Ulasan / Testimoni
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={testiForm.comment}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, comment: e.target.value })
                      }
                      placeholder="Ceritakan pengalaman dan peningkatan nilai berhitung anak..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                    <button
                      type="button"
                      onClick={() => setShowTestiModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                    >
                      Simpan Testimoni
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DATA PENDAFTAR TRIAL CLASS (LEADS) */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pendaftar Coba Kelas Gratis (Trial Class)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar calon siswa yang submit formulir di website. Langsung klik untuk hubungi orang tua via WhatsApp.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <select
                value={leadBranchFilter}
                onChange={(e) => setLeadBranchFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="Semua">Semua Cabang</option>
                <option value="Singkut">Cabang Singkut</option>
                <option value="Bangko">Cabang Bangko</option>
              </select>

              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="Semua">Semua Status</option>
                <option value="Baru">Baru</option>
                <option value="Dihubungi">Dihubungi</option>
                <option value="Trial Terjadwal">Trial Terjadwal</option>
                <option value="Terdaftar">Terdaftar</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1d2d5a] bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Calon Siswa & Usia</th>
                    <th className="py-3 px-4">Orang Tua / Kontak</th>
                    <th className="py-3 px-4">Cabang</th>
                    <th className="py-3 px-4">Tgl Daftar</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Follow-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada pendaftar trial class yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {lead.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lead.studentAge}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {lead.parentName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {lead.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.branch === "Singkut"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            }`}
                          >
                            {lead.branch}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {lead.createdAt}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateLandingLeadStatus(
                                lead.id,
                                e.target.value as LandingLeadItem["status"]
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-0 cursor-pointer ${
                              lead.status === "Baru"
                                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300"
                                : lead.status === "Dihubungi"
                                ? "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300"
                                : lead.status === "Trial Terjadwal"
                                ? "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300"
                                : "bg-emerald-100 text-emerald-950 dark:text-emerald-300 dark:bg-slate-800 dark:text-emerald-400"
                            }`}
                          >
                            <option value="Baru">🟡 Baru</option>
                            <option value="Dihubungi">🔵 Dihubungi</option>
                            <option value="Trial Terjadwal">🟣 Trial Terjadwal</option>
                            <option value="Terdaftar">🟢 Terdaftar Siswa</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openWhatsAppLead(lead)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-bold text-xs transition-all shadow-2xs"
                              title="Chat WhatsApp Calon Siswa"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Hubungi WA</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus pendaftar "${lead.studentName}"?`)) {
                                  deleteLandingLead(lead.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#132042]"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PARTNER & LOGO BERGULIR */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  Logo Kerja Sama & Mitra Binaan
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Kelola daftar logo sekolah, yayasan, dan komunitas rekanan. Logo yang berstatus <strong>Aktif</strong> akan otomatis bergulir secara halus (marquee infinite) di halaman depan website.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddPartner}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mitra Baru</span>
            </button>
          </div>

          {/* Partner Preview & Live Marquee Demonstration */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Pratinjau Logo Bergulir di Website:
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {landingPartners.filter((p) => p.active).length} Mitra Ditampilkan
              </span>
            </div>

            {/* Marquee Track Mockup */}
            <div className="overflow-x-auto py-3 bg-white/70 dark:bg-[#0f1a36]/70 rounded-xl border border-slate-200 dark:border-[#1d2d5a] flex gap-4 items-center px-4 scrollbar-thin">
              {landingPartners.filter((p) => p.active).map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-2xs flex items-center gap-2.5 shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                    {p.logoText.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{p.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partners Table */}
          <div className="rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] font-bold text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Logo Monogram</th>
                    <th className="py-3.5 px-4">Nama Mitra / Instansi</th>
                    <th className="py-3.5 px-4">Kategori Kerjasama</th>
                    <th className="py-3.5 px-4">Tautan Website</th>
                    <th className="py-3.5 px-4">Status Tampil</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {landingPartners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {partner.logoText || partner.name.slice(0, 3).toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {partner.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-[#1d2d5a]">
                          {partner.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">{partner.website}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() =>
                            updateLandingPartner(partner.id, { active: !partner.active })
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            partner.active
                              ? "bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {partner.active ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Aktif Bergulir</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Dinonaktifkan</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditPartner(partner)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus mitra "${partner.name}"?`)) {
                                deleteLandingPartner(partner.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#132042] transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah / Edit Mitra Kerja Sama */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingPartnerId ? "Edit Mitra Kerja Sama" : "Tambah Mitra Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setShowPartnerModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Mitra / Sekolah / Lembaga *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="Contoh: SDIT Permata Hati Singkut"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Kerja Sama *
                </label>
                <select
                  value={partnerForm.category}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white font-medium"
                >
                  <option value="Sekolah Dasar Mitra">Sekolah Dasar Mitra</option>
                  <option value="PAUD & TK Binaan">PAUD & TK Binaan</option>
                  <option value="Yayasan Pendidikan">Yayasan Pendidikan</option>
                  <option value="Lembaga Pendidikan Anak">Lembaga Pendidikan Anak</option>
                  <option value="Asosiasi Edukasi">Asosiasi Edukasi</option>
                  <option value="Komunitas Belajar">Komunitas Belajar</option>
                  <option value="Dinas / Instansi Terkait">Dinas / Instansi Terkait</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Singkatan Monogram Logo (2-6 Karakter) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={partnerForm.logoText}
                  onChange={(e) =>
                    setPartnerForm({ ...partnerForm, logoText: e.target.value.toUpperCase() })
                  }
                  placeholder="Contoh: SDIT, TK-P, KJI"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white font-medium uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website / Media Sosial (Opsional)
                </label>
                <input
                  type="url"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  placeholder="https://instagram.com/nama_sekolah"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="partnerActive"
                  checked={partnerForm.active}
                  onChange={(e) => setPartnerForm({ ...partnerForm, active: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label
                  htmlFor="partnerActive"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Tampilkan dan gulirkan logo di website publik
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WebsiteManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Memuat Pengaturan Website...
        </div>
      }
    >
      <WebsiteManagementContent />
    </Suspense>
  );
}
