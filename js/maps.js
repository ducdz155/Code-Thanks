/**
 * MAP ARCHITECTURE - ĐẠI HỌC TÂY NGUYÊN (TNU)
 * CẬP NHẬT CHUẨN XÁC 100% THEO HÌNH ẢNH VECTOR MASTER MAP ĐƯỢC CHỈ ĐỊNH:
 * - Ảnh nền: assets/map1_campus.jpg (2048 x 2745)
 * - Tỷ lệ co giãn đường vừa vặn hoàn hảo cho nhân vật di chuyển
 * - 38 Khối va chạm (Collision Boxes) chặn cứng toàn bộ tòa nhà & vùng nước
 * - Không thể đi xuyên qua bất kỳ công trình nào
 */

const MAPS_DATA = {
    map1_tnu: {
        id: 'map1_tnu',
        nameKey: 'map1_name',
        width: 2560,
        height: 3432,
        spawnPoint: { x: 1725, y: 3062 }, // Xuất hiện tại đại lộ trước sảnh Nhà Điều Hành TT
        bgImage: 'assets/map1_campus.jpg',

                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
                // 117 KHỐI VA CHẠM (COLLISION BOXES) CHUẨN MILIMET TOÀN DIỆN TNU CAMPUS
        // TOÀN BỘ ĐƯỜNG ĐI, CẦU BẮC/NAM HỒ TỰ DO, ĐẠI LỘ, ĐƯỜNG CHẠY SÂN VẬN ĐỘNG THÔNG SUỐT 100%
        collisionBoxes: [
            { x: 110, y: 140, width: 205, height: 105 }, // U_Dorm_Top
            { x: 110, y: 245, width: 110, height: 160 }, // U_Dorm_Left
            { x: 110, y: 400, width: 205, height: 100 }, // U_Dorm_Bottom
            { x: 90, y: 290, width: 20, height: 45 }, // U_Dorm_Porch
            { x: 90, y: 535, width: 225, height: 115 }, // U_Dorm_Annex_South
            { x: 0, y: 260, width: 50, height: 90 }, // DanCu_NW_1
            { x: 0, y: 410, width: 50, height: 130 }, // DanCu_NW_2
            { x: 0, y: 550, width: 50, height: 120 }, // DanCu_NW_3
            { x: 945, y: 90, width: 260, height: 130 }, // Bac_Lecture_Top
            { x: 945, y: 300, width: 260, height: 130 }, // Bac_Lecture_Bottom
            { x: 1150, y: 690, width: 60, height: 180 }, // Bac_Narrow_Vert
            { x: 1385, y: 70, width: 140, height: 140 }, // KTX_NE_W_Top
            { x: 1385, y: 210, width: 100, height: 160 }, // KTX_NE_W_Mid
            { x: 1390, y: 370, width: 110, height: 115 }, // KTX_NE_W_Diag
            { x: 1470, y: 430, width: 170, height: 85 }, // KTX_NE_W_South
            { x: 1590, y: 70, width: 280, height: 145 }, // KTX_NE_North
            { x: 1705, y: 215, width: 55, height: 25 }, // KTX_NE_North_Stairs
            { x: 1730, y: 390, width: 280, height: 145 }, // KTX_NE_South
            { x: 1920, y: 80, width: 120, height: 190 }, // KTX_NE_East_Top
            { x: 1920, y: 270, width: 120, height: 185 }, // KTX_NE_East_Bottom
            { x: 2040, y: 130, width: 20, height: 90 }, // KTX_NE_East_Porch
            { x: 2275, y: 240, width: 110, height: 115 }, // DanCu_NE_1
            { x: 2275, y: 370, width: 75, height: 85 }, // DanCu_NE_2_Shed
            { x: 2420, y: 370, width: 110, height: 110 }, // DanCu_NE_3_East
            { x: 2390, y: 505, width: 90, height: 90 }, // DanCu_NE_4_Mid
            { x: 2250, y: 620, width: 140, height: 150 }, // DanCu_NE_5_LargeShed
            { x: 2400, y: 730, width: 130, height: 110 }, // DanCu_NE_6_South
            { x: 100, y: 1100, width: 50, height: 150 }, // Green_Workshop_Top_Left
            { x: 145, y: 1080, width: 290, height: 120 }, // Green_Workshop_Top_Main
            { x: 345, y: 1200, width: 90, height: 75 }, // Green_Workshop_Top_Pavilion
            { x: 145, y: 1370, width: 280, height: 110 }, // Green_Workshop_Bottom
            { x: 75, y: 1600, width: 140, height: 175 }, // Workshop_Red_Top
            { x: 270, y: 1590, width: 175, height: 200 }, // Glass_Greenhouse_Top
            { x: 75, y: 1840, width: 140, height: 75 }, // Glass_Greenhouse_Bottom
            { x: 75, y: 1940, width: 135, height: 105 }, // West_House_Red
            { x: 240, y: 1860, width: 175, height: 90 }, // Courtyard_Horiz
            { x: 410, y: 1860, width: 55, height: 180 }, // Courtyard_Vert
            { x: 300, y: 1960, width: 110, height: 80 }, // Courtyard_Bottom
            { x: 540, y: 1460, width: 300, height: 150 }, // Mid_Orange_Hall
            { x: 540, y: 1750, width: 330, height: 200 }, // Mid_Large_Hall
            { x: 1000, y: 945, width: 230, height: 125 }, // Mid_Center_L_Horiz
            { x: 1000, y: 1070, width: 75, height: 210 }, // Mid_Center_L_Vert
            { x: 1030, y: 1335, width: 170, height: 85 }, // Mid_Center_H_Top
            { x: 1010, y: 1420, width: 65, height: 100 }, // Mid_Center_H_Left
            { x: 1170, y: 1420, width: 55, height: 100 }, // Mid_Center_H_Right
            { x: 1005, y: 1500, width: 220, height: 85 }, // Mid_Center_H_Bottom
            { x: 970, y: 1740, width: 220, height: 95 }, // Mid_Center_Horiz_Bar
            { x: 1020, y: 2200, width: 250, height: 90 }, // Canal_Tennis_Water
            { x: 2050, y: 1130, width: 190, height: 80 }, // Silver_Gym_1
            { x: 1980, y: 1210, width: 260, height: 90 }, // Silver_Gym_2
            { x: 1940, y: 1300, width: 260, height: 100 }, // Silver_Gym_3
            { x: 1940, y: 1410, width: 200, height: 105 }, // Silver_Gym_4
            { x: 2240, y: 1500, width: 170, height: 110 }, // Green_Gym_1
            { x: 2180, y: 1610, width: 200, height: 140 }, // Green_Gym_2
            { x: 2170, y: 1750, width: 140, height: 100 }, // Green_Gym_3
            { x: 1410, y: 1805, width: 200, height: 95 }, // KTX_Stadium_W_Row1
            { x: 1410, y: 1910, width: 200, height: 90 }, // KTX_Stadium_W_Row2
            { x: 1430, y: 2050, width: 180, height: 90 }, // KTX_Stadium_W_Row3
            { x: 1700, y: 1805, width: 200, height: 95 }, // KTX_Stadium_E_Row1
            { x: 1700, y: 1910, width: 200, height: 85 }, // KTX_Stadium_E_Row2
            { x: 1700, y: 2050, width: 200, height: 90 }, // KTX_Stadium_E_Row3
            { x: 2465, y: 2170, width: 95, height: 180 }, // Reservoir_Pool_Water
            { x: 2405, y: 2225, width: 60, height: 30 }, // Reservoir_Pool_Canal
            { x: 120, y: 2190, width: 330, height: 560 }, // Lake_West_Deep
            { x: 450, y: 2180, width: 160, height: 260 }, // Lake_North_West_Bridge
            { x: 645, y: 2180, width: 185, height: 260 }, // Lake_North_East_Bridge
            { x: 700, y: 2440, width: 130, height: 210 }, // Lake_East_Mid
            { x: 450, y: 2640, width: 115, height: 90 }, // Lake_South_West_Bridge
            { x: 650, y: 2640, width: 175, height: 90 }, // Lake_South_East_Bridge
            { x: 515, y: 2470, width: 95, height: 100 }, // Island_Pavilion
            { x: 495, y: 2840, width: 120, height: 155 }, // Dorm_Annex_South_Lake
            { x: 880, y: 2690, width: 130, height: 110 }, // HoiTruongDo_Peak
            { x: 835, y: 2730, width: 225, height: 155 }, // HoiTruongDo_Mid
            { x: 875, y: 2860, width: 195, height: 80 }, // HoiTruongDo_Front
            { x: 870, y: 2950, width: 105, height: 170 }, // Nha7_Upper_Diag
            { x: 940, y: 3050, width: 85, height: 110 }, // Nha7_Corner_Tower
            { x: 975, y: 3080, width: 150, height: 170 }, // Nha7_Mid_Diag
            { x: 1100, y: 3140, width: 175, height: 110 }, // Nha7_Horiz_Wing
            { x: 485, y: 3000, width: 100, height: 200 }, // Nha8_Upper_Diag
            { x: 525, y: 3130, width: 75, height: 110 }, // Nha8_Corner_Tower
            { x: 560, y: 3140, width: 150, height: 150 }, // Nha8_Mid_Diag
            { x: 700, y: 3180, width: 175, height: 115 }, // Nha8_Horiz_Wing
            { x: 55, y: 3100, width: 130, height: 170 }, // Nha9_Upper_Diag
            { x: 150, y: 3230, width: 75, height: 100 }, // Nha9_Corner_Tower
            { x: 190, y: 3230, width: 150, height: 130 }, // Nha9_Mid_Diag
            { x: 325, y: 3285, width: 135, height: 75 }, // Nha9_Horiz_Wing
            { x: 0, y: 2700, width: 45, height: 300 }, // West_Border_South_1
            { x: 0, y: 3020, width: 45, height: 200 }, // West_Border_South_2
            { x: 1250, y: 3315, width: 30, height: 45 }, // South_Gatehouse
            { x: 1070, y: 2430, width: 145, height: 310 }, // ThuVien_Main
            { x: 1040, y: 2560, width: 35, height: 140 }, // ThuVien_West_Entrance
            { x: 1215, y: 2490, width: 25, height: 70 }, // ThuVien_East_Wing1
            { x: 1215, y: 2640, width: 40, height: 90 }, // ThuVien_East_Wing2
            { x: 1215, y: 2390, width: 35, height: 100 }, // ThuVien_Shed_Vert
            { x: 1165, y: 2425, width: 50, height: 25 }, // ThuVien_Shed_Horiz
            { x: 1445, y: 2365, width: 125, height: 120 }, // Nha2_West
            { x: 1600, y: 2365, width: 280, height: 120 }, // Nha2_Center
            { x: 1705, y: 2340, width: 70, height: 25 }, // Nha2_Center_Top
            { x: 1910, y: 2365, width: 120, height: 120 }, // Nha2_East
            { x: 1415, y: 2555, width: 615, height: 135 }, // Admin_Main_Bar
            { x: 1650, y: 2550, width: 145, height: 100 }, // Admin_Center_Tower
            { x: 1575, y: 2690, width: 100, height: 145 }, // Admin_Forward_West
            { x: 1770, y: 2690, width: 100, height: 145 }, // Admin_Forward_East
            { x: 1675, y: 2690, width: 95, height: 120 }, // Admin_Center_Recess
            { x: 1670, y: 2810, width: 105, height: 80 }, // Admin_Stairs
            { x: 2100, y: 2400, width: 180, height: 100 }, // KhoaY_Top
            { x: 2240, y: 2440, width: 80, height: 85 }, // KhoaY_Diag_1
            { x: 2290, y: 2500, width: 80, height: 90 }, // KhoaY_Diag_2
            { x: 2340, y: 2565, width: 75, height: 90 }, // KhoaY_Diag_3
            { x: 2355, y: 2640, width: 70, height: 205 }, // KhoaY_Vertical
            { x: 2460, y: 2550, width: 100, height: 220 }, // KhoaY_Annex_1
            { x: 2490, y: 2770, width: 70, height: 80 }, // KhoaY_Annex_2
            { x: 2465, y: 2785, width: 90, height: 515 }, // BV_Vertical
            { x: 2335, y: 3190, width: 220, height: 95 }, // BV_Horizontal
            { x: 2215, y: 2980, width: 80, height: 75 }, // CongVu_Top
            { x: 2205, y: 3150, width: 95, height: 75 }, // CongVu_Bottom
            { x: 2310, y: 3290, width: 70, height: 60 }, // CongVu_SmallCottage
        ],

        landmarkBadges: [
            { name: '🏛️ NHÀ ĐIỀU HÀNH TRUNG TÂM', x: 1725, y: 2510 },
            { name: '🏢 NHÀ HỌC SỐ 2 (KHOA NÔNG LÂM)', x: 1725, y: 2320 },
            { name: '📖 THƯ VIỆN TNU', x: 1160, y: 2400 },
            { name: '🏛️ GIẢNG ĐƯỜNG TRUNG TÂM (HỘI TRƯỜNG ĐỎ)', x: 970, y: 2650 },
            { name: '🏫 NHÀ HỌC SỐ 7', x: 1100, y: 3040 },
            { name: '🏫 NHÀ HỌC SỐ 8', x: 750, y: 3130 },
            { name: '🏫 NHÀ HỌC SỐ 9', x: 400, y: 3210 },
            { name: '⚕️ KHOA Y DƯỢC - TNU', x: 2180, y: 2370 },
            { name: '🏥 BỆNH VIỆN THỰC HÀNH TNU [ H ]', x: 2480, y: 2750 },
            { name: '⚽ SÂN VẬN ĐỘNG TNU', x: 1775, y: 1075 },
            { name: '🏟️ NHÀ THI ĐẤU ĐA NĂNG', x: 2070, y: 1100 },
            { name: '🎾 SÂN QUẦN VỢT (TENNIS)', x: 1060, y: 1860 },
            { name: '🏞️ HỒ TỰ DO - ĐẢO SINH VIÊN', x: 440, y: 2430 },
            { name: '🏢 GIẢNG ĐƯỜNG LỚN', x: 675, y: 1470 },
            { name: '🛏️ KTX SINH VIÊN ĐÔNG BẮC', x: 1640, y: 60 }
        ],

        // CỔNG CHUYỂN CẢNH & BIỂN CHỈ DẪN
        portals: [
            {
                id: 'portal_rose',
                x: 2400, y: 2825, width: 70, height: 70,
                cx: 2435, cy: 2860,
                radius: 28,
                targetMap: 'map2_rose',
                targetSpawn: { x: 670, y: 440 },
                label: '🌹 Vườn Hoa Hồng',
                theme: 'rose',
                color: '#ff4d6d',
                isCirclePortal: true
            },
            {
                id: 'portal_arcade',
                x: 2380, y: 3005, width: 70, height: 70,
                cx: 2415, cy: 3040,
                radius: 28,
                targetMap: 'map3_arcade',
                targetSpawn: { x: 640, y: 360 },
                label: '🎡 Khu Vui Chơi',
                theme: 'arcade',
                color: '#06d6a0',
                isCirclePortal: true
            },
            {
                id: 'portal_classroom',
                x: 1045, y: 2985, width: 70, height: 70,
                cx: 1080, cy: 3020,
                radius: 30,
                targetMap: 'map5_classroom',
                targetSpawn: { x: 505, y: 490 },
                label: '🏫 Lớp Học Tri Ân 20/11',
                theme: 'classroom',
                color: '#f59e0b',
                isCirclePortal: true
            }
        ]
    },

    // MAP 2: VƯỜN HOA HỒNG & TRANG TRẠI CÀ PHÊ
    map2_rose: {
        id: 'map2_rose',
        nameKey: 'map2_name',
        width: 1280,
        height: 720,
        spawnPoint: { x: 670, y: 440 },
        portals: [
            {
                id: 'portal_back_from_rose',
                x: 715, y: 550, width: 70, height: 70,
                cx: 750, cy: 585,
                radius: 35,
                targetMap: 'map1_tnu',
                targetSpawn: { x: 2420, y: 2965 },
                label: '🏛️ Về Trường ĐHTN',
                theme: 'tnu',
                isCirclePortal: true,
                hideFloatingTag: true,
                noPrompt: true
            }
        ],
        collisionBoxes: [
            // 1. RÌA NGOÀI BẢN ĐỒ
            { id: 'ria_tren', label: 'Rìa trên', x: 0, y: 0, width: 1280, height: 38 },
            { id: 'ria_phai', label: 'Rìa phải', x: 1238, y: 0, width: 42, height: 720 },
            { id: 'ria_trai', label: 'Rìa trái', x: 0, y: 0, width: 38, height: 720 },
            { id: 'ria_duoi_trai', label: 'Rìa dưới trái', x: 0, y: 662, width: 562, height: 58 },
            { id: 'ria_duoi_phai', label: 'Rìa dưới phải', x: 820, y: 664, width: 460, height: 56 },

            // 2. KHUNG CỬA CỔNG VÀO VƯỜN (CHẶN TỪNG CHI TIẾT NHỎ CHUẨN XÁC THEO ẢNH)
            { id: 'cot_cong_tren', label: 'Cột cổng trên', x: 575, y: 294, width: 48, height: 56 },
            { id: 'canh_cua_tren', label: 'Cánh cửa gỗ mở trên', x: 565, y: 338, width: 54, height: 69 },
            { id: 'chau_cay_cong_tren', label: 'Chậu cây cạnh cổng trên', x: 619, y: 325, width: 52, height: 46 },
            { id: 'cot_cong_duoi', label: 'Cột cổng dưới', x: 465, y: 414, width: 48, height: 42 },
            { id: 'canh_cua_duoi', label: 'Cánh cửa gỗ mở dưới', x: 475, y: 441, width: 75, height: 78 },

            // 3. HÀNG RÀO GỖ BAO QUANH VƯỜN HOA
            { id: 'rao_tren_1', label: 'Rào trên 1', x: 312, y: 60, width: 131, height: 90 },
            { id: 'rao_tren_2', label: 'Rào trên 2', x: 200, y: 100, width: 125, height: 86 },
            { id: 'rao_tren_3', label: 'Rào trên 3', x: 119, y: 175, width: 94, height: 79 },
            { id: 'rao_tren_phai_1', label: 'Rào trên phải 1', x: 431, y: 138, width: 100, height: 88 },
            { id: 'rao_tren_phai_2', label: 'Rào trên phải 2 (3 cọc)', x: 525, y: 206, width: 69, height: 94 },
            { id: 'rao_trai_1', label: 'Rào trái 1', x: 38, y: 238, width: 88, height: 106 },
            { id: 'rao_trai_2', label: 'Rào trái 2', x: 34, y: 338, width: 79, height: 106 },
            { id: 'rao_duoi_1', label: 'Rào dưới 1', x: 69, y: 425, width: 106, height: 88 },
            { id: 'rao_duoi_2', label: 'Rào dưới 2', x: 169, y: 481, width: 106, height: 88 },
            { id: 'rao_duoi_3', label: 'Rào dưới 3', x: 269, y: 525, width: 100, height: 75 },

            // 4. VẬT THỂ & DỤNG CỤ SÂN VƯỜN
            { id: 'chau_hoa_tim', label: 'Chậu hoa tím', x: 312, y: 538, width: 59, height: 64 },
            { id: 'cuoc_xeng', label: 'Cuốc xẻng', x: 390, y: 535, width: 46, height: 46 },
            { id: 'xe_rua', label: 'Xe rùa', x: 439, y: 500, width: 80, height: 66 },
            { id: 'thung_go_duoi', label: 'Thùng gỗ dưới', x: 562, y: 625, width: 75, height: 64 },

            // 5. CÁC QUẦY RẠP BÁN HÀNG & MÁNG NƯỚC
            { id: 'thung_go_quay_hat', label: 'Thùng gỗ cạnh quầy hạt giống', x: 735, y: 190, width: 52, height: 79 },
            { id: 'quay_hat_giong', label: 'Quầy hạt giống', x: 775, y: 190, width: 206, height: 148 },
            { id: 'chong_bao_tai_hat', label: 'Chồng bao tải hạt giống', x: 706, y: 300, width: 69, height: 88 },
            { id: 'khay_hat_giong_truoc', label: 'Khay hạt giống trước quầy', x: 860, y: 335, width: 76, height: 56 },
            { id: 'quay_binh_tuoi', label: 'Quầy bình tưới', x: 990, y: 260, width: 216, height: 130 },
            { id: 'chau_cay_quay_tuoi', label: 'Chậu cây cạnh quầy tưới', x: 1105, y: 410, width: 46, height: 46 },
            { id: 'mang_nuoc', label: 'Máng nước', x: 1125, y: 450, width: 94, height: 88 },
            { id: 'thung_nuoc', label: 'Thùng nước', x: 1200, y: 450, width: 50, height: 94 }
        ]
    },

    // MAP 3: ARCADE ZONE (KHU TRÒ CHƠI HỘI CHỢ TNU)
    map3_arcade: {
        id: 'map3_arcade',
        nameKey: 'map3_name',
        width: 1280,
        height: 720,
        spawnPoint: { x: 640, y: 360 },
        bgImage: 'assets/game_zone_1280.jpg',
        portals: [
            {
                id: 'portal_back_from_arcade',
                x: 605, y: 550, width: 70, height: 70,
                cx: 640, cy: 585,
                radius: 28,
                targetMap: 'map1_tnu',
                targetSpawn: { x: 2415, y: 3085 },
                label: '🏛️ Về Trường ĐHTN',
                theme: 'tnu',
                isCirclePortal: true
            },
            {
                id: 'portal_to_rose_from_arcade',
                x: 605, y: 60, width: 70, height: 70,
                cx: 640, cy: 95,
                radius: 28,
                targetMap: 'map2_rose',
                targetSpawn: { x: 670, y: 440 },
                label: '🌹 Vườn Hoa Hồng',
                theme: 'rose',
                isCirclePortal: true
            }
        ],
        collisionBoxes: [
            { x: 0, y: 0, width: 570, height: 35 },
            { x: 710, y: 0, width: 570, height: 35 },
            { x: 0, y: 685, width: 570, height: 35 },
            { x: 710, y: 685, width: 570, height: 35 },
            { x: 0, y: 0, width: 35, height: 310 },
            { x: 0, y: 420, width: 35, height: 300 },
            { x: 1245, y: 0, width: 35, height: 310 },
            { x: 1245, y: 420, width: 35, height: 300 },
            // Quầy Bắn Súng (chỉ chặn rạp sau, chừa chỗ đứng quầy)
            { x: 250, y: 30, width: 250, height: 120 },
            // Quầy Đồ Ăn (chỉ chặn mái rạp và biển hiệu trên cao)
            { x: 880, y: 30, width: 280, height: 130 },
            // Quầy Máy Gắp Thú (chỉ chặn góc tường phía sau)
            { x: 120, y: 460, width: 160, height: 160 },
            // Chuồng Kéo Bò (chỉ chặn mái rạp sau)
            { x: 860, y: 420, width: 280, height: 80 },
            // Ghế dài & Đèn đường
            { x: 720, y: 130, width: 95, height: 45 },
            { x: 460, y: 560, width: 80, height: 45 },
            { x: 720, y: 550, width: 95, height: 45 }
        ]
    },

    // MAP 4: XƯỞNG QUÀ TẶNG & BOUTIQUE
    map4_gift: {
        id: 'map4_gift',
        nameKey: 'map4_name',
        width: 1200,
        height: 900,
        spawnPoint: { x: 600, y: 750 },
        portals: [
            {
                id: 'portal_back_from_gift',
                x: 600, y: 820, width: 140, height: 40,
                targetMap: 'map1_tnu',
                targetSpawn: { x: 1380, y: 2450 },
                label: '🏛️ Về Trường ĐH Tây Nguyên',
                color: '#1d3557'
            }
        ]
    },

    // MAP 5: LỚP HỌC TRI ÂN 20/11 (CLASSROOM MAP CHUẨN XÁC THEO ẢNH NGƯỜI DÙNG)
    map5_classroom: {
        id: 'map5_classroom',
        nameKey: 'map5_name',
        width: 1280,
        height: 720,
        spawnPoint: { x: 640, y: 640 }, // Bước vào từ cửa chính ở dưới đáy
        bgImage: 'assets/classroom/classroom_bg.png',
        portals: [
            {
                id: 'portal_back_from_classroom',
                x: 580, y: 655, width: 120, height: 60,
                cx: 640, cy: 685,
                radius: 40,
                targetMap: 'map1_tnu',
                targetSpawn: { x: 1080, y: 3030 },
                label: '🏛️ Ra Sân Trường TNU',
                theme: 'tnu',
                isCirclePortal: true,
                hideFloatingTag: true,
                noPrompt: true
            }
        ],
        collisionBoxes: [
            // 1. Tường bao quanh phòng học
            { id: 'tuong_tren', label: 'Tường trên & Bục giảng', x: 0, y: 0, width: 1280, height: 235 },
            { id: 'tuong_trai', label: 'Tường trái & Cửa sổ', x: 0, y: 0, width: 170, height: 720 },
            { id: 'tuong_phai', label: 'Tường phải & Cửa ra vào', x: 1080, y: 0, width: 200, height: 720 },
            { id: 'tuong_duoi_trai', label: 'Tường dưới trái', x: 0, y: 655, width: 540, height: 65 },
            { id: 'tuong_duoi_phai', label: 'Tường dưới phải', x: 740, y: 655, width: 540, height: 65 },
            
            // 2. Nội thất bục giảng & Bàn giáo viên
            { id: 'ban_giao_vien', label: 'Bàn giáo viên', x: 795, y: 220, width: 140, height: 70 },
            { id: 'tu_sach_tren', label: 'Tủ sách trên', x: 925, y: 190, width: 110, height: 95 },
            { id: 'tu_sach_duoi', label: 'Tủ sách dưới', x: 1055, y: 440, width: 125, height: 155 },
            { id: 'chau_cay_trai', label: 'Chậu cây góc dưới trái', x: 60, y: 560, width: 95, height: 95 },
            { id: 'chau_cay_phai', label: 'Chậu cây góc dưới phải', x: 1105, y: 560, width: 95, height: 95 },

            // 3. 6 Bàn học sinh (Phần hình vuông đen theo ảnh 3 của người dùng)
            // Cột trái
            { id: 'ban_hoc_sinh_1', label: 'Bàn học 1 (Trái trên)', x: 425, y: 288, width: 120, height: 58 },
            { id: 'ban_hoc_sinh_2', label: 'Bàn học 2 (Trái giữa)', x: 400, y: 385, width: 125, height: 60 },
            { id: 'ban_hoc_sinh_3', label: 'Bàn học 3 (Trái dưới)', x: 375, y: 485, width: 135, height: 65 },
            // Cột phải
            { id: 'ban_hoc_sinh_4', label: 'Bàn học 4 (Phải trên)', x: 730, y: 288, width: 120, height: 58 },
            { id: 'ban_hoc_sinh_5', label: 'Bàn học 5 (Phải giữa)', x: 738, y: 385, width: 125, height: 60 },
            { id: 'ban_hoc_sinh_6', label: 'Bàn học 6 (Phải dưới)', x: 745, y: 485, width: 132, height: 65 }
        ]
    }
};

window.MAPS_DATA = MAPS_DATA;
