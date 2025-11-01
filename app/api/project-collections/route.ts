// ============================================
// 📁 File: app/api/project-collections/route.ts
// ============================================
// API สำหรับจัดการความสัมพันธ์ระหว่าง Project และ Collection
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
// 📦 GET: ดึง Collections ของ Project
// ============================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    if (projectId) {
      // ดึง Collections ที่เชื่อมกับ Project นี้
      const [rows] = await connection.execute(
        `SELECT 
          pc.collection_id,
          pc.collection_name,
          pc.type,
          prc.display_order,
          prc.project_collection_id
        FROM ProjectCollection prc
        INNER JOIN ProductCollection pc ON prc.collection_id = pc.collection_id
        WHERE prc.project_id = ?
        ORDER BY prc.display_order ASC, pc.collection_name ASC`,
        [projectId]
      );
      return NextResponse.json(rows);
    } else {
      // ดึง Collections ทั้งหมด
      const [rows] = await connection.execute(
        'SELECT collection_id, collection_name, type FROM ProductCollection ORDER BY collection_name ASC'
      );
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error('Error fetching project collections:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// ➕ POST: เพิ่ม Collection ให้ Project
// ============================================
export async function POST(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const body = await request.json();
    const { project_id, collection_id, display_order } = body;

    if (!project_id || !collection_id) {
      return NextResponse.json(
        { error: 'project_id and collection_id are required' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีการเชื่อมอยู่แล้วหรือไม่
    const [existing]: any = await connection.execute(
      'SELECT * FROM ProjectCollection WHERE project_id = ? AND collection_id = ?',
      [project_id, collection_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This collection is already linked to this project' },
        { status: 400 }
      );
    }

    // เพิ่มความสัมพันธ์ใหม่
    const [result] = await connection.execute(
      'INSERT INTO ProjectCollection (project_id, collection_id, display_order) VALUES (?, ?, ?)',
      [project_id, collection_id, display_order || 0]
    );

    return NextResponse.json(
      { success: true, id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding project collection:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// 🔄 PUT: อัปเดต display_order
// ============================================
export async function PUT(request: NextRequest) {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    const body = await request.json();
    const { project_collection_id, display_order } = body;

    if (!project_collection_id) {
      return NextResponse.json(
        { error: 'project_collection_id is required' },
        { status: 400 }
      );
    }

    await connection.execute(
      'UPDATE ProjectCollection SET display_order = ? WHERE project_collection_id = ?',
      [display_order || 0, project_collection_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project collection:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// ============================================
// 🗑️ DELETE: ลบความสัมพันธ์
// ============================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectCollectionId = searchParams.get('project_collection_id');
  const projectId = searchParams.get('project_id');
  const collectionId = searchParams.get('collection_id');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    if (projectCollectionId) {
      // ลบโดยใช้ ID ของความสัมพันธ์
      await connection.execute(
        'DELETE FROM ProjectCollection WHERE project_collection_id = ?',
        [projectCollectionId]
      );
    } else if (projectId && collectionId) {
      // ลบโดยใช้ project_id และ collection_id
      await connection.execute(
        'DELETE FROM ProjectCollection WHERE project_id = ? AND collection_id = ?',
        [projectId, collectionId]
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project collection:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}