"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import { useAppStore, CurriculumModule } from "@/lib/store";

export default function KurikulumPage() {
  const {
    curriculumModules,
    addCurriculumModule,
    updateCurriculumModule,
    deleteCurriculumModule,
    resetCurriculumModules,
  } = useAppStore();

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    curriculumModules[0]?.id || ""
  );

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CurriculumModule | null>(
    null
  );
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    levelTitle: "",
    shortDesc: "",
    learningGoals: "",
    competencies: "",
    learningMaterials: "",
    indicatorsText: "",
  });

  const activeModule =
    curriculumModules.find((m) => m.id === selectedModuleId) ||
    curriculumModules[0];

  const handleOpenAdd = () => {
    setForm({
      levelTitle: "",
      shortDesc: "",
      learningGoals: "",
      competencies: "",
      learningMaterials: "",
      indicatorsText: "",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (mod: CurriculumModule) => {
    setEditingModule(mod);
    setForm({
      levelTitle: mod.levelTitle,
      shortDesc: mod.shortDesc,
      learningGoals: mod.learningGoals,
      competencies: mod.competencies,
      learningMaterials: mod.learningMaterials,
      indicatorsText: mod.indicators.join("\n"),
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const indicators = form.indicatorsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    addCurriculumModule({
      levelTitle: form.levelTitle,
      shortDesc: form.shortDesc || form.learningMaterials.slice(0, 45) + "...",
      learningGoals: form.learningGoals,
      competencies: form.competencies,
      learningMaterials: form.learningMaterials,
      indicators,
    });
    setIsAddOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    const indicators = form.indicatorsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    updateCurriculumModule(editingModule.id, {
      levelTitle: form.levelTitle,
      shortDesc: form.shortDesc || form.learningMaterials.slice(0, 45) + "...",
      learningGoals: form.learningGoals,
      competencies: form.competencies,
      learningMaterials: form.learningMaterials,
      indicators,
    });
    setEditingModule(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Status Bar */}
      <TopStatusBar title="Kurikulum" />

      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Kurikulum & Silabus
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola silabus materi bimbingan Jaritmatika, simpan formula, dan panduan latihan siswa.
          </p>
        </div>

        {/* Buttons (Kosongkan Kurikulum & Tambah Materi Baru) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-[#0f1a36] hover:bg-blue-50 dark:hover:bg-[#132042] text-xs font-bold text-blue-600 dark:text-sky-400 transition-all cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Kosongkan Kurikulum
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Materi Baru
          </button>
        </div>
      </div>

      {/* 2-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daftar Modul Silabus */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase px-1">
            DAFTAR MODUL SILABUS
          </div>

          <div className="space-y-2">
            {curriculumModules.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-400">
                Belum ada modul kurikulum. Klik "+ Tambah Materi Baru" untuk membuat silabus.
              </div>
            ) : (
              curriculumModules.map((mod, idx) => {
                const isSelected =
                  mod.id === (activeModule?.id || curriculumModules[0]?.id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500 shadow-xs"
                        : "bg-white dark:bg-[#0f1a36] border-slate-200 dark:border-[#1d2d5a] hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Red Square Number Badge */}
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {mod.levelTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {mod.shortDesc}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Module Detail View */}
        <div className="lg:col-span-8">
          {activeModule ? (
            <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] p-6 space-y-6 shadow-xs">
              {/* Header inside detail */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1d2d5a] pb-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900/60 text-[11px] font-bold text-blue-700 dark:text-sky-300">
                    <BookOpen className="w-3.5 h-3.5" />
                    {activeModule.levelTitle}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {activeModule.levelTitle}
                  </h2>
                </div>

                {/* Edit and Delete Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(activeModule)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Modul"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCurriculumModule(activeModule.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-[#132042] transition-colors cursor-pointer"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section 1: CAPAIAN PEMBELAJARAN */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  CAPAIAN PEMBELAJARAN
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-[#0b1329] text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {activeModule.learningGoals}
                </div>
              </div>

              {/* Section 2: KOMPETENSI DASAR */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  KOMPETENSI DASAR
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                  {activeModule.competencies}
                </div>
              </div>

              {/* Section 3: MATERI PEMBELAJARAN */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  MATERI PEMBELAJARAN
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                  {activeModule.learningMaterials}
                </div>
              </div>

              {/* Section 4: INDIKATOR PENCAPAIAN KOMPETENSI */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  INDIKATOR PENCAPAIAN KOMPETENSI
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] space-y-2.5">
                  {activeModule.indicators.map((ind, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] text-slate-400">
              Pilih modul dari daftar silabus di sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Materi Baru */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Modul Kurikulum Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Judul Level & Modul *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Level 3: Kombinasi Rumus Teman Besar (+9 s/d +1)"
                  value={form.levelTitle}
                  onChange={(e) =>
                    setForm({ ...form, levelTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Capaian Pembelajaran *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tujuan umum yang diharapkan dicapai siswa..."
                  value={form.learningGoals}
                  onChange={(e) =>
                    setForm({ ...form, learningGoals: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Kompetensi Dasar (KD) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="KD 3.1 Menguasai rumus teman besar..."
                  value={form.competencies}
                  onChange={(e) =>
                    setForm({ ...form, competencies: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Materi Pembelajaran *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="1. Pasangan teman besar (1&9, 2&8)...\n2. Latihan jari..."
                  value={form.learningMaterials}
                  onChange={(e) =>
                    setForm({ ...form, learningMaterials: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Indikator Pencapaian Kompetensi (IPK) (Satu per baris)
                </label>
                <textarea
                  rows={3}
                  placeholder="IPK 3.1.1 Mampu menyelesaikan kuis kombinasi 10..."
                  value={form.indicatorsText}
                  onChange={(e) =>
                    setForm({ ...form, indicatorsText: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Materi */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Modul Kurikulum
              </h3>
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Judul Level & Modul *
                </label>
                <input
                  type="text"
                  required
                  value={form.levelTitle}
                  onChange={(e) =>
                    setForm({ ...form, levelTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Capaian Pembelajaran *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.learningGoals}
                  onChange={(e) =>
                    setForm({ ...form, learningGoals: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Kompetensi Dasar (KD) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.competencies}
                  onChange={(e) =>
                    setForm({ ...form, competencies: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Materi Pembelajaran *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.learningMaterials}
                  onChange={(e) =>
                    setForm({ ...form, learningMaterials: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Indikator Pencapaian Kompetensi (IPK)
                </label>
                <textarea
                  rows={3}
                  value={form.indicatorsText}
                  onChange={(e) =>
                    setForm({ ...form, indicatorsText: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Kosongkan Kurikulum */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Kosongkan Seluruh Kurikulum?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                Tindakan ini akan menghapus semua modul silabus aktif saat ini.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetCurriculumModules();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-500/20 text-white text-xs font-bold"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
