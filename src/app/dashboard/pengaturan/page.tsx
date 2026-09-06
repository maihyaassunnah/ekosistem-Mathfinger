"use client";

import React from "react";
import { Settings, Save, Bell, Shield, Key } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

export default function PengaturanPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Sistem & Profil
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi akun Super Admin, integrasi WhatsApp Gateway, dan tarif default SPP
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          Profil Pengguna Saat Ini
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={CURRENT_USER.name}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Administrator</label>
            <input
              type="email"
              defaultValue={CURRENT_USER.email}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Hak Akses: Super Admin (Pusat)</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
