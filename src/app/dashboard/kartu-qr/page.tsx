"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  Printer,
  Camera,
  Search,
  Eye,
  Download,
  BookOpen,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
} from "lucide-react";
import QRCode from "qrcode";
import { useAppStore } from "@/lib/store";
import { StudentItem } from "@/lib/mock-data";

function StudentQrImage({
  student,
  size = 140,
}: {
  student: StudentItem;
  size?: number;
}) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    // Format standardized payload for Math Fingers QR attendance scanner
    const payload = JSON.stringify({
      app: "MathFingers",
      type: "ABSENSI",
      studentId: student.id,
      code: student.studentCode,
      name: student.name,
      className: student.className,
      branch: student.branch,
    });

    QRCode.toDataURL(payload, {
      width: size * 2, // High DPI for crisp rendering
      margin: 1,
      color: {
        dark: "#047857",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error("Error generating QR", err));
  }, [student, size]);

  if (!qrUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="animate-pulse bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-[10px] font-bold text-emerald-600"
      >
        Membuat QR...
      </div>
    );
  }

  return (
    <img
      src={qrUrl}
      alt={`QR Code ${student.name}`}
      className="rounded-xl shadow-2xs border border-emerald-200/60 dark:border-emerald-800/80 bg-white"
      style={{ width: size, height: size }}
    />
  );
}

export default function KartuQrPage() {
  const { students, classes } = useAppStore();

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [previewStudent, setPreviewStudent] = useState<StudentItem | null>(null);
  const [previewQrUrl, setPreviewQrUrl] = useState<string>("");

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.includes(search);
    const matchBranch = branchFilter === "ALL" ? true : s.branch === branchFilter;
    const matchClass = classFilter === "ALL" ? true : s.className === classFilter;
    return matchSearch && matchBranch && matchClass;
  });

  // Get class schedule helper
  const getClassSchedule = (className: string, branch: string) => {
    const found = classes.find(
      (c) =>
        c.name.toLowerCase() === className.toLowerCase() &&
        c.branch.toLowerCase() === branch.toLowerCase()
    );
    return found
      ? `${found.days} • ${found.time}`
      : "Sabtu & Ahad • 14:00 - 15:30";
  };

  // When previewing a student, generate large QR code URL
  useEffect(() => {
    if (!previewStudent) {
      setPreviewQrUrl("");
      return;
    }

    const payload = JSON.stringify({
      app: "MathFingers",
      type: "ABSENSI",
      studentId: previewStudent.id,
      code: previewStudent.studentCode,
      name: previewStudent.name,
      className: previewStudent.className,
      branch: previewStudent.branch,
    });

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 1,
      color: {
        dark: "#047857",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then((url) => setPreviewQrUrl(url));
  }, [previewStudent]);

  const handleDownloadQr = (student: StudentItem) => {
    const payload = JSON.stringify({
      app: "MathFingers",
      type: "ABSENSI",
      studentId: student.id,
      code: student.studentCode,
      name: student.name,
      className: student.className,
      branch: student.branch,
    });

    QRCode.toDataURL(payload, {
      width: 600,
      margin: 2,
      color: {
        dark: "#047857",
        light: "#ffffff",
      },
    }).then((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-Presensi-${student.studentCode}-${student.name.replace(/\s+/g, "_")}.png`;
      a.click();
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Kartu QR Presensi Siswa
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
              Scannable QR ISO
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            QR code asli terstandarisasi yang dapat di-scan langsung oleh kamera smartphone atau scanner barcode saat jam bimbingan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/absensi?scan=true"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Buka Scanner Presensi</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0e1c16] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#13271f] transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Semua Kartu</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0e1c16] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama siswa atau ID kode kartu..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#08120e] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-[#08120e] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">Semua Cabang</option>
            <option value="Singkut">Cabang Singkut</option>
            <option value="Bangko">Cabang Bangko</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-[#08120e] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="Kelas A">Kelas A</option>
            <option value="Kelas B">Kelas B</option>
            <option value="CLASS A1">CLASS A1</option>
            <option value="CLASS B">CLASS B</option>
            <option value="CLASS C">CLASS C</option>
            <option value="Kelas A2">Kelas A2</option>
          </select>
        </div>
      </div>

      {/* 4-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((st) => {
          const schedule = getClassSchedule(st.className, st.branch);

          return (
            <div
              key={st.id}
              className="bg-white dark:bg-[#0e1c16] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Header: ID code & Branch badge */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider">
                    #{st.studentCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      st.branch === "Singkut"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                    }`}
                  >
                    {st.branch}
                  </span>
                </div>

                {/* Student Identification */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                    {st.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className="font-extrabold text-slate-900 dark:text-slate-100 text-sm truncate"
                      title={st.name}
                    >
                      {st.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                      Kelas: <span className="text-slate-800 dark:text-slate-200">{st.className}</span>
                    </p>
                  </div>
                </div>

                {/* Level & Schedule info */}
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1 truncate">
                  Level: {st.levelCurriculum.split(":")[0]}
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{schedule}</span>
                </div>
              </div>

              {/* REAL SCANNABLE QR CODE */}
              <div className="flex justify-center py-2">
                <div className="p-3 bg-white rounded-2xl shadow-2xs flex flex-col items-center border border-slate-100">
                  <StudentQrImage student={st} size={130} />
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-1.5">
                    MF-{st.studentCode}
                  </span>
                </div>
              </div>

              {/* Bottom Actions: Preview, Cetak & Download */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewStudent(st)}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#13271f] hover:bg-slate-200 dark:hover:bg-[#1a382c] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewStudent(st);
                    setTimeout(() => window.print(), 200);
                  }}
                  className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200 dark:border-emerald-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview & Print Modal */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1c16] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Kartu ID QR Resmi Siswa
              </span>
              <button
                type="button"
                onClick={() => setPreviewStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable ID Card Mockup */}
            <div
              id="printable-card"
              className="p-6 rounded-2xl bg-white text-slate-900 border-2 border-emerald-600 shadow-md space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <img src="/logo.png" alt="Easy Learning House" className="w-8 h-8 object-contain" />
                  <div>
                    <div className="leading-tight font-black text-emerald-900">EASY LEARNING HOUSE</div>
                    <div className="text-[9px] font-bold text-emerald-600">Math Fingers Jaritmatika</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Cabang {previewStudent.branch}
                </span>
              </div>

              <div>
                <div className="text-base font-extrabold text-slate-900">
                  {previewStudent.name}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  ID: #{previewStudent.studentCode}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  {previewStudent.className}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Jadwal: {getClassSchedule(previewStudent.className, previewStudent.branch)}
                </div>
              </div>

              {/* High-res Scannable QR Image */}
              <div className="flex justify-center py-2">
                {previewQrUrl ? (
                  <img
                    src={previewQrUrl}
                    alt="QR Code Siswa"
                    className="w-40 h-40 rounded-xl border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-400">
                    Membuat QR...
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 border-t pt-2">
                Pindai QR ini saat masuk sesi bimbingan jaritmatika
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadQr(previewStudent)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-[#13271f] hover:bg-slate-200 dark:hover:bg-[#1a382c] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu</span>
                </button>
              </div>

              <Link
                href={`/dashboard/absensi?scanId=${previewStudent.id}`}
                className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                Test Scan Presensi Hari Ini
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
