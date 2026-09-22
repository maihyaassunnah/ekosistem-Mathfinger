"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  HeartHandshake,
  Star,
  Upload,
  Image as ImageIcon,
  User,
  Quote,
  X,
} from "lucide-react";
import { useAppStore, LandingTestimonialItem } from "@/lib/store";

interface WebsiteTestimonialsTabProps {
  onNotify: (msg: string) => void;
}

export default function WebsiteTestimonialsTab({ onNotify }: WebsiteTestimonialsTabProps) {
  const {
    landingTestimonials,
    addLandingTestimonial,
    updateLandingTestimonial,
    deleteLandingTestimonial,
  } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState<Omit<LandingTestimonialItem, "id">>({
    storyNumber: "01",
    title: "",
    parentName: "",
    studentName: "",
    role: "Siswa Math Fingers",
    branch: "Singkut",
    rating: 5,
    comment: "",
    avatarUrl: "/images/landing/student-story.jpg",
  });

  const openAddModal = () => {
    setEditingId(null);
    const nextNum = String(landingTestimonials.length + 1).padStart(2, "0");
    setForm({
      storyNumber: nextNum,
      title: "",
      parentName: "",
      studentName: "",
      role: "Siswa Math Fingers",
      branch: "Singkut",
      rating: 5,
      comment: "",
      avatarUrl: "/images/landing/student-story.jpg",
    });
    setShowModal(true);
  };

  const openEditModal = (item: LandingTestimonialItem) => {
    setEditingId(item.id);
    setForm({
      storyNumber: item.storyNumber || "01",
      title: item.title || "",
      parentName: item.parentName,
      studentName: item.studentName,
      role: item.role || "Siswa Math Fingers",
      branch: item.branch,
      rating: item.rating || 5,
      comment: item.comment,
      avatarUrl: item.avatarUrl || "/images/landing/student-story.jpg",
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
        throw new Error(errData.error || "Gagal upload gambar");
      }

      const json = await res.json();
      setForm((prev) => ({ ...prev, avatarUrl: json.url }));
      onNotify("Foto siswa berhasil diunggah!");
    } catch (err: any) {
      alert(err.message || "Gagal upload foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parentName.trim() || !form.comment.trim()) {
      alert("Nama orang tua dan ulasan wajib diisi");
      return;
    }

    if (editingId) {
      updateLandingTestimonial(editingId, form);
      onNotify("Kisah siswa berhasil diperbarui!");
    } else {
      addLandingTestimonial(form);
      onNotify("Kisah siswa baru berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Cerita Prestasi & Testimoni Siswa (Landing Page)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Testimoni interaktif nomor 01, 02, 03 dan foto siswa berprestasi yang tampil di seksi Kisah Nyata.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cerita Siswa</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {landingTestimonials.map((testi) => (
          <div
            key={testi.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              {/* Header with Story Number and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {testi.storyNumber || "01"}
                </span>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: testi.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Photo Preview & Title */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={testi.avatarUrl || "/images/landing/student-story.jpg"}
                    alt={testi.studentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {testi.title || `Cerita ${testi.studentName}`}
                  </h4>
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                    {testi.studentName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {testi.role || "Siswa"}
                  </div>
                </div>
              </div>

              {/* Quote Comment */}
              <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed line-clamp-3 bg-slate-50 dark:bg-[#0b1329] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                &quot;{testi.comment}&quot;
              </p>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
              <div>
                <span className="text-[10px] text-slate-400 block">Wali Murid:</span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {testi.parentName}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(testi)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162244]"
                  title="Edit Cerita"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus cerita siswa "${testi.studentName}"?`)) {
                      deleteLandingTestimonial(testi.id);
                      onNotify("Cerita siswa berhasil dihapus!");
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Hapus Cerita"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Testimonial */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {editingId ? "Edit Kisah Siswa & Testimoni" : "Tambah Kisah Siswa Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    No. Urut (e.g. 01)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={form.storyNumber || "01"}
                    onChange={(e) => setForm({ ...form, storyNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-black text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rating Bintang (1 - 5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sempurna)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang - Sangat Baik)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Kisah Prestasi *
                </label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Dari Takut Matematika, Kini Jadi Juara Berhitung di Sekolah"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Siswa (Anak) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    placeholder="M. Rasyid Al-Fatih"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.parentName}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                    placeholder="Bunda Rasyid"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status / Peran (Role)
                  </label>
                  <input
                    type="text"
                    value={form.role || ""}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Alumni Level Mahir (SD IT)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cabang Bimbel
                  </label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-bold"
                  >
                    <option value="Singkut">Cabang Singkut</option>
                    <option value="Bangko">Cabang Bangko</option>
                  </select>
                </div>
              </div>

              {/* Photo Input / Upload */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a]">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Foto Siswa Berprestasi
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border">
                    <img
                      src={form.avatarUrl || "/images/landing/student-story.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={form.avatarUrl || ""}
                      onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                      placeholder="/images/landing/student-story.jpg"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border text-[11px] font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Mengunggah..." : "Upload Foto Siswa"}</span>
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

              {/* Comment Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kutipan Testimoni / Pengalaman Belajar *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Ceritakan pengalaman peningkatan nilai dan kepercayaan diri ananda..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs font-medium leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Cerita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
