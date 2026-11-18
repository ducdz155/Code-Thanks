/**
 * MINIMAP SYSTEM - BẢN ĐỒ KHUÔN VIÊN ĐẠI HỌC TÂY NGUYÊN (TNU)
 * Tái hiện 100% phong cách giao diện MMORPG cổ điển theo ảnh tham chiếu:
 * - Khung viền sớ uốn lượn Ribbon Banner "Đại Học Tây Nguyên"
 * - La bàn hướng Bắc (B), huy hiệu "Khu an toàn", nút Thu/Phóng và nút Bản đồ lớn
 * - Hiển thị bản đồ toàn trường siêu nét từ assets/map1_campus.jpg
 * - Con trỏ giọt nước xanh lam (💧 Water-Drop Player Pin) chỉ hướng di chuyển
 * - Điểm đánh dấu các công trình trọng điểm & Thầy Cô Giảng viên
 * - Tương tác chạm bản đồ để điều hướng di chuyển (Click to Walk / Ping Target)
 * - CHỈ HIỂN THỊ KHI Ở MAP ĐẠI HỌC TÂY NGUYÊN (map1_tnu)
 */

class MinimapSystem {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.topButtons = null;

        // Ảnh bản đồ toàn trường (Hỗ trợ Cloudflare R2 + Fallback)
        const mapUrl = 'assets/map1_campus.jpg';
        const r2MapUrl = (window.getR2Url ? window.getR2Url(mapUrl) : mapUrl);
        this.mapImage = new Image();
        this.mapImageLoaded = false;
        this.mapImage.onload = () => {
            this.mapImageLoaded = true;
        };
        this.mapImage.onerror = () => {
            if (this.mapImage.src === r2MapUrl && r2MapUrl !== mapUrl) {
                this.mapImage.src = mapUrl;
            }
        };
        this.mapImage.src = r2MapUrl;
        if (this.mapImage.complete && this.mapImage.naturalWidth > 0) {
            this.mapImageLoaded = true;
        }

        // Kích thước thế giới Map 1
        this.worldW = 2560;
        this.worldH = 3432;

        // Kích thước hiển thị Minimap
        this.viewW = 220;
        this.viewH = 155;

        // Chế độ Zoom: 0 = Toàn cảnh (Full Overview), 1 = Khu vực (2x), 2 = Cận cảnh (3.5x)
        this.zoomLevel = 0;
        this.zoomScales = [0.086, 0.17, 0.32];

        // Hiệu ứng nhịp sóng (Pulse & Ping)
        this.pulseTime = 0;
        this.ping = null; // { wx, wy, radius, alpha }

        // Modal bản đồ lớn
        this.largeMapModal = null;
        this.largeCanvas = null;
        this.largeCtx = null;

        // Danh sách địa danh trọng điểm
        this.landmarks = [
            { id: 'wishing_tree', name: '✨ Cây Ước Nguyện 20/11', desc: 'Thư tri ân Quý Thầy Cô', x: 1620, y: 2880, color: '#ff0054' },
            { id: 'wishing_board', name: '📋 Bảng Ước Nguyện', desc: 'Lời chúc học sinh gửi Thầy Cô', x: 1530, y: 3040, color: '#f77f00' },
            { id: 'admin', name: '🏛️ Tòa Nhà Điều Hành', desc: 'Trung tâm hành chính TNU', x: 1725, y: 2510, color: '#f39c12' },
            { id: 'lake', name: '🏞️ Hồ Tự Do & Căn Tin Đảo', desc: 'Thắng cảnh & Cầu gỗ sinh thái', x: 440, y: 2430, color: '#00b4d8' },
            { id: 'stadium', name: '⚽ Sân Vận Động TNU', desc: 'Sân bóng cỏ & Đường chạy đỏ', x: 1775, y: 1075, color: '#2a9d8f' },
            { id: 'sports_hall', name: '🏟️ Nhà Thi Đấu Đa Năng', desc: 'Khu phức hợp thể thao', x: 2070, y: 1100, color: '#457b9d' },
            { id: 'house2', name: '🏢 Nhà Học Số 2', desc: 'Khoa Nông Lâm Nghiệp', x: 1725, y: 2320, color: '#e76f51' },
            { id: 'library', name: '📖 Thư Viện TNU', desc: 'Trung tâm học liệu & Tài liệu', x: 1160, y: 2400, color: '#9b5de5' },
            { id: 'hall400', name: '🏛️ Giảng Đường Trung Tâm', desc: 'Hội trường đỏ mái dốc', x: 970, y: 2650, color: '#d90429' },
            { id: 'house7', name: '🏫 Cụm Nhà Học Số 7-8-9', desc: 'Khu giảng đường phía Nam', x: 1100, y: 3040, color: '#f4a261' },
            { id: 'tennis', name: '🎾 Sân Quần Vợt & Bóng Rổ', desc: 'Khu thể thao ngoài trời', x: 1060, y: 1860, color: '#06d6a0' },
            { id: 'med', name: '⚕️ Khoa Y Dược TNU', desc: 'Khối ngành y sinh học', x: 2180, y: 2370, color: '#118ab2' },
            { id: 'dorm', name: '🛏️ Ký Túc Xá Đông Bắc', desc: 'Khu lưu xá sinh viên', x: 1640, y: 250, color: '#8338ec' },
            { id: 'portal_rose', name: '🌹 Điểm Dịch Chuyển Vườn Hoa Hồng', desc: 'Hái hoa hồng & làm quà', x: 2435, y: 2860, color: '#ff4d6d' },
            { id: 'portal_arcade', name: '🎡 Điểm Dịch Chuyển Khu Vui Chơi', desc: 'Khu hội chợ trò chơi giải trí', x: 2415, y: 3040, color: '#06d6a0' }
        ];
    }

    init() {
        this.container = document.getElementById('hud-minimap-container');
        this.canvas = document.getElementById('minimap-canvas');
        this.topButtons = document.getElementById('hud-top-buttons');
        this.largeMapModal = document.getElementById('modal-large-campus-map');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.viewW = this.canvas.width;
            this.viewH = this.canvas.height;

            // Bắt sự kiện click vào Minimap để điều hướng
            this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        }

        // Nút Thu nhỏ / Phóng to
        const btnZoomOut = document.getElementById('btn-minimap-zoom-out');
        const btnZoomIn = document.getElementById('btn-minimap-zoom-in');
        if (btnZoomOut) {
            btnZoomOut.onclick = (e) => {
                e.stopPropagation();
                this.changeZoom(-1);
            };
        }
        if (btnZoomIn) {
            btnZoomIn.onclick = (e) => {
                e.stopPropagation();
                this.changeZoom(1);
            };
        }

        // Nút mở Bản đồ lớn toàn trường
        const btnExpand = document.getElementById('btn-minimap-expand');
        if (btnExpand) {
            btnExpand.onclick = (e) => {
                e.stopPropagation();
                this.openLargeMap();
            };
        }

        // Nút đóng modal bản đồ lớn
        const btnCloseLarge = document.getElementById('btn-close-large-map');
        if (btnCloseLarge && this.largeMapModal) {
            btnCloseLarge.onclick = () => this.closeLargeMap();
        }

        // Bắt sự kiện click trên bản đồ lớn để dịch chuyển hoặc đặt mốc
        this.largeCanvas = document.getElementById('large-map-canvas');
        if (this.largeCanvas) {
            this.largeCanvas.addEventListener('click', (e) => this.handleLargeCanvasClick(e));
        }

        this.populateLandmarksList();
        this.updateVisibility();
    }

    changeZoom(delta) {
        this.zoomLevel = Math.max(0, Math.min(this.zoomScales.length - 1, this.zoomLevel + delta));
        const labels = ['Toàn trường', 'Khu vực', 'Cận cảnh'];
        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast(`🔍 Thu phóng bản đồ: ${labels[this.zoomLevel]}`, 'info');
        }
    }

    updateVisibility() {
        const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
        const isMap1 = currentMapId === 'map1_tnu';

        if (this.container) {
            this.container.style.display = isMap1 ? 'flex' : 'none';
        }
        if (this.topButtons) {
            if (isMap1) {
                this.topButtons.classList.add('pr-[255px]');
            } else {
                this.topButtons.classList.remove('pr-[255px]');
            }
        }
    }

    update(dt) {
        this.pulseTime += dt;
        this.updateVisibility();

        // Cập nhật hiệu ứng Ping khi người chơi bấm chọn vị trí
        if (this.ping) {
            this.ping.radius += dt * 38;
            this.ping.alpha -= dt * 1.2;
            if (this.ping.alpha <= 0) {
                this.ping = null;
            }
        }
    }

    /**
     * Chuyển đổi tọa độ World -> Tọa độ hiển thị trên Minimap Canvas
     */
    worldToMinimap(wx, wy, playerX, playerY) {
        const scale = this.zoomScales[this.zoomLevel];

        if (this.zoomLevel === 0) {
            // Chế độ Toàn trường: Vừa khít chiều ngang, trượt dọc theo người chơi
            const mapW = this.worldW * scale; // 220px
            const mapH = this.worldH * scale; // ~295px
            const maxScrollY = mapH - this.viewH; // ~140px
            const playerScaledY = playerY * scale;
            const scrollY = Math.max(0, Math.min(maxScrollY, playerScaledY - this.viewH / 2));

            const mx = wx * scale;
            const my = wy * scale - scrollY;
            return { x: mx, y: my, visible: mx >= 0 && mx <= this.viewW && my >= 0 && my <= this.viewH };
        } else {
            // Chế độ Phóng to: Căn giữa theo người chơi
            const srcW = this.viewW / scale;
            const srcH = this.viewH / scale;
            const srcX = Math.max(0, Math.min(this.worldW - srcW, playerX - srcW / 2));
            const srcY = Math.max(0, Math.min(this.worldH - srcH, playerY - srcH / 2));

            const mx = (wx - srcX) * scale;
            const my = (wy - srcY) * scale;
            return { x: mx, y: my, visible: mx >= -10 && mx <= this.viewW + 10 && my >= -10 && my <= this.viewH + 10 };
        }
    }

    /**
     * Chuyển đổi tọa độ Minimap Canvas -> Tọa độ World (khi click chuột)
     */
    minimapToWorld(mx, my, playerX, playerY) {
        const scale = this.zoomScales[this.zoomLevel];

        if (this.zoomLevel === 0) {
            const mapH = this.worldH * scale;
            const maxScrollY = mapH - this.viewH;
            const playerScaledY = playerY * scale;
            const scrollY = Math.max(0, Math.min(maxScrollY, playerScaledY - this.viewH / 2));

            const wx = mx / scale;
            const wy = (my + scrollY) / scale;
            return {
                x: Math.max(0, Math.min(this.worldW, wx)),
                y: Math.max(0, Math.min(this.worldH, wy))
            };
        } else {
            const srcW = this.viewW / scale;
            const srcH = this.viewH / scale;
            const srcX = Math.max(0, Math.min(this.worldW - srcW, playerX - srcW / 2));
            const srcY = Math.max(0, Math.min(this.worldH - srcH, playerY - srcH / 2));

            return {
                x: Math.max(0, Math.min(this.worldW, srcX + mx / scale)),
                y: Math.max(0, Math.min(this.worldH, srcY + my / scale))
            };
        }
    }

    handleCanvasClick(e) {
        if (!this.canvas || !window.gameInstance || !window.gameInstance.player) return;

        const rect = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvas.height / rect.height);

        const player = window.gameInstance.player;
        const target = this.minimapToWorld(mx, my, player.x, player.y);

        // Tạo hiệu ứng sóng Ping
        this.ping = {
            wx: target.x,
            wy: target.y,
            radius: 4,
            alpha: 1.0
        };

        // Đặt mục tiêu dẫn đường nhiệm vụ / di chuyển
        if (window.gameInstance.setQuestNav) {
            window.gameInstance.setQuestNav(target.x, target.y, 'Điểm đến trên bản đồ');
        } else {
            window.gameInstance.questNav = {
                active: true,
                targetX: target.x,
                targetY: target.y,
                name: 'Điểm đến trên bản đồ',
                timer: 35
            };
        }

        // Âm thanh phản hồi
        if (window.soundSystem && window.soundSystem.playSelect) {
            window.soundSystem.playSelect();
        }

        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast(`📍 Đã định vị điểm đến: (${Math.round(target.x)}, ${Math.round(target.y)})`, 'success');
        }
    }

    render(player, camera) {
        const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
        if (currentMapId !== 'map1_tnu' || !this.ctx || !player) return;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.viewW, this.viewH);

        const px = player.x;
        const py = player.y;
        const scale = this.zoomScales[this.zoomLevel];

        // 1. VẼ ẢNH BẢN ĐỒ TOÀN TRƯỜNG TỪ assets/map1_campus.jpg
        ctx.save();
        if (this.mapImageLoaded && this.mapImage.naturalWidth > 0) {
            if (this.zoomLevel === 0) {
                const mapW = this.worldW * scale; // 220px
                const mapH = this.worldH * scale; // ~295px
                const maxScrollY = mapH - this.viewH;
                const scrollY = Math.max(0, Math.min(maxScrollY, py * scale - this.viewH / 2));

                ctx.drawImage(this.mapImage, 0, 0, this.worldW, this.worldH, 0, -scrollY, mapW, mapH);
            } else {
                const srcW = this.viewW / scale;
                const srcH = this.viewH / scale;
                const srcX = Math.max(0, Math.min(this.worldW - srcW, px - srcW / 2));
                const srcY = Math.max(0, Math.min(this.worldH - srcH, py - srcH / 2));

                ctx.drawImage(this.mapImage, srcX, srcY, srcW, srcH, 0, 0, this.viewW, this.viewH);
            }
        } else {
            // Nền cỏ dự phòng
            ctx.fillStyle = '#8ec765';
            ctx.fillRect(0, 0, this.viewW, this.viewH);
        }
        ctx.restore();

        // 2. VẼ KHUNG NHÌN CAMERA HIỆN TẠI (VIEWPORT RECT)
        if (camera) {
            const camTL = this.worldToMinimap(camera.x, camera.y, px, py);
            const camBR = this.worldToMinimap(camera.x + camera.width, camera.y + camera.height, px, py);

            ctx.save();
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 2]);
            ctx.strokeRect(camTL.x, camTL.y, camBR.x - camTL.x, camBR.y - camTL.y);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(camTL.x, camTL.y, camBR.x - camTL.x, camBR.y - camTL.y);
            ctx.restore();
        }

        // 3. VẼ CÁC ĐIỂM CÔNG TRÌNH TRỌNG ĐIỂM (LANDMARK PINS)
        this.landmarks.forEach(lm => {
            const pos = this.worldToMinimap(lm.x, lm.y, px, py);
            if (!pos.visible) return;

            ctx.save();
            // Chấm công trình
            ctx.fillStyle = lm.color || '#e63946';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Ở chế độ phóng to, hiển thị tên ngắn gọn
            if (this.zoomLevel >= 1) {
                ctx.font = 'bold 8px sans-serif';
                ctx.fillStyle = '#3c2a1e';
                ctx.textAlign = 'center';
                const shortName = lm.name.replace(/^[^\w\s]+/, '').trim().split('(')[0].trim();
                ctx.fillText(shortName.slice(0, 14), pos.x, pos.y - 4);
            }
            ctx.restore();
        });

        // 4. VẼ VỊ TRÍ CÁC THẦY CÔ GIẢNG VIÊN & NPC (YELLOW PINS)
        if (window.gameInstance && window.gameInstance.mapEntities && window.gameInstance.mapEntities.map1_tnu) {
            const npcs = window.gameInstance.mapEntities.map1_tnu.npcs || [];
            npcs.forEach(npc => {
                const pos = this.worldToMinimap(npc.x, npc.y, px, py);
                if (!pos.visible) return;

                ctx.save();
                ctx.fillStyle = '#ffb703';
                ctx.strokeStyle = '#3c2a1e';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 2.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            });
        }

        // 5. VẼ HIỆU ỨNG SÓNG PING (KHI NGƯỜI CHƠI CHỌN VỊ TRÍ)
        if (this.ping) {
            const pingPos = this.worldToMinimap(this.ping.wx, this.ping.wy, px, py);
            if (pingPos.visible) {
                ctx.save();
                ctx.strokeStyle = `rgba(230, 57, 70, ${this.ping.alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(pingPos.x, pingPos.y, this.ping.radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = `rgba(230, 57, 70, ${this.ping.alpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(pingPos.x, pingPos.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // 6. VẼ ĐÈN DẪN ĐƯỜNG NHIỆM VỤ (QUEST BEACON TARGET)
        if (window.gameInstance && window.gameInstance.questNav && window.gameInstance.questNav.active) {
            const qPos = this.worldToMinimap(window.gameInstance.questNav.targetX, window.gameInstance.questNav.targetY, px, py);
            if (qPos.visible) {
                ctx.save();
                const qPulse = 3.5 + Math.sin(this.pulseTime * 5) * 1.5;
                ctx.fillStyle = '#ff0054';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(qPos.x, qPos.y, qPulse, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }

        // 6.5. VẼ CÁC BẠN SINH VIÊN TRỰC TUYẾN KHÁC TRÊN MINIMAP (ONLINE MULTIPLAYER PINS)
        if (window.networkManager) {
            const remotePlayers = window.networkManager.getPlayersInMap('map1_tnu');
            remotePlayers.forEach(rp => {
                const rpPos = this.worldToMinimap(rp.x, rp.y, px, py);
                if (rpPos.visible) {
                    ctx.save();
                    // Hào quang phát sáng nhẹ
                    ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
                    ctx.beginPath();
                    ctx.arc(rpPos.x, rpPos.y, 6.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Điểm tròn vàng kim đại diện cho bạn sinh viên trực tuyến
                    ctx.fillStyle = '#ffd166';
                    ctx.strokeStyle = '#2b1c11';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.arc(rpPos.x, rpPos.y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }
            });
        }

        // 7. VẼ CON TRỎ NHÂN VẬT DẠNG GIỌT NƯỚC XANH LAM (WATER-DROP PLAYER PIN CHUẨN 100% THEO ẢNH MẪU)
        const playerPos = this.worldToMinimap(px, py, px, py);
        if (playerPos.visible) {
            this.drawWaterDropPlayerPin(ctx, playerPos.x, playerPos.y, player);
        }
    }

    /**
     * Vẽ biểu tượng giọt nước xanh lam đại diện cho người chơi (💧 Water-Drop Player Pin)
     * Chuẩn xác như trong ảnh tham chiếu media_1794879991369_7dcbeda1.png
     */
    drawWaterDropPlayerPin(ctx, x, y, player) {
        ctx.save();
        ctx.translate(x, y);

        // Góc xoay hướng nhìn của nhân vật
        let angle = 0;
        if (player) {
            if (player.direction === 'up') angle = 0;
            else if (player.direction === 'right') angle = Math.PI / 2;
            else if (player.direction === 'down') angle = Math.PI;
            else if (player.direction === 'left') angle = -Math.PI / 2;
        }
        ctx.rotate(angle);

        // Sóng phát sáng xung quanh chân giọt nước
        const pulseR = 7 + Math.sin(this.pulseTime * 4) * 2;
        ctx.fillStyle = 'rgba(72, 202, 228, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 2, pulseR, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ hình giọt nước Teardrop với mũi nhọn hướng lên trên (chỉ hướng di chuyển)
        ctx.beginPath();
        ctx.moveTo(0, -9); // Mũi nhọn đỉnh giọt nước
        ctx.bezierCurveTo(4.5, -4, 6.5, 1, 5, 5);
        ctx.bezierCurveTo(3.5, 8.5, -3.5, 8.5, -5, 5);
        ctx.bezierCurveTo(-6.5, 1, -4.5, -4, 0, -9);
        ctx.closePath();

        // Gradient xanh ngọc tươi sáng
        const dropGrad = ctx.createLinearGradient(0, -9, 0, 7);
        dropGrad.addColorStop(0, '#90e0ef');
        dropGrad.addColorStop(0.5, '#48cae4');
        dropGrad.addColorStop(1, '#0077b6');
        ctx.fillStyle = dropGrad;
        ctx.fill();

        // Viền xanh đậm navy sắc nét
        ctx.strokeStyle = '#023e8a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Đốm sáng phản chiếu màu trắng bên trong giọt nước
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(-1.5, 3.5, 1.4, 2, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Khởi tạo danh sách địa danh trong Modal Bản đồ lớn
     */
    populateLandmarksList() {
        const listEl = document.getElementById('large-map-locations-list');
        if (!listEl) return;

        listEl.innerHTML = '';
        this.landmarks.forEach(lm => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-2 rounded-lg bg-[#fff8eb] hover:bg-[#ffe5a3] border border-[#5c4731] transition-all flex flex-col gap-0.5 group cursor-pointer shadow-2xs';
            btn.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-quest font-bold text-xs text-[#3c2a1e] group-hover:text-[#9d0208] transition-colors">${lm.name}</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-[#f0e6cf] font-mono text-[#5c4731]">Đi tới</span>
                </div>
                <div class="text-[10px] text-[#6b5037] leading-tight truncate">${lm.desc}</div>
            `;
            btn.onclick = () => {
                this.teleportTo(lm.x, lm.y, lm.name);
            };
            listEl.appendChild(btn);
        });
    }

    teleportTo(x, y, name) {
        if (!window.gameInstance || !window.gameInstance.player) return;

        window.gameInstance.player.x = x;
        window.gameInstance.player.y = y;
        if (window.gameInstance.player.companionPet) {
            window.gameInstance.player.companionPet.teleportTo(x - 30, y - 10);
        }

        if (window.soundSystem && window.soundSystem.playWarp) {
            window.soundSystem.playWarp();
        }

        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast(`✨ Đã dịch chuyển đến: ${name}`, 'success');
        }

        this.closeLargeMap();
    }

    handleLargeCanvasClick(e) {
        if (!this.largeCanvas) return;
        const rect = this.largeCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.largeCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (this.largeCanvas.height / rect.height);

        const wx = (mx / this.largeCanvas.width) * this.worldW;
        const wy = (my / this.largeCanvas.height) * this.worldH;

        this.teleportTo(wx, wy, `Vị trí (${Math.round(wx)}, ${Math.round(wy)})`);
    }

    openLargeMap() {
        if (!this.largeMapModal) return;
        this.largeMapModal.classList.remove('hidden');
        this.largeMapModal.classList.add('flex');

        this.renderLargeMap();
    }

    closeLargeMap() {
        if (!this.largeMapModal) return;
        this.largeMapModal.classList.add('hidden');
        this.largeMapModal.classList.remove('flex');
    }

    renderLargeMap() {
        if (!this.largeCanvas) return;
        const ctx = this.largeCanvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, this.largeCanvas.width, this.largeCanvas.height);

        // 1. Vẽ ảnh toàn cảnh
        if (this.mapImageLoaded && this.mapImage.naturalWidth > 0) {
            ctx.drawImage(this.mapImage, 0, 0, this.largeCanvas.width, this.largeCanvas.height);
        }

        // 2. Vẽ tất cả các điểm địa danh với huy hiệu nổi bật
        this.landmarks.forEach(lm => {
            const rx = (lm.x / this.worldW) * this.largeCanvas.width;
            const ry = (lm.y / this.worldH) * this.largeCanvas.height;

            ctx.save();
            ctx.fillStyle = lm.color || '#e63946';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(rx, ry, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Nhãn tên
            ctx.font = 'bold 9px sans-serif';
            ctx.fillStyle = '#1b263b';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.strokeText(lm.name, rx, ry - 8);
            ctx.fillText(lm.name, rx, ry - 8);
            ctx.restore();
        });

        // 3. Vẽ vị trí người chơi trên bản đồ lớn
        const player = window.gameInstance ? window.gameInstance.player : null;
        if (player) {
            const rx = (player.x / this.worldW) * this.largeCanvas.width;
            const ry = (player.y / this.worldH) * this.largeCanvas.height;

            // Vòng tròn phát sáng
            ctx.save();
            ctx.fillStyle = 'rgba(0, 180, 216, 0.4)';
            ctx.beginPath();
            ctx.arc(rx, ry, 18, 0, Math.PI * 2);
            ctx.fill();

            // Chấm định vị
            ctx.fillStyle = '#0077b6';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(rx, ry, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Nhãn "Bạn ở đây"
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.strokeText('📍 BẠN Ở ĐÂY', rx, ry - 12);
            ctx.fillStyle = '#d90429';
            ctx.fillText('📍 BẠN Ở ĐÂY', rx, ry - 12);
            ctx.restore();
        }
    }
}

// Gắn Singleton vào window
window.minimapSystem = new MinimapSystem();
