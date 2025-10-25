// ============================================
// 📁 File: app/api/products/focus/furniture/route.ts
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
    const [rows] = await connection.execute(`
      SELECT 
        pc.collection_id,
        pc.brand_id,
        pc.project_id,
        b.brandname,
        p.project_name,
        pc.main_type,
        pc.type,
        pc.detail,
        pc.image,
        pc.collection_link,
        pc.status_discontinued,
        pc.is_focus
      FROM ProductCollection pc
      LEFT JOIN Brand b ON pc.brand_id = b.brand_id
      LEFT JOIN Project p ON pc.project_id = p.project_id
      WHERE pc.main_type = 'Furniture' 
        AND pc.is_focus = 1
        AND pc.status_discontinued = 0
      ORDER BY pc.collection_id
      LIMIT 4
    `);
    
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch furniture focus products' }, 
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}