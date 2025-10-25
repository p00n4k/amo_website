// ============================================
// 📁 File: app/api/brands/[id]/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db'
};

const pool = mysql.createPool(dbConfig);

// 🟢 PUT: Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { brandname, main_type, type, image } = body;

    if (!brandname) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const [result]: any = await pool.execute(
      'UPDATE Brand SET brandname=?, main_type=?, type=?, image=? WHERE brand_id=?',
      [brandname, main_type, type, image, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /brands error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// 🟢 DELETE: Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result]: any = await pool.execute('DELETE FROM Brand WHERE brand_id=?', [params.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /brands error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
