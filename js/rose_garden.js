/**
 * ====================================================================
 * 🌹 TNU: ĐÔI CÁNH ĐẠI NGÀN - HỆ THỐNG VƯỜN HOA HỒNG (ROSE GARDEN MODULE)
 * ====================================================================
 * Đồ Họa Hand-Drawn Cozy Isometric Garden (Phong cách Ghibli / Stardew Valley)
 * 
 * BỘ TÀI NGUYÊN & CẤU TRÚC KHU VƯỜN:
 * 1. KHUÔN VIÊN VƯỜN HOA THỦ CÔNG CAO CẤP:
 *    - Toàn cảnh khu vườn nghệ thuật (assets/rose_garden/garden_scene_1280.png):
 *      + Bên trái: Vườn rào gỗ mộc mạc với cửa cổng mở rộng và mảnh đất cày xới màu mỡ 5 luống.
 *      + Bên phải: Sân đá lát cuội (cobblestone) cổ kính dẫn tới các rạp hàng.
 *      + Rạp 1 (Mái sọc đỏ - kem): Tiệm Bán Hạt Giống của Bác Ba với kệ gỗ bày các túi hạt và bao phân bón.
 *      + Rạp 2 (Mái sọc xanh - trắng): Tiệm Bình Tưới & Dụng Cụ của Chị Mai với giá kệ bày các bình tưới đủ màu.
 *      + Góc dưới phải: Vòi nước & máng gỗ chứa nước trong vắt để hứng nước vào bình tưới.
 *      + Chi tiết phụ cảnh: Xe rùa chở đất, xẻng cào, chậu hoa cẩm tú cầu, hoa cúc dại, đèn lồng gỗ.
 * 2. 10 LUỐNG ĐẤT TRỒNG HOA TRÊN MẶT ĐẤT CÀY (ISOMETRIC SOIL RIDGES):
 *    - 10 luống đất nằm chính xác trên 5 rãnh đất cày xới màu mỡ.
 *    - Ban đầu 100% đều TRỐNG HOÀN TOÀN (state: 'empty').
 *    - Khi trồng mới có hoa hồng!
 * 3. QUY TRÌNH SINH TRƯỞNG & HOA NỞ MỚI ĐƯỢC HÁI:
 *    - Luống trống ('empty') ➔ Gieo hạt ('seeded') ➔ Bắt buộc phải TƯỚI NƯỚC ('watered')
 *    - Sau khi tưới ➔ Đếm giờ sinh trưởng:
 *      + Nhú mầm xanh non 2 lá ('sprout')
 *      + Đơm cành & nụ hoa ('bud')
 *      + Hoa nở rộ ('bloomed')
 *    - Tỉ lệ nở hoa chuẩn: 9/10 (90%) Hoa Hồng Đỏ, 1/10 (10%) Hoa Hồng Trắng Quý Hiếm (tỏa hào quang vàng kim).
 *    - HOA NỞ MỚI ĐƯỢC HÁI: Trong lúc đang sinh trưởng, người chơi không thể hái. Chỉ khi hoa nở rực rỡ mới được hái!
 * 4. CHIỀU SÂU 2.5D (Y-SORTING FOREGROUND LAYERS):
 *    - Người chơi có thể đi xuyên qua cổng vào vườn, đi sau quầy rạp hay trước máng nước với độ che khuất tự nhiên.
 */

(function(window) {
    'use strict';

    // Polyfill roundRect cho Canvas
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (typeof r === 'undefined') r = 0;
            if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
            this.beginPath();
            this.moveTo(x + r.tl, y);
            this.lineTo(x + w - r.tr, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
            this.lineTo(x + w, y + h - r.br);
            this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
            this.lineTo(x + r.bl, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
            this.lineTo(x, y + r.tl);
            this.quadraticCurveTo(x, y, x + r.tl, y);
            this.closePath();
            return this;
        };
    }

    // ====================================================================
    // 1. CẤU HÌNH & HẰNG SỐ CƠ BẢN
    // ====================================================================
    const GARDEN_CONFIG = {
        WHITE_ROSE_RATE: 0.10, // 1/10 (10%) Hoa Hồng Trắng Hiếm
        RED_ROSE_RATE: 0.90,   // 9/10 (90%) Hoa Hồng Đỏ Thường
        DEFAULT_SEEDS: 8,
        DEFAULT_WATER_CAPACITY: 5,
        DEFAULT_WATER: 3,
        GROWTH_DURATION: 8.5,  // Thời gian hoa lớn từ lúc tưới (giây)
        STORAGE_KEY_ASSETS: 'tnu_rose_garden_custom_assets'
    };

    // ====================================================================
    // 2. TRÌNH QUẢN LÝ TÀI NGUYÊN HÌNH ẢNH (ASSET MANAGER)
    // ====================================================================
    class RoseGardenAssetManager {
        constructor() {
            this.customAssets = {};
            this.imageCache = {};
            this.defaultImageCache = {};
            this.listeners = [];

            this.defaultAssets = {
                garden_bg: 'assets/rose_garden/garden_scene_1280.png',
                red_rose: 'assets/rose_garden/rose_red.png',
                white_rose: 'assets/rose_garden/rose_white.png',
                rose_bud: 'assets/rose_garden/rose_bud.png',
                rose_sprout: 'assets/rose_garden/rose_sprout.png',
                seed_shop: 'assets/rose_garden/icons/cardboard_box.png',
                tool_shop: 'assets/rose_garden/can_blue.png',
                faucet: 'assets/rose_garden/icons/water_drop.png',
                soil_empty: 'assets/rose_garden/soil_empty.png',
                soil_seeded: 'assets/rose_garden/soil_seeded.png',
                soil_watered: 'assets/rose_garden/soil_watered.png',
                watering_can: 'assets/rose_garden/can_blue.png',
                water_droplet: 'assets/rose_garden/icons/water_drop.png',
                seeds: 'assets/rose_garden/icons/cardboard_box.png',
                fg_seed_stall: 'assets/rose_garden/fg_seed_stall.png',
                fg_tool_stall: 'assets/rose_garden/fg_tool_stall.png',
                fg_trough: 'assets/rose_garden/fg_trough.png',
                fg_wheelbarrow: 'assets/rose_garden/fg_wheelbarrow.png'
            };

            this.init();
        }

        init() {
            this.assetDefinitions = {
                red_rose: {
                    id: 'red_rose',
                    name: 'Hoa Hồng Đỏ',
                    desc: 'Đóa hoa hồng đỏ thắm nở rộ khi được chăm sóc (tỉ lệ 9/10)',
                    defaultIcon: '🌹',
                    presetOptions: [
                        'assets/rose_garden/icons/flower_pink.png',
                        'assets/rose_garden/rose_red.png',
                        'assets/rose_garden/user_hoado.png',
                        'assets/rose_garden/tw_rose.png',
                        'picture/14265.png'
                    ]
                },
                white_rose: {
                    id: 'white_rose',
                    name: 'Hoa Hồng Trắng Quý Hiếm',
                    desc: 'Đóa hoa bạch ngọc tỏa hào quang thiên thần (tỉ lệ 1/10 hiếm thấy)',
                    defaultIcon: '💮',
                    presetOptions: [
                        'assets/rose_garden/icons/flower_white.png',
                        'assets/rose_garden/rose_white.png',
                        'picture/14266.png'
                    ]
                },
                rose_bud: {
                    id: 'rose_bud',
                    name: 'Nụ Hoa Hồng',
                    desc: 'Nụ hoa chớm hé lộ trên cành lá sau khi tưới nước',
                    defaultIcon: '🥀',
                    presetOptions: ['assets/rose_garden/rose_bud.png']
                },
                rose_sprout: {
                    id: 'rose_sprout',
                    name: 'Mầm Hoa Non',
                    desc: 'Mầm xanh 2 lá non nhú lên từ lòng đất sau khi tưới nước',
                    defaultIcon: '🌱',
                    presetOptions: [
                        'assets/rose_garden/icons/sprout_soil.png',
                        'assets/rose_garden/rose_sprout.png',
                        'assets/rose_garden/tw_sprout.png'
                    ]
                },
                seed_shop: {
                    id: 'seed_shop',
                    name: 'Rạp Bán Hạt Giống',
                    desc: 'Rạp gỗ mái bạt sọc đỏ - kem của Bác Ba bán hạt giống hoa hồng',
                    defaultIcon: '🏪',
                    presetOptions: [
                        'assets/rose_garden/icons/wheat.png',
                        'assets/rose_garden/seed_shop.png',
                        'icon/bag.png'
                    ]
                },
                tool_shop: {
                    id: 'tool_shop',
                    name: 'Rạp Bán Đồ Tưới Hoa',
                    desc: 'Quầy bán bình tưới nước mái sọc xanh - trắng của Chị Mai',
                    defaultIcon: '🚿',
                    presetOptions: [
                        'assets/rose_garden/icons/shower_head.png',
                        'assets/rose_garden/tool_shop.png',
                        'icon/thien_cam.png'
                    ]
                },
                faucet: {
                    id: 'faucet',
                    name: 'Vòi Nước & Máng Nước',
                    desc: 'Vòi nước & máng gỗ chứa nước mát để hứng đầy bình tưới',
                    defaultIcon: '💧',
                    presetOptions: [
                        'assets/rose_garden/icons/water_drop.png',
                        'assets/rose_garden/water_faucet.png',
                        'assets/rose_garden/tw_faucet.png'
                    ]
                },
                watering_can: {
                    id: 'watering_can',
                    name: 'Bình Tưới Nước',
                    desc: 'Bình tưới hoa phong cách cổ điển cầm tay',
                    defaultIcon: '🪴',
                    presetOptions: [
                        'assets/rose_garden/icons/flower_pot.png',
                        'assets/rose_garden/icons/shower_head.png',
                        'assets/rose_garden/icons/clay_vase.png',
                        'assets/rose_garden/watering_can.png'
                    ]
                },
                seeds: {
                    id: 'seeds',
                    name: 'Gói Hạt Giống Hoa',
                    desc: 'Bao tải gai chứa hạt giống hoa hồng tuyển chọn',
                    defaultIcon: '🌰',
                    presetOptions: [
                        'assets/rose_garden/icons/chestnut.png',
                        'assets/rose_garden/icons/cardboard_box.png',
                        'assets/rose_garden/seed_packet.png'
                    ]
                }
            };

            // Preload toàn bộ ảnh mặc định
            Object.keys(this.defaultAssets).forEach(key => {
                this.loadDefaultImage(key, this.defaultAssets[key]);
            });

            this.loadFromStorage();
        }

        loadDefaultImage(key, src) {
            const img = new Image();
            img.onload = () => {
                this.defaultImageCache[key] = img;
                this.notifyListeners();
            };
            img.src = src;
        }

        loadFromStorage() {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const saved = window.localStorage.getItem(GARDEN_CONFIG.STORAGE_KEY_ASSETS);
                    if (saved) {
                        this.customAssets = JSON.parse(saved);
                        // Xóa các liên kết asset cũ để ưu tiên bộ sprite hoa hồng và icon mới vẽ
                        ['red_rose', 'white_rose', 'rose_bud', 'rose_sprout', 'watering_can', 'seeds'].forEach(k => {
                            if (this.customAssets[k] && (
                                this.customAssets[k].includes('picture/') || 
                                this.customAssets[k].includes('icons/flower_') ||
                                this.customAssets[k].includes('tw_')
                            )) {
                                delete this.customAssets[k];
                            }
                        });
                        Object.keys(this.customAssets).forEach(key => {
                            this.loadImage(key, this.customAssets[key]);
                        });
                    }
                }
            } catch (e) {
                console.warn('Lỗi khi đọc custom assets từ localStorage:', e);
                this.customAssets = {};
            }
        }

        saveToStorage() {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem(GARDEN_CONFIG.STORAGE_KEY_ASSETS, JSON.stringify(this.customAssets));
                }
            } catch (e) {
                console.warn('Lỗi khi lưu custom assets vào localStorage:', e);
            }
            this.notifyListeners();
        }

        setAssetFromUrl(key, url) {
            if (!url) {
                this.removeAsset(key);
                return;
            }
            this.customAssets[key] = url;
            this.loadImage(key, url);
            this.saveToStorage();
        }

        setAssetFromFile(key, file) {
            return new Promise((resolve, reject) => {
                if (!file) return reject('Không có file');
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    this.customAssets[key] = dataUrl;
                    this.loadImage(key, dataUrl);
                    this.saveToStorage();
                    resolve(dataUrl);
                };
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
            });
        }

        removeAsset(key) {
            delete this.customAssets[key];
            delete this.imageCache[key];
            this.saveToStorage();
        }

        resetAllToHandDrawn() {
            this.customAssets = {};
            this.imageCache = {};
            this.saveToStorage();
        }

        loadImage(key, src) {
            if (!src) return;
            const img = new Image();
            img.onload = () => {
                this.imageCache[key] = img;
                this.notifyListeners();
            };
            img.src = src;
        }

        getImage(key) {
            const custom = this.imageCache[key];
            if (custom && custom.complete && custom.naturalWidth > 0) {
                return custom;
            }
            const def = this.defaultImageCache[key];
            if (def && def.complete && def.naturalWidth > 0) {
                return def;
            }
            return null;
        }

        hasCustom(key) {
            return !!(this.imageCache[key] && this.imageCache[key].complete && this.imageCache[key].naturalWidth > 0);
        }

        subscribe(callback) {
            this.listeners.push(callback);
        }

        notifyListeners() {
            this.listeners.forEach(cb => {
                try { cb(); } catch (e) { console.error(e); }
            });
        }
    }

    // ====================================================================
    // 3. THỰC THỂ LUỐNG HOA (ROSE GARDEN PLOT TRÊN RÃNH ĐẤT CÀY)
    // ====================================================================
    class RoseGardenPlot {
        constructor(id, x, y, assetManager, ridge = 1) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.ridge = ridge;
            this.assetManager = assetManager;

            // 'empty' ➔ 'seeded' ➔ 'watered' ➔ 'sprout' ➔ 'bud' ➔ 'bloomed'
            this.state = 'empty';
            this.flowerType = null; // 'red' (9/10) | 'white' (1/10)
            this.isRare = false;

            this.growTimer = 0;
            this.maxGrowTimer = GARDEN_CONFIG.GROWTH_DURATION;
            this.animTimer = Math.random() * 10;
            this.interactionDist = 55;
        }

        update(dt) {
            this.animTimer += dt;

            // Bắt đầu sinh trưởng CHỈ KHI ĐÃ ĐƯỢC TƯỚI NƯỚC
            if (this.state === 'watered' || this.state === 'sprout' || this.state === 'bud') {
                this.growTimer += dt;
                const progress = this.growTimer / this.maxGrowTimer;

                if (progress >= 1.0) {
                    this.bloom();
                } else if (progress >= 0.60) {
                    this.state = 'bud';
                } else if (progress >= 0.28) {
                    this.state = 'sprout';
                }
            }
        }

        plantSeed() {
            if (this.state !== 'empty') return false;
            this.state = 'seeded';
            this.growTimer = 0;
            this.flowerType = null;
            this.isRare = false;
            return true;
        }

        waterPlant() {
            if (this.state !== 'seeded') return false;
            this.state = 'watered';
            this.growTimer = 0;
            return true;
        }

        instantBloom() {
            if (this.state === 'empty') {
                this.plantSeed();
            }
            this.state = 'watered';
            this.growTimer = this.maxGrowTimer;
            this.bloom();
            return true;
        }

        bloom() {
            this.state = 'bloomed';
            const roll = Math.random();

            // 1/10 (10%) Hoa Hồng Trắng Hiếm, 9/10 (90%) Hoa Hồng Đỏ Thắm
            if (roll < GARDEN_CONFIG.WHITE_ROSE_RATE) {
                this.flowerType = 'white';
                this.isRare = true;
            } else {
                this.flowerType = 'red';
                this.isRare = false;
            }
            return { flowerType: this.flowerType, isRare: this.isRare };
        }

        harvest() {
            if (this.state !== 'bloomed') return { success: false };
            const result = {
                success: true,
                flowerType: this.flowerType,
                isRare: this.isRare
            };

            this.state = 'empty';
            this.flowerType = null;
            this.isRare = false;
            this.growTimer = 0;
            return result;
        }

        draw(ctx, playerDist) {
            ctx.save();
            const cx = this.x;
            const cy = this.y;
            const isNear = playerDist < this.interactionDist;

            // 1. VẼ MÔ ĐẤT ISOMETRIC ĐƯỢC CĂN THEO HƯỚNG RÃNH CÀY (-0.68 rad)
            this.drawSoilMound(ctx, cx, cy, isNear, playerDist);

            // 2. VẼ THỰC THỂ CÂY HOA THEO TỪNG GIAI ĐOẠN SINH TRƯỞNG
            if (this.state === 'empty') {
                // Đất trống đã xới tơi xốp sẵn sàng đón hạt giống
                this.drawEmptyPlot(ctx, cx, cy, isNear);

            } else if (this.state === 'seeded') {
                // Hạt giống đã gieo trên mô đất ẩm
                this.drawSeededPlot(ctx, cx, cy);

            } else if (this.state === 'watered') {
                // Đất đẫm nước lấp lánh và mầm chồi chuẩn bị hé
                this.drawWateredPlot(ctx, cx, cy);
                this.drawGrowthBar(ctx, cx, cy - 24, this.growTimer / this.maxGrowTimer);

            } else if (this.state === 'sprout') {
                // Mầm non 2 lá xanh nhú lên
                this.drawSproutPlot(ctx, cx, cy);
                this.drawGrowthBar(ctx, cx, cy - 28, this.growTimer / this.maxGrowTimer);

            } else if (this.state === 'bud') {
                // Nụ hoa vươn cao hé sắc
                this.drawBudPlot(ctx, cx, cy);
                this.drawGrowthBar(ctx, cx, cy - 32, this.growTimer / this.maxGrowTimer);

            } else if (this.state === 'bloomed') {
                // ĐÓA HOA NỞ RỰC RỠ TRÊN RÃNH ĐẤT
                this.drawBloomedPlot(ctx, cx, cy);
            }

            // 3. THẺ GỖ ĐÁNH DẤU SỐ LUỐNG TINH TẾ (KHÔNG CỌC CỒN CÀO)
            this.drawWoodPlotBadge(ctx, cx, cy);

            // 4. BONG BÓNG GỢI Ý TƯƠNG TÁC THÔNG MINH KHI LẠI GẦN
            if (isNear) {
                this.drawPromptBubble(ctx, cx, cy - 38);
            }

            ctx.restore();
        }

        drawSoilMound(ctx, cx, cy, isNear, playerDist) {
            ctx.save();
            // Bóng râm tiếp xúc mặt đất tự nhiên (Ambient occlusion)
            ctx.fillStyle = 'rgba(25, 15, 8, 0.40)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 3, 24, 12, -0.68, 0, Math.PI * 2);
            ctx.fill();

            // Nếu người chơi lại gần: vòng sáng viền hoe ấm áp mời tương tác
            if (isNear) {
                const alpha = Math.min(0.85, Math.max(0.25, 0.9 - (playerDist / this.interactionDist) * 0.6));
                ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
                ctx.lineWidth = 1.8;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                ctx.ellipse(cx, cy, 25, 13, -0.68, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            ctx.restore();
        }

        drawEmptyPlot(ctx, cx, cy, isNear) {
            ctx.save();
            // Lòng đất tơi xốp với các vệt xới nhẹ nhàng
            ctx.fillStyle = 'rgba(54, 32, 16, 0.28)';
            ctx.beginPath();
            ctx.ellipse(cx, cy, 18, 9, -0.68, 0, Math.PI * 2);
            ctx.fill();

            // Hạt sỏi hoặc vết cày xới nhỏ
            ctx.fillStyle = 'rgba(84, 52, 28, 0.45)';
            ctx.fillRect(cx - 5, cy - 2, 4, 2);
            ctx.fillRect(cx + 3, cy + 1, 5, 2);
            ctx.restore();
        }

        drawSeededPlot(ctx, cx, cy) {
            ctx.save();
            // Mô đất ươm tối màu
            ctx.fillStyle = 'rgba(40, 22, 10, 0.65)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 1, 19, 10, -0.68, 0, Math.PI * 2);
            ctx.fill();

            // Ưu tiên vẽ hình ụ đất mầm cây hoặc hạt giống hạt dẻ Chibi
            const soilImg = this.assetManager.getImage('soil_seeded');
            const seedImg = this.assetManager.getImage('seeds');
            if (soilImg) {
                const sw = 32;
                const sh = 30;
                ctx.drawImage(soilImg, cx - sw / 2, cy - sh + 9, sw, sh);
            } else if (seedImg) {
                const sw = 22;
                const sh = 22;
                ctx.drawImage(seedImg, cx - sw / 2, cy - sh + 6, sw, sh);
            } else {
                ctx.fillStyle = '#f59e0b';
                ctx.strokeStyle = '#78350f';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(cx, cy - 1, 4.5, 6, 0.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        drawWateredPlot(ctx, cx, cy) {
            ctx.save();
            // Đất đẫm nước óng ánh
            ctx.fillStyle = 'rgba(20, 38, 55, 0.68)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 1, 21, 11, -0.68, 0, Math.PI * 2);
            ctx.fill();

            // Hiệu ứng giọt nước hoạt hình mặt cười
            const dropletImg = this.assetManager.getImage('water_droplet');
            if (dropletImg) {
                const bob = Math.sin(this.animTimer * 4) * 2;
                ctx.drawImage(dropletImg, cx - 12, cy - 24 + bob, 24, 24);
            } else {
                // Các giọt sương & bọt nước lấp lánh sinh động
                for (let i = 0; i < 3; i++) {
                    const angle = this.animTimer * 2.5 + i * 2.1;
                    const dx = cx + Math.sin(angle) * 11;
                    const dy = cy + Math.cos(angle) * 5.5;
                    ctx.fillStyle = '#38bdf8';
                    ctx.beginPath();
                    ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        drawSproutPlot(ctx, cx, cy) {
            ctx.save();
            // Đất ẩm
            ctx.fillStyle = 'rgba(30, 45, 30, 0.55)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 1, 20, 10, -0.68, 0, Math.PI * 2);
            ctx.fill();

            const sproutImg = this.assetManager.getImage('rose_sprout');
            const sway = Math.sin(this.animTimer * 3) * 1.5;
            if (sproutImg) {
                const sw = 38;
                const sh = 36;
                ctx.drawImage(sproutImg, cx - sw / 2 + sway, cy - sh + 9, sw, sh);
            } else {
                // Fallback mầm non vẽ tay thanh thoát
                ctx.strokeStyle = '#15803d';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy + 3);
                ctx.quadraticCurveTo(cx + sway, cy - 6, cx + sway, cy - 12);
                ctx.stroke();

                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.ellipse(cx + sway - 6, cy - 13, 6, 3, -0.4, 0, Math.PI * 2);
                ctx.ellipse(cx + sway + 6, cy - 13, 6, 3, 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        drawBudPlot(ctx, cx, cy) {
            ctx.save();
            ctx.fillStyle = 'rgba(30, 45, 30, 0.55)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 1, 20, 10, -0.68, 0, Math.PI * 2);
            ctx.fill();

            const budImg = this.assetManager.getImage('rose_bud');
            const sway = Math.sin(this.animTimer * 2.4) * 1.5;
            if (budImg) {
                const bw = 44;
                const bh = 42;
                ctx.drawImage(budImg, cx - bw / 2 + sway, cy - bh + 10, bw, bh);
            } else {
                ctx.strokeStyle = '#15803d';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(cx, cy + 3);
                ctx.quadraticCurveTo(cx + sway, cy - 8, cx + sway, cy - 15);
                ctx.stroke();

                ctx.fillStyle = '#e11d48';
                ctx.beginPath();
                ctx.arc(cx + sway, cy - 17, 7, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        drawBloomedPlot(ctx, cx, cy) {
            ctx.save();
            const isWhite = (this.flowerType === 'white');
            const flowerImg = isWhite 
                ? this.assetManager.getImage('white_rose')
                : this.assetManager.getImage('red_rose');

            const sway = Math.sin(this.animTimer * 2) * 1.5;

            // Bóng râm gốc cây
            ctx.fillStyle = 'rgba(20, 15, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 22, 11, -0.68, 0, Math.PI * 2);
            ctx.fill();

            if (isWhite) {
                // HÀO QUANG THIÊN THẦN CỦA ĐÓA HOA BẠCH NGỌC HIẾM (1/10)
                const pulse = 1 + Math.sin(this.animTimer * 4) * 0.12;
                const glowR = 38 * pulse;
                const grad = ctx.createRadialGradient(cx + sway, cy - 16, 6, cx + sway, cy - 16, glowR);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                grad.addColorStop(0.40, 'rgba(254, 240, 138, 0.65)');
                grad.addColorStop(0.85, 'rgba(253, 224, 71, 0.20)');
                grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx + sway, cy - 16, glowR, 0, Math.PI * 2);
                ctx.fill();

                // Các ngôi sao 4 cánh lấp lánh xung quanh
                this.drawSparkleStar(ctx, cx - 22 + sway, cy - 28, 5);
                this.drawSparkleStar(ctx, cx + 22 + sway, cy - 26, 6);
                this.drawSparkleStar(ctx, cx + sway, cy - 38, 4.5);
            } else {
                // Ánh hồng ấm áp của đóa hồng đỏ
                const glowR = 26;
                const grad = ctx.createRadialGradient(cx + sway, cy - 14, 4, cx + sway, cy - 14, glowR);
                grad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
                grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx + sway, cy - 14, glowR, 0, Math.PI * 2);
                ctx.fill();
            }

            if (flowerImg) {
                const imgSize = isWhite ? 50 : 48;
                ctx.drawImage(flowerImg, cx - imgSize / 2 + sway, cy - imgSize + 11, imgSize, imgSize);
            } else {
                ctx.fillStyle = isWhite ? '#ffffff' : '#e11d48';
                ctx.beginPath();
                ctx.arc(cx + sway, cy - 16, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = isWhite ? '#fef08a' : '#881337';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.restore();
        }

        drawWoodPlotBadge(ctx, cx, cy) {
            ctx.save();
            // Thẻ gỗ mộc nằm êm trên mô đất cạnh rãnh cày
            const bx = cx - 18;
            const by = cy + 6;
            const bw = 24;
            const bh = 13;

            // Nền gỗ sẫm
            ctx.fillStyle = this.state === 'bloomed' ? (this.isRare ? '#701a75' : '#831843') : '#451a03';
            ctx.strokeStyle = this.state === 'bloomed' ? (this.isRare ? '#f0abfc' : '#fca5a5') : '#92400e';
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 4);
            ctx.fill();
            ctx.stroke();

            // Nhãn số luống
            ctx.fillStyle = '#fef3c7';
            ctx.font = 'bold 8.5px "Patrick Hand", "Outfit", cursive, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('#' + this.id, bx, by + 0.5);
            ctx.restore();
        }

        drawGrowthBar(ctx, x, y, progress) {
            ctx.save();
            const w = 46;
            const h = 6;
            const remainSec = Math.max(1, Math.ceil(this.maxGrowTimer - this.growTimer));

            // Vỏ khung gỗ thanh lịch
            ctx.fillStyle = 'rgba(45, 25, 12, 0.85)';
            ctx.strokeStyle = '#fef3c7';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x - w / 2, y, w, h, 3);
            ctx.fill();
            ctx.stroke();

            // Thanh tiến trình xanh ngọc tươi tắn
            const fillW = Math.max(0, (w - 2) * Math.min(1, progress));
            if (fillW > 0) {
                const grad = ctx.createLinearGradient(x - w / 2 + 1, y, x - w / 2 + fillW, y);
                grad.addColorStop(0, '#10b981');
                grad.addColorStop(1, '#38bdf8');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x - w / 2 + 1, y + 1, fillW, h - 2, 2);
                ctx.fill();
            }

            // Chữ thời gian đếm ngược
            ctx.font = 'bold 8px "Patrick Hand", "Outfit", cursive, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`⏳ ${remainSec}s`, x, y - 2);

            ctx.restore();
        }

        drawSparkleStar(ctx, cx, cy, size = 6) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.quadraticCurveTo(cx, cy, cx + size, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy + size);
            ctx.quadraticCurveTo(cx, cy, cx - size, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy - size);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        drawPromptBubble(ctx, cx, cy) {
            let text = '';
            let theme = 'gold';

            if (this.state === 'empty') {
                text = `🌱 [E] Luống #${this.id}: Gieo Hạt Giống`;
                theme = 'gold';
            } else if (this.state === 'seeded') {
                text = `💧 [E] Luống #${this.id}: Tưới Nước Mát`;
                theme = 'cyan';
            } else if (this.state === 'watered' || this.state === 'sprout' || this.state === 'bud') {
                const remainSec = Math.max(1, Math.ceil(this.maxGrowTimer - this.growTimer));
                text = `⏳ Luống #${this.id}: Đang lớn (${remainSec}s)`;
                theme = 'emerald';
            } else if (this.state === 'bloomed') {
                if (this.flowerType === 'white') {
                    text = `💮 [E] Thu Hoạch Hoa Trắng Hiếm! (#${this.id})`;
                    theme = 'purple';
                } else {
                    text = `🌹 [E] Thu Hoạch Hoa Hồng (#${this.id})`;
                    theme = 'ruby';
                }
            }

            if (window.drawWorldPromptBadge) {
                window.drawWorldPromptBadge(ctx, cx, cy - 4, text, {
                    theme: theme,
                    timer: this.animTimer,
                    pointer: true
                });
            }
        }
    }

    // ====================================================================
    // 4. HỆ THỐNG CÁNH HOA BAY & BƯỚM LƯỢN (ATMOSPHERE FX)
    // ====================================================================
    class GardenAtmosphereSystem {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.petals = [];
            this.butterflies = [];
            this.init();
        }

        init() {
            for (let i = 0; i < 18; i++) {
                this.petals.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: 18 + Math.random() * 22,
                    vy: 14 + Math.random() * 18,
                    size: 4 + Math.random() * 4,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 3,
                    isWhite: Math.random() < 0.10
                });
            }

            for (let i = 0; i < 3; i++) {
                this.butterflies.push({
                    x: 350 + Math.random() * 700,
                    y: 200 + Math.random() * 400,
                    targetX: 350 + Math.random() * 700,
                    targetY: 200 + Math.random() * 400,
                    wingTimer: Math.random() * 10,
                    color: i === 0 ? '#f472b6' : (i === 1 ? '#fbbf24' : '#60a5fa')
                });
            }
        }

        update(dt) {
            this.petals.forEach(p => {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rotation += p.rotSpeed * dt;
                if (p.x > this.width + 20) p.x = -20;
                if (p.y > this.height + 20) p.y = -20;
            });

            this.butterflies.forEach(b => {
                b.wingTimer += dt * 16;
                const dx = b.targetX - b.x;
                const dy = b.targetY - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 20 || Math.random() < 0.01) {
                    b.targetX = 350 + Math.random() * 700;
                    b.targetY = 200 + Math.random() * 400;
                } else {
                    b.x += (dx / dist) * 35 * dt;
                    b.y += (dy / dist) * 35 * dt;
                }
            });
        }

        draw(ctx) {
            ctx.save();
            this.petals.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.isWhite ? '#ffffff' : '#f43f5e';
                ctx.globalAlpha = p.isWhite ? 0.9 : 0.75;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            this.butterflies.forEach(b => {
                ctx.save();
                ctx.translate(b.x, b.y);
                const wingSpan = Math.abs(Math.sin(b.wingTimer)) * 6 + 2;

                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.ellipse(-wingSpan / 2, -2, wingSpan / 2, 5, -0.2, 0, Math.PI * 2);
                ctx.ellipse(wingSpan / 2, -2, wingSpan / 2, 5, 0.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#292524';
                ctx.beginPath();
                ctx.ellipse(0, 0, 1.2, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            ctx.restore();
        }
    }

    // ====================================================================
    // 5. BỘ ĐIỀU PHỐI VƯỜN HOA HỒNG (ROSE GARDEN MANAGER)
    // ====================================================================
    class RoseGardenManager {
        constructor() {
            this.isInitialized = false;
            this.assetManager = new RoseGardenAssetManager();
            this.atmosphere = new GardenAtmosphereSystem(1280, 720);

            // Tọa độ tương tác với các công trình nghệ thuật
            this.seedStallPos = { x: 870, y: 350, label: '[E] Ghé Tiệm Hạt Giống (Bác Ba)' };
            this.toolStallPos = { x: 1080, y: 440, label: '[E] Xem Bình Tưới & Đồ Làm Vườn (Chị Mai)' };
            this.waterTroughPos = { x: 1160, y: 540, label: 'Hứng Nước Vào Bình' };

            // Hiệu ứng dòng nước chảy khi hứng nước
            this.isFlowing = false;
            this.flowTimer = 0;
            this.animTimer = 0;

            this.plots = [];

            this.assetManager.subscribe(() => {
                this.renderAssetManagerModal();
            });
        }

        init() {
            if (this.isInitialized) return;

            // KHỞI TẠO 10 LUỐNG HOA NẰM CHUẨN XÁC TRÊN 5 ĐƯỜNG RÃNH CÀY (ISOMETRIC FURROWS):
            // 5 rãnh đất cày xới màu mỡ, mỗi rãnh đặt đúng 2 vị trí gieo trồng (trên và dưới)
            const furrowPlotCoords = [
                // Luống 1 (rãnh cày 1 - góc trên bên trái):
                { id: 1,  x: 283, y: 192, ridge: 1 },
                { id: 2,  x: 197, y: 262, ridge: 1 },
                // Luống 2 (rãnh cày 2):
                { id: 3,  x: 322, y: 225, ridge: 2 },
                { id: 4,  x: 222, y: 307, ridge: 2 },
                // Luống 3 (rãnh cày 3 - trung tâm khu vườn):
                { id: 5,  x: 352, y: 262, ridge: 3 },
                { id: 6,  x: 252, y: 344, ridge: 3 },
                // Luống 4 (rãnh cày 4):
                { id: 7,  x: 386, y: 303, ridge: 4 },
                { id: 8,  x: 286, y: 385, ridge: 4 },
                // Luống 5 (rãnh cày 5 - thấp nhất gần xe rùa):
                { id: 9,  x: 411, y: 348, ridge: 5 },
                { id: 10, x: 325, y: 418, ridge: 5 }
            ];

            this.plots = furrowPlotCoords.map(c => new RoseGardenPlot(c.id, c.x, c.y, this.assetManager, c.ridge));

            // QUY TẮC CỐT LÕI: 10 LUỐNG ĐẤT KHỞI TẠO HOÀN TOÀN TRỐNG (KHI TRỒNG MỚI CÓ HOA)
            this.plots.forEach(p => {
                p.state = 'empty';
                p.flowerType = null;
                p.isRare = false;
                p.growTimer = 0;
            });

            this.ensureStoreInventory();
            this.createGardenHUD();
            this.createModals();

            this.isInitialized = true;
            console.log('🌹 RoseGardenManager khởi tạo thành công với nền nghệ thuật 1280x720 và 10 luống trên rãnh cày!');
        }

        ensureStoreInventory() {
            if (!window.useGameStore || !window.useGameStore.state) return;
            const inv = window.useGameStore.state.inventory;
            if (inv.hat_giong_hoa_hong === undefined) inv.hat_giong_hoa_hong = GARDEN_CONFIG.DEFAULT_SEEDS;
            if (inv.binh_tuoi_so_huu === undefined) inv.binh_tuoi_so_huu = 1;
            if (inv.nuoc_trong_binh === undefined) inv.nuoc_trong_binh = GARDEN_CONFIG.DEFAULT_WATER;
            if (inv.binh_tuoi_dung_tich === undefined) inv.binh_tuoi_dung_tich = GARDEN_CONFIG.DEFAULT_WATER_CAPACITY;
        }

        update(dt) {
            if (!this.isInitialized) this.init();

            this.animTimer += dt;
            this.atmosphere.update(dt);
            this.plots.forEach(plot => plot.update(dt));

            if (this.isFlowing) {
                this.flowTimer -= dt;
                if (this.flowTimer <= 0) {
                    this.isFlowing = false;
                }
            }

            // Tự động trở về trường khi người chơi bước lại chỗ điểm dịch chuyển
            if (window.gameInstance && window.gameInstance.player && !window.gameInstance.isWarping) {
                const px = window.gameInstance.player.x;
                const py = window.gameInstance.player.y;
                if (Math.hypot(px - 750, py - 585) < 55) {
                    this.returnToCampus();
                }
            }

            this.updateGardenHUD();
        }

        render(ctx, player) {
            ctx.save();
            try {
                this.draw(ctx, player);
            } catch (err) {
                console.error('Lỗi khi vẽ nền Vườn Hoa Hồng:', err);
            } finally {
                ctx.restore();
            }
        }

        draw(ctx, player) {
            if (!this.isInitialized) this.init();

            const curWater = (window.useGameStore && window.useGameStore.state.inventory.nuoc_trong_binh) || 0;
            const maxWater = (window.useGameStore && window.useGameStore.state.inventory.binh_tuoi_dung_tich) || 5;

            // 1. VẼ TOÀN BỘ PHONG CẢNH NGHỆ THUẬT VƯỜN HOA (GARDEN SCENE ART)
            const bgImg = this.assetManager.getImage('garden_bg');
            if (bgImg) {
                ctx.drawImage(bgImg, 0, 0, 1280, 720);
            } else {
                // Fallback màu nước tự nhiên nếu ảnh chưa tải xong
                ctx.fillStyle = '#659b43';
                ctx.fillRect(0, 0, 1280, 720);
            }

            // 2. DÒNG NƯỚC CHẢY TỪ VÒI VÀO MÁNG KHI HỨNG NƯỚC
            if (this.isFlowing) {
                ctx.save();
                ctx.strokeStyle = 'rgba(186, 230, 253, 0.95)';
                ctx.lineWidth = 4 + Math.sin(this.animTimer * 20) * 1.5;
                ctx.beginPath();
                ctx.moveTo(1210, 495);
                ctx.lineTo(1210, 535);
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                for (let s = 0; s < 4; s++) {
                    const sx = 1210 + Math.sin(this.animTimer * 18 + s) * 8;
                    const sy = 534 + Math.cos(this.animTimer * 18 + s) * 4;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            // 3. VẼ 10 LUỐNG ĐẤT TRÊN CÁC RÃNH CÀY
            this.plots.forEach(plot => {
                try {
                    const pDist = player ? Math.hypot(player.x - plot.x, player.y - plot.y) : 999;
                    plot.draw(ctx, pDist);
                } catch (pe) {
                    console.error('Lỗi khi vẽ plot #' + plot.id, pe);
                }
            });

            // 4. CỔNG VÀ BIỂN CHỈ ĐƯỜNG VỀ TRƯỜNG ĐH TÂY NGUYÊN (TẠI X: 770, Y: 590)
            this.drawCampusPortal(ctx, player);
        }

        drawCampusPortal(ctx, player) {
            ctx.save();
            // BẢNG GỖ GHI "VỀ TRƯỜNG ĐHTN" ĐỨNG CẠNH ĐƯỜNG ĐÁ (X: 815, Y: 560)
            const sx = 815;
            const sy = 560;

            // Cọc gỗ cắm đất
            ctx.fillStyle = '#451a03';
            ctx.fillRect(sx - 3, sy - 36, 6, 38);

            // Bóng râm cọc gỗ
            ctx.fillStyle = 'rgba(20, 15, 10, 0.35)';
            ctx.beginPath();
            ctx.ellipse(sx, sy + 2, 7, 3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tấm biển gỗ mộc mạc phong cách nông trại
            ctx.fillStyle = '#78350f';
            ctx.strokeStyle = '#fef3c7';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(sx - 52, sy - 34, 104, 22, 5);
            ctx.fill();
            ctx.stroke();

            // Đinh ốc gỗ hai đầu biển
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(sx - 45, sy - 23, 1.8, 0, Math.PI * 2);
            ctx.arc(sx + 45, sy - 23, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Chữ "🏛️ VỀ TRƯỜNG ĐHTN"
            ctx.fillStyle = '#fef3c7';
            ctx.font = 'bold 10px "Patrick Hand", "Outfit", cursive, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏛️ VỀ TRƯỜNG ĐHTN', sx, sy - 23);

            ctx.restore();
        }

        /**
         * VẼ CÁC LỚP TIỀN CẢNH (FOREGROUND LAYERS) SAU KHI VẼ NHÂN VẬT:
         * Tạo chiều sâu 2.5D chân thực (nhân vật đi sau quầy rạp hoặc máng nước)
         */
        drawForeground(ctx, player) {
            if (!player) return;

            ctx.save();
            try {
                // 1. Quầy Rạp Hạt Giống (Mái sọc đỏ) - che khi người chơi đứng sau quầy
                if (player.y < 315 && player.x > 750 && player.x < 1000) {
                    const fgSeed = this.assetManager.getImage('fg_seed_stall');
                    if (fgSeed) {
                        ctx.drawImage(fgSeed, 760, 240);
                    }
                }

                // 2. Quầy Rạp Bình Tưới (Mái sọc xanh) - che khi người chơi đứng sau kệ
                if (player.y < 415 && player.x > 980 && player.x < 1240) {
                    const fgTool = this.assetManager.getImage('fg_tool_stall');
                    if (fgTool) {
                        ctx.drawImage(fgTool, 990, 320);
                    }
                }

                // 3. Máng nước & thùng gỗ
                if (player.y < 535 && player.x > 1110) {
                    const fgTrough = this.assetManager.getImage('fg_trough');
                    if (fgTrough) {
                        ctx.drawImage(fgTrough, 1110, 480);
                    }
                }

                // 4. Xe rùa chở đất
                if (player.y < 535 && player.x > 430 && player.x < 570) {
                    const fgWheel = this.assetManager.getImage('fg_wheelbarrow');
                    if (fgWheel) {
                        ctx.drawImage(fgWheel, 430, 490);
                    }
                }

                // 5. BONG BÓNG GỢI Ý TƯƠNG TÁC TẠI CÁC CÔNG TRÌNH
                const pSeedDist = Math.hypot(player.x - this.seedStallPos.x, player.y - this.seedStallPos.y);
                if (pSeedDist < 78) {
                    this.drawSpeechPrompt(ctx, this.seedStallPos.x, this.seedStallPos.y - 70, this.seedStallPos.label, '#fef3c7', '#b45309', '#78350f');
                }

                const pToolDist = Math.hypot(player.x - this.toolStallPos.x, player.y - this.toolStallPos.y);
                if (pToolDist < 78) {
                    this.drawSpeechPrompt(ctx, this.toolStallPos.x, this.toolStallPos.y - 70, this.toolStallPos.label, '#e0f2fe', '#0369a1', '#075985');
                }

                const pTroughDist = Math.hypot(player.x - this.waterTroughPos.x, player.y - this.waterTroughPos.y);
                if (pTroughDist < 72) {
                    const curWater = (window.useGameStore && window.useGameStore.state.inventory.nuoc_trong_binh) || 0;
                    const maxWater = (window.useGameStore && window.useGameStore.state.inventory.binh_tuoi_dung_tich) || 5;
                    const text = curWater >= maxWater 
                        ? `💧 Bình Nước Đã Đầy (${curWater}/${maxWater})`
                        : `[E] Hứng Nước Vào Bình (${curWater}/${maxWater})`;
                    this.drawSpeechPrompt(ctx, this.waterTroughPos.x - 20, this.waterTroughPos.y - 50, text, '#f0fdf4', '#16a34a', '#14532d');
                }

                // 6. CÁNH HOA BAY THEO LÀN GIÓ & BƯỚM LƯỢN TRÊN MÀN HÌNH
                this.atmosphere.draw(ctx);

            } catch (err) {
                console.error('Lỗi khi vẽ foreground:', err);
            } finally {
                ctx.restore();
            }
        }

        drawSpeechPrompt(ctx, x, y, text, bgCol, borderCol, textCol) {
            let theme = 'gold';
            if (text.includes('Hứng Nước') || text.includes('Bình Nước')) theme = 'cyan';
            else if (text.includes('Hạt Giống')) theme = 'gold';
            else if (text.includes('Bình Tưới') || text.includes('Dụng Cụ')) theme = 'emerald';

            if (window.drawWorldPromptBadge) {
                window.drawWorldPromptBadge(ctx, x, y, text, {
                    theme: theme,
                    timer: this.animTimer,
                    pointer: true
                });
            }
        }

        // ====================================================================
        // XỬ LÝ TƯƠNG TÁC (PHÍM E HOẶC CLICK CHUỘT / CHẠM MÀN HÌNH)
        // ====================================================================
        handleInteract(player) {
            if (!player) return false;
            const px = player.x;
            const py = player.y;

            // 1. Tương tác với Cổng Về Trường ĐH Tây Nguyên (tại x: 750, y: 585 trên đường lát đá)
            if (Math.hypot(px - 750, py - 585) < 75) {
                this.returnToCampus();
                return true;
            }

            // 2. Tương tác với Rạp Hạt Giống (Bác Ba)
            if (Math.hypot(px - this.seedStallPos.x, py - this.seedStallPos.y) < 78) {
                this.openSeedShopModal();
                return true;
            }

            // 3. Tương tác với Rạp Đồ Tưới (Chị Mai)
            if (Math.hypot(px - this.toolStallPos.x, py - this.toolStallPos.y) < 78) {
                this.openToolShopModal();
                return true;
            }

            // 4. Tương tác với Máng Nước để hứng đầy bình
            if (Math.hypot(px - this.waterTroughPos.x, py - this.waterTroughPos.y) < 72) {
                this.refillWaterCan();
                return true;
            }

            // 5. Tương tác với 10 Luống Đất Trồng Hoa trên rãnh cày
            for (const plot of this.plots) {
                const dist = Math.hypot(px - plot.x, py - plot.y);
                if (dist < plot.interactionDist) {
                    this.handlePlotInteraction(plot);
                    return true;
                }
            }

            return false;
        }

        returnToCampus() {
            const sound = window.soundSystem;
            const ui = window.uiManager;
            if (sound && sound.playWarp) sound.playWarp();
            if (ui) ui.showToast('🏛️ Đang quay trở lại khuôn viên Trường ĐH Tây Nguyên...', 'info');

            // Ẩn thanh HUD Vườn hoa hồng ngay lập tức
            const hud = document.getElementById('rose-garden-hud-bar');
            if (hud) hud.style.display = 'none';

            // Đóng các modal nếu đang mở
            ['rose-seed-shop-modal', 'rose-tool-shop-modal', 'rose-asset-manager-modal'].forEach(id => {
                const el = document.getElementById(id);
                if (el && window.uiManager && window.uiManager.closeModal) window.uiManager.closeModal(el);
            });

            if (window.gameInstance && typeof window.gameInstance.warpToMap === 'function') {
                window.gameInstance.warpToMap('map1_tnu', { x: 2420, y: 2965 });
            } else if (window.useGameStore) {
                window.useGameStore.setState({ currentMapId: 'map1_tnu' });
                if (window.gameInstance && window.gameInstance.player) {
                    window.gameInstance.player.x = 2420;
                    window.gameInstance.player.y = 2965;
                }
            } else {
                window.location.href = 'index.html';
            }
        }

        handlePlotInteraction(plot) {
            const store = window.useGameStore;
            const ui = window.uiManager;
            const sound = window.soundSystem;
            if (!store || !store.state) return;

            const inv = store.state.inventory;

            if (plot.state === 'empty') {
                // BƯỚC 1: GIEO HẠT GIỐNG
                const currentSeeds = inv.hat_giong_hoa_hong || 0;
                if (currentSeeds <= 0) {
                    if (ui) ui.showToast('⚠️ Bạn đã hết Hạt Giống! Hãy ghé Tiệm Bác Ba (mái sọc đỏ) bên cạnh để mua thêm nhé!', 'warning');
                    return;
                }

                store.setState(s => ({
                    inventory: {
                        ...s.inventory,
                        hat_giong_hoa_hong: Math.max(0, s.inventory.hat_giong_hoa_hong - 1)
                    }
                }));

                plot.plantSeed();
                if (sound) sound.playPickup();
                if (ui) ui.showToast(`🌱 Đã gieo 1 hạt giống vào luống #${plot.id}! Hãy tưới nước mát để hoa bắt đầu lớn nhé!`, 'info');

            } else if (plot.state === 'seeded') {
                // BƯỚC 2: TƯỚI NƯỚC (BẮT BUỘC)
                const currentWater = inv.nuoc_trong_binh || 0;
                if (currentWater <= 0) {
                    if (ui) ui.showToast('⚠️ Bình tưới đã cạn nước! Hãy lại Máng Nước góc dưới bên phải để hứng đầy nước nhé!', 'warning');
                    return;
                }

                store.setState(s => ({
                    inventory: {
                        ...s.inventory,
                        nuoc_trong_binh: Math.max(0, s.inventory.nuoc_trong_binh - 1)
                    }
                }));

                plot.waterPlant();
                if (sound) sound.playStep();
                if (ui) ui.showToast(`🚿 Đã tưới nước cho luống #${plot.id}! Cây đang bắt đầu nảy mầm và đơm nụ!`, 'success');

            } else if (plot.state === 'watered' || plot.state === 'sprout' || plot.state === 'bud') {
                // BƯỚC 3: HOA ĐANG LỚN - TUYỆT ĐỐI KHÔNG THỂ HÁI!
                const remainSec = Math.max(1, Math.ceil(plot.maxGrowTimer - plot.growTimer));
                if (ui) ui.showToast(`🌱 Cây hoa đang sinh trưởng, còn khoảng ${remainSec}s nữa sẽ nở rộ! Hoa nở mới được hái nhé!`, 'info');

            } else if (plot.state === 'bloomed') {
                // BƯỚC 4: HOA ĐÃ NỞ RỰC RỠ ➔ ĐƯỢC PHÉP THU HOẠCH!
                const res = plot.harvest();
                if (res.success) {
                    if (res.isRare) {
                        // 1/10 (10%) HOA HỒNG TRẮNG QUÝ HIẾM
                        store.addItem('hoa_hong_trang', 1);

                        if (sound && sound.playHarvestRareRose) {
                            sound.playHarvestRareRose();
                        } else if (sound) {
                            sound.playPickup();
                        }

                        if (window.confetti) {
                            window.confetti({ particleCount: 85, spread: 85, origin: { y: 0.6 } });
                        }

                        if (ui) {
                            ui.showToast('💮 QUÝ HIẾM (1/10)! Bạn vừa hái được đóa HOA HỒNG TRẮNG!', 'success');
                            ui.showCelebrationBanner(
                                '💮 HOA HỒNG TRẮNG QUÝ HIẾM!',
                                'Bạn vừa thu hoạch thành công đóa hoa trắng quý hiếm tỉ lệ 1/10! Cánh Bướm Hồng Phấn đã sẵn sàng mở khóa trong Tủ Đồ!'
                            );
                        }
                    } else {
                        // 9/10 (90%) HOA HỒNG ĐỎ THẮM
                        store.addItem('hoa_hong', 1);

                        if (sound && sound.playHarvestRose) {
                            sound.playHarvestRose();
                        } else if (sound) {
                            sound.playPickup();
                        }

                        if (ui) {
                            ui.showToast('🌹 Bạn vừa hái được 1 đóa Hoa Hồng Đỏ thắm! Hãy gieo hạt để trồng tiếp vụ mới nhé!', 'info');
                        }
                    }
                }
            }
        }

        refillWaterCan() {
            const store = window.useGameStore;
            const ui = window.uiManager;
            const sound = window.soundSystem;
            if (!store || !store.state) return;

            const inv = store.state.inventory;
            const maxCap = inv.binh_tuoi_dung_tich || GARDEN_CONFIG.DEFAULT_WATER_CAPACITY;
            const curWater = inv.nuoc_trong_binh || 0;

            if (curWater >= maxCap) {
                if (ui) ui.showToast(`💧 Bình tưới của bạn đã đầy ắp nước (${curWater}/${maxCap})! Hãy mang đi tưới hoa nhé!`, 'info');
                return;
            }

            store.setState(s => ({
                inventory: {
                    ...s.inventory,
                    nuoc_trong_binh: maxCap
                }
            }));

            this.isFlowing = true;
            this.flowTimer = 2.0;

            if (sound) sound.playPickup();
            if (ui) ui.showToast(`💧 Róc rách! Bình tưới đã được hứng đầy nước mát (${maxCap}/${maxCap})!`, 'success');
        }

        // ====================================================================
        // GIAO DIỆN HUD & NÚT TIỆN ÍCH TRONG VƯỜN HOA
        // ====================================================================
        createGardenHUD() {
            if (document.getElementById('rose-garden-hud-bar')) return;

            const wrapper = document.getElementById('game-wrapper');
            if (!wrapper) return;

            const hud = document.createElement('div');
            hud.id = 'rose-garden-hud-bar';
            hud.className = 'absolute top-4 left-4 z-30 flex flex-col items-start gap-2.5 pointer-events-auto transition-all duration-300';
            hud.style.display = 'none'; // Mặc định ẩn, chỉ hiện khi vào đúng map2_rose
            hud.innerHTML = `
                <!-- 1. THẺ TIÊU ĐỀ & TỈ LỆ HOA VƯỜN HOA HỒNG -->
                <div id="rose-garden-title-banner" class="px-4 py-2 bg-[#fbf6d9]/95 border-2 border-[#5c4731] rounded-2xl shadow-lg font-quest text-xs text-[#3b2512] flex items-center gap-3">
                    <img src="assets/rose_garden/icons/flower_pink.png" class="w-6 h-6 object-contain inline-block drop-shadow-sm" alt="Hoa hồng">
                    <div>
                        <div class="font-bold text-sm text-[#2b1704] leading-tight">VƯỜN HOA HỒNG ĐẠI HỌC TÂY NGUYÊN</div>
                        <div class="text-[11px] text-[#6b4e31]">
                            Tỉ lệ nở hoa: <span class="text-red-700 font-bold">9/10 Hoa Hồng Đỏ</span> • <span class="text-purple-700 font-bold">1/10 Hoa Hồng Trắng Quý Hiếm</span>
                        </div>
                    </div>
                </div>

                <!-- 2. THANH THỐNG KÊ LÀM VƯỜN (HẠT, NƯỚC, HOA ĐỎ, HOA TRẮNG) -->
                <div class="flex items-center gap-3 px-4 py-2 bg-[#fbf6d9]/95 border-2 border-[#5c4731] rounded-2xl shadow-xl font-quest text-xs text-[#3b2512]">
                    <div class="flex items-center gap-1.5" title="Số lượng hạt giống hoa hồng trong túi">
                        <img src="assets/rose_garden/icons/cardboard_box.png" class="w-5 h-5 object-contain inline-block drop-shadow-sm" alt="Hạt">
                        <span>Hạt:</span>
                        <b id="hud-garden-seeds" class="text-amber-800 text-sm">8</b>
                    </div>
                    <div class="w-px h-4 bg-[#7c6348]/40"></div>
                    <div class="flex items-center gap-1.5" title="Mức nước hiện tại trong bình tưới">
                        <img src="assets/rose_garden/icons/shower_head.png" class="w-5 h-5 object-contain inline-block drop-shadow-sm" alt="Nước">
                        <span>Nước:</span>
                        <b id="hud-garden-water" class="text-sky-700 text-sm">3/5</b>
                    </div>
                    <div class="w-px h-4 bg-[#7c6348]/40"></div>
                    <div class="flex items-center gap-1.5" title="Hoa hồng đỏ đã hái">
                        <img src="assets/rose_garden/icons/flower_pink.png" class="w-5 h-5 object-contain inline-block drop-shadow-sm" alt="Hoa đỏ">
                        <b id="hud-garden-red" class="text-red-700 text-sm">0</b>
                    </div>
                    <div class="w-px h-4 bg-[#7c6348]/40"></div>
                    <div class="flex items-center gap-1.5" title="Hoa hồng trắng cực hiếm (Tỉ lệ 1/10)">
                        <img src="assets/rose_garden/icons/flower_white.png" class="w-5 h-5 object-contain inline-block drop-shadow-sm" alt="Hoa trắng">
                        <b id="hud-garden-white" class="text-purple-700 text-sm">0</b>
                    </div>
                </div>
            `;
            wrapper.appendChild(hud);
        }

        updateGardenHUD() {
            const hud = document.getElementById('rose-garden-hud-bar');
            const questEl = document.getElementById('hud-quest-container');
            if (!hud) return;

            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map2_rose') {
                hud.style.display = 'flex';
                if (questEl && questEl.style.display !== 'none') {
                    questEl.style.display = 'none';
                }

                const inv = window.useGameStore.state.inventory;
                const seedsEl = document.getElementById('hud-garden-seeds');
                const waterEl = document.getElementById('hud-garden-water');
                const redEl = document.getElementById('hud-garden-red');
                const whiteEl = document.getElementById('hud-garden-white');

                if (seedsEl) seedsEl.innerText = inv.hat_giong_hoa_hong || 0;
                if (waterEl) waterEl.innerText = `${inv.nuoc_trong_binh || 0}/${inv.binh_tuoi_dung_tich || 5}`;
                if (redEl) redEl.innerText = inv.hoa_hong || 0;
                if (whiteEl) whiteEl.innerText = inv.hoa_hong_trang || 0;
            } else {
                hud.style.display = 'none';
                if (questEl && questEl.style.display === 'none') {
                    questEl.style.display = '';
                }
            }
        }

        quickFertilizeAll() {
            let count = 0;
            this.plots.forEach(p => {
                if (p.state !== 'bloomed') {
                    p.instantBloom();
                    count++;
                }
            });
            if (window.soundSystem) window.soundSystem.playStep();
            if (window.uiManager) window.uiManager.showToast(`⚡ Đã bón phân hữu cơ cho ${count} luống! Hoa đã nở rộ theo đúng tỉ lệ 9:1!`, 'success');
        }

        // ====================================================================
        // MODALS: TIỆM HẠT GIỐNG, TIỆM DỤNG CỤ, QUẢN LÝ ASSET
        // ====================================================================
        createModals() {
            const wrapper = document.getElementById('game-wrapper');
            if (!wrapper) return;

            // 1. TIỆM HẠT GIỐNG (BÁC BA - MÁI ĐỎ)
            if (!document.getElementById('rose-seed-shop-modal')) {
                const modal = document.createElement('div');
                modal.id = 'rose-seed-shop-modal';
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-box modal-box-beige w-[580px] max-w-[95vw]">
                        <div class="modal-header-beige">
                            <div class="flex items-center space-x-2 font-quest text-xl font-bold text-[#3b2512]">
                                <img src="assets/rose_garden/icons/sprout_soil.png" class="w-7 h-7 object-contain drop-shadow inline-block" alt="Sprout">
                                <span>Tiệm Hạt Giống Hoa Hồng - Bác Ba (Mái Sọc Đỏ)</span>
                            </div>
                            <button class="quest-modal-close-btn modal-close-btn font-quest" title="Đóng">&times;</button>
                        </div>
                        <div class="modal-body p-5 space-y-4 font-quest text-sm text-[#4a3520]">
                            <div class="p-3 bg-[#f3e9c6] rounded-xl border border-[#7c6348] flex items-center gap-3 shadow-sm">
                                <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#a1815b] flex items-center justify-center p-1 shrink-0 shadow-inner">
                                    <img src="assets/rose_garden/icons/wheat.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Wheat">
                                </div>
                                <div>
                                    <div class="font-bold text-[#2d1f12]">Chào cháu! Bác Ba bán hạt giống hoa hồng đây!</div>
                                    <div class="text-xs text-[#6b4e31]">Trong vườn hoa hồng, <b>tỉ lệ ra hoa trắng là 1/10</b> còn <b>hoa đỏ là 9/10</b>. Hoa trắng rất quý hiếm, muốn có thì phải gieo hạt chăm bón nhé!</div>
                                </div>
                            </div>

                            <div class="space-y-2.5">
                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/icons/gift_box.png" class="w-8 h-8 object-contain drop-shadow-sm" alt="Gift">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Gói Quà Khởi Đầu (5 Hạt Giống)</div>
                                            <div class="text-xs text-[#785433]">Quà tặng tân thủ làm quen với việc làm vườn</div>
                                        </div>
                                    </div>
                                    <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.claimStarterSeeds()">
                                        Nhận Miễn Phí
                                    </button>
                                </div>

                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/icons/chestnut.png" class="w-8 h-8 object-contain drop-shadow-sm" alt="Seed">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">1 Hạt Giống Hoa Hồng</div>
                                            <div class="text-xs text-[#785433]">Tỉ lệ: 90% nở hoa đỏ, 10% nở hoa trắng hiếm</div>
                                        </div>
                                    </div>
                                    <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.buySeeds(1)">
                                        Mua (1 Hạt)
                                    </button>
                                </div>

                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/icons/cardboard_box.png" class="w-8 h-8 object-contain drop-shadow-sm" alt="Box">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Túi Hạt Giống Lớn (10 Hạt)</div>
                                            <div class="text-xs text-[#785433]">Đủ gieo trọn vẹn cả 10 luống trên 5 rãnh đất cày</div>
                                        </div>
                                    </div>
                                    <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.buySeeds(10)">
                                        Mua (10 Hạt)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                wrapper.appendChild(modal);
            }

            // 2. TIỆM DỤNG CỤ & BÌNH TƯỚI (CHỊ MAI - MÁI XANH)
            if (!document.getElementById('rose-tool-shop-modal')) {
                const modal = document.createElement('div');
                modal.id = 'rose-tool-shop-modal';
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-box modal-box-beige w-[580px] max-w-[95vw]">
                        <div class="modal-header-beige">
                            <div class="flex items-center space-x-2 font-quest text-xl font-bold text-[#3b2512]">
                                <img src="assets/rose_garden/icons/shower_head.png" class="w-7 h-7 object-contain drop-shadow inline-block" alt="Shower">
                                <span>Tiệm Dụng Cụ & Bình Tưới Hoa - Chị Mai (Mái Sọc Xanh)</span>
                            </div>
                            <button class="quest-modal-close-btn modal-close-btn font-quest" title="Đóng">&times;</button>
                        </div>
                        <div class="modal-body p-5 space-y-4 font-quest text-sm text-[#4a3520]">
                            <div class="p-3 bg-[#e0f2fe] rounded-xl border border-[#0284c7] flex items-center gap-3 shadow-sm">
                                <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#38bdf8] flex items-center justify-center p-1 shrink-0 shadow-inner">
                                    <img src="assets/rose_garden/icons/flower_pink.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Flower">
                                </div>
                                <div>
                                    <div class="font-bold text-[#0369a1]">Chị Mai chào bạn yêu hoa!</div>
                                    <div class="text-xs text-[#075985]">Gieo hạt xong là phải tưới nước mát ngay thì hoa mới bắt đầu nảy mầm và đơm nụ được nhé!</div>
                                </div>
                            </div>

                            <div class="space-y-2.5">
                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/can_blue.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Can 10">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Nâng Cấp Bình Tưới Lớn (10 Nước)</div>
                                            <div class="text-xs text-[#785433]">Chứa được 10 giọt nước, đủ tưới hết 10 luống một lần</div>
                                        </div>
                                    </div>
                                    <div id="tool-shop-btn-can10">
                                        <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.upgradeWaterCapacity(10)">
                                            Nâng Cấp (10 Nước)
                                        </button>
                                    </div>
                                </div>

                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/can_pink.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Can 25">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Thùng Tưới Nước Khổng Lồ (25 Nước)</div>
                                            <div class="text-xs text-[#785433]">Dung tích cực lớn, tưới hoa thả ga không lo cạn</div>
                                        </div>
                                    </div>
                                    <div id="tool-shop-btn-can25">
                                        <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.upgradeWaterCapacity(25)">
                                            Nâng Cấp (25 Nước)
                                        </button>
                                    </div>
                                </div>

                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/fertilizer_green.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Fertilizer">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Phân Bón Kích Nở Thần Tốc</div>
                                            <div class="text-xs text-[#785433]">Bón cho toàn bộ luống hoa nở rực rỡ ngay lập tức</div>
                                        </div>
                                    </div>
                                    <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.quickFertilizeAll(); window.uiManager.closeAllModals();">
                                        Bón Phân Ngay
                                    </button>
                                </div>

                                <div class="p-3 bg-white/70 border border-[#b89b72] rounded-xl flex items-center justify-between shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#b89b72] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                                            <img src="assets/rose_garden/icons/water_drop.png" class="w-9 h-9 object-contain drop-shadow-sm" alt="Water">
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#2d1f12]">Đổ Đầy Nước Ngay Tại Chỗ</div>
                                            <div class="text-xs text-[#785433]">Chị Mai hỗ trợ đổ đầy bình nước giúp bạn</div>
                                        </div>
                                    </div>
                                    <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.refillWaterCan(); window.uiManager.closeAllModals();">
                                        Hứng Đầy Nước
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                wrapper.appendChild(modal);
                this.updateToolShopModalUI();
            }

            // 3. TÙY CHỈNH ASSET & HÌNH ẢNH TRÊN MÁY TÍNH
            if (!document.getElementById('rose-asset-manager-modal')) {
                const modal = document.createElement('div');
                modal.id = 'rose-asset-manager-modal';
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-box modal-box-beige w-[780px] max-w-[95vw]">
                        <div class="modal-header-beige">
                            <div class="flex items-center space-x-2 font-quest text-xl font-bold text-[#3b2512]">
                                <span class="text-2xl">🎨</span>
                                <span>Tùy Chỉnh Asset & Hình Ảnh Trên Máy Tính</span>
                            </div>
                            <button class="quest-modal-close-btn modal-close-btn font-quest" title="Đóng">&times;</button>
                        </div>
                        <div class="modal-body p-5 space-y-4 font-quest text-sm text-[#4a3520]">
                            <div class="p-3 bg-[#f3e9c6] rounded-xl border border-[#7c6348] flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">💡</span>
                                    <div class="text-xs">
                                        Bạn có thể <b>chọn file ảnh từ máy tính (PNG/JPG)</b> hoặc <b>chọn ảnh có sẵn trong folder assets/rose_garden/</b> (như ảnh <code>user_hoado.png</code> trên máy bạn) để thay đổi diện mạo hoa, rạp và dụng cụ!
                                    </div>
                                </div>
                                <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3 shrink-0" onclick="window.roseGardenManager.resetAllAssets()">
                                    🔄 Khôi Phục Mặc Định
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto p-1" id="rose-asset-cards-container">
                                <!-- Render động bằng JS -->
                            </div>
                        </div>
                    </div>
                `;
                wrapper.appendChild(modal);
            }

            ['rose-seed-shop-modal', 'rose-tool-shop-modal', 'rose-asset-manager-modal'].forEach(mId => {
                const m = document.getElementById(mId);
                if (m) {
                    const closeBtn = m.querySelector('.modal-close-btn');
                    if (closeBtn) closeBtn.onclick = () => {
                        if (window.uiManager) window.uiManager.closeAllModals();
                        else { m.classList.remove('active'); m.classList.remove('modal-visible'); }
                    };
                    m.addEventListener('click', (e) => {
                        if (e.target === m) {
                            if (window.uiManager) window.uiManager.closeAllModals();
                            else { m.classList.remove('active'); m.classList.remove('modal-visible'); }
                        }
                    });
                }
            });
        }

        openSeedShopModal() {
            const modal = document.getElementById('rose-seed-shop-modal');
            if (modal && window.uiManager) window.uiManager.openModal(modal);
        }

        openToolShopModal() {
            this.updateToolShopModalUI();
            const modal = document.getElementById('rose-tool-shop-modal');
            if (modal && window.uiManager) window.uiManager.openModal(modal);
        }

        updateToolShopModalUI() {
            const modal = document.getElementById('rose-tool-shop-modal');
            if (!modal) return;
            const currentCap = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.inventory && window.useGameStore.state.inventory.binh_tuoi_dung_tich) || 5;

            const btnCan10 = document.getElementById('tool-shop-btn-can10');
            if (btnCan10) {
                if (currentCap >= 10) {
                    btnCan10.innerHTML = `
                        <button class="font-quest text-xs font-bold py-1.5 px-3.5 rounded-xl bg-stone-300 text-stone-600 border border-stone-400 cursor-not-allowed opacity-80 shadow-none flex items-center gap-1.5 pointer-events-none" disabled title="Đã sở hữu">
                            <span class="text-stone-500 font-extrabold">✓</span> <span>Đã có</span>
                        </button>
                    `;
                } else {
                    btnCan10.innerHTML = `
                        <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.upgradeWaterCapacity(10)">
                            Nâng Cấp (10 Nước)
                        </button>
                    `;
                }
            }

            const btnCan25 = document.getElementById('tool-shop-btn-can25');
            if (btnCan25) {
                if (currentCap >= 25) {
                    btnCan25.innerHTML = `
                        <button class="font-quest text-xs font-bold py-1.5 px-3.5 rounded-xl bg-stone-300 text-stone-600 border border-stone-400 cursor-not-allowed opacity-80 shadow-none flex items-center gap-1.5 pointer-events-none" disabled title="Đã sở hữu">
                            <span class="text-stone-500 font-extrabold">✓</span> <span>Đã có</span>
                        </button>
                    `;
                } else {
                    btnCan25.innerHTML = `
                        <button class="quest-image2-btn font-quest text-xs font-bold py-1.5 px-3" onclick="window.roseGardenManager.upgradeWaterCapacity(25)">
                            Nâng Cấp (25 Nước)
                        </button>
                    `;
                }
            }
        }

        openAssetManagerModal() {
            this.renderAssetManagerModal();
            const modal = document.getElementById('rose-asset-manager-modal');
            if (modal && window.uiManager) window.uiManager.openModal(modal);
        }

        renderAssetManagerModal() {
            const container = document.getElementById('rose-asset-cards-container');
            if (!container) return;

            const defs = this.assetManager.assetDefinitions;
            container.innerHTML = '';

            Object.keys(defs).forEach(key => {
                const def = defs[key];
                const activeImg = this.assetManager.getImage(key);
                const hasCustom = this.assetManager.hasCustom(key);

                const card = document.createElement('div');
                card.className = 'p-3 bg-white/80 border-2 border-[#b89b72] rounded-xl shadow-sm flex flex-col justify-between space-y-2.5';
                card.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="font-bold text-[#2d1f12] flex items-center gap-1.5">
                                <span>${def.defaultIcon}</span>
                                <span>${def.name}</span>
                            </div>
                            <div class="text-[11px] text-[#785433] mt-0.5">${def.desc}</div>
                        </div>
                        <div class="w-12 h-12 rounded-lg border border-[#a1815b] bg-[#fdfbf7] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                            ${activeImg 
                                ? `<img src="${activeImg.src}" class="w-full h-full object-contain">`
                                : `<span class="text-2xl">${def.defaultIcon}</span>`
                            }
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center gap-2">
                            <label class="px-2.5 py-1 bg-[#e0e7ff] hover:bg-[#c7d2fe] border border-[#6366f1] text-[#3730a3] rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1">
                                <span>📁</span> <span>Chọn ảnh từ máy...</span>
                                <input type="file" accept="image/*" class="hidden" onchange="window.roseGardenManager.handleFileUpload('${key}', this)">
                            </label>
                            ${hasCustom ? `
                                <button class="px-2 py-1 bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#ef4444] text-[#991b1b] rounded-lg text-xs font-bold" onclick="window.roseGardenManager.resetSingleAsset('${key}')">
                                    Xóa
                                </button>
                            ` : ''}
                        </div>

                        ${def.presetOptions && def.presetOptions.length > 0 ? `
                            <div class="text-[10px] text-[#6b4e31] font-semibold flex items-center gap-1 flex-wrap pt-1">
                                <span>Gợi ý ảnh:</span>
                                ${def.presetOptions.map(p => {
                                    const shortName = p.split('/').pop();
                                    return `<button class="px-1.5 py-0.5 bg-[#fef3c7] hover:bg-[#fde68a] border border-[#d97706] rounded text-[10px] text-[#92400e]" onclick="window.roseGardenManager.setAssetUrl('${key}', '${p}')">${shortName}</button>`;
                                }).join(' ')}
                            </div>
                        ` : ''}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        handleFileUpload(key, input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                this.assetManager.setAssetFromFile(key, file).then(() => {
                    if (window.uiManager) window.uiManager.showToast(`🎨 Đã tải thành công ảnh cho "${this.assetManager.assetDefinitions[key].name}"!`, 'success');
                }).catch(err => {
                    if (window.uiManager) window.uiManager.showToast('⚠️ Không thể tải ảnh này!', 'error');
                });
            }
        }

        setAssetUrl(key, url) {
            this.assetManager.setAssetFromUrl(key, url);
            if (window.uiManager) window.uiManager.showToast(`🎨 Đã áp dụng ảnh "${url}"!`, 'success');
        }

        resetSingleAsset(key) {
            this.assetManager.removeAsset(key);
            if (window.uiManager) window.uiManager.showToast(`🔄 Đã khôi phục ảnh mặc định cho "${this.assetManager.assetDefinitions[key].name}"!`, 'info');
        }

        resetAllAssets() {
            this.assetManager.resetAllToHandDrawn();
            if (window.uiManager) window.uiManager.showToast('🔄 Đã khôi phục toàn bộ hình ảnh về bộ asset chuẩn!', 'info');
        }

        claimStarterSeeds() {
            const store = window.useGameStore;
            if (!store || !store.state) return;
            store.setState(s => ({
                inventory: {
                    ...s.inventory,
                    hat_giong_hoa_hong: (s.inventory.hat_giong_hoa_hong || 0) + 5
                }
            }));
            if (window.soundSystem) window.soundSystem.playPickup();
            if (window.uiManager) window.uiManager.showToast('🎁 Bạn vừa nhận được 5 Hạt Giống Hoa Hồng miễn phí từ Bác Ba!', 'success');
        }

        buySeeds(amount = 1) {
            const store = window.useGameStore;
            if (!store || !store.state) return;
            store.setState(s => ({
                inventory: {
                    ...s.inventory,
                    hat_giong_hoa_hong: (s.inventory.hat_giong_hoa_hong || 0) + amount
                }
            }));
            if (window.soundSystem) window.soundSystem.playPickup();
            if (window.uiManager) window.uiManager.showToast(`🌱 Bạn vừa mua ${amount} Hạt Giống Hoa Hồng!`, 'success');
        }

        upgradeWaterCapacity(cap = 10) {
            const store = window.useGameStore;
            if (!store || !store.state) return;
            const currentCap = (store.state.inventory && store.state.inventory.binh_tuoi_dung_tich) || 5;
            if (currentCap >= cap) {
                if (window.uiManager) window.uiManager.showToast(`✓ Bạn đã sở hữu bình tưới ${cap} nước rồi!`, 'info');
                return;
            }
            store.setState(s => ({
                inventory: {
                    ...s.inventory,
                    binh_tuoi_dung_tich: cap,
                    nuoc_trong_binh: cap
                }
            }));
            this.updateToolShopModalUI();
            this.updateGardenHUD();
            if (window.soundSystem) window.soundSystem.playPickup();
            if (window.uiManager) window.uiManager.showToast(`✨ Đã nâng cấp Bình Tưới lên dung tích ${cap} nước và đổ đầy!`, 'success');
        }

        handleClick(x, y, player) {
            // 0. Click vào Cổng Về Trường ĐHTN hoặc Bảng Gỗ Về Trường
            if (Math.hypot(x - 750, y - 585) < 55 || Math.hypot(x - 815, y - 550) < 45) {
                this.returnToCampus();
                return true;
            }

            // 1. Click vào Rạp Hạt Giống
            if (Math.hypot(x - this.seedStallPos.x, y - (this.seedStallPos.y - 40)) < 80) {
                this.openSeedShopModal();
                return true;
            }

            // 2. Click vào Rạp Bình Tưới
            if (Math.hypot(x - this.toolStallPos.x, y - (this.toolStallPos.y - 40)) < 80) {
                this.openToolShopModal();
                return true;
            }

            // 3. Click vào Máng Nước
            if (Math.hypot(x - this.waterTroughPos.x, y - this.waterTroughPos.y) < 70) {
                this.refillWaterCan();
                return true;
            }

            // 4. Click vào 1 trong 10 Luống Đất trên rãnh cày
            for (const plot of this.plots) {
                if (Math.hypot(x - plot.x, y - plot.y) < 32) {
                    this.handlePlotInteraction(plot);
                    return true;
                }
            }

            return false;
        }
    }

    // ====================================================================
    // 6. TÍCH HỢP HOÀN HẢO VÀO GAME ENGINE (INTEGRATION HOOKS)
    // ====================================================================
    window.roseGardenManager = new RoseGardenManager();

    function hookIntoGameEngine() {
        if (!window.GameEngine || window.__roseGardenHooked) return;
        window.__roseGardenHooked = true;

        // 1. Hook phương thức vẽ Map 2
        const originalDrawMap2 = window.GameEngine.prototype.drawMap2_Rose;
        window.GameEngine.prototype.drawMap2_Rose = function(ctx) {
            if (window.roseGardenManager) {
                window.roseGardenManager.render(ctx, this.player);
            } else if (originalDrawMap2) {
                originalDrawMap2.call(this, ctx);
            }
        };

        // 2. Hook phương thức render chính để vẽ Foreground Y-sorting (chiều sâu 2.5D)
        const originalRender = window.GameEngine.prototype.render;
        window.GameEngine.prototype.render = function() {
            if (originalRender) originalRender.call(this);
            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map2_rose' && window.roseGardenManager && window.roseGardenManager.drawForeground) {
                this.ctx.save();
                this.ctx.translate(-this.camera.x, -this.camera.y);
                window.roseGardenManager.drawForeground(this.ctx, this.player);
                this.ctx.restore();
            }
        };

        // 3. Hook phương thức cập nhật Game Loop
        const originalUpdate = window.GameEngine.prototype.update;
        window.GameEngine.prototype.update = function(dt) {
            if (originalUpdate) originalUpdate.call(this, dt);
            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map2_rose') {
                if (window.roseGardenManager) window.roseGardenManager.update(dt);
            } else {
                const hud = document.getElementById('rose-garden-hud-bar');
                if (hud && hud.style.display !== 'none') {
                    hud.style.display = 'none';
                }
            }
        };

        // 4. Hook xử lý tương tác phím E / Space
        const originalHandleInteract = window.GameEngine.prototype.handleInteract;
        window.GameEngine.prototype.handleInteract = function() {
            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map2_rose' && window.roseGardenManager) {
                const handled = window.roseGardenManager.handleInteract(this.player);
                if (handled) return;
            }
            if (originalHandleInteract) originalHandleInteract.call(this);
        };

        // 5. Lắng nghe click chuột trên Canvas
        const canvas = document.getElementById('game-canvas');
        if (canvas && !canvas.__roseGardenClickHooked) {
            canvas.__roseGardenClickHooked = true;
            canvas.addEventListener('click', (e) => {
                const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
                if (currentMapId !== 'map2_rose' || !window.roseGardenManager) return;

                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const clientX = (e.clientX - rect.left) * scaleX;
                const clientY = (e.clientY - rect.top) * scaleY;

                const camera = (window.gameInstance && window.gameInstance.camera) ? window.gameInstance.camera : { x: 0, y: 0 };
                const worldX = clientX + camera.x;
                const worldY = clientY + camera.y;

                window.roseGardenManager.handleClick(worldX, worldY, window.gameInstance ? window.gameInstance.player : null);
            });
        }

        // 6. Đăng ký theo dõi sự thay đổi map qua useGameStore
        if (window.useGameStore && typeof window.useGameStore.subscribe === 'function' && !window.__roseGardenStoreSubscribed) {
            window.__roseGardenStoreSubscribed = true;
            window.useGameStore.subscribe(state => {
                const hud = document.getElementById('rose-garden-hud-bar');
                const questEl = document.getElementById('hud-quest-container');
                if (hud) {
                    if (state && state.currentMapId === 'map2_rose') {
                        hud.style.display = 'flex';
                        if (questEl && questEl.style.display !== 'none') {
                            questEl.style.display = 'none';
                        }
                    } else {
                        hud.style.display = 'none';
                        if (questEl && questEl.style.display === 'none') {
                            questEl.style.display = '';
                        }
                    }
                }
            });
        }

        console.log('🔗 Rose Garden Module đã tích hợp hoàn hảo vào GameEngine với đồ họa Isometric 1280x720!');
    }

    document.addEventListener('DOMContentLoaded', hookIntoGameEngine);
    hookIntoGameEngine();

})(window);
