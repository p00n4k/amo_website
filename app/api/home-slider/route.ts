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

// GET - ดึงข้อมูล Home Sliders ทั้งหมด
export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM HomeSlider WHERE is_active = TRUE ORDER BY display_order ASC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching home sliders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch home sliders' },
            { status: 500 }
        );
    }
}

// POST - เพิ่ม Slider ใหม่
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image_url } = body;

        if (!image_url) {
            return NextResponse.json(
                { error: 'Image URL is required' },
                { status: 400 }
            );
        }

        // หา display_order สูงสุด
        const [maxOrder]: any = await pool.query(
            'SELECT MAX(display_order) as max_order FROM HomeSlider'
        );
        const nextOrder = (maxOrder[0]?.max_order || 0) + 1;

        const [result]: any = await pool.query(
            'INSERT INTO HomeSlider (image_url, display_order) VALUES (?, ?)',
            [image_url, nextOrder]
        );

        return NextResponse.json({
            message: 'Slider added successfully',
            slider_id: result.insertId
        });
    } catch (error) {
        console.error('Error adding slider:', error);
        return NextResponse.json(
            { error: 'Failed to add slider' },
            { status: 500 }
        );
    }
}

// PUT - อัปเดตลำดับ Sliders
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { sliders } = body; // Array of { slider_id, display_order }

        if (!Array.isArray(sliders)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const slider of sliders) {
                await connection.query(
                    'UPDATE HomeSlider SET display_order = ? WHERE slider_id = ?',
                    [slider.display_order, slider.slider_id]
                );
            }

            await connection.commit();
            return NextResponse.json({ message: 'Slider order updated successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating slider order:', error);
        return NextResponse.json(
            { error: 'Failed to update slider order' },
            { status: 500 }
        );
    }
}