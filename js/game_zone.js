/**
 * ====================================================================
 * 🎡 TNU: ĐÔI CÁNH ĐẠI NGÀN - KHU TRÒ CHƠI HỘI CHỢ (GAME ZONE / FAIRGROUND ARCADE)
 * ====================================================================
 * Cấu trúc chuẩn xác 100% theo hình ảnh hội chợ trò chơi Đại Học Tây Nguyên:
 * - 4 Quầy trò chơi chính:
 *   1. Quầy Bắn Súng Hội Chợ (Top-Left): Red-White striped booth, súng hơi, bia vịt, bia hồng tâm
 *   2. Quầy Hứng & Ăn Đồ Ăn Rơi (Top-Right): Quầy đồ ăn khổng lồ, burger, khoai tây chiên, cupcake
 *   3. Máy Gắp Gấu Bông Arcade (Bottom-Left): Bệ máy gắp thú neon xanh - hồng, gắp gấu teddy, capybara, vịt
 *   4. Quầy Kéo Bò Hội Chợ (Bottom-Right): Rạp vàng, bãi cát rơm, 2 chú bò sữa chibi kéo co vui nhộn
 * - VÒNG TRÒN DƯỚI MẶT ĐẤT ĐƯỢC MỞ RỘNG TO BẢN, TỎA SÁNG RỰC RỠ VÀ CÓ VIỀN XOAY ĐỘNG
 * - Lại gần quầy HOẶC BẤM CHUỘT TRỰC TIẾP VÀO QUẦY đều mở Bảng Game ngay lập tức!
 * - Tự động inject Modal Bảng Game nếu chưa có trong DOM (hoạt động hoàn hảo cả trên index.html và game_zone.html)
 */

(function(window) {
    'use strict';

    class GameZoneManager {
        constructor() {
            this.bgImage = null;
            this.bgLoaded = false;
            this.globalTime = 0;
            this.nearbyBooth = null;
            this.hoveredBooth = null;
            this.activeGameInstance = null;
            this.activeGameType = null;
            this.particles = [];

            // NPC Cô Mai Bếp Trưởng Lễ Hội (Chỉ xuất hiện và đi vòng vòng ở Map Game)
            this.chefNpc = {
                id: 'chef_mai',
                name: 'Cô Mai Bếp Trưởng',
                role: 'chef',
                x: 770,
                y: 310,
                baseX: 770,
                baseY: 310,
                radius: 38,
                speech: '🎁 Hãy vào Bàn Chế Tạo [G] làm 1 Hộp Quà Lễ Hội May Mắn đem tới cho ta nhé!',
                waypoints: [
                    { x: 770, y: 310, pause: 3.5 },
                    { x: 840, y: 340, pause: 2.5 },
                    { x: 800, y: 390, pause: 3.5 },
                    { x: 720, y: 360, pause: 2.5 },
                    { x: 730, y: 310, pause: 3.0 }
                ],
                currentWpIndex: 0,
                state: 'idle', // 'idle' hoặc 'walking'
                timer: 2.0,
                speed: 38,
                facing: 1, // 1 = right, -1 = left
                walkCycle: 0
            };
            this.isNearChef = false;

            // Định nghĩa 4 quầy trò chơi với VÒNG TRÒN TƯƠNG TÁC RỘNG RÃI & CHUẨN XÁC VỊ TRÍ THEO VÙNG KHOANH ĐỎ
            this.booths = {
                shooting: {
                    id: 'shooting',
                    name: 'Đấu Trường Bắn Quái 3 Làn',
                    shortTitle: 'Bắn Quái',
                    icon: '⚔️',
                    themeColor: '#e63946',
                    accentColor: '#ffd166',
                    groundColor: 'rgba(230, 57, 70, 0.42)',
                    desc: 'Điều khiển nhân vật đổi 3 làn đường (W/S), tung chưởng skill tiêu diệt 3 đợt quái hung hãn và thu thập ngọc nâng cấp kỹ năng!',
                    triggerX: 410,
                    triggerY: 215,
                    triggerRadius: 135,
                    groundRadiusX: 88,
                    groundRadiusY: 65,
                    boothBounds: { x: 260, y: 70, w: 300, h: 260 },
                    gameClass: window.ShootingGalleryGame,
                    rewardsPreview: [
                        { count: 1, name: 'Huy Hiệu Dũng Sĩ', icon: '🎖️', iconImg: 'assets/items/huy_hieu.png', req: 'Trảm Boss Đợt 3' },
                        { count: 1, name: 'Quà Trò Chơi', icon: '🎁', iconImg: 'assets/items/qua_tro_choi.png', req: 'Quét Sạch Quái' },
                        { count: 1, name: 'Gấu Bông Dũng Sĩ', icon: '🧸', iconImg: 'assets/items/gau_bong.png', req: 'Chiến Thắng' }
                    ]
                },
                food: {
                    id: 'food',
                    name: 'Quầy Hứng & Ăn Đồ Ăn Rơi',
                    shortTitle: 'Hứng Đồ Ăn',
                    icon: '🍔',
                    themeColor: '#f4a261',
                    accentColor: '#e76f51',
                    groundColor: 'rgba(244, 162, 97, 0.45)',
                    desc: 'Di chuyển giỏ hứng các món ăn ngon từ trên trời rơi xuống. Tránh hứng phải bom hoặc ớt cay!',
                    triggerX: 1038,
                    triggerY: 230,
                    triggerRadius: 135,
                    groundRadiusX: 92,
                    groundRadiusY: 65,
                    boothBounds: { x: 880, y: 50, w: 300, h: 270 },
                    gameClass: window.FallingFoodCatcherGame,
                    rewardsPreview: [
                        { count: 1, name: 'Bánh Cupcake Dâu', icon: '🧁', iconImg: 'assets/items/banh_cupcake.png', req: '60 điểm' },
                        { count: 1, name: 'Cơm Cánh Gà Rán Giòn', icon: '🍗', iconImg: 'assets/items/com_canh_ga.png', req: '100 điểm' },
                        { count: 1, name: 'Mì Trộn Trứng Ốp La', icon: '🍜', iconImg: 'assets/items/mi_tron_trung.png', req: '150 điểm' },
                        { count: 1, name: 'Burger Bò Đặc Biệt', icon: '🍔', iconImg: 'assets/items/hamburger.png', req: '190 điểm' },
                        { count: 1, name: 'Bắp Rang Bơ Giòn', icon: '🍿', iconImg: 'assets/items/bap_rang_bo.png', req: '210 điểm' },
                        { count: 1, name: 'Khoai Tây Chiên Giòn', icon: '🍟', iconImg: 'assets/items/khoai_tay_chien.png', req: '240 điểm' }
                    ]
                },
                claw: {
                    id: 'claw',
                    name: 'Máy Gắp Gấu Bông Pastel Pink',
                    shortTitle: 'Gắp Thú Bông',
                    icon: '🧸',
                    themeColor: '#e05780',
                    accentColor: '#ff9ebb',
                    groundColor: 'rgba(224, 87, 128, 0.42)',
                    desc: 'Điều khiển cần gắp cơ học hạ xuống kẹp chặt các chú gấu bông Teddy, Capybara, Vịt vàng, Mèo cute đưa về phễu quà!',
                    triggerX: 376,
                    triggerY: 534,
                    triggerRadius: 135,
                    groundRadiusX: 85,
                    groundRadiusY: 65,
                    boothBounds: { x: 270, y: 430, w: 220, h: 220 },
                    gameClass: window.ClawMachineGame,
                    rewardsPreview: [
                        { count: 1, name: 'Gấu Bông Teddy Nâu', icon: '🧸', iconImg: 'assets/items/gau_bong.png', req: 'Gắp trúng gấu' },
                        { count: 1, name: 'Gấu Bông Capybara', icon: '🦫', iconImg: 'assets/items/capybara.png', req: 'Gắp trúng capy' },
                        { count: 1, name: 'Thú Bông Vịt Vàng', icon: '🐥', iconImg: 'assets/items/thu_bong_vit.png', req: 'Gắp trúng vịt' },
                        { count: 1, name: 'Mèo Bông Hoàng Thượng', icon: '🐱', iconImg: 'assets/items/meo_bong.png', req: 'Gắp trúng mèo' },
                        { count: 1, name: 'Búp Bê Bò Sữa Mini', icon: '🐮', iconImg: 'assets/items/bup_be_bo.png', req: 'Gắp trúng bò' }
                    ]
                },
                cow: {
                    id: 'cow',
                    name: 'Quầy Kéo Bò Hội Chợ TNU',
                    shortTitle: 'Kéo Bò Co',
                    icon: '🐮',
                    themeColor: '#2a9d8f',
                    accentColor: '#e9c46a',
                    groundColor: 'rgba(42, 157, 143, 0.45)',
                    desc: 'Đàn bò phi thẳng từ dưới lên trên và chạy ra ngoài màn hình! Quăng thòng lọng bắt bò và NHẤN [SPACE] LIÊN TỤC để giằng co kéo bò về (thả tay bò sẽ chạy mất)! Quăng hụt là THUA LUÔN! Tích đủ 250đ nhận hết 4 quà!',
                    triggerX: 952,
                    triggerY: 522,
                    triggerRadius: 135,
                    groundRadiusX: 110,
                    groundRadiusY: 60,
                    boothBounds: { x: 820, y: 440, w: 280, h: 180 },
                    gameClass: window.CowPullingGame,
                    rewardsPreview: [
                        { count: 1, name: 'Sữa Bò Tươi Nguyên Chất', icon: '🥛', iconImg: 'assets/cow_game/medal_milk.png', req: '50 điểm' },
                        { count: 1, name: 'Phô Mai Thượng Hạng', icon: '🧀', iconImg: 'assets/cow_game/medal_cheese.png', req: '100 điểm' },
                        { count: 1, name: 'Bánh Kem Dâu', icon: '🍰', iconImg: 'assets/cow_game/medal_cake.png', req: '180 điểm' },
                        { count: 1, name: 'Hộp Quà Thần Tài', icon: '🎁', iconImg: 'assets/cow_game/medal_gift.png', req: '250 điểm' }
                    ]
                }
            };

            this.init();
        }

        init() {
            // Load ảnh nền khu trò chơi chuẩn 1280x720
            this.bgImage = new Image();
            this.bgImage.src = 'assets/game_zone_1280.jpg';
            this.bgImage.onload = () => {
                this.bgLoaded = true;
            };

            // Tự động inject Modal Bảng Game nếu chưa có trong DOM
            this.ensureGameBoardModal();

            // Lắng nghe phím E để tương tác Cô Mai Bếp Trưởng hoặc mở bảng game khi đứng gần quầy
            window.addEventListener('keydown', (e) => {
                if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
                const currentMapId = window.useGameStore && window.useGameStore.state.currentMapId;
                if (currentMapId !== 'map3_arcade') return;

                if (e.code === 'KeyE' || e.code === 'Space') {
                    // 1. Ưu tiên số 1: Tương tác với Cô Mai Bếp Trưởng nếu đứng gần
                    const isNearChefNpc = this.isNearChef || (this.chefNpc && window.gameInstance && window.gameInstance.player &&
                        Math.hypot(window.gameInstance.player.x - this.chefNpc.x, window.gameInstance.player.y - this.chefNpc.y) < 85);

                    if (isNearChefNpc) {
                        if (e.code === 'KeyE') e.preventDefault();
                        if (window.uiManager && typeof window.uiManager.openChefMaiDialogue === 'function') {
                            window.uiManager.openChefMaiDialogue();
                            return;
                        }
                    }

                    // 2. Mở bảng trò chơi khi đứng gần quầy
                    if (this.nearbyBooth && !this.activeGameInstance) {
                        if (e.code === 'KeyE') e.preventDefault();
                        this.openGameBoard(this.nearbyBooth.id);
                    }
                }
            });

            // Lắng nghe click trực tiếp lên Canvas để chơi ngay khi bấm chuột vào quầy/vòng tròn
            this.setupCanvasClickInteraction();

            // Đồng bộ dữ liệu bản đồ map3_arcade trong MAPS_DATA
            if (window.MAPS_DATA) {
                window.MAPS_DATA.map3_arcade = {
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
                };
            }

            // Hook vào GameEngine để render khu trò chơi
            this.hookIntoGameEngine();
        }

        setupCanvasClickInteraction() {
            const checkAndBind = () => {
                const canvas = document.getElementById('game-canvas');
                if (!canvas || canvas._gameZoneBound) return;
                canvas._gameZoneBound = true;

                // Xử lý Click mở game
                canvas.addEventListener('click', (e) => {
                    const currentMapId = window.useGameStore && window.useGameStore.state.currentMapId;
                    if (currentMapId !== 'map3_arcade') return;

                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    const camX = (window.gameInstance && window.gameInstance.camera) ? window.gameInstance.camera.x : 0;
                    const camY = (window.gameInstance && window.gameInstance.camera) ? window.gameInstance.camera.y : 0;
                    const clickX = (e.clientX - rect.left) * scaleX + camX;
                    const clickY = (e.clientY - rect.top) * scaleY + camY;

                    // 1. Kiểm tra xem click vào Cô Mai Bếp Trưởng không (bao gồm cả thân, mũ và tag bóng hội thoại)
                    const distToChef = Math.hypot(clickX - this.chefNpc.x, clickY - this.chefNpc.y);
                    const isClickOnChef = (distToChef <= 65) ||
                        (clickX >= this.chefNpc.x - 60 && clickX <= this.chefNpc.x + 60 &&
                         clickY >= this.chefNpc.y - 85 && clickY <= this.chefNpc.y + 25);
                    if (isClickOnChef) {
                        if (window.uiManager && typeof window.uiManager.openChefMaiDialogue === 'function') {
                            window.uiManager.openChefMaiDialogue();
                            return;
                        }
                    }

                    // 2. Kiểm tra xem click vào quầy nào
                    for (const key in this.booths) {
                        const b = this.booths[key];
                        const distToTrigger = Math.hypot(clickX - b.triggerX, clickY - b.triggerY);
                        const inBounds = clickX >= b.boothBounds.x && clickX <= b.boothBounds.x + b.boothBounds.w &&
                                         clickY >= b.boothBounds.y && clickY <= b.boothBounds.y + b.boothBounds.h;
                        
                        if (distToTrigger <= b.triggerRadius || inBounds) {
                            this.openGameBoard(b.id);
                            return;
                        }
                    }
                });

                // Xử lý Hover đổi con trỏ chuột thành hình bàn tay chỉ
                canvas.addEventListener('mousemove', (e) => {
                    const currentMapId = window.useGameStore && window.useGameStore.state.currentMapId;
                    if (currentMapId !== 'map3_arcade') return;

                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    const camX = (window.gameInstance && window.gameInstance.camera) ? window.gameInstance.camera.x : 0;
                    const camY = (window.gameInstance && window.gameInstance.camera) ? window.gameInstance.camera.y : 0;
                    const mx = (e.clientX - rect.left) * scaleX + camX;
                    const my = (e.clientY - rect.top) * scaleY + camY;

                    let isHovering = false;

                    // Hover vào Cô Mai Bếp Trưởng
                    const distToChef = Math.hypot(mx - this.chefNpc.x, my - this.chefNpc.y);
                    const isHoverChef = (distToChef <= 65) ||
                        (mx >= this.chefNpc.x - 60 && mx <= this.chefNpc.x + 60 &&
                         my >= this.chefNpc.y - 85 && my <= this.chefNpc.y + 25);
                    if (isHoverChef) {
                        isHovering = true;
                    }

                    for (const key in this.booths) {
                        const b = this.booths[key];
                        const dist = Math.hypot(mx - b.triggerX, my - b.triggerY);
                        const inBounds = mx >= b.boothBounds.x && mx <= b.boothBounds.x + b.boothBounds.w &&
                                         my >= b.boothBounds.y && my <= b.boothBounds.y + b.boothBounds.h;
                        if (dist <= b.triggerRadius || inBounds) {
                            isHovering = true;
                            this.hoveredBooth = b;
                            break;
                        }
                    }

                    if (!isHovering) this.hoveredBooth = null;
                    canvas.style.cursor = isHovering ? 'pointer' : 'default';
                });
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkAndBind);
            } else {
                checkAndBind();
            }
        }

        hookIntoGameEngine() {
            if (!window.GameEngine) return;
            const self = this;
            window.GameEngine.prototype.drawMap3_Arcade = function(ctx) {
                self.render(ctx, this.player);
            };
        }

        update(player, dt) {
            this.globalTime += (dt || 0.016);

            if (!player) return;

            // Kiểm tra khoảng cách tới 4 quầy
            let closestBooth = null;
            let minDistance = Infinity;

            for (const key in this.booths) {
                const b = this.booths[key];
                const dist = Math.hypot(player.x - b.triggerX, player.y - b.triggerY);
                if (dist < b.triggerRadius && dist < minDistance) {
                    minDistance = dist;
                    closestBooth = b;
                }
            }

            this.nearbyBooth = closestBooth;

            // Cập nhật Cô Mai Bếp Trưởng đứng & đi dạo vòng quanh map game
            this.updateChefNpc(player, dt || 0.016);

            // Kiểm tra khoảng cách tới Cô Mai Bếp Trưởng (bán kính tương tác 85px)
            this.isNearChef = Math.hypot(player.x - this.chefNpc.x, player.y - this.chefNpc.y) < 85;

            // Cập nhật DOM Prompt nổi nếu có
            this.updatePromptUI();

            // Sinh hạt lấp lánh nhẹ nhàng quanh các gian hàng hội chợ
            if (Math.random() < 0.3) {
                const bKeys = Object.keys(this.booths);
                const randomBooth = this.booths[bKeys[Math.floor(Math.random() * bKeys.length)]];
                this.particles.push({
                    x: randomBooth.triggerX + (Math.random() - 0.5) * 120,
                    y: randomBooth.triggerY + (Math.random() - 0.5) * 50,
                    vy: -Math.random() * 0.9 - 0.3,
                    color: randomBooth.accentColor,
                    size: Math.random() * 3.5 + 2,
                    alpha: 1.0,
                    life: 1.2
                });
            }

            // Cập nhật hạt
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.y += p.vy;
                p.alpha -= 0.016;
                if (p.alpha <= 0) this.particles.splice(i, 1);
            }
        }

        render(ctx, player) {
            if (!ctx) return;

            // 1. Vẽ hình ảnh nền hội chợ trò chơi chuẩn xác 100%
            if (this.bgLoaded && this.bgImage) {
                ctx.drawImage(this.bgImage, 0, 0, 1280, 720);
            } else {
                ctx.fillStyle = '#6b9080';
                ctx.fillRect(0, 0, 1280, 720);
            }

            // 2. Vẽ VÒNG TRÒN DƯỚI MẶT ĐẤT TO BẢN RỰC RỠ TẠI 4 QUẦY
            for (const key in this.booths) {
                const b = this.booths[key];
                const isNearby = this.nearbyBooth && this.nearbyBooth.id === b.id;
                const isHovered = this.hoveredBooth && this.hoveredBooth.id === b.id;
                this.drawBoothMarker(ctx, b, isNearby || isHovered);
            }

            // 3. Vẽ Cô Mai Bếp Trưởng Lễ Hội (Nhiệm Vụ Giỏ Đựng & Hộp Quà Hoàng Gia)
            this.drawChefNpc(ctx);

            // 4. Vẽ các hạt lấp lánh hội chợ
            for (const p of this.particles) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Cập nhật logic tương tác
            this.update(player, 0.016);
        }

        // Cập nhật Cô Mai Bếp Trưởng đi dạo vòng quanh map game
        updateChefNpc(player, dt) {
            const npc = this.chefNpc;
            if (!npc) return;

            // Nếu người chơi ở gần (< 70px), Cô Mai dừng lại và nhìn về phía người chơi
            const distToPlayer = player ? Math.hypot(player.x - npc.x, player.y - npc.y) : 999;
            if (distToPlayer < 70) {
                npc.state = 'idle';
                npc.facing = (player && player.x >= npc.x) ? 1 : -1;
                return;
            }

            if (npc.state === 'idle') {
                npc.timer -= dt;
                if (npc.timer <= 0) {
                    npc.currentWpIndex = (npc.currentWpIndex + 1) % npc.waypoints.length;
                    npc.state = 'walking';
                }
            } else if (npc.state === 'walking') {
                const target = npc.waypoints[npc.currentWpIndex];
                const dx = target.x - npc.x;
                const dy = target.y - npc.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 4) {
                    npc.x = target.x;
                    npc.y = target.y;
                    npc.state = 'idle';
                    npc.timer = target.pause || 3.0;
                } else {
                    const step = npc.speed * dt;
                    npc.x += (dx / dist) * Math.min(step, dist);
                    npc.y += (dy / dist) * Math.min(step, dist);
                    npc.facing = dx >= 0 ? 1 : -1;
                    npc.walkCycle += dt * 8;
                }
            }
        }

        // Vẽ Cô Mai Bếp Trưởng trên canvas Khu Trò Chơi
        drawChefNpc(ctx) {
            ctx.save();
            const npc = this.chefNpc;
            ctx.translate(npc.x, npc.y);

            const isWalking = (npc.state === 'walking');
            const bob = isWalking ? Math.sin(npc.walkCycle) * 3 : Math.sin(this.globalTime * 3) * 2;
            const legSwing = isWalking ? Math.sin(npc.walkCycle) * 4 : 0;
            const isNear = this.isNearChef;

            // 1. Vòng tròn hào quang dưới chân Bếp Trưởng
            ctx.fillStyle = isNear ? 'rgba(251, 191, 36, 0.45)' : 'rgba(0, 0, 0, 0.18)';
            ctx.beginPath();
            ctx.ellipse(0, 14, 22, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            if (isNear) {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // 2. Chân / Giày đen
            ctx.fillStyle = '#2b2b2b';
            ctx.beginPath();
            ctx.roundRect(-8, 8 + bob + legSwing, 6, 8, 2);
            ctx.roundRect(2, 8 + bob - legSwing, 6, 8, 2);
            ctx.fill();

            // Váy / Quần
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.roundRect(-9, 2 + bob, 18, 9, 2);
            ctx.fill();

            // Áo trắng đầu bếp & Tạp dề
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(-12, -14 + bob, 24, 18, 4);
            ctx.fill();
            ctx.stroke();

            // Khăn quàng cổ màu đỏ lễ hội
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(-7, -13 + bob);
            ctx.lineTo(7, -13 + bob);
            ctx.lineTo(0, -6 + bob);
            ctx.closePath();
            ctx.fill();

            // Hàng cúc áo đôi vàng óng
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(-4, -8 + bob, 1.5, 0, Math.PI * 2);
            ctx.arc(-4, -3 + bob, 1.5, 0, Math.PI * 2);
            ctx.arc(4, -8 + bob, 1.5, 0, Math.PI * 2);
            ctx.arc(4, -3 + bob, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Tay áo & Tay cầm chiếc giỏ / thìa
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-16, -11 + bob, 5, 11, 2);
            ctx.roundRect(11, -11 + bob, 5, 11, 2);
            ctx.fill();

            // Khuôn mặt Chibi dễ thương
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, -22 + bob, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e29578';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Mắt cười híp mí vui tươi
            ctx.strokeStyle = '#4a2810';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(-4, -22 + bob, 2.5, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(4, -22 + bob, 2.5, Math.PI, 0);
            ctx.stroke();

            // Má hồng e ấp
            ctx.fillStyle = 'rgba(255, 112, 166, 0.55)';
            ctx.beginPath();
            ctx.arc(-7, -19 + bob, 2.2, 0, Math.PI * 2);
            ctx.arc(7, -19 + bob, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Tóc đen mái bằng gọn gàng
            ctx.fillStyle = '#2d1810';
            ctx.beginPath();
            ctx.arc(0, -26 + bob, 12, Math.PI, 0);
            ctx.fill();

            // Mũ đầu bếp (Chef Toque) trắng bồng bềnh
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-11, -33 + bob, 22, 6, 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-7, -38 + bob, 6, 0, Math.PI * 2);
            ctx.arc(0, -41 + bob, 8, 0, Math.PI * 2);
            ctx.arc(7, -38 + bob, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Nơ đỏ nhỏ trên mũ
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -32 + bob, 2, 0, Math.PI * 2);
            ctx.fill();

            // 3. Bong bóng tên trên đầu
            let chefPrompt = '👩‍🍳 Cô Mai Bếp Trưởng';
            if (isNear) {
                const q = (window.useGameStore && window.useGameStore.state.quests.nhiem_vu_gio_qua) || { status: 'not_started' };
                const hasGift = (window.useGameStore && (window.useGameStore.hasItem('hop_qua_tet', 1) || window.useGameStore.hasItem('hop_banh', 1)));
                if (q.status === 'not_started') {
                    chefPrompt = '👩‍🍳 Bếp Trưởng: Bấm [E] Nhận Quà';
                } else if (q.status === 'in_progress') {
                    chefPrompt = hasGift ? '👩‍🍳 Bếp Trưởng: Bấm [E] Giao Hộp Quà' : '👩‍🍳 Bếp Trưởng: Bấm [E] Hướng Dẫn';
                } else {
                    chefPrompt = '👩‍🍳 Bếp Trưởng: Bấm [E] Trò Chuyện';
                }
            }

            const tagW = isNear ? 195 : 155;
            const tagH = 26;
            const tagY = -68 + bob;

            ctx.fillStyle = isNear ? '#fff9db' : '#fbf6d9';
            ctx.strokeStyle = isNear ? '#ea580c' : '#7c6348';
            ctx.lineWidth = isNear ? 2.5 : 1.5;
            ctx.beginPath();
            ctx.roundRect(-tagW / 2, tagY, tagW, tagH, 13);
            ctx.fill();
            ctx.stroke();

            // Mũi tên chỉ xuống
            ctx.fillStyle = isNear ? '#ea580c' : '#7c6348';
            ctx.beginPath();
            ctx.moveTo(-6, tagY + tagH);
            ctx.lineTo(6, tagY + tagH);
            ctx.lineTo(0, tagY + tagH + 5);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = isNear ? '#9a3412' : '#3b2512';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chefPrompt, 0, tagY + tagH / 2);

            // Gợi ý tương tác cao cấp khi ở gần
            if (isNear && window.drawWorldPromptBadge) {
                const badgeLabel = (chefPrompt.includes('Giao') ? '[E] Giao Hộp Quà 🎁' : (chefPrompt.includes('Nhận') ? '[E] Nhận Nhiệm Vụ 🎁' : '[E] Trò Chuyện 💬'));
                window.drawWorldPromptBadge(ctx, 0, tagY - 16, badgeLabel, {
                    theme: 'gold',
                    timer: this.globalTime,
                    pointer: true
                });
            }

            ctx.restore();
        }

        drawBoothMarker(ctx, booth, isHighlight) {
            ctx.save();
            ctx.translate(booth.triggerX, booth.triggerY);

            const pulse = (Math.sin(this.globalTime * 3.5) + 1) * 0.5;

            // ========================================================
            // 1. VÒNG TRÒN TRONG SUỐT DƯỚI MẶT ĐẤT (TRANSPARENT GROUND ZONE)
            // Chuẩn phong cách vòng tròn ma pháp trong suốt như map 1
            // ========================================================
            const rx = booth.groundRadiusX + (isHighlight ? pulse * 8 : 0);
            const ry = booth.groundRadiusY + (isHighlight ? pulse * 4 : 0);

            // Nền hào quang trong suốt tỏa dần ra ngoài (Ground Texture hoàn toàn thấy rõ)
            const grad = ctx.createRadialGradient(0, 5, 0, 0, 5, rx);
            if (isHighlight) {
                grad.addColorStop(0, booth.groundColor || 'rgba(255, 209, 102, 0.40)');
                grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.16)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
                grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.05)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, 5, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Đường viền nét đứt ma pháp xoay tròn thanh thoát (Animated Dashed Rune Ring)
            ctx.strokeStyle = isHighlight ? (booth.accentColor || '#ffd166') : 'rgba(255, 255, 255, 0.50)';
            ctx.lineWidth = isHighlight ? 2.2 : 1.5;
            ctx.setLineDash([8, 6]);
            ctx.lineDashOffset = -this.globalTime * 20;
            ctx.beginPath();
            ctx.ellipse(0, 5, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash

            // Vòng tròn ánh sáng mảnh bao quanh bên ngoài
            ctx.strokeStyle = isHighlight ? (booth.themeColor || '#2ec4b6') : 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.ellipse(0, 5, rx + 4, ry + 2, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Tâm sáng nhẹ lấp lánh ở giữa vòng tròn
            ctx.fillStyle = isHighlight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.40)';
            ctx.beginPath();
            ctx.ellipse(0, 5, 4, 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Các hạt sáng bay bổng nhẹ nhàng (Sparkles)
            for (let i = 0; i < 5; i++) {
                const phase = (this.globalTime * 1.4 + i * 0.2) % 1;
                const angle = (i * Math.PI * 2 / 5) + this.globalTime * 0.7;
                const spX = Math.cos(angle) * (rx * 0.65);
                const spY = 5 + Math.sin(angle) * (ry * 0.65) - phase * 30;
                const alpha = (1 - phase) * (isHighlight ? 0.9 : 0.6);
                const sz = 1.2 + (1 - phase) * 1.5;
                ctx.fillStyle = isHighlight ? booth.accentColor : `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(spX, spY, sz, 0, Math.PI * 2);
                ctx.fill();
            }

            // ========================================================
            // 2. BIỂN TÊN GIAN HÀNG NỔI LƠ LỬNG PHÍA TRÊN (FLOATING BADGE)
            // Phong cách Tag Pill hiện đại, viền dạ quang đồng bộ với Map 1
            // ========================================================
            const bobY = Math.sin(this.globalTime * 3.5) * 4;
            const cardY = -85 + bobY;
            const cardW = isHighlight ? 155 : 140;
            const cardH = 28;

            // Mũi tên chỉ xuống vòng tròn
            ctx.fillStyle = '#1e2430';
            ctx.beginPath();
            ctx.moveTo(-6, cardY + cardH);
            ctx.lineTo(6, cardY + cardH);
            ctx.lineTo(0, cardY + cardH + 6);
            ctx.closePath();
            ctx.fill();

            // Khung tag dạng pill đổ bóng nhẹ
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = '#1e2430';
            ctx.beginPath();
            ctx.roundRect(-cardW / 2, cardY, cardW, cardH, 15);
            ctx.fill();

            // Viền sáng viền tag theo màu chủ đạo của quầy
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = isHighlight ? 2.2 : 1.6;
            ctx.strokeStyle = booth.themeColor || '#ffd166';
            ctx.stroke();

            // Icon + Tên quầy nổi bật sắc nét
            ctx.font = 'bold 13px "SVN-Cookies", "Nunito", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${booth.icon} ${booth.shortTitle}`, 0, cardY + cardH / 2 + 1);

            // Gợi ý "[E] Chơi Ngay ➔" khi nhân vật bước vào vòng tròn
            if (isHighlight) {
                if (window.drawWorldPromptBadge) {
                    window.drawWorldPromptBadge(ctx, 0, cardY - 14, '[E] Chơi Ngay ➔', {
                        theme: 'purple',
                        timer: this.globalTime,
                        pointer: true
                    });
                }
            }

            ctx.restore();
        }

        updatePromptUI() {
            let promptEl = document.getElementById('game-zone-proximity-prompt');
            if (!promptEl) {
                const parent = document.getElementById('game-wrapper') || document.body;
                promptEl = document.createElement('div');
                promptEl.id = 'game-zone-proximity-prompt';
                promptEl.className = 'absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 bg-[#fbf6d9]/95 border-2 border-[#5c4731] rounded-2xl shadow-2xl font-quest text-xs text-[#3b2512] flex items-center gap-4 pointer-events-auto transition-all';
                promptEl.style.display = 'none';
                parent.appendChild(promptEl);
            }

            if (this.nearbyBooth && !this.activeGameInstance) {
                promptEl.style.display = 'flex';
                const b = this.nearbyBooth;
                promptEl.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <span class="text-3xl">${b.icon}</span>
                        <div>
                            <div class="font-bold text-base text-[#2b1704] font-quest leading-tight">${b.name}</div>
                            <div class="text-[12px] text-[#6b4e31] font-quest">Bạn đang đứng trong vòng tròn chơi game! Bấm phím [E] hoặc chạm nút bên phải</div>
                        </div>
                    </div>
                    <button class="quest-image2-btn font-quest text-xs font-bold py-2 px-4 shrink-0 flex items-center gap-1.5 shadow-md transform hover:scale-105 active:scale-95 transition-all" onclick="window.gameZoneManager.openGameBoard('${b.id}')">
                        <span>🎮</span> <span>CHƠI NGAY [E]</span>
                    </button>
                `;
            } else {
                promptEl.style.display = 'none';
            }
        }

        // Tự động kiểm tra và chèn Modal Bảng Game nếu chưa có trong DOM
        ensureGameBoardModal() {
            let modal = document.getElementById('game-board-modal');
            if (modal) return modal;

            const wrapper = document.getElementById('game-wrapper') || document.body;
            modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.id = 'game-board-modal';
            modal.innerHTML = `
                <div class="modal-box modal-box-beige w-[800px] max-w-[96vw] max-h-[96vh] flex flex-col">
                    <!-- Header Bảng Game -->
                    <div class="modal-header-beige flex items-center justify-between py-2 px-4">
                        <div class="flex items-center space-x-2.5 font-quest text-lg sm:text-xl font-bold text-[#3b2512]">
                            <span id="game-board-icon" class="text-2xl">🎮</span>
                            <span id="game-board-title">BẢNG TRÒ CHƠI HỘI CHỢ</span>
                        </div>
                        <button class="quest-modal-close-btn modal-close-btn font-quest" onclick="window.gameZoneManager.closeGameBoard()" title="Đóng bảng game">&times;</button>
                    </div>

                    <!-- Thân Bảng Game -->
                    <div class="modal-body p-3 sm:p-4 space-y-2.5 font-quest flex flex-col items-center">
                        <!-- Mô tả & Phần thưởng mục tiêu (Thiết kế chống co quắp, trải rộng thoáng đãng) -->
                        <div class="w-full bg-[#f3e9c6] rounded-xl border border-[#7c6348] p-2.5 sm:px-3.5 shadow-sm flex flex-col gap-1.5">
                            <div class="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                                <div class="flex items-center gap-2 font-bold text-[#2b1704]">
                                    <span class="text-base">🕹️</span>
                                    <span id="game-board-desc" class="leading-snug">Chơi đạt điểm mục tiêu để nhận thưởng trực tiếp vào túi đồ!</span>
                                </div>
                                <div class="text-[11px] text-[#2d6a4f] font-semibold bg-[#e8f5e9] px-2.5 py-0.5 rounded-full border border-[#a3b18a] shrink-0">
                                    ✨ Quà tự động lưu vĩnh viễn vào Balo
                                </div>
                            </div>
                            <!-- Danh sách phần thưởng xem trước dạng chip ngang -->
                            <div id="game-board-rewards-preview" class="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto py-0.5 w-full">
                                <!-- Render bằng JS -->
                            </div>
                        </div>

                        <!-- Khung Canvas Minigame 640 x 480 sắc nét, tự co dãn vừa vặn -->
                        <div class="relative w-[640px] max-w-full aspect-[4/3] max-h-[58vh] bg-[#11111b] rounded-xl overflow-hidden border-2 border-[#5c4731] shadow-inner flex items-center justify-center">
                            <canvas id="game-board-canvas" width="640" height="480" class="block w-full h-full object-contain"></canvas>
                        </div>

                        <!-- Thanh phím bấm điều khiển riêng cho từng minigame -->
                        <div id="game-board-custom-controls" class="w-full flex items-center justify-center gap-2 py-1"></div>

                        <!-- Thanh nút bấm chân modal -->
                        <div class="w-full flex items-center justify-between pt-1">
                            <div class="flex items-center gap-2">
                                <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 shadow-sm transform active:scale-95" onclick="window.gameZoneManager.restartCurrentGame()">
                                    <span>🔄</span> <span>Chơi Lại Ván Mới</span>
                                </button>
                                <button class="px-3 py-1.5 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl text-xs font-bold font-quest transition-all shadow-sm flex items-center gap-1.5" onclick="window.uiManager.openBackpackModal()">
                                    <img src="icon/bag.png" class="w-4 h-4 object-contain inline-block drop-shadow" /> <span>Xem Balo Kho Đồ [B]</span>
                                </button>
                            </div>
                            <button class="px-4 py-1.5 bg-[#e76f51] hover:bg-[#f4a261] text-white border-2 border-[#9d0208] rounded-xl text-xs font-bold font-quest transition-all shadow-sm" onclick="window.gameZoneManager.closeGameBoard()">
                                <span>❌ Đóng Bảng Game</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            wrapper.appendChild(modal);

            // Gắn sự kiện đóng khi click ra ngoài
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeGameBoard();
                }
            });

            return modal;
        }

        // Mở bảng trò chơi (Bảng Game Modal)
        openGameBoard(boothId) {
            const booth = this.booths[boothId];
            if (!booth) return;

            this.activeGameType = boothId;

            // Đảm bảo modal tồn tại
            const modal = this.ensureGameBoardModal();
            if (!modal) return;

            // Điền thông tin vào modal
            const titleEl = document.getElementById('game-board-title');
            const descEl = document.getElementById('game-board-desc');
            const iconEl = document.getElementById('game-board-icon');
            const rewardsGridEl = document.getElementById('game-board-rewards-preview');

            if (titleEl) titleEl.innerText = `${booth.name}`;
            if (iconEl) iconEl.innerText = booth.icon;
            if (descEl) descEl.innerText = booth.desc;

            if (rewardsGridEl && booth.rewardsPreview) {
                rewardsGridEl.innerHTML = booth.rewardsPreview.map(r => `
                    <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[#fffcf2] border border-[#d4a373] rounded-xl font-quest shadow-xs text-xs whitespace-nowrap shrink-0 hover:border-[#b07d4b] transition-all">
                        ${r.iconImg ? `<img src="${r.iconImg}" class="w-5 h-5 object-contain drop-shadow-sm shrink-0">` : `<span class="text-lg">${r.icon}</span>`}
                        <span class="font-bold text-[#3b2512] text-[11px]">${r.name}</span>
                        <span class="text-[10px] text-[#2d6a4f] bg-[#d8f3dc] px-1.5 py-0.2 rounded-full font-bold border border-[#b7e4c7]">${r.req}</span>
                    </div>
                `).join('');
            }

            // Gắn thanh phím điều khiển tương ứng với game
            this.setupCustomControls(booth.id);

            // Mở modal thông qua UI Manager
            if (window.uiManager) {
                window.uiManager.openModal(modal);
            } else {
                modal.classList.add('active');
                modal.classList.add('modal-visible');
            }

            // Khởi tạo trò chơi trên Canvas modal
            setTimeout(() => {
                this.startGameInstance(booth);
            }, 80);
        }

        setupCustomControls(boothId) {
            const container = document.getElementById('game-board-custom-controls');
            if (!container) return;

            if (boothId === 'shooting') {
                container.innerHTML = `
                    <button class="px-3 py-1.5 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs select-none shadow-sm flex items-center gap-1"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveLane(-1);">
                        <span>▲</span> <span>Lên Làn (W / ▲)</span>
                    </button>
                    <button class="px-3 py-1.5 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs select-none shadow-sm flex items-center gap-1"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveLane(1);">
                        <span>▼</span> <span>Xuống Làn (S / ▼)</span>
                    </button>
                    <button class="px-5 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-quest font-bold text-xs rounded-xl shadow-md border-2 border-white flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.shoot();">
                        <span>🔥</span> <span>BẮN SKILL (Space / Click)</span>
                    </button>
                    <button class="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-[#4a2800] font-quest font-bold text-xs rounded-xl shadow-md border-2 border-[#ffe066] flex items-center gap-1 transform active:scale-95"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.triggerUltimate();">
                        <span>💥</span> <span>CHIÊU CUỐI [E]</span>
                    </button>
                    <span class="text-xs text-[#5c4731] font-quest ml-1">💡 W/S hoặc Click đổi 3 làn • Space bắn skill • Rớt ngọc nâng cấp!</span>
                `;
            } else if (boothId === 'food') {
                container.innerHTML = `
                    <button class="px-3.5 py-1.5 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs select-none shadow-sm flex items-center gap-1"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveLeft(45);"
                        onmousedown="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=true;"
                        onmouseup="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=false;"
                        ontouchstart="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=true;"
                        ontouchend="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=false;">
                        ◀ Trái (A)
                    </button>
                    <button class="px-3 py-1.5 bg-[#e7c6ff] hover:bg-[#d8b4fe] active:bg-[#c084fc] text-[#4a044e] border-2 border-[#7e22ce] rounded-xl font-quest font-bold text-xs select-none shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.toggleBowl();">
                        <span>🥣</span> <span>Đổi Mẫu Tô [T]</span>
                    </button>
                    <button class="px-3.5 py-1.5 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs select-none shadow-sm flex items-center gap-1"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveRight(45);"
                        onmousedown="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=true;"
                        onmouseup="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=false;"
                        ontouchstart="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=true;"
                        ontouchend="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=false;">
                        Phải (D) ▶
                    </button>
                    <span class="text-xs text-[#5c4731] font-quest ml-2">💡 Di chuột/phím A-D • Phím T đổi Tô Gấu / Tô Hồng • Tránh cá ươn, bom! 🧲 Hút đồ</span>
                `;
            } else if (boothId === 'claw') {
                container.innerHTML = `
                    <button class="px-4 py-2 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs shadow-md transform active:scale-95 flex items-center gap-1.5 transition-all select-none"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveLeft(30);"
                        onmousedown="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=true;"
                        onmouseup="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=false;"
                        ontouchstart="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=true;"
                        ontouchend="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowLeft']=false;">
                        <span class="text-base">◀</span> <span>Sang Trái (A / ◄)</span>
                    </button>
                    <button class="px-7 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-400 text-white font-quest font-bold rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 text-sm transform active:scale-95 animate-pulse cursor-pointer transition-all select-none"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.triggerDrop();">
                        <span class="text-xl">🕹️</span> <span>HẠ CẦN GẮP (Space / Click)</span>
                    </button>
                    <button class="px-4 py-2 bg-[#fbf6d9] hover:bg-[#fff9e6] active:bg-[#faedcd] text-[#3b2512] border-2 border-[#5c4731] rounded-xl font-quest font-bold text-xs shadow-md transform active:scale-95 flex items-center gap-1.5 transition-all select-none"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.moveRight(30);"
                        onmousedown="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=true;"
                        onmouseup="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=false;"
                        ontouchstart="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=true;"
                        ontouchend="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.keys['ArrowRight']=false;">
                        <span>Sang Phải (D / ►)</span> <span class="text-base">▶</span>
                    </button>
                    <span class="text-xs text-[#5c4731] font-quest ml-1">💡 Gạt cần joystick & bấm nút tròn trên máy • Hoặc dùng phím A/D & Space</span>
                `;
            } else if (boothId === 'cow') {
                container.innerHTML = `
                    <button class="px-7 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-quest font-bold text-sm rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 transform active:scale-95 animate-pulse cursor-pointer select-none"
                        onclick="if(window.gameZoneManager.activeGameInstance) window.gameZoneManager.activeGameInstance.pull();">
                        <span>🎯</span> <span>QUĂNG DÂY / NHẤN LIÊN TỤC ĐỂ KÉO! [SPACE]</span>
                    </button>
                    <span class="text-xs text-[#5c4731] font-quest ml-2">💡 Quăng thòng lọng vào chú bò chạy vòng tròn • Khi dính dây, NHẤN SPACE LIÊN TỤC để giằng co (thả là bò chạy mất!) • Hụt = Thua!</span>
                `;
            }
        }

        startGameInstance(booth) {
            // Dừng instance cũ nếu có
            if (this.activeGameInstance && typeof this.activeGameInstance.stop === 'function') {
                this.activeGameInstance.stop();
                this.activeGameInstance = null;
            }

            const canvas = document.getElementById('game-board-canvas');
            if (!canvas) return;

            // Khởi tạo Game tương ứng
            if (booth.id === 'shooting') {
                this.activeGameInstance = new window.ShootingGalleryGame('game-board-canvas');
            } else if (booth.id === 'food') {
                this.activeGameInstance = new window.FallingFoodCatcherGame('game-board-canvas');
            } else if (booth.id === 'claw') {
                this.activeGameInstance = new window.ClawMachineGame('game-board-canvas');
            } else if (booth.id === 'cow') {
                this.activeGameInstance = new window.CowPullingGame('game-board-canvas');
            }

            if (this.activeGameInstance) {
                this.activeGameInstance.init();
                this.activeGameInstance.start();
            }
        }

        restartCurrentGame() {
            if (this.activeGameType && this.booths[this.activeGameType]) {
                this.startGameInstance(this.booths[this.activeGameType]);
            }
        }

        closeGameBoard() {
            if (this.activeGameInstance && typeof this.activeGameInstance.stop === 'function') {
                this.activeGameInstance.stop();
                this.activeGameInstance = null;
            }
            this.activeGameType = null;

            const modal = document.getElementById('game-board-modal');
            if (modal) {
                if (window.uiManager) {
                    window.uiManager.closeAllModals();
                } else {
                    modal.classList.remove('active');
                    modal.classList.remove('modal-visible');
                }
            }
        }
    }

    // Gắn instance toàn cục
    window.gameZoneManager = new GameZoneManager();

})(window);
