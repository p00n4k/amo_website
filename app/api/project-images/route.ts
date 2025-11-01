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

// GET - ดึงรูปภาพของโปรเจกต์ทั้งหมด
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        let query = 'SELECT * FROM ProjectImage';
        const params: any[] = [];

        if (projectId) {
            query += ' WHERE project_id = ? ORDER BY display_order ASC, image_id ASC';
            params.push(parseInt(projectId));
        } else {
            query += ' ORDER BY project_id, display_order ASC, image_id ASC';
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching project images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project images' },
            { status: 500 }
        );
    }
}

// POST - เพิ่มรูปภาพใหม่ในโปรเจกต์
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { project_id, image_url, caption, is_cover } = body;

        if (!project_id || !image_url) {
            return NextResponse.json(
                { error: 'Project ID and image URL are required' },
                { status: 400 }
            );
        }

        // หา display_order สูงสุดของโปรเจกต์นั้น
        const [maxOrder]: any = await pool.query(
            'SELECT MAX(display_order) as max_order FROM ProjectImage WHERE project_id = ?',
            [project_id]
        );
        const nextOrder = (maxOrder[0]?.max_order || 0) + 1;

        // ถ้าเป็นรูป cover ให้ update รูปเก่าทั้งหมดเป็น false
        if (is_cover) {
            await pool.query(
                'UPDATE ProjectImage SET is_cover = FALSE WHERE project_id = ?',
                [project_id]
            );
        }

        const [result]: any = await pool.query(
            `INSERT INTO ProjectImage (project_id, image_url, display_order, caption, is_cover) 
            VALUES (?, ?, ?, ?, ?)`,
            [project_id, image_url, nextOrder, caption || null, is_cover || false]
        );

        return NextResponse.json({
            message: 'Image added successfully',
            image_id: result.insertId
        });
    } catch (error) {
        console.error('Error adding project image:', error);
        return NextResponse.json(
            { error: 'Failed to add project image' },
            { status: 500 }
        );
    }
}

// PUT - อัปเดตข้อมูลรูปภาพ
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { image_id, caption, display_order, is_cover, project_id } = body;

        if (!image_id) {
            return NextResponse.json(
                { error: 'Image ID is required' },
                { status: 400 }
            );
        }

        // ถ้าเป็นการตั้งเป็น cover ให้ update รูปเก่าทั้งหมดเป็น false
        if (is_cover && project_id) {
            await pool.query(
                'UPDATE ProjectImage SET is_cover = FALSE WHERE project_id = ? AND image_id != ?',
                [project_id, image_id]
            );
        }

        const updates: string[] = [];
        const params: any[] = [];

        if (caption !== undefined) {
            updates.push('caption = ?');
            params.push(caption);
        }
        if (display_order !== undefined) {
            updates.push('display_order = ?');
            params.push(display_order);
        }
        if (is_cover !== undefined) {
            updates.push('is_cover = ?');
            params.push(is_cover);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        params.push(image_id);

        await pool.query(
            `UPDATE ProjectImage SET ${updates.join(', ')} WHERE image_id = ?`,
            params
        );

        return NextResponse.json({ message: 'Image updated successfully' });
    } catch (error) {
        console.error('Error updating project image:', error);
        return NextResponse.json(
            { error: 'Failed to update project image' },
            { status: 500 }
        );
    }
}

// DELETE - ลบรูปภาพ
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get('image_id');

        if (!imageId) {
            return NextResponse.json(
                { error: 'Image ID is required' },
                { status: 400 }
            );
        }

        await pool.query(
            'DELETE FROM ProjectImage WHERE image_id = ?',
            [parseInt(imageId)]
        );

        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting project image:', error);
        return NextResponse.json(
            { error: 'Failed to delete project image' },
            { status: 500 }
        );
    }
}