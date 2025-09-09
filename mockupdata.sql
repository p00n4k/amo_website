-- ==========================
-- Mockup Data for Brand
-- ==========================
INSERT INTO Brand (brandname, type, image) VALUES
('Atlas Concorde', 'Ceramic Tile', 'atlas_logo.png'),
('Cotto', 'Sanitary Ware', 'cotto_logo.png'),
('SCG', 'Construction Material', 'scg_logo.png');

-- ==========================
-- Mockup Data for Project
-- ==========================
INSERT INTO Project (project_name, data_update) VALUES
('Luxury Condominium Bangkok', '2025-09-01'),
('High-End Hotel Phuket', '2025-08-15'),
('Shopping Mall Chiangmai', '2025-07-20');

-- ==========================
-- Mockup Data for ProjectImage
-- ==========================
INSERT INTO ProjectImage (project_id, image_url) VALUES
(1, 'luxury_condo_01.jpg'),
(1, 'luxury_condo_02.jpg'),
(2, 'hotel_phuket_01.jpg'),
(3, 'mall_chiangmai_01.jpg'),
(3, 'mall_chiangmai_02.jpg');

-- ==========================
-- Mockup Data for ProductCollection
-- ==========================
INSERT INTO ProductCollection
(brand_id, project_id, main_type, type, detail, image, collection_link, status_discontinued)
VALUES
(1, 1, 'Floor Tile', 'Marble Look', 'Premium marble-look tiles for luxury condominium floors.',
 'marble_tile.jpg', 'https://atlasconcorde.com/marble', FALSE),

(1, 2, 'Wall Tile', 'Stone Look', 'Stone-inspired tiles for modern hotel design.',
 'stone_tile.jpg', 'https://atlasconcorde.com/stone', FALSE),

(2, 2, 'Sanitary Ware', 'Toilet', 'Smart toilet with eco flush system for hotel suites.',
 'smart_toilet.jpg', 'https://cotto.com/smarttoilet', FALSE),

(2, 3, 'Sanitary Ware', 'Basin', 'Elegant basin design for shopping mall restrooms.',
 'basin.jpg', 'https://cotto.com/basin', TRUE),

(3, 3, 'Cement', 'High-Strength', 'SCG high-strength cement for mall construction.',
 'cement.jpg', 'https://scg.com/cement', FALSE);
