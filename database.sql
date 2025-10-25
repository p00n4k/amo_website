-- ============================================
-- 🗃️ สร้าง Database
-- ============================================
CREATE DATABASE IF NOT EXISTS brand_project_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brand_project_db;

-- ============================================
-- 🏷️ ตาราง Brand (ข้อมูลแบรนด์)
-- ============================================
CREATE TABLE Brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brandname VARCHAR(255) NOT NULL,
    main_type VARCHAR(100),         -- เช่น Furniture, Surface
    type VARCHAR(100),              -- เช่น Tile, Mosaic, Lighting
    image VARCHAR(500)
);

-- ============================================
-- 📁 ตาราง Project (ข้อมูลโปรเจกต์)
-- ============================================
-- ============================================
-- 📁 ตาราง Project (ข้อมูลโปรเจกต์)
-- ============================================
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type ENUM('Residential', 'Commercial') DEFAULT 'Residential',  -- 🏢 เพิ่มประเภทโปรเจกต์
    data_update DATE
);


-- ============================================
-- 🖼️ ตาราง ProjectImage (ภาพของโปรเจกต์)
-- ============================================
CREATE TABLE ProjectImage (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================
-- 🧩 ตาราง ProductCollection (สินค้า)
-- ============================================
CREATE TABLE ProductCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    project_id INT NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    detail TEXT,
    image VARCHAR(255),
    collection_link VARCHAR(500),
    status_discontinued BOOLEAN DEFAULT FALSE,
    is_focus BOOLEAN DEFAULT FALSE,       -- ใช้แสดงในหน้าแรก (optional)
    FOREIGN KEY (brand_id) REFERENCES Brand(brand_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================
-- 🔗 ตาราง CollectionRelation (สินค้าที่เกี่ยวข้อง)
-- ============================================
CREATE TABLE CollectionRelation (
    relation_id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT NOT NULL,
    related_collection_id INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (related_collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

