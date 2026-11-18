/**
 * FLOATING LANTERNS SYSTEM (HỆ THỐNG LỒNG ĐÈN BAY PHẤP PHỚI TRÊN BẢN ĐỒ)
 * Sử dụng toàn bộ frames hoạt ảnh từ thư mục assets/Hu:
 * 1. Lồng đèn Cung Đình Hoàng Kim (16 frames: 24613.png -> 24629.png)
 * 2. Lồng đèn Thỏ Ngọc Đào Tiên (8 frames: 24920.png -> 24927.png)
 * 
 * Đặc điểm:
 * - Chuyển động lơ lửng, lắc lư theo gió (sway), nhấp nhô (bobbing), bay từ từ lên trời
 * - Quầng sáng vàng ấm cúng (radial glow)
 * - Mật độ vừa phải (24 chiếc rải đều khắp map 2560x3432), giữ 3-6 đèn trong tầm nhìn camera
 * - Tối ưu hiệu năng: Culling tự động, chỉ vẽ các đèn nằm trong khung nhìn camera
 */

class FloatingLanternsSystem {
    constructor() {
        // Danh sách tên file frames
        this.palaceFrameNames = [
            '24613.png', '24614.png', '24615.png', '24616.png',
            '24617.png', '24618.png', '24619.png', '24620.png',
            '24622.png', '24623.png', '24624.png', '24625.png',
            '24626.png', '24627.png', '24628.png', '24629.png'
        ];

        this.bunnyFrameNames = [
            '24920.png', '24921.png', '24922.png', '24923.png',
            '24924.png', '24925.png', '24926.png', '24927.png'
        ];

        this.palaceImages = [];
        this.bunnyImages = [];
        this.isLoaded = false;

        this.lanterns = [];
        this.mapWidth = 2560;
        this.mapHeight = 3432;
        this.globalTime = 0;

        // Vùng crop chuẩn từ ảnh gốc 280x360
        this.sourceCrop = {
            sx: 0,
            sy: 0,
            sw: 126,
            sh: 176
        };
    }

    init(mapWidth, mapHeight) {
        this.mapWidth = mapWidth || 2560;
        this.mapHeight = mapHeight || 3432;

        this.preloadFrames();
        this.spawnLanterns();
    }

    preloadFrames() {
        let loadedCount = 0;
        const total = this.palaceFrameNames.length + this.bunnyFrameNames.length;

        const checkDone = () => {
            loadedCount++;
            if (loadedCount >= total) {
                this.isLoaded = true;
            }
        };

        // Load 16 frames lồng đèn Cung Đình Hoàng Kim (Hỗ trợ Cloudflare R2)
        this.palaceImages = this.palaceFrameNames.map(name => {
            const relPath = `assets/Hu/${name}`;
            const r2Url = (window.getR2Url ? window.getR2Url(relPath) : relPath);
            const img = new Image();
            img.onload = checkDone;
            img.onerror = () => {
                if (img.src === r2Url && r2Url !== relPath) {
                    img.src = relPath;
                } else {
                    checkDone();
                }
            };
            img.src = r2Url;
            return img;
        });

        // Load 8 frames lồng đèn Thỏ Ngọc Đào Tiên (Hỗ trợ Cloudflare R2)
        this.bunnyImages = this.bunnyFrameNames.map(name => {
            const relPath = `assets/Hu/${name}`;
            const r2Url = (window.getR2Url ? window.getR2Url(relPath) : relPath);
            const img = new Image();
            img.onload = checkDone;
            img.onerror = () => {
                if (img.src === r2Url && r2Url !== relPath) {
                    img.src = relPath;
                } else {
                    checkDone();
                }
            };
            img.src = r2Url;
            return img;
        });
    }

    spawnLanterns() {
        this.lanterns = [];

        // 24 lồng đèn phân bố đều trên các khu vực trọng điểm của trường
        // Đảm bảo không quá nhiều gây rối mắt, không quá ít gây trống trải
        const spawnSpots = [
            // 1. Quanh Hồ Sinh Thái & Cầu Gỗ (6 đèn lung linh soi bóng nước)
            { x: 380, y: 1950, type: 'palace' },
            { x: 550, y: 1750, type: 'bunny' },
            { x: 720, y: 2200, type: 'palace' },
            { x: 420, y: 2350, type: 'bunny' },
            { x: 860, y: 1850, type: 'palace' },
            { x: 620, y: 2500, type: 'bunny' },

            // 2. Tòa Điều Hành & Bồn hoa tròn biểu tượng (6 đèn lễ hội)
            { x: 1550, y: 2600, type: 'palace' },
            { x: 1750, y: 2850, type: 'bunny' },
            { x: 1900, y: 2500, type: 'palace' },
            { x: 1420, y: 2950, type: 'bunny' },
            { x: 1680, y: 2350, type: 'palace' },
            { x: 1820, y: 3150, type: 'bunny' },

            // 3. Sân Vận Động & KTX phía Đông Bắc (4 đèn)
            { x: 1580, y: 750, type: 'bunny' },
            { x: 1780, y: 1150, type: 'palace' },
            { x: 2050, y: 650, type: 'bunny' },
            { x: 1950, y: 1350, type: 'palace' },

            // 4. Khu Thực Nghiệm Nhà số 2 & Vườn Ươm phía Tây (4 đèn)
            { x: 650, y: 550, type: 'palace' },
            { x: 850, y: 950, type: 'bunny' },
            { x: 350, y: 800, type: 'palace' },
            { x: 480, y: 1250, type: 'bunny' },

            // 5. Trục Đại Lộ & Vườn Cây Trung Tâm (4 đèn)
            { x: 1150, y: 1100, type: 'bunny' },
            { x: 1250, y: 1700, type: 'palace' },
            { x: 1100, y: 2200, type: 'bunny' },
            { x: 1350, y: 2800, type: 'palace' }
        ];

        spawnSpots.forEach((spot, idx) => {
            const isPalace = spot.type === 'palace';
            const scale = 0.42 + Math.random() * 0.22; // Kích thước tự nhiên (tầm 52px - 80px)
            const speedY = -(16 + Math.random() * 15); // Tốc độ bay lên từ từ nhẹ nhàng (16 - 31 px/s)
            const driftX = (Math.random() - 0.4) * 6; // Hơi trôi theo chiều gió

            this.lanterns.push({
                id: idx,
                type: spot.type,
                x: spot.x + (Math.random() - 0.5) * 80,
                y: spot.y + (Math.random() - 0.5) * 100,
                baseX: spot.x,
                speedY: speedY,
                driftX: driftX,
                scale: scale,
                alpha: 0.85 + Math.random() * 0.15,

                // Thông số lắc lư (Sway)
                swayAmp: 16 + Math.random() * 18,
                swaySpeed: 0.9 + Math.random() * 0.8,
                swayPhase: Math.random() * Math.PI * 2,

                // Thông số nghiêng (Tilt angle)
                maxTilt: 0.05 + Math.random() * 0.06, // ~3 - 7 độ

                // Thông số nhấp nhô (Bobbing)
                bobAmp: 4 + Math.random() * 5,
                bobSpeed: 1.5 + Math.random() * 1.0,

                // Hoạt ảnh frame
                frameIndex: Math.floor(Math.random() * (isPalace ? 16 : 8)),
                frameTimer: Math.random() * 0.1,
                frameDuration: isPalace ? 0.09 : 0.12, // 90ms / 120ms mỗi frame

                // Hào quang phát sáng
                glowSize: 45 * scale,
                glowPulsePhase: Math.random() * Math.PI * 2
            });
        });
    }

    update(dt) {
        this.globalTime += dt;

        this.lanterns.forEach(lantern => {
            // 1. Cập nhật frame hoạt ảnh
            lantern.frameTimer += dt;
            if (lantern.frameTimer >= lantern.frameDuration) {
                lantern.frameTimer = 0;
                const totalFrames = lantern.type === 'palace' ? this.palaceImages.length : this.bunnyImages.length;
                if (totalFrames > 0) {
                    lantern.frameIndex = (lantern.frameIndex + 1) % totalFrames;
                }
            }

            // 2. Chuyển động bay lên từ từ
            lantern.y += lantern.speedY * dt;
            lantern.baseX += lantern.driftX * dt;

            // 3. Dao động lắc lư ngang & nhấp nhô (phấp phới)
            const swayOffset = Math.sin(this.globalTime * lantern.swaySpeed + lantern.swayPhase) * lantern.swayAmp;
            const bobOffset = Math.cos(this.globalTime * lantern.bobSpeed + lantern.swayPhase) * lantern.bobAmp;

            lantern.currentX = lantern.baseX + swayOffset;
            lantern.currentY = lantern.y + bobOffset;

            // Góc nghiêng lắc lư theo đà gió
            lantern.currentTilt = Math.sin(this.globalTime * lantern.swaySpeed + lantern.swayPhase) * lantern.maxTilt;

            // 4. Khi bay khỏi đỉnh bản đồ, tái sinh mượt mà ở phía dưới chân bản đồ
            if (lantern.y < -150) {
                lantern.y = this.mapHeight + 60 + Math.random() * 120;
                lantern.baseX = 150 + Math.random() * (this.mapWidth - 300);
                lantern.scale = 0.42 + Math.random() * 0.22;
                lantern.speedY = -(16 + Math.random() * 15);
                lantern.swayAmp = 16 + Math.random() * 18;
                lantern.swayPhase = Math.random() * Math.PI * 2;
            }

            // Giữ đèn trong biên bản đồ chiều ngang
            if (lantern.baseX < -100) lantern.baseX = this.mapWidth + 50;
            if (lantern.baseX > this.mapWidth + 100) lantern.baseX = -50;
        });
    }

    draw(ctx, camera) {
        if (!camera) return;

        const viewLeft = camera.x - 140;
        const viewRight = camera.x + (camera.width || 1280) + 140;
        const viewTop = camera.y - 160;
        const viewBottom = camera.y + (camera.height || 720) + 160;

        const crop = this.sourceCrop;

        this.lanterns.forEach(lantern => {
            const x = lantern.currentX !== undefined ? lantern.currentX : lantern.x;
            const y = lantern.currentY !== undefined ? lantern.currentY : lantern.y;

            // Culling: Bỏ qua nếu nằm ngoài khung nhìn camera để giữ FPS 60 tối đa
            if (x < viewLeft || x > viewRight || y < viewTop || y > viewBottom) {
                return;
            }

            const isPalace = lantern.type === 'palace';
            const imgList = isPalace ? this.palaceImages : this.bunnyImages;
            const frameImg = imgList[lantern.frameIndex];

            const renderW = crop.sw * lantern.scale;
            const renderH = crop.sh * lantern.scale;

            // 1. Vẽ quầng hào quang phát sáng ấm cúng quanh lồng đèn
            const pulse = 1 + Math.sin(this.globalTime * 3 + lantern.glowPulsePhase) * 0.15;
            const glowR = (isPalace ? 48 : 42) * lantern.scale * pulse;

            ctx.save();
            const glow = ctx.createRadialGradient(x, y - renderH * 0.15, 2, x, y - renderH * 0.15, glowR);
            if (isPalace) {
                glow.addColorStop(0, 'rgba(255, 215, 0, 0.40)');
                glow.addColorStop(0.45, 'rgba(255, 170, 0, 0.16)');
                glow.addColorStop(1, 'rgba(255, 140, 0, 0)');
            } else {
                glow.addColorStop(0, 'rgba(255, 195, 160, 0.38)');
                glow.addColorStop(0.5, 'rgba(255, 145, 110, 0.14)');
                glow.addColorStop(1, 'rgba(255, 120, 90, 0)');
            }
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y - renderH * 0.15, glowR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 2. Vẽ hình ảnh lồng đèn có lắc lư (Tilt rotation)
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(lantern.currentTilt || 0);
            ctx.globalAlpha = lantern.alpha;

            if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
                try {
                    ctx.drawImage(
                        frameImg,
                        crop.sx, crop.sy, crop.sw, crop.sh,
                        -renderW / 2, -renderH / 2,
                        renderW, renderH
                    );
                } catch (e) {}
            }

            ctx.restore();
        });
    }
}

// Gắn vào window để GameEngine sử dụng toàn cục
window.FloatingLanternsSystem = FloatingLanternsSystem;
