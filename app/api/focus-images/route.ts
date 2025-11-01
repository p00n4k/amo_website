import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brand_project_db",
};

// 📦 GET
export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM FocusImage ORDER BY display_order ASC, focus_image_id ASC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error loading FocusImage:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ➕ POST
export async function POST(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { image_url, display_order, is_active } = await request.json();
    const [result] = await connection.execute(
      "INSERT INTO FocusImage (image_url, display_order, is_active) VALUES (?, ?, ?)",
      [image_url, display_order || 0, is_active ?? true]
    );
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
  } catch (err) {
    console.error("Error adding FocusImage:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// 🔄 PUT
export async function PUT(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { focus_image_id, image_url, display_order, is_active } = await request.json();
    await connection.execute(
      "UPDATE FocusImage SET image_url=?, display_order=?, is_active=? WHERE focus_image_id=?",
      [image_url, display_order || 0, is_active ?? true, focus_image_id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating FocusImage:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// 🗑️ DELETE
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("focus_image_id");
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute("DELETE FROM FocusImage WHERE focus_image_id=?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting FocusImage:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
