// ============================================
// 📁 File: app/api/projects/latest/route.ts
// ดึง 4 โปรเจกต์ล่าสุดพร้อมข้อมูลที่เกี่ยวข้อง
// ============================================
import { NextResponse } from 'next/server';
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
    // ดึง 4 โปรเจกต์ล่าสุด เรียงตาม data_update
    const [projects] = await connection.execute(`
      SELECT 
        p.project_id,
        p.project_name,
        p.data_update,
        (
          SELECT pi.image_url 
          FROM ProjectImage pi 
          WHERE pi.project_id = p.project_id 
          LIMIT 1
        ) as cover_image,
        (
          SELECT COUNT(*) 
          FROM ProjectImage pi 
          WHERE pi.project_id = p.project_id
        ) as image_count,
        (
          SELECT GROUP_CONCAT(DISTINCT pc.main_type SEPARATOR ', ')
          FROM ProductCollection pc
          WHERE pc.project_id = p.project_id
        ) as main_types,
        (
          SELECT pc.detail
          FROM ProductCollection pc
          WHERE pc.project_id = p.project_id
          LIMIT 1
        ) as primary_material
      FROM Project p
      ORDER BY p.data_update DESC
      LIMIT 4
    `);
    
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest projects' }, 
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}