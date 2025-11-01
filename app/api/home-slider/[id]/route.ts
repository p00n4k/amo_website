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

// DELETE - ลบ Slider (ต้องเหลืออย่างน้อย 3 รูป)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const sliderId = parseInt(params.id);

        // ตรวจสอบจำนวน slider ที่เหลือ
        const [count]: any = await pool.query(
            'SELECT COUNT(*) as total FROM HomeSlider WHERE is_active = TRUE'
        );

        if (count[0].total <= 3) {
            return NextResponse.json(
                { error: 'ต้องมีรูปอย่างน้อย 3 รูป' },
                { status: 400 }
            );
        }

        await pool.query(
            'DELETE FROM HomeSlider WHERE slider_id = ?',
            [sliderId]
        );

        return NextResponse.json({ message: 'Slider deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider:', error);
        return NextResponse.json(
            { error: 'Failed to delete slider' },
            { status: 500 }
        );
    }
}