/**
 * ENTITIES & CHARACTERS (THICK-OUTLINE CHIBI SPRITESHEET ATLAS)
 * - Tái tạo 100% phong cách Thick-outline Chibi theo chuẩn hình mẫu tham chiếu:
 *   1. Đường viền đen dày đậm (Thick Outline) bo tròn mềm mại
 *   2. Đầu Chibi tròn to, má ửng hồng phấn, mắt to tròn long lanh có phản quang lung linh
 *   3. 10 Kiểu tóc Anime Chibi đa sắc với vệt bóng tóc highlight
 *   4. Hoạt ảnh Frame-by-frame: Frame 0 (Đứng thở nhẹ), Frame 1-2 (Bước đi chân luân phiên + vung tay), Frame 3 (Hành động / Niệm phép tỏa sao lấp lánh)
 *   5. Toàn bộ các bộ trang phục:
 *      - Tho_cam_e_de: Trang phục truyền thống dân tộc Ê Đê hoa văn thổ cẩm đỏ vàng cồng chiêng đại ngàn
 *      - The_duc_tnu: Đồ thể dục thể thao Đại học Tây Nguyên xanh coban sọc trắng năng động
 *      - Dong_phuc_tnu: Đồng phục polo sinh viên TNU
 *      - Ao_dai: Áo dài trắng nữ sinh Tây Nguyên
 *      - Ao_blouse: Áo blouse trắng Bác sĩ Y Dược TNU kèm ống nghe y tế stethoscope
 *      - Ao_tot_nghiep: Lễ phục Cử nhân tốt nghiệp TNU kèm mũ quả tua vàng
 *      - Hoc_sinh_thpt: Đồng phục THPT Thực hành Cao Nguyên
 *      - Tho_cam_ba_na: Trang phục thổ cẩm Ba Na
 *   6. Đầy đủ các loại cánh & biến thể màu: Cánh Tiên, Thiên Thần, Dơi, Bướm, Lá, Mây, Lửa, Pha Lê, Sao Băng, Rồng (xoay quanh pivot gốc cánh)
 */

// ============================================================================
// HỆ THỐNG HIỂN THỊ NÚT TƯƠNG TÁC THẾ GIỚI CAO CẤP (RPG WORLD PROMPT BADGE)
// Tái thiết kế toàn bộ [E] prompt badge: Nút phím 3D cơ khí, viền phát sáng,
// hiệu ứng lơ lửng bồng bềnh, bóng đổ đa lớp, phong cách anime/RPG tuyệt đẹp
// ============================================================================
window.drawWorldPromptBadge = function(ctx, x, y, rawText, options = {}) {
    if (!ctx || !rawText) return;

    const timer = options.timer !== undefined ? options.timer : (Date.now() / 1000);
    const scale = options.scale || 1.0;
    const showPointer = options.pointer !== false;

    // 1. Phân tích cú pháp: Tách phím [KEY] và nội dung nhãn
    let key = options.key || null;
    let label = rawText;
    const keyMatch = rawText.match(/\[([A-Za-z0-9]+)\]/);
    if (keyMatch) {
        if (!key) key = keyMatch[1].toUpperCase();
        label = rawText.replace(/Bấm\s*\[[A-Za-z0-9]+\]\s*/i, '')
                       .replace(/\[[A-Za-z0-9]+\]\s*/, '')
                       .replace(/\s{2,}/g, ' ')
                       .trim();
    }

    // 2. Bảng phối màu Theme phong cách Fantasy RPG cao cấp
    const themeName = options.theme || 'royal';
    const themes = {
        royal: {
            bgTop: '#0d2347',
            bgBottom: '#040b17',
            border: '#38bdf8',
            glow: 'rgba(56, 189, 248, 0.85)',
            keyBgTop: '#ffffff',
            keyBgBot: '#e2e8f0',
            keyShadow: '#94a3b8',
            keyBorder: '#cbd5e1',
            keyText: '#0f172a',
            textColor: '#ffffff',
            accent: '#7dd3fc'
        },
        gold: {
            bgTop: '#361e06',
            bgBottom: '#150a02',
            border: '#fbbf24',
            glow: 'rgba(251, 191, 36, 0.85)',
            keyBgTop: '#fffbeb',
            keyBgBot: '#fef08a',
            keyShadow: '#d97706',
            keyBorder: '#fde047',
            keyText: '#78350f',
            textColor: '#fffbeb',
            accent: '#fde68a'
        },
        ruby: {
            bgTop: '#3d0714',
            bgBottom: '#180208',
            border: '#fb7185',
            glow: 'rgba(251, 113, 133, 0.85)',
            keyBgTop: '#fff1f2',
            keyBgBot: '#fecdd3',
            keyShadow: '#e11d48',
            keyBorder: '#fda4af',
            keyText: '#881337',
            textColor: '#ffffff',
            accent: '#fda4af'
        },
        emerald: {
            bgTop: '#06331c',
            bgBottom: '#02150b',
            border: '#34d399',
            glow: 'rgba(52, 211, 153, 0.85)',
            keyBgTop: '#ecfdf5',
            keyBgBot: '#a7f3d0',
            keyShadow: '#059669',
            keyBorder: '#6ee7b7',
            keyText: '#064e3b',
            textColor: '#ffffff',
            accent: '#6ee7b7'
        },
        purple: {
            bgTop: '#2e0a3e',
            bgBottom: '#110218',
            border: '#c084fc',
            glow: 'rgba(192, 132, 252, 0.85)',
            keyBgTop: '#faf5ff',
            keyBgBot: '#e9d5ff',
            keyShadow: '#9333ea',
            keyBorder: '#d8b4fe',
            keyText: '#581c87',
            textColor: '#ffffff',
            accent: '#e9d5ff'
        },
        cyan: {
            bgTop: '#052e3b',
            bgBottom: '#01141b',
            border: '#22d3ee',
            glow: 'rgba(34, 211, 238, 0.85)',
            keyBgTop: '#ecfeff',
            keyBgBot: '#a5f3fc',
            keyShadow: '#0891b2',
            keyBorder: '#67e8f9',
            keyText: '#164e63',
            textColor: '#ffffff',
            accent: '#67e8f9'
        },
        blue: {
            bgTop: '#0d2347',
            bgBottom: '#040b17',
            border: '#38bdf8',
            glow: 'rgba(56, 189, 248, 0.85)',
            keyBgTop: '#ffffff',
            keyBgBot: '#e2e8f0',
            keyShadow: '#94a3b8',
            keyBorder: '#cbd5e1',
            keyText: '#0f172a',
            textColor: '#ffffff',
            accent: '#7dd3fc'
        }
    };
    const t = themes[themeName] || themes.royal;

    ctx.save();

    // 3. Hoạt ảnh nhấp nhô mượt mà (Floating Bob & Breathing Glow)
    const bob = Math.sin(timer * 4.2) * 2.8;
    const pulse = 0.82 + Math.sin(timer * 5.5) * 0.18;

    ctx.translate(x, y + bob);
    if (scale !== 1.0) ctx.scale(scale, scale);

    // 4. Đo đạc kích thước & tỷ lệ thành phần
    ctx.font = 'bold 11px "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const textW = Math.ceil(ctx.measureText(label).width) + 2;

    const hasKey = !!key;
    const keyW = 20;
    const keyH = 18;
    const padL = hasKey ? 6 : 10;
    const keyGap = hasKey ? 7 : 0;
    const padR = 11;
    const totalW = padL + (hasKey ? keyW + keyGap : 0) + textW + padR;
    const totalH = 25;
    const rx = -totalW / 2;
    const ry = -totalH / 2;

    // 5. Bóng đổ mềm đa lớp (Ambient Soft Drop Shadow)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;

    // 6. Thân Pill (Viên nang Gradient hai màu sẫm tương phản cao)
    ctx.beginPath();
    ctx.roundRect(rx, ry, totalW, totalH, totalH / 2);
    const bgGrad = ctx.createLinearGradient(0, ry, 0, ry + totalH);
    bgGrad.addColorStop(0, t.bgTop);
    bgGrad.addColorStop(1, t.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // 7. Viền phát sáng rực rỡ (Glowing Neon Stroke)
    ctx.shadowColor = t.glow;
    ctx.shadowBlur = 6 * pulse;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Tắt shadow để vẽ chi tiết sắc nét bên trong
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // 8. Vệt sáng phản quang trên mép trên (Top Rim Glass Specular Highlight)
    const hlGrad = ctx.createLinearGradient(rx + 8, ry + 1.5, rx + totalW - 8, ry + 1.5);
    hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hlGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.45)');
    hlGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.45)');
    hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.strokeStyle = hlGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx + 10, ry + 2);
    ctx.lineTo(rx + totalW - 10, ry + 2);
    ctx.stroke();

    // 9. Mũi tên chỉ mục tiêu bên dưới (Target Pointer Arrow)
    if (showPointer) {
        ctx.fillStyle = t.bgBottom;
        ctx.strokeStyle = t.border;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, ry + totalH - 0.5);
        ctx.lineTo(0, ry + totalH + 4.5);
        ctx.lineTo(4, ry + totalH - 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // 10. Phím bấm 3D cơ khí nổi bật (Skeuomorphic Mechanical Keycap)
    if (hasKey) {
        const kx = rx + padL;
        const ky = -keyH / 2;

        // Chân đế 3D / Đáy bóng phím
        ctx.fillStyle = t.keyShadow;
        ctx.beginPath();
        ctx.roundRect(kx, ky + 1.8, keyW, keyH - 0.5, 4);
        ctx.fill();

        // Mặt nắp phím phía trên
        const keyGrad = ctx.createLinearGradient(0, ky, 0, ky + keyH - 2);
        keyGrad.addColorStop(0, t.keyBgTop);
        keyGrad.addColorStop(1, t.keyBgBot);
        ctx.fillStyle = keyGrad;
        ctx.beginPath();
        ctx.roundRect(kx, ky, keyW, keyH - 1.8, 4);
        ctx.fill();

        ctx.strokeStyle = t.keyBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vệt bóng gương nhỏ góc trên phím
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(kx + 3, ky + 2, keyW - 6, 1.2);

        // Ký tự phím in đậm chính xác
        ctx.font = '900 10.5px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = t.keyText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(key, kx + keyW / 2, ky + (keyH - 1.8) / 2 + 0.5);
    }

    // 11. Chữ hành động (Action Label Text)
    const tx = rx + padL + (hasKey ? keyW + keyGap : 0);
    ctx.font = 'bold 11px "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Bóng chữ giúp đọc rõ trên mọi nền cỏ/gạch/nước
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = t.textColor;
    ctx.fillText(label, tx, 0);

    // 12. Ngôi sao lấp lánh nhẹ nhàng ở góc (Glint Sparkle)
    const glintPhase = (timer * 1.4) % 3.2;
    if (glintPhase < 0.6) {
        const starScale = Math.sin((glintPhase / 0.6) * Math.PI);
        const sx = rx + totalW - 6;
        const sy = ry + 4.5;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(starScale, starScale);
        ctx.fillStyle = t.accent || '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -3.5);
        ctx.lineTo(1, -1);
        ctx.lineTo(3.5, 0);
        ctx.lineTo(1, 1);
        ctx.lineTo(0, 3.5);
        ctx.lineTo(-1, 1);
        ctx.lineTo(-3.5, 0);
        ctx.lineTo(-1, -1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
};

// ==========================================
// HỆ THỐNG HẠT PARTICLE CHO CÁNH & SỰ KIỆN
// ==========================================
class WingParticle {
    constructor(x, y, vx, vy, size, life, color, type = 'sparkle') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.type = type;
        this.alpha = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.1;
    }

    update(dt) {
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.rotation += this.vRot * dt * 60;
        this.life -= dt;
        this.alpha = Math.max(0, this.life / this.maxLife);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'sparkle') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.quadraticCurveTo(0, 0, this.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, this.size);
            ctx.quadraticCurveTo(0, 0, -this.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, -this.size);
            ctx.fill();
        } else if (this.type === 'ember') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    spawnWingSparkle(x, y, wingType) {
        if (Math.random() > 0.45) return;
        let color = '#ffd166';
        let size = Math.random() * 3 + 2;

        if (wingType.includes('fairy')) color = wingType.includes('pink') ? '#ff70a6' : wingType.includes('gold') ? '#ffd166' : '#a2d2ff';
        else if (wingType.includes('angel')) color = wingType.includes('fallen') ? '#7209b7' : '#ffd166';
        else if (wingType.includes('bat')) color = wingType.includes('crimson') ? '#e63946' : '#7209b7';
        else if (wingType.includes('butterfly')) {
            if (wingType.includes('blue')) color = '#48cae4';
            else if (wingType.includes('emerald')) color = '#52b788';
            else if (wingType.includes('gold')) color = '#ffd166';
            else if (wingType.includes('noir')) color = '#ffd166';
            else color = '#ff758f';
        }
        else if (wingType.includes('leaf')) color = '#52b788';
        else if (wingType.includes('cloud')) color = '#e0fbfc';
        else if (wingType.includes('flame')) color = wingType.includes('blue') ? '#48cae4' : '#f77f00';
        else if (wingType.includes('crystal')) color = wingType.includes('amethyst') ? '#b5179e' : '#90e0ef';
        else if (wingType.includes('star')) color = wingType.includes('rainbow') ? '#ff70a6' : '#ffd166';
        else if (wingType.includes('dragon')) color = wingType.includes('inferno') ? '#d90429' : '#06d6a0';

        this.particles.push(new WingParticle(x, y, (Math.random() - 0.5) * 0.8, -Math.random() * 0.8, size, 0.8, color, 'sparkle'));
    }

    burstCelebration(x, y) {
        const colors = ['#ffd166', '#ff4d6d', '#06d6a0', '#118ab2', '#7209b7', '#f77f00', '#ffffff'];
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.particles.push(new WingParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 4, 1.0, colors[i % colors.length], 'sparkle'));
        }
    }
}

// ==========================================
// BỘ VẼ CÁNH THICK-OUTLINE & FRAME SPRITESHEET (WINGS RENDERER)
// Tích hợp SQL Texture Cache: Hỗ trợ hoạt ảnh Frame từ thư mục ảnh (14 Frames Cyber Hex & 3 Frames Angel)
// ==========================================
class WingsRenderer {
    // Vẽ cánh trực tiếp trên thân nhân vật (Hỗ trợ Frame Animation từ Database SQL)
    static drawWingsOnCharacter(ctx, wingId, animTimer, bob, isMoving) {
        if (window.wingSQLDB && window.wingSQLDB.isFrameWing(wingId)) {
            const tmpl = window.wingSQLDB.getWingTemplate(wingId);
            if (tmpl) {
                const elapsedMs = animTimer * 1000;
                const frameIdx = window.wingSQLDB.calculateFrameIndex(wingId, elapsedMs);
                const img = window.wingSQLDB.getFrameImage(wingId, frameIdx);

                if (img && (img.complete || img.naturalWidth > 0)) {
                    let rw = tmpl.render_width || 110;
                    let rh = tmpl.render_height || 90;

                    // TỰ ĐỘNG BẢO TOÀN CHUẨN TỶ LỆ ASPECT RATIO GỐC CỦA KHUNG HÌNH (Tuyệt đối không bị nén bẹp)
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        const rawAspect = img.naturalWidth / img.naturalHeight;
                        rh = Math.round(rw / rawAspect);
                    }

                    const ox = tmpl.offset_x || 0;
                    const oy = (tmpl.offset_y !== undefined ? tmpl.offset_y : -6) + bob;

                    ctx.save();
                    // Vẽ cánh khớp chính xác phần lưng trên nhân vật
                    ctx.drawImage(img, ox - rw / 2, oy - rh / 2, rw, rh);
                    ctx.restore();
                    return true;
                }
            }
        }
        return false;
    }

    static drawWing(ctx, wingId, side, flapAngle) {
        const isLeft = side === 'left';
        const flipX = isLeft ? -1 : 1;

        ctx.save();
        // Xoay cánh quanh pivot (chấm đỏ ở gốc cánh)
        ctx.rotate(isLeft ? flapAngle : -flapAngle);
        ctx.scale(flipX, 1);

        // Thiết lập chuẩn Thick-outline cho cánh
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (wingId) {
            // 1. CÁNH TIÊN & BIẾN THỂ
            case 'wing_fairy':
            default:
                ctx.fillStyle = 'rgba(162, 210, 255, 0.85)';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 42, -26, 38, -6);
                ctx.bezierCurveTo(34, 10, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                // Gân cánh
                ctx.strokeStyle = '#7209b7';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(4, -2);
                ctx.quadraticCurveTo(18, -14, 28, -6);
                ctx.stroke();
                break;

            case 'wing_fairy_pink':
                ctx.fillStyle = 'rgba(255, 112, 166, 0.85)';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 42, -26, 38, -6);
                ctx.bezierCurveTo(34, 10, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                ctx.strokeStyle = '#ff0054';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(4, -2);
                ctx.quadraticCurveTo(18, -14, 28, -6);
                ctx.stroke();
                break;

            case 'wing_fairy_gold':
                ctx.fillStyle = 'rgba(255, 209, 102, 0.9)';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 42, -26, 38, -6);
                ctx.bezierCurveTo(34, 10, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                ctx.strokeStyle = '#d4a373';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(4, -2);
                ctx.quadraticCurveTo(18, -14, 28, -6);
                ctx.stroke();
                break;

            // 2. CÁNH THIÊN THẦN
            case 'wing_angel':
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(10, -22, 38, -32, 44, -14);
                ctx.bezierCurveTo(46, -4, 36, 6, 28, 4);
                ctx.bezierCurveTo(24, 12, 16, 16, 8, 10);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Lông vũ con
                ctx.fillStyle = '#ffd166';
                ctx.beginPath();
                ctx.arc(16, -6, 4, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_angel_fallen':
                ctx.fillStyle = '#240046';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(10, -22, 38, -32, 44, -14);
                ctx.bezierCurveTo(46, -4, 36, 6, 28, 4);
                ctx.bezierCurveTo(24, 12, 16, 16, 8, 10);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Lông vũ tím
                ctx.strokeStyle = '#9d4edd';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(12, -4);
                ctx.lineTo(24, -10);
                ctx.stroke();
                break;

            case 'wing_angel_seraph':
                ctx.fillStyle = '#fefae0';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(8, -26, 36, -36, 48, -16);
                ctx.bezierCurveTo(44, 2, 32, 10, 22, 8);
                ctx.bezierCurveTo(18, 18, 10, 18, 0, 0);
                ctx.fill(); ctx.stroke();
                // Tầng cánh phụ
                ctx.fillStyle = '#4cc9f0';
                ctx.beginPath();
                ctx.moveTo(4, -4);
                ctx.quadraticCurveTo(20, -18, 30, -6);
                ctx.quadraticCurveTo(18, 2, 4, -4);
                ctx.fill(); ctx.stroke();
                break;

            // 3. CÁNH DƠI
            case 'wing_bat':
                ctx.fillStyle = '#3c096c';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, -26);
                ctx.quadraticCurveTo(26, -12, 34, -20);
                ctx.quadraticCurveTo(36, -2, 42, -4);
                ctx.quadraticCurveTo(32, 10, 22, 12);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;

            case 'wing_bat_crimson':
                ctx.fillStyle = '#9d0208';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, -26);
                ctx.quadraticCurveTo(26, -12, 34, -20);
                ctx.quadraticCurveTo(36, -2, 42, -4);
                ctx.quadraticCurveTo(32, 10, 22, 12);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Gân đỏ tươi
                ctx.strokeStyle = '#ff4d6d';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, -26);
                ctx.stroke();
                break;

            // 4. CÁNH BƯỚM & ĐẦY ĐỦ BIẾN THỂ MÀU ATLAS
            case 'wing_butterfly':
                ctx.fillStyle = '#ff758f';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 44, -26, 40, -4);
                ctx.bezierCurveTo(34, 12, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                // Đốm hoa văn cánh bướm
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(22, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#590d22';
                ctx.beginPath();
                ctx.arc(28, -6, 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_butterfly_blue':
                ctx.fillStyle = '#48cae4';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 44, -26, 40, -4);
                ctx.bezierCurveTo(34, 12, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(22, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#03045e';
                ctx.beginPath();
                ctx.arc(28, -6, 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_butterfly_emerald':
                ctx.fillStyle = '#52b788';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 44, -26, 40, -4);
                ctx.bezierCurveTo(34, 12, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#d8f3dc';
                ctx.beginPath();
                ctx.arc(22, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#1b4332';
                ctx.beginPath();
                ctx.arc(28, -6, 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_butterfly_gold':
                ctx.fillStyle = '#ffb703';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 44, -26, 40, -4);
                ctx.bezierCurveTo(34, 12, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(22, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fb8500';
                ctx.beginPath();
                ctx.arc(28, -6, 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_butterfly_noir':
                ctx.fillStyle = '#212529';
                ctx.strokeStyle = '#ffd166';
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(14, -28, 44, -26, 40, -4);
                ctx.bezierCurveTo(34, 12, 16, 8, 0, 0);
                ctx.fill(); ctx.stroke();
                // Họa tiết vàng kim
                ctx.fillStyle = '#ffd166';
                ctx.beginPath();
                ctx.arc(22, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                break;

            // 5. CÁNH LÁ CÂY
            case 'wing_leaf':
                ctx.fillStyle = '#52b788';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(18, -32, 38, -16);
                ctx.quadraticCurveTo(24, 2, 0, 0);
                ctx.fill(); ctx.stroke();
                // Gân lá
                ctx.strokeStyle = '#1b4332';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(2, -1);
                ctx.quadraticCurveTo(16, -14, 30, -14);
                ctx.stroke();
                break;

            // 6. CÁNH MÂY
            case 'wing_cloud':
                ctx.fillStyle = '#f8f9fa';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.arc(14, -14, 12, 0, Math.PI * 2);
                ctx.arc(28, -8, 14, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                // Viền bóng xanh nhạt
                ctx.fillStyle = 'rgba(162, 210, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(22, -6, 6, 0, Math.PI * 2);
                ctx.fill();
                break;

            // 7. CÁNH LỬA
            case 'wing_flame':
                ctx.fillStyle = '#d62828';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(8, -26, 36, -34, 42, -18);
                ctx.bezierCurveTo(34, -8, 38, 4, 26, 6);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Lõi lửa vàng rực
                ctx.fillStyle = '#f77f00';
                ctx.beginPath();
                ctx.moveTo(4, -2);
                ctx.quadraticCurveTo(16, -18, 26, -10);
                ctx.quadraticCurveTo(20, -2, 4, -2);
                ctx.fill();
                break;

            case 'wing_flame_blue':
                ctx.fillStyle = '#03045e';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(8, -26, 36, -34, 42, -18);
                ctx.bezierCurveTo(34, -8, 38, 4, 26, 6);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Lõi lửa xanh lam sáng
                ctx.fillStyle = '#48cae4';
                ctx.beginPath();
                ctx.moveTo(4, -2);
                ctx.quadraticCurveTo(16, -18, 26, -10);
                ctx.quadraticCurveTo(20, -2, 4, -2);
                ctx.fill();
                break;

            // 8. CÁNH BĂNG PHA LÊ
            case 'wing_crystal':
                ctx.fillStyle = 'rgba(144, 224, 239, 0.9)';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(24, -28);
                ctx.lineTo(38, -18);
                ctx.lineTo(22, 0);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Vết cắt giác pha lê
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(12, -14);
                ctx.lineTo(30, -18);
                ctx.stroke();
                break;

            case 'wing_crystal_amethyst':
                ctx.fillStyle = 'rgba(181, 23, 158, 0.9)';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(24, -28);
                ctx.lineTo(38, -18);
                ctx.lineTo(22, 0);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.strokeStyle = '#f72585';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(12, -14);
                ctx.lineTo(30, -18);
                ctx.stroke();
                break;

            // 9. CÁNH SAO BĂNG
            case 'wing_star':
                ctx.fillStyle = '#10002b';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(12, -28, 44, -24, 38, -4);
                ctx.bezierCurveTo(34, 10, 16, 12, 0, 0);
                ctx.fill(); ctx.stroke();
                // Sao vàng lấp lánh
                ctx.fillStyle = '#ffd166';
                ctx.beginPath();
                ctx.arc(24, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'wing_star_rainbow':
                ctx.fillStyle = '#7209b7';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(12, -28, 44, -24, 38, -4);
                ctx.bezierCurveTo(34, 10, 16, 12, 0, 0);
                ctx.fill(); ctx.stroke();
                // Vệt sao đa sắc
                ctx.fillStyle = '#4cc9f0';
                ctx.beginPath();
                ctx.arc(18, -12, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff70a6';
                ctx.beginPath();
                ctx.arc(28, -6, 3.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            // 10. CÁNH RỒNG
            case 'wing_dragon':
                ctx.fillStyle = '#118ab2';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, -30);
                ctx.quadraticCurveTo(28, -14, 38, -22);
                ctx.quadraticCurveTo(40, -4, 46, -6);
                ctx.quadraticCurveTo(34, 12, 22, 14);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;

            case 'wing_dragon_inferno':
                ctx.fillStyle = '#6a040f';
                ctx.strokeStyle = '#1e1b18';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, -30);
                ctx.quadraticCurveTo(28, -14, 38, -22);
                ctx.quadraticCurveTo(40, -4, 46, -6);
                ctx.quadraticCurveTo(34, 12, 22, 14);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Sừng gai rồng đỏ
                ctx.fillStyle = '#d90429';
                ctx.beginPath();
                ctx.arc(16, -28, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }
}

// ==========================================
// THẦN THÚ ĐỒNG HÀNH ĐI THEO NGƯỜI CHƠI (COMPANION PET - FRAME ANIMATION)
// Tích hợp SQL Texture Cache: Tự động tính toán theo Delta Time, Lật hướng di chuyển mượt mà
// ==========================================
class CompanionPet {
    constructor(player) {
        this.player = player;
        this.x = player.x - 30;
        this.y = player.y - 8;
        this.vx = 0;
        this.vy = 0;
        this.facing = 1; // 1: phải, -1: trái
        this.animTimer = 0;
        this.realTimer = 0;
        this.bob = 0;
        this.idleEmoteTimer = 0;
        this.heartEmoteTimer = 0;
        this.particles = [];
    }

    teleportTo(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.particles = [];
    }

    triggerHeart() {
        this.heartEmoteTimer = 1.6;
    }

    getPetId() {
        if (this.player && this.player.petId !== undefined) {
            return this.player.petId;
        }
        return (window.useGameStore && window.useGameStore.state && window.useGameStore.state.progression)
            ? window.useGameStore.state.progression.pet_hien_tai
            : null;
    }

    update(dt) {
        const petId = this.getPetId();
        if (!petId || !window.petSQLDB || !window.petSQLDB.isFramePet(petId)) return;

        this.realTimer += dt;
        this.animTimer += dt;

        if (this.heartEmoteTimer > 0) {
            this.heartEmoteTimer -= dt;
        }

        const tmpl = window.petSQLDB.getPetTemplate(petId);
        const followOffset = tmpl ? (tmpl.follow_dist || 36) : 36;
        const speedFactor = tmpl ? (tmpl.speed_factor || 1.0) : 1.0;

        // Điểm đích đi theo người chơi
        let targetX = this.player.x;
        let targetY = this.player.y;

        if (this.player.direction === 'right') {
            targetX = this.player.x - followOffset;
            targetY = this.player.y - 10;
        } else if (this.player.direction === 'left') {
            targetX = this.player.x + followOffset;
            targetY = this.player.y - 10;
        } else if (this.player.direction === 'down') {
            targetX = this.player.x - followOffset * 0.75;
            targetY = this.player.y - 20;
        } else { // up
            targetX = this.player.x - followOffset * 0.75;
            targetY = this.player.y + 14;
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.hypot(dx, dy);

        // Nếu quá xa (dịch chuyển bản đồ hoặc hồi sinh), kéo lại ngay lập tức
        if (dist > 320) {
            this.x = targetX;
            this.y = targetY;
            this.vx = 0;
            this.vy = 0;
        } else {
            // Hiệu ứng vật lý đàn hồi mượt mà (Smooth Spring / Lerp Follow)
            const speed = (this.player.isMoving ? 7.2 : 4.6) * speedFactor;
            const factor = Math.min(1.0, dt * speed);
            this.x += dx * factor;
            this.y += dy * factor;

            // Xác định hướng nhìn của Pet
            if (Math.abs(dx) > 2) {
                this.facing = dx > 0 ? 1 : -1;
            } else if (this.player.direction === 'left') {
                this.facing = -1;
            } else if (this.player.direction === 'right') {
                this.facing = 1;
            }
        }

        // Độ nhún bồng bềnh tự nhiên (Hover Bobbing)
        const bobFreq = this.player.isMoving ? 5.5 : 3.8;
        const bobAmp = this.player.isMoving ? 4.5 : 3.0;
        this.bob = Math.sin(this.realTimer * bobFreq) * bobAmp;

        // Sinh hạt hào quang / bụi sao đặc trưng của Pet
        if (Math.random() < (this.player.isMoving ? 0.35 : 0.15)) {
            this.spawnParticle(petId);
        }
        this.updateParticles(dt);
    }

    spawnParticle(petId) {
        let color = '#ffd166';
        let size = Math.random() * 2.5 + 1.5;
        let maxLife = 0.5 + Math.random() * 0.4;

        if (petId === 'pet_fire_kirin') {
            const colors = ['#ff4d00', '#ff9e00', '#ffd166', '#d00000'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_dark_dragon') {
            const colors = ['#7209b7', '#3a0ca3', '#4cc9f0', '#240046'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_white_fox') {
            const colors = ['#ffffff', '#ffd166', '#a2d2ff', '#bde0fe'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_thunder_beast') {
            const colors = ['#ffb703', '#ffd166', '#c77dff', '#7b2cbf', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_blood_stag') {
            const colors = ['#d90429', '#ef233c', '#9b2226', '#6a040f', '#ff4d6d'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_frost_pixie') {
            const colors = ['#ffffff', '#e0f2fe', '#00b4d8', '#90e0ef', '#caf0f8'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_blazing_drake') {
            const colors = ['#ff0054', '#ff5400', '#ff9e00', '#ffd166', '#d00000'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_earth_shiba') {
            const colors = ['#a3704c', '#dda15e', '#606c38', '#bc6c25', '#fefae0'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_mecha_sentinel') {
            const colors = ['#e63946', '#457b9d', '#1d3557', '#f1faee', '#a8dadc'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_celestial_serpent') {
            const colors = ['#48cae4', '#0077b6', '#023e8a', '#caf0f8', '#90e0ef'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_flora_pixie') {
            const colors = ['#f72585', '#b5179e', '#7209b7', '#480ca8', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_silver_drake') {
            const colors = ['#e0e1dd', '#778da9', '#415a77', '#ffd166', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_divine_obelisk') {
            const colors = ['#7209b7', '#3a0ca3', '#4cc9f0', '#f72585', '#4361ee'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_sakura_fox') {
            const colors = ['#ff70a6', '#ff9770', '#ffd670', '#ffffff', '#e9ecef'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_astral_falcon') {
            const colors = ['#ffaa00', '#ffd000', '#ff5400', '#fff3b0', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_sakura_bunny') {
            const colors = ['#ff70a6', '#ff9770', '#ffd670', '#ffffff', '#ffb5a7'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_amber_tiger') {
            const colors = ['#e09f3e', '#f4a261', '#e76f51', '#264653', '#e9c46a'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_silver_nine_tails') {
            const colors = ['#e2eafc', '#c77dff', '#bde0fe', '#ffffff', '#7b2cbf'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_night_sentinel') {
            const colors = ['#3a86ff', '#0077b6', '#ffb703', '#ffffff', '#03045e'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_blaze_gryphon') {
            const colors = ['#f77f00', '#d62828', '#fcbf49', '#eae2b7', '#ff5400'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_earth_gryphon') {
            const colors = ['#8c6d48', '#b89b72', '#606c38', '#dda15e', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_golden_phoenix') {
            const colors = ['#ffd166', '#ffb703', '#fb8500', '#ffffff', '#ffeedd'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_magma_behemoth') {
            const colors = ['#d90429', '#ef233c', '#ff5400', '#ff9e00', '#370617'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_thunder_antler') {
            const colors = ['#ffb703', '#ffd166', '#7209b7', '#ffffff', '#4cc9f0'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_solar_pixie') {
            const colors = ['#ffea00', '#fff3b0', '#ffd166', '#ffffff', '#ffeaa7'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_shadow_wolf') {
            const colors = ['#7b2cbf', '#5a189a', '#9d4edd', '#000000', '#c77dff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_crimson_drake') {
            const colors = ['#e63946', '#d90429', '#ff4d6d', '#6a040f', '#ff758f'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_abyssal_leviathan') {
            const colors = ['#0077b6', '#00b4d8', '#90e0ef', '#03045e', '#caf0f8'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_rose_fairy') {
            const colors = ['#f72585', '#b5179e', '#7209b7', '#ffb3c6', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_mystic_panda') {
            const colors = ['#2ec4b6', '#cbf3f0', '#ffffff', '#2b2d42', '#a7c957'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_titan_drake') {
            const colors = ['#d4a373', '#ccd5ae', '#e9edc9', '#faedcd', '#bc6c25'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_frost_leopard') {
            const colors = ['#90e0ef', '#caf0f8', '#0077b6', '#ffffff', '#48cae4'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_azure_seraph') {
            const colors = ['#48cae4', '#00b4d8', '#90e0ef', '#caf0f8', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        } else if (petId === 'pet_solar_kirin') {
            const colors = ['#f77f00', '#d62828', '#fcbf49', '#ffd166', '#ffffff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        }

        this.particles.push({
            x: this.x + (Math.random() - 0.5) * 20,
            y: this.y + this.bob + (Math.random() - 0.5) * 16,
            vx: (Math.random() - 0.5) * 14,
            vy: -Math.random() * 22 - 6,
            life: 0,
            maxLife,
            color,
            size
        });
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life += dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        const petId = this.getPetId();
        if (!petId || !window.petSQLDB || !window.petSQLDB.isFramePet(petId)) return;

        const tmpl = window.petSQLDB.getPetTemplate(petId);
        if (!tmpl) return;

        const elapsedMs = this.realTimer * 1000;
        const frameIdx = window.petSQLDB.calculateFrameIndex(petId, elapsedMs);
        const img = window.petSQLDB.getFrameImage(petId, frameIdx);

        const rw = tmpl.render_width || 56;
        const rh = tmpl.render_height || 48;

        // 1. Vẽ hạt hào quang phía sau
        ctx.save();
        this.particles.forEach(p => {
            const alpha = Math.max(0, 1 - p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * 0.85;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // 2. Bóng đổ Chibi dưới đất (Ground Shadow)
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
        ctx.beginPath();
        const shadowScale = 1 - (this.bob / 20);
        ctx.ellipse(this.x, this.y + (rh / 2) - 4, (rw * 0.32) * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Vẽ Sprite Pet Frame Animation
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.translate(this.x, this.y + this.bob);

            // Lật hướng nhìn: quay sang trái = scale(-1, 1), sang phải = scale(1, 1)
            if (this.facing === -1) {
                ctx.scale(-1, 1);
            }

            try {
                ctx.drawImage(img, -rw / 2, -rh / 2, rw, rh);
            } catch (e) {}
            ctx.restore();
        }

        // 4. Bảng tên Overhead Mini siêu xinh
        ctx.save();
        const tagY = this.y + this.bob - rh / 2 - 7;
        const petName = window.i18n ? window.i18n.t(tmpl.desc_key ? tmpl.desc_key.replace('_desc', '_name') : 'pet') : tmpl.name;
        // Rút ngắn tên hiển thị cho gọn gàng (bỏ phần "(5 Frames)")
        const cleanName = petName.split('(')[0].trim();

        ctx.font = 'bold 9px Nunito, sans-serif';
        const textW = ctx.measureText(cleanName).width;
        
        ctx.fillStyle = 'rgba(26, 26, 26, 0.65)';
        ctx.beginPath();
        ctx.roundRect(this.x - textW / 2 - 7, tagY - 9, textW + 14, 13, 6);
        ctx.fill();

        ctx.strokeStyle = tmpl.aura_color || '#ffd166';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cleanName, this.x, tagY - 2.5);
        ctx.restore();

        // 5. Hiệu ứng bong bóng cảm xúc (Heart Emote) khi tương tác
        if (this.heartEmoteTimer > 0) {
            ctx.save();
            const heartY = tagY - 14 - Math.sin((1.6 - this.heartEmoteTimer) * 2) * 5;
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', this.x, heartY);
            ctx.restore();
        }
    }

    // Phương thức vẽ tĩnh linh hoạt (dùng cho Preview Tủ đồ & Thẻ bài UI)
    static drawPetSprite(ctx, petId, x, y, facing = 1, elapsedMs = 0, scale = 1.0, showShadow = true) {
        if (!window.petSQLDB || !window.petSQLDB.isFramePet(petId)) return;
        const tmpl = window.petSQLDB.getPetTemplate(petId);
        if (!tmpl) return;

        const frameIdx = window.petSQLDB.calculateFrameIndex(petId, elapsedMs);
        const img = window.petSQLDB.getFrameImage(petId, frameIdx);

        const rw = (tmpl.render_width || 56) * scale;
        const rh = (tmpl.render_height || 48) * scale;

        if (showShadow) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
            ctx.beginPath();
            ctx.ellipse(x, y + rh / 2 - 2, rw * 0.35, 4.5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.translate(x, y);
            if (facing === -1) {
                ctx.scale(-1, 1);
            }
            try {
                ctx.drawImage(img, -rw / 2, -rh / 2, rw, rh);
            } catch (e) {}
            ctx.restore();
        }
    }
}

// ==========================================
// CLASS PLAYER (THICK-OUTLINE CHIBI SPRITESHEET ATLAS)
// ==========================================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 54;
        this.baseSpeed = 5.2;
        this.direction = 'right'; // 'down', 'right', 'left', 'up'
        this.isMoving = false;
        
        // Hoạt ảnh Frame-by-frame
        this.animTimer = 0;
        this.animFrame = 0; // 0: idle, 1: walk_1, 2: walk_2, 3: action
        this.flapTimer = 0;
        this.wingRealTimer = 0; // Timer thời gian thực (giây) chuyên biệt cho hoạt ảnh cánh frame-by-frame
        this.stepSoundTimer = 0;
        this.actionTimer = 0; // Kích hoạt frame action khi tương tác
        this.blinkTimer = 0; // Chớp mắt tự nhiên

        // Tên nhân vật overhead (Đồng bộ với LocalStorage & State)
        const savedPlayerName = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.progression && window.useGameStore.state.progression.ten_nhan_vat) || 'Sinh Viên TNU';
        this.name = savedPlayerName;
        this.badgeColor = '#f4a261';

        // Thần thú đồng hành (Companion Pet)
        this.companionPet = new CompanionPet(this);
    }

    triggerAction(duration = 0.6) {
        this.actionTimer = duration;
        if (this.companionPet) {
            this.companionPet.triggerHeart();
        }
    }

    update(keys, joystickVector, dt, collisionBoxes, mapW, mapH) {
        let dx = 0;
        let dy = 0;

        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

        if (joystickVector && joystickVector.distance > 0.1) {
            dx = joystickVector.x;
            dy = joystickVector.y;
        }

        // Cập nhật chớp mắt
        this.blinkTimer += dt;
        if (this.blinkTimer > 3.5) this.blinkTimer = 0;

        // Cập nhật timer vỗ cánh theo thời gian thực (1s thực = 1s, nhịp nhàng êm đềm không bị nhân gia tốc)
        this.wingRealTimer = (this.wingRealTimer || 0) + dt;

        // Cập nhật action timer
        if (this.actionTimer > 0) {
            this.actionTimer -= dt;
        }

        // Cập nhật Thần thú đồng hành đi theo
        if (this.companionPet) {
            this.companionPet.update(dt);
        }

        const len = Math.hypot(dx, dy);
        if (len > 0.05) {
            this.isMoving = true;
            const normX = dx / len;
            const normY = dy / len;

            if (Math.abs(normX) > Math.abs(normY)) {
                this.direction = normX > 0 ? 'right' : 'left';
            } else {
                this.direction = normY > 0 ? 'down' : 'up';
            }

            const currentOutfitId = window.useGameStore.state.progression.trang_phuc_hien_tai;
            const outfit = window.OUTFITS_DATA[currentOutfitId] || window.OUTFITS_DATA.dong_phuc_tnu;
            const totalSpeed = (this.baseSpeed + (outfit.speedBonus || 0)) * dt * 60;

            const newX = this.x + normX * totalSpeed;
            const newY = this.y + normY * totalSpeed;

            if (!this.checkCollision(newX, this.y, collisionBoxes, mapW, mapH)) this.x = newX;
            if (!this.checkCollision(this.x, newY, collisionBoxes, mapW, mapH)) this.y = newY;

            // Đổi frame bước đi: nhịp bước êm ái, thanh thoát hơn (~190ms/frame)
            this.animTimer += dt * 5.2;
            this.animFrame = (Math.floor(this.animTimer) % 2) + 1; // Luân phiên frame 1 và 2
            this.flapTimer += dt * 10.0;

            this.stepSoundTimer += dt;
            if (this.stepSoundTimer > 0.38) {
                this.stepSoundTimer = 0;
                if (window.soundSystem) window.soundSystem.playStep();
            }
        } else {
            this.isMoving = false;
            this.animTimer += dt * 2.0;
            // Nếu có action thì chuyển sang frame 3, ngược lại đứng yên frame 0
            this.animFrame = this.actionTimer > 0 ? 3 : 0;
            this.flapTimer += dt * 3.5;
        }

        const currentWing = window.useGameStore.state.progression.canh_hien_tai;
        if (currentWing && window.gameInstance && window.gameInstance.particleSystem) {
            window.gameInstance.particleSystem.spawnWingSparkle(this.x, this.y + 10, currentWing);
        }
    }

    getBounds(x = this.x, y = this.y) {
        return {
            x: x - 10,
            y: y + this.height / 2 - 12,
            width: 20,
            height: 12
        };
    }

    checkCollision(targetX, targetY, boxes, mapW, mapH) {
        const bounds = this.getBounds(targetX, targetY);
        if (bounds.x < 15 || bounds.x + bounds.width > mapW - 15) return true;
        if (bounds.y < 25 || bounds.y + bounds.height > mapH - 15) return true;

        for (const box of boxes) {
            if (bounds.x < box.x + box.width &&
                bounds.x + bounds.width > box.x &&
                bounds.y < box.y + box.height &&
                bounds.y + bounds.height > box.y) {
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // VẼ NHÂN VẬT THICK-OUTLINE CHIBI CHUẨN 100% THEO ẢNH SPRITESHEET
    // ==========================================
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const stateProg = window.useGameStore.state.progression;
        const currentWing = stateProg.canh_hien_tai;
        const currentOutfitId = stateProg.trang_phuc_hien_tai || 'outfit_1000';
        const outfit = window.OUTFITS_DATA[currentOutfitId] || window.OUTFITS_DATA.outfit_1000 || window.OUTFITS_DATA.dong_phuc_tnu;
        const hairStyle = stateProg.kieu_toc_hien_tai || 0;
        const hairColor = stateProg.mau_toc_hien_tai || '#4a2810';
        const skinTone = stateProg.tone_da_hien_tai || '#ffe5d9';

        // 1. Lật hướng theo chiều nhìn: left: scaleX = -1, right: scaleX = 1
        const isFacingLeft = this.direction === 'left';
        if (isFacingLeft) {
            ctx.scale(-1, 1);
        }

        // Độ nhún thân nảy (Bobbing) & cử động chân
        const isAction = this.animFrame === 3;
        const bob = this.isMoving ? Math.sin(this.animTimer * Math.PI) * 2.5 : Math.sin(this.flapTimer * 0.6) * 1.5;
        const legSwing = this.isMoving ? (this.animFrame === 1 ? 5.5 : -5.5) : 0;
        const armSwing = this.isMoving ? (this.animFrame === 1 ? -4.5 : 4.5) : 0;

        // 2. Bóng đổ Chibi dưới chân
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, this.height / 2 - 2, 17, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. VẼ CÁNH BAY NẰM SAU LƯNG (Khi hướng Down, Left, Right)
        if (currentWing && this.direction !== 'up') {
            this.drawWings(ctx, currentWing, bob);
        }

        // Thiết lập chuẩn Thick-outline cho Chibi
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const isFacingSide = this.direction === 'left' || this.direction === 'right';
        const isFacingUp = this.direction === 'up';
        const headY = -38 + bob;
        const isFrameBody = window.bodySQLDB && window.bodySQLDB.isFrameBody(currentOutfitId);

        // 4 - 8. VẼ TRANG PHỤC HOÀN CHỈNH (THÂN, ĐẦU, CỔ ÁO ĐỒNG BỘ 100% CHUẨN ANIME 4 HƯỚNG)
        if (isFrameBody) {
            window.bodySQLDB.drawFullOutfitOnPlayer(ctx, currentOutfitId, this.direction, this.isMoving, this.animTimer, bob, isAction);
        } else {
            // 5. TAY XA (Back Arm) KHI NHÌN NGHIÊNG (Nằm sau thân người)
            if (isFacingSide) {
                this.drawSideBackArm(ctx, outfit, bob, armSwing, isAction);
            }

            // 6. HAI CHÂN CHIBI
            this.drawLegsAndShoes(ctx, outfit, isFacingSide, legSwing, bob);

            // 7. THÂN & BỘ TRANG PHỤC THICK-OUTLINE
            this.drawOutfitBody(ctx, outfit, currentOutfitId, bob, armSwing, isAction, this.direction);

            // 8. TAY GẦN (Front Arm) KHI NHÌN NGHIÊNG
            if (isFacingSide) {
                this.drawSideFrontArm(ctx, outfit, bob, armSwing, isAction);
            }

            // Fallback đầu chibi procedural
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(0, headY, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // KHUÔN MẶT CHIBI
            if (this.direction !== 'up') {
                ctx.fillStyle = 'rgba(255, 120, 140, 0.45)';
                ctx.beginPath();
                ctx.arc(-9, headY + 5, 3.5, 0, Math.PI * 2);
                ctx.arc(9, headY + 5, 3.5, 0, Math.PI * 2);
                ctx.fill();

                const isBlinking = this.blinkTimer > 3.3;

                if (isBlinking || isAction) {
                    ctx.strokeStyle = '#1a1a1a';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.arc(-5, headY + 1, 3.5, 1.1 * Math.PI, 1.9 * Math.PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(5, headY + 1, 3.5, 1.1 * Math.PI, 1.9 * Math.PI);
                    ctx.stroke();
                    ctx.lineWidth = 2.6;
                } else {
                    ctx.fillStyle = '#111111';
                    ctx.beginPath();
                    ctx.arc(-5, headY + 1, 3.8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(-6.2, headY - 0.5, 1.6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(-4, headY + 2.2, 0.9, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#111111';
                    ctx.beginPath();
                    ctx.arc(5, headY + 1, 3.8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(3.8, headY - 0.5, 1.6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(6, headY + 2.2, 0.9, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.strokeStyle = '#4a2810';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(0, headY + 6, 2.5, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                ctx.lineWidth = 2.6;
            }

            this.drawHairStyle(ctx, hairStyle, hairColor, headY);
        }

        // 9. VẼ CÁNH BAY (Khi hướng Up)
        if (currentWing && this.direction === 'up') {
            this.drawWings(ctx, currentWing, bob);
        }

        // 10. HIỆU ỨNG ÁNH SAO HÀNH ĐỘNG (ACTION FRAME 3 SPARKLES NHƯ TRONG ẢNH)
        if (isAction) {
            this.drawActionSparkles(ctx, headY);
        }

        // 11. BẢNG TÊN DẠNG PILL OVERHEAD (Giữ nguyên không bị lật gương khi quay trái)
        ctx.save();
        if (isFacingLeft) {
            ctx.scale(-1, 1);
        }
        ctx.fillStyle = this.badgeColor;
        ctx.font = 'bold 11px sans-serif';
        const displayName = '🧑‍🎓 ' + (this.name || 'Sinh Viên TNU');
        const textWidth = ctx.measureText(displayName).width;
        const pillWidth = Math.max(120, textWidth + 24);

        ctx.beginPath();
        ctx.roundRect(-pillWidth / 2, -98 + bob, pillWidth, 22, 11);
        ctx.fill();
        ctx.strokeStyle = '#e76f51';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(displayName, 0, -83 + bob);
        ctx.restore();

        ctx.restore();
    }

    // ==========================================
    // CÁC HÀM VẼ TAY & CHÂN CHIBI TÁCH LỚP THEO HƯỚNG NHÌN
    // ==========================================

    // TAY XA (BACK ARM) KHI NHÌN NGHIÊNG (Nằm sau thân người)
    drawSideBackArm(ctx, outfit, bob, armSwing, isAction) {
        ctx.save();
        ctx.fillStyle = outfit.shirtColor || '#ffffff';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isAction) {
            ctx.translate(-6, -2 + bob);
            ctx.rotate(-0.85);
            ctx.fillRect(-2.5, -8, 5, 11);
            ctx.strokeRect(-2.5, -8, 5, 11);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, -9, 3.2, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        } else {
            // Tay xa đung đưa ngược pha với tay trước
            const backSwing = this.isMoving ? -armSwing * 0.12 : 0.08;
            ctx.translate(-4, -4 + bob);
            ctx.rotate(backSwing);
            ctx.fillRect(-2.5, 0, 5, 11);
            ctx.strokeRect(-2.5, 0, 5, 11);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, 11, 2.8, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }
        ctx.restore();
    }

    // TAY GẦN (FRONT ARM) KHI NHÌN NGHIÊNG (Nằm trước thân người vung tự nhiên)
    drawSideFrontArm(ctx, outfit, bob, armSwing, isAction) {
        ctx.save();
        ctx.fillStyle = outfit.shirtColor || '#ffffff';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isAction) {
            ctx.translate(4, -2 + bob);
            ctx.rotate(0.85);
            ctx.fillRect(-2.5, -8, 5, 11);
            ctx.strokeRect(-2.5, -8, 5, 11);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, -9, 3.2, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        } else {
            // Tay gần vung sải theo bước chân
            const frontSwing = this.isMoving ? armSwing * 0.14 : -0.06;
            ctx.translate(2, -3 + bob);
            ctx.rotate(frontSwing);
            ctx.fillRect(-2.5, 0, 5, 11);
            ctx.strokeRect(-2.5, 0, 5, 11);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, 11, 2.8, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }
        ctx.restore();
    }

    // VẼ CHÂN VÀ GIÀY CHIBI CHUYỂN ĐỘNG THEO HƯỚNG NHÌN
    drawLegsAndShoes(ctx, outfit, isFacingSide, legSwing, bob) {
        ctx.fillStyle = outfit.pantsColor || '#1d3557';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isFacingSide) {
            // Sải bước nhìn nghiêng: chân trước và chân sau bước theo trục X
            const stride = this.isMoving ? (this.animFrame === 1 ? 5 : (this.animFrame === 2 ? -5 : 0)) : 1.5;
            const lift = this.isMoving ? (this.animFrame === 1 ? 2.5 : (this.animFrame === 2 ? 1 : 0)) : 0;
            const legBaseY = this.height / 2 - 14;

            // Chân sau
            ctx.fillRect(-stride - 4, legBaseY + lift * 0.3, 5.5, 10);
            ctx.strokeRect(-stride - 4, legBaseY + lift * 0.3, 5.5, 10);
            ctx.fillStyle = outfit.secondaryColor || '#ffffff';
            ctx.fillRect(-stride - 5, legBaseY + lift * 0.3 + 7, 7.5, 5);
            ctx.strokeRect(-stride - 5, legBaseY + lift * 0.3 + 7, 7.5, 5);

            // Chân trước
            ctx.fillStyle = outfit.pantsColor || '#1d3557';
            ctx.fillRect(stride - 1, legBaseY - lift, 5.5, 10);
            ctx.strokeRect(stride - 1, legBaseY - lift, 5.5, 10);
            ctx.fillStyle = outfit.secondaryColor || '#ffffff';
            ctx.fillRect(stride - 2, legBaseY - lift + 7, 8, 5);
            ctx.strokeRect(stride - 2, legBaseY - lift + 7, 8, 5);
        } else {
            // Đi thẳng hoặc nhìn sau: nhún so le chân trái / chân phải
            const legLeftY = this.height / 2 - 14 + (this.animFrame === 1 ? -legSwing : legSwing);
            const legRightY = this.height / 2 - 14 + (this.animFrame === 2 ? -legSwing : legSwing);

            // Chân trái & giày
            ctx.fillRect(-7, legLeftY, 5.5, 11);
            ctx.strokeRect(-7, legLeftY, 5.5, 11);
            ctx.fillStyle = outfit.secondaryColor || '#ffffff';
            ctx.fillRect(-8, legLeftY + 8, 7, 5);
            ctx.strokeRect(-8, legLeftY + 8, 7, 5);

            // Chân phải & giày
            ctx.fillStyle = outfit.pantsColor || '#1d3557';
            ctx.fillRect(2, legRightY, 5.5, 11);
            ctx.strokeRect(2, legRightY, 5.5, 11);
            ctx.fillStyle = outfit.secondaryColor || '#ffffff';
            ctx.fillRect(1, legRightY + 8, 7, 5);
            ctx.strokeRect(1, legRightY + 8, 7, 5);
        }
    }

    // HAI TAY ÁO & BÀN TAY CHIBI (Vung hai bên khi nhìn thẳng hoặc nhìn sau)
    drawFrontBackArms(ctx, outfit, bob, armSwing, isAction) {
        if (isAction) {
            // Frame 3 (Action): Hai tay vung cao chào đón
            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.save();
            ctx.translate(-12, -2 + bob);
            ctx.rotate(-0.8);
            ctx.fillRect(-3, -8, 6, 12);
            ctx.strokeRect(-3, -8, 6, 12);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, -9, 3.5, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.save();
            ctx.translate(12, -2 + bob);
            ctx.rotate(0.8);
            ctx.fillRect(-3, -8, 6, 12);
            ctx.strokeRect(-3, -8, 6, 12);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, -9, 3.5, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();
        } else {
            // Frame 0-2: Hai tay buông vung nhịp nhàng
            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.save();
            ctx.translate(-12, -4 + bob);
            ctx.rotate(armSwing * 0.08);
            ctx.fillRect(-2.5, 0, 5, 12);
            ctx.strokeRect(-2.5, 0, 5, 12);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, 12, 3, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.save();
            ctx.translate(12, -4 + bob);
            ctx.rotate(-armSwing * 0.08);
            ctx.fillRect(-2.5, 0, 5, 12);
            ctx.strokeRect(-2.5, 0, 5, 12);
            ctx.fillStyle = '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, 12, 3, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();
        }
    }

    // VẼ CHI TIẾT CÁC BỘ TRANG PHỤC THICK-OUTLINE THEO HƯỚNG NHÌN
    drawOutfitBody(ctx, outfit, outfitId, bob, armSwing, isAction, direction = 'down') {
        ctx.save();
        const isFacingSide = direction === 'left' || direction === 'right';
        const isFacingUp = direction === 'up';

        if (isFacingSide) {
            // ==========================================
            // THÂN NGHIÊNG CHIBI (PROFILE VIEW 16px) KHI ĐI TRÁI / PHẢI
            // ==========================================
            const lean = this.isMoving ? 0.05 : 0;
            if (lean !== 0) ctx.rotate(lean);

            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-8, -8 + bob, 16, 22, [4, 6, 2, 3]);
            ctx.fill();
            ctx.stroke();

            // HOA VĂN THÂN ÁO THEO TỪNG BỘ KHI NHÌN NGHIÊNG
            if (outfitId === 'tho_cam_e_de') {
                // Viền thổ cẩm đỏ + vàng dệt ngang sườn áo
                ctx.fillStyle = '#ffb703';
                ctx.fillRect(-7, 1 + bob, 14, 4);
                ctx.fillStyle = '#d90429';
                for (let i = -6; i < 7; i += 4) {
                    ctx.fillRect(i, 2 + bob, 2, 2);
                }
                ctx.fillRect(-7, 11 + bob, 14, 3);
            }
            else if (outfitId === 'the_duc_tnu') {
                // Áo thể thao TNU: sọc đôi trắng chạy dọc sống lưng & sườn áo
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-1, 0 + bob, 3, 14);
                // Vát vai trắng
                ctx.beginPath();
                ctx.moveTo(-8, -8 + bob);
                ctx.lineTo(8, -8 + bob);
                ctx.lineTo(8, -2 + bob);
                ctx.lineTo(-8, -2 + bob);
                ctx.closePath();
                ctx.fill();
            }
            else if (outfitId === 'dong_phuc_tnu') {
                // Cổ polo navy nhìn nghiêng
                ctx.fillStyle = '#1d3557';
                ctx.beginPath();
                ctx.moveTo(-5, -8 + bob);
                ctx.lineTo(6, -8 + bob);
                ctx.lineTo(2, -2 + bob);
                ctx.closePath();
                ctx.fill();
            }
            else if (outfitId === 'ao_blouse') {
                // Áo Blouse Y Dược TNU nhìn nghiêng + dây tai nghe + túi chữ thập đỏ
                ctx.strokeStyle = '#4a5568';
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(-2, -5 + bob);
                ctx.lineTo(3, 2 + bob);
                ctx.stroke();
                // Túi áo chữ thập đỏ
                ctx.fillStyle = '#e63946';
                ctx.fillRect(2, 2 + bob, 4, 1.2);
                ctx.fillRect(3.4, 0.6 + bob, 1.2, 4);
            }
            else if (outfitId === 'ao_tot_nghiep') {
                // Áo cử nhân đen dải nơ đỏ nhìn nghiêng
                ctx.fillStyle = '#e63946';
                ctx.fillRect(0, -8 + bob, 4, 21);
            }

            // Trong side view, hai tay được vẽ tách lớp: Tay xa ở Layer 5, Tay gần ở Layer 8
            ctx.restore();
            return;
        }

        // ==========================================
        // THÂN CHIBI KHI NHÌN ĐẰNG SAU (DIRECTION === 'UP')
        // ==========================================
        if (isFacingUp) {
            ctx.fillStyle = outfit.shirtColor || '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-11, -8 + bob, 22, 22, [5, 5, 2, 2]);
            ctx.fill();
            ctx.stroke();

            // Đường may sống lưng áo
            ctx.strokeStyle = outfit.shirtColor === '#ffffff' ? '#e2e8f0' : 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, -8 + bob);
            ctx.lineTo(0, 14 + bob);
            ctx.stroke();

            if (outfitId === 'tho_cam_e_de') {
                // Gấu áo đỏ
                ctx.fillStyle = '#d90429';
                ctx.fillRect(-10, 11 + bob, 20, 3);
            } else if (outfitId === 'the_duc_tnu') {
                // Mảng vai trắng sau lưng
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-11, -8 + bob, 22, 7);
            }

            // Hai tay buông vung sau lưng
            this.drawFrontBackArms(ctx, outfit, bob, armSwing, isAction);
            ctx.restore();
            return;
        }

        // ==========================================
        // THÂN CHIBI KHI NHÌN THẲNG (DIRECTION === 'DOWN')
        // ==========================================
        ctx.fillStyle = outfit.shirtColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-11, -8 + bob, 22, 22, [5, 5, 2, 2]);
        ctx.fill();
        ctx.stroke();

        // HOA VĂN CHI TIẾT THEO TỪNG BỘ TRANG PHỤC NHÌN THẲNG
        if (outfitId === 'tho_cam_e_de') {
            // Trang phục thổ cẩm Ê Đê: Nền đen/chàm viền đỏ vàng
            // Nẹp cổ V đỏ
            ctx.fillStyle = '#d90429';
            ctx.beginPath();
            ctx.moveTo(-6, -8 + bob);
            ctx.lineTo(0, -1 + bob);
            ctx.lineTo(6, -8 + bob);
            ctx.closePath();
            ctx.fill();

            // Dải hoa văn thổ cẩm Tây Nguyên ngang ngực
            ctx.fillStyle = '#ffb703';
            ctx.fillRect(-10, 1 + bob, 20, 4);
            // Các chấm chỉ đỏ thêu tay
            ctx.fillStyle = '#d90429';
            for (let i = -8; i < 9; i += 4) {
                ctx.fillRect(i, 2 + bob, 2, 2);
            }

            // Gấu áo viền vàng đỏ
            ctx.fillStyle = '#d90429';
            ctx.fillRect(-10, 11 + bob, 20, 3);
        } 
        else if (outfitId === 'the_duc_tnu') {
            // Đồ thể dục TNU: Áo xanh coban phối vai trắng & 2 sọc trắng
            // Mảng vai ngực màu trắng
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-11, -8 + bob);
            ctx.lineTo(11, -8 + bob);
            ctx.lineTo(11, -1 + bob);
            ctx.lineTo(-11, -1 + bob);
            ctx.closePath();
            ctx.fill();

            // Logo sọc thể thao vàng nhạt ngực trái
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(-7, 2 + bob, 4, 3);

            // Sọc trắng thể thao chạy dọc sườn áo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-10, 3 + bob, 2, 10);
            ctx.fillRect(8, 3 + bob, 2, 10);
        }
        else if (outfitId === 'dong_phuc_tnu') {
            // Áo polo sinh viên TNU cổ xanh navy
            ctx.fillStyle = '#1d3557';
            ctx.beginPath();
            ctx.moveTo(-7, -8 + bob);
            ctx.lineTo(0, -2 + bob);
            ctx.lineTo(7, -8 + bob);
            ctx.fill();
            // Logo trường TNU
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.arc(-5, 2 + bob, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        else if (outfitId === 'ao_blouse') {
            // Áo Blouse trắng Y Dược TNU + ống nghe stethoscope
            ctx.strokeStyle = '#4a5568';
            ctx.lineWidth = 1.6;
            // Dây ống nghe stethoscope vòng qua cổ
            ctx.beginPath();
            ctx.arc(0, -4 + bob, 5, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(0, 3 + bob, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Túi áo có huy hiệu chữ thập đỏ
            ctx.fillStyle = '#e63946';
            ctx.fillRect(4, 3 + bob, 4, 1.2);
            ctx.fillRect(5.4, 1.6 + bob, 1.2, 4);
        }
        else if (outfitId === 'ao_tot_nghiep') {
            // Áo thụng cử nhân đen + dải ruy băng đỏ
            ctx.fillStyle = '#e63946';
            ctx.fillRect(-3, -8 + bob, 6, 21);
            // Nơ cổ danh dự
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(0, -4 + bob, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // HAI TAY ÁO & BÀN TAY CHIBI (Vung hai bên khi nhìn thẳng)
        this.drawFrontBackArms(ctx, outfit, bob, armSwing, isAction);
        ctx.restore();
    }

    // VẼ CÁC KIỂU TÓC CHIBI ANIME & BÓNG TÓC HIGHLIGHT
    drawHairStyle(ctx, hairStyle, hairColor, headY) {
        ctx.save();
        ctx.fillStyle = hairColor;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.4;

        switch (hairStyle) {
            case 0:
            default:
                // Kiểu 1: Tóc mái ngố anime Chibi vuốt bồng bềnh
                ctx.beginPath();
                ctx.arc(0, headY - 2, 17, Math.PI * 0.85, Math.PI * 2.15);
                ctx.lineTo(16, headY);
                ctx.lineTo(8, headY + 3);
                ctx.lineTo(0, headY - 1);
                ctx.lineTo(-8, headY + 3);
                ctx.lineTo(-16, headY);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;

            case 1:
                // Kiểu 2: Tóc dài nữ sinh ngang vai
                ctx.beginPath();
                ctx.arc(0, headY - 2, 17, Math.PI * 0.85, Math.PI * 2.15);
                ctx.lineTo(17, headY + 12);
                ctx.lineTo(12, headY + 12);
                ctx.lineTo(10, headY + 4);
                ctx.lineTo(-10, headY + 4);
                ctx.lineTo(-12, headY + 12);
                ctx.lineTo(-17, headY + 12);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;

            case 2:
                // Kiểu 3: Tóc buộc nơ Chibi dễ thương
                ctx.beginPath();
                ctx.arc(0, headY - 2, 17, Math.PI * 0.85, Math.PI * 2.15);
                ctx.fill(); ctx.stroke();
                // Nơ đỏ xinh xắn
                ctx.fillStyle = '#ff4d6d';
                ctx.beginPath();
                ctx.arc(12, headY - 12, 5, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                break;

            case 3:
                // Kiểu 4: Tóc xù xoăn bồng bềnh Chibi
                ctx.beginPath();
                ctx.arc(-10, headY - 10, 8, 0, Math.PI * 2);
                ctx.arc(0, headY - 14, 9, 0, Math.PI * 2);
                ctx.arc(10, headY - 10, 8, 0, Math.PI * 2);
                ctx.arc(-14, headY - 2, 7, 0, Math.PI * 2);
                ctx.arc(14, headY - 2, 7, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                break;

            case 4:
                // Kiểu 5: Tóc bím hai bên Chibi
                ctx.beginPath();
                ctx.arc(0, headY - 2, 17, Math.PI * 0.9, Math.PI * 2.1);
                ctx.fill(); ctx.stroke();
                // Hai bím tóc
                ctx.beginPath();
                ctx.arc(-17, headY + 8, 5, 0, Math.PI * 2);
                ctx.arc(17, headY + 8, 5, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
                break;

            case 5:
                // Kiểu 6: Mũ Cử nhân tốt nghiệp TNU
                ctx.fillStyle = '#1b1b1b';
                ctx.beginPath();
                ctx.moveTo(0, headY - 24);
                ctx.lineTo(18, headY - 15);
                ctx.lineTo(0, headY - 6);
                ctx.lineTo(-18, headY - 15);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Quả tua vàng rủ xuống
                ctx.strokeStyle = '#ffd166';
                ctx.lineWidth = 2.0;
                ctx.beginPath();
                ctx.moveTo(0, headY - 15);
                ctx.lineTo(12, headY - 4);
                ctx.stroke();
                break;

            case 6:
                // Kiểu 7: Nón lá truyền thống Tây Nguyên
                ctx.fillStyle = '#e9c46a';
                ctx.beginPath();
                ctx.moveTo(0, headY - 24);
                ctx.lineTo(-18, headY - 10);
                ctx.lineTo(18, headY - 10);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#c59b27';
                ctx.stroke();
                break;
        }

        // VỆT BÓNG TÓC HIGHLIGHT HÌNH VÒNG CUNG
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, headY - 6, 12, 1.2 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    // HIỆU ỨNG NGÔI SAO LẤP LÁNH KHI HÀNH ĐỘNG (ACTION FRAME)
    drawActionSparkles(ctx, headY) {
        ctx.save();
        const sparkles = [
            { x: -18, y: headY - 10, color: '#ffd166', size: 5 },
            { x: 18, y: headY - 12, color: '#ff70a6', size: 6 },
            { x: -22, y: headY + 4, color: '#4cc9f0', size: 4 },
            { x: 22, y: headY + 6, color: '#06d6a0', size: 5 }
        ];

        sparkles.forEach(s => {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - s.size);
            ctx.quadraticCurveTo(s.x, s.y, s.x + s.size, s.y);
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + s.size);
            ctx.quadraticCurveTo(s.x, s.y, s.x - s.size, s.y);
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - s.size);
            ctx.fill();
        });
        ctx.restore();
    }

    // VẼ ĐÔI CÁNH (HỖ TRỢ CẢ FRAME SPRITESHEET TỪ ẢNH & PROCEDURAL PIVOT)
    drawWings(ctx, wingId, bob) {
        // 1. Kiểm tra nếu là cánh Frame từ database ảnh (Cyber Hex 14 Frames / Pink Angel 3 Frames)
        // Chạy chính xác theo wingRealTimer (chuẩn thời gian thực) để toàn bộ frame hiển thị mượt mà, đầy đủ, không skip frame
        if (WingsRenderer.drawWingsOnCharacter(ctx, wingId, this.wingRealTimer || 0, bob, this.isMoving)) {
            return;
        }

        // 2. Fallback cho các cánh procedural xoay quanh pivot
        const amplitude = this.isMoving ? 0.52 : 0.24;
        const flapAngle = Math.sin(this.flapTimer) * amplitude;

        ctx.save();
        ctx.translate(-7, -20 + bob);
        WingsRenderer.drawWing(ctx, wingId, 'left', flapAngle);
        ctx.restore();

        ctx.save();
        ctx.translate(7, -20 + bob);
        WingsRenderer.drawWing(ctx, wingId, 'right', flapAngle);
        ctx.restore();
    }
}

// ==========================================
// CÁC NPC KHUÔN VIÊN & THẦY CÔ CNTT
// ==========================================
class CampusNPC {
    constructor(id, name, badgeColor, x, y, speech = null, patrolPath = null, role = null, skinId = null) {
        this.id = id;
        this.name = name;
        this.badgeColor = badgeColor || '#3d2b1f';
        this.x = x;
        this.y = y;
        this.speeches = Array.isArray(speech) ? speech : (speech ? [speech] : []);
        this.speech = this.speeches.length > 0 ? this.speeches[0] : null;
        this.speechTimer = 0;
        this.speechIndex = 0;
        this.patrolPath = patrolPath;
        this.patrolIndex = 0;
        this.patrolTimer = 0;
        this.animTimer = Math.random() * Math.PI * 2;
        this.role = role || (id === 'sv_k45' || id.includes('k45') ? 'quest_k45' : (id.includes('chef') ? 'chef' : 'student'));
        this.avatar = (this.role === 'chef' || id.includes('chef')) ? '👩‍🍳' : '🧑‍🏫';
        this.nameKey = 'npc_' + id + '_name';
        this.titleKey = 'npc_' + id + '_title';
        this.skinId = skinId || null;
        this.direction = 'down';
        this.isMoving = false;
        this.walkFrame = 0;
        this.speed = 1.6; // Vận tốc bước đi tự nhiên ~1.6px/tick (~96px/s)
        this.waitTime = 1.8; // Thời gian dừng ngắm cảnh tại mỗi điểm mốc (giây)
    }

    update(dt, player = null) {
        this.animTimer += dt * 3;

        // 1. Luân chuyển lời thoại bong bóng khi dạo khuôn viên
        if (this.speeches.length > 1) {
            this.speechTimer += dt;
            if (this.speechTimer > 6.0) {
                this.speechTimer = 0;
                this.speechIndex = (this.speechIndex + 1) % this.speeches.length;
                this.speech = this.speeches[this.speechIndex];
            }
        }

        // 2. Tương tác khi người chơi đến gần: dừng chân, quay mặt về phía sinh viên
        const p = player || window.gameInstance?.player;
        if (p) {
            const pdx = p.x - this.x;
            const pdy = p.y - this.y;
            const pdist = Math.hypot(pdx, pdy);
            if (pdist < 65) {
                this.isMoving = false;
                this.walkFrame = 0;
                // Quay mặt hướng về phía người chơi
                if (Math.abs(pdx) > Math.abs(pdy)) {
                    this.direction = pdx > 0 ? 'right' : 'left';
                } else {
                    this.direction = pdy > 0 ? 'down' : 'up';
                }
                return; // Tạm dừng di chuyển để trò chuyện
            }
        }

        // 3. Di chuyển dạo quanh toàn trường theo lộ trình tuần tra (patrolPath)
        if (this.patrolPath && this.patrolPath.length > 1) {
            const target = this.patrolPath[this.patrolIndex];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 5) {
                this.isMoving = true;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed * dt * 60;
                this.y += Math.sin(angle) * this.speed * dt * 60;

                // Cập nhật hướng mặt theo hướng di chuyển
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.direction = dx > 0 ? 'right' : 'left';
                } else {
                    this.direction = dy > 0 ? 'down' : 'up';
                }
                this.walkFrame = Math.floor(this.animTimer * 2.5) % 4;
            } else {
                this.isMoving = false;
                this.walkFrame = 0;
                this.patrolTimer += dt;
                if (this.patrolTimer > this.waitTime) {
                    this.patrolTimer = 0;
                    this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
                }
            }
        } else {
            this.isMoving = false;
            this.walkFrame = 0;
        }
    }

    draw(ctx, playerDist) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const bob = this.isMoving ? Math.sin(this.animTimer * 4) * 1.5 : Math.sin(this.animTimer) * 0.8;

        // 1. Bóng đổ chân thực dưới chân
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vẽ Sprite Hoạt Ảnh từ NPC_DB (nếu có skinId)
        let spriteRendered = false;
        if (this.skinId && window.NPC_DB) {
            const frameImg = window.NPC_DB.getFrame(this.skinId, this.direction, this.isMoving ? this.walkFrame : 0);
            if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
                // Tỉ lệ scale rõ nét, vừa vặn nổi bật trên khuôn viên (chiều cao tăng lên ~88px, to rõ hơn ~30%)
                const renderH = 88;
                const renderW = renderH * (frameImg.naturalWidth / frameImg.naturalHeight);
                ctx.drawImage(frameImg, -renderW / 2, -renderH + 13 + bob, renderW, renderH);
                spriteRendered = true;
            }
        }

        // Nếu chưa có skin hoặc ảnh chưa nạp xong, vẽ chibi vector fallback
        if (!spriteRendered) {
            ctx.save();
            ctx.scale(1.25, 1.25);
            // Gùi đeo trên lưng
            ctx.fillStyle = '#b07d4b';
            ctx.beginPath();
            ctx.roundRect(-9, -4 + bob, 18, 20, 3);
            ctx.fill();
            ctx.strokeStyle = '#7c532b';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Thân & Chân
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(-6, 12 + bob, 4, 10);
            ctx.fillRect(2, 12 + bob, 4, 10);
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(-10, -6 + bob, 20, 18);

            // Đầu đỏ tròn Chibi
            ctx.fillStyle = '#e63946';
            ctx.beginPath();
            ctx.arc(0, -16 + bob, 14, 0, Math.PI * 2);
            ctx.fill();

            // Kính mát hoặc mắt
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-9, -19 + bob, 7, 5);
            ctx.fillRect(2, -19 + bob, 7, 5);

            // Nón lá
            ctx.fillStyle = '#e9c46a';
            ctx.beginPath();
            ctx.moveTo(0, -34 + bob);
            ctx.lineTo(-18, -22 + bob);
            ctx.lineTo(18, -22 + bob);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#c59b27';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        // 3. BẢNG TÊN DẠNG PILL OVERHEAD CÓ VIỀN VÀNG KIM
        const displayName = (window.i18n && window.i18n.t(this.nameKey) !== this.nameKey) 
            ? window.i18n.t(this.nameKey) 
            : this.name;

        ctx.font = 'bold 11px sans-serif';
        const textWidth = ctx.measureText(displayName).width;
        const pillW = Math.max(textWidth + 24, 120);
        const pillH = 22;
        const pillY = -96 + bob;

        ctx.fillStyle = this.badgeColor;
        ctx.beginPath();
        ctx.roundRect(-pillW / 2, pillY, pillW, pillH, 11);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName, 0, pillY + pillH / 2);

        // 4. PHẢN HỒI TƯƠNG TÁC / LỜI THOẠI
        if (playerDist < 65) {
            // Khi người chơi đến gần: Nút tương tác [E] Kính chào
            const promptText = '[E] ' + (window.i18n && window.i18n.getLocale() === 'en' ? 'Talk' : 'Kính chào');
            window.drawWorldPromptBadge(ctx, 0, pillY - 18, promptText, {
                theme: 'blue',
                timer: this.animTimer,
                pointer: true
            });
        } else if (this.speech) {
            // Khi ở xa: Bong bóng thoại trắng
            const speechY = pillY - 32;
            ctx.font = 'bold 11px sans-serif';
            const spWidth = ctx.measureText(this.speech).width;
            const spW = Math.max(spWidth + 22, 90);

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-spW / 2, speechY, spW, 24, 8);
            ctx.fill();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Mũi nhọn bong bóng thoại
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-4, speechY + 24);
            ctx.lineTo(0, speechY + 30);
            ctx.lineTo(4, speechY + 24);
            ctx.fill();

            ctx.fillStyle = '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.speech, 0, speechY + 12);
        }

        ctx.restore();
    }
}

// BỤI HOA HỒNG TẠI VƯỜN HOA
class RoseBush {
    constructor(x, y, isRare = false) {
        this.x = x;
        this.y = y;
        this.isRare = isRare;
        this.state = 'ready';
        this.cooldown = 0;
        this.maxCooldown = 15;
        this.animTimer = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.animTimer += dt * 2;
        if (this.state === 'harvested') {
            this.cooldown -= dt;
            if (this.cooldown <= 0) this.state = 'ready';
        }
    }

    harvest() {
        if (this.state === 'ready') {
            this.state = 'harvested';
            this.cooldown = this.maxCooldown;
            return { success: true, isRare: this.isRare };
        }
        return { success: false };
    }

    draw(ctx, playerDist) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();

        if (this.state === 'ready') {
            const bloomBob = Math.sin(this.animTimer) * 2;
            
            // Vẽ đóa hoa từ tài nguyên sticker hình ảnh (Hỗ trợ Cloudflare R2)
            if (!RoseBush.imgRed) {
                RoseBush.imgRed = new Image();
                RoseBush.imgRed.src = (window.getR2Url ? window.getR2Url('assets/items/rose_red.png') : 'assets/items/rose_red.png');
                RoseBush.imgWhite = new Image();
                RoseBush.imgWhite.src = (window.getR2Url ? window.getR2Url('assets/items/rose_white.png') : 'assets/items/rose_white.png');
            }
            const flowerImg = this.isRare ? RoseBush.imgWhite : RoseBush.imgRed;
            if (flowerImg && flowerImg.complete && flowerImg.naturalWidth > 0) {
                const s = 34;
                ctx.drawImage(flowerImg, -s / 2, -s / 2 - 4 + bloomBob, s, s);
            } else {
                ctx.font = '24px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.isRare ? '💮' : '🌹', 0, -4 + bloomBob);
            }

            if (playerDist < 55) {
                const harvestText = '[E] ' + (window.i18n.getLocale() === 'vi' ? 'Hái Hoa' : 'Harvest');
                window.drawWorldPromptBadge(ctx, 0, -28 + bloomBob, harvestText, {
                    theme: this.isRare ? 'purple' : 'ruby',
                    timer: Date.now() / 1000,
                    pointer: true
                });
            }
        }
        ctx.restore();
    }
}

// TÀI LIỆU ĐỒ ÁN K45
class CampusDocument {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.isCollected = false;
        this.floatTimer = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.floatTimer += dt * 3.5;
    }

    draw(ctx, playerDist) {
        if (this.isCollected) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        const floatOffset = Math.sin(this.floatTimer) * 4;

        if (!CampusDocument.imgDoc) {
            CampusDocument.imgDoc = new Image();
            CampusDocument.imgDoc.src = (window.getR2Url ? window.getR2Url('assets/items/campus_document.png') : 'assets/items/campus_document.png');
        }
        const docImg = CampusDocument.imgDoc;
        if (docImg && docImg.complete && docImg.naturalWidth > 0) {
            const w = 32;
            const h = (docImg.naturalHeight / docImg.naturalWidth) * w;
            ctx.drawImage(docImg, -w / 2, -h / 2 + floatOffset, w, h);
        } else {
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('📜', 0, floatOffset);
        }

        if (playerDist < 60) {
            window.drawWorldPromptBadge(ctx, 0, -24 + floatOffset, '[E] Nhặt tài liệu', {
                theme: 'gold',
                timer: this.floatTimer,
                pointer: true
            });
        }
        ctx.restore();
    }
}

window.WingsRenderer = WingsRenderer;
window.CompanionPet = CompanionPet;
window.Player = Player;
window.CampusNPC = CampusNPC;
window.RoseBush = RoseBush;
window.CampusDocument = CampusDocument;
window.ParticleSystem = ParticleSystem;
