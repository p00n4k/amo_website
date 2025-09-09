-- สร้าง Database (Schema)
CREATE DATABASE IF NOT EXISTS brand_project_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- ใช้ Schema นี้
USE brand_project_db;

-- ตาราง Brand
CREATE TABLE Brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brandname VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    image VARCHAR(500)  -- รูปหลักของแบรนด์
);

-- ตาราง Project
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    data_update DATE
);

-- ตาราง ProjectImage (1 Project มีหลายภาพได้)
CREATE TABLE ProjectImage (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ตาราง ProductCollection
CREATE TABLE ProductCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    project_id INT NOT NULL,
    main_type VARCHAR(100),            -- ประเภทหลักของ collection
    type VARCHAR(100),
    detail TEXT,
    image VARCHAR(255),                -- รูปของ collection
    collection_link VARCHAR(500),      -- ลิงก์ของ collection (ขยายให้รองรับ URL ที่ยาว)
    status_discontinued BOOLEAN DEFAULT FALSE,  -- ยกเลิกการผลิตหรือไม่
    FOREIGN KEY (brand_id) REFERENCES Brand(brand_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);
