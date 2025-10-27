USE brand_project_db;

-- ============================================
-- 🏷️ Brand (ตัวอย่าง 2 แบรนด์)
-- ============================================
INSERT INTO Brand (brandname, main_type, type, image)
VALUES
('Amo Surface', 'Surface', 'Tile', '/images/product/productfocus1.jpg'),
('Amo Furniture', 'Furniture', 'Indoor', '/images/product/productfocus1.jpg');

-- ============================================
-- 📁 Project (ตัวอย่าง 2 โปรเจกต์)
-- ============================================
INSERT INTO Project (project_name, data_update)
VALUES
('Project Pavilion 2025', '2025-09-01'),
('Project Lifestyle Space', '2025-09-15'),
('Project Urban Living 2025', 'Residential', '2025-10-01'),
('Project Modern Office 2025', 'Commercial', '2025-10-05'),
('Project Resort Serenity 2025', 'Commercial', '2025-10-10'),
('Project Villa Horizon 2025', 'Residential', '2025-10-15'),
('Project Art Space 2026', 'Commercial', '2026-01-05'),
('Project Zen Residence 2026', 'Residential', '2026-02-12'),
('Project Skyline Tower 2026', 'Commercial', '2026-03-01'),
('Project Green Habitat 2026', 'Residential', '2026-04-22');

-- ============================================
-- 🧩 ProductCollection (8 ชิ้น — Surface 4, Furniture 4)
-- ============================================
INSERT INTO ProductCollection
(brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued, is_focus)
VALUES
-- 🟦 Surface
(1, 1, 'Surface', 'Tile', 'Modern tile pattern for outdoor and interior use', '/images/product/productfocus1.jpg', 'https://amo.com/collections/tile01', FALSE, TRUE),
(1, 1, 'Surface', 'Mosaic', 'Mosaic glass surface with water resistance', '/images/product/productfocus1.jpg', 'https://amo.com/collections/mosaic02', FALSE, TRUE),
(1, 1, 'Surface', 'Outdoor', 'Rough stone texture for pool and garden areas', '/images/product/productfocus1.jpg', 'https://amo.com/collections/outdoor03', FALSE, TRUE),
(1, 1, 'Surface', 'Lighting', 'Surface with integrated lighting for modern design', '/images/product/productfocus1.jpg', 'https://amo.com/collections/lighting04', FALSE, TRUE),

-- 🟫 Furniture
(2, 2, 'Furniture', 'Chair', 'Minimal wooden chair for indoor use', '/images/product/productfocus1.jpg', 'https://amo.com/collections/chair05', FALSE, TRUE),
(2, 2, 'Furniture', 'Table', 'Modern marble dining table', '/images/product/productfocus1.jpg', 'https://amo.com/collections/table06', FALSE, TRUE),
(2, 2, 'Furniture', 'Sofa', 'Contemporary sofa with eco leather', '/images/product/productfocus1.jpg', 'https://amo.com/collections/sofa07', FALSE, TRUE),
(2, 2, 'Furniture', 'Lighting', 'Lamp collection for modern spaces', '/images/product/productfocus1.jpg', 'https://amo.com/collections/lamp08', FALSE, TRUE);

-- ============================================
-- 🔗 CollectionRelation (สินค้าที่เกี่ยวข้อง)
-- ============================================
INSERT INTO CollectionRelation (collection_id, related_collection_id, note)
VALUES
(1, 2, 'Tile matches well with Mosaic'),
(7, 6, 'Sofa set goes with matching Table'),
(5, 8, 'Chair looks good with Lamp'),
(3, 4, 'Outdoor tile pairs with surface lighting');

-- ============================================
-- 🖼️ ProjectImage (ภาพโปรเจกต์)
-- ============================================
INSERT INTO ProjectImage (project_id, image_url)
VALUES
(1, '/images/product/productfocus1.jpg'),
(1, '/images/product/productfocus1.jpg'),
(2, '/images/product/productfocus1.jpg'),
(2, '/images/product/productfocus1.jpg'),
(3, '/images/product/productfocus1.jpg'),
(3, '/images/product/productfocus1.jpg'),
(4, '/images/product/productfocus1.jpg'),
(4, '/images/product/productfocus1.jpg'),
(5, '/images/product/productfocus1.jpg'),
(5, '/images/product/productfocus1.jpg'),
(6, '/images/product/productfocus1.jpg'),
(6, '/images/product/productfocus1.jpg'),
(7, '/images/product/productfocus1.jpg'),
(7, '/images/product/productfocus1.jpg'),
(8, '/images/product/productfocus1.jpg'),
(8, '/images/product/productfocus1.jpg'),
(9, '/images/product/productfocus1.jpg'),
(9, '/images/product/productfocus1.jpg'),
(10, '/images/product/productfocus1.jpg'),
(10, '/images/product/productfocus1.jpg');
