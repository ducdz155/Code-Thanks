/**
 * BODY SQL DATABASE & UNIFIED CHARACTER OUTFIT SYSTEM
 * Quản lý 21 Bộ Trang Phục Hoàn Chỉnh Chuẩn Anime 4 Hướng Chuẩn Anime 4 Hướng Đồng Bộ (Thân + Đầu + Chân + Hoạt Ảnh Chuẩn 4 Hướng):
 * 1. outfit_frieren: Nữ Pháp Sư Elf Frieren (Áo Hiệp Sĩ 1000 + Đầu Elf Tóc Bạc 12955)
 * 2. outfit_videl_noel: Nữ Chiến Binh Videl Giáng Sinh (Áo Choàng Noel 4 + Đầu Videl 9390)
 * 3. outfit_prince_warrior: Hoàng Tử Chiến Binh Cổ Đại (Áo Dũng Sĩ 1 + Vương Miện Hoàng Tử 21714)
 * 4. outfit_goddess_blonde: Nữ Thần Rừng Quý Phái (Xiêm Y Nữ Thần 5 + Tóc Vàng Nơ Xanh 17784)
 *
 * Mọi bộ trang phục đều ghép khít từng pixel, cổ áo và cằm gắn liền hoàn mỹ, không lộ ngấn cổ hay xuyên thấu.
 */

class BodySQLDatabase {
    constructor() {
        this.tables = {
            body_templates: [],
            body_frames: [],
            outfit_heads: []
        };
        this.imageCache = new Map();
        this.isLoaded = false;
        this.loadedCount = 0;
        this.totalImages = 0;

        // Bảng ánh xạ ID cũ sang ID trang phục hoàn chỉnh
        this.legacyAliases = {
            'outfit_1000': 'outfit_frieren',
            'outfit_4': 'outfit_videl_noel',
            'outfit_1': 'outfit_prince_warrior',
            'outfit_5': 'outfit_goddess_blonde',
            'outfit_2': 'outfit_frieren',
            'outfit_3': 'outfit_frieren',
            'tho_cam_e_de': 'outfit_prince_warrior',
            'the_duc_tnu': 'outfit_videl_noel',
            'dong_phuc_tnu': 'outfit_frieren',
            'ao_blouse': 'outfit_frieren',
            'ao_tot_nghiep': 'outfit_prince_warrior',
            'ao_dai': 'outfit_goddess_blonde',
            'hoc_sinh_thpt': 'outfit_videl_noel',
            'tho_cam_ba_na': 'outfit_prince_warrior'
        };

        // Khởi tạo và nạp dữ liệu SQL Schema
        this.seedDatabase();
        this.preloadTextures();
    }

    resolveOutfitId(id) {
        if (!id) return 'outfit_frieren';
        if (this.tables.body_templates.some(t => t.body_id === id)) return id;
        return this.legacyAliases[id] || 'outfit_frieren';
    }

    // Nạp dữ liệu 4 Bộ Trang Phục Hoàn Chỉnh
    seedDatabase() {
        // 1. Bảng body_templates (4 Bộ Trang Phục Duy Nhất)
        this.tables.body_templates = [
            {
                body_id: 'outfit_frieren',
                name: 'Nữ Pháp Sư Elf Frieren',
                nameKey: 'outfit_frieren_name',
                descKey: 'outfit_frieren_desc',
                icon_url: 'body/outfit_frieren_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 32,
                render_height: 58,
                rarity: 'mythic',
                speed_bonus: 0.75
            },
            {
                body_id: 'outfit_videl_noel',
                name: 'Nữ Chiến Binh Videl Giáng Sinh',
                nameKey: 'outfit_videl_noel_name',
                descKey: 'outfit_videl_noel_desc',
                icon_url: 'body/outfit_videl_noel_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 42,
                render_height: 58,
                rarity: 'mythic',
                speed_bonus: 0.70
            },
            {
                body_id: 'outfit_prince_warrior',
                name: 'Hoàng Tử Chiến Binh Cổ Đại',
                nameKey: 'outfit_prince_warrior_name',
                descKey: 'outfit_prince_warrior_desc',
                icon_url: 'body/outfit_prince_warrior_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 50,
                render_height: 58,
                rarity: 'mythic',
                speed_bonus: 0.70
            },
            {
                body_id: 'outfit_goddess_blonde',
                name: 'Nữ Thần Rừng Quý Phái',
                nameKey: 'outfit_goddess_blonde_name',
                descKey: 'outfit_goddess_blonde_desc',
                icon_url: 'body/outfit_goddess_blonde_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 50,
                render_height: 58,
                rarity: 'mythic',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_naruto',
                name: 'Naruto Lục Đạo Hoàng Kim',
                nameKey: 'skin_naruto_name',
                descKey: 'skin_naruto_desc',
                icon_url: 'body/skin_naruto_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 56,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.85
            },
            {
                body_id: 'skin_blue_knight',
                name: 'Hiệp Sĩ Tóc Lam Hoàng Tộc',
                nameKey: 'skin_blue_knight_name',
                descKey: 'skin_blue_knight_desc',
                icon_url: 'body/skin_blue_knight_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 60,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.75
            },
            {
                body_id: 'skin_doraemon',
                name: 'Chú Mèo Máy Doraemon',
                nameKey: 'skin_doraemon_name',
                descKey: 'skin_doraemon_desc',
                icon_url: 'body/skin_doraemon_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 57,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_purple_cap',
                name: 'Tiểu Thư Mũ Cam Tóc Tím',
                nameKey: 'skin_purple_cap_name',
                descKey: 'skin_purple_cap_desc',
                icon_url: 'body/skin_purple_cap_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 49,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.70
            },
            {
                body_id: 'skin_fairy_crimson',
                name: 'Tiên Nữ Cung Đình Lụa Đỏ',
                nameKey: 'skin_fairy_crimson_name',
                descKey: 'skin_fairy_crimson_desc',
                icon_url: 'body/skin_fairy_crimson_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 71,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.85
            },
            {
                body_id: 'skin_goku_fighter',
                name: 'Võ Sĩ Goku Siêu Cấp',
                nameKey: 'skin_goku_fighter_name',
                descKey: 'skin_goku_fighter_desc',
                icon_url: 'body/skin_goku_fighter_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 49,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_kitsune_maiden',
                name: 'Hồ Ly Tiên Tử Tóc Bạch',
                nameKey: 'skin_kitsune_maiden_name',
                descKey: 'skin_kitsune_maiden_desc',
                icon_url: 'body/skin_kitsune_maiden_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 56,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_flame_rengoku',
                name: 'Viêm Trụ Rengoku Lửa Đỏ',
                nameKey: 'skin_flame_rengoku_name',
                descKey: 'skin_flame_rengoku_desc',
                icon_url: 'body/skin_flame_rengoku_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 46,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.85
            },
            {
                body_id: 'skin_bulma_qipao',
                name: 'Tiểu Thư Sườn Xám Bulma',
                nameKey: 'skin_bulma_qipao_name',
                descKey: 'skin_bulma_qipao_desc',
                icon_url: 'body/skin_bulma_qipao_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 46,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.70
            },
            {
                body_id: 'skin_chichi_martial',
                name: 'Nữ Hiệp Lam Y Chi-Chi',
                nameKey: 'skin_chichi_martial_name',
                descKey: 'skin_chichi_martial_desc',
                icon_url: 'body/skin_chichi_martial_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 51,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.75
            },
            {
                body_id: 'skin_gatchan_angel',
                name: 'Bé Thiên Thần Gatchan',
                nameKey: 'skin_gatchan_angel_name',
                descKey: 'skin_gatchan_angel_desc',
                icon_url: 'body/skin_gatchan_angel_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 53,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_wuxia_redhair',
                name: 'Ma Tôn Tiên Hiệp Tóc Đỏ',
                nameKey: 'skin_wuxia_redhair_name',
                descKey: 'skin_wuxia_redhair_desc',
                icon_url: 'body/skin_wuxia_redhair_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 50,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.85
            },
            {
                body_id: 'skin_obocchaman',
                name: 'Cậu Bé Robot Obocchaman',
                nameKey: 'skin_obocchaman_name',
                descKey: 'skin_obocchaman_desc',
                icon_url: 'body/skin_obocchaman_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 47,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.75
            },
            {
                body_id: 'skin_ethnic_maiden',
                name: 'Thiếu Nữ Thổ Cẩm Tóc Sừng',
                nameKey: 'skin_ethnic_maiden_name',
                descKey: 'skin_ethnic_maiden_desc',
                icon_url: 'body/skin_ethnic_maiden_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 61,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.75
            },
            {
                body_id: 'skin_chichi_xmas',
                name: 'Chi-Chi Giáng Sinh Tuần Lộc',
                nameKey: 'skin_chichi_xmas_name',
                descKey: 'skin_chichi_xmas_desc',
                icon_url: 'body/skin_chichi_xmas_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 43,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.80
            },
            {
                body_id: 'skin_shaolin_monk',
                name: 'Tiểu Hòa Thượng Thiếu Lâm',
                nameKey: 'skin_shaolin_monk_name',
                descKey: 'skin_shaolin_monk_desc',
                icon_url: 'body/skin_shaolin_monk_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 46,
                render_height: 86,
                rarity: 'legendary',
                speed_bonus: 0.75
            },
            {
                body_id: 'skin_arale_norimaki',
                name: 'Bé Robot Arale Norimaki',
                nameKey: 'skin_arale_norimaki_name',
                descKey: 'skin_arale_norimaki_desc',
                icon_url: 'body/skin_arale_norimaki_icon.png',
                body_type: 'full_outfit_directional',
                total_frames: 12,
                walk_cycle_length: 4,
                render_width: 48,
                render_height: 86,
                rarity: 'mythic',
                speed_bonus: 0.85
            }
        ];

        // 2. Bảng body_frames (12 Frames bước đi chuẩn xác cho 4 hướng)
        this.tables.body_frames = [
            // ==========================================
            // OUTFIT_FRIEREN (Thân hiệp sĩ hoàng tộc 1000)
            // ===========================================
            { body_id: 'outfit_frieren', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/1000_down_0.png', dx: -16, dy: -32, render_width: 32, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/1000_down_1.png', dx: -18, dy: -32, render_width: 34, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/1000_down_2.png', dx: -18, dy: -32, render_width: 34, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/1000_down_3.png', dx: -16, dy: -32, render_width: 31, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/1000_up_0.png', dx: -18, dy: -32, render_width: 35, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/1000_up_1.png', dx: -20, dy: -32, render_width: 40, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/1000_up_2.png', dx: -18, dy: -32, render_width: 38, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/1000_up_3.png', dx: -18, dy: -32, render_width: 42, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/1000_right_0.png', dx: -12, dy: -32, render_width: 23, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/1000_right_1.png', dx: -18, dy: -32, render_width: 34, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/1000_right_2.png', dx: -19, dy: -32, render_width: 38, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/1000_right_3.png', dx: -18, dy: -32, render_width: 39, render_height: 58, flip_x: false },
            { body_id: 'outfit_frieren', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/1000_right_0.png', dx: -12, dy: -32, render_width: 23, render_height: 58, flip_x: true },
            { body_id: 'outfit_frieren', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/1000_right_1.png', dx: -18, dy: -32, render_width: 34, render_height: 58, flip_x: true },
            { body_id: 'outfit_frieren', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/1000_right_2.png', dx: -19, dy: -32, render_width: 38, render_height: 58, flip_x: true },
            { body_id: 'outfit_frieren', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/1000_right_3.png', dx: -18, dy: -32, render_width: 39, render_height: 58, flip_x: true },

            // ==========================================
            // OUTFIT_VIDEL_NOEL (Thân áo choàng Noel 4)
            // ===========================================
            { body_id: 'outfit_videl_noel', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/4_down_0.png', dx: -21, dy: -32, render_width: 42, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/4_down_1.png', dx: -26, dy: -32, render_width: 54, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/4_down_2.png', dx: -21, dy: -32, render_width: 40, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/4_down_3.png', dx: -31, dy: -32, render_width: 59, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/4_up_0.png', dx: -20, dy: -32, render_width: 39, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/4_up_1.png', dx: -21, dy: -32, render_width: 43, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/4_up_2.png', dx: -22, dy: -32, render_width: 43, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/4_up_3.png', dx: -21, dy: -32, render_width: 43, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/4_right_0.png', dx: -17, dy: -32, render_width: 34, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/4_right_1.png', dx: -19, dy: -32, render_width: 38, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/4_right_2.png', dx: -21, dy: -32, render_width: 43, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/4_right_3.png', dx: -19, dy: -32, render_width: 42, render_height: 58, flip_x: false },
            { body_id: 'outfit_videl_noel', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/4_right_0.png', dx: -17, dy: -32, render_width: 34, render_height: 58, flip_x: true },
            { body_id: 'outfit_videl_noel', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/4_right_1.png', dx: -19, dy: -32, render_width: 38, render_height: 58, flip_x: true },
            { body_id: 'outfit_videl_noel', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/4_right_2.png', dx: -21, dy: -32, render_width: 43, render_height: 58, flip_x: true },
            { body_id: 'outfit_videl_noel', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/4_right_3.png', dx: -19, dy: -32, render_width: 42, render_height: 58, flip_x: true },

            // ==========================================
            // OUTFIT_PRINCE_WARRIOR (Thân dũng sĩ cổ đại 1)
            // ===========================================
            { body_id: 'outfit_prince_warrior', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/1_down_0.png', dx: -25, dy: -32, render_width: 50, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/1_down_1.png', dx: -27, dy: -32, render_width: 53, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/1_down_2.png', dx: -29, dy: -32, render_width: 56, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/1_down_3.png', dx: -30, dy: -32, render_width: 59, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/1_up_0.png', dx: -23, dy: -32, render_width: 45, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/1_up_1.png', dx: -21, dy: -32, render_width: 43, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/1_up_2.png', dx: -24, dy: -32, render_width: 46, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/1_up_3.png', dx: -20, dy: -32, render_width: 42, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/1_right_0.png', dx: -25, dy: -32, render_width: 38, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/1_right_1.png', dx: -29, dy: -32, render_width: 47, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/1_right_2.png', dx: -29, dy: -32, render_width: 50, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/1_right_3.png', dx: -31, dy: -32, render_width: 53, render_height: 58, flip_x: false },
            { body_id: 'outfit_prince_warrior', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/1_right_0.png', dx: -25, dy: -32, render_width: 38, render_height: 58, flip_x: true },
            { body_id: 'outfit_prince_warrior', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/1_right_1.png', dx: -29, dy: -32, render_width: 47, render_height: 58, flip_x: true },
            { body_id: 'outfit_prince_warrior', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/1_right_2.png', dx: -29, dy: -32, render_width: 50, render_height: 58, flip_x: true },
            { body_id: 'outfit_prince_warrior', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/1_right_3.png', dx: -31, dy: -32, render_width: 53, render_height: 58, flip_x: true },

            // ==========================================
            // OUTFIT_GODDESS_BLONDE (Thân nữ thần rừng 5)
            // ===========================================
            { body_id: 'outfit_goddess_blonde', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/5_down_0.png', dx: -24, dy: -32, render_width: 50, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/5_down_1.png', dx: -25, dy: -32, render_width: 51, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/5_down_2.png', dx: -23, dy: -32, render_width: 47, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/5_down_3.png', dx: -24, dy: -32, render_width: 47, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/5_up_0.png', dx: -25, dy: -32, render_width: 44, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/5_up_1.png', dx: -21, dy: -32, render_width: 42, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/5_up_2.png', dx: -24, dy: -32, render_width: 44, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/5_up_3.png', dx: -21, dy: -32, render_width: 40, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/5_right_0.png', dx: -17, dy: -32, render_width: 34, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/5_right_1.png', dx: -23, dy: -32, render_width: 45, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/5_right_2.png', dx: -21, dy: -32, render_width: 47, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/5_right_3.png', dx: -25, dy: -32, render_width: 51, render_height: 58, flip_x: false },
            { body_id: 'outfit_goddess_blonde', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/5_right_0.png', dx: -17, dy: -32, render_width: 34, render_height: 58, flip_x: true },
            { body_id: 'outfit_goddess_blonde', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/5_right_1.png', dx: -23, dy: -32, render_width: 45, render_height: 58, flip_x: true },
            { body_id: 'outfit_goddess_blonde', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/5_right_2.png', dx: -21, dy: -32, render_width: 47, render_height: 58, flip_x: true },
            { body_id: 'outfit_goddess_blonde', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/5_right_3.png', dx: -25, dy: -32, render_width: 51, render_height: 58, flip_x: true },
            // ==========================================
            // SKIN_NARUTO (Naruto Lục Đạo Hoàng Kim)
            // ===========================================
            { body_id: 'skin_naruto', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_naruto_down_0.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_naruto_down_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_naruto_down_2.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_naruto_down_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_naruto_up_0.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_naruto_up_1.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_naruto_up_2.png', dx: -26, dy: -60, render_width: 52, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_naruto_up_3.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_naruto_right_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_naruto_right_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: true },
            { body_id: 'skin_naruto', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_naruto_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_naruto_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: true },
            { body_id: 'skin_naruto', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_naruto_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_naruto_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            { body_id: 'skin_naruto', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_naruto_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_naruto', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_naruto_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_BLUE_KNIGHT (Hiệp Sĩ Tóc Lam Hoàng Tộc)
            // ===========================================
            { body_id: 'skin_blue_knight', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_blue_knight_down_0.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_blue_knight_down_1.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_blue_knight_down_2.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_blue_knight_down_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_blue_knight_up_0.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_blue_knight_up_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_blue_knight_up_2.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_blue_knight_up_3.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_blue_knight_right_0.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_blue_knight_right_0.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: true },
            { body_id: 'skin_blue_knight', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_blue_knight_right_1.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_blue_knight_right_1.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: true },
            { body_id: 'skin_blue_knight', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_blue_knight_right_2.png', dx: -33, dy: -60, render_width: 65, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_blue_knight_right_2.png', dx: -33, dy: -60, render_width: 65, render_height: 86, flip_x: true },
            { body_id: 'skin_blue_knight', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_blue_knight_right_3.png', dx: -34, dy: -60, render_width: 68, render_height: 86, flip_x: false },
            { body_id: 'skin_blue_knight', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_blue_knight_right_3.png', dx: -34, dy: -60, render_width: 68, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_DORAEMON (Chú Mèo Máy Doraemon)
            // ===========================================
            { body_id: 'skin_doraemon', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_doraemon_down_0.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_doraemon_down_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_doraemon_down_2.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_doraemon_down_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_doraemon_up_0.png', dx: -26, dy: -60, render_width: 52, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_doraemon_up_1.png', dx: -26, dy: -60, render_width: 52, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_doraemon_up_2.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_doraemon_up_3.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_doraemon_right_0.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_doraemon_right_0.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: true },
            { body_id: 'skin_doraemon', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_doraemon_right_1.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_doraemon_right_1.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: true },
            { body_id: 'skin_doraemon', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_doraemon_right_2.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_doraemon_right_2.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: true },
            { body_id: 'skin_doraemon', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_doraemon_right_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_doraemon', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_doraemon_right_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_PURPLE_CAP (Tiểu Thư Mũ Cam Tóc Tím)
            // ===========================================
            { body_id: 'skin_purple_cap', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_purple_cap_down_0.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_purple_cap_down_1.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_purple_cap_down_2.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_purple_cap_down_3.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_purple_cap_up_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_purple_cap_up_1.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_purple_cap_up_2.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_purple_cap_up_3.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_purple_cap_right_0.png', dx: -20, dy: -60, render_width: 40, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_purple_cap_right_0.png', dx: -20, dy: -60, render_width: 40, render_height: 86, flip_x: true },
            { body_id: 'skin_purple_cap', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_purple_cap_right_1.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_purple_cap_right_1.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: true },
            { body_id: 'skin_purple_cap', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_purple_cap_right_2.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_purple_cap_right_2.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: true },
            { body_id: 'skin_purple_cap', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_purple_cap_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: false },
            { body_id: 'skin_purple_cap', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_purple_cap_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_FAIRY_CRIMSON (Tiên Nữ Cung Đình Lụa Đỏ)
            // ===========================================
            { body_id: 'skin_fairy_crimson', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_fairy_crimson_down_0.png', dx: -36, dy: -60, render_width: 71, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_fairy_crimson_down_1.png', dx: -38, dy: -60, render_width: 75, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_fairy_crimson_down_2.png', dx: -37, dy: -60, render_width: 74, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_fairy_crimson_down_3.png', dx: -36, dy: -60, render_width: 72, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_fairy_crimson_up_0.png', dx: -36, dy: -60, render_width: 71, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_fairy_crimson_up_1.png', dx: -35, dy: -60, render_width: 70, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_fairy_crimson_up_2.png', dx: -37, dy: -60, render_width: 73, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_fairy_crimson_up_3.png', dx: -38, dy: -60, render_width: 75, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_fairy_crimson_right_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_fairy_crimson_right_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: true },
            { body_id: 'skin_fairy_crimson', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_fairy_crimson_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_fairy_crimson_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: true },
            { body_id: 'skin_fairy_crimson', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_fairy_crimson_right_2.png', dx: -33, dy: -60, render_width: 66, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_fairy_crimson_right_2.png', dx: -33, dy: -60, render_width: 66, render_height: 86, flip_x: true },
            { body_id: 'skin_fairy_crimson', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_fairy_crimson_right_3.png', dx: -32, dy: -60, render_width: 64, render_height: 86, flip_x: false },
            { body_id: 'skin_fairy_crimson', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_fairy_crimson_right_3.png', dx: -32, dy: -60, render_width: 64, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_GOKU_FIGHTER (Võ Sĩ Goku Siêu Cấp)
            // ===========================================
            { body_id: 'skin_goku_fighter', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_goku_fighter_down_0.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_goku_fighter_down_1.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_goku_fighter_down_2.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_goku_fighter_down_3.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_goku_fighter_up_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_goku_fighter_up_1.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_goku_fighter_up_2.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_goku_fighter_up_3.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_goku_fighter_right_0.png', dx: -21, dy: -60, render_width: 42, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_goku_fighter_right_0.png', dx: -21, dy: -60, render_width: 42, render_height: 86, flip_x: true },
            { body_id: 'skin_goku_fighter', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_goku_fighter_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_goku_fighter_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: true },
            { body_id: 'skin_goku_fighter', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_goku_fighter_right_2.png', dx: -31, dy: -60, render_width: 61, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_goku_fighter_right_2.png', dx: -31, dy: -60, render_width: 61, render_height: 86, flip_x: true },
            { body_id: 'skin_goku_fighter', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_goku_fighter_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_goku_fighter', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_goku_fighter_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_KITSUNE_MAIDEN (Hồ Ly Tiên Tử Tóc Bạch)
            // ===========================================
            { body_id: 'skin_kitsune_maiden', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_kitsune_maiden_down_0.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_kitsune_maiden_down_1.png', dx: -32, dy: -60, render_width: 63, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_kitsune_maiden_down_2.png', dx: -33, dy: -60, render_width: 65, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_kitsune_maiden_down_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_kitsune_maiden_up_0.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_kitsune_maiden_up_1.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_kitsune_maiden_up_2.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_kitsune_maiden_up_3.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_kitsune_maiden_right_0.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_kitsune_maiden_right_0.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: true },
            { body_id: 'skin_kitsune_maiden', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_kitsune_maiden_right_1.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_kitsune_maiden_right_1.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: true },
            { body_id: 'skin_kitsune_maiden', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_kitsune_maiden_right_2.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_kitsune_maiden_right_2.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: true },
            { body_id: 'skin_kitsune_maiden', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_kitsune_maiden_right_3.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_kitsune_maiden', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_kitsune_maiden_right_3.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_FLAME_RENGOKU (Viêm Trụ Rengoku Lửa Đỏ)
            // ===========================================
            { body_id: 'skin_flame_rengoku', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_flame_rengoku_down_0.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_flame_rengoku_down_1.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_flame_rengoku_down_2.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_flame_rengoku_down_3.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_flame_rengoku_up_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_flame_rengoku_up_1.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_flame_rengoku_up_2.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_flame_rengoku_up_3.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_flame_rengoku_right_0.png', dx: -19, dy: -60, render_width: 38, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_flame_rengoku_right_0.png', dx: -19, dy: -60, render_width: 38, render_height: 86, flip_x: true },
            { body_id: 'skin_flame_rengoku', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_flame_rengoku_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_flame_rengoku_right_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: true },
            { body_id: 'skin_flame_rengoku', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_flame_rengoku_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_flame_rengoku_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            { body_id: 'skin_flame_rengoku', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_flame_rengoku_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_flame_rengoku', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_flame_rengoku_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_BULMA_QIPAO (Tiểu Thư Sườn Xám Bulma)
            // ===========================================
            { body_id: 'skin_bulma_qipao', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_bulma_qipao_down_0.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_bulma_qipao_down_1.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_bulma_qipao_down_2.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_bulma_qipao_down_3.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_bulma_qipao_up_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_bulma_qipao_up_1.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_bulma_qipao_up_2.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_bulma_qipao_up_3.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_bulma_qipao_right_0.png', dx: -19, dy: -60, render_width: 37, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_bulma_qipao_right_0.png', dx: -19, dy: -60, render_width: 37, render_height: 86, flip_x: true },
            { body_id: 'skin_bulma_qipao', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_bulma_qipao_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_bulma_qipao_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: true },
            { body_id: 'skin_bulma_qipao', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_bulma_qipao_right_2.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_bulma_qipao_right_2.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: true },
            { body_id: 'skin_bulma_qipao', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_bulma_qipao_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: false },
            { body_id: 'skin_bulma_qipao', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_bulma_qipao_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_CHICHI_MARTIAL (Nữ Hiệp Lam Y Chi-Chi)
            // ===========================================
            { body_id: 'skin_chichi_martial', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_martial_down_0.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'down', action_type: 'walk', frame_index: 1, image_url: 'body/skin_chichi_martial_down_1.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'down', action_type: 'walk', frame_index: 2, image_url: 'body/skin_chichi_martial_down_2.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'down', action_type: 'walk', frame_index: 3, image_url: 'body/skin_chichi_martial_down_3.png', dx: -24, dy: -60, render_width: 48, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_martial_up_0.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'up', action_type: 'walk', frame_index: 1, image_url: 'body/skin_chichi_martial_up_1.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'up', action_type: 'walk', frame_index: 2, image_url: 'body/skin_chichi_martial_up_2.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'up', action_type: 'walk', frame_index: 3, image_url: 'body/skin_chichi_martial_up_3.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_martial_right_0.png', dx: -21, dy: -60, render_width: 42, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_martial_right_0.png', dx: -21, dy: -60, render_width: 42, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_martial', direction: 'right', action_type: 'walk', frame_index: 1, image_url: 'body/skin_chichi_martial_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'left', action_type: 'walk', frame_index: 1, image_url: 'body/skin_chichi_martial_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_martial', direction: 'right', action_type: 'walk', frame_index: 2, image_url: 'body/skin_chichi_martial_right_2.png', dx: -33, dy: -60, render_width: 65, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'left', action_type: 'walk', frame_index: 2, image_url: 'body/skin_chichi_martial_right_2.png', dx: -33, dy: -60, render_width: 65, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_martial', direction: 'right', action_type: 'walk', frame_index: 3, image_url: 'body/skin_chichi_martial_right_3.png', dx: -32, dy: -60, render_width: 63, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_martial', direction: 'left', action_type: 'walk', frame_index: 3, image_url: 'body/skin_chichi_martial_right_3.png', dx: -32, dy: -60, render_width: 63, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_GATCHAN_ANGEL (Bé Thiên Thần Gatchan)
            // ===========================================
            { body_id: 'skin_gatchan_angel', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_gatchan_angel_down_0.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_gatchan_angel_down_1.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_gatchan_angel_down_2.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_gatchan_angel_down_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_gatchan_angel_up_0.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_gatchan_angel_up_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_gatchan_angel_up_2.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_gatchan_angel_up_3.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_gatchan_angel_right_0.png', dx: -18, dy: -60, render_width: 35, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_gatchan_angel_right_0.png', dx: -18, dy: -60, render_width: 35, render_height: 86, flip_x: true },
            { body_id: 'skin_gatchan_angel', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_gatchan_angel_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_gatchan_angel_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: true },
            { body_id: 'skin_gatchan_angel', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_gatchan_angel_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_gatchan_angel_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            { body_id: 'skin_gatchan_angel', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_gatchan_angel_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: false },
            { body_id: 'skin_gatchan_angel', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_gatchan_angel_right_3.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_WUXIA_REDHAIR (Ma Tôn Tiên Hiệp Tóc Đỏ)
            // ===========================================
            { body_id: 'skin_wuxia_redhair', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_wuxia_redhair_down_0.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_wuxia_redhair_down_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_wuxia_redhair_down_2.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_wuxia_redhair_down_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_wuxia_redhair_up_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_wuxia_redhair_up_1.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_wuxia_redhair_up_2.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_wuxia_redhair_up_3.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_wuxia_redhair_right_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_wuxia_redhair_right_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: true },
            { body_id: 'skin_wuxia_redhair', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_wuxia_redhair_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_wuxia_redhair_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: true },
            { body_id: 'skin_wuxia_redhair', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_wuxia_redhair_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_wuxia_redhair_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            { body_id: 'skin_wuxia_redhair', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_wuxia_redhair_right_3.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_wuxia_redhair', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_wuxia_redhair_right_3.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_OBOCCHAMAN (Cậu Bé Robot Obocchaman)
            // ===========================================
            { body_id: 'skin_obocchaman', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_obocchaman_down_0.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_obocchaman_down_1.png', dx: -25, dy: -60, render_width: 50, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_obocchaman_down_2.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_obocchaman_down_3.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_obocchaman_up_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_obocchaman_up_1.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_obocchaman_up_2.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_obocchaman_up_3.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_obocchaman_right_0.png', dx: -15, dy: -60, render_width: 30, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_obocchaman_right_0.png', dx: -15, dy: -60, render_width: 30, render_height: 86, flip_x: true },
            { body_id: 'skin_obocchaman', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_obocchaman_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_obocchaman_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: true },
            { body_id: 'skin_obocchaman', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_obocchaman_right_2.png', dx: -31, dy: -60, render_width: 62, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_obocchaman_right_2.png', dx: -31, dy: -60, render_width: 62, render_height: 86, flip_x: true },
            { body_id: 'skin_obocchaman', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_obocchaman_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_obocchaman', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_obocchaman_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_ETHNIC_MAIDEN (Thiếu Nữ Thổ Cẩm Tóc Sừng)
            // ===========================================
            { body_id: 'skin_ethnic_maiden', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_ethnic_maiden_down_0.png', dx: -31, dy: -60, render_width: 61, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_ethnic_maiden_down_1.png', dx: -31, dy: -60, render_width: 61, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_ethnic_maiden_down_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_ethnic_maiden_down_3.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_ethnic_maiden_up_0.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_ethnic_maiden_up_1.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_ethnic_maiden_up_2.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_ethnic_maiden_up_3.png', dx: -27, dy: -60, render_width: 54, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_ethnic_maiden_right_0.png', dx: -19, dy: -60, render_width: 38, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_ethnic_maiden_right_0.png', dx: -19, dy: -60, render_width: 38, render_height: 86, flip_x: true },
            { body_id: 'skin_ethnic_maiden', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_ethnic_maiden_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_ethnic_maiden_right_1.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: true },
            { body_id: 'skin_ethnic_maiden', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_ethnic_maiden_right_2.png', dx: -32, dy: -60, render_width: 63, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_ethnic_maiden_right_2.png', dx: -32, dy: -60, render_width: 63, render_height: 86, flip_x: true },
            { body_id: 'skin_ethnic_maiden', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_ethnic_maiden_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_ethnic_maiden', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_ethnic_maiden_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_CHICHI_XMAS (Chi-Chi Giáng Sinh Tuần Lộc)
            // ===========================================
            { body_id: 'skin_chichi_xmas', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_xmas_down_0.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_chichi_xmas_down_1.png', dx: -24, dy: -60, render_width: 48, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_chichi_xmas_down_2.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_chichi_xmas_down_3.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_xmas_up_0.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_chichi_xmas_up_1.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_chichi_xmas_up_2.png', dx: -21, dy: -60, render_width: 42, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_chichi_xmas_up_3.png', dx: -22, dy: -60, render_width: 43, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_xmas_right_0.png', dx: -18, dy: -60, render_width: 35, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_chichi_xmas_right_0.png', dx: -18, dy: -60, render_width: 35, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_xmas', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_chichi_xmas_right_1.png', dx: -26, dy: -60, render_width: 52, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_chichi_xmas_right_1.png', dx: -26, dy: -60, render_width: 52, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_xmas', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_chichi_xmas_right_2.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_chichi_xmas_right_2.png', dx: -28, dy: -60, render_width: 56, render_height: 86, flip_x: true },
            { body_id: 'skin_chichi_xmas', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_chichi_xmas_right_3.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: false },
            { body_id: 'skin_chichi_xmas', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_chichi_xmas_right_3.png', dx: -28, dy: -60, render_width: 55, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_SHAOLIN_MONK (Tiểu Hòa Thượng Thiếu Lâm)
            // ===========================================
            { body_id: 'skin_shaolin_monk', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_shaolin_monk_down_0.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_shaolin_monk_down_1.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_shaolin_monk_down_2.png', dx: -27, dy: -60, render_width: 53, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_shaolin_monk_down_3.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_shaolin_monk_up_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_shaolin_monk_up_1.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_shaolin_monk_up_2.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_shaolin_monk_up_3.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_shaolin_monk_right_0.png', dx: -17, dy: -60, render_width: 34, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_shaolin_monk_right_0.png', dx: -17, dy: -60, render_width: 34, render_height: 86, flip_x: true },
            { body_id: 'skin_shaolin_monk', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_shaolin_monk_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_shaolin_monk_right_1.png', dx: -29, dy: -60, render_width: 57, render_height: 86, flip_x: true },
            { body_id: 'skin_shaolin_monk', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_shaolin_monk_right_2.png', dx: -31, dy: -60, render_width: 62, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_shaolin_monk_right_2.png', dx: -31, dy: -60, render_width: 62, render_height: 86, flip_x: true },
            { body_id: 'skin_shaolin_monk', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_shaolin_monk_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_shaolin_monk', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_shaolin_monk_right_3.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            // ==========================================
            // SKIN_ARALE_NORIMAKI (Bé Robot Arale Norimaki)
            // ===========================================
            { body_id: 'skin_arale_norimaki', direction: 'down', action_type: 'idle', frame_index: 0, image_url: 'body/skin_arale_norimaki_down_0.png', dx: -24, dy: -60, render_width: 48, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'down', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_arale_norimaki_down_1.png', dx: -25, dy: -60, render_width: 49, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'down', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_arale_norimaki_down_2.png', dx: -26, dy: -60, render_width: 51, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'down', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_arale_norimaki_down_3.png', dx: -24, dy: -60, render_width: 48, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'up', action_type: 'idle', frame_index: 0, image_url: 'body/skin_arale_norimaki_up_0.png', dx: -23, dy: -60, render_width: 45, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'up', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_arale_norimaki_up_1.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'up', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_arale_norimaki_up_2.png', dx: -24, dy: -60, render_width: 47, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'up', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_arale_norimaki_up_3.png', dx: -23, dy: -60, render_width: 46, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'right', action_type: 'idle', frame_index: 0, image_url: 'body/skin_arale_norimaki_right_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'left', action_type: 'idle', frame_index: 0, image_url: 'body/skin_arale_norimaki_right_0.png', dx: -22, dy: -60, render_width: 44, render_height: 86, flip_x: true },
            { body_id: 'skin_arale_norimaki', direction: 'right', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_arale_norimaki_right_1.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'left', action_type: 'walk_1', frame_index: 1, image_url: 'body/skin_arale_norimaki_right_1.png', dx: -29, dy: -60, render_width: 58, render_height: 86, flip_x: true },
            { body_id: 'skin_arale_norimaki', direction: 'right', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_arale_norimaki_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'left', action_type: 'walk_2', frame_index: 2, image_url: 'body/skin_arale_norimaki_right_2.png', dx: -30, dy: -60, render_width: 60, render_height: 86, flip_x: true },
            { body_id: 'skin_arale_norimaki', direction: 'right', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_arale_norimaki_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: false },
            { body_id: 'skin_arale_norimaki', direction: 'left', action_type: 'walk_3', frame_index: 3, image_url: 'body/skin_arale_norimaki_right_3.png', dx: -30, dy: -60, render_width: 59, render_height: 86, flip_x: true },
        ];

        // 3. Bảng outfit_heads (Khung hình Đầu gắn khít theo từng bộ trang phục)
        // Đã tinh chỉnh tọa độ dx/dy chuẩn xác 100% triệt tiêu hoàn toàn khe hở cổ và lỗi mất đầu!
        this.tables.outfit_heads = [
            // Head Frieren đi cùng outfit_frieren (Áo Hiệp Sĩ 1000)
            { outfit_id: 'outfit_frieren', direction: 'down',  image_url: 'head/12955.png', dx: -31, dy: -66, render_width: 62, render_height: 60, flip_x: false },
            { outfit_id: 'outfit_frieren', direction: 'right', image_url: 'head/12956.png', dx: -40, dy: -62, render_width: 66, render_height: 56, flip_x: false },
            { outfit_id: 'outfit_frieren', direction: 'left',  image_url: 'head/12956.png', dx: -40, dy: -62, render_width: 66, render_height: 56, flip_x: true },
            { outfit_id: 'outfit_frieren', direction: 'up',    image_url: 'head/12954.png', dx: -31, dy: -66, render_width: 62, render_height: 60, flip_x: false },

            // Head Videl đi cùng outfit_videl_noel (Áo Choàng Noel 4: hạ dy xuống -54 ôm trọn viền lông tuyết trắng, triệt tiêu 100% khe hở cổ)
            { outfit_id: 'outfit_videl_noel', direction: 'down',  image_url: 'head/9390.png', dx: -19, dy: -54, render_width: 38, render_height: 46, flip_x: false },
            { outfit_id: 'outfit_videl_noel', direction: 'right', image_url: 'head/9391.png', dx: -20, dy: -54, render_width: 38, render_height: 46, flip_x: false },
            { outfit_id: 'outfit_videl_noel', direction: 'left',  image_url: 'head/9391.png', dx: -20, dy: -54, render_width: 38, render_height: 46, flip_x: true },
            { outfit_id: 'outfit_videl_noel', direction: 'up',    image_url: 'head/9392.png', dx: -19, dy: -54, render_width: 38, render_height: 46, flip_x: false },

            // Head Vương Miện Hoàng Tử đi cùng outfit_prince_warrior (Áo Dũng Sĩ 1: hạ dy xuống -66 tiếp xúc khít vòng cổ vàng)
            { outfit_id: 'outfit_prince_warrior', direction: 'down',  image_url: 'head/21714.png', dx: -18, dy: -66, render_width: 36, render_height: 48, flip_x: false },
            { outfit_id: 'outfit_prince_warrior', direction: 'right', image_url: 'head/21715.png', dx: -18, dy: -64, render_width: 38, render_height: 43, flip_x: false },
            { outfit_id: 'outfit_prince_warrior', direction: 'left',  image_url: 'head/21715.png', dx: -18, dy: -64, render_width: 38, render_height: 43, flip_x: true },
            { outfit_id: 'outfit_prince_warrior', direction: 'up',    image_url: 'head/21716.png', dx: -18, dy: -66, render_width: 36, render_height: 48, flip_x: false },

            // Head Tiểu Thư Tóc Vàng đi cùng outfit_goddess_blonde (Xiêm Y 5: tách lớp tóc sau 17784_back, căn chỉnh dx -26, dy -50 ôm trọn vai áo)
            { outfit_id: 'outfit_goddess_blonde', direction: 'down',  image_url: 'head/17784_front.png', back_image_url: 'head/17784_back.png', dx: -22, dy: -52, render_width: 44, render_height: 50, flip_x: false },
            { outfit_id: 'outfit_goddess_blonde', direction: 'right', image_url: 'head/17785.png', dx: -26, dy: -50, render_width: 50, render_height: 38, flip_x: false },
            { outfit_id: 'outfit_goddess_blonde', direction: 'left',  image_url: 'head/17785.png', dx: -26, dy: -50, render_width: 50, render_height: 38, flip_x: true },
            { outfit_id: 'outfit_goddess_blonde', direction: 'up',    image_url: 'head/17786.png', dx: -22, dy: -52, render_width: 44, render_height: 50, flip_x: false }
        ];

        // Khởi tạo BODY_REGISTRY toàn cục
        window.BODY_REGISTRY = {};
        this.tables.body_templates.forEach(b => {
            window.BODY_REGISTRY[b.body_id] = b;
        });
    }

    // Preload toàn bộ textures vào bộ nhớ GPU Texture Cache
    preloadTextures() {
        if (typeof Image === 'undefined') return;
        const allUrls = new Set();
        this.tables.body_templates.forEach(t => allUrls.add(t.icon_url));
        this.tables.body_frames.forEach(f => {
            if (f.image_url) allUrls.add(f.image_url);
        });
        this.tables.outfit_heads.forEach(h => {
            if (h.image_url) allUrls.add(h.image_url);
            if (h.back_image_url) allUrls.add(h.back_image_url);
        });

        this.totalImages = allUrls.size;
        this.loadedCount = 0;

        allUrls.forEach(url => {
            const r2Url = (window.getR2Url ? window.getR2Url(url) : url);
            const img = new Image();
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount >= this.totalImages) {
                    this.isLoaded = true;
                    console.log(`[BodySQLDB] Đã tải hoàn tất 100% (${this.loadedCount}/${this.totalImages}) frames 4 bộ trang phục từ R2.`);
                }
            };
            img.onerror = () => {
                if (img.src === r2Url && r2Url !== url) {
                    img.src = url;
                } else {
                    console.warn(`[BodySQLDB] Không thể tải texture: ${url}`);
                }
            };
            img.src = r2Url;
            this.imageCache.set(url, img);
        });
    }

    // Kiểm tra trang phục có hợp lệ
    isFrameBody(outfitId) {
        if (!outfitId) return false;
        const resolved = this.resolveOutfitId(outfitId);
        return this.tables.body_templates.some(t => t.body_id === resolved);
    }

    // Lấy thông số Template
    getBodyTemplate(outfitId) {
        const resolved = this.resolveOutfitId(outfitId);
        return this.tables.body_templates.find(t => t.body_id === resolved) || null;
    }

    // Lấy frame bước đi của thân người
    getFrame(outfitId, direction = 'down', isMoving = false, animTimer = 0, isAction = false) {
        const resolved = this.resolveOutfitId(outfitId);
        const dir = direction || 'down';
        const searchDir = (dir === 'left') ? 'left' : dir;

        let targetIndex = 0;
        let actionType = 'idle';

        if (isAction) {
            targetIndex = 3;
            actionType = 'walk';
        } else if (isMoving) {
            actionType = 'walk';
            const walkCycle = [1, 2, 3, 2];
            const stepIndex = Math.floor(animTimer) % walkCycle.length;
            targetIndex = walkCycle[stepIndex];
        } else {
            actionType = 'idle';
            targetIndex = 0;
        }

        let frame = this.tables.body_frames.find(f => 
            f.body_id === resolved && 
            f.direction === searchDir && 
            f.frame_index === targetIndex
        );

        if (!frame && actionType === 'walk') {
            frame = this.tables.body_frames.find(f => 
                f.body_id === resolved && 
                f.direction === searchDir && 
                f.frame_index === 0
            );
        }

        if (!frame) {
            frame = this.tables.body_frames.find(f => 
                f.body_id === resolved && 
                f.direction === 'down' && 
                f.frame_index === 0
            );
        }

        return frame || null;
    }

    // Lấy frame đầu tương ứng của bộ trang phục
    getHeadFrame(outfitId, direction = 'down') {
        const resolved = this.resolveOutfitId(outfitId);
        const dir = direction || 'down';
        const searchDir = (dir === 'left') ? 'left' : dir;

        let hFrame = this.tables.outfit_heads.find(h => 
            h.outfit_id === resolved && 
            h.direction === searchDir
        );

        if (!hFrame) {
            hFrame = this.tables.outfit_heads.find(h => 
                h.outfit_id === resolved && 
                h.direction === 'down'
            );
        }

        return hFrame || null;
    }

    // Lấy Image object từ cache (Tự động nạp on-demand từ Cloudflare R2 nếu chưa có trong cache)
    getImage(url) {
        if (!url) return null;
        let img = this.imageCache.get(url);
        if (!img) {
            const r2Url = (window.getR2Url ? window.getR2Url(url) : url);
            img = new Image();
            img.onerror = () => {
                if (img.src === r2Url && r2Url !== url) {
                    img.src = url;
                }
            };
            img.src = r2Url;
            this.imageCache.set(url, img);
        }
        return img;
    }

    /**
     * VẼ LỚP TÓC SAU LƯNG (BACK HAIR LAYER)
     * Được vẽ TRƯỚC khi vẽ thân trang phục
     * (Ví dụ tóc dài của Nữ Thần Rừng buông sau vai khi nhìn thẳng)
     */
    drawBackHair(ctx, outfitId, direction = 'down', bob = 0) {
        const hFrame = this.getHeadFrame(outfitId, direction);
        if (!hFrame || !hFrame.back_image_url) return;

        const img = this.getImage(hFrame.back_image_url);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.save();
        if (hFrame.flip_x) {
            let needFlip = true;
            if (typeof ctx.getTransform === 'function') {
                const transform = ctx.getTransform();
                if (transform.a < 0) needFlip = false;
            }
            if (needFlip) ctx.scale(-1, 1);
        }

        const rw = hFrame.render_width;
        const rh = hFrame.render_height;
        const dx = hFrame.dx;
        const dy = hFrame.dy + bob;

        try {
            ctx.drawImage(img, dx, dy, rw, rh);
        } catch (e) {}
        ctx.restore();
    }

    /**
     * VẼ THÂN BỘ TRANG PHỤC (BODY FRAMES)
     */
    drawBodyOnPlayer(ctx, outfitId, direction = 'down', isMoving = false, animTimer = 0, bob = 0, isAction = false) {
        const frame = this.getFrame(outfitId, direction, isMoving, animTimer, isAction);
        if (!frame) return;

        const img = this.getImage(frame.image_url);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.save();

        if (frame.flip_x) {
            let needFlip = true;
            if (typeof ctx.getTransform === 'function') {
                const transform = ctx.getTransform();
                if (transform.a < 0) needFlip = false;
            }
            if (needFlip) ctx.scale(-1, 1);
        }

        const rw = frame.render_width;
        const rh = frame.render_height;
        const dx = frame.dx;
        const dy = frame.dy + bob;

        try {
            ctx.drawImage(img, dx, dy, rw, rh);
        } catch (e) {}
        ctx.restore();
    }

    /**
     * VẼ ĐẦU VÀ KHUÔN MẶT PHÍA TRƯỚC (FRONT HEAD LAYER)
     * Được vẽ SAU khi vẽ thân áo (khuôn mặt, cằm, nơ và mắt phủ lên cổ áo)
     */
    drawFrontHead(ctx, outfitId, direction = 'down', bob = 0) {
        const hFrame = this.getHeadFrame(outfitId, direction);
        if (!hFrame || !hFrame.image_url) return;

        const img = this.getImage(hFrame.image_url);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.save();
        if (hFrame.flip_x) {
            let needFlip = true;
            if (typeof ctx.getTransform === 'function') {
                const transform = ctx.getTransform();
                if (transform.a < 0) needFlip = false;
            }
            if (needFlip) ctx.scale(-1, 1);
        }

        const rw = hFrame.render_width;
        const rh = hFrame.render_height;
        const dx = hFrame.dx;
        const dy = hFrame.dy + bob;

        try {
            ctx.drawImage(img, dx, dy, rw, rh);
        } catch (e) {}
        ctx.restore();
    }

    /**
     * VẼ TOÀN BỘ NHÂN VẬT ĐỒNG BỘ KHÉP KÍN (FULL OUTFIT PIPELINE)
     * 1. Back Hair Layer (Tóc buông sau lưng nếu có)
     * 2. Body Frame (Thân, áo choàng, tay, chân chuyển động)
     * 3. Front Head Layer (Khuôn mặt, cằm, mũ miện ôm khít cổ áo)
     */
    drawFullOutfitOnPlayer(ctx, outfitId, direction = 'down', isMoving = false, animTimer = 0, bob = 0, isAction = false) {
        const resolved = this.resolveOutfitId(outfitId);

        // 1. Tóc sau lưng
        this.drawBackHair(ctx, resolved, direction, bob);

        // 2. Thân trang phục
        this.drawBodyOnPlayer(ctx, resolved, direction, isMoving, animTimer, bob, isAction);

        // 3. Đầu và mặt trước
        this.drawFrontHead(ctx, resolved, direction, bob);
    }

    /**
     * VẼ ICON TOÀN THÂN 100x100 CHO THẺ BÀI TỦ ĐỒ (WARDROBE CARD)
     */
    drawBodyIcon(canvas, outfitId) {
        const resolved = this.resolveOutfitId(outfitId);
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Nền thẻ be quý tộc
        const bgGrad = ctx.createLinearGradient ? ctx.createLinearGradient(0, 0, 0, h) : null;
        if (bgGrad) {
            bgGrad.addColorStop(0, '#fbf6d9');
            bgGrad.addColorStop(1, '#f3ebd0');
            ctx.fillStyle = bgGrad;
        } else {
            ctx.fillStyle = '#fbf6d9';
        }
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(0, 0, w, h, 10);
        } else if (typeof ctx.rect === 'function') {
            ctx.rect(0, 0, w, h);
        }
        ctx.fill();

        ctx.strokeStyle = '#b89b72';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(1, 1, w - 2, h - 2, 9);
        } else if (typeof ctx.rect === 'function') {
            ctx.rect(1, 1, w - 2, h - 2);
        }
        ctx.stroke();

        // Ánh hào quang vàng kim phía sau
        ctx.save();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Nạp icon full-character hoàn chỉnh
        const tpl = this.getBodyTemplate(resolved);
        const iconUrl = tpl ? tpl.icon_url : `body/${resolved}_icon.png`;
        let iconImg = this.getImage(iconUrl);

        if (iconImg) {
            if (iconImg.complete && iconImg.naturalWidth > 0) {
                ctx.save();
                const nw = iconImg.naturalWidth || 100;
                const nh = iconImg.naturalHeight || 100;
                const scale = Math.min((w - 12) / nw, (h - 10) / nh);
                const rw = nw * scale;
                const rh = nh * scale;
                ctx.drawImage(iconImg, w / 2 - rw / 2, h / 2 - rh / 2, rw, rh);
                ctx.restore();
                return;
            } else {
                iconImg.onload = () => {
                    this.drawBodyIcon(canvas, outfitId);
                };
            }
        }

        // Fallback: render trực tiếp từ pipeline
        ctx.save();
        ctx.translate(w / 2, h / 2 + 30);
        ctx.scale(0.85, 0.85);
        this.drawFullOutfitOnPlayer(ctx, resolved, 'down', false, 0, 0, false);
        ctx.restore();
    }
}

// Khởi tạo instance toàn cục
window.bodySQLDB = new BodySQLDatabase();
