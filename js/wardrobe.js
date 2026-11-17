/**
 * WARDROBE & BOUTIQUE MANAGER (TỦ ĐỒ THỜI TRANG & CÁNH BAY TNU - MỞ KHÓA TOÀN BỘ)
 * Quản lý giao diện Tủ Đồ 3 Tabs:
 * 1. 🪽 Cánh Bay & Biến Thể Màu (Toàn bộ cánh mở khóa sẵn 100%)
 * 2. 👔 Trang Phục (Thổ cẩm Ê Đê, Đồ thể dục TNU, Áo dài, Blouse, Cử nhân, THPT Cao Nguyên...)
 * 3. 💇 Kiểu Tóc & Diện Mạo (10 kiểu tóc Chibi Anime, 8 màu tóc, 4 tone da)
 * Kèm Live Preview nhân vật Chibi vỗ cánh 360 độ thời gian thực!
 */

const WING_ICON_BBOX = {
    wing_cyber_hex: { sx: 22, sy: 13, sw: 308, sh: 141 },
    wing_pink_angel: { sx: 4, sy: 14, sw: 104, sh: 84 },
    wing_chaos_angel: { sx: 58, sy: 0, sw: 305, sh: 231 },
    wing_azure_dragon: { sx: 0, sy: 3, sw: 251, sh: 133 },
    wing_golden_solar: { sx: 398, sy: 530, sw: 843, sh: 369 },
    wing_crimson_blaze: { sx: 0, sy: 72, sw: 500, sh: 254 },
    wing_void_amethyst: { sx: 0, sy: 74, sw: 500, sh: 254 },
    wing_silver_seraph: { sx: 88, sy: 151, sw: 433, sh: 270 },
    wing_glacial_frost: { sx: 56, sy: 132, sw: 915, sh: 667 },
    wing_holy_white: { sx: 9, sy: 0, sw: 186, sh: 141 },
    wing_rainbow_celestial: { sx: 338, sy: 167, sw: 392, sh: 249 },
    wing_void_thunder: { sx: 0, sy: 27, sw: 500, sh: 315 },
    wing_mecha_seraph: { sx: 193, sy: 25, sw: 644, sh: 479 },
    wing_blazing_phoenix: { sx: 0, sy: 7, sw: 92, sh: 68 },
    wing_glacial_sovereign: { sx: 20, sy: 17, sw: 114, sh: 102 },
    wing_aurora_seraph: { sx: 74, sy: 35, sw: 352, sh: 339 },
    wing_abyssal_drake: { sx: 99, sy: 55, sw: 322, sh: 245 }
};

class WardrobeManager {
    constructor() {
        this.currentTab = 'outfits'; // Mặc định mở tab Trang Phục để thấy ngay Thổ cẩm Ê Đê & Thể Dục TNU
        this.previewAnimTimer = 0;
        this.previewFlapTimer = 0;
        this.previewDirection = 'down'; // 'down', 'right', 'up', 'left'
        this.previewInterval = null;
    }

    // Mở Tủ Đồ
    openModal() {
        const modal = document.getElementById('wardrobe-modal');
        if (!modal) return;

        window.uiManager.openModal(modal);
        this.renderWardrobeUI();
        this.startLivePreview();
    }

    // Đổi tab
    switchTab(tabName) {
        this.currentTab = (tabName === 'wings' || tabName === 'pets') ? tabName : 'outfits';
        document.querySelectorAll('.wardrobe-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('.interactive-icon');
            if (icon && icon.getAttribute('data-normal')) {
                icon.src = icon.getAttribute('data-normal');
            }
        });
        const activeBtn = document.getElementById(`tab-btn-${this.currentTab}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            const icon = activeBtn.querySelector('.interactive-icon');
            if (icon && icon.getAttribute('data-active')) {
                icon.src = icon.getAttribute('data-active');
                icon.classList.add('icon-pop-spring');
                setTimeout(() => icon.classList.remove('icon-pop-spring'), 450);
            }
        }
        this.renderWardrobeUI();
    }

    // Render toàn bộ giao diện Tủ Đồ (3 Tabs: Trang Phục, Cánh Bay, Thú Cưng)
    renderWardrobeUI() {
        const container = document.getElementById('wardrobe-items-grid');
        const bannerContainer = document.getElementById('wardrobe-progress-banner');
        if (!container) return;

        const state = window.useGameStore.state;
        const i18n = window.i18n;

        // Cập nhật trạng thái active cho tab và đổi icon
        document.querySelectorAll('.wardrobe-tab-btn').forEach(btn => {
            const isActive = btn.id === `tab-btn-${this.currentTab}`;
            btn.classList.toggle('active', isActive);
            const icon = btn.querySelector('.interactive-icon');
            if (icon) {
                const targetSrc = isActive ? icon.getAttribute('data-active') : icon.getAttribute('data-normal');
                if (targetSrc) icon.src = targetSrc;
            }
        });

        // 1. Render Banner Tiến Trình Điểm Thiện Cảm
        if (bannerContainer) {
            const affection = state.progression.diem_thien_cam || 0;
            const isUnlockedAll = affection >= 100;
            bannerContainer.innerHTML = `
                <div class="p-3 mb-3 rounded-xl border-2 border-[#8c6d48] bg-[#fffcf2] flex items-center justify-between shadow-md">
                    <div class="flex items-center space-x-3">
                        <div class="text-3xl animate-bounce">${isUnlockedAll ? '👑' : '🎓'}</div>
                        <div>
                            <div class="text-xs uppercase tracking-wider font-bold text-[#8c3b12] flex items-center space-x-2 font-quest">
                                <span class="flex items-center gap-1.5"><img src="assets/ui/icons/heart_normal.png" alt="Thiện Cảm" class="interactive-icon w-4 h-4 object-contain inline-block drop-shadow" /> ${i18n.t('affection_label')} ${affection}/100</span>
                                ${isUnlockedAll 
                                    ? '<span class="bg-[#cbf0cb] text-[#123013] border border-[#557053] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">ĐÃ MỞ KHÓA TẤT CẢ</span>' 
                                    : '<span class="bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">TÂN SINH VIÊN</span>'}
                            </div>
                            <div class="text-xs text-[#5c4731] mt-0.5 font-quest">
                                ${isUnlockedAll 
                                    ? '✨ Danh hiệu Sinh Viên Xuất Sắc TNU! Toàn bộ trang phục hoàn chỉnh, cánh bay và thú cưng đã mở khóa 100%!'
                                    : '🌸 Tích lũy điểm thiện cảm từ hoa hồng và hoàn thành đồ án để mở khóa thêm các loại cánh & thần thú mới!'}
                            </div>
                        </div>
                    </div>
                    <div class="w-36 bg-[#ecdcb4] h-3 rounded-full overflow-hidden border border-[#7c6348] shadow-inner">
                        <div class="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 transition-all duration-500" style="width: ${Math.min(100, affection)}%"></div>
                    </div>
                </div>
            `;
        }

        // 2. Render Nội dung Tab
        container.innerHTML = '';

        if (this.currentTab === 'wings') {
            this.renderWingsTab(container);
        } else if (this.currentTab === 'pets') {
            this.renderPetsTab(container);
        } else {
            this.renderOutfitsTab(container);
        }
    }

    // Render Tab Thần Thú Đồng Hành (COMPANION PETS FRAME SYSTEM)
    renderPetsTab(container) {
        const state = window.useGameStore.state;
        const i18n = window.i18n;
        const equippedPet = state.progression.pet_hien_tai;

        // Nút cho Pet nghỉ ngơi nếu đang mang
        if (equippedPet) {
            const unequipBtn = document.createElement('div');
            unequipBtn.className = 'col-span-full mb-2 flex justify-end';
            unequipBtn.innerHTML = `
                <button class="px-3.5 py-1.5 bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border-2 border-[#ef4444] rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 font-quest" id="btn-unequip-pet">
                    <span>❌</span> <span>${i18n.t('pet_btn_unequip')}</span>
                </button>
            `;
            container.appendChild(unequipBtn);
            unequipBtn.querySelector('#btn-unequip-pet').onclick = () => {
                window.useGameStore.equipPet(null);
                if (window.soundSystem) window.soundSystem.playOutfitChange();
                this.renderWardrobeUI();
            };
        }

        // Render từng thẻ Pet 120x90
        const registry = window.PETS_REGISTRY || {};
        Object.values(registry).forEach(pet => {
            const isEquipped = equippedPet === pet.id;
            const isOwned = (state.progression.pet_so_huu || []).includes(pet.id);
            const totalF = (window.petSQLDB && window.petSQLDB.getFrames(pet.id).length) || pet.totalFrames || 5;

            const card = document.createElement('div');
            card.className = `relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center font-quest shadow-md ${
                isEquipped ? 'bg-[#fff9e6] border-[#c97d26] ring-2 ring-[#c97d26]/40 scale-[1.02]' : 
                (isOwned ? 'bg-[#fffcf2] border-[#b89b72] hover:border-[#8c6d48] hover:bg-[#faf5e4]' : 'bg-[#f7f3e8] border-[#d1c2a5] opacity-75')
            }`;

            // Tạo canvas icon Pet
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 120;
            iconCanvas.height = 90;
            iconCanvas.className = 'rounded-xl mb-2 shadow-inner';
            this.drawPetIcon(iconCanvas, pet.id);

            // Nhãn badge Frame
            const badgeHtml = isOwned 
                ? `<span class="absolute top-1.5 left-1.5 bg-[#e0f2fe] text-[#0369a1] border border-[#38bdf8] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow animate-pulse">⚡ ${totalF} FRAMES</span>`
                : `<span class="absolute top-1.5 left-1.5 bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow">CHƯA SỞ HỮU</span>`;

            card.innerHTML = `
                <div class="relative w-full flex justify-center">
                    ${badgeHtml}
                </div>
                <div class="font-bold text-sm text-[#432818] mb-1 font-quest">
                    ${i18n.t(pet.nameKey) || pet.id}
                </div>
                <div class="text-[11px] text-[#7f5539] mb-3 line-clamp-2 px-1 font-quest leading-relaxed">
                    ${i18n.t(pet.descKey) || ''}
                </div>
                <div class="w-full mt-auto">
                    ${isEquipped ? `
                        <button class="w-full py-1.5 rounded-xl font-bold text-xs bg-[#52b788] text-white border-2 border-[#2d6a4f] shadow font-quest flex items-center justify-center space-x-1" disabled>
                            <span>✅</span> <span>${i18n.t('pet_btn_equipped')}</span>
                        </button>
                    ` : (isOwned ? `
                        <button class="w-full py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow hover:shadow-md font-quest flex items-center justify-center space-x-1" id="btn-equip-pet-${pet.id}">
                            <span>🐾</span> <span>${i18n.t('pet_btn_equip')}</span>
                        </button>
                    ` : `
                        <div class="w-full py-1.5 bg-[#e9e3d0] text-[#8c7b64] border border-[#c4b69d] rounded-xl text-xs font-bold font-quest cursor-not-allowed">🔒 Chưa Mở Khóa</div>
                    `)}
                </div>
            `;

            const btnContainer = card.querySelector('.relative.w-full');
            btnContainer.appendChild(iconCanvas);

            const equipBtn = card.querySelector(`#btn-equip-pet-${pet.id}`);
            if (equipBtn && isOwned) {
                equipBtn.onclick = () => {
                    window.useGameStore.equipPet(pet.id);
                    if (window.soundSystem) window.soundSystem.playOutfitChange();
                    if (window.gameInstance && window.gameInstance.player && window.gameInstance.player.companionPet) {
                        window.gameInstance.player.companionPet.triggerHeart();
                    }
                    this.renderWardrobeUI();
                };
            }

            container.appendChild(card);
        });
    }

    // Vẽ icon 120x90 cho Thú Cưng
    drawPetIcon(canvas, petId) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Nền thẻ mềm màu be / giấy vẽ cổ điển
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#fbf6d9');
        bgGrad.addColorStop(1, '#f3ebd0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#b89b72';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1, 1, w - 2, h - 2);

        // Nạp icon hoặc frame đầu tiên
        if (window.petSQLDB && window.petSQLDB.isFramePet(petId)) {
            const iconImg = window.petSQLDB.getIconImage(petId) || window.petSQLDB.getFrameImage(petId, 0);
            if (iconImg && (iconImg.complete || iconImg.naturalWidth > 0)) {
                ctx.save();
                const tmpl = window.petSQLDB.getPetTemplate(petId);
                const rw = tmpl ? tmpl.render_width : 56;
                const rh = tmpl ? tmpl.render_height : 48;

                // Bóng đổ dưới chân pet trong thẻ
                ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
                ctx.beginPath();
                ctx.ellipse(w / 2, h / 2 + rh / 2 - 2, rw * 0.35, 5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Vẽ Pet ở trung tâm thẻ
                ctx.drawImage(iconImg, w / 2 - rw / 2, h / 2 - rh / 2, rw, rh);
                ctx.restore();
                return;
            }
        }

        // Fallback
        ctx.save();
        if (window.CompanionPet) {
            window.CompanionPet.drawPetSprite(ctx, petId, w / 2, h / 2, 1, 0, 1.0, true);
        }
        ctx.restore();
    }

    // Render Tab 1: Toàn bộ Cánh Bay & Biến Thể Màu Atlas (MỞ KHÓA HẾT 100%)
    renderWingsTab(container) {
        const state = window.useGameStore.state;
        const i18n = window.i18n;
        const equippedWing = state.progression.canh_hien_tai;

        // Nút tháo cánh nếu đang đeo
        if (equippedWing) {
            const unequipBtn = document.createElement('div');
            unequipBtn.className = 'col-span-full mb-2 flex justify-end';
            unequipBtn.innerHTML = `
                <button class="px-3.5 py-1.5 bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border-2 border-[#ef4444] rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 font-quest" id="btn-unequip-wing">
                    <span>❌</span> <span>${i18n.t('wardrobe_btn_unequip')}</span>
                </button>
            `;
            container.appendChild(unequipBtn);
            unequipBtn.querySelector('#btn-unequip-wing').onclick = () => {
                window.useGameStore.equipWing(null);
                if (window.soundSystem) window.soundSystem.playOutfitChange();
                this.renderWardrobeUI();
            };
        }

        // Render từng thẻ cánh 120x90
        Object.values(window.WINGS_REGISTRY).forEach(wing => {
            const isEquipped = equippedWing === wing.id;
            const isOwned = (state.progression.canh_so_huu || []).includes(wing.id);
            const isFrameWing = window.wingSQLDB && window.wingSQLDB.isFrameWing(wing.id);

            const card = document.createElement('div');
            card.className = `relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center font-quest shadow-md ${
                isEquipped ? 'bg-[#fff9e6] border-[#c97d26] ring-2 ring-[#c97d26]/40 scale-[1.02]' : 
                (isOwned ? 'bg-[#fffcf2] border-[#b89b72] hover:border-[#8c6d48] hover:bg-[#faf5e4]' : 'bg-[#f7f3e8] border-[#d1c2a5] opacity-75')
            }`;

            // Tạo canvas icon cánh
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 120;
            iconCanvas.height = 90;
            iconCanvas.className = 'rounded-xl mb-2 shadow-inner';
            this.drawWingIcon(iconCanvas, wing.id);

            // Nhãn badge
            let badgeHtml = isOwned 
                ? '<span class="absolute top-1.5 left-1.5 bg-[#d8f3dc] text-[#1b4332] border border-[#52b788] font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shadow">SỞ HỮU</span>'
                : '<span class="absolute top-1.5 left-1.5 bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shadow">CHƯA SỞ HỮU</span>';

            if (isOwned && (isFrameWing || wing.isFrameWing)) {
                const totalF = (window.wingSQLDB && window.wingSQLDB.getFrames(wing.id).length) || wing.totalFrames || 4;
                badgeHtml = `<span class="absolute top-1.5 left-1.5 bg-[#e0f2fe] text-[#0369a1] border border-[#38bdf8] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow animate-pulse">⚡ ${totalF} FRAMES</span>`;
            }

            card.innerHTML = `
                <div class="relative w-full flex justify-center">
                    <div class="icon-mount"></div>
                    ${badgeHtml}
                    ${isEquipped ? '<span class="absolute top-1.5 right-1.5 bg-[#ffeedb] text-[#9a3412] border border-[#f97316] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow animate-pulse">ĐANG ĐEO</span>' : ''}
                </div>
                <div class="font-bold text-sm text-[#3b2512] mt-1.5 font-quest">${i18n.t(wing.nameKey)}</div>
                <div class="text-[11px] text-[#6b5037] leading-tight mt-1 mb-2 line-clamp-2 font-quest">${i18n.t(wing.descKey)}</div>
                <div class="w-full mt-auto">
                    ${isEquipped ? `
                        <div class="w-full py-1.5 bg-[#f4ecc4] text-[#7c6348] border border-[#a68a68] rounded-lg text-xs font-bold font-quest">Đang Mặc</div>
                    ` : (isOwned ? `
                        <button class="w-full py-1.5 quest-image2-btn font-quest text-xs font-bold btn-equip-wing flex items-center justify-center space-x-1">
                            <span>✨</span> <span>Mặc Ngay</span>
                        </button>
                    ` : `
                        <div class="w-full py-1.5 bg-[#e9e3d0] text-[#8c7b64] border border-[#c4b69d] rounded-lg text-xs font-bold font-quest cursor-not-allowed">🔒 Chưa Mở Khóa</div>
                    `)}
                </div>
            `;

            card.querySelector('.icon-mount').replaceWith(iconCanvas);

            const equipBtn = card.querySelector('.btn-equip-wing');
            if (equipBtn && isOwned) {
                equipBtn.onclick = () => {
                    window.useGameStore.equipWing(wing.id);
                    if (window.soundSystem) window.soundSystem.playOutfitChange();
                    if (window.gameInstance && window.gameInstance.particleSystem) {
                        window.gameInstance.particleSystem.burstCelebration(window.gameInstance.player.x, window.gameInstance.player.y);
                    }
                    this.renderWardrobeUI();
                };
            }

            container.appendChild(card);
        });
    }

    // Render Tab 2: Toàn bộ Trang Phục Hoàn Chỉnh Đồng Bộ 100%
    renderOutfitsTab(container) {
        const state = window.useGameStore.state;
        const i18n = window.i18n;
        const equippedOutfit = state.progression.trang_phuc_hien_tai;

        const outfits = (window.bodySQLDB && window.bodySQLDB.tables.body_templates.length > 0) 
            ? window.bodySQLDB.tables.body_templates 
            : Object.values(window.OUTFITS_DATA);

        outfits.forEach(outfit => {
            const outfitId = outfit.body_id || outfit.id;
            const isEquipped = (equippedOutfit === outfitId) || (window.bodySQLDB && window.bodySQLDB.resolveOutfitId(equippedOutfit) === outfitId);
            const isOwned = (state.progression.trang_phuc_so_huu || []).includes(outfitId);

            const card = document.createElement('div');
            card.className = `relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center font-quest shadow-md ${
                isEquipped ? 'bg-[#fff9e6] border-[#c97d26] ring-2 ring-[#c97d26]/40 scale-[1.02]' : 
                (isOwned ? 'bg-[#fffcf2] border-[#b89b72] hover:border-[#8c6d48] hover:bg-[#faf5e4]' : 'bg-[#f7f3e8] border-[#d1c2a5] opacity-75')
            }`;

            // Tạo canvas icon trang phục full character
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 120;
            iconCanvas.height = 90;
            iconCanvas.className = 'rounded-xl mb-2 shadow-inner';
            this.drawOutfitIcon(iconCanvas, outfitId);

            const badgeHtml = isOwned 
                ? '<span class="absolute top-1.5 left-1.5 bg-[#e0f2fe] text-[#0369a1] border border-[#38bdf8] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow animate-pulse">⚡ 12 FRAMES 4 HƯỚNG</span>'
                : '<span class="absolute top-1.5 left-1.5 bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow">CHƯA MỞ KHÓA</span>';

            card.innerHTML = `
                <div class="relative w-full flex justify-center">
                    <div class="icon-mount"></div>
                    ${badgeHtml}
                    ${isEquipped ? '<span class="absolute top-1.5 right-1.5 bg-[#ffeedb] text-[#9a3412] border border-[#f97316] font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow animate-pulse">ĐANG MẶC</span>' : ''}
                </div>
                <div class="font-bold text-sm text-[#3b2512] mt-1.5 font-quest">${i18n.t(outfit.nameKey) || outfit.name}</div>
                <div class="text-[11px] text-[#6b5037] leading-tight mt-1 mb-2 line-clamp-2 font-quest">${i18n.t(outfit.descKey) || ''}</div>
                <div class="w-full mt-auto">
                    ${isEquipped ? `
                        <div class="w-full py-1.5 bg-[#f4ecc4] text-[#7c6348] border border-[#a68a68] rounded-lg text-xs font-bold font-quest">Đang Mặc</div>
                    ` : (isOwned ? `
                        <button class="w-full py-1.5 quest-image2-btn font-quest text-xs font-bold btn-equip-outfit flex items-center justify-center space-x-1">
                            <span>👔</span> <span>Mặc Ngay</span>
                        </button>
                    ` : `
                        <div class="w-full py-1.5 bg-[#e9e3d0] text-[#8c7b64] border border-[#c4b69d] rounded-lg text-xs font-bold font-quest cursor-not-allowed">🔒 Chưa Mở Khóa</div>
                    `)}
                </div>
            `;

            card.querySelector('.icon-mount').replaceWith(iconCanvas);

            const equipBtn = card.querySelector('.btn-equip-outfit');
            if (equipBtn && isOwned) {
                equipBtn.onclick = () => {
                    window.useGameStore.equipOutfit(outfitId);
                    if (window.soundSystem) window.soundSystem.playOutfitChange();
                    if (window.gameInstance && window.gameInstance.particleSystem) {
                        window.gameInstance.particleSystem.burstCelebration(window.gameInstance.player.x, window.gameInstance.player.y);
                    }
                    this.renderWardrobeUI();
                };
            }

            container.appendChild(card);
        });
    }

    // Vẽ icon 120x90 cho cánh chuẩn Thick-outline hoặc tải từ ảnh thực tế SQL Buffer
    drawWingIcon(canvas, wingId) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Nền thẻ mềm màu be / giấy vẽ
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#fbf6d9');
        bgGrad.addColorStop(1, '#f3ebd0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Viền thẻ
        ctx.strokeStyle = '#b89b72';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1, 1, w - 2, h - 2);

        // 1. Nếu là cánh Frame từ Database ảnh & SQL Buffer
        if (window.wingSQLDB && window.wingSQLDB.isFrameWing(wingId)) {
            const iconImg = window.wingSQLDB.getIconImage(wingId) || window.wingSQLDB.getFrameImage(wingId, 0);
            if (iconImg && (iconImg.complete || iconImg.naturalWidth > 0)) {
                ctx.save();
                const natW = iconImg.naturalWidth || 200;
                const natH = iconImg.naturalHeight || 200;

                // Tự động căn chỉnh theo bounding box nội dung thực tế (loại bỏ viền trong suốt thừa, giúp icon to rõ đẹp mắt)
                const bbox = WING_ICON_BBOX[wingId];
                const sx = bbox ? bbox.sx : 0;
                const sy = bbox ? bbox.sy : 0;
                const sw = bbox ? bbox.sw : natW;
                const sh = bbox ? bbox.sh : natH;
                const aspect = sw / sh;

                const maxW = 104;
                const maxH = 72;
                let targetW, targetH;
                if (aspect > maxW / maxH) {
                    targetW = maxW;
                    targetH = Math.min(maxH, Math.round(maxW / aspect));
                } else {
                    targetH = maxH;
                    targetW = Math.min(maxW, Math.round(maxH * aspect));
                }

                const dx = Math.round((w - targetW) / 2);
                const dy = Math.round((h - targetH) / 2);
                ctx.drawImage(iconImg, sx, sy, sw, sh, dx, dy, targetW, targetH);
                ctx.restore();
                return;
            }
        }

        // 2. Fallback vẽ cánh procedural
        ctx.save();
        ctx.translate(w / 2, h / 2 + 6);
        ctx.scale(0.85, 0.85);

        // Cánh trái
        WingsRenderer.drawWing(ctx, wingId, 'left', 0.15);
        // Cánh phải
        WingsRenderer.drawWing(ctx, wingId, 'right', 0.15);

        ctx.restore();
    }

    // Vẽ icon 120x90 cho trang phục hoàn chỉnh
    drawOutfitIcon(canvas, outfitId) {
        if (window.bodySQLDB) {
            window.bodySQLDB.drawBodyIcon(canvas, outfitId);
        }
    }

    // Live Preview nhân vật trong tủ đồ (Xoay 360 độ 4 hướng mượt mà)
    startLivePreview() {
        if (this.previewInterval) clearInterval(this.previewInterval);

        const previewCanvas = document.getElementById('wardrobe-character-preview');
        if (!previewCanvas) return;

        const ctx = previewCanvas.getContext('2d');

        this.previewWingRealTimer = 0;
        this.previewInterval = setInterval(() => {
            this.previewAnimTimer += 0.05;
            this.previewFlapTimer += 0.08;
            this.previewWingRealTimer = (this.previewWingRealTimer || 0) + 0.033;

            // Xoay nhẹ nhân vật qua 4 hướng ('down' -> 'right' -> 'up' -> 'left')
            const dirCycle = Math.floor(this.previewAnimTimer * 0.35) % 4;
            this.previewDirection = ['down', 'right', 'up', 'left'][dirCycle];

            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

            // Nền bục quay thời trang tròn
            ctx.save();
            ctx.translate(previewCanvas.width / 2, previewCanvas.height / 2 + 35);
            ctx.scale(1.9, 1.9);

            // Bục đứng phát sáng vàng kim
            const podiumGrad = ctx.createRadialGradient(0, 18, 5, 0, 18, 32);
            podiumGrad.addColorStop(0, 'rgba(255, 209, 102, 0.5)');
            podiumGrad.addColorStop(1, 'rgba(255, 209, 102, 0)');
            ctx.fillStyle = podiumGrad;
            ctx.beginPath();
            ctx.ellipse(0, 18, 32, 11, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ nhân vật Thick-outline Chibi & Thần thú Pet đi cùng
            if (window.gameInstance && window.gameInstance.player) {
                const prevDir = window.gameInstance.player.direction;
                const prevX = window.gameInstance.player.x;
                const prevY = window.gameInstance.player.y;
                const prevMoving = window.gameInstance.player.isMoving;
                const prevWingTimer = window.gameInstance.player.wingRealTimer;
                const prevAnimFrame = window.gameInstance.player.animFrame;
                const prevAnimTimer = window.gameInstance.player.animTimer;

                window.gameInstance.player.direction = this.previewDirection;
                window.gameInstance.player.x = 0;
                window.gameInstance.player.y = 0;
                window.gameInstance.player.isMoving = true; // Cho nhân vật bước đi sinh động trong preview
                window.gameInstance.player.animTimer = this.previewAnimTimer * 1.7;
                window.gameInstance.player.animFrame = (Math.floor(this.previewAnimTimer * 1.7) % 2) + 1;
                window.gameInstance.player.wingRealTimer = this.previewWingRealTimer;

                // Thần thú Pet đi cùng trên bục quay
                const equippedPetId = window.useGameStore && window.useGameStore.state.progression.pet_hien_tai;
                const petBob = Math.sin(this.previewAnimTimer * 3.8) * 2.2;
                const elapsedMs = (this.previewWingRealTimer || 0) * 1000;

                let petX = -25;
                let petY = -10 + petBob;
                let petFacing = 1;
                let petBehind = true;

                if (this.previewDirection === 'right') {
                    petX = -25; petY = -10 + petBob; petFacing = 1; petBehind = true;
                } else if (this.previewDirection === 'left') {
                    petX = 25; petY = -10 + petBob; petFacing = -1; petBehind = true;
                } else if (this.previewDirection === 'down') {
                    petX = -22; petY = -16 + petBob; petFacing = 1; petBehind = true;
                } else if (this.previewDirection === 'up') {
                    petX = -22; petY = 8 + petBob; petFacing = 1; petBehind = false;
                }

                if (equippedPetId && window.CompanionPet && petBehind) {
                    window.CompanionPet.drawPetSprite(ctx, equippedPetId, petX, petY, petFacing, elapsedMs, 0.72, true);
                }

                window.gameInstance.player.draw(ctx);

                if (equippedPetId && window.CompanionPet && !petBehind) {
                    window.CompanionPet.drawPetSprite(ctx, equippedPetId, petX, petY, petFacing, elapsedMs, 0.72, true);
                }

                window.gameInstance.player.direction = prevDir;
                window.gameInstance.player.x = prevX;
                window.gameInstance.player.y = prevY;
                window.gameInstance.player.isMoving = prevMoving;
                window.gameInstance.player.animFrame = prevAnimFrame;
                window.gameInstance.player.animTimer = prevAnimTimer;
                window.gameInstance.player.wingRealTimer = prevWingTimer;
            }

            ctx.restore();
        }, 1000 / 30);
    }

    stopLivePreview() {
        if (this.previewInterval) {
            clearInterval(this.previewInterval);
            this.previewInterval = null;
        }
    }
}

window.wardrobeManager = new WardrobeManager();
