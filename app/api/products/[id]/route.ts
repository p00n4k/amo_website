// ============================================
// 📁 File: app/api/products/[id]/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db'
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const body = await request.json();
    const { brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus } = body;
    
    await connection.execute(
      `UPDATE ProductCollection SET 
      brand_id=?, project_id=?, main_type=?, type=?, detail=?, image=?, 
      collection_link=?, status_discontinued=?, is_focus=? 
      WHERE collection_id=?`,
      [brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus, params.id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute('DELETE FROM ProductCollection WHERE collection_id=?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
