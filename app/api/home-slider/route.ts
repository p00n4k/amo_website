// ============================================
// 📁 File: app/api/home-slider/route.ts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brand_project_db",
};

// ============================================
// 📦 GET: ดึงภาพทั้งหมดใน Home Slider
// ============================================
export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(`
      SELECT * FROM HomeSlider 
      WHERE is_active = TRUE
      ORDER BY display_order ASC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching slider:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// ➕ POST: เพิ่มภาพใหม่
// ============================================
export async function POST(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const body = await request.json();
    const { image_url, display_order } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "image_url is required" },
        { status: 400 }
      );
    }

    const [result] = await connection.execute(
      `INSERT INTO HomeSlider (image_url, display_order) VALUES (?, ?)`,
      [image_url, display_order || 1]
    );

    return NextResponse.json(
      { success: true, id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// 🗑️ DELETE: ลบภาพ
// ============================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sliderId = searchParams.get("slider_id");

  if (!sliderId) {
    return NextResponse.json({ error: "slider_id is required" }, { status: 400 });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute(`DELETE FROM HomeSlider WHERE slider_id = ?`, [
      sliderId,
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting slider:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
