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
  allowedBranch: "Singkut" | "Bangko" | null;
  canAccess: (pathname: string) => boolean;
}

export function useCurrentUser(): CurrentUserInfo {
  const sessionResult = useSession();
  const session = sessionResult?.data;

  const rawName = session?.user?.name || CURRENT_USER.name;
  const rawEmail = session?.user?.email || CURRENT_USER.email;
  const rawRole = ((session?.user as any)?.role || CURRENT_USER.role) as string;
  const rawBranch = ((session?.user as any)?.branchName || (CURRENT_USER as any).branch || "Semua Cabang (Pusat)") as string;
  const avatarUrl = session?.user?.image || CURRENT_USER.avatar;

  const isSuperAdmin =
    rawRole === "SUPER_ADMIN" ||
    rawRole === "Super Admin" ||
    rawEmail.toLowerCase() === "wahyudinhafiz123@gmail.com" ||
    rawEmail.toLowerCase() === "ma.ihyaassunnah@gmail.com";

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

  let allowedBranch: "Singkut" | "Bangko" | null = null;
  if (!isSuperAdmin) {
    if (rawBranch.toLowerCase().includes("bangko") || rawEmail.toLowerCase().includes("bangko")) {
      allowedBranch = "Bangko";
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
