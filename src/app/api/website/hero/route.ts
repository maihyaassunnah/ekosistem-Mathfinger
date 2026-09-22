import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/hero - Get hero & landing page configuration
export async function GET() {
  try {
    let hero = await prisma.websiteHero.findFirst();
    if (!hero) {
      hero = await prisma.websiteHero.create({
        data: {
          tagline: "Bimbel Berhitung Cepat Jaritmatika No. 1 di Sarolangun & Merangin",
          headline: "SELAMAT DATANG DI MATH FINGERS INDONESIA",
          subheadline:
            "Mengoptimalkan potensi kecerdasan otak kanan dan kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, berhitung cepat akurat, dan percaya diri!",
          promoBanner: "🎉 PROMO SPESIAL GELOMBANG BARU: Diskon Biaya Pendaftaran 50% + Modul Belajar & Kartu Digital!",
          promoActive: true,
          whatsappNumber: "6281279498907",
          whatsappGreeting: "Halo Math Fingers, saya ingin mendaftarkan anak saya untuk Sesi Trial Class Gratis.",
          targetDiscount: "50%",
          heroImage: "/images/landing/hero-kids.jpg",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          aboutTitle: "Metode 10 Jari Alami: Kalkulator Pintar yang Selalu Melekat",
          aboutDesc1:
            "Math Fingers hadir memberikan solusi belajar berhitung yang membahagiakan. Melalui formasi 10 jari tangan yang terstandarisasi, anak diajarkan mengolah logika matematika tanpa memerlukan alat bantu sempoa fisik atau kalkulator.",
          aboutDesc2:
            "Metode ini secara aktif melatih sinkronisasi otak kiri (daya logika dan rumus hitung) dengan otak kanan (imajinasi visual gerak jari). Anak tidak lagi menghafal rumus secara mekanis, melainkan memahami konsep angka dengan cepat, tepat, dan gembira.",
          aboutImage: "/images/landing/about-teacher.jpg",
          teacherBadgeText: "8+ Tutor Pengajar",
          teacherBadgeDesc: "Tersertifikasi Nasional & Ramah Anak",
          programsBgImage: "/images/landing/programs-bg.jpg",
          curriculumTitle: "Eksplorasi Program Unggulan Math Fingers",
          curriculumDesc:
            "Setiap anak memiliki ritme belajar unik. Kami menyusun kurikulum berjenjang dari usia 4 hingga 12 tahun yang diuji secara berkala dengan Rapor Kompetensi Digital dan Sertifikat Resmi.",
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
      heroImage: hero.heroImage || "/images/landing/hero-kids.jpg",
      videoUrl: hero.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      aboutTitle: hero.aboutTitle || "Metode 10 Jari Alami: Kalkulator Pintar yang Selalu Melekat",
      aboutDesc1: hero.aboutDesc1 || "",
      aboutDesc2: hero.aboutDesc2 || "",
      aboutImage: hero.aboutImage || "/images/landing/about-teacher.jpg",
      teacherBadgeText: hero.teacherBadgeText || "8+ Tutor Pengajar",
      teacherBadgeDesc: hero.teacherBadgeDesc || "Tersertifikasi Nasional & Ramah Anak",
      programsBgImage: hero.programsBgImage || "/images/landing/programs-bg.jpg",
      curriculumTitle: hero.curriculumTitle || "Eksplorasi Program Unggulan Math Fingers",
      curriculumDesc: hero.curriculumDesc || "",
    });
  } catch (error: any) {
    console.error("Error fetching website hero:", error);
    return NextResponse.json({
      tagline: "Bimbel Berhitung Cepat Jaritmatika No. 1 di Sarolangun & Merangin",
      headline: "SELAMAT DATANG DI MATH FINGERS INDONESIA",
      subheadline:
        "Mengoptimalkan potensi kecerdasan otak kanan dan kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, berhitung cepat akurat, dan percaya diri!",
      promoBanner: "🎉 PROMO SPESIAL GELOMBANG BARU: Diskon Biaya Pendaftaran 50% + Modul Belajar & Kartu Digital!",
      promoActive: true,
      whatsappNumber: "6281279498907",
      whatsappGreeting: "Halo Math Fingers, saya ingin mendaftarkan anak saya untuk Sesi Trial Class Gratis.",
      targetDiscount: "50%",
      heroImage: "/images/landing/hero-kids.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      aboutTitle: "Metode 10 Jari Alami: Kalkulator Pintar yang Selalu Melekat",
      aboutDesc1:
        "Math Fingers hadir memberikan solusi belajar berhitung yang membahagiakan. Melalui formasi 10 jari tangan yang terstandarisasi, anak diajarkan mengolah logika matematika tanpa memerlukan alat bantu sempoa fisik atau kalkulator.",
      aboutDesc2:
        "Metode ini secara aktif melatih sinkronisasi otak kiri (daya logika dan rumus hitung) dengan otak kanan (imajinasi visual gerak jari). Anak tidak lagi menghafal rumus secara mekanis, melainkan memahami konsep angka dengan cepat, tepat, dan gembira.",
      aboutImage: "/images/landing/about-teacher.jpg",
      teacherBadgeText: "8+ Tutor Pengajar",
      teacherBadgeDesc: "Tersertifikasi Nasional & Ramah Anak",
      programsBgImage: "/images/landing/programs-bg.jpg",
      curriculumTitle: "Eksplorasi Program Unggulan Math Fingers",
      curriculumDesc:
        "Setiap anak memiliki ritme belajar unik. Kami menyusun kurikulum berjenjang dari usia 4 hingga 12 tahun yang diuji secara berkala dengan Rapor Kompetensi Digital dan Sertifikat Resmi.",
    });
  }
}

// PUT /api/website/hero - Update hero configuration
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let hero = await prisma.websiteHero.findFirst();

    const dataToSave = {
      ...(body.tagline !== undefined ? { tagline: body.tagline } : {}),
      ...(body.headline !== undefined ? { headline: body.headline } : {}),
      ...(body.subheadline !== undefined ? { subheadline: body.subheadline } : {}),
      ...(body.promoBanner !== undefined ? { promoBanner: body.promoBanner } : {}),
      ...(body.promoActive !== undefined ? { promoActive: Boolean(body.promoActive) } : {}),
      ...(body.whatsappNumber !== undefined ? { whatsappNumber: body.whatsappNumber } : {}),
      ...(body.whatsappGreeting !== undefined ? { whatsappGreeting: body.whatsappGreeting } : {}),
      ...(body.targetDiscount !== undefined ? { targetDiscount: body.targetDiscount } : {}),
      ...(body.heroImage !== undefined ? { heroImage: body.heroImage } : {}),
      ...(body.videoUrl !== undefined ? { videoUrl: body.videoUrl } : {}),
      ...(body.aboutTitle !== undefined ? { aboutTitle: body.aboutTitle } : {}),
      ...(body.aboutDesc1 !== undefined ? { aboutDesc1: body.aboutDesc1 } : {}),
      ...(body.aboutDesc2 !== undefined ? { aboutDesc2: body.aboutDesc2 } : {}),
      ...(body.aboutImage !== undefined ? { aboutImage: body.aboutImage } : {}),
      ...(body.teacherBadgeText !== undefined ? { teacherBadgeText: body.teacherBadgeText } : {}),
      ...(body.teacherBadgeDesc !== undefined ? { teacherBadgeDesc: body.teacherBadgeDesc } : {}),
      ...(body.programsBgImage !== undefined ? { programsBgImage: body.programsBgImage } : {}),
      ...(body.curriculumTitle !== undefined ? { curriculumTitle: body.curriculumTitle } : {}),
      ...(body.curriculumDesc !== undefined ? { curriculumDesc: body.curriculumDesc } : {}),
    };

    if (hero) {
      hero = await prisma.websiteHero.update({
        where: { id: hero.id },
        data: dataToSave,
      });
    } else {
      hero = await prisma.websiteHero.create({
        data: {
          tagline: body.tagline || "Bimbel Berhitung Cepat Jaritmatika No. 1 di Sarolangun & Merangin",
          headline: body.headline || "SELAMAT DATANG DI MATH FINGERS INDONESIA",
          subheadline: body.subheadline || "",
          promoBanner: body.promoBanner || "",
          promoActive: body.promoActive !== undefined ? Boolean(body.promoActive) : true,
          whatsappNumber: body.whatsappNumber || "6281279498907",
          whatsappGreeting: body.whatsappGreeting || "",
          targetDiscount: body.targetDiscount || "50%",
          heroImage: body.heroImage || "/images/landing/hero-kids.jpg",
          videoUrl: body.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
          aboutTitle: body.aboutTitle || "Metode 10 Jari Alami: Kalkulator Pintar yang Selalu Melekat",
          aboutDesc1: body.aboutDesc1 || "",
          aboutDesc2: body.aboutDesc2 || "",
          aboutImage: body.aboutImage || "/images/landing/about-teacher.jpg",
          teacherBadgeText: body.teacherBadgeText || "8+ Tutor Pengajar",
          teacherBadgeDesc: body.teacherBadgeDesc || "Tersertifikasi Nasional & Ramah Anak",
          programsBgImage: body.programsBgImage || "/images/landing/programs-bg.jpg",
          curriculumTitle: body.curriculumTitle || "Eksplorasi Program Unggulan Math Fingers",
          curriculumDesc: body.curriculumDesc || "",
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
      heroImage: hero.heroImage,
      videoUrl: hero.videoUrl,
      aboutTitle: hero.aboutTitle,
      aboutDesc1: hero.aboutDesc1,
      aboutDesc2: hero.aboutDesc2,
      aboutImage: hero.aboutImage,
      teacherBadgeText: hero.teacherBadgeText,
      teacherBadgeDesc: hero.teacherBadgeDesc,
      programsBgImage: hero.programsBgImage,
      curriculumTitle: hero.curriculumTitle,
      curriculumDesc: hero.curriculumDesc,
    });
  } catch (error: any) {
    console.error("Error updating website hero:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
