import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { requireSession } from "@/features/identity/server";

export async function POST(req: NextRequest) {
  try {
    // Basic authentication to ensure only logged-in users can upload
    await requireSession();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.name) || ".jpg";
    const filename = `logo-${uniqueSuffix}${extension}`;
    
    // Determine the upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
