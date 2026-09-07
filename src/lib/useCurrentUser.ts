"use client";

import { useSession } from "next-auth/react";
import { CURRENT_USER } from "@/lib/mock-data";

export interface CurrentUserInfo {
  id?: string;
  name: string;
  email: string;
  role: string;
  branchName: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  isBranchAdmin: boolean;
  isBranchAssistant: boolean;
  isTutor: boolean;
  allowedBranch: string | null;
  canAccess: (pathname: string) => boolean;
}

export function useCurrentUser(): CurrentUserInfo {
  const sessionResult = useSession();
  const session = sessionResult?.data;

  // Check localStorage for active user override (useful during offline, local testing, or initial session hydration)
  let localUser: any = null;
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("mf_logged_user");
      if (saved) localUser = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  let rawName = session?.user?.name || localUser?.name || CURRENT_USER.name;
  const rawEmail = session?.user?.email || localUser?.email || CURRENT_USER.email;
  const rawRole = ((session?.user as any)?.role || localUser?.role || CURRENT_USER.role) as string;
  const rawBranch = ((session?.user as any)?.branchName || localUser?.branchName || (CURRENT_USER as any).branch || "Semua Cabang (Pusat)") as string;
  const avatarUrl = session?.user?.image || localUser?.avatarUrl || CURRENT_USER.avatar;

  // Exact user requirement: if account is febri, display as Ustadzah Febri
  if (rawEmail.toLowerCase().includes("febri") || rawName.toLowerCase().includes("febri")) {
    rawName = "Ustadzah Febri";
  }

  const isSuperAdmin =
    rawRole === "SUPER_ADMIN" ||
    rawRole === "Super Admin" ||
    rawEmail.toLowerCase() === "wahyudinhafiz123@gmail.com" ||
    rawEmail.toLowerCase() === "ma.ihyaassunnah@gmail.com" ||
    rawEmail.toLowerCase().includes("superadmin");

  const isBranchAssistant =
    !isSuperAdmin &&
    (rawRole === "BRANCH_ASSISTANT" ||
      rawRole === "Asisten Cabang" ||
      rawEmail.toLowerCase().includes("asisten"));

  const isBranchAdmin =
    !isSuperAdmin &&
    !isBranchAssistant &&
    (rawRole === "BRANCH_ADMIN" ||
      rawRole === "Admin Cabang" ||
      rawEmail.toLowerCase().includes("singkut.mathfingers") ||
      rawEmail.toLowerCase().includes("bangko.mathfingers") ||
      rawEmail.toLowerCase().includes("febriantidewi") ||
      rawEmail.toLowerCase().includes("dwsafitri"));

  const isTutor =
    !isSuperAdmin &&
    !isBranchAdmin &&
    !isBranchAssistant &&
    (rawRole === "TUTOR" || rawRole === "Tutor" || rawRole === "Pengajar");

  let allowedBranch: string | null = null;
  if (!isSuperAdmin) {
    if (rawBranch && !rawBranch.toLowerCase().includes("pusat") && !rawBranch.toLowerCase().includes("semua")) {
      allowedBranch = rawBranch.replace(/^Cabang\s+/i, "").trim();
    } else if (rawEmail.toLowerCase().includes("bangko") || rawEmail.toLowerCase().includes("dwsafitri")) {
      allowedBranch = "Tabir Timur";
    } else {
      allowedBranch = "Singkut";
    }
  }

  const canAccess = (pathname: string): boolean => {
    if (isSuperAdmin) return true;

    // Admin Cabang cannot access Cabang, Pengaturan, Database, and Website
    if (isBranchAdmin) {
      if (pathname.startsWith("/dashboard/cabang")) return false;
      if (pathname.startsWith("/dashboard/pengaturan")) return false;
      if (pathname.startsWith("/dashboard/database")) return false;
      if (pathname.startsWith("/dashboard/website")) return false;
      return true;
    }

    // Asisten Cabang cannot access Cabang, Pengaturan, Database, Website, and Keuangan (SPP, Riwayat SPP, Arus Keuangan)
    if (isBranchAssistant) {
      if (pathname.startsWith("/dashboard/cabang")) return false;
      if (pathname.startsWith("/dashboard/pengaturan")) return false;
      if (pathname.startsWith("/dashboard/database")) return false;
      if (pathname.startsWith("/dashboard/website")) return false;
      if (pathname.startsWith("/dashboard/arus-keuangan")) return false;
      if (pathname.startsWith("/dashboard/riwayat-spp")) return false;
      if (pathname.startsWith("/dashboard/spp")) return false;
      return true;
    }

    // Tutor has same restrictions as assistant
    if (isTutor) {
      if (pathname.startsWith("/dashboard/cabang")) return false;
      if (pathname.startsWith("/dashboard/pengaturan")) return false;
      if (pathname.startsWith("/dashboard/database")) return false;
      if (pathname.startsWith("/dashboard/website")) return false;
      if (pathname.startsWith("/dashboard/arus-keuangan")) return false;
      if (pathname.startsWith("/dashboard/riwayat-spp")) return false;
      if (pathname.startsWith("/dashboard/spp")) return false;
      return true;
    }

    return true;
  };

  return {
    id: (session?.user as any)?.id,
    name: rawName,
    email: rawEmail,
    role: isSuperAdmin
      ? "Super Admin"
      : isBranchAdmin
      ? "Admin Cabang"
      : isBranchAssistant
      ? "Asisten Cabang"
      : isTutor
      ? "Tutor"
      : rawRole,
    branchName: allowedBranch ? `Cabang ${allowedBranch}` : "Semua Cabang (Pusat)",
    avatarUrl,
    isSuperAdmin,
    isBranchAdmin,
    isBranchAssistant,
    isTutor,
    allowedBranch,
    canAccess,
  };
}
