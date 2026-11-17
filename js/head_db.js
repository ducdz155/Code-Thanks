/**
 * HEAD SQL DATABASE & DIRECTIONAL FRAME SPRITE SYSTEM
 * Quản lý khung hình Kiểu Đầu 4 Hướng (Front, Right, Left, Back) chuẩn Anime / Dragon Boy:
 * - Lưu trữ dữ liệu cấu trúc bảng SQL (head_templates, head_frames)
 * - Tự động Preload toàn bộ các frame ảnh PNG trong thư mục head/ vào GPU Texture Cache
 * - Hỗ trợ đầy đủ 4 hướng nhìn: 'down' (nhìn thẳng), 'right' (nhìn phải), 'left' (nhìn trái), 'up' (nhìn đằng sau)
 * - Tương thích 100% với hệ thống Tủ đồ Wardrobe và Live Preview 360 độ
 */

class HeadSQLDatabase {
    constructor() {
        this.tables = {
            head_templates: [],
            head_frames: []
        };
        this.imageCache = new Map();
        this.isLoaded = false;
        this.loadedCount = 0;
        this.totalImages = 0;

        // Khởi tạo và nạp dữ liệu SQL Schema
        this.seedDatabase();
        this.preloadTextures();
    }

    // Nạp dữ liệu mặc định từ heads_schema.sql
    seedDatabase() {
        // 1. Bảng head_templates
        this.tables.head_templates = [
            {
                head_id: 'head_videl',
                name: 'Kiểu Đầu Videl Song Bính',
                nameKey: 'head_videl_name',
                descKey: 'head_videl_desc',
                icon_url: 'head/9390.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 38,
                render_height: 46,
                offset_x: 0,
                offset_y: -68,
                rarity: 'mythic'
            },
            {
                head_id: 'head_blonde_ribbon',
                name: 'Tiểu Thư Tóc Vàng Nơ Xanh',
                nameKey: 'head_blonde_ribbon_name',
                descKey: 'head_blonde_ribbon_desc',
                icon_url: 'head/17784.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 44,
                render_height: 50,
                offset_x: 0,
                offset_y: -58,
                rarity: 'mythic'
            },
            {
                head_id: 'head_crown_prince',
                name: 'Chiến Binh Vương Miện Vàng',
                nameKey: 'head_crown_prince_name',
                descKey: 'head_crown_prince_desc',
                icon_url: 'head/21714.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 36,
                render_height: 48,
                offset_x: 0,
                offset_y: -74,
                rarity: 'mythic'
            },
            {
                head_id: 'head_goku',
                name: 'Kiểu Đầu Goku Siêu Cấp',
                nameKey: 'head_goku_name',
                descKey: 'head_goku_desc',
                icon_url: 'head/17.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 54,
                render_height: 48,
                offset_x: 0,
                offset_y: -70,
                rarity: 'mythic'
            },
            {
                head_id: 'head_elf_silver',
                name: 'Nữ Pháp Sư Elf Tóc Bạc',
                nameKey: 'head_elf_silver_name',
                descKey: 'head_elf_silver_desc',
                icon_url: 'head/12955.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 62,
                render_height: 60,
                offset_x: 0,
                offset_y: -66,
                rarity: 'mythic'
            },
            {
                head_id: 'head_pumpkin_cat',
                name: 'Mũ Bí Ngô Mèo Ma Quái',
                nameKey: 'head_pumpkin_cat_name',
                descKey: 'head_pumpkin_cat_desc',
                icon_url: 'head/6985.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 38,
                render_height: 52,
                offset_x: 0,
                offset_y: -72,
                rarity: 'mythic'
            },
            {
                head_id: 'head_fortune_mouse',
                name: 'Mũ Chuột Vàng Chiêu Tài',
                nameKey: 'head_fortune_mouse_name',
                descKey: 'head_fortune_mouse_desc',
                icon_url: 'head/7085.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 64,
                render_height: 64,
                offset_x: 0,
                offset_y: -84,
                rarity: 'mythic'
            },
            {
                head_id: 'head_cow_hat',
                name: 'Mũ Bò Sữa Chibi Tinh Nghịch',
                nameKey: 'head_cow_hat_name',
                descKey: 'head_cow_hat_desc',
                icon_url: 'head/7600.png',
                head_type: 'frame_directional',
                total_frames: 4,
                render_width: 48,
                render_height: 52,
                offset_x: 0,
                offset_y: -72,
                rarity: 'mythic'
            }
        ];

        // 2. Bảng head_frames (4 hướng cho từng kiểu đầu - Đã chuẩn hóa dx & dy theo trục giải phẫu khuôn mặt và cổ nhân vật, cân đối 100% trong mọi góc nhìn)
        this.tables.head_frames = [
            // Head 1: Videl (9390 front, 9391 side, 9392 back)
            { head_id: 'head_videl', direction: 'down',  image_id: 9390, image_url: 'head/9390.png', dx: -19, dy: -54, render_width: 38, render_height: 46, flip_x: false },
            { head_id: 'head_videl', direction: 'right', image_id: 9391, image_url: 'head/9391.png', dx: -20, dy: -54, render_width: 38, render_height: 46, flip_x: false },
            { head_id: 'head_videl', direction: 'left',  image_id: 9391, image_url: 'head/9391.png', dx: -20, dy: -54, render_width: 38, render_height: 46, flip_x: true },
            { head_id: 'head_videl', direction: 'up',    image_id: 9392, image_url: 'head/9392.png', dx: -19, dy: -54, render_width: 38, render_height: 46, flip_x: false },

            // Head 2: Tiểu Thư Tóc Vàng Nơ Xanh (17784 front, 17785 side, 17786 back)
            // Hỗ trợ Tách lớp: 17784_front (mặt trước) & 17784_back (tóc buông sau lưng áo)
            { head_id: 'head_blonde_ribbon', direction: 'down',  image_id: 17784, image_url: 'head/17784_front.png', back_image_url: 'head/17784_back.png', dx: -22, dy: -52, render_width: 44, render_height: 50, flip_x: false },
            { head_id: 'head_blonde_ribbon', direction: 'right', image_id: 17785, image_url: 'head/17785.png', dx: -26, dy: -50, render_width: 50, render_height: 38, flip_x: false },
            { head_id: 'head_blonde_ribbon', direction: 'left',  image_id: 17785, image_url: 'head/17785.png', dx: -26, dy: -50, render_width: 50, render_height: 38, flip_x: true },
            { head_id: 'head_blonde_ribbon', direction: 'up',    image_id: 17786, image_url: 'head/17786.png', dx: -22, dy: -52, render_width: 44, render_height: 50, flip_x: false },

            // Head 3: Vương Miện Hoàng Tử (21714 front, 21715 side, 21716 back)
            { head_id: 'head_crown_prince', direction: 'down',  image_id: 21714, image_url: 'head/21714.png', dx: -18, dy: -66, render_width: 36, render_height: 48, flip_x: false },
            { head_id: 'head_crown_prince', direction: 'right', image_id: 21715, image_url: 'head/21715.png', dx: -18, dy: -64, render_width: 38, render_height: 43, flip_x: false },
            { head_id: 'head_crown_prince', direction: 'left',  image_id: 21715, image_url: 'head/21715.png', dx: -18, dy: -64, render_width: 38, render_height: 43, flip_x: true },
            { head_id: 'head_crown_prince', direction: 'up',    image_id: 21716, image_url: 'head/21716.png', dx: -18, dy: -66, render_width: 36, render_height: 48, flip_x: false },

            // Head 4: Goku Siêu Cấp (17 front, 18 side, 16 back)
            { head_id: 'head_goku', direction: 'down',  image_id: 17, image_url: 'head/17.png', dx: -29, dy: -70, render_width: 54, render_height: 48, flip_x: false },
            { head_id: 'head_goku', direction: 'right', image_id: 18, image_url: 'head/18.png', dx: -28, dy: -68, render_width: 52, render_height: 46, flip_x: false },
            { head_id: 'head_goku', direction: 'left',  image_id: 18, image_url: 'head/18.png', dx: -28, dy: -68, render_width: 52, render_height: 46, flip_x: true },
            { head_id: 'head_goku', direction: 'up',    image_id: 16, image_url: 'head/16.png', dx: -32, dy: -70, render_width: 63, render_height: 48, flip_x: false },

            // Head 5: Nữ Pháp Sư Elf Tóc Bạc (12955 front, 12956 side, 12954 back)
            { head_id: 'head_elf_silver', direction: 'down',  image_id: 12955, image_url: 'head/12955.png', dx: -31, dy: -66, render_width: 62, render_height: 60, flip_x: false },
            { head_id: 'head_elf_silver', direction: 'right', image_id: 12956, image_url: 'head/12956.png', dx: -40, dy: -62, render_width: 66, render_height: 56, flip_x: false },
            { head_id: 'head_elf_silver', direction: 'left',  image_id: 12956, image_url: 'head/12956.png', dx: -40, dy: -62, render_width: 66, render_height: 56, flip_x: true },
            { head_id: 'head_elf_silver', direction: 'up',    image_id: 12954, image_url: 'head/12954.png', dx: -31, dy: -66, render_width: 62, render_height: 60, flip_x: false },

            // Head 6: Mũ Bí Ngô Mèo Ma Quái (6985 front, 6986 side, 6984 back)
            { head_id: 'head_pumpkin_cat', direction: 'down',  image_id: 6985, image_url: 'head/6985.png', dx: -19, dy: -72, render_width: 38, render_height: 52, flip_x: false },
            { head_id: 'head_pumpkin_cat', direction: 'right', image_id: 6986, image_url: 'head/6986.png', dx: -19, dy: -72, render_width: 38, render_height: 52, flip_x: false },
            { head_id: 'head_pumpkin_cat', direction: 'left',  image_id: 6986, image_url: 'head/6986.png', dx: -19, dy: -72, render_width: 38, render_height: 52, flip_x: true },
            { head_id: 'head_pumpkin_cat', direction: 'up',    image_id: 6984, image_url: 'head/6984.png', dx: -22, dy: -72, render_width: 44, render_height: 52, flip_x: false },

            // Head 7: Mũ Chuột Vàng Chiêu Tài (7085 front, 7086 side, 7087 back)
            { head_id: 'head_fortune_mouse', direction: 'down',  image_id: 7085, image_url: 'head/7085.png', dx: -40, dy: -84, render_width: 64, render_height: 64, flip_x: false },
            { head_id: 'head_fortune_mouse', direction: 'right', image_id: 7086, image_url: 'head/7086.png', dx: -38, dy: -84, render_width: 62, render_height: 64, flip_x: false },
            { head_id: 'head_fortune_mouse', direction: 'left',  image_id: 7086, image_url: 'head/7086.png', dx: -38, dy: -84, render_width: 62, render_height: 64, flip_x: true },
            { head_id: 'head_fortune_mouse', direction: 'up',    image_id: 7087, image_url: 'head/7087.png', dx: -36, dy: -84, render_width: 73, render_height: 64, flip_x: false },

            // Head 8: Mũ Bò Sữa Chibi Tinh Nghịch (7600 front, 7601 side, 7602 back)
            { head_id: 'head_cow_hat', direction: 'down',  image_id: 7600, image_url: 'head/7600.png', dx: -24, dy: -72, render_width: 48, render_height: 52, flip_x: false },
            { head_id: 'head_cow_hat', direction: 'right', image_id: 7601, image_url: 'head/7601.png', dx: -23, dy: -72, render_width: 48, render_height: 52, flip_x: false },
            { head_id: 'head_cow_hat', direction: 'left',  image_id: 7601, image_url: 'head/7601.png', dx: -23, dy: -72, render_width: 48, render_height: 52, flip_x: true },
            { head_id: 'head_cow_hat', direction: 'up',    image_id: 7602, image_url: 'head/7602.png', dx: -28, dy: -72, render_width: 57, render_height: 52, flip_x: false }
        ];

        // Khởi tạo HEADS_REGISTRY toàn cục
        window.HEADS_REGISTRY = {};
        this.tables.head_templates.forEach(h => {
            window.HEADS_REGISTRY[h.head_id] = h;
        });
    }

    // Preload toàn bộ ảnh trong thư mục head/ vào GPU Cache
    preloadTextures() {
        if (typeof Image === 'undefined') return;
        const allUrls = new Set();
        this.tables.head_templates.forEach(t => allUrls.add(t.icon_url));
        this.tables.head_frames.forEach(f => {
            if (f.image_url) allUrls.add(f.image_url);
            if (f.back_image_url) allUrls.add(f.back_image_url);
        });

        this.totalImages = allUrls.size;
        this.loadedCount = 0;

        allUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount >= this.totalImages) {
                    this.isLoaded = true;
                    console.log(`[HeadSQLDB] Đã tải thành công 100% (${this.loadedCount}/${this.totalImages}) frames kiểu đầu.`);
                }
            };
            img.onerror = () => {
                console.warn(`[HeadSQLDB] Lỗi nạp texture: ${url}`);
            };
            this.imageCache.set(url, img);
        });
    }

    // Kiểm tra Head có phải là frame head từ thư mục head/ hay không
    isFrameHead(headId) {
        if (!headId) return false;
        return this.tables.head_templates.some(t => t.head_id === headId);
    }

    // Lấy thông số Template
    getHeadTemplate(headId) {
        return this.tables.head_templates.find(t => t.head_id === headId) || null;
    }

    // Lấy thông tin frame theo hướng nhìn
    getFrame(headId, direction = 'down') {
        const dir = direction || 'down';
        const frame = this.tables.head_frames.find(f => f.head_id === headId && f.direction === dir);
        if (frame) return frame;
        // Fallback về down nếu không tìm thấy
        return this.tables.head_frames.find(f => f.head_id === headId && f.direction === 'down') || null;
    }

    // Lấy Image object từ cache (Tự động nạp on-demand nếu chưa có)
    getImage(url) {
        if (!url) return null;
        let img = this.imageCache.get(url);
        if (!img) {
            img = new Image();
            img.src = url;
            this.imageCache.set(url, img);
        }
        return img;
    }

    // Lấy đối tượng Image đã preload theo hướng nhìn
    getFrameImage(headId, direction = 'down') {
        const frame = this.getFrame(headId, direction);
        if (!frame) return null;
        return this.getImage(frame.image_url);
    }

    // Lấy Icon Image
    getIconImage(headId) {
        const tmpl = this.getHeadTemplate(headId);
        if (!tmpl) return null;
        return this.getImage(tmpl.icon_url);
    }

    // Lấy toàn bộ danh sách kiểu đầu
    getAllHeads() {
        return [...this.tables.head_templates];
    }

    /**
     * VẼ LỚP TÓC SAU LƯNG (BACK HAIR LAYER)
     * Được vẽ TRƯỚC khi vẽ thân người (behind body)
     * Giúp tóc dài hiện ra sau lưng nhưng thân áo và mặt vẫn nằm phía trước
     */
    drawHeadBackLayer(ctx, headId, direction = 'down', bob = 0) {
        if (!this.isFrameHead(headId)) return;
        const frame = this.getFrame(headId, direction);
        if (!frame || !frame.back_image_url) return;

        const img = this.getImage(frame.back_image_url);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.save();
        if (frame.flip_x) {
            let needFlip = true;
            if (typeof ctx.getTransform === 'function') {
                const transform = ctx.getTransform();
                if (transform.a < 0) needFlip = false; // Đã lật rồi thì không lật lại
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
     * VẼ LỚP ĐẦU VÀ KHUÔN MẶT PHÍA TRƯỚC (FRONT HEAD LAYER)
     * Được vẽ SAU khi vẽ thân người (in front of body)
     * Giúp khuôn mặt, mắt, tóc mái và nơ cài hiện rõ trước thân áo
     */
    drawHeadFrontLayer(ctx, headId, direction = 'down', bob = 0) {
        if (!this.isFrameHead(headId)) return;
        const frame = this.getFrame(headId, direction);
        if (!frame) return;

        const img = this.getFrameImage(headId, direction);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.save();
        if (frame.flip_x) {
            let needFlip = true;
            if (typeof ctx.getTransform === 'function') {
                const transform = ctx.getTransform();
                if (transform.a < 0) needFlip = false; // Đã lật rồi thì không lật lại
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
     * VẼ KIỂU ĐẦU TRỰC TIẾP LÊN NHÂN VẬT (CHUẨN 4 HƯỚNG NHÌN)
     * Tự động tổng hợp cả Back Layer và Front Layer nếu có
     */
    drawHeadOnPlayer(ctx, headId, direction = 'down', bob = 0) {
        this.drawHeadBackLayer(ctx, headId, direction, bob);
        this.drawHeadFrontLayer(ctx, headId, direction, bob);
    }

    /**
     * VẼ ICON 120x90 CHO KIỂU ĐẦU TRONG THẺ BÀI TỦ ĐỒ
     */
    drawHeadIcon(canvas, headId) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Nền thẻ màu giấy vintage / be
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#fbf6d9');
        bgGrad.addColorStop(1, '#f3ebd0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#b89b72';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1, 1, w - 2, h - 2);

        // Nạp icon hoặc frame front
        const tmpl = this.getHeadTemplate(headId);
        const iconUrl = tmpl ? tmpl.icon_url : null;
        const img = (iconUrl && this.imageCache.get(iconUrl)) || this.getFrameImage(headId, 'down');
        if (img && (img.complete || img.naturalWidth > 0)) {
            ctx.save();
            const baseW = tmpl ? tmpl.render_width : 40;
            const baseH = tmpl ? tmpl.render_height : 48;
            let scaleFactor = 1.35;
            if (Math.max(baseW, baseH) * scaleFactor > 68) {
                scaleFactor = 68 / Math.max(baseW, baseH);
            }
            const rw = baseW * scaleFactor;
            const rh = baseH * scaleFactor;

            // Bóng đổ nhẹ dưới đầu
            ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
            ctx.beginPath();
            ctx.ellipse(w / 2, h / 2 + rh / 2 - 3, rw * 0.35, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ đầu căn giữa thẻ theo trục giải phẫu khuôn mặt
            const downFrame = this.getFrame(headId, 'down');
            const centerShift = downFrame ? (downFrame.dx + downFrame.render_width / 2) * scaleFactor : 0;
            ctx.drawImage(img, w / 2 - rw / 2 + centerShift, h / 2 - rh / 2 - 2, rw, rh);
            ctx.restore();
        }
    }
}

// Khởi tạo Singleton Database Head
window.headSQLDB = new HeadSQLDatabase();
