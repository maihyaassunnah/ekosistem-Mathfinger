"use client";

import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, Trash2, Save, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success" | "primary";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Batal",
  variant = "success",
  isLoading = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const config = {
    danger: {
      icon: <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      iconBg: "bg-rose-100 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900/60",
      btnConfirm:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-600/20 focus:ring-rose-500",
      defaultConfirmText: "Ya, Hapus",
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900/60",
      btnConfirm:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20 focus:ring-emerald-500",
      defaultConfirmText: "Ya, Simpan",
    },
    primary: {
      icon: <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-950/80 border-blue-200 dark:border-blue-900/60",
      btnConfirm:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/20 focus:ring-blue-500",
      defaultConfirmText: "Lanjutkan",
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${config.iconBg}`}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
              {message}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${config.btnConfirm}`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText || config.defaultConfirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
