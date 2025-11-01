// ============================================
// 📁 File: app/api/home-slider/upload/route.ts
// ============================================
// API สำหรับอัปโหลดภาพ HomeSlider
// ============================================

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // ต้องใช้ node runtime

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ตั้งชื่อไฟล์ใหม่แบบสุ่ม
    const fileExt = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/home");

    // ถ้าโฟลเดอร์ยังไม่มีให้สร้าง
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // บันทึกไฟล์
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // path ที่ใช้บนหน้าเว็บ
    const publicUrl = `/uploads/home/${fileName}`;

    return NextResponse.json({ success: true, image_url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
