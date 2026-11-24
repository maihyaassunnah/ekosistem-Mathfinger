import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET /uploads/[...filename] - Dynamically serve runtime uploaded files
export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params;
    const requestedPath = Array.isArray(filename) ? filename.join("/") : filename;

    // Secure path check - prevent path traversal
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[\/\\])+/, "");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, safePath);

    if (!fs.existsSync(filePath)) {
      // 1. Check if file exists in /app/public/uploads or /tmp/vps_uploads as fallback
      const altPath = path.join("/app/public/uploads", safePath);
      if (fs.existsSync(altPath)) {
        const fileBuffer = fs.readFileSync(altPath);
        return createResponse(altPath, fileBuffer);
      }

      // 2. Fallback: Auto-fetch & cache from VPS production domain if running on local
      try {
        const vpsBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith("http") && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
          ? process.env.NEXT_PUBLIC_APP_URL
          : "https://mathfingers.my.id";
        const remoteUrl = `${vpsBaseUrl}/uploads/${safePath}`;
        const remoteRes = await fetch(remoteUrl, { cache: "no-store" });
        if (remoteRes.ok) {
          const arrayBuffer = await remoteRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          try {
            await fs.promises.mkdir(uploadsDir, { recursive: true });
            await fs.promises.writeFile(filePath, buffer);
          } catch {}
          return createResponse(filePath, buffer);
        }
      } catch (proxyErr) {
        console.warn("Auto-sync from VPS failed:", proxyErr);
      }

      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return createResponse(filePath, fileBuffer);
  } catch (err: any) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function createResponse(filePath: string, buffer: Buffer) {
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
