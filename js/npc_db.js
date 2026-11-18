/**
 * ========================================================
 * TÂY NGUYÊN UNIVERSITY (TNU) - NPC DATABASE & SPRITE MANAGER
 * Quản lý Danh sách Thầy Cô Bộ Môn Công Nghệ Thông Tin (CNTT)
 * Tự động nạp Sprite Sheets (16 Frames/Skin + 1 Icon) từ thư mục npc/
 * ========================================================
 */

(function () {
    // 1. CẤU HÌNH 6 GIÁO VIÊN BỘ MÔN CNTT & KHÁCH MỜI
    const NPC_SKINS = {
        skin_0: {
            id: 'skin_0',
            teacherId: 'teacher_trang',
            name: 'Cô Phan Thị Đài Trang',
            title: 'Giảng Viên Bộ Môn CNTT',
            badgeColor: '#059669', // Xanh ngọc thanh nhã
            desc: 'Nữ giảng viên duyên dáng trong tà áo dài xanh lá ngọc truyền thống, nụ cười hiền hậu, chuyên sâu về Thị giác máy tính và Xử lý ảnh.',
            folder: 'npc/skin_0',
            avatar: 'npc/skin_0/icon.png',
            role: 'teacher_trang',
            defaultSpeech: 'Chào các em sinh viên CNTT!',
            locationDesc: 'Vườn hoa trung tâm & đài phun nước sinh thái'
        },
        skin_1: {
            id: 'skin_1',
            teacherId: 'teacher_nhu',
            name: 'Cô Nguyễn Thị Như',
            title: 'Giảng Viên Chính Bộ Môn CNTT',
            badgeColor: '#db2777', // Hồng thời trang tri thức
            desc: 'Nữ giảng viên chính phụ trách các chuyên đề AI, chuyển đổi số và dữ liệu lớn; phong cách hiện đại, thanh lịch, tận tâm.',
            folder: 'npc/skin_1',
            avatar: 'npc/skin_1/icon.png',
            role: 'teacher_nhu',
            defaultSpeech: 'Chúc các em học tốt môn Trí Tuệ Nhân Tạo!',
            locationDesc: 'Sảnh chính Giảng đường Nhà học số 7 (Khu CNTT)'
        },
        skin_2: {
            id: 'skin_2',
            teacherId: 'alumni_huong',
            name: 'Nguyễn Lan Hương',
            title: 'Cựu Sinh Viên Tiêu Biểu CNTT K21',
            badgeColor: '#d97706', // Vàng hoàng yến
            desc: 'Cựu sinh viên tiêu biểu khóa K21 ngành CNTT, trang phục dạ hội vàng hoàng yến cùng vương miện đại ngàn lộng lẫy, đại sứ kết nối doanh nghiệp công nghệ với sinh viên TNU.',
            folder: 'npc/skin_2',
            avatar: 'npc/skin_2/icon.png',
            role: 'alumni_huong',
            defaultSpeech: 'Chào các đàn em CNTT! Chúc các bạn luôn vững bước!',
            locationDesc: 'Quảng trường Cổng chào & Sảnh hướng nghiệp Nhà Điều Hành'
        },
        skin_3: {
            id: 'skin_3',
            teacherId: 'teacher_tuan',
            name: 'Thầy Nguyễn Văn Quốc Tuấn',
            title: 'Giảng Viên Bộ Môn CNTT',
            badgeColor: '#0284c7', // Lam ngọc đại ngàn
            desc: 'Giảng viên mang phong thái thủ lĩnh đại ngàn, chiến bào xanh ngọc uy nghiêm, tận tụy dìu dắt bao thế hệ sinh viên làm chủ hạ tầng mạng.',
            folder: 'npc/skin_3',
            avatar: 'npc/skin_3/icon.png',
            role: 'teacher_tuan',
            defaultSpeech: 'Hãy tự tin làm chủ công nghệ mới!',
            locationDesc: 'Chòi ngắm cảnh Đảo Hồ Tự Do thơ mộng'
        },
        skin_4: {
            id: 'skin_4',
            teacherId: 'teacher_qcuong',
            name: 'ThS. Nguyễn Quốc Cường',
            title: 'Giảng Viên Bộ Môn CNTT',
            badgeColor: '#ea580c', // Cam nhiệt huyết
            desc: 'Thầy giáo trẻ trung, năng động, phong cách võ đạo anime tràn đầy sinh khí, luôn đồng hành cùng các hoạt động thanh niên và khởi nghiệp.',
            folder: 'npc/skin_4',
            avatar: 'npc/skin_4/icon.png',
            role: 'teacher_qcuong',
            defaultSpeech: 'Cố lên các lập trình viên tương lai!',
            locationDesc: 'Đại lộ sinh viên trước Tòa Nhà Điều Hành TT'
        },
        skin_5: {
            id: 'skin_5',
            teacherId: 'teacher_cuong',
            name: 'ThS. Nguyễn Thạch Cương',
            title: 'Giảng Viên CNTT / TT CNTT & TV',
            badgeColor: '#475569', // Xám titan cao niên
            desc: 'Bậc thầy kỳ cựu với phong cách Quy Lão Kame thông thái, kính râm thời thượng, mai rùa đại diện cho bề dày kinh nghiệm và uy tín học thuật.',
            folder: 'npc/skin_5',
            avatar: 'npc/skin_5/icon.png',
            role: 'teacher_cuong',
            defaultSpeech: 'Đồ án tốt nghiệp đến đâu rồi các em?',
            locationDesc: 'Trước sảnh chính Thư Viện Trung Tâm (TV)'
        },
        skin_6: {
            id: 'skin_6',
            teacherId: 'teacher_thang',
            name: 'ThS. Nguyễn Đức Thắng',
            title: 'Giảng Viên Bộ Môn CNTT',
            badgeColor: '#7c3aed', // Tím hoàng gia uyên bác
            desc: 'Bậc thầy võ sư cao niên với nón lá truyền thống, áo dài võ phục tím hoàng gia viền vàng kim, râu tóc bạc phơ uyên thâm, chuyên gia Cơ sở dữ liệu và Cấu trúc dữ liệu giải thuật.',
            folder: 'npc/skin_6',
            avatar: 'npc/skin_6/icon.png',
            role: 'teacher_thang',
            defaultSpeech: 'Nhiệt huyết công nghệ luôn rực cháy!',
            locationDesc: 'Quảng trường Cổng chào TNU & Sảnh lớn Nhà Điều Hành'
        },
        skin_7: {
            id: 'skin_7',
            teacherId: 'teacher_lqtuan',
            name: 'ThS. Lê Quốc Tuấn',
            title: 'Giảng Viên Bộ Môn CNTT',
            badgeColor: '#0891b2', // Xanh cyan hiện đại
            desc: 'Giảng viên trẻ phong cách Super Saiyan hiện đại, vest trắng lịch lãm, cà vạt, kính mắt tri thức và cặp táp tài liệu, chuyên gia Hệ thống phần mềm & Kiến trúc máy tính.',
            folder: 'npc/skin_7',
            avatar: 'npc/skin_7/icon.png',
            role: 'teacher_lqtuan',
            defaultSpeech: 'Làm chủ kiến trúc hệ thống là chìa khóa thành công!',
            locationDesc: 'Hành lang học thuật Nhà 2 & Trục Thư Viện TNU'
        },
        skin_k45: {
            id: 'skin_k45',
            teacherId: 'sv_k45',
            name: 'Minh Tuấn (Anh Sinh Viên CNTT)',
            title: 'Sinh Viên K45 Bộ Môn CNTT',
            badgeColor: '#0284c7', // Lam ngọc sinh viên công nghệ
            desc: 'Anh sinh viên năm cuối Khoa CNTT với phong cách chiến binh Thần Long Thủy Tộc tràn đầy nhiệt huyết công nghệ.',
            folder: 'npc/skin_k45',
            avatar: 'npc/skin_k45/icon.png',
            role: 'quest_k45',
            defaultSpeech: 'Em giúp anh tìm 3 trang đồ án với!',
            locationDesc: 'Sân trước & Hành lang Giảng đường Nhà học số 7 (Khu CNTT)'
        }
    };

    // 2. BỘ ĐỆM TẢI VÀ CACHE TOÀN BỘ KHUNG HÌNH (GPU TEXTURE PRELOADER)
    const SPRITE_CACHE = {};
    const ICON_CACHE = {};

    function preloadAllSkins() {
        const directions = ['down', 'up', 'right', 'left'];
        Object.keys(NPC_SKINS).forEach(skinKey => {
            const skin = NPC_SKINS[skinKey];
            SPRITE_CACHE[skinKey] = {};

            // Nạp Icon đại diện (Hỗ trợ Cloudflare R2 + Fallback)
            const iconImg = new Image();
            const r2Avatar = (window.getR2Url ? window.getR2Url(skin.avatar) : skin.avatar);
            iconImg.onerror = () => {
                if (iconImg.src === r2Avatar && r2Avatar !== skin.avatar) {
                    iconImg.src = skin.avatar;
                }
            };
            iconImg.src = r2Avatar;
            ICON_CACHE[skinKey] = iconImg;

            // Nạp 16 khung hình chuyển động (4 hướng x 4 frames)
            directions.forEach(dir => {
                SPRITE_CACHE[skinKey][dir] = [];
                for (let f = 0; f < 4; f++) {
                    const localPath = `${skin.folder}/${dir}_${f}.png`;
                    const r2Path = (window.getR2Url ? window.getR2Url(localPath) : localPath);
                    const img = new Image();
                    img.onerror = () => {
                        if (img.src === r2Path && r2Path !== localPath) {
                            img.src = localPath;
                        }
                    };
                    img.src = r2Path;
                    SPRITE_CACHE[skinKey][dir].push(img);
                }
            });
        });
        console.log('✅ [NPC_DB] Preloaded all 8 Teacher & Alumni Skins & Sprites from npc/ successfully!');
    }

    // 3. API TRUY XUẤT SPRITE CHO RENDERER
    const NPC_DB = {
        skins: NPC_SKINS,

        getSkin(skinId) {
            return NPC_SKINS[skinId] || null;
        },

        getFrame(skinId, direction, frameIndex = 0) {
            const safeDir = ['down', 'up', 'right', 'left'].includes(direction) ? direction : 'down';
            const safeIdx = Math.max(0, Math.min(3, Math.floor(frameIndex) % 4));
            if (SPRITE_CACHE[skinId] && SPRITE_CACHE[skinId][safeDir]) {
                return SPRITE_CACHE[skinId][safeDir][safeIdx] || null;
            }
            return null;
        },

        getIcon(skinId) {
            return ICON_CACHE[skinId] ? ICON_CACHE[skinId].src : (NPC_SKINS[skinId]?.avatar || 'npc/skin_0/icon.png');
        },

        // Dành cho việc bổ sung skin mới trong tương lai khi người dùng upload thêm
        registerSkin(skinId, config) {
            NPC_SKINS[skinId] = config;
            SPRITE_CACHE[skinId] = {};
            const iconImg = new Image();
            iconImg.src = config.avatar;
            ICON_CACHE[skinId] = iconImg;

            ['down', 'up', 'right', 'left'].forEach(dir => {
                SPRITE_CACHE[skinId][dir] = [];
                for (let f = 0; f < 4; f++) {
                    const img = new Image();
                    img.src = `${config.folder}/${dir}_${f}.png`;
                    SPRITE_CACHE[skinId][dir].push(img);
                }
            });
        }
    };

    // Tự động khởi chạy nạp ảnh
    preloadAllSkins();

    window.NPC_DB = NPC_DB;
    window.NPC_SKINS = NPC_SKINS;
})();
