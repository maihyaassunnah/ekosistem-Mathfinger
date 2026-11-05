"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Send,
  Trash2,
  Calendar,
  User,
  Check,
  X,
  BookText,
} from "lucide-react";
import { useAppStore, JournalItem } from "@/lib/store";
import { useCurrentUser } from "@/lib/useCurrentUser";
import CustomSelect from "@/components/ui/CustomSelect";
import ConfirmModal from "@/components/ui/ConfirmModal";

function JurnalGuruContent() {
  const { journals, addJournal, addJournalsBulk, deleteJournal, classes, students } = useAppStore();
  const { isSuperAdmin, allowedBranch, name: currentUserName } = useCurrentUser();
  const searchParams = useSearchParams();
  const paramProgram = searchParams?.get("program");
  const isMembaca = paramProgram === "MEMBACA";

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [studentFilter, setStudentFilter] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "success" | "primary";
    onConfirm: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const scopedStudents = (allowedBranch ? students.filter((s) => s.branch === allowedBranch) : students).filter((s) =>
    isMembaca ? (s as any).programType === "MEMBACA" : (s as any).programType !== "MEMBACA"
  );
  const scopedClasses = (allowedBranch ? classes.filter((c) => c.branch === allowedBranch) : classes).filter((c) =>
    isMembaca ? (c as any).programType === "MEMBACA" : (c as any).programType !== "MEMBACA"
  );

  // Form & Modal state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [customStudentNotes, setCustomStudentNotes] = useState<Record<string, string>>({});
  const [modalClassFilter, setModalClassFilter] = useState("ALL");
  const [modalSearch, setModalSearch] = useState("");

  const [form, setForm] = useState({
    className: scopedClasses[0]?.name || "Kelas A",
    branch: (allowedBranch || "Singkut") as "Singkut" | "Bangko",
    topic: "",
    content: "",
    teacher: currentUserName || "Kak Guru",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAddModal = () => {
    // Select all scoped active students by default (e.g. 50 Terpilih)
    setSelectedStudentIds(scopedStudents.map((s) => s.id));
    setCustomStudentNotes({});
    setModalClassFilter("ALL");
    setModalSearch("");
    setForm({
      className: scopedClasses[0]?.name || "Kelas A",
      branch: (allowedBranch || "Singkut") as "Singkut" | "Bangko",
      topic: "",
      content: "",
      teacher: currentUserName || "Kak Guru",
      date: new Date().toISOString().split("T")[0],
    });
    setIsAddOpen(true);
  };

  const visibleModalStudents = scopedStudents.filter((st) => {
    const matchClass = modalClassFilter === "ALL" ? true : st.className === modalClassFilter;
    const matchSearch = modalSearch.trim()
      ? st.name.toLowerCase().includes(modalSearch.toLowerCase())
      : true;
    return matchClass && matchSearch;
  });

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = visibleModalStudents.map((s) => s.id);
    if (visibleIds.length === 0) return;

    const allVisibleSelected = visibleIds.every((id) => selectedStudentIds.includes(id));

    if (allVisibleSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleCustomNoteChange = (studentId: string, value: string) => {
    setCustomStudentNotes((prev) => ({
      ...prev,
      [studentId]: value,
    }));
    // Auto-select student if note is typed and currently unchecked
    if (value.trim() && !selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    }
  };

  const filteredJournals = journals.filter((j) => {
    const matchBranch = allowedBranch ? j.branch === allowedBranch : true;
    const matchSearch =
      j.topic.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase()) ||
      j.studentName.toLowerCase().includes(search.toLowerCase());

    const matchClass = classFilter === "ALL" ? true : j.className === classFilter;
    const matchStudent = studentFilter === "ALL" ? true : j.studentName === studentFilter;

    const currentProgType = isMembaca ? "MEMBACA" : "MATEMATIKA";
    const matchProgram = j.programType
      ? j.programType === currentProgType
      : (() => {
          const st = students.find((s) => s.name.toLowerCase() === j.studentName.toLowerCase());
          return isMembaca
            ? (st as any)?.programType === "MEMBACA"
            : (st as any)?.programType !== "MEMBACA";
        })();

    return matchBranch && matchSearch && matchClass && matchStudent && matchProgram;
  });

  const executeSubmitAdd = () => {
    const selectedStudents = scopedStudents.filter((s) => selectedStudentIds.includes(s.id));
    if (selectedStudents.length === 0) return;

    const defaultContent = form.content.trim();

    const journalsToCreate = selectedStudents.map((st) => {
      const customNote = customStudentNotes[st.id]?.trim();
      // If individual custom note is filled, use it; otherwise fallback to general evaluation note
      const finalContent = customNote ? customNote : defaultContent;

      return {
        studentId: st.id,
        studentName: st.name,
        className: st.className || form.className || "Kelas A",
        branch: (st.branch || form.branch) as "Singkut" | "Bangko",
        topic: form.topic.trim(),
        content: finalContent,
        teacher: form.teacher.trim() || currentUserName || "Kak Guru",
        date: form.date,
        programType: isMembaca ? ("MEMBACA" as const) : ("MATEMATIKA" as const),
      };
    });

    addJournalsBulk(journalsToCreate);
    setIsAddOpen(false);

    if (selectedStudents.length === 1) {
      showToast(`Jurnal harian berhasil disimpan untuk ${selectedStudents[0].name}!`);
    } else {
      showToast(`Jurnal harian berhasil disimpan sekaligus untuk ${selectedStudents.length} siswa!`);
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert("Silakan pilih minimal 1 siswa untuk menyimpan jurnal.");
      return;
    }

    if (!form.topic.trim()) {
      alert("Silakan isi Materi / Topik Pembahasan.");
      return;
    }

    const defaultContent = form.content.trim();
    const hasIncompleteStudent = selectedStudentIds.some((id) => {
      const customNote = customStudentNotes[id]?.trim();
      return !customNote && !defaultContent;
    });

    if (hasIncompleteStudent) {
      alert("Silakan isi Catatan Evaluasi Umum Kelas (Default) atau isi catatan khusus untuk setiap siswa terpilih.");
      return;
    }

    const customCount = selectedStudentIds.filter((id) => customStudentNotes[id]?.trim()).length;

    setConfirmModalConfig({
      isOpen: true,
      title: "Konfirmasi Simpan Jurnal Guru",
      message: (
        <div className="space-y-2">
          <p>
            Apakah Anda yakin ingin menyimpan jurnal harian untuk{" "}
            <strong>{selectedStudentIds.length} siswa terpilih</strong>?
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Materi: <strong>{form.topic}</strong>
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Pengajar: <strong>{form.teacher}</strong> • Tanggal: <strong>{form.date}</strong>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
              {customCount > 0
                ? `${customCount} siswa dengan catatan khusus tersendiri, ${selectedStudentIds.length - customCount} siswa menggunakan catatan umum kelas.`
                : "Semua siswa terpilih akan menggunakan catatan evaluasi umum kelas."}
            </p>
          </div>
        </div>
      ),
      confirmText: "Ya, Simpan Jurnal",
      variant: "success",
      onConfirm: () => {
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        executeSubmitAdd();
      },
    });
  };

  const handleSendWA = (j: JournalItem) => {
    const brandName = (j.programType === "MEMBACA" || isMembaca) ? "Rumah Belajar / Les Membaca" : "Mathfingers";
    const text = encodeURIComponent(
      `Halo Orang Tua dari ${j.studentName},\n\nBerikut catatan jurnal guru les ${brandName} (${j.className}):\nMateri: ${j.topic}\n\n"${j.content}"\n\nPengajar: ${j.teacher}\nLes ${brandName} Cabang ${j.branch}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header (Matches Image 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isMembaca ? "Catatan Jurnal Guru (Les Membaca)" : "Catatan Jurnal Guru (Les Matematika)"}
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isMembaca ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
              {isMembaca ? "📖 Les Membaca" : "🔢 Les Matematika"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input satu kali jurnal untuk semua siswa aktif yang hadir secara bersamaan berdasarkan hari atau kelompok kelas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Buat Jurnal Harian Kelas
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-xl shadow-emerald-600/30 animate-in fade-in-0 slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0f1a36] p-3.5 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari materi jurnal, catatan, atau nama siswa..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CustomSelect
            value={classFilter}
            onChange={setClassFilter}
            size="md"
            options={[
              { value: "ALL", label: "Semua Kelas" },
              ...scopedClasses.map((c) => ({
                value: c.name,
                label: c.name,
              })),
            ]}
          />

          <CustomSelect
            value={studentFilter}
            onChange={setStudentFilter}
            size="md"
            className="min-w-[170px]"
            options={[
              { value: "ALL", label: "Semua Siswa" },
              ...scopedStudents.map((s) => ({
                value: s.name,
                label: s.name,
              })),
            ]}
          />
        </div>
      </div>

      {/* Date Pill */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-xs font-extrabold text-slate-800 dark:text-slate-200 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
        </div>
      </div>

      {/* 2-Column Grid of Jurnal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJournals.map((j) => (
          <div
            key={j.id}
            className="bg-white dark:bg-[#0f1a36] rounded-3xl p-6 border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3.5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Header: Name, Class Badge, Actions */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {j.studentName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                    {j.className}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendWA(j)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    title="Kirim ke WhatsApp Wali"
                  >
                    <Send className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Kirim
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmModalConfig({
                        isOpen: true,
                        title: "Konfirmasi Hapus Catatan Jurnal",
                        message: (
                          <div className="space-y-2">
                            <p>
                              Apakah Anda yakin ingin menghapus catatan jurnal untuk siswa{" "}
                              <strong>{j.studentName}</strong>?
                            </p>
                            <p className="text-[11px] text-rose-500 font-semibold">
                              Tindakan ini tidak dapat dibatalkan.
                            </p>
                          </div>
                        ),
                        confirmText: "Ya, Hapus Jurnal",
                        variant: "danger",
                        onConfirm: () => {
                          deleteJournal(j.id);
                          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
                          showToast(`Catatan jurnal siswa "${j.studentName}" berhasil dihapus.`);
                        },
                      });
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Jurnal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Topic Header */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Materi: {j.topic}</span>
              </div>

              {/* Note Content */}
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{j.content}&rdquo;
              </div>
            </div>

            {/* Footer: Teacher Name & Ref Code */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Tutor: {j.teacher}</span>
              </div>
              <span className="text-[10px] text-slate-400">ID #{j.id.slice(0, 6)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Jurnal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[92vh] flex flex-col my-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                  Buat Jurnal Harian Kelas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Input materi kelas untuk semua siswa sekaligus &amp; sesuaikan per anak jika diperlukan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs mt-2">
              {/* Row 1: Tanggal & Nama Pengajar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    TANGGAL PERTEMUAN *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    NAMA PENGAJAR
                  </label>
                  <input
                    type="text"
                    required
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                    placeholder="Kak Guru"
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Materi / Topik Pembahasan */}
              <div>
                <label className="block text-[11px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  MATERI / TOPIK PEMBAHASAN *
                </label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder={isMembaca ? "Misal: Kelancaran Membaca Suku Kata" : "Misal: Penjumlahan Teman Kecil (+4, +3)"}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Row 3: Catatan Evaluasi Umum Kelas (Default) */}
              <div>
                <label className="block text-[11px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  CATATAN EVALUASI UMUM KELAS (DEFAULT)
                </label>
                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Misal: Sesi melatih reflek jari berjalan lancar. Ananda semua mampu mempraktikkan gerakan lipat jari dengan baik."
                  className="w-full p-3.5 bg-slate-50/70 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Catatan ini akan dipakai untuk siswa terpilih yang kolom catatan khususnya dikosongkan.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-800 my-4" />

              {/* Row 4: Siswa Yang Terlibat Header & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-slate-800 dark:text-slate-200">
                    SISWA YANG TERLIBAT
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    {selectedStudentIds.length} Terpilih
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Class Filter */}
                  <select
                    value={modalClassFilter}
                    onChange={(e) => setModalClassFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="ALL">Semua Kelas</option>
                    {scopedClasses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Search */}
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Cari nama..."
                    className="w-32 sm:w-36 px-3 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  {/* Toggle Select All */}
                  <button
                    type="button"
                    onClick={toggleSelectAllVisible}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    PILIH / BATAL SEMUA
                  </button>
                </div>
              </div>

              {/* Row 5: Scrollable Student Cards List */}
              <div className="border border-slate-300 dark:border-slate-700/80 rounded-2xl p-3 sm:p-4 max-h-[320px] overflow-y-auto space-y-3 bg-white dark:bg-[#0b1329]/40">
                {visibleModalStudents.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium">
                    Tidak ada siswa yang sesuai dengan filter pencarian.
                  </div>
                ) : (
                  visibleModalStudents.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    const customVal = customStudentNotes[st.id] || "";

                    return (
                      <div
                        key={st.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isChecked
                            ? "bg-slate-50/60 dark:bg-[#0f1a36] border-slate-200 dark:border-[#1d2d5a]"
                            : "bg-white/40 dark:bg-[#0b1329]/30 border-slate-100 dark:border-slate-800/60 opacity-60"
                        }`}
                      >
                        {/* Row 1: Checkbox + Name on Left, Badge + Level on Right */}
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                          <button
                            type="button"
                            onClick={() => toggleStudent(st.id)}
                            className="flex items-center gap-2.5 cursor-pointer text-left group"
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                                isChecked
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-emerald-400"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="font-extrabold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100">
                              {st.name}
                            </span>
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border border-emerald-400 dark:border-emerald-700/80 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                              {st.className || "CLASS"}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Level: {st.levelCurriculum || "Level Dasar: Pengenalan Simbol Jari"}
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Custom Note input */}
                        <input
                          type="text"
                          value={customVal}
                          onChange={(e) => handleCustomNoteChange(st.id, e.target.value)}
                          placeholder="Tulis catatan khusus untuk anak ini saja (Opsional)..."
                          className="w-full px-3.5 py-2 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={selectedStudentIds.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-xs shadow-emerald-500/20 text-white font-bold cursor-pointer transition-all text-xs"
                >
                  Simpan Jurnal {selectedStudentIds.length > 0 ? `(${selectedStudentIds.length} Siswa)` : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        cancelText={confirmModalConfig.cancelText}
        variant={confirmModalConfig.variant}
        isLoading={confirmModalConfig.isLoading}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function JurnalGuruPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat jurnal guru...</div>}>
      <JurnalGuruContent />
    </Suspense>
  );
}
