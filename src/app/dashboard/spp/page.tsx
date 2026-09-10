"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  BookOpen,
  UserCheck,
  MessageSquare,
  Bell,
  Plus,
  Edit2,
  Send,
  Search,
  ChevronDown,
  Download,
  Share2,
  Trash2,
  Calendar,
  Check,
  X,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  BookText,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiStudentSelect from "@/components/ui/MultiStudentSelect";
import { useAppStore, InvoiceItem } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";

function SppContent() {
  const { students, invoices, addInvoice, addInvoicesBulk, updateInvoiceStatus, deleteInvoice, branches } =
    useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");
  const isMembaca = paramProgram === "MEMBACA";

  const [branchFilter, setBranchFilter] = useState(allowedBranch || "ALL");

  const scopedStudents = useMemo(() => {
    let list = allowedBranch ? students.filter((s) => s.branch === allowedBranch) : students;
    if (branchFilter !== "ALL") list = list.filter((s) => s.branch === branchFilter);
    return list.filter((s) =>
      isMembaca ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA"
    );
  }, [students, allowedBranch, branchFilter, isMembaca]);

  const scopedInvoices = useMemo(() => {
    let list = invoices;
    if (allowedBranch) {
      list = list.filter((inv) => {
        const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
        return st?.branch === allowedBranch || inv.branch === allowedBranch;
      });
    } else if (branchFilter !== "ALL") {
      list = list.filter((inv) => {
        const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
        return st?.branch === branchFilter || inv.branch === branchFilter;
      });
    }
    const currentProgType = isMembaca ? "MEMBACA" : "MATEMATIKA";
    return list.filter((inv) => {
      if (inv.programType) return inv.programType === currentProgType;
      const st = students.find((s) => s.id === inv.studentId || s.name === inv.studentName);
      return isMembaca
        ? (st as any)?.programType === "MEMBACA"
        : (st as any)?.programType !== "MEMBACA";
    });
  }, [invoices, students, allowedBranch, branchFilter, isMembaca]);

  const [activeSubTab, setActiveSubTab] = useState<
    "pendaftaran" | "spp" | "buku" | "pengingat"
  >("spp");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BELUM_BAYAR" | "LUNAS">("ALL");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceItem | null>(null);
  const [isCustomTemplateOpen, setIsCustomTemplateOpen] = useState(false);
  const [waTemplate, setWaTemplate] = useState(
    `Assalamu'alaikum warahmatullahi wabarakatuh. Ibu/Bapak *{nama_wali}*,

Mengingatkan kembali pembayaran SPP Les Privat *Math Fingers* ananda *{nama_siswa}* periode *{periode}*.

Berikut rincian tagihan digital:

• No Invoice: {no_invoice}
• Jumlah Pembayaran: *{nominal}*
• Tanggal Jatuh Tempo: {jatuh_tempo}
• Metode Pembayaran: *Tunai / Transfer*
• Status: *BELUM LUNAS (UNPAID)*

Terima kasih banyak atas dukungannya. Mari terus dukung motivasi belajar matematika ananda!

Salam Hangat,
*Math Fingers*`
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form for new invoice
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    period: "September 2026",
    dueDate: new Date().toISOString().split("T")[0],
    amount: 100000,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return scopedInvoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.period.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "LUNAS"
          ? inv.status === "LUNAS"
          : inv.status === "BELUM BAYAR";

      return matchSearch && matchStatus;
    });
  }, [scopedInvoices, searchQuery, statusFilter]);

  const unpaidCount = scopedInvoices.filter((i) => i.status === "BELUM BAYAR").length;

  const handleOpenAdd = () => {
    setSelectedStudentIds(scopedStudents.length > 0 ? [scopedStudents[0].id] : []);
    setForm({
      period: "September 2026",
      dueDate: new Date().toISOString().split("T")[0],
      amount: 100000,
    });
    setIsAddOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert("Silakan pilih minimal 1 siswa untuk menerbitkan invoice.");
      return;
    }

    const selectedStudents = students.filter((s) => selectedStudentIds.includes(s.id));
    if (selectedStudents.length === 0) return;

    const invoicesToCreate = selectedStudents.map((st) => ({
      studentId: st.id,
      studentName: st.name,
      period: form.period,
      dueDate: form.dueDate,
      amount: form.amount,
      status: "BELUM BAYAR" as const,
      branch: st.branch,
      programType: isMembaca ? ("MEMBACA" as const) : ("MATEMATIKA" as const),
    }));

    addInvoicesBulk(invoicesToCreate);
    setIsAddOpen(false);

    if (selectedStudents.length === 1) {
      showToast(`Invoice baru berhasil diterbitkan untuk ${selectedStudents[0].name}!`);
    } else {
      showToast(`${selectedStudents.length} Invoice baru berhasil diterbitkan sekaligus!`);
    }
  };

  const handleConfirmPayment = (method: string) => {
    if (!payingInvoice) return;
    updateInvoiceStatus(
      payingInvoice.id,
      "LUNAS",
      new Date().toISOString().split("T")[0],
      method
    );
    setPayingInvoice(null);
    showToast(`Pembayaran tagihan ${payingInvoice.invoiceNo} berhasil diverifikasi Lunas!`);
  };

  const handleToggleCancelPaid = (inv: InvoiceItem) => {
    updateInvoiceStatus(inv.id, "BELUM BAYAR");
    showToast(`Status pembayaran ${inv.invoiceNo} dikembalikan ke Belum Bayar.`);
  };

  const handleSendSingleWA = (inv: InvoiceItem) => {
    const isPaid = inv.status === "LUNAS";
    const st = students.find(
      (s) =>
        s.id === inv.studentId ||
        s.name.toLowerCase().trim() === inv.studentName.toLowerCase().trim()
    );

    const branchName = inv.branch || st?.branch || "Singkut";
    const branchObj = branches.find(
      (b) =>
        b.name.toLowerCase() === branchName.toLowerCase() ||
        b.name.toLowerCase() === branchName.replace(/^Cabang\s+/i, "").toLowerCase()
    );

    const parentName = st?.parentName || "Wali Murid";
    const studentName = inv.studentName || st?.name || "Ananda";
    const amountFormatted = `Rp ${inv.amount.toLocaleString("id-ID")}`;
    const paidDate = inv.paidDate || inv.dueDate || "2026-09-05";
    const paidMethod = inv.paidMethod || "Tunai";
    const progType = inv.programType || (st as any)?.programType || (isMembaca ? "MEMBACA" : "MATEMATIKA");
    const programName = progType === "MEMBACA" ? "membaca" : "matematika";

    let paymentMethodLine = `• Metode Pembayaran: *${paidMethod}*`;
    if (!isPaid) {
      if (branchObj?.bankName && branchObj?.accountNumber) {
        paymentMethodLine = `• Metode Pembayaran: *Tunai / Transfer (${branchObj.bankName}: ${branchObj.accountNumber} a.n ${branchObj.accountHolder || "Math Fingers"})*`;
      } else {
        paymentMethodLine = `• Metode Pembayaran: *Tunai di Cabang / Transfer*`;
      }
    }

    let text = "";
    if (isPaid) {
      text = `Assalamu'alaikum warahmatullahi wabarakatuh. Ibu/Bapak *${parentName}*,

Terima kasih! Kami telah menerima pembayaran SPP Les Privat *Math Fingers* ananda *${studentName}* periode *${inv.period}*.

Berikut kuitansi tanda terima digital:

• No Invoice: ${inv.invoiceNo}
• Jumlah Pembayaran: *${amountFormatted}*
• Tanggal Bayar: ${paidDate}
• Metode Pembayaran: *${paidMethod}*
• Status: *LUNAS (PAID)*

Terima kasih banyak atas dukungannya. Mari terus dukung motivasi belajar ${programName} ananda!

Salam Hangat,
*Math Fingers*`;
    } else {
      text = `Assalamu'alaikum warahmatullahi wabarakatuh. Ibu/Bapak *${parentName}*,

Mengingatkan kembali pembayaran SPP Les Privat *Math Fingers* ananda *${studentName}* periode *${inv.period}*.

Berikut rincian tagihan digital:

• No Invoice: ${inv.invoiceNo}
• Jumlah Pembayaran: *${amountFormatted}*
• Tanggal Jatuh Tempo: ${inv.dueDate}
${paymentMethodLine}
• Status: *BELUM LUNAS (UNPAID)*

Terima kasih banyak atas dukungannya. Mari terus dukung motivasi belajar ${programName} ananda!

Salam Hangat,
*Math Fingers*`;
    }

    let cleanPhone = (st?.parentWhatsapp || "").replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
    showToast(`Membuka WhatsApp untuk ${isPaid ? "kuitansi" : "pengingat"} ${studentName}`);
  };

  const handleBatchSendWA = () => {
    showToast(`Pengingat WhatsApp berhasil dikirimkan ke ${unpaidCount} wali siswa!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Status Bar */}
      <TopStatusBar title={isMembaca ? "Pembayaran SPP Les Membaca" : "Pembayaran SPP Les Matematika"} />

      {/* Subtabs (Pembayaran Pendaftaran, SPP, Buku, Pengingat SPP & Buku WA) */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-[#1d2d5a] text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab("pendaftaran")}
          className={`flex items-center gap-2 pb-3.5 transition-all shrink-0 relative cursor-pointer ${
            activeSubTab === "pendaftaran"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Pembayaran Pendaftaran
          {activeSubTab === "pendaftaran" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("spp")}
          className={`flex items-center gap-2 pb-3.5 transition-all shrink-0 relative cursor-pointer ${
            activeSubTab === "spp"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          SPP
          {activeSubTab === "spp" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("buku")}
          className={`flex items-center gap-2 pb-3.5 transition-all shrink-0 relative cursor-pointer ${
            activeSubTab === "buku"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Buku
          {activeSubTab === "buku" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("pengingat")}
          className={`flex items-center gap-2 pb-3.5 transition-all shrink-0 relative cursor-pointer ${
            activeSubTab === "pengingat"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Pengingat SPP & Buku (WA)
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
            {unpaidCount}
          </span>
          {activeSubTab === "pengingat" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Title Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SPP & Invoice Manajemen
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Terbitkan tagihan SPP bulanan, catat pembayaran lunas/cicilan, pengingat otomatis H-2, dan ekspor kuitansi PDF.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleBatchSendWA}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            Pengingat SPP H-2
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              {unpaidCount}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Invoice Baru
          </button>
        </div>
      </div>

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Banner Alert: Tagihan SPP Menjelang / Melewati Jatuh Tempo (H-2) */}
      <div className="rounded-2xl p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {unpaidCount} Tagihan SPP Menjelang / Melewati Jatuh Tempo (H-2)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold tracking-wider uppercase">
                SISWA PERLU DIINGATKAN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Notifikasi instan ke WhatsApp wali murid dalam 1 klik dengan format pesan sopan & profesional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCustomTemplateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            Custom Kata-Kata
          </button>

          <button
            type="button"
            onClick={handleBatchSendWA}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim WA ({unpaidCount})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0f1a36] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, nomor invoice, atau periode.."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {isSuperAdmin ? (
          <CustomSelect
            value={branchFilter}
            onChange={setBranchFilter}
            size="md"
            options={[
              { value: "ALL", label: "Semua Cabang" },
              ...branches.map((b) => ({
                value: b.name,
                label: `Cabang: ${b.name}`,
              })),
            ]}
          />
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cabang {allowedBranch}</span>
          </div>
        )}

        <CustomSelect
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as any)}
          size="md"
          options={[
            { value: "ALL", label: "Semua Pembayaran" },
            { value: "BELUM_BAYAR", label: "Belum Bayar" },
            { value: "LUNAS", label: "Lunas" },
          ]}
        />
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0b1329] border-b border-slate-200/80 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">NO INVOICE</th>
                <th className="py-3 px-4">NAMA SISWA</th>
                <th className="py-3 px-4">PERIODE & TEMPO</th>
                <th className="py-3 px-4">JUMLAH BIAYA</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-center">TINDAKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada tagihan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === "LUNAS";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          <span>{inv.invoiceNo}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{inv.studentName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            Cabang {inv.branch || students.find((s) => s.id === inv.studentId)?.branch || "Singkut"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {inv.period}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Tempo: {inv.dueDate}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                        Rp {inv.amount.toLocaleString("id-ID")}
                      </td>

                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              <Check className="w-3 h-3" />
                              LUNAS
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {inv.paidDate || "2026-09-05"} ({inv.paidMethod || "Tunai"})
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                            BELUM BAYAR
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {isPaid ? (
                            <button
                              type="button"
                              onClick={() => handleToggleCancelPaid(inv)}
                              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            >
                              Batal Lunas
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPayingInvoice(inv)}
                              className="px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer"
                            >
                              Bayar / Cicil
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            title="Unduh Kwitansi"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendSingleWA(inv)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer transition-colors"
                            title={isPaid ? "Kirim Kuitansi via WA" : "Kirim Pengingat SPP via WA"}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteInvoice(inv.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                            title="Hapus Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Buat Invoice Baru */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Terbitkan Invoice SPP Baru
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
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-700 dark:text-slate-200">
                    Pilih Siswa *
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedStudentIds.length} Siswa Terpilih
                  </span>
                </div>
                <MultiStudentSelect
                  students={scopedStudents.map((s) => ({
                    id: s.id,
                    name: s.name,
                    className: s.className,
                    branch: s.branch,
                    programType: (s as any).programType,
                  }))}
                  selectedIds={selectedStudentIds}
                  onChange={setSelectedStudentIds}
                  placeholder="Pilih satu atau beberapa siswa..."
                  className="w-full"
                  size="md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">
                  Periode Tagihan *
                </label>
                <input
                  type="text"
                  required
                  value={form.period}
                  onChange={(e) =>
                    setForm({ ...form, period: e.target.value })
                  }
                  placeholder="Contoh: September 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">
                  Tanggal Jatuh Tempo *
                </label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 dark:text-slate-200">
                  Nominal Tagihan per Siswa (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Total calculation preview */}
              {selectedStudentIds.length > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      Total {selectedStudentIds.length} Invoice Diterbitkan
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {selectedStudentIds.length} Siswa × Rp {form.amount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      Total Nominal
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                      Rp {(selectedStudentIds.length * form.amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={selectedStudentIds.length === 0}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-xs shadow-emerald-500/20 text-white font-extrabold cursor-pointer transition-colors"
                >
                  Terbitkan {selectedStudentIds.length > 1 ? `(${selectedStudentIds.length} Invoice)` : "Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bayar / Cicil Tagihan */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Pencatatan Pembayaran SPP
              </h3>
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-[#1d2d5a] space-y-1 text-xs">
              <div className="text-slate-400">Siswa:</div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                {payingInvoice.studentName}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                {payingInvoice.invoiceNo} • {payingInvoice.period}
              </div>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                Rp {payingInvoice.amount.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                Pilih Metode Pembayaran:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmPayment("Tunai")}
                  className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                >
                  💵 Tunai di Kasir
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmPayment("Transfer")}
                  className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                >
                  🏦 Transfer Bank / QRIS
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPayingInvoice(null)}
              className="w-full py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 mt-2 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal: Custom Kata-Kata WhatsApp Template */}
      {isCustomTemplateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Kustomisasi Format Pengingat WhatsApp
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomTemplateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Gunakan variabel otomatis:{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{nama_wali}"}
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{nama_siswa}"}
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{periode}"}
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{no_invoice}"}
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{nominal}"}
                </code>
                ,{" "}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  {"{jatuh_tempo}"}
                </code>
              </p>

              <textarea
                rows={6}
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white leading-relaxed font-sans focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomTemplateOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-extrabold cursor-pointer transition-colors"
              >
                Simpan Format Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SppPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold">
          Memuat data SPP...
        </div>
      }
    >
      <SppContent />
    </Suspense>
  );
}
