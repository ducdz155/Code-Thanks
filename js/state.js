/**
 * ZUSTAND-COMPATIBLE REACTIVE GLOBAL STATE STORE
 * Quản lý tập trung toàn bộ trạng thái Game theo chuẩn Zustand:
 * - State bất biến (immutable transitions)
 * - Tự động đồng bộ LocalStorage (Persistence)
 * - Đầy đủ Schema Túi Đồ, Thiện Cảm, 10 Loại Cánh, Tủ Đồ, Hệ Thống Nhiệm Vụ & Thành Tựu
 */

// ĐỊNH NGHĨA DỮ LIỆU CÁC LOẠI CÁNH (FRAME ATLAS SPRITESHEETS & CÁC BIẾN THỂ)
const WINGS_REGISTRY = {
    // 0. CÁC BỘ CÁNH FRAME HOẠT ẢNH THỰC TẾ TỪ THƯ MỤC ẢNH & DATABASE SQL (17 BỘ CÁNH CHUẨN TỶ LỆ KHÔNG BỊ NÉN)
    wing_cyber_hex: {
        id: 'wing_cyber_hex',
        nameKey: 'wing_cyber_hex_name',
        descKey: 'wing_cyber_hex_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#00b4d8',
        themeColor: '#0077b6',
        isFrameWing: true,
        iconUrl: 'picture/32248.png',
        totalFrames: 14,
        delayMs: 180,
        renderWidth: 205,
        renderHeight: 98,
        offsetX: 0,
        offsetY: -22,
        sparkleType: 'ice_shards',
        wingType: 'frame_cyber_hex'
    },
    wing_pink_angel: {
        id: 'wing_pink_angel',
        nameKey: 'wing_pink_angel_name',
        descKey: 'wing_pink_angel_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ff70a6',
        themeColor: '#ff0054',
        isFrameWing: true,
        iconUrl: 'picture/32238.png',
        totalFrames: 3,
        delayMs: 240,
        renderWidth: 143,
        renderHeight: 123,
        offsetX: 4,
        offsetY: -36,
        sparkleType: 'holy_halo',
        wingType: 'frame_pink_angel'
    },
    wing_chaos_angel: {
        id: 'wing_chaos_angel',
        nameKey: 'wing_chaos_angel_name',
        descKey: 'wing_chaos_angel_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#c77dff',
        themeColor: '#7b2cbf',
        isFrameWing: true,
        iconUrl: 'picture/14265.png',
        totalFrames: 6,
        delayMs: 150,
        renderWidth: 176,
        renderHeight: 151,
        offsetX: 0,
        offsetY: -5,
        sparkleType: 'holy_halo',
        wingType: 'frame_chaos_angel'
    },
    wing_azure_dragon: {
        id: 'wing_azure_dragon',
        nameKey: 'wing_azure_dragon_name',
        descKey: 'wing_azure_dragon_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#00b4d8',
        themeColor: '#0077b6',
        isFrameWing: true,
        iconUrl: 'picture/14285.png',
        totalFrames: 2,
        delayMs: 220,
        renderWidth: 133,
        renderHeight: 72,
        offsetX: 1,
        offsetY: -22,
        sparkleType: 'ice_shards',
        wingType: 'frame_azure_dragon'
    },
    wing_golden_solar: {
        id: 'wing_golden_solar',
        nameKey: 'wing_golden_solar_name',
        descKey: 'wing_golden_solar_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffb703',
        themeColor: '#fb8500',
        isFrameWing: true,
        iconUrl: 'picture/20929.png',
        totalFrames: 12,
        delayMs: 140,
        renderWidth: 271,
        renderHeight: 271,
        offsetX: 1,
        offsetY: -4,
        sparkleType: 'fire_sparks',
        wingType: 'frame_golden_solar'
    },
    wing_crimson_blaze: {
        id: 'wing_crimson_blaze',
        nameKey: 'wing_crimson_blaze_name',
        descKey: 'wing_crimson_blaze_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e63946',
        themeColor: '#d90429',
        isFrameWing: true,
        iconUrl: 'picture/27120.png',
        totalFrames: 4,
        delayMs: 160,
        renderWidth: 134,
        renderHeight: 134,
        offsetX: 0,
        offsetY: -8,
        sparkleType: 'fire_sparks',
        wingType: 'frame_crimson_blaze'
    },
    wing_void_amethyst: {
        id: 'wing_void_amethyst',
        nameKey: 'wing_void_amethyst_name',
        descKey: 'wing_void_amethyst_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#9d4edd',
        themeColor: '#7b2cbf',
        isFrameWing: true,
        iconUrl: 'picture/27286.png',
        totalFrames: 8,
        delayMs: 145,
        renderWidth: 134,
        renderHeight: 134,
        offsetX: 0,
        offsetY: -9,
        sparkleType: 'stardust',
        wingType: 'frame_void_amethyst'
    },
    wing_silver_seraph: {
        id: 'wing_silver_seraph',
        nameKey: 'wing_silver_seraph_name',
        descKey: 'wing_silver_seraph_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f8f9fa',
        themeColor: '#adb5bd',
        isFrameWing: true,
        iconUrl: 'picture/27975.png',
        totalFrames: 4,
        delayMs: 170,
        renderWidth: 199,
        renderHeight: 199,
        offsetX: -1,
        offsetY: -25,
        sparkleType: 'holy_halo',
        wingType: 'frame_silver_seraph'
    },
    wing_glacial_frost: {
        id: 'wing_glacial_frost',
        nameKey: 'wing_glacial_frost_name',
        descKey: 'wing_glacial_frost_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#90e0ef',
        themeColor: '#00b4d8',
        isFrameWing: true,
        iconUrl: 'picture/30412.png',
        totalFrames: 4,
        delayMs: 160,
        renderWidth: 151,
        renderHeight: 151,
        offsetX: 0,
        offsetY: -30,
        sparkleType: 'ice_shards',
        wingType: 'frame_glacial_frost'
    },
    wing_holy_white: {
        id: 'wing_holy_white',
        nameKey: 'wing_holy_white_name',
        descKey: 'wing_holy_white_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f8f9fa',
        themeColor: '#adb5bd',
        isFrameWing: true,
        iconUrl: 'picture/12827.png',
        totalFrames: 2,
        delayMs: 200,
        renderWidth: 141,
        renderHeight: 121,
        offsetX: -2,
        offsetY: -27,
        sparkleType: 'holy_halo',
        wingType: 'frame_holy_white'
    },
    wing_rainbow_celestial: {
        id: 'wing_rainbow_celestial',
        nameKey: 'wing_rainbow_celestial_name',
        descKey: 'wing_rainbow_celestial_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f8c7fa',
        themeColor: '#7209b7',
        isFrameWing: true,
        iconUrl: 'picture/20214.png',
        totalFrames: 2,
        delayMs: 200,
        renderWidth: 342,
        renderHeight: 219,
        offsetX: -11,
        offsetY: -20,
        sparkleType: 'stardust',
        wingType: 'frame_rainbow_celestial'
    },
    wing_void_thunder: {
        id: 'wing_void_thunder',
        nameKey: 'wing_void_thunder_name',
        descKey: 'wing_void_thunder_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#c77dff',
        themeColor: '#7b2cbf',
        isFrameWing: true,
        iconUrl: 'picture/21215.png',
        totalFrames: 6,
        delayMs: 150,
        renderWidth: 139,
        renderHeight: 139,
        offsetX: -1,
        offsetY: -11,
        sparkleType: 'stardust',
        wingType: 'frame_void_thunder'
    },
    wing_mecha_seraph: {
        id: 'wing_mecha_seraph',
        nameKey: 'wing_mecha_seraph_name',
        descKey: 'wing_mecha_seraph_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e0f2fe',
        themeColor: '#0284c7',
        isFrameWing: true,
        iconUrl: 'picture/23516.png',
        totalFrames: 7,
        delayMs: 160,
        renderWidth: 209,
        renderHeight: 134,
        offsetX: -3,
        offsetY: -26,
        sparkleType: 'holy_halo',
        wingType: 'frame_mecha_seraph'
    },
    wing_blazing_phoenix: {
        id: 'wing_blazing_phoenix',
        nameKey: 'wing_blazing_phoenix_name',
        descKey: 'wing_blazing_phoenix_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f97316',
        themeColor: '#c2410c',
        isFrameWing: true,
        iconUrl: 'picture/24520.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 146,
        renderHeight: 146,
        offsetX: 1,
        offsetY: -33,
        sparkleType: 'fire_sparks',
        wingType: 'frame_blazing_phoenix'
    },
    wing_glacial_sovereign: {
        id: 'wing_glacial_sovereign',
        nameKey: 'wing_glacial_sovereign_name',
        descKey: 'wing_glacial_sovereign_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#38bdf8',
        themeColor: '#0284c7',
        isFrameWing: true,
        iconUrl: 'picture/24536.png',
        totalFrames: 7,
        delayMs: 150,
        renderWidth: 187,
        renderHeight: 174,
        offsetX: 0,
        offsetY: -29,
        sparkleType: 'ice_shards',
        wingType: 'frame_glacial_sovereign'
    },
    wing_aurora_seraph: {
        id: 'wing_aurora_seraph',
        nameKey: 'wing_aurora_seraph_name',
        descKey: 'wing_aurora_seraph_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f8f9fa',
        themeColor: '#e2e8f0',
        isFrameWing: true,
        iconUrl: 'picture/24540.png',
        totalFrames: 9,
        delayMs: 140,
        renderWidth: 187,
        renderHeight: 187,
        offsetX: -1,
        offsetY: -34,
        sparkleType: 'holy_halo',
        wingType: 'frame_aurora_seraph'
    },
    wing_abyssal_drake: {
        id: 'wing_abyssal_drake',
        nameKey: 'wing_abyssal_drake_name',
        descKey: 'wing_abyssal_drake_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ef4444',
        themeColor: '#991b1b',
        isFrameWing: true,
        iconUrl: 'picture/27772.png',
        totalFrames: 4,
        delayMs: 160,
        renderWidth: 218,
        renderHeight: 188,
        offsetX: 0,
        offsetY: -19,
        sparkleType: 'fire_sparks',
        wingType: 'frame_abyssal_drake'
    },







    // 1. Cánh Tiên
    wing_fairy: {
        id: 'wing_fairy',
        nameKey: 'wing_fairy_name',
        descKey: 'wing_fairy_desc',
        reqKey: 'wing_fairy_req',
        rarity: 'epic',
        rarityBorder: '#9d4edd',
        themeColor: '#7209b7',
        wingSpan: 46,
        wingHeight: 38,
        pivot: { x: 0, y: 0 },
        sparkleType: 'stardust',
        wingType: 'fairy'
    },
    wing_fairy_pink: {
        id: 'wing_fairy_pink',
        nameKey: 'wing_fairy_pink_name',
        descKey: 'wing_fairy_pink_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'legendary',
        rarityBorder: '#ff70a6',
        themeColor: '#ff0054',
        wingSpan: 46,
        wingHeight: 38,
        pivot: { x: 0, y: 0 },
        sparkleType: 'stardust',
        wingType: 'fairy_pink'
    },
    wing_fairy_gold: {
        id: 'wing_fairy_gold',
        nameKey: 'wing_fairy_gold_name',
        descKey: 'wing_fairy_gold_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        themeColor: '#ffb703',
        wingSpan: 46,
        wingHeight: 38,
        pivot: { x: 0, y: 0 },
        sparkleType: 'holy_halo',
        wingType: 'fairy_gold'
    },

    // 2. Cánh Thiên Thần
    wing_angel: {
        id: 'wing_angel',
        nameKey: 'wing_angel_name',
        descKey: 'wing_angel_desc',
        reqKey: 'wing_angel_req',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        themeColor: '#ffb703',
        wingSpan: 54,
        wingHeight: 46,
        pivot: { x: 0, y: 0 },
        sparkleType: 'holy_halo',
        wingType: 'angel'
    },
    wing_angel_fallen: {
        id: 'wing_angel_fallen',
        nameKey: 'wing_angel_fallen_name',
        descKey: 'wing_angel_fallen_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#7209b7',
        themeColor: '#10002b',
        wingSpan: 54,
        wingHeight: 46,
        pivot: { x: 0, y: 0 },
        sparkleType: 'dark_mist',
        wingType: 'angel_fallen'
    },
    wing_angel_seraph: {
        id: 'wing_angel_seraph',
        nameKey: 'wing_angel_seraph_name',
        descKey: 'wing_angel_seraph_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#4cc9f0',
        themeColor: '#4361ee',
        wingSpan: 58,
        wingHeight: 50,
        pivot: { x: 0, y: 0 },
        sparkleType: 'holy_halo',
        wingType: 'angel_seraph'
    },

    // 3. Cánh Dơi
    wing_bat: {
        id: 'wing_bat',
        nameKey: 'wing_bat_name',
        descKey: 'wing_bat_desc',
        reqKey: 'wing_bat_req',
        rarity: 'rare',
        rarityBorder: '#5a189a',
        themeColor: '#3c096c',
        wingSpan: 48,
        wingHeight: 36,
        pivot: { x: 0, y: 0 },
        sparkleType: 'dark_mist',
        wingType: 'bat'
    },
    wing_bat_crimson: {
        id: 'wing_bat_crimson',
        nameKey: 'wing_bat_crimson_name',
        descKey: 'wing_bat_crimson_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'epic',
        rarityBorder: '#e63946',
        themeColor: '#9d0208',
        wingSpan: 48,
        wingHeight: 36,
        pivot: { x: 0, y: 0 },
        sparkleType: 'ember',
        wingType: 'bat_crimson'
    },

    // 4. Cánh Bướm (Đầy đủ biến thể màu sắc theo ảnh spritesheet)
    wing_butterfly: {
        id: 'wing_butterfly',
        nameKey: 'wing_butterfly_name',
        descKey: 'wing_butterfly_desc',
        reqKey: 'wing_butterfly_req',
        rarity: 'epic',
        rarityBorder: '#f72585',
        themeColor: '#ff4d6d',
        wingSpan: 50,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'pollen',
        wingType: 'butterfly'
    },
    wing_butterfly_blue: {
        id: 'wing_butterfly_blue',
        nameKey: 'wing_butterfly_blue_name',
        descKey: 'wing_butterfly_blue_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'epic',
        rarityBorder: '#48cae4',
        themeColor: '#0077b6',
        wingSpan: 50,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'stardust',
        wingType: 'butterfly_blue'
    },
    wing_butterfly_emerald: {
        id: 'wing_butterfly_emerald',
        nameKey: 'wing_butterfly_emerald_name',
        descKey: 'wing_butterfly_emerald_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'epic',
        rarityBorder: '#52b788',
        themeColor: '#2d6a4f',
        wingSpan: 50,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'leaf_sprout',
        wingType: 'butterfly_emerald'
    },
    wing_butterfly_gold: {
        id: 'wing_butterfly_gold',
        nameKey: 'wing_butterfly_gold_name',
        descKey: 'wing_butterfly_gold_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        themeColor: '#ffb703',
        wingSpan: 50,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'holy_halo',
        wingType: 'butterfly_gold'
    },
    wing_butterfly_noir: {
        id: 'wing_butterfly_noir',
        nameKey: 'wing_butterfly_noir_name',
        descKey: 'wing_butterfly_noir_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffb703',
        themeColor: '#212529',
        wingSpan: 50,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'dark_mist',
        wingType: 'butterfly_noir'
    },

    // 5. Cánh Lá Cây
    wing_leaf: {
        id: 'wing_leaf',
        nameKey: 'wing_leaf_name',
        descKey: 'wing_leaf_desc',
        reqKey: 'wing_leaf_req',
        rarity: 'rare',
        rarityBorder: '#2ec4b6',
        themeColor: '#2d6a4f',
        wingSpan: 46,
        wingHeight: 40,
        pivot: { x: 0, y: 0 },
        sparkleType: 'leaf_sprout',
        wingType: 'leaf'
    },

    // 6. Cánh Mây
    wing_cloud: {
        id: 'wing_cloud',
        nameKey: 'wing_cloud_name',
        descKey: 'wing_cloud_desc',
        reqKey: 'wing_cloud_req',
        rarity: 'rare',
        rarityBorder: '#a2d2ff',
        themeColor: '#e0fbfc',
        wingSpan: 50,
        wingHeight: 38,
        pivot: { x: 0, y: 0 },
        sparkleType: 'mist',
        wingType: 'cloud'
    },

    // 7. Cánh Lửa
    wing_flame: {
        id: 'wing_flame',
        nameKey: 'wing_flame_name',
        descKey: 'wing_flame_desc',
        reqKey: 'wing_flame_req',
        rarity: 'epic',
        rarityBorder: '#f77f00',
        themeColor: '#d62828',
        wingSpan: 52,
        wingHeight: 44,
        pivot: { x: 0, y: 0 },
        sparkleType: 'ember',
        wingType: 'flame'
    },
    wing_flame_blue: {
        id: 'wing_flame_blue',
        nameKey: 'wing_flame_blue_name',
        descKey: 'wing_flame_blue_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'legendary',
        rarityBorder: '#48cae4',
        themeColor: '#03045e',
        wingSpan: 52,
        wingHeight: 44,
        pivot: { x: 0, y: 0 },
        sparkleType: 'ice_shards',
        wingType: 'flame_blue'
    },

    // 8. Cánh Băng Pha Lê
    wing_crystal: {
        id: 'wing_crystal',
        nameKey: 'wing_crystal_name',
        descKey: 'wing_crystal_desc',
        reqKey: 'wing_crystal_req',
        rarity: 'rare',
        rarityBorder: '#48cae4',
        themeColor: '#0077b6',
        wingSpan: 50,
        wingHeight: 44,
        pivot: { x: 0, y: 0 },
        sparkleType: 'ice_shards',
        wingType: 'crystal'
    },
    wing_crystal_amethyst: {
        id: 'wing_crystal_amethyst',
        nameKey: 'wing_crystal_amethyst_name',
        descKey: 'wing_crystal_amethyst_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'legendary',
        rarityBorder: '#b5179e',
        themeColor: '#7209b7',
        wingSpan: 50,
        wingHeight: 44,
        pivot: { x: 0, y: 0 },
        sparkleType: 'stardust',
        wingType: 'crystal_amethyst'
    },

    // 9. Cánh Sao Băng
    wing_star: {
        id: 'wing_star',
        nameKey: 'wing_star_name',
        descKey: 'wing_star_desc',
        reqKey: 'wing_star_req',
        rarity: 'epic',
        rarityBorder: '#4361ee',
        themeColor: '#3a0ca3',
        wingSpan: 54,
        wingHeight: 42,
        pivot: { x: 0, y: 0 },
        sparkleType: 'shooting_star',
        wingType: 'star'
    },
    wing_star_rainbow: {
        id: 'wing_star_rainbow',
        nameKey: 'wing_star_rainbow_name',
        descKey: 'wing_star_rainbow_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ff70a6',
        themeColor: '#f72585',
        wingSpan: 56,
        wingHeight: 44,
        pivot: { x: 0, y: 0 },
        sparkleType: 'shooting_star',
        wingType: 'star_rainbow'
    },

    // 10. Cánh Rồng
    wing_dragon: {
        id: 'wing_dragon',
        nameKey: 'wing_dragon_name',
        descKey: 'wing_dragon_desc',
        reqKey: 'wing_dragon_req',
        rarity: 'mythic',
        rarityBorder: '#06d6a0',
        themeColor: '#118ab2',
        wingSpan: 58,
        wingHeight: 46,
        pivot: { x: 0, y: 0 },
        sparkleType: 'dragon_aura',
        wingType: 'dragon'
    },
    wing_dragon_inferno: {
        id: 'wing_dragon_inferno',
        nameKey: 'wing_dragon_inferno_name',
        descKey: 'wing_dragon_inferno_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#d90429',
        themeColor: '#6a040f',
        wingSpan: 58,
        wingHeight: 46,
        pivot: { x: 0, y: 0 },
        sparkleType: 'ember',
        wingType: 'dragon_inferno'
    }
};

// ========================================================
// ĐỊNH NGHĨA DỮ LIỆU 4 BỘ TRANG PHỤC HOÀN CHỈNH ĐỒNG BỘ 100%
// (Nữ Pháp Sư Elf Frieren, Nữ Chiến Binh Videl, Hoàng Tử Cổ Đại, Nữ Thần Rừng)
// ========================================================
const OUTFITS_DATA = {
    outfit_frieren: {
        id: 'outfit_frieren',
        nameKey: 'outfit_frieren_name',
        descKey: 'outfit_frieren_desc',
        isFrameBody: true,
        bodyId: 'outfit_frieren',
        headId: 'head_elf_silver',
        iconUrl: 'body/outfit_frieren_icon.png',
        shirtColor: '#f8f9fa',
        pantsColor: '#2b2d42',
        accentColor: '#ffd166',
        secondaryColor: '#6e503b',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    outfit_videl_noel: {
        id: 'outfit_videl_noel',
        nameKey: 'outfit_videl_noel_name',
        descKey: 'outfit_videl_noel_desc',
        isFrameBody: true,
        bodyId: 'outfit_videl_noel',
        headId: 'head_videl',
        iconUrl: 'body/outfit_videl_noel_icon.png',
        shirtColor: '#d62828',
        pantsColor: '#ffffff',
        accentColor: '#fdf0d5',
        secondaryColor: '#003049',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.70
    },
    outfit_prince_warrior: {
        id: 'outfit_prince_warrior',
        nameKey: 'outfit_prince_warrior_name',
        descKey: 'outfit_prince_warrior_desc',
        isFrameBody: true,
        bodyId: 'outfit_prince_warrior',
        headId: 'head_crown_prince',
        iconUrl: 'body/outfit_prince_warrior_icon.png',
        shirtColor: '#d4af37',
        pantsColor: '#1a1a1a',
        accentColor: '#ffd166',
        secondaryColor: '#5c3d2e',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.70
    },
    outfit_goddess_blonde: {
        id: 'outfit_goddess_blonde',
        nameKey: 'outfit_goddess_blonde_name',
        descKey: 'outfit_goddess_blonde_desc',
        isFrameBody: true,
        bodyId: 'outfit_goddess_blonde',
        headId: 'head_blonde_ribbon',
        iconUrl: 'body/outfit_goddess_blonde_icon.png',
        shirtColor: '#2d6a4f',
        pantsColor: '#1b4332',
        accentColor: '#d4af37',
        secondaryColor: '#52b788',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_naruto: {
        id: 'skin_naruto',
        nameKey: 'skin_naruto_name',
        descKey: 'skin_naruto_desc',
        isFrameBody: true,
        bodyId: 'skin_naruto',
        headId: null,
        iconUrl: 'body/skin_naruto_icon.png',
        shirtColor: '#f77f00',
        pantsColor: '#003049',
        accentColor: '#ffd166',
        secondaryColor: '#d62828',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.85
    },
    skin_blue_knight: {
        id: 'skin_blue_knight',
        nameKey: 'skin_blue_knight_name',
        descKey: 'skin_blue_knight_desc',
        isFrameBody: true,
        bodyId: 'skin_blue_knight',
        headId: null,
        iconUrl: 'body/skin_blue_knight_icon.png',
        shirtColor: '#4361ee',
        pantsColor: '#f8f9fa',
        accentColor: '#4cc9f0',
        secondaryColor: '#3a0ca3',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    skin_doraemon: {
        id: 'skin_doraemon',
        nameKey: 'skin_doraemon_name',
        descKey: 'skin_doraemon_desc',
        isFrameBody: true,
        bodyId: 'skin_doraemon',
        headId: null,
        iconUrl: 'body/skin_doraemon_icon.png',
        shirtColor: '#0096c7',
        pantsColor: '#ffffff',
        accentColor: '#ffd166',
        secondaryColor: '#e63946',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_purple_cap: {
        id: 'skin_purple_cap',
        nameKey: 'skin_purple_cap_name',
        descKey: 'skin_purple_cap_desc',
        isFrameBody: true,
        bodyId: 'skin_purple_cap',
        headId: null,
        iconUrl: 'body/skin_purple_cap_icon.png',
        shirtColor: '#7209b7',
        pantsColor: '#f72585',
        accentColor: '#f77f00',
        secondaryColor: '#3a0ca3',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.70
    },
    skin_fairy_crimson: {
        id: 'skin_fairy_crimson',
        nameKey: 'skin_fairy_crimson_name',
        descKey: 'skin_fairy_crimson_desc',
        isFrameBody: true,
        bodyId: 'skin_fairy_crimson',
        headId: null,
        iconUrl: 'body/skin_fairy_crimson_icon.png',
        shirtColor: '#d90429',
        pantsColor: '#ef233c',
        accentColor: '#ffd166',
        secondaryColor: '#2b2d42',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.85
    },
    skin_goku_fighter: {
        id: 'skin_goku_fighter',
        nameKey: 'skin_goku_fighter_name',
        descKey: 'skin_goku_fighter_desc',
        isFrameBody: true,
        bodyId: 'skin_goku_fighter',
        headId: null,
        iconUrl: 'body/skin_goku_fighter_icon.png',
        shirtColor: '#f77f00',
        pantsColor: '#023e8a',
        accentColor: '#ffd166',
        secondaryColor: '#d62828',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_kitsune_maiden: {
        id: 'skin_kitsune_maiden',
        nameKey: 'skin_kitsune_maiden_name',
        descKey: 'skin_kitsune_maiden_desc',
        isFrameBody: true,
        bodyId: 'skin_kitsune_maiden',
        headId: null,
        iconUrl: 'body/skin_kitsune_maiden_icon.png',
        shirtColor: '#ffffff',
        pantsColor: '#e63946',
        accentColor: '#ffb703',
        secondaryColor: '#fb8500',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_flame_rengoku: {
        id: 'skin_flame_rengoku',
        nameKey: 'skin_flame_rengoku_name',
        descKey: 'skin_flame_rengoku_desc',
        isFrameBody: true,
        bodyId: 'skin_flame_rengoku',
        headId: null,
        iconUrl: 'body/skin_flame_rengoku_icon.png',
        shirtColor: '#d62828',
        pantsColor: '#2b2d42',
        accentColor: '#ffb703',
        secondaryColor: '#f77f00',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.85
    },
    skin_bulma_qipao: {
        id: 'skin_bulma_qipao',
        nameKey: 'skin_bulma_qipao_name',
        descKey: 'skin_bulma_qipao_desc',
        isFrameBody: true,
        bodyId: 'skin_bulma_qipao',
        headId: null,
        iconUrl: 'body/skin_bulma_qipao_icon.png',
        shirtColor: '#d90429',
        pantsColor: '#d90429',
        accentColor: '#ffd166',
        secondaryColor: '#0096c7',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.70
    },
    skin_chichi_martial: {
        id: 'skin_chichi_martial',
        nameKey: 'skin_chichi_martial_name',
        descKey: 'skin_chichi_martial_desc',
        isFrameBody: true,
        bodyId: 'skin_chichi_martial',
        headId: null,
        iconUrl: 'body/skin_chichi_martial_icon.png',
        shirtColor: '#0077b6',
        pantsColor: '#90e0ef',
        accentColor: '#ffd166',
        secondaryColor: '#03045e',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    skin_gatchan_angel: {
        id: 'skin_gatchan_angel',
        nameKey: 'skin_gatchan_angel_name',
        descKey: 'skin_gatchan_angel_desc',
        isFrameBody: true,
        bodyId: 'skin_gatchan_angel',
        headId: null,
        iconUrl: 'body/skin_gatchan_angel_icon.png',
        shirtColor: '#ffd166',
        pantsColor: '#d62828',
        accentColor: '#52b788',
        secondaryColor: '#ffffff',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_wuxia_redhair: {
        id: 'skin_wuxia_redhair',
        nameKey: 'skin_wuxia_redhair_name',
        descKey: 'skin_wuxia_redhair_desc',
        isFrameBody: true,
        bodyId: 'skin_wuxia_redhair',
        headId: null,
        iconUrl: 'body/skin_wuxia_redhair_icon.png',
        shirtColor: '#ffffff',
        pantsColor: '#d62828',
        accentColor: '#ffd166',
        secondaryColor: '#9d0208',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.85
    },
    skin_obocchaman: {
        id: 'skin_obocchaman',
        nameKey: 'skin_obocchaman_name',
        descKey: 'skin_obocchaman_desc',
        isFrameBody: true,
        bodyId: 'skin_obocchaman',
        headId: null,
        iconUrl: 'body/skin_obocchaman_icon.png',
        shirtColor: '#f8f9fa',
        pantsColor: '#4361ee',
        accentColor: '#d62828',
        secondaryColor: '#ffd166',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    skin_ethnic_maiden: {
        id: 'skin_ethnic_maiden',
        nameKey: 'skin_ethnic_maiden_name',
        descKey: 'skin_ethnic_maiden_desc',
        isFrameBody: true,
        bodyId: 'skin_ethnic_maiden',
        headId: null,
        iconUrl: 'body/skin_ethnic_maiden_icon.png',
        shirtColor: '#ffb703',
        pantsColor: '#bc6c25',
        accentColor: '#d62828',
        secondaryColor: '#2b2d42',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    skin_chichi_xmas: {
        id: 'skin_chichi_xmas',
        nameKey: 'skin_chichi_xmas_name',
        descKey: 'skin_chichi_xmas_desc',
        isFrameBody: true,
        bodyId: 'skin_chichi_xmas',
        headId: null,
        iconUrl: 'body/skin_chichi_xmas_icon.png',
        shirtColor: '#d90429',
        pantsColor: '#ffffff',
        accentColor: '#38b000',
        secondaryColor: '#dda15e',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.80
    },
    skin_shaolin_monk: {
        id: 'skin_shaolin_monk',
        nameKey: 'skin_shaolin_monk_name',
        descKey: 'skin_shaolin_monk_desc',
        isFrameBody: true,
        bodyId: 'skin_shaolin_monk',
        headId: null,
        iconUrl: 'body/skin_shaolin_monk_icon.png',
        shirtColor: '#0077b6',
        pantsColor: '#03045e',
        accentColor: '#ffd166',
        secondaryColor: '#e0a96d',
        rarity: 'legendary',
        rarityBorder: '#ffd166',
        speedBonus: 0.75
    },
    skin_arale_norimaki: {
        id: 'skin_arale_norimaki',
        nameKey: 'skin_arale_norimaki_name',
        descKey: 'skin_arale_norimaki_desc',
        isFrameBody: true,
        bodyId: 'skin_arale_norimaki',
        headId: null,
        iconUrl: 'body/skin_arale_norimaki_icon.png',
        shirtColor: '#d62828',
        pantsColor: '#0077b6',
        accentColor: '#7209b7',
        secondaryColor: '#ff4d6d',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        speedBonus: 0.85
    }
};

// ==========================================
// REGISTRY HỆ THỐNG THÚ CƯNG (COMPANION PETS FRAME SYSTEM)
// ==========================================
const PETS_REGISTRY = {
    pet_golden_fox: {
        id: 'pet_golden_fox',
        nameKey: 'pet_golden_fox_name',
        descKey: 'pet_golden_fox_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        themeColor: '#f77f00',
        isFramePet: true,
        iconUrl: 'pet/31513.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 58,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#ffd166',
        sparkleType: 'gold_sparkles'
    },
    pet_fire_kirin: {
        id: 'pet_fire_kirin',
        nameKey: 'pet_fire_kirin_name',
        descKey: 'pet_fire_kirin_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e63946',
        themeColor: '#d62828',
        isFramePet: true,
        iconUrl: 'pet/7072.png',
        totalFrames: 5,
        delayMs: 160,
        renderWidth: 64,
        renderHeight: 46,
        followDist: 40,
        speedFactor: 1.05,
        auraColor: '#ff4d00',
        sparkleType: 'fire_embers'
    },
    pet_dark_dragon: {
        id: 'pet_dark_dragon',
        nameKey: 'pet_dark_dragon_name',
        descKey: 'pet_dark_dragon_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#7209b7',
        themeColor: '#3a0ca3',
        isFramePet: true,
        iconUrl: 'pet/7482.png',
        totalFrames: 5,
        delayMs: 170,
        renderWidth: 66,
        renderHeight: 52,
        followDist: 42,
        speedFactor: 1.0,
        auraColor: '#7209b7',
        sparkleType: 'dark_mist'
    },
    pet_white_fox: {
        id: 'pet_white_fox',
        nameKey: 'pet_white_fox_name',
        descKey: 'pet_white_fox_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#4cc9f0',
        themeColor: '#4361ee',
        isFramePet: true,
        iconUrl: 'pet/8761.png',
        totalFrames: 5,
        delayMs: 165,
        renderWidth: 68,
        renderHeight: 42,
        followDist: 38,
        speedFactor: 1.0,
        auraColor: '#4cc9f0',
        sparkleType: 'holy_aura'
    },
    pet_thunder_beast: {
        id: 'pet_thunder_beast',
        nameKey: 'pet_thunder_beast_name',
        descKey: 'pet_thunder_beast_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffb703',
        themeColor: '#9d4edd',
        isFramePet: true,
        iconUrl: 'pet/10618.png',
        totalFrames: 8,
        delayMs: 140,
        renderWidth: 58,
        renderHeight: 50,
        followDist: 38,
        speedFactor: 1.05,
        auraColor: '#ffb703',
        sparkleType: 'thunder_sparks'
    },
    pet_blood_stag: {
        id: 'pet_blood_stag',
        nameKey: 'pet_blood_stag_name',
        descKey: 'pet_blood_stag_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#d90429',
        themeColor: '#9b2226',
        isFramePet: true,
        iconUrl: 'pet/12938.png',
        totalFrames: 6,
        delayMs: 150,
        renderWidth: 56,
        renderHeight: 58,
        followDist: 42,
        speedFactor: 1.0,
        auraColor: '#d90429',
        sparkleType: 'blood_mist'
    },
    pet_frost_pixie: {
        id: 'pet_frost_pixie',
        nameKey: 'pet_frost_pixie_name',
        descKey: 'pet_frost_pixie_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#00b4d8',
        themeColor: '#48cae4',
        isFramePet: true,
        iconUrl: 'pet/14273.png',
        totalFrames: 5,
        delayMs: 160,
        renderWidth: 60,
        renderHeight: 58,
        followDist: 36,
        speedFactor: 1.0,
        auraColor: '#00b4d8',
        sparkleType: 'snow_crystals'
    },
    pet_blazing_drake: {
        id: 'pet_blazing_drake',
        nameKey: 'pet_blazing_drake_name',
        descKey: 'pet_blazing_drake_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ff0054',
        themeColor: '#ff5400',
        isFramePet: true,
        iconUrl: 'pet/19851.png',
        totalFrames: 5,
        delayMs: 170,
        renderWidth: 68,
        renderHeight: 56,
        followDist: 44,
        speedFactor: 1.05,
        auraColor: '#ff0054',
        sparkleType: 'solar_flares'
    },
    pet_earth_shiba: {
        id: 'pet_earth_shiba',
        nameKey: 'pet_earth_shiba_name',
        descKey: 'pet_earth_shiba_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#a3704c',
        themeColor: '#dda15e',
        isFramePet: true,
        iconUrl: 'pet/6680.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 46,
        followDist: 36,
        speedFactor: 1.0,
        auraColor: '#a3704c',
        sparkleType: 'earth_leaves'
    },
    pet_mecha_sentinel: {
        id: 'pet_mecha_sentinel',
        nameKey: 'pet_mecha_sentinel_name',
        descKey: 'pet_mecha_sentinel_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e63946',
        themeColor: '#457b9d',
        isFramePet: true,
        iconUrl: 'pet/18480.png',
        totalFrames: 5,
        delayMs: 160,
        renderWidth: 50,
        renderHeight: 56,
        followDist: 38,
        speedFactor: 1.05,
        auraColor: '#e63946',
        sparkleType: 'cyber_glitch'
    },
    pet_celestial_serpent: {
        id: 'pet_celestial_serpent',
        nameKey: 'pet_celestial_serpent_name',
        descKey: 'pet_celestial_serpent_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#48cae4',
        themeColor: '#0077b6',
        isFramePet: true,
        iconUrl: 'pet/18491.png',
        totalFrames: 7,
        delayMs: 145,
        renderWidth: 62,
        renderHeight: 48,
        followDist: 42,
        speedFactor: 1.0,
        auraColor: '#48cae4',
        sparkleType: 'celestial_whiskers'
    },
    pet_flora_pixie: {
        id: 'pet_flora_pixie',
        nameKey: 'pet_flora_pixie_name',
        descKey: 'pet_flora_pixie_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f72585',
        themeColor: '#b5179e',
        isFramePet: true,
        iconUrl: 'pet/18836.png',
        totalFrames: 7,
        delayMs: 135,
        renderWidth: 56,
        renderHeight: 40,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#f72585',
        sparkleType: 'flora_blossoms'
    },
    pet_silver_drake: {
        id: 'pet_silver_drake',
        nameKey: 'pet_silver_drake_name',
        descKey: 'pet_silver_drake_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e0e1dd',
        themeColor: '#778da9',
        isFramePet: true,
        iconUrl: 'pet/19820.png',
        totalFrames: 5,
        delayMs: 165,
        renderWidth: 64,
        renderHeight: 42,
        followDist: 44,
        speedFactor: 1.05,
        auraColor: '#e0e1dd',
        sparkleType: 'silver_shimmer'
    },
    pet_divine_obelisk: {
        id: 'pet_divine_obelisk',
        nameKey: 'pet_divine_obelisk_name',
        descKey: 'pet_divine_obelisk_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#7209b7',
        themeColor: '#3a0ca3',
        isFramePet: true,
        iconUrl: 'pet/21662.png',
        totalFrames: 5,
        delayMs: 180,
        renderWidth: 38,
        renderHeight: 70,
        followDist: 36,
        speedFactor: 0.95,
        auraColor: '#7209b7',
        sparkleType: 'ancient_runes'
    },
    pet_sakura_fox: {
        id: 'pet_sakura_fox',
        nameKey: 'pet_sakura_fox_name',
        descKey: 'pet_sakura_fox_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ff70a6',
        themeColor: '#ff9770',
        isFramePet: true,
        iconUrl: 'pet/31572.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 58,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#ff70a6',
        sparkleType: 'sakura_petals'
    },
    pet_astral_falcon: {
        id: 'pet_astral_falcon',
        nameKey: 'pet_astral_falcon_name',
        descKey: 'pet_astral_falcon_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffaa00',
        themeColor: '#ff5400',
        isFramePet: true,
        iconUrl: 'pet/31852.png',
        totalFrames: 8,
        delayMs: 140,
        renderWidth: 54,
        renderHeight: 64,
        followDist: 40,
        speedFactor: 1.1,
        auraColor: '#ffaa00',
        sparkleType: 'astral_feathers'
    },
    pet_sakura_bunny: {
        id: 'pet_sakura_bunny',
        nameKey: 'pet_sakura_bunny_name',
        descKey: 'pet_sakura_bunny_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ff70a6',
        themeColor: '#ff70a6',
        isFramePet: true,
        iconUrl: 'pet/6091.png',
        totalFrames: 4,
        delayMs: 160,
        renderWidth: 52,
        renderHeight: 52,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#ff70a6',
        sparkleType: 'sakura_sparkles'
    },
    pet_amber_tiger: {
        id: 'pet_amber_tiger',
        nameKey: 'pet_amber_tiger_name',
        descKey: 'pet_amber_tiger_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e09f3e',
        themeColor: '#e09f3e',
        isFramePet: true,
        iconUrl: 'pet/6156.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 54,
        renderHeight: 46,
        followDist: 36,
        speedFactor: 1.05,
        auraColor: '#e09f3e',
        sparkleType: 'amber_sparks'
    },
    pet_silver_nine_tails: {
        id: 'pet_silver_nine_tails',
        nameKey: 'pet_silver_nine_tails_name',
        descKey: 'pet_silver_nine_tails_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e2eafc',
        themeColor: '#e2eafc',
        isFramePet: true,
        iconUrl: 'pet/8771.png',
        totalFrames: 5,
        delayMs: 165,
        renderWidth: 68,
        renderHeight: 42,
        followDist: 40,
        speedFactor: 1.0,
        auraColor: '#e2eafc',
        sparkleType: 'moonlight_shimmer'
    },
    pet_night_sentinel: {
        id: 'pet_night_sentinel',
        nameKey: 'pet_night_sentinel_name',
        descKey: 'pet_night_sentinel_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#3a86ff',
        themeColor: '#3a86ff',
        isFramePet: true,
        iconUrl: 'pet/9711.png',
        totalFrames: 7,
        delayMs: 140,
        renderWidth: 44,
        renderHeight: 52,
        followDist: 36,
        speedFactor: 1.05,
        auraColor: '#3a86ff',
        sparkleType: 'night_feathers'
    },
    pet_blaze_gryphon: {
        id: 'pet_blaze_gryphon',
        nameKey: 'pet_blaze_gryphon_name',
        descKey: 'pet_blaze_gryphon_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f77f00',
        themeColor: '#f77f00',
        isFramePet: true,
        iconUrl: 'pet/12091.png',
        totalFrames: 4,
        delayMs: 155,
        renderWidth: 62,
        renderHeight: 44,
        followDist: 42,
        speedFactor: 1.05,
        auraColor: '#f77f00',
        sparkleType: 'blazing_feathers'
    },
    pet_earth_gryphon: {
        id: 'pet_earth_gryphon',
        nameKey: 'pet_earth_gryphon_name',
        descKey: 'pet_earth_gryphon_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#8c6d48',
        themeColor: '#8c6d48',
        isFramePet: true,
        iconUrl: 'pet/12330.png',
        totalFrames: 3,
        delayMs: 175,
        renderWidth: 62,
        renderHeight: 44,
        followDist: 42,
        speedFactor: 1.0,
        auraColor: '#8c6d48',
        sparkleType: 'stone_dust'
    },
    pet_golden_phoenix: {
        id: 'pet_golden_phoenix',
        nameKey: 'pet_golden_phoenix_name',
        descKey: 'pet_golden_phoenix_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffd166',
        themeColor: '#ffd166',
        isFramePet: true,
        iconUrl: 'pet/12405.png',
        totalFrames: 5,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 60,
        followDist: 38,
        speedFactor: 1.05,
        auraColor: '#ffd166',
        sparkleType: 'phoenix_embers'
    },
    pet_magma_behemoth: {
        id: 'pet_magma_behemoth',
        nameKey: 'pet_magma_behemoth_name',
        descKey: 'pet_magma_behemoth_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#d90429',
        themeColor: '#d90429',
        isFramePet: true,
        iconUrl: 'pet/12552.png',
        totalFrames: 5,
        delayMs: 160,
        renderWidth: 58,
        renderHeight: 62,
        followDist: 44,
        speedFactor: 0.95,
        auraColor: '#d90429',
        sparkleType: 'magma_flames'
    },
    pet_thunder_antler: {
        id: 'pet_thunder_antler',
        nameKey: 'pet_thunder_antler_name',
        descKey: 'pet_thunder_antler_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffb703',
        themeColor: '#ffb703',
        isFramePet: true,
        iconUrl: 'pet/13871.png',
        totalFrames: 6,
        delayMs: 145,
        renderWidth: 46,
        renderHeight: 64,
        followDist: 40,
        speedFactor: 1.05,
        auraColor: '#ffb703',
        sparkleType: 'thunder_bolts'
    },
    pet_solar_pixie: {
        id: 'pet_solar_pixie',
        nameKey: 'pet_solar_pixie_name',
        descKey: 'pet_solar_pixie_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#ffea00',
        themeColor: '#ffea00',
        isFramePet: true,
        iconUrl: 'pet/13956.png',
        totalFrames: 4,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 56,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#ffea00',
        sparkleType: 'solar_glow'
    },
    pet_shadow_wolf: {
        id: 'pet_shadow_wolf',
        nameKey: 'pet_shadow_wolf_name',
        descKey: 'pet_shadow_wolf_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#7b2cbf',
        themeColor: '#7b2cbf',
        isFramePet: true,
        iconUrl: 'pet/14503.png',
        totalFrames: 6,
        delayMs: 140,
        renderWidth: 46,
        renderHeight: 58,
        followDist: 38,
        speedFactor: 1.05,
        auraColor: '#7b2cbf',
        sparkleType: 'shadow_orbs'
    },
    pet_crimson_drake: {
        id: 'pet_crimson_drake',
        nameKey: 'pet_crimson_drake_name',
        descKey: 'pet_crimson_drake_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#e63946',
        themeColor: '#e63946',
        isFramePet: true,
        iconUrl: 'pet/14662.png',
        totalFrames: 5,
        delayMs: 155,
        renderWidth: 56,
        renderHeight: 60,
        followDist: 42,
        speedFactor: 1.05,
        auraColor: '#e63946',
        sparkleType: 'crimson_sparks'
    },
    pet_abyssal_leviathan: {
        id: 'pet_abyssal_leviathan',
        nameKey: 'pet_abyssal_leviathan_name',
        descKey: 'pet_abyssal_leviathan_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#0077b6',
        themeColor: '#0077b6',
        isFramePet: true,
        iconUrl: 'pet/14779.png',
        totalFrames: 6,
        delayMs: 145,
        renderWidth: 64,
        renderHeight: 46,
        followDist: 44,
        speedFactor: 1.0,
        auraColor: '#0077b6',
        sparkleType: 'ocean_bubbles'
    },
    pet_rose_fairy: {
        id: 'pet_rose_fairy',
        nameKey: 'pet_rose_fairy_name',
        descKey: 'pet_rose_fairy_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f72585',
        themeColor: '#f72585',
        isFramePet: true,
        iconUrl: 'pet/14809.png',
        totalFrames: 6,
        delayMs: 140,
        renderWidth: 50,
        renderHeight: 50,
        followDist: 34,
        speedFactor: 1.0,
        auraColor: '#f72585',
        sparkleType: 'rose_glitter'
    },
    pet_mystic_panda: {
        id: 'pet_mystic_panda',
        nameKey: 'pet_mystic_panda_name',
        descKey: 'pet_mystic_panda_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#2ec4b6',
        themeColor: '#2ec4b6',
        isFramePet: true,
        iconUrl: 'pet/14825.png',
        totalFrames: 6,
        delayMs: 150,
        renderWidth: 48,
        renderHeight: 54,
        followDist: 36,
        speedFactor: 1.0,
        auraColor: '#2ec4b6',
        sparkleType: 'bamboo_leaves'
    },
    pet_titan_drake: {
        id: 'pet_titan_drake',
        nameKey: 'pet_titan_drake_name',
        descKey: 'pet_titan_drake_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#d4a373',
        themeColor: '#d4a373',
        isFramePet: true,
        iconUrl: 'pet/16183.png',
        totalFrames: 4,
        delayMs: 180,
        renderWidth: 78,
        renderHeight: 62,
        followDist: 48,
        speedFactor: 0.95,
        auraColor: '#d4a373',
        sparkleType: 'titan_aura'
    },
    pet_frost_leopard: {
        id: 'pet_frost_leopard',
        nameKey: 'pet_frost_leopard_name',
        descKey: 'pet_frost_leopard_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#90e0ef',
        themeColor: '#90e0ef',
        isFramePet: true,
        iconUrl: 'pet/16285.png',
        totalFrames: 5,
        delayMs: 140,
        renderWidth: 60,
        renderHeight: 38,
        followDist: 38,
        speedFactor: 1.1,
        auraColor: '#90e0ef',
        sparkleType: 'frost_wind'
    },
    pet_azure_seraph: {
        id: 'pet_azure_seraph',
        nameKey: 'pet_azure_seraph_name',
        descKey: 'pet_azure_seraph_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#48cae4',
        themeColor: '#0077b6',
        isFramePet: true,
        iconUrl: 'pet/17433.png',
        totalFrames: 7,
        delayMs: 150,
        renderWidth: 76,
        renderHeight: 58,
        followDist: 44,
        speedFactor: 1.05,
        auraColor: '#48cae4',
        sparkleType: 'seraph_feathers'
    },
    pet_solar_kirin: {
        id: 'pet_solar_kirin',
        nameKey: 'pet_solar_kirin_name',
        descKey: 'pet_solar_kirin_desc',
        reqKey: 'unlocked_by_default',
        rarity: 'mythic',
        rarityBorder: '#f77f00',
        themeColor: '#d62828',
        isFramePet: true,
        iconUrl: 'pet/27969.png',
        totalFrames: 4,
        delayMs: 150,
        renderWidth: 60,
        renderHeight: 42,
        followDist: 38,
        speedFactor: 1.05,
        auraColor: '#f77f00',
        sparkleType: 'solar_embers'
    }
};

class GameStateStore {
    constructor() {
        this.STORAGE_KEY = 'tnu_social_hangout_save_v3';
        this.subscribers = new Set();

        // Trạng thái mặc định ban đầu (ĐÃ MỞ KHÓA TOÀN BỘ THEO YÊU CẦU NGƯỜI DÙNG)
        const allWingsKeys = Object.keys(WINGS_REGISTRY);
        const allOutfitsKeys = Object.keys(OUTFITS_DATA);
        const allPetsKeys = Object.keys(PETS_REGISTRY);

        this.state = {
            // 1. Túi đồ (Inventory) - Khởi tạo toàn bộ vật phẩm bằng 0
            inventory: {
                hoa_hong: 0,
                hoa_hong_trang: 0,
                vo_goi_hoa: 0,
                vat_pham_tro_choi: 0,
                bo_hoa_hong: 0,
                hat_giong_hoa_hong: 0,
                nuoc_trong_binh: 0,
                binh_tuoi_dung_tich: 5,

                // Thú Bông Hội Chợ & Arcade
                thu_bong_gau: 0,
                thu_bong_capybara: 0,
                thu_bong_vit: 0,
                thu_bong_meo: 0,
                bo_bong_mini: 0,
                huy_hieu_xa_thu: 0,

                // Đồ Ăn & Thức Uống Hội Chợ
                mi_tron_trung: 0,
                com_canh_ga: 0,
                banh_cupcake: 0,
                khoai_tay_chien: 0,
                burger_bo: 0,
                hop_do_an_vat: 0,
                sua_bo_tuoi: 0,
                pho_mai: 0,

                // Vật Phẩm Chế Tạo & Nhiệm Vụ Đặc Biệt
                hop_banh: 0,
                gio_dung: 0,
                hop_qua_tet: 0,
                gio_qua_am_thuc: 0,
                bua_may_man: 0
            },

            // 2. Tiến trình nhân vật & Tủ đồ (KHỞI ĐẦU CHỈ 3 SKIN, KHÔNG CÁNH, KHÔNG PET)
            progression: {
                ten_nhan_vat: '',
                is_character_created: false,
                diem_thien_cam: 0,
                trang_phuc_so_huu: ['skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden'],
                trang_phuc_hien_tai: 'skin_shaolin_monk',
                canh_so_huu: [],
                canh_hien_tai: null, // Ban đầu KHÔNG trang bị cánh
                pet_so_huu: [],
                pet_hien_tai: null, // Ban đầu KHÔNG trang bị thú cưng
                custom_pet_names: {},
                dau_so_huu: [],
                dau_hien_tai: null,
                kieu_toc_hien_tai: 0, // 0 - 9 kiểu tóc chibi
                mau_toc_hien_tai: '#4a2810',
                tone_da_hien_tai: '#ffe5d9'
            },

            // 3. Hệ thống nhiệm vụ chuẩn chỉnh
            quests: {
                do_an_k45: {
                    id: 'do_an_k45',
                    title: 'Tìm đồ án cho anh sinh viên CNTT',
                    desc: 'Tìm và nhặt đủ 3 trang tài liệu đồ án tốt nghiệp bị rơi cho anh sinh viên CNTT quanh khuôn viên trường.',
                    targetCount: 3,
                    currentCount: 0,
                    status: 'not_started', // not_started, in_progress, can_turn_in, completed
                    rewardCollected: false
                },
                nhiem_vu_gio_qua: {
                    id: 'nhiem_vu_gio_qua',
                    title: 'Chế tạo Hộp Quà May Mắn cho Cô Bếp Trưởng',
                    desc: 'Vào Bàn Chế Tạo [G] làm 1 Hộp Quà Lễ Hội May Mắn (Bánh Cupcake, Khoai tây chiên, Burger bò, Sữa tươi) đem giao cho Cô Bếp Trưởng tại Khu Vui Chơi.',
                    targetItem: 'hop_qua_tet',
                    status: 'not_started', // not_started, in_progress, can_turn_in, completed
                    rewardCollected: false
                },
                qua_tang_giao_vien: {
                    id: 'qua_tang_giao_vien',
                    title: 'Làm quà tặng Thầy Cô',
                    desc: 'Làm quà tặng (Bó hoa hồng, Hộp quà, Giỏ quà) tại [G], tặng từng Thầy Cô CNTT nhận Thiện Cảm. Cứ tiếp tục tặng như vậy, khi Thiện Cảm đạt 100 sẽ MỞ KHÓA TẤT CẢ TRANG PHỤC!',
                    targetAffection: 100,
                    status: 'in_progress',
                    isRepeatable: true
                },
                tam_thu_uoc_nguyen: {
                    id: 'tam_thu_uoc_nguyen',
                    title: 'Viết tâm thư ở Bảng Ước Nguyện',
                    desc: 'Đến Bảng Ước Nguyện trước Tòa Nhà Điều Hành, viết tâm thư tri ân Thầy Cô giáo để MỞ KHÓA TOÀN BỘ THÚ CƯNG (PET)!',
                    status: 'not_started'
                },
                chat_chuc_mung_20_11: {
                    id: 'chat_chuc_mung_20_11',
                    title: 'Chat Chúc Mừng 20/11 Mở Khóa Cánh',
                    desc: 'Gửi tin nhắn: "Chúc mừng ngày nhà giáo Việt Nam 20/11" vào khung chat để hoàn thành nhiệm vụ và MỞ KHÓA TẤT CẢ CÁNH BAY!',
                    status: 'not_started'
                },
                kham_pha_nha_2: {
                    id: 'kham_pha_nha_2',
                    title: 'Khám phá Nhà số 2',
                    desc: 'Ghé thăm khu thực nghiệm nông nghiệp Nhà số 2.',
                    status: 'not_started'
                },
                ho_sinh_thai_nha_7: {
                    id: 'ho_sinh_thai_nha_7',
                    title: 'Dạo bước Hồ Sinh Thái',
                    desc: 'Đi qua cầu gỗ hồ sinh thái và ghé Thư viện Nhà 7.',
                    status: 'not_started'
                },
                chay_san_van_dong: {
                    id: 'chay_san_van_dong',
                    title: 'Chạy Sân Vận Động',
                    desc: 'Chạy một vòng quanh đường pitch sân vận động.',
                    currentStep: 0,
                    targetStep: 4,
                    status: 'not_started'
                }
            },
            activeQuestId: 'do_an_k45',

            // 4. Thống kê & Thành tựu
            stats: {
                clawWins: 0,
                shootingHighScore: 0,
                rosesHarvested: 0,
                whiteRosesHarvested: 0,
                bouquetsCrafted: 0,
                giftsGiven: 0
            },

            // 5. Thế giới trò chơi
            currentMapId: 'map1_tnu',
            pickedCampusItems: [],
            isMuted: false,
            showJoystick: true
        };

        // Nạp dữ liệu đã lưu nếu có
        this.loadFromStorage();
    }

    // Truy xuất State hiện tại
    getState() {
        return this.state;
    }

    // Cập nhật State theo phương thức Zustand (Partial state merge + Notify)
    setState(updater) {
        const nextState = typeof updater === 'function' ? updater(this.state) : updater;
        this.state = {
            ...this.state,
            ...nextState
        };
        
        // Tự động gỡ trang bị nếu cánh hiện tại nằm trong danh sách cánh đã xóa
        if (this.state.progression.canh_hien_tai && !WINGS_REGISTRY[this.state.progression.canh_hien_tai]) {
            this.state.progression.canh_hien_tai = null;
        }
        this.saveToStorage();
        this.notify();
    }

    // Đăng ký nhận thông báo thay đổi (Zustand subscribe pattern)
    subscribe(listener) {
        this.subscribers.add(listener);
        return () => this.subscribers.delete(listener);
    }

    notify() {
        this.subscribers.forEach(listener => {
            try {
                listener(this.state);
            } catch (err) {
                console.error('State subscriber error:', err);
            }
        });

        // Tự động đồng bộ hóa ngoại hình & trang phục tới máy chủ trực tuyến
        if (window.networkManager && window.networkManager.isConnected && this.state.progression) {
            window.networkManager.sendProfile({
                name: this.state.progression.ten_nhan_vat,
                outfitId: this.state.progression.trang_phuc_hien_tai,
                wingId: this.state.progression.canh_hien_tai,
                petId: this.state.progression.pet_hien_tai,
                hairStyle: this.state.progression.kieu_toc_hien_tai,
                hairColor: this.state.progression.mau_toc_hien_tai,
                skinTone: this.state.progression.tone_da_hien_tai
            });
        }
    }

    // Lưu vào LocalStorage
    saveToStorage() {
        try {
            const dataToSave = {
                inventory: this.state.inventory,
                progression: this.state.progression,
                quests: this.state.quests,
                activeQuestId: this.state.activeQuestId,
                stats: this.state.stats,
                isMuted: this.state.isMuted
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (e) {
            console.warn('Cannot write to localStorage:', e);
        }
    }

    // Nạp từ LocalStorage
    loadFromStorage() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.inventory) {
                    if (parsed.progression && parsed.progression.is_character_created === false) {
                        // Nếu chưa hoàn tất tạo nhân vật thì túi đồ bắt buộc phải là 0
                        this.resetInventory();
                    } else {
                        this.state.inventory = { ...this.state.inventory, ...parsed.inventory };
                    }
                }
                if (parsed.progression) {
                    this.state.progression = { ...this.state.progression, ...parsed.progression };
                    this.state.progression.custom_pet_names = this.state.progression.custom_pet_names || {};
                }
                if (parsed.quests) this.state.quests = { ...this.state.quests, ...parsed.quests };
                if (parsed.activeQuestId && this.state.quests[parsed.activeQuestId]) this.state.activeQuestId = parsed.activeQuestId;
                if (parsed.stats) this.state.stats = { ...this.state.stats, ...parsed.stats };
                if (parsed.isMuted !== undefined) this.state.isMuted = parsed.isMuted;
            }
        } catch (e) {
            console.warn('Cannot parse localStorage data:', e);
        }

        // Đảm bảo tên và mô tả các nhiệm vụ chuẩn xác theo cơ chế game
        if (this.state.quests) {
            if (this.state.quests.do_an_k45) {
                this.state.quests.do_an_k45.title = 'Tìm đồ án cho anh sinh viên CNTT';
                this.state.quests.do_an_k45.desc = 'Tìm và nhặt đủ 3 trang tài liệu đồ án tốt nghiệp bị rơi cho anh sinh viên CNTT quanh khuôn viên trường.';
                this.state.quests.do_an_k45.targetCount = 3;
            }

            if (!this.state.quests.nhiem_vu_gio_qua) {
                this.state.quests.nhiem_vu_gio_qua = {
                    id: 'nhiem_vu_gio_qua',
                    title: 'Chế tạo Hộp Quà May Mắn cho Cô Bếp Trưởng',
                    desc: 'Vào Bàn Chế Tạo [G] làm 1 Hộp Quà Lễ Hội May Mắn (Bánh Cupcake, Khoai tây chiên, Burger bò, Sữa tươi) đem giao cho Cô Bếp Trưởng tại Khu Vui Chơi.',
                    targetItem: 'hop_qua_tet',
                    status: 'not_started',
                    rewardCollected: false
                };
            } else {
                this.state.quests.nhiem_vu_gio_qua.title = 'Chế tạo Hộp Quà May Mắn cho Cô Bếp Trưởng';
                this.state.quests.nhiem_vu_gio_qua.desc = 'Vào Bàn Chế Tạo [G] làm 1 Hộp Quà Lễ Hội May Mắn (Bánh Cupcake, Khoai tây chiên, Burger bò, Sữa tươi) đem giao cho Cô Bếp Trưởng tại Khu Vui Chơi.';
                this.state.quests.nhiem_vu_gio_qua.targetItem = 'hop_qua_tet';
            }

            if (!this.state.quests.qua_tang_giao_vien) {
                this.state.quests.qua_tang_giao_vien = {
                    id: 'qua_tang_giao_vien',
                    title: 'Làm quà tặng Thầy Cô',
                    desc: 'Làm quà tặng (Bó hoa hồng, Hộp quà, Giỏ quà) tại [G], tặng từng Thầy Cô CNTT nhận Thiện Cảm. Cứ tiếp tục tặng như vậy, khi Thiện Cảm đạt 100 sẽ MỞ KHÓA TẤT CẢ TRANG PHỤC!',
                    targetAffection: 100,
                    status: 'in_progress',
                    isRepeatable: true
                };
            }

            if (!this.state.quests.tam_thu_uoc_nguyen) {
                this.state.quests.tam_thu_uoc_nguyen = {
                    id: 'tam_thu_uoc_nguyen',
                    title: 'Viết tâm thư ở Bảng Ước Nguyện',
                    desc: 'Đến Bảng Ước Nguyện trước Tòa Nhà Điều Hành, viết tâm thư tri ân Thầy Cô giáo để MỞ KHÓA TOÀN BỘ THÚ CƯNG (PET)!',
                    status: 'not_started'
                };
            }

            if (!this.state.quests.chat_chuc_mung_20_11) {
                this.state.quests.chat_chuc_mung_20_11 = {
                    id: 'chat_chuc_mung_20_11',
                    title: 'Chat Chúc Mừng 20/11 Mở Khóa Cánh',
                    desc: 'Gửi tin nhắn: "Chúc mừng ngày nhà giáo Việt Nam 20/11" vào khung chat để hoàn thành nhiệm vụ và MỞ KHÓA TẤT CẢ CÁNH BAY!',
                    status: 'not_started'
                };
            }
        }

        // Đảm bảo các item mới có trong inventory
        const defaultNewItems = {
            hop_banh: 0,
            mi_tron_trung: 1,
            com_canh_ga: 1,
            gio_dung: 0,
            hop_qua_tet: 0,
            gio_qua_am_thuc: 0
        };
        for (const k in defaultNewItems) {
            if (this.state.inventory[k] === undefined) {
                this.state.inventory[k] = defaultNewItems[k];
            }
        }

        // Khởi tạo & đảm bảo 3 skin đặc quyền ban đầu
        const starterSkins = ['skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden'];
        if (!this.state.progression.trang_phuc_so_huu || !Array.isArray(this.state.progression.trang_phuc_so_huu) || this.state.progression.trang_phuc_so_huu.length === 0) {
            this.state.progression.trang_phuc_so_huu = [...starterSkins];
        } else {
            starterSkins.forEach(sk => {
                if (!this.state.progression.trang_phuc_so_huu.includes(sk)) {
                    this.state.progression.trang_phuc_so_huu.push(sk);
                }
            });
        }

        // Nếu chưa hoàn tất tạo nhân vật hoặc nhân vật mới: không cho cánh, không cho pet
        if (!this.state.progression.is_character_created) {
            this.state.progression.ten_nhan_vat = this.state.progression.ten_nhan_vat || '';
            this.state.progression.canh_hien_tai = null;
            this.state.progression.canh_so_huu = [];
            this.state.progression.pet_hien_tai = null;
            this.state.progression.pet_so_huu = [];
            if (!starterSkins.includes(this.state.progression.trang_phuc_hien_tai)) {
                this.state.progression.trang_phuc_hien_tai = 'skin_shaolin_monk';
            }
        }

        this.checkAllUnlocks();
    }

    // ==========================================
    // CÁC HÀNH ĐỘNG THAO TÁC STATE (STORE ACTIONS)
    // ==========================================

    // Đặt nhiệm vụ đang chọn để theo dõi
    setActiveQuest(questId) {
        if (this.state.quests && this.state.quests[questId]) {
            this.state.activeQuestId = questId;
            this.saveToStorage();
            this.notify();
        }
    }

    // Thêm vật phẩm vào túi
    addItem(itemKey, amount = 1) {
        const currentCount = (this.state.inventory && typeof this.state.inventory[itemKey] === 'number') 
            ? this.state.inventory[itemKey] 
            : 0;
        this.setState(s => ({
            inventory: {
                ...s.inventory,
                [itemKey]: Math.max(0, currentCount + amount)
            }
        }));
        if (itemKey === 'hoa_hong') {
            this.updateStats('rosesHarvested', amount);
        } else if (itemKey === 'hoa_hong_trang') {
            this.updateStats('whiteRosesHarvested', amount);
        }
        this.checkAllUnlocks();
        return true;
    }

    // Trừ vật phẩm túi đồ
    removeItem(itemKey, amount = 1) {
        if (this.state.inventory.hasOwnProperty(itemKey) && this.state.inventory[itemKey] >= amount) {
            this.setState(s => ({
                inventory: {
                    ...s.inventory,
                    [itemKey]: s.inventory[itemKey] - amount
                }
            }));
            return true;
        }
        return false;
    }

    // Kiểm tra túi đồ
    hasItem(itemKey, amount = 1) {
        return (this.state.inventory[itemKey] || 0) >= amount;
    }

    // Tăng điểm thiện cảm
    addAffection(points) {
        const oldPoints = this.state.progression.diem_thien_cam;
        const newPoints = Math.min(100, oldPoints + points);
        
        this.setState(s => ({
            progression: {
                ...s.progression,
                diem_thien_cam: newPoints
            }
        }));

        this.checkAllUnlocks();
        return {
            current: newPoints,
            justReached100: oldPoints < 100 && newPoints >= 100
        };
    }

    // Cập nhật thống kê
    updateStats(key, amount) {
        this.setState(s => ({
            stats: {
                ...s.stats,
                [key]: (s.stats[key] || 0) + amount
            }
        }));
        this.checkAllUnlocks();
    }

    // Kiểm tra và tự động mở khóa các cánh & trang phục
    checkAllUnlocks() {
        const state = this.state;
        const unlockedWings = new Set(state.progression.canh_so_huu || []);
        const unlockedOutfits = new Set(state.progression.trang_phuc_so_huu || ['dong_phuc_tnu']);
        let newlyUnlocked = [];

        // 1. Cánh Tiên: Hái 10 Hoa Hồng
        if (state.stats.rosesHarvested >= 10 && !unlockedWings.has('wing_fairy')) {
            unlockedWings.add('wing_fairy');
            newlyUnlocked.push({ type: 'wing', id: 'wing_fairy', name: 'Cánh Tiên Lam Ngọc' });
        }

        // 2. Cánh Thiên Thần: 100 Điểm Thiện Cảm
        if (state.progression.diem_thien_cam >= 100 && !unlockedWings.has('wing_angel')) {
            unlockedWings.add('wing_angel');
            newlyUnlocked.push({ type: 'wing', id: 'wing_angel', name: 'Cánh Thiên Thần Ánh Kim' });
        }

        // ĐẶC BIỆT THEO YÊU CẦU: Thiện cảm đạt 100 thì MỞ KHÓA TẤT CẢ TRANG PHỤC!
        if (state.progression.diem_thien_cam >= 100) {
            const allOutfitsList = [
                'skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden',
                'outfit_frieren', 'outfit_videl_noel', 'outfit_prince_warrior', 'outfit_goddess_blonde',
                'skin_naruto', 'skin_blue_knight', 'skin_doraemon', 'skin_purple_cap', 'skin_fairy_crimson',
                'body_1', 'body_2', 'body_3', 'body_4', 'body_5', 'body_1000',
                'dong_phuc_tnu', 'ao_dai', 'ao_blouse', 'le_phuc_cu_nhan', 'tho_cam_tay_nguyen'
            ];
            if (window.bodySQLDB && window.bodySQLDB.tables && window.bodySQLDB.tables.body_templates) {
                window.bodySQLDB.tables.body_templates.forEach(t => allOutfitsList.push(t.body_id));
            }
            if (window.OUTFITS_DATA) {
                Object.keys(window.OUTFITS_DATA).forEach(k => allOutfitsList.push(k));
            }

            let hasNewOutfit = false;
            allOutfitsList.forEach(id => {
                if (!unlockedOutfits.has(id)) {
                    unlockedOutfits.add(id);
                    hasNewOutfit = true;
                }
            });

            if (hasNewOutfit) {
                newlyUnlocked.push({ type: 'outfit_all', id: 'all_outfits', name: '👑 TOÀN BỘ BỘ SƯU TẬP TRANG PHỤC TNU' });
            }
        }

        // ĐẶC BIỆT THEO YÊU CẦU: Nhiệm vụ viết tâm thư ở bảng ước nguyện cho giáo viên sẽ MỞ KHÓA PET
        const unlockedPets = new Set(state.progression.pet_so_huu || []);
        if (state.quests.tam_thu_uoc_nguyen && state.quests.tam_thu_uoc_nguyen.status === 'completed') {
            const allPetsList = [];
            if (window.petSQLDB && window.petSQLDB.tables && window.petSQLDB.tables.pet_templates) {
                window.petSQLDB.tables.pet_templates.forEach(p => allPetsList.push(p.pet_id));
            }
            if (window.PETS_REGISTRY) {
                Object.keys(window.PETS_REGISTRY).forEach(k => allPetsList.push(k));
            }
            if (allPetsList.length === 0) {
                allPetsList.push('pet_golden_fox', 'pet_fire_kirin', 'pet_black_dragon', 'pet_snow_nine_tails');
            }

            let hasNewPet = false;
            allPetsList.forEach(pid => {
                if (!unlockedPets.has(pid)) {
                    unlockedPets.add(pid);
                    hasNewPet = true;
                }
            });

            if (hasNewPet) {
                newlyUnlocked.push({ type: 'pet_all', id: 'all_pets', name: '🐾 TOÀN BỘ 35+ THẦN THÚ ĐỒNG HÀNH (PET)' });
            }
        }

        // ĐẶC BIỆT THEO YÊU CẦU: Nhiệm vụ chat Chúc mừng ngày nhà giáo Việt Nam 20/11 sẽ MỞ KHÓA TẤT CẢ CÁNH
        if (state.quests.chat_chuc_mung_20_11 && state.quests.chat_chuc_mung_20_11.status === 'completed') {
            const allWingsList = [
                'wing_cyber_hex', 'wing_pink_angel', 'wing_chaos_angel', 'wing_azure_dragon',
                'wing_golden_solar', 'wing_crimson_blaze', 'wing_void_amethyst', 'wing_silver_seraph',
                'wing_fairy', 'wing_angel', 'wing_bat', 'wing_butterfly', 'wing_leaf', 'wing_cloud',
                'wing_flame', 'wing_crystal', 'wing_star', 'wing_dragon'
            ];
            if (window.wingSQLDB && window.wingSQLDB.tables && window.wingSQLDB.tables.wing_templates) {
                window.wingSQLDB.tables.wing_templates.forEach(t => allWingsList.push(t.wing_id));
            }
            if (window.WINGS_REGISTRY) {
                Object.keys(window.WINGS_REGISTRY).forEach(k => allWingsList.push(k));
            }

            let hasNewWing = false;
            allWingsList.forEach(wid => {
                if (!unlockedWings.has(wid)) {
                    unlockedWings.add(wid);
                    hasNewWing = true;
                }
            });

            if (hasNewWing) {
                newlyUnlocked.push({ type: 'wing_all', id: 'all_wings', name: '🪽 TOÀN BỘ BỘ SƯU TẬP 10+ CÁNH BAY' });
                if (!state.progression.canh_hien_tai && unlockedWings.size > 0) {
                    state.progression.canh_hien_tai = 'wing_pink_angel';
                }
            }
        }

        // 3. Cánh Dơi: Điểm bắn súng >= 80
        if (state.stats.shootingHighScore >= 80 && !unlockedWings.has('wing_bat')) {
            unlockedWings.add('wing_bat');
            newlyUnlocked.push({ type: 'wing', id: 'wing_bat', name: 'Cánh Dơi Huyền Bí' });
        }

        // 4. Cánh Bướm: Hái được Hoa Hồng Trắng hiếm
        if (state.stats.whiteRosesHarvested >= 1 && !unlockedWings.has('wing_butterfly')) {
            unlockedWings.add('wing_butterfly');
            newlyUnlocked.push({ type: 'wing', id: 'wing_butterfly', name: 'Cánh Bướm Hồng Phấn' });
        }

        // 5. Cánh Lá Non: Khám phá Nhà số 2
        if (state.quests.kham_pha_nha_2 && state.quests.kham_pha_nha_2.status === 'completed' && !unlockedWings.has('wing_leaf')) {
            unlockedWings.add('wing_leaf');
            newlyUnlocked.push({ type: 'wing', id: 'wing_leaf', name: 'Cánh Lá Non Sinh Thái' });
        }

        // 6. Cánh Mây: Dạo bước Hồ Sinh Thái
        if (state.quests.ho_sinh_thai_nha_7 && state.quests.ho_sinh_thai_nha_7.status === 'completed' && !unlockedWings.has('wing_cloud')) {
            unlockedWings.add('wing_cloud');
            newlyUnlocked.push({ type: 'wing', id: 'wing_cloud', name: 'Cánh Mây Bồng Bềnh' });
        }

        // 7. Cánh Lửa: Thắng gắp thú >= 3 lần
        if (state.stats.clawWins >= 3 && !unlockedWings.has('wing_flame')) {
            unlockedWings.add('wing_flame');
            newlyUnlocked.push({ type: 'wing', id: 'wing_flame', name: 'Cánh Lửa Phượng Hoàng' });
        }

        // 8. Cánh Băng: Giúp SV K45 hoàn thành đồ án
        if (state.quests.do_an_k45 && state.quests.do_an_k45.status === 'completed' && !unlockedWings.has('wing_crystal')) {
            unlockedWings.add('wing_crystal');
            newlyUnlocked.push({ type: 'wing', id: 'wing_crystal', name: 'Cánh Băng Pha Lê' });
        }

        // 9. Cánh Sao Băng: Chạy quanh Sân vận động
        if (state.quests.chay_san_van_dong && state.quests.chay_san_van_dong.status === 'completed' && !unlockedWings.has('wing_star')) {
            unlockedWings.add('wing_star');
            newlyUnlocked.push({ type: 'wing', id: 'wing_star', name: 'Cánh Sao Băng Vũ Trụ' });
        }

        // 10. Cánh Rồng: Hoàn thành mọi nhiệm vụ + 100 thiện cảm
        const allQuestsDone = state.quests.do_an_k45 && state.quests.do_an_k45.status === 'completed' &&
                              state.quests.kham_pha_nha_2 && state.quests.kham_pha_nha_2.status === 'completed' &&
                              state.quests.ho_sinh_thai_nha_7 && state.quests.ho_sinh_thai_nha_7.status === 'completed';
        if (allQuestsDone && state.progression.diem_thien_cam >= 100 && !unlockedWings.has('wing_dragon')) {
            unlockedWings.add('wing_dragon');
            newlyUnlocked.push({ type: 'wing', id: 'wing_dragon', name: 'Cánh Rồng Lục Bảo' });
        }

        if (newlyUnlocked.length > 0) {
            this.setState(s => ({
                progression: {
                    ...s.progression,
                    canh_so_huu: Array.from(unlockedWings),
                    trang_phuc_so_huu: Array.from(new Set([...(s.progression.trang_phuc_so_huu || []), ...unlockedOutfits])),
                    pet_so_huu: Array.from(new Set([...(s.progression.pet_so_huu || []), ...unlockedPets])),
                    pet_hien_tai: s.progression.pet_hien_tai
                }
            }));

            // Bắn thông báo mở khóa cho người chơi
            if (window.uiManager && typeof window.uiManager.showUnlockCelebration === 'function') {
                newlyUnlocked.forEach(item => window.uiManager.showUnlockCelebration(item));
            }
        }
    }

    // Mở khóa toàn bộ tủ đồ trang phục (Khi đạt 100 điểm thiện cảm)
    unlockAllOutfits() {
        const allOutfits = new Set(this.state.progression.trang_phuc_so_huu || []);
        const defaultSkins = [
            'skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden',
            'outfit_frieren', 'outfit_videl_noel', 'outfit_prince_warrior', 'outfit_goddess_blonde',
            'skin_naruto', 'skin_blue_knight', 'skin_doraemon', 'skin_purple_cap', 'skin_fairy_crimson',
            'body_1', 'body_2', 'body_3', 'body_4', 'body_5', 'body_1000',
            'dong_phuc_tnu', 'ao_dai', 'ao_blouse', 'le_phuc_cu_nhan', 'tho_cam_tay_nguyen'
        ];
        defaultSkins.forEach(s => allOutfits.add(s));

        if (window.bodySQLDB && window.bodySQLDB.tables && window.bodySQLDB.tables.body_templates) {
            window.bodySQLDB.tables.body_templates.forEach(t => allOutfits.add(t.body_id));
        }
        if (window.OUTFITS_DATA) {
            Object.keys(window.OUTFITS_DATA).forEach(k => allOutfits.add(k));
        }

        this.setState(s => ({
            progression: {
                ...s.progression,
                trang_phuc_so_huu: Array.from(allOutfits)
            }
        }));
        this.saveToStorage();
        if (window.uiManager && typeof window.uiManager.showCelebrationBanner === 'function') {
            window.uiManager.showCelebrationBanner('👑 ĐẠT 100 THIỆN CẢM!', 'Chúc mừng bạn! Toàn bộ trang phục trong Tủ Đồ đã được mở khóa vĩnh viễn!');
        }
    }

    // Mở khóa toàn bộ thú cưng Pet (Khi hoàn thành viết tâm thư ở Bảng Ước Nguyện)
    unlockAllPets() {
        const allPets = new Set(this.state.progression.pet_so_huu || []);
        if (window.petSQLDB && window.petSQLDB.tables && window.petSQLDB.tables.pet_templates) {
            window.petSQLDB.tables.pet_templates.forEach(p => allPets.add(p.pet_id));
        }
        if (window.PETS_REGISTRY) {
            Object.keys(window.PETS_REGISTRY).forEach(k => allPets.add(k));
        }
        if (allPets.size === 0) {
            allPets.add('pet_golden_fox');
            allPets.add('pet_fire_kirin');
            allPets.add('pet_black_dragon');
        }

        const petArr = Array.from(allPets);
        this.setState(s => ({
            quests: {
                ...s.quests,
                tam_thu_uoc_nguyen: {
                    ...(s.quests.tam_thu_uoc_nguyen || {}),
                    status: 'completed',
                    completedAt: Date.now()
                }
            },
            progression: {
                ...s.progression,
                pet_so_huu: petArr,
                pet_hien_tai: s.progression.pet_hien_tai
            }
        }));
        this.saveToStorage();

        if (window.uiManager && typeof window.uiManager.showCelebrationBanner === 'function') {
            window.uiManager.showCelebrationBanner('🐾 ĐÃ MỞ KHÓA TẤT CẢ THẦN THÚ PET!', 'Bức tâm thư tri ân Thầy Cô của bạn đã mở khóa toàn bộ 35+ Thú Cưng Đồng Hành!');
        }
        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }
    }

    // Mở khóa toàn bộ cánh (Khi hoàn thành nhiệm vụ chat Chúc mừng ngày nhà giáo Việt Nam 20/11)
    unlockAllWings() {
        const allWings = new Set(this.state.progression.canh_so_huu || []);
        const defaultWings = [
            'wing_cyber_hex', 'wing_pink_angel', 'wing_chaos_angel', 'wing_azure_dragon',
            'wing_golden_solar', 'wing_crimson_blaze', 'wing_void_amethyst', 'wing_silver_seraph',
            'wing_fairy', 'wing_angel', 'wing_bat', 'wing_butterfly', 'wing_leaf', 'wing_cloud',
            'wing_flame', 'wing_crystal', 'wing_star', 'wing_dragon'
        ];
        defaultWings.forEach(w => allWings.add(w));

        if (window.wingSQLDB && window.wingSQLDB.tables && window.wingSQLDB.tables.wing_templates) {
            window.wingSQLDB.tables.wing_templates.forEach(t => allWings.add(t.wing_id));
        }
        if (window.WINGS_REGISTRY) {
            Object.keys(window.WINGS_REGISTRY).forEach(k => allWings.add(k));
        }

        const wingsArr = Array.from(allWings);
        this.setState(s => ({
            quests: {
                ...s.quests,
                chat_chuc_mung_20_11: {
                    ...(s.quests.chat_chuc_mung_20_11 || {}),
                    status: 'completed',
                    completedAt: Date.now()
                }
            },
            progression: {
                ...s.progression,
                canh_so_huu: wingsArr,
                canh_hien_tai: s.progression.canh_hien_tai || 'wing_pink_angel'
            }
        }));
        this.saveToStorage();

        if (window.uiManager && typeof window.uiManager.showCelebrationBanner === 'function') {
            window.uiManager.showCelebrationBanner('🪽 ĐÃ MỞ KHÓA TẤT CẢ CÁNH BAY!', 'Chúc mừng bạn! Lời chúc 20/11 đã mở khóa toàn bộ 10+ Cánh Bay Thần Thoại!');
        }
        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }
    }

    // Đặt lại toàn bộ vật phẩm trong túi đồ về 0
    resetInventory() {
        const zeroInventory = {
            hoa_hong: 0,
            hoa_hong_trang: 0,
            vo_goi_hoa: 0,
            vat_pham_tro_choi: 0,
            bo_hoa_hong: 0,
            hat_giong_hoa_hong: 0,
            nuoc_trong_binh: 0,
            binh_tuoi_dung_tich: 5,

            // Thú Bông Hội Chợ & Arcade
            thu_bong_gau: 0,
            thu_bong_capybara: 0,
            thu_bong_vit: 0,
            thu_bong_meo: 0,
            bo_bong_mini: 0,
            huy_hieu_xa_thu: 0,

            // Đồ Ăn & Thức Uống Hội Chợ
            mi_tron_trung: 0,
            com_canh_ga: 0,
            banh_cupcake: 0,
            khoai_tay_chien: 0,
            burger_bo: 0,
            hop_do_an_vat: 0,
            sua_bo_tuoi: 0,
            pho_mai: 0,

            // Vật Phẩm Chế Tạo & Nhiệm Vụ Đặc Biệt
            hop_banh: 0,
            gio_dung: 0,
            hop_qua_tet: 0,
            gio_qua_am_thuc: 0,
            bua_may_man: 0
        };
        if (this.state && this.state.inventory) {
            for (const k in this.state.inventory) {
                if (k !== 'binh_tuoi_dung_tich') zeroInventory[k] = 0;
            }
        }
        this.setState({ inventory: zeroInventory });
        return zeroInventory;
    }

    // Thiết lập hồ sơ nhân vật (Tên & Skin) - Khởi tạo toàn bộ vật phẩm trong túi bằng 0
    setCharacterProfile(name, outfitId) {
        const cleanName = (name || '').trim();
        const starterSkins = ['skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden'];
        const chosenSkin = starterSkins.includes(outfitId) ? outfitId : 'skin_shaolin_monk';

        // Đảm bảo tất cả vật phẩm trong túi đều bằng 0 khi tạo nhân vật
        const zeroInventory = this.resetInventory();

        this.setState(s => ({
            inventory: zeroInventory,
            progression: {
                ...s.progression,
                ten_nhan_vat: cleanName,
                trang_phuc_hien_tai: chosenSkin,
                trang_phuc_so_huu: Array.from(new Set([...(s.progression.trang_phuc_so_huu || []), ...starterSkins])),
                canh_hien_tai: null, // Ban đầu KHÔNG cánh
                canh_so_huu: s.progression.canh_so_huu || [],
                pet_hien_tai: null, // Ban đầu KHÔNG pet
                pet_so_huu: s.progression.pet_so_huu || [],
                is_character_created: true
            }
        }));

        if (window.gameInstance && window.gameInstance.player) {
            window.gameInstance.player.name = cleanName;
        }

        if (window.uiManager) {
            if (typeof window.uiManager.updateHUD === 'function') {
                window.uiManager.updateHUD();
            } else if (typeof window.uiManager.updateHud === 'function') {
                window.uiManager.updateHud();
            }
        }
        return true;
    }

    // Đổi cánh
    equipWing(wingId) {
        if (!wingId) {
            this.setState(s => ({
                progression: { ...s.progression, canh_hien_tai: null }
            }));
            return true;
        }
        if (this.state.progression.canh_so_huu && this.state.progression.canh_so_huu.includes(wingId)) {
            this.setState(s => ({
                progression: { ...s.progression, canh_hien_tai: wingId }
            }));
            return true;
        }
        return false;
    }

    // Đổi thú cưng đi theo
    equipPet(petId) {
        if (!petId) {
            this.setState(s => ({
                progression: { ...s.progression, pet_hien_tai: null }
            }));
            return true;
        }
        if (this.state.progression.pet_so_huu && this.state.progression.pet_so_huu.includes(petId)) {
            this.setState(s => ({
                progression: { ...s.progression, pet_hien_tai: petId }
            }));
            return true;
        }
        return false;
    }

    // Tự đặt tên cho thú cưng
    setCustomPetName(petId, name) {
        if (!petId) return false;
        const trimmed = (name || '').trim();
        this.setState(s => {
            const customNames = { ...(s.progression.custom_pet_names || {}) };
            if (!trimmed) {
                delete customNames[petId];
            } else {
                customNames[petId] = trimmed;
            }
            return {
                progression: {
                    ...s.progression,
                    custom_pet_names: customNames
                }
            };
        });
        return true;
    }

    // Lấy tên hiển thị của thú cưng (Ưu tiên tên tự đặt)
    getPetDisplayName(petId) {
        if (!petId) return '';
        const custom = this.state.progression && this.state.progression.custom_pet_names && this.state.progression.custom_pet_names[petId];
        if (custom) return custom;
        const registry = window.PETS_REGISTRY || {};
        const pet = registry[petId];
        if (pet && pet.nameKey && window.i18n) {
            return window.i18n.t(pet.nameKey);
        }
        if (window.petSQLDB) {
            const tmpl = window.petSQLDB.getPetTemplate(petId);
            if (tmpl && tmpl.name) return tmpl.name;
        }
        return petId;
    }

    // Đổi trang phục hoàn chỉnh (Đồng bộ cả thân người và đầu trong lockstep)
    equipOutfit(outfitId) {
        const resolved = (window.bodySQLDB && window.bodySQLDB.resolveOutfitId(outfitId)) || outfitId;
        const isFrame = (window.bodySQLDB && window.bodySQLDB.isFrameBody(resolved)) || (window.OUTFITS_DATA[resolved] && window.OUTFITS_DATA[resolved].isFrameBody);
        const headMapping = {
            'outfit_frieren': 'head_elf_silver',
            'outfit_videl_noel': 'head_videl',
            'outfit_prince_warrior': 'head_crown_prince',
            'outfit_goddess_blonde': 'head_blonde_ribbon'
        };
        const matchingHead = isFrame ? null : (headMapping[resolved] || 'head_elf_silver');

        this.setState(s => ({
            progression: { 
                ...s.progression, 
                trang_phuc_hien_tai: resolved,
                dau_hien_tai: matchingHead
            }
        }));
        return true;
    }

    // Đổi kiểu đầu frame
    equipHead(headId) {
        this.setState(s => ({
            progression: { ...s.progression, dau_hien_tai: headId }
        }));
    }

    // Đổi kiểu tóc
    setHairStyle(hairIndex) {
        this.setState(s => ({
            progression: { ...s.progression, kieu_toc_hien_tai: hairIndex }
        }));
    }

    // Đổi màu tóc
    setHairColor(colorHex) {
        this.setState(s => ({
            progression: { ...s.progression, mau_toc_hien_tai: colorHex }
        }));
    }

    // Đổi tone da
    setSkinTone(toneHex) {
        this.setState(s => ({
            progression: { ...s.progression, tone_da_hien_tai: toneHex }
        }));
    }
}

// Khởi tạo instance toàn cục tương thích Zustand
window.useGameStore = new GameStateStore();
// Giữ alias tương thích ngược với code cũ
window.gameState = {
    get inventory() { return window.useGameStore.state.inventory; },
    get progression() { return window.useGameStore.state.progression; },
    get quest() { return window.useGameStore.state.quests.do_an_k45; },
    get currentMapId() { return window.useGameStore.state.currentMapId; },
    set currentMapId(val) { window.useGameStore.setState({ currentMapId: val }); },
    subscribe(cb) { return window.useGameStore.subscribe(cb); },
    addItem(k, a) { return window.useGameStore.addItem(k, a); },
    removeItem(k, a) { return window.useGameStore.removeItem(k, a); },
    hasItem(k, a) { return window.useGameStore.hasItem(k, a); },
    addAffection(p) { return window.useGameStore.addAffection(p); },
    unlockAllOutfits() { return window.useGameStore.unlockAllOutfits(); },
    unlockAllPets() { return window.useGameStore.unlockAllPets(); },
    setCustomPetName(petId, name) { return window.useGameStore.setCustomPetName(petId, name); },
    getPetDisplayName(petId) { return window.useGameStore.getPetDisplayName(petId); },
    unlockAllWings() { return window.useGameStore.unlockAllWings(); },
    setOutfit(id) { return window.useGameStore.equipOutfit(id); },
    unlockOutfit(id) {
        const s = window.useGameStore.state.progression.trang_phuc_so_huu;
        if (!s.includes(id)) {
            window.useGameStore.setState(prev => ({
                progression: { ...prev.progression, trang_phuc_so_huu: [...s, id] }
            }));
        }
    },
    saveToStorage() { window.useGameStore.saveToStorage(); }
};
window.WINGS_REGISTRY = WINGS_REGISTRY;
window.PETS_REGISTRY = PETS_REGISTRY;
window.OUTFITS_DATA = OUTFITS_DATA;
