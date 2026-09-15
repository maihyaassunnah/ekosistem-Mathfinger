"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  MapPin,
  QrCode,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Printer,
  Download,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  Navigation,
  Compass,
  Building2,
  ChevronDown,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAppStore } from "@/lib/store";
import CustomSelect from "@/components/ui/CustomSelect";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getBrowserCoordinates, parseCoordinatesFromString } from "@/lib/gpsHelper";
import { Copy, Link2, ExternalLink, HelpCircle } from "lucide-react";

interface BranchQrConfig {
  branchId: string;
  branchCode: string;
  branchName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  qrSecret: string;
  qrPayload: string;
  workStartTime?: string;
  workEndTime?: string;
  lateToleranceMinutes?: number;
  earlyLeaveToleranceMinutes?: number;
}

interface TutorAttendanceItem {
  id: string;
  userId: string;
  tutorName: string;
  tutorEmail: string;
  tutorRole: string;
  avatarUrl: string;
  branchId: string;
  branchName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPHA";
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  latitude: number | null;
  longitude: number | null;
  distanceMeter: number | null;
  isLocationValid: boolean;
  notes: string;
  createdAt: string;
}

// Helper: Calculate Time plus minutes
function calculateTimePlus(timeStr: string, minutesToAdd: string | number): string {
  if (!timeStr) return "-";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const total = h * 60 + m + (parseInt(String(minutesToAdd), 10) || 0);
  const newH = Math.floor((total / 60) % 24);
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// Helper: Calculate Time minus minutes
function calculateTimeMinus(timeStr: string, minutesToSubtract: string | number): string {
  if (!timeStr) return "-";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  let total = h * 60 + m - (parseInt(String(minutesToSubtract), 10) || 0);
  if (total < 0) total += 24 * 60;
  const newH = Math.floor((total / 60) % 24);
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export default function PresensiTutorAdminPage() {
  const { isSuperAdmin, isBranchAdmin, allowedBranch, name: currentUserName } = useCurrentUser();
  const { branches, branchAdmins } = useAppStore();

  const [activeTab, setActiveTab] = useState<"SETTINGS_QR" | "REKAP">("SETTINGS_QR");
  const [selectedBranch, setSelectedBranch] = useState<string>(allowedBranch || "Singkut");
  const [configs, setConfigs] = useState<BranchQrConfig[]>([]);
  const [attendances, setAttendances] = useState<TutorAttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Sync selectedBranch when allowedBranch is hydrated for branch admins
  useEffect(() => {
    if (allowedBranch && !isSuperAdmin) {
      setSelectedBranch(allowedBranch);
    }
  }, [allowedBranch, isSuperAdmin]);

  // GPS Settings Form State
  const [gpsForm, setGpsForm] = useState({
    latitude: "-2.3125",
    longitude: "102.6847",
    radiusMeters: "100",
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Work Hours & Tolerance Settings Form State
  const [workTimeForm, setWorkTimeForm] = useState({
    workStartTime: "08:00",
    workEndTime: "17:00",
    lateToleranceMinutes: "15",
    earlyLeaveToleranceMinutes: "0",
  });
  const [isSavingWorkTime, setIsSavingWorkTime] = useState(false);
  const [workTimeFeedback, setWorkTimeFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Rekap Filters
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal manual edit/input
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TutorAttendanceItem | null>(null);
  const [editForm, setEditForm] = useState({
    status: "HADIR" as "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPHA",
    checkInTime: "14:00 WIB",
    checkOutTime: "-",
    notes: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Determine active branch scope
  const targetBranch = !isSuperAdmin && allowedBranch ? allowedBranch : selectedBranch;

  // Fetch branch QR & GPS configs
  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/branch-qr-config?branch=${encodeURIComponent(targetBranch)}`);
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
        if (data.length > 0) {
          const cfg = data[0];
          setGpsForm({
            latitude: cfg.latitude ? String(cfg.latitude) : "-2.3125",
            longitude: cfg.longitude ? String(cfg.longitude) : "102.6847",
            radiusMeters: String(cfg.radiusMeters || 100),
          });
          setWorkTimeForm({
            workStartTime: cfg.workStartTime || "08:00",
            workEndTime: cfg.workEndTime || "17:00",
            lateToleranceMinutes: String(cfg.lateToleranceMinutes ?? 15),
            earlyLeaveToleranceMinutes: String(cfg.earlyLeaveToleranceMinutes ?? 0),
          });
          generateQrImage(cfg.qrPayload);
        }
      }
    } catch (err) {
      console.error("Error fetching configs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tutor attendances
  const fetchAttendances = async () => {
    try {
      setIsRefreshing(true);
      const url = `/api/tutor-attendance?branch=${encodeURIComponent(targetBranch)}${
        filterDate ? `&date=${filterDate}` : `&month=${filterMonth}`
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAttendances(data);
      }
    } catch (err) {
      console.error("Error fetching attendances:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
    fetchAttendances();
  }, [targetBranch, filterMonth, filterDate]);

  // Generate QR Canvas
  const generateQrImage = async (payload: string) => {
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: "#064e3b",
          light: "#ffffff",
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error("Error generating QR:", err);
    }
  };

  // Auto-detect current browser GPS with dual-stage fallback
  const handleDetectCurrentLocation = async () => {
    setIsDetectingGps(true);
    setGpsFeedback(null);

    try {
      const pos = await getBrowserCoordinates();
      const lat = pos.latitude.toFixed(6);
      const lon = pos.longitude.toFixed(6);
      setGpsForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }));
      setGpsFeedback({
        type: "success",
        text: `Koordinat GPS berhasil dideteksi! Akurasi: ±${Math.round(pos.accuracy || 0)} meter.`,
      });
    } catch (err: any) {
      console.error("GPS detection error:", err);
      setGpsFeedback({
        type: "error",
        text: err.message || "Gagal membaca GPS. Pastikan izin lokasi aktif atau masukkan koordinat dari Google Maps.",
      });
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Quick helper: Paste / Parse Google Maps link or coordinates
  const [pasteInput, setPasteInput] = useState("");
  const [isParsingOpen, setIsParsingOpen] = useState(false);

  const handleApplyPastedCoordinates = () => {
    if (!pasteInput.trim()) return;
    const parsed = parseCoordinatesFromString(pasteInput);
    if (parsed) {
      setGpsForm((prev) => ({
        ...prev,
        latitude: parsed.latitude.toFixed(6),
        longitude: parsed.longitude.toFixed(6),
      }));
      setGpsFeedback({
        type: "success",
        text: `Koordinat berhasil diekstrak: Lat ${parsed.latitude.toFixed(6)}, Lon ${parsed.longitude.toFixed(6)}! Jangan lupa klik Simpan Pengaturan.`,
      });
      setPasteInput("");
      setIsParsingOpen(false);
    } else {
      setGpsFeedback({
        type: "error",
        text: "Format tidak dikenali. Salin link Google Maps atau format contoh: -2.3125, 102.6847",
      });
    }
  };

  // Quick Preset setter
  const handleSetPreset = (lat: string, lon: string, name: string) => {
    setGpsForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
    }));
    setGpsFeedback({
      type: "success",
      text: `Titik koordinat ${name} diterapkan (${lat}, ${lon}). Klik 'Simpan Pengaturan Titik GPS' untuk mengunci.`,
    });
  };

  // Save GPS & Radius settings
  const handleSaveGps = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/branch-qr-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: targetBranch,
          latitude: parseFloat(gpsForm.latitude),
          longitude: parseFloat(gpsForm.longitude),
          radiusMeters: parseInt(gpsForm.radiusMeters, 10),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGpsFeedback({
          type: "success",
          text: `Titik GPS & Radius Cabang ${targetBranch} berhasil disimpan ke PostgreSQL!`,
        });
        generateQrImage(data.qrPayload);
        fetchConfigs();
      } else {
        const err = await res.json();
        setGpsFeedback({ type: "error", text: err.error || "Gagal menyimpan pengaturan" });
      }
    } catch (err: any) {
      setGpsFeedback({ type: "error", text: err.message || "Gagal menyimpan pengaturan" });
    } finally {
      setIsLoading(false);
    }
  };

  // Save Work Hours & Tolerance Settings
  const handleSaveWorkTime = async () => {
    try {
      setIsSavingWorkTime(true);
      setWorkTimeFeedback(null);
      const res = await fetch("/api/branch-qr-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: targetBranch,
          workStartTime: workTimeForm.workStartTime,
          workEndTime: workTimeForm.workEndTime,
          lateToleranceMinutes: parseInt(workTimeForm.lateToleranceMinutes, 10) || 0,
          earlyLeaveToleranceMinutes: parseInt(workTimeForm.earlyLeaveToleranceMinutes, 10) || 0,
        }),
      });

      if (res.ok) {
        setWorkTimeFeedback({
          type: "success",
          text: `Jam kerja (${workTimeForm.workStartTime} - ${workTimeForm.workEndTime} WIB) & batas toleransi Cabang ${targetBranch} berhasil disimpan!`,
        });
        fetchConfigs();
      } else {
        const err = await res.json();
        setWorkTimeFeedback({ type: "error", text: err.error || "Gagal menyimpan jam kerja" });
      }
    } catch (err: any) {
      setWorkTimeFeedback({ type: "error", text: err.message || "Gagal menyimpan jam kerja" });
    } finally {
      setIsSavingWorkTime(false);
    }
  };

  // Regenerate QR Secret
  const handleRegenerateQr = async () => {
    if (!confirm("Regenerate QR akan mengganti kode QR lama. Kode QR lama yang telah dicetak tidak akan berlaku lagi. Lanjutkan?")) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/branch-qr-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: targetBranch,
          regenerateQr: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        generateQrImage(data.qrPayload);
        fetchConfigs();
        setGpsFeedback({
          type: "success",
          text: "Kode QR Presensi Baru berhasil di-generate!",
        });
      }
    } catch (err: any) {
      setGpsFeedback({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Print QR View
  const handlePrintQr = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code Presensi Tutor - Cabang ${selectedBranch}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding: 40px; }
            .card { border: 4px solid #064e3b; border-radius: 24px; padding: 30px; max-width: 480px; margin: 0 auto; }
            h1 { color: #064e3b; margin-bottom: 5px; font-size: 26px; font-weight: 900; }
            h2 { color: #10b981; font-size: 18px; margin-top: 0; }
            p { color: #475569; font-size: 13px; line-height: 1.5; }
            .qr-img { width: 300px; height: 300px; margin: 15px auto; display: block; }
            .badge { background: #d1fae5; color: #065f46; font-weight: bold; padding: 6px 14px; border-radius: 20px; display: inline-block; font-size: 12px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>MATHFINGERS</h1>
            <h2>QR PRESENSI KEHADIRAN TUTOR & STAFF</h2>
            <p><strong>Cabang ${selectedBranch}</strong></p>
            <img class="qr-img" src="${qrDataUrl}" alt="QR Code" />
            <p>Scan menggunakan smartphone Anda melalui menu <strong>"Scan Presensi Saya"</strong> saat tiba di area kantor cabang.</p>
            <div class="badge">📍 Terverifikasi Geofencing GPS (Radius: ${gpsForm.radiusMeters} Meter)</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered Attendances
  const filteredAttendances = attendances.filter((att) => {
    const matchSearch =
      att.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.tutorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "ALL" || att.tutorRole === filterRole;
    const matchStatus = filterStatus === "ALL" || att.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const totalHadir = filteredAttendances.filter((a) => a.status === "HADIR").length;
  const totalTerlambat = filteredAttendances.filter((a) => a.status === "TERLAMBAT").length;
  const totalIzin = filteredAttendances.filter((a) => a.status === "IZIN" || a.status === "SAKIT").length;
  const totalAlpha = filteredAttendances.filter((a) => a.status === "ALPHA").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Presensi & QR GPS Tutor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pengaturan titik lokasi GPS cabang, kode QR presensi, dan rekapitulasi kehadiran tutor.
              </p>
            </div>
          </div>
        </div>

        {/* Branch Selector (if Super Admin) */}
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <div className="w-48 sm:w-56">
              <CustomSelect
                value={selectedBranch}
                onChange={setSelectedBranch}
                size="md"
                options={[
                  { value: "Singkut", label: "Cabang Singkut" },
                  { value: "Tabir Timur", label: "Cabang Tabir Timur (Bangko)" },
                  ...(branches || [])
                    .filter((b) => b.name !== "Singkut" && b.name !== "Bangko" && b.name !== "Tabir Timur")
                    .map((b) => ({ value: b.name, label: `Cabang ${b.name}` })),
                ]}
              />
            </div>
          )}
          {!isSuperAdmin && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Cabang {targetBranch}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#1d2d5a] gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("SETTINGS_QR")}
          className={`pb-3 px-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
            activeTab === "SETTINGS_QR"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pengaturan GPS & QR Code Cabang</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("REKAP");
            fetchAttendances();
          }}
          className={`pb-3 px-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
            activeTab === "REKAP"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Rekap Kehadiran Tutor ({attendances.length})</span>
        </button>
      </div>

      {/* TAB 1: SETTINGS GPS & QR */}
      {activeTab === "SETTINGS_QR" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: GPS Geofencing Configuration */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Titik Koordinat & Radius GPS Cabang
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">Cabang {selectedBranch}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tutor hanya dapat melakukan presensi kehadiran jika posisi GPS perangkat mereka berada di dalam radius cabang yang telah ditentukan di bawah ini.
            </p>

            {gpsFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                  gpsFeedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
              >
                {gpsFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{gpsFeedback.text}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Quick Preset Buttons & Paste Helper */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[11px] font-bold text-slate-400">Pintasan Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleSetPreset("-2.312500", "102.600000", "Cabang Singkut")}
                  className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                >
                  📍 Preset Singkut
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset("-2.071700", "102.265500", "Cabang Bangko")}
                  className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  📍 Preset Bangko
                </button>
                <button
                  type="button"
                  onClick={() => setIsParsingOpen(!isParsingOpen)}
                  className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                >
                  <Link2 className="w-3 h-3 text-emerald-600" />
                  <span>{isParsingOpen ? "Tutup Paste Link" : "Paste Link/Koordinat G-Maps"}</span>
                </button>
              </div>

              {/* Expandable Paste Google Maps Box */}
              {isParsingOpen && (
                <div className="p-3.5 bg-slate-50 dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                      Tempel URL Google Maps atau Format `Lat, Long`:
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pasteInput}
                      onChange={(e) => setPasteInput(e.target.value)}
                      placeholder="Contoh: https://maps.app.goo.gl/... atau -2.3125, 102.6847"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121c38] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPastedCoordinates}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Terapkan
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    💡 Tips: Buka Google Maps di browser / HP, klik kanan pada lokasi cabang, klik angka koordinatnya untuk menyalin, lalu tempel di sini.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude (Garis Lintang)
                  </label>
                  <input
                    type="text"
                    value={gpsForm.latitude}
                    onChange={(e) => setGpsForm({ ...gpsForm, latitude: e.target.value })}
                    placeholder="-2.3125"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude (Garis Bujur)
                  </label>
                  <input
                    type="text"
                    value={gpsForm.longitude}
                    onChange={(e) => setGpsForm({ ...gpsForm, longitude: e.target.value })}
                    placeholder="102.6847"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Radius Toleransi Jarak (Meter)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    step="10"
                    value={gpsForm.radiusMeters}
                    onChange={(e) => setGpsForm({ ...gpsForm, radiusMeters: e.target.value })}
                    className="w-32 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Siswa/Tutor harus berada dalam radius maksimal <strong>{gpsForm.radiusMeters} meter</strong> dari titik cabang.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleDetectCurrentLocation}
                  disabled={isDetectingGps}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Compass className={`w-4 h-4 text-emerald-600 ${isDetectingGps ? "animate-spin" : ""}`} />
                  <span>{isDetectingGps ? "Mendeteksi Lokasi..." : "Gunakan Lokasi GPS Saya Saat Ini"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveGps}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Pengaturan Titik GPS</span>
                </button>
              </div>
            </div>

            {/* Google Maps Pinpoint Preview Link */}
            <div className="p-3.5 bg-emerald-50/50 dark:bg-[#0b1329] rounded-2xl border border-emerald-200/60 dark:border-[#1d2d5a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-300 font-bold">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Lihat di Google Maps</span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${gpsForm.latitude},${gpsForm.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
              >
                Buka Peta ↗
              </a>
            </div>
          </div>

          {/* Right Column: QR Code Display & Print */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4 flex flex-col justify-between items-center text-center">
            <div className="w-full pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  QR Presensi Tutor
                </h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Resmi
              </span>
            </div>

            {/* QR Card Preview */}
            <div className="p-4 bg-slate-50 dark:bg-[#0b1329] rounded-3xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 flex flex-col items-center max-w-[280px]">
              <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
                LES MATHFINGERS
              </div>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Presensi Tutor"
                  className="w-48 h-48 rounded-2xl shadow-xs bg-white p-1"
                />
              ) : (
                <div className="w-48 h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                  Memuat QR...
                </div>
              )}
              <div className="mt-3 text-xs font-black text-slate-800 dark:text-white">
                Cabang {selectedBranch}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Scan via menu <strong>Scan Presensi Saya</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Stiker QR</span>
                </button>

                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`QR-Presensi-Tutor-${selectedBranch}.png`}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PNG</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={handleRegenerateQr}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate QR Secret Baru</span>
              </button>
            </div>
          </div>

          {/* Bottom Card: Pengaturan Jam Kerja & Batas Toleransi Cabang */}
          <div className="lg:col-span-12 bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Pengaturan Jam Kerja & Toleransi Waktu Cabang
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Cabang {targetBranch}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Atur jam masuk, jam pulang, serta batas toleransi menit untuk tutor di Cabang {targetBranch}. Sistem akan secara otomatis menandai status <strong>HADIR (Tepat Waktu)</strong> atau <strong>TERLAMBAT</strong> saat tutor memindai QR Code.
            </p>

            {workTimeFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                  workTimeFeedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
              >
                {workTimeFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{workTimeFeedback.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Masuk Kerja
                </label>
                <input
                  type="time"
                  value={workTimeForm.workStartTime}
                  onChange={(e) => setWorkTimeForm({ ...workTimeForm, workStartTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Jadwal mulai masuk kantor (WIB)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Toleransi Terlambat
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={workTimeForm.lateToleranceMinutes}
                    onChange={(e) => setWorkTimeForm({ ...workTimeForm, lateToleranceMinutes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
                    Menit
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Batas toleransi keterlambatan</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Pulang Kerja
                </label>
                <input
                  type="time"
                  value={workTimeForm.workEndTime}
                  onChange={(e) => setWorkTimeForm({ ...workTimeForm, workEndTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Jadwal jam selesai kerja (WIB)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Toleransi Pulang Awal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={workTimeForm.earlyLeaveToleranceMinutes}
                    onChange={(e) => setWorkTimeForm({ ...workTimeForm, earlyLeaveToleranceMinutes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
                    Menit
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Batas toleransi pulang lebih awal</span>
              </div>
            </div>

            {/* Live Rule Calculation Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulasi Aturan Presensi Cabang {targetBranch}:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    Masuk <strong>Tepat Waktu</strong>: Scan sebelum atau tepat pukul{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {calculateTimePlus(workTimeForm.workStartTime, workTimeForm.lateToleranceMinutes)} WIB
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>
                    Status <strong>TERLAMBAT</strong>: Scan setelah pukul{" "}
                    <strong className="text-amber-600 dark:text-amber-400">
                      {calculateTimePlus(workTimeForm.workStartTime, workTimeForm.lateToleranceMinutes)} WIB
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>
                    Pulang <strong>Standar</strong>: Scan pada atau setelah pukul{" "}
                    <strong className="text-blue-600 dark:text-blue-400">
                      {calculateTimeMinus(workTimeForm.workEndTime, workTimeForm.earlyLeaveToleranceMinutes)} WIB
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>
                    Catatan <strong>Pulang Awal</strong>: Scan sebelum pukul{" "}
                    <strong className="text-rose-600 dark:text-rose-400">
                      {calculateTimeMinus(workTimeForm.workEndTime, workTimeForm.earlyLeaveToleranceMinutes)} WIB
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSaveWorkTime}
                disabled={isSavingWorkTime}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingWorkTime ? "Menyimpan..." : "Simpan Pengaturan Jam Kerja & Toleransi"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REKAPITULASI KEHADIRAN TUTOR */}
      {activeTab === "REKAP" && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalHadir}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Hadir Tepat Waktu</div>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTerlambat}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Terlambat Scan</div>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalIzin}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Izin / Sakit</div>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAlpha}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Alpha / Terlewat</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b1329] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => {
                    setFilterMonth(e.target.value);
                    setFilterDate("");
                  }}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b1329] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1d2d5a]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filter Tanggal Tertentu"
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden"
                />
              </div>

              <CustomSelect
                value={filterRole}
                onChange={setFilterRole}
                size="sm"
                options={[
                  { value: "ALL", label: "Semua Peran" },
                  { value: "TUTOR", label: "Tutor" },
                  { value: "BRANCH_ASSISTANT", label: "Asisten Cabang" },
                  { value: "BRANCH_ADMIN", label: "Admin Cabang" },
                ]}
              />

              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                size="sm"
                options={[
                  { value: "ALL", label: "Semua Status" },
                  { value: "HADIR", label: "Hadir (Tepat Waktu)" },
                  { value: "TERLAMBAT", label: "Terlambat" },
                  { value: "IZIN", label: "Izin" },
                  { value: "SAKIT", label: "Sakit" },
                  { value: "ALPHA", label: "Alpha" },
                ]}
              />

              <button
                type="button"
                onClick={fetchAttendances}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Muat Ulang Data Presensi"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Memuat..." : "Segarkan"}</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0b1329] text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#1d2d5a]">
                    <th className="py-3 px-4">Tutor / Staff</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Jam Masuk</th>
                    <th className="py-3 px-4">Jam Pulang</th>
                    <th className="py-3 px-4">Jarak GPS</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Keterangan</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAttendances.length > 0 ? (
                    filteredAttendances.map((att) => (
                      <tr
                        key={att.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-[#132042]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center text-xs shrink-0">
                              {att.tutorName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-white">
                                {att.tutorName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {att.tutorRole === "BRANCH_ASSISTANT" ? "Asisten Cabang" : att.tutorRole} • Cabang {att.branchName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {att.date}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                          {att.checkInTime}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">
                          <span>{att.checkOutTime || "-"}</span>
                          {att.earlyLeaveMinutes && att.earlyLeaveMinutes > 0 ? (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                              -{att.earlyLeaveMinutes}m
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4">
                          {att.distanceMeter !== null ? (
                            <span
                              className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                                att.isLocationValid
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              <MapPin className="w-3 h-3" />
                              {att.distanceMeter} meter
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Manual / Web</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1 ${
                              att.status === "HADIR"
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : att.status === "TERLAMBAT"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                                : att.status === "IZIN"
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : att.status === "SAKIT"
                                ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                            }`}
                          >
                            <span>{att.status}</span>
                            {att.status === "TERLAMBAT" && att.lateMinutes && att.lateMinutes > 0 ? (
                              <span className="font-mono text-[9px] bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 rounded">
                                +{att.lateMinutes}m
                              </span>
                            ) : null}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {att.notes || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRecord(att);
                              setEditForm({
                                status: att.status,
                                checkInTime: att.checkInTime,
                                checkOutTime: att.checkOutTime || "-",
                                notes: att.notes || "",
                              });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer transition-colors mr-1"
                            title="Edit Presensi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        Belum ada riwayat presensi tutor untuk periode yang dipilih.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0f1a36] rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-[#1d2d5a] shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Edit Presensi {editingRecord.tutorName}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Kehadiran
                </label>
                <CustomSelect
                  value={editForm.status}
                  onChange={(v) => setEditForm({ ...editForm, status: v as any })}
                  options={[
                    { value: "HADIR", label: "HADIR (Tepat Waktu)" },
                    { value: "TERLAMBAT", label: "TERLAMBAT" },
                    { value: "IZIN", label: "IZIN" },
                    { value: "SAKIT", label: "SAKIT" },
                    { value: "ALPHA", label: "ALPHA" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Masuk
                </label>
                <input
                  type="text"
                  value={editForm.checkInTime}
                  onChange={(e) => setEditForm({ ...editForm, checkInTime: e.target.value })}
                  placeholder="Contoh: 14:00 WIB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Pulang
                </label>
                <input
                  type="text"
                  value={editForm.checkOutTime}
                  onChange={(e) => setEditForm({ ...editForm, checkOutTime: e.target.value })}
                  placeholder="Contoh: 17:00 WIB atau -"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/tutor-attendance", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: editingRecord.id,
                      status: editForm.status,
                      checkInTime: editForm.checkInTime,
                      checkOutTime: editForm.checkOutTime,
                      notes: editForm.notes,
                    }),
                  });
                  setIsEditModalOpen(false);
                  fetchAttendances();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
