"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  X,
  Sparkles,
} from "lucide-react";
import { useAppStore, LandingEventItem } from "@/lib/store";

interface WebsiteEventsTabProps {
  onNotify: (msg: string) => void;
}

export default function WebsiteEventsTab({ onNotify }: WebsiteEventsTabProps) {
  const { landingEvents, addLandingEvent, updateLandingEvent, deleteLandingEvent } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<LandingEventItem, "id">>({
    day: "25",
    month: "SEP",
    title: "",
    time: "14:00 – 16:00 WIB",
    location: "Cabang Singkut & Cabang Bangko",
    desc: "",
    orderIndex: 1,
    isActive: true,
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      day: String(new Date().getDate()).padStart(2, "0"),
      month: new Date().toLocaleDateString("id-ID", { month: "short" }).toUpperCase(),
      title: "",
      time: "14:00 – 16:00 WIB",
      location: "Cabang Singkut & Cabang Bangko",
      desc: "",
      orderIndex: landingEvents.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: LandingEventItem) => {
    setEditingId(item.id);
    setForm({
      day: item.day,
      month: item.month,
      title: item.title,
      time: item.time,
      location: item.location,
      desc: item.desc,
      orderIndex: item.orderIndex || 1,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.day.trim() || !form.month.trim()) {
      alert("Judul, tanggal hari, dan bulan wajib diisi");
      return;
    }

    if (editingId) {
      updateLandingEvent(editingId, form);
      onNotify("Agenda kegiatan berhasil diperbarui!");
    } else {
      addLandingEvent(form);
      onNotify("Agenda kegiatan baru berhasil ditambahkan!");
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Agenda & Kegiatan Mendatang (Landing Page)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atur jadwal trial class massal, pembukaan pendaftaran diskon, dan lomba hitung cepat 10 jari.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {landingEvents.map((ev) => (
          <div
            key={ev.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Big Date Badge & Info */}
              <div className="flex items-center justify-between">
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

                {ev.isActive === false && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700">
                    Nonaktif
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                  {ev.desc}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#1d2d5a] mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">Urutan: #{ev.orderIndex || 1}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(ev)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162244] transition-colors"
                  title="Edit Agenda"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus agenda "${ev.title}"?`)) {
                      deleteLandingEvent(ev.id);
                      onNotify("Agenda kegiatan berhasil dihapus!");
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Hapus Agenda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Agenda */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2d5a]">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  {editingId ? "Edit Agenda Kegiatan" : "Tambah Agenda Baru"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Agenda ini akan langsung tampil di kalender kegiatan landing page.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal / Hari (Angka) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    placeholder="Contoh: 25"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-black text-center focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bulan (3 Huruf) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value.toUpperCase() })}
                    placeholder="Contoh: SEP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-black text-center uppercase focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Agenda / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Trial Class Gratis Serentak Akhir Pekan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="Contoh: 14:00 – 16:00 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Cabang / Tempat
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Contoh: Cabang Singkut & Bangko"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Penjelasan singkat mengenai acara atau sesi ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Active & Order */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tampilkan di Website</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Urutan:</span>
                  <input
                    type="number"
                    value={form.orderIndex}
                    onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) || 1 })}
                    className="w-16 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-center font-bold"
                  />
                </div>
              </div>

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
                  {editingId ? "Simpan Perubahan" : "Simpan Agenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
