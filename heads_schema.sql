-- ========================================================
-- TÂY NGUYÊN UNIVERSITY (TNU) - HEADS FRAME SPRITE DATABASE SCHEMA
-- Quản lý khung hình (Frames) và hướng nhìn Kiểu Đầu (Head Frames) 4 hướng chuẩn xác:
-- Hỗ trợ 3 bộ Kiểu Đầu Frame từ thư mục head/:
-- 1. Kiểu Đầu Videl Song Bính (Dragon Boy): 9390 (Front), 9391 (Side), 9392 (Back)
-- 2. Tiểu Thư Tóc Vàng Nơ Xanh (Quý Tộc): 17784 (Front), 17785 (Side), 17786 (Back)
-- 3. Chiến Binh Vương Miện Vàng (Hoàng Tử): 21714 (Front), 21715 (Side), 21716 (Back)
-- ========================================================

CREATE TABLE IF NOT EXISTS head_templates (
    head_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    desc_key VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255) NOT NULL,
    head_type VARCHAR(20) DEFAULT 'frame_directional',
    total_frames INT NOT NULL DEFAULT 4,
    render_width INT NOT NULL,
    render_height INT NOT NULL,
    offset_x INT DEFAULT 0,
    offset_y INT DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'mythic'
);

CREATE TABLE IF NOT EXISTS head_frames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    head_id VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL, -- 'down', 'right', 'left', 'up'
    image_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    back_image_url VARCHAR(255) DEFAULT NULL, -- Lớp tóc phía sau lưng nếu có
    dx INT DEFAULT 0,
    dy INT DEFAULT 0,
    render_width INT NOT NULL,
    render_height INT NOT NULL,
    flip_x BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (head_id) REFERENCES head_templates(head_id)
);

-- ========================================================
-- DATA: BỘ 1 - KIỂU ĐẦU VIDEL SONG BÍNH (DRAGON BOY ANIME)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_videl', 'Kiểu Đầu Videl Song Bính', 'head_videl_desc', 'head/9390.png', 'frame_directional', 4, 38, 46, 0, -68, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_videl', 'down', 9390, 'head/9390.png', -19, -54, 38, 46, FALSE),
('head_videl', 'right', 9391, 'head/9391.png', -20, -54, 38, 46, FALSE),
('head_videl', 'left', 9391, 'head/9391.png', -20, -54, 38, 46, TRUE),
('head_videl', 'up', 9392, 'head/9392.png', -19, -54, 38, 46, FALSE);

-- ========================================================
-- DATA: BỘ 2 - TIỂU THƯ TÓC VÀNG NƠ XANH (QUÝ TỘC)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_blonde_ribbon', 'Tiểu Thư Tóc Vàng Nơ Xanh', 'head_blonde_ribbon_desc', 'head/17784.png', 'frame_directional', 4, 44, 50, 0, -52, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, back_image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_blonde_ribbon', 'down', 17784, 'head/17784_front.png', 'head/17784_back.png', -22, -52, 44, 50, FALSE),
('head_blonde_ribbon', 'right', 17785, 'head/17785.png', NULL, -26, -50, 50, 38, FALSE),
('head_blonde_ribbon', 'left', 17785, 'head/17785.png', NULL, -26, -50, 50, 38, TRUE),
('head_blonde_ribbon', 'up', 17786, 'head/17786.png', NULL, -22, -52, 44, 50, FALSE);

-- ========================================================
-- DATA: BỘ 3 - CHIẾN BINH VƯƠNG MIỆN VÀNG (HOÀNG TỬ)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_crown_prince', 'Chiến Binh Vương Miện Vàng', 'head_crown_prince_desc', 'head/21714.png', 'frame_directional', 4, 36, 48, 0, -66, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_crown_prince', 'down', 21714, 'head/21714.png', -18, -66, 36, 48, FALSE),
('head_crown_prince', 'right', 21715, 'head/21715.png', -18, -64, 38, 43, FALSE),
('head_crown_prince', 'left', 21715, 'head/21715.png', -18, -64, 38, 43, TRUE),
('head_crown_prince', 'up', 21716, 'head/21716.png', -18, -66, 36, 48, FALSE);

-- ========================================================
-- DATA: BỘ 4 - KIỂU ĐẦU GOKU SIÊU CẤP (DRAGON BOY ANIME)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_goku', 'Kiểu Đầu Goku Siêu Cấp', 'head_goku_desc', 'head/17.png', 'frame_directional', 4, 54, 48, 0, -70, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_goku', 'down', 17, 'head/17.png', -29, -70, 54, 48, FALSE),
('head_goku', 'right', 18, 'head/18.png', -28, -68, 52, 46, FALSE),
('head_goku', 'left', 18, 'head/18.png', -28, -68, 52, 46, TRUE),
('head_goku', 'up', 16, 'head/16.png', -32, -70, 63, 48, FALSE);

-- ========================================================
-- DATA: BỘ 5 - NỮ PHÁP SƯ ELF TÓC BẠC (FRIEREN)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_elf_silver', 'Nữ Pháp Sư Elf Tóc Bạc', 'head_elf_silver_desc', 'head/12955.png', 'frame_directional', 4, 62, 60, 0, -66, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_elf_silver', 'down', 12955, 'head/12955.png', -31, -66, 62, 60, FALSE),
('head_elf_silver', 'right', 12956, 'head/12956.png', -40, -62, 66, 56, FALSE),
('head_elf_silver', 'left', 12956, 'head/12956.png', -40, -62, 66, 56, TRUE),
('head_elf_silver', 'up', 12954, 'head/12954.png', -31, -66, 62, 60, FALSE);

-- ========================================================
-- DATA: BỘ 6 - MŨ BÍ NGÔ MÈO MA QUÁI (HALLOWEEN)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_pumpkin_cat', 'Mũ Bí NgÔ Mèo Ma Quái', 'head_pumpkin_cat_desc', 'head/6985.png', 'frame_directional', 4, 38, 52, 0, -72, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_pumpkin_cat', 'down', 6985, 'head/6985.png', -19, -72, 38, 52, FALSE),
('head_pumpkin_cat', 'right', 6986, 'head/6986.png', -19, -72, 38, 52, FALSE),
('head_pumpkin_cat', 'left', 6986, 'head/6986.png', -19, -72, 38, 52, TRUE),
('head_pumpkin_cat', 'up', 6984, 'head/6984.png', -22, -72, 44, 52, FALSE);

-- ========================================================
-- DATA: BỘ 7 - MŨ CHUỘT VÀNG CHIÊU TÀI (PHÚC KHÍ)
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_fortune_mouse', 'Mũ Chuột Vàng Chiêu Tài', 'head_fortune_mouse_desc', 'head/7085.png', 'frame_directional', 4, 64, 64, 0, -84, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_fortune_mouse', 'down', 7085, 'head/7085.png', -40, -84, 64, 64, FALSE),
('head_fortune_mouse', 'right', 7086, 'head/7086.png', -38, -84, 62, 64, FALSE),
('head_fortune_mouse', 'left', 7086, 'head/7086.png', -38, -84, 62, 64, TRUE),
('head_fortune_mouse', 'up', 7087, 'head/7087.png', -36, -84, 73, 64, FALSE);

-- ========================================================
-- DATA: BỘ 8 - MŨ BÒ SỮA CHIBI TINH NGHỊCH
-- ========================================================
INSERT INTO head_templates (head_id, name, desc_key, icon_url, head_type, total_frames, render_width, render_height, offset_x, offset_y, rarity)
VALUES ('head_cow_hat', 'Mũ Bò Sữa Chibi Tinh Nghịch', 'head_cow_hat_desc', 'head/7600.png', 'frame_directional', 4, 48, 52, 0, -72, 'mythic');

INSERT INTO head_frames (head_id, direction, image_id, image_url, dx, dy, render_width, render_height, flip_x) VALUES
('head_cow_hat', 'down', 7600, 'head/7600.png', -24, -72, 48, 52, FALSE),
('head_cow_hat', 'right', 7601, 'head/7601.png', -23, -72, 48, 52, FALSE),
('head_cow_hat', 'left', 7601, 'head/7601.png', -23, -72, 48, 52, TRUE),
('head_cow_hat', 'up', 7602, 'head/7602.png', -28, -72, 57, 52, FALSE);
