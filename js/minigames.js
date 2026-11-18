/**
 * ARCADE MINIGAMES SYSTEM
 * 1. ClawMachineGame: Minigame Gắp Thú Bông May Mắn
 * 2. ShootingGalleryGame: Minigame Quầy Bắn Súng Hội Chợ
 * Cả hai game khi thắng đều thưởng 'vat_pham_tro_choi' vào túi đồ.
 */

class ClawMachineGame {
    constructor(canvasId) {
        this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.width = 640;
        this.height = 480;

        // Tải 3 tài nguyên hình ảnh chuẩn xác 100% từ ảnh yêu cầu của người dùng:
        // 1. Máy gắp gấu pastel hồng xinh xắn
        // 2. Cần gắp trạng thái mở (Open Claw)
        // 3. Cần gắp trạng thái kẹp chặt (Closed Claw)
        this.machineImg = new Image();
        this.machineImg.src = (window.getR2Url ? window.getR2Url('assets/minigames/claw_machine_pink.png') : 'assets/minigames/claw_machine_pink.png');
        this.machineLoaded = false;
        this.machineImg.onload = () => { this.machineLoaded = true; };

        this.clawOpenImg = new Image();
        this.clawOpenImg.src = (window.getR2Url ? window.getR2Url('assets/minigames/claw_open.png') : 'assets/minigames/claw_open.png');
        this.clawOpenLoaded = false;
        this.clawOpenImg.onload = () => { this.clawOpenLoaded = true; };

        this.clawClosedImg = new Image();
        this.clawClosedImg.src = (window.getR2Url ? window.getR2Url('assets/minigames/claw_closed.png') : 'assets/minigames/claw_closed.png');
        this.clawClosedLoaded = false;
        this.clawClosedImg.onload = () => { this.clawClosedLoaded = true; };

        // Tải các tài nguyên thú bông thực tế từ hình sticker của người dùng
        this.toyImages = {};
        const toyMap = {
            bear: 'assets/items/gau_bong.png',
            duck: 'assets/items/thu_bong_vit.png',
            cat: 'assets/items/meo_bong.png',
            capybara: 'assets/items/capybara.png',
            cow: 'assets/items/bup_be_bo.png',
            gift: 'assets/items/qua_tro_choi.png',
            star: 'assets/items/huy_hieu.png'
        };
        for (const [k, src] of Object.entries(toyMap)) {
            const img = new Image();
            img.src = src;
            this.toyImages[k] = img;
        }

        // Tọa độ bố cục buồng máy gắp trên Canvas 640 x 480
        this.layout = {
            mX: 104,          // Tọa độ x của máy gắp trên canvas
            mY: 4,            // Tọa độ y của máy gắp
            mW: 432,          // Chiều rộng máy gắp
            mH: 472,          // Chiều cao máy gắp
            glassX: 152,      // Tường kính bên trái
            glassY: 80,       // Trần kính (nơi ray trượt và dây cáp bắt đầu)
            glassW: 336,      // Chiều rộng lòng kính
            glassH: 228,      // Chiều cao lòng kính
            glassFloorY: 308, // Mặt sàn đặt thú bông
            chuteX: 185,      // Tọa độ miệng phễu thả thưởng (bên trái chuẩn theo ảnh máy)
            chuteY: 300,      // Độ cao miệng phễu
            doorX: 320,       // Tọa độ cửa lấy quà dưới chân máy
            doorY: 416,
            joystickX: 284,   // Vị trí cần gạt joystick chuẩn trên máy
            joystickY: 340,
            buttonX: 355,     // Vị trí nút bấm chuẩn trên máy
            buttonY: 357
        };

        // Trạng thái cần gắp cơ học
        this.claw = {
            x: 320,
            y: 84,            // Độ cao hiện tại của càng (gốc móc cáp)
            minY: 84,         // Độ cao kịch trần
            maxY: 226,        // Độ cao hạ tối đa (đầu càng chạm sàn 304)
            minX: 185,        // Giới hạn sang trái (ngay trên phễu)
            maxX: 440,        // Giới hạn sang phải
            speedX: 4.2,
            speedY: 4.5,
            state: 'idle',    // 'idle', 'moving', 'dropping', 'grabbing', 'lifting', 'returning', 'dropping_prize', 'finished'
            grabbedItem: null
        };

        // Danh sách thú bông đặt trên sàn máy
        this.toys = [];

        // Trạng thái điều khiển & hiệu ứng
        this.isRunning = false;
        this.animId = null;
        this.keys = {};
        this.gameResult = null;
        this.particles = [];
        this.floatTexts = [];
        this.joystickTilt = 0;   // -1 (trái), 0 (thẳng), 1 (phải)
        this.buttonPressed = false;
        this.wonToyAnim = null;  // Hiệu ứng thú rơi xuống cửa nhận thưởng
        this.grabTimer = 0;
        this.globalTime = 0;

        this.isDraggingJoystick = false;

        this.onKeyDown = this.handleKeyDown.bind(this);
        this.onKeyUp = this.handleKeyUp.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        this.boundTouchStart = this.handleTouchStart.bind(this);
        this.boundTouchMove = this.handleTouchMove.bind(this);
        this.boundTouchEnd = this.handleTouchEnd.bind(this);
    }

    init() {
        if (!this.canvas) return;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.resetGame();

        window.removeEventListener('keydown', this.onKeyDown);
        window.addEventListener('keydown', this.onKeyDown);

        window.removeEventListener('keyup', this.onKeyUp);
        window.addEventListener('keyup', this.onKeyUp);

        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);

        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);

        window.removeEventListener('mouseup', this.boundMouseUp);
        window.addEventListener('mouseup', this.boundMouseUp);

        this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });

        this.canvas.removeEventListener('touchmove', this.boundTouchMove);
        this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });

        window.removeEventListener('touchend', this.boundTouchEnd);
        window.addEventListener('touchend', this.boundTouchEnd);
    }

    resetToys() {
        this.toys = [
            { id: 1, type: 'bear', name: 'Gấu Teddy Nâu TNU', itemKey: 'thu_bong_gau', x: 245, y: 295, radius: 20, color: '#8b5a2b', earColor: '#5c3a21' },
            { id: 2, type: 'duck', name: 'Thú Bông Vịt Vàng', itemKey: 'thu_bong_vit', x: 295, y: 298, radius: 18, color: '#ffd166', earColor: '#f77f00' },
            { id: 3, type: 'cat', name: 'Mèo Bông Cute', itemKey: 'thu_bong_meo', x: 345, y: 295, radius: 19, color: '#f3722c', earColor: '#f9c74f' },
            { id: 4, type: 'capybara', name: 'Capybara Điềm Tĩnh', itemKey: 'thu_bong_capybara', x: 395, y: 295, radius: 22, color: '#9c6644', earColor: '#7f4f24' },
            { id: 5, type: 'cow', name: 'Búp Bê Bò Sữa Mini', itemKey: 'bo_bong_mini', x: 435, y: 298, radius: 19, color: '#ffffff', earColor: '#333333' },
            { id: 6, type: 'star', name: 'Ngôi Sao May Mắn', itemKey: 'vat_pham_tro_choi', x: 270, y: 272, radius: 16, color: '#fee440', earColor: '#f48c06' },
            { id: 7, type: 'gift', name: 'Hộp Quà Lễ Hội', itemKey: 'vat_pham_tro_choi', x: 370, y: 272, radius: 16, color: '#e63946', earColor: '#ffd166' }
        ];
    }

    resetGame() {
        this.claw.x = 320;
        this.claw.y = 84;
        this.claw.state = 'idle';
        this.claw.grabbedItem = null;
        this.gameResult = null;
        this.particles = [];
        this.floatTexts = [];
        this.joystickTilt = 0;
        this.buttonPressed = false;
        this.wonToyAnim = null;
        this.grabTimer = 0;
        this.resetToys();
    }

    start() {
        this.isRunning = true;
        this.resetGame();
        let lastTime = performance.now();

        const loop = (now) => {
            if (!this.isRunning) return;
            const dt = Math.min(0.1, (now - lastTime) / 1000);
            lastTime = now;

            this.update(dt);
            this.draw();

            this.animId = requestAnimationFrame(loop);
        };
        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.boundMouseMove);
            this.canvas.removeEventListener('mousedown', this.boundMouseDown);
            this.canvas.removeEventListener('touchstart', this.boundTouchStart);
            this.canvas.removeEventListener('touchmove', this.boundTouchMove);
            this.canvas.style.cursor = 'default';
        }
        window.removeEventListener('mouseup', this.boundMouseUp);
        window.removeEventListener('touchend', this.boundTouchEnd);
    }

    handleKeyDown(e) {
        if (!this.isRunning) return;
        this.keys[e.code] = true;
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            this.triggerDrop();
        }
    }

    handleKeyUp(e) {
        if (!this.isRunning) return;
        this.keys[e.code] = false;
        if (!this.keys['KeyA'] && !this.keys['ArrowLeft'] && !this.keys['KeyD'] && !this.keys['ArrowRight']) {
            this.joystickTilt = 0;
        }
    }

    getCanvasCoords(e) {
        if (!this.canvas) return { x: 0, y: 0 };
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : (e.clientX || 0);
        const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : (e.clientY || 0);
        return {
            x: (clientX - rect.left) * (this.width / rect.width),
            y: (clientY - rect.top) * (this.height / rect.height)
        };
    }

    handleMouseMove(e) {
        if (!this.isRunning) return;
        const pos = this.getCanvasCoords(e);

        // Hiệu ứng con trỏ chuột khi rê qua Cần Gạt Joystick hoặc Nút Bấm trên máy
        const distJoy = Math.hypot(pos.x - this.layout.joystickX, pos.y - this.layout.joystickY);
        const distBtn = Math.hypot(pos.x - this.layout.buttonX, pos.y - this.layout.buttonY);

        if (distJoy <= 28) {
            this.canvas.style.cursor = 'ew-resize';
        } else if (distBtn <= 22) {
            this.canvas.style.cursor = 'pointer';
        } else if (pos.y >= this.layout.glassY && pos.y <= this.layout.glassFloorY && pos.x >= this.layout.glassX && pos.x <= this.layout.glassX + this.layout.glassW) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }

        // Nếu người chơi đang bấm giữ & rê cần gạt của máy sang trái/phải
        if (this.isDraggingJoystick) {
            const dx = pos.x - this.layout.joystickX;
            if (dx < -6) {
                this.claw.x = Math.max(this.layout.chuteX, this.claw.x - this.claw.speedX * 0.9);
                this.claw.state = 'moving';
                this.joystickTilt = -1;
            } else if (dx > 6) {
                this.claw.x = Math.min(this.claw.maxX, this.claw.x + this.claw.speedX * 0.9);
                this.claw.state = 'moving';
                this.joystickTilt = 1;
            } else {
                this.joystickTilt = 0;
            }
        }
    }

    handleMouseDown(e) {
        if (!this.isRunning) return;
        const pos = this.getCanvasCoords(e);

        if (this.claw.state === 'finished') {
            this.resetGame();
            return;
        }

        const distJoy = Math.hypot(pos.x - this.layout.joystickX, pos.y - this.layout.joystickY);
        const distBtn = Math.hypot(pos.x - this.layout.buttonX, pos.y - this.layout.buttonY);

        // 1. Chạm/Bấm trúng Cần Gạt Joystick của máy -> Kích hoạt điều khiển gắp sang trái/phải
        if (distJoy <= 32) {
            this.isDraggingJoystick = true;
            const dx = pos.x - this.layout.joystickX;
            if (dx < 0) {
                this.moveLeft(25);
            } else {
                this.moveRight(25);
            }
            return;
        }

        // 2. Chạm/Bấm trúng Nút Bấm Tròn của máy -> Kích hoạt hạ cần gắp
        if (distBtn <= 26) {
            this.triggerDrop();
            return;
        }

        // 3. Chạm trong buồng kính: Di chuyển cần đến tọa độ đó hoặc hạ cần
        if (pos.y >= this.layout.glassY && pos.y <= this.layout.glassFloorY && pos.x >= this.layout.glassX && pos.x <= this.layout.glassX + this.layout.glassW) {
            if (Math.abs(pos.x - this.claw.x) > 15) {
                this.claw.x = Math.max(this.layout.chuteX, Math.min(this.claw.maxX, pos.x));
            } else {
                this.triggerDrop();
            }
        }
    }

    handleMouseUp(e) {
        this.isDraggingJoystick = false;
        this.joystickTilt = 0;
    }

    handleTouchStart(e) {
        if (e.cancelable) e.preventDefault();
        this.handleMouseDown(e);
    }

    handleTouchMove(e) {
        if (e.cancelable) e.preventDefault();
        this.handleMouseMove(e);
    }

    handleTouchEnd(e) {
        this.handleMouseUp(e);
    }

    triggerDrop() {
        if (this.claw.state === 'finished') {
            this.resetGame();
            return;
        }
        if (this.claw.state === 'idle' || this.claw.state === 'moving') {
            this.claw.state = 'dropping';
            this.buttonPressed = true;
            setTimeout(() => { this.buttonPressed = false; }, 220);
            if (window.soundSystem && typeof window.soundSystem.playClawMove === 'function') {
                window.soundSystem.playClawMove();
            }
        }
    }

    moveLeft(amount = 35) {
        if (this.claw.state === 'finished') {
            this.resetGame();
            return;
        }
        if (this.claw.state === 'idle' || this.claw.state === 'moving') {
            this.claw.x = Math.max(this.layout.chuteX, this.claw.x - amount);
            this.claw.state = 'moving';
            this.joystickTilt = -1;
            setTimeout(() => { if (!this.keys['KeyA'] && !this.keys['ArrowLeft']) this.joystickTilt = 0; }, 180);
            if (window.soundSystem && typeof window.soundSystem.playClawMove === 'function') {
                window.soundSystem.playClawMove();
            }
        }
    }

    moveRight(amount = 35) {
        if (this.claw.state === 'finished') {
            this.resetGame();
            return;
        }
        if (this.claw.state === 'idle' || this.claw.state === 'moving') {
            this.claw.x = Math.min(this.claw.maxX, this.claw.x + amount);
            this.claw.state = 'moving';
            this.joystickTilt = 1;
            setTimeout(() => { if (!this.keys['KeyD'] && !this.keys['ArrowRight']) this.joystickTilt = 0; }, 180);
            if (window.soundSystem && typeof window.soundSystem.playClawMove === 'function') {
                window.soundSystem.playClawMove();
            }
        }
    }

    update(dt) {
        this.globalTime += dt;

        // 1. Điều khiển di chuyển cần gắp
        if (this.claw.state === 'idle' || this.claw.state === 'moving') {
            let isMoving = false;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
                this.claw.x = Math.max(this.layout.chuteX, this.claw.x - this.claw.speedX);
                this.joystickTilt = -1;
                isMoving = true;
            } else if (this.keys['KeyD'] || this.keys['ArrowRight']) {
                this.claw.x = Math.min(this.claw.maxX, this.claw.x + this.claw.speedX);
                this.joystickTilt = 1;
                isMoving = true;
            } else {
                this.joystickTilt = 0;
            }
            this.claw.state = isMoving ? 'moving' : 'idle';
        }

        // 2. Hạ cần gắp xuống sàn kính
        if (this.claw.state === 'dropping') {
            this.claw.y += this.claw.speedY;

            // Kiểm tra chạm đáy sàn hoặc chạm đầu thú bông
            let reached = this.claw.y >= this.claw.maxY;
            let target = null;
            for (const toy of this.toys) {
                if (this.claw.y + 84 >= toy.y - toy.radius && Math.abs(this.claw.x - toy.x) <= toy.radius + 22) {
                    reached = true;
                    target = toy;
                    break;
                }
            }

            if (reached) {
                this.claw.state = 'grabbing';
                this.claw.candidateToy = target;
                this.grabTimer = 0.35;
                if (window.soundSystem && typeof window.soundSystem.playPickItem === 'function') {
                    window.soundSystem.playPickItem();
                }
            }
        }

        // 3. Cần kẹp chặt lấy thú bông
        if (this.claw.state === 'grabbing') {
            this.grabTimer -= dt;
            if (this.grabTimer <= 0) {
                // Kẹp chắc chắn chú gấu bông nằm trong phạm vi cần gắp
                this.claw.grabbedItem = this.claw.candidateToy || null;
                this.claw.state = 'lifting';
            }
        }

        // 4. Kéo cần gắp lên trần kính
        if (this.claw.state === 'lifting') {
            this.claw.y -= this.claw.speedY * 0.75;
            if (this.claw.y <= this.claw.minY) {
                this.claw.y = this.claw.minY;
                this.claw.state = 'returning';
            }
        }

        // 5. Di chuyển cần về phía miệng phễu thả thưởng (x: 184)
        if (this.claw.state === 'returning') {
            if (this.claw.x > this.layout.chuteX) {
                this.claw.x = Math.max(this.layout.chuteX, this.claw.x - this.claw.speedX * 0.85);
            } else {
                this.claw.x = this.layout.chuteX;
                this.claw.state = 'dropping_prize';
            }
        }

        // 6. Nhả càng thả thú vào phễu
        if (this.claw.state === 'dropping_prize') {
            if (this.claw.grabbedItem) {
                const prize = this.claw.grabbedItem;
                this.wonToyAnim = {
                    toy: prize,
                    x: this.layout.chuteX,
                    y: this.claw.y + 55,
                    vy: 0,
                    state: 'falling_chute'
                };
                // Xóa con thú đã gắp được khỏi sàn
                this.toys = this.toys.filter(t => t.id !== prize.id);
                this.claw.grabbedItem = null;
            } else {
                this.gameResult = 'lose';
            }
            this.claw.state = 'finished';
        }

        // 7. Hiệu ứng hoạt họa thú rơi vào phễu và trượt ra cửa lấy quà
        if (this.wonToyAnim) {
            const a = this.wonToyAnim;
            if (a.state === 'falling_chute') {
                a.vy += 650 * dt;
                a.y += a.vy * dt;
                if (a.y >= this.layout.chuteY + 45) {
                    a.state = 'door_appear';
                    a.x = this.layout.doorX;
                    a.y = this.layout.doorY;
                    a.scale = 0.2;
                    a.timer = 0;
                    this.onWinPrize(a.toy);
                }
            } else if (a.state === 'door_appear') {
                a.timer += dt;
                a.scale = Math.min(1.0, a.scale + dt * 4.0);
            }
        }

        // 8. Cập nhật hạt confetti
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // 9. Cập nhật chữ nổi
        for (let i = this.floatTexts.length - 1; i >= 0; i--) {
            const ft = this.floatTexts[i];
            ft.y -= 25 * dt;
            ft.life -= dt;
            if (ft.life <= 0) this.floatTexts.splice(i, 1);
        }
    }

    onWinPrize(toy) {
        this.gameResult = 'win';
        if (window.soundSystem && typeof window.soundSystem.playClawSuccess === 'function') {
            window.soundSystem.playClawSuccess();
        }

        const itemKey = toy.itemKey || 'thu_bong_gau';
        const toyName = toy.name || 'Gấu Bông';

        if (window.gameState) {
            window.gameState.addItem(itemKey, 1);
            window.gameState.addItem('vat_pham_tro_choi', 1);
        }
        if (window.useGameStore) {
            window.useGameStore.updateStats('clawWins', 1);
        }

        if (window.uiManager) {
            window.uiManager.showToast(`🎉 XUẤT SẮC! Gắp thành công [${toyName}]! Nhận +1 ${toyName} & +1 Quà Trò Chơi 🎁`, 'success');
        }

        // Hiệu ứng pháo giấy confetti rực rỡ quanh cửa nhận thưởng
        const colors = ['#f72585', '#ffd166', '#06d6a0', '#4cc9f0', '#ffffff', '#ff70a6'];
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 5 + 2;
            this.particles.push({
                x: this.layout.doorX,
                y: this.layout.doorY,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 2.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4.5 + 2,
                life: 1.8
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.clearRect(0, 0, this.width, this.height);

        const l = this.layout;

        // 1. Phông nền phòng trò chơi Pastel Mint ấm cúng
        const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        bgGrad.addColorStop(0, '#c7edd9');
        bgGrad.addColorStop(1, '#aee2c9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Các sọc kẻ dọc pastel tinh tế
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let x = 0; x < this.width; x += 40) {
            ctx.fillRect(x, 0, 20, this.height);
        }

        // Dây cờ tam giác lễ hội trên đỉnh
        const flagColors = ['#ff70a6', '#ffd166', '#4cc9f0', '#06d6a0', '#b5179e'];
        for (let i = 0; i < 14; i++) {
            const fx = 40 + i * 42;
            ctx.fillStyle = flagColors[i % flagColors.length];
            ctx.beginPath();
            ctx.moveTo(fx, 4);
            ctx.lineTo(fx + 38, 4);
            ctx.lineTo(fx + 19, 22);
            ctx.closePath();
            ctx.fill();
        }

        // 2. Vẽ hình ảnh MÁY GẮP GẤU PASTEL HỒNG CHUẨN XÁC 100%
        if (this.machineLoaded || (this.machineImg.complete && this.machineImg.naturalWidth > 0)) {
            // Bóng đổ mềm dưới chân máy
            ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
            ctx.beginPath();
            ctx.ellipse(l.mX + l.mW / 2, l.mY + l.mH - 6, l.mW * 0.46, 16, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(this.machineImg, l.mX, l.mY, l.mW, l.mH);
        } else {
            ctx.fillStyle = '#ffb3c1';
            ctx.fillRect(l.mX, l.mY, l.mW, l.mH);
        }

        // 3. VÙNG TRONG SUỐT CỦA BUỒNG KÍNH: VẼ CÁC CHÚ THÚ BÔNG TRÊN SÀN
        // Bóng đổ của các thú bông trên sàn máy
        for (const toy of this.toys) {
            ctx.fillStyle = 'rgba(80, 40, 40, 0.22)';
            ctx.beginPath();
            ctx.ellipse(toy.x, toy.y + toy.radius - 2, toy.radius * 0.85, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            this.drawToy(ctx, toy, toy.x, toy.y);
        }

        // Nếu có con thú đang bị cần gắp kẹp chặt
        if (this.claw.grabbedItem) {
            const t = this.claw.grabbedItem;
            this.drawToy(ctx, t, this.claw.x, this.claw.y + 54);
        }

        // Nếu có con thú đang rơi trong phễu
        if (this.wonToyAnim && this.wonToyAnim.state === 'falling_chute') {
            this.drawToy(ctx, this.wonToyAnim.toy, this.wonToyAnim.x, this.wonToyAnim.y);
        }

        // 4. VẼ CẦN GẮP CƠ HỌC (CHÍNH XÁC TỪ ẢNH CẦN GẮP ĐƯỢC CUNG CẤP)
        this.drawMechanicalClaw(ctx);

        // 5. HIỆU ỨNG ÁNH SÁNG KÍNH PHẢN CHIẾU (GLASS REFLECTIONS)
        // Tạo vệt chéo ánh sáng trên mặt kính buồng gắp
        ctx.save();
        ctx.beginPath();
        ctx.rect(l.glassX, l.glassY, l.glassW, l.glassH);
        ctx.clip();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.beginPath();
        ctx.moveTo(l.glassX + 15, l.glassY);
        ctx.lineTo(l.glassX + 95, l.glassY);
        ctx.lineTo(l.glassX + 15, l.glassFloorY);
        ctx.lineTo(l.glassX - 65, l.glassFloorY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(l.glassX + 120, l.glassY);
        ctx.lineTo(l.glassX + 150, l.glassY);
        ctx.lineTo(l.glassX + 70, l.glassFloorY);
        ctx.lineTo(l.glassX + 40, l.glassFloorY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 6. PHẢN HỒI NÚT BẤM CỦA MÁY (Điều khiển trực tiếp bằng cần và nút của máy, không vẽ thêm cần đè lên ảnh gốc)
        if (this.buttonPressed) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 209, 102, 0.45)';
            ctx.beginPath();
            ctx.arc(l.buttonX, l.buttonY, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 7. VẼ THÚ BÔNG XUẤT HIỆN TẠI CỬA LẤY QUÀ DƯỚI CHÂN MÁY
        if (this.wonToyAnim && this.wonToyAnim.state === 'door_appear') {
            const a = this.wonToyAnim;
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.scale(a.scale, a.scale);

            // Vòng hào quang ngôi sao lấp lánh quanh phần thưởng
            ctx.fillStyle = 'rgba(255, 209, 102, 0.4)';
            ctx.beginPath();
            ctx.arc(0, 0, 32, 0, Math.PI * 2);
            ctx.fill();

            this.drawToy(ctx, a.toy, 0, 0);

            // Tag nhãn nhận quà
            ctx.fillStyle = '#2a9d8f';
            ctx.beginPath();
            ctx.roundRect(-60, 22, 120, 22, 11);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎁 ĐÃ VÀO BALO!', 0, 33);
            ctx.restore();
        }

        // 8. VẼ CÁC HẠT PARTICLES CONFETTI
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 9. THÔNG BÁO KẾT QUẢ KHI KẾT THÚC LƯỢT GẮP
        if (this.gameResult === 'win') {
            ctx.fillStyle = 'rgba(255, 253, 240, 0.96)';
            ctx.strokeStyle = '#2a9d8f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(160, 16, 320, 48, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#2a9d8f';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('★ CHÚC MỪNG BẠN ĐÃ GẮP THÀNH CÔNG! ★', 320, 35);
            ctx.fillStyle = '#3b2512';
            ctx.font = '12px sans-serif';
            ctx.fillText('Bấm [Chơi Lại] hoặc phím Space để tiếp tục gắp!', 320, 52);
        } else if (this.gameResult === 'lose') {
            ctx.fillStyle = 'rgba(255, 253, 240, 0.96)';
            ctx.strokeStyle = '#e63946';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(170, 16, 300, 48, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#e63946';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('TIẾC QUÁ, CÀNG GẮP BỊ TRƯỢT MẤT RỒI!', 320, 35);
            ctx.fillStyle = '#5c4731';
            ctx.font = '12px sans-serif';
            ctx.fillText('Bấm phím [Space] hoặc chạm nút để thử lại ngay!', 320, 52);
        }
    }

    drawMechanicalClaw(ctx) {
        const { x, y, state } = this.claw;
        const l = this.layout;

        // 1. Ray trượt kim loại trên trần kính
        ctx.fillStyle = '#495057';
        ctx.fillRect(l.glassX + 10, l.glassY - 3, l.glassW - 20, 5);

        // Con trượt cơ học (Trolley) di chuyển theo trục X
        ctx.fillStyle = '#ced4da';
        ctx.strokeStyle = '#343a40';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x - 14, l.glassY - 6, 28, 9);
        ctx.strokeRect(x - 14, l.glassY - 6, 28, 9);

        // 2. Dây cáp tời kim loại
        ctx.strokeStyle = '#495057';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, l.glassY + 3);
        ctx.lineTo(x, y + 6);
        ctx.stroke();

        // Điểm nối cáp tời vào đầu cần
        ctx.fillStyle = '#adb5bd';
        ctx.beginPath();
        ctx.arc(x, y + 6, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. VẼ CẦN GẮP KIM LOẠI TỪ ẢNH CỦA NGƯỜI DÙNG:
        // Khi kẹp chặt hoặc nâng lên -> Dùng claw_closed.png (Cần khép chấu)
        // Khi nghỉ, di chuyển, hạ xuống hoặc nhả thưởng -> Dùng claw_open.png (Cần mở chấu)
        const isClamping = (state === 'grabbing' || state === 'lifting' || state === 'returning');

        if (isClamping) {
            const img = this.clawClosedImg;
            if (this.clawClosedLoaded || (img.complete && img.naturalWidth > 0)) {
                // Tỉ lệ scale cân đối: rộng 46, cao 88
                const cw = 46;
                const ch = 88;
                // Cần khép có trục đứng ở giữa: x - cw / 2
                ctx.drawImage(img, x - cw / 2, y, cw, ch);
            } else {
                ctx.strokeStyle = '#adb5bd';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(x, y + 45, 18, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            const img = this.clawOpenImg;
            if (this.clawOpenLoaded || (img.complete && img.naturalWidth > 0)) {
                // Tỉ lệ scale cân đối: rộng 82, cao 90
                const ow = 82;
                const oh = 90;
                // Cần mở có trục đứng ở giữa: x - ow / 2
                ctx.drawImage(img, x - ow / 2, y, ow, oh);
            } else {
                ctx.strokeStyle = '#adb5bd';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(x, y + 45, 26, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    drawToy(ctx, toy, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Ưu tiên vẽ bằng ảnh sprite thật từ người dùng tải lên
        const toyImg = this.toyImages && this.toyImages[toy.type];
        if (toyImg && toyImg.complete && toyImg.naturalWidth > 0) {
            const size = (toy.radius || 20) * 2.3;
            ctx.drawImage(toyImg, -size / 2, -size / 2, size, size);
            ctx.restore();
            return;
        }

        if (toy.type === 'bear') {
            // GẤU TEDDY NÂU
            ctx.fillStyle = toy.earColor;
            ctx.beginPath();
            ctx.arc(-14, -13, 7, 0, Math.PI * 2);
            ctx.arc(14, -13, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = toy.color;
            ctx.beginPath();
            ctx.arc(0, 0, toy.radius, 0, Math.PI * 2);
            ctx.fill();

            // Mõm be & Mũi
            ctx.fillStyle = '#faedcd';
            ctx.beginPath();
            ctx.ellipse(0, 4, 9, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2b1b17';
            ctx.beginPath();
            ctx.arc(0, 1.5, 3, 0, Math.PI * 2);
            ctx.fill();

            // Mắt đen láy & Má hồng
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-7, -3, 2.5, 0, Math.PI * 2);
            ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 130, 150, 0.45)';
            ctx.beginPath();
            ctx.arc(-10, 4, 3.5, 0, Math.PI * 2);
            ctx.arc(10, 4, 3.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (toy.type === 'duck') {
            // VỊT VÀNG NGOAN
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(0, 0, toy.radius, 0, Math.PI * 2);
            ctx.fill();

            // Mỏ vịt cam
            ctx.fillStyle = '#f77f00';
            ctx.beginPath();
            ctx.ellipse(0, 3, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Mắt
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-6, -4, 2.5, 0, Math.PI * 2);
            ctx.arc(6, -4, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
            ctx.beginPath();
            ctx.arc(-9, 2, 3, 0, Math.PI * 2);
            ctx.arc(9, 2, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (toy.type === 'cat') {
            // MÈO CAM CUTE
            // Tai mèo
            ctx.fillStyle = '#f3722c';
            ctx.beginPath();
            ctx.moveTo(-14, -6);
            ctx.lineTo(-7, -19);
            ctx.lineTo(-2, -10);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(14, -6);
            ctx.lineTo(7, -19);
            ctx.lineTo(2, -10);
            ctx.closePath();
            ctx.fill();

            // Đầu
            ctx.fillStyle = '#f3722c';
            ctx.beginPath();
            ctx.arc(0, 0, toy.radius, 0, Math.PI * 2);
            ctx.fill();

            // Mắt híp cười
            ctx.strokeStyle = '#2b1b17';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(-6, -2, 3, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(6, -2, 3, Math.PI, 0);
            ctx.stroke();

            // Mũi tam giác hồng & râu mèo
            ctx.fillStyle = '#ff758f';
            ctx.beginPath();
            ctx.arc(0, 3, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#7c3f15';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-11, 2); ctx.lineTo(-17, 0);
            ctx.moveTo(-11, 5); ctx.lineTo(-17, 7);
            ctx.moveTo(11, 2); ctx.lineTo(17, 0);
            ctx.moveTo(11, 5); ctx.lineTo(17, 7);
            ctx.stroke();
        } else if (toy.type === 'capybara') {
            // CAPYBARA ĐIỀM TĨNH
            // Đầu hình chữ nhật bo tròn màu nâu ấm
            ctx.fillStyle = '#9c6644';
            ctx.beginPath();
            ctx.roundRect(-16, -16, 32, 32, 10);
            ctx.fill();

            // Mõm đậm
            ctx.fillStyle = '#7f4f24';
            ctx.beginPath();
            ctx.roundRect(-11, 0, 22, 14, 6);
            ctx.fill();

            // Mắt nhắm tít điềm đạm
            ctx.strokeStyle = '#2b1b17';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-12, -4); ctx.lineTo(-4, -4);
            ctx.moveTo(4, -4); ctx.lineTo(12, -4);
            ctx.stroke();

            // Quả cam trên đầu
            ctx.fillStyle = '#f77f00';
            ctx.beginPath();
            ctx.arc(0, -18, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2d6a4f';
            ctx.beginPath();
            ctx.arc(1, -23, 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (toy.type === 'cow') {
            // BÒ SỮA MINI
            // Tai & Sừng
            ctx.fillStyle = '#f4a261';
            ctx.beginPath();
            ctx.arc(-11, -12, 3.5, 0, Math.PI * 2);
            ctx.arc(11, -12, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Đầu trắng
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, toy.radius, 0, Math.PI * 2);
            ctx.fill();

            // Đốm đen
            ctx.fillStyle = '#264653';
            ctx.beginPath();
            ctx.arc(-8, -6, 6, 0, Math.PI * 2);
            ctx.fill();

            // Mõm hồng
            ctx.fillStyle = '#ffb4a2';
            ctx.beginPath();
            ctx.ellipse(0, 5, 9, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Mắt
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-5, -2, 2.5, 0, Math.PI * 2);
            ctx.arc(5, -2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (toy.type === 'star') {
            // NGÔI SAO VÀNG
            ctx.fillStyle = '#fee440';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const aOuter = (i * 72 - 90) * Math.PI / 180;
                const aInner = (i * 72 + 36 - 90) * Math.PI / 180;
                const ox = Math.cos(aOuter) * toy.radius;
                const oy = Math.sin(aOuter) * toy.radius;
                const ix = Math.cos(aInner) * (toy.radius * 0.48);
                const iy = Math.sin(aInner) * (toy.radius * 0.48);
                if (i === 0) ctx.moveTo(ox, oy);
                else ctx.lineTo(ox, oy);
                ctx.lineTo(ix, iy);
            }
            ctx.closePath();
            ctx.fill();

            // Mắt & Miệng cười
            ctx.fillStyle = '#333333';
            ctx.fillRect(-4, -2, 2.5, 2.5);
            ctx.fillRect(2, -2, 2.5, 2.5);
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 2, 3, 0, Math.PI);
            ctx.stroke();
        } else if (toy.type === 'gift') {
            // HỘP QUÀ MINI
            ctx.fillStyle = '#e63946';
            ctx.fillRect(-toy.radius, -toy.radius, toy.radius * 2, toy.radius * 2);
            // Dải ruy băng vàng
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(-4, -toy.radius, 8, toy.radius * 2);
            ctx.fillRect(-toy.radius, -4, toy.radius * 2, 8);
            // Nơ ruy băng
            ctx.beginPath();
            ctx.arc(-4, -toy.radius - 2, 4, 0, Math.PI * 2);
            ctx.arc(4, -toy.radius - 2, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// ==========================================
// ==========================================
// CLASS 2: MONSTER LANE DEFENSE (Đấu Trường Bắn Quái 3 Làn)
// ==========================================
class ShootingGalleryGame {
    constructor(canvasId) {
        this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.width = 640;
        this.height = 480;

        // 3 Làn Đường chuẩn theo bản đồ chiến trường Ảnh 1
        this.lanes = [
            { id: 0, name: 'Làn Trên (Đá Xám)', y: 122, minY: 65, maxY: 175 },
            { id: 1, name: 'Làn Giữa (Đất Vàng)', y: 248, minY: 185, maxY: 310 },
            { id: 2, name: 'Làn Dưới (Đá Rêu)', y: 374, minY: 320, maxY: 435 }
        ];

        // Trạng thái nhân vật người chơi (Pháp sư Ảnh 2)
        this.currentLane = 1; // 0: Trên, 1: Giữa, 2: Dưới
        this.playerX = 145;   // Đứng tại vị trí sau lá chắn năng lượng
        this.playerY = 248;
        this.targetY = 248;
        this.playerW = 60;
        this.playerH = 70;
        this.heroState = 'idle'; // 'idle', 'attack', 'hurt'
        this.heroAttackTimer = 0;
        this.heroHurtTimer = 0;

        this.lives = 3;
        this.maxLives = 3;
        this.score = 0;
        this.skillLevel = 1; // 1 (Cầu Băng), 2 (Đao Gió), 3 (Trảm Hoàng Kim)
        this.maxSkillLevel = 3;
        this.ultCharge = 0;  // 0 -> 100%
        this.speedBuffTimer = 0;
        this.autoShootCooldown = 0.32;
        this.autoShootTimer = 0;
        this.shakeTimer = 0;
        this.shakeMagnitude = 0;
        this.shieldHitEffect = 0;
        this.globalTime = 0;

        // 3 Đợt Quái càng về cuối càng mạnh
        this.currentWave = 1;
        this.maxWave = 3;
        this.waveState = 'intro'; // 'intro', 'fighting', 'wave_clear', 'win', 'lose'
        this.waveStateTimer = 2.4;
        this.waveMonstersLeft = 9;
        this.waveSpawnTimer = 0.8;
        this.bossInstance = null;

        // Thực thể trong game
        this.monsters = [];
        this.projectiles = [];
        this.droppedItems = [];
        this.particles = [];
        this.floatTexts = [];

        this.isRunning = false;
        this.animId = null;
        this.keys = {};
        this.rewardGiven = false;

        // 1. Phông nền bản đồ thành trì & 3 làn đường (Ảnh 1)
        this.mapImg = new Image();
        this.mapImg.src = 'assets/minigames/map_castle_defense.png';

        // 2. Pháp sư với 3 tư thế (Ảnh 2)
        this.heroImages = {
            idle: new Image(),
            attack: new Image(),
            hurt: new Image()
        };
        this.heroImages.idle.src = 'assets/minigames/hero_idle.png';
        this.heroImages.attack.src = 'assets/minigames/hero_attack.png';
        this.heroImages.hurt.src = 'assets/minigames/hero_hurt.png';

        // 3. Thanh máu & UI Hoàng Gia (Ảnh 3)
        this.uiImages = {
            banner: new Image(),
            hpBar: new Image(),
            heartFull: new Image(),
            heartEmpty: new Image(),
            iconSwords: new Image(),
            iconFlame: new Image(),
            iconCoin: new Image()
        };
        this.uiImages.banner.src = 'assets/minigames/hud_banner_ornate.png';
        this.uiImages.hpBar.src = 'assets/minigames/hud_bar_frame.png';
        this.uiImages.heartFull.src = 'assets/minigames/icon_heart_full.png';
        this.uiImages.heartEmpty.src = 'assets/minigames/icon_heart_empty.png';
        this.uiImages.iconSwords.src = 'assets/minigames/icon_swords.png';
        this.uiImages.iconFlame.src = 'assets/minigames/icon_magic_flame.png';
        this.uiImages.iconCoin.src = 'assets/minigames/icon_coin.png';

        // 4. Vật phẩm trang trí ven đường (Ảnh 4)
        this.decorImages = {
            watchtower: new Image(),
            crystal: new Image(),
            roadSign: new Image(),
            mushrooms: new Image()
        };
        this.decorImages.watchtower.src = 'assets/minigames/decor_watchtower.png';
        this.decorImages.crystal.src = 'assets/minigames/decor_magic_crystal.png';
        this.decorImages.roadSign.src = 'assets/minigames/decor_road_sign.png';
        this.decorImages.mushrooms.src = 'assets/minigames/decor_mushrooms.png';

        // 5. Sprite Kỹ Năng từ folder battle/
        this.skillSprites = {
            ice: ['437.png', '438.png', '439.png', '440.png'].map(this.loadBattleImg),
            wind: ['27219.png', '27220.png', '27221.png', '27222.png', '27223.png'].map(this.loadBattleImg),
            gold: ['2138.png', '2139.png', '2140.png', '2141.png'].map(this.loadBattleImg),
            fireWave: ['21937.png', '21938.png', '21939.png', '21940.png', '21941.png'].map(this.loadBattleImg)
        };

        // 6. Sprite Quái Vật từ folder battle/
        this.monsterSprites = {
            beast: ['22700.png', '22701.png', '22702.png', '22703.png'].map(this.loadBattleImg),
            titan: ['27353.png', '27354.png', '27355.png', '27356.png', '27357.png', '27358.png', '27359.png'].map(this.loadBattleImg)
        };

        // 7. Icon vật phẩm thưởng rơi
        this.itemImages = {
            crystal: this.loadAssetImg('assets/items/huy_hieu.png'),
            gift: this.loadAssetImg('assets/items/qua_tro_choi.png'),
            teddy: this.loadAssetImg('assets/items/gau_bong.png')
        };

        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundTouchStart = this.handleTouchStart.bind(this);
    }

    loadBattleImg(filename) {
        const relPath = `battle/${filename}`;
        const r2Url = (window.getR2Url ? window.getR2Url(relPath) : relPath);
        const img = new Image();
        img.onerror = () => {
            if (img.src === r2Url && r2Url !== relPath) {
                img.src = relPath;
            }
        };
        img.src = r2Url;
        return img;
    }

    loadAssetImg(path) {
        const r2Url = (window.getR2Url ? window.getR2Url(path) : path);
        const img = new Image();
        img.onerror = () => {
            if (img.src === r2Url && r2Url !== path) {
                img.src = path;
            }
        };
        img.src = r2Url;
        return img;
    }

    init() {
        if (!this.canvas) return;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.resetGame();

        window.removeEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keydown', this.boundKeyDown);

        window.removeEventListener('keyup', this.boundKeyUp);
        window.addEventListener('keyup', this.boundKeyUp);

        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);

        this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    }

    resetGame() {
        this.currentLane = 1;
        this.playerX = 145;
        this.playerY = this.lanes[1].y;
        this.targetY = this.lanes[1].y;
        this.heroState = 'idle';
        this.heroAttackTimer = 0;
        this.heroHurtTimer = 0;

        this.lives = 3;
        this.score = 0;
        this.skillLevel = 1;
        this.ultCharge = 0;
        this.speedBuffTimer = 0;
        this.autoShootTimer = 0;
        this.shakeTimer = 0;
        this.shakeMagnitude = 0;
        this.shieldHitEffect = 0;

        this.currentWave = 1;
        this.waveState = 'intro';
        this.waveStateTimer = 2.4;
        this.waveMonstersLeft = 9;
        this.waveSpawnTimer = 0.8;
        this.bossInstance = null;

        this.monsters = [];
        this.projectiles = [];
        this.droppedItems = [];
        this.particles = [];
        this.floatTexts = [];
        this.rewardGiven = false;
    }

    start() {
        this.resetGame();
        this.isRunning = true;
        let lastTime = performance.now();

        const loop = (currentTime) => {
            if (!this.isRunning) return;
            const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
            lastTime = currentTime;

            this.update(dt);
            this.draw();

            this.animId = requestAnimationFrame(loop);
        };

        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.boundMouseDown);
            this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        }
    }

    destroy() {
        this.stop();
    }

    handleKeyDown(e) {
        if (!this.isRunning) return;
        this.keys[e.code] = true;

        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
            e.preventDefault();
            this.moveLane(-1);
        } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
            e.preventDefault();
            this.moveLane(1);
        } else if (e.code === 'Space') {
            e.preventDefault();
            this.shoot();
        } else if (e.code === 'KeyE') {
            e.preventDefault();
            this.triggerUltimate();
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
    }

    handleMouseDown(e) {
        if (!this.isRunning) return;
        const rect = this.canvas.getBoundingClientRect();
        const canvasY = (e.clientY - rect.top) * (this.height / rect.height);

        for (const lane of this.lanes) {
            if (canvasY >= lane.minY && canvasY <= lane.maxY) {
                if (this.currentLane !== lane.id) {
                    this.setLane(lane.id);
                } else {
                    this.shoot();
                }
                break;
            }
        }
    }

    handleTouchStart(e) {
        if (!this.isRunning) return;
        if (e.cancelable) e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (!touch) return;
        const canvasY = (touch.clientY - rect.top) * (this.height / rect.height);

        for (const lane of this.lanes) {
            if (canvasY >= lane.minY && canvasY <= lane.maxY) {
                this.setLane(lane.id);
                this.shoot();
                break;
            }
        }
    }

    moveLane(dir) {
        const nextLane = Math.max(0, Math.min(this.lanes.length - 1, this.currentLane + dir));
        this.setLane(nextLane);
    }

    setLane(laneId) {
        if (this.currentLane !== laneId) {
            this.currentLane = laneId;
            this.targetY = this.lanes[this.currentLane].y;
            if (window.soundSystem && typeof window.soundSystem.playSelect === 'function') {
                window.soundSystem.playSelect();
            }

            // Hạt bụi năng lượng đổi làn
            for (let i = 0; i < 6; i++) {
                this.particles.push({
                    x: this.playerX,
                    y: this.playerY + (Math.random() - 0.5) * 20,
                    vx: -Math.random() * 3 - 1,
                    vy: (Math.random() - 0.5) * 3,
                    color: '#ffd166',
                    size: 3.5,
                    life: 0.35
                });
            }
        }
    }

    shoot() {
        if (this.waveState === 'win' || this.waveState === 'lose') {
            this.resetGame();
            return;
        }

        // Chuyển tư thế Pháp sư sang Tấn Công (Ảnh 2 giữa)
        this.heroState = 'attack';
        this.heroAttackTimer = 0.28;

        const sx = this.playerX + 38;
        const sy = this.playerY - 2;

        if (this.skillLevel === 1) {
            // CẤP 1: CẦU BĂNG THẦN TỐC (battle/437..440)
            this.projectiles.push({
                x: sx,
                y: sy,
                lane: this.currentLane,
                type: 'ice',
                level: 1,
                dmg: 25,
                vx: 560,
                vy: 0,
                pierce: 1,
                w: 42,
                h: 42,
                frameTimer: 0,
                animSpeed: 12
            });
            if (window.soundSystem && typeof window.soundSystem.playShoot === 'function') {
                window.soundSystem.playShoot();
            }
        } else if (this.skillLevel === 2) {
            // CẤP 2: LƯỠI ĐAO GIÓ XUYÊN THẤU (battle/27219..27223)
            this.projectiles.push({
                x: sx,
                y: sy,
                lane: this.currentLane,
                type: 'wind',
                level: 2,
                dmg: 45,
                vx: 720,
                vy: 0,
                pierce: 2,
                w: 64,
                h: 28,
                frameTimer: 0,
                animSpeed: 14
            });
            if (window.soundSystem && typeof window.soundSystem.playClawMove === 'function') {
                window.soundSystem.playClawMove();
            }
        } else {
            // CẤP 3 (MAX): TRẢM KÍCH HOÀNG KIM (battle/2138..2141) Bắn chùm 3 hướng
            this.projectiles.push({
                x: sx,
                y: sy,
                lane: this.currentLane,
                type: 'gold',
                level: 3,
                dmg: 75,
                vx: 760,
                vy: 0,
                pierce: 3,
                w: 68,
                h: 32,
                frameTimer: 0,
                animSpeed: 14
            });

            if (this.currentLane > 0) {
                this.projectiles.push({
                    x: sx,
                    y: sy,
                    lane: this.currentLane - 1,
                    type: 'gold',
                    level: 3,
                    dmg: 50,
                    vx: 700,
                    vy: -40,
                    pierce: 2,
                    w: 52,
                    h: 24,
                    frameTimer: 0,
                    animSpeed: 14
                });
            }
            if (this.currentLane < this.lanes.length - 1) {
                this.projectiles.push({
                    x: sx,
                    y: sy,
                    lane: this.currentLane + 1,
                    type: 'gold',
                    level: 3,
                    dmg: 50,
                    vx: 700,
                    vy: 40,
                    pierce: 2,
                    w: 52,
                    h: 24,
                    frameTimer: 0,
                    animSpeed: 14
                });
            }

            if (window.soundSystem && typeof window.soundSystem.playPowerUp === 'function') {
                window.soundSystem.playPowerUp();
            }
        }

        this.ultCharge = Math.min(100, this.ultCharge + 4);
    }

    triggerUltimate() {
        if (this.ultCharge < 100) {
            this.floatTexts.push({
                text: `CHƯA ĐỦ NĂNG LƯỢNG (${Math.floor(this.ultCharge)}/100)!`,
                x: this.playerX + 60,
                y: this.playerY - 30,
                color: '#ff4d6d',
                life: 0.8,
                maxLife: 0.8
            });
            return;
        }

        this.ultCharge = 0;
        this.shakeTimer = 0.65;
        this.shakeMagnitude = 14;
        this.heroState = 'attack';
        this.heroAttackTimer = 0.6;

        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }

        this.floatTexts.push({
            text: `🔥 HỎA LONG THẦN NỘ QUÉT SẠCH 3 LÀN! 🔥`,
            x: 320,
            y: 70,
            color: '#ffd166',
            life: 1.6,
            maxLife: 1.6
        });

        this.projectiles.push({
            x: 100,
            y: 248,
            lane: -1,
            type: 'fireWave',
            level: 4,
            dmg: 450,
            vx: 850,
            vy: 0,
            pierce: 999,
            w: 240,
            h: 320,
            frameTimer: 0,
            animSpeed: 12,
            isUlt: true
        });
    }

    spawnMonster(type = 'beast', laneIndex = undefined) {
        if (laneIndex === undefined || laneIndex < 0 || laneIndex >= this.lanes.length) {
            laneIndex = Math.floor(Math.random() * this.lanes.length);
        }
        const lane = this.lanes[laneIndex];
        let hp = 60;
        let speed = 90;
        let w = 64;
        let h = 46;
        let scoreVal = 20;

        if (type === 'beast') {
            if (this.currentWave === 1) {
                hp = 60;
                speed = 90;
            } else if (this.currentWave === 2) {
                hp = 110;
                speed = 120;
                scoreVal = 30;
            } else {
                hp = 140;
                speed = 135;
                scoreVal = 40;
            }
        } else if (type === 'armored_beast') {
            hp = 220;
            speed = 95;
            w = 72;
            h = 52;
            scoreVal = 50;
        } else if (type === 'titan') {
            hp = 1200;
            speed = 42;
            w = 128;
            h = 90;
            scoreVal = 300;
        }

        const monster = {
            id: Math.random(),
            type: type,
            lane: laneIndex,
            x: 655,
            y: lane.y,
            w: w,
            h: h,
            hp: hp,
            maxHp: hp,
            speed: speed,
            scoreVal: scoreVal,
            frameTimer: 0,
            animFrame: 0,
            isBoss: type === 'titan',
            bossStompTimer: 4.0
        };

        this.monsters.push(monster);
        if (monster.isBoss) {
            this.bossInstance = monster;
        }
    }

    startWave(waveNum) {
        this.currentWave = waveNum;
        this.waveState = 'intro';
        this.waveStateTimer = 2.4;
        this.waveSpawnTimer = 0.6;

        if (waveNum === 1) {
            this.waveMonstersLeft = 9;
        } else if (waveNum === 2) {
            this.waveMonstersLeft = 16;
        } else if (waveNum === 3) {
            this.waveMonstersLeft = 1;
        }
    }

    onWinGame() {
        if (this.rewardGiven) return;
        this.rewardGiven = true;
        this.waveState = 'win';

        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }

        let rewardList = ['+1 Huy Hiệu Dũng Sĩ 🎖️', '+1 Quà Trò Chơi 🎁'];
        if (window.gameState) {
            window.gameState.addItem('huy_hieu', 1);
            window.gameState.addItem('vat_pham_tro_choi', 1);
            window.gameState.addItem('thu_bong_gau', 1);
            rewardList.push('+1 Gấu Bông Dũng Sĩ 🧸');
        }

        if (window.useGameStore) {
            window.useGameStore.updateStats('monsterShooterWins', 1);
            window.useGameStore.updateStats('monsterShooterHighScore', this.score);
        }

        if (window.uiManager) {
            window.uiManager.showToast(`🎉 XUẤT SẮC! Phòng thủ thành công & Trảm Boss Titan! (${rewardList.join(', ')})`, 'success');
        }

        const colors = ['#e63946', '#ffd166', '#06d6a0', '#118ab2', '#ffffff', '#ff70a6'];
        for (let i = 0; i < 70; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 6 + 2;
            this.particles.push({
                x: 320,
                y: 240,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 2,
                life: 2.2
            });
        }
    }

    update(dt) {
        this.globalTime += dt;

        if (this.shakeTimer > 0) this.shakeTimer -= dt;
        if (this.shieldHitEffect > 0) this.shieldHitEffect -= dt;

        // Cập nhật trạng thái Pháp sư (Ảnh 2)
        if (this.heroHurtTimer > 0) {
            this.heroHurtTimer -= dt;
            if (this.heroHurtTimer <= 0) this.heroState = 'idle';
        } else if (this.heroAttackTimer > 0) {
            this.heroAttackTimer -= dt;
            if (this.heroAttackTimer <= 0) this.heroState = 'idle';
        }

        // Di chuyển làn mượt mà
        this.playerY += (this.targetY - this.playerY) * 16 * dt;

        // Tự động xả chiêu (Auto-Shoot)
        const currentCooldown = this.speedBuffTimer > 0 ? (this.autoShootCooldown * 0.5) : this.autoShootCooldown;
        this.autoShootTimer += dt;
        if (this.autoShootTimer >= currentCooldown && (this.waveState === 'fighting' || this.waveState === 'boss_intro')) {
            this.shoot();
            this.autoShootTimer = 0;
        }

        if (this.speedBuffTimer > 0) this.speedBuffTimer -= dt;

        // Quản lý 3 đợt quái
        if (this.waveState === 'intro') {
            this.waveStateTimer -= dt;
            if (this.waveStateTimer <= 0) this.waveState = 'fighting';
        } else if (this.waveState === 'fighting') {
            this.waveSpawnTimer -= dt;
            if (this.waveSpawnTimer <= 0 && this.waveMonstersLeft > 0) {
                if (this.currentWave === 1) {
                    const rndLane = Math.floor(Math.random() * 3);
                    this.spawnMonster('beast', rndLane);
                    this.waveMonstersLeft--;
                    this.waveSpawnTimer = 1.35 + Math.random() * 0.5;
                } else if (this.currentWave === 2) {
                    const rndLane = Math.floor(Math.random() * 3);
                    const isArmored = Math.random() < 0.35;
                    this.spawnMonster(isArmored ? 'armored_beast' : 'beast', rndLane);
                    this.waveMonstersLeft--;
                    this.waveSpawnTimer = 0.95 + Math.random() * 0.4;
                } else if (this.currentWave === 3) {
                    this.spawnMonster('titan', 1);
                    this.waveMonstersLeft = 0;
                }
            }

            if (this.waveMonstersLeft <= 0 && this.monsters.length === 0) {
                if (this.currentWave < this.maxWave) {
                    this.waveState = 'wave_clear';
                    this.waveStateTimer = 2.0;
                } else {
                    this.onWinGame();
                }
            }
        } else if (this.waveState === 'wave_clear') {
            this.waveStateTimer -= dt;
            if (this.waveStateTimer <= 0) {
                this.startWave(this.currentWave + 1);
            }
        }

        // Cập nhật quái vật di chuyển
        for (let i = this.monsters.length - 1; i >= 0; i--) {
            const m = this.monsters[i];
            m.x -= m.speed * dt;
            m.frameTimer += dt * (m.isBoss ? 7 : 9);

            const maxF = m.isBoss ? this.monsterSprites.titan.length : this.monsterSprites.beast.length;
            m.animFrame = Math.floor(m.frameTimer) % maxF;

            // Boss triệu hồi quái
            if (m.isBoss) {
                m.bossStompTimer -= dt;
                if (m.bossStompTimer <= 0) {
                    m.bossStompTimer = 4.2;
                    this.spawnMonster('beast', 0);
                    this.spawnMonster('beast', 2);
                    this.floatTexts.push({
                        text: `⚠️ BOSS GẦM THÉT TRIỆU HỒI QUÁI!`,
                        x: m.x,
                        y: m.y - 65,
                        color: '#ff4d6d',
                        life: 1.0,
                        maxLife: 1.0
                    });
                }
            }

            // Quái chạm Vành Đai Năng Lượng (Ảnh 1: Red Arc Shield ở X <= 165)
            if (m.x <= 168) {
                this.lives--;
                this.shakeTimer = 0.4;
                this.shakeMagnitude = 11;
                this.shieldHitEffect = 0.45;

                // Pháp sư trúng đòn choáng váng (Ảnh 2 phải: hero_hurt)
                this.heroState = 'hurt';
                this.heroHurtTimer = 0.55;

                if (window.soundSystem && typeof window.soundSystem.playHurt === 'function') {
                    window.soundSystem.playHurt();
                }

                this.floatTexts.push({
                    text: `💥 LÁ CHẮN BỊ VA CHẠM! -1 TIM!`,
                    x: 210,
                    y: m.y,
                    color: '#ff4d6d',
                    life: 1.0,
                    maxLife: 1.0
                });

                // Hạt điện giật đỏ tóe ra từ lá chắn
                for (let pt = 0; pt < 10; pt++) {
                    this.particles.push({
                        x: 165,
                        y: m.y + (Math.random() - 0.5) * 30,
                        vx: Math.random() * 4 + 1,
                        vy: (Math.random() - 0.5) * 5,
                        color: '#ff4d6d',
                        size: 3.5,
                        life: 0.4
                    });
                }

                this.monsters.splice(i, 1);

                if (this.lives <= 0) {
                    this.lives = 0;
                    this.waveState = 'lose';
                }
                continue;
            }
        }

        // Cập nhật đường bay kỹ năng
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.frameTimer += dt;

            for (let mIdx = this.monsters.length - 1; mIdx >= 0; mIdx--) {
                const m = this.monsters[mIdx];
                const sameLane = p.isUlt || (p.lane === m.lane);
                if (!sameLane) continue;

                if (Math.abs(p.x - m.x) < (p.w / 2 + m.w / 2) && Math.abs(p.y - m.y) < (p.h / 2 + m.h / 2)) {
                    m.hp -= p.dmg;

                    this.floatTexts.push({
                        text: `-${p.dmg}`,
                        x: m.x + (Math.random() - 0.5) * 20,
                        y: m.y - 15,
                        color: p.level >= 3 ? '#ffd166' : '#90e0ef',
                        life: 0.6,
                        maxLife: 0.6
                    });

                    for (let pt = 0; pt < 5; pt++) {
                        this.particles.push({
                            x: m.x,
                            y: m.y,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            color: p.level >= 3 ? '#ffd166' : '#4cc9f0',
                            size: 3,
                            life: 0.35
                        });
                    }

                    if (m.hp <= 0) {
                        this.score += m.scoreVal;

                        // Rơi vật phẩm nâng cấp skill tỉ lệ vừa vừa (~32%)
                        if (Math.random() < 0.32 || m.isBoss) {
                            const rndDrop = Math.random();
                            let itemType = 'skill_crystal';
                            if (rndDrop < 0.60) {
                                itemType = 'skill_crystal';
                            } else if (rndDrop < 0.80) {
                                itemType = 'speed_buff';
                            } else {
                                itemType = 'heart';
                            }

                            this.droppedItems.push({
                                type: itemType,
                                x: m.x,
                                y: m.y,
                                lane: m.lane,
                                timer: 0
                            });
                        }

                        for (let pt = 0; pt < 12; pt++) {
                            this.particles.push({
                                x: m.x,
                                y: m.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                color: '#e63946',
                                size: 4,
                                life: 0.5
                            });
                        }

                        this.monsters.splice(mIdx, 1);
                    }

                    p.pierce--;
                    if (p.pierce <= 0) break;
                }
            }

            if (p.pierce <= 0 || p.x > this.width + 100) {
                this.projectiles.splice(i, 1);
            }
        }

        // Cập nhật vật phẩm rơi & Tự động bay về hút vào Pháp sư
        for (let i = this.droppedItems.length - 1; i >= 0; i--) {
            const it = this.droppedItems[i];
            it.timer += dt;

            if (it.timer > 0.45) {
                const dx = this.playerX - it.x;
                const dy = this.playerY - it.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 28 || it.timer > 3.0) {
                    if (it.type === 'skill_crystal') {
                        if (this.skillLevel < this.maxSkillLevel) {
                            this.skillLevel++;
                            const skillNames = ['', 'CẦU BĂNG', 'ĐAO GIÓ', 'HOÀNG KIM TRẢM'];
                            this.floatTexts.push({
                                text: `⚡ SKILL UPGRADE! CẤP ${this.skillLevel}: ${skillNames[this.skillLevel]}!`,
                                x: this.playerX + 40,
                                y: this.playerY - 35,
                                color: '#ffd166',
                                life: 1.3,
                                maxLife: 1.3
                            });
                        } else {
                            this.score += 50;
                            this.ultCharge = Math.min(100, this.ultCharge + 35);
                            this.floatTexts.push({
                                text: `⚡ SKILL MAX! NẠP +35% CHIÊU CUỐI!`,
                                x: this.playerX + 40,
                                y: this.playerY - 35,
                                color: '#4cc9f0',
                                life: 1.1,
                                maxLife: 1.1
                            });
                        }
                    } else if (it.type === 'heart') {
                        this.lives = Math.min(this.maxLives, this.lives + 1);
                        this.floatTexts.push({
                            text: `💖 +1 MẠNG PHÒNG THỦ!`,
                            x: this.playerX + 40,
                            y: this.playerY - 35,
                            color: '#ff70a6',
                            life: 1.1,
                            maxLife: 1.1
                        });
                    } else if (it.type === 'speed_buff') {
                        this.speedBuffTimer = 6.0;
                        this.floatTexts.push({
                            text: `⚡ BÙA TỐC ĐÁNH X2 (6s)!`,
                            x: this.playerX + 40,
                            y: this.playerY - 35,
                            color: '#06d6a0',
                            life: 1.1,
                            maxLife: 1.1
                        });
                    }

                    if (window.soundSystem && typeof window.soundSystem.playPowerUp === 'function') {
                        window.soundSystem.playPowerUp();
                    }

                    this.droppedItems.splice(i, 1);
                    continue;
                } else {
                    it.x += (dx / dist) * 280 * dt;
                    it.y += (dy / dist) * 280 * dt;
                }
            }
        }

        // Chữ bay
        for (let i = this.floatTexts.length - 1; i >= 0; i--) {
            const ft = this.floatTexts[i];
            ft.y -= 26 * dt;
            ft.life -= dt;
            if (ft.life <= 0) this.floatTexts.splice(i, 1);
        }

        // Hạt
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.save();

        if (this.shakeTimer > 0) {
            const ox = (Math.random() - 0.5) * this.shakeMagnitude;
            const oy = (Math.random() - 0.5) * this.shakeMagnitude;
            ctx.translate(ox, oy);
        }

        ctx.clearRect(0, 0, this.width, this.height);

        // 1. VẼ BẢN ĐỒ THÀNH TRÌ & 3 LÀN ĐƯỜNG (ẢNH 1 CHUẨN XÁC)
        if (this.mapImg.complete && this.mapImg.naturalWidth > 0) {
            ctx.drawImage(this.mapImg, 0, 0, this.width, this.height);
        } else {
            // Dự phòng nền
            ctx.fillStyle = '#221929';
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // 2. VẼ CÁC VẬT PHẨM TRANG TRÍ VEN ĐƯỜNG (ẢNH 4)
        this.drawRoadsideDecorations(ctx);

        // 3. HIỆU ỨNG VÀNH ĐAI LÁ CHẮN NĂNG LƯỢNG (ENERGY SHIELD)
        this.drawEnergyShield(ctx);

        // 4. VẼ VẬT PHẨM RƠI TRÊN LÀN
        for (const it of this.droppedItems) {
            ctx.save();
            ctx.translate(it.x, it.y);

            const pulse = (Math.sin(this.globalTime * 8) + 1) * 0.5;
            ctx.fillStyle = `rgba(255, 209, 102, ${0.3 + pulse * 0.4})`;
            ctx.beginPath();
            ctx.arc(0, 0, 18 + pulse * 4, 0, Math.PI * 2);
            ctx.fill();

            if (it.type === 'skill_crystal') {
                if (this.uiImages.iconFlame.complete && this.uiImages.iconFlame.naturalWidth > 0) {
                    ctx.drawImage(this.uiImages.iconFlame, -13, -13, 26, 26);
                } else {
                    ctx.font = '20px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💎', 0, 0);
                }
            } else if (it.type === 'heart') {
                if (this.uiImages.heartFull.complete && this.uiImages.heartFull.naturalWidth > 0) {
                    ctx.drawImage(this.uiImages.heartFull, -13, -14, 26, 28);
                } else {
                    ctx.font = '20px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💖', 0, 0);
                }
            } else if (it.type === 'speed_buff') {
                ctx.font = '22px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⚡', 0, 0);
            }
            ctx.restore();
        }

        // 5. VẼ QUÁI VẬT TỪ SPRITE BATTLE
        for (const m of this.monsters) {
            ctx.save();
            ctx.translate(m.x, m.y);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.beginPath();
            ctx.ellipse(0, m.h / 2 - 2, m.w * 0.45, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Lật mặt quái sang trái đối diện Pháp sư
            ctx.scale(-1, 1);

            let spriteArray = m.isBoss ? this.monsterSprites.titan : this.monsterSprites.beast;
            let spr = spriteArray[m.animFrame % spriteArray.length];

            if (spr && spr.complete && spr.naturalWidth > 0) {
                ctx.drawImage(spr, -m.w / 2, -m.h / 2, m.w, m.h);
            } else {
                ctx.fillStyle = m.isBoss ? '#7b2cbf' : '#e63946';
                ctx.fillRect(-m.w / 2, -m.h / 2, m.w, m.h);
            }

            ctx.scale(-1, 1);
            if (!m.isBoss) {
                const hpPct = Math.max(0, m.hp / m.maxHp);
                ctx.fillStyle = '#000000';
                ctx.fillRect(-m.w / 2, -m.h / 2 - 10, m.w, 5);
                ctx.fillStyle = '#2ec4b6';
                ctx.fillRect(-m.w / 2, -m.h / 2 - 10, m.w * hpPct, 5);
            }

            ctx.restore();
        }

        // 6. VẼ ĐẠN KỸ NĂNG BAY TRÊN LÀN
        for (const p of this.projectiles) {
            ctx.save();
            ctx.translate(p.x, p.y);

            if (p.isUlt) {
                const fIdx = Math.floor(p.frameTimer * p.animSpeed) % this.skillSprites.fireWave.length;
                const spr = this.skillSprites.fireWave[fIdx];
                if (spr && spr.complete && spr.naturalWidth > 0) {
                    ctx.drawImage(spr, -p.w / 2, -p.h / 2, p.w, p.h);
                }
            } else if (p.type === 'ice') {
                const fIdx = Math.floor(p.frameTimer * p.animSpeed) % this.skillSprites.ice.length;
                const spr = this.skillSprites.ice[fIdx];
                if (spr && spr.complete && spr.naturalWidth > 0) {
                    ctx.drawImage(spr, -p.w / 2, -p.h / 2, p.w, p.h);
                }
            } else if (p.type === 'wind') {
                const fIdx = Math.floor(p.frameTimer * p.animSpeed) % this.skillSprites.wind.length;
                const spr = this.skillSprites.wind[fIdx];
                if (spr && spr.complete && spr.naturalWidth > 0) {
                    ctx.drawImage(spr, -p.w / 2, -p.h / 2, p.w, p.h);
                }
            } else if (p.type === 'gold') {
                const fIdx = Math.floor(p.frameTimer * p.animSpeed) % this.skillSprites.gold.length;
                const spr = this.skillSprites.gold[fIdx];
                if (spr && spr.complete && spr.naturalWidth > 0) {
                    ctx.drawImage(spr, -p.w / 2, -p.h / 2, p.w, p.h);
                }
            }

            ctx.restore();
        }

        // 7. VẼ PHÁP SƯ TỪ BẢN VẼ CHUẨN (ẢNH 2)
        this.drawHeroWizard(ctx);

        // 8. VẼ HẠT & CHỮ NỔI SÁT THƯƠNG
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const ft of this.floatTexts) {
            const alpha = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.globalAlpha = 1.0;
        }

        // 9. THANH MÁU BOSS BẰNG KHUNG VÀNG (ẢNH 3: hud_bar_frame.png)
        if (this.bossInstance && this.bossInstance.hp > 0) {
            const boss = this.bossInstance;
            const bPct = Math.max(0, boss.hp / boss.maxHp);

            ctx.save();
            // Khung vàng thanh máu
            if (this.uiImages.hpBar.complete && this.uiImages.hpBar.naturalWidth > 0) {
                ctx.drawImage(this.uiImages.hpBar, 140, 52, 360, 26);
            }

            // Phần máu tô đầy
            const hpGrad = ctx.createLinearGradient(190, 56, 480, 72);
            hpGrad.addColorStop(0, '#e63946');
            hpGrad.addColorStop(1, '#ff758f');
            ctx.fillStyle = hpGrad;
            ctx.beginPath();
            ctx.roundRect(192, 57, 290 * bPct, 15, 6);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`👑 BOSS TITAN: ${Math.max(0, Math.ceil(boss.hp))} / ${boss.maxHp}`, 320, 69);
            ctx.restore();
        }

        // 10. BẢNG HUD HOÀNG GIA TRÊN CÙNG (ẢNH 3: hud_banner_ornate.png & icons)
        this.drawHUD(ctx);

        // 11. BẢNG THÔNG BÁO KẾT QUẢ / GIAI ĐOẠN ĐỢT
        if (this.waveState === 'intro') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(100, 190, 440, 75);
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(100, 190, 440, 75);

            ctx.fillStyle = '#ffd166';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            const waveTitles = ['', '⚔️ ĐỢT 1: QUÁI TIÊN PHONG BẮT ĐẦU!', '🔥 ĐỢT 2: ĐỘI QUÂN QUỶ DỮ TẤN CÔNG!', '💀 ĐỢT 3: ĐẠI BOSS TITAN XUẤT HIỆN!'];
            ctx.fillText(waveTitles[this.currentWave], 320, 226);

            ctx.fillStyle = '#ffffff';
            ctx.font = '13px sans-serif';
            ctx.fillText('Đổi làn [W / S] và Bắn skill [Space / Click] để phòng thủ!', 320, 250);
        } else if (this.waveState === 'wave_clear') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(140, 195, 360, 65);
            ctx.strokeStyle = '#2ec4b6';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(140, 195, 360, 65);

            ctx.fillStyle = '#2ec4b6';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`🎉 ĐÃ QUÉT SẠCH ĐỢT ${this.currentWave}!`, 320, 235);
        } else if (this.waveState === 'win') {
            this.drawWinModal(ctx);
        } else if (this.waveState === 'lose') {
            this.drawLoseModal(ctx);
        }

        ctx.restore();
    }

    drawRoadsideDecorations(ctx) {
        // 1. Tháp Canh Cổ Kính có cờ đỏ (Ảnh 4 trên trái) - đặt tại chốt tiền đồn bên phải rừng cây
        if (this.decorImages.watchtower.complete && this.decorImages.watchtower.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.watchtower, 560, 6, 48, 60);
        }

        // 2. Biển Chỉ Dẫn Bằng Gỗ (Ảnh 4 dưới trái) đặt gọn gàng trên thảm cỏ dải phân cách giữa làn 0 và làn 1
        if (this.decorImages.roadSign.complete && this.decorImages.roadSign.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.roadSign, 210, 162, 30, 44);
        }

        // 3. Pha Lê Ma Thuật Lam phát sáng (Ảnh 4 trên phải) đặt trên thảm cỏ dải phân cách giữa làn 1 và làn 2
        if (this.decorImages.crystal.complete && this.decorImages.crystal.naturalWidth > 0) {
            ctx.save();
            const pulse = (Math.sin(this.globalTime * 5) + 1) * 0.5;
            ctx.fillStyle = `rgba(0, 220, 255, ${0.15 + pulse * 0.25})`;
            ctx.beginPath();
            ctx.arc(448, 312, 20 + pulse * 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(this.decorImages.crystal, 430, 292, 36, 40);
            ctx.restore();
        }

        // 4. Cụm Nấm Thần Kỳ phát sáng (Ảnh 4 dưới phải) ở thảm cỏ xanh rậm rạp dưới chân thành
        if (this.decorImages.mushrooms.complete && this.decorImages.mushrooms.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.mushrooms, 270, 432, 44, 38);
        }
    }

    drawEnergyShield(ctx) {
        // Vành đai lá chắn năng lượng màu đỏ hình vòng cung (Chuẩn theo Ảnh 1)
        ctx.save();
        const pulse = (Math.sin(this.globalTime * 6) + 1) * 0.5;
        const hitBoost = this.shieldHitEffect > 0 ? 0.45 : 0;

        ctx.strokeStyle = `rgba(255, 77, 109, ${0.4 + pulse * 0.3 + hitBoost})`;
        ctx.lineWidth = 3 + pulse * 2;
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 10 + pulse * 8;

        ctx.beginPath();
        ctx.ellipse(156, 248, 26, 175, 0, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        ctx.restore();
    }

    drawHeroWizard(ctx) {
        ctx.save();
        ctx.translate(this.playerX, this.playerY);

        // Vòng hào quang năng lượng dưới chân pháp sư
        const auraColor = this.skillLevel === 1 ? 'rgba(76, 201, 240, 0.32)' :
                         this.skillLevel === 2 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 209, 102, 0.55)';
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.ellipse(0, 30, 24, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ Pháp Sư chuẩn 100% từ Ảnh 2
        let heroImg = this.heroImages.idle;
        let drawW = 60;
        let drawH = 70;
        let offX = -28;
        let offY = -42;

        if (this.heroState === 'hurt') {
            // Tư thế Choáng váng / Trúng đòn (Ảnh 2 bên phải: hero_hurt)
            heroImg = this.heroImages.hurt;
            drawW = 66;
            drawH = 70;
            offX = -32;
        } else if (this.heroState === 'attack') {
            // Tư thế Tấn công phóng chiêu (Ảnh 2 ở giữa: hero_attack)
            heroImg = this.heroImages.attack;
            drawW = 86;
            drawH = 68;
            offX = -28;
        }

        if (heroImg.complete && heroImg.naturalWidth > 0) {
            ctx.drawImage(heroImg, offX, offY, drawW, drawH);
        } else {
            // Dự phòng
            ctx.fillStyle = '#4cc9f0';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawHUD(ctx) {
        // 1. Khung Banner Hoàng Gia Cánh Vàng (Ảnh 3: hud_banner_ornate.png)
        if (this.uiImages.banner.complete && this.uiImages.banner.naturalWidth > 0) {
            ctx.drawImage(this.uiImages.banner, 130, 8, 380, 42);
        } else {
            ctx.fillStyle = 'rgba(25, 20, 35, 0.92)';
            ctx.fillRect(130, 8, 380, 42);
        }

        // 2. Trái Tim Mạng Sống (Ảnh 3: icon_heart_full.png & icon_heart_empty.png)
        for (let i = 0; i < this.maxLives; i++) {
            const hx = 18 + i * 28;
            const hy = 14;
            if (i < this.lives) {
                if (this.uiImages.heartFull.complete && this.uiImages.heartFull.naturalWidth > 0) {
                    ctx.drawImage(this.uiImages.heartFull, hx, hy, 26, 28);
                } else {
                    ctx.font = '20px sans-serif';
                    ctx.fillText('❤️', hx, hy + 22);
                }
            } else {
                if (this.uiImages.heartEmpty.complete && this.uiImages.heartEmpty.naturalWidth > 0) {
                    ctx.drawImage(this.uiImages.heartEmpty, hx, hy + 3, 26, 22);
                } else {
                    ctx.font = '20px sans-serif';
                    ctx.fillText('🖤', hx, hy + 22);
                }
            }
        }

        // 3. Thông tin trên Banner Hoàng Gia:
        // Đợt quái
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`⚔️ ĐỢT ${this.currentWave}/${this.maxWave}`, 190, 33);

        // Icon Lửa Ma Thuật + Cấp Kỹ Năng (Ảnh 3: icon_magic_flame.png)
        if (this.uiImages.iconFlame.complete && this.uiImages.iconFlame.naturalWidth > 0) {
            ctx.drawImage(this.uiImages.iconFlame, 280, 16, 24, 24);
        }
        const skillNames = ['', 'CẦU BĂNG', 'ĐAO GIÓ', 'HOÀNG KIM TRẢM'];
        const skillColors = ['', '#4cc9f0', '#ffffff', '#ffd166'];
        ctx.fillStyle = skillColors[this.skillLevel];
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`CẤP ${this.skillLevel}: ${skillNames[this.skillLevel]}`, 310, 32);

        // Icon Đồng Tiền Vàng + Điểm Số (Ảnh 3: icon_coin.png)
        if (this.uiImages.iconCoin.complete && this.uiImages.iconCoin.naturalWidth > 0) {
            ctx.drawImage(this.uiImages.iconCoin, 415, 16, 24, 24);
        }
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${this.score}`, 445, 33);

        // 4. Thanh Nạp Chiêu Cuối (Góc trên bên phải)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(this.width - 110, 16, 95, 22);
        ctx.fillStyle = this.ultCharge >= 100 ? '#ffd166' : '#ff4d6d';
        ctx.fillRect(this.width - 110, 16, (this.ultCharge / 100) * 95, 22);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.width - 110, 16, 95, 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.ultCharge >= 100 ? '🔥 SẴN SÀNG [E]!' : `CHIÊU CUỐI ${Math.floor(this.ultCharge)}%`, this.width - 62, 31);
    }

    drawWinModal(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(90, 120, 460, 220);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 3;
        ctx.strokeRect(90, 120, 460, 220);

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ CHIẾN THẮNG HUY HOÀNG! ★', 320, 165);

        ctx.fillStyle = '#ffffff';
        ctx.font = '15px sans-serif';
        ctx.fillText(`Bạn đã bảo vệ thành trì vững chắc & Trảm Boss Titan!`, 320, 202);

        ctx.fillStyle = '#4cc9f0';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`Tổng điểm diệt quái: ${this.score} điểm • Skill Max Cấp 3!`, 320, 235);

        ctx.fillStyle = '#2ec4b6';
        ctx.font = '13px sans-serif';
        ctx.fillText('🎖️ Đã nhận Huy Hiệu Dũng Sĩ, Quà Trò Chơi & Gấu Bông vào Balo!', 320, 270);

        ctx.fillStyle = '#f4a261';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Nhấn Chơi Lại hoặc đóng bảng để tiếp tục dạo chơi', 320, 305);
    }

    drawLoseModal(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(110, 140, 420, 180);
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(110, 140, 420, 180);

        ctx.fillStyle = '#ff758f';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LÁ CHẮN THÀNH TRÌ ĐÃ BỊ CHỌC THỦNG!', 320, 185);

        ctx.fillStyle = '#cccccc';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Bạn đã chiến đấu dũng cảm đến Đợt ${this.currentWave} (${this.score} điểm)`, 320, 222);

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Hãy chú ý đổi làn W/S linh hoạt và nhặt ngọc nâng cấp kỹ năng!', 320, 258);

        ctx.fillStyle = '#faedcd';
        ctx.font = '11px sans-serif';
        ctx.fillText('Nhấn Chơi Lại để thử sức lần nữa!', 320, 290);
    }
}


class CowPullingGame {
    constructor(canvasId) {
        this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.width = 640;
        this.height = 480;

        // Điểm số & Mục tiêu gom hết 4 quà (250đ)
        this.score = 0;
        this.targetScore = 250;
        this.combo = 0;
        this.maxCombo = 0;
        this.state = 'playing'; // 'playing', 'win', 'lose'
        this.loseReason = 'miss'; // 'miss', 'escaped'
        this.isRunning = false;
        this.rewardGiven = false;
        this.globalTime = 0;
        this.animId = null;

        // Vị trí người chơi trên bục gỗ bên trái
        this.player = {
            x: 135,
            y: 230,
            handX: 165,
            handY: 185,
            twirlAngle: 0,
            pullAnim: 0
        };

        // Kim ngắm & Thòng lọng
        this.aimer = {
            angle: 0.15,
            minAngle: -0.65, // ~ -37 độ
            maxAngle: 0.72,  // ~ +41 độ
            speed: 1.8,
            dir: 1,
            manualControl: false,
            aimDist: 220,
            mouseX: 370,
            mouseY: 230
        };

        this.lasso = {
            state: 'ready', // 'ready', 'throwing', 'struggling', 'missed'
            tipX: 165,
            tipY: 185,
            vx: 0,
            vy: 0,
            length: 0,
            maxLength: 540,
            speed: 1050,
            caughtCow: null,
            angle: 0
        };

        // Tiến trình giằng co kéo bò (Tug-of-war mash progress: 0 -> 100)
        this.struggleProgress = 40;
        this.pullMeterPunch = 0; // Độ nảy lực khi ấn phím

        // 4 LÀN ĐƯỜNG ĐUA CHẠY THẲNG THEO MAP BACKGROUND (Chạy từ trên xuống dưới - đầu đi trước, không quay, không đi ngược)
        this.lanes = [
            { id: 0, x: 290, baseSpeed: 125, name: 'Làn 1' },
            { id: 1, x: 370, baseSpeed: 105, name: 'Làn 2 (Chậm Dễ Trúng)' },
            { id: 2, x: 445, baseSpeed: 165, name: 'Làn 3 (Trục Chính Nhanh)' },
            { id: 3, x: 520, baseSpeed: 135, name: 'Làn 4 (Bên Phải)' }
        ];

        // Danh sách các chú bò đang chạy thẳng từ trên xuống dưới
        this.cows = [];

        // Hệ thống 4 Mốc Quà Tặng
        this.milestones = [
            { req: 50, name: 'Sữa Bò Tươi', icon: '🥛', itemKey: 'sua_bo_tuoi', unlocked: false },
            { req: 100, name: 'Phô Mai', icon: '🧀', itemKey: 'pho_mai', unlocked: false },
            { req: 180, name: 'Bánh Kem Dâu', icon: '🍰', itemKey: 'bo_bong_mini', unlocked: false },
            { req: 250, name: 'Hộp Quà Thần Tài', icon: '🎁', itemKey: 'bua_may_man', unlocked: false }
        ];

        this.particles = [];
        this.floatTexts = [];
        this.fxList = [];
        this.electricBolts = [];

        // Tải toàn bộ Frame đồ họa người dùng cung cấp (Đã làm sạch bóng cyan hoàn toàn)
        this.images = {
            mapBg: this.loadAssetImg('assets/cow_game/map_bg.jpg'),
            cowDairyRun: this.loadAssetImg('assets/cow_game/cow_dairy_run.png'),
            cowBrownRun: this.loadAssetImg('assets/cow_game/cow_brown_run.png'),
            cowGoldRun: this.loadAssetImg('assets/cow_game/cow_gold_run.png'),
            cowDairyDizzy: this.loadAssetImg('assets/cow_game/cow_dairy_dizzy.png'),
            cowBrownScared: this.loadAssetImg('assets/cow_game/cow_brown_scared.png'),
            cowGoldShocked: this.loadAssetImg('assets/cow_game/cow_gold_shocked.png'),
            cowboyIdle: this.loadAssetImg('assets/cow_game/cowboy_idle.png'),
            cowboyThrow: this.loadAssetImg('assets/cow_game/cowboy_throw.png'),
            cowboyPull: this.loadAssetImg('assets/cow_game/cowboy_pull.png'),
            cowboyWin: this.loadAssetImg('assets/cow_game/cowboy_win.png'),
            lassoLoopFly: this.loadAssetImg('assets/cow_game/lasso_loop_fly.png'),
            lassoLoopCaught: this.loadAssetImg('assets/cow_game/lasso_loop_caught.png'),
            ropeSegment: this.loadAssetImg('assets/cow_game/rope_segment.png'),
            reticle: this.loadAssetImg('assets/cow_game/reticle.png'),
            hudTopFrame: this.loadAssetImg('assets/cow_game/hud_top_frame.png'),
            pullMeterFrame: this.loadAssetImg('assets/cow_game/pull_meter_frame.png'),
            medalMilk: this.loadAssetImg('assets/cow_game/medal_milk.png'),
            medalCheese: this.loadAssetImg('assets/cow_game/medal_cheese.png'),
            medalCake: this.loadAssetImg('assets/cow_game/medal_cake.png'),
            medalGift: this.loadAssetImg('assets/cow_game/medal_gift.png'),
            badgeGreen: this.loadAssetImg('assets/cow_game/badge_green.png'),
            badgeBlue: this.loadAssetImg('assets/cow_game/badge_blue.png'),
            badgeRed: this.loadAssetImg('assets/cow_game/badge_red.png'),
            fxDust: this.loadAssetImg('assets/cow_game/fx_dust.png'),
            fxSpark: this.loadAssetImg('assets/cow_game/fx_spark.png'),
            decorHaybale: this.loadAssetImg('assets/cow_game/decor_haybale.png'),
            decorBush: this.loadAssetImg('assets/cow_game/decor_bush.png')
        };

        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundTouchStart = this.handleTouchStart.bind(this);
    }

    loadAssetImg(src) {
        if (typeof Image === 'undefined') return null;
        const img = new Image();
        img.src = src;
        return img;
    }

    init() {
        if (!this.canvas) return;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.state = 'playing';
        this.loseReason = 'miss';
        this.rewardGiven = false;
        this.globalTime = 0;
        this.struggleProgress = 40;
        this.pullMeterPunch = 0;
        this.cows = [];
        this.particles = [];
        this.floatTexts = [];
        this.fxList = [];
        this.electricBolts = [];

        this.lasso.state = 'ready';
        this.lasso.caughtCow = null;
        this.lasso.tipX = this.player.handX;
        this.lasso.tipY = this.player.handY;

        this.milestones.forEach(m => m.unlocked = false);

        // Sinh đàn bò xuất phát so le trên 4 làn chạy từ TRÊN XUỐNG DƯỚI (đầu đi trước, chuẩn 100%)
        this.spawnInitialLaneCows();

        // Gắn sự kiện điều khiển
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
        window.addEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keyup', this.boundKeyUp);

        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });

        this.isRunning = true;
    }

    start() {
        this.init();
        let lastTime = performance.now();
        const loop = (now) => {
            if (!this.isRunning) return;
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            this.update(dt);
            this.draw();
            this.animId = requestAnimationFrame(loop);
        };
        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.boundMouseMove);
            this.canvas.removeEventListener('mousedown', this.boundMouseDown);
            this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        }
    }

    resetGame() {
        this.init();
    }

    spawnInitialLaneCows() {
        // Sinh 5 chú bò ban đầu rải đều trên 4 làn chạy từ trên xuống
        this.spawnCowOnLane(0, 140);
        this.spawnCowOnLane(1, 270);
        this.spawnCowOnLane(2, 70);
        this.spawnCowOnLane(3, 380);
        this.spawnCowOnLane(2, 450);
    }

    spawnCowOnLane(laneIndex, initialY = null) {
        const lane = this.lanes[laneIndex];
        // Xuất phát từ phía trên màn hình (y < 0)
        const y = initialY !== null ? initialY : (-80 - Math.random() * 40);

        const rand = Math.random();
        let points = 25;
        let tier = 'common';
        let bodyType = 'dairy';
        let scale = 1.0;
        let speed = lane.baseSpeed * (0.92 + Math.random() * 0.16);
        let resistance = 14;
        let pullPower = 11.5;
        let hitRadius = 35;
        let name = 'Bò Sữa Đốm';

        if (rand < 0.35) {
            points = 25;
            tier = 'common';
            bodyType = 'dairy';
            scale = 0.96;
            resistance = 11;
            pullPower = 12.5;
            name = 'Bò Sữa Đốm';
        } else if (rand < 0.65) {
            points = 45;
            tier = 'uncommon';
            bodyType = 'brown';
            scale = 1.02;
            speed *= 1.12;
            resistance = 15.5;
            pullPower = 10.5;
            name = 'Bò Mộng Lực Lưỡng';
        } else if (rand < 0.88) {
            points = 60;
            tier = 'rare';
            bodyType = 'brown';
            scale = 1.06;
            speed *= 1.18;
            resistance = 18;
            pullPower = 9.2;
            name = 'Bò Nâu Chiến Binh';
        } else {
            // Bò Thần Tài Hoàng Gia (100đ - 120đ)
            points = Math.random() < 0.5 ? 100 : 120;
            tier = 'legendary';
            bodyType = 'golden_bull';
            scale = 1.12;
            speed *= 1.25;
            resistance = 21;
            pullPower = 8.2;
            name = 'Bò Thần Tài Kim Cương';
        }

        const cow = {
            laneIndex: laneIndex,
            x: lane.x,
            y: y,
            speed: speed,
            points: points,
            tier: tier,
            name: name,
            bodyType: bodyType,
            scale: scale,
            hitRadius: hitRadius,
            resistance: resistance,
            pullPower: pullPower,
            capturedBaseX: 0,
            capturedBaseY: 0,
            isCaught: false,
            animTimer: Math.random() * 5
        };

        this.cows.push(cow);
        return cow;
    }

    pull() {
        if (this.state !== 'playing') return;

        // Nếu đang ở trạng thái ngắm sẵn sàng -> Phóng thòng lọng ném dây
        if (this.lasso.state === 'ready') {
            const angle = this.aimer.angle;
            this.lasso.state = 'throwing';
            this.lasso.angle = angle;
            this.lasso.tipX = this.player.handX;
            this.lasso.tipY = this.player.handY;
            this.lasso.vx = Math.cos(angle) * this.lasso.speed;
            this.lasso.vy = Math.sin(angle) * this.lasso.speed;
            this.lasso.length = 0;
            this.lasso.caughtCow = null;
            this.player.pullAnim = 0.3;

            if (window.soundSystem && typeof window.soundSystem.playStep === 'function') {
                window.soundSystem.playStep();
            }
        }
        // Nếu đang giằng co với con bò -> Nhấn để dồn lực giật kéo bò về!
        else if (this.lasso.state === 'struggling') {
            this.mashPull();
        }
    }

    mashPull() {
        if (this.state !== 'playing' || this.lasso.state !== 'struggling') return;
        const cow = this.lasso.caughtCow;
        if (!cow) return;

        // Dồn lực kéo mỗi lần bấm Space / chạm liên tục
        this.struggleProgress = Math.min(100, this.struggleProgress + cow.pullPower);
        this.player.pullAnim = 0.2;
        this.pullMeterPunch = 1.0; // Hiệu ứng nảy lực cực mạnh cho thanh kéo

        if (window.soundSystem && typeof window.soundSystem.playStep === 'function') {
            window.soundSystem.playStep();
        }

        // Bụi đất tung lên dưới gót chân cao bồi
        this.fxList.push({
            type: 'dust',
            x: this.player.x - 25,
            y: this.player.y - 10,
            w: 48,
            h: 24,
            life: 0.35,
            maxLife: 0.35
        });

        // Bùng nổ tia sét điện quang ở thanh kéo
        this.spawnPullMeterSparks();

        // Chữ bay +LỰC KÉO!
        this.floatTexts.push({
            x: this.width / 2 + (Math.random() - 0.5) * 60,
            y: this.height - 75,
            text: `+LỰC! ⚡`,
            color: '#ffd166',
            life: 0.6,
            maxLife: 0.6
        });

        // Kiểm tra xem đã kéo hoàn toàn về đích (100%) chưa
        if (this.struggleProgress >= 100) {
            this.onCatchSuccess(cow);
        }
    }

    spawnPullMeterSparks() {
        const boxX = (this.width - 400) / 2;
        const boxY = this.height - 70;
        for (let i = 0; i < 6; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 80 + 30;
            this.particles.push({
                x: boxX + 45 + Math.random() * 310,
                y: boxY + 25,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 20,
                color: Math.random() < 0.5 ? '#ffd166' : '#4cc9f0',
                size: Math.random() * 3.5 + 2,
                life: 0.4
            });
        }
    }

    handleKeyDown(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyK') {
            e.preventDefault();
            this.pull();
        } else if (e.code === 'KeyR') {
            if (this.state !== 'playing') {
                this.resetGame();
            }
        }
    }

    handleKeyUp(e) {
        // no-op
    }

    handleMouseMove(e) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        this.aimer.mouseX = mx;
        this.aimer.mouseY = my;

        if (mx > this.player.handX + 15 && this.lasso.state === 'ready') {
            const rawAngle = Math.atan2(my - this.player.handY, mx - this.player.handX);
            this.aimer.angle = Math.max(this.aimer.minAngle, Math.min(this.aimer.maxAngle, rawAngle));
            this.aimer.aimDist = Math.hypot(mx - this.player.handX, my - this.player.handY);
            this.aimer.manualControl = true;
        }
    }

    handleMouseDown(e) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        if (this.state !== 'playing') {
            if (mx >= 220 && mx <= 420 && my >= 265 && my <= 325) {
                this.resetGame();
                return;
            }
            return;
        }

        if (this.lasso.state === 'ready') {
            if (mx > this.player.handX + 15) {
                const rawAngle = Math.atan2(my - this.player.handY, mx - this.player.handX);
                this.aimer.angle = Math.max(this.aimer.minAngle, Math.min(this.aimer.maxAngle, rawAngle));
                this.aimer.aimDist = Math.hypot(mx - this.player.handX, my - this.player.handY);
            }
            this.pull();
        } else if (this.lasso.state === 'struggling') {
            this.mashPull();
        }
    }

    handleTouchStart(e) {
        if (e.touches && e.touches.length > 0) {
            const t = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.width / rect.width;
            const scaleY = this.height / rect.height;
            const mx = (t.clientX - rect.left) * scaleX;
            const my = (t.clientY - rect.top) * scaleY;

            if (this.state !== 'playing') {
                if (mx >= 220 && mx <= 420 && my >= 265 && my <= 325) {
                    this.resetGame();
                    return;
                }
            } else {
                if (this.lasso.state === 'ready') {
                    if (mx > this.player.handX + 15) {
                        const rawAngle = Math.atan2(my - this.player.handY, mx - this.player.handX);
                        this.aimer.angle = Math.max(this.aimer.minAngle, Math.min(this.aimer.maxAngle, rawAngle));
                        this.aimer.aimDist = Math.hypot(mx - this.player.handX, my - this.player.handY);
                    }
                    this.pull();
                } else if (this.lasso.state === 'struggling') {
                    this.mashPull();
                }
            }
        }
    }

    update(dt) {
        this.globalTime += dt;

        // Hoạt họa quay thòng lọng trên đầu
        this.player.twirlAngle += dt * 9.5;
        if (this.player.pullAnim > 0) {
            this.player.pullAnim -= dt;
        }

        // Độ nảy hồi phục của thanh kéo
        if (this.pullMeterPunch > 0) {
            this.pullMeterPunch = Math.max(0, this.pullMeterPunch - dt * 4.5);
        }

        // 1. Quét kim ngắm tự động nếu người chơi không di chuột
        if (!this.aimer.manualControl && this.lasso.state === 'ready') {
            this.aimer.angle += this.aimer.dir * this.aimer.speed * dt;
            if (this.aimer.angle >= this.aimer.maxAngle) {
                this.aimer.angle = this.aimer.maxAngle;
                this.aimer.dir = -1;
            } else if (this.aimer.angle <= this.aimer.minAngle) {
                this.aimer.angle = this.aimer.minAngle;
                this.aimer.dir = 1;
            }
        }

        // 2. CẬP NHẬT ĐÀN BÒ CHẠY THẲNG TỪ TRÊN XUỐNG DƯỚI (Đầu đi trước, chuẩn 100%, không bị đi ngược)
        for (let i = this.cows.length - 1; i >= 0; i--) {
            const cow = this.cows[i];
            if (cow.isCaught) continue;

            cow.animTimer += dt;
            // Chạy thẳng từ TRÊN XUỐNG DƯỚI (Y tăng dần - đầu chúc về trước)
            cow.y += cow.speed * dt;

            // Khi chạy vượt qua mép dưới màn hình (y > 530): Phóng ra ngoài màn hình thành công!
            if (cow.y > 530) {
                this.cows.splice(i, 1);
            }
        }

        // Luôn duy trì 4 đến 5 chú bò chạy liên tục trên đường đua
        if (this.cows.filter(c => !c.isCaught).length < 4 && this.state === 'playing') {
            const busyLanes = this.cows.filter(c => c.y < 120).map(c => c.laneIndex);
            const availableLanes = [0, 1, 2, 3].filter(idx => !busyLanes.includes(idx));
            const chosenLane = availableLanes.length > 0 ?
                availableLanes[Math.floor(Math.random() * availableLanes.length)] :
                Math.floor(Math.random() * 4);
            this.spawnCowOnLane(chosenLane, -80 - Math.random() * 40);
        }

        // 3. CẬP NHẬT THÒNG LỌNG (LASSO)
        if (this.lasso.state === 'throwing') {
            this.lasso.tipX += this.lasso.vx * dt;
            this.lasso.tipY += this.lasso.vy * dt;

            const dx = this.lasso.tipX - this.player.handX;
            const dy = this.lasso.tipY - this.player.handY;
            this.lasso.length = Math.sqrt(dx * dx + dy * dy);

            // Kiểm tra va chạm với các chú bò đang chạy trên các làn
            let caught = null;
            for (const cow of this.cows) {
                if (cow.isCaught) continue;
                if (cow.y < 35 || cow.y > 445) continue;

                const distCow = Math.hypot(this.lasso.tipX - cow.x, this.lasso.tipY - cow.y);
                if (distCow <= cow.hitRadius + 22) {
                    caught = cow;
                    break;
                }
            }

            if (caught) {
                // NÉM TRÚNG BÒ -> BẮT ĐẦU GIẰNG CO KÉO BÒ!
                caught.isCaught = true;
                caught.capturedBaseX = caught.x;
                caught.capturedBaseY = caught.y;

                this.lasso.caughtCow = caught;
                this.lasso.state = 'struggling';
                this.struggleProgress = 40;
                this.pullMeterPunch = 1.0;

                if (window.soundSystem && typeof window.soundSystem.playPickItem === 'function') {
                    window.soundSystem.playPickItem();
                }

                // Hiệu ứng tia sét / tia sáng bùng nổ khi trúng dây
                this.fxList.push({
                    type: 'spark',
                    x: caught.x,
                    y: caught.y - 15,
                    w: 64,
                    h: 48,
                    life: 0.45,
                    maxLife: 0.45
                });
            } else {
                // Quăng ra khỏi đấu trường -> HỤT LÀ THUA LUÔN!
                if (this.lasso.length >= this.lasso.maxLength || this.lasso.tipX >= 625 || this.lasso.tipY <= 25 || this.lasso.tipY >= 460) {
                    this.lasso.state = 'missed';
                    this.state = 'lose';
                    this.loseReason = 'miss';

                    if (window.soundSystem && typeof window.soundSystem.playGameOver === 'function') {
                        window.soundSystem.playGameOver();
                    }
                }
            }
        }
        else if (this.lasso.state === 'struggling') {
            const cow = this.lasso.caughtCow;
            if (cow) {
                // Bò liên tục dùng lực kháng cự kéo lùi lại
                this.struggleProgress -= cow.resistance * dt;

                // Tọa độ giằng co giữa người chơi và bò
                const t = this.struggleProgress / 100;
                const targetX = this.player.handX + 75;
                const targetY = this.player.handY + 15;
                cow.x = cow.capturedBaseX * (1 - t) + targetX * t + (Math.random() - 0.5) * 4;
                cow.y = cow.capturedBaseY * (1 - t) + targetY * t + Math.sin(this.globalTime * 28) * 3;

                this.lasso.tipX = cow.x;
                this.lasso.tipY = cow.y - 5;

                // THẢ TAY -> BÒ CHẠY THOÁT VÀ THUA LUÔN!
                if (this.struggleProgress <= 0) {
                    cow.isCaught = false;
                    cow.speed = 360;
                    this.lasso.state = 'ready';
                    this.lasso.caughtCow = null;
                    this.lasso.tipX = this.player.handX;
                    this.lasso.tipY = this.player.handY;

                    this.state = 'lose';
                    this.loseReason = 'escaped';

                    if (window.soundSystem && typeof window.soundSystem.playGameOver === 'function') {
                        window.soundSystem.playGameOver();
                    }

                    if (window.uiManager) {
                        window.uiManager.showToast('⚠️ Bạn đã thả tay! Chú bò giật đứt dây và phóng chạy mất!', 'warning');
                    }
                }
            }
        }

        // Cập nhật hiệu ứng FX
        for (let i = this.fxList.length - 1; i >= 0; i--) {
            const fx = this.fxList[i];
            fx.life -= dt;
            if (fx.life <= 0) {
                this.fxList.splice(i, 1);
            }
        }

        // Cập nhật hạt bụi đất / điện quang
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Cập nhật chữ bay điểm số
        for (let i = this.floatTexts.length - 1; i >= 0; i--) {
            const ft = this.floatTexts[i];
            ft.y -= 35 * dt;
            ft.life -= dt;
            if (ft.life <= 0) {
                this.floatTexts.splice(i, 1);
            }
        }
    }

    onCatchSuccess(cow) {
        this.score += cow.points;
        this.combo += 1;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        const idx = this.cows.indexOf(cow);
        if (idx !== -1) {
            this.cows.splice(idx, 1);
        }

        this.floatTexts.push({
            x: this.player.handX + 60,
            y: this.player.handY - 10,
            text: `+${cow.points}đ (${cow.name})!`,
            color: '#ffd166',
            life: 1.2,
            maxLife: 1.2
        });

        if (this.combo > 1) {
            this.floatTexts.push({
                x: this.player.handX + 60,
                y: this.player.handY - 32,
                text: `🔥 COMBO x${this.combo}!`,
                color: '#ffbe0b',
                life: 1.2,
                maxLife: 1.2
            });
        }

        if (window.soundSystem && typeof window.soundSystem.playPickItem === 'function') {
            window.soundSystem.playPickItem();
        }

        for (const m of this.milestones) {
            if (!m.unlocked && this.score >= m.req) {
                m.unlocked = true;
                if (window.uiManager) {
                    window.uiManager.showToast(`🎁 Chúc mừng! Mở khóa [${m.name}] tại mốc ${m.req}đ!`, 'success');
                }
            }
        }

        if (this.score >= this.targetScore) {
            this.state = 'win';
            this.lasso.state = 'ready';
            this.lasso.caughtCow = null;
            this.onWinSuccess();
        } else {
            this.lasso.state = 'ready';
            this.lasso.caughtCow = null;
            this.lasso.tipX = this.player.handX;
            this.lasso.tipY = this.player.handY;
        }
    }

    onWinSuccess() {
        if (this.rewardGiven) return;
        this.rewardGiven = true;

        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }

        if (window.gameState) {
            window.gameState.addItem('vat_pham_tro_choi', 1);
            window.gameState.addItem('sua_bo_tuoi', 1);
            window.gameState.addItem('pho_mai', 1);
            window.gameState.addItem('bo_bong_mini', 1);
            window.gameState.addItem('bua_may_man', 1);
        }

        if (window.useGameStore) {
            window.useGameStore.updateStats('cowPullingWins', 1);
            window.useGameStore.updateStats('cowPullingHighScore', this.score);
        }

        if (window.uiManager) {
            window.uiManager.showToast(`🏆 XUẤT SẮC! Đã tích đủ ${this.score} điểm và gom trọn bộ quà Kéo Bò Hội Chợ!`, 'success');
        }

        const colors = ['#ffd166', '#ff70a6', '#06d6a0', '#4cc9f0', '#ffffff', '#f4a261'];
        for (let i = 0; i < 70; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 260 + 60;
            this.particles.push({
                x: 320,
                y: 200,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 3,
                life: 2.2
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Nền bản đồ Hội Chợ Kéo Bò (Ảnh Map Background thực tế)
        this.drawMapBackground(ctx);

        // 2. Vẽ các chú bò đang chạy thẳng từ trên xuống dưới (sắp xếp theo Y để con ở dưới đè con ở trên)
        const sortedCows = [...this.cows].sort((a, b) => a.y - b.y);
        for (const cow of sortedCows) {
            this.drawMovingCow(ctx, cow);
        }

        // 3. Vẽ Dây Thừng & Thòng Lọng
        this.drawLasso(ctx);

        // 4. Vẽ Người Chơi Cao Bồi
        this.drawPlayer(ctx);

        // 5. Vẽ Hiệu ứng FX (Bụi khói & Tia sét)
        this.drawFX(ctx);

        // 6. Vẽ Hạt hiệu ứng
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 7. Vẽ Chữ nổi bay
        for (const ft of this.floatTexts) {
            const alpha = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.globalAlpha = 1.0;
        }

        // 8. Bảng HUD trên cùng (Khung gỗ chạm khắc & Huy hiệu 4 món quà)
        this.drawHUD(ctx);

        // 9. Bảng Thanh Lực Giằng Co Kéo Bò ĐẦY ĐỦ HIỆU ỨNG SẤM SÉT VÀ NĂNG LƯỢNG
        if (this.lasso.state === 'struggling' && this.state === 'playing') {
            this.drawStruggleOverlay(ctx);
        }

        // 10. Bảng Kết Quả Thắng / Thua
        if (this.state === 'win') {
            this.drawWinModal(ctx);
        } else if (this.state === 'lose') {
            this.drawLoseModal(ctx);
        }
    }

    drawMapBackground(ctx) {
        const bg = this.images.mapBg;
        if (bg && bg.complete && bg.naturalWidth > 0) {
            ctx.drawImage(bg, 0, 0, this.width, this.height);
        } else {
            ctx.fillStyle = '#556b2f';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#ddb892';
            ctx.fillRect(230, 0, 340, this.height);
        }

        // Đồ trang trí thêm trên sân cỏ lề phải
        const hay = this.images.decorHaybale;
        if (hay && hay.complete && hay.naturalWidth > 0) {
            ctx.drawImage(hay, this.width - 75, this.height - 65, 64, 45);
        }
        const bush = this.images.decorBush;
        if (bush && bush.complete && bush.naturalWidth > 0) {
            ctx.drawImage(bush, this.width - 70, 15, 60, 36);
        }
    }

    drawMovingCow(ctx, cow) {
        ctx.save();
        ctx.translate(cow.x, cow.y);

        const s = cow.scale;
        const baseW = 78 * s;
        const baseH = 80 * s;

        // Chọn Sprite chạy hoặc bị giằng co tương ứng với chủng loại bò
        let cowImg = this.images.cowDairyRun;
        let badgeImg = this.images.badgeGreen;

        if (cow.bodyType === 'dairy' || cow.bodyType === 'baby') {
            cowImg = cow.isCaught ? this.images.cowDairyDizzy : this.images.cowDairyRun;
            badgeImg = this.images.badgeGreen;
        } else if (cow.bodyType === 'brown') {
            cowImg = cow.isCaught ? this.images.cowBrownScared : this.images.cowBrownRun;
            badgeImg = this.images.badgeBlue;
        } else if (cow.bodyType === 'golden_bull') {
            cowImg = cow.isCaught ? this.images.cowGoldShocked : this.images.cowGoldRun;
            badgeImg = this.images.badgeRed;
        }

        // Đổ bóng đen mềm mại dưới chân trên nền cát (KHÔNG CÒN VẾT MÀU CYAN)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 18 * s, 26 * s, 10 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rung nhẹ khi bị giằng co kéo về
        if (cow.isCaught) {
            const shake = Math.sin(this.globalTime * 32) * 3;
            ctx.translate(shake, 0);
        }

        // VẼ THẲNG UPRIGHT - TUYỆT ĐỐI KHÔNG DÙNG CTX.ROTATE ("KHÔNG CẦN QUAY")
        // Bò chạy đầu hướng về trước chuẩn 100%, không bị vẹo lệch hay đi ngược
        if (cowImg && cowImg.complete && cowImg.naturalWidth > 0) {
            ctx.drawImage(cowImg, -baseW / 2, -baseH / 2, baseW, baseH);
        }
        ctx.restore();

        // BẢNG ĐIỂM TRÊN ĐẦU (Sử dụng Huy hiệu sao thực tế)
        ctx.save();
        const tagY = cow.y - baseH / 2 - 12;
        const bw = 54;
        const bh = 20;

        if (badgeImg && badgeImg.complete && badgeImg.naturalWidth > 0) {
            ctx.drawImage(badgeImg, cow.x - bw / 2, tagY - bh / 2, bw, bh);
        } else {
            ctx.fillStyle = '#06d6a0';
            ctx.beginPath();
            ctx.roundRect(cow.x - bw / 2, tagY - bh / 2, bw, bh, 6);
            ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${cow.points}đ`, cow.x + 5, tagY);
        ctx.restore();
    }

    drawPlayer(ctx) {
        ctx.save();
        let img = this.images.cowboyIdle;
        let drawW = 68;
        let drawH = 108;
        let offX = -34;
        let offY = -98;

        if (this.state === 'win') {
            img = this.images.cowboyWin;
            drawW = 72;
            drawH = 126;
            offY = -118;
        } else if (this.lasso.state === 'struggling') {
            img = this.images.cowboyPull;
            drawW = 86;
            drawH = 105;
            offX = -46;
            offY = -95;
        } else if (this.lasso.state === 'throwing' || this.lasso.state === 'ready') {
            img = this.images.cowboyThrow;
            drawW = 88;
            drawH = 128;
            offX = -38;
            offY = -118;
        }

        // Đổ bóng trên sàn gỗ (Đã làm sạch hoàn toàn bóng cyan)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(this.player.x, this.player.y + 4, 25, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, this.player.x + offX, this.player.y + offY, drawW, drawH);
        }
        ctx.restore();
    }

    drawLasso(ctx) {
        const hx = this.player.handX;
        const hy = this.player.handY;

        ctx.save();

        if (this.lasso.state === 'ready') {
            const aimDist = Math.max(90, Math.min(340, this.aimer.aimDist || 200));
            const ax = hx + Math.cos(this.aimer.angle) * aimDist;
            const ay = hy + Math.sin(this.aimer.angle) * aimDist;

            ctx.strokeStyle = 'rgba(255, 209, 102, 0.65)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(ax, ay);
            ctx.stroke();
            ctx.setLineDash([]);

            // Tâm ngắm Crosshair vàng phát sáng (Ảnh Reticle)
            const ret = this.images.reticle;
            const retSize = 34 + Math.sin(this.globalTime * 8) * 3;
            if (ret && ret.complete && ret.naturalWidth > 0) {
                ctx.drawImage(ret, ax - retSize / 2, ay - retSize / 2, retSize, retSize);
            }

            // Vòng thòng lọng quay trên đầu người chơi
            const loop = this.images.lassoLoopFly;
            if (loop && loop.complete && loop.naturalWidth > 0) {
                ctx.save();
                ctx.translate(hx - 8, hy - 35);
                ctx.rotate(this.player.twirlAngle);
                ctx.drawImage(loop, -22, -13, 44, 26);
                ctx.restore();
            }
        }
        else if (this.lasso.state === 'throwing') {
            this.drawRopeBetween(ctx, hx, hy, this.lasso.tipX, this.lasso.tipY, false);

            const loop = this.images.lassoLoopFly;
            if (loop && loop.complete && loop.naturalWidth > 0) {
                ctx.save();
                ctx.translate(this.lasso.tipX, this.lasso.tipY);
                ctx.rotate(this.lasso.angle);
                ctx.drawImage(loop, -24, -14, 48, 28);
                ctx.restore();
            }
        }
        else if (this.lasso.state === 'struggling') {
            const tipX = this.lasso.tipX;
            const tipY = this.lasso.tipY;
            this.drawRopeBetween(ctx, hx, hy, tipX, tipY, true);

            const knot = this.images.lassoLoopCaught;
            if (knot && knot.complete && knot.naturalWidth > 0) {
                ctx.save();
                ctx.translate(tipX, tipY - 8);
                ctx.drawImage(knot, -24, -20, 48, 40);
                ctx.restore();
            }
        }

        ctx.restore();
    }

    drawRopeBetween(ctx, x1, y1, x2, y2, vibrating = false) {
        ctx.save();
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        ctx.translate(x1, y1);
        ctx.rotate(angle);

        const ropeImg = this.images.ropeSegment;
        const vib = vibrating ? Math.sin(this.globalTime * 35) * 3 : 0;

        if (ropeImg && ropeImg.complete && ropeImg.naturalWidth > 0) {
            ctx.drawImage(ropeImg, 0, -5 + vib, dist, 10);
        } else {
            ctx.strokeStyle = '#c49a6c';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, vib);
            ctx.lineTo(dist, vib);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawFX(ctx) {
        for (const fx of this.fxList) {
            const alpha = Math.max(0, fx.life / fx.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;
            let img = null;
            if (fx.type === 'dust') img = this.images.fxDust;
            else if (fx.type === 'spark') img = this.images.fxSpark;

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, fx.x - fx.w / 2, fx.y - fx.h / 2, fx.w, fx.h);
            }
            ctx.restore();
        }
    }

    drawHUD(ctx) {
        ctx.save();

        const hudFrame = this.images.hudTopFrame;
        if (hudFrame && hudFrame.complete && hudFrame.naturalWidth > 0) {
            ctx.drawImage(hudFrame, 16, 4, this.width - 32, 50);
        } else {
            ctx.fillStyle = 'rgba(20, 24, 33, 0.9)';
            ctx.fillRect(0, 0, this.width, 48);
        }

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`ĐIỂM: ${this.score}`, 38, 28);

        ctx.fillStyle = '#4cc9f0';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`COMBO: x${this.combo}`, 38, 42);

        const medalImgs = [
            this.images.medalMilk,
            this.images.medalCheese,
            this.images.medalCake,
            this.images.medalGift
        ];
        const medalReqs = [50, 100, 180, 250];
        const medalX0 = 210;

        for (let i = 0; i < 4; i++) {
            const mx = medalX0 + i * 40;
            const my = 15;
            const mImg = medalImgs[i];
            const unlocked = this.score >= medalReqs[i];

            ctx.save();
            if (!unlocked) {
                ctx.globalAlpha = 0.4;
                ctx.filter = 'grayscale(80%)';
            }
            if (mImg && mImg.complete && mImg.naturalWidth > 0) {
                ctx.drawImage(mImg, mx, my, 28, 28);
            }
            if (unlocked) {
                ctx.strokeStyle = '#ffd166';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(mx + 14, my + 14, 15, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`TIẾN ĐỘ: ${this.score}/250đ`, 425, 28);

        const unlockedCount = this.milestones.filter(m => this.score >= m.req).length;
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`QUÀ: ${unlockedCount}/4 🎁`, this.width - 38, 28);

        ctx.restore();
    }

    // =========================================================================
    // THANH LỰC GIẰNG CO KÉO BÒ CÓ HIỆU ỨNG SẤM SÉT & NĂNG LƯỢNG RỰC RỠ
    // =========================================================================
    drawStruggleOverlay(ctx) {
        ctx.save();
        const progress = Math.max(0, Math.min(100, this.struggleProgress));

        const frame = this.images.pullMeterFrame;
        const boxW = 400;
        const boxH = 54;
        let boxX = (this.width - boxW) / 2;
        let boxY = this.height - 66;

        // 1. Rung lắc căng thẳng khi bò ghìm lại
        const tensionRumble = (1 - progress / 100) * 3.5;
        const rumbleX = (Math.sin(this.globalTime * 38) * tensionRumble);
        boxX += rumbleX;

        // 2. Độ nảy lực kéo (scale bump) khi người chơi dồn sức bấm Space
        const punch = this.pullMeterPunch;
        const scaleVal = 1 + punch * 0.06;

        ctx.translate(boxX + boxW / 2, boxY + boxH / 2);
        ctx.scale(scaleVal, scaleVal);
        ctx.translate(-(boxX + boxW / 2), -(boxY + boxH / 2));

        // 3. Vầng sáng hào quang năng lượng đằng sau 2 tia sét ở 2 đầu
        const glowPulse = (Math.sin(this.globalTime * 12) + 1) * 0.5;
        const lightningLeftX = boxX + 22;
        const lightningRightX = boxX + boxW - 22;
        const lightningY = boxY + boxH / 2;

        for (const lx of [lightningLeftX, lightningRightX]) {
            const radGrad = ctx.createRadialGradient(lx, lightningY, 2, lx, lightningY, 32);
            radGrad.addColorStop(0, 'rgba(255, 230, 80, 0.9)');
            radGrad.addColorStop(0.5, 'rgba(76, 201, 240, 0.4)');
            radGrad.addColorStop(1, 'rgba(76, 201, 240, 0)');
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(lx, lightningY, 32, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ các tia sét điện quang tí tách nhảy múa (Electric arcs)
            ctx.strokeStyle = Math.random() < 0.5 ? '#fff475' : '#4cc9f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx, lightningY);
            for (let step = 0; step < 3; step++) {
                const jx = lx + (Math.random() - 0.5) * 28;
                const jy = lightningY + (Math.random() - 0.5) * 28;
                ctx.lineTo(jx, jy);
            }
            ctx.stroke();
        }

        // 4. Nền lòng thanh đo lực kéo
        const barX = boxX + 49;
        const barY = boxY + 17;
        const barW = boxW - 98;
        const barH = 20;

        ctx.fillStyle = 'rgba(10, 15, 24, 0.85)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 10);
        ctx.fill();

        // 5. Vạch đo Gradient năng lượng phát sáng
        if (progress > 0) {
            const currentW = barW * (progress / 100);
            const grad = ctx.createLinearGradient(barX, 0, barX + currentW, 0);
            grad.addColorStop(0, '#e63946');
            grad.addColorStop(0.4, '#f77f00');
            grad.addColorStop(0.7, '#fcbf49');
            grad.addColorStop(1, '#06d6a0');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(barX, barY, currentW, barH, 10);
            ctx.fill();

            // Vệt quét ánh sáng năng lượng chạy liên tục (Energy scanline beam)
            const sweepPos = ((this.globalTime * 260) % currentW);
            const sweepGrad = ctx.createLinearGradient(barX + sweepPos - 20, 0, barX + sweepPos + 20, 0);
            sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
            sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = sweepGrad;
            ctx.beginPath();
            ctx.roundRect(barX, barY, currentW, barH, 10);
            ctx.fill();
        }

        // 6. Khung Gỗ Chạm Khắc Thực Tế có 2 Biểu Tượng Tia Sét ⚡
        if (frame && frame.complete && frame.naturalWidth > 0) {
            ctx.drawImage(frame, boxX, boxY, boxW, boxH);
        }

        // 7. Chữ Cảnh Báo Nhấp Space & Phần Trăm Lực Kéo
        const alertPulse = (Math.sin(this.globalTime * 16) + 1) * 0.5;
        let textColor = '#ffffff';
        if (progress < 25) {
            textColor = alertPulse > 0.4 ? '#ef476f' : '#ffffff';
        } else {
            textColor = alertPulse > 0.4 ? '#ffd166' : '#ffffff';
        }

        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ BẤM [SPACE] LIÊN TỤC ĐỂ DỒN LỰC! ⚡`, this.width / 2, boxY - 6);

        // Chữ phần trăm ở giữa thanh
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(`LỰC KÉO: ${Math.round(progress)}%`, this.width / 2, barY + 14);
        ctx.shadowColor = 'transparent';

        ctx.restore();
    }

    drawWinModal(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
        ctx.fillRect(0, 0, this.width, this.height);

        const mw = 420;
        const mh = 280;
        const mx = (this.width - mw) / 2;
        const my = (this.height - mh) / 2;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(mx, my, mw, mh, 16);
        ctx.fill();
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 CHIẾN THẮNG HOÀN TOÀN! 🎉', this.width / 2, my + 38);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Bạn đã tích đủ ${this.score} điểm và gom trọn 4/4 phần quà!`, this.width / 2, my + 68);

        const medals = [this.images.medalMilk, this.images.medalCheese, this.images.medalCake, this.images.medalGift];
        const names = ['Sữa Tươi', 'Phô Mai', 'Bánh Dâu', 'Hộp Quà'];
        for (let i = 0; i < 4; i++) {
            const rx = mx + 25 + i * 94;
            const ry = my + 90;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(rx, ry, 84, 60, 8);
            ctx.fill();
            ctx.strokeStyle = '#06d6a0';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const mImg = medals[i];
            if (mImg && mImg.complete && mImg.naturalWidth > 0) {
                ctx.drawImage(mImg, rx + 26, ry + 8, 32, 32);
            }
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(names[i], rx + 42, ry + 52);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Toàn bộ phần quà đã được tự động cất vào Balo Kho Đồ!', this.width / 2, my + 178);

        ctx.fillStyle = '#06d6a0';
        ctx.beginPath();
        ctx.roundRect(mx + 110, my + 205, 200, 44, 10);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Chơi Lại Ván Mới [R]', this.width / 2, my + 233);

        ctx.restore();
    }

    drawLoseModal(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, this.width, this.height);

        const mw = 380;
        const mh = 240;
        const mx = (this.width - mw) / 2;
        const my = (this.height - mh) / 2;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(mx, my, mw, mh, 16);
        ctx.fill();
        ctx.strokeStyle = '#ef476f';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ef476f';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('😢 BẠN ĐÃ THUA CUỘC!', this.width / 2, my + 40);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '14px sans-serif';
        if (this.loseReason === 'miss') {
            ctx.fillText('Thòng lọng quăng hụt ra ngoài đấu trường!', this.width / 2, my + 75);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '13px sans-serif';
            ctx.fillText('Luật chơi: Hụt một phát là thua luôn!', this.width / 2, my + 100);
        } else {
            ctx.fillText('Bạn đã thả tay hoặc bấm quá chậm!', this.width / 2, my + 75);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '13px sans-serif';
            ctx.fillText('Chú bò đã giật đứt dây và phóng chạy mất!', this.width / 2, my + 100);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px sans-serif';
        ctx.fillText(`Điểm đạt được: ${this.score}đ | Combo cao nhất: x${this.maxCombo}`, this.width / 2, my + 135);

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.roundRect(mx + 90, my + 165, 200, 44, 10);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Thử Lại Ngay [R]', this.width / 2, my + 192);

        ctx.restore();
    }
}



// ==========================================
class FallingFoodCatcherGame {
    constructor(canvasId) {
        this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.width = 640;
        this.height = 480;

        // Chiếc tô hứng đồ ăn của người chơi (Tô Gấu Nâu hoặc Tô Hồng Pastel)
        this.basket = {
            x: 320,
            y: 395,
            width: 96,
            height: 80,
            speed: 7.5
        };

        this.currentBowl = 'bear'; // 'bear' (Tô Gấu Nâu) hoặc 'pink' (Tô Hồng Pastel)
        this.bowlSquash = 1.0;
        this.bowlStretch = 1.0;
        this.bowlFlashBad = 0;
        this.catAnimTime = 0;

        // Hệ thống hiệu ứng & nam châm
        this.hitEffects = []; // { type: 'good' | 'bad', x, y, timer, maxTime }
        this.magnetTimer = 0; // Thời gian hiệu lực hút đồ ăn
        this.shakeTimer = 0;
        this.shakeMagnitude = 0;

        this.items = []; // Danh sách món ăn đang rơi
        this.particles = [];
        this.floatTexts = [];
        this.score = 0;
        this.targetScore = 150;
        this.timeLeft = 30; // 30 giây
        this.lives = 3; // 3 mạng
        this.combo = 0;
        this.maxCombo = 0;
        this.spawnTimer = 0;
        this.isRunning = false;
        this.gameResult = null; // 'win', 'lose'
        this.animId = null;
        this.keys = {};
        this.rewardGiven = false;

        // 1. Tải Phông Nền Hội Chợ & Mặt Bàn Gỗ (Ảnh 1)
        this.bgImg = new Image();
        this.bgImg.src = 'assets/minigames/food_game_bg.png';

        // 2. Tải 2 mẫu tô hứng đề bài cung cấp (Ảnh 2)
        this.bowlPinkImg = new Image();
        this.bowlPinkImg.src = 'assets/minigames/bowl_pink.png';
        this.bowlBearImg = new Image();
        this.bowlBearImg.src = 'assets/minigames/bowl_bear.png';

        // 3. Tải các họa tiết trang trí mặt bàn (Ảnh 3)
        this.decorImages = {
            menu: new Image(),
            cups: new Image(),
            pot: new Image(),
            cat: new Image(),
            lamp: new Image()
        };
        this.decorImages.menu.src = 'assets/minigames/decor_menu_board.png';
        this.decorImages.cups.src = 'assets/minigames/decor_cups_napkins.png';
        this.decorImages.pot.src = 'assets/minigames/decor_flower_pot.png';
        this.decorImages.cat.src = 'assets/minigames/decor_lucky_cat.png';
        this.decorImages.lamp.src = 'assets/minigames/decor_lamp_post.png';

        // 4. Tải các hiệu ứng ăn đồ ăn & vật phẩm bổ trợ (Ảnh 4)
        this.effectEatGoodImg = new Image();
        this.effectEatGoodImg.src = 'assets/minigames/effect_eat_good.png';
        this.effectEatBadImg = new Image();
        this.effectEatBadImg.src = 'assets/minigames/effect_eat_bad.png';
        this.badgeGoldMedalImg = new Image();
        this.badgeGoldMedalImg.src = 'assets/minigames/badge_gold_medal.png';
        this.itemMagnetImg = new Image();
        this.itemMagnetImg.src = 'assets/minigames/item_magnet.png';

        // 5. Tải trước hình ảnh đồ ăn thực tế từ hình ảnh người dùng cung cấp
        this.foodImages = {};
        const foodAssets = {
            mi_tron_trung: 'assets/items/mi_tron_trung.png',
            com_canh_ga: 'assets/items/com_canh_ga.png',
            burger: 'assets/items/hamburger.png',
            fries: 'assets/items/khoai_tay_chien.png',
            cupcake: 'assets/items/banh_cupcake.png',
            soda: 'assets/items/sua.png',
            donut: 'assets/items/pho_mai.png',
            popcorn: 'assets/items/bap_rang_bo.png'
        };
        for (const k in foodAssets) {
            const relPath = foodAssets[k];
            const r2Url = (window.getR2Url ? window.getR2Url(relPath) : relPath);
            const img = new Image();
            img.onerror = () => {
                if (img.src === r2Url && r2Url !== relPath) {
                    img.src = relPath;
                }
            };
            img.src = r2Url;
            this.foodImages[k] = img;
        }

        // Danh sách các loại vật phẩm rơi: Đồ ăn ngon, Nam châm, Đồ ươn hỏng & Bom
        this.foodTypes = [
            // Các món ăn chính
            { id: 'mi_tron_trung', name: 'Mì Trộn Trứng', icon: '🍜', pts: 25, color: '#f77f00', weight: 15 },
            { id: 'com_canh_ga', name: 'Cơm Cánh Gà', icon: '🍗', pts: 25, color: '#ffb703', weight: 15 },
            { id: 'burger', name: 'Hamburger Bò', icon: '🍔', pts: 15, color: '#e76f51', weight: 14 },
            { id: 'cupcake', name: 'Bánh Cupcake', icon: '🧁', pts: 15, color: '#ff70a6', weight: 14 },
            { id: 'fries', name: 'Khoai Tây Chiên', icon: '🍟', pts: 10, color: '#ffd166', weight: 12 },
            { id: 'soda', name: 'Trà Sữa Đá', icon: '🥤', pts: 10, color: '#06d6a0', weight: 10 },
            { id: 'donut', name: 'Bánh Phô Mai', icon: '🧀', pts: 10, color: '#ffb703', weight: 10 },
            { id: 'popcorn', name: 'Bắp Rang Bơ', icon: '🍿', pts: 10, color: '#e9c46a', weight: 10 },
            // Vật phẩm hỗ trợ: Nam Châm hút đồ ăn
            { id: 'magnet', name: 'Nam Châm Hút Đồ Ăn', icon: '🧲', pts: 10, color: '#4cc9f0', weight: 8, isMagnet: true },
            // Món hỏng / Bom nguy hiểm (Kích hoạt khói đen nổ, trừ mạng)
            { id: 'spoiled_fish', name: 'Cá Ươn Ối!', icon: '🐟', pts: -15, color: '#555555', weight: 7, isBad: true, desc: 'Cá ươn hỏng!' },
            { id: 'rotten_apple', name: 'Táo Hỏng Sâu!', icon: '🍏', pts: -10, color: '#6a994e', weight: 7, isBad: true, desc: 'Táo dập sâu!' },
            { id: 'bomb', name: 'Bom Nổ!', icon: '💣', pts: -20, color: '#222222', weight: 6, isBad: true, desc: 'Bom nổ tung!' }
        ];

        this.init();
    }

    init() {
        if (!this.canvas) return;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundTouchMove = this.handleTouchMove.bind(this);
        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);

        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
        window.addEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keyup', this.boundKeyUp);

        this.resetGame();
        this.draw();
    }

    toggleBowl() {
        this.currentBowl = this.currentBowl === 'bear' ? 'pink' : 'bear';
        if (window.soundSystem && typeof window.soundSystem.playSelect === 'function') {
            window.soundSystem.playSelect();
        }
        if (window.uiManager) {
            const bowlName = this.currentBowl === 'bear' ? '🐻 Tô Gấu Nâu Dễ Thương' : '🌸 Tô Hồng Pastel';
            window.uiManager.showToast(`Đã đổi sang: ${bowlName}`, 'info');
        }
    }

    handleMouseMove(e) {
        if (!this.isRunning) return;
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX;
        const canvasX = (clientX - rect.left) * (this.width / rect.width);
        this.basket.x = Math.max(110, Math.min(530, canvasX));
    }

    handleTouchMove(e) {
        if (!this.isRunning) return;
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (touch) {
            const canvasX = (touch.clientX - rect.left) * (this.width / rect.width);
            this.basket.x = Math.max(110, Math.min(530, canvasX));
        }
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;
        if (e.key === 't' || e.key === 'T') {
            this.toggleBowl();
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
    }

    resetGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.lives = 3;
        this.combo = 0;
        this.maxCombo = 0;
        this.items = [];
        this.particles = [];
        this.floatTexts = [];
        this.hitEffects = [];
        this.magnetTimer = 0;
        this.shakeTimer = 0;
        this.shakeMagnitude = 0;
        this.bowlSquash = 1.0;
        this.bowlStretch = 1.0;
        this.bowlFlashBad = 0;
        this.spawnTimer = 0.4;
        this.gameResult = null;
        this.rewardGiven = false;
        this.basket.x = 320;
    }

    start() {
        this.resetGame();
        this.isRunning = true;
        let lastTime = performance.now();

        const loop = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;

            if (this.isRunning) {
                this.update(dt);
                this.draw();
                this.animId = requestAnimationFrame(loop);
            }
        };

        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }

    destroy() {
        this.stop();
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.boundMouseMove);
            this.canvas.removeEventListener('touchmove', this.boundTouchMove);
        }
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
    }

    moveLeft(amount = 45) {
        this.basket.x = Math.max(110, this.basket.x - amount);
    }

    moveRight(amount = 45) {
        this.basket.x = Math.min(530, this.basket.x + amount);
    }

    spawnFood() {
        const totalWeight = this.foodTypes.reduce((s, it) => s + it.weight, 0);
        let rnd = Math.random() * totalWeight;
        let chosenType = this.foodTypes[0];

        for (const ft of this.foodTypes) {
            rnd -= ft.weight;
            if (rnd <= 0) {
                chosenType = ft;
                break;
            }
        }

        // Vị trí rơi ngẫu nhiên trên quầy (từ x=120 đến x=520 để rơi thẳng xuống khu vực người chơi có thể hứng)
        const spawnX = 120 + Math.random() * 400;
        const fallSpeed = chosenType.isBad ? 3.8 + Math.random() * 2.0 : (2.4 + Math.random() * 1.8);

        this.items.push({
            ...chosenType,
            img: this.foodImages[chosenType.id] || null,
            x: spawnX,
            y: -30,
            speed: fallSpeed,
            radius: 22,
            rotation: (Math.random() - 0.5) * 0.4,
            rotSpeed: (Math.random() - 0.5) * 1.6
        });
    }

    onWin() {
        if (this.rewardGiven) return;
        this.rewardGiven = true;

        if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
            window.soundSystem.playUnlockFanfare();
        }

        let rewardList = ['+1 Quà Trò Chơi 🎁'];
        if (window.gameState) {
            window.gameState.addItem('vat_pham_tro_choi', 1);

            // Mốc 1: Đạt 60 điểm -> Bánh Cupcake Dâu
            if (this.score >= 60) {
                window.gameState.addItem('banh_cupcake', 1);
                rewardList.push('+1 Bánh Cupcake 🧁');
            }
            // Mốc 2: Đạt 100 điểm -> Cơm Cánh Gà Rán Giòn (Ảnh 2)
            if (this.score >= 100) {
                window.gameState.addItem('com_canh_ga', 1);
                rewardList.push('+1 Cơm Cánh Gà 🍗');
            }
            // Mốc 3: Đạt 150 điểm -> Mì Trộn Trứng Ốp La (Ảnh 1)
            if (this.score >= 150) {
                window.gameState.addItem('mi_tron_trung', 1);
                rewardList.push('+1 Mì Trộn Trứng 🍜');
            }
            // Mốc 4: Đạt 190 điểm -> Burger Bò Đặc Biệt
            if (this.score >= 190) {
                window.gameState.addItem('burger_bo', 1);
                rewardList.push('+1 Burger Bò 🍔');
            }
            // Mốc 5: Đạt 210 điểm -> Bắp Rang Bơ Giòn
            if (this.score >= 210) {
                window.gameState.addItem('hop_do_an_vat', 1);
                rewardList.push('+1 Bắp Rang Bơ 🍿');
            }
            // Mốc 6: Đạt 240 điểm -> Khoai Tây Chiên Giòn
            if (this.score >= 240) {
                window.gameState.addItem('khoai_tay_chien', 1);
                rewardList.push('+1 Khoai Tây Chiên 🍟');
            }
            // Mốc 7: Đạt 270 điểm -> Sữa Bò Tươi & Phô Mai
            if (this.score >= 270) {
                window.gameState.addItem('sua_bo_tuoi', 1);
                window.gameState.addItem('pho_mai', 1);
                rewardList.push('+1 Sữa Tươi 🥛 & +1 Phô Mai 🧀');
            }
        }

        if (window.useGameStore) {
            window.useGameStore.updateStats('fallingFoodHighScore', this.score);
            
            // Kiểm tra tiến trình nhiệm vụ Cô Bếp Trưởng
            const q = window.useGameStore.state.quests && window.useGameStore.state.quests.nhiem_vu_gio_qua;
            if (q && q.status === 'in_progress') {
                const hasMi = window.useGameStore.hasItem('mi_tron_trung', 1);
                const hasGa = window.useGameStore.hasItem('com_canh_ga', 1);
                if (hasMi && hasGa) {
                    setTimeout(() => {
                        if (window.uiManager) {
                            window.uiManager.showToast('🔔 Bạn đã thu thập đủ Mì Trộn Trứng & Cơm Cánh Gà! Hãy gặp Cô Bếp Trưởng để nhận Giỏ Đựng & Hộp Quà!', 'info');
                        }
                    }, 1200);
                }
            }
        }

        if (window.uiManager) {
            window.uiManager.showToast(`🎉 XUẤT SẮC! Hứng được ${this.score} điểm (${rewardList.join(', ')})`, 'success');
        }

        // Confetti chúc mừng
        const colors = ['#ff70a6', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'];
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 6 + 2;
            this.particles.push({
                x: this.basket.x,
                y: this.basket.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 2,
                life: 2.0
            });
        }
    }

    update(dt) {
        this.catAnimTime += dt;

        // Cập nhật rung màn hình khi trúng đồ hỏng
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
        }

        // Cập nhật hiệu ứng đổi màu nhấp nháy khi bị thương
        if (this.bowlFlashBad > 0) {
            this.bowlFlashBad -= dt;
        }

        // Đàn hồi tô hứng (squash & stretch)
        this.bowlSquash += (1.0 - this.bowlSquash) * 9 * dt;
        this.bowlStretch += (1.0 - this.bowlStretch) * 9 * dt;

        // Cập nhật hiệu lực nam châm
        if (this.magnetTimer > 0) {
            this.magnetTimer = Math.max(0, this.magnetTimer - dt);
        }

        // Cập nhật các hiệu ứng va chạm nổ (good / bad)
        for (let i = this.hitEffects.length - 1; i >= 0; i--) {
            const ef = this.hitEffects[i];
            ef.timer -= dt;
            if (ef.timer <= 0) {
                this.hitEffects.splice(i, 1);
            }
        }

        // Nếu trò chơi đã kết thúc, chỉ cập nhật hạt bụi / pháo hoa
        if (this.gameResult !== null) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= dt;
                if (p.life <= 0) this.particles.splice(i, 1);
            }
            return;
        }

        // Điều khiển tô hứng bằng phím A / D hoặc Mũi tên Trái / Phải
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.basket.x = Math.max(110, this.basket.x - this.basket.speed * 60 * dt);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.basket.x = Math.min(530, this.basket.x + this.basket.speed * 60 * dt);
        }

        // Đếm ngược thời gian
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            if (this.score >= 60) {
                this.gameResult = 'win';
                this.onWin();
            } else {
                this.gameResult = 'lose';
            }
            return;
        }

        // Sinh đồ ăn rơi mới
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnFood();
            this.spawnTimer = 0.50 + Math.random() * 0.40;
        }

        // Cập nhật vị trí các món ăn rơi & hiệu ứng từ tính
        for (let i = this.items.length - 1; i >= 0; i--) {
            const it = this.items[i];

            // Nếu nam châm đang kích hoạt: hút tất cả đồ ăn ngon về phía tô!
            if (this.magnetTimer > 0 && !it.isBad) {
                const dx = this.basket.x - it.x;
                if (Math.abs(dx) < 260 && it.y < this.basket.y) {
                    it.x += Math.sign(dx) * Math.min(Math.abs(dx), 180 * dt);
                }
            }

            it.y += it.speed * 60 * dt;
            it.rotation += it.rotSpeed * dt;

            // Kiểm tra va chạm với miệng tô hứng
            const basketLeft = this.basket.x - this.basket.width * 0.48;
            const basketRight = this.basket.x + this.basket.width * 0.48;
            const basketTop = this.basket.y - 25;
            const basketBottom = this.basket.y + 15;

            if (it.y + it.radius >= basketTop && it.y - it.radius <= basketBottom &&
                it.x >= basketLeft - 10 && it.x <= basketRight + 10) {
                
                // Trường hợp 1: Nhặt được Nam Châm Hút Đồ Ăn!
                if (it.isMagnet) {
                    this.magnetTimer = 6.0; // 6 giây nam châm
                    this.score += 10;
                    if (window.soundSystem && typeof window.soundSystem.playPowerUp === 'function') {
                        window.soundSystem.playPowerUp();
                    }
                    this.floatTexts.push({
                        text: `🧲 HÚT ĐỒ ĂN (6s)!`,
                        x: it.x,
                        y: basketTop - 15,
                        color: '#4cc9f0',
                        life: 1.1,
                        maxLife: 1.1
                    });
                    this.hitEffects.push({
                        type: 'good',
                        x: it.x,
                        y: basketTop,
                        timer: 0.65,
                        maxTime: 0.65
                    });
                }
                // Trường hợp 2: Hứng trúng món đồ ăn ngon miệng!
                else if (!it.isBad) {
                    this.combo++;
                    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
                    const comboBonus = Math.round(it.pts * (1 + (this.combo - 1) * 0.15));
                    this.score += comboBonus;

                    if (window.soundSystem && typeof window.soundSystem.playPickup === 'function') {
                        window.soundSystem.playPickup();
                    }

                    // Đàn hồi tô nhún nhảy đáng yêu
                    this.bowlSquash = 0.82;
                    this.bowlStretch = 1.18;

                    // Hiệu ứng ăn đồ ăn ngon: Pháo hoa trái tim & ngôi sao lấp lánh (Ảnh 4)
                    this.hitEffects.push({
                        type: 'good',
                        x: it.x,
                        y: basketTop - 5,
                        timer: 0.65,
                        maxTime: 0.65
                    });

                    // Chữ bay điểm số
                    this.floatTexts.push({
                        text: `+${comboBonus} ${it.name}!`,
                        x: it.x,
                        y: basketTop - 15,
                        color: it.color,
                        life: 0.9,
                        maxLife: 0.9
                    });

                    // Hạt lấp lánh nhỏ bổ trợ
                    for (let p = 0; p < 8; p++) {
                        this.particles.push({
                            x: it.x,
                            y: basketTop,
                            vx: (Math.random() - 0.5) * 4,
                            vy: -Math.random() * 3 - 1,
                            color: it.color,
                            size: 3,
                            life: 0.4
                        });
                    }
                }
                // Trường hợp 3: Ăn phải đồ ăn hỏng, cá ươn, táo thối hoặc bom! (Ảnh 4)
                else {
                    this.combo = 0;
                    this.lives--;
                    this.score = Math.max(0, this.score + it.pts);

                    // Kích hoạt rung giật màn hình
                    this.shakeTimer = 0.35;
                    this.shakeMagnitude = 10;
                    this.bowlFlashBad = 0.4;

                    if (window.soundSystem && typeof window.soundSystem.playHurt === 'function') {
                        window.soundSystem.playHurt();
                    }

                    // Hiệu ứng khói đen nổ tung & chóng mặt (Ảnh 4)
                    this.hitEffects.push({
                        type: 'bad',
                        x: it.x,
                        y: basketTop - 10,
                        timer: 0.85,
                        maxTime: 0.85
                    });

                    this.floatTexts.push({
                        text: `💥 ${it.desc} ${it.pts}đ!`,
                        x: it.x,
                        y: basketTop - 20,
                        color: '#ff4d6d',
                        life: 1.1,
                        maxLife: 1.1
                    });

                    if (this.lives <= 0) {
                        this.lives = 0;
                        if (this.score >= 60) {
                            this.gameResult = 'win';
                            this.onWin();
                        } else {
                            this.gameResult = 'lose';
                        }
                    }
                }

                this.items.splice(i, 1);
                continue;
            }

            // Đồ rơi chạm mặt bàn/đáy sàn
            if (it.y > this.height + 30) {
                if (!it.isBad && !it.isMagnet) {
                    this.combo = 0; // Đánh rơi món ngon làm ngắt combo
                }
                this.items.splice(i, 1);
            }
        }

        // Cập nhật chữ bay
        for (let i = this.floatTexts.length - 1; i >= 0; i--) {
            const ft = this.floatTexts[i];
            ft.y -= 25 * dt;
            ft.life -= dt;
            if (ft.life <= 0) this.floatTexts.splice(i, 1);
        }

        // Cập nhật hạt
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.save();

        // 1. Rung lắc màn hình khi ăn phải đồ hỏng / bom nổ
        if (this.shakeTimer > 0) {
            const ox = (Math.random() - 0.5) * this.shakeMagnitude;
            const oy = (Math.random() - 0.5) * this.shakeMagnitude;
            ctx.translate(ox, oy);
        }

        ctx.clearRect(0, 0, this.width, this.height);

        // 2. Vẽ Phông Nền Hội Chợ & Mặt Bàn Gỗ (Ảnh 1)
        if (this.bgImg && this.bgImg.complete && this.bgImg.naturalWidth > 0) {
            ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);
        } else {
            // Phông nền dự phòng nếu ảnh đang load
            const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
            skyGrad.addColorStop(0, '#fde2e4');
            skyGrad.addColorStop(0.6, '#fff1e6');
            skyGrad.addColorStop(1, '#cddafd');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#6f4e37';
            ctx.fillRect(0, 435, this.width, 45);
        }

        // 3. Vẽ Các Họa Tiết Trang Trí Trên Mặt Bàn (Ảnh 3)
        this.drawTableDecorations(ctx);

        // 4. Vẽ Các Món Đồ Ăn Rơi Từ Trời
        for (const it of this.items) {
            ctx.save();
            ctx.translate(it.x, it.y);
            ctx.rotate(it.rotation);

            // Bóng đổ nhẹ
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.beginPath();
            ctx.ellipse(0, it.radius * 0.7, it.radius * 0.9, it.radius * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();

            // Nếu là vật phẩm Nam Châm
            if (it.isMagnet && this.itemMagnetImg && this.itemMagnetImg.complete && this.itemMagnetImg.naturalWidth > 0) {
                const s = 44;
                ctx.drawImage(this.itemMagnetImg, -s / 2, -s / 2, s, s);
            }
            // Nếu có ảnh sprite thực tế (Mì trộn trứng, Cơm cánh gà, Burger, v.v.)
            else if (it.img && it.img.complete && it.img.naturalWidth > 0) {
                const imgW = 46;
                const imgH = 46;
                ctx.drawImage(it.img, -imgW / 2, -imgH / 2, imgW, imgH);
            } else {
                // Biểu tượng icon emoji món ăn
                ctx.font = '30px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(it.icon, 0, 0);
            }

            ctx.restore();
        }

        // 5. Hiệu ứng Nam Châm Hút Đồ Ăn (Vòng hào quang từ tính quanh tô)
        if (this.magnetTimer > 0) {
            ctx.save();
            const pulse = (Math.sin(performance.now() * 0.008) + 1) * 0.5;
            ctx.strokeStyle = `rgba(76, 201, 240, ${0.4 + pulse * 0.4})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.ellipse(this.basket.x, this.basket.y - 10, 75 + pulse * 8, 35 + pulse * 4, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 6. Vẽ Tô Hứng Của Người Chơi (Ảnh 2: Tô Gấu Nâu hoặc Tô Hồng Pastel)
        this.drawBowlCatcher(ctx);

        // 7. Vẽ Các Hiệu Ứng Nổ Ăn Trúng (Ảnh 4: Pháo hoa trái tim ăn ngon & Khói nổ ăn hỏng)
        this.drawHitEffects(ctx);

        // 8. Vẽ Hạt & Chữ Bay Điểm Số
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const ft of this.floatTexts) {
            const alpha = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.globalAlpha = 1.0;
        }

        // 9. Thanh Bảng Điểm HUD Trên Cùng
        this.drawHUD(ctx);

        // 10. Bảng Kết Quả Khi Kết Thúc
        if (this.gameResult === 'win') {
            this.drawWinModal(ctx);
        } else if (this.gameResult === 'lose') {
            this.drawLoseModal(ctx);
        }

        ctx.restore();
    }

    drawTableDecorations(ctx) {
        // Bên Trái: Bảng phấn menu đồ ăn & Cốc cà phê, giấy ăn ngôi sao
        if (this.decorImages.menu && this.decorImages.menu.complete && this.decorImages.menu.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.menu, 12, 345, 58, 88);
        }
        if (this.decorImages.cups && this.decorImages.cups.complete && this.decorImages.cups.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.cups, 68, 390, 54, 42);
        }

        // Bên Phải: Chậu hoa cười dễ thương & Mèo thần tài vẫy tay may mắn
        if (this.decorImages.pot && this.decorImages.pot.complete && this.decorImages.pot.naturalWidth > 0) {
            ctx.drawImage(this.decorImages.pot, 520, 382, 46, 50);
        }
        if (this.decorImages.cat && this.decorImages.cat.complete && this.decorImages.cat.naturalWidth > 0) {
            ctx.save();
            ctx.translate(598, 432); // Pivot ở chân mèo
            const catTilt = Math.sin(this.catAnimTime * 3.5) * 0.05;
            ctx.rotate(catTilt);
            ctx.drawImage(this.decorImages.cat, -29, -74, 58, 74);
            ctx.restore();
        }
    }

    drawBowlCatcher(ctx) {
        ctx.save();

        const x = this.basket.x;
        const y = this.basket.y;
        const w = this.basket.width;
        const h = this.basket.height;

        // 1. Bóng đổ trên mặt bàn gỗ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(x, 436, w * 0.44 * this.bowlStretch, 12 * this.bowlSquash, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Điểm đặt vẽ tô (tính toán squash & stretch khi hứng trúng đồ ăn)
        ctx.translate(x, y + 25);
        ctx.scale(this.bowlStretch, this.bowlSquash);

        // Hiệu ứng nhấp nháy đỏ khi bị thương
        if (this.bowlFlashBad > 0) {
            ctx.filter = 'sepia(1) hue-rotate(300deg) saturate(3) brightness(1.2)';
        }

        const bowlImg = this.currentBowl === 'bear' ? this.bowlBearImg : this.bowlPinkImg;
        if (bowlImg && bowlImg.complete && bowlImg.naturalWidth > 0) {
            // Vẽ ảnh tô chuẩn đề bài cung cấp (đặt tâm đáy tô chạm mặt bàn y=435)
            ctx.drawImage(bowlImg, -w / 2, -h + 15, w, h);
        } else {
            // Dự phòng tô vẽ nét vẽ mềm nếu ảnh chưa tải xong
            ctx.fillStyle = this.currentBowl === 'bear' ? '#b07d62' : '#f4a5ae';
            ctx.beginPath();
            ctx.arc(0, -25, w / 2, 0, Math.PI);
            ctx.fill();
        }

        ctx.restore();
    }

    drawHitEffects(ctx) {
        for (const ef of this.hitEffects) {
            ctx.save();
            const progress = 1 - (ef.timer / ef.maxTime); // 0 -> 1
            const alpha = Math.max(0, 1 - progress * progress);
            const scale = 0.5 + progress * 0.65;

            ctx.globalAlpha = alpha;
            ctx.translate(ef.x, ef.y - progress * 20);

            if (ef.type === 'good') {
                // Hiệu ứng pháo hoa trái tim & ngôi sao lấp lánh (Ảnh 4)
                if (this.effectEatGoodImg && this.effectEatGoodImg.complete && this.effectEatGoodImg.naturalWidth > 0) {
                    const size = 110 * scale;
                    ctx.drawImage(this.effectEatGoodImg, -size / 2, -size / 2, size, size);
                }
            } else if (ef.type === 'bad') {
                // Hiệu ứng khói đen nổ tung & chóng mặt (Ảnh 4)
                if (this.effectEatBadImg && this.effectEatBadImg.complete && this.effectEatBadImg.naturalWidth > 0) {
                    const size = 125 * scale;
                    ctx.drawImage(this.effectEatBadImg, -size / 2, -size / 2, size, size);
                }
            }

            ctx.restore();
        }
    }

    drawHUD(ctx) {
        // Nền thanh HUD bo góc bằng gỗ / vàng ấm áp
        ctx.fillStyle = 'rgba(40, 24, 14, 0.88)';
        ctx.strokeStyle = '#d4a373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(15, 10, this.width - 30, 48, 12);
        ctx.fill();
        ctx.stroke();

        // 1. Điểm số & Huy Chương Vàng Vinh Danh (Ảnh 4)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`ĐIỂM: ${this.score}`, 30, 32);

        // Nếu đạt từ 100 điểm trở lên: hiện huy chương vàng bên cạnh điểm số!
        if (this.score >= 100 && this.badgeGoldMedalImg && this.badgeGoldMedalImg.complete && this.badgeGoldMedalImg.naturalWidth > 0) {
            ctx.drawImage(this.badgeGoldMedalImg, 122, 14, 28, 36);
        }

        ctx.fillStyle = '#4cc9f0';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`COMBO: x${this.combo}`, 30, 48);

        // 2. Tim mạng sống (Lives) ở giữa
        ctx.font = '17px sans-serif';
        ctx.textAlign = 'center';
        let heartsStr = '❤️'.repeat(this.lives) + '🖤'.repeat(Math.max(0, 3 - this.lives));
        ctx.fillText(`MẠNG: ${heartsStr}`, this.width / 2 - 35, 33);

        // Nút đổi mẫu tô hứng tiện lợi
        ctx.fillStyle = '#faedcd';
        ctx.font = 'bold 11px sans-serif';
        const bowlLabel = this.currentBowl === 'bear' ? '🐻 Tô Gấu (Phím T)' : '🌸 Tô Hồng (Phím T)';
        ctx.fillText(bowlLabel, this.width / 2 - 35, 49);

        // 3. Hiển thị Nam Châm đang kích hoạt (nếu có)
        if (this.magnetTimer > 0) {
            ctx.fillStyle = '#4cc9f0';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`🧲 HÚT: ${this.magnetTimer.toFixed(1)}s`, this.width - 150, 35);
        }

        // 4. Thời gian còn lại
        ctx.textAlign = 'right';
        ctx.fillStyle = this.timeLeft <= 6 ? '#ff4d6d' : '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`THỜI GIAN: ${Math.ceil(this.timeLeft)}s`, this.width - 30, 35);
    }

    drawWinModal(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(90, 115, 460, 210);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 3;
        ctx.strokeRect(90, 115, 460, 210);

        // Huy chương vàng vinh danh xuất hiện ở góc trên modal
        if (this.badgeGoldMedalImg && this.badgeGoldMedalImg.complete && this.badgeGoldMedalImg.naturalWidth > 0) {
            ctx.drawImage(this.badgeGoldMedalImg, 110, 130, 42, 54);
            ctx.drawImage(this.badgeGoldMedalImg, 488, 130, 42, 54);
        }

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ BỮA TIỆC NO NÊ CHIẾN THẮNG! ★', 320, 160);

        ctx.fillStyle = '#ffffff';
        ctx.font = '15px sans-serif';
        ctx.fillText(`Tổng điểm hứng đồ ăn: ${this.score} điểm (Chuỗi combo: x${this.maxCombo})`, 320, 195);

        ctx.fillStyle = '#90e0ef';
        ctx.font = '13px sans-serif';
        ctx.fillText('🍜 Đồ ăn (Mì trộn trứng, Cơm cánh gà, Burger...) đã vào Balo!', 320, 230);
        ctx.fillStyle = '#f4a261';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Nhấn Chơi Lại hoặc đóng bảng để tiếp tục dạo chơi', 320, 268);
    }

    drawLoseModal(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(110, 145, 420, 165);
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(110, 145, 420, 165);

        ctx.fillStyle = '#ff758f';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HẾT TIM HOẶC CHƯA ĐỦ ĐIỂM!', 320, 195);

        ctx.fillStyle = '#cccccc';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Bạn đạt ${this.score}/60 điểm mục tiêu. Tránh cá ươn, táo sâu & bom nhé!`, 320, 230);
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Hãy thử lại để thu thập nhiều món ăn thơm ngon!', 320, 262);
    }
}


window.ClawMachineGame = ClawMachineGame;
window.ShootingGalleryGame = ShootingGalleryGame;
window.CowPullingGame = CowPullingGame;
window.FallingFoodCatcherGame = FallingFoodCatcherGame;
