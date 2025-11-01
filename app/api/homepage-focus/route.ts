import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brand_project_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET - ดึงข้อมูล Homepage Focus
export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM HomepageFocus WHERE is_active = TRUE LIMIT 1'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching homepage focus:', error);
        return NextResponse.json(
            { error: 'Failed to fetch homepage focus' },
            { status: 500 }
        );
    }
}

// POST - เพิ่มหรืออัปเดต Homepage Focus
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { brand_name, brand_logo, description, made_in, brand_link } = body;

        if (!brand_name) {
            return NextResponse.json(
                { error: 'Brand name is required' },
                { status: 400 }
            );
        }

        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const [existing]: any = await pool.query(
            'SELECT focus_id FROM HomepageFocus WHERE is_active = TRUE LIMIT 1'
        );

        if (existing.length > 0) {
            // อัปเดตข้อมูลเดิม
            await pool.query(
                `UPDATE HomepageFocus 
                SET brand_name = ?, brand_logo = ?, description = ?, 
                    made_in = ?, brand_link = ?, updated_at = CURRENT_TIMESTAMP
                WHERE focus_id = ?`,
                [brand_name, brand_logo || '', description || '', made_in || '', brand_link || '', existing[0].focus_id]
            );

            return NextResponse.json({
                message: 'Homepage focus updated successfully',
                focus_id: existing[0].focus_id
            });
        } else {
            // เพิ่มข้อมูลใหม่
            const [result]: any = await pool.query(
                `INSERT INTO HomepageFocus 
                (brand_name, brand_logo, description, made_in, brand_link) 
                VALUES (?, ?, ?, ?, ?)`,
                [brand_name, brand_logo || '', description || '', made_in || '', brand_link || '']
            );

            return NextResponse.json({
                message: 'Homepage focus created successfully',
                focus_id: result.insertId
            });
        }
    } catch (error) {
        console.error('Error saving homepage focus:', error);
        return NextResponse.json(
            { error: 'Failed to save homepage focus' },
            { status: 500 }
        );
    }
}