"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Megaphone,
  Phone,
  Save,
  Upload,
  Image as ImageIcon,
  Video,
  GraduationCap,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { useAppStore, LandingHeroConfig } from "@/lib/store";

interface WebsiteMediaHeroTabProps {
  onNotify: (msg: string) => void;
}

export default function WebsiteMediaHeroTab({ onNotify }: WebsiteMediaHeroTabProps) {
  const { landingHero, updateLandingHero } = useAppStore();

  const [form, setForm] = useState<LandingHeroConfig>(landingHero);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  React.useEffect(() => {
    setForm(landingHero);
  }, [landingHero]);

  const handleUploadImage = async (field: keyof LandingHeroConfig, file: File) => {
    setUploadingField(field);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal upload gambar");
      }

      const json = await res.json();
      setForm((prev) => ({ ...prev, [field]: json.url }));
      onNotify("Gambar berhasil diunggah!");
    } catch (err: any) {
      alert(err.message || "Gagal upload gambar");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingHero(form);
    onNotify("Pengaturan Beranda, Media & Konten berhasil disimpan!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. HERO BANNER & MEDIA SECTION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Hero Banner Utama & Video Tour
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Pill Badge Atas
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Utama Headline
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subheadline / Deskripsi Utama
                </label>
                <textarea
                  rows={3}
                  value={form.subheadline}
                  onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Foto Background Hero */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Foto Background Hero (Anak Ceria)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                    <img
                      src={form.heroImage || "/images/landing/hero-kids.jpg"}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "/images/landing/hero-kids.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.heroImage || ""}
                      onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                      placeholder="/images/landing/hero-kids.jpg"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border border-slate-300 dark:border-[#1d2d5a] text-[11px] font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === "heroImage" ? "Mengunggah..." : "Upload Foto Hero"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadImage("heroImage", f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Video Tour URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Link Embed Video Pengenalan Metode (YouTube Embed)</span>
                </label>
                <input
                  type="text"
                  value={form.videoUrl || ""}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Video ini akan diputar saat tombol Play Video di Hero diklik.
                </span>
              </div>
            </div>
          </div>

          {/* 2. ABOUT & METODE UNGGULAN SECTION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Seksi Tentang Kami & Metode Guru
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Seksi Metode Unggulan
                </label>
                <input
                  type="text"
                  value={form.aboutTitle || ""}
                  onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paragraf Penjelasan 1
                </label>
                <textarea
                  rows={2}
                  value={form.aboutDesc1 || ""}
                  onChange={(e) => setForm({ ...form, aboutDesc1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paragraf Penjelasan 2 (Keseimbangan Otak Kanan-Kiri)
                </label>
                <textarea
                  rows={2}
                  value={form.aboutDesc2 || ""}
                  onChange={(e) => setForm({ ...form, aboutDesc2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Foto Tutor Seksi About */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Foto Tutor / Pembimbing Anak
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                    <img
                      src={form.aboutImage || "/images/landing/about-teacher.jpg"}
                      alt="About Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "/images/landing/about-teacher.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.aboutImage || ""}
                      onChange={(e) => setForm({ ...form, aboutImage: e.target.value })}
                      placeholder="/images/landing/about-teacher.jpg"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border border-slate-300 dark:border-[#1d2d5a] text-[11px] font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === "aboutImage" ? "Mengunggah..." : "Upload Foto Tutor"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadImage("aboutImage", f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Lencana Melayang Guru */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Label Lencana Tutor (e.g. &quot;8+ Tutor Pengajar&quot;)
                  </label>
                  <input
                    type="text"
                    value={form.teacherBadgeText || ""}
                    onChange={(e) => setForm({ ...form, teacherBadgeText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Keterangan Lencana Tutor
                  </label>
                  <input
                    type="text"
                    value={form.teacherBadgeDesc || ""}
                    onChange={(e) => setForm({ ...form, teacherBadgeDesc: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. KURIKULUM & PROGRAM BANNER SECTION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Seksi Eksplorasi Program & Latar Kurikulum
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Seksi Kurikulum
                </label>
                <input
                  type="text"
                  value={form.curriculumTitle || ""}
                  onChange={(e) => setForm({ ...form, curriculumTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Seksi Kurikulum
                </label>
                <textarea
                  rows={2}
                  value={form.curriculumDesc || ""}
                  onChange={(e) => setForm({ ...form, curriculumDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Foto Latar Seksi Program */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Foto Latar Banner Kurikulum
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                    <img
                      src={form.programsBgImage || "/images/landing/programs-bg.jpg"}
                      alt="Programs Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "/images/landing/programs-bg.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.programsBgImage || ""}
                      onChange={(e) => setForm({ ...form, programsBgImage: e.target.value })}
                      placeholder="/images/landing/programs-bg.jpg"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border border-slate-300 dark:border-[#1d2d5a] text-[11px] font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === "programsBgImage" ? "Mengunggah..." : "Upload Foto Latar"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadImage("programsBgImage", f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PROMO BANNER & WHATSAPP HOTLINE */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  Banner Pengumuman & Kontak WhatsApp
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={form.promoActive}
                  onChange={(e) => setForm({ ...form, promoActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan Banner</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Pengumuman Promo Top Bar
                </label>
                <input
                  type="text"
                  value={form.promoBanner}
                  onChange={(e) => setForm({ ...form, promoBanner: e.target.value })}
                  placeholder="🎉 PROMO SPESIAL: Diskon Pendaftaran 50%..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp Hotline (Awali 62)
                  </label>
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    placeholder="6281279498907"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Diskon Pendaftaran
                  </label>
                  <input
                    type="text"
                    value={form.targetDiscount}
                    onChange={(e) => setForm({ ...form, targetDiscount: e.target.value })}
                    placeholder="50% OFF"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pesan Awal WhatsApp Otomatis
                </label>
                <input
                  type="text"
                  value={form.whatsappGreeting}
                  onChange={(e) => setForm({ ...form, whatsappGreeting: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Pengaturan Beranda & Media</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Card Preview */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] space-y-4 sticky top-6 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Preview Hero & Media
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Live Sinkron
              </span>
            </div>

            {form.promoActive && (
              <div className="p-2.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold text-center leading-tight">
                {form.promoBanner}
              </div>
            )}

            {/* Simulated Hero Card */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-6 space-y-3 text-center border border-slate-800 shadow-lg">
              <div className="absolute inset-0 z-0">
                <img
                  src={form.heroImage || "/images/landing/hero-kids.jpg"}
                  alt="Hero"
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/80 to-slate-950/90" />
              </div>

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/25 border border-emerald-400/50 text-emerald-200">
                  {form.tagline}
                </span>

                <h2 className="text-sm font-black text-white leading-tight">
                  {form.headline}
                </h2>

                <p className="text-[10px] text-slate-300 line-clamp-3 leading-relaxed">
                  {form.subheadline}
                </p>

                <div className="pt-2">
                  <div className="w-full py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px]">
                    Daftar Kelas Percobaan (Trial Gratis)
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated About Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Seksi Profil Tutor</span>
              <div className="flex items-center gap-3">
                <img
                  src={form.aboutImage || "/images/landing/about-teacher.jpg"}
                  alt="Tutor"
                  className="w-12 h-12 rounded-lg object-cover border"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {form.aboutTitle}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">
                    {form.teacherBadgeText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
