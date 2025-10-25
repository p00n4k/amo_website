// ============================================
// 📁 File: app/api/project-images/route.ts
// ============================================

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brand_project_db',
};

interface ProjectImage extends RowDataPacket {
    image_id: number;
    project_id: number;
    image_url: string;
}

export async function GET() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query<ProjectImage[]>(
            'SELECT * FROM ProjectImage ORDER BY project_id, image_id'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project images' },
            { status: 500 }
        );
    } finally {
        if (connection) await connection.end();
    }
}

export async function POST(request: Request) {
    let connection;
    try {
        const body = await request.json();
        const { project_id, image_url } = body;

        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query(
            'INSERT INTO ProjectImage (project_id, image_url) VALUES (?, ?)',
            [project_id, image_url]
        );

        return NextResponse.json({ 
            success: true, 
            id: (result as any).insertId 
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to create project image' },
            { status: 500 }
        );
    } finally {
        if (connection) await connection.end();
    }
}