/**
 * WISHING TREE & WISHING BOARD SYSTEM - NGÀY NHÀ GIÁO VIỆT NAM 20/11
 * ĐẠI HỌC TÂY NGUYÊN (TNU: ĐÔI CÁNH ĐẠI NGÀN)
 * 
 * 1. CÂY ƯỚC NGUYỆN (WishingTree):
 *    - Sử dụng hình ảnh gốc: assets/Cayuocnguyen/14517.png
 *    - Hoạt ảnh xoay ngọn cây: 25 frames (assets/Cayuocnguyen/16303.png -> 16330.png)
 *      Bao lì xì đỏ may mắn và tiền vàng xoay tròn quanh ngôi sao đỉnh cây
 *    - Tương tác [E] hoặc Click: Mở bức thư tri ân Thầy Cô ngày 20/11
 * 
 * 2. BẢNG ƯỚC NGUYỆN (WishingBoard):
 *    - Đặt cạnh bãi đỗ xe phía Tây sảnh Tòa Điều Hành
 *    - Bảng gỗ cổ điển ghim giấy note sắc màu & thiệp trái tim
 *    - Tương tác [E] hoặc Click: Mở bảng danh sách lời chúc học sinh gửi tặng Thầy Cô
 *    - Cho phép người chơi tự viết lời chúc mới và lưu vào danh sách
 */

class WishingTree {
    constructor(x, y) {
        this.x = x; // 1620
        this.y = y; // 2880
        this.scale = 0.62;
        this.treeW = 272 * this.scale; // ~168px
        this.treeH = 320 * this.scale; // ~198px

        // Tải ảnh cây
        this.treeImg = new Image();
        this.treeImgLoaded = false;
        this.treeImg.onload = () => { this.treeImgLoaded = true; };
        this.treeImg.src = 'assets/Cayuocnguyen/14517.png';

        // Danh sách 25 frames ngọn cây
        this.fxFrameNames = [
            '16303.png', '16304.png', '16305.png', '16306.png', '16307.png',
            '16308.png', '16309.png', '16310.png', '16311.png', '16312.png',
            '16313.png', '16314.png', '16315.png', '16316.png', '16317.png',
            '16318.png', '16319.png', '16323.png', '16324.png', '16325.png',
            '16326.png', '16327.png', '16328.png', '16329.png', '16330.png'
        ];
        this.fxImages = [];
        this.fxLoaded = false;
        this.preloadFX();

        // Hoạt ảnh
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.07; // 70ms mỗi frame
        this.globalTime = 0;

        // Hạt bụi vàng lấp lánh (Sparkles)
        this.sparkles = [];
        for (let i = 0; i < 12; i++) {
            this.sparkles.push({
                x: (Math.random() - 0.5) * this.treeW * 0.9,
                y: -Math.random() * this.treeH,
                vy: -(12 + Math.random() * 16),
                size: 2 + Math.random() * 3,
                alpha: Math.random(),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    preloadFX() {
        let loaded = 0;
        this.fxImages = this.fxFrameNames.map(name => {
            const img = new Image();
            img.onload = () => {
                loaded++;
                if (loaded >= this.fxFrameNames.length) this.fxLoaded = true;
            };
            img.src = `assets/Cayuocnguyen/${name}`;
            return img;
        });
    }

    update(dt) {
        this.globalTime += dt;

        // Cập nhật frame ngọn cây
        this.frameTimer += dt;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.fxFrameNames.length;
        }

        // Cập nhật hạt bụi lấp lánh
        this.sparkles.forEach(s => {
            s.y += s.vy * dt;
            s.phase += dt * 4;
            s.alpha = 0.3 + Math.sin(s.phase) * 0.5;
            if (s.y < -this.treeH - 20) {
                s.y = 10;
                s.x = (Math.random() - 0.5) * this.treeW * 0.9;
            }
        });
    }

    draw(ctx, playerDist) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 1. Bóng đổ dưới gốc cây
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.beginPath();
        ctx.ellipse(0, 4, this.treeW * 0.42, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vẽ thân và tán Cây Ước Nguyện (14517.png)
        if (this.treeImgLoaded && this.treeImg.naturalWidth > 0) {
            try {
                ctx.drawImage(
                    this.treeImg,
                    -this.treeW / 2, -this.treeH,
                    this.treeW, this.treeH
                );
            } catch (e) {}
        }

        // 3. Vẽ hiệu ứng ngọn cây xoay quanh ngôi sao (16303 -> 16330)
        // Vị trí ngôi sao đỉnh cây: (0, -this.treeH + 45 * scale)
        const starX = 0;
        const starY = -this.treeH + (45 * this.scale);

        if (this.fxLoaded && this.fxImages[this.currentFrame]) {
            const fxImg = this.fxImages[this.currentFrame];
            if (fxImg.complete && fxImg.naturalWidth > 0) {
                const fxScale = this.scale * 0.95;
                const fxW = 412 * fxScale;
                const fxH = 408 * fxScale;
                // Căn tâm điểm xoay của ảnh (155, 155) khớp với ngôi sao
                const fxDrawX = starX - (155 * fxScale);
                const fxDrawY = starY - (155 * fxScale);

                // Quầng sáng vàng đỏ quanh đỉnh cây
                const pulse = 1 + Math.sin(this.globalTime * 4) * 0.12;
                const glowR = 52 * this.scale * pulse;
                const glow = ctx.createRadialGradient(starX, starY, 4, starX, starY, glowR);
                glow.addColorStop(0, 'rgba(255, 215, 0, 0.55)');
                glow.addColorStop(0.5, 'rgba(230, 57, 70, 0.22)');
                glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(starX, starY, glowR, 0, Math.PI * 2);
                ctx.fill();

                try {
                    ctx.drawImage(fxImg, fxDrawX, fxDrawY, fxW, fxH);
                } catch (e) {}
            }
        }

        // 4. Vẽ các hạt bụi vàng lấp lánh (Sparkles)
        ctx.fillStyle = '#ffd166';
        this.sparkles.forEach(s => {
            if (s.alpha > 0.05) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // 5. Bảng tên Overhead Badge
        const tagY = -this.treeH - 30;
        ctx.save();
        ctx.font = 'bold 12px sans-serif';
        const title = '✨ CÂY ƯỚC NGUYỆN 20/11 ✨';
        const tw = ctx.measureText(title).width;

        // Nền pill
        ctx.fillStyle = '#3c2a1e';
        ctx.beginPath();
        ctx.roundRect(-tw / 2 - 12, tagY - 14, tw + 24, 22, 11);
        ctx.fill();

        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#fedc82';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 0, tagY - 3);

        // Hướng dẫn tương tác khi ở gần
        if (playerDist < 85) {
            if (window.drawWorldPromptBadge) {
                window.drawWorldPromptBadge(ctx, 0, tagY - 26, '[E] Đọc Thư Tri Ân Thầy Cô 💌', {
                    theme: 'ruby',
                    timer: this.globalTime,
                    pointer: true
                });
            }
        }
        ctx.restore();

        ctx.restore();
    }
}

/**
 * BẢNG ƯỚC NGUYỆN (WishingBoard)
 * Đặt cạnh bãi đỗ xe phía Tây sảnh Tòa Điều Hành
 */
class WishingBoard {
    constructor(x, y) {
        this.x = x; // 1530
        this.y = y; // 3040
        this.scale = 0.165;
        this.width = 570 * this.scale;  // ~94px
        this.height = 520 * this.scale; // ~86px
        this.globalTime = 0;

        // Tải ảnh bảng ước nguyện đã tách nền chuẩn xác
        this.img = new Image();
        this.imgLoaded = false;
        this.img.onload = () => { this.imgLoaded = true; };
        this.img.src = 'assets/Cayuocnguyen/wishing_board.png';

        // Hạt lấp lánh nhẹ nhàng xung quanh bảng
        this.sparkles = [];
        for (let i = 0; i < 7; i++) {
            this.sparkles.push({
                x: (Math.random() - 0.5) * this.width * 1.1,
                y: -Math.random() * this.height,
                size: 1 + Math.random() * 2,
                speedY: 5 + Math.random() * 8,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    update(dt) {
        this.globalTime += dt;
        this.sparkles.forEach(s => {
            s.y -= s.speedY * dt;
            if (s.y < -this.height - 15) {
                s.y = 5;
                s.x = (Math.random() - 0.5) * this.width * 1.1;
            }
        });
    }

    draw(ctx, playerDist) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 1. Bóng đổ dưới thảm cỏ của bảng
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, 4, this.width * 0.44, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vẽ hình ảnh Bảng ước nguyện đã tách nền chuẩn xác
        if (this.imgLoaded && this.img.naturalWidth > 0) {
            try {
                ctx.drawImage(
                    this.img,
                    -this.width / 2, -this.height,
                    this.width, this.height
                );
            } catch (e) {}
        }

        // 3. Hiệu ứng ánh sao lấp lánh (Sparkles)
        this.sparkles.forEach(s => {
            const alpha = 0.35 + Math.sin(this.globalTime * 4 + s.phase) * 0.35;
            if (alpha > 0.1) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                ctx.fillStyle = '#bbf7d0';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // 4. Bảng tên Overhead
        const tagY = -this.height - 18;
        ctx.font = 'bold 11px sans-serif';
        const title = '📋 BẢNG ƯỚC NGUYỆN 20/11';
        const tw = ctx.measureText(title).width;

        ctx.fillStyle = '#3c2a1e';
        ctx.beginPath();
        ctx.roundRect(-tw / 2 - 10, tagY - 12, tw + 20, 20, 10);
        ctx.fill();

        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fefae0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 0, tagY - 2);

        // Hướng dẫn tương tác
        if (playerDist < 80) {
            if (window.drawWorldPromptBadge) {
                window.drawWorldPromptBadge(ctx, 0, tagY - 22, '[E] Xem Lời Chúc Thầy Cô 💖', {
                    theme: 'royal',
                    timer: this.globalTime,
                    pointer: true
                });
            }
        }

        ctx.restore();
    }
}

/**
 * QUẢN LÝ TƯƠNG TÁC MODAL THƯ 20/11 VÀ BẢNG ƯỚC NGUYỆN
 */
class WishingManager {
    constructor() {
        this.wishingTree = new WishingTree(1620, 2880);
        this.wishingBoard = new WishingBoard(1530, 3040);

        this.letterModal = null;
        this.boardModal = null;

        // Dữ liệu lời chúc mặc định (Khởi tạo nếu chưa có trong LocalStorage)
        this.defaultWishes = [
            {
                id: 'w1',
                author: 'Minh Tuấn (K45 CNTT)',
                target: 'ThS. Nguyễn Quốc Cường',
                tag: 'Công Nghệ Thông Tin',
                content: 'Nhớ mãi những đêm Thầy ngồi lại phòng lab kiên nhẫn hướng dẫn từng lỗi logic đồ án tốt nghiệp cho nhóm em. Nhân ngày 20/11, chúc Thầy luôn dồi dào sức khỏe và mãi giữ nụ cười thân thiện!',
                likes: 48,
                color: '#fff3b0',
                time: '17/11/2026'
            },
            {
                id: 'w2',
                author: 'Thanh Thảo (K45 CNTT)',
                target: 'TS. Nguyễn Thị Như',
                tag: 'Bộ môn Kỹ Thuật Phần Mềm',
                content: 'Cô Như như một người chị hiền luôn chu đáo lắng nghe và động viên chúng em vượt qua những kỳ thi cam go nhất. Kính chúc Cô luôn tươi trẻ, hạnh phúc và thành công trên bục giảng!',
                likes: 56,
                color: '#ffd6a5',
                time: '17/11/2026'
            },
            {
                id: 'w3',
                author: 'Hoàng Nam (K45 CNTT)',
                target: 'ThS. Nguyễn Đức Thắng',
                tag: 'Khoa học Máy tính',
                content: 'Chúc Thầy Thắng ngọn lửa nhiệt huyết công nghệ luôn bùng cháy! Cảm ơn Thầy đã truyền cho chúng em tình yêu với lập trình và tư duy giải quyết vấn đề thực tế!',
                likes: 39,
                color: '#fdffb6',
                time: '17/11/2026'
            },
            {
                id: 'w4',
                author: 'Thu Hà (K44 Nông Lâm)',
                target: 'Quý Thầy Cô Khoa Nông Lâm Nghiệp',
                tag: 'Nông Lâm Nghiệp',
                content: 'Cảm ơn Thầy Cô đã dạy chúng em biết trân quý từng hạt mầm, từng tấc đất bazan trù phú của Tây Nguyên đại ngàn. Kính chúc Thầy Cô một mùa hiến chương ấm áp!',
                likes: 42,
                color: '#caffbf',
                time: '17/11/2026'
            },
            {
                id: 'w5',
                author: 'Nhóm Đồ Án Tốt Nghiệp K45',
                target: 'Toàn thể Giảng viên TNU',
                tag: 'K45 TNU',
                content: '4 năm thanh xuân dưới mái trường Đại học Tây Nguyên sẽ là hành trang vô giá theo suốt cuộc đời chúng em. Tri ân công lao dạy dỗ bao la của tất cả Quý Thầy Cô!',
                likes: 95,
                color: '#ffc6ff',
                time: '17/11/2026'
            },
            {
                id: 'w6',
                author: 'Đức Trọng (K46 Y Dược)',
                target: 'Các Thầy Cô Bệnh viện Thực hành',
                tag: 'Y Đa Khoa',
                content: 'Dưới tà áo blouse trắng, sự tận tụy cứu người và dạy học của Thầy Cô là tấm gương sáng nhất cho chúng em noi theo. Kính chúc Thầy Cô luôn bình an và hạnh phúc!',
                likes: 51,
                color: '#9bf6ff',
                time: '17/11/2026'
            }
        ];

        this.wishes = [];
    }

    init() {
        this.letterModal = document.getElementById('modal-teacher-letter');
        this.boardModal = document.getElementById('modal-wishing-board');

        // Nạp lời chúc từ LocalStorage
        try {
            const saved = localStorage.getItem('tnu_wishing_board_data');
            if (saved) {
                this.wishes = JSON.parse(saved);
            } else {
                this.wishes = [...this.defaultWishes];
                localStorage.setItem('tnu_wishing_board_data', JSON.stringify(this.wishes));
            }
        } catch (e) {
            this.wishes = [...this.defaultWishes];
        }

        // Bắt sự kiện form gửi lời chúc mới
        const formSubmitBtn = document.getElementById('btn-submit-new-wish');
        if (formSubmitBtn) {
            formSubmitBtn.onclick = () => this.handleAddNewWish();
        }

        // Nút thả tim tri ân trong thư 20/11
        const btnHeartLetter = document.getElementById('btn-letter-send-heart');
        if (btnHeartLetter) {
            btnHeartLetter.onclick = () => this.handleHeartLetter();
        }

        // Nút tặng hoa trong thư 20/11
        const btnFlowerLetter = document.getElementById('btn-letter-send-flower');
        if (btnFlowerLetter) {
            btnFlowerLetter.onclick = () => this.handleFlowerLetter();
        }
    }

    update(dt) {
        this.wishingTree.update(dt);
        this.wishingBoard.update(dt);
    }

    draw(ctx, player) {
        if (!player) return;

        const distTree = Math.hypot(player.x - this.wishingTree.x, player.y - this.wishingTree.y);
        this.wishingTree.draw(ctx, distTree);

        const distBoard = Math.hypot(player.x - this.wishingBoard.x, player.y - this.wishingBoard.y);
        this.wishingBoard.draw(ctx, distBoard);
    }

    checkInteraction(player) {
        if (!player) return false;

        const distTree = Math.hypot(player.x - this.wishingTree.x, player.y - this.wishingTree.y);
        if (distTree < 90) {
            this.openTeacherLetterModal();
            return true;
        }

        const distBoard = Math.hypot(player.x - this.wishingBoard.x, player.y - this.wishingBoard.y);
        if (distBoard < 80) {
            this.openWishingBoardModal();
            return true;
        }

        return false;
    }

    openTeacherLetterModal() {
        if (!this.letterModal) return;
        this.letterModal.classList.remove('hidden');
        this.letterModal.classList.add('flex');

        if (window.soundSystem && window.soundSystem.playSelect) {
            window.soundSystem.playSelect();
        }
    }

    closeTeacherLetterModal() {
        if (!this.letterModal) return;
        this.letterModal.classList.add('hidden');
        this.letterModal.classList.remove('flex');
    }

    openWishingBoardModal() {
        if (!this.boardModal) return;
        this.boardModal.classList.remove('hidden');
        this.boardModal.classList.add('flex');

        this.renderWishesList();

        if (window.soundSystem && window.soundSystem.playSelect) {
            window.soundSystem.playSelect();
        }
    }

    closeWishingBoardModal() {
        if (!this.boardModal) return;
        this.boardModal.classList.add('hidden');
        this.boardModal.classList.remove('flex');
    }

    closeModals() {
        this.closeTeacherLetterModal();
        this.closeWishingBoardModal();
    }

    checkClick(worldX, worldY) {
        // Kiểm tra click vào Cây ước nguyện (tâm x: 1620, y: 2880, chiều cao treeH)
        const distTree = Math.hypot(worldX - this.wishingTree.x, worldY - (this.wishingTree.y - this.wishingTree.treeH / 2));
        if (distTree < 110) {
            this.openTeacherLetterModal();
            return true;
        }

        // Kiểm tra click vào Bảng ước nguyện (tâm x: 1530, y: 3040)
        const distBoard = Math.hypot(worldX - this.wishingBoard.x, worldY - (this.wishingBoard.y - this.wishingBoard.height / 2));
        if (distBoard < 70) {
            this.openWishingBoardModal();
            return true;
        }

        return false;
    }

    renderWishesList() {
        const container = document.getElementById('wishing-board-cards-grid');
        if (!container) return;

        container.innerHTML = '';
        this.wishes.forEach(wish => {
            const card = document.createElement('div');
            card.className = 'wish-sticky-note p-3.5 rounded-xl border-2 border-[#3c2a1e] flex flex-col justify-between shadow-md transition-all';
            card.style.backgroundColor = wish.color || '#fff3b0';

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between border-b border-[#3c2a1e]/20 pb-1.5 mb-2">
                        <span class="font-quest font-bold text-xs text-[#3c2a1e]">${wish.author}</span>
                        <span class="text-[10px] font-mono text-[#6b5037]">${wish.time || '20/11'}</span>
                    </div>
                    <div class="text-[11px] font-semibold text-[#9d0208] mb-1.5 flex items-center gap-1">
                        <span>🎓</span> <span>${wish.target}</span>
                    </div>
                    <p class="text-xs text-[#2b1704] font-medium leading-relaxed italic">
                        "${wish.content}"
                    </p>
                </div>
                <div class="flex items-center justify-between pt-2.5 mt-2 border-t border-[#3c2a1e]/15">
                    <span class="text-[9.5px] px-2 py-0.5 rounded-full bg-black/10 font-bold text-[#3c2a1e]">${wish.tag || 'TNU'}</span>
                    <button class="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-[#e63946] border border-[#3c2a1e]/30 flex items-center gap-1 active:scale-95 transition-transform" onclick="window.wishingManager.likeWish('${wish.id}')">
                        <span>❤️</span> <span id="like-count-${wish.id}">${wish.likes}</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    likeWish(wishId) {
        const wish = this.wishes.find(w => w.id === wishId);
        if (wish) {
            wish.likes++;
            const el = document.getElementById(`like-count-${wishId}`);
            if (el) el.innerText = wish.likes;
            try {
                localStorage.setItem('tnu_wishing_board_data', JSON.stringify(this.wishes));
            } catch (e) {}

            if (window.soundSystem && window.soundSystem.playCollect) {
                window.soundSystem.playCollect();
            }
        }
    }

    handleAddNewWish() {
        const authorInput = document.getElementById('input-wish-author');
        const targetInput = document.getElementById('select-wish-target');
        const contentInput = document.getElementById('input-wish-content');

        const author = authorInput ? authorInput.value.trim() : '';
        const target = targetInput ? targetInput.value : 'Toàn thể Giảng viên TNU';
        const content = contentInput ? contentInput.value.trim() : '';

        if (!author || !content) {
            if (window.uiManager && window.uiManager.showToast) {
                window.uiManager.showToast('⚠️ Vui lòng nhập tên của bạn và lời chúc!', 'error');
            }
            return;
        }

        const colors = ['#fff3b0', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#ffc6ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newWish = {
            id: 'w_' + Date.now(),
            author: author,
            target: target,
            tag: 'Học sinh / Sinh viên TNU',
            content: content,
            likes: 1,
            color: randomColor,
            time: 'Hôm nay'
        };

        this.wishes.unshift(newWish);
        try {
            localStorage.setItem('tnu_wishing_board_data', JSON.stringify(this.wishes));
        } catch (e) {}

        // Tăng điểm thiện cảm & Hoàn thành nhiệm vụ viết tâm thư mở khóa PET
        if (window.useGameStore) {
            window.useGameStore.addAffection(10);
            if (typeof window.useGameStore.unlockAllPets === 'function') {
                window.useGameStore.unlockAllPets();
            } else {
                window.useGameStore.setState(s => ({
                    quests: {
                        ...s.quests,
                        tam_thu_uoc_nguyen: {
                            ...(s.quests.tam_thu_uoc_nguyen || {}),
                            status: 'completed',
                            completedAt: Date.now()
                        }
                    }
                }));
                window.useGameStore.checkAllUnlocks();
            }
        }

        // Xóa form
        if (contentInput) contentInput.value = '';

        this.renderWishesList();

        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        }

        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast('💌 Lời tâm thư của bạn đã được gửi tới Thầy Cô! 🎉 ĐÃ MỞ KHÓA TOÀN BỘ PET (+10 Thiện cảm)!', 'success');
        }
    }

    handleHeartLetter() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        if (window.soundSystem && window.soundSystem.playLevelUp) {
            window.soundSystem.playLevelUp();
        }
        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast('💖 Đã gửi ngàn trái tim yêu thương tri ân Quý Thầy Cô! (+10 Thiện cảm)', 'success');
        }
    }

    handleFlowerLetter() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
        if (window.soundSystem && window.soundSystem.playLevelUp) {
            window.soundSystem.playLevelUp();
        }
        if (window.uiManager && window.uiManager.showToast) {
            window.uiManager.showToast('💐 Đã kính dâng đóa hoa tươi thắm nhất lên Quý Thầy Cô nhân ngày 20/11!', 'success');
        }
    }
}

// Khởi tạo Singleton
window.wishingManager = new WishingManager();
