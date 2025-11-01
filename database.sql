-- ============================================
-- 📁 Database: brand_project_db
-- ============================================

DROP DATABASE IF EXISTS brand_project_db;
CREATE DATABASE brand_project_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brand_project_db;

-- ============================================
-- 🧱 Table: Brand
-- ============================================
CREATE TABLE Brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brandname VARCHAR(255) NOT NULL,
    main_type VARCHAR(100),
    type VARCHAR(100),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 🏗️ Table: Project
-- ============================================
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type ENUM('Residential', 'Commercial') DEFAULT 'Residential',
    data_update DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 🧩 Table: ProductCollection
-- ============================================
CREATE TABLE ProductCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
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
);

-- ============================================
-- 🔗 Table: ProjectCollection
-- ============================================
CREATE TABLE ProjectCollection (
    project_collection_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    collection_id INT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES ProductCollection(collection_id) ON DELETE CASCADE
);

-- ============================================
-- 🖼️ Table: FocusImage (ใหม่)
-- ============================================
CREATE TABLE FocusImage (
    focus_image_id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 🌱 MOCK DATA
-- ============================================

INSERT INTO Brand (brandname, main_type, type, image) VALUES
('Amo Surface', 'Surface', 'Tile', '/images/brand/amo_surface.jpg'),
('Amo Furniture', 'Furniture', 'Wood', '/images/brand/amo_furniture.jpg');

INSERT INTO Project (project_name, project_type, data_update) VALUES
('Pavilion Residence', 'Residential', '2024-05-01'),
('Lifestyle Space', 'Commercial', '2024-06-15');

INSERT INTO ProductCollection 
(brand_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus)
VALUES
(1, 'Surface', 'Tile', 'Modern tile pattern for indoor/outdoor', '/images/product/tile.jpg', 'https://amo.com/collections/tile', FALSE, TRUE),
(2, 'Furniture', 'Chair', 'Wooden chair Scandinavian style', '/images/product/chair.jpg', 'https://amo.com/collections/chair', FALSE, TRUE);

INSERT INTO ProjectCollection (project_id, collection_id, display_order) VALUES
(1, 1, 1),
(2, 2, 1);

INSERT INTO FocusImage (image_url, display_order, is_active) VALUES
('/images/01_pd_focus_atlasconcorde.jpg', 1, TRUE),
('/images/02_pd_focus_atlasconcorde.jpg', 2, TRUE),
('/images/03_pd_focus_atlasconcorde.jpg', 3, TRUE);
