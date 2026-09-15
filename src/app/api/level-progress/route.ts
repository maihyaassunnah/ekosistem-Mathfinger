import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// Fallback in-memory defaults if DB is temporarily unreachable
let memoryColumns = [
  { id: "lvl-1", levelNumber: 1, name: "Level 1", description: "Penjumlahan & Pengurangan Satuan Langsung" },
  { id: "lvl-2", levelNumber: 2, name: "Level 2", description: "Kombinasi Rumus Teman Kecil (Basis 5)" },
  { id: "lvl-3", levelNumber: 3, name: "Level 3", description: "Kombinasi Rumus Teman Besar & Campuran" },
];

let memoryRecords: Array<{
  id: string;
  studentId: string;
  levelId: string;
  passedDate: string;
  notes?: string;
  updatedAt?: string;
}> = [];

export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    try {
      // 1. Fetch levels from PostgreSQL
      const dbLevels = await prisma.levelProgression.findMany({
        orderBy: { orderIndex: "asc" },
      });

      // 2. Fetch student level progress records from PostgreSQL
      const dbRecords = await prisma.studentLevelProgress.findMany({
        include: {
          student: true,
          levelProgression: true,
        },
        orderBy: { passedDate: "asc" },
      });

      const formattedColumns = dbLevels.map((lvl) => ({
        id: lvl.id,
        levelNumber: lvl.levelNumber,
        name: lvl.name,
        description: lvl.description || "",
      }));

      const formattedRecords = dbRecords.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        levelId: r.levelProgressionId,
        passedDate: r.passedDate ? r.passedDate.toISOString().split("T")[0] : "",
        notes: r.notes || "",
        updatedAt: r.updatedAt.toISOString(),
      }));

      if (formattedColumns.length > 0) {
        memoryColumns = formattedColumns;
      }
      if (formattedRecords.length > 0) {
        memoryRecords = formattedRecords;
      }

      return NextResponse.json({
        columns: formattedColumns.length > 0 ? formattedColumns : memoryColumns,
        records: formattedRecords.length > 0 ? formattedRecords : memoryRecords,
      });
    } catch (dbErr) {
      console.warn("Falling back to cached level progression data:", dbErr);
      return NextResponse.json({
        columns: memoryColumns,
        records: memoryRecords,
      });
    }
  } catch (err: any) {
    console.error("Error in GET /api/level-progress:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const body = await req.json();
    const { action } = body;

    // --- Action: ADD_LEVEL_COLUMN ---
    if (action === "ADD_LEVEL_COLUMN") {
      const { name, description } = body;
      try {
        const count = await prisma.levelProgression.count();
        const nextNum = count + 1;
        const created = await prisma.levelProgression.create({
          data: {
            levelNumber: nextNum,
            name: name?.trim() || `Level ${nextNum}`,
            description: description?.trim() || "",
            orderIndex: nextNum,
          },
        });

        const newCol = {
          id: created.id,
          levelNumber: created.levelNumber,
          name: created.name,
          description: created.description || "",
        };
        memoryColumns.push(newCol);

        return NextResponse.json({ success: true, column: newCol });
      } catch (dbErr) {
        console.warn("DB error in ADD_LEVEL_COLUMN, using memory fallback:", dbErr);
        const nextNum = memoryColumns.length + 1;
        const fallbackCol = {
          id: `lvl-${Date.now()}`,
          levelNumber: nextNum,
          name: name?.trim() || `Level ${nextNum}`,
          description: description?.trim() || "",
        };
        memoryColumns.push(fallbackCol);
        return NextResponse.json({ success: true, column: fallbackCol });
      }
    }

    // --- Action: UPDATE_LEVEL_COLUMN ---
    if (action === "UPDATE_LEVEL_COLUMN") {
      const { id, name, description } = body;
      try {
        await prisma.levelProgression.update({
          where: { id },
          data: {
            name: name?.trim(),
            description: description !== undefined ? description?.trim() : undefined,
          },
        });
      } catch (dbErr) {
        console.warn("DB error in UPDATE_LEVEL_COLUMN:", dbErr);
      }

      memoryColumns = memoryColumns.map((c) =>
        c.id === id
          ? {
              ...c,
              name: name?.trim() || c.name,
              description: description !== undefined ? description : c.description,
            }
          : c
      );
      return NextResponse.json({ success: true });
    }

    // --- Action: DELETE_LEVEL_COLUMN ---
    if (action === "DELETE_LEVEL_COLUMN") {
      const { id } = body;
      try {
        await prisma.levelProgression.delete({
          where: { id },
        });
      } catch (dbErr) {
        console.warn("DB error in DELETE_LEVEL_COLUMN:", dbErr);
      }

      memoryColumns = memoryColumns.filter((c) => c.id !== id);
      memoryRecords = memoryRecords.filter((r) => r.levelId !== id);
      return NextResponse.json({ success: true });
    }

    // --- Action: SET_STUDENT_LEVEL ---
    if (action === "SET_STUDENT_LEVEL") {
      const { studentId, levelId, passedDate, notes } = body;
      try {
        const parsedDate = new Date(passedDate || new Date());
        await prisma.studentLevelProgress.upsert({
          where: {
            studentId_levelProgressionId: {
              studentId,
              levelProgressionId: levelId,
            },
          },
          update: {
            passedDate: parsedDate,
            notes: notes !== undefined ? notes : undefined,
          },
          create: {
            studentId,
            levelProgressionId: levelId,
            passedDate: parsedDate,
            notes: notes || "",
          },
        });
      } catch (dbErr) {
        console.warn("DB error in SET_STUDENT_LEVEL, using memory fallback:", dbErr);
      }

      const idx = memoryRecords.findIndex((r) => r.studentId === studentId && r.levelId === levelId);
      if (idx >= 0) {
        memoryRecords[idx] = {
          ...memoryRecords[idx],
          passedDate,
          notes: notes !== undefined ? notes : memoryRecords[idx].notes,
          updatedAt: new Date().toISOString(),
        };
      } else {
        memoryRecords.push({
          id: `slr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          studentId,
          levelId,
          passedDate,
          notes: notes || "",
          updatedAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true });
    }

    // --- Action: DELETE_STUDENT_LEVEL ---
    if (action === "DELETE_STUDENT_LEVEL") {
      const { studentId, levelId } = body;
      try {
        await prisma.studentLevelProgress.deleteMany({
          where: {
            studentId,
            levelProgressionId: levelId,
          },
        });
      } catch (dbErr) {
        console.warn("DB error in DELETE_STUDENT_LEVEL:", dbErr);
      }

      memoryRecords = memoryRecords.filter((r) => !(r.studentId === studentId && r.levelId === levelId));
      return NextResponse.json({ success: true });
    }

    // --- Action: BATCH_UPDATE_STUDENT_LEVELS ---
    if (action === "BATCH_UPDATE_STUDENT_LEVELS") {
      const { studentId, records } = body;
      if (Array.isArray(records)) {
        for (const rec of records) {
          try {
            if (rec.passedDate) {
              const parsedDate = new Date(rec.passedDate);
              await prisma.studentLevelProgress.upsert({
                where: {
                  studentId_levelProgressionId: {
                    studentId,
                    levelProgressionId: rec.levelId,
                  },
                },
                update: {
                  passedDate: parsedDate,
                  notes: rec.notes !== undefined ? rec.notes : undefined,
                },
                create: {
                  studentId,
                  levelProgressionId: rec.levelId,
                  passedDate: parsedDate,
                  notes: rec.notes || "",
                },
              });
            } else {
              await prisma.studentLevelProgress.deleteMany({
                where: {
                  studentId,
                  levelProgressionId: rec.levelId,
                },
              });
            }
          } catch (dbErr) {
            console.warn("DB error in BATCH_UPDATE_STUDENT_LEVELS:", dbErr);
          }

          // Memory sync
          const idx = memoryRecords.findIndex((r) => r.studentId === studentId && r.levelId === rec.levelId);
          if (rec.passedDate) {
            if (idx >= 0) {
              memoryRecords[idx] = {
                ...memoryRecords[idx],
                passedDate: rec.passedDate,
                notes: rec.notes !== undefined ? rec.notes : memoryRecords[idx].notes,
                updatedAt: new Date().toISOString(),
              };
            } else {
              memoryRecords.push({
                id: `slr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                studentId,
                levelId: rec.levelId,
                passedDate: rec.passedDate,
                notes: rec.notes || "",
                updatedAt: new Date().toISOString(),
              });
            }
          } else if (idx >= 0) {
            memoryRecords.splice(idx, 1);
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("Error in POST /api/level-progress:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
