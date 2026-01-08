import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brand_project_db",
};

export async function GET(req, { params }) {
  const { id } = params; // project_id
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(`
      SELECT image_id, project_id, image_url
      FROM ProjectImage
      WHERE project_id = ?
      ORDER BY image_id ASC
    `, [id]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching project images:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
