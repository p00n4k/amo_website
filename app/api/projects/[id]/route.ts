// ============================================
// 📁 File: app/api/projects/[id]/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db',
};

// ============================================
// 🟩 PUT: Update a project
// ============================================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const body = await request.json();
    const { project_name, data_update, project_category } = body;

    // ✅ Await params before use
    const { id } = await context.params;

    await connection.execute(
      `UPDATE Project 
       SET project_name = ?, 
           data_update = ?, 
           project_category = ?
       WHERE project_id = ?`,
      [project_name, data_update, project_category, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// 🟥 DELETE: Delete a project
// ============================================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    // ✅ Await params before use
    const { id } = await context.params;

    await connection.execute('DELETE FROM Project WHERE project_id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
