"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Newspaper,
  Calendar,
  User,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppStore, LandingNewsItem } from "@/lib/store";

interface WebsiteNewsTabProps {
  onNotify: (msg: string) => void;
}

export default function WebsiteNewsTab({ onNotify }: WebsiteNewsTabProps) {
  const { landingNews, addLandingNews, updateLandingNews, deleteLandingNews } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState<Omit<LandingNewsItem, "id">>({
    title: "",
    category: "PRESTASI & SERTIFIKASI",
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    author: "Tim Akademik Math Fingers",
    image: "/images/landing/student-story.jpg",
    summary: "",
    orderIndex: 1,
    isActive: true,
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "PRESTASI & SERTIFIKASI",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      author: "Tim Akademik Math Fingers",
      image: "/images/landing/student-story.jpg",
      summary: "",
      orderIndex: landingNews.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: LandingNewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      date: item.date,
      author: item.author,
      image: item.image,
      summary: item.summary,
      orderIndex: item.orderIndex || 1,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal mengunggah gambar");
      }

      const json = await res.json();
      setForm((prev) => ({ ...prev, image: json.url }));
      onNotify("Gambar berita berhasil diunggah!");
    } catch (err: any) {
      alert(err.message || "Gagal upload gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      alert("Judul dan ringkasan berita wajib diisi");
      return;
    }

    if (editingId) {
      updateLandingNews(editingId, form);
      onNotify("Berita berhasil diperbarui!");
    } else {
      addLandingNews(form);
      onNotify("Berita baru berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  const categories = [
    "PRESTASI & SERTIFIKASI",
    "EDUKASI ORANG TUA",
    "TEKNOLOGI EDUKASI",
    "KEGIATAN & EVENT",
    "PENGUMUMAN CABANG",
    "TUTOR & AKADEMIK",
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-600" />
            <span>Kabar & Kegiatan Terkini (Landing Page)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola 4 kartu artikel dan dokumentasi kegiatan bimbel yang tampil di landing page publik.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {landingNews.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Preview */}
              <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                  {item.category}
                </span>
                {item.isActive === false && (
                  <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                    Nonaktif
                  </span>
                )}
              </div>

              {/* Info Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                  <span>•</span>
                  <span className="truncate">{item.author}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0 border-t border-slate-100 dark:border-[#1d2d5a]/60 mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">Urutan: #{item.orderIndex || 1}</span>
              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162244] transition-colors"
                  title="Edit Berita"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus berita "${item.title}"?`)) {
                      deleteLandingNews(item.id);
                      onNotify("Berita berhasil dihapus!");
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Hapus Berita"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  {editingId ? "Edit Berita / Kegiatan" : "Tambah Berita Baru"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data ini akan langsung diperbarui di bagian Kabar Terkini website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Ujian Kenaikan Level Semester: Puluhan Siswa Raih Nilai Sempurna"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Berita *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Publikasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Contoh: 15 Sep 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Penulis / Narasumber
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Contoh: Ustadzah Febrianti, S.Pd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Urutan Tampil (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    value={form.orderIndex}
                    onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Image Input & Upload */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a]">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Foto / Gambar Berita
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "/images/landing/student-story.jpg";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/images/landing/... atau https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border border-slate-300 dark:border-[#1d2d5a] text-[11px] text-slate-900 dark:text-white font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Mengunggah..." : "Upload Gambar dari Komputer"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Berita * (1-3 kalimat)
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Tuliskan intisari informasi yang menarik bagi calon wali murid..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                />
              </div>

              {/* Active status */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan di Landing Page Publik</span>
              </label>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingId ? "Simpan Perubahan" : "Publikasikan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
