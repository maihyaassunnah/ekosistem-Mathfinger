"use client";

import React from "react";

interface TopStatusBarProps {
  title: string;
}

export default function TopStatusBar({ title }: TopStatusBarProps) {
  return (
    <div className="flex items-center justify-between py-2 px-1 mb-2">
      {/* Breadcrumb / Section Name */}
      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {title}
      </div>
    </div>
  );
}
