import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_READING_LEVELS = [
  { levelName: "Pra-Membaca", description: "Belum mengenal huruf, masih dalam tahap pengenalan", orderIndex: 1, colorCode: "#ef4444" },
  { levelName: "Mengenal Huruf", description: "Hafal huruf A-Z, belum bisa merangkai suku kata", orderIndex: 2, colorCode: "#f97316" },
  { levelName: "Suku Kata", description: "Bisa membaca suku kata sederhana (ba, bi, bu, be, bo)", orderIndex: 3, colorCode: "#eab308" },
  { levelName: "Kata", description: "Bisa membaca kata-kata sederhana dengan lancar", orderIndex: 4, colorCode: "#84cc16" },
  { levelName: "Kalimat", description: "Bisa membaca kalimat pendek dengan benar", orderIndex: 5, colorCode: "#22c55e" },
  { levelName: "Paragraf", description: "Bisa membaca paragraf dengan intonasi yang baik", orderIndex: 6, colorCode: "#06b6d4" },
  { levelName: "Lancar / Lulus", description: "Membaca lancar dan mandiri dengan pemahaman baik", orderIndex: 7, colorCode: "#8b5cf6" },
];

export async function GET() {
  try {
    let levels = await prisma.readingLevel.findMany({ orderBy: { orderIndex: "asc" } });
    if (levels.length === 0) {
      await prisma.readingLevel.createMany({ data: DEFAULT_READING_LEVELS });
      levels = await prisma.readingLevel.findMany({ orderBy: { orderIndex: "asc" } });
    }
    return NextResponse.json(levels);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { levelName, description, orderIndex, colorCode } = await req.json();
    if (!levelName) return NextResponse.json({ error: "Nama level wajib diisi" }, { status: 400 });
    const created = await prisma.readingLevel.create({
      data: { levelName, description: description || null, orderIndex: orderIndex || 1, colorCode: colorCode || "#22c55e" },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, levelName, description, orderIndex, colorCode } = await req.json();
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    const updated = await prisma.readingLevel.update({
      where: { id },
      data: {
        ...(levelName ? { levelName } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(orderIndex !== undefined ? { orderIndex } : {}),
        ...(colorCode !== undefined ? { colorCode } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    await prisma.readingLevel.delete({ where: { id } });
    return NextResponse.json({ message: "Level berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
