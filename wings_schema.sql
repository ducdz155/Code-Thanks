-- ========================================================
-- TÂY NGUYÊN UNIVERSITY (TNU) - WINGS FRAME SPRITE DATABASE SCHEMA
-- Quản lý khung hình (Frames) và hoạt ảnh cánh mượt mà chuẩn xác
-- 17 BỘ CÁNH FRAME THẦN THOẠI CAO CẤP: Chuẩn tỷ lệ sải cánh, không bị nén bẹp
-- ========================================================

CREATE TABLE IF NOT EXISTS wing_templates (
    wing_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    desc_key VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255) NOT NULL,
    wing_type VARCHAR(20) DEFAULT 'frame_atlas',
    total_frames INT NOT NULL,
    delay_ms INT DEFAULT 125,
    render_width INT NOT NULL,
    render_height INT NOT NULL,
    offset_x INT DEFAULT 0,
    offset_y INT DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'mythic'
);

CREATE TABLE IF NOT EXISTS wing_frames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wing_id VARCHAR(50) NOT NULL,
    frame_index INT NOT NULL,
    image_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    dx INT DEFAULT 0,
    dy INT DEFAULT 0,
    raw_width INT DEFAULT 352,
    raw_height INT DEFAULT 168,
    FOREIGN KEY (wing_id) REFERENCES wing_templates(wing_id)
);

-- ========================================================
-- DATA: BỘ CÁNH 1 - CÁNH CƠ GIỚI HEXAGON (14 FRAMES)
-- Nguồn ảnh: 32239.png -> 32252.png (14 frames, Tốc độ 180ms, Render 136x65)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_cyber_hex', 'Cánh Cơ Giới Hexagon (14 Frames)', 'wing_cyber_hex_desc', 'picture/32248.png', 'frame_atlas', 14, 180, 205, 98, 0, -22, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_cyber_hex', 0, 32239, 'picture/32239.png', -68, -32, 352, 168),
('wing_cyber_hex', 1, 32240, 'picture/32240.png', -68, -32, 352, 168),
('wing_cyber_hex', 2, 32241, 'picture/32241.png', -68, -32, 352, 168),
('wing_cyber_hex', 3, 32242, 'picture/32242.png', -68, -32, 352, 168),
('wing_cyber_hex', 4, 32243, 'picture/32243.png', -68, -32, 352, 168),
('wing_cyber_hex', 5, 32244, 'picture/32244.png', -68, -32, 352, 168),
('wing_cyber_hex', 6, 32245, 'picture/32245.png', -68, -32, 352, 168),
('wing_cyber_hex', 7, 32246, 'picture/32246.png', -68, -32, 352, 168),
('wing_cyber_hex', 8, 32247, 'picture/32247.png', -68, -32, 352, 168),
('wing_cyber_hex', 9, 32248, 'picture/32248.png', -68, -32, 352, 168),
('wing_cyber_hex', 10, 32249, 'picture/32249.png', -68, -32, 352, 168),
('wing_cyber_hex', 11, 32250, 'picture/32250.png', -68, -32, 352, 168),
('wing_cyber_hex', 12, 32251, 'picture/32251.png', -68, -32, 352, 168),
('wing_cyber_hex', 13, 32252, 'picture/32252.png', -68, -32, 352, 168);

-- ========================================================
-- DATA: BỘ CÁNH 2 - CÁNH THIÊN THẦN NƠ HỒNG (3 FRAMES)
-- Nguồn ảnh: 32235.png -> 32237.png (3 frames, Tốc độ 240ms, Render 114x98)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_pink_angel', 'Cánh Thiên Thần Nơ Hồng (3 Frames)', 'wing_pink_angel_desc', 'picture/32238.png', 'frame_atlas', 3, 240, 143, 123, 4, -36, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_pink_angel', 0, 32235, 'picture/32235.png', -57, -49, 1072, 920),
('wing_pink_angel', 1, 32236, 'picture/32236.png', -57, -49, 1072, 920),
('wing_pink_angel', 2, 32237, 'picture/32237.png', -57, -49, 1072, 920);

-- ========================================================
-- DATA: BỘ CÁNH 3 - CÁNH HỖN MANG ÂM DƯƠNG (6 FRAMES)
-- Nguồn ảnh: 14265.png -> 14270.png (6 frames, Tốc độ 150ms, Render 136x117)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_chaos_angel', 'Cánh Hỗn Mang Âm Dương (6 Frames)', 'wing_chaos_angel_desc', 'picture/14265.png', 'frame_atlas', 6, 150, 176, 151, 0, -5, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_chaos_angel', 0, 14265, 'picture/14265.png', -68, -58, 400, 344),
('wing_chaos_angel', 1, 14266, 'picture/14266.png', -68, -58, 400, 344),
('wing_chaos_angel', 2, 14267, 'picture/14267.png', -68, -58, 400, 344),
('wing_chaos_angel', 3, 14268, 'picture/14268.png', -68, -58, 400, 344),
('wing_chaos_angel', 4, 14269, 'picture/14269.png', -68, -58, 400, 344),
('wing_chaos_angel', 5, 14270, 'picture/14270.png', -68, -58, 400, 344);

-- ========================================================
-- DATA: BỘ CÁNH 4 - CÁNH RỒNG LAM THỦY TỘC (2 FRAMES)
-- Nguồn ảnh: 14285.png -> 14286.png (2 frames, Tốc độ 220ms, Render 106x57)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_azure_dragon', 'Cánh Rồng Lam Thủy Tộc (2 Frames)', 'wing_azure_dragon_desc', 'picture/14285.png', 'frame_atlas', 2, 220, 133, 72, 1, -22, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_azure_dragon', 0, 14285, 'picture/14285.png', -53, -28, 252, 136),
('wing_azure_dragon', 1, 14286, 'picture/14286.png', -53, -28, 252, 136);

-- ========================================================
-- DATA: BỘ CÁNH 5 - CÁNH THÁI DƯƠNG KIM PHƯỢNG (12 FRAMES)
-- Nguồn ảnh: 20929.png -> 20940.png (12 frames, Tốc độ 140ms, Render 200x200)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_golden_solar', 'Cánh Thái Dương Kim Phượng (12 Frames)', 'wing_golden_solar_desc', 'picture/20929.png', 'frame_atlas', 12, 140, 271, 271, 1, -4, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_golden_solar', 0, 20929, 'picture/20929.png', -100, -100, 1650, 1650),
('wing_golden_solar', 1, 20930, 'picture/20930.png', -100, -100, 1650, 1650),
('wing_golden_solar', 2, 20931, 'picture/20931.png', -100, -100, 1650, 1650),
('wing_golden_solar', 3, 20932, 'picture/20932.png', -100, -100, 1650, 1650),
('wing_golden_solar', 4, 20933, 'picture/20933.png', -100, -100, 1650, 1650),
('wing_golden_solar', 5, 20934, 'picture/20934.png', -100, -100, 1650, 1650),
('wing_golden_solar', 6, 20935, 'picture/20935.png', -100, -100, 1650, 1650),
('wing_golden_solar', 7, 20936, 'picture/20936.png', -100, -100, 1650, 1650),
('wing_golden_solar', 8, 20937, 'picture/20937.png', -100, -100, 1650, 1650),
('wing_golden_solar', 9, 20938, 'picture/20938.png', -100, -100, 1650, 1650),
('wing_golden_solar', 10, 20939, 'picture/20939.png', -100, -100, 1650, 1650),
('wing_golden_solar', 11, 20940, 'picture/20940.png', -100, -100, 1650, 1650);

-- ========================================================
-- DATA: BỘ CÁNH 6 - CÁNH HỎA DIỄM RỰC LỬA (4 FRAMES)
-- Nguồn ảnh: 27120.png -> 27123.png (4 frames, Tốc độ 160ms, Render 108x108)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_crimson_blaze', 'Cánh Hỏa Diễm Rực Lửa (4 Frames)', 'wing_crimson_blaze_desc', 'picture/27120.png', 'frame_atlas', 4, 160, 134, 134, 0, -8, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_crimson_blaze', 0, 27120, 'picture/27120.png', -54, -54, 500, 500),
('wing_crimson_blaze', 1, 27121, 'picture/27121.png', -54, -54, 500, 500),
('wing_crimson_blaze', 2, 27122, 'picture/27122.png', -54, -54, 500, 500),
('wing_crimson_blaze', 3, 27123, 'picture/27123.png', -54, -54, 500, 500);

-- ========================================================
-- DATA: BỘ CÁNH 7 - CÁNH HUYỀN TỬ HƯ KHÔNG (8 FRAMES)
-- Nguồn ảnh: 27286.png -> 27293.png (8 frames, Tốc độ 145ms, Render 108x108)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_void_amethyst', 'Cánh Huyền Tử Hư Không (8 Frames)', 'wing_void_amethyst_desc', 'picture/27286.png', 'frame_atlas', 8, 145, 134, 134, 0, -9, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_void_amethyst', 0, 27286, 'picture/27286.png', -54, -54, 500, 500),
('wing_void_amethyst', 1, 27287, 'picture/27287.png', -54, -54, 500, 500),
('wing_void_amethyst', 2, 27288, 'picture/27288.png', -54, -54, 500, 500),
('wing_void_amethyst', 3, 27289, 'picture/27289.png', -54, -54, 500, 500),
('wing_void_amethyst', 4, 27290, 'picture/27290.png', -54, -54, 500, 500),
('wing_void_amethyst', 5, 27291, 'picture/27291.png', -54, -54, 500, 500),
('wing_void_amethyst', 6, 27292, 'picture/27292.png', -54, -54, 500, 500),
('wing_void_amethyst', 7, 27293, 'picture/27293.png', -54, -54, 500, 500);

-- ========================================================
-- DATA: BỘ CÁNH 8 - CÁNH BẠCH KIM ĐẠI THIÊN SỨ (4 FRAMES)
-- Nguồn ảnh: 27975.png -> 27978.png (4 frames, Tốc độ 170ms, Render 146x146)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_silver_seraph', 'Cánh Bạch Kim Đại Thiên Sứ (4 Frames)', 'wing_silver_seraph_desc', 'picture/27975.png', 'frame_atlas', 4, 170, 199, 199, -1, -25, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_silver_seraph', 0, 27975, 'picture/27975.png', -73, -73, 600, 600),
('wing_silver_seraph', 1, 27976, 'picture/27976.png', -73, -73, 600, 600),
('wing_silver_seraph', 2, 27977, 'picture/27977.png', -73, -73, 600, 600),
('wing_silver_seraph', 3, 27978, 'picture/27978.png', -73, -73, 600, 600);

-- ========================================================
-- DATA: BỘ CÁNH 9 - CÁNH BĂNG TINH LAM NGỌC (4 FRAMES)
-- Nguồn ảnh: 30412.png -> 30415.png (4 frames, Tốc độ 160ms, Render 120x120)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_glacial_frost', 'Cánh Băng Tinh Lam Ngọc (4 Frames)', 'wing_glacial_frost_desc', 'picture/30412.png', 'frame_atlas', 4, 160, 151, 151, 0, -30, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_glacial_frost', 0, 30412, 'picture/30412.png', -60, -60, 1024, 1024),
('wing_glacial_frost', 1, 30413, 'picture/30413.png', -60, -60, 1024, 1024),
('wing_glacial_frost', 2, 30414, 'picture/30414.png', -60, -60, 1024, 1024),
('wing_glacial_frost', 3, 30415, 'picture/30415.png', -60, -60, 1024, 1024);

-- ========================================================
-- DATA: BỘ CÁNH 10 - CÁNH THÁNH QUANG BẠCH NGÂN (2 FRAMES)
-- Nguồn ảnh: 12827.png -> 12828.png (2 frames, Tốc độ 200ms, Render 110x94)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_holy_white', 'Cánh Thánh Quang Bạch Ngân (2 Frames)', 'wing_holy_white_desc', 'picture/12827.png', 'frame_atlas', 2, 200, 141, 121, -2, -27, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_holy_white', 0, 12827, 'picture/12827.png', -55, -47, 196, 168),
('wing_holy_white', 1, 12828, 'picture/12828.png', -55, -47, 196, 168);

-- ========================================================
-- DATA: BỘ CÁNH 11 - CÁNH CẦU VỒNG TINH TÚ (2 FRAMES)
-- Nguồn ảnh: 20214.png -> 20215.png (2 frames, Tốc độ 200ms, Render 120x76)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_rainbow_celestial', 'Cánh Cầu Vồng Tinh Tú (2 Frames)', 'wing_rainbow_celestial_desc', 'picture/20214.png', 'frame_atlas', 2, 200, 342, 219, -11, -20, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_rainbow_celestial', 0, 20214, 'picture/20214.png', -60, -38, 1000, 640),
('wing_rainbow_celestial', 1, 20215, 'picture/20215.png', -60, -38, 1000, 640);

-- ========================================================
-- DATA: BỘ CÁNH 12 - CÁNH TỬ LÔI HƯ KHÔNG (6 FRAMES)
-- Nguồn ảnh: 21215.png -> 21220.png (6 frames, Tốc độ 150ms, Render 120x120)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_void_thunder', 'Cánh Tử Lôi Hư Không (6 Frames)', 'wing_void_thunder_desc', 'picture/21215.png', 'frame_atlas', 6, 150, 139, 139, -1, -11, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_void_thunder', 0, 21215, 'picture/21215.png', -60, -60, 500, 500),
('wing_void_thunder', 1, 21216, 'picture/21216.png', -60, -60, 500, 500),
('wing_void_thunder', 2, 21217, 'picture/21217.png', -60, -60, 500, 500),
('wing_void_thunder', 3, 21218, 'picture/21218.png', -60, -60, 500, 500),
('wing_void_thunder', 4, 21219, 'picture/21219.png', -60, -60, 500, 500),
('wing_void_thunder', 5, 21220, 'picture/21220.png', -60, -60, 500, 500);

-- ========================================================
-- DATA: BỘ CÁNH 13 - CÁNH THÁNH GIÁP CƠ GIỚI (7 FRAMES)
-- Nguồn ảnh: 23516.png -> 23522.png (7 frames, Tốc độ 160ms, Render 124x80)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_mecha_seraph', 'Cánh Thánh Giáp Cơ Giới (7 Frames)', 'wing_mecha_seraph_desc', 'picture/23516.png', 'frame_atlas', 7, 160, 209, 134, -3, -26, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_mecha_seraph', 0, 23516, 'picture/23516.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 1, 23517, 'picture/23517.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 2, 23518, 'picture/23518.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 3, 23519, 'picture/23519.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 4, 23520, 'picture/23520.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 5, 23521, 'picture/23521.png', -62, -40, 1000, 640),
('wing_mecha_seraph', 6, 23522, 'picture/23522.png', -62, -40, 1000, 640);

-- ========================================================
-- DATA: BỘ CÁNH 14 - CÁNH LIỆT DIỄM PHƯỢNG HOÀNG (5 FRAMES)
-- Nguồn ảnh: 24521.png -> 24525.png (5 frames, Tốc độ 150ms, Render 116x116)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_blazing_phoenix', 'Cánh Liệt Diễm Phượng Hoàng (5 Frames)', 'wing_blazing_phoenix_desc', 'picture/24520.png', 'frame_atlas', 5, 150, 146, 146, 1, -33, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_blazing_phoenix', 0, 24521, 'picture/24521.png', -58, -58, 373, 373),
('wing_blazing_phoenix', 1, 24522, 'picture/24522.png', -58, -58, 373, 373),
('wing_blazing_phoenix', 2, 24523, 'picture/24523.png', -58, -58, 373, 373),
('wing_blazing_phoenix', 3, 24524, 'picture/24524.png', -58, -58, 373, 373),
('wing_blazing_phoenix', 4, 24525, 'picture/24525.png', -58, -58, 373, 373);

-- ========================================================
-- DATA: BỘ CÁNH 15 - CÁNH BĂNG PHONG LAM TINH (7 FRAMES)
-- Nguồn ảnh: 24529.png -> 24535.png (7 frames, Tốc độ 150ms, Render 120x111)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_glacial_sovereign', 'Cánh Băng Phong Lam Tinh (7 Frames)', 'wing_glacial_sovereign_desc', 'picture/24536.png', 'frame_atlas', 7, 150, 187, 174, 0, -29, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_glacial_sovereign', 0, 24529, 'picture/24529.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 1, 24530, 'picture/24530.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 2, 24531, 'picture/24531.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 3, 24532, 'picture/24532.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 4, 24533, 'picture/24533.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 5, 24534, 'picture/24534.png', -60, -56, 433, 402),
('wing_glacial_sovereign', 6, 24535, 'picture/24535.png', -60, -56, 433, 402);

-- ========================================================
-- DATA: BỘ CÁNH 16 - CÁNH ĐẠI THIÊN THẦN CỰC QUANG (9 FRAMES)
-- Nguồn ảnh: 24540.png -> 24548.png (9 frames, Tốc độ 140ms, Render 124x124)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_aurora_seraph', 'Cánh Đại Thiên Thần Cực Quang (9 Frames)', 'wing_aurora_seraph_desc', 'picture/24540.png', 'frame_atlas', 9, 140, 187, 187, -1, -34, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_aurora_seraph', 0, 24540, 'picture/24540.png', -62, -62, 500, 500),
('wing_aurora_seraph', 1, 24541, 'picture/24541.png', -62, -62, 500, 500),
('wing_aurora_seraph', 2, 24542, 'picture/24542.png', -62, -62, 500, 500),
('wing_aurora_seraph', 3, 24543, 'picture/24543.png', -62, -62, 500, 500),
('wing_aurora_seraph', 4, 24544, 'picture/24544.png', -62, -62, 500, 500),
('wing_aurora_seraph', 5, 24545, 'picture/24545.png', -62, -62, 500, 500),
('wing_aurora_seraph', 6, 24546, 'picture/24546.png', -62, -62, 500, 500),
('wing_aurora_seraph', 7, 24547, 'picture/24547.png', -62, -62, 500, 500),
('wing_aurora_seraph', 8, 24548, 'picture/24548.png', -62, -62, 500, 500);

-- ========================================================
-- DATA: BỘ CÁNH 17 - CÁNH HẮC MA VIÊM LONG (4 FRAMES)
-- Nguồn ảnh: 27772.png -> 27775.png (4 frames, Tốc độ 160ms, Render 124x107)
-- ========================================================
INSERT INTO wing_templates (wing_id, name, desc_key, icon_url, wing_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('wing_abyssal_drake', 'Cánh Hắc Ma Viêm Long (4 Frames)', 'wing_abyssal_drake_desc', 'picture/27772.png', 'frame_atlas', 4, 160, 218, 188, 0, -19, 'mythic');

INSERT INTO wing_frames (wing_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('wing_abyssal_drake', 0, 27772, 'picture/27772.png', -62, -54, 520, 448),
('wing_abyssal_drake', 1, 27773, 'picture/27773.png', -62, -54, 520, 448),
('wing_abyssal_drake', 2, 27774, 'picture/27774.png', -62, -54, 520, 448),
('wing_abyssal_drake', 3, 27775, 'picture/27775.png', -62, -54, 520, 448);

