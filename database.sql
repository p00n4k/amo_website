-- ============================================
-- 🗃️ สร้าง Database
-- ============================================
CREATE DATABASE IF NOT EXISTS brand_project_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brand_project_db;

-- ============================================
-- 🏷️ ตาราง Brand
-- ============================================
CREATE TABLE IF NOT EXISTS Brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brandname VARCHAR(255) NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 🏗️ ตาราง Project
-- ============================================
CREATE TABLE IF NOT EXISTS Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type ENUM('Residential', 'Commercial') DEFAULT 'Residential',
    data_update DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 🖼️ ตาราง ProjectImage
-- ============================================
CREATE TABLE IF NOT EXISTS ProjectImage (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 1,
    caption VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================
-- 📦 ตาราง ProductCollection
-- ============================================
CREATE TABLE IF NOT EXISTS ProductCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    project_id INT NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    detail TEXT,
    image VARCHAR(255),
    collection_link VARCHAR(500),
    status_discontinued BOOLEAN DEFAULT FALSE,
    is_focus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES Brand(brand_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================
-- 🔗 ตาราง CollectionRelation (สินค้าที่เกี่ยวข้อง)
-- ============================================
CREATE TABLE IF NOT EXISTS CollectionRelation (
    relation_id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT NOT NULL,
    related_collection_id INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (related_collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

