"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X, Users } from "lucide-react";

export interface StudentOption {
  id: string;
  name: string;
  className?: string;
  branch?: string;
  programType?: string;
}

interface MultiStudentSelectProps {
  students: StudentOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
  targetClassName?: string; // e.g. "CLASS A (Singkut)" to provide quick select for that class
  size?: "sm" | "md" | "lg";
}

export default function MultiStudentSelect({
  students,
  selectedIds,
  onChange,
  placeholder = "Pilih satu atau beberapa siswa...",
  className = "",
  targetClassName,
  size = "md",
}: MultiStudentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.className && s.className.toLowerCase().includes(q)) ||
        (s.branch && s.branch.toLowerCase().includes(q))
    );
  }, [students, search]);

  // Students matching target class (if specified)
  const classStudents = useMemo(() => {
    if (!targetClassName) return [];
    return students.filter(
      (s) => s.className && s.className.toLowerCase() === targetClassName.toLowerCase()
    );
  }, [students, targetClassName]);

  const toggleSelectStudent = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const newIds = new Set(selectedIds);
    filteredStudents.forEach((s) => newIds.add(s.id));
    onChange(Array.from(newIds));
  };

  const handleSelectAllClass = () => {
    if (classStudents.length === 0) return;
    const newIds = new Set(selectedIds);
    classStudents.forEach((s) => newIds.add(s.id));
    onChange(Array.from(newIds));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  // Label to display in trigger button
  const displayLabel = useMemo(() => {
    if (selectedIds.length === 0) {
      return <span className="text-slate-400 dark:text-slate-500 font-normal">{placeholder}</span>;
    }

    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    if (selectedStudents.length === 1) {
      return (
        <span className="text-slate-900 dark:text-white font-semibold truncate">
          {selectedStudents[0].name}{" "}
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            ({selectedStudents[0].className || selectedStudents[0].branch})
          </span>
        </span>
      );
    }

    const firstTwo = selectedStudents.slice(0, 2).map((s) => s.name);
    const remainder = selectedStudents.length - 2;

    return (
      <div className="flex items-center gap-1.5 truncate">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
          {selectedIds.length} Siswa Terpilih
        </span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
          {firstTwo.join(", ")}
          {remainder > 0 && ` +${remainder} lainnya`}
        </span>
      </div>
    );
  }, [selectedIds, students, placeholder]);

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded-xl",
    md: "px-3.5 py-2 text-xs font-semibold rounded-2xl",
    lg: "px-4 py-2.5 text-sm font-semibold rounded-2xl",
  }[size];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 border bg-white dark:bg-[#0b1329] border-slate-300 dark:border-[#1d2d5a] text-slate-900 dark:text-white hover:border-emerald-500 dark:hover:border-emerald-500 transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-left cursor-pointer ${sizeClasses}`}
      >
        <div className="flex items-center gap-2 truncate overflow-hidden">
          <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <div className="truncate">{displayLabel}</div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedIds.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleDeselectAll();
              }}
              title="Hapus semua pilihan"
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-emerald-600" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-[#1d2d5a] rounded-2xl shadow-2xl p-2.5 space-y-2 max-h-[380px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-[#1d2d5a] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
              autoFocus
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-1 pb-1 border-b border-slate-100 dark:border-[#1d2d5a]/60 text-[11px]">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold transition-colors cursor-pointer"
            >
              ✓ Pilih Semua ({filteredStudents.length})
            </button>

            {targetClassName && classStudents.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllClass}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold transition-colors cursor-pointer"
              >
                Pilih Kelas {targetClassName} ({classStudents.length})
              </button>
            )}

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 font-bold transition-colors ml-auto cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Student List */}
          <div className="overflow-y-auto space-y-1 pr-1 flex-1 min-h-[120px] max-h-[220px]">
            {filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                Tidak ada siswa yang sesuai
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => toggleSelectStudent(student.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors select-none ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0b1329]"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="truncate">
                        <span className="block truncate font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {student.className || "Kelas Reguler"} • {student.branch || "Singkut"}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0 ml-2">
                        Dipilih
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#1d2d5a]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 px-1">
            <span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{selectedIds.length}</strong> dari{" "}
              {students.length} siswa dipilih
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
