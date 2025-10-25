// ============================================
// 📁 File: app/api/products/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db'
};

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(`
      SELECT pc.*, b.brandname, p.project_name 
      FROM ProductCollection pc
      LEFT JOIN Brand b ON pc.brand_id = b.brand_id
      LEFT JOIN Project p ON pc.project_id = p.project_id
      ORDER BY pc.collection_id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function POST(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const body = await request.json();
    const { brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus } = body;
    
    const [result] = await connection.execute(
      `INSERT INTO ProductCollection 
      (brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued || 0, is_focus || 0]
    );
    
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}