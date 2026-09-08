"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  Send,
  Plus,
  Users,
  Camera,
  QrCode,
  AlertTriangle,
  FileText,
  Filter,
  Edit2,
  Trash2,
  Download,
  Printer,
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkles,
  Save,
  CheckCheck,
  Loader2,
  MessageSquare,
  MapPin,
  TrendingUp,
  Layers,
  BookOpen,
} from "lucide-react";
import jsQR from "jsqr";
import { useAppStore, AttendanceItem } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

function AbsensiContent() {
  const searchParams = useSearchParams();
  const { isSuperAdmin, allowedBranch } = useCurrentUser();
  const {
    students,
    classes,
    attendances,
    setAttendance,
    batchSetAttendance,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    branches,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"HARI_INI" | "REKAP">("HARI_INI");
  const [selectedDate, setSelectedDate] = useState("2026-09-06");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"A-Z" | "Z-A">("A-Z");
  const [selectedIds, setSelectedIds] = useState<string[]>(students.map((s) => s.id));
  const [notesState, setNotesState] = useState<{ [id: string]: string }>({});

  // Quick Note & Status Menu State
  const [activeNoteStudent, setActiveNoteStudent] = useState<{ id: string; name: string } | null>(null);
  const [noteInputText, setNoteInputText] = useState("");
  const [statusMenuStudentId, setStatusMenuStudentId] = useState<string | null>(null);

  // Save State & Toast Feedback
  const [lastSavedTime, setLastSavedTime] = useState<string | null>("12:00 WIB");
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ message: string; count: number } | null>(null);

  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // QR Scanner Modal State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerInputCode, setScannerInputCode] = useState("");
  const [scanResult, setScanResult] = useState<{
    type: "SUCCESS" | "WARNING_SCHEDULE" | "ALREADY_PRESENT" | "NOT_FOUND";
    student?: StudentItem;
    message: string;
    scheduleInfo?: string;
  } | null>(null);

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Rekap & History State
  const [rekapBranchFilter, setRekapBranchFilter] = useState(allowedBranch || "ALL");
  const [rekapClassFilter, setRekapClassFilter] = useState("ALL");
  const [rekapStatusFilter, setRekapStatusFilter] = useState("ALL");
  const [rekapSearch, setRekapSearch] = useState("");
  const [rekapViewMode, setRekapViewMode] = useState<"LOG" | "PER_SISWA">("LOG");
  const [selectedSessionDate, setSelectedSessionDate] = useState<string | null>(null);
  const [showSessionDetailModal, setShowSessionDetailModal] = useState(false);

  useEffect(() => {
    if (allowedBranch) {
      setRekapBranchFilter(allowedBranch);
    }
  }, [allowedBranch]);

  // CRUD Modal State for History / Rekap
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAttendanceKey, setEditingAttendanceKey] = useState<string | null>(null);

  const [crudForm, setCrudForm] = useState<AttendanceItem>({
    studentId: "",
    studentName: "",
    studentCode: "",
    className: "",
    branch: "Singkut",
    date: selectedDate,
    time: "14:00 WIB",
    status: "HADIR",
    method: "MANUAL",
    note: "",
  });

  // Automatically open scanner if URL query contains ?scan=true or scanId
  useEffect(() => {
    if (searchParams.get("scan") === "true") {
      setShowScannerModal(true);
    }
    const scanId = searchParams.get("scanId");
    if (scanId) {
      const found = students.find((s) => s.id === scanId);
      if (found) {
        setShowScannerModal(true);
        handleProcessQrCode(found.studentCode);
      }
    }
  }, [searchParams, students]);

  // Helper: Get Day Name in Indonesian from YYYY-MM-DD
  const getDayNameIndonesian = (dateStr: string) => {
    const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  // Helper: Format full Indonesian date (e.g. "Minggu, 6 September 2026")
  const formatIndonesianFullDate = (dateStr: string) => {
    try {
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dayName = days[d.getDay()];
      const dateNum = d.getDate();
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      return `${dayName}, ${dateNum} ${monthName} ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Helper: Find class schedule for a student
  const getStudentClassSchedule = (className: string, branch: string) => {
    const found = classes.find(
      (c) =>
        c.name.toLowerCase() === className.toLowerCase() &&
        c.branch.toLowerCase() === branch.toLowerCase()
    );
    return found ? { days: found.days, time: found.time } : { days: "Sabtu & Ahad", time: "14:00 - 15:30" };
  };

  // Helper: Verify if date matches class days
  const isDateMatchingSchedule = (dateStr: string, scheduleDays: string) => {
    const dayName = getDayNameIndonesian(dateStr);
    return scheduleDays.toLowerCase().includes(dayName.toLowerCase());
  };

  // Process Scanned QR Code
  const handleProcessQrCode = (rawPayload: string) => {
    setScanResult(null);
    if (!rawPayload.trim()) return;

    let targetCode = rawPayload.trim();
    let targetId = "";

    // Parse JSON payload if present
    try {
      if (rawPayload.startsWith("{") && rawPayload.endsWith("}")) {
        const parsed = JSON.parse(rawPayload);
        targetCode = parsed.code || targetCode;
        targetId = parsed.studentId || "";
      } else if (rawPayload.startsWith("MF-QR:")) {
        const parts = rawPayload.split(":");
        targetId = parts[1] || "";
        targetCode = parts[2] || targetCode;
      } else if (rawPayload.startsWith("MF-")) {
        targetCode = rawPayload.replace("MF-", "").trim();
      }
    } catch {
      // fallback to literal string
    }

    // Find student
    const student = students.find(
      (s) =>
        (targetId && s.id === targetId) ||
        s.studentCode === targetCode ||
        s.studentCode === targetCode.replace(/^#/, "") ||
        s.name.toLowerCase() === targetCode.toLowerCase()
    );

    if (!student) {
      setScanResult({
        type: "NOT_FOUND",
        message: `Kartu QR dengan kode "${targetCode}" tidak ditemukan di database siswa.`,
      });
      return;
    }

    if (allowedBranch && student.branch !== allowedBranch) {
      setScanResult({
        type: "NOT_FOUND",
        message: `Siswa "${student.name}" terdaftar di Cabang ${student.branch}. Presensi hanya dapat diproses untuk Cabang ${allowedBranch}.`,
      });
      return;
    }

    const schedule = getStudentClassSchedule(student.className, student.branch);
    const dayToday = getDayNameIndonesian(selectedDate);
    const isScheduleMatch = isDateMatchingSchedule(selectedDate, schedule.days);

    // Check if already checked-in today
    const existingKey = `${student.id}_${selectedDate}`;
    const existing = attendances[existingKey];
    if (existing && existing.status === "HADIR" && existing.method === "QR_SCAN") {
      setScanResult({
        type: "ALREADY_PRESENT",
        student,
        message: `${student.name} sudah melakukan absensi QR hari ini pada ${existing.time || "pukul 14:00 WIB"}.`,
        scheduleInfo: `${schedule.days} • ${schedule.time}`,
      });
      return;
    }

    // Check schedule match
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    if (!isScheduleMatch) {
      setScanResult({
        type: "WARNING_SCHEDULE",
        student,
        message: `Perhatian: Hari ini adalah hari ${dayToday}, sedangkan jadwal reguler kelas ${student.className} adalah [${schedule.days}].`,
        scheduleInfo: `${schedule.days} • ${schedule.time}`,
      });
      return;
    }

    // Success Check-in!
    setAttendance(
      student.id,
      selectedDate,
      "HADIR",
      "Scan QR Presensi berhasil",
      currentTime,
      "QR_SCAN"
    );

    setScanResult({
      type: "SUCCESS",
      student,
      message: `Presensi Berhasil! ${student.name} tercatat HADIR pada ${currentTime} sesuai jadwal.`,
      scheduleInfo: `${schedule.days} • ${schedule.time}`,
    });

    setScannerInputCode("");
  };

  // Force record attendance when schedule warning is displayed
  const handleForceConfirmAttendance = (student: StudentItem) => {
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    setAttendance(
      student.id,
      selectedDate,
      "HADIR",
      `Absensi Khusus/Pengganti (Sesi ${getDayNameIndonesian(selectedDate)})`,
      currentTime,
      "QR_SCAN"
    );

    setScanResult({
      type: "SUCCESS",
      student,
      message: `Presensi Khusus Disetujui! ${student.name} tercatat HADIR pada ${currentTime}.`,
    });
  };

  // Camera Scanner Loop
  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    if (showScannerModal && isCameraActive && videoRef.current && canvasRef.current) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }

          const scanLoop = () => {
            if (videoRef.current && canvasRef.current && isCameraActive) {
              const video = videoRef.current;
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");

              if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: "dontInvert",
                });

                if (code && code.data) {
                  handleProcessQrCode(code.data);
                  setIsCameraActive(false);
                  return;
                }
              }
            }
            animationFrameId = requestAnimationFrame(scanLoop);
          };

          animationFrameId = requestAnimationFrame(scanLoop);
        })
        .catch((err) => {
          setCameraError("Kamera tidak dapat diakses atau tidak memiliki izin browser.");
          setIsCameraActive(false);
        });
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [showScannerModal, isCameraActive]);

  const currentProgram = searchParams?.get("program");
  const isMembacaProgram = currentProgram === "MEMBACA";

  // Filter students for today list
  const branchScopedStudents = (allowedBranch
    ? students.filter((s) => s.branch === allowedBranch)
    : students
  ).filter((s) =>
    isMembacaProgram
      ? (s as any).programType === "MEMBACA"
      : (s as any).programType !== "MEMBACA"
  );
  const branchScopedClasses = (allowedBranch
    ? classes.filter((c) => c.branch === allowedBranch)
    : classes
  ).filter((c) =>
    isMembacaProgram
      ? (c as any).programType === "MEMBACA"
      : (c as any).programType !== "MEMBACA"
  );

  const classList = [
    { name: "Semua Kelas", count: branchScopedStudents.length, value: "ALL" },
    ...branchScopedClasses.map((c) => ({
      name: c.name,
      count: branchScopedStudents.filter((s) => s.className === c.name).length,
      value: c.name,
    })),
  ];

  const filteredStudents = branchScopedStudents
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.includes(searchTerm) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === "ALL" ? true : s.className === selectedClass;
      return matchSearch && matchClass;
    })
    .sort((a, b) => {
      if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const getStatus = (studentId: string): "HADIR" | "IZIN" | "SAKIT" | "ABSEN" => {
    const record = attendances[`${studentId}_${selectedDate}`];
    return record?.status || "HADIR";
  };

  const handleStatusChange = (
    studentId: string,
    status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN"
  ) => {
    setAttendance(studentId, selectedDate, status, notesState[studentId]);
    setStatusMenuStudentId(null);
  };

  const handleCycleStatus = (studentId: string) => {
    const current = getStatus(studentId);
    let next: "HADIR" | "IZIN" | "SAKIT" | "ABSEN" = "HADIR";
    if (current === "HADIR") next = "IZIN";
    else if (current === "IZIN") next = "SAKIT";
    else if (current === "SAKIT") next = "ABSEN";
    else if (current === "ABSEN") next = "HADIR";

    handleStatusChange(studentId, next);
  };

  const handleAddQuickNote = (studentId: string, text: string) => {
    const current = notesState[studentId] || "";
    const updated = current ? `${current}, ${text}` : text;
    setNotesState((prev) => ({ ...prev, [studentId]: updated }));
    setAttendance(studentId, selectedDate, getStatus(studentId), updated);
  };

  const visibleStudentIds = filteredStudents.map((s) => s.id);
  const selectedVisibleIds = selectedIds.filter((id) => visibleStudentIds.includes(id));
  const isAllVisibleSelected =
    visibleStudentIds.length > 0 && selectedVisibleIds.length === visibleStudentIds.length;

  const handleSelectAll = () => {
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleStudentIds])));
  };

  const handleClearSelection = () => {
    setSelectedIds((prev) => prev.filter((id) => !visibleStudentIds.includes(id)));
  };

  const handleMarkAllHadir = () => {
    batchSetAttendance(selectedDate, "HADIR");
    const formattedTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
      " WIB";
    setLastSavedTime(formattedTime);
    setSaveToast({
      message: `Seluruh siswa (${students.length}) berhasil ditandai HADIR untuk tanggal ${selectedDate}!`,
      count: students.length,
    });
  };

  // Today's summary stats for current filtered view
  const todayHadirCount = filteredStudents.filter((s) => getStatus(s.id) === "HADIR").length;
  const todayIzinCount = filteredStudents.filter(
    (s) => getStatus(s.id) === "IZIN" || getStatus(s.id) === "SAKIT"
  ).length;
  const todayAbsenCount = filteredStudents.filter((s) => getStatus(s.id) === "ABSEN").length;

  const handleSaveTodayAttendance = () => {
    setIsSaving(true);
    const count = filteredStudents.length;
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    filteredStudents.forEach((st) => {
      const status = getStatus(st.id);
      const note =
        notesState[st.id] !== undefined
          ? notesState[st.id]
          : attendances[`${st.id}_${selectedDate}`]?.note || "";
      const existingRec = attendances[`${st.id}_${selectedDate}`];
      setAttendance(
        st.id,
        selectedDate,
        status,
        note,
        existingRec?.time || currentTime,
        (existingRec?.method as "QR_SCAN" | "MANUAL") || "MANUAL"
      );
    });

    const formattedTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
      " WIB";
    setLastSavedTime(formattedTime);
    setIsSaving(false);
    setSaveToast({
      message: `Presensi ${count} siswa untuk sesi tanggal ${selectedDate} (${getDayNameIndonesian(
        selectedDate
      )}) berhasil disimpan ke sistem!`,
      count,
    });
  };

  const handleBatchSetSelectedStatus = (status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN") => {
    if (selectedVisibleIds.length === 0) return;
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    selectedVisibleIds.forEach((id) => {
      const existingRec = attendances[`${id}_${selectedDate}`];
      setAttendance(
        id,
        selectedDate,
        status,
        notesState[id],
        existingRec?.time || currentTime,
        (existingRec?.method as "QR_SCAN" | "MANUAL") || "MANUAL"
      );
    });
    const formattedTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
      " WIB";
    setLastSavedTime(formattedTime);
    setSaveToast({
      message: `${selectedVisibleIds.length} siswa terpilih berhasil ditandai sebagai "${status}" dan disimpan.`,
      count: selectedVisibleIds.length,
    });
  };

  const handleSaveSingleNote = (studentId: string) => {
    const st = students.find((s) => s.id === studentId);
    const status = getStatus(studentId);
    const note = notesState[studentId] || "";
    const existingRec = attendances[`${studentId}_${selectedDate}`];
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    setAttendance(
      studentId,
      selectedDate,
      status,
      note,
      existingRec?.time || currentTime,
      (existingRec?.method as "QR_SCAN" | "MANUAL") || "MANUAL"
    );
    setSaveToast({
      message: `Catatan presensi untuk ${st?.name || "siswa"} berhasil disimpan!`,
      count: 1,
    });
  };

  // Convert Attendances Record into array for Rekap & Riwayat Table (scoped by program & branch)
  const allAttendanceArray = Object.entries(attendances)
    .map(([key, item]) => ({
      key,
      ...item,
    }))
    .filter((item) => {
      const st = students.find((s) => s.id === item.studentId || s.name === item.studentName);
      return isMembacaProgram
        ? (st as any)?.programType === "MEMBACA"
        : (st as any)?.programType !== "MEMBACA";
    })
    .filter((item) => {
      if (allowedBranch && item.branch !== allowedBranch) return false;
      return true;
    });

  // Scoped Rekap Records by Class Filter
  const scopedRekapRecords = allAttendanceArray.filter((item) => {
    if (rekapClassFilter !== "ALL" && item.className !== rekapClassFilter) return false;
    return true;
  });

  // Rekap Stats
  const totalRekapCount = allAttendanceArray.length;
  const uniqueDatesCount = Array.from(new Set(scopedRekapRecords.map((a) => a.date))).length;
  const hadirCountInScope = scopedRekapRecords.filter((a) => a.status === "HADIR").length;
  const avgAttendancePercent =
    scopedRekapRecords.length > 0
      ? Math.round((hadirCountInScope / scopedRekapRecords.length) * 100)
      : 100;

  // Unique session dates in descending order
  const sortedSessionDates = Array.from(new Set(scopedRekapRecords.map((a) => a.date))).sort(
    (a, b) => b.localeCompare(a)
  );

  // CRUD Handlers for Rekap
  const openAddRecord = () => {
    setCrudForm({
      studentId: students[0]?.id || "",
      studentName: students[0]?.name || "",
      studentCode: students[0]?.studentCode || "",
      className: students[0]?.className || "",
      branch: students[0]?.branch || "Singkut",
      date: selectedDate,
      time: "14:00 WIB",
      status: "HADIR",
      method: "MANUAL",
      note: "",
    });
    setShowAddModal(true);
  };

  const openEditRecord = (key: string, item: AttendanceItem) => {
    setEditingAttendanceKey(key);
    setCrudForm({ ...item });
    setShowEditModal(true);
  };

  const handleSaveAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === crudForm.studentId);
    addAttendanceRecord({
      ...crudForm,
      studentName: st?.name || crudForm.studentName,
      studentCode: st?.studentCode || crudForm.studentCode,
      className: st?.className || crudForm.className,
      branch: st?.branch || crudForm.branch,
    });
    setShowAddModal(false);
  };

  const handleSaveEditRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendanceKey) return;
    updateAttendanceRecord(editingAttendanceKey, {
      date: crudForm.date,
      time: crudForm.time,
      status: crudForm.status,
      note: crudForm.note,
    });
    setShowEditModal(false);
  };

  const handleDeleteRecord = (key: string, name?: string) => {
    if (confirm(`Hapus catatan kehadiran untuk ${name || "siswa ini"}?`)) {
      deleteAttendanceRecord(key);
    }
  };

  const handleDeleteSessionDate = (date: string) => {
    const sessionRecords = allAttendanceArray.filter((a) => a.date === date);
    if (sessionRecords.length === 0) return;
    if (
      confirm(
        `Hapus seluruh catatan presensi untuk sesi ${formatIndonesianFullDate(date)}? (${sessionRecords.length} data kehadiran siswa akan dihapus)`
      )
    ) {
      sessionRecords.forEach((r) => {
        deleteAttendanceRecord(r.key);
      });
      if (selectedSessionDate === date) {
        setSelectedSessionDate(null);
        setShowSessionDetailModal(false);
      }
      setSaveToast({
        message: `Presensi sesi ${date} berhasil dihapus.`,
        count: sessionRecords.length,
      });
    }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 pb-32 lg:pb-12 space-y-5 sm:space-y-6 max-w-[1400px] mx-auto relative">
      {/* Save Success Toast Banner */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full bg-white dark:bg-[#0f1a36] border-2 border-emerald-500 text-slate-900 dark:text-slate-100 p-4 rounded-2xl shadow-2xl flex items-start gap-3.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                Presensi Berhasil Disimpan
              </h4>
              <span className="text-[10px] text-slate-400">Tersimpan</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {saveToast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 -mt-1 cursor-pointer"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header with Mode Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isMembacaProgram ? "Absensi Siswa Les Membaca" : "Absensi Siswa Les Matematika"}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
              v3.3 Terpadu
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan harian, scanner QR presensi sesuai jadwal kelas, dan rekapitulasi riwayat kehadiran.
          </p>
        </div>

        {/* Action & Tab Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Scanner Launch Button - Icon Only Logo */}
          <button
            type="button"
            onClick={() => {
              setScanResult(null);
              setShowScannerModal(true);
            }}
            title="Scan QR Presensi"
            aria-label="Scan QR Presensi"
            className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center shrink-0"
          >
            <QrCode className="w-5 h-5 text-slate-950" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("HARI_INI")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "HARI_INI"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Pencatatan Hari Ini</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REKAP")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "REKAP"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat & Rekap Absensi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
              {totalRekapCount}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PENCATATAN HARI INI */}
      {/* ========================================================================= */}
      {activeTab === "HARI_INI" && (
        <div className="space-y-6">
          {/* Date Picker Bar */}
          <div className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Pilih Tanggal Sesi Bimbingan</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  Hari: {getDayNameIndonesian(selectedDate)}
                </span>
                {lastSavedTime && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                    • Terakhir disimpan: {lastSavedTime}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Siswa aktif terdaftar bimbingan matematika jaritmatika.
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={handleMarkAllHadir}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Tandai seluruh siswa hadir untuk sesi hari ini"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hadir Semua</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTodayAttendance}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 active:scale-95 text-white text-xs font-extrabold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                title="Simpan seluruh status presensi siswa tanggal ini ke database"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Simpan Presensi</span>
              </button>
            </div>
          </div>

          {/* Class Selection Filter Pills */}
          <div className="bg-white dark:bg-[#0f1a36] p-4 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                PILIH KELAS BIMBINGAN UNTUK MENGABSEN:
              </span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#1d2d5a] rounded-xl px-2.5 py-1 bg-slate-50 dark:bg-[#0b1329] cursor-pointer shadow-2xs"
              >
                {classList.map((cl, idx) => (
                  <option key={idx} value={cl.value}>
                    {cl.name} ({cl.count} Siswa)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {classList.map((cl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedClass(cl.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedClass === cl.value
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900"
                  }`}
                >
                  <span>{cl.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedClass === cl.value
                        ? "bg-white/20 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {cl.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="bg-white dark:bg-[#0f1a36] p-3 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-300 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              />
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="A-Z">Nama: A - Z</option>
              <option value="Z-A">Nama: Z - A</option>
            </select>
          </div>

          {/* Unified Attendance Card Container (Desktop matches Screenshot 1, Mobile/Tablet touch cards) */}
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200/90 dark:border-[#1d2d5a] shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
            {/* Action Bar Header */}
            <div className="p-3.5 sm:p-5 space-y-3 bg-white dark:bg-[#0f1a36]">
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={() => {
                      if (isAllVisibleSelected) {
                        handleClearSelection();
                      } else {
                        handleSelectAll();
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {isAllVisibleSelected ? "Batalkan Semua" : "Pilih Semua"}
                  </span>
                </label>

                <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 text-right">
                  {selectedVisibleIds.length} dari {filteredStudents.length} Siswa Dicentang
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-[#1d2d5a]/80 flex-wrap">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-[#1d2d5a] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-400 dark:border-emerald-800 bg-white dark:bg-[#0f1a36] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Hapus Centang
                </button>

                {selectedVisibleIds.length > 0 && (
                  <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                    <span className="text-[10px] text-slate-400 font-medium">Ubah Terpilih:</span>
                    <button
                      type="button"
                      onClick={() => handleBatchSetSelectedStatus("HADIR")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-black text-[10px] cursor-pointer"
                    >
                      + Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchSetSelectedStatus("IZIN")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] cursor-pointer"
                    >
                      + Ijin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchSetSelectedStatus("SAKIT")}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] cursor-pointer"
                    >
                      + Sakit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchSetSelectedStatus("ABSEN")}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-black text-[10px] cursor-pointer"
                    >
                      + Ghaib
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Student Rows */}
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                Tidak ada data siswa yang cocok dengan filter kelas atau pencarian.
              </div>
            ) : (
              filteredStudents.map((st, idx) => {
                const currentStatus = getStatus(st.id); // "HADIR" | "IZIN" | "SAKIT" | "ABSEN"
                const record = attendances[`${st.id}_${selectedDate}`];
                const currentNote =
                  notesState[st.id] !== undefined ? notesState[st.id] : record?.note || "";
                const isSelected = selectedIds.includes(st.id);
                const isStatusMenuOpen = statusMenuStudentId === st.id;

                // Format short level name e.g. "LEVEL DASAR", "LEVEL TERAMPIL", etc.
                const rawLevel = st.levelCurriculum || "";
                const shortLevel = rawLevel.toUpperCase().includes("DASAR")
                  ? "LEVEL DASAR"
                  : rawLevel.toUpperCase().includes("TERAMPIL")
                  ? "LEVEL TERAMPIL"
                  : rawLevel.toUpperCase().includes("MAHIR")
                  ? "LEVEL MAHIR"
                  : rawLevel.toUpperCase().includes("PRA")
                  ? "PRA-DASAR"
                  : rawLevel.split(":")[0].trim().toUpperCase() || "LEVEL DASAR";

                return (
                  <div
                    key={st.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-emerald-50/20 dark:bg-emerald-950/15"
                        : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* 1. DESKTOP VIEW (hidden lg:flex) - Exactly matching Screenshot 1 */}
                    <div className="hidden lg:flex items-center justify-between gap-4 p-4">
                      {/* Left Column */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedIds((prev) =>
                              prev.includes(st.id)
                                ? prev.filter((id) => id !== st.id)
                                : [...prev, st.id]
                            );
                          }}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                        />

                        {/* Green number badge */}
                        <span className="w-6 h-6 rounded-md border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div className="space-y-1 min-w-0 flex-1">
                          {/* Badges + Student Name + Code + Wali in structured line */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold border border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/40 uppercase tracking-wide">
                              {shortLevel}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/40 flex items-center gap-1 uppercase">
                              <span>🏫</span>
                              <span>{st.className}</span>
                            </span>
                            {record?.method === "QR_SCAN" && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-[#1d2d5a] flex items-center gap-1">
                                <QrCode className="w-3 h-3" />
                                <span>QR {record.time || "14:00"}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {st.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1d2d5a]">
                              #{st.studentCode}
                            </span>
                            {st.parentName && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Wali: {st.parentName} {st.parentWhatsapp ? `(${st.parentWhatsapp})` : ""}
                              </span>
                            )}
                          </div>

                          {/* Quick note shortcuts row below student */}
                          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              Pintasan Catatan:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddQuickNote(st.id, "Izin Makan")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                            >
                              + Izin Makan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddQuickNote(st.id, "Hadir Kembali")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                            >
                              + Hadir Kembali
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddQuickNote(st.id, "Izin Sakit")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                            >
                              + Izin Sakit
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Segmented Buttons + Inline Note Input */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Segmented 3-Status Selector */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-2xl">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, "HADIR")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "HADIR"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Hadir</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, "IZIN")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "IZIN" || currentStatus === "SAKIT"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Izin</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, "ABSEN")}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "ABSEN"
                                ? "bg-slate-700 dark:bg-slate-600 text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Absen</span>
                          </button>
                        </div>

                        {/* Inline Note Input + Send Button */}
                        <div className="flex items-center gap-1.5 w-64">
                          <input
                            type="text"
                            value={notesState[st.id] !== undefined ? notesState[st.id] : record?.note || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNotesState((prev) => ({ ...prev, [st.id]: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveSingleNote(st.id);
                              }
                            }}
                            placeholder="Catatan..."
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveSingleNote(st.id)}
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors shrink-0"
                            title="Simpan Catatan"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. MOBILE & TABLET VIEW (lg:hidden) - Touch-friendly card with Cycle Button */}
                    <div className="lg:hidden p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
                        {/* Left Column */}
                        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds((prev) =>
                                prev.includes(st.id)
                                  ? prev.filter((id) => id !== st.id)
                                  : [...prev, st.id]
                              );
                            }}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0 mt-1"
                          />

                          <div className="space-y-1 min-w-0 flex-1">
                            {/* Badges Row */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide whitespace-nowrap">
                                {shortLevel}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5f3ff] dark:bg-purple-950/70 text-[#7c3aed] dark:text-purple-300 border border-[#ddd6fe] dark:border-purple-800/80 flex items-center gap-1 uppercase whitespace-nowrap">
                                <span>🏫</span>
                                <span>{st.className}</span>
                              </span>
                              {record?.method === "QR_SCAN" && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-[#1d2d5a] flex items-center gap-1 whitespace-nowrap">
                                  <QrCode className="w-3 h-3" />
                                  <span>QR {record.time || "14:00"}</span>
                                </span>
                              )}
                            </div>

                            {/* Number Box + Student Name */}
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div
                                title={st.name}
                                className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm md:text-base truncate leading-tight"
                              >
                                {st.name}
                              </div>
                            </div>

                            {/* Student Code tag + Note preview */}
                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1d2d5a] inline-flex items-center">
                                #{st.studentCode}
                              </span>
                              {currentNote && (
                                <span
                                  title={currentNote}
                                  className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 italic truncate max-w-[130px] sm:max-w-[220px]"
                                >
                                  💬 {currentNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Note/Chat button + Circular Status Button */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoteStudent({ id: st.id, name: st.name });
                              setNoteInputText(currentNote);
                            }}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                              currentNote
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-slate-300 dark:border-[#1d2d5a] shadow-xs"
                                : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/90 dark:border-[#1d2d5a] hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800"
                            }`}
                            title={currentNote ? `Catatan: ${currentNote}` : "Tulis Catatan Presensi"}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCycleStatus(st.id)}
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center shadow-xs shrink-0 transition-transform active:scale-90 cursor-pointer select-none ${
                              currentStatus === "HADIR"
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white ring-2 ring-emerald-500/20"
                                : currentStatus === "IZIN"
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/20"
                                : currentStatus === "SAKIT"
                                ? "bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-500/20"
                                : "bg-slate-700 hover:bg-slate-800 text-white ring-2 ring-slate-500/20"
                            }`}
                            title="Klik untuk ganti status: Hadir ➜ Ijin ➜ Sakit ➜ Ghaib"
                          >
                            {currentStatus === "HADIR" ? (
                              <>
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span className="text-[8px] font-black tracking-wider uppercase -mt-0.5">
                                  HADIR
                                </span>
                              </>
                            ) : currentStatus === "IZIN" ? (
                              <>
                                <Info className="w-4 h-4 stroke-[2.5]" />
                                <span className="text-[8px] font-black tracking-wider uppercase -mt-0.5">
                                  IJIN
                                </span>
                              </>
                            ) : currentStatus === "SAKIT" ? (
                              <>
                                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                                <span className="text-[8px] font-black tracking-wider uppercase -mt-0.5">
                                  SAKIT
                                </span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 stroke-[3]" />
                                <span className="text-[8px] font-black tracking-wider uppercase -mt-0.5">
                                  GHAIB
                                </span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setStatusMenuStudentId(isStatusMenuOpen ? null : st.id)
                            }
                            className="p-1 -ml-1 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                            title="Pilih status spesifik"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {isStatusMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 z-40 p-1.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xl flex flex-col gap-1 w-28 animate-in fade-in">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "HADIR")}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                              >
                                <span>✓ Hadir</span>
                                {currentStatus === "HADIR" && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "IZIN")}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                              >
                                <span>ℹ Ijin</span>
                                {currentStatus === "IZIN" && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "SAKIT")}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 cursor-pointer"
                              >
                                <span>🏥 Sakit</span>
                                {currentStatus === "SAKIT" && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, "ABSEN")}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <span>✕ Ghaib</span>
                                {currentStatus === "ABSEN" && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Attendance Confirmation & Save Action Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Ringkasan Presensi ({selectedDate}):
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  ✓ Hadir: {todayHadirCount}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  ⚠ Izin/Sakit: {todayIzinCount}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  ✕ Absen: {todayAbsenCount}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {lastSavedTime
                    ? `Terakhir disimpan pada ${lastSavedTime}. Seluruh data tersimpan aman di sistem.`
                    : `Klik tombol simpan untuk memfinalisasi dan menyimpan absensi ${filteredStudents.length} siswa hari ini.`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleSaveTodayAttendance}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 active:scale-98 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Simpan Seluruh Presensi ({filteredStudents.length} Siswa)</span>
              </button>
            </div>
          </div>

          {/* Mobile Floating Bottom Bar for Quick Thumb Save */}
          <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-[#0f1a36]/95 backdrop-blur-md border border-slate-200 dark:border-[#1d2d5a] shadow-xl flex items-center justify-between gap-2 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-800 dark:text-slate-200">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                ✓ {todayHadirCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                ⚠ {todayIzinCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                ✕ {todayAbsenCount}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveTodayAttendance}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 active:scale-95 text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Simpan Presensi</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RIWAYAT & REKAP ABSENSI (SESUAI GAMBAR 2) */}
      {/* ========================================================================= */}
      {activeTab === "REKAP" && (
        <div className="space-y-5 sm:space-y-6">
          {/* 1. Top Horizontal Class Selection Filter Bar */}
          <div className="bg-white dark:bg-[#0f1a36] p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>PILIH RIWAYAT & REKAP PER KELAS:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {/* All Classes Pill */}
              <button
                type="button"
                onClick={() => setRekapClassFilter("ALL")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                  rekapClassFilter === "ALL"
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-[#0f1a36] border border-emerald-300/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Semua Kelas ({allAttendanceArray.length} Total Absensi)</span>
              </button>

              {/* Dynamic Class Pills */}
              {branchScopedClasses.map((c) => {
                const count = allAttendanceArray.filter((a) => a.className === c.name).length;
                const isSelected = rekapClassFilter === c.name;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setRekapClassFilter(c.name)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white dark:bg-[#0f1a36] border border-emerald-300/70 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{c.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {count} Data
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Three Summary Metric Cards (Exact match with Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: TOTAL HARI LES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/90 dark:border-[#1d2d5a] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  TOTAL HARI LES
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                  {uniqueDatesCount} Hari
                </div>
              </div>
            </div>

            {/* Card 2: RATA-RATA KEHADIRAN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/90 dark:border-[#1d2d5a] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  RATA-RATA KEHADIRAN
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {avgAttendancePercent}%
                </div>
              </div>
            </div>

            {/* Card 3: TOTAL REKOR ABSENSI */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/90 dark:border-[#1d2d5a] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  TOTAL REKOR ABSENSI
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                  {scopedRekapRecords.length} Entri
                </div>
              </div>
            </div>
          </div>

          {/* 3. Two-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column: Riwayat Sesi Belajar (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between gap-2 px-1">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Riwayat Sesi Belajar
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
                  Klik Baris Untuk Detail
                </span>
              </div>

              <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                {sortedSessionDates.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a]">
                    Belum ada sesi presensi yang tercatat untuk kelas ini.
                  </div>
                ) : (
                  sortedSessionDates.map((date) => {
                    const sessionRecs = scopedRekapRecords.filter((a) => a.date === date);
                    const hCount = sessionRecs.filter((a) => a.status === "HADIR").length;
                    const iCount = sessionRecs.filter(
                      (a) => a.status === "IZIN" || a.status === "SAKIT"
                    ).length;
                    const aCount = sessionRecs.filter((a) => a.status === "ABSEN").length;

                    return (
                      <div
                        key={date}
                        onClick={() => {
                          setSelectedSessionDate(date);
                          setShowSessionDetailModal(true);
                        }}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {formatIndonesianFullDate(date)}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {date}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-black"
                            title={`${hCount} Hadir`}
                          >
                            {hCount}H
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-black"
                            title={`${iCount} Izin/Sakit`}
                          >
                            {iCount}I
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-black"
                            title={`${aCount} Absen`}
                          >
                            {aCount}A
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSessionDate(date);
                            }}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title={`Hapus seluruh sesi presensi ${date}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Rekap Kehadiran Siswa (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Rekap Kehadiran Siswa
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={rekapClassFilter}
                    onChange={(e) => setRekapClassFilter(e.target.value)}
                    className="text-xs font-bold border border-slate-200 dark:border-[#1d2d5a] rounded-xl px-2.5 py-1.5 bg-white dark:bg-[#0f1a36] text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs"
                  >
                    <option value="ALL">Semua Kelas</option>
                    {branchScopedClasses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={rekapSearch}
                      onChange={(e) => setRekapSearch(e.target.value)}
                      placeholder="Cari siswa..."
                      className="pl-8 pr-3 py-1.5 bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium w-36 sm:w-44 shadow-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={openAddRecord}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    title="Tambah Presensi Susulan"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Susulan</span>
                  </button>
                </div>
              </div>

              {/* Rekap Kehadiran Table Container */}
              <div className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200/80 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/80 dark:border-[#1d2d5a] bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">SISWA</th>
                        <th className="py-3 px-3 text-center">SESI</th>
                        <th className="py-3 px-3 text-center">H - I - A</th>
                        <th className="py-3 px-3">LAJU KEHADIRAN</th>
                        <th className="py-3 px-4 text-center">5 SESI TERAKHIR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {(() => {
                        const studentsForRekap = branchScopedStudents
                          .filter((st) => {
                            if (rekapClassFilter !== "ALL" && st.className !== rekapClassFilter) return false;
                            if (rekapSearch) {
                              const q = rekapSearch.toLowerCase();
                              const matchName = st.name.toLowerCase().includes(q);
                              const matchCode = st.studentCode.includes(q);
                              const matchParent = (st.parentName || "").toLowerCase().includes(q);
                              if (!matchName && !matchCode && !matchParent) return false;
                            }
                            return true;
                          })
                          .sort((a, b) => a.name.localeCompare(b.name));

                        if (studentsForRekap.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400">
                                Tidak ada siswa yang sesuai filter atau pencarian.
                              </td>
                            </tr>
                          );
                        }

                        return studentsForRekap.map((st) => {
                          const stRecords = allAttendanceArray.filter(
                            (a) =>
                              a.studentId === st.id ||
                              a.studentCode === st.studentCode ||
                              (a.studentName && a.studentName.toLowerCase() === st.name.toLowerCase())
                          );
                          const stHadir = stRecords.filter((a) => a.status === "HADIR").length;
                          const stIzin = stRecords.filter(
                            (a) => a.status === "IZIN" || a.status === "SAKIT"
                          ).length;
                          const stAbsen = stRecords.filter((a) => a.status === "ABSEN").length;
                          const stTotal = stRecords.length;
                          const rate =
                            stTotal > 0 ? Math.round((stHadir / stTotal) * 100) : 100;

                          // 5 recent session status dots
                          const dots = sortedSessionDates.slice(0, 5).map((date) => {
                            const rec = stRecords.find((r) => r.date === date);
                            return rec ? { date, status: rec.status } : null;
                          }).filter(Boolean);

                          return (
                            <tr
                              key={st.id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              {/* SISWA */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                                    {st.name}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                    #{st.studentCode}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                  Wali: {st.parentName || "-"}
                                </div>
                              </td>

                              {/* SESI */}
                              <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                                {stHadir}x
                              </td>

                              {/* H - I - A */}
                              <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                                {stHadir} / {stIzin} / {stAbsen}
                              </td>

                              {/* LAJU KEHADIRAN */}
                              <td className="py-3 px-3">
                                <div className="space-y-1">
                                  <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                                    {rate}%
                                  </div>
                                  <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${rate}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* 5 SESI TERAKHIR */}
                              <td className="py-3 px-4 text-center">
                                {dots.length === 0 ? (
                                  <span className="text-slate-400 font-bold text-xs">-</span>
                                ) : (
                                  <div className="flex items-center justify-center gap-1.5">
                                    {dots.map((d, dIdx) => (
                                      <span
                                        key={dIdx}
                                        title={`${d!.date}: ${d!.status}`}
                                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                          d!.status === "HADIR"
                                            ? "bg-emerald-500"
                                            : d!.status === "IZIN" || d!.status === "SAKIT"
                                            ? "bg-amber-500"
                                            : "bg-rose-500"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 0: DETAIL PRESENSI SESI BELAJAR (KLIK BARIS SESI) */}
      {/* ========================================================================= */}
      {showSessionDetailModal && selectedSessionDate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  Detail Presensi Sesi Belajar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatIndonesianFullDate(selectedSessionDate)} • {selectedSessionDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSessionDetailModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Stats Chips */}
            {(() => {
              const recs = allAttendanceArray.filter((a) => a.date === selectedSessionDate);
              const h = recs.filter((a) => a.status === "HADIR").length;
              const i = recs.filter((a) => a.status === "IZIN" || a.status === "SAKIT").length;
              const a = recs.filter((a) => a.status === "ABSEN").length;
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                    ✓ {h} Hadir
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800">
                    ⚠ {i} Izin/Sakit
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800">
                    ✕ {a} Absen
                  </span>
                  <span className="text-xs text-slate-400 ml-auto font-medium">
                    Total: {recs.length} Siswa
                  </span>
                </div>
              );
            })()}

            {/* Student Records List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-[#1d2d5a] rounded-2xl overflow-hidden">
              {(() => {
                const recs = allAttendanceArray.filter((a) => a.date === selectedSessionDate);
                if (recs.length === 0) {
                  return (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Tidak ada catatan presensi pada tanggal ini.
                    </div>
                  );
                }
                return recs.map((rec) => (
                  <div
                    key={rec.key}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                          {rec.studentName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          #{rec.studentCode}
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          {rec.className}
                        </span>
                        {rec.method === "QR_SCAN" && (
                          <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold border border-emerald-200 dark:border-emerald-800">
                            <QrCode className="w-2.5 h-2.5" />
                            QR
                          </span>
                        )}
                      </div>
                      {rec.note && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                          💬 {rec.note}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                          rec.status === "HADIR"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : rec.status === "IZIN"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : rec.status === "SAKIT"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        {rec.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rec.time || "-"}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1d2d5a]">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(selectedSessionDate);
                  setActiveTab("HARI_INI");
                  setShowSessionDetailModal(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Buka di Pencatatan Hari Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSessionDetailModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SCANNER QR PRESENSI REAL-TIME */}
      {/* ========================================================================= */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a] relative max-h-[95vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowScannerModal(false);
                setIsCameraActive(false);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Scan QR Presensi Sesuai Jadwal
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindai kartu ID siswa via kamera, scanner barcode USB, atau input kode siswa langsung.
              </p>
            </div>

            {/* Camera View / Video Element */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Scanner Targeting Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-emerald-500 rounded-2xl animate-pulse flex items-center justify-center">
                        <div className="w-full h-0.5 bg-emerald-600/80 shadow-lg shadow-red-500 animate-bounce" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-2 text-slate-400">
                    <QrCode className="w-12 h-12 text-slate-600 mx-auto stroke-1" />
                    <div className="text-xs font-semibold">Kamera Belum Aktif</div>
                    <button
                      type="button"
                      onClick={() => {
                        setCameraError(null);
                        setIsCameraActive(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white font-bold text-xs shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Aktifkan Kamera Scanner</span>
                    </button>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Alternative Input for Barcode Scanner Wedge / Manual Code */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessQrCode(scannerInputCode);
              }}
              className="space-y-2 pt-1"
            >
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Atau Tempel / Scan via Scanner Barcode USB:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={scannerInputCode}
                  onChange={(e) => setScannerInputCode(e.target.value)}
                  placeholder="Scan kartu atau ketik ID kode (contoh: 79000)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Proses
                </button>
              </div>
            </form>

            {/* Quick Test Simulator Button */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Simulasi Cepat Scan Siswa:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {students.slice(0, 4).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleProcessQrCode(st.studentCode)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-700 text-[11px] font-semibold transition-colors"
                  >
                    #{st.studentCode} {st.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Feedback Result Banner */}
            {scanResult && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                  scanResult.type === "SUCCESS"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-slate-200 dark:border-[#1d2d5a] text-emerald-950 dark:text-emerald-200"
                    : scanResult.type === "WARNING_SCHEDULE"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                    : scanResult.type === "ALREADY_PRESENT"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                    : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {scanResult.type === "SUCCESS" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : scanResult.type === "WARNING_SCHEDULE" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : scanResult.type === "ALREADY_PRESENT" ? (
                    <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <div className="font-extrabold text-sm">{scanResult.message}</div>
                    {scanResult.scheduleInfo && (
                      <div className="text-[11px] font-semibold opacity-90">
                        Jadwal Terdaftar: {scanResult.scheduleInfo}
                      </div>
                    )}
                  </div>
                </div>

                {/* If warning schedule, offer override button */}
                {scanResult.type === "WARNING_SCHEDULE" && scanResult.student && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleForceConfirmAttendance(scanResult.student!)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                    >
                      Izinkan Absen Sesi Pengganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanResult(null)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-300 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH PRESENSI SUSULAN / MANUAL (CRUD - CREATE) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Tambah Presensi Susulan
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={crudForm.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setCrudForm({
                      ...crudForm,
                      studentId: e.target.value,
                      studentName: st?.name || "",
                      studentCode: st?.studentCode || "",
                      className: st?.className || "",
                      branch: st?.branch || "Singkut",
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.studentCode} - {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Sesi
                  </label>
                  <input
                    type="date"
                    required
                    value={crudForm.date}
                    onChange={(e) => setCrudForm({ ...crudForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Sesi
                  </label>
                  <input
                    type="text"
                    value={crudForm.time}
                    onChange={(e) => setCrudForm({ ...crudForm, time: e.target.value })}
                    placeholder="14:00 WIB"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Kehadiran
                  </label>
                  <select
                    value={crudForm.status}
                    onChange={(e) =>
                      setCrudForm({
                        ...crudForm,
                        status: e.target.value as AttendanceItem["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="HADIR">Hadir</option>
                    <option value="IZIN">Izin</option>
                    <option value="SAKIT">Sakit</option>
                    <option value="ABSEN">Absen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Metode Catat
                  </label>
                  <select
                    value={crudForm.method}
                    onChange={(e) =>
                      setCrudForm({
                        ...crudForm,
                        method: e.target.value as "QR_SCAN" | "MANUAL",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="QR_SCAN">Scan QR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Guru
                </label>
                <input
                  type="text"
                  value={crudForm.note}
                  onChange={(e) => setCrudForm({ ...crudForm, note: e.target.value })}
                  placeholder="Keterangan izin / catatan kehadiran..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT RECORD KEHADIRAN (CRUD - UPDATE) */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-[#1d2d5a]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1d2d5a]">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Edit Data Presensi: {crudForm.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditRecord} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Sesi
                  </label>
                  <input
                    type="date"
                    required
                    value={crudForm.date}
                    onChange={(e) => setCrudForm({ ...crudForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Sesi
                  </label>
                  <input
                    type="text"
                    value={crudForm.time}
                    onChange={(e) => setCrudForm({ ...crudForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status Kehadiran
                </label>
                <select
                  value={crudForm.status}
                  onChange={(e) =>
                    setCrudForm({
                      ...crudForm,
                      status: e.target.value as AttendanceItem["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="HADIR">Hadir</option>
                  <option value="IZIN">Izin</option>
                  <option value="SAKIT">Sakit</option>
                  <option value="ABSEN">Absen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Guru
                </label>
                <input
                  type="text"
                  value={crudForm.note}
                  onChange={(e) => setCrudForm({ ...crudForm, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK NOTE MODAL (DIREKOMENDASIKAN UNTUK PRESENSI SISWA) */}
      {/* ========================================================================= */}
      {activeNoteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0f1a36] w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1d2d5a] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2d5a] pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                    Catatan Presensi
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activeNoteStudent.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoteStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Pilih Keterangan Cepat:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Izin urusan keluarga",
                    "Sakit demam / flu",
                    "Terlambat sesi",
                    "Lupa bawa modul",
                    "Izin kegiatan sekolah",
                    "Tugas dinas ortu",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setNoteInputText((prev) => (prev ? `${prev}, ${tag}` : tag));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] font-semibold border border-slate-200/80 dark:border-[#1d2d5a] cursor-pointer transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Teks Catatan Presensi:
                </label>
                <textarea
                  rows={3}
                  value={noteInputText}
                  onChange={(e) => setNoteInputText(e.target.value)}
                  placeholder="Tuliskan keterangan detail presensi di sini..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1d2d5a]">
              <button
                type="button"
                onClick={() => {
                  setNoteInputText("");
                  setNotesState((prev) => ({ ...prev, [activeNoteStudent.id]: "" }));
                  setAttendance(
                    activeNoteStudent.id,
                    selectedDate,
                    getStatus(activeNoteStudent.id),
                    ""
                  );
                  setActiveNoteStudent(null);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Hapus Catatan
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNoteStudent(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a] text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotesState((prev) => ({
                      ...prev,
                      [activeNoteStudent.id]: noteInputText,
                    }));
                    setAttendance(
                      activeNoteStudent.id,
                      selectedDate,
                      getStatus(activeNoteStudent.id),
                      noteInputText
                    );
                    setActiveNoteStudent(null);
                    setSaveToast({
                      message: `Catatan presensi untuk ${activeNoteStudent.name} berhasil disimpan!`,
                      count: 1,
                    });
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-500/20 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AbsensiPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat Modul Absensi...</div>}>
      <AbsensiContent />
    </Suspense>
  );
}
