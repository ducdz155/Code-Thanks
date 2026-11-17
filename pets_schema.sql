-- ========================================================
-- TÂY NGUYÊN UNIVERSITY (TNU) - PETS FRAME SPRITE DATABASE SCHEMA
-- Quản lý khung hình (Frames) và hoạt ảnh Thú Cưng (Companion Pet) mượt mà chuẩn xác
-- Hỗ trợ 35 bộ Pet Thần Thú đi theo người chơi:
-- 1. Cáo Vàng Kim Hồ (5 Frames: 31513 -> 31517)
-- 2. Hỏa Kỳ Lân Thần Thú (5 Frames: 7072 -> 7076)
-- 3. Hắc Long Vương (5 Frames: 7482 -> 7486)
-- 4. Bạch Tuyết Cửu Vĩ (5 Frames: 8763 -> 8767, Icon: 8761)
-- 5. Lôi Thú Hoàng Kim (8 Frames: 10618 -> 10625)
-- 6. Huyết Lân Ma Thú (6 Frames: 12938 -> 12944)
-- 7. Băng Tuyết Tinh Linh (5 Frames: 14274 -> 14278, Icon: 14273)
-- 8. Viêm Hỏa Long Vương (5 Frames: 19851 -> 19855)
-- 9. Thổ Khuyển Linh Thú (5 Frames: 6680 -> 6684)
-- 10. Cơ Giáp Hộ Vệ (5 Frames: 18480 -> 18484)
-- 11. Thanh Long Thần Xà (7 Frames: 18491 -> 18497)
-- 12. Hoa Linh Tinh Nữ (7 Frames: 18836 -> 18842)
-- 13. Bạch Ngân Cổ Long (5 Frames: 19823 -> 19827, Icon: 19820)
-- 14. Cổ Tháp Phù Điêu (5 Frames: 21662 -> 21666)
-- 15. Anh Đào Linh Hồ (5 Frames: 31567 -> 31571, Icon: 31572)
-- 16. Tinh Vân Thần Ưng (8 Frames: 31852 -> 31859)
-- 17. Anh Đào Thỏ Ngọc (4 Frames: 6091 -> 6097)
-- 18. Hoàng Kim Hổ Con (5 Frames: 6156 -> 6160)
-- 19. Ngân Nguyệt Cửu Vĩ (5 Frames: 8771 -> 8775)
-- 20. Dạ Hành Thần Điêu (7 Frames: 9711 -> 9717)
-- 21. Xích Hỏa Sư Điêu (4 Frames: 12091 -> 12095)
-- 22. Nham Thạch Sư Điêu (3 Frames: 12330 -> 12332)
-- 23. Kim Sí Thần Phụng (5 Frames: 12405 -> 12409)
-- 24. Dung Nham Cự Thú (5 Frames: 12552 -> 12557)
-- 25. Kim Giác Lôi Thú (6 Frames: 13871 -> 13876)
-- 26. Quang Minh Tinh Linh (4 Frames: 13956 -> 13959)
-- 27. U Hồn Hắc Lang (6 Frames: 14503 -> 14508)
-- 28. Huyết Long Thần Thú (5 Frames: 14662 -> 14666)
-- 29. Thương Hải Thần Long (6 Frames: 14779 -> 14784)
-- 30. Hồng Điệp Tiên Linh (6 Frames: 14809 -> 14814)
-- 31. Bảo Trúc Linh Miêu (6 Frames: 14825 -> 14830)
-- 32. Thái Cổ Long Thần (4 Frames: 16183 -> 16186)
-- 33. Bạch Ngân Báo Thần (5 Frames: 16285 -> 16289)
-- 34. Lam Tinh Sứ Giả (7 Frames: 17433 -> 17439)
-- 35. Xích Kim Thần Thú (4 Frames: 27969 -> 27972)
-- ========================================================

CREATE TABLE IF NOT EXISTS pet_templates (
    pet_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    desc_key VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255) NOT NULL,
    pet_type VARCHAR(20) DEFAULT 'frame_companion',
    total_frames INT NOT NULL,
    delay_ms INT DEFAULT 160,
    render_width INT NOT NULL,
    render_height INT NOT NULL,
    offset_x INT DEFAULT 0,
    offset_y INT DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'mythic',
    follow_dist INT DEFAULT 36,
    speed_factor FLOAT DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS pet_frames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id VARCHAR(50) NOT NULL,
    frame_index INT NOT NULL,
    image_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    dx INT DEFAULT 0,
    dy INT DEFAULT 0,
    raw_width INT DEFAULT 200,
    raw_height INT DEFAULT 140,
    FOREIGN KEY (pet_id) REFERENCES pet_templates(pet_id)
);

-- ========================================================
-- DATA: BỘ PET 1 - CÁO VÀNG KIM HỒ (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/31513.png -> pet/31517.png (Tốc độ 150ms, Kích thước 48x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_golden_fox', 'Vịt Vàng Psyduck Ngầu (5 Frames)', 'pet_golden_fox_desc', 'pet/31513.png', 'frame_companion', 5, 150, 48, 58, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_golden_fox', 0, 31513, 'pet/31513.png', -24, -29, 108, 132),
('pet_golden_fox', 1, 31514, 'pet/31514.png', -24, -29, 108, 132),
('pet_golden_fox', 2, 31515, 'pet/31515.png', -24, -29, 112, 140),
('pet_golden_fox', 3, 31516, 'pet/31516.png', -24, -29, 112, 136),
('pet_golden_fox', 4, 31517, 'pet/31517.png', -24, -29, 96, 140);

-- ========================================================
-- DATA: BỘ PET 2 - HỎA KỲ LÂN THẦN THÚ (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/7072.png -> pet/7076.png (Tốc độ 160ms, Kích thước 64x46)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_fire_kirin', 'Hỏa Kỳ Lân Lân Sư (5 Frames)', 'pet_fire_kirin_desc', 'pet/7072.png', 'frame_companion', 5, 160, 64, 46, 0, 0, 'mythic', 40, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_fire_kirin', 0, 7072, 'pet/7072.png', -32, -23, 188, 136),
('pet_fire_kirin', 1, 7073, 'pet/7073.png', -32, -23, 192, 140),
('pet_fire_kirin', 2, 7074, 'pet/7074.png', -32, -23, 200, 132),
('pet_fire_kirin', 3, 7075, 'pet/7075.png', -32, -23, 192, 132),
('pet_fire_kirin', 4, 7076, 'pet/7076.png', -32, -23, 184, 136);

-- ========================================================
-- DATA: BỘ PET 3 - HẮC GIÁP THIẾT NGƯU (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/7482.png -> pet/7486.png (Tốc độ 170ms, Kích thước 66x52)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_dark_dragon', 'Trâu Vàng (5 Frames)', 'pet_dark_dragon_desc', 'pet/7482.png', 'frame_companion', 5, 170, 66, 52, 0, 0, 'mythic', 42, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_dark_dragon', 0, 7482, 'pet/7482.png', -33, -26, 224, 168),
('pet_dark_dragon', 1, 7483, 'pet/7483.png', -33, -26, 220, 172),
('pet_dark_dragon', 2, 7484, 'pet/7484.png', -33, -26, 212, 168),
('pet_dark_dragon', 3, 7485, 'pet/7485.png', -33, -26, 232, 184),
('pet_dark_dragon', 4, 7486, 'pet/7486.png', -33, -26, 236, 160);

-- ========================================================
-- DATA: BỘ PET 4 - HOÀNG KIM TIỂU HỔ (5 FRAMES HOẠT ẢNH, ICON ĐẠI DIỆN 8761)
-- Nguồn ảnh: pet/8763.png -> pet/8767.png, Icon: pet/8761.png (Tốc độ 165ms, Kích thước 68x42)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_white_fox', 'Tiểu Hổ Vàng (5 Frames)', 'pet_white_fox_desc', 'pet/8761.png', 'frame_companion', 5, 165, 68, 42, 0, 0, 'mythic', 38, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_white_fox', 0, 8763, 'pet/8763.png', -34, -21, 244, 140),
('pet_white_fox', 1, 8764, 'pet/8764.png', -34, -21, 220, 124),
('pet_white_fox', 2, 8765, 'pet/8765.png', -34, -21, 260, 136),
('pet_white_fox', 3, 8766, 'pet/8766.png', -34, -21, 228, 136),
('pet_white_fox', 4, 8767, 'pet/8767.png', -34, -21, 224, 132);

-- ========================================================
-- DATA: BỘ PET 5 - LÔI THÚ HOÀNG KIM (8 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/10618.png -> pet/10625.png (Tốc độ 140ms, Kích thước 58x50)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_thunder_beast', 'Ma Halloween (8 Frames)', 'pet_thunder_beast_desc', 'pet/10618.png', 'frame_companion', 8, 140, 58, 50, 0, 0, 'mythic', 38, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_thunder_beast', 0, 10618, 'pet/10618.png', -29, -25, 152, 136),
('pet_thunder_beast', 1, 10619, 'pet/10619.png', -29, -25, 156, 136),
('pet_thunder_beast', 2, 10620, 'pet/10620.png', -29, -25, 160, 136),
('pet_thunder_beast', 3, 10621, 'pet/10621.png', -29, -25, 168, 136),
('pet_thunder_beast', 4, 10622, 'pet/10622.png', -29, -25, 156, 132),
('pet_thunder_beast', 5, 10623, 'pet/10623.png', -29, -25, 156, 136),
('pet_thunder_beast', 6, 10624, 'pet/10624.png', -29, -25, 168, 136),
('pet_thunder_beast', 7, 10625, 'pet/10625.png', -29, -25, 148, 144);

-- ========================================================
-- DATA: BỘ PET 6 - HUYẾT LÂN MA THÚ (6 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/12938.png -> pet/12944.png (Tốc độ 150ms, Kích thước 56x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_blood_stag', 'Kungfu Panda (6 Frames)', 'pet_blood_stag_desc', 'pet/12938.png', 'frame_companion', 6, 150, 56, 58, 0, 0, 'mythic', 42, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_blood_stag', 0, 12938, 'pet/12938.png', -28, -29, 148, 152),
('pet_blood_stag', 1, 12939, 'pet/12939.png', -28, -29, 172, 156),
('pet_blood_stag', 2, 12940, 'pet/12940.png', -28, -29, 140, 156),
('pet_blood_stag', 3, 12941, 'pet/12941.png', -28, -29, 148, 144),
('pet_blood_stag', 4, 12943, 'pet/12943.png', -28, -29, 152, 168),
('pet_blood_stag', 5, 12944, 'pet/12944.png', -28, -29, 148, 180);

-- ========================================================
-- DATA: BỘ PET 7 - BĂNG TUYẾT TINH LINH (5 FRAMES, ICON ĐẠI DIỆN 14273)
-- Nguồn ảnh: pet/14274.png -> pet/14278.png, Icon: pet/14273.png (Tốc độ 160ms, Kích thước 60x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_frost_pixie', 'Pet Cầu Mưa (5 Frames)', 'pet_frost_pixie_desc', 'pet/14273.png', 'frame_companion', 5, 160, 60, 58, 0, 0, 'mythic', 36, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_frost_pixie', 0, 14274, 'pet/14274.png', -30, -29, 168, 164),
('pet_frost_pixie', 1, 14275, 'pet/14275.png', -30, -29, 168, 164),
('pet_frost_pixie', 2, 14276, 'pet/14276.png', -30, -29, 168, 164),
('pet_frost_pixie', 3, 14277, 'pet/14277.png', -30, -29, 168, 164),
('pet_frost_pixie', 4, 14278, 'pet/14278.png', -30, -29, 168, 164);

-- ========================================================
-- DATA: BỘ PET 8 - VIÊM HỎA LONG VƯƠNG (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/19851.png -> pet/19855.png (Tốc độ 170ms, Kích thước 68x56)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_blazing_drake', 'Tiểu Long Vương (5 Frames)', 'pet_blazing_drake_desc', 'pet/19851.png', 'frame_companion', 5, 170, 68, 56, 0, 0, 'mythic', 44, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_blazing_drake', 0, 19851, 'pet/19851.png', -34, -28, 216, 177),
('pet_blazing_drake', 1, 19852, 'pet/19852.png', -34, -28, 219, 180),
('pet_blazing_drake', 2, 19853, 'pet/19853.png', -34, -28, 213, 174),
('pet_blazing_drake', 3, 19854, 'pet/19854.png', -34, -28, 204, 177),
('pet_blazing_drake', 4, 19855, 'pet/19855.png', -34, -28, 195, 177);

-- ========================================================
-- DATA: BỘ PET 9 - THỔ KHUYỂN LINH THÚ (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/6680.png -> pet/6684.png (Tốc độ 150ms, Kích thước 48x46)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_earth_shiba', 'Tuần Lộc (5 Frames)', 'pet_earth_shiba_desc', 'pet/6680.png', 'frame_companion', 5, 150, 48, 46, 0, 0, 'mythic', 36, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_earth_shiba', 0, 6680, 'pet/6680.png', -24, -23, 104, 108),
('pet_earth_shiba', 1, 6681, 'pet/6681.png', -24, -23, 132, 112),
('pet_earth_shiba', 2, 6682, 'pet/6682.png', -24, -23, 132, 112),
('pet_earth_shiba', 3, 6683, 'pet/6683.png', -24, -23, 124, 112),
('pet_earth_shiba', 4, 6684, 'pet/6684.png', -24, -23, 116, 116);

-- ========================================================
-- DATA: BỘ PET 10 - CƠ GIÁP HỘ VỆ (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/18480.png -> pet/18484.png (Tốc độ 160ms, Kích thước 50x56)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_mecha_sentinel', 'Cá Mập Biển Sâu (5 Frames)', 'pet_mecha_sentinel_desc', 'pet/18480.png', 'frame_companion', 5, 160, 50, 56, 0, 0, 'mythic', 38, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_mecha_sentinel', 0, 18480, 'pet/18480.png', -25, -28, 120, 140),
('pet_mecha_sentinel', 1, 18481, 'pet/18481.png', -25, -28, 124, 148),
('pet_mecha_sentinel', 2, 18482, 'pet/18482.png', -25, -28, 128, 136),
('pet_mecha_sentinel', 3, 18483, 'pet/18483.png', -25, -28, 124, 140),
('pet_mecha_sentinel', 4, 18484, 'pet/18484.png', -25, -28, 128, 136);

-- ========================================================
-- DATA: BỘ PET 11 - THANH LONG THẦN XÀ (7 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/18491.png -> pet/18497.png (Tốc độ 145ms, Kích thước 62x48)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_celestial_serpent', 'Mây Ngũ Sắc (7 Frames)', 'pet_celestial_serpent_desc', 'pet/18491.png', 'frame_companion', 7, 145, 62, 48, 0, 0, 'mythic', 42, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_celestial_serpent', 0, 18491, 'pet/18491.png', -31, -24, 144, 112),
('pet_celestial_serpent', 1, 18492, 'pet/18492.png', -31, -24, 144, 116),
('pet_celestial_serpent', 2, 18493, 'pet/18493.png', -31, -24, 172, 124),
('pet_celestial_serpent', 3, 18494, 'pet/18494.png', -31, -24, 180, 132),
('pet_celestial_serpent', 4, 18495, 'pet/18495.png', -31, -24, 200, 132),
('pet_celestial_serpent', 5, 18496, 'pet/18496.png', -31, -24, 196, 136),
('pet_celestial_serpent', 6, 18497, 'pet/18497.png', -31, -24, 180, 132);

-- ========================================================
-- DATA: BỘ PET 12 - HOA LINH TINH NỮ (7 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/18836.png -> pet/18842.png (Tốc độ 135ms, Kích thước 56x40)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_flora_pixie', 'Thỏ Ngọc (7 Frames)', 'pet_flora_pixie_desc', 'pet/18836.png', 'frame_companion', 7, 135, 56, 40, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_flora_pixie', 0, 18836, 'pet/18836.png', -28, -20, 131, 98),
('pet_flora_pixie', 1, 18837, 'pet/18837.png', -28, -20, 131, 98),
('pet_flora_pixie', 2, 18838, 'pet/18838.png', -28, -20, 139, 85),
('pet_flora_pixie', 3, 18839, 'pet/18839.png', -28, -20, 145, 87),
('pet_flora_pixie', 4, 18840, 'pet/18840.png', -28, -20, 184, 104),
('pet_flora_pixie', 5, 18841, 'pet/18841.png', -28, -20, 183, 93),
('pet_flora_pixie', 6, 18842, 'pet/18842.png', -28, -20, 132, 100);

-- ========================================================
-- DATA: BỘ PET 13 - BẠCH NGÂN CỔ LONG (5 FRAMES, ICON ĐẠI DIỆN 19820)
-- Nguồn ảnh: pet/19823.png -> pet/19827.png, Icon: pet/19820.png (Tốc độ 165ms, Kích thước 64x42)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_silver_drake', 'Người Tuyết (5 Frames)', 'pet_silver_drake_desc', 'pet/19820.png', 'frame_companion', 5, 165, 64, 42, 0, 0, 'mythic', 44, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_silver_drake', 0, 19823, 'pet/19823.png', -32, -21, 232, 132),
('pet_silver_drake', 1, 19824, 'pet/19824.png', -32, -21, 232, 132),
('pet_silver_drake', 2, 19825, 'pet/19825.png', -32, -21, 232, 132),
('pet_silver_drake', 3, 19826, 'pet/19826.png', -32, -21, 232, 132),
('pet_silver_drake', 4, 19827, 'pet/19827.png', -32, -21, 232, 132);

-- ========================================================
-- DATA: BỘ PET 14 - CỔ THÁP PHÙ ĐIÊU (5 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/21662.png -> pet/21666.png (Tốc độ 180ms, Kích thước 38x70)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_divine_obelisk', 'Tiểu Khủng Long (5 Frames)', 'pet_divine_obelisk_desc', 'pet/21662.png', 'frame_companion', 5, 180, 38, 70, 0, 0, 'mythic', 36, 0.95);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_divine_obelisk', 0, 21662, 'pet/21662.png', -19, -35, 100, 196),
('pet_divine_obelisk', 1, 21663, 'pet/21663.png', -19, -35, 100, 164),
('pet_divine_obelisk', 2, 21664, 'pet/21664.png', -19, -35, 100, 168),
('pet_divine_obelisk', 3, 21665, 'pet/21665.png', -19, -35, 100, 224),
('pet_divine_obelisk', 4, 21666, 'pet/21666.png', -19, -35, 100, 240);

-- ========================================================
-- DATA: BỘ PET 15 - ANH ĐÀO LINH HỒ (5 FRAMES, ICON ĐẠI DIỆN 31572)
-- Nguồn ảnh: pet/31567.png -> pet/31571.png, Icon: pet/31572.png (Tốc độ 150ms, Kích thước 48x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_sakura_fox', 'Capybara (5 Frames)', 'pet_sakura_fox_desc', 'pet/31572.png', 'frame_companion', 5, 150, 48, 58, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_sakura_fox', 0, 31567, 'pet/31567.png', -24, -29, 120, 136),
('pet_sakura_fox', 1, 31568, 'pet/31568.png', -24, -29, 124, 144),
('pet_sakura_fox', 2, 31569, 'pet/31569.png', -24, -29, 120, 140),
('pet_sakura_fox', 3, 31570, 'pet/31570.png', -24, -29, 124, 136),
('pet_sakura_fox', 4, 31571, 'pet/31571.png', -24, -29, 120, 140);

-- ========================================================
-- DATA: BỘ PET 16 - TINH VÂN THẦN ƯNG (8 FRAMES HOẠT ẢNH)
-- Nguồn ảnh: pet/31852.png -> pet/31859.png (Tốc độ 140ms, Kích thước 54x64)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_astral_falcon', 'Hải Ly (8 Frames)', 'pet_astral_falcon_desc', 'pet/31852.png', 'frame_companion', 8, 140, 54, 64, 0, 0, 'mythic', 40, 1.1);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_astral_falcon', 0, 31852, 'pet/31852.png', -27, -32, 142, 171),
('pet_astral_falcon', 1, 31853, 'pet/31853.png', -27, -32, 142, 171),
('pet_astral_falcon', 2, 31854, 'pet/31854.png', -27, -32, 142, 171),
('pet_astral_falcon', 3, 31855, 'pet/31855.png', -27, -32, 142, 171),
('pet_astral_falcon', 4, 31856, 'pet/31856.png', -27, -32, 142, 171),
('pet_astral_falcon', 5, 31857, 'pet/31857.png', -27, -32, 142, 171),
('pet_astral_falcon', 6, 31858, 'pet/31858.png', -27, -32, 142, 171),
('pet_astral_falcon', 7, 31859, 'pet/31859.png', -27, -32, 142, 171);

-- ========================================================
-- DATA: BỘ PET 17 - ANH ĐÀO THỎ NGỌC (4 FRAMES)
-- Nguồn ảnh: pet/6091.png (Tốc độ 160ms, Kích thước 52x52)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_sakura_bunny', 'Ma Hồng (4 Frames)', 'pet_sakura_bunny_desc', 'pet/6091.png', 'frame_companion', 4, 160, 52, 52, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_sakura_bunny', 0, 6091, 'pet/6091.png', -26, -26, 112, 112),
('pet_sakura_bunny', 1, 6092, 'pet/6092.png', -26, -26, 112, 112),
('pet_sakura_bunny', 2, 6093, 'pet/6093.png', -26, -26, 112, 112),
('pet_sakura_bunny', 3, 6097, 'pet/6097.png', -26, -26, 112, 112);

-- ========================================================
-- DATA: BỘ PET 18 - HOÀNG KIM HỔ CON (5 FRAMES)
-- Nguồn ảnh: pet/6156.png (Tốc độ 150ms, Kích thước 54x46)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_amber_tiger', 'Chó Con (5 Frames)', 'pet_amber_tiger_desc', 'pet/6156.png', 'frame_companion', 5, 150, 54, 46, 0, 0, 'mythic', 36, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_amber_tiger', 0, 6156, 'pet/6156.png', -27, -23, 100, 88),
('pet_amber_tiger', 1, 6157, 'pet/6157.png', -27, -23, 104, 92),
('pet_amber_tiger', 2, 6158, 'pet/6158.png', -27, -23, 108, 88),
('pet_amber_tiger', 3, 6159, 'pet/6159.png', -27, -23, 104, 92),
('pet_amber_tiger', 4, 6160, 'pet/6160.png', -27, -23, 96, 80);

-- ========================================================
-- DATA: BỘ PET 19 - NGÂN NGUYỆT CỬU VĨ (5 FRAMES)
-- Nguồn ảnh: pet/8771.png (Tốc độ 165ms, Kích thước 68x42)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_silver_nine_tails', 'Tiểu Bạch Hổ (5 Frames)', 'pet_silver_nine_tails_desc', 'pet/8771.png', 'frame_companion', 5, 165, 68, 42, 0, 0, 'mythic', 40, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_silver_nine_tails', 0, 8771, 'pet/8771.png', -34, -21, 216, 128),
('pet_silver_nine_tails', 1, 8772, 'pet/8772.png', -34, -21, 212, 128),
('pet_silver_nine_tails', 2, 8773, 'pet/8773.png', -34, -21, 232, 118),
('pet_silver_nine_tails', 3, 8774, 'pet/8774.png', -34, -21, 216, 124),
('pet_silver_nine_tails', 4, 8775, 'pet/8775.png', -34, -21, 228, 116);

-- ========================================================
-- DATA: BỘ PET 20 - DẠ HÀNH THẦN ĐIÊU (7 FRAMES)
-- Nguồn ảnh: pet/9711.png (Tốc độ 140ms, Kích thước 44x52)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_night_sentinel', 'Minion (7 Frames)', 'pet_night_sentinel_desc', 'pet/9711.png', 'frame_companion', 7, 140, 44, 52, 0, 0, 'mythic', 36, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_night_sentinel', 0, 9711, 'pet/9711.png', -22, -26, 48, 80),
('pet_night_sentinel', 1, 9712, 'pet/9712.png', -22, -26, 48, 80),
('pet_night_sentinel', 2, 9713, 'pet/9713.png', -22, -26, 68, 80),
('pet_night_sentinel', 3, 9714, 'pet/9714.png', -22, -26, 76, 84),
('pet_night_sentinel', 4, 9715, 'pet/9715.png', -22, -26, 72, 84),
('pet_night_sentinel', 5, 9716, 'pet/9716.png', -22, -26, 84, 84),
('pet_night_sentinel', 6, 9717, 'pet/9717.png', -22, -26, 76, 88);

-- ========================================================
-- DATA: BỘ PET 21 - XÍCH HỎA SƯ ĐIÊU (4 FRAMES)
-- Nguồn ảnh: pet/12091.png (Tốc độ 155ms, Kích thước 62x44)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_blaze_gryphon', 'Mèo Shiba (4 Frames)', 'pet_blaze_gryphon_desc', 'pet/12091.png', 'frame_companion', 4, 155, 62, 44, 0, 0, 'mythic', 42, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_blaze_gryphon', 0, 12091, 'pet/12091.png', -31, -22, 144, 104),
('pet_blaze_gryphon', 1, 12093, 'pet/12093.png', -31, -22, 144, 112),
('pet_blaze_gryphon', 2, 12094, 'pet/12094.png', -31, -22, 172, 112),
('pet_blaze_gryphon', 3, 12095, 'pet/12095.png', -31, -22, 172, 112);

-- ========================================================
-- DATA: BỘ PET 22 - NHAM THẠCH SƯ ĐIÊU (3 FRAMES)
-- Nguồn ảnh: pet/12330.png (Tốc độ 175ms, Kích thước 62x44)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_earth_gryphon', 'Chó Shiba (3 Frames)', 'pet_earth_gryphon_desc', 'pet/12330.png', 'frame_companion', 3, 175, 62, 44, 0, 0, 'mythic', 42, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_earth_gryphon', 0, 12330, 'pet/12330.png', -31, -22, 144, 112),
('pet_earth_gryphon', 1, 12331, 'pet/12331.png', -31, -22, 172, 112),
('pet_earth_gryphon', 2, 12332, 'pet/12332.png', -31, -22, 172, 112);

-- ========================================================
-- DATA: BỘ PET 23 - KIM SÍ THẦN PHỤNG (5 FRAMES)
-- Nguồn ảnh: pet/12405.png (Tốc độ 150ms, Kích thước 48x60)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_golden_phoenix', 'Kim Sí Thần Phụng (5 Frames)', 'pet_golden_phoenix_desc', 'pet/12405.png', 'frame_companion', 5, 150, 48, 60, 0, 0, 'mythic', 38, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_golden_phoenix', 0, 12405, 'pet/12405.png', -24, -30, 100, 128),
('pet_golden_phoenix', 1, 12406, 'pet/12406.png', -24, -30, 104, 124),
('pet_golden_phoenix', 2, 12407, 'pet/12407.png', -24, -30, 100, 124),
('pet_golden_phoenix', 3, 12408, 'pet/12408.png', -24, -30, 96, 124),
('pet_golden_phoenix', 4, 12409, 'pet/12409.png', -24, -30, 96, 128);

-- ========================================================
-- DATA: BỘ PET 24 - DUNG NHAM CỰ THÚ (5 FRAMES)
-- Nguồn ảnh: pet/12552.png (Tốc độ 160ms, Kích thước 58x62)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_magma_behemoth', 'Dung Nham Cự Thú (5 Frames)', 'pet_magma_behemoth_desc', 'pet/12552.png', 'frame_companion', 5, 160, 58, 62, 0, 0, 'mythic', 44, 0.95);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_magma_behemoth', 0, 12552, 'pet/12552.png', -29, -31, 140, 160),
('pet_magma_behemoth', 1, 12554, 'pet/12554.png', -29, -31, 172, 172),
('pet_magma_behemoth', 2, 12555, 'pet/12555.png', -29, -31, 164, 172),
('pet_magma_behemoth', 3, 12556, 'pet/12556.png', -29, -31, 164, 172),
('pet_magma_behemoth', 4, 12557, 'pet/12557.png', -29, -31, 164, 172);

-- ========================================================
-- DATA: BỘ PET 25 - KIM GIÁC LÔI THÚ (6 FRAMES)
-- Nguồn ảnh: pet/13871.png (Tốc độ 145ms, Kích thước 46x64)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_thunder_antler', 'Kim Giác Lôi Thú (6 Frames)', 'pet_thunder_antler_desc', 'pet/13871.png', 'frame_companion', 6, 145, 46, 64, 0, 0, 'mythic', 40, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_thunder_antler', 0, 13871, 'pet/13871.png', -23, -32, 88, 140),
('pet_thunder_antler', 1, 13872, 'pet/13872.png', -23, -32, 88, 136),
('pet_thunder_antler', 2, 13873, 'pet/13873.png', -23, -32, 88, 140),
('pet_thunder_antler', 3, 13874, 'pet/13874.png', -23, -32, 88, 136),
('pet_thunder_antler', 4, 13875, 'pet/13875.png', -23, -32, 88, 132),
('pet_thunder_antler', 5, 13876, 'pet/13876.png', -23, -32, 88, 148);

-- ========================================================
-- DATA: BỘ PET 26 - QUANG MINH TINH LINH (4 FRAMES)
-- Nguồn ảnh: pet/13956.png (Tốc độ 150ms, Kích thước 48x56)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_solar_pixie', 'Quang Minh Tinh Linh (4 Frames)', 'pet_solar_pixie_desc', 'pet/13956.png', 'frame_companion', 4, 150, 48, 56, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_solar_pixie', 0, 13956, 'pet/13956.png', -24, -28, 100, 120),
('pet_solar_pixie', 1, 13957, 'pet/13957.png', -24, -28, 96, 108),
('pet_solar_pixie', 2, 13958, 'pet/13958.png', -24, -28, 120, 132),
('pet_solar_pixie', 3, 13959, 'pet/13959.png', -24, -28, 104, 116);

-- ========================================================
-- DATA: BỘ PET 27 - U HỒN HẮC LANG (6 FRAMES)
-- Nguồn ảnh: pet/14503.png (Tốc độ 140ms, Kích thước 46x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_shadow_wolf', 'U Hồn Hắc Lang (6 Frames)', 'pet_shadow_wolf_desc', 'pet/14503.png', 'frame_companion', 6, 140, 46, 58, 0, 0, 'mythic', 38, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_shadow_wolf', 0, 14503, 'pet/14503.png', -23, -29, 88, 124),
('pet_shadow_wolf', 1, 14504, 'pet/14504.png', -23, -29, 92, 120),
('pet_shadow_wolf', 2, 14505, 'pet/14505.png', -23, -29, 88, 124),
('pet_shadow_wolf', 3, 14506, 'pet/14506.png', -23, -29, 88, 120),
('pet_shadow_wolf', 4, 14507, 'pet/14507.png', -23, -29, 88, 116),
('pet_shadow_wolf', 5, 14508, 'pet/14508.png', -23, -29, 92, 132);

-- ========================================================
-- DATA: BỘ PET 28 - HUYẾT LONG THẦN THÚ (5 FRAMES)
-- Nguồn ảnh: pet/14662.png (Tốc độ 155ms, Kích thước 56x60)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_crimson_drake', 'Huyết Long Thần Thú (5 Frames)', 'pet_crimson_drake_desc', 'pet/14662.png', 'frame_companion', 5, 155, 56, 60, 0, 0, 'mythic', 42, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_crimson_drake', 0, 14662, 'pet/14662.png', -28, -30, 132, 140),
('pet_crimson_drake', 1, 14663, 'pet/14663.png', -28, -30, 132, 144),
('pet_crimson_drake', 2, 14664, 'pet/14664.png', -28, -30, 128, 140),
('pet_crimson_drake', 3, 14665, 'pet/14665.png', -28, -30, 132, 136),
('pet_crimson_drake', 4, 14666, 'pet/14666.png', -28, -30, 128, 144);

-- ========================================================
-- DATA: BỘ PET 29 - THƯƠNG HẢI THẦN LONG (6 FRAMES)
-- Nguồn ảnh: pet/14779.png (Tốc độ 145ms, Kích thước 64x46)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_abyssal_leviathan', 'Cá Mập Mắc Cạn (6 Frames)', 'pet_abyssal_leviathan_desc', 'pet/14779.png', 'frame_companion', 6, 145, 64, 46, 0, 0, 'mythic', 44, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_abyssal_leviathan', 0, 14779, 'pet/14779.png', -32, -23, 152, 112),
('pet_abyssal_leviathan', 1, 14780, 'pet/14780.png', -32, -23, 164, 112),
('pet_abyssal_leviathan', 2, 14781, 'pet/14781.png', -32, -23, 176, 112),
('pet_abyssal_leviathan', 3, 14782, 'pet/14782.png', -32, -23, 172, 112),
('pet_abyssal_leviathan', 4, 14783, 'pet/14783.png', -32, -23, 164, 108),
('pet_abyssal_leviathan', 5, 14784, 'pet/14784.png', -32, -23, 164, 104);

-- ========================================================
-- DATA: BỘ PET 30 - HỒNG ĐIỆP TIÊN LINH (6 FRAMES)
-- Nguồn ảnh: pet/14809.png (Tốc độ 140ms, Kích thước 50x50)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_rose_fairy', 'Baby 3 (6 Frames)', 'pet_rose_fairy_desc', 'pet/14809.png', 'frame_companion', 6, 140, 50, 50, 0, 0, 'mythic', 34, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_rose_fairy', 0, 14809, 'pet/14809.png', -25, -25, 108, 108),
('pet_rose_fairy', 1, 14810, 'pet/14810.png', -25, -25, 108, 104),
('pet_rose_fairy', 2, 14811, 'pet/14811.png', -25, -25, 108, 100),
('pet_rose_fairy', 3, 14812, 'pet/14812.png', -25, -25, 108, 108),
('pet_rose_fairy', 4, 14813, 'pet/14813.png', -25, -25, 108, 100),
('pet_rose_fairy', 5, 14814, 'pet/14814.png', -25, -25, 108, 108);

-- ========================================================
-- DATA: BỘ PET 31 - BẢO TRÚC LINH MIÊU (6 FRAMES)
-- Nguồn ảnh: pet/14825.png (Tốc độ 150ms, Kích thước 48x54)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_mystic_panda', 'Bảo Trúc Linh Miêu (6 Frames)', 'pet_mystic_panda_desc', 'pet/14825.png', 'frame_companion', 6, 150, 48, 54, 0, 0, 'mythic', 36, 1.0);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_mystic_panda', 0, 14825, 'pet/14825.png', -24, -27, 100, 116),
('pet_mystic_panda', 1, 14826, 'pet/14826.png', -24, -27, 100, 112),
('pet_mystic_panda', 2, 14827, 'pet/14827.png', -24, -27, 100, 108),
('pet_mystic_panda', 3, 14828, 'pet/14828.png', -24, -27, 100, 116),
('pet_mystic_panda', 4, 14829, 'pet/14829.png', -24, -27, 100, 108),
('pet_mystic_panda', 5, 14830, 'pet/14830.png', -24, -27, 100, 116);

-- ========================================================
-- DATA: BỘ PET 32 - THÁI CỔ LONG THẦN (4 FRAMES)
-- Nguồn ảnh: pet/16183.png (Tốc độ 180ms, Kích thước 78x62)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_titan_drake', 'Thái Cổ Long Thần (4 Frames)', 'pet_titan_drake_desc', 'pet/16183.png', 'frame_companion', 4, 180, 78, 62, 0, 0, 'mythic', 48, 0.95);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_titan_drake', 0, 16183, 'pet/16183.png', -39, -31, 336, 252),
('pet_titan_drake', 1, 16184, 'pet/16184.png', -39, -31, 328, 248),
('pet_titan_drake', 2, 16185, 'pet/16185.png', -39, -31, 336, 248),
('pet_titan_drake', 3, 16186, 'pet/16186.png', -39, -31, 340, 252);

-- ========================================================
-- DATA: BỘ PET 33 - BẠCH NGÂN BÁO THẦN (5 FRAMES)
-- Nguồn ảnh: pet/16285.png (Tốc độ 140ms, Kích thước 60x38)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_frost_leopard', 'Cậu Vàng (5 Frames)', 'pet_frost_leopard_desc', 'pet/16285.png', 'frame_companion', 5, 140, 60, 38, 0, 0, 'mythic', 38, 1.1);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_frost_leopard', 0, 16285, 'pet/16285.png', -30, -19, 120, 76),
('pet_frost_leopard', 1, 16286, 'pet/16286.png', -30, -19, 120, 76),
('pet_frost_leopard', 2, 16287, 'pet/16287.png', -30, -19, 120, 76),
('pet_frost_leopard', 3, 16288, 'pet/16288.png', -30, -19, 120, 76),
('pet_frost_leopard', 4, 16289, 'pet/16289.png', -30, -19, 120, 76);

-- ========================================================
-- DATA: BỘ PET 34 - LAM TINH SỨ GIẢ (7 FRAMES)
-- Nguồn ảnh: pet/17433.png (Tốc độ 150ms, Kích thước 76x58)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_azure_seraph', 'Lam Tinh Sứ Giả (7 Frames)', 'pet_azure_seraph_desc', 'pet/17433.png', 'frame_companion', 7, 150, 76, 58, 0, 0, 'mythic', 44, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_azure_seraph', 0, 17433, 'pet/17433.png', -38, -29, 680, 520),
('pet_azure_seraph', 1, 17434, 'pet/17434.png', -38, -29, 680, 520),
('pet_azure_seraph', 2, 17435, 'pet/17435.png', -38, -29, 680, 520),
('pet_azure_seraph', 3, 17436, 'pet/17436.png', -38, -29, 680, 520),
('pet_azure_seraph', 4, 17437, 'pet/17437.png', -38, -29, 680, 520),
('pet_azure_seraph', 5, 17438, 'pet/17438.png', -38, -29, 680, 520),
('pet_azure_seraph', 6, 17439, 'pet/17439.png', -38, -29, 680, 520);

-- ========================================================
-- DATA: BỘ PET 35 - XÍCH KIM THẦN THÚ (4 FRAMES)
-- Nguồn ảnh: pet/27969.png (Tốc độ 150ms, Kích thước 60x42)
-- ========================================================
INSERT INTO pet_templates (pet_id, name, desc_key, icon_url, pet_type, total_frames, delay_ms, render_width, render_height, offset_x, offset_y, rarity, follow_dist, speed_factor)
VALUES ('pet_solar_kirin', 'Xích Kim Thần Thú (4 Frames)', 'pet_solar_kirin_desc', 'pet/27969.png', 'frame_companion', 4, 150, 60, 42, 0, 0, 'mythic', 38, 1.05);

INSERT INTO pet_frames (pet_id, frame_index, image_id, image_url, dx, dy, raw_width, raw_height) VALUES
('pet_solar_kirin', 0, 27969, 'pet/27969.png', -30, -21, 160, 112),
('pet_solar_kirin', 1, 27970, 'pet/27970.png', -30, -21, 160, 112),
('pet_solar_kirin', 2, 27971, 'pet/27971.png', -30, -21, 160, 112),
('pet_solar_kirin', 3, 27972, 'pet/27972.png', -30, -21, 160, 112);
