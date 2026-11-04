import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

// GET /uploads/[...path] - Dynamic upload server (Works on both Localhost & Docker Standalone)
export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const filename = pathSegments.join("/");

    // Prevent directory traversal
    const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(process.cwd(), "public", "uploads", safePath);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    // Determine mime type
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
