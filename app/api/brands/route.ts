// ============================================
// 📁 File: app/api/brands/route.ts
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
    const [rows] = await connection.execute('SELECT * FROM Brand ORDER BY brand_id DESC');
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
    const { brandname, main_type, type, image } = body;
    
    const [result] = await connection.execute(
      'INSERT INTO Brand (brandname, main_type, type, image) VALUES (?, ?, ?, ?)',
      [brandname, main_type, type, image]
    );
    
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
