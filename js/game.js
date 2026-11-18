/**
 * MAIN GAME ENGINE & RENDERER (CHÍNH XÁC 100% THEO ẢNH CHỤP SCREENSHOT GAME)
 * - Tái tạo đồ họa tuyệt đẹp:
 *   1. Thảm cỏ bàn cờ (Checkerboard pastel green)
 *   2. Tuyến đường cát kem với hàng rào gỗ ven đường
 *   3. Hồ Nước xanh ngọc & Căn tin Đảo sinh viên nối cầu gỗ
 *   4. Toàn bộ các tòa nhà với biển tên bo tròn Pill Badge màu nâu đất
 *   5. Bảng "✨ DẤU ẤN CHÚNG TA ✨" & Vòng đóng dấu tay 🫱
 *   6. Mũi tên chỉ đường xanh/vàng tới Nhà học số 6
 *   7. Cổng chính "TRƯỜNG ĐẠI HỌC TÂY NGUYÊN", Nhà bảo vệ, Phòng trưng bày
 *   8. Biển "🍃 Đi hái cà phê ➔" và "🚎 Xe buýt - đi khu khác"
 */

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.width = 1280;
        this.height = 720;

        this.camera = { x: 0, y: 0, width: this.width, height: this.height };
        this.keys = {};
        this.joystickVector = { x: 0, y: 0, distance: 0 };
        this.player = null;
        this.particleSystem = new ParticleSystem();

        this.mapEntities = {
            map1_tnu: { npcs: [], items: [] },
            map2_rose: { bushes: [] },
            map3_arcade: {},
            map4_gift: {}
        };

        this.collisionBoxes = [];
        this.isWarping = false;
        this.warpAlpha = 0;
        this.lastTime = 0;
        this.isRunning = false;
        this.globalTime = 0;

        // Tiến trình dấu tay "Dấu ấn chúng ta"
        this.handStampsCount = 19;
        this.hasStamped = false;

        // Đếm ngược lớp học Nhà học 6
        this.classTimer1 = 8.0;
        this.classTimer2 = 3.0;

        // Nạp hình ảnh bản đồ Vector TNU Campus mới (Hỗ trợ Cloudflare R2 + Fallback)
        const mapUrl = 'assets/map1_campus.jpg';
        const r2MapUrl = (window.getR2Url ? window.getR2Url(mapUrl) : mapUrl);
        this.map1Image = new Image();
        this.map1ImageLoaded = false;
        this.map1Image.onload = () => {
            this.map1ImageLoaded = true;
        };
        this.map1Image.onerror = () => {
            if (this.map1Image.src === r2MapUrl && r2MapUrl !== mapUrl) {
                this.map1Image.src = mapUrl;
            }
        };
        this.map1Image.src = r2MapUrl;
        if (this.map1Image.complete && this.map1Image.naturalWidth > 0) {
            this.map1ImageLoaded = true;
        }
    }

    init() {
        if (!this.canvas) return;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        const currentMap = window.MAPS_DATA[window.useGameStore.state.currentMapId];
        this.player = new Player(currentMap.spawnPoint.x, currentMap.spawnPoint.y);

        this.buildEntities();
        this.loadMapCollision(window.useGameStore.state.currentMapId);

        // Khởi tạo hệ thống lồng đèn bay phấp phới từ assets/Hu
        if (window.FloatingLanternsSystem) {
            this.lanternsSystem = new FloatingLanternsSystem();
            const map1 = window.MAPS_DATA.map1_tnu;
            this.lanternsSystem.init(map1 ? map1.width : 2560, map1 ? map1.height : 3432);
        }

        // Khởi tạo hệ thống Minimap độc quyền Đại học Tây Nguyên
        if (window.minimapSystem) {
            window.minimapSystem.init();
        }

        // Khởi tạo Cây Ước Nguyện & Bảng Ước Nguyện 20/11 (assets/Cayuocnguyen)
        if (window.wishingManager) {
            window.wishingManager.init();
        }

        // Bàn phím
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
                if (e.key === 'Escape') e.target.blur();
                return;
            }
            this.keys[e.code] = true;
            if (window.soundSystem) window.soundSystem.init();

            if (e.key === 'Escape') {
                if (window.wishingManager) window.wishingManager.closeModals();
            }

            if ((e.code === 'KeyE' || e.code === 'Space') && !window.uiManager.activeModal) {
                this.handleInteract();
            }
            if (e.code === 'KeyC' && !window.uiManager.activeModal) {
                window.uiManager.openWardrobeModal();
            }
            if (e.code === 'KeyG' && !window.uiManager.activeModal) {
                window.uiManager.openCraftingModal();
            }
            if ((e.code === 'KeyB' || e.code === 'KeyI') && !window.uiManager.activeModal) {
                window.uiManager.openBackpackModal();
            }
            if (e.code === 'KeyQ') {
                if (window.uiManager.activeModal && window.uiManager.activeModal.id === 'quest-modal') {
                    window.uiManager.closeQuestModal();
                } else if (!window.uiManager.activeModal) {
                    window.uiManager.openQuestModal();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            this.keys[e.code] = false;
        });

        // Bắt sự kiện click chuột trực tiếp vào Cây Ước Nguyện & Bảng Ước Nguyện
        this.canvas.addEventListener('click', (e) => {
            if (window.uiManager && window.uiManager.activeModal) return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const screenX = (e.clientX - rect.left) * scaleX;
            const screenY = (e.clientY - rect.top) * scaleY;
            const worldX = screenX + this.camera.x;
            const worldY = screenY + this.camera.y;

            const currentMapId = window.useGameStore.state.currentMapId;
            if (currentMapId === 'map1_tnu' && window.wishingManager) {
                if (window.wishingManager.checkClick(worldX, worldY)) {
                    return;
                }
            }

            if (currentMapId === 'map3_arcade' && window.gameZoneManager) {
                const gz = window.gameZoneManager;
                if (gz.chefNpc) {
                    const distToChef = Math.hypot(worldX - gz.chefNpc.x, worldY - gz.chefNpc.y);
                    const isClickOnChef = (distToChef <= 65) ||
                        (worldX >= gz.chefNpc.x - 60 && worldX <= gz.chefNpc.x + 60 &&
                         worldY >= gz.chefNpc.y - 85 && worldY <= gz.chefNpc.y + 25);
                    if (isClickOnChef) {
                        if (window.uiManager && typeof window.uiManager.openChefMaiDialogue === 'function') {
                            window.uiManager.openChefMaiDialogue();
                            return;
                        }
                    }
                }
            }
            const currentMapPortals = window.MAPS_DATA[currentMapId]?.portals || [];
            for (const portal of currentMapPortals) {
                const cx = portal.cx || (portal.x + portal.width / 2);
                const cy = portal.cy || (portal.y + portal.height / 2);
                if (Math.hypot(worldX - cx, worldY - cy) < 45) {
                    this.warpToMap(portal.targetMap, portal.targetSpawn);
                    return;
                }
            }
        });

        // Khởi tạo Nipple.js Touch Virtual Joystick
        this.initVirtualJoystick();

        // Âm thanh khuôn viên trường
        setTimeout(() => {
            if (window.soundSystem) window.soundSystem.playBGM('campus');
        }, 500);

        // Khởi tạo Mạng Trực Tuyến Thời Gian Thực (Multiplayer Online)
        if (window.networkManager) {
            window.networkManager.init(this);
        }

        this.start();
    }

    initVirtualJoystick() {
        const zone = document.getElementById('joystick-zone');
        if (!zone || typeof nipplejs === 'undefined') return;

        try {
            const manager = nipplejs.create({
                zone: zone,
                mode: 'dynamic',
                color: '#ffd166',
                size: 110,
                threshold: 0.1
            });

            manager.on('move', (evt, data) => {
                if (data && data.vector) {
                    this.joystickVector = {
                        x: data.vector.x,
                        y: -data.vector.y,
                        distance: data.distance
                    };
                }
            });

            manager.on('end', () => {
                this.joystickVector = { x: 0, y: 0, distance: 0 };
            });
        } catch (e) {
            console.warn('NippleJS error:', e);
        }
    }

    buildEntities() {
        // Map 1: 6 Thầy Cô Bộ Môn Công Nghệ Thông Tin (TNU) với 6 Bộ Skin Sprite Sheets chuẩn 4 hướng
        // Lộ trình tuần tra dạo quanh toàn trường (toàn bộ 100% không va chạm công trình)
        this.mapEntities.map1_tnu.npcs = [
            // 1. ThS. Nguyễn Quốc Cường (Skin 4 - Giảng viên trẻ anime năng động dạo trục Bắc - Nam, Đại lộ TT & Khu Thể thao)
            new CampusNPC('teacher_qcuong', 'ThS. Nguyễn Quốc Cường', '#ea580c', 1725, 3050, [
                'Lập trình viên Tây Nguyên tự tin lên!',
                'Rèn luyện thể lực tốt để code bền bỉ nào!',
                'Chào các bạn! Học tập hăng say nhé!'
            ], [
                { x: 1725, y: 3050 }, // Sảnh trước Nhà Điều Hành TT
                { x: 1725, y: 3320 }, // Đại lộ Cổng chào phía Nam
                { x: 1300, y: 3320 }, // Rẽ sang Trục Bắc - Nam chính
                { x: 1300, y: 2850 }, // Giữa Thư viện & Nhà 7
                { x: 1300, y: 2250 }, // Bắc Thư viện / Tây Nhà 2
                { x: 1300, y: 1700 }, // Hành lang thể thao (Tây KTX, Đông Tennis)
                { x: 1300, y: 1350 }, // Qua sân Thể chất
                { x: 1300, y: 920 },  // Sân Vận Động TNU
                { x: 1300, y: 650 },  // Trục Bắc KTX
                { x: 1300, y: 920 },
                { x: 1300, y: 1350 },
                { x: 1300, y: 1700 },
                { x: 1300, y: 2250 },
                { x: 1300, y: 3050 },
                { x: 1550, y: 3050 }
            ], 'teacher_qcuong', 'skin_4'),

            // 2. ThS. Nguyễn Thạch Cương (Skin 5 - Bậc thầy Quy Lão Kame uyên bác dạo Thư viện TV, Bờ Đông Hồ Tự Do & Hội Trường)
            new CampusNPC('teacher_cuong', 'ThS. Nguyễn Thạch Cương', '#475569', 1300, 2680, [
                'Đồ án tốt nghiệp đến đâu rồi các em?',
                'Thư viện hôm nay có nhiều tài liệu mới đấy!',
                'Nghiên cứu khoa học cần sự kiên trì và đam mê!'
            ], [
                { x: 1300, y: 2680 }, // Trục trước Thư viện TNU
                { x: 1300, y: 2350 }, // Phía Bắc Thư viện & Nhà 2
                { x: 830, y: 2350 },  // Góc Đông Bắc Hồ Tự Do
                { x: 830, y: 2650 },  // Bờ Đông Hồ Tự Do dạo cảnh ngắm liễu
                { x: 830, y: 2920 },  // Nam Hội Trường Đỏ
                { x: 1050, y: 2920 }, // Sân nối Thư viện & Nhà 7
                { x: 1300, y: 2920 }  // Trở lại đại lộ chính
            ], 'teacher_cuong', 'skin_5'),

            // 3. ThS. Nguyễn Thị Như (Skin 1 - Nữ giảng viên hiện đại, vest hồng dạo Khu Giảng đường 7, 8, 9 & Vườn Nam)
            new CampusNPC('teacher_nhu', 'ThS. Nguyễn Thị Như', '#db2777', 1100, 2930, [
                'Chào mừng đến với Bộ môn CNTT!',
                'Lab thực hành Giảng đường 7 luôn sẵn sàng!',
                'Chúc các bạn một học kỳ đạt kết quả thật cao!'
            ], [
                { x: 1100, y: 2930 }, // Trước sảnh Giảng đường 7 (Khu CNTT)
                { x: 1300, y: 2930 }, // Nối trục chính
                { x: 1300, y: 3400 }, // Đại lộ phía Nam
                { x: 900, y: 3400 },  // Phía Nam Nhà 7 & Nhà 8
                { x: 500, y: 3400 },  // Phía Nam Nhà 9
                { x: 150, y: 3400 },  // Góc công viên hoa Tây Nam
                { x: 500, y: 3400 },
                { x: 900, y: 3400 },
                { x: 1300, y: 3400 },
                { x: 1300, y: 2930 }
            ], 'teacher_nhu', 'skin_1'),

            // 4. ThS. Phan Thị Đài Trang (Skin 0 - Nữ giảng viên áo dài xanh ngọc dạo Vườn hoa, Cổng Đông & Phía Đông Admin)
            new CampusNPC('teacher_trang', 'ThS. Phan Thị Đài Trang', '#059669', 2180, 2700, [
                'Hoa muồng trường mình đẹp quá!',
                'Khuôn viên Tây Nguyên mùa này thật rực rỡ!',
                'Chào bạn! Hôm nay thời tiết thật trong lành!'
            ], [
                { x: 2180, y: 2700 }, // Vườn hoa & đài phun nước phía Đông
                { x: 2180, y: 3320 }, // Cổng Đông / Trục Đông Nam
                { x: 1725, y: 3320 }, // Trục Cổng chào Nam
                { x: 1725, y: 3050 }, // Sảnh Nhà Điều Hành TT
                { x: 2060, y: 3050 }, // Lối dạo Đông Nhà Điều Hành
                { x: 2060, y: 2700 }  // Vườn hoa & đài phun nước
            ], 'teacher_trang', 'skin_0'),

            // 5. Thầy Nguyễn Văn Quốc Tuấn (Skin 3 - Thổ cẩm xanh lam dạo Tuyến Sinh thái Tây, Vườn Thực Nghiệm & Bắc Hồ)
            new CampusNPC('teacher_tuan', 'Thầy Nguyễn Văn Quốc Tuấn', '#0284c7', 450, 2150, [
                'Không gian Hồ Tự Do thật thoáng đãng!',
                'Sinh thái Tây Nguyên tuyệt vời lắm các bạn!',
                'Hãy luôn giữ gìn môi trường xanh sạch đẹp nhé!'
            ], [
                { x: 450, y: 2150 }, // Phía Bắc Hồ Tự Do (cầu dẫn sinh thái)
                { x: 450, y: 1700 }, // Đại lộ Vườn Thực Nghiệm Tây
                { x: 450, y: 1250 }, // Giảng đường Lớn & Trại Nông Nghiệp
                { x: 450, y: 800 },  // Góc Tây Bắc Campus
                { x: 450, y: 1250 },
                { x: 450, y: 1700 },
                { x: 450, y: 2150 },
                { x: 830, y: 2150 }, // Vành đai ven hồ ngắm hoa
                { x: 830, y: 2350 },
                { x: 830, y: 2150 }
            ], 'teacher_tuan', 'skin_3'),

            // 6. ThS. Nguyễn Đức Thắng (Skin 6 - Võ sư cao niên nón lá áo tím uy nghi dạo Quảng trường Cổng chào TNU & Nhà Điều Hành)
            new CampusNPC('teacher_thang', 'ThS. Nguyễn Đức Thắng', '#7c3aed', 1650, 3300, [
                'Nhiệt huyết công nghệ luôn rực cháy!',
                'Cổng trường Tây Nguyên luôn rộng mở đón các bạn!',
                'Khát vọng vươn xa từ vùng đất bazan màu mỡ!'
            ], [
                { x: 1650, y: 3300 }, // Cổng chào TNU
                { x: 1350, y: 3300 }, // Ngã tư đại lộ Tây
                { x: 1350, y: 2950 }, // Quảng trường cờ & cây xanh
                { x: 1725, y: 2950 }, // Sảnh trước Nhà Điều Hành TT
                { x: 1725, y: 3300 }  // Về cổng chào
            ], 'teacher_thang', 'skin_6'),

            // 7. ThS. Lê Quốc Tuấn (Skin 7 - Trí thức trẻ Super Saiyan vest trắng dạo Hành lang Nhà 2, Thư viện & TT Điều Hành)
            new CampusNPC('teacher_lqtuan', 'ThS. Lê Quốc Tuấn', '#0891b2', 1300, 2250, [
                'Làm chủ kiến trúc hệ thống là chìa khóa thành công!',
                'Hệ thống phần mềm lớn cần sự tư duy mạch lạc!',
                'Chào các em! Nắm vững kiến trúc máy tính nhé!'
            ], [
                { x: 1300, y: 2250 }, // Ngã tư Bắc Thư viện & Tây Nhà 2
                { x: 1725, y: 2250 }, // Phía Bắc Nhà 2 (Khoa Nông Lâm & CNTT)
                { x: 2060, y: 2250 }, // Ngã tư Đông Bắc Nhà 2
                { x: 2060, y: 2500 }, // Hành lang Đông Nhà 2
                { x: 2060, y: 3050 }, // Lối dạo Đông Nhà Điều Hành
                { x: 1725, y: 3050 }, // Sảnh trước Nhà Điều Hành TT
                { x: 1300, y: 3050 }, // Nối về đại lộ chính
                { x: 1300, y: 2680 }  // Trước Thư viện TNU
            ], 'teacher_lqtuan', 'skin_7'),

            // 8. Nguyễn Lan Hương (Skin 2 - Cựu SV tiêu biểu K21 áo dạ hội vàng hoàng yến dạo Tuyến kết nối Cựu SV & Doanh nghiệp)
            new CampusNPC('alumni_huong', 'Nguyễn Lan Hương', '#d97706', 1500, 3300, [
                'Chào các đàn em CNTT! Chúc các bạn luôn vững bước!',
                'Tự hào là cựu sinh viên Đại học Tây Nguyên!',
                'Các bạn hãy chủ động nắm bắt cơ hội việc làm nhé!'
            ], [
                { x: 1500, y: 3300 }, // Đại lộ Cổng chào TNU
                { x: 1850, y: 3300 }, // Quảng trường giao lưu cựu sinh viên
                { x: 2060, y: 3300 }, // Cửa ngõ kết nối Vườn hoa phía Đông
                { x: 2060, y: 3050 }, // Đại lộ sự kiện & hướng nghiệp
                { x: 1725, y: 3050 }, // Sảnh Nhà Điều Hành TT
                { x: 1300, y: 3050 }, // Nối đại lộ Tây
                { x: 1100, y: 2930 }, // Thăm sảnh Giảng đường 7 (Khoa CNTT)
                { x: 1300, y: 2930 }, // Trở lại đại lộ
                { x: 1300, y: 3300 }  // Về đại lộ Nam
            ], 'alumni_huong', 'skin_2'),

            // Sinh viên CNTT giao nhiệm vụ Tìm đồ án tốt nghiệp (Dạo quanh khuôn viên Tòa nhà số 7)
            new CampusNPC('sv_k45', 'Minh Tuấn (Anh Sinh Viên CNTT)', '#0284c7', 1180, 2960, [
                'Em giúp anh tìm 3 trang đồ án với!',
                'Gió to quá làm bay mất bản thảo Đồ Án K45 rồi!',
                'Tòa 7 hôm nay náo nhiệt quá, các bạn SV học tập chăm chỉ ghê!'
            ], [
                { x: 1080, y: 2960 }, // Sảnh trước phía Tây Nhà học số 7
                { x: 1180, y: 2960 }, // Sân trước sảnh chính Nhà học số 7
                { x: 1240, y: 2990 }, // Góc Đông sảnh Nhà 7
                { x: 1240, y: 3060 }, // Lối đi râm mát phía Đông Nhà 7
                { x: 1180, y: 3040 }, // Bậc thềm sảnh đón Nhà 7
                { x: 1100, y: 3000 }  // Lối đi trước sảnh Tây Nhà 7
            ], 'quest_k45', 'skin_k45')
        ];

        // 3 Trang tài liệu đồ án K45
        this.mapEntities.map1_tnu.items = [
            new CampusDocument('doc_1', 1625, 2980), // Quảng trường trước sảnh Nhà Điều Hành 'TT'
            new CampusDocument('doc_2', 1100, 2700),  // Sân trước Thư viện 'TV'
            new CampusDocument('doc_3', 1110, 2960)   // Sân trước sảnh Nhà học số 7 '7'
        ];

        // Map 2: Hoa hồng chỉ có khi người chơi trực tiếp gieo hạt & tưới nước trong vườn
        this.mapEntities.map2_rose.bushes = [];
    }

    loadMapCollision(mapId) {
        this.collisionBoxes = [];
        const m = window.MAPS_DATA[mapId];
        if (!m) return;

        if (m.collisionBoxes) {
            m.collisionBoxes.forEach(b => this.collisionBoxes.push(b));
            return;
        }

        if (m.buildings) {
            m.buildings.forEach(b => {
                this.collisionBoxes.push({
                    x: b.x,
                    y: b.y,
                    width: b.width,
                    height: b.height
                });
            });
        }

        if (m.lake) {
            // Chặn hồ nước chỉ chừa cầu nối đảo
            this.collisionBoxes.push(
                { x: m.lake.x, y: m.lake.y, width: m.lake.width, height: m.lake.height * 0.55 },
                { x: m.lake.x, y: m.lake.y + m.lake.height * 0.65, width: m.lake.width, height: m.lake.height * 0.35 }
            );
        }

        if (m.collisionBoxes) {
            m.collisionBoxes.forEach(b => this.collisionBoxes.push(b));
        }
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;
        this.globalTime += dt;

        // Cập nhật bộ đếm thời gian tới giờ học
        this.classTimer1 = Math.max(0, this.classTimer1 - dt);
        if (this.classTimer1 <= 0) this.classTimer1 = 15.0;
        this.classTimer2 = Math.max(0, this.classTimer2 - dt);
        if (this.classTimer2 <= 0) this.classTimer2 = 10.0;

        // Cập nhật thẻ hiển thị HUD
        const timer1El = document.getElementById('hud-class-timer-1');
        const timer2El = document.getElementById('hud-class-timer-2');
        if (timer1El) timer1El.innerText = Math.ceil(this.classTimer1) + 's';
        if (timer2El) timer2El.innerText = Math.ceil(this.classTimer2) + 's';

        try {
            this.update(dt);
            this.render();
        } catch (err) {
            console.error('Lỗi trong gameLoop frame:', err);
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        const currentMapId = window.useGameStore.state.currentMapId;
        const currentMap = window.MAPS_DATA[currentMapId];

        if (this.player && !window.uiManager.activeModal) {
            this.player.update(this.keys, this.joystickVector, dt, this.collisionBoxes, currentMap.width, currentMap.height);

            this.camera.x = Math.max(0, Math.min(this.player.x - this.width / 2, currentMap.width - this.width));
            this.camera.y = Math.max(0, Math.min(this.player.y - this.height / 2, currentMap.height - this.height));

            this.checkPortals();
        }

        if (currentMapId === 'map1_tnu') {
            this.mapEntities.map1_tnu.npcs.forEach(n => n.update(dt, this.player));
            this.mapEntities.map1_tnu.items.forEach(item => item.update(dt));
            if (this.lanternsSystem) {
                this.lanternsSystem.update(dt);
            }
            if (window.wishingManager) {
                window.wishingManager.update(dt);
            }
        } else if (currentMapId === 'map2_rose') {
            this.mapEntities.map2_rose.bushes.forEach(b => b.update(dt));
        }

        // Cập nhật Minimap TNU Campus
        if (window.minimapSystem) {
            window.minimapSystem.update(dt);
        }

        // Cập nhật la bàn / mục tiêu nhiệm vụ khi người chơi bấm "Đi tới"
        if (this.questNav && this.questNav.active) {
            this.questNav.timer -= dt;
            if (this.questNav.timer <= 0) {
                this.questNav.active = false;
            } else {
                const dist = Math.hypot(this.player.x - this.questNav.targetX, this.player.y - this.questNav.targetY);
                if (dist < 65) {
                    this.questNav.active = false;
                    window.uiManager.showToast(`🎯 Bạn đã tới: ${this.questNav.name}!`, 'success');
                }
            }
        }

        this.particleSystem.update(dt);

        // Cập nhật và gửi dữ liệu mạng thời gian thực (Multiplayer Online Sync)
        if (window.networkManager) {
            window.networkManager.update(dt);
            if (this.player && !window.uiManager.activeModal) {
                window.networkManager.sendMovement(this.player, currentMapId);
            }
        }
    }

    setQuestNavigation(x, y, name) {
        this.questNav = {
            targetX: x,
            targetY: y,
            name: name,
            active: true,
            timer: 25.0
        };
        if (window.soundSystem) window.soundSystem.playPickItem();
    }

    handleInteract() {
        if (this.player) {
            this.player.triggerAction(0.65); // Kích hoạt frame action (vung tay tỏa ánh sao lấp lánh như ảnh spritesheet)
        }
        const currentMapId = window.useGameStore.state.currentMapId;
        const px = this.player.x;
        const py = this.player.y;

        // 0. Tương tác với Cổng chuyển cảnh (Bấm E để dịch chuyển trên mọi map)
        const currentMapPortals = window.MAPS_DATA[currentMapId]?.portals || [];
        for (const portal of currentMapPortals) {
            const cx = portal.cx || (portal.x + portal.width / 2);
            const cy = portal.cy || (portal.y + portal.height / 2);
            if (Math.hypot(px - cx, py - cy) < 65) {
                this.warpToMap(portal.targetMap, portal.targetSpawn);
                return;
            }
        }

        if (currentMapId === 'map3_arcade' && window.gameZoneManager) {
            const gz = window.gameZoneManager;
            // 1. Ưu tiên số 1: Tương tác với Cô Mai Bếp Trưởng nếu đứng gần
            if (gz.isNearChef || (gz.chefNpc && Math.hypot(px - gz.chefNpc.x, py - gz.chefNpc.y) < 85)) {
                if (window.uiManager && typeof window.uiManager.openChefMaiDialogue === 'function') {
                    window.uiManager.openChefMaiDialogue();
                    return;
                }
            }
            // 2. Mở quầy trò chơi khi đứng trong vòng tròn tương tác
            if (gz.nearbyBooth) {
                gz.openGameBoard(gz.nearbyBooth.id);
                return;
            }
        }

        if (currentMapId === 'map1_tnu') {
            // Tương tác Cây Ước Nguyện & Bảng Ước Nguyện 20/11
            if (window.wishingManager && window.wishingManager.checkInteraction(this.player)) {
                return;
            }

            // 1. Tương tác với NPC
            for (const npc of this.mapEntities.map1_tnu.npcs) {
                if (Math.hypot(px - npc.x, py - npc.y) < 65) {
                    window.uiManager.openDialogueModal(npc);
                    return;
                }
            }

            // 4. Nhặt tài liệu đồ án
            for (const doc of this.mapEntities.map1_tnu.items) {
                if (!doc.isCollected && Math.hypot(px - doc.x, py - doc.y) < 60) {
                    doc.isCollected = true;
                    const quest = window.useGameStore.state.quests.do_an_k45;
                    const nextCount = quest.currentCount + 1;
                    window.useGameStore.setState(s => ({
                        quests: {
                            ...s.quests,
                            do_an_k45: { ...s.quests.do_an_k45, currentCount: nextCount, status: nextCount >= 3 ? 'can_turn_in' : 'in_progress' }
                        }
                    }));
                    if (window.soundSystem) window.soundSystem.playPickItem();
                    window.uiManager.showToast(`📜 Nhặt được 1 trang đồ án (${nextCount}/3)!${nextCount >= 3 ? ' Hãy đem về cho anh sinh viên CNTT tại Nhà số 7!' : ''}`, 'info');
                    return;
                }
            }
        }

        if (currentMapId === 'map2_rose') {
            for (const bush of this.mapEntities.map2_rose.bushes) {
                if (Math.hypot(px - bush.x, py - bush.y) < 55 && bush.state === 'ready') {
                    const res = bush.harvest();
                    if (res.success) {
                        if (res.isRare) {
                            window.useGameStore.addItem('hoa_hong_trang', 1);
                            window.uiManager.showToast('💮 Quý hiếm! Bạn vừa hái được Hoa Hồng Trắng!', 'success');
                        } else {
                            window.useGameStore.addItem('hoa_hong', 1);
                            window.uiManager.showToast('🌹 Bạn đã hái được 1 đóa Hoa Hồng!', 'info');
                        }
                        if (window.soundSystem) window.soundSystem.playPickItem();
                    }
                    return;
                }
            }
        }
    }

    checkPortals() {
        const currentMap = window.MAPS_DATA[window.useGameStore.state.currentMapId];
        if (!currentMap || !currentMap.portals || this.isWarping) return;

        for (const portal of currentMap.portals) {
            const cx = portal.cx || (portal.x + portal.width / 2);
            const cy = portal.cy || (portal.y + portal.height / 2);
            const dist = Math.hypot(this.player.x - cx, this.player.y - cy);
            const triggerDist = portal.radius ? Math.max(portal.radius + 15, 50) : 55;
            if (dist < triggerDist) {
                this.warpToMap(portal.targetMap, portal.targetSpawn);
                break;
            }
        }
    }

    warpToMap(targetMapId, targetSpawn) {
        if (this.isWarping) return;
        this.isWarping = true;
        if (window.soundSystem) window.soundSystem.playWarp();

        let fadeAlpha = 0;
        const fadeInterval = setInterval(() => {
            fadeAlpha += 0.15;
            this.warpAlpha = Math.min(1, fadeAlpha);

            if (this.warpAlpha >= 1) {
                clearInterval(fadeInterval);
                const prevMapId = window.useGameStore.state.currentMapId;
                window.useGameStore.setState({ currentMapId: targetMapId });
                if (window.minimapSystem) {
                    window.minimapSystem.updateVisibility();
                }

                // Dọn dẹp HUD và modal nếu rời khỏi Vườn hoa hồng
                if (prevMapId === 'map2_rose' && targetMapId !== 'map2_rose') {
                    const hud = document.getElementById('rose-garden-hud-bar');
                    if (hud) hud.style.display = 'none';
                    ['rose-seed-shop-modal', 'rose-tool-shop-modal', 'rose-asset-manager-modal'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el && window.uiManager && window.uiManager.closeModal) window.uiManager.closeModal(el);
                    });
                }

                // Quản lý hiển thị thanh Quest HUD khi chuyển bản đồ
                const questEl = document.getElementById('hud-quest-container');
                if (targetMapId === 'map2_rose') {
                    if (questEl) questEl.style.display = 'none';
                } else if (prevMapId === 'map2_rose') {
                    if (questEl) questEl.style.display = '';
                }

                this.player.x = targetSpawn.x;
                this.player.y = targetSpawn.y;
                if (this.player.companionPet) {
                    this.player.companionPet.teleportTo(targetSpawn.x - 30, targetSpawn.y - 10);
                }
                this.loadMapCollision(targetMapId);

                // Thông báo chuyển map tới máy chủ trực tuyến
                if (window.networkManager) {
                    window.networkManager.sendChangeMap(targetMapId, targetSpawn.x, targetSpawn.y);
                }

                const unfadeInterval = setInterval(() => {
                    this.warpAlpha = Math.max(0, this.warpAlpha - 0.15);
                    if (this.warpAlpha <= 0) {
                        clearInterval(unfadeInterval);
                        this.isWarping = false;
                    }
                }, 40);
            }
        }, 40);
    }

    // ==========================================
    // RENDERING PIPELINE CHUẨN XÁC 100% THEO ẢNH
    // ==========================================
    render() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.translate(-this.camera.x, -this.camera.y);

        const currentMapId = window.useGameStore.state.currentMapId;

        if (currentMapId === 'map1_tnu') {
            this.drawMap1_ExactScreenshot(ctx);
        } else if (currentMapId === 'map2_rose') {
            this.drawMap2_Rose(ctx);
        } else if (currentMapId === 'map3_arcade') {
            this.drawMap3_Arcade(ctx);
        } else if (currentMapId === 'map4_gift') {
            this.drawMap4_Gift(ctx);
        }

        // Portals & Biển chỉ đường
        this.drawPortals(ctx, window.MAPS_DATA[currentMapId]);

        // Thực thể
        if (currentMapId === 'map1_tnu') {
            this.mapEntities.map1_tnu.items.forEach(item => {
                item.draw(ctx, Math.hypot(this.player.x - item.x, this.player.y - item.y));
            });
            this.mapEntities.map1_tnu.npcs.forEach(npc => {
                npc.draw(ctx, Math.hypot(this.player.x - npc.x, this.player.y - npc.y));
            });
            // Đèn hải đăng nhiệm vụ (Quest Beacon) khi bấm "Đi tới"
            if (this.questNav && this.questNav.active) {
                this.drawQuestBeacon(ctx, this.questNav.targetX, this.questNav.targetY, this.questNav.name);
            }
            // Cây Ước Nguyện & Bảng Ước Nguyện 20/11 (assets/Cayuocnguyen)
            if (window.wishingManager) {
                window.wishingManager.draw(ctx, this.player);
            }
        } else if (currentMapId === 'map2_rose') {
            this.mapEntities.map2_rose.bushes.forEach(b => {
                b.draw(ctx, Math.hypot(this.player.x - b.x, this.player.y - b.y));
            });
        }

        // Người chơi & Thần thú Pet đi theo (Y-sorted: pet ở phía sau người chơi vẽ trước, ở trước vẽ sau)
        const currentPetId = window.useGameStore && window.useGameStore.state.progression.pet_hien_tai;
        if (this.player && this.player.companionPet && currentPetId) {
            const petBehind = this.player.companionPet.y < this.player.y;
            if (petBehind) this.player.companionPet.draw(ctx);
            this.player.draw(ctx);
            if (!petBehind) this.player.companionPet.draw(ctx);
        } else if (this.player) {
            this.player.draw(ctx);
        }

        // Bong bóng hội thoại của người chơi chính
        if (this.player && this.player.chatBubble && this.player.chatBubble.text) {
            this.drawLocalSpeechBubble(ctx, this.player.x, this.player.y, this.player.chatBubble.text);
        }

        // Vẽ các bạn sinh viên trực tuyến khác (Online Multiplayer Remote Players) trên cùng bản đồ
        if (window.networkManager) {
            const remotePlayers = window.networkManager.getPlayersInMap(currentMapId);
            remotePlayers.forEach(rp => {
                if (rp.companionPet && rp.petId) {
                    const pBehind = rp.companionPet.y < rp.y;
                    if (pBehind) rp.companionPet.draw(ctx);
                    rp.draw(ctx);
                    if (!pBehind) rp.companionPet.draw(ctx);
                } else {
                    rp.draw(ctx);
                }
            });
        }

        // Mũi tên la bàn dẫn đường tới mục tiêu nhiệm vụ
        if (this.questNav && this.questNav.active && currentMapId === 'map1_tnu') {
            this.drawQuestCompassArrow(ctx, this.questNav.targetX, this.questNav.targetY);
        }

        // Lồng đèn bay phấp phới trên bầu trời khuôn viên trường (assets/Hu)
        if (currentMapId === 'map1_tnu' && this.lanternsSystem) {
            this.lanternsSystem.draw(ctx, this.camera);
        }

        // Hạt hiệu ứng
        this.particleSystem.draw(ctx);

        ctx.restore();

        if (this.warpAlpha > 0) {
            ctx.fillStyle = `rgba(15, 23, 42, ${this.warpAlpha})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Cập nhật và render khung Minimap trên giao diện HUD
        if (window.minimapSystem) {
            window.minimapSystem.render(this.player, this.camera);
        }
    }

    drawLocalSpeechBubble(ctx, px, py, text) {
        ctx.save();
        ctx.translate(px, py);
        ctx.font = 'bold 12px sans-serif';
        const paddingX = 12;
        const paddingY = 6;
        const textWidth = ctx.measureText(text).width;
        const bubbleW = Math.max(70, Math.min(240, textWidth + paddingX * 2));
        const bubbleH = 26;
        const bubbleX = -bubbleW / 2;
        const bubbleY = -140;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.roundRect(bubbleX + 2, bubbleY + 2, bubbleW, bubbleH, 10);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-6, bubbleY + bubbleH);
        ctx.lineTo(0, bubbleY + bubbleH + 7);
        ctx.lineTo(6, bubbleY + bubbleH);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-6, bubbleY + bubbleH);
        ctx.lineTo(0, bubbleY + bubbleH + 7);
        ctx.lineTo(6, bubbleY + bubbleH);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let displayText = text;
        if (textWidth > bubbleW - paddingX * 2) {
            displayText = text.substring(0, 26) + '...';
        }
        ctx.fillText(displayText, 0, bubbleY + bubbleH / 2);
        ctx.restore();
    }

    drawQuestBeacon(ctx, tx, ty, name) {
        ctx.save();
        ctx.translate(tx, ty);
        const pulse = (Math.sin(this.globalTime * 6) + 1) * 0.5;

        // Vòng tròn hào quang mặt đất
        ctx.strokeStyle = `rgba(255, 209, 102, ${0.4 + pulse * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 26 + pulse * 10, 14 + pulse * 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 209, 102, ${0.15 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 22 + pulse * 8, 12 + pulse * 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Biểu tượng ghim vị trí lơ lửng
        const pinBob = Math.sin(this.globalTime * 5) * 6;
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(0, -42 + pinBob, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-7, -38 + pinBob);
        ctx.lineTo(0, -22 + pinBob);
        ctx.lineTo(7, -38 + pinBob);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -42 + pinBob, 4, 0, Math.PI * 2);
        ctx.fill();

        // Bảng tên mục tiêu dạng pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(-80, -74 + pinBob, 160, 22, 11);
        ctx.fill();
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📍 ${name}`, 0, -59 + pinBob);
        ctx.restore();
    }

    drawQuestCompassArrow(ctx, tx, ty) {
        const dx = tx - this.player.x;
        const dy = ty - this.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 75) return; // Đã gần đích

        const angle = Math.atan2(dy, dx);
        const radius = 54;
        const ax = this.player.x + Math.cos(angle) * radius;
        const ay = this.player.y + Math.sin(angle) * radius;

        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle);

        // Mũi tên chỉ hướng xanh sage & viền vàng sắc nét
        ctx.fillStyle = '#2a9d8f';
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-8, -10);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    // VẼ MAP 1 CHÍNH XÁC 100% THEO HÌNH ẢNH VECTOR MASTER MAP ĐẠI HỌC TÂY NGUYÊN
    drawMap1_ExactScreenshot(ctx) {
        const m = window.MAPS_DATA.map1_tnu;
        if (!m) return;

        // 1. VẼ ẢNH BẢN ĐỒ TOÀN CẢNH VECTOR CAMPUS CHUẨN XÁC 100% (KHỬ PIXEL, SIÊU SẮC NÉT)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (this.map1Image && this.map1Image.complete && this.map1Image.naturalWidth > 0) {
            try {
                ctx.drawImage(this.map1Image, 0, 0, m.width, m.height);
            } catch (e) {}
        } else {
            // Nền cỏ dự phòng nếu ảnh đang load
            ctx.fillStyle = '#8ec765';
            ctx.fillRect(0, 0, m.width, m.height);
        }

        // 2. VẼ BIỂN TÊN CÔNG TRÌNH TRỌNG ĐIỂM (LANDMARK BADGES)
        if (m.landmarkBadges) {
            m.landmarkBadges.forEach(b => {
                this.drawPillBadge(ctx, b.x, b.y, b.name);
            });
        }
    }

// =========================================================================
    // VẼ GIẢNG ĐƯỜNG 400 CHỖ (HỘI TRƯỜNG LỚN BÊN BỜ HỒ TỰ DO THEO GOOGLE MAPS)
    // Kiến trúc hội trường mái dốc chữ A Tây Nguyên bề thế, vách kính lớn đón sáng
    // =========================================================================
    drawGiangDuong400(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm sát chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y + height - 6, width + 8, 18, 8);
        ctx.fill();

        const baseH = 30; // Chiều cao khối đế đá bazan
        const baseY = y + height - baseH;
        const hallTopY = y + 32;

        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const bazanCap = '#65564d';
        const glassBlue = '#4e7b9b';
        const roofRed = '#cf4525';

        // 2. KHỐI THÂN HỘI TRƯỜNG CHÍNH
        ctx.fillStyle = wallCream;
        ctx.fillRect(x, hallTopY, width, baseY - hallTopY);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, hallTopY, width, baseY - hallTopY);

        // 3. KHỐI ĐẾ ĐÁ BAZAN TÂY NGUYÊN
        ctx.fillStyle = bazanDark;
        ctx.fillRect(x, baseY, width, baseH);
        ctx.strokeStyle = '#5c4d42';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, baseY, width, baseH);

        // Gờ chỉ đá ngang chân tường
        ctx.fillStyle = bazanCap;
        ctx.fillRect(x - 2, baseY, width + 4, 3);
        ctx.fillRect(x - 2, baseY + baseH - 3, width + 4, 3);

        // Các ô thoáng thông gió tầng hầm
        const ventCount = 4;
        const ventStep = width / ventCount;
        for (let v = 0; v < ventCount; v++) {
            const vx = x + v * ventStep + 8;
            const vw = ventStep - 16;
            ctx.fillStyle = '#221a15';
            ctx.fillRect(vx, baseY + 8, vw, 12);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(vx, baseY + 8, vw, 12);
        }

        // 4. MÁI DỐC CHỮ A TRUYỀN THỐNG TÂY NGUYÊN VƯƠN CAO
        const peakX = x + width / 2;
        const peakY = y - 10;

        // Bóng đổ mái dốc
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(x - 8, hallTopY + 8);
        ctx.lineTo(peakX, peakY + 8);
        ctx.lineTo(x + width + 8, hallTopY + 8);
        ctx.closePath();
        ctx.fill();

        // Mái ngói đỏ cam Tây Nguyên
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 8, hallTopY);
        ctx.lineTo(peakX, peakY);
        ctx.lineTo(x + width + 8, hallTopY);
        ctx.closePath();
        ctx.fill();

        // Diềm bê tông trắng ngà dày dặn
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 10, hallTopY);
        ctx.lineTo(peakX, peakY);
        ctx.lineTo(x + width + 10, hallTopY);
        ctx.stroke();

        // 5. ĐẦU HỒI CHỮ A VÁCH KÍNH LỚN ĐÓN SÁNG (GABLE GLASS FACADE)
        ctx.fillStyle = glassBlue;
        ctx.beginPath();
        ctx.moveTo(x + 12, hallTopY - 2);
        ctx.lineTo(peakX, peakY + 12);
        ctx.lineTo(x + width - 12, hallTopY - 2);
        ctx.closePath();
        ctx.fill();

        // Nan chia đố chữ X và tam giác đầu hồi
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(peakX, peakY + 12);
        ctx.lineTo(peakX, hallTopY - 2);
        ctx.moveTo(x + 24, hallTopY - 2);
        ctx.lineTo(peakX, peakY + 28);
        ctx.lineTo(x + width - 24, hallTopY - 2);
        ctx.stroke();

        // 6. HỆ THỐNG CỬA SỔ DỌC 2 BÊN HỘI TRƯỜNG
        const winCols = 4;
        const sideW = (width - 70) / 2;
        // Cụm cửa sổ bên trái
        for (let i = 0; i < 2; i++) {
            const wx = x + 12 + i * (sideW / 2);
            const ww = sideW / 2 - 8;
            const wy = hallTopY + 14;
            const wh = baseY - wy - 10;
            ctx.fillStyle = beamWhite;
            ctx.fillRect(wx - 1, wy - 1, ww + 2, wh + 2);
            ctx.fillStyle = glassBlue;
            ctx.fillRect(wx, wy, ww, wh);
            // Nan chia ô
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 1;
            ctx.strokeRect(wx, wy, ww, wh);
            ctx.beginPath();
            ctx.moveTo(wx, wy + wh / 2);
            ctx.lineTo(wx + ww, wy + wh / 2);
            ctx.stroke();
            // Vệt lóa nắng
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.moveTo(wx + 1.5, wy + 1.5);
            ctx.lineTo(wx + 5, wy + 1.5);
            ctx.lineTo(wx + 1.5, wy + 8);
            ctx.closePath();
            ctx.fill();
        }
        // Cụm cửa sổ bên phải
        const rightStartX = x + width - sideW - 6;
        for (let i = 0; i < 2; i++) {
            const wx = rightStartX + i * (sideW / 2);
            const ww = sideW / 2 - 8;
            const wy = hallTopY + 14;
            const wh = baseY - wy - 10;
            ctx.fillStyle = beamWhite;
            ctx.fillRect(wx - 1, wy - 1, ww + 2, wh + 2);
            ctx.fillStyle = glassBlue;
            ctx.fillRect(wx, wy, ww, wh);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 1;
            ctx.strokeRect(wx, wy, ww, wh);
            ctx.beginPath();
            ctx.moveTo(wx, wy + wh / 2);
            ctx.lineTo(wx + ww, wy + wh / 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.moveTo(wx + 1.5, wy + 1.5);
            ctx.lineTo(wx + 5, wy + 1.5);
            ctx.lineTo(wx + 1.5, wy + 8);
            ctx.closePath();
            ctx.fill();
        }

        // 7. KHỐI SẢNH ĐÓN ĐẠI HỘI TRƯỜNG CHÍNH GIỮA (MAIN ENTRANCE PORTICO)
        const porchW = 66;
        const porchX = x + (width - porchW) / 2;
        const porchY = baseY - 48;
        const porchH = 48;

        // Mái che sảnh đón bê tông trắng vươn ra
        ctx.fillStyle = beamWhite;
        ctx.fillRect(porchX - 4, porchY, porchW + 8, 6);
        ctx.fillStyle = roofRed;
        ctx.fillRect(porchX - 2, porchY - 3, porchW + 4, 3);

        // 2 Trụ cột sảnh lớn đá bazan
        ctx.fillStyle = bazanDark;
        ctx.fillRect(porchX + 2, porchY + 6, 6, porchH - 6);
        ctx.fillRect(porchX + porchW - 8, porchY + 6, 6, porchH - 6);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1;
        ctx.strokeRect(porchX + 2, porchY + 6, 6, porchH - 6);
        ctx.strokeRect(porchX + porchW - 8, porchY + 6, 6, porchH - 6);

        // Cửa kính đại sảnh mở 2 cánh lớn
        const doorX = porchX + 11;
        const doorW = porchW - 22;
        const doorY = porchY + 8;
        const doorH = porchH - 8;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(doorX, doorY, doorW, doorH);

        const doorGrad = ctx.createLinearGradient(doorX, doorY + doorH, doorX, doorY);
        doorGrad.addColorStop(0, '#ffd885');
        doorGrad.addColorStop(0.5, '#567e9c');
        doorGrad.addColorStop(1, '#2c3e50');
        ctx.fillStyle = doorGrad;
        ctx.fillRect(doorX + 1.5, doorY + 1.5, doorW - 3, doorH - 3);

        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(doorX, doorY, doorW, doorH);
        ctx.beginPath();
        ctx.moveTo(doorX + doorW / 2, doorY);
        ctx.lineTo(doorX + doorW / 2, doorY + doorH);
        ctx.stroke();

        // Bậc tam cấp đá granite rộng đón bước chân sinh viên
        ctx.fillStyle = '#423730';
        ctx.fillRect(porchX - 6, baseY + 2, porchW + 12, 4);
        ctx.fillStyle = '#55473f';
        ctx.fillRect(porchX - 2, baseY + 6, porchW + 4, 4);

        // Biển tên Pill Badge
        if (label) {
            this.drawPillBadge(ctx, peakX, y - 16, label);
        }

        ctx.restore();
    }

    // =========================================================================
    // VẼ SÂN VẬN ĐỘNG ĐẠI HỌC TÂY NGUYÊN (CHUẨN ẢNH VỆ TINH GOOGLE MAPS)
    // Sân bóng đá mặt cỏ xanh, đường chạy điền kinh oval màu cam đất nung, khán đài
    // =========================================================================
    drawStadium(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 2, width + 8, height + 8, 40);
        ctx.fill();

        // 2. Đường chạy điền kinh Oval màu cam đất nung đặc trưng
        ctx.fillStyle = '#cf5c36';
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 40);
        ctx.fill();
        ctx.strokeStyle = '#a64424';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Các làn chạy điền kinh (Running lane lines trắng)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1;
        for (let lane = 1; lane <= 3; lane++) {
            const inset = lane * 6;
            ctx.beginPath();
            ctx.roundRect(x + inset, y + inset, width - inset * 2, height - inset * 2, Math.max(10, 40 - inset));
            ctx.stroke();
        }

        // 3. Mặt sân bóng đá cỏ tự nhiên xanh mướt ở tâm
        const pitchInset = 26;
        const px = x + pitchInset;
        const py = y + pitchInset;
        const pw = width - pitchInset * 2;
        const ph = height - pitchInset * 2;

        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 8);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Các sọc cỏ đậm nhạt
        const stripes = 6;
        const stripeW = pw / stripes;
        for (let s = 0; s < stripes; s += 2) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(px + s * stripeW, py, stripeW, ph);
        }

        // Vạch kẻ sân bóng đá (Đường giữa sân, vòng tròn trung tâm, khu phạt đền)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        // Đường giữa sân
        ctx.beginPath();
        ctx.moveTo(px + pw / 2, py);
        ctx.lineTo(px + pw / 2, py + ph);
        ctx.stroke();
        // Vòng tròn trung tâm
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Vòng cấm địa 2 đầu
        const boxW = 28;
        const boxH = 40;
        // Bên trái
        ctx.strokeRect(px, py + (ph - boxH) / 2, boxW, boxH);
        // Bên phải
        ctx.strokeRect(px + pw - boxW, py + (ph - boxH) / 2, boxW, boxH);

        // Khung thành 2 đầu
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 3, py + ph / 2 - 8, 3, 16);
        ctx.fillRect(px + pw, py + ph / 2 - 8, 3, 16);

        // 4. Khán đài A có mái che phía trên
        ctx.fillStyle = '#495057';
        ctx.beginPath();
        ctx.roundRect(px + 20, y - 8, pw - 40, 10, 3);
        ctx.fill();
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(px + 22, y - 7, pw - 44, 2);

        // Biển tên Pill Badge
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 12, label);
        }

        ctx.restore();
    }

    // =========================================================================
    // HÀM VẼ TÒA NHÀ HỌC CHUẨN XÁC KIẾN TRÚC TRƯỜNG ĐH TÂY NGUYÊN CAO CẤP
    // Áp dụng cho Nhà học số 8, Nhà học số 6, Nhà học số 9, Nhà học số 5, KTX Sinh Viên, PTN
    // - Khối đế đá bazan Tây Nguyên xám sẫm tự nhiên cao cấp
    // - Thân tường vàng kem be chuẩn trường ĐH Tây Nguyên (#eae1cb)
    // - Dầm bê tông trắng phân tầng và hàng cột trắng thẳng tắp
    // - Hệ cửa sổ kính xanh phản quang lóa nắng, chia khung nhôm trắng chữ thập
    // - Mảng lan can hoa gió tam giác bê tông trắng ở các tầng trên
    // - Mái dốc ngói đỏ cam truyền thống với diềm bờ mái trắng ngà
    // - Tum kỹ thuật lam chớp hiện đại và bậc tam cấp đá hoa cương
    // =========================================================================
    drawCartoonBuilding(ctx, x, y, width, height, label, roofColor) {
        ctx.save();

        // 1. Bóng đổ mềm sát chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x - 3, y + height - 5, width + 6, 16, 7);
        ctx.fill();

        // Chiều cao khối đế đá bazan (khoảng 22% chiều cao tầng trệt)
        const baseH = Math.min(28, Math.max(18, Math.round(height * 0.18)));
        const baseY = y + height - baseH;

        // Chiều cao mái dốc
        const roofH = Math.min(28, Math.max(18, Math.round(height * 0.18)));
        const wallTopY = y + roofH;
        const wallH = baseY - wallTopY;

        // Bảng màu trường ĐH Tây Nguyên
        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const bazanBorder = '#5c4d42';
        const bazanCap = '#65564d';
        const glassBlue = '#4e7b9b';
        const rColor = roofColor || '#cf4525';

        // 2. THÂN TƯỜNG VÀNG KEM BE CHUẨN ĐH TÂY NGUYÊN
        ctx.fillStyle = wallCream;
        ctx.fillRect(x, wallTopY, width, wallH);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, wallTopY, width, wallH);

        // 3. KHỐI ĐẾ ĐÁ BAZAN TÂY NGUYÊN XÁM SẪM
        ctx.fillStyle = bazanDark;
        ctx.fillRect(x, baseY, width, baseH);
        ctx.strokeStyle = bazanBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, baseY, width, baseH);

        // Gờ đá chỉ ngang phân vị chân tường
        ctx.fillStyle = bazanCap;
        ctx.fillRect(x - 2, baseY, width + 4, 2.5);
        ctx.fillRect(x - 2, baseY + baseH - 2.5, width + 4, 2.5);

        // Ô thoáng tầng hầm
        const ventCols = Math.max(2, Math.floor(width / 40));
        const ventStep = width / ventCols;
        for (let v = 0; v < ventCols; v++) {
            const vx = x + v * ventStep + 6;
            const vw = ventStep - 12;
            ctx.fillStyle = '#221a15';
            ctx.fillRect(vx, baseY + 6, vw, 10);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(vx, baseY + 6, vw, 10);
        }

        // 4. PHÂN TẦNG VÀ HỆ THỐNG CỬA SỔ & CỘT BÊ TÔNG TRẮNG
        const floors = height >= 140 ? 3 : 2;
        const floorH = wallH / floors;
        const cols = Math.max(3, Math.floor(width / 32));
        const colW = width / cols;

        for (let f = 0; f < floors; f++) {
            const flY = wallTopY + f * floorH;

            // Dầm bê tông trắng phân tầng
            ctx.fillStyle = beamWhite;
            ctx.fillRect(x - 1, flY, width + 2, 3.5);

            // Cột bê tông trắng
            for (let c = 0; c <= cols; c++) {
                ctx.fillStyle = beamWhite;
                ctx.fillRect(x + c * colW - 1.2, flY, 2.4, floorH);
            }

            // Từng ô cửa sổ kính xanh lóa nắng
            for (let c = 0; c < cols; c++) {
                const wx = x + c * colW + 3;
                const ww = colW - 6;
                const wy = flY + 5;
                const wh = floorH - 9;

                // Khung nhôm trắng
                ctx.fillStyle = beamWhite;
                ctx.fillRect(wx - 0.8, wy - 0.8, ww + 1.6, wh + 1.6);

                // Kính xanh phản quang
                ctx.fillStyle = glassBlue;
                ctx.fillRect(wx, wy, ww, wh);

                // Nan chia đố chữ thập
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(wx + ww / 2, wy);
                ctx.lineTo(wx + ww / 2, wy + wh);
                ctx.moveTo(wx, wy + wh / 2);
                ctx.lineTo(wx + ww, wy + wh / 2);
                ctx.stroke();

                // Vệt lóa nắng góc kính
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.moveTo(wx + 1.2, wy + 1.2);
                ctx.lineTo(wx + 4.5, wy + 1.2);
                ctx.lineTo(wx + 1.2, wy + 6);
                ctx.closePath();
                ctx.fill();
            }

            // Lan can hoa gió tam giác bê tông trắng ở các tầng trên
            if (f >= 1) {
                ctx.fillStyle = beamWhite;
                for (let hx = x + 4; hx < x + width - 6; hx += 7.5) {
                    ctx.beginPath();
                    ctx.moveTo(hx, flY + floorH - 1.5);
                    ctx.lineTo(hx + 3, flY + floorH - 6);
                    ctx.lineTo(hx + 6, flY + floorH - 1.5);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }

        // 5. MÁI NGÓI DỐC TRUYỀN THỐNG ĐH TÂY NGUYÊN
        const roofPeakX = x + width / 2;
        const roofPeakY = y;

        // Bóng đổ mái dốc
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.beginPath();
        ctx.moveTo(x - 6, wallTopY + 5);
        ctx.lineTo(roofPeakX, roofPeakY + 5);
        ctx.lineTo(x + width + 6, wallTopY + 5);
        ctx.closePath();
        ctx.fill();

        // Mái dốc ngói đỏ
        ctx.fillStyle = rColor;
        ctx.beginPath();
        ctx.moveTo(x - 6, wallTopY);
        ctx.lineTo(roofPeakX, roofPeakY);
        ctx.lineTo(x + width + 6, wallTopY);
        ctx.closePath();
        ctx.fill();

        // Diềm bờ mái bê tông trắng ngà
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 8, wallTopY);
        ctx.lineTo(roofPeakX, roofPeakY);
        ctx.lineTo(x + width + 8, wallTopY);
        ctx.stroke();

        // Tum kỹ thuật lam chớp hiện đại trên đỉnh nóc
        if (width >= 120) {
            const tumW = Math.min(36, width * 0.25);
            const tumX = roofPeakX - tumW / 2;
            ctx.fillStyle = '#3a4a58';
            ctx.fillRect(tumX, roofPeakY - 7, tumW, 7);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(tumX, roofPeakY - 7, tumW, 7);
            for (let ly = roofPeakY - 5; ly < roofPeakY - 1; ly += 2) {
                ctx.beginPath();
                ctx.moveTo(tumX + 2, ly);
                ctx.lineTo(tumX + tumW - 2, ly);
                ctx.stroke();
            }
        }

        // 6. KHỐI SẢNH ĐÓN VÀ CỬA CHÍNH TẦNG 1
        const entW = Math.min(36, Math.max(24, Math.round(width * 0.22)));
        const entX = x + (width - entW) / 2;
        const entH = Math.min(26, floorH);
        const entY = baseY - entH;

        // Mái hiên sảnh bê tông trắng
        ctx.fillStyle = beamWhite;
        ctx.fillRect(entX - 3, entY, entW + 6, 4);
        ctx.fillStyle = rColor;
        ctx.fillRect(entX - 2, entY - 2, entW + 4, 2);

        // 2 Trụ cột sảnh đá bazan
        ctx.fillStyle = bazanDark;
        ctx.fillRect(entX, entY + 4, 3.5, entH - 4);
        ctx.fillRect(entX + entW - 3.5, entY + 4, 3.5, entH - 4);

        // Cửa kính sảnh mở đón sáng
        const doorX = entX + 4.5;
        const doorW = entW - 9;
        const doorY = entY + 4;
        const doorH = entH - 4;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.fillStyle = glassBlue;
        ctx.fillRect(doorX + 1, doorY + 1, doorW - 2, doorH - 2);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1;
        ctx.strokeRect(doorX, doorY, doorW, doorH);
        ctx.beginPath();
        ctx.moveTo(doorX + doorW / 2, doorY);
        ctx.lineTo(doorX + doorW / 2, doorY + doorH);
        ctx.stroke();

        // Bậc tam cấp sảnh bước lên bằng đá granite
        ctx.fillStyle = '#423730';
        ctx.fillRect(entX - 4, baseY + 1, entW + 8, 3.5);
        ctx.fillStyle = '#55473f';
        ctx.fillRect(entX - 1, baseY + 4.5, entW + 2, 3);

        // 7. Biển tên bo tròn Pill Badge màu nâu đất
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 8, label);
        }

        ctx.restore();
    }



    // =========================================================================
    // VẼ TÒA NHÀ KHOA Y DƯỢC - ĐH TÂY NGUYÊN (THEO ẢNH VỆ TINH GOOGLE MAPS)
    // Tòa nhà gập góc chữ C bao quanh Vườn hoa oval đồng tâm
    // =========================================================================
    drawKhoaYDuoc(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        // Bóng khối ngang phía Bắc
        ctx.roundRect(x - 4, y + 48, width - 40, 16, 6);
        // Bóng khối dọc phía Đông
        ctx.roundRect(x + width - 68, y + height - 6, 72, 16, 6);
        ctx.fill();

        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const glassBlue = '#4e7b9b';
        const roofRed   = '#cf4525';

        const northW = width - 70;
        const northH = 58;
        const eastW  = 62;
        const eastH  = height - 35;
        const eastX  = x + width - eastW;
        const eastY  = y + 35;

        // 2. KHỐI NGANG PHÍA BẮC (NORTH WING)
        // Thân tường
        ctx.fillStyle = wallCream;
        ctx.fillRect(x, y + 16, northW, northH - 16);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y + 16, northW, northH - 16);

        // Chân đế đá bazan
        ctx.fillStyle = bazanDark;
        ctx.fillRect(x, y + northH - 14, northW, 14);

        // Dãy cửa sổ kính xanh
        const nCols = 7;
        const nStep = (northW - 20) / nCols;
        for (let c = 0; c < nCols; c++) {
            const wx = x + 10 + c * nStep + 2;
            const wy = y + 22;
            const ww = nStep - 4;
            const wh = northH - 40;
            ctx.fillStyle = glassBlue;
            ctx.fillRect(wx, wy, ww, wh);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(wx, wy, ww, wh);
            // Lan can hoa gió tam giác
            ctx.fillStyle = beamWhite;
            for (let hx = wx; hx < wx + ww - 3; hx += 5) {
                ctx.beginPath();
                ctx.moveTo(hx, wy + wh);
                ctx.lineTo(hx + 2.5, wy + wh - 4);
                ctx.lineTo(hx + 5, wy + wh);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Mái dốc ngói đỏ cam khối ngang
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 6, y + 18);
        ctx.lineTo(x + northW / 2, y);
        ctx.lineTo(x + northW + 10, y + 18);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = beamWhite;
        ctx.fillRect(x - 8, y + 16, northW + 16, 3);

        // 3. KHỐI VÁT CHÉO CHUYỂN GÓC (CORNER BEND 45 ĐỘ)
        ctx.fillStyle = '#dfd6be';
        ctx.beginPath();
        ctx.moveTo(x + northW - 10, y + 16);
        ctx.lineTo(x + width, y + 16);
        ctx.lineTo(eastX + eastW, eastY + 30);
        ctx.lineTo(eastX, eastY + 30);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x + northW - 14, y + 18);
        ctx.lineTo(x + width - 10, y - 4);
        ctx.lineTo(eastX + eastW + 6, eastY + 32);
        ctx.closePath();
        ctx.fill();

        // 4. KHỐI DỌC PHÍA ĐÔNG (EAST WING)
        ctx.fillStyle = wallCream;
        ctx.fillRect(eastX, eastY, eastW, eastH);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(eastX, eastY, eastW, eastH);

        // Chân đế đá bazan khối dọc
        ctx.fillStyle = bazanDark;
        ctx.fillRect(eastX, y + height - 16, eastW, 16);

        // Cửa sổ kính dọc
        const eRows = 4;
        const eStep = (eastH - 30) / eRows;
        for (let r = 0; r < eRows; r++) {
            const ewy = eastY + 12 + r * eStep;
            ctx.fillStyle = glassBlue;
            ctx.fillRect(eastX + 8, ewy, eastW - 16, eStep - 6);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(eastX + 8, ewy, eastW - 16, eStep - 6);
        }

        // Mái dốc khối dọc
        ctx.fillStyle = roofRed;
        ctx.fillRect(eastX - 4, eastY - 2, 6, eastH + 4);
        ctx.fillStyle = beamWhite;
        ctx.fillRect(eastX - 6, eastY - 2, 3, eastH + 4);

        // Biển hiệu chính
        const badgeW = 145;
        const badgeH = 22;
        const badgeX = x + 30;
        const badgeY = y - 10;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.roundRect(badgeX + 1, badgeY + 1, badgeW, badgeH, 5);
        ctx.fill();
        ctx.fillStyle = '#1b4332'; // Xanh y dược đậm
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 5);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️ KHOA Y DƯỢC - TNU', badgeX + badgeW / 2, badgeY + badgeH / 2);

        ctx.restore();
    }

    // =========================================================================
    // VẼ BỆNH VIỆN THỰC HÀNH TNU (CƠ SỞ Y TẾ CÓ GHIM CHỮ H MÀU ĐỎ SÁT LÊ DUẨN)
    // =========================================================================
    drawHospitalBuilding(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y + height - 6, width + 8, 16, 6);
        ctx.fill();

        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const glassBlue = '#4e7b9b';
        const roofRed   = '#cf4525';

        // Khối chữ L: Đoạn ngang sát Lê Duẩn và đoạn dọc phía Đông
        const mainH = 65;
        const mainY = y + height - mainH;
        const wingW = 65;
        const wingX = x + width - wingW;

        // Thân đoạn ngang
        ctx.fillStyle = wallCream;
        ctx.fillRect(x, mainY, width, mainH);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, mainY, width, mainH);

        // Thân đoạn dọc phía Đông
        ctx.fillStyle = wallCream;
        ctx.fillRect(wingX, y, wingW, height);
        ctx.strokeRect(wingX, y, wingW, height);

        // Chân đế đá bazan
        ctx.fillStyle = bazanDark;
        ctx.fillRect(x, y + height - 16, width, 16);

        // Cửa sổ và lan can hoa gió trắng
        const hCols = 5;
        const hStep = (width - wingW) / hCols;
        for (let c = 0; c < hCols; c++) {
            const hwx = x + 10 + c * hStep;
            const hwy = mainY + 12;
            ctx.fillStyle = glassBlue;
            ctx.fillRect(hwx, hwy, hStep - 12, mainH - 34);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(hwx, hwy, hStep - 12, mainH - 34);
        }

        // Mái dốc đỏ cam
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 6, mainY);
        ctx.lineTo(x + width / 2, mainY - 14);
        ctx.lineTo(x + width + 6, mainY);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(wingX - 4, y);
        ctx.lineTo(wingX + wingW / 2, y - 12);
        ctx.lineTo(wingX + wingW + 6, y);
        ctx.closePath();
        ctx.fill();

        // BIỂU TƯỢNG GHIM TRÒN ĐỎ CHỮ [ H ] BỆNH VIỆN NỔI BẬT (CHUẨN GOOGLE MAPS)
        const pinX = x + 35;
        const pinY = mainY - 26;
        const pinR = 15;

        // Bóng đổ ghim
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(pinX + 2, pinY + 2, pinR, 0, Math.PI * 2);
        ctx.fill();

        // Vòng tròn đỏ bệnh viện
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(pinX, pinY, pinR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Chữ "H" trắng in hoa đậm nét
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H', pinX, pinY + 0.5);

        // Biển hiệu
        this.drawPillBadge(ctx, x + width / 2, mainY - 8, '🏥 BỆNH VIỆN THỰC HÀNH TNU');

        ctx.restore();
    }

    // =========================================================================
    // VẼ NHÀ HỌC SỐ 9 ('9' ĐỎ - GÓC TÂY NAM ĐƯỜNG LÊ DUẨN THEO GOOGLE MAPS)
    // Tòa nhà dài uốn cong nhẹ theo đường Lê Duẩn và Hẻm 96 Y Wang
    // =========================================================================
    drawNhaHocSo9(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 2, y + height - 5, width + 4, 16, 7);
        ctx.fill();

        const baseH = 26;
        const baseY = y + height - baseH;
        const bendW = 85; // Đoạn uốn cong nhẹ bên trái
        const mainW = width - bendW; // 175px đoạn thẳng bên phải
        const bendX = x + bendW;

        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const bazanCap  = '#65564d';
        const glassBlue = '#4e7b9b';
        const roofRed   = '#cf4525';

        // 2. KHỐI THÂN NHÀ 4 TẦNG
        const roofH = 26;
        const wallTopY = y + roofH;
        const wallH = baseY - wallTopY;
        const floorH = wallH / 4;

        // Thân tường đoạn nghiêng nhẹ bên trái
        ctx.fillStyle = '#dfd5be';
        ctx.beginPath();
        ctx.moveTo(x, wallTopY + 8);
        ctx.lineTo(bendX, wallTopY);
        ctx.lineTo(bendX, baseY);
        ctx.lineTo(x, baseY + 6);
        ctx.closePath();
        ctx.fill();

        // Thân tường đoạn chính bên phải
        ctx.fillStyle = wallCream;
        ctx.fillRect(bendX, wallTopY, mainW, wallH);

        // Khối đế đá Bazan Tây Nguyên
        ctx.fillStyle = bazanDark;
        ctx.beginPath();
        ctx.moveTo(x, baseY + 6);
        ctx.lineTo(bendX, baseY);
        ctx.lineTo(x + width, baseY);
        ctx.lineTo(x + width, baseY + baseH);
        ctx.lineTo(bendX, baseY + baseH);
        ctx.lineTo(x, baseY + baseH + 6);
        ctx.closePath();
        ctx.fill();

        // Gờ chỉ đá ngang chân tường
        ctx.strokeStyle = bazanCap;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, baseY + 6);
        ctx.lineTo(bendX, baseY);
        ctx.lineTo(x + width, baseY);
        ctx.stroke();

        // 4 Tầng hành lang & cửa sổ phòng học
        for (let fl = 0; fl < 4; fl++) {
            const flY = wallTopY + fl * floorH;

            // Dầm bê tông trắng phân tầng
            ctx.fillStyle = beamWhite;
            ctx.fillRect(bendX, flY, mainW, 3.5);
            ctx.beginPath();
            ctx.moveTo(x, flY + 8);
            ctx.lineTo(bendX, flY);
            ctx.lineTo(bendX, flY + 3.5);
            ctx.lineTo(x, flY + 11.5);
            ctx.closePath();
            ctx.fill();

            // Cửa sổ kính xanh đoạn chính
            const winCols = 6;
            const winStep = mainW / winCols;
            for (let c = 0; c < winCols; c++) {
                const wx = bendX + c * winStep + 5;
                const ww = winStep - 10;
                const wy = flY + 6;
                const wh = floorH - 10;

                ctx.fillStyle = glassBlue;
                ctx.fillRect(wx, wy, ww, wh);
                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, ww, wh);

                // Lan can hoa gió tam giác bê tông trắng ở tầng 2, 3, 4
                if (fl > 0) {
                    ctx.fillStyle = beamWhite;
                    for (let hx = wx; hx < wx + ww - 4; hx += 7) {
                        ctx.beginPath();
                        ctx.moveTo(hx, flY + floorH - 1);
                        ctx.lineTo(hx + 3, flY + floorH - 6);
                        ctx.lineTo(hx + 6, flY + floorH - 1);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }

        // 3. MÁI DỐC NGÓI ĐỎ CAM TRUYỀN THỐNG
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 4, wallTopY + 8);
        ctx.lineTo(bendX, wallTopY - 14);
        ctx.lineTo(x + width + 4, wallTopY - 14);
        ctx.lineTo(x + width + 4, wallTopY);
        ctx.lineTo(bendX, wallTopY);
        ctx.closePath();
        ctx.fill();

        // Diềm bờ mái trắng ngà
        ctx.fillStyle = beamWhite;
        ctx.fillRect(bendX - 2, wallTopY - 2, mainW + 6, 3);
        ctx.beginPath();
        ctx.moveTo(x - 5, wallTopY + 8);
        ctx.lineTo(bendX, wallTopY);
        ctx.lineTo(bendX, wallTopY + 3);
        ctx.lineTo(x - 5, wallTopY + 11);
        ctx.closePath();
        ctx.fill();

        // Biển hiệu
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 8, label);
        }

        ctx.restore();
    }

    // =========================================================================
    // VẼ NHÀ HỌC SỐ 8 ('8' ĐỎ - Ở GIỮA BÊN TRÁI MẶT ĐƯỜNG LÊ DUẨN)
    // Tòa nhà dài có đoạn gãy góc chữ V tù nhẹ ở giữa, 4 tầng hành lang hoa gió
    // =========================================================================
    drawNhaHocSo8(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 2, y + height - 5, width + 4, 16, 7);
        ctx.fill();

        const baseH = 26;
        const baseY = y + height - baseH;
        const midX = x + width / 2; // Điểm gập chữ V ở giữa
        const vOffset = 8; // Độ lệch gãy chữ V

        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const bazanCap  = '#65564d';
        const glassBlue = '#4e7b9b';
        const roofRed   = '#cf4525';

        const roofH = 26;
        const wallTopY = y + roofH;
        const wallH = baseY - wallTopY;
        const floorH = wallH / 4;

        // 2. THÂN TƯỜNG GÃY CHỮ V NHẸ
        ctx.fillStyle = '#dfd6c0';
        ctx.beginPath();
        ctx.moveTo(x, wallTopY + vOffset);
        ctx.lineTo(midX, wallTopY);
        ctx.lineTo(x + width, wallTopY + vOffset);
        ctx.lineTo(x + width, baseY + vOffset);
        ctx.lineTo(midX, baseY);
        ctx.lineTo(x, baseY + vOffset);
        ctx.closePath();
        ctx.fill();

        // Khối đế đá Bazan
        ctx.fillStyle = bazanDark;
        ctx.beginPath();
        ctx.moveTo(x, baseY + vOffset);
        ctx.lineTo(midX, baseY);
        ctx.lineTo(x + width, baseY + vOffset);
        ctx.lineTo(x + width, baseY + baseH + vOffset);
        ctx.lineTo(midX, baseY + baseH);
        ctx.lineTo(x, baseY + baseH + vOffset);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = bazanCap;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, baseY + vOffset);
        ctx.lineTo(midX, baseY);
        ctx.lineTo(x + width, baseY + vOffset);
        ctx.stroke();

        // 4 Tầng lớp học
        for (let fl = 0; fl < 4; fl++) {
            const flY = wallTopY + fl * floorH;

            // Dầm bê tông trắng chạy theo chữ V
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(x, flY + vOffset);
            ctx.lineTo(midX, flY);
            ctx.lineTo(x + width, flY + vOffset);
            ctx.stroke();

            // Cửa sổ kính xanh cánh trái và cánh phải
            const halfCols = 4;
            const leftW = (width / 2);
            const step = leftW / halfCols;

            // Cánh trái
            for (let c = 0; c < halfCols; c++) {
                const t0 = (c + 0.15) / halfCols;
                const t1 = (c + 0.85) / halfCols;
                const wx0 = x + t0 * leftW;
                const wx1 = x + t1 * leftW;
                const wy0 = flY + 5 + (1 - t0) * vOffset;
                const wy1 = flY + 5 + (1 - t1) * vOffset;

                ctx.fillStyle = glassBlue;
                ctx.beginPath();
                ctx.moveTo(wx0, wy0);
                ctx.lineTo(wx1, wy1);
                ctx.lineTo(wx1, wy1 + floorH - 9);
                ctx.lineTo(wx0, wy0 + floorH - 9);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Lan can hoa gió tam giác
                if (fl > 0) {
                    ctx.fillStyle = beamWhite;
                    for (let hx = wx0; hx < wx1 - 3; hx += 6) {
                        ctx.beginPath();
                        ctx.moveTo(hx, wy0 + floorH - 9);
                        ctx.lineTo(hx + 2.5, wy0 + floorH - 14);
                        ctx.lineTo(hx + 5, wy0 + floorH - 9);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }

            // Cánh phải
            for (let c = 0; c < halfCols; c++) {
                const t0 = (c + 0.15) / halfCols;
                const t1 = (c + 0.85) / halfCols;
                const wx0 = midX + t0 * leftW;
                const wx1 = midX + t1 * leftW;
                const wy0 = flY + 5 + t0 * vOffset;
                const wy1 = flY + 5 + t1 * vOffset;

                ctx.fillStyle = glassBlue;
                ctx.beginPath();
                ctx.moveTo(wx0, wy0);
                ctx.lineTo(wx1, wy1);
                ctx.lineTo(wx1, wy1 + floorH - 9);
                ctx.lineTo(wx0, wy0 + floorH - 9);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Lan can hoa gió tam giác
                if (fl > 0) {
                    ctx.fillStyle = beamWhite;
                    for (let hx = wx0; hx < wx1 - 3; hx += 6) {
                        ctx.beginPath();
                        ctx.moveTo(hx, wy0 + floorH - 9);
                        ctx.lineTo(hx + 2.5, wy0 + floorH - 14);
                        ctx.lineTo(hx + 5, wy0 + floorH - 9);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }

        // 3. MÁI NGÓI ĐỎ CAM DỐC CHỮ V
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 4, wallTopY + vOffset);
        ctx.lineTo(midX, wallTopY - 14);
        ctx.lineTo(x + width + 4, wallTopY + vOffset);
        ctx.lineTo(x + width, wallTopY + vOffset - 2);
        ctx.lineTo(midX, wallTopY - 2);
        ctx.lineTo(x, wallTopY + vOffset - 2);
        ctx.closePath();
        ctx.fill();

        // Khối sảnh trung tâm vươn cao ở giữa
        ctx.fillStyle = beamWhite;
        ctx.fillRect(midX - 16, wallTopY - 10, 32, 8);
        ctx.fillStyle = glassBlue;
        ctx.fillRect(midX - 12, wallTopY - 8, 24, 6);

        // Biển hiệu
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 8, label);
        }

        ctx.restore();
    }

    // =========================================================================
    // VẼ DÃY NHÀ HỌC SỐ 2 ('2' KHOANH TRÒN ĐỎ - NGAY PHÍA SAU NHÀ ĐIỀU HÀNH 'TT')
    // Dãy giảng đường dài 440px phương ngang Đông - Tây, 4 tầng uy nghi
    // =========================================================================
    drawNhaHocSo2(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm lớn dưới chân dãy nhà 2
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 3, y + height - 5, width + 6, 16, 7);
        ctx.fill();

        const baseH = 26;
        const baseY = y + height - baseH;
        const wallCream = '#eae1cb';
        const beamWhite = '#ffffff';
        const bazanDark = '#433830';
        const bazanCap  = '#65564d';
        const glassBlue = '#4e7b9b';
        const roofRed   = '#cf4525';

        const roofH = 24;
        const wallTopY = y + roofH;
        const wallH = baseY - wallTopY;
        const floorH = wallH / 3; // 3 tầng giảng đường trần cao bề thế

        // 2. THÂN TƯỜNG DÃY NHÀ CHÍNH
        ctx.fillStyle = wallCream;
        ctx.fillRect(x, wallTopY, width, wallH);
        ctx.strokeStyle = '#d7cbb1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, wallTopY, width, wallH);

        // Khối đế đá Bazan Tây Nguyên chạy suốt 440px
        ctx.fillStyle = bazanDark;
        ctx.fillRect(x, baseY, width, baseH);
        ctx.strokeStyle = '#5c4d42';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, baseY, width, baseH);

        // Gờ chỉ đá ngang chân tường
        ctx.fillStyle = bazanCap;
        ctx.fillRect(x - 2, baseY, width + 4, 3);
        ctx.fillRect(x - 2, baseY + baseH - 3, width + 4, 3);

        // Các ô thoáng hầm kỹ thuật
        const ventCount = 10;
        const ventStep = width / ventCount;
        for (let v = 0; v < ventCount; v++) {
            const vx = x + v * ventStep + 8;
            const vw = ventStep - 16;
            ctx.fillStyle = '#221a15';
            ctx.fillRect(vx, baseY + 7, vw, 11);
        }

        // Khối sảnh trung tâm vươn nhô ra phía trước
        const centerHallW = 70;
        const centerHallX = x + (width - centerHallW) / 2;
        ctx.fillStyle = '#f5eedb';
        ctx.fillRect(centerHallX, wallTopY - 4, centerHallW, wallH + 4);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(centerHallX, wallTopY - 4, centerHallW, wallH + 4);

        // 3 TẦNG GIẢNG ĐƯỜNG TRUYỀN THỐNG
        for (let fl = 0; fl < 3; fl++) {
            const flY = wallTopY + fl * floorH;

            // Dầm console bê tông trắng vươn rộng
            ctx.fillStyle = beamWhite;
            ctx.fillRect(x - 3, flY, width + 6, 4);

            // Cột bê tông trắng thẳng tắp
            const colCount = 14;
            const colStep = width / colCount;
            for (let c = 0; c <= colCount; c++) {
                ctx.fillStyle = beamWhite;
                ctx.fillRect(x + c * colStep - 1.5, flY, 3, floorH);
            }

            // Cửa sổ kính xanh phản quang lóa nắng
            for (let c = 0; c < colCount; c++) {
                const cx = x + c * colStep + 4;
                const cw = colStep - 8;
                const cy = flY + 7;
                const ch = floorH - 12;

                ctx.fillStyle = glassBlue;
                ctx.fillRect(cx, cy, cw, ch);
                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1;
                ctx.strokeRect(cx, cy, cw, ch);

                // Nan chữ thập ô kính
                ctx.beginPath();
                ctx.moveTo(cx + cw / 2, cy);
                ctx.lineTo(cx + cw / 2, cy + ch);
                ctx.stroke();

                // Lan can hoa gió tam giác bê tông trắng ở tầng 2 và 3
                if (fl > 0) {
                    ctx.fillStyle = beamWhite;
                    for (let hx = cx; hx < cx + cw - 3; hx += 7) {
                        ctx.beginPath();
                        ctx.moveTo(hx, flY + floorH - 1);
                        ctx.lineTo(hx + 3, flY + floorH - 6);
                        ctx.lineTo(hx + 6, flY + floorH - 1);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }

        // Sảnh bước tam cấp trung tâm bằng đá granite
        ctx.fillStyle = '#423730';
        ctx.fillRect(centerHallX + 10, baseY + 2, centerHallW - 20, 5);
        ctx.fillStyle = '#65564d';
        ctx.fillRect(centerHallX + 14, baseY + 7, centerHallW - 28, 4);

        // Cửa chính sảnh 2 cánh kính lớn
        ctx.fillStyle = '#223843';
        ctx.fillRect(centerHallX + 18, baseY - 24, centerHallW - 36, 24);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(centerHallX + 18, baseY - 24, centerHallW - 36, 24);

        // 3. MÁI NGÓI ĐỎ CAM TRUYỀN THỐNG DỐC LỚN
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(x - 8, wallTopY);
        ctx.lineTo(x + width / 2, wallTopY - 18);
        ctx.lineTo(x + width + 8, wallTopY);
        ctx.closePath();
        ctx.fill();

        // Diềm bê tông trắng ngà dày
        ctx.fillStyle = beamWhite;
        ctx.fillRect(x - 10, wallTopY - 2, width + 20, 4);

        // 2 Tum kỹ thuật thông gió trên nóc
        const tum1X = x + width * 0.25;
        const tum2X = x + width * 0.75;
        [tum1X, tum2X].forEach(tx => {
            ctx.fillStyle = '#3a4a58';
            ctx.fillRect(tx - 18, wallTopY - 14, 36, 10);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(tx - 18, wallTopY - 14, 36, 10);
        });

        // Biển hiệu trang trọng màu đỏ viền vàng: "🏛️ NHÀ HỌC SỐ 2"
        const badgeW = 120;
        const badgeH = 22;
        const badgeX = x + (width - badgeW) / 2;
        const badgeY = wallTopY - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.roundRect(badgeX + 1, badgeY + 1, badgeW, badgeH, 5);
        ctx.fill();

        ctx.fillStyle = '#7a1c1c';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 5);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️ NHÀ HỌC SỐ 2', badgeX + badgeW / 2, badgeY + badgeH / 2);

        ctx.restore();
    }

    // =========================================================================
    // VẼ NHÀ THI ĐẤU ĐA NĂNG TNU (MÁI VÒM BÊN PHẢI SÂN VẬN ĐỘNG)
    // Kiến trúc thể thao hiện đại, mái vòm thép không gian xám xanh uốn lượn
    // =========================================================================
    drawNhaThiDau(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ chân công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 2, y + height - 5, width + 4, 16, 8);
        ctx.fill();

        const baseH = 24;
        const baseY = y + height - baseH;
        const archTopY = y + 10;

        // Thân dưới tường bê tông xám hiện đại
        ctx.fillStyle = '#d8e2dc';
        ctx.fillRect(x, archTopY + 30, width, baseY - (archTopY + 30));
        ctx.strokeStyle = '#b0c4b1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, archTopY + 30, width, baseY - (archTopY + 30));

        // Khối đế đá bazan xám
        ctx.fillStyle = '#423d3a';
        ctx.fillRect(x, baseY, width, baseH);

        // MÁI VÒM THỂ THAO UỐN CONG (Curved Arch Roof)
        ctx.fillStyle = '#4a7c8f';
        ctx.beginPath();
        ctx.moveTo(x - 6, archTopY + 34);
        ctx.quadraticCurveTo(x + width / 2, archTopY - 12, x + width + 6, archTopY + 34);
        ctx.closePath();
        ctx.fill();

        // Các gân sườn kết cấu mái vòm
        ctx.strokeStyle = '#7fa9bd';
        ctx.lineWidth = 2;
        for (let rx = x + 20; rx < x + width - 10; rx += 25) {
            ctx.beginPath();
            ctx.moveTo(rx, archTopY + 34);
            const t = (rx - x) / width;
            const ry = archTopY - 12 + 46 * 4 * (t - 0.5) * (t - 0.5);
            ctx.lineTo(rx, ry);
            ctx.stroke();
        }

        // Vách kính lấy sáng lớn sảnh thể thao
        const glassW = width - 40;
        const glassX = x + 20;
        ctx.fillStyle = '#2a4d5e';
        ctx.fillRect(glassX, archTopY + 38, glassW, 35);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(glassX, archTopY + 38, glassW, 35);

        // Nan chia ô kính thể thao
        for (let gx = glassX + 15; gx < glassX + glassW; gx += 15) {
            ctx.beginPath();
            ctx.moveTo(gx, archTopY + 38);
            ctx.lineTo(gx, archTopY + 73);
            ctx.stroke();
        }

        // Biển tên
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 8, label);
        }

        ctx.restore();
    }

    // VẼ TÒA NHÀ ĐIỀU HÀNH TRUNG TÂM CHUẨN XÁC 100% THEO ẢNH CHỤP THỰC TẾ ĐH TÂY NGUYÊN
    drawAdminBuilding(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm lớn dưới chân toàn bộ công trình
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y + height - 6, width + 8, 22, 10);
        ctx.fill();

        // CẤU TRÚC 5 PHÂN VỊ ĐỐI XỨNG THEO ĐÚNG ẢNH THỰC TẾ (Căn giữa hoàn hảo trong width: 360px)
        const leftTowerW = 70;       // Tháp cánh trái (4 cột cửa sổ)
        const leftConnectW = 32;     // Khối nối trái (2 cột cửa sổ)
        const centerTowerW = 144;    // Tháp trung tâm cao nhất (7 cột cửa sổ + nan lam)
        const rightConnectW = 32;    // Khối nối phải (2 cột cửa sổ)
        const rightTowerW = 70;      // Tháp cánh phải (4 cột cửa sổ)

        const startX = x + Math.round((width - (leftTowerW + leftConnectW + centerTowerW + rightConnectW + rightTowerW)) / 2); // x + 6
        const leftTowerX = startX;
        const leftConnectX = leftTowerX + leftTowerW;
        const centerTowerX = leftConnectX + leftConnectW;
        const rightConnectX = centerTowerX + centerTowerW;
        const rightTowerX = rightConnectX + rightConnectW;

        // Cao độ các khối
        const baseH = 36; // Chiều cao khối đế tầng 1 đá granite sẫm
        const baseY = y + height - baseH;

        const wallTopY_Center = y + 8;      // Khối giữa vươn cao nhất (7 tầng + tum louver)
        const wallTopY_Sides = y + 22;      // Hai tháp cánh thấp hơn 1 tầng
        const wallTopY_Connect = y + 26;    // Hai khối nối thụt nhẹ

        // Màu sắc chuẩn theo ảnh thực tế ĐH Tây Nguyên
        const wallColor = '#eae1cb';        // Vàng kem be đặc trưng của tường trường ĐH Tây Nguyên
        const wallShadow = '#dcd2bb';       // Màu mảng tường khuất bóng
        const finColor = '#fbf7ee';         // Màu cột lam bê tông đứng nổi sáng
        const graniteColor = '#50443d';     // Đá granite nâu xám sẫm tầng trệt
        const graniteBorder = '#3c322c';    // Viền đá granite
        const glassColor = '#4e7b9b';       // Kính phản quang xanh dương
        const frameColor = '#ffffff';       // Khung nhôm trắng

        // 2. KHỐI ĐẾ TẦNG 1 (MÀU ĐÁ GRANITE NÂU XÁM SẪM ĐẶC TRƯNG CHÂN TƯỜNG)
        ctx.fillStyle = graniteColor;
        ctx.fillRect(leftTowerX, baseY, leftTowerW, baseH);
        ctx.fillRect(leftConnectX, baseY, leftConnectW, baseH);
        ctx.fillRect(centerTowerX, baseY, centerTowerW, baseH);
        ctx.fillRect(rightConnectX, baseY, rightConnectW, baseH);
        ctx.fillRect(rightTowerX, baseY, rightTowerW, baseH);

        // Viền và đường mạch đá granite tầng 1
        ctx.strokeStyle = graniteBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, baseY, width - (startX - x) * 2, baseH);

        // Đường gờ đá chỉ ngang chân tường
        ctx.fillStyle = '#65564d';
        ctx.fillRect(startX - 2, baseY, width - (startX - x) * 2 + 4, 3);
        ctx.fillRect(startX - 2, baseY + baseH - 3, width - (startX - x) * 2 + 4, 3);

        // Rãnh phân vị ngang tầng trệt
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, baseY + baseH / 2);
        ctx.lineTo(startX + width - (startX - x) * 2, baseY + baseH / 2);
        ctx.stroke();

        // Cửa sổ nhỏ chân tường tầng 1 (khung trắng, kính xanh)
        const drawBaseWindow = (wx, wy) => {
            ctx.fillStyle = frameColor;
            ctx.fillRect(wx - 1, wy - 1, 11, 13);
            ctx.fillStyle = glassColor;
            ctx.fillRect(wx, wy, 9, 11);
            ctx.fillStyle = frameColor;
            ctx.fillRect(wx + 4, wy, 1, 11);
        };
        // Tháp trái (4 ô cửa sổ nhỏ)
        drawBaseWindow(leftTowerX + 5, baseY + 14);
        drawBaseWindow(leftTowerX + 22, baseY + 14);
        drawBaseWindow(leftTowerX + 39, baseY + 14);
        drawBaseWindow(leftTowerX + 56, baseY + 14);
        // Khối nối trái (2 ô)
        drawBaseWindow(leftConnectX + 5, baseY + 14);
        drawBaseWindow(leftConnectX + 19, baseY + 14);
        // Khối nối phải (2 ô)
        drawBaseWindow(rightConnectX + 5, baseY + 14);
        drawBaseWindow(rightConnectX + 19, baseY + 14);
        // Tháp phải (4 ô cửa sổ nhỏ)
        drawBaseWindow(rightTowerX + 5, baseY + 14);
        drawBaseWindow(rightTowerX + 22, baseY + 14);
        drawBaseWindow(rightTowerX + 39, baseY + 14);
        drawBaseWindow(rightTowerX + 56, baseY + 14);

        // 3. THÂN TƯỜNG CÁC TẦNG TRÊN (TẦNG 2 ĐẾN 7: VÀNG KEM BE THEO ẢNH THẬT)
        // Vẽ tường 5 khối với sắc thái tạo chiều sâu
        ctx.fillStyle = wallShadow;
        ctx.fillRect(leftConnectX, wallTopY_Connect, leftConnectW, baseY - wallTopY_Connect);
        ctx.fillRect(rightConnectX, wallTopY_Connect, rightConnectW, baseY - wallTopY_Connect);

        ctx.fillStyle = wallColor;
        ctx.fillRect(leftTowerX, wallTopY_Sides, leftTowerW, baseY - wallTopY_Sides);
        ctx.fillRect(centerTowerX, wallTopY_Center, centerTowerW, baseY - wallTopY_Center);
        ctx.fillRect(rightTowerX, wallTopY_Sides, rightTowerW, baseY - wallTopY_Sides);

        // Viền tinh tế ngăn cách các khối
        ctx.strokeStyle = '#c9bfa7';
        ctx.lineWidth = 1;
        ctx.strokeRect(leftTowerX, wallTopY_Sides, leftTowerW, baseY - wallTopY_Sides);
        ctx.strokeRect(centerTowerX, wallTopY_Center, centerTowerW, baseY - wallTopY_Center);
        ctx.strokeRect(rightTowerX, wallTopY_Sides, rightTowerW, baseY - wallTopY_Sides);

        // 4. HỆ THỐNG CỬA SỔ CHUẨN XÁC 19 CỘT DỌC (4 + 2 + 7 + 2 + 4)
        const drawWindowColumn = (colX, startY, floors, stepY, winW = 10, winH = 12) => {
            for (let f = 0; f < floors; f++) {
                const wy = startY + f * stepY;

                // Khung nhôm trắng viền ngoài
                ctx.fillStyle = frameColor;
                ctx.fillRect(colX - 1, wy - 1, winW + 2, winH + 2);

                // Kính xanh phản quang
                ctx.fillStyle = glassColor;
                ctx.fillRect(colX, wy, winW, winH);

                // Khung chia đố cửa hình chữ thập
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(colX + Math.round(winW / 2), wy);
                ctx.lineTo(colX + Math.round(winW / 2), wy + winH);
                ctx.moveTo(colX, wy + Math.round(winH / 2));
                ctx.lineTo(colX + winW, wy + Math.round(winH / 2));
                ctx.stroke();

                // Vết lóa nắng góc kính
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.moveTo(colX + 1.5, wy + 1.5);
                ctx.lineTo(colX + 4.5, wy + 1.5);
                ctx.lineTo(colX + 1.5, wy + 4.5);
                ctx.closePath();
                ctx.fill();
            }
        };

        const sideStepY = 19;
        const sideStartY = wallTopY_Sides + 12;

        // Tháp cánh trái: 4 cột cửa sổ (tầng 2 đến 7 = 6 tầng)
        for (let i = 0; i < 4; i++) {
            drawWindowColumn(leftTowerX + 5 + i * 17, sideStartY, 6, sideStepY, 10, 12);
        }
        // Khối nối trái: 2 cột cửa sổ (6 tầng)
        for (let i = 0; i < 2; i++) {
            drawWindowColumn(leftConnectX + 5 + i * 14, sideStartY + 2, 6, sideStepY, 9, 12);
        }
        // Khối trung tâm: 7 cột cửa sổ (6 tầng bên dưới dải louver)
        const centerStepY = 19;
        const centerStartY = wallTopY_Center + 32;
        for (let i = 0; i < 7; i++) {
            drawWindowColumn(centerTowerX + 13 + i * 18, centerStartY, 6, centerStepY, 10, 12);
        }
        // Khối nối phải: 2 cột cửa sổ (6 tầng)
        for (let i = 0; i < 2; i++) {
            drawWindowColumn(rightConnectX + 5 + i * 14, sideStartY + 2, 6, sideStepY, 9, 12);
        }
        // Tháp cánh phải: 4 cột cửa sổ (6 tầng)
        for (let i = 0; i < 4; i++) {
            drawWindowColumn(rightTowerX + 5 + i * 17, sideStartY, 6, sideStepY, 10, 12);
        }

        // CÁC CỘT LAM BÊ TÔNG ĐỨNG (VERTICAL FINS) NỔI BẬT THEO ĐÚNG ẢNH THẬT
        const drawVerticalFins = (startXFin, count, step, topY, botY) => {
            for (let i = 0; i < count; i++) {
                const fx = startXFin + i * step;
                // Bóng đổ nhẹ bên phải cột fin
                ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
                ctx.fillRect(fx + 2.5, topY, 1.5, botY - topY);
                // Thân cột fin trắng sáng
                ctx.fillStyle = finColor;
                ctx.fillRect(fx, topY, 2.5, botY - topY);
            }
        };
        // Fins tháp trái (5 cột kẹp giữa 4 ô cửa sổ)
        drawVerticalFins(leftTowerX + 2, 5, 17, wallTopY_Sides + 6, baseY - 2);
        // Fins tháp phải (5 cột kẹp giữa 4 ô cửa sổ)
        drawVerticalFins(rightTowerX + 2, 5, 17, wallTopY_Sides + 6, baseY - 2);
        // Fins khối trung tâm (8 cột kẹp giữa 7 ô cửa sổ)
        drawVerticalFins(centerTowerX + 9, 8, 18, wallTopY_Center + 28, baseY - 2);

        // 5. BA MÁI BẰNG CHÌA RỘNG (3 FLOATING CANTILEVER FLAT ROOFS - NÉT ĐẶC TRƯNG NHẤT)
        const drawFloatingFlatRoof = (rx, ry, rw, rh) => {
            // Bóng đổ mái chìa xuống tường
            ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
            ctx.fillRect(rx, ry + rh, rw, 6);

            // Dải đệm áp mái
            ctx.fillStyle = '#bdae95';
            ctx.fillRect(rx + 4, ry + rh - 3, rw - 8, 3);

            // Tấm mái bê tông trắng ngà
            ctx.fillStyle = '#f7f1e4';
            ctx.fillRect(rx, ry, rw, rh - 2);

            // Viền chỉ mái
            ctx.strokeStyle = '#d6c8b0';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(rx, ry, rw, rh - 2);

            // Gờ phản chiếu ánh sáng trên đỉnh mái
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(rx + 2, ry + 1, rw - 4, 2.5);
        };

        // Mái bằng tháp cánh trái (nhô rộng 10px mỗi bên)
        drawFloatingFlatRoof(leftTowerX - 8, wallTopY_Sides - 10, leftTowerW + 16, 12);

        // Mái bằng tháp cánh phải (nhô rộng 10px mỗi bên)
        drawFloatingFlatRoof(rightTowerX - 8, wallTopY_Sides - 10, rightTowerW + 16, 12);

        // Mái bằng tháp trung tâm (vươn cao nhất và rộng nhất)
        drawFloatingFlatRoof(centerTowerX - 10, wallTopY_Center - 14, centerTowerW + 20, 15);

        // HÀNG NAN LAM DỌC CHẮN NẮNG (VERTICAL LOUVERS) DƯỚI MÁI KHỐI TRUNG TÂM THEO ẢNH
        const louverCount = 15;
        const louverStep = (centerTowerW - 12) / louverCount;
        ctx.fillStyle = '#dfd2b7';
        ctx.fillRect(centerTowerX + 4, wallTopY_Center + 1, centerTowerW - 8, 26);
        for (let i = 0; i < louverCount; i++) {
            const lx = centerTowerX + 6 + i * louverStep;
            // Khe bóng tối giữa các nan
            ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
            ctx.fillRect(lx + 4, wallTopY_Center + 2, 2, 24);
            // Nan bê tông dọc
            ctx.fillStyle = '#f3ecdd';
            ctx.fillRect(lx, wallTopY_Center + 2, 4, 24);
            ctx.strokeStyle = '#d5c7ad';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(lx, wallTopY_Center + 2, 4, 24);
        }

        // 6. KHỐI SẢNH ĐÓN MÁI BẰNG (PORTICO CANOPY) VỚI 2 TRỤ GRANITE KHỔNG LỒ
        const canopyW = 124;
        const canopyX = centerTowerX + Math.round((centerTowerW - canopyW) / 2); // Căn chính giữa tháp trung tâm
        const canopyY = baseY - 24;
        const canopyH = 14;

        // Bóng đổ đậm của sảnh đón phía trước
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.fillRect(canopyX - 6, canopyY + canopyH, canopyW + 12, baseH + 18);

        // Hai cột trụ vuông granite khổng lồ nâng đỡ sảnh đón
        const pillarW = 20;
        const pillarH = baseH + 18;
        const pillarY = canopyY + canopyH;
        const pillarL = canopyX + 14;
        const pillarR = canopyX + canopyW - 14 - pillarW;

        const drawGranitePillar = (px) => {
            // Thân cột đá hoa cương xám đen sẫm
            ctx.fillStyle = '#443831';
            ctx.fillRect(px, pillarY, pillarW, pillarH);
            ctx.strokeStyle = '#2d241f';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px, pillarY, pillarW, pillarH);

            // Khối đế chân cột nở rộng
            ctx.fillStyle = '#5c4c43';
            ctx.fillRect(px - 2, pillarY + pillarH - 6, pillarW + 4, 6);

            // Vết bóng sáng bóng kính granite
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.fillRect(px + 2, pillarY, 3, pillarH - 6);
        };
        drawGranitePillar(pillarL);
        drawGranitePillar(pillarR);

        // Vách kính đại sảnh lớn trong suốt (phía sau 2 cột trụ sảnh)
        const hallGlassX = pillarL + pillarW + 4;
        const hallGlassW = pillarR - hallGlassX - 4;
        const hallGlassY = pillarY;
        const hallGlassH = pillarH - 6;

        ctx.fillStyle = '#1c2229';
        ctx.fillRect(hallGlassX, hallGlassY, hallGlassW, hallGlassH);

        // Ánh đèn vàng ấm áp hắt ra từ bên trong đại sảnh
        const hallLightGrad = ctx.createLinearGradient(hallGlassX, hallGlassY + hallGlassH, hallGlassX, hallGlassY);
        hallLightGrad.addColorStop(0, '#ffdf94');
        hallLightGrad.addColorStop(0.5, '#6a8ea8');
        hallLightGrad.addColorStop(1, '#2b3947');
        ctx.fillStyle = hallLightGrad;
        ctx.fillRect(hallGlassX + 2, hallGlassY + 2, hallGlassW - 4, hallGlassH - 4);

        // Cửa kính mở 2 cánh trung tâm
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(hallGlassX + hallGlassW / 2 - 14, hallGlassY + hallGlassH - 24, 28, 24);
        ctx.beginPath();
        ctx.moveTo(hallGlassX + hallGlassW / 2, hallGlassY + hallGlassH - 24);
        ctx.lineTo(hallGlassX + hallGlassW / 2, hallGlassY + hallGlassH);
        ctx.stroke();

        // MÁI BẰNG SẢNH ĐÓN (CANOPY TRẮNG NGÀ CHÌA RA PHÍA TRƯỚC)
        ctx.fillStyle = '#f8f4e8';
        ctx.fillRect(canopyX, canopyY, canopyW, canopyH);
        ctx.strokeStyle = '#d7cabb';
        ctx.lineWidth = 2;
        ctx.strokeRect(canopyX, canopyY, canopyW, canopyH);

        // Gờ sáng đỉnh mái canopy và gờ viền chân
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(canopyX + 2, canopyY + 1, canopyW - 4, 3);
        ctx.fillStyle = '#c5b69f';
        ctx.fillRect(canopyX, canopyY + canopyH - 3, canopyW, 3);

        // BẬC TAM CẤP RỘNG LỚN BẰNG ĐÁ GRANITE ĐEN XÁM
        const stairW = canopyW + 28;
        const stairX = canopyX - 14;
        const stairY = pillarY + pillarH - 4;
        ctx.fillStyle = '#322a24';
        ctx.fillRect(stairX, stairY, stairW, 4);
        ctx.fillStyle = '#423730';
        ctx.fillRect(stairX + 6, stairY + 4, stairW - 12, 4);
        ctx.fillStyle = '#55473f';
        ctx.fillRect(stairX + 12, stairY + 8, stairW - 24, 4);

        // HAI CÂY TÙNG NÓN XANH TRANG TRÍ HAI BÊN BẬC CẤP (THEO ẢNH THẬT)
        const drawCypressTree = (tx, ty) => {
            // Bóng đổ
            ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
            ctx.beginPath();
            ctx.ellipse(tx, ty + 2, 8, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Chậu cây / bồn hoa tròn chân tường
            ctx.fillStyle = '#6d5a4d';
            ctx.beginPath();
            ctx.roundRect(tx - 7, ty - 3, 14, 6, 2);
            ctx.fill();

            // Cây tùng hình tháp 3 tầng tán xanh lá sẫm
            const tiers = [
                { y: ty - 4, w: 14, h: 10 },
                { y: ty - 12, w: 11, h: 9 },
                { y: ty - 19, w: 7, h: 10 }
            ];
            tiers.forEach((t, idx) => {
                ctx.fillStyle = idx === 2 ? '#245235' : (idx === 1 ? '#2b5f3d' : '#234f33');
                ctx.beginPath();
                ctx.moveTo(tx, t.y - t.h);
                ctx.lineTo(tx + t.w / 2, t.y);
                ctx.lineTo(tx - t.w / 2, t.y);
                ctx.closePath();
                ctx.fill();

                // Mảng sáng xanh lá tươi
                ctx.fillStyle = '#3a7d52';
                ctx.beginPath();
                ctx.moveTo(tx, t.y - t.h);
                ctx.lineTo(tx + t.w / 2 - 1, t.y);
                ctx.lineTo(tx, t.y);
                ctx.closePath();
                ctx.fill();
            });
        };
        drawCypressTree(stairX - 8, stairY + 6);
        drawCypressTree(stairX + stairW + 8, stairY + 6);

        // 7. HAI CỘT ĐÈN CỔ ĐIỂN CHÙM 3 BÓNG TRÒN TRẮNG PHÁT SÁNG (THEO ẢNH THẬT)
        const drawClassicLampPost = (lx, ly) => {
            ctx.strokeStyle = '#1e2126';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx, ly - 36);
            // Tay đèn sắt nghệ thuật uốn lượn sang 2 bên
            ctx.arc(lx - 6, ly - 36, 6, 0, Math.PI, true);
            ctx.moveTo(lx, ly - 31);
            ctx.arc(lx + 6, ly - 31, 6, Math.PI, 0, false);
            ctx.stroke();

            // Chân đế cột đèn
            ctx.fillStyle = '#2c3038';
            ctx.fillRect(lx - 3, ly - 3, 6, 4);

            // 3 bóng đèn tròn trắng
            const globes = [
                { x: lx, y: ly - 43 },
                { x: lx - 12, y: ly - 36 },
                { x: lx + 12, y: ly - 31 }
            ];
            globes.forEach(g => {
                // Hào quang tỏa sáng mềm mại
                const glow = ctx.createRadialGradient(g.x, g.y, 1, g.x, g.y, 10);
                glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(g.x, g.y, 10, 0, Math.PI * 2);
                ctx.fill();

                // Quả cầu ngọc trắng sáng
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(g.x, g.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#9ca6b2';
                ctx.lineWidth = 0.6;
                ctx.stroke();
            });
        };
        // Cột đèn đặt ở vị trí thoáng đãng 2 bên sân trước sảnh đón
        drawClassicLampPost(canopyX - 36, stairY + 12);
        drawClassicLampPost(canopyX + canopyW + 36, stairY + 12);

        // 8. BIỂN HIỆU BO TRÒN "NHÀ ĐIỀU HÀNH TRUNG TÂM"
        if (label) {
            this.drawPillBadge(ctx, x + width / 2, y - 24, label);
        }

        ctx.restore();
    }

    // =========================================================================
    // VẼ TÒA NHÀ HỌC SỐ 7 CHUẨN XÁC 100% CẤU TRÚC THỰC TẾ ĐH TÂY NGUYÊN
    // - XÓA HOÀN TOÀN PHẦN VIỀN VÀNG/NỀN VÀNG THỪA THÃI BAO QUANH
    // - CẤU TRÚC PHỐI CẢNH 3D GÓC NGHIÊNG CHỮ L 135 ĐỘ ĐẲNG CẤP VÀ TINH TẾ
    // 1. Cánh nghiêng bên trái: Hành lang 4 tầng mở, lan can hoa gió tam giác trắng,
    //    cột trắng, cửa lớp kính xanh lóa nắng, dầm console vươn rộng
    // 2. Tháp góc khuỷu ở giữa: Mảng hoa gió tam giác trắng vươn cao từ tầng 1 lên tum
    // 3. Cánh bên phải: Khối sảnh đón mái tam giác ngói đỏ Tây Nguyên & đầu hồi chữ A,
    //    nối tiếp dãy giảng đường 4 tầng hiện đại
    // 4. Khối đế đá bazan Tây Nguyên xám nâu tự nhiên, chỉ gờ phân vị ngang cao cấp
    // 5. Biển hiệu "🏛️ NHÀ HỌC SỐ 7" & Pano đỏ chữ vàng trang trọng
    // 6. Mặt đường và thảm cỏ xanh sạch sẽ, không có dải sọc đỏ trắng
    // =========================================================================
    drawNhaHocSo7(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm sát chân toàn bộ công trình (Không vẽ viền vàng nền sân thừa)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 2, y + height - 6, width + 4, 18, 8);
        ctx.fill();

        // PHÂN BỔ KÍCH THƯỚC PHỐI CẢNH 3D GÓC BẺ CHỮ L 135 ĐỘ:
        // Cánh nghiêng (bên trái): 120px
        // Tháp góc khuỷu hoa gió (ở giữa): 40px
        // Cánh chính bên phải & Sảnh đón: width - 160px (~135px)
        const angledW = 120;
        const cornerW = 40;
        const mainW = width - (angledW + cornerW); // ~135px

        const leftEdgeX = x + 4;
        const cornerX = leftEdgeX + angledW;
        const mainX = cornerX + cornerW;

        const baseH = 28; // Chiều cao khối đế đá bazan Tây Nguyên
        const baseY = y + height - baseH;

        // BẢNG MÀU CAO CẤP CHUẨN XÁC ĐH TÂY NGUYÊN (ĐỒNG BỘ VỚI NHÀ ĐIỀU HÀNH)
        const wallLightCream = '#eae1cb';   // Vàng kem be sáng (Cánh phải đón sáng)
        const wallShadeWarm  = '#d6c6a5';   // Vàng kem be nghiêng (Cánh trái đón bóng)
        const hallwayInner   = '#cbbda0';   // Lòng hành lang đổ bóng sâu
        const beamWhite      = '#ffffff';   // Dầm nan console bê tông trắng tinh
        const bazanDark      = '#433830';   // Đá bazan Tây Nguyên xám nâu tự nhiên
        const bazanBorder    = '#5c4d42';   // Viền mạch đá bazan
        const bazanCap       = '#65564d';   // Gờ đá chỉ ngang
        const glassBlue      = '#4e7b9b';   // Kính xanh dương phản quang cao cấp
        const roofRed        = '#cf4525';   // Ngói đỏ cam dốc truyền thống Tây Nguyên

        // =====================================================================
        // PHẦN 1: CÁNH NGHIÊNG BÊN TRÁI (3D PERSPECTIVE ANGLED WING - GÓC BẺ 135 ĐỘ)
        // Hành lang mở 4 tầng có lan can hoa gió tam giác trắng và cửa lớp học
        // =====================================================================
        const cornerTopY = y + 18;
        const leftTopY = y + 36;
        const leftBaseY = baseY - 12;

        // Thân tường lòng hành lang cánh nghiêng
        ctx.fillStyle = hallwayInner;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX, leftTopY);
        ctx.lineTo(cornerX, cornerTopY);
        ctx.lineTo(cornerX, baseY);
        ctx.lineTo(leftEdgeX, leftBaseY);
        ctx.closePath();
        ctx.fill();

        // Khối đế đá bazan cánh nghiêng vát chéo phối cảnh 3D
        ctx.fillStyle = bazanDark;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX, leftBaseY);
        ctx.lineTo(cornerX, baseY);
        ctx.lineTo(cornerX, baseY + baseH);
        ctx.lineTo(leftEdgeX, leftBaseY + baseH);
        ctx.closePath();
        ctx.fill();

        // Gờ chỉ đá ngang phân vị chân tường cánh nghiêng
        ctx.strokeStyle = bazanCap;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX - 2, leftBaseY);
        ctx.lineTo(cornerX, baseY);
        ctx.stroke();

        ctx.strokeStyle = bazanBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX - 2, leftBaseY + baseH);
        ctx.lineTo(cornerX, baseY + baseH);
        ctx.stroke();

        // Ô thoáng hầm cánh nghiêng
        const subVentCount = 4;
        for (let sv = 0; sv < subVentCount; sv++) {
            const svt0 = (sv + 0.2) / subVentCount;
            const svt1 = (sv + 0.8) / subVentCount;
            const svx0 = leftEdgeX + svt0 * (cornerX - leftEdgeX);
            const svx1 = leftEdgeX + svt1 * (cornerX - leftEdgeX);
            const svy0 = leftBaseY + 6 + svt0 * (baseY - leftBaseY);
            const svy1 = leftBaseY + 6 + svt1 * (baseY - leftBaseY);

            ctx.fillStyle = '#221a15';
            ctx.beginPath();
            ctx.moveTo(svx0, svy0);
            ctx.lineTo(svx1, svy1);
            ctx.lineTo(svx1, svy1 + 12);
            ctx.lineTo(svx0, svy0 + 12);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 4 Tầng hành lang cánh nghiêng: Cửa phòng học + Cột bê tông trắng + Lan can hoa gió
        const numAngledFloors = 4;
        const numBays = 4; // 4 nhịp cột trên cánh nghiêng

        for (let fl = 0; fl < numAngledFloors; fl++) {
            const t0 = fl / numAngledFloors;
            const t1 = (fl + 1) / numAngledFloors;

            const flTopLeftY  = leftTopY + t0 * (leftBaseY - leftTopY);
            const flTopRightY = cornerTopY + t0 * (baseY - cornerTopY);

            const flBotLeftY  = leftTopY + t1 * (leftBaseY - leftTopY);
            const flBotRightY = cornerTopY + t1 * (baseY - cornerTopY);

            // Tường hậu phía trong hành lang
            ctx.fillStyle = wallShadeWarm;
            ctx.beginPath();
            ctx.moveTo(leftEdgeX, flTopLeftY + 4);
            ctx.lineTo(cornerX, flTopRightY + 4);
            ctx.lineTo(cornerX, flBotRightY);
            ctx.lineTo(leftEdgeX, flBotLeftY);
            ctx.closePath();
            ctx.fill();

            // Cửa lớp học bên trong hành lang (Kính xanh phản quang lóa nắng)
            for (let b = 0; b < numBays; b++) {
                const bt0 = (b + 0.25) / numBays;
                const bt1 = (b + 0.75) / numBays;
                const bx0 = leftEdgeX + bt0 * (cornerX - leftEdgeX);
                const bx1 = leftEdgeX + bt1 * (cornerX - leftEdgeX);
                const byTop0 = flTopLeftY + 6.5 + bt0 * (flTopRightY - flTopLeftY);
                const byTop1 = flTopLeftY + 6.5 + bt1 * (flTopRightY - flTopLeftY);
                const byBot0 = flBotLeftY - 3 + bt0 * (flBotRightY - flBotLeftY);
                const byBot1 = flBotLeftY - 3 + bt1 * (flBotRightY - flBotLeftY);

                ctx.fillStyle = glassBlue;
                ctx.beginPath();
                ctx.moveTo(bx0, byTop0);
                ctx.lineTo(bx1, byTop1);
                ctx.lineTo(bx1, byBot1);
                ctx.lineTo(bx0, byBot0);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Vệt lóa nắng
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.moveTo(bx0 + 1.5, byTop0 + 1);
                ctx.lineTo(bx0 + 5.5, byTop0 + 1);
                ctx.lineTo(bx0 + 1.5, byBot0 - 2);
                ctx.closePath();
                ctx.fill();
            }

            // Hệ cột bê tông trắng phân chia các nhịp hành lang
            ctx.fillStyle = beamWhite;
            for (let b = 0; b <= numBays; b++) {
                const bt = b / numBays;
                const colX = leftEdgeX + bt * (cornerX - leftEdgeX);
                const colTopY = flTopLeftY + bt * (flTopRightY - flTopLeftY);
                const colBotY = flBotLeftY + bt * (flBotRightY - flBotLeftY);

                ctx.fillRect(colX - 1.5, colTopY, 3, colBotY - colTopY);
            }

            // Dầm console bê tông trắng vươn rộng (Cantilever slab) vát chéo
            ctx.fillStyle = beamWhite;
            ctx.beginPath();
            ctx.moveTo(leftEdgeX - 6, flTopLeftY);
            ctx.lineTo(cornerX, flTopRightY);
            ctx.lineTo(cornerX, flTopRightY + 4.5);
            ctx.lineTo(leftEdgeX - 6, flTopLeftY + 4.5);
            ctx.closePath();
            ctx.fill();

            // Đổ bóng mềm dưới dầm sàn
            ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
            ctx.beginPath();
            ctx.moveTo(leftEdgeX - 6, flTopLeftY + 4.5);
            ctx.lineTo(cornerX, flTopRightY + 4.5);
            ctx.lineTo(cornerX, flTopRightY + 7);
            ctx.lineTo(leftEdgeX - 6, flTopLeftY + 7);
            ctx.closePath();
            ctx.fill();

            // Lan can hoa gió tam giác bê tông trắng ở tầng 2, 3 và 4 (Ảnh thực tế)
            if (fl >= 1) {
                // Khung lan can trắng
                ctx.fillStyle = beamWhite;
                for (let tx = leftEdgeX + 4; tx < cornerX - 4; tx += 8.5) {
                    const ratio = (tx - leftEdgeX) / (cornerX - leftEdgeX);
                    const ty = flBotLeftY - 2 + ratio * (flBotRightY - flBotLeftY);
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(tx + 3.5, ty - 6);
                    ctx.lineTo(tx + 7, ty);
                    ctx.closePath();
                    ctx.fill();

                    // Lỗ hổng tam giác
                    ctx.fillStyle = '#485563';
                    ctx.beginPath();
                    ctx.moveTo(tx + 1.5, ty - 0.5);
                    ctx.lineTo(tx + 3.5, ty - 4.5);
                    ctx.lineTo(tx + 5.5, ty - 0.5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = beamWhite;
                }

                // Tay vịn lan can trắng chạy suốt
                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(leftEdgeX, flBotLeftY - 6.5);
                ctx.lineTo(cornerX, flBotRightY - 6.5);
                ctx.stroke();
            }
        }

        // Mảng hoa gió tam giác ở đầu hồi ngoài cùng bên trái (Chuẩn ảnh thực tế)
        const gableW = 20;
        const gableTopY = leftTopY + 12;
        const gableBotY = leftBaseY;
        ctx.fillStyle = beamWhite;
        ctx.fillRect(leftEdgeX - 5, gableTopY, gableW, gableBotY - gableTopY);
        for (let gy = gableTopY + 4; gy < gableBotY - 6; gy += 9) {
            for (let gx = leftEdgeX - 3; gx < leftEdgeX + gableW - 8; gx += 8.5) {
                ctx.fillStyle = '#3a4854';
                ctx.beginPath();
                ctx.moveTo(gx, gy + 7);
                ctx.lineTo(gx + 3.5, gy + 1);
                ctx.lineTo(gx + 7, gy + 7);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Dầm console mái vát chéo chìa rộng che chở cánh nghiêng
        ctx.fillStyle = beamWhite;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX - 10, leftTopY - 3);
        ctx.lineTo(cornerX + 4, cornerTopY - 5);
        ctx.lineTo(cornerX + 4, cornerTopY);
        ctx.lineTo(leftEdgeX - 10, leftTopY + 5);
        ctx.closePath();
        ctx.fill();

        // Lớp diềm ngói đỏ trên mép dầm mái cánh nghiêng
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(leftEdgeX - 8, leftTopY - 4);
        ctx.lineTo(cornerX + 2, cornerTopY - 7);
        ctx.lineTo(cornerX + 4, cornerTopY - 4.5);
        ctx.lineTo(leftEdgeX - 8, leftTopY - 1);
        ctx.closePath();
        ctx.fill();

        // =====================================================================
        // PHẦN 2: THÁP GÓC KHUỶU 135 ĐỘ - HOA GIÓ TAM GIÁC XUYÊN SUỐT (ẢNH THỰC TẾ)
        // =====================================================================
        // Vệt bóng đổ giao tuyến góc gập 135 độ
        const cornerShadeGrad = ctx.createLinearGradient(cornerX - 8, 0, cornerX + 10, 0);
        cornerShadeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
        cornerShadeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.12)');
        cornerShadeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cornerShadeGrad;
        ctx.fillRect(cornerX - 8, cornerTopY - 6, 18, baseY - cornerTopY + baseH + 6);

        // THÁP GÓC HOA GIÓ TAM GIÁC TRẮNG VƯƠN CAO
        const towerTopY = y + 8; // Vươn cao hơn 2 cánh
        ctx.fillStyle = '#f4eedf';
        ctx.fillRect(cornerX, towerTopY, cornerW, baseY - towerTopY);

        // Khối đế tháp góc đá bazan
        ctx.fillStyle = bazanDark;
        ctx.fillRect(cornerX, baseY, cornerW, baseH);
        ctx.strokeStyle = bazanBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(cornerX, baseY, cornerW, baseH);

        // Mạng lưới hoa gió tam giác bê tông trắng xuyên suốt tháp góc từ tầng 1 lên tầng 4
        for (let rowY = towerTopY + 10; rowY < baseY - 10; rowY += 10) {
            for (let colX = cornerX + 3; colX < cornerX + cornerW - 5; colX += 9.5) {
                ctx.fillStyle = beamWhite;
                ctx.beginPath();
                ctx.moveTo(colX, rowY + 7.5);
                ctx.lineTo(colX + 4, rowY);
                ctx.lineTo(colX + 8, rowY + 7.5);
                ctx.closePath();
                ctx.fill();

                // Lõi rỗng thông gió sâu
                ctx.fillStyle = '#3a4854';
                ctx.beginPath();
                ctx.moveTo(colX + 1.8, rowY + 6.5);
                ctx.lineTo(colX + 4, rowY + 2);
                ctx.lineTo(colX + 6.2, rowY + 6.5);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Dầm console mái che phẳng trên nóc tháp góc
        ctx.fillStyle = beamWhite;
        ctx.beginPath();
        ctx.roundRect(cornerX - 4, towerTopY - 4, cornerW + 8, 5, 2);
        ctx.fill();

        // Tum louver kỹ thuật trên nóc tháp góc
        ctx.fillStyle = '#3a4a58';
        ctx.fillRect(cornerX + 6, towerTopY - 12, cornerW - 12, 8);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1;
        ctx.strokeRect(cornerX + 6, towerTopY - 12, cornerW - 12, 8);
        for (let ly = towerTopY - 10; ly < towerTopY - 4; ly += 2.5) {
            ctx.beginPath();
            ctx.moveTo(cornerX + 7, ly);
            ctx.lineTo(cornerX + cornerW - 7, ly);
            ctx.stroke();
        }

        // =====================================================================
        // PHẦN 3: CÁNH CHÍNH BÊN PHẢI (MAIN WING) VÀ KHỐI SẢNH ĐÓN MÁI DỐC NGÓI ĐỎ
        // =====================================================================
        const mainTopY = y + 18;
        const mainH = baseY - mainTopY;
        const mainFloors = 4;
        const mainFloorH = mainH / mainFloors;

        // Thân tường kem phẳng sáng đón nắng
        ctx.fillStyle = wallLightCream;
        ctx.fillRect(mainX, mainTopY, mainW, mainH);

        // Khối đế đá bazan Tây Nguyên cánh chính
        ctx.fillStyle = bazanDark;
        ctx.fillRect(mainX, baseY, mainW, baseH);
        ctx.strokeStyle = bazanBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mainX, baseY, mainW, baseH);

        // Gờ đá chỉ ngang chân tường cánh chính
        ctx.fillStyle = bazanCap;
        ctx.fillRect(mainX - 2, baseY, mainW + 4, 3);
        ctx.fillRect(mainX - 2, baseY + baseH - 3, mainW + 4, 3);

        // Các ô cửa thoáng thông gió tầng hầm trên cánh chính
        const mainVentCount = 5;
        const ventSpacing = mainW / mainVentCount;
        for (let mv = 0; mv < mainVentCount; mv++) {
            const vx = mainX + mv * ventSpacing + 5;
            const vw = ventSpacing - 10;
            ctx.fillStyle = '#221a15';
            ctx.fillRect(vx, baseY + 7, vw, 12);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            ctx.strokeRect(vx, baseY + 7, vw, 12);
            ctx.beginPath();
            ctx.moveTo(vx, baseY + 13);
            ctx.lineTo(vx + vw, baseY + 13);
            ctx.stroke();
        }

        // =====================================================================
        // KHỐI SẢNH ĐÓN MÁI DỐC NGÓI ĐỎ & ĐẦU HỒI CHỮ A VÁCH KÍNH (ẢNH THỰC TẾ)
        // Nằm tiếp giáp tháp góc, rộng 52px
        // =====================================================================
        const porchW = 52;
        const porchH = 56;
        const porchX = mainX + 2;
        const porchY = baseY - porchH + 8;

        // ĐẦU HỒI CHỮ A VÁCH KÍNH TRẮNG VƯƠN CAO Ở TẦNG 3-4 (ẢNH THỰC TẾ)
        const gableTopX = porchX + porchW / 2;
        const gableTopY_Right = mainTopY - 14;

        ctx.fillStyle = beamWhite;
        ctx.beginPath();
        ctx.moveTo(porchX - 2, mainTopY + mainFloorH * 2);
        ctx.lineTo(gableTopX, gableTopY_Right);
        ctx.lineTo(porchX + porchW + 2, mainTopY + mainFloorH * 2);
        ctx.closePath();
        ctx.fill();

        // Vách kính chữ A
        ctx.fillStyle = glassBlue;
        ctx.beginPath();
        ctx.moveTo(porchX + 4, mainTopY + mainFloorH * 2 - 2);
        ctx.lineTo(gableTopX, gableTopY_Right + 6);
        ctx.lineTo(porchX + porchW - 4, mainTopY + mainFloorH * 2 - 2);
        ctx.closePath();
        ctx.fill();

        // Khung chia đố chữ A
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(gableTopX, gableTopY_Right + 6);
        ctx.lineTo(gableTopX, mainTopY + mainFloorH * 2 - 2);
        ctx.stroke();

        // MÁI TAM GIÁC NGÓI ĐỎ TÂY NGUYÊN SẢNH ĐÓN NHÔ RA TRƯỚC Ở TẦNG 1-2
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(porchX - 6, porchY + 20);
        ctx.lineTo(porchX + porchW / 2, porchY - 8);
        ctx.lineTo(porchX + porchW + 6, porchY + 20);
        ctx.closePath();
        ctx.fill();

        // Diềm mái console bê tông trắng dày & nan hoa gió chữ A
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(porchX - 7, porchY + 20);
        ctx.lineTo(porchX + porchW / 2, porchY - 8);
        ctx.lineTo(porchX + porchW + 7, porchY + 20);
        ctx.stroke();

        ctx.fillStyle = beamWhite;
        ctx.beginPath();
        ctx.moveTo(porchX + 11, porchY + 18);
        ctx.lineTo(porchX + porchW / 2, porchY);
        ctx.lineTo(porchX + porchW - 11, porchY + 18);
        ctx.closePath();
        ctx.fill();

        // 2 Cột sảnh ốp đá granite xám
        ctx.fillStyle = bazanDark;
        ctx.fillRect(porchX + 4, porchY + 20, 6, porchH - 20);
        ctx.fillRect(porchX + porchW - 10, porchY + 20, 6, porchH - 20);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1;
        ctx.strokeRect(porchX + 4, porchY + 20, 6, porchH - 20);
        ctx.strokeRect(porchX + porchW - 10, porchY + 20, 6, porchH - 20);

        // Cửa kính lớn đón tiếp vào sảnh
        const pgX = porchX + 13;
        const pgY = porchY + 26;
        const pgW = porchW - 26;
        const pgH = porchH - 26;
        ctx.fillStyle = glassBlue;
        ctx.fillRect(pgX, pgY, pgW, pgH);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(pgX, pgY, pgW, pgH);

        // Vệt lóa nắng cửa kính sảnh
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(pgX + 2, pgY + 1);
        ctx.lineTo(pgX + 7, pgY + 1);
        ctx.lineTo(pgX + 2, pgY + pgH - 2);
        ctx.closePath();
        ctx.fill();

        // Bậc tam cấp sảnh bước lên bằng đá granite
        ctx.fillStyle = '#6e5e52';
        ctx.fillRect(porchX + 6, baseY + 2, porchW - 12, 4);
        ctx.fillStyle = '#8f7e71';
        ctx.fillRect(porchX + 3, baseY + 6, porchW - 6, 4);

        // =====================================================================
        // DÃY PHÒNG HỌC CÁNH PHẢI (TỪ PHẢI SẢNH ĐẾN HẾT TÒA NHÀ)
        // =====================================================================
        const classZoneX = porchX + porchW + 2;
        const classZoneW = (mainX + mainW) - classZoneX;
        const classCols = 3;
        const classColW = classZoneW / classCols;

        for (let fl = 0; fl < mainFloors; fl++) {
            const flY = mainTopY + fl * mainFloorH;

            // Dầm bê tông trắng phân tầng vươn rộng
            ctx.fillStyle = beamWhite;
            ctx.fillRect(classZoneX - 2, flY, classZoneW + 6, 4.5);

            // Cột bê tông trắng
            for (let c = 0; c <= classCols; c++) {
                ctx.fillStyle = beamWhite;
                ctx.fillRect(classZoneX + c * classColW - 1.5, flY, 3, mainFloorH);
            }

            // Từng ô cửa sổ đôi khung nhôm trắng, kính xanh phản quang lóa nắng
            for (let c = 0; c < classCols; c++) {
                const cx = classZoneX + c * classColW + 3;
                const cw = classColW - 6;
                const cy = flY + 7;
                const ch = mainFloorH - 11;

                ctx.fillStyle = glassBlue;
                ctx.fillRect(cx, cy, cw, ch);
                ctx.strokeStyle = beamWhite;
                ctx.lineWidth = 1.2;
                ctx.strokeRect(cx, cy, cw, ch);

                // Nan chia đố chữ thập
                ctx.beginPath();
                ctx.moveTo(cx + cw / 2, cy);
                ctx.lineTo(cx + cw / 2, cy + ch);
                ctx.moveTo(cx, cy + ch / 2);
                ctx.lineTo(cx + cw, cy + ch / 2);
                ctx.stroke();

                // Vệt phản chiếu ánh nắng lóa chéo
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.moveTo(cx + 1.5, cy + 1);
                ctx.lineTo(cx + 5, cy + 1);
                ctx.lineTo(cx + 1.5, cy + ch - 2);
                ctx.closePath();
                ctx.fill();

                // Ô thoáng gió phía trên
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillRect(cx + 1, cy + 1, cw - 2, 2.5);
            }

            // Lan can hoa gió tam giác ở tầng 2 và 3
            if (fl === 1 || fl === 2) {
                ctx.fillStyle = beamWhite;
                for (let hx = classZoneX + 2; hx < classZoneX + classZoneW - 4; hx += 8) {
                    ctx.beginPath();
                    ctx.moveTo(hx, flY + mainFloorH - 2);
                    ctx.lineTo(hx + 3.5, flY + mainFloorH - 7);
                    ctx.lineTo(hx + 7, flY + mainFloorH - 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }

        // Dầm console mái vươn rộng che toàn bộ cánh chính
        ctx.fillStyle = beamWhite;
        ctx.fillRect(mainX - 4, mainTopY - 4, mainW + 10, 5);

        // Lớp ngói đỏ cam chạy trên mép mái cánh chính
        ctx.fillStyle = roofRed;
        ctx.fillRect(mainX - 2, mainTopY - 6.5, mainW + 6, 2.5);

        // Tum louver kỹ thuật hiện đại trên nóc cánh chính (như Nhà điều hành)
        ctx.fillStyle = '#3a4a58';
        ctx.fillRect(classZoneX + 10, mainTopY - 14, classZoneW - 20, 9);
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1;
        ctx.strokeRect(classZoneX + 10, mainTopY - 14, classZoneW - 20, 9);
        for (let ly = mainTopY - 12; ly < mainTopY - 6; ly += 2.5) {
            ctx.beginPath();
            ctx.moveTo(classZoneX + 11, ly);
            ctx.lineTo(classZoneX + classZoneW - 11, ly);
            ctx.stroke();
        }

        // =====================================================================
        // BIỂN HIỆU VÀ PANO KHẨU HIỆU TRANG TRỌNG
        // =====================================================================
        // 1. Biển hiệu chính "🏛️ NHÀ HỌC SỐ 7" gắn trên trán dầm cánh trái
        const badgeW = 96;
        const badgeH = 19;
        const badgeX = leftEdgeX + (angledW - badgeW) / 2 + 6;
        const badgeY = leftTopY + 10;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.roundRect(badgeX + 1, badgeY + 1, badgeW, badgeH, 4);
        ctx.fill();

        ctx.fillStyle = '#7a1c1c';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️ NHÀ HỌC SỐ 7', badgeX + badgeW / 2, badgeY + badgeH / 2);

        // 2. Pano khẩu hiệu đỏ chữ vàng trang trọng (Gắn trên trán tầng 2 khối lớp học)
        const panoW = 38;
        const panoH = 46;
        const panoX = mainX + mainW - panoW - 4;
        const panoY = mainTopY + mainFloorH + 4;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(panoX + 1, panoY + 1, panoW, panoH);

        ctx.fillStyle = '#8b0000';
        ctx.fillRect(panoX, panoY, panoW, panoH);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(panoX, panoY, panoW, panoH);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NƯỚC CỘNG HÒA', panoX + panoW / 2, panoY + 9);
        ctx.fillText('XÃ HỘI CHỦ NGHĨA', panoX + panoW / 2, panoY + 17);
        ctx.fillText('VIỆT NAM', panoX + panoW / 2, panoY + 25);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('MUÔN NĂM !', panoX + panoW / 2, panoY + 33);
        ctx.fillStyle = '#ffde59';
        ctx.fillText('★ ★ ★', panoX + panoW / 2, panoY + 40);

        ctx.restore();
    }

    // =========================================================================
    // VẼ THƯ VIỆN TRUNG TÂM TNU CHUẨN XÁC 100% THEO 3 ẢNH THỰC TẾ
    // ẢNH 1: Mặt trước - Cổng sảnh Chữ A khổng lồ, vách kính tam giác, 2 chậu kiểng thổ cẩm
    // ẢNH 2: Góc bên trái - Mảng hoa gió tam giác bê tông trắng khổng lồ, bồn cỏ viền trắng
    // ẢNH 3: Cánh trái hoàn toàn - Chân móng đá bazan cao, cầu thang bộ ngoài trời nan trắng, hàng tùng bách tán
    // =========================================================================
    drawThuVien(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ mềm sát chân công trình Thư viện (Xóa bỏ hoàn toàn mảng nền vàng thừa theo yêu cầu)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y + height - 6, width + 8, 20, 8);
        ctx.fill();

        // Phân chia 2 khối chính:
        // - Khối cánh bên trái (Left Wing - Ảnh 2 & Ảnh 3): ~170px
        // - Khối cổng sảnh Chữ A (Front A-Frame Portal - Ảnh 1): ~width - 170px (~115px)
        const leftWingW = Math.min(172, width * 0.6);
        const aFrameW = width - leftWingW;

        const leftX = x;
        const aFrameX = leftX + leftWingW;

        const baseH = 26; // Chân đế
        const baseY = y + height - baseH;

        // Bảng màu Thư viện TNU chuẩn ảnh thực tế
        const wallBeige = '#f4e3c5';       // Tường vàng be kem ấm
        const wallWarmShade = '#e4d2b2';   // Tường bóng hiên
        const roofRed = '#cf4829';         // Mái ngói đỏ cam truyền thống
        const beamWhite = '#ffffff';       // Hệ dầm, cột, cầu thang & hoa gió trắng tinh
        const bazanDark = '#423d3a';       // Đá bazan xám đen
        const bazanMid = '#5d554f';        // Đá bazan xám tự nhiên
        const glassBlue = '#5c86a4';       // Kính phản quang xanh
        const woodBrown = '#443329';       // Khung gỗ/cửa nâu sẫm

        // =====================================================================
        // PHẦN A: CÁNH BÊN TRÁI HOÀN TOÀN (LEFT WING - THEO ĐÚNG ẢNH 2 & ẢNH 3)
        // Dãy hành lang 2 tầng, chân đế đá bazan rất cao, cầu thang bộ ngoài trời nan trắng
        // và MẢNG HOA GIÓ TAM GIÁC BÊ TÔNG TRẮNG KHỔNG LỒ ở đầu hồi
        // =====================================================================
        const wingTopY = y + 36;
        const wingH = baseY - wingTopY;
        const floorH = wingH / 2; // 2 tầng

        // 1. Thân tường chính cánh trái
        ctx.fillStyle = wallBeige;
        ctx.fillRect(leftX, wingTopY, leftWingW, wingH);

        // Mái ngói dốc đỏ cam cánh trái (có bờ diềm mái be sáng nhô ra)
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(leftX - 8, wingTopY + 12);
        ctx.lineTo(leftX + leftWingW / 2, wingTopY - 6);
        ctx.lineTo(aFrameX + 8, wingTopY + 8);
        ctx.lineTo(leftX - 8, wingTopY + 12);
        ctx.closePath();
        ctx.fill();

        // Diềm bờ mái be sáng (Ảnh 2, 3)
        ctx.fillStyle = '#e8dec7';
        ctx.fillRect(leftX - 10, wingTopY + 10, leftWingW + 12, 4);

        // Dầm sàn bê tông trắng phân tầng 1 và tầng 2
        ctx.fillStyle = beamWhite;
        ctx.fillRect(leftX, wingTopY + floorH, leftWingW, 4);

        // --- TẦNG 1: CHÂN ĐẾ ỐP ĐÁ BAZAN TÂY NGUYÊN RẤT CAO (ẢNH 3) ---
        // Chiếm hơn nửa chiều cao tầng trệt theo đúng ảnh chụp thực tế
        const bazanHeight = floorH * 0.65;
        const bazanY = baseY - bazanHeight;

        ctx.fillStyle = bazanDark;
        ctx.fillRect(leftX, bazanY, leftWingW, bazanHeight + baseH);

        // Từng khối đá bazan chẻ tự nhiên gồ ghề
        const bzRows = 4;
        const bzRowH = (bazanHeight + baseH) / bzRows;
        for (let r = 0; r < bzRows; r++) {
            const ry = bazanY + r * bzRowH;
            let bx = leftX;
            while (bx < leftX + leftWingW) {
                const bw = 12 + ((bx * 7 + r * 11) % 16);
                const shade = (r + bx) % 3;
                ctx.fillStyle = shade === 0 ? '#383330' : (shade === 1 ? '#4e4742' : '#5e5650');
                ctx.fillRect(bx, ry + 0.8, Math.min(bw - 1.2, leftX + leftWingW - bx), bzRowH - 1.2);
                bx += bw;
            }
        }

        // Gờ chỉ xi măng trắng phân cách chân đế đá bazan và tường tầng trệt
        ctx.fillStyle = beamWhite;
        ctx.fillRect(leftX - 2, bazanY - 2, leftWingW + 4, 3);

        // Dãy cửa sổ chia ô khung nâu dọc hành lang tầng 1 (trên mảng đá bazan)
        const winCount1 = 3;
        const winStep1 = (leftWingW - 45) / winCount1;
        for (let i = 0; i < winCount1; i++) {
            const wx = leftX + 16 + i * winStep1;
            const wy = wingTopY + floorH - 18;
            ctx.fillStyle = woodBrown;
            ctx.fillRect(wx - 1, wy - 1, 14, 15);
            ctx.fillStyle = glassBlue;
            ctx.fillRect(wx, wy, 12, 13);
            // Nan ô kính
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(wx, wy, 12, 13);
            ctx.beginPath();
            ctx.moveTo(wx + 6, wy);
            ctx.lineTo(wx + 6, wy + 13);
            ctx.moveTo(wx, wy + 6.5);
            ctx.lineTo(wx + 12, wy + 6.5);
            ctx.stroke();
        }

        // --- TẦNG 2: HÀNH LANG CỘT TRÒN TRẮNG & LAN CAN NAN NGANG (ẢNH 2 & 3) ---
        // Nền tường thụt vào của tầng 2
        ctx.fillStyle = wallWarmShade;
        ctx.fillRect(leftX + 4, wingTopY + 14, leftWingW - 8, floorH - 14);

        // Các ô cửa sổ kính lớn trên hành lang tầng 2
        for (let i = 0; i < 4; i++) {
            const wx = leftX + 18 + i * 32;
            const wy = wingTopY + 18;
            ctx.fillStyle = glassBlue;
            ctx.fillRect(wx, wy, 16, floorH - 26);
            ctx.strokeStyle = beamWhite;
            ctx.lineWidth = 1;
            ctx.strokeRect(wx, wy, 16, floorH - 26);
        }

        // Dãy CỘT TRÒN BÊ TÔNG MÀU TRẮNG TINH đỡ mái hiên (Ảnh 2 & 3)
        const colCount = 5;
        const colSpacing = (leftWingW - 20) / (colCount - 1);
        for (let c = 0; c < colCount; c++) {
            const cx = leftX + 8 + c * colSpacing;
            ctx.fillStyle = beamWhite;
            ctx.fillRect(cx, wingTopY + 12, 4.5, floorH - 12);
            // Đổ bóng cột tròn
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            ctx.fillRect(cx + 3, wingTopY + 12, 1.5, floorH - 12);
        }

        // LAN CAN NAN TRẮNG NẰM NGANG 3 THANH (ẢNH 3)
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.4;
        for (let bar = 0; bar < 3; bar++) {
            const ly = wingTopY + floorH - 12 + bar * 4.5;
            ctx.beginPath();
            ctx.moveTo(leftX + 6, ly);
            ctx.lineTo(leftX + leftWingW - 6, ly);
            ctx.stroke();
        }

        // --- CẦU THANG BỘ NGOÀI TRỜI MÀU TRẮNG (EXTERIOR WHITE STAIRCASE - ẢNH 3) ---
        // Cầu thang bê tông trắng có tay vịn nan trắng dẫn từ sân lên tầng 2
        const stairStartX = leftX + 44;
        const stairEndX = leftX + 96;
        const stairTopY = wingTopY + floorH;
        const stairBottomY = baseY + 4;

        // Dầm xiên đỡ bản thang
        ctx.fillStyle = beamWhite;
        ctx.beginPath();
        ctx.moveTo(stairStartX, stairBottomY);
        ctx.lineTo(stairStartX + 8, stairBottomY);
        ctx.lineTo(stairEndX + 8, stairTopY);
        ctx.lineTo(stairEndX, stairTopY);
        ctx.closePath();
        ctx.fill();

        // Các bậc thang trắng bước lên
        const numSteps = 7;
        for (let s = 0; s < numSteps; s++) {
            const t = s / numSteps;
            const sx = stairStartX + t * (stairEndX - stairStartX);
            const sy = stairBottomY - t * (stairBottomY - stairTopY);
            ctx.fillStyle = '#f0ebe1';
            ctx.fillRect(sx, sy - 2, 7, 3);
            ctx.fillStyle = beamWhite;
            ctx.fillRect(sx, sy - 3, 7, 1.2);
        }

        // Lan can tay vịn cầu thang nan trắng (Ảnh 3)
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(stairStartX, stairBottomY - 14);
        ctx.lineTo(stairEndX, stairTopY - 14);
        ctx.stroke();
        // Các thanh đứng đỡ lan can
        ctx.lineWidth = 1;
        for (let s = 1; s < numSteps; s += 2) {
            const t = s / numSteps;
            const sx = stairStartX + t * (stairEndX - stairStartX);
            const sy = stairBottomY - t * (stairBottomY - stairTopY);
            ctx.beginPath();
            ctx.moveTo(sx + 3, sy);
            ctx.lineTo(sx + 3, sy - 14);
            ctx.stroke();
        }

        // =====================================================================
        // MẢNG HOA GIÓ TAM GIÁC BÊ TÔNG TRẮNG KHỔNG LỒ (ẢNH 2 - GÓC BÊN TRÁI)
        // Điểm nhấn kiến trúc đặc trưng không thể nhầm lẫn của Thư viện TNU!
        // =====================================================================
        const breezeBlockW = 46;
        const breezeBlockH = wingH - 8;
        const breezeX = leftX + leftWingW - breezeBlockW - 2;
        const breezeY = wingTopY + 8;

        // Khung bê tông trắng bao quanh mảng hoa gió nhô ra
        ctx.fillStyle = beamWhite;
        ctx.fillRect(breezeX - 3, breezeY - 2, breezeBlockW + 6, breezeBlockH + 4);
        ctx.fillStyle = '#ebdcc5'; // Nền bóng sâu bên trong hoa gió
        ctx.fillRect(breezeX, breezeY, breezeBlockW, breezeBlockH);

        // Mạng lưới các ô tam giác đan xen △ ▽ △ ▽ chuẩn xác 100%
        const triSize = 11;
        const triRows = Math.floor(breezeBlockH / triSize);
        const triCols = Math.floor(breezeBlockW / triSize);

        for (let r = 0; r < triRows; r++) {
            const ty = breezeY + r * triSize;
            for (let c = 0; c < triCols; c++) {
                const tx = breezeX + c * triSize;

                // Tam giác hoa gió bê tông trắng
                ctx.fillStyle = beamWhite;
                ctx.beginPath();
                ctx.moveTo(tx, ty + triSize - 1.5);
                ctx.lineTo(tx + triSize / 2, ty + 1.5);
                ctx.lineTo(tx + triSize, ty + triSize - 1.5);
                ctx.closePath();
                ctx.fill();

                // Lõi rỗng thông gió sẫm màu
                ctx.fillStyle = '#4a5568';
                ctx.beginPath();
                ctx.moveTo(tx + 2.5, ty + triSize - 2.5);
                ctx.lineTo(tx + triSize / 2, ty + 3.5);
                ctx.lineTo(tx + triSize - 2.5, ty + triSize - 2.5);
                ctx.closePath();
                ctx.fill();
            }
        }

        // =====================================================================
        // PHẦN B: MẶT TRƯỚC - CỔNG SẢNH CHỮ A KHỔNG LỒ (THEO ĐÚNG ẢNH 1)
        // Mái tam giác cân dốc cao vút, vách kính tam giác, cửa sảnh lớn, 2 chậu kiểng thổ cẩm
        // =====================================================================
        const aPeakX = aFrameX + aFrameW / 2;
        const aPeakY = y - 26; // Đỉnh chữ A vươn cao vút uy nghi
        const aLegLeftX = aFrameX - 4;
        const aLegRightX = aFrameX + aFrameW + 4;
        const aLegBottomY = baseY + 8;

        // Thân tường sau sảnh chữ A
        ctx.fillStyle = wallBeige;
        ctx.fillRect(aFrameX + 8, y + 16, aFrameW - 16, baseY - y - 16);

        // Mái dốc ngói đỏ phía sau sảnh chữ A (Ảnh 1)
        ctx.fillStyle = roofRed;
        ctx.beginPath();
        ctx.moveTo(aFrameX - 10, y + 24);
        ctx.lineTo(aPeakX, y - 10);
        ctx.lineTo(aFrameX + aFrameW + 10, y + 24);
        ctx.closePath();
        ctx.fill();

        // Bóng đổ dầm chữ A
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(aLegLeftX + 3, aLegBottomY);
        ctx.lineTo(aPeakX + 2, aPeakY + 3);
        ctx.lineTo(aLegRightX + 1, aLegBottomY);
        ctx.stroke();

        // HAI THANH DẦM NGHIÊNG BÊ TÔNG TRẮNG TẠO HÌNH CHỮ A KHỔNG LỒ (ẢNH 1)
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(aLegLeftX, aLegBottomY);
        ctx.lineTo(aPeakX, aPeakY);
        ctx.lineTo(aLegRightX, aLegBottomY);
        ctx.stroke();

        // Gờ chỉ vát cạnh dầm chữ A
        ctx.strokeStyle = '#ded4c3';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Dầm ngang chữ A (đỡ vách kính tam giác)
        const crossY = y + 42;
        const crossLeftX = aFrameX + 18;
        const crossRightX = aFrameX + aFrameW - 18;
        const crossW = crossRightX - crossLeftX;

        ctx.fillStyle = beamWhite;
        ctx.fillRect(crossLeftX, crossY, crossW, 6.5);
        ctx.strokeStyle = '#d4c7b2';
        ctx.lineWidth = 1;
        ctx.strokeRect(crossLeftX, crossY, crossW, 6.5);

        // VÁCH KÍNH TAM GIÁC LỚN PHÍA TRÊN MÁI CHỮ A (ẢNH 1)
        const glassGrad = ctx.createLinearGradient(crossLeftX, crossY, aPeakX, aPeakY);
        glassGrad.addColorStop(0, '#4e7b9b');
        glassGrad.addColorStop(0.5, '#72a8cb');
        glassGrad.addColorStop(1, '#a0d2f0');

        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.moveTo(crossLeftX + 4, crossY - 1);
        ctx.lineTo(aPeakX, aPeakY + 12);
        ctx.lineTo(crossRightX - 4, crossY - 1);
        ctx.closePath();
        ctx.fill();

        // HỆ KHUNG GIẰNG KẾT CẤU CHỮ X & TAM GIÁC BÊN TRONG VÁCH KÍNH (ẢNH 1)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        // Trụ đứng tâm
        ctx.moveTo(aPeakX, aPeakY + 12);
        ctx.lineTo(aPeakX, crossY);
        // Nan giằng chéo 2 bên
        ctx.moveTo(crossLeftX + 12, crossY);
        ctx.lineTo(aPeakX, aPeakY + 28);
        ctx.lineTo(crossRightX - 12, crossY);
        ctx.moveTo(crossLeftX + 22, crossY);
        ctx.lineTo(aPeakX, aPeakY + 16);
        ctx.lineTo(crossRightX - 22, crossY);
        ctx.stroke();

        // ĐẠI SẢNH KÍNH BÊN DƯỚI CỔNG CHỮ A (ẢNH 1)
        const hallY = crossY + 6.5;
        const hallH = baseY - hallY;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(crossLeftX, hallY, crossW, hallH);

        // Ánh đèn vàng thư viện ấm áp
        const hallGrad = ctx.createLinearGradient(crossLeftX, baseY, crossLeftX, hallY);
        hallGrad.addColorStop(0, '#ffd885');
        hallGrad.addColorStop(0.55, '#567e9c');
        hallGrad.addColorStop(1, '#2c3e50');
        ctx.fillStyle = hallGrad;
        ctx.fillRect(crossLeftX + 2, hallY + 2, crossW - 4, hallH - 4);

        // Cửa kính mở 2 cánh lớn
        ctx.strokeStyle = beamWhite;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(crossLeftX + crossW / 2 - 14, baseY - 28, 28, 28);
        ctx.beginPath();
        ctx.moveTo(crossLeftX + crossW / 2, baseY - 28);
        ctx.lineTo(crossLeftX + crossW / 2, baseY);
        ctx.stroke();

        // Bậc tam cấp sảnh chữ A lát gạch sạch sẽ (Ảnh 1)
        const stairW = aFrameW + 12;
        const stairX = aFrameX - 6;
        const stairY = baseY + 2;
        ctx.fillStyle = '#5c4e43';
        ctx.fillRect(stairX, stairY, stairW, 4);
        ctx.fillStyle = '#7a6a5d';
        ctx.fillRect(stairX + 4, stairY + 4, stairW - 8, 4);
        ctx.fillStyle = '#9b8778';
        ctx.fillRect(stairX + 8, stairY + 8, stairW - 16, 4);

        // 2 CHẬU CÂY KIỂNG / CHẬU HOA THỔ CẨM MÀU ĐỎ CAM ĐẾ XÒE HAI BÊN SẢNH (ẢNH 1)
        const drawThoCamtPot = (px, py) => {
            ctx.save();
            // Bóng chậu
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.ellipse(px, py + 4, 10, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Thân chậu màu đỏ cam ấm hoa văn Tây Nguyên (Ảnh 1)
            ctx.fillStyle = '#d94e28';
            ctx.beginPath();
            ctx.moveTo(px - 9, py - 12);
            ctx.lineTo(px + 9, py - 12);
            ctx.lineTo(px + 5.5, py - 3);
            ctx.lineTo(px + 8.5, py + 3);
            ctx.lineTo(px - 8.5, py + 3);
            ctx.lineTo(px - 5.5, py - 3);
            ctx.closePath();
            ctx.fill();

            // Viền vàng thổ cẩm
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(px - 7, py - 9, 14, 2.5);
            ctx.fillRect(px - 7.5, py + 0.5, 15, 2);

            // Cây kiểng bonsai cắt tỉa hình tháp tròn xanh mướt (Ảnh 1)
            ctx.fillStyle = '#1b4332';
            ctx.beginPath();
            ctx.arc(px, py - 18, 7.5, 0, Math.PI * 2);
            ctx.arc(px - 5, py - 15, 5.5, 0, Math.PI * 2);
            ctx.arc(px + 5, py - 15, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#40916c';
            ctx.beginPath();
            ctx.arc(px - 1, py - 19, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        // Đặt 2 chậu kiểng 2 bên lối vào sảnh (Ảnh 1)
        drawThoCamtPot(crossLeftX - 4, stairY + 10);
        drawThoCamtPot(crossRightX + 4, stairY + 10);

        // =====================================================================
        // PHẦN C: CẢNH QUAN XUNG QUANH (THEO ĐÚNG ẢNH 2 & ẢNH 3)
        // 1. BỒN CỎ VÁT CHÉO CÓ GỜ KÈ BO VIỀN BÊ TÔNG TRẮNG
        // 2. HÀNG CÂY TÙNG BÁCH TÁN CAO VÚT
        // =====================================================================
        // Hàm vẽ cây Tùng Bách Tán hình cột cao vút (Columnar pine)
        const drawColumnarPine = (cx, cy, treeH) => {
            ctx.save();
            // Bóng đổ
            ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 8, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Gốc cây nâu
            ctx.fillStyle = '#4a3728';
            ctx.fillRect(cx - 1.5, cy - 6, 3, 7);

            const pineW = 14;
            const pineTopY = cy - treeH;

            // Tán lá xanh thẫm
            ctx.fillStyle = '#133526';
            ctx.beginPath();
            ctx.roundRect(cx - pineW / 2, pineTopY, pineW, treeH - 5, [7, 7, 3, 3]);
            ctx.fill();

            // Tán lá xanh tươi lớp ngoài
            ctx.fillStyle = '#235940';
            ctx.beginPath();
            ctx.roundRect(cx - pineW / 2 + 1, pineTopY + 2, pineW - 2, treeH - 8, [6, 6, 2, 2]);
            ctx.fill();

            // Vệt sáng mặt trời
            ctx.fillStyle = '#39845f';
            ctx.beginPath();
            ctx.roundRect(cx - pineW / 2 + 1, pineTopY + 4, 4.5, treeH - 12, 2);
            ctx.fill();

            // Các chóp lá nhọn nhấp nhô
            ctx.fillStyle = '#1b4d36';
            for (let ly = pineTopY + 8; ly < cy - 6; ly += 9) {
                ctx.beginPath();
                ctx.moveTo(cx - pineW / 2 - 1.5, ly + 4);
                ctx.lineTo(cx - pineW / 2 + 2, ly);
                ctx.lineTo(cx - pineW / 2 + 5, ly + 4);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(cx + pineW / 2 + 1.5, ly + 4);
                ctx.lineTo(cx + pineW / 2 - 2, ly);
                ctx.lineTo(cx + pineW / 2 - 5, ly + 4);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        };

        // BỒN CỎ VÁT CHÉO CÓ GỜ KÈ BO VIỀN BÊ TÔNG TRẮNG (ẢNH 2 & 3)
        // Chạy dọc phía trước cánh trái
        const bedX = leftX + 10;
        const bedY = baseY + 18;
        const bedW = leftWingW - 20;

        // Gờ bê tông trắng bao quanh bồn cỏ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(bedX - 3, bedY - 3, bedW + 6, 16, 5);
        ctx.fill();
        ctx.strokeStyle = '#d5c7b3';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lòng thảm cỏ xanh mướt
        ctx.fillStyle = '#559434';
        ctx.beginPath();
        ctx.roundRect(bedX, bedY, bedW, 10, 3);
        ctx.fill();

        // HÀNG CÂY TÙNG BÁCH TÁN TRỒNG THẲNG TẮP DỌC BỒN CỎ & SẢNH (ẢNH 1, 2, 3)
        drawColumnarPine(leftX + 22, bedY + 6, 68);               // Tùng góc ngoài cùng bên trái (Ảnh 3)
        drawColumnarPine(leftX + 70, bedY + 6, 72);               // Tùng cạnh cầu thang ngoài trời (Ảnh 3)
        drawColumnarPine(leftX + leftWingW - 28, bedY + 6, 70);   // Tùng trước mảng hoa gió tam giác (Ảnh 2)
        drawColumnarPine(aLegLeftX - 6, stairY + 6, 74);          // Tùng bên trái sảnh chữ A (Ảnh 1)
        drawColumnarPine(aLegRightX + 6, stairY + 6, 76);         // Tùng bên phải sảnh chữ A (Ảnh 1)

        // Biển hiệu Pill Badge: "📚 THƯ VIỆN"
        if (label) {
            this.drawPillBadge(ctx, aPeakX, y - 20, label);
        }

        ctx.restore();
    }

    // HÀM VẼ CÂY TÙNG BÁCH TÁN HÌNH CỘT ĐẶC TRƯNG TÂY NGUYÊN
    drawColumnarPineTree(ctx, cx, cy, treeH) {
        ctx.save();
        // Bóng đổ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 8, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gốc cây nâu
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(cx - 1.5, cy - 6, 3, 7);

        const pineW = 14;
        const pineTopY = cy - treeH;

        // Tán lá xanh thẫm
        ctx.fillStyle = '#133526';
        ctx.beginPath();
        ctx.roundRect(cx - pineW / 2, pineTopY, pineW, treeH - 5, [7, 7, 3, 3]);
        ctx.fill();

        // Tán lá xanh tươi lớp ngoài
        ctx.fillStyle = '#235940';
        ctx.beginPath();
        ctx.roundRect(cx - pineW / 2 + 1, pineTopY + 2, pineW - 2, treeH - 8, [6, 6, 2, 2]);
        ctx.fill();

        // Vệt sáng mặt trời
        ctx.fillStyle = '#39845f';
        ctx.beginPath();
        ctx.roundRect(cx - pineW / 2 + 1, pineTopY + 4, 4.5, treeH - 12, 2);
        ctx.fill();

        ctx.restore();
    }

    // VẼ CỔNG CHÍNH TRƯỜNG ĐH TÂY NGUYÊN TRÊN ĐƯỜNG LÊ DUẨN (THEO GOOGLE MAPS)
    drawMainCampusGate(ctx, x, y, width, height, label) {
        ctx.save();

        // 1. Bóng đổ chân cổng
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.roundRect(x - 6, y + height - 4, width + 12, 12, 6);
        ctx.fill();

        // 2. Hai cột trụ cổng chính đồ sộ ốp đá Bazan / gạch nung đỏ đậm Tây Nguyên
        const pillarW = 16;
        // Trụ trái
        ctx.fillStyle = '#6a2c1a';
        ctx.fillRect(x, y + 6, pillarW, height - 6);
        ctx.fillStyle = '#8c3a23';
        ctx.fillRect(x + 2, y + 8, pillarW - 4, height - 10);
        // Trụ phải
        ctx.fillStyle = '#6a2c1a';
        ctx.fillRect(x + width - pillarW, y + 6, pillarW, height - 6);
        ctx.fillStyle = '#8c3a23';
        ctx.fillRect(x + width - pillarW + 2, y + 8, pillarW - 4, height - 10);

        // Đèn quả cầu vàng trên đỉnh 2 trụ cổng
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(x + pillarW / 2, y + 3, 5, 0, Math.PI * 2);
        ctx.arc(x + width - pillarW / 2, y + 3, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b78b20';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3. Dầm vòm cổng chào sơn đỏ son uy nghi vươn ngang
        const beamH = 22;
        const beamY = y + 8;
        ctx.fillStyle = '#b72222';
        ctx.beginPath();
        ctx.roundRect(x - 4, beamY, width + 8, beamH, 4);
        ctx.fill();

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Chữ nổi vàng kim sắc nét: "TRƯỜNG ĐẠI HỌC TÂY NGUYÊN"
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TRƯỜNG ĐẠI HỌC TÂY NGUYÊN', x + width / 2, beamY + beamH / 2);

        // Dòng chữ phụ nhỏ: "BỘ GIÁO DỤC VÀ ĐÀO TẠO"
        ctx.font = 'bold 5px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('BỘ GIÁO DỤC VÀ ĐÀO TẠO', x + width / 2, beamY + 4);

        // 4. Hai cánh cổng sắt hoa văn mạ vàng mở rộng đón vào trường
        ctx.strokeStyle = '#c4973b';
        ctx.lineWidth = 1.2;
        // Cánh mở chéo trái
        ctx.beginPath();
        ctx.moveTo(x + pillarW, y + height - 2);
        ctx.lineTo(x + pillarW + 14, y + 26);
        ctx.lineTo(x + pillarW + 14, y + height - 2);
        ctx.stroke();
        // Cánh mở chéo phải
        ctx.beginPath();
        ctx.moveTo(x + width - pillarW, y + height - 2);
        ctx.lineTo(x + width - pillarW - 14, y + 26);
        ctx.lineTo(x + width - pillarW - 14, y + height - 2);
        ctx.stroke();

        // Biển hiệu
        this.drawPillBadge(ctx, x + width / 2, y - 8, '🏛️ CỔNG CHÍNH TNU');

        ctx.restore();
    }

    // HÀM VẼ BIỂN TÊN DẠNG PILL BADGE BO TRÒN NÂU ĐẤT
    drawPillBadge(ctx, cx, cy, text) {
        ctx.font = 'bold 10px sans-serif';
        const txtW = ctx.measureText(text).width;
        const padX = 14;
        const bw = txtW + padX * 2;
        const bh = 18;

        // Nền nâu đất bo tròn
        ctx.fillStyle = '#a75f3a';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 9);
        } else {
            ctx.rect(cx - bw / 2, cy - bh / 2, bw, bh);
        }
        ctx.fill();

        // Chữ trắng sắc nét
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cx, cy);
    }

    // VẼ CÁC CỔNG CHUYỂN CẢNH (PORTALS & BIỂN BÁO)
    drawPortals(ctx, mapData) {
        if (!mapData || !mapData.portals) return;

        const time = Date.now() / 1000;

        mapData.portals.forEach(p => {
            if (p.hidden) return;

            // NẾU LÀ CỔNG VÒNG TRÒN TRONG SUỐT (TRANSPARENT CIRCLE PORTAL)
            if (p.isCirclePortal) {
                const cx = p.cx || (p.x + p.width / 2);
                const cy = p.cy || (p.y + p.height / 2);
                const baseR = p.radius || 28;
                const pulse = Math.sin(time * 3.2 + (p.theme === 'rose' ? 0 : 1.5)) * 2;
                const rx = baseR + pulse;
                const ry = rx * 0.52; // Góc nhìn phối cảnh phẳng trên mặt đất

                ctx.save();

                // 1. VÒNG TRÒN TRONG SUỐT TRÊN MẶT ĐẤT (TRANSPARENT RADIAL GLOW)
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
                let ringColor = 'rgba(167, 243, 208, 0.88)';
                let borderColor = '#2ec4b6';
                let outerRing = 'rgba(6, 214, 160, 0.55)';
                let sparkColor = 'rgba(220, 255, 245,';

                if (p.theme === 'rose') {
                    grad.addColorStop(0, 'rgba(255, 105, 180, 0.40)');
                    grad.addColorStop(0.6, 'rgba(255, 77, 109, 0.22)');
                    grad.addColorStop(1, 'rgba(255, 77, 109, 0.0)');
                    ringColor = 'rgba(255, 182, 193, 0.88)';
                    borderColor = '#ff758f';
                    outerRing = 'rgba(255, 77, 109, 0.55)';
                    sparkColor = 'rgba(255, 220, 235,';
                } else if (p.theme === 'tnu') {
                    grad.addColorStop(0, 'rgba(58, 134, 255, 0.42)');
                    grad.addColorStop(0.6, 'rgba(0, 180, 216, 0.22)');
                    grad.addColorStop(1, 'rgba(58, 134, 255, 0.0)');
                    ringColor = 'rgba(160, 210, 255, 0.88)';
                    borderColor = '#4cc9f0';
                    outerRing = 'rgba(58, 134, 255, 0.55)';
                    sparkColor = 'rgba(210, 235, 255,';
                } else {
                    grad.addColorStop(0, 'rgba(6, 214, 160, 0.42)');
                    grad.addColorStop(0.6, 'rgba(0, 180, 216, 0.22)');
                    grad.addColorStop(1, 'rgba(6, 214, 160, 0.0)');
                }
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.fill();

                // 2. VÒNG MA PHÁP XOAY XOAY (DASHED MAGIC RUNE RING)
                ctx.strokeStyle = ringColor;
                ctx.lineWidth = 1.8;
                ctx.setLineDash([7, 5]);
                ctx.lineDashOffset = -time * 20;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Vòng mỏng bao quanh bên ngoài
                ctx.setLineDash([]);
                ctx.strokeStyle = outerRing;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx + 4, (rx + 4) * 0.52, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Tâm sáng lấp lánh nhẹ
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.beginPath();
                ctx.ellipse(cx, cy, 3, 1.8, 0, 0, Math.PI * 2);
                ctx.fill();

                // 3. CÁC HẠT SÁNG BAY LÊN (SPARKLES)
                for (let i = 0; i < 4; i++) {
                    const phase = (time * 1.4 + i * 0.25) % 1;
                    const angle = (i * Math.PI / 2) + time * 0.8;
                    const spX = cx + Math.cos(angle) * (rx * 0.55);
                    const spY = cy + Math.sin(angle) * (ry * 0.55) - phase * 26;
                    const alpha = (1 - phase) * 0.85;
                    const sz = 1.2 + (1 - phase) * 1.5;
                    ctx.fillStyle = `${sparkColor} ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(spX, spY, sz, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 4. FLOATING TAG LƠ LỬNG BÊN TRÊN (CHỈ HIỂN THỊ NẾU KHÔNG CÓ hideFloatingTag)
                if (!p.hideFloatingTag) {
                    const floatOffset = Math.sin(time * 3 + (p.theme === 'rose' ? 0 : 1.5)) * 3;
                    const tagY = cy - ry - 22 + floatOffset;

                    // Đo chiều dài text để tag bo tròn vừa vặn
                    ctx.font = 'bold 12px "SVN-Cookies", "Nunito", sans-serif';
                    const metrics = ctx.measureText(p.label);
                    const tagW = Math.max(90, metrics.width + 22);
                    const tagH = 26;
                    const tagX = cx - tagW / 2;

                    // Mũi tên chỉ xuống vòng tròn
                    ctx.fillStyle = '#1e2430';
                    ctx.beginPath();
                    ctx.moveTo(cx - 5, tagY + tagH / 2);
                    ctx.lineTo(cx + 5, tagY + tagH / 2);
                    ctx.lineTo(cx, tagY + tagH / 2 + 5);
                    ctx.closePath();
                    ctx.fill();

                    // Khung tag pill
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetY = 2;
                    ctx.fillStyle = '#1e2430';
                    ctx.beginPath();
                    ctx.roundRect(tagX, tagY - tagH / 2, tagW, tagH, 13);
                    ctx.fill();

                    // Viền sáng viền tag
                    ctx.shadowColor = 'transparent';
                    ctx.lineWidth = 1.6;
                    ctx.strokeStyle = borderColor;
                    ctx.stroke();

                    // Text trên tag
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(p.label, cx, tagY + 1);

                    // Gợi ý [E] nếu người chơi đang ở gần (chỉ khi không có noPrompt)
                    if (!p.noPrompt) {
                        const distToPlayer = Math.hypot(this.player.x - cx, this.player.y - cy);
                        if (distToPlayer < 75) {
                            const promptText = '[E] Dịch chuyển ➔';
                            const promptY = tagY - tagH / 2 - 16;
                            if (window.drawWorldPromptBadge) {
                                window.drawWorldPromptBadge(ctx, cx, promptY, promptText, {
                                    theme: 'cyan',
                                    timer: Date.now() / 1000,
                                    pointer: true
                                });
                            }
                        }
                    }
                }

                ctx.restore();
                return;
            }

            if (p.isTransparent) return; // Bỏ qua không vẽ nếu là cổng trong suốt ẩn

            // Nền biển dạng Pill nổi bật (Cổng thường khác)
            ctx.fillStyle = p.color || '#2d6a4f';
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.width, p.height, 10);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Chữ
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x + p.width / 2, p.y + p.height / 2);
        });
    }

    // VẼ MAP 2, 3, 4 DỰ PHÒNG
    drawMap2_Rose(ctx) {
        const m = window.MAPS_DATA.map2_rose;
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(0, 0, m.width, m.height);
        ctx.fillStyle = '#e9ecef';
        m.paths.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
    }
    drawMap3_Arcade(ctx) {
        const m = window.MAPS_DATA.map3_arcade;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, m.width, m.height);
        ctx.fillStyle = '#7209b7';
        ctx.fillRect(350, 320, 110, 140);
        ctx.fillStyle = '#d62828';
        ctx.fillRect(750, 320, 140, 140);
    }
    drawMap4_Gift(ctx) {
        const m = window.MAPS_DATA.map4_gift;
        ctx.fillStyle = '#3f2e56';
        ctx.fillRect(0, 0, m.width, m.height);
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(380, 340, 130, 90);
        ctx.fillStyle = '#264653';
        ctx.fillRect(780, 320, 150, 120);
    }
}

window.GameEngine = GameEngine;
