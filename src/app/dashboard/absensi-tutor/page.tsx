"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import {
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  UserCheck,
  AlertCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getBrowserCoordinates } from "@/lib/gpsHelper";

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPHA";
  distanceMeter: number | null;
  isLocationValid: boolean;
  notes: string;
}

export default function AbsensiTutorScanPage() {
  const { name: userName, email: userEmail, role: userRole, allowedBranch } = useCurrentUser();

  const [scanType, setScanType] = useState<"IN" | "OUT">("IN");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    time?: string;
    distance?: number | null;
    isLate?: boolean;
    lateMinutes?: number;
    isEarlyLeave?: boolean;
    earlyMinutes?: number;
    workStartTime?: string;
    workEndTime?: string;
    lateToleranceMinutes?: number;
  } | null>(null);

  // Branch Work Hours & Schedule
  const [branchSchedule, setBranchSchedule] = useState<{
    workStartTime: string;
    workEndTime: string;
    lateToleranceMinutes: number;
    earlyLeaveToleranceMinutes: number;
  } | null>(null);

  // GPS State
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isTrackingGps, setIsTrackingGps] = useState(false);

  // My Monthly Attendance History
  const [myHistory, setMyHistory] = useState<AttendanceRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Video & Canvas Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fetch branch schedule
  const fetchBranchSchedule = async () => {
    try {
      const branchQuery = allowedBranch ? encodeURIComponent(allowedBranch) : "Singkut";
      const res = await fetch(`/api/branch-qr-config?branch=${branchQuery}`);
      if (res.ok) {
        const data = await res.json();
        const conf = Array.isArray(data)
          ? data.find(
              (c: any) =>
                (allowedBranch && c.branchName.toLowerCase().includes(allowedBranch.toLowerCase())) ||
                (allowedBranch && allowedBranch.toLowerCase().includes(c.branchName.toLowerCase())) ||
                (allowedBranch?.toLowerCase().includes("bangko") && c.branchCode === "BGK") ||
                (allowedBranch?.toLowerCase().includes("tabir") && c.branchCode === "BGK") ||
                (allowedBranch?.toLowerCase().includes("singkut") && c.branchCode === "SKT")
            ) || data[0]
          : data;
        if (conf) {
          setBranchSchedule({
            workStartTime: conf.workStartTime || "08:00",
            workEndTime: conf.workEndTime || "17:00",
            lateToleranceMinutes: conf.lateToleranceMinutes ?? 15,
            earlyLeaveToleranceMinutes: conf.earlyLeaveToleranceMinutes ?? 0,
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch branch schedule:", e);
    }
  };

  // Fetch my attendance history
  const fetchMyHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch(`/api/tutor-attendance`);
      if (res.ok) {
        const data = await res.json();
        setMyHistory(data);
      }
    } catch (err) {
      console.error("Error fetching my attendance history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchMyHistory();
    requestGpsLocation();
    fetchBranchSchedule();
  }, [allowedBranch]);

  // Request GPS with dual-stage fallback
  const requestGpsLocation = async () => {
    setIsTrackingGps(true);
    setGpsError(null);

    try {
      const pos = await getBrowserCoordinates();
      setGpsLocation({
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy ?? 0,
      });
    } catch (err: any) {
      console.warn("GPS acquire error:", err);
      setGpsError(err.message || "Gagal membaca lokasi. Pastikan izin lokasi browser aktif.");
    } finally {
      setIsTrackingGps(false);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setScanFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Gagal membuka kamera. Pastikan izin kamera aktif di browser.");
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Frame scanner loop
  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data && !isScanning) {
            handleQrDetected(code.data);
            return;
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickScan);
  };

  // Handle QR code detected
  const handleQrDetected = async (rawQrData: string) => {
    setIsScanning(true);
    stopCamera();

    // 1. Get latest GPS coordinate with fallback
    let lat = gpsLocation?.latitude;
    let lon = gpsLocation?.longitude;

    if (!lat || !lon) {
      try {
        const pos = await getBrowserCoordinates();
        lat = pos.latitude;
        lon = pos.longitude;
      } catch {
        // Fallback or send null
      }
    }

    try {
      const res = await fetch("/api/tutor-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrData: rawQrData,
          latitude: lat,
          longitude: lon,
          isCheckOut: scanType === "OUT",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const isLate = Boolean(data.isLate);
        const isEarlyLeave = Boolean(data.isEarlyLeave);
        const fbData = {
          type: (isLate || isEarlyLeave ? "warning" : "success") as "warning" | "success",
          title: isLate
            ? `Presensi Masuk (Terlambat ${data.lateMinutes} Menit)`
            : isEarlyLeave
            ? `Presensi Pulang (Pulang Awal ${data.earlyMinutes} Menit)`
            : scanType === "IN"
            ? "Presensi Masuk Berhasil Tepat Waktu! 🎉"
            : "Presensi Pulang Berhasil! 🏠",
          message: data.message || "Presensi kehadiran Anda telah diverifikasi oleh sistem.",
          time: scanType === "IN" ? data.attendance?.checkInTime : data.attendance?.checkOutTime,
          distance: data.distanceMeter,
          isLate,
          lateMinutes: data.lateMinutes ?? 0,
          isEarlyLeave,
          earlyMinutes: data.earlyMinutes ?? 0,
          workStartTime: data.workStartTime || branchSchedule?.workStartTime || "08:00",
          workEndTime: data.workEndTime || branchSchedule?.workEndTime || "17:00",
          lateToleranceMinutes: data.lateToleranceMinutes ?? branchSchedule?.lateToleranceMinutes ?? 15,
        };
        setScanFeedback(fbData);
        setShowFeedbackModal(true);
        fetchMyHistory();

        // Broadcast to admin dashboard tabs for zero-latency realtime update
        try {
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel("mf_tutor_attendance");
            bc.postMessage({ type: "NEW_ATTENDANCE", timestamp: Date.now() });
            bc.close();
          }
        } catch (bcErr) {
          console.warn("BroadcastChannel error:", bcErr);
        }
      } else {
        const fbData = {
          type: "error" as const,
          title: "Presensi Ditolak! ❌",
          message: data.error || "Gagal memproses absensi.",
          distance: data.distanceMeter,
          isLate: false,
          lateMinutes: 0,
          isEarlyLeave: false,
          earlyMinutes: 0,
        };
        setScanFeedback(fbData);
        setShowFeedbackModal(true);
      }
    } catch (err: any) {
      const fbData = {
        type: "error" as const,
        title: "Kesalahan Jaringan",
        message: err.message || "Gagal menghubungi server database.",
        distance: null,
      };
      setScanFeedback(fbData);
      setShowFeedbackModal(true);
    } finally {
      setIsScanning(false);
    }
  };

  // Count stats
  const totalMyHadir = myHistory.filter((r) => r.status === "HADIR" || r.status === "TERLAMBAT").length;
  const todayRecord = myHistory.find(
    (r) => r.date === new Date().toISOString().split("T")[0]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {userRole}
            </span>
            <span className="text-xs font-bold text-slate-400">Cabang {allowedBranch || "Singkut"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Presensi Kehadiran Tutor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pindai QR Code di kantor cabang untuk mencatat presensi kehadiran masuk dan pulang secara otomatis dengan validasi lokasi GPS.
          </p>
        </div>

        {/* Live Date/Time Badge */}
        <div className="p-3 bg-slate-50 dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-[#1d2d5a] flex items-center gap-3 shrink-0">
          <Clock className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
              {todayRecord ? (
                todayRecord.checkOutTime && todayRecord.checkOutTime !== "-" ? (
                  `Sudah Check-out (${todayRecord.checkOutTime})`
                ) : (
                  `Sudah Check-in (${todayRecord.checkInTime})`
                )
              ) : (
                "Belum Presensi Hari Ini"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Branch Work Schedule Info Banner */}
      {branchSchedule && (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/40 p-4 rounded-3xl border border-emerald-300/60 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 text-emerald-950 dark:text-emerald-200">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold block text-slate-900 dark:text-white">
                Jadwal Jam Kerja Cabang {allowedBranch || "Singkut"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Masuk: <strong className="text-emerald-600 dark:text-emerald-400">{branchSchedule.workStartTime} WIB</strong> • Pulang: <strong className="text-slate-700 dark:text-slate-300">{branchSchedule.workEndTime} WIB</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
              ⏱️ Toleransi Masuk: <span className="text-emerald-600 dark:text-emerald-400 font-black">{branchSchedule.lateToleranceMinutes} mnt</span>
            </span>
            {branchSchedule.earlyLeaveToleranceMinutes > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                🏃 Toleransi Pulang: <span className="text-emerald-600 dark:text-emerald-400 font-black">{branchSchedule.earlyLeaveToleranceMinutes} mnt</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Scanner & GPS Status */}
        <div className="lg:col-span-7 space-y-4">
          {/* Scanner Box */}
          <div className="bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Kamera Pindai QR Cabang
                </h2>
              </div>

              {/* Mode Toggle: Check-In / Check-Out */}
              <div className="flex bg-slate-100 dark:bg-[#0b1329] p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-[#1d2d5a]">
                <button
                  type="button"
                  onClick={() => setScanType("IN")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    scanType === "IN"
                      ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Presensi Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setScanType("OUT")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    scanType === "OUT"
                      ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Presensi Pulang
                </button>
              </div>
            </div>

            {/* Camera Viewport */}
            <div className="relative w-full aspect-4/3 rounded-3xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500/30">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Target Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-52 h-52 border-2 border-emerald-400 rounded-3xl relative animate-pulse flex items-center justify-center">
                    <div className="w-48 h-0.5 bg-emerald-400/80 absolute top-1/2 -translate-y-1/2 animate-bounce" />
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-[11px] text-white font-bold">
                    Arahkan kamera ke QR Code Presensi Cabang
                  </span>
                </div>
              )}

              {/* Inactive Camera Placeholder */}
              {!cameraActive && (
                <div className="p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Kamera Belum Aktif</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Klik tombol di bawah untuk membuka kamera dan memindai QR Code di cabang.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div>
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isScanning}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{scanType === "IN" ? "Buka Kamera (Scan Presensi Masuk)" : "Buka Kamera (Scan Presensi Pulang)"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Tutup Kamera</span>
                </button>
              )}
            </div>

            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Scan Feedback Result Card */}
            {scanFeedback && (
              <div
                className={`p-4 rounded-3xl border animate-in zoom-in-95 space-y-2 ${
                  scanFeedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                    : scanFeedback.type === "warning"
                    ? "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100"
                    : "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {scanFeedback.type === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : scanFeedback.type === "warning" ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h3 className="font-black text-sm">{scanFeedback.title}</h3>
                    <p className="text-xs leading-relaxed">{scanFeedback.message}</p>
                    {scanFeedback.time && (
                      <div className="text-xs font-bold">
                        Waktu Tercatat: <strong>{scanFeedback.time}</strong>
                      </div>
                    )}
                    {scanFeedback.distance !== undefined && scanFeedback.distance !== null && (
                      <div className="text-[11px] font-bold opacity-85">
                        Jarak GPS ke Cabang: <strong>{scanFeedback.distance} meter</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GPS Status Box */}
          <div className="bg-white dark:bg-[#0f1a36] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                <Compass className={`w-4 h-4 text-emerald-600 ${isTrackingGps ? "animate-spin" : ""}`} />
                <span>Status Sensor GPS Perangkat</span>
              </div>
              <button
                type="button"
                onClick={requestGpsLocation}
                disabled={isTrackingGps}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh GPS</span>
              </button>
            </div>

            {gpsLocation ? (
              <div className="p-3 bg-emerald-50/60 dark:bg-[#0b1329] rounded-2xl border border-emerald-200/80 dark:border-[#1d2d5a] text-xs space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>🟢 GPS Siap & Terkoneksi</span>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    Akurasi: ±{Math.round(gpsLocation.accuracy)}m
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Lat: {gpsLocation.latitude.toFixed(6)}, Lon: {gpsLocation.longitude.toFixed(6)}
                </div>
              </div>
            ) : gpsError ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{gpsError}. Pastikan Anda memberikan izin akses lokasi pada browser smartphone.</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-[#0b1329] rounded-2xl text-xs text-slate-400 text-center">
                Mendeteksi lokasi perangkat Anda...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attendance History */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f1a36] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Riwayat Kehadiran Saya
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {totalMyHadir} Hari Hadir
              </span>
            </div>

            {/* List */}
            <div className="space-y-2 overflow-y-auto max-h-[420px] pr-1">
              {myHistory.length > 0 ? (
                myHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1d2d5a] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{rec.date}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${
                            rec.status === "HADIR"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              : rec.status === "TERLAMBAT"
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                              : rec.status === "IZIN"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                              : rec.status === "SAKIT"
                              ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800"
                              : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Masuk: <strong className="text-emerald-600">{rec.checkInTime}</strong></span>
                        {rec.checkOutTime && rec.checkOutTime !== "-" && (
                          <span>Pulang: <strong className="text-slate-700 dark:text-slate-300">{rec.checkOutTime}</strong></span>
                        )}
                      </div>
                      {rec.notes && (
                        <div className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 inline-block">
                          {rec.notes}
                        </div>
                      )}
                      {rec.distanceMeter !== null && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> Jarak: {rec.distanceMeter}m
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-[#1d2d5a] rounded-2xl">
                  Belum ada catatan presensi kehadiran bulan ini.
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 bg-emerald-50/50 dark:bg-[#0b1329] rounded-2xl border border-emerald-200/60 dark:border-[#1d2d5a] text-[11px] text-emerald-950 dark:text-emerald-300 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Presensi terenkripsi dan diverifikasi otomatis oleh sistem geofencing GPS Mathfingers.</span>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL KETERANGAN TELAT / HASIL PRESENSI */}
      {showFeedbackModal && scanFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-[#0f1a36] w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#1d2d5a] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-center relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Decorative Top Accent Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-2.5 ${
                scanFeedback.isLate
                  ? "bg-rose-500"
                  : scanFeedback.isEarlyLeave
                  ? "bg-amber-500"
                  : scanFeedback.type === "success"
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />

            {/* Central Animated Icon */}
            <div className="mx-auto flex items-center justify-center pt-1">
              {scanFeedback.isLate ? (
                <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/90 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 animate-bounce">
                  <Clock className="w-8 h-8" />
                </div>
              ) : scanFeedback.isEarlyLeave ? (
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              ) : scanFeedback.type === "success" ? (
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/90 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
                  <AlertCircle className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Title & Pop-up Late Breakdown Badge */}
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {scanFeedback.title}
              </h2>

              {scanFeedback.isLate && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300 shadow-xs">
                  <span className="text-xs uppercase font-black tracking-wider">Keterangan:</span>
                  <span className="text-lg sm:text-xl font-black">
                    Telat {scanFeedback.lateMinutes} Menit
                  </span>
                </div>
              )}

              {scanFeedback.isEarlyLeave && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/90 border-2 border-amber-400 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-xs">
                  <span className="text-xs uppercase font-black tracking-wider">Keterangan:</span>
                  <span className="text-lg sm:text-xl font-black">
                    Pulang Awal {scanFeedback.earlyMinutes} Menit
                  </span>
                </div>
              )}

              {!scanFeedback.isLate && !scanFeedback.isEarlyLeave && scanFeedback.type === "success" && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  <span className="text-xs font-black">Tepat Waktu (Hadir)</span>
                </div>
              )}
            </div>

            {/* Detailed Parameters Grid */}
            <div className="bg-slate-50 dark:bg-[#0b1329] p-4 rounded-2xl border border-slate-200 dark:border-[#1d2d5a] text-xs space-y-2.5 text-left">
              {scanFeedback.time && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Waktu Scan Tercatat</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{scanFeedback.time}</span>
                </div>
              )}

              {scanFeedback.isLate && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Jadwal Masuk Resmi</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{scanFeedback.workStartTime} WIB</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Batas Toleransi Cabang</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+{scanFeedback.lateToleranceMinutes} Menit</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Status Absensi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                      TERLAMBAT
                    </span>
                  </div>
                </>
              )}

              {scanFeedback.isEarlyLeave && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Jadwal Pulang Resmi</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{scanFeedback.workEndTime} WIB</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Verifikasi Geofencing GPS</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {scanFeedback.distance !== null && scanFeedback.distance !== undefined
                    ? `Jarak ${scanFeedback.distance}m (Valid)`
                    : "Terverifikasi di Area Cabang"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {scanFeedback.message}
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-md cursor-pointer transition-all ${
                scanFeedback.isLate
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                  : scanFeedback.isEarlyLeave
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : scanFeedback.type === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-slate-700 hover:bg-slate-800"
              }`}
            >
              {scanFeedback.isLate ? "Saya Mengerti (Keterlambatan Tercatat)" : "Tutup"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
