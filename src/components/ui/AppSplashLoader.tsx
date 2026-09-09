"use client";

import React, { useEffect, useState } from "react";

export default function AppSplashLoader() {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Memuat Ekosistem...");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Smooth staggered progress milestones
    const t1 = setTimeout(() => {
      setProgress(50);
      setStatusText("Menyiapkan Ruang Belajar...");
    }, 280);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Menyinkronkan Data...");
    }, 600);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Selamat Datang di Easy Learning House");
    }, 900);

    // Trigger smooth fade-out
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1150);

    // Completely unmount overlay from DOM
    const t5 = setTimeout(() => {
      setIsVisible(false);
    }, 1550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Once fully faded, remove completely from DOM
  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between py-12 px-6 bg-[#070d1e] text-white select-none transition-all duration-500 ease-out ${
        isFadingOut
          ? "opacity-0 pointer-events-none scale-105 filter blur-xs"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

      {/* Top subtle badge */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-bold text-emerald-400 tracking-wider uppercase shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Terpadu Math Fingers</span>
        </div>
      </div>

      {/* Center Brand Identity */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Animated Brand Logo with Glow */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-40 blur-lg transition duration-500 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white border border-white/20 p-2.5 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Easy Learning House Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Brand Name Typography */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm mb-1">
          Easy Learning House
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-emerald-300/90 tracking-wide">
          Bimbingan Belajar & Ekosistem Jaritmatika
        </p>

        {/* Minimalist Professional Loading Progress Bar */}
        <div className="mt-8 w-52 sm:w-64">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(16,185,129,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="transition-all duration-200">{statusText}</span>
            <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 text-center">
        <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
          Easy Learning House &bull; Math Fingers
        </p>
      </div>
    </div>
  );
}
