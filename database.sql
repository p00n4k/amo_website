USE brand_project_db;

-- ============================================
-- 🏷️ Brand (ตัวอย่าง 2 แบรนด์)
-- ============================================
INSERT INTO Brand (brandname, main_type, type, image)
VALUES
('Amo Surface', 'Surface', 'Tile', '/images/brand/surface.jpg'),
('Amo Furniture', 'Furniture', 'Indoor', '/images/brand/furniture.jpg');

-- ============================================
-- 📁 Project (ตัวอย่าง 2 โปรเจกต์)
-- ============================================
INSERT INTO Project (project_name, project_type, data_update)
VALUES
('Project Pavilion 2025', 'Commercial', '2025-09-01'),
('Project Lifestyle Space', 'Residential', '2025-09-15');

-- ============================================
-- 🖼️ ProjectImage (ภาพประกอบโปรเจกต์)
-- ============================================
INSERT INTO ProjectImage (project_id, image_url)
VALUES
(1, '/images/projects/pavilion_1.jpg'),
(1, '/images/projects/pavilion_2.jpg'),
(2, '/images/projects/lifestyle_1.jpg'),
(2, '/images/projects/lifestyle_2.jpg');

-- ============================================
-- 🧩 ProductCollection (สินค้า)
-- ============================================
INSERT INTO ProductCollection
(brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus)
VALUES
-- 🔶 Amo Surface (Surface 4 รายการ)
(1, 1, 'Surface', 'Tile', 'High-gloss marble tile for lobby design', '/images/product/surface_tile_1.jpg', 'https://amo.com/collections/tile01', FALSE, TRUE),
(1, 1, 'Surface', 'Mosaic', 'Luxury gold mosaic for bathroom walls', '/images/product/surface_mosaic_1.jpg', 'https://amo.com/collections/mosaic01', FALSE, TRUE),
(1, 2, 'Surface', 'Stone', 'Natural stone finish for outdoor façade', '/images/product/surface_stone_1.jpg', 'https://amo.com/collections/stone01', FALSE, FALSE),
(1, 2, 'Surface', 'Tile', 'Matte tile for modern kitchen design', '/images/product/surface_tile_2.jpg', 'https://amo.com/collections/tile02', FALSE, FALSE),

-- 🔷 Amo Furniture (Furniture 4 รายการ)
(2, 1, 'Furniture', 'Table', 'Oak wood coffee table with metal legs', '/images/product/furniture_table_1.jpg', 'https://amo.com/collections/table01', FALSE, TRUE),
(2, 1, 'Furniture', 'Chair', 'Minimalist lounge chair with soft fabric', '/images/product/furniture_chair_1.jpg', 'https://amo.com/collections/chair01', FALSE, TRUE),
(2, 2, 'Furniture', 'Sofa', 'Premium L-shaped sofa with leather finish', '/images/product/furniture_sofa_1.jpg', 'https://amo.com/collections/sofa01', FALSE, FALSE),
(2, 2, 'Furniture', 'Cabinet', 'Modern cabinet with matte finish and LED lighting', '/images/product/furniture_cabinet_1.jpg', 'https://amo.com/collections/cabinet01', FALSE, FALSE);

-- ============================================
-- 🔗 CollectionRelation (ความสัมพันธ์สินค้า)
-- ============================================
INSERT INTO CollectionRelation (collection_id, related_collection_id, note)
VALUES
(1, 2, 'Both are part of the same Surface collection set'),
(5, 6, 'Furniture set for living room'),
(7, 8, 'Sofa and cabinet recommended pairing');
