"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Building2,
  Sparkles,
  Info,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";
import TopStatusBar from "@/components/dashboard/TopStatusBar";
import { useAppStore, CashTransactionItem } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";

function ArusKeuanganContent() {
  const { transactions, addTransaction, deleteTransaction, branches } =
    useAppStore();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");
  const isMembaca = paramProgram === "MEMBACA";

  const [activeSubTab, setActiveSubTab] = useState<
    "ringkasan" | "pemasukan" | "pengeluaran" | "ledger" | "laporan"
  >("ringkasan");

  // Filter Bar
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState<string>(
    allowedBranch || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync selectedBranch if allowedBranch becomes available
  React.useEffect(() => {
    if (allowedBranch) {
      setSelectedBranch(allowedBranch);
    }
  }, [allowedBranch]);

  // Form State
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "SPP",
    title: "",
    amount: 100000,
    branch: (allowedBranch || "Singkut") as "Singkut" | "Bangko",
    sourceOrRecipient: "",
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Effective branch filter (locked to allowedBranch for branch users)
  const effectiveBranch = allowedBranch || selectedBranch;

  // Filtered transactions by program
  const programFilteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const isTxMembaca =
        t.programType === "MEMBACA" ||
        t.title.toLowerCase().includes("membaca") ||
        t.notes?.toLowerCase().includes("membaca");
      return isMembaca ? isTxMembaca : !isTxMembaca;
    });
  }, [transactions, isMembaca]);

  // Filtered transactions by branch
  const branchFilteredTransactions = useMemo(() => {
    return programFilteredTransactions.filter((t) => {
      if (effectiveBranch === "ALL") return true;
      return t.branch === effectiveBranch;
    });
  }, [programFilteredTransactions, effectiveBranch]);

  // Current month active transactions (August/September 2026)
  const currentMonthTransactions = useMemo(() => {
    return branchFilteredTransactions.filter((t) => {
      return t.date.startsWith("2026-08") || t.date.startsWith("2026-09");
    });
  }, [branchFilteredTransactions]);

  // Financial Metrics
  const totalAllIncomes = useMemo(() => {
    return branchFilteredTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [branchFilteredTransactions]);

  const totalAllExpenses = useMemo(() => {
    return branchFilteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [branchFilteredTransactions]);

  const saldoKasSaatIni = totalAllIncomes - totalAllExpenses;

  const pemasukanBulanIni = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentMonthTransactions]);

  const pengeluaranBulanIni = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentMonthTransactions]);

  const profitBersihBulanIni = pemasukanBulanIni - pengeluaranBulanIni;

  // Smart Financial Insights Logic
  const insights = useMemo(() => {
    const incomes = currentMonthTransactions.filter((t) => t.type === "INCOME");
    const expenses = currentMonthTransactions.filter(
      (t) => t.type === "EXPENSE"
    );

    // Top income source
    const sortedIncomes = [...incomes].sort((a, b) => b.amount - a.amount);
    const topIncome = sortedIncomes[0] || {
      sourceOrRecipient: "ELH tagor",
      amount: 200000,
    };

    // Top expense category
    const expenseCategoryMap: Record<string, number> = {};
    expenses.forEach((e) => {
      expenseCategoryMap[e.category] =
        (expenseCategoryMap[e.category] || 0) + e.amount;
    });
    const topCategoryEntry = Object.entries(expenseCategoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0] || ["Cetak buku", 75000];

    // Operational cost ratio
    const ratio =
      pemasukanBulanIni > 0
        ? ((pengeluaranBulanIni / pemasukanBulanIni) * 100).toFixed(1)
        : "0.0";

    return {
      topIncomeName: topIncome.sourceOrRecipient || "ELH tagor",
      topIncomeAmount: topIncome.amount,
      topExpenseCategory: topCategoryEntry[0],
      topExpenseAmount: topCategoryEntry[1],
      expenseRatio: ratio,
    };
  }, [currentMonthTransactions, pemasukanBulanIni, pengeluaranBulanIni]);

  // Periodic chart monthly data (Apr, Mei, Jun, Jul, Agt Kini)
  const periodicData = [
    { month: "Apr", income: 2200000, expense: 1800000 },
    { month: "Mei", income: 3400000, expense: 2100000 },
    { month: "Jun", income: 4500000, expense: 3200000 },
    { month: "Jul", income: 5800000, expense: 3600000 },
    { month: "Agt (Kini)", income: pemasukanBulanIni, expense: pengeluaranBulanIni },
  ];

  const maxChartValue = Math.max(
    ...periodicData.map((d) => Math.max(d.income, d.expense)),
    6000000
  );

  // Handlers
  const handleOpenAddIncome = () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      category: "SPP",
      title: "Pembayaran SPP Siswa",
      amount: 150000,
      branch: (allowedBranch || (selectedBranch === "ALL" ? (branches[0]?.name || "Singkut") : selectedBranch)) as any,
      sourceOrRecipient: "",
      notes: "Iuran SPP bulanan",
    });
    setIsAddIncomeOpen(true);
  };

  const handleOpenAddExpense = () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      category: "Operasional & ATK",
      title: "Pengadaan Operasional Cabang",
      amount: 75000,
      branch: (allowedBranch || (selectedBranch === "ALL" ? (branches[0]?.name || "Singkut") : selectedBranch)) as any,
      sourceOrRecipient: "Vendor Toko ATK",
      notes: "Kebutuhan kertas & spidol",
    });
    setIsAddExpenseOpen(true);
  };

  const handleSubmitTransaction = (type: "INCOME" | "EXPENSE") => {
    addTransaction({
      date: form.date,
      type,
      category: form.category,
      title: form.title,
      amount: Number(form.amount) || 0,
      branch: form.branch,
      sourceOrRecipient: form.sourceOrRecipient || (type === "INCOME" ? "Wali Siswa" : "Vendor"),
      notes: form.notes,
    });
    setIsAddIncomeOpen(false);
    setIsAddExpenseOpen(false);
    showToast(
      `${type === "INCOME" ? "Pemasukan" : "Pengeluaran"} sebesar Rp ${Number(
        form.amount
      ).toLocaleString("id-ID")} berhasil dicatat!`
    );
  };

  // Running balance calculation for ledger
  const ledgerRows = useMemo(() => {
    const sorted = [...branchFilteredTransactions].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    let running = 0;
    return sorted.map((tx) => {
      if (tx.type === "INCOME") running += tx.amount;
      else running -= tx.amount;
      return {
        ...tx,
        runningBalance: running,
      };
    });
  }, [branchFilteredTransactions]);

  const handleExportCSV = () => {
    let csv = "ID,Tanggal,Jenis,Kategori,Judul,Cabang,Pihak Terkait,Nominal,Catatan\n";
    branchFilteredTransactions.forEach((t) => {
      csv += `"${t.id}","${t.date}","${t.type}","${t.category}","${t.title}","${t.branch}","${t.sourceOrRecipient}","${t.amount}","${t.notes || ""}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `buku_kas_mathfingers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Top Breadcrumb */}
      <TopStatusBar title={isMembaca ? "Keuangan (Les Membaca)" : "Keuangan"} />

      {/* Main Header & Filter Dropdowns (Matching User Screenshot) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {isMembaca ? "Manajemen Keuangan (Les Membaca)" : "Manajemen Keuangan (Les Matematika)"}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  isMembaca
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}
              >
                {isMembaca ? "📖 Les Membaca" : "🔢 Les Matematika"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pantau arus kas masuk, keluar, buku ledger harian, serta analisis laba rugi {isMembaca ? "les membaca" : "les matematika"}.
            </p>
          </div>
        </div>

        {/* Top Right Dropdowns: Bulan & Cabang */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dropdown Bulan */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-[#1d2d5a] shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Bulan</option>
              <option value="2026-08">Agustus 2026</option>
              <option value="2026-07">Juli 2026</option>
              <option value="2026-06">Juni 2026</option>
              <option value="2026-05">Mei 2026</option>
              <option value="2026-04">April 2026</option>
            </select>
          </div>

          {/* Dropdown Cabang / Locked Badge */}
          {!isSuperAdmin && allowedBranch ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-slate-500 font-medium">Cabang:</span>
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                {allowedBranch}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold uppercase">
                Terkunci
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-[#1d2d5a] shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Cabang:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as any)}
                className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 5 Subtabs Pill Switcher (Matching Screenshot) */}
      <div className="bg-white/80 dark:bg-[#0f1a36] p-1.5 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] flex items-center gap-1.5 flex-wrap shadow-2xs">
        {[
          { id: "ringkasan", label: "Ringkasan", icon: null },
          { id: "pemasukan", label: "Pemasukan", icon: ArrowUpRight },
          { id: "pengeluaran", label: "Pengeluaran", icon: ArrowDownRight },
          { id: "ledger", label: "Buku Kas (Ledger)", icon: Calendar },
          { id: "laporan", label: "Laporan & Ekspor", icon: Layers },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* TAB 1: RINGKASAN (Matching User Screenshot) */}
      {activeSubTab === "ringkasan" && (
        <div className="space-y-6">
          {/* 4 Financial Metric Cards (Matching Screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: SALDO KAS SAAT INI */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SALDO KAS SAAT INI
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  Rp {saldoKasSaatIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: PEMASUKAN BULAN INI */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PEMASUKAN BULAN INI
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  Rp {pemasukanBulanIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: PENGELUARAN BULAN INI */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PENGELUARAN BULAN INI
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  Rp {pengeluaranBulanIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: PROFIT BERSIH BULAN INI */}
            <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-5 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PROFIT BERSIH BULAN INI
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2563eb] dark:text-[#60a5fa]">
                  Rp {profitBersihBulanIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#2563eb] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Lower Two-Column Section: Periodic Chart (Left) & Smart Insights (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sebaran Pemasukan & Pengeluaran Periodik */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Sebaran Pemasukan & Pengeluaran Periodik
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Saran representasi visual aliran dana masuk dan keluar bimbingan belajar.
                </p>
              </div>

              {/* Bar Chart Container */}
              <div className="pt-8 pb-4 px-2">
                <div className="h-64 flex items-end justify-between gap-4 sm:gap-8 px-4 border-b border-slate-200 dark:border-[#1d2d5a] relative">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-slate-200 dark:border-[#1d2d5a] w-full" />
                    <div className="border-b border-dashed border-slate-200 dark:border-[#1d2d5a] w-full" />
                    <div className="border-b border-dashed border-slate-200 dark:border-[#1d2d5a] w-full" />
                  </div>

                  {/* Monthly Bars */}
                  {periodicData.map((item, idx) => {
                    const incomeHeightPct = Math.round(
                      (item.income / maxChartValue) * 100
                    );
                    const expenseHeightPct = Math.round(
                      (item.expense / maxChartValue) * 100
                    );

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end relative z-10"
                      >
                        <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-full">
                          {/* Blue Bar (Pemasukan) */}
                          <div
                            style={{ height: `${Math.max(incomeHeightPct, 6)}%` }}
                            className="w-4 sm:w-6 bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 rounded-t-lg transition-all relative group cursor-pointer"
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                              Pemasukan: Rp {item.income.toLocaleString("id-ID")}
                            </div>
                          </div>

                          {/* Pink/Red Bar (Pengeluaran) */}
                          <div
                            style={{ height: `${Math.max(expenseHeightPct, 6)}%` }}
                            className="w-4 sm:w-6 bg-amber-500 hover:bg-amber-600 rounded-t-lg transition-all relative group cursor-pointer"
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none transition-opacity">
                              Pengeluaran: Rp {item.expense.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>

                        {/* Month Label */}
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-3 truncate">
                          {item.month}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend matching screenshot */}
                <div className="flex items-center justify-center gap-6 pt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span>Pemasukan</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Pengeluaran</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Analisis Keuangan Pintar (Matching Screenshot) */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-6 space-y-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Analisis Keuangan Pintar</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kecerdasan analisis dari data transaksi kas bimbingan belajar periode ini.
                </p>
              </div>

              {/* 3 Insight Cards with rounded borders */}
              <div className="space-y-3 pt-1">
                {/* Insight 1: Sumber pemasukan terbesar */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50/50 dark:bg-[#0b1329] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Sumber pemasukan terbesar berasal dari{" "}
                    <strong>&quot;{insights.topIncomeName}&quot;</strong> dengan total nominal{" "}
                    <strong>Rp {insights.topIncomeAmount.toLocaleString("id-ID")}</strong>.
                  </p>
                </div>

                {/* Insight 2: Kategori pengeluaran terbesar */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50/50 dark:bg-[#0b1329] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Kategori pengeluaran terbesar adalah{" "}
                    <strong>&quot;{insights.topExpenseCategory}&quot;</strong> dengan total penyerapan kas sebesar{" "}
                    <strong>Rp {insights.topExpenseAmount.toLocaleString("id-ID")}</strong>.
                  </p>
                </div>

                {/* Insight 3: Kondisi keuangan & rasio */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] bg-slate-50/50 dark:bg-[#0b1329] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Kondisi keuangan sangat sehat dengan rasio biaya operasional hanya sebesar{" "}
                    <strong>{insights.expenseRatio}%</strong> dari total pendapatan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PEMASUKAN */}
      {activeSubTab === "pemasukan" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Daftar Seluruh Pemasukan Kas
              </h3>
              <p className="text-xs text-slate-500">
                Penerimaan iuran SPP, uang pendaftaran siswa baru, dan penjualan buku modul.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Catat Pemasukan Baru
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-4">TANGGAL</th>
                    <th className="py-3 px-4">KATEGORI</th>
                    <th className="py-3 px-4">SUMBER / NAMA</th>
                    <th className="py-3 px-4">CABANG</th>
                    <th className="py-3 px-4">KETERANGAN</th>
                    <th className="py-3 px-4 text-right">NOMINAL</th>
                    <th className="py-3 px-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {branchFilteredTransactions
                    .filter((t) => t.type === "INCOME")
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {t.date}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 text-[10px] font-bold">
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {t.sourceOrRecipient}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{t.branch}</td>
                        <td className="py-3 px-4 text-slate-500 italic">{t.title}</td>
                        <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                          + Rp {t.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-600"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGELUARAN */}
      {activeSubTab === "pengeluaran" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Daftar Seluruh Pengeluaran Kas
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan beban operasional, cetak modul, sewa ruang, dan biaya administrasi.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Catat Pengeluaran Baru
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-4">TANGGAL</th>
                    <th className="py-3 px-4">KATEGORI</th>
                    <th className="py-3 px-4">PENERIMA / VENDOR</th>
                    <th className="py-3 px-4">CABANG</th>
                    <th className="py-3 px-4">KETERANGAN</th>
                    <th className="py-3 px-4 text-right">NOMINAL</th>
                    <th className="py-3 px-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {branchFilteredTransactions
                    .filter((t) => t.type === "EXPENSE")
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {t.date}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {t.sourceOrRecipient}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{t.branch}</td>
                        <td className="py-3 px-4 text-slate-500 italic">{t.title}</td>
                        <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                          - Rp {t.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-600"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BUKU KAS (LEDGER) */}
      {activeSubTab === "ledger" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Buku Kas Umum (General Ledger)
              </h3>
              <p className="text-xs text-slate-500">
                Rekapitulasi mutasi kas masuk, kas keluar, dan saldo berjalan kumulatif secara kronologis.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] bg-white dark:bg-[#0f1a36] hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <Download className="w-4 h-4" />
              Unduh CSV Ledger
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#09130f] border-b border-slate-200 dark:border-[#1d2d5a] text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">TANGGAL</th>
                    <th className="py-3 px-4">URAIAN TRANSAKSI</th>
                    <th className="py-3 px-4">CABANG</th>
                    <th className="py-3 px-4 text-right">MASUK (DEBIT)</th>
                    <th className="py-3 px-4 text-right">KELUAR (KREDIT)</th>
                    <th className="py-3 px-4 text-right">SALDO BERJALAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ledgerRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {row.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {row.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {row.category} • {row.sourceOrRecipient}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{row.branch}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">
                        {row.type === "INCOME"
                          ? `+ Rp ${row.amount.toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">
                        {row.type === "EXPENSE"
                          ? `- Rp ${row.amount.toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100">
                        Rp {row.runningBalance.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LAPORAN & EKSPOR */}
      {activeSubTab === "laporan" && (
        <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/80 dark:border-[#1d2d5a] p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1d2d5a] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/logo.png"
                  alt="Easy Learning House"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Easy Learning House - Laporan Ringkasan Laba Rugi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konsolidasi kinerja keuangan periode berjalan bimbel Math Fingers seluruh cabang.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Laporan PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Rincian Pemasukan */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Rincian Arus Kas Masuk (Pemasukan)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Penerimaan SPP Bulanan:</span>
                  <span className="font-bold text-emerald-600">Rp 600.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Iuran Pendaftaran Baru:</span>
                  <span className="font-bold text-emerald-600">Rp 200.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Penjualan Buku & Modul:</span>
                  <span className="font-bold text-emerald-600">Rp 300.000</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <span>Total Pemasukan:</span>
                  <span className="text-emerald-600">Rp {pemasukanBulanIni.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Rincian Pengeluaran */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Rincian Arus Kas Keluar (Pengeluaran)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Penggandaan / Cetak Buku:</span>
                  <span className="font-bold text-emerald-600">Rp 75.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Gaji & Honor Tutor:</span>
                  <span className="font-bold text-slate-400">Rp 0 (Jadwal Akhir Bulan)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#1d2d5a]">
                  <span className="text-slate-600 dark:text-slate-400">Operasional & ATK:</span>
                  <span className="font-bold text-slate-400">Rp 0</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <span>Total Pengeluaran:</span>
                  <span className="text-emerald-600">Rp {pengeluaranBulanIni.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Catat Pemasukan Baru */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Catat Pemasukan Kas Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddIncomeOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitTransaction("INCOME");
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Tanggal Transaksi *
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Kategori Pemasukan *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="SPP">SPP Bulanan Siswa</option>
                  <option value="Pendaftaran">Uang Pendaftaran Siswa Baru</option>
                  <option value="Modul/Buku">Penjualan Buku Modul Jaritmatika</option>
                  <option value="Lainnya">Pemasukan Lain-lain</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Sumber / Dari Siapa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Nama Siswa / Wali Murid"
                  value={form.sourceOrRecipient}
                  onChange={(e) =>
                    setForm({ ...form, sourceOrRecipient: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Cabang *
                  </label>
                  <select
                    value={allowedBranch || form.branch}
                    disabled={Boolean(allowedBranch)}
                    onChange={(e) =>
                      setForm({ ...form, branch: e.target.value as any })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold ${
                      allowedBranch ? "opacity-80 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : ""
                    }`}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Nominal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Judul / Uraian Transaksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pelunasan SPP September 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-bold"
                >
                  Simpan Pemasukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Catat Pengeluaran Baru */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Catat Pengeluaran Kas Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitTransaction("EXPENSE");
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Tanggal Pengeluaran *
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Kategori Pengeluaran *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="Cetak buku">Cetak Buku & Modul</option>
                  <option value="Gaji Tutor">Honor / Gaji Tutor Pengajar</option>
                  <option value="Operasional & ATK">Operasional, ATK & Spidol</option>
                  <option value="Sewa & Listrik">Sewa Tempat & Listrik / WiFi</option>
                  <option value="Lainnya">Pengeluaran Lainnya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Penerima / Toko / Vendor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Percetakan Mandiri / Nama Tutor"
                  value={form.sourceOrRecipient}
                  onChange={(e) =>
                    setForm({ ...form, sourceOrRecipient: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Cabang *
                  </label>
                  <select
                    value={allowedBranch || form.branch}
                    disabled={Boolean(allowedBranch)}
                    onChange={(e) =>
                      setForm({ ...form, branch: e.target.value as any })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-semibold ${
                      allowedBranch ? "opacity-80 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : ""
                    }`}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Nominal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Judul / Uraian Pengeluaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Biaya fotokopi lembar kerja kuis"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-[#0b1329] focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArusKeuanganPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat arus keuangan...</div>}>
      <ArusKeuanganContent />
    </Suspense>
  );
}
