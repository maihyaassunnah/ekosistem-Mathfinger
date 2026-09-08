"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options?: CustomSelectOption[];
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  id?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options: directOptions,
  children,
  placeholder = "Pilih opsi...",
  className = "",
  menuClassName = "",
  disabled = false,
  size = "md",
  align = "left",
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const selectId = id || autoId;

  // Extract options either from direct prop or parsed <option> children
  const parsedOptions: CustomSelectOption[] = React.useMemo(() => {
    if (directOptions && directOptions.length > 0) {
      return directOptions;
    }
    const opts: CustomSelectOption[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const props = child.props as any;
        if (props.value !== undefined) {
          opts.push({
            value: String(props.value),
            label: typeof props.children === "string" ? props.children : String(props.children || props.value),
          });
        }
      }
    });
    return opts;
  }, [directOptions, children]);

  // Find currently selected option
  const selectedOption = parsedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Handle outside click to close
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

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded-xl",
    md: "px-3.5 py-2 text-xs font-semibold rounded-2xl",
    lg: "px-4 py-2.5 text-sm font-semibold rounded-2xl",
  }[size];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} id={selectId}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer select-none border text-left outline-none active:scale-[0.98] ${sizeClasses} ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-[#1d2d5a] text-slate-400"
            : isOpen
            ? "bg-white dark:bg-[#0b1329] border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white shadow-sm"
            : "bg-white dark:bg-[#0b1329] border-slate-200/90 dark:border-[#1d2d5a] hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs hover:shadow-sm"
        }`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption?.icon}
          <span>{displayLabel}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Floating Popup Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 min-w-full w-max max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0f1a36] border border-slate-200/90 dark:border-[#1d2d5a] rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/60 max-h-64 overflow-y-auto overflow-x-hidden animate-dropdown ${
            align === "right" ? "right-0" : "left-0"
          } ${menuClassName}`}
          style={{ minWidth: "max(100%, 160px)" }}
        >
          <div className="space-y-0.5">
            {parsedOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">Tidak ada opsi</div>
            ) : (
              parsedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-150 active:scale-[0.99] select-none ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5] animate-in zoom-in duration-150" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
