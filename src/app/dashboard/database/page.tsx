"use client";

import React from "react";
import { Database, Server, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

export default function DatabasePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Status Database Cloud & Server
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Koneksi PostgreSQL mandiri di VPS Coolify & metrik performa query
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-slate-900">PostgreSQL 16 Service</div>
          <p className="text-xs text-slate-500">
            Container database berjalan di Coolify VPS lokal dengan data volume persisten.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Terhubung (Online - 370ms)
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-slate-900">Next.js Docker Standalone</div>
          <p className="text-xs text-slate-500">
            Container aplikasi terkompilasi optimal dengan memori footprint rendah.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <CheckCircle2 className="w-4 h-4" />
            Healthy (v3.3)
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-slate-900">Traefik SSL Proxy</div>
          <p className="text-xs text-slate-500">
            Sertifikat Let&apos;s Encrypt aktif otomatis untuk custom domain pribadi.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-purple-700">
            <CheckCircle2 className="w-4 h-4" />
            HTTPS Valid
          </div>
        </div>
      </div>
    </div>
  );
}
