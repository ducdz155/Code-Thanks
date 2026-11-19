/**
 * WING SQL DATABASE & PRELOADED TEXTURE BUFFER
 * Quản lý hoạt ảnh cánh Frame-by-frame mượt mà chuẩn 60-120 FPS:
 * - Lưu trữ dữ liệu cấu trúc bảng SQL (wing_templates, wing_frames)
 * - Tự động bảo toàn tỷ lệ khung hình thật, loại bỏ hoàn toàn hiện tượng nén bẹp cánh
 * - Preload toàn bộ các frame ảnh PNG vào GPU Image Buffer, chống giật lag
 */

class WingSQLDatabase {
    constructor() {
        this.tables = {
            wing_templates: [],
            wing_frames: []
        };
        this.imageCache = new Map();
        this.isLoaded = false;
        this.loadedCount = 0;
        this.totalImages = 0;

        // Khởi tạo và nạp dữ liệu SQL Schema
        this.seedDatabase();
        // Không preload ồ ạt trong constructor để ưu tiên nạp nhanh bản đồ và skin khởi đầu
    }

    seedDatabase() {
        // 1. Bảng wing_templates (17 bộ cánh Frame cao cấp, chuẩn tỷ lệ không bị nén)
        this.tables.wing_templates = [
            {
                wing_id: 'wing_cyber_hex',
                name: 'Cánh Cơ Giới Hexagon (14 Frames)',
                desc_key: 'wing_cyber_hex_desc',
                icon_url: 'picture/32248.png',
                wing_type: 'frame_atlas',
                total_frames: 14,
                delay_ms: 180,
                render_width: 205,
                render_height: 98,
                offset_x: 0,
                offset_y: -22,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_pink_angel',
                name: 'Cánh Thiên Thần Nơ Hồng (3 Frames)',
                desc_key: 'wing_pink_angel_desc',
                icon_url: 'picture/32238.png',
                wing_type: 'frame_atlas',
                total_frames: 3,
                delay_ms: 240,
                render_width: 143,
                render_height: 123,
                offset_x: 4,
                offset_y: -36,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_chaos_angel',
                name: 'Cánh Hỗn Mang Âm Dương (6 Frames)',
                desc_key: 'wing_chaos_angel_desc',
                icon_url: 'picture/14265.png',
                wing_type: 'frame_atlas',
                total_frames: 6,
                delay_ms: 150,
                render_width: 176,
                render_height: 151,
                offset_x: 0,
                offset_y: -5,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_azure_dragon',
                name: 'Cánh Rồng Lam Thủy Tộc (2 Frames)',
                desc_key: 'wing_azure_dragon_desc',
                icon_url: 'picture/14285.png',
                wing_type: 'frame_atlas',
                total_frames: 2,
                delay_ms: 220,
                render_width: 133,
                render_height: 72,
                offset_x: 1,
                offset_y: -22,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_golden_solar',
                name: 'Cánh Thái Dương Kim Phượng (12 Frames)',
                desc_key: 'wing_golden_solar_desc',
                icon_url: 'picture/20929.png',
                wing_type: 'frame_atlas',
                total_frames: 12,
                delay_ms: 140,
                render_width: 271,
                render_height: 271,
                offset_x: 1,
                offset_y: -4,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_crimson_blaze',
                name: 'Cánh Hỏa Diễm Rực Lửa (4 Frames)',
                desc_key: 'wing_crimson_blaze_desc',
                icon_url: 'picture/27120.png',
                wing_type: 'frame_atlas',
                total_frames: 4,
                delay_ms: 160,
                render_width: 134,
                render_height: 134,
                offset_x: 0,
                offset_y: -8,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_void_amethyst',
                name: 'Cánh Huyền Tử Hư Không (8 Frames)',
                desc_key: 'wing_void_amethyst_desc',
                icon_url: 'picture/27286.png',
                wing_type: 'frame_atlas',
                total_frames: 8,
                delay_ms: 145,
                render_width: 134,
                render_height: 134,
                offset_x: 0,
                offset_y: -9,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_silver_seraph',
                name: 'Cánh Bạch Kim Đại Thiên Sứ (4 Frames)',
                desc_key: 'wing_silver_seraph_desc',
                icon_url: 'picture/27975.png',
                wing_type: 'frame_atlas',
                total_frames: 4,
                delay_ms: 170,
                render_width: 199,
                render_height: 199,
                offset_x: -1,
                offset_y: -25,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_glacial_frost',
                name: 'Cánh Băng Tinh Lam Ngọc (4 Frames)',
                desc_key: 'wing_glacial_frost_desc',
                icon_url: 'picture/30412.png',
                wing_type: 'frame_atlas',
                total_frames: 4,
                delay_ms: 160,
                render_width: 151,
                render_height: 151,
                offset_x: 0,
                offset_y: -30,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_holy_white',
                name: 'Cánh Thánh Quang Bạch Ngân (2 Frames)',
                desc_key: 'wing_holy_white_desc',
                icon_url: 'picture/12827.png',
                wing_type: 'frame_atlas',
                total_frames: 2,
                delay_ms: 200,
                render_width: 141,
                render_height: 121,
                offset_x: -2,
                offset_y: -27,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_rainbow_celestial',
                name: 'Cánh Cầu Vồng Tinh Tú (2 Frames)',
                desc_key: 'wing_rainbow_celestial_desc',
                icon_url: 'picture/20214.png',
                wing_type: 'frame_atlas',
                total_frames: 2,
                delay_ms: 200,
                render_width: 342,
                render_height: 219,
                offset_x: -11,
                offset_y: -20,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_void_thunder',
                name: 'Cánh Tử Lôi Hư Không (6 Frames)',
                desc_key: 'wing_void_thunder_desc',
                icon_url: 'picture/21215.png',
                wing_type: 'frame_atlas',
                total_frames: 6,
                delay_ms: 150,
                render_width: 139,
                render_height: 139,
                offset_x: -1,
                offset_y: -11,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_mecha_seraph',
                name: 'Cánh Thánh Giáp Cơ Giới (7 Frames)',
                desc_key: 'wing_mecha_seraph_desc',
                icon_url: 'picture/23516.png',
                wing_type: 'frame_atlas',
                total_frames: 7,
                delay_ms: 160,
                render_width: 209,
                render_height: 134,
                offset_x: -3,
                offset_y: -26,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_blazing_phoenix',
                name: 'Cánh Liệt Diễm Phượng Hoàng (5 Frames)',
                desc_key: 'wing_blazing_phoenix_desc',
                icon_url: 'picture/24520.png',
                wing_type: 'frame_atlas',
                total_frames: 5,
                delay_ms: 150,
                render_width: 146,
                render_height: 146,
                offset_x: 1,
                offset_y: -33,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_glacial_sovereign',
                name: 'Cánh Băng Phong Lam Tinh (7 Frames)',
                desc_key: 'wing_glacial_sovereign_desc',
                icon_url: 'picture/24536.png',
                wing_type: 'frame_atlas',
                total_frames: 7,
                delay_ms: 150,
                render_width: 187,
                render_height: 174,
                offset_x: 0,
                offset_y: -29,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_aurora_seraph',
                name: 'Cánh Đại Thiên Thần Cực Quang (9 Frames)',
                desc_key: 'wing_aurora_seraph_desc',
                icon_url: 'picture/24540.png',
                wing_type: 'frame_atlas',
                total_frames: 9,
                delay_ms: 140,
                render_width: 187,
                render_height: 187,
                offset_x: -1,
                offset_y: -34,
                rarity: 'mythic'
            },
            {
                wing_id: 'wing_abyssal_drake',
                name: 'Cánh Hắc Ma Viêm Long (4 Frames)',
                desc_key: 'wing_abyssal_drake_desc',
                icon_url: 'picture/27772.png',
                wing_type: 'frame_atlas',
                total_frames: 4,
                delay_ms: 160,
                render_width: 218,
                render_height: 188,
                offset_x: 0,
                offset_y: -19,
                rarity: 'mythic'
            }
        ];

        // 2. Bảng wing_frames:
        const allFrames = [];
        // Cánh Cơ Giới Hexagon (14 Frames)
        allFrames.push({ id: 1, wing_id: 'wing_cyber_hex', frame_index: 0, image_id: 32239, image_url: 'picture/32239.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 2, wing_id: 'wing_cyber_hex', frame_index: 1, image_id: 32240, image_url: 'picture/32240.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 3, wing_id: 'wing_cyber_hex', frame_index: 2, image_id: 32241, image_url: 'picture/32241.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 4, wing_id: 'wing_cyber_hex', frame_index: 3, image_id: 32242, image_url: 'picture/32242.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 5, wing_id: 'wing_cyber_hex', frame_index: 4, image_id: 32243, image_url: 'picture/32243.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 6, wing_id: 'wing_cyber_hex', frame_index: 5, image_id: 32244, image_url: 'picture/32244.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 7, wing_id: 'wing_cyber_hex', frame_index: 6, image_id: 32245, image_url: 'picture/32245.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 8, wing_id: 'wing_cyber_hex', frame_index: 7, image_id: 32246, image_url: 'picture/32246.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 9, wing_id: 'wing_cyber_hex', frame_index: 8, image_id: 32247, image_url: 'picture/32247.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 10, wing_id: 'wing_cyber_hex', frame_index: 9, image_id: 32248, image_url: 'picture/32248.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 11, wing_id: 'wing_cyber_hex', frame_index: 10, image_id: 32249, image_url: 'picture/32249.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 12, wing_id: 'wing_cyber_hex', frame_index: 11, image_id: 32250, image_url: 'picture/32250.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 13, wing_id: 'wing_cyber_hex', frame_index: 12, image_id: 32251, image_url: 'picture/32251.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        allFrames.push({ id: 14, wing_id: 'wing_cyber_hex', frame_index: 13, image_id: 32252, image_url: 'picture/32252.png', dx: -68, dy: -32, raw_width: 352, raw_height: 168 });
        // Cánh Thiên Thần Nơ Hồng (3 Frames)
        allFrames.push({ id: 15, wing_id: 'wing_pink_angel', frame_index: 0, image_id: 32235, image_url: 'picture/32235.png', dx: -57, dy: -49, raw_width: 1072, raw_height: 920 });
        allFrames.push({ id: 16, wing_id: 'wing_pink_angel', frame_index: 1, image_id: 32236, image_url: 'picture/32236.png', dx: -57, dy: -49, raw_width: 1072, raw_height: 920 });
        allFrames.push({ id: 17, wing_id: 'wing_pink_angel', frame_index: 2, image_id: 32237, image_url: 'picture/32237.png', dx: -57, dy: -49, raw_width: 1072, raw_height: 920 });
        // Cánh Hỗn Mang Âm Dương (6 Frames)
        allFrames.push({ id: 18, wing_id: 'wing_chaos_angel', frame_index: 0, image_id: 14265, image_url: 'picture/14265.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        allFrames.push({ id: 19, wing_id: 'wing_chaos_angel', frame_index: 1, image_id: 14266, image_url: 'picture/14266.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        allFrames.push({ id: 20, wing_id: 'wing_chaos_angel', frame_index: 2, image_id: 14267, image_url: 'picture/14267.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        allFrames.push({ id: 21, wing_id: 'wing_chaos_angel', frame_index: 3, image_id: 14268, image_url: 'picture/14268.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        allFrames.push({ id: 22, wing_id: 'wing_chaos_angel', frame_index: 4, image_id: 14269, image_url: 'picture/14269.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        allFrames.push({ id: 23, wing_id: 'wing_chaos_angel', frame_index: 5, image_id: 14270, image_url: 'picture/14270.png', dx: -68, dy: -58, raw_width: 400, raw_height: 344 });
        // Cánh Rồng Lam Thủy Tộc (2 Frames)
        allFrames.push({ id: 24, wing_id: 'wing_azure_dragon', frame_index: 0, image_id: 14285, image_url: 'picture/14285.png', dx: -53, dy: -28, raw_width: 252, raw_height: 136 });
        allFrames.push({ id: 25, wing_id: 'wing_azure_dragon', frame_index: 1, image_id: 14286, image_url: 'picture/14286.png', dx: -53, dy: -28, raw_width: 252, raw_height: 136 });
        // Cánh Thái Dương Kim Phượng (12 Frames)
        allFrames.push({ id: 26, wing_id: 'wing_golden_solar', frame_index: 0, image_id: 20929, image_url: 'picture/20929.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 27, wing_id: 'wing_golden_solar', frame_index: 1, image_id: 20930, image_url: 'picture/20930.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 28, wing_id: 'wing_golden_solar', frame_index: 2, image_id: 20931, image_url: 'picture/20931.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 29, wing_id: 'wing_golden_solar', frame_index: 3, image_id: 20932, image_url: 'picture/20932.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 30, wing_id: 'wing_golden_solar', frame_index: 4, image_id: 20933, image_url: 'picture/20933.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 31, wing_id: 'wing_golden_solar', frame_index: 5, image_id: 20934, image_url: 'picture/20934.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 32, wing_id: 'wing_golden_solar', frame_index: 6, image_id: 20935, image_url: 'picture/20935.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 33, wing_id: 'wing_golden_solar', frame_index: 7, image_id: 20936, image_url: 'picture/20936.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 34, wing_id: 'wing_golden_solar', frame_index: 8, image_id: 20937, image_url: 'picture/20937.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 35, wing_id: 'wing_golden_solar', frame_index: 9, image_id: 20938, image_url: 'picture/20938.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 36, wing_id: 'wing_golden_solar', frame_index: 10, image_id: 20939, image_url: 'picture/20939.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        allFrames.push({ id: 37, wing_id: 'wing_golden_solar', frame_index: 11, image_id: 20940, image_url: 'picture/20940.png', dx: -100, dy: -100, raw_width: 1650, raw_height: 1650 });
        // Cánh Hỏa Diễm Rực Lửa (4 Frames)
        allFrames.push({ id: 38, wing_id: 'wing_crimson_blaze', frame_index: 0, image_id: 27120, image_url: 'picture/27120.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 39, wing_id: 'wing_crimson_blaze', frame_index: 1, image_id: 27121, image_url: 'picture/27121.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 40, wing_id: 'wing_crimson_blaze', frame_index: 2, image_id: 27122, image_url: 'picture/27122.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 41, wing_id: 'wing_crimson_blaze', frame_index: 3, image_id: 27123, image_url: 'picture/27123.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        // Cánh Huyền Tử Hư Không (8 Frames)
        allFrames.push({ id: 42, wing_id: 'wing_void_amethyst', frame_index: 0, image_id: 27286, image_url: 'picture/27286.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 43, wing_id: 'wing_void_amethyst', frame_index: 1, image_id: 27287, image_url: 'picture/27287.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 44, wing_id: 'wing_void_amethyst', frame_index: 2, image_id: 27288, image_url: 'picture/27288.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 45, wing_id: 'wing_void_amethyst', frame_index: 3, image_id: 27289, image_url: 'picture/27289.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 46, wing_id: 'wing_void_amethyst', frame_index: 4, image_id: 27290, image_url: 'picture/27290.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 47, wing_id: 'wing_void_amethyst', frame_index: 5, image_id: 27291, image_url: 'picture/27291.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 48, wing_id: 'wing_void_amethyst', frame_index: 6, image_id: 27292, image_url: 'picture/27292.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 49, wing_id: 'wing_void_amethyst', frame_index: 7, image_id: 27293, image_url: 'picture/27293.png', dx: -54, dy: -54, raw_width: 500, raw_height: 500 });
        // Cánh Bạch Kim Đại Thiên Sứ (4 Frames)
        allFrames.push({ id: 50, wing_id: 'wing_silver_seraph', frame_index: 0, image_id: 27975, image_url: 'picture/27975.png', dx: -73, dy: -73, raw_width: 600, raw_height: 600 });
        allFrames.push({ id: 51, wing_id: 'wing_silver_seraph', frame_index: 1, image_id: 27976, image_url: 'picture/27976.png', dx: -73, dy: -73, raw_width: 600, raw_height: 600 });
        allFrames.push({ id: 52, wing_id: 'wing_silver_seraph', frame_index: 2, image_id: 27977, image_url: 'picture/27977.png', dx: -73, dy: -73, raw_width: 600, raw_height: 600 });
        allFrames.push({ id: 53, wing_id: 'wing_silver_seraph', frame_index: 3, image_id: 27978, image_url: 'picture/27978.png', dx: -73, dy: -73, raw_width: 600, raw_height: 600 });
        // Cánh Băng Tinh Lam Ngọc (4 Frames)
        allFrames.push({ id: 54, wing_id: 'wing_glacial_frost', frame_index: 0, image_id: 30412, image_url: 'picture/30412.png', dx: -60, dy: -60, raw_width: 1024, raw_height: 1024 });
        allFrames.push({ id: 55, wing_id: 'wing_glacial_frost', frame_index: 1, image_id: 30413, image_url: 'picture/30413.png', dx: -60, dy: -60, raw_width: 1024, raw_height: 1024 });
        allFrames.push({ id: 56, wing_id: 'wing_glacial_frost', frame_index: 2, image_id: 30414, image_url: 'picture/30414.png', dx: -60, dy: -60, raw_width: 1024, raw_height: 1024 });
        allFrames.push({ id: 57, wing_id: 'wing_glacial_frost', frame_index: 3, image_id: 30415, image_url: 'picture/30415.png', dx: -60, dy: -60, raw_width: 1024, raw_height: 1024 });
        // Cánh Thánh Quang Bạch Ngân (2 Frames)
        allFrames.push({ id: 58, wing_id: 'wing_holy_white', frame_index: 0, image_id: 12827, image_url: 'picture/12827.png', dx: -55, dy: -47, raw_width: 196, raw_height: 168 });
        allFrames.push({ id: 59, wing_id: 'wing_holy_white', frame_index: 1, image_id: 12828, image_url: 'picture/12828.png', dx: -55, dy: -47, raw_width: 196, raw_height: 168 });
        // Cánh Cầu Vồng Tinh Tú (2 Frames)
        allFrames.push({ id: 60, wing_id: 'wing_rainbow_celestial', frame_index: 0, image_id: 20214, image_url: 'picture/20214.png', dx: -60, dy: -38, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 61, wing_id: 'wing_rainbow_celestial', frame_index: 1, image_id: 20215, image_url: 'picture/20215.png', dx: -60, dy: -38, raw_width: 1000, raw_height: 640 });
        // Cánh Tử Lôi Hư Không (6 Frames)
        allFrames.push({ id: 62, wing_id: 'wing_void_thunder', frame_index: 0, image_id: 21215, image_url: 'picture/21215.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 63, wing_id: 'wing_void_thunder', frame_index: 1, image_id: 21216, image_url: 'picture/21216.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 64, wing_id: 'wing_void_thunder', frame_index: 2, image_id: 21217, image_url: 'picture/21217.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 65, wing_id: 'wing_void_thunder', frame_index: 3, image_id: 21218, image_url: 'picture/21218.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 66, wing_id: 'wing_void_thunder', frame_index: 4, image_id: 21219, image_url: 'picture/21219.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 67, wing_id: 'wing_void_thunder', frame_index: 5, image_id: 21220, image_url: 'picture/21220.png', dx: -60, dy: -60, raw_width: 500, raw_height: 500 });
        // Cánh Thánh Giáp Cơ Giới (7 Frames)
        allFrames.push({ id: 68, wing_id: 'wing_mecha_seraph', frame_index: 0, image_id: 23516, image_url: 'picture/23516.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 69, wing_id: 'wing_mecha_seraph', frame_index: 1, image_id: 23517, image_url: 'picture/23517.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 70, wing_id: 'wing_mecha_seraph', frame_index: 2, image_id: 23518, image_url: 'picture/23518.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 71, wing_id: 'wing_mecha_seraph', frame_index: 3, image_id: 23519, image_url: 'picture/23519.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 72, wing_id: 'wing_mecha_seraph', frame_index: 4, image_id: 23520, image_url: 'picture/23520.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 73, wing_id: 'wing_mecha_seraph', frame_index: 5, image_id: 23521, image_url: 'picture/23521.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        allFrames.push({ id: 74, wing_id: 'wing_mecha_seraph', frame_index: 6, image_id: 23522, image_url: 'picture/23522.png', dx: -62, dy: -40, raw_width: 1000, raw_height: 640 });
        // Cánh Liệt Diễm Phượng Hoàng (5 Frames)
        allFrames.push({ id: 75, wing_id: 'wing_blazing_phoenix', frame_index: 0, image_id: 24521, image_url: 'picture/24521.png', dx: -58, dy: -58, raw_width: 373, raw_height: 373 });
        allFrames.push({ id: 76, wing_id: 'wing_blazing_phoenix', frame_index: 1, image_id: 24522, image_url: 'picture/24522.png', dx: -58, dy: -58, raw_width: 373, raw_height: 373 });
        allFrames.push({ id: 77, wing_id: 'wing_blazing_phoenix', frame_index: 2, image_id: 24523, image_url: 'picture/24523.png', dx: -58, dy: -58, raw_width: 373, raw_height: 373 });
        allFrames.push({ id: 78, wing_id: 'wing_blazing_phoenix', frame_index: 3, image_id: 24524, image_url: 'picture/24524.png', dx: -58, dy: -58, raw_width: 373, raw_height: 373 });
        allFrames.push({ id: 79, wing_id: 'wing_blazing_phoenix', frame_index: 4, image_id: 24525, image_url: 'picture/24525.png', dx: -58, dy: -58, raw_width: 373, raw_height: 373 });
        // Cánh Băng Phong Lam Tinh (7 Frames)
        allFrames.push({ id: 80, wing_id: 'wing_glacial_sovereign', frame_index: 0, image_id: 24529, image_url: 'picture/24529.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 81, wing_id: 'wing_glacial_sovereign', frame_index: 1, image_id: 24530, image_url: 'picture/24530.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 82, wing_id: 'wing_glacial_sovereign', frame_index: 2, image_id: 24531, image_url: 'picture/24531.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 83, wing_id: 'wing_glacial_sovereign', frame_index: 3, image_id: 24532, image_url: 'picture/24532.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 84, wing_id: 'wing_glacial_sovereign', frame_index: 4, image_id: 24533, image_url: 'picture/24533.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 85, wing_id: 'wing_glacial_sovereign', frame_index: 5, image_id: 24534, image_url: 'picture/24534.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        allFrames.push({ id: 86, wing_id: 'wing_glacial_sovereign', frame_index: 6, image_id: 24535, image_url: 'picture/24535.png', dx: -60, dy: -56, raw_width: 433, raw_height: 402 });
        // Cánh Đại Thiên Thần Cực Quang (9 Frames)
        allFrames.push({ id: 87, wing_id: 'wing_aurora_seraph', frame_index: 0, image_id: 24540, image_url: 'picture/24540.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 88, wing_id: 'wing_aurora_seraph', frame_index: 1, image_id: 24541, image_url: 'picture/24541.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 89, wing_id: 'wing_aurora_seraph', frame_index: 2, image_id: 24542, image_url: 'picture/24542.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 90, wing_id: 'wing_aurora_seraph', frame_index: 3, image_id: 24543, image_url: 'picture/24543.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 91, wing_id: 'wing_aurora_seraph', frame_index: 4, image_id: 24544, image_url: 'picture/24544.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 92, wing_id: 'wing_aurora_seraph', frame_index: 5, image_id: 24545, image_url: 'picture/24545.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 93, wing_id: 'wing_aurora_seraph', frame_index: 6, image_id: 24546, image_url: 'picture/24546.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 94, wing_id: 'wing_aurora_seraph', frame_index: 7, image_id: 24547, image_url: 'picture/24547.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        allFrames.push({ id: 95, wing_id: 'wing_aurora_seraph', frame_index: 8, image_id: 24548, image_url: 'picture/24548.png', dx: -62, dy: -62, raw_width: 500, raw_height: 500 });
        // Cánh Hắc Ma Viêm Long (4 Frames)
        allFrames.push({ id: 96, wing_id: 'wing_abyssal_drake', frame_index: 0, image_id: 27772, image_url: 'picture/27772.png', dx: -62, dy: -54, raw_width: 520, raw_height: 448 });
        allFrames.push({ id: 97, wing_id: 'wing_abyssal_drake', frame_index: 1, image_id: 27773, image_url: 'picture/27773.png', dx: -62, dy: -54, raw_width: 520, raw_height: 448 });
        allFrames.push({ id: 98, wing_id: 'wing_abyssal_drake', frame_index: 2, image_id: 27774, image_url: 'picture/27774.png', dx: -62, dy: -54, raw_width: 520, raw_height: 448 });
        allFrames.push({ id: 99, wing_id: 'wing_abyssal_drake', frame_index: 3, image_id: 27775, image_url: 'picture/27775.png', dx: -62, dy: -54, raw_width: 520, raw_height: 448 });

        this.tables.wing_frames = allFrames;
    }

    preloadTextures() {
        if (typeof Image === 'undefined') return;

        const allUrls = new Set();
        this.tables.wing_frames.forEach(f => allUrls.add(f.image_url));
        this.tables.wing_templates.forEach(t => allUrls.add(t.icon_url));

        this.totalImages = allUrls.size;

        allUrls.forEach(url => {
            const r2Url = (window.getR2Url ? window.getR2Url(url) : url);
            const img = new Image();
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount >= this.totalImages) {
                    this.isLoaded = true;
                    console.log('⚡ [WingDB] Đã tải trước 100% texture cánh từ Cloudflare R2!');
                }
            };
            img.onerror = (e) => {
                if (img.src === r2Url && r2Url !== url) {
                    img.src = url;
                } else {
                    console.warn(`[WingDB] Lỗi tải ảnh: ${url}`, e);
                }
            };
            img.src = r2Url;
            this.imageCache.set(url, img);
        });

        this.autoDiscoverFrames();
    }

    autoDiscoverFrames() {
        if (typeof Image === 'undefined') return;

        const checkNextFrame = (imgId, wingId) => {
            const testImg = new Image();
            testImg.src = `picture/${imgId}.png`;
            testImg.onload = () => {
                const currentFrames = this.getFrames(wingId);
                const nextIndex = currentFrames.length;
                this.tables.wing_frames.push({
                    id: this.tables.wing_frames.length + 1,
                    wing_id: wingId,
                    frame_index: nextIndex,
                    image_id: imgId,
                    image_url: `picture/${imgId}.png`,
                    dx: -50,
                    dy: -50,
                    raw_width: testImg.naturalWidth || 352,
                    raw_height: testImg.naturalHeight || 168
                });
                this.imageCache.set(`picture/${imgId}.png`, testImg);
                const tmpl = this.getWingTemplate(wingId);
                if (tmpl) {
                    tmpl.total_frames = this.getFrames(wingId).length;
                }
                checkNextFrame(imgId + 1, wingId);
            };
            testImg.onerror = () => {};
        };

        checkNextFrame(32253, 'wing_cyber_hex');
    }

    query(sql, params = []) {
        sql = sql.trim().toUpperCase();

        if (sql.startsWith('SELECT * FROM WING_FRAMES WHERE WING_ID = ?')) {
            const wingId = params[0];
            return this.tables.wing_frames
                .filter(f => f.wing_id === wingId)
                .sort((a, b) => a.frame_index - b.frame_index);
        }

        if (sql.startsWith('SELECT * FROM WING_TEMPLATES WHERE WING_ID = ?')) {
            const wingId = params[0];
            return this.tables.wing_templates.filter(t => t.wing_id === wingId);
        }

        if (sql.startsWith('SELECT * FROM WING_TEMPLATES')) {
            return [...this.tables.wing_templates];
        }

        return [];
    }

    isFrameWing(wingId) {
        return this.tables.wing_templates.some(t => t.wing_id === wingId);
    }

    getWingTemplate(wingId) {
        const tmpl = this.tables.wing_templates.find(t => t.wing_id === wingId) || null;
        if (tmpl) {
            const frames = this.getFrames(wingId);
            if (frames && frames.length > 0) {
                tmpl.total_frames = frames.length;
            }
        }
        return tmpl;
    }

    getFrames(wingId) {
        return this.query('SELECT * FROM WING_FRAMES WHERE WING_ID = ? ORDER BY frame_index ASC', [wingId]);
    }

    getFrameImage(wingId, frameIndex) {
        const frames = this.getFrames(wingId);
        if (!frames || frames.length === 0) return null;

        const targetFrame = frames[frameIndex % frames.length];
        if (!targetFrame) return null;

        return this.imageCache.get(targetFrame.image_url) || null;
    }

    getIconImage(wingId) {
        const tmpl = this.getWingTemplate(wingId);
        if (!tmpl) return null;
        return this.imageCache.get(tmpl.icon_url) || null;
    }

    calculateFrameIndex(wingId, elapsedTimeMs) {
        const frames = this.getFrames(wingId);
        const total = (frames && frames.length > 0) ? frames.length : 1;
        const tmpl = this.getWingTemplate(wingId);
        const delay = (tmpl && tmpl.delay_ms) || 180;
        return Math.floor(elapsedTimeMs / delay) % total;
    }
}

window.wingSQLDB = new WingSQLDatabase();
