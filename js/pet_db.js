/**
 * PET SQL DATABASE & PRELOADED TEXTURE BUFFER
 * Quản lý hoạt ảnh Thú Cưng (Companion Pet) Frame-by-frame mượt mà chuẩn 60-120 FPS:
 * - Lưu trữ dữ liệu cấu trúc bảng SQL (pet_templates, pet_frames)
 * - Hỗ trợ câu lệnh SQL queries (SELECT, INSERT, WHERE, ORDER BY)
 * - Tự động Preload toàn bộ các frame ảnh PNG vào GPU Image Buffer, chống giật lag
 * - Tính toán chính xác frame hoạt ảnh theo thời gian thực (Delta Time)
 */

class PetSQLDatabase {
    constructor() {
        this.tables = {
            pet_templates: [],
            pet_frames: []
        };
        this.imageCache = new Map();
        this.isLoaded = false;
        this.loadedCount = 0;
        this.totalImages = 0;

        // Khởi tạo và nạp dữ liệu SQL Schema
        this.seedDatabase();
        // Không preload ồ ạt trong constructor để ưu tiên nạp nhanh bản đồ và skin khởi đầu
    }

    // Nạp dữ liệu mặc định từ pets_schema.sql
    seedDatabase() {
        // 1. Bảng pet_templates
        this.tables.pet_templates = [
            {
                pet_id: 'pet_golden_fox',
                name: 'Vịt Vàng Psyduck Ngầu (5 Frames)',
                desc_key: 'pet_golden_fox_desc',
                icon_url: 'pet/31513.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 150, // 150ms/frame, 5 frames = 0.75s một chu kỳ
                render_width: 48,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#ffd166',
                particle_type: 'gold_sparkles'
            },
            {
                pet_id: 'pet_fire_kirin',
                name: 'Hỏa Kỳ Lân Lân Sư (5 Frames)',
                desc_key: 'pet_fire_kirin_desc',
                icon_url: 'pet/7072.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 160,
                render_width: 64,
                render_height: 46,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 40,
                speed_factor: 1.05,
                aura_color: '#ff4d00',
                particle_type: 'fire_embers'
            },
            {
                pet_id: 'pet_dark_dragon',
                name: 'Trâu Vàng (5 Frames)',
                desc_key: 'pet_dark_dragon_desc',
                icon_url: 'pet/7482.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 170,
                render_width: 66,
                render_height: 52,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.0,
                aura_color: '#7209b7',
                particle_type: 'dark_mist'
            },
            {
                pet_id: 'pet_white_fox',
                name: 'Tiểu Hổ Vàng (5 Frames)',
                desc_key: 'pet_white_fox_desc',
                icon_url: 'pet/8761.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 165,
                render_width: 68,
                render_height: 42,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.0,
                aura_color: '#4cc9f0',
                particle_type: 'holy_aura'
            },
            {
                pet_id: 'pet_thunder_beast',
                name: 'Ma Halloween (8 Frames)',
                desc_key: 'pet_thunder_beast_desc',
                icon_url: 'pet/10618.png',
                pet_type: 'frame_companion',
                total_frames: 8,
                delay_ms: 140,
                render_width: 58,
                render_height: 50,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.05,
                aura_color: '#ffb703',
                particle_type: 'thunder_sparks'
            },
            {
                pet_id: 'pet_blood_stag',
                name: 'Kungfu Panda (6 Frames)',
                desc_key: 'pet_blood_stag_desc',
                icon_url: 'pet/12938.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 150,
                render_width: 56,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.0,
                aura_color: '#d90429',
                particle_type: 'blood_mist'
            },
            {
                pet_id: 'pet_frost_pixie',
                name: 'Pet Cầu Mưa (5 Frames)',
                desc_key: 'pet_frost_pixie_desc',
                icon_url: 'pet/14273.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 160,
                render_width: 60,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 1.0,
                aura_color: '#00b4d8',
                particle_type: 'snow_crystals'
            },
            {
                pet_id: 'pet_blazing_drake',
                name: 'Tiểu Long Vương (5 Frames)',
                desc_key: 'pet_blazing_drake_desc',
                icon_url: 'pet/19851.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 170,
                render_width: 68,
                render_height: 56,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 44,
                speed_factor: 1.05,
                aura_color: '#ff0054',
                particle_type: 'solar_flares'
            },
            {
                pet_id: 'pet_earth_shiba',
                name: 'Tuần Lộc (5 Frames)',
                desc_key: 'pet_earth_shiba_desc',
                icon_url: 'pet/6680.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 150,
                render_width: 48,
                render_height: 46,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 1.0,
                aura_color: '#a3704c',
                particle_type: 'earth_leaves'
            },
            {
                pet_id: 'pet_mecha_sentinel',
                name: 'Cá Mập Biển Sâu (5 Frames)',
                desc_key: 'pet_mecha_sentinel_desc',
                icon_url: 'pet/18480.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 160,
                render_width: 50,
                render_height: 56,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.05,
                aura_color: '#e63946',
                particle_type: 'cyber_glitch'
            },
            {
                pet_id: 'pet_celestial_serpent',
                name: 'Mây Ngũ Sắc (7 Frames)',
                desc_key: 'pet_celestial_serpent_desc',
                icon_url: 'pet/18491.png',
                pet_type: 'frame_companion',
                total_frames: 7,
                delay_ms: 145,
                render_width: 62,
                render_height: 48,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.0,
                aura_color: '#48cae4',
                particle_type: 'celestial_whiskers'
            },
            {
                pet_id: 'pet_flora_pixie',
                name: 'Thỏ Ngọc (7 Frames)',
                desc_key: 'pet_flora_pixie_desc',
                icon_url: 'pet/18836.png',
                pet_type: 'frame_companion',
                total_frames: 7,
                delay_ms: 135,
                render_width: 56,
                render_height: 40,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#f72585',
                particle_type: 'flora_blossoms'
            },
            {
                pet_id: 'pet_silver_drake',
                name: 'Người Tuyết (5 Frames)',
                desc_key: 'pet_silver_drake_desc',
                icon_url: 'pet/19820.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 165,
                render_width: 64,
                render_height: 42,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 44,
                speed_factor: 1.05,
                aura_color: '#e0e1dd',
                particle_type: 'silver_shimmer'
            },
            {
                pet_id: 'pet_divine_obelisk',
                name: 'Tiểu Khủng Long (5 Frames)',
                desc_key: 'pet_divine_obelisk_desc',
                icon_url: 'pet/21662.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 180,
                render_width: 38,
                render_height: 70,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 0.95,
                aura_color: '#7209b7',
                particle_type: 'ancient_runes'
            },
            {
                pet_id: 'pet_sakura_fox',
                name: 'Capybara (5 Frames)',
                desc_key: 'pet_sakura_fox_desc',
                icon_url: 'pet/31572.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 150,
                render_width: 48,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#ff70a6',
                particle_type: 'sakura_petals'
            },
            {
                pet_id: 'pet_astral_falcon',
                name: 'Hải Ly (8 Frames)',
                desc_key: 'pet_astral_falcon_desc',
                icon_url: 'pet/31852.png',
                pet_type: 'frame_companion',
                total_frames: 8,
                delay_ms: 140,
                render_width: 54,
                render_height: 64,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 40,
                speed_factor: 1.1,
                aura_color: '#ffaa00',
                particle_type: 'astral_feathers'
            },
            {
                pet_id: 'pet_sakura_bunny',
                name: 'Ma Hồng (4 Frames)',
                desc_key: 'pet_sakura_bunny_desc',
                icon_url: 'pet/6091.png',
                pet_type: 'frame_companion',
                total_frames: 4,
                delay_ms: 160,
                render_width: 52,
                render_height: 52,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#ff70a6',
                particle_type: 'sakura_sparkles'
            },
            {
                pet_id: 'pet_amber_tiger',
                name: 'Chó Con (5 Frames)',
                desc_key: 'pet_amber_tiger_desc',
                icon_url: 'pet/6156.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 150,
                render_width: 54,
                render_height: 46,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 1.05,
                aura_color: '#e09f3e',
                particle_type: 'amber_sparks'
            },
            {
                pet_id: 'pet_silver_nine_tails',
                name: 'Tiểu Bạch Hổ (5 Frames)',
                desc_key: 'pet_silver_nine_tails_desc',
                icon_url: 'pet/8771.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 165,
                render_width: 68,
                render_height: 42,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 40,
                speed_factor: 1.0,
                aura_color: '#e2eafc',
                particle_type: 'moonlight_shimmer'
            },
            {
                pet_id: 'pet_night_sentinel',
                name: 'Minion (7 Frames)',
                desc_key: 'pet_night_sentinel_desc',
                icon_url: 'pet/9711.png',
                pet_type: 'frame_companion',
                total_frames: 7,
                delay_ms: 140,
                render_width: 44,
                render_height: 52,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 1.05,
                aura_color: '#3a86ff',
                particle_type: 'night_feathers'
            },
            {
                pet_id: 'pet_blaze_gryphon',
                name: 'Mèo Shiba (4 Frames)',
                desc_key: 'pet_blaze_gryphon_desc',
                icon_url: 'pet/12091.png',
                pet_type: 'frame_companion',
                total_frames: 4,
                delay_ms: 155,
                render_width: 62,
                render_height: 44,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.05,
                aura_color: '#f77f00',
                particle_type: 'blazing_feathers'
            },
            {
                pet_id: 'pet_earth_gryphon',
                name: 'Chó Shiba (3 Frames)',
                desc_key: 'pet_earth_gryphon_desc',
                icon_url: 'pet/12330.png',
                pet_type: 'frame_companion',
                total_frames: 3,
                delay_ms: 175,
                render_width: 62,
                render_height: 44,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.0,
                aura_color: '#8c6d48',
                particle_type: 'stone_dust'
            },
            {
                pet_id: 'pet_golden_phoenix',
                name: 'Kim Sí Thần Phụng (5 Frames)',
                desc_key: 'pet_golden_phoenix_desc',
                icon_url: 'pet/12405.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 150,
                render_width: 48,
                render_height: 60,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.05,
                aura_color: '#ffd166',
                particle_type: 'phoenix_embers'
            },
            {
                pet_id: 'pet_magma_behemoth',
                name: 'Dung Nham Cự Thú (5 Frames)',
                desc_key: 'pet_magma_behemoth_desc',
                icon_url: 'pet/12552.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 160,
                render_width: 58,
                render_height: 62,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 44,
                speed_factor: 0.95,
                aura_color: '#d90429',
                particle_type: 'magma_flames'
            },
            {
                pet_id: 'pet_thunder_antler',
                name: 'Kim Giác Lôi Thú (6 Frames)',
                desc_key: 'pet_thunder_antler_desc',
                icon_url: 'pet/13871.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 145,
                render_width: 46,
                render_height: 64,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 40,
                speed_factor: 1.05,
                aura_color: '#ffb703',
                particle_type: 'thunder_bolts'
            },
            {
                pet_id: 'pet_solar_pixie',
                name: 'Quang Minh Tinh Linh (4 Frames)',
                desc_key: 'pet_solar_pixie_desc',
                icon_url: 'pet/13956.png',
                pet_type: 'frame_companion',
                total_frames: 4,
                delay_ms: 150,
                render_width: 48,
                render_height: 56,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#ffea00',
                particle_type: 'solar_glow'
            },
            {
                pet_id: 'pet_shadow_wolf',
                name: 'U Hồn Hắc Lang (6 Frames)',
                desc_key: 'pet_shadow_wolf_desc',
                icon_url: 'pet/14503.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 140,
                render_width: 46,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.05,
                aura_color: '#7b2cbf',
                particle_type: 'shadow_orbs'
            },
            {
                pet_id: 'pet_crimson_drake',
                name: 'Huyết Long Thần Thú (5 Frames)',
                desc_key: 'pet_crimson_drake_desc',
                icon_url: 'pet/14662.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 155,
                render_width: 56,
                render_height: 60,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 42,
                speed_factor: 1.05,
                aura_color: '#e63946',
                particle_type: 'crimson_sparks'
            },
            {
                pet_id: 'pet_abyssal_leviathan',
                name: 'Cá Mập Mắc Cạn (6 Frames)',
                desc_key: 'pet_abyssal_leviathan_desc',
                icon_url: 'pet/14779.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 145,
                render_width: 64,
                render_height: 46,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 44,
                speed_factor: 1.0,
                aura_color: '#0077b6',
                particle_type: 'ocean_bubbles'
            },
            {
                pet_id: 'pet_rose_fairy',
                name: 'Baby 3 (6 Frames)',
                desc_key: 'pet_rose_fairy_desc',
                icon_url: 'pet/14809.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 140,
                render_width: 50,
                render_height: 50,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 34,
                speed_factor: 1.0,
                aura_color: '#f72585',
                particle_type: 'rose_glitter'
            },
            {
                pet_id: 'pet_mystic_panda',
                name: 'Bảo Trúc Linh Miêu (6 Frames)',
                desc_key: 'pet_mystic_panda_desc',
                icon_url: 'pet/14825.png',
                pet_type: 'frame_companion',
                total_frames: 6,
                delay_ms: 150,
                render_width: 48,
                render_height: 54,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 36,
                speed_factor: 1.0,
                aura_color: '#2ec4b6',
                particle_type: 'bamboo_leaves'
            },
            {
                pet_id: 'pet_titan_drake',
                name: 'Thái Cổ Long Thần (4 Frames)',
                desc_key: 'pet_titan_drake_desc',
                icon_url: 'pet/16183.png',
                pet_type: 'frame_companion',
                total_frames: 4,
                delay_ms: 180,
                render_width: 78,
                render_height: 62,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 48,
                speed_factor: 0.95,
                aura_color: '#d4a373',
                particle_type: 'titan_aura'
            },
            {
                pet_id: 'pet_frost_leopard',
                name: 'Cậu Vàng (5 Frames)',
                desc_key: 'pet_frost_leopard_desc',
                icon_url: 'pet/16285.png',
                pet_type: 'frame_companion',
                total_frames: 5,
                delay_ms: 140,
                render_width: 60,
                render_height: 38,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.1,
                aura_color: '#90e0ef',
                particle_type: 'frost_wind'
            },
            {
                pet_id: 'pet_azure_seraph',
                name: 'Lam Tinh Sứ Giả (7 Frames)',
                desc_key: 'pet_azure_seraph_desc',
                icon_url: 'pet/17433.png',
                pet_type: 'frame_companion',
                total_frames: 7,
                delay_ms: 150,
                render_width: 76,
                render_height: 58,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 44,
                speed_factor: 1.05,
                aura_color: '#48cae4',
                particle_type: 'seraph_feathers'
            },
            {
                pet_id: 'pet_solar_kirin',
                name: 'Xích Kim Thần Thú (4 Frames)',
                desc_key: 'pet_solar_kirin_desc',
                icon_url: 'pet/27969.png',
                pet_type: 'frame_companion',
                total_frames: 4,
                delay_ms: 150,
                render_width: 60,
                render_height: 42,
                offset_x: 0,
                offset_y: 0,
                rarity: 'mythic',
                follow_dist: 38,
                speed_factor: 1.05,
                aura_color: '#f77f00',
                particle_type: 'solar_embers'
            }
        ];

        // 2. Bảng pet_frames: Nạp toàn bộ frame thực tế trong thư mục pet/
        const frames = [];

        // Pet 1: Cáo Vàng Kim Hồ (31513 -> 31517)
        const foxImages = [
            { id: 31513, w: 108, h: 132 },
            { id: 31514, w: 108, h: 132 },
            { id: 31515, w: 112, h: 140 },
            { id: 31516, w: 112, h: 136 },
            { id: 31517, w: 96, h: 140 }
        ];
        foxImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_golden_fox',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 2: Hỏa Kỳ Lân (7072 -> 7076)
        const kirinImages = [
            { id: 7072, w: 188, h: 136 },
            { id: 7073, w: 192, h: 140 },
            { id: 7074, w: 200, h: 132 },
            { id: 7075, w: 192, h: 132 },
            { id: 7076, w: 184, h: 136 }
        ];
        kirinImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_fire_kirin',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -32,
                dy: -23,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 3: Hắc Long Vương (7482 -> 7486)
        const dragonImages = [
            { id: 7482, w: 224, h: 168 },
            { id: 7483, w: 220, h: 172 },
            { id: 7484, w: 212, h: 168 },
            { id: 7485, w: 232, h: 184 },
            { id: 7486, w: 236, h: 160 }
        ];
        dragonImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_dark_dragon',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -33,
                dy: -26,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 4: Bạch Tuyết Cửu Vĩ (8763 -> 8767, Icon: 8761)
        const whiteFoxImages = [
            { id: 8763, w: 244, h: 140 },
            { id: 8764, w: 220, h: 124 },
            { id: 8765, w: 260, h: 136 },
            { id: 8766, w: 228, h: 136 },
            { id: 8767, w: 224, h: 132 }
        ];
        whiteFoxImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_white_fox',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -34,
                dy: -21,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 5: Lôi Thú Hoàng Kim (10618 -> 10625, 8 frames)
        const thunderImages = [
            { id: 10618, w: 152, h: 136 },
            { id: 10619, w: 156, h: 136 },
            { id: 10620, w: 160, h: 136 },
            { id: 10621, w: 168, h: 136 },
            { id: 10622, w: 156, h: 132 },
            { id: 10623, w: 156, h: 136 },
            { id: 10624, w: 168, h: 136 },
            { id: 10625, w: 148, h: 144 }
        ];
        thunderImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_thunder_beast',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -29,
                dy: -25,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 6: Huyết Lân Ma Thú (12938 -> 12944, 6 frames)
        const bloodImages = [
            { id: 12938, w: 148, h: 152 },
            { id: 12939, w: 172, h: 156 },
            { id: 12940, w: 140, h: 156 },
            { id: 12941, w: 148, h: 144 },
            { id: 12943, w: 152, h: 168 },
            { id: 12944, w: 148, h: 180 }
        ];
        bloodImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_blood_stag',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -28,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 7: Băng Tuyết Tinh Linh (14274 -> 14278, 5 frames, Icon 14273)
        const pixieImages = [
            { id: 14274, w: 168, h: 164 },
            { id: 14275, w: 168, h: 164 },
            { id: 14276, w: 168, h: 164 },
            { id: 14277, w: 168, h: 164 },
            { id: 14278, w: 168, h: 164 }
        ];
        pixieImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_frost_pixie',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -30,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 8: Viêm Hỏa Long Vương (19851 -> 19855, 5 frames)
        const blazingImages = [
            { id: 19851, w: 216, h: 177 },
            { id: 19852, w: 219, h: 180 },
            { id: 19853, w: 213, h: 174 },
            { id: 19854, w: 204, h: 177 },
            { id: 19855, w: 195, h: 177 }
        ];
        blazingImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_blazing_drake',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -34,
                dy: -28,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 9: Thổ Khuyển Linh Thú (6680 -> 6684, 5 frames)
        const shibaImages = [
            { id: 6680, w: 104, h: 108 },
            { id: 6681, w: 132, h: 112 },
            { id: 6682, w: 132, h: 112 },
            { id: 6683, w: 124, h: 112 },
            { id: 6684, w: 116, h: 116 }
        ];
        shibaImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_earth_shiba',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -23,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 10: Cơ Giáp Hộ Vệ (18480 -> 18484, 5 frames)
        const mechaImages = [
            { id: 18480, w: 120, h: 140 },
            { id: 18481, w: 124, h: 148 },
            { id: 18482, w: 128, h: 136 },
            { id: 18483, w: 124, h: 140 },
            { id: 18484, w: 128, h: 136 }
        ];
        mechaImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_mecha_sentinel',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -25,
                dy: -28,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 11: Thanh Long Thần Xà (18491 -> 18497, 7 frames)
        const serpentImages = [
            { id: 18491, w: 144, h: 112 },
            { id: 18492, w: 144, h: 116 },
            { id: 18493, w: 172, h: 124 },
            { id: 18494, w: 180, h: 132 },
            { id: 18495, w: 200, h: 132 },
            { id: 18496, w: 196, h: 136 },
            { id: 18497, w: 180, h: 132 }
        ];
        serpentImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_celestial_serpent',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -31,
                dy: -24,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 12: Hoa Linh Tinh Nữ (18836 -> 18842, 7 frames)
        const floraImages = [
            { id: 18836, w: 131, h: 98 },
            { id: 18837, w: 131, h: 98 },
            { id: 18838, w: 139, h: 85 },
            { id: 18839, w: 145, h: 87 },
            { id: 18840, w: 184, h: 104 },
            { id: 18841, w: 183, h: 93 },
            { id: 18842, w: 132, h: 100 }
        ];
        floraImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_flora_pixie',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -28,
                dy: -20,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 13: Bạch Ngân Cổ Long (19823 -> 19827, 5 frames, Icon 19820)
        const silverImages = [
            { id: 19823, w: 232, h: 132 },
            { id: 19824, w: 232, h: 132 },
            { id: 19825, w: 232, h: 132 },
            { id: 19826, w: 232, h: 132 },
            { id: 19827, w: 232, h: 132 }
        ];
        silverImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_silver_drake',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -32,
                dy: -21,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 14: Cổ Tháp Phù Điêu (21662 -> 21666, 5 frames)
        const obeliskImages = [
            { id: 21662, w: 100, h: 196 },
            { id: 21663, w: 100, h: 164 },
            { id: 21664, w: 100, h: 168 },
            { id: 21665, w: 100, h: 224 },
            { id: 21666, w: 100, h: 240 }
        ];
        obeliskImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_divine_obelisk',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -19,
                dy: -35,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 15: Anh Đào Linh Hồ (31567 -> 31571, 5 frames, Icon 31572)
        const sakuraFoxImages = [
            { id: 31567, w: 120, h: 136 },
            { id: 31568, w: 124, h: 144 },
            { id: 31569, w: 120, h: 140 },
            { id: 31570, w: 124, h: 136 },
            { id: 31571, w: 120, h: 140 }
        ];
        sakuraFoxImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_sakura_fox',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 16: Tinh Vân Thần Ưng (31852 -> 31859, 8 frames)
        const falconImages = [
            { id: 31852, w: 142, h: 171 },
            { id: 31853, w: 142, h: 171 },
            { id: 31854, w: 142, h: 171 },
            { id: 31855, w: 142, h: 171 },
            { id: 31856, w: 142, h: 171 },
            { id: 31857, w: 142, h: 171 },
            { id: 31858, w: 142, h: 171 },
            { id: 31859, w: 142, h: 171 }
        ];
        falconImages.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_astral_falcon',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -27,
                dy: -32,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 17: Anh Đào Thỏ Ngọc (4 Frames)
        const pet17Images = [
            { id: 6091, w: 112, h: 112 },
            { id: 6092, w: 112, h: 112 },
            { id: 6093, w: 112, h: 112 },
            { id: 6097, w: 112, h: 112 }
        ];
        pet17Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_sakura_bunny',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -26,
                dy: -26,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 18: Hoàng Kim Hổ Con (5 Frames)
        const pet18Images = [
            { id: 6156, w: 100, h: 88 },
            { id: 6157, w: 104, h: 92 },
            { id: 6158, w: 108, h: 88 },
            { id: 6159, w: 104, h: 92 },
            { id: 6160, w: 96, h: 80 }
        ];
        pet18Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_amber_tiger',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -27,
                dy: -23,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 19: Ngân Nguyệt Cửu Vĩ (5 Frames)
        const pet19Images = [
            { id: 8771, w: 216, h: 128 },
            { id: 8772, w: 212, h: 128 },
            { id: 8773, w: 232, h: 118 },
            { id: 8774, w: 216, h: 124 },
            { id: 8775, w: 228, h: 116 }
        ];
        pet19Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_silver_nine_tails',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -34,
                dy: -21,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 20: Dạ Hành Thần Điêu (7 Frames)
        const pet20Images = [
            { id: 9711, w: 48, h: 80 },
            { id: 9712, w: 48, h: 80 },
            { id: 9713, w: 68, h: 80 },
            { id: 9714, w: 76, h: 84 },
            { id: 9715, w: 72, h: 84 },
            { id: 9716, w: 84, h: 84 },
            { id: 9717, w: 76, h: 88 }
        ];
        pet20Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_night_sentinel',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -22,
                dy: -26,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 21: Xích Hỏa Sư Điêu (4 Frames)
        const pet21Images = [
            { id: 12091, w: 144, h: 104 },
            { id: 12093, w: 144, h: 112 },
            { id: 12094, w: 172, h: 112 },
            { id: 12095, w: 172, h: 112 }
        ];
        pet21Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_blaze_gryphon',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -31,
                dy: -22,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 22: Nham Thạch Sư Điêu (3 Frames)
        const pet22Images = [
            { id: 12330, w: 144, h: 112 },
            { id: 12331, w: 172, h: 112 },
            { id: 12332, w: 172, h: 112 }
        ];
        pet22Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_earth_gryphon',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -31,
                dy: -22,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 23: Kim Sí Thần Phụng (5 Frames)
        const pet23Images = [
            { id: 12405, w: 100, h: 128 },
            { id: 12406, w: 104, h: 124 },
            { id: 12407, w: 100, h: 124 },
            { id: 12408, w: 96, h: 124 },
            { id: 12409, w: 96, h: 128 }
        ];
        pet23Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_golden_phoenix',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -30,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 24: Dung Nham Cự Thú (5 Frames)
        const pet24Images = [
            { id: 12552, w: 140, h: 160 },
            { id: 12554, w: 172, h: 172 },
            { id: 12555, w: 164, h: 172 },
            { id: 12556, w: 164, h: 172 },
            { id: 12557, w: 164, h: 172 }
        ];
        pet24Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_magma_behemoth',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -29,
                dy: -31,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 25: Kim Giác Lôi Thú (6 Frames)
        const pet25Images = [
            { id: 13871, w: 88, h: 140 },
            { id: 13872, w: 88, h: 136 },
            { id: 13873, w: 88, h: 140 },
            { id: 13874, w: 88, h: 136 },
            { id: 13875, w: 88, h: 132 },
            { id: 13876, w: 88, h: 148 }
        ];
        pet25Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_thunder_antler',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -23,
                dy: -32,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 26: Quang Minh Tinh Linh (4 Frames)
        const pet26Images = [
            { id: 13956, w: 100, h: 120 },
            { id: 13957, w: 96, h: 108 },
            { id: 13958, w: 120, h: 132 },
            { id: 13959, w: 104, h: 116 }
        ];
        pet26Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_solar_pixie',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -28,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 27: U Hồn Hắc Lang (6 Frames)
        const pet27Images = [
            { id: 14503, w: 88, h: 124 },
            { id: 14504, w: 92, h: 120 },
            { id: 14505, w: 88, h: 124 },
            { id: 14506, w: 88, h: 120 },
            { id: 14507, w: 88, h: 116 },
            { id: 14508, w: 92, h: 132 }
        ];
        pet27Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_shadow_wolf',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -23,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 28: Huyết Long Thần Thú (5 Frames)
        const pet28Images = [
            { id: 14662, w: 132, h: 140 },
            { id: 14663, w: 132, h: 144 },
            { id: 14664, w: 128, h: 140 },
            { id: 14665, w: 132, h: 136 },
            { id: 14666, w: 128, h: 144 }
        ];
        pet28Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_crimson_drake',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -28,
                dy: -30,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 29: Thương Hải Thần Long (6 Frames)
        const pet29Images = [
            { id: 14779, w: 152, h: 112 },
            { id: 14780, w: 164, h: 112 },
            { id: 14781, w: 176, h: 112 },
            { id: 14782, w: 172, h: 112 },
            { id: 14783, w: 164, h: 108 },
            { id: 14784, w: 164, h: 104 }
        ];
        pet29Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_abyssal_leviathan',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -32,
                dy: -23,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 30: Hồng Điệp Tiên Linh (6 Frames)
        const pet30Images = [
            { id: 14809, w: 108, h: 108 },
            { id: 14810, w: 108, h: 104 },
            { id: 14811, w: 108, h: 100 },
            { id: 14812, w: 108, h: 108 },
            { id: 14813, w: 108, h: 100 },
            { id: 14814, w: 108, h: 108 }
        ];
        pet30Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_rose_fairy',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -25,
                dy: -25,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 31: Bảo Trúc Linh Miêu (6 Frames)
        const pet31Images = [
            { id: 14825, w: 100, h: 116 },
            { id: 14826, w: 100, h: 112 },
            { id: 14827, w: 100, h: 108 },
            { id: 14828, w: 100, h: 116 },
            { id: 14829, w: 100, h: 108 },
            { id: 14830, w: 100, h: 116 }
        ];
        pet31Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_mystic_panda',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -24,
                dy: -27,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 32: Thái Cổ Long Thần (4 Frames)
        const pet32Images = [
            { id: 16183, w: 336, h: 252 },
            { id: 16184, w: 328, h: 248 },
            { id: 16185, w: 336, h: 248 },
            { id: 16186, w: 340, h: 252 }
        ];
        pet32Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_titan_drake',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -39,
                dy: -31,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 33: Bạch Ngân Báo Thần (5 Frames)
        const pet33Images = [
            { id: 16285, w: 120, h: 76 },
            { id: 16286, w: 120, h: 76 },
            { id: 16287, w: 120, h: 76 },
            { id: 16288, w: 120, h: 76 },
            { id: 16289, w: 120, h: 76 }
        ];
        pet33Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_frost_leopard',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -30,
                dy: -19,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 34: Lam Tinh Sứ Giả (17433 -> 17439, 7 frames)
        const pet34Images = [
            { id: 17433, w: 680, h: 520 },
            { id: 17434, w: 680, h: 520 },
            { id: 17435, w: 680, h: 520 },
            { id: 17436, w: 680, h: 520 },
            { id: 17437, w: 680, h: 520 },
            { id: 17438, w: 680, h: 520 },
            { id: 17439, w: 680, h: 520 }
        ];
        pet34Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_azure_seraph',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -38,
                dy: -29,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // Pet 35: Xích Kim Thần Thú (27969 -> 27972, 4 frames)
        const pet35Images = [
            { id: 27969, w: 160, h: 112 },
            { id: 27970, w: 160, h: 112 },
            { id: 27971, w: 160, h: 112 },
            { id: 27972, w: 160, h: 112 }
        ];
        pet35Images.forEach((img, idx) => {
            frames.push({
                id: frames.length + 1,
                pet_id: 'pet_solar_kirin',
                frame_index: idx,
                image_id: img.id,
                image_url: `pet/${img.id}.png`,
                dx: -30,
                dy: -21,
                raw_width: img.w,
                raw_height: img.h
            });
        });

        // ==========================================
        this.tables.pet_frames = frames;
    }

    // Preload toàn bộ ảnh frame vào GPU memory buffer
    preloadTextures() {
        if (typeof Image === 'undefined') return;

        const allUrls = new Set();
        this.tables.pet_frames.forEach(f => allUrls.add(f.image_url));
        this.tables.pet_templates.forEach(t => allUrls.add(t.icon_url));
        // Thêm cả ảnh hỗ trợ nếu có
        allUrls.add('pet/8761.png');
        allUrls.add('pet/8762.png');
        allUrls.add('pet/19820.png');
        allUrls.add('pet/31572.png');

        this.totalImages = allUrls.size;

        allUrls.forEach(url => {
            const r2Url = (window.getR2Url ? window.getR2Url(url) : url);
            const img = new Image();
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount >= this.totalImages) {
                    this.isLoaded = true;
                    console.log('⚡ [PetDB] Đã tải trước 100% texture Pet từ Cloudflare R2!');
                }
            };
            img.onerror = (e) => {
                if (img.src === r2Url && r2Url !== url) {
                    img.src = url;
                } else {
                    console.warn(`[PetDB] Lỗi tải ảnh pet: ${url}`, e);
                }
            };
            img.src = r2Url;
            this.imageCache.set(url, img);
        });

        this.autoDiscoverFrames();
    }

    // Tự động quét và nạp thêm các frame ảnh mới nếu có thêm file trong pet/
    autoDiscoverFrames() {
        if (typeof Image === 'undefined') return;

        // Quét thêm nếu có các file pet khác
        const checkExtra = (imgId, petId) => {
            const testImg = new Image();
            testImg.src = `pet/${imgId}.png`;
            testImg.onload = () => {
                const currentFrames = this.getFrames(petId);
                const nextIndex = currentFrames.length;
                this.tables.pet_frames.push({
                    id: this.tables.pet_frames.length + 1,
                    pet_id: petId,
                    frame_index: nextIndex,
                    image_id: imgId,
                    image_url: `pet/${imgId}.png`,
                    dx: -30,
                    dy: -20,
                    raw_width: testImg.naturalWidth || 200,
                    raw_height: testImg.naturalHeight || 140
                });
                this.imageCache.set(`pet/${imgId}.png`, testImg);
                const tmpl = this.getPetTemplate(petId);
                if (tmpl) {
                    tmpl.total_frames = this.getFrames(petId).length;
                }
                console.log(`✨ [PetDB] Đã tự động tích hợp thêm frame ${imgId}.png cho ${petId}!`);
            };
        };

        checkExtra(31518, 'pet_golden_fox');
        checkExtra(7077, 'pet_fire_kirin');
        checkExtra(7487, 'pet_dark_dragon');
        checkExtra(8768, 'pet_white_fox');
    }

    // Engine SQL Query thực thi truy vấn
    query(sql, params = []) {
        sql = sql.trim().toUpperCase();

        if (sql.startsWith('SELECT * FROM PET_FRAMES WHERE PET_ID = ?')) {
            const petId = params[0];
            return this.tables.pet_frames
                .filter(f => f.pet_id === petId)
                .sort((a, b) => a.frame_index - b.frame_index);
        }

        if (sql.startsWith('SELECT * FROM PET_TEMPLATES WHERE PET_ID = ?')) {
            const petId = params[0];
            return this.tables.pet_templates.filter(t => t.pet_id === petId);
        }

        if (sql.startsWith('SELECT * FROM PET_TEMPLATES')) {
            return [...this.tables.pet_templates];
        }

        return [];
    }

    // Kiểm tra Pet có hợp lệ trong database hay không
    isFramePet(petId) {
        return this.tables.pet_templates.some(t => t.pet_id === petId);
    }

    // Lấy thông số Template của Pet
    getPetTemplate(petId) {
        const tmpl = this.tables.pet_templates.find(t => t.pet_id === petId) || null;
        if (tmpl) {
            const frames = this.getFrames(petId);
            if (frames && frames.length > 0) {
                tmpl.total_frames = frames.length;
            }
        }
        return tmpl;
    }

    // Lấy danh sách các frames đã sắp xếp của Pet
    getFrames(petId) {
        return this.query('SELECT * FROM PET_FRAMES WHERE PET_ID = ? ORDER BY frame_index ASC', [petId]);
    }

    // Lấy đối tượng Image đã preload sẵn cho frame tương ứng
    getFrameImage(petId, frameIndex) {
        const frames = this.getFrames(petId);
        if (!frames || frames.length === 0) return null;

        const targetFrame = frames[frameIndex % frames.length];
        if (!targetFrame) return null;

        return this.imageCache.get(targetFrame.image_url) || null;
    }

    // Lấy Icon Image của Pet
    getIconImage(petId) {
        const tmpl = this.getPetTemplate(petId);
        if (!tmpl) return null;
        return this.imageCache.get(tmpl.icon_url) || null;
    }

    // Tính toán frameIndex hiện tại theo thời gian trôi qua (ms)
    calculateFrameIndex(petId, elapsedTimeMs) {
        const frames = this.getFrames(petId);
        const total = (frames && frames.length > 0) ? frames.length : 1;
        const tmpl = this.getPetTemplate(petId);
        const delay = (tmpl && tmpl.delay_ms) || 160;

        return Math.floor(elapsedTimeMs / delay) % total;
    }

    // Lấy toàn bộ danh sách pet templates
    getAllPets() {
        return [...this.tables.pet_templates];
    }
}

// Khởi tạo Singleton Database Pet
window.petSQLDB = new PetSQLDatabase();
