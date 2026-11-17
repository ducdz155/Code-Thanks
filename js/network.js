/**
 * ===================================================================
 * TNU: ĐÔI CÁNH ĐẠI NGÀN - ONLINE MULTIPLAYER CLIENT ENGINE (NETWORK MANAGER)
 * Đồng bộ nhiều người chơi thời gian thực qua WebSockets (Real-time MMORPG)
 * Hỗ trợ: Vị trí, Hoạt ảnh, 10 Cánh bay, Thần thú, Trang phục, Chat, Cây ước nguyện
 * ===================================================================
 */

class RemotePlayer {
    constructor(data) {
        this.id = data.id;
        this.name = data.name || 'Sinh Viên TNU';
        this.badgeColor = data.badgeColor || '#4cc9f0';
        this.outfitId = data.outfitId || 'outfit_1000';
        this.wingId = (data.wingId && data.wingId !== 'null' && data.wingId !== 'none') ? data.wingId : null;
        this.petId = (data.petId && data.petId !== 'null' && data.petId !== 'none') ? data.petId : null;
        this.hairStyle = data.hairStyle || 0;
        this.hairColor = data.hairColor || '#4a2810';
        this.skinTone = data.skinTone || '#ffe5d9';
        this.mapId = data.mapId || 'map1_tnu';

        // Tọa độ thực tế (vẽ trên màn hình) và tọa độ mục tiêu (từ server)
        this.x = typeof data.x === 'number' ? data.x : 1725;
        this.y = typeof data.y === 'number' ? data.y : 3062;
        this.targetX = this.x;
        this.targetY = this.y;

        this.direction = data.direction || 'down';
        this.isMoving = !!data.isMoving;
        this.animFrame = data.animFrame || 0;
        this.animTimer = data.animTimer || 0;
        this.flapTimer = 0;
        this.wingRealTimer = 0;
        this.width = 36;
        this.height = 54;

        // Bong bóng trò chuyện trên đầu (Speech Bubble)
        this.chatBubble = null; // { text, timer, maxTime }

        // Thần thú Pet đi theo người chơi này
        if (window.CompanionPet && this.petId) {
            this.companionPet = new window.CompanionPet(this);
        } else {
            this.companionPet = null;
        }
    }

    setProfile(profile) {
        if (!profile) return;
        if (profile.name) this.name = profile.name;
        if (profile.badgeColor) this.badgeColor = profile.badgeColor;
        if (profile.outfitId) this.outfitId = profile.outfitId;
        if (profile.wingId !== undefined) {
            this.wingId = (profile.wingId && profile.wingId !== 'null' && profile.wingId !== 'none') ? profile.wingId : null;
        }
        if (profile.hairStyle !== undefined) this.hairStyle = profile.hairStyle;
        if (profile.hairColor) this.hairColor = profile.hairColor;
        if (profile.skinTone) this.skinTone = profile.skinTone;

        if (profile.petId !== undefined) {
            const nextPetId = (profile.petId && profile.petId !== 'null' && profile.petId !== 'none') ? profile.petId : null;
            if (nextPetId !== this.petId) {
                this.petId = nextPetId;
                if (this.petId && window.CompanionPet) {
                    this.companionPet = new window.CompanionPet(this);
                } else {
                    this.companionPet = null;
                }
            }
        }
    }

    setTarget(x, y, direction, isMoving, animFrame, animTimer, mapId) {
        this.targetX = x;
        this.targetY = y;
        if (direction) this.direction = direction;
        this.isMoving = isMoving;
        if (typeof animFrame === 'number') this.animFrame = animFrame;
        if (typeof animTimer === 'number') this.animTimer = animTimer;
        if (mapId) this.mapId = mapId;

        // Nếu khoảng cách quá xa (teleport hoặc lag mạng lớn), dịch chuyển ngay
        const dist = Math.hypot(this.x - this.targetX, this.y - this.targetY);
        if (dist > 350) {
            this.x = this.targetX;
            this.y = this.targetY;
            if (this.companionPet && this.companionPet.teleportTo) {
                this.companionPet.teleportTo(this.x - 20, this.y);
            }
        }
    }

    showChat(text) {
        this.chatBubble = {
            text: text,
            timer: 4.8,
            maxTime: 4.8
        };
    }

    update(dt) {
        // LERP nội suy chuyển động mượt mà 60fps
        const lerpFactor = Math.min(1, dt * 14);
        this.x += (this.targetX - this.x) * lerpFactor;
        this.y += (this.targetY - this.y) * lerpFactor;

        this.wingRealTimer += dt;
        if (this.isMoving) {
            this.animTimer += dt * 5.2;
            this.flapTimer += dt * 10.0;
        } else {
            this.animTimer += dt * 2.0;
            this.flapTimer += dt * 3.5;
        }

        // Cập nhật Pet đồng hành
        if (this.petId) {
            if (!this.companionPet && window.CompanionPet) {
                this.companionPet = new window.CompanionPet(this);
            }
            if (this.companionPet) {
                this.companionPet.update(dt);
            }
        } else {
            this.companionPet = null;
        }

        // Cập nhật Bong bóng trò chuyện
        if (this.chatBubble) {
            this.chatBubble.timer -= dt;
            if (this.chatBubble.timer <= 0) {
                this.chatBubble = null;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const isFacingLeft = this.direction === 'left';
        if (isFacingLeft) {
            ctx.scale(-1, 1);
        }

        const bob = this.isMoving ? Math.sin(this.animTimer * Math.PI) * 2.5 : Math.sin(this.flapTimer * 0.6) * 1.5;
        const isAction = this.animFrame === 3;

        // 1. Bóng đổ dưới chân
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, this.height / 2 - 2, 17, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Cánh bay sau lưng
        if (this.wingId && this.direction !== 'up') {
            this.drawWings(ctx, this.wingId, bob);
        }

        // 3. Chuẩn Thick-outline
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const headY = -38 + bob;
        const isFrameBody = window.bodySQLDB && window.bodySQLDB.isFrameBody(this.outfitId);

        // 4. Vẽ trang phục thân & đầu
        if (isFrameBody) {
            window.bodySQLDB.drawFullOutfitOnPlayer(ctx, this.outfitId, this.direction, this.isMoving, this.animTimer, bob, isAction);
        } else {
            // Fallback vẽ cơ bản nếu trang phục chưa tải
            ctx.fillStyle = '#1d3557';
            ctx.fillRect(-10, -18 + bob, 20, 24);
            ctx.strokeRect(-10, -18 + bob, 20, 24);
            ctx.fillStyle = this.skinTone || '#ffe5d9';
            ctx.beginPath();
            ctx.arc(0, headY, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // 5. Cánh bay khi nhìn hướng Up
        if (this.wingId && this.direction === 'up') {
            this.drawWings(ctx, this.wingId, bob);
        }

        // 6. Bảng tên Overhead
        ctx.save();
        if (isFacingLeft) {
            ctx.scale(-1, 1); // Đảo lại để chữ không bị ngược
        }

        ctx.fillStyle = this.badgeColor || '#4cc9f0';
        ctx.font = 'bold 11px sans-serif';
        const displayName = '🧑‍🎓 ' + (this.name || 'Sinh Viên TNU');
        const textWidth = ctx.measureText(displayName).width;
        const pillWidth = Math.max(110, textWidth + 20);

        ctx.beginPath();
        ctx.roundRect(-pillWidth / 2, -98 + bob, pillWidth, 22, 11);
        ctx.fill();
        ctx.strokeStyle = '#2b7a78';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(displayName, 0, -83 + bob);

        // 7. Bong bóng trò chuyện Overhead (Speech Bubble)
        if (this.chatBubble && this.chatBubble.text) {
            this.drawSpeechBubble(ctx, this.chatBubble.text, headY);
        }

        ctx.restore();
        ctx.restore();
    }

    drawWings(ctx, wingId, bob) {
        if (window.WingsRenderer) {
            if (window.WingsRenderer.drawWingsOnCharacter(ctx, wingId, this.wingRealTimer || 0, bob, this.isMoving)) {
                return;
            }
            const amplitude = this.isMoving ? 0.52 : 0.24;
            const flapAngle = Math.sin(this.flapTimer) * amplitude;

            ctx.save();
            ctx.translate(-7, -20 + bob);
            window.WingsRenderer.drawWing(ctx, wingId, 'left', flapAngle);
            ctx.restore();

            ctx.save();
            ctx.translate(7, -20 + bob);
            window.WingsRenderer.drawWing(ctx, wingId, 'right', flapAngle);
            ctx.restore();
        }
    }

    drawSpeechBubble(ctx, text, headY) {
        ctx.save();
        ctx.font = 'bold 12px sans-serif';
        const paddingX = 12;
        const paddingY = 6;
        const textWidth = ctx.measureText(text).width;
        const bubbleW = Math.max(70, Math.min(240, textWidth + paddingX * 2));
        const bubbleH = 26;
        const bubbleX = -bubbleW / 2;
        const bubbleY = -140;

        // Vẽ hộp thoại tròn viền đổ bóng nhẹ
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

        // Mũi nhọn trỏ vào đầu
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

        // Chữ hội thoại
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
}

class NetworkManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.myId = null;
        this.remotePlayers = new Map();
        this.onlineCount = 1;
        this.lastSentMoveTime = 0;
        this.lastSentState = null;
        this.reconnectAttempts = 0;
        this.reconnectTimer = null;
        this.game = null;
    }

    init(game) {
        this.game = game;
        this.connect();

        // Hook vào UI Chat & Wishing Tree
        this.bindEvents();
    }

    getServerUrl() {
        // Tự động phân giải URL WebSocket chuẩn xác cho mọi môi trường
        // (Localhost, Render, Railway, Fly.io, Glitch, VPS, Nginx SSL, v.v.)
        if (window.__TNU_CUSTOM_WS_URL__) {
            return window.__TNU_CUSTOM_WS_URL__;
        }

        const isHttps = window.location.protocol === 'https:';
        const protocol = isHttps ? 'wss:' : 'ws:';
        const host = window.location.host;

        // Nếu mở file trực tiếp (file:///)
        if (!host || host.startsWith('file')) {
            return 'ws://localhost:8088/ws';
        }

        return `${protocol}//${host}/ws`;
    }

    connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const wsUrl = this.getServerUrl();
        console.log(`[Network] Đang kết nối tới máy chủ Online: ${wsUrl}`);

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('✅ [Network] Đã kết nối thành công tới máy chủ TNU Online!');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                    this.reconnectTimer = null;
                }

                // Gửi gói Join thông tin người chơi
                this.sendJoin();

                // Hiển thị thông báo kết nối trên HUD
                this.updateOnlineHUD();
                if (window.uiManager && window.uiManager.showToast) {
                    window.uiManager.showToast('🟢 Đã kết nối vào Mạng Trực Tuyến TNU: Đôi Cánh Đại Ngàn!', 'success');
                }
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (err) {
                    console.warn('[Network] Lỗi phân tích gói tin máy chủ:', err);
                }
            };

            this.socket.onclose = () => {
                console.warn('⚠️ [Network] Mất kết nối tới máy chủ. Đang tự động kết nối lại...');
                this.isConnected = false;
                this.remotePlayers.clear();
                this.updateOnlineHUD();
                this.scheduleReconnect();
            };

            this.socket.onerror = (err) => {
                console.warn('[Network] Lỗi WebSocket:', err);
            };
        } catch (e) {
            console.warn('[Network] Không thể khởi tạo WebSocket:', e.message);
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        if (this.reconnectTimer) return;
        this.reconnectAttempts++;
        const delay = Math.min(10000, 2000 * Math.pow(1.3, this.reconnectAttempts));
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, delay);
    }

    send(packet) {
        if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        try {
            this.socket.send(JSON.stringify(packet));
        } catch (e) {
            console.warn('[Network] Lỗi gửi gói tin:', e.message);
        }
    }

    sendJoin() {
        const stateProg = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.progression) || {};
        const player = (this.game && this.game.player) || {};
        const currentMapId = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.currentMapId) || 'map1_tnu';

        const profile = {
            name: stateProg.ten_nhan_vat || (player.name) || 'Sinh Viên TNU',
            badgeColor: '#f4a261',
            outfitId: stateProg.trang_phuc_hien_tai || 'outfit_1000',
            wingId: (stateProg.canh_hien_tai && stateProg.canh_hien_tai !== 'none') ? stateProg.canh_hien_tai : null,
            petId: (stateProg.pet_hien_tai && stateProg.pet_hien_tai !== 'none') ? stateProg.pet_hien_tai : null,
            hairStyle: stateProg.kieu_toc_hien_tai || 0,
            hairColor: stateProg.mau_toc_hien_tai || '#4a2810',
            skinTone: stateProg.tone_da_hien_tai || '#ffe5d9',
            mapId: currentMapId,
            x: player.x || 1725,
            y: player.y || 3062,
            direction: player.direction || 'down',
            isMoving: !!player.isMoving
        };

        this.send({
            type: 'join',
            profile: profile,
            mapId: currentMapId,
            x: profile.x,
            y: profile.y
        });
    }

    sendMovement(player, mapId) {
        if (!this.isConnected || !player) return;

        const now = performance.now();
        // Giới hạn tần số gửi tối đa ~22Hz (mỗi 45ms) hoặc gửi ngay khi trạng thái chuyển động thay đổi
        const isStateChanged = !this.lastSentState ||
            this.lastSentState.isMoving !== player.isMoving ||
            this.lastSentState.direction !== player.direction;

        if (!isStateChanged && now - this.lastSentMoveTime < 45) {
            return;
        }

        this.lastSentMoveTime = now;
        this.lastSentState = {
            x: Math.round(player.x),
            y: Math.round(player.y),
            direction: player.direction,
            isMoving: player.isMoving,
            animFrame: player.animFrame,
            animTimer: Math.round(player.animTimer * 100) / 100,
            mapId: mapId
        };

        this.send({
            type: 'move',
            ...this.lastSentState
        });
    }

    sendProfile(profileUpdates) {
        this.send({
            type: 'profile',
            profile: profileUpdates
        });
    }

    sendChangeMap(mapId, x, y) {
        this.send({
            type: 'changeMap',
            mapId: mapId,
            x: x,
            y: y
        });
    }

    sendChat(text, channel, sender) {
        this.send({
            type: 'chat',
            text: text,
            channel: channel || 'school',
            sender: sender || 'Sinh Viên TNU'
        });
    }

    sendWish(wish) {
        this.send({
            type: 'addWish',
            wish: wish
        });
    }

    sendLikeWish(wishId) {
        this.send({
            type: 'likeWish',
            wishId: wishId
        });
    }

    handleMessage(data) {
        switch (data.type) {
            case 'welcome': {
                this.myId = data.id;
                this.onlineCount = data.onlineCount || 1;
                this.remotePlayers.clear();

                // Nạp danh sách người chơi đang có trong phòng
                if (Array.isArray(data.players)) {
                    data.players.forEach(p => {
                        if (p.id !== this.myId) {
                            this.remotePlayers.set(p.id, new RemotePlayer(p));
                        }
                    });
                }

                // Đồng bộ hóa danh sách lời chúc 20/11 từ máy chủ
                if (Array.isArray(data.wishes) && window.wishingManager) {
                    window.wishingManager.wishes = data.wishes;
                    try {
                        localStorage.setItem('tnu_wishing_board_data', JSON.stringify(data.wishes));
                    } catch {}
                    if (window.wishingManager.renderWishesList) {
                        window.wishingManager.renderWishesList();
                    }
                }

                this.updateOnlineHUD();
                break;
            }

            case 'playerJoin': {
                const p = data.player;
                if (p && p.id && p.id !== this.myId) {
                    this.remotePlayers.set(p.id, new RemotePlayer(p));
                    this.onlineCount = data.onlineCount || this.remotePlayers.size + 1;
                    this.updateOnlineHUD();

                    if (window.uiManager && window.uiManager.showToast) {
                        window.uiManager.showToast(`👋 Bạn [${p.name || 'Sinh Viên'}] vừa bước vào khuôn viên!`, 'info');
                    }
                    if (window.soundSystem && window.soundSystem.playChime) {
                        window.soundSystem.playChime();
                    }
                }
                break;
            }

            case 'playerMove': {
                if (data.id === this.myId) return;
                let remote = this.remotePlayers.get(data.id);
                if (!remote) {
                    remote = new RemotePlayer(data);
                    this.remotePlayers.set(data.id, remote);
                }
                remote.setTarget(data.x, data.y, data.direction, data.isMoving, data.animFrame, data.animTimer, data.mapId);
                break;
            }

            case 'playerProfile': {
                if (data.id === this.myId) return;
                const remote = this.remotePlayers.get(data.id);
                if (remote && data.profile) {
                    remote.setProfile(data.profile);
                }
                break;
            }

            case 'playerChangeMap': {
                if (data.id === this.myId) return;
                let remote = this.remotePlayers.get(data.id);
                if (remote) {
                    remote.mapId = data.toMap;
                    if (typeof data.x === 'number') remote.setTarget(data.x, data.y);
                    if (data.player) remote.setProfile(data.player);
                } else if (data.player) {
                    this.remotePlayers.set(data.id, new RemotePlayer(data.player));
                }
                break;
            }

            case 'playerLeave': {
                if (this.remotePlayers.has(data.id)) {
                    const leavingPlayer = this.remotePlayers.get(data.id);
                    this.remotePlayers.delete(data.id);
                    this.onlineCount = data.onlineCount || (this.remotePlayers.size + 1);
                    this.updateOnlineHUD();

                    if (window.uiManager && window.uiManager.showToast && leavingPlayer) {
                        window.uiManager.showToast(`🏃 Bạn [${leavingPlayer.name}] đã rời game.`, 'info');
                    }
                }
                break;
            }

            case 'chat': {
                // Nhận tin nhắn từ người chơi khác
                if (data.id !== this.myId && window.uiManager && window.uiManager.addChatMessage) {
                    window.uiManager.addChatMessage(data.text, data.channel || 'school', data.sender);
                    if (window.soundSystem && window.soundSystem.playMessage) {
                        window.soundSystem.playMessage();
                    }
                }

                // Hiển thị Bong bóng hội thoại (Speech Bubble) trên đầu nhân vật
                if (data.id === this.myId) {
                    if (this.game && this.game.player) {
                        this.game.player.chatBubble = { text: data.text, timer: 4.8 };
                    }
                } else {
                    const remote = this.remotePlayers.get(data.id);
                    if (remote) {
                        remote.showChat(data.text);
                    }
                }
                break;
            }

            case 'newWish': {
                if (data.wish && window.wishingManager) {
                    // Thêm lời chúc mới vào đầu danh sách nếu chưa có
                    const exists = window.wishingManager.wishes.some(w => w.id === data.wish.id);
                    if (!exists) {
                        window.wishingManager.wishes.unshift(data.wish);
                        try {
                            localStorage.setItem('tnu_wishing_board_data', JSON.stringify(window.wishingManager.wishes));
                        } catch {}
                        if (window.wishingManager.renderWishesList) {
                            window.wishingManager.renderWishesList();
                        }
                        if (window.uiManager && window.uiManager.showToast) {
                            window.uiManager.showToast(`✨ [${data.authorName || 'Sinh viên'}] vừa gửi một lời chúc lên Bảng Ước Nguyện 20/11!`, 'success');
                        }
                    }
                }
                break;
            }

            case 'wishLiked': {
                if (window.wishingManager) {
                    const target = window.wishingManager.wishes.find(w => w.id === data.wishId);
                    if (target) {
                        target.likes = data.likes;
                        if (window.wishingManager.renderWishesList) {
                            window.wishingManager.renderWishesList();
                        }
                    }
                }
                break;
            }
        }
    }

    update(dt) {
        // Cập nhật tất cả remote players
        for (const remote of this.remotePlayers.values()) {
            remote.update(dt);
        }

        // Cập nhật bong bóng trò chuyện của người chơi chính (nếu có)
        if (this.game && this.game.player && this.game.player.chatBubble) {
            this.game.player.chatBubble.timer -= dt;
            if (this.game.player.chatBubble.timer <= 0) {
                this.game.player.chatBubble = null;
            }
        }
    }

    getPlayersInMap(mapId) {
        const list = [];
        for (const player of this.remotePlayers.values()) {
            if (player.mapId === mapId) {
                list.push(player);
            }
        }
        return list;
    }

    updateOnlineHUD() {
        // Cập nhật nhãn kênh trên Minimap hoặc HUD
        const channelBadge = document.getElementById('minimap-channel-btn');
        const count = this.isConnected ? Math.max(1, this.onlineCount) : 1;
        const statusDot = this.isConnected ? '🟢' : '⚪';

        if (channelBadge) {
            channelBadge.innerHTML = `<span>Kênh 1</span> <span class="text-[10px] opacity-80">${statusDot} ${count}</span>`;
        }

        // Cập nhật subtitle ở header nếu có
        const onlineCountEl = document.getElementById('online-player-counter');
        if (onlineCountEl) {
            onlineCountEl.innerHTML = `${statusDot} ${count} online`;
        }
    }

    bindEvents() {
        // Hook vào việc gửi chat từ UI
        if (window.uiManager) {
            const originalSendChatMessage = window.uiManager.sendChatMessage;
            window.uiManager.sendChatMessage = () => {
                const input = document.getElementById('chat-input');
                if (!input) return;
                const text = input.value.trim();
                if (!text) return;

                const myName = (window.useGameStore && window.useGameStore.state.progression && window.useGameStore.state.progression.ten_nhan_vat) 
                    || (this.game && this.game.player && this.game.player.name) 
                    || 'Bạn';

                // Gửi qua WebSocket
                this.sendChat(text, window.uiManager.currentChatChannel || 'school', myName);

                // Gọi hàm gốc để hiện trên máy của mình
                originalSendChatMessage.call(window.uiManager);
            };

            const originalSendQuickChat = window.uiManager.sendQuickChat;
            window.uiManager.sendQuickChat = (type) => {
                const quickTexts = {
                    'hello': 'Chào mọi người nha! Chúc mọi người một ngày vui vẻ! 👋',
                    'thanks': 'Cảm ơn bạn nhiều nhé! ❤️',
                    'help': 'Có ai rảnh ghé qua hỗ trợ mình làm nhiệm vụ này với! 🙏',
                    'where': 'Mọi người đang ở khu vực nào thế? Cho mình tham gia cùng với! 🧭'
                };
                const text = quickTexts[type];
                if (text) {
                    const myName = (window.useGameStore && window.useGameStore.state.progression && window.useGameStore.state.progression.ten_nhan_vat) 
                        || (this.game && this.game.player && this.game.player.name) 
                        || 'Bạn';
                    this.sendChat(text, window.uiManager.currentChatChannel || 'school', myName);
                }
                originalSendQuickChat.call(window.uiManager, type);
            };
        }

        // Hook vào Wishing Tree để gửi lời chúc lên server
        if (window.wishingManager) {
            const originalSubmitWish = window.wishingManager.submitWish;
            window.wishingManager.submitWish = () => {
                const contentInput = document.getElementById('wishing-content-input');
                const teacherSelect = document.getElementById('wishing-teacher-select');
                const authorInput = document.getElementById('wishing-author-input');
                const tagInput = document.getElementById('wishing-tag-input');

                if (contentInput && teacherSelect && contentInput.value.trim()) {
                    const myWish = {
                        author: (authorInput && authorInput.value.trim()) || 'Sinh Viên TNU',
                        target: teacherSelect.value,
                        tag: (tagInput && tagInput.value.trim()) || 'Tri Ân 20/11',
                        content: contentInput.value.trim(),
                        color: window.wishingManager.selectedColor || '#fff3b0'
                    };
                    this.sendWish(myWish);
                }
                originalSubmitWish.call(window.wishingManager);
            };

            const originalLikeWish = window.wishingManager.likeWish;
            window.wishingManager.likeWish = (wishId) => {
                this.sendLikeWish(wishId);
                originalLikeWish.call(window.wishingManager, wishId);
            };
        }
    }
}

// Khởi tạo instance mạng toàn cục
window.networkManager = new NetworkManager();
