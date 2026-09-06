import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/hero - Get hero configuration
export async function GET() {
  try {
    let hero = await prisma.websiteHero.findFirst();
    if (!hero) {
      hero = await prisma.websiteHero.create({
        data: {
          tagline: "Bimbel Berhitung Cepat & Logika Anak Juara",
          headline: "Kuasai Matematika Semudah Menghitung Jari Tangan",
          subheadline:
            "Metode Mathfingers terbukti membantu 1,200+ anak usia 4-12 tahun di Singkut & Bangko belajar hitung cepat tambah, kurang, kali, bagi tanpa beban, cepat, akurat, dan penuh keceriaan!",
          promoBanner: "🎉 PROMO SPESIAL SEMESTER BARU: Diskon Biaya Pendaftaran 50% + Free Buku Eksklusif untuk 20 Pendaftar Pertama!",
          promoActive: true,
          whatsappNumber: "6282289456712",
          whatsappGreeting: "Halo Mathfingers, saya ingin mendaftarkan anak saya untuk Free Trial Class.",
          targetDiscount: "50%",
        },
      });
    }

    return NextResponse.json({
      tagline: hero.tagline,
      headline: hero.headline,
      subheadline: hero.subheadline,
      promoBanner: hero.promoBanner || "",
      promoActive: hero.promoActive,
      whatsappNumber: hero.whatsappNumber,
      whatsappGreeting: hero.whatsappGreeting,
      targetDiscount: hero.targetDiscount || "50%",
    });
  } catch (error: any) {
    console.error("Error fetching website hero:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/hero - Update hero configuration
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let hero = await prisma.websiteHero.findFirst();

    if (hero) {
      hero = await prisma.websiteHero.update({
        where: { id: hero.id },
        data: {
          tagline: body.tagline !== undefined ? body.tagline : hero.tagline,
          headline: body.headline !== undefined ? body.headline : hero.headline,
          subheadline: body.subheadline !== undefined ? body.subheadline : hero.subheadline,
          promoBanner: body.promoBanner !== undefined ? body.promoBanner : hero.promoBanner,
          promoActive: body.promoActive !== undefined ? body.promoActive : hero.promoActive,
          whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : hero.whatsappNumber,
          whatsappGreeting: body.whatsappGreeting !== undefined ? body.whatsappGreeting : hero.whatsappGreeting,
          targetDiscount: body.targetDiscount !== undefined ? body.targetDiscount : hero.targetDiscount,
        },
      });
    } else {
      hero = await prisma.websiteHero.create({
        data: {
          tagline: body.tagline || "",
          headline: body.headline || "",
          subheadline: body.subheadline || "",
          promoBanner: body.promoBanner || "",
          promoActive: body.promoActive !== undefined ? body.promoActive : true,
          whatsappNumber: body.whatsappNumber || "6282289456712",
          whatsappGreeting: body.whatsappGreeting || "",
          targetDiscount: body.targetDiscount || "50%",
        },
      });
    }

    return NextResponse.json({
      tagline: hero.tagline,
      headline: hero.headline,
      subheadline: hero.subheadline,
      promoBanner: hero.promoBanner || "",
      promoActive: hero.promoActive,
      whatsappNumber: hero.whatsappNumber,
      whatsappGreeting: hero.whatsappGreeting,
      targetDiscount: hero.targetDiscount || "50%",
    });
  } catch (error: any) {
    console.error("Error updating website hero:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
