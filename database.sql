-- ============================================
-- 🗄️ AMO Website - Complete Database Schema
-- ============================================
-- Version: 2.0
-- Date: 2025-11-01
-- Description: ฐานข้อมูลสำหรับเว็บไซต์ AMO พร้อมระบบจัดการ
--              Project, Collection, Brand และ Image Management
-- ============================================

-- ============================================
-- STEP 1: สร้างและเลือกฐานข้อมูล
-- ============================================
DROP DATABASE IF EXISTS brand_project_db;
CREATE DATABASE brand_project_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE brand_project_db;

-- ============================================
-- STEP 2: สร้างตารางหลัก (Core Tables)
-- ============================================

-- ============================================
-- 🏷️ ตาราง Brand - จัดเก็บข้อมูลแบรนด์
-- ============================================
CREATE TABLE Brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brandname VARCHAR(255) NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_main_type (main_type),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 🏗️ ตาราง Project - จัดเก็บข้อมูลโปรเจกต์
-- ============================================
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type ENUM('Residential', 'Commercial') DEFAULT 'Residential',
    data_update DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_project_type (project_type),
    INDEX idx_data_update (data_update)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 🖼️ ตาราง ProjectImage - จัดเก็บรูปภาพของโปรเจกต์
-- ============================================
CREATE TABLE ProjectImage (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    caption TEXT,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    
    INDEX idx_project_id (project_id),
    INDEX idx_display_order (display_order),
    INDEX idx_is_cover (is_cover)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 📦 ตาราง ProductCollection - จัดเก็บข้อมูล Collection
-- ============================================
CREATE TABLE ProductCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    detail TEXT,
    image VARCHAR(500),
    collection_link VARCHAR(500),
    status_discontinued BOOLEAN DEFAULT FALSE,
    is_focus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (brand_id) REFERENCES Brand(brand_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    
    INDEX idx_brand_id (brand_id),
    INDEX idx_main_type (main_type),
    INDEX idx_type (type),
    INDEX idx_is_focus (is_focus),
    INDEX idx_status_discontinued (status_discontinued)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 🔗 ตาราง ProjectCollection - Many-to-Many (Project ↔ Collection)
-- ============================================
CREATE TABLE ProjectCollection (
    project_collection_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    collection_id INT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    
    -- ป้องกันการเพิ่ม Collection ซ้ำในโปรเจกต์เดียวกัน
    UNIQUE KEY unique_project_collection (project_id, collection_id),
    
    INDEX idx_project_id (project_id),
    INDEX idx_collection_id (collection_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 🔗 ตาราง CollectionRelation - ความสัมพันธ์ระหว่าง Collection
-- ============================================
CREATE TABLE CollectionRelation (
    relation_id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT NOT NULL,
    related_collection_id INT NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (related_collection_id) REFERENCES ProductCollection(collection_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    
    INDEX idx_collection_id (collection_id),
    INDEX idx_related_collection_id (related_collection_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 3: สร้างตารางสำหรับหน้า Homepage
-- ============================================

-- ============================================
-- 🎠 ตาราง HomeSlider - จัดเก็บรูปภาพ Slider หน้าแรก
-- ============================================
CREATE TABLE HomeSlider (
    slider_id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ⭐ ตาราง HomepageFocus - จัดเก็บแบรนด์ Featured
-- ============================================
CREATE TABLE HomepageFocus (
    focus_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    brand_logo VARCHAR(500),
    description TEXT,
    made_in VARCHAR(100),
    brand_link VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 4: สร้าง Views สำหรับการดึงข้อมูล
-- ============================================

-- ============================================
-- 📊 View: ProjectSummary - สรุปข้อมูล Project
-- ============================================
CREATE OR REPLACE VIEW vw_ProjectSummary AS
SELECT 
    p.project_id,
    p.project_name,
    p.project_type,
    p.data_update,
    COUNT(DISTINCT pc.collection_id) as collection_count,
    COUNT(DISTINCT pi.image_id) as image_count,
    (SELECT image_url 
     FROM ProjectImage 
     WHERE project_id = p.project_id AND is_cover = TRUE 
     LIMIT 1) as cover_image,
    (SELECT image_url 
     FROM ProjectImage 
     WHERE project_id = p.project_id 
     ORDER BY display_order ASC, image_id ASC 
     LIMIT 1) as first_image
FROM Project p
LEFT JOIN ProjectCollection pc ON p.project_id = pc.project_id
LEFT JOIN ProjectImage pi ON p.project_id = pi.project_id
GROUP BY p.project_id, p.project_name, p.project_type, p.data_update;

-- ============================================
-- 📊 View: CollectionSummary - สรุปข้อมูล Collection
-- ============================================
CREATE OR REPLACE VIEW vw_CollectionSummary AS
SELECT 
    pc.collection_id,
    pc.collection_name,
    pc.brand_id,
    b.brandname,
    pc.main_type,
    pc.type,
    pc.is_focus,
    pc.status_discontinued,
    COUNT(DISTINCT prc.project_id) as project_count
FROM ProductCollection pc
LEFT JOIN Brand b ON pc.brand_id = b.brand_id
LEFT JOIN ProjectCollection prc ON pc.collection_id = prc.collection_id
GROUP BY pc.collection_id, pc.collection_name, pc.brand_id, b.brandname, 
         pc.main_type, pc.type, pc.is_focus, pc.status_discontinued;

-- ============================================
-- STEP 5: สร้าง Stored Procedures
-- ============================================

DELIMITER //

-- ============================================
-- 📋 SP: GetProjectWithDetails - ดึงข้อมูลโปรเจกต์พร้อมรายละเอียด
-- ============================================
DROP PROCEDURE IF EXISTS GetProjectWithDetails//

CREATE PROCEDURE GetProjectWithDetails(IN p_project_id INT)
BEGIN
    -- ข้อมูล Project
    SELECT * FROM vw_ProjectSummary WHERE project_id = p_project_id;
    
    -- Collections ที่เชื่อมกับ Project
    SELECT 
        pc.collection_id,
        pc.collection_name,
        pc.brand_id,
        b.brandname,
        pc.type,
        prc.display_order
    FROM ProjectCollection prc
    INNER JOIN ProductCollection pc ON prc.collection_id = pc.collection_id
    INNER JOIN Brand b ON pc.brand_id = b.brand_id
    WHERE prc.project_id = p_project_id
    ORDER BY prc.display_order ASC, pc.collection_name ASC;
    
    -- รูปภาพทั้งหมด
    SELECT *
    FROM ProjectImage
    WHERE project_id = p_project_id
    ORDER BY display_order ASC, image_id ASC;
END//

-- ============================================
-- 📋 SP: GetCollectionWithProjects - ดึงข้อมูล Collection พร้อมโปรเจกต์
-- ============================================
DROP PROCEDURE IF EXISTS GetCollectionWithProjects//

CREATE PROCEDURE GetCollectionWithProjects(IN p_collection_id INT)
BEGIN
    -- ข้อมูล Collection
    SELECT * FROM vw_CollectionSummary WHERE collection_id = p_collection_id;
    
    -- Projects ที่ใช้ Collection นี้
    SELECT 
        p.project_id,
        p.project_name,
        p.project_type,
        p.data_update,
        prc.display_order,
        (SELECT image_url 
         FROM ProjectImage 
         WHERE project_id = p.project_id AND is_cover = TRUE 
         LIMIT 1) as cover_image
    FROM ProjectCollection prc
    INNER JOIN Project p ON prc.project_id = p.project_id
    WHERE prc.collection_id = p_collection_id
    ORDER BY p.data_update DESC;
END//

DELIMITER ;

-- ============================================
-- STEP 6: Insert ข้อมูล Mockup
-- ============================================

-- ============================================
-- 🏷️ Brand Data
-- ============================================
INSERT INTO Brand (brandname, main_type, type, image) VALUES
('Amo Surface', 'Surface', 'Tile', '/images/brands/amo-surface.jpg'),
('Amo Furniture', 'Furniture', 'Indoor', '/images/brands/amo-furniture.jpg'),
('Atlas Concorde', 'Surface', 'Ceramic', '/images/brands/atlas-concorde.jpg'),
('Paola Lenti', 'Furniture', 'Outdoor', '/images/brands/paola-lenti.jpg'),
('Flexform', 'Furniture', 'Luxury', '/images/brands/flexform.jpg');

-- ============================================
-- 🏗️ Project Data
-- ============================================
INSERT INTO Project (project_name, project_type, data_update) VALUES
('Project Pavilion 2025', 'Residential', '2025-09-01'),
('Project Lifestyle Space', 'Residential', '2025-09-15'),
('Project Urban Living 2025', 'Residential', '2025-10-01'),
('Project Modern Office 2025', 'Commercial', '2025-10-05'),
('Project Resort Serenity 2025', 'Commercial', '2025-10-10'),
('Project Villa Horizon 2025', 'Residential', '2025-10-15'),
('Project Art Space 2026', 'Commercial', '2026-01-05'),
('Project Zen Residence 2026', 'Residential', '2026-02-12'),
('Project Skyline Tower 2026', 'Commercial', '2026-03-01'),
('Project Green Habitat 2026', 'Residential', '2026-04-22');

-- ============================================
-- 📦 ProductCollection Data
-- ============================================
INSERT INTO ProductCollection 
(brand_id, collection_name, main_type, type, detail, image, collection_link, status_discontinued, is_focus)
VALUES
-- Surface Collections
(1, 'Modern Tile Collection', 'Surface', 'Tile', 'Contemporary tile designs for modern living spaces', '/images/collections/modern-tile.jpg', 'https://amo.com/modern-tile', FALSE, TRUE),
(1, 'Mosaic Glass Series', 'Surface', 'Mosaic', 'Premium mosaic tiles with water resistance', '/images/collections/mosaic.jpg', 'https://amo.com/mosaic', FALSE, TRUE),
(1, 'Outdoor Stone Collection', 'Surface', 'Outdoor', 'Durable stone surface for exterior spaces', '/images/collections/outdoor.jpg', 'https://amo.com/outdoor', FALSE, FALSE),
(3, 'Atlas Ceramic Pro', 'Surface', 'Ceramic', 'High-quality Italian ceramic tiles', '/images/collections/atlas-ceramic.jpg', 'https://atlasconcorde.com/ceramic', FALSE, TRUE),

-- Furniture Collections
(2, 'Minimalist Chair Series', 'Furniture', 'Chair', 'Scandinavian-inspired wooden chairs', '/images/collections/chair.jpg', 'https://amo.com/chair', FALSE, TRUE),
(2, 'Marble Dining Collection', 'Furniture', 'Table', 'Elegant marble dining tables', '/images/collections/table.jpg', 'https://amo.com/table', FALSE, TRUE),
(2, 'Contemporary Sofa Line', 'Furniture', 'Sofa', 'Modern sofas with premium materials', '/images/collections/sofa.jpg', 'https://amo.com/sofa', FALSE, TRUE),
(4, 'Paola Outdoor Furniture', 'Furniture', 'Outdoor', 'Weather-resistant outdoor furniture', '/images/collections/paola-outdoor.jpg', 'https://paolalenti.com/outdoor', FALSE, FALSE),
(5, 'Flexform Luxury Sofa', 'Furniture', 'Sofa', 'Italian luxury sofa collection', '/images/collections/flexform-sofa.jpg', 'https://flexform.it/sofa', FALSE, TRUE);

-- ============================================
-- 🔗 ProjectCollection Data (Many-to-Many)
-- ============================================
INSERT INTO ProjectCollection (project_id, collection_id, display_order) VALUES
-- Project 1: Pavilion 2025 (มี 3 collections)
(1, 1, 1),  -- Modern Tile
(1, 2, 2),  -- Mosaic Glass
(1, 5, 3),  -- Minimalist Chair

-- Project 2: Lifestyle Space (มี 2 collections)
(2, 6, 1),  -- Marble Dining
(2, 7, 2),  -- Contemporary Sofa

-- Project 3: Urban Living (มี 3 collections - collection 1 ซ้ำกับ project 1)
(3, 1, 1),  -- Modern Tile (ซ้ำ)
(3, 4, 2),  -- Atlas Ceramic
(3, 9, 3),  -- Flexform Sofa

-- Project 4: Modern Office (Commercial)
(4, 4, 1),  -- Atlas Ceramic
(4, 5, 2),  -- Minimalist Chair

-- Project 5: Resort Serenity (มี outdoor collections)
(5, 3, 1),  -- Outdoor Stone
(5, 8, 2),  -- Paola Outdoor

-- Project 6-10: ให้มี collections บ้าง
(6, 1, 1),
(6, 7, 2),
(7, 4, 1),
(7, 6, 2),
(8, 2, 1),
(8, 9, 2),
(9, 3, 1),
(9, 5, 2),
(10, 1, 1),
(10, 8, 2);

-- ============================================
-- 🖼️ ProjectImage Data
-- ============================================
INSERT INTO ProjectImage (project_id, image_url, display_order, caption, is_cover) VALUES
-- Project 1: 3 รูป (รูปแรกเป็น cover)
(1, '/images/projects/pavilion-1.jpg', 1, 'Living Room', TRUE),
(1, '/images/projects/pavilion-2.jpg', 2, 'Bedroom', FALSE),
(1, '/images/projects/pavilion-3.jpg', 3, 'Kitchen', FALSE),

-- Project 2: 4 รูป
(2, '/images/projects/lifestyle-1.jpg', 1, 'Dining Area', TRUE),
(2, '/images/projects/lifestyle-2.jpg', 2, 'Living Space', FALSE),
(2, '/images/projects/lifestyle-3.jpg', 3, 'Outdoor Terrace', FALSE),
(2, '/images/projects/lifestyle-4.jpg', 4, 'Bathroom', FALSE),

-- Project 3-10: ให้มีรูปภาพบ้าง
(3, '/images/projects/urban-1.jpg', 1, 'Main Hall', TRUE),
(3, '/images/projects/urban-2.jpg', 2, 'Bedroom', FALSE),

(4, '/images/projects/office-1.jpg', 1, 'Reception', TRUE),
(4, '/images/projects/office-2.jpg', 2, 'Meeting Room', FALSE),
(4, '/images/projects/office-3.jpg', 3, 'Working Space', FALSE),

(5, '/images/projects/resort-1.jpg', 1, 'Pool Area', TRUE),
(5, '/images/projects/resort-2.jpg', 2, 'Restaurant', FALSE),

(6, '/images/projects/villa-1.jpg', 1, 'Exterior', TRUE),
(7, '/images/projects/artspace-1.jpg', 1, 'Gallery', TRUE),
(8, '/images/projects/zen-1.jpg', 1, 'Meditation Room', TRUE),
(9, '/images/projects/skyline-1.jpg', 1, 'Lobby', TRUE),
(10, '/images/projects/green-1.jpg', 1, 'Garden', TRUE);

-- ============================================
-- 🔗 CollectionRelation Data
-- ============================================
INSERT INTO CollectionRelation (collection_id, related_collection_id, note) VALUES
(1, 2, 'Modern Tile pairs well with Mosaic Glass'),
(5, 6, 'Minimalist Chair complements Marble Dining Table'),
(7, 9, 'Contemporary Sofa matches Flexform Luxury style'),
(3, 8, 'Outdoor Stone works with Paola Outdoor Furniture'),
(1, 4, 'Modern Tile and Atlas Ceramic are complementary');

-- ============================================
-- 🎠 HomeSlider Data
-- ============================================
INSERT INTO HomeSlider (image_url, display_order, is_active) VALUES
('/images/slider/slide1.jpg', 1, TRUE),
('/images/slider/slide2.jpg', 2, TRUE),
('/images/slider/slide3.jpg', 3, TRUE),
('/images/slider/slide4.jpg', 4, FALSE);

-- ============================================
-- ⭐ HomepageFocus Data
-- ============================================
INSERT INTO HomepageFocus (brand_name, brand_logo, description, made_in, brand_link, is_active) VALUES
('Atlas Concorde', '/images/brands/atlas-logo.png', 'A system of indoor & outdoor surfaces that can be used in any context, from residential to large-scale commercial.', 'Italy', 'https://www.atlasconcorde.com', TRUE),
('Flexform', '/images/brands/flexform-logo.png', 'Italian luxury furniture manufacturer known for timeless elegance and superior craftsmanship.', 'Italy', 'https://www.flexform.it', TRUE);

-- ============================================
-- STEP 7: สร้าง Sample Queries (สำหรับทดสอบ)
-- ============================================

-- ตรวจสอบข้อมูลในตาราง
SELECT 'Database created successfully!' as status;

SELECT 
    'Brand' as table_name, 
    COUNT(*) as row_count 
FROM Brand
UNION ALL
SELECT 'Project', COUNT(*) FROM Project
UNION ALL
SELECT 'ProductCollection', COUNT(*) FROM ProductCollection
UNION ALL
SELECT 'ProjectCollection', COUNT(*) FROM ProjectCollection
UNION ALL
SELECT 'ProjectImage', COUNT(*) FROM ProjectImage
UNION ALL
SELECT 'HomeSlider', COUNT(*) FROM HomeSlider
UNION ALL
SELECT 'HomepageFocus', COUNT(*) FROM HomepageFocus;

-- ============================================
-- Sample Queries สำหรับทดสอบ
-- ============================================

-- ดู Project พร้อม Collection count
-- SELECT * FROM vw_ProjectSummary ORDER BY data_update DESC;

-- ดู Collections ที่ใช้ในหลาย Projects
-- SELECT * FROM vw_CollectionSummary WHERE project_count > 1;

-- ดึงข้อมูลโปรเจกต์ที่ 1 พร้อมรายละเอียด
-- CALL GetProjectWithDetails(1);

-- ดึงข้อมูล Collection ที่ 1 พร้อมโปรเจกต์ที่ใช้
-- CALL GetCollectionWithProjects(1);

-- ============================================
-- 🎉 INSTALLATION COMPLETE!
-- ============================================