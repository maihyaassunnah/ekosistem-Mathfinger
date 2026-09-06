import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/partners - Fetch all partners
export async function GET() {
  try {
    const partners = await prisma.websitePartner.findMany({
      orderBy: { orderIndex: "asc" },
    });

    const formatted = partners.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      logoText: p.logoText,
      logoUrl: p.logoUrl || undefined,
      website: p.website || undefined,
      active: p.isActive,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching website partners:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/website/partners - Add partner
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, logoText, logoUrl, website, active } = body;

    if (!name || !logoText) {
      return NextResponse.json({ error: "Nama mitra dan logo text wajib diisi" }, { status: 400 });
    }

    const count = await prisma.websitePartner.count();

    const created = await prisma.websitePartner.create({
      data: {
        name,
        category: category || "Mitra Sekolah",
        logoText,
        logoUrl: logoUrl || null,
        website: website || null,
        isActive: active ?? true,
        orderIndex: count + 1,
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        name: created.name,
        category: created.category,
        logoText: created.logoText,
        logoUrl: created.logoUrl || undefined,
        website: created.website || undefined,
        active: created.isActive,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating website partner:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/partners - Update partner
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, category, logoText, logoUrl, website, active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID mitra diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websitePartner.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(category ? { category } : {}),
        ...(logoText ? { logoText } : {}),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(active !== undefined ? { isActive: active } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      category: updated.category,
      logoText: updated.logoText,
      logoUrl: updated.logoUrl || undefined,
      website: updated.website || undefined,
      active: updated.isActive,
    });
  } catch (error: any) {
    console.error("Error updating website partner:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/partners - Delete partner
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID mitra diperlukan" }, { status: 400 });
    }

    await prisma.websitePartner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website partner:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
