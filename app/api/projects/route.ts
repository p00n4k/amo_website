// ============================================
// 📁 File: app/api/projects/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db'
};

// ============================================
// 📦 GET: ดึงข้อมูลโปรเจกต์ทั้งหมด
// ============================================
export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(
      'SELECT project_id, project_name, data_update, project_type as project_category FROM Project ORDER BY project_id DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// ➕ POST: เพิ่มโปรเจกต์ใหม่
// ============================================
export async function POST(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const body = await request.json();
    const { project_name, data_update, project_category } = body;

    const [result] = await connection.execute(
      'INSERT INTO Project (project_name, data_update, project_type) VALUES (?, ?, ?)',
      [project_name, data_update, project_category || 'Residential']
    );

    return NextResponse.json(
      { success: true, id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}