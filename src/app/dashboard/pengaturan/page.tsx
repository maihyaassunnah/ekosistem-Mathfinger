"use client";

import React from "react";
import { Settings, Save, Bell, Shield, Key } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

export default function PengaturanPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pengaturan Sistem & Profil
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Konfigurasi akun Super Admin, integrasi WhatsApp Gateway, dan tarif default SPP
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-600" />
          Profil Pengguna Saat Ini
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={CURRENT_USER.name}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Administrator</label>
            <input
              type="email"
              defaultValue={CURRENT_USER.email}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hak Akses: Super Admin (Pusat)</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
