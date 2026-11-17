/**
 * UI & HUD MANAGER (TAILWIND CSS & FRAMER MOTION STYLE)
 * - Quản lý HUD sắc nét: Bản đồ, Túi đồ, Thiện cảm Thầy Cô, Trang phục & Cánh đang đeo
 * - Hỗ trợ song ngữ Tiếng Việt & English qua i18n
 * - Bắn pháo hoa Confetti khi mở khóa Cánh / Đạt 100 điểm thiện cảm
 * - Quản lý Dialogue Modal, Crafting Modal, Quest Modal, Minigame Modals
 */

class UIManager {
    constructor() {
        this.activeModal = null;
    }

    init() {
        // Đăng ký nhận sự kiện khi useGameStore thay đổi
        window.useGameStore.subscribe(() => {
            this.updateHUD();
        });

        // Đăng ký nhận sự kiện khi đổi ngôn ngữ
        window.i18n.subscribe(() => {
            this.updateHUD();
            this.updateStaticTexts();
        });

        this.updateHUD();
        this.updateStaticTexts();
        this.initChatChipsScroll();

        // Gắn sự kiện đóng modal
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.onclick = () => this.closeAllModals();
        });

        // Bấm ra ngoài nền overlay để đóng modal
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeAllModals();
            });
        });

        // Đóng bằng phím ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        // Nút chuyển đổi ngôn ngữ trên HUD
        const langBtn = document.getElementById('btn-toggle-lang');
        if (langBtn) {
            langBtn.onclick = () => {
                window.i18n.toggleLocale();
                this.showToast(window.i18n.getLocale() === 'vi' ? '🇻🇳 Đã chuyển sang Tiếng Việt' : '🇬🇧 Switched to English', 'info');
            };
        }

        // Khởi tạo quy trình đặt tên & chọn 3 skin ban đầu trước khi vào web
        this.initCharacterSetup();

        // Khởi tạo hệ thống icon tương tác Hàng 1 -> Hàng 2 khi ấn
        this.initInteractiveIcons();
    }

    // Cập nhật tất cả text tĩnh theo ngôn ngữ
    updateStaticTexts() {
        const i18n = window.i18n;
        const setTxt = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            // Nếu phần tử chứa thẻ span, chỉ cập nhật text bên trong span để không làm mất thẻ img icon
            const span = el.querySelector('span');
            if (span) {
                span.innerText = i18n.t(key);
            } else {
                el.innerText = i18n.t(key);
            }
        };

        setTxt('btn-txt-sound', 'nav_sound');
        setTxt('btn-txt-crafting', 'nav_crafting');
        setTxt('btn-txt-wardrobe', 'nav_wardrobe');
        setTxt('btn-txt-help', 'nav_help');
        setTxt('lbl-current-map', 'current_map_label');
        setTxt('btn-txt-lang', 'lang_switch');
        setTxt('lbl-inventory-title', 'inventory_title');
        setTxt('lbl-affection', 'affection_label');
        setTxt('tab-txt-wings', 'wardrobe_tab_wings');
        setTxt('tab-txt-pets', 'wardrobe_tab_pets');
        setTxt('tab-txt-outfits', 'wardrobe_tab_outfits');
        setTxt('tab-btn-wings', 'wardrobe_tab_wings');
        setTxt('tab-btn-pets', 'wardrobe_tab_pets');
        setTxt('tab-btn-outfits', 'wardrobe_tab_outfits');
        setTxt('tab-btn-hair', 'wardrobe_tab_hair');
    }

    // Cập nhật HUD
    updateHUD() {
        const state = window.useGameStore ? window.useGameStore.state : null;
        if (!state) return;
        const i18n = window.i18n;

        // 0. Tên Nhân Vật trên HUD Top Bar
        const playerNameEl = document.getElementById('hud-top-player-name');
        if (playerNameEl) {
            playerNameEl.innerText = state.progression.ten_nhan_vat || (window.gameInstance && window.gameInstance.player && window.gameInstance.player.name) || 'Tân Sinh Viên';
        }

        // 1. Tên Map
        const mapNameEl = document.getElementById('hud-map-name');
        const currentMap = (window.MAPS_DATA && state.currentMapId) ? window.MAPS_DATA[state.currentMapId] : null;
        if (mapNameEl && currentMap) {
            mapNameEl.innerText = i18n ? i18n.t(currentMap.nameKey) : (currentMap.nameKey || '');
        }

        // 2. Túi Đồ
        const inv = state.inventory;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };
        setVal('inv-hoa-hong', inv.hoa_hong);
        setVal('inv-hoa-hong-trang', inv.hoa_hong_trang);
        setVal('inv-vo-goi-hoa', inv.vo_goi_hoa);
        setVal('inv-vat-pham-tro-choi', inv.vat_pham_tro_choi);
        setVal('inv-bo-hoa-hong', inv.bo_hoa_hong);

        // Tổng số lượng vật phẩm trong Balo
        const totalItems = (inv.hoa_hong || 0) + (inv.hoa_hong_trang || 0) + (inv.vo_goi_hoa || 0) + (inv.vat_pham_tro_choi || 0) + (inv.bo_hoa_hong || 0) + (inv.hop_banh || 0) + (inv.gio_dung || 0) + (inv.hop_qua_tet || 0) + (inv.gio_qua_am_thuc || 0);
        const bagTotalBadge = document.getElementById('hud-bag-total-badge');
        if (bagTotalBadge) bagTotalBadge.innerText = totalItems;

        const bagPreviewText = document.getElementById('hud-bag-preview-text');
        if (bagPreviewText) {
            bagPreviewText.innerText = totalItems > 0 
                ? `Đang có ${totalItems} vật phẩm • Chạm xem` 
                : 'Chạm để mở vật phẩm [B]';
        }

        // Live update backpack modal nếu đang mở
        if (this.activeModal && this.activeModal.id === 'backpack-modal') {
            this.renderBackpackUI();
        }

        // 3. Thiện Cảm & Thanh Tiến Trình
        const affection = state.progression.diem_thien_cam;
        const affTxt = document.getElementById('hud-affection-text');
        const affBar = document.getElementById('hud-affection-bar-fill');
        const affStatus = document.getElementById('hud-affection-status');

        if (affTxt) affTxt.innerText = `${affection}/100`;
        if (affBar) affBar.style.width = `${Math.min(100, affection)}%`;
        if (affStatus) {
            affStatus.innerHTML = affection >= 100 
                ? `<span class="text-[10px] font-quest font-bold text-[#1e4620] bg-[#cbf0cb] border border-[#557053] px-2 py-0.5 rounded-full">✨ Mở khóa Tủ Đồ</span>`
                : `<span class="text-[10px] font-quest font-bold text-[#7f2626] bg-[#fee2e2] border border-[#ef4444] px-2 py-0.5 rounded-full">🔒 Cần 100 điểm</span>`;
        }

        // 4. Trang phục & Cánh đang đeo
        const outfitId = state.progression.trang_phuc_hien_tai;
        const outfit = (window.OUTFITS_DATA && window.OUTFITS_DATA[outfitId]) || (window.OUTFITS_DATA && window.OUTFITS_DATA.dong_phuc_tnu);
        const outfitNameEl = document.getElementById('hud-outfit-name');
        if (outfitNameEl && outfit) {
            outfitNameEl.innerText = i18n ? i18n.t(outfit.nameKey) : (outfit.nameKey || outfitId);
        }

        const wingId = state.progression.canh_hien_tai;
        const wingNameEl = document.getElementById('hud-wing-name');
        if (wingNameEl) {
            wingNameEl.innerText = (wingId && window.WINGS_REGISTRY && window.WINGS_REGISTRY[wingId])
                ? (i18n ? i18n.t(window.WINGS_REGISTRY[wingId].nameKey) : (window.WINGS_REGISTRY[wingId].nameKey || wingId))
                : (i18n ? i18n.t('none') : 'Không có');
        }

        // 5. Thanh Nhiệm Vụ (Gọn gàng, chuẩn chữ "Nhiệm vụ", click mở Modal chọn nhiệm vụ)
        const questEl = document.getElementById('hud-quest-container');
        if (questEl) {
            const currentMapId = state.currentMapId || 'map1_tnu';
            if (currentMapId === 'map2_rose') {
                questEl.style.display = 'none';
            } else if (questEl.style.display === 'none') {
                questEl.style.display = '';
            }
        }
        const questTitleEl = document.getElementById('hud-quest-title');
        const questBadgeEl = document.getElementById('hud-quest-count-badge');
        const questBtn = document.getElementById('btn-quest-goto');

        const activeQuestId = state.activeQuestId || 'do_an_k45';
        const quests = state.quests || {};
        const activeQuest = quests[activeQuestId] || quests.do_an_k45;
        const totalQuests = Object.keys(quests).length || 5;

        if (questBadgeEl) {
            questBadgeEl.innerText = totalQuests;
        }

        if (questTitleEl && activeQuest) {
            let t = activeQuest.title || 'Làm đồ án tốt nghiệp';
            t = t.replace(/\s*hộ\s*$/i, '').trim();
            questTitleEl.innerText = t;
        }

        const questIconEl = document.getElementById('hud-quest-icon');
        if (questIconEl) {
            const meta = this.getQuestMetadata(activeQuestId);
            if (meta && meta.iconImg) {
                questIconEl.src = meta.iconImg;
                questIconEl.setAttribute('data-normal', meta.iconImg);
            }
        }

        if (questBtn) {
            questBtn.innerText = i18n.t('quest_goto') || 'Đi tới';
        }

        // Live update quest modal nếu đang mở
        if (this.activeModal && this.activeModal.id === 'quest-modal') {
            this.renderQuestsUI();
        }

        // Kích hoạt hiệu ứng Bump / Rung rinh lấp lánh khi nhiệm vụ thay đổi trạng thái
        const questSignature = `${activeQuestId}_${activeQuest ? activeQuest.status : ''}_${activeQuest ? (activeQuest.currentCount || activeQuest.currentStep || 0) : 0}`;
        if (this.lastQuestSig !== undefined && this.lastQuestSig !== questSignature) {
            if (questEl) {
                questEl.classList.remove('quest-image2-bump');
                void questEl.offsetWidth; // Force CSS reflow
                questEl.classList.add('quest-image2-bump');
            }
        }
        this.lastQuestSig = questSignature;
    }

    // Alias updateHud để tương thích ngược 100%
    updateHud() {
        return this.updateHUD();
    }

    // Tự động tìm đường / chỉ dẫn tới mục tiêu nhiệm vụ đang chọn theo dõi
    goToQuest(specificQuestId) {
        const state = window.useGameStore.state;
        const activeQuestId = specificQuestId || state.activeQuestId || 'do_an_k45';
        if (specificQuestId && typeof window.useGameStore.setActiveQuest === 'function') {
            window.useGameStore.setActiveQuest(specificQuestId);
        }

        // Nhiệm vụ Chat Chúc Mừng 20/11 -> Mở khung chat và điền sẵn lời chúc, người chơi chỉ cần nhấn Enter!
        if (activeQuestId === 'chat_chuc_mung_20_11') {
            const q = (state.quests && state.quests.chat_chuc_mung_20_11) || {};
            if (q.status === 'completed') {
                this.showToast('🎉 Bạn đã gửi lời chúc 20/11 và mở khóa toàn bộ Cánh!', 'success');
                return;
            }
            this.openChatWithPrefill("Chúc mừng ngày nhà giáo Việt Nam 20/11");
            return;
        }

        if (!window.gameInstance) return;

        let targetX = 1000;
        let targetY = 2880;
        let targetName = "Minh Tuấn (Anh Sinh Viên CNTT)";

        if (activeQuestId === 'do_an_k45') {
            const q = state.quests.do_an_k45 || {};
            if (q.status === 'not_started') {
                targetX = 1000;
                targetY = 2880;
                targetName = "Minh Tuấn (Anh Sinh Viên CNTT - Nhận Đồ Án)";
            } else if (q.status === 'in_progress') {
                const items = (window.gameInstance.mapEntities && window.gameInstance.mapEntities.map1_tnu ? window.gameInstance.mapEntities.map1_tnu.items || [] : []).filter(d => !d.isCollected);
                if (items.length > 0) {
                    const px = window.gameInstance.player.x;
                    const py = window.gameInstance.player.y;
                    items.sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py));
                    targetX = items[0].x;
                    targetY = items[0].y;
                    targetName = `Trang Đồ Án (${(q.currentCount || 0) + 1}/3)`;
                } else {
                    targetX = 1000;
                    targetY = 2880;
                    targetName = "Minh Tuấn (Anh Sinh Viên CNTT - Nộp Đồ Án)";
                }
            } else if (q.status === 'can_turn_in') {
                targetX = 1000;
                targetY = 2880;
                targetName = "Minh Tuấn (Anh Sinh Viên CNTT - Nộp Đồ Án)";
            } else {
                this.showToast('🎉 Bạn đã hoàn thành nhiệm vụ Tìm Đồ Án cho Anh Sinh Viên CNTT!', 'success');
                return;
            }
        } else if (activeQuestId === 'nhiem_vu_gio_qua') {
            const qChef = state.quests.nhiem_vu_gio_qua || {};
            if (qChef.status === 'completed') {
                this.showToast('🎉 Bạn đã hoàn thành nhiệm vụ Hộp Quà May Mắn cho Cô Bếp Trưởng!', 'success');
                return;
            }
            if (state.currentMapId === 'map3_arcade') {
                targetX = (window.gameZoneManager && window.gameZoneManager.chefNpc) ? window.gameZoneManager.chefNpc.x : 770;
                targetY = (window.gameZoneManager && window.gameZoneManager.chefNpc) ? window.gameZoneManager.chefNpc.y : 310;
                targetName = "Cô Mai Bếp Trưởng (Khu Vui Chơi)";
            } else {
                targetX = 2415;
                targetY = 3040;
                targetName = "Cổng Vào Khu Vui Chơi (Gặp Cô Mai Bếp Trưởng)";
            }
        } else if (activeQuestId === 'qua_tang_giao_vien') {
            const px = (window.gameInstance.player && window.gameInstance.player.x) || 1600;
            const py = (window.gameInstance.player && window.gameInstance.player.y) || 2800;
            const teachers = (window.gameInstance.mapEntities && window.gameInstance.mapEntities.map1_tnu ? window.gameInstance.mapEntities.map1_tnu.npcs || [] : []).filter(n => n.role && (n.role.startsWith('teacher') || n.role.startsWith('alumni')));
            if (teachers.length > 0) {
                teachers.sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py));
                targetX = teachers[0].x;
                targetY = teachers[0].y;
                targetName = `${teachers[0].name} (Tặng Quà Tri Ân)`;
            } else {
                targetX = 1725;
                targetY = 3050;
                targetName = "Thầy Cô Bộ Môn CNTT (Tòa Nhà Điều Hành)";
            }
        } else if (activeQuestId === 'tam_thu_uoc_nguyen') {
            targetX = 1530;
            targetY = 3040;
            targetName = "Bảng Ước Nguyện Tri Ân Thầy Cô (Gửi Tâm Thư Mở Khóa Pet)";
        } else if (activeQuestId === 'kham_pha_nha_2') {
            targetX = 1000;
            targetY = 480;
            targetName = "Khu Thực Nghiệm Nhà số 2 (Nông Lâm & Y Dược)";
        } else if (activeQuestId === 'ho_sinh_thai_nha_7') {
            targetX = 400;
            targetY = 1000;
            targetName = "Cầu Gỗ Hồ Sinh Thái & Nhà số 7";
        } else if (activeQuestId === 'chay_san_van_dong') {
            targetX = 1450;
            targetY = 500;
            targetName = "Sân Vận Động TNU (Đường Pitch Điền Kinh)";
        }

        if (typeof window.gameInstance.setQuestNavigation === 'function') {
            window.gameInstance.setQuestNavigation(targetX, targetY, targetName);
        }
        this.showToast(`🧭 Đang dẫn đường tới: ${targetName}`, 'info');

        const btn = document.getElementById('btn-quest-goto');
        if (btn) {
            btn.classList.add('scale-95');
            setTimeout(() => btn.classList.remove('scale-95'), 180);
        }
    }

    // Tự động mở khung chat và điền sẵn nội dung lời chúc, focus sẵn chỉ cần Enter là gửi
    openChatWithPrefill(text = "Chúc mừng ngày nhà giáo Việt Nam 20/11") {
        this.closeQuestModal();
        const box = document.getElementById('hud-chat-box');
        if (box) {
            box.classList.remove('chat-collapsed');
        }
        const input = document.getElementById('chat-input');
        if (input) {
            input.value = text;
            setTimeout(() => {
                input.focus();
                if (typeof input.setSelectionRange === 'function') {
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, 60);
            input.classList.add('ring-2', 'ring-[#fedc82]');
            setTimeout(() => input.classList.remove('ring-2', 'ring-[#fedc82]'), 2500);
        }
        this.showToast('💬 Đã hiện sẵn câu chúc 20/11! Bạn chỉ cần nhấn [Enter] để gửi và mở khóa Cánh ngay!', 'info');
    }

    // ==========================================
    // BẢNG DANH SÁCH NHIỆM VỤ SINH VIÊN (QUEST SELECTION MODAL)
    // ==========================================
    openQuestModal() {
        const modal = document.getElementById('quest-modal');
        if (!modal) return;
        this.renderQuestsUI();
        this.openModal(modal);
    }

    closeQuestModal() {
        this.closeAllModals();
    }

    selectActiveQuest(questId) {
        if (!window.useGameStore) return;
        if (typeof window.useGameStore.setActiveQuest === 'function') {
            window.useGameStore.setActiveQuest(questId);
        } else {
            window.useGameStore.state.activeQuestId = questId;
            window.useGameStore.saveToStorage();
            window.useGameStore.notify();
        }
        const q = window.useGameStore.state.quests ? window.useGameStore.state.quests[questId] : null;
        const title = (q && q.title) ? q.title : 'Nhiệm vụ';
        this.showToast(`🎯 Đang theo dõi nhiệm vụ: ${title}`, 'success');
        this.renderQuestsUI();
        this.updateHUD();
    }

    getQuestMetadata(questId) {
        const meta = {
            do_an_k45: {
                iconImg: 'assets/ui/icons/graduate_normal.png',
                icon: '<img src="assets/ui/icons/graduate_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="CNTT" />',
                badgeName: 'CNTT',
                giver: 'Minh Tuấn (Anh Sinh Viên CNTT)',
                location: 'Trước sảnh Giảng đường Nhà số 7 (Khu CNTT)',
                reward: '+20 Thiện Cảm, 1 Vỏ Gói Hoa Nghệ Thuật, Mở khóa Cánh Băng',
                actionHint: 'Tìm và nhặt đủ 3 trang tài liệu bị rơi quanh khuôn viên trường cho anh sinh viên CNTT'
            },
            nhiem_vu_gio_qua: {
                iconImg: 'assets/items/hop_qua_tet.png',
                icon: '<img src="assets/items/hop_qua_tet.png" class="w-8 h-8 object-contain drop-shadow" alt="Hộp Quà May Mắn" />',
                badgeName: 'Quà Tết Hoàng Gia',
                giver: 'Cô Mai Bếp Trưởng',
                location: 'Khu Vui Chơi Hội Chợ (Map Game)',
                reward: '+25 Thiện Cảm, 1 Giỏ Mây Đựng Quà & Quà Tặng',
                actionHint: 'Vào Bàn Chế Tạo [G] dùng Bánh Cupcake, Khoai tây chiên, Burger bò và Sữa tươi làm Hộp Quà Lễ Hội May Mắn đem giao cho Cô Mai Bếp Trưởng tại Khu Vui Chơi'
            },
            qua_tang_giao_vien: {
                iconImg: 'assets/ui/icons/bouquet_normal.png',
                icon: '<img src="assets/ui/icons/bouquet_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Tri ân" />',
                badgeName: 'Tri ân Thầy Cô',
                giver: 'Các Thầy Cô Bộ Môn CNTT',
                location: 'Khuôn viên trường & Các Giảng đường',
                reward: 'Điểm Thiện Cảm, ĐẠT 100 ĐIỂM THIỆN CẢM MỞ KHÓA TẤT CẢ TRANG PHỤC!',
                actionHint: 'Gói hoa hoặc quà tại Bàn [G], tặng từng Thầy Cô để nhận Thiện Cảm. Đạt 100 Thiện Cảm mở khóa TẤT CẢ TRANG PHỤC!'
            },
            tam_thu_uoc_nguyen: {
                iconImg: 'assets/ui/icons/scroll_normal.png',
                icon: '<img src="assets/ui/icons/scroll_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Tâm thư" />',
                badgeName: 'Tâm thư 20/11',
                giver: 'Bảng Ước Nguyện Tri Ân',
                location: 'Sảnh trước Tòa Nhà Điều Hành Trung Tâm',
                reward: 'MỞ KHÓA TOÀN BỘ 35+ THẦN THÚ PET & +10 Thiện Cảm',
                actionHint: 'Đến Bảng Ước Nguyện cạnh Nhà Điều Hành, nhấn [E] viết một bức tâm thư / lời chúc chân thành gửi Thầy Cô'
            },
            chat_chuc_mung_20_11: {
                iconImg: 'assets/ui/icons/wing_normal.png',
                icon: '<img src="assets/ui/icons/wing_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Cánh" />',
                badgeName: 'Chúc Mừng 20/11',
                giver: 'Toàn thể Thầy Cô & Sinh Viên TNU',
                location: 'Khung Chat Trường Học',
                reward: 'MỞ KHÓA TOÀN BỘ 18+ BỘ CÁNH HUYỀN THOẠI & +20 Thiện Cảm',
                actionHint: 'Nhấn [🧭 Đi tới] để hiện sẵn câu chúc "Chúc mừng ngày nhà giáo Việt Nam 20/11", chỉ cần nhấn Enter để gửi và mở khóa Cánh!'
            },
            kham_pha_nha_2: {
                iconImg: 'assets/ui/icons/flower_normal.png',
                icon: '<img src="assets/ui/icons/flower_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Vườn thực nghiệm" />',
                badgeName: 'Khám phá',
                giver: 'Khoa Nông Lâm & Y Dược',
                location: 'Khu thực nghiệm Nhà số 2',
                reward: '+15 Thiện Cảm, Cánh Lá Non Xanh',
                actionHint: 'Ghé thăm khu vườn ươm & nhà thực nghiệm số 2'
            },
            ho_sinh_thai_nha_7: {
                iconImg: 'assets/ui/icons/lifebuoy_normal.png',
                icon: '<img src="assets/ui/icons/lifebuoy_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Hồ Sinh Thái" />',
                badgeName: 'Cảnh quan',
                giver: 'Ban Quản Lý Hồ TNU',
                location: 'Cầu Gỗ & Hồ Nước Sinh Thái',
                reward: '+15 Thiện Cảm, Cánh Mây Bồng Bềnh',
                actionHint: 'Dạo bước qua cầu gỗ ngắm hồ nước và Thư viện Nhà 7'
            },
            chay_san_van_dong: {
                iconImg: 'assets/ui/icons/compass_normal.png',
                icon: '<img src="assets/ui/icons/compass_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Sân Vận Động" />',
                badgeName: 'Thể thao',
                giver: 'Khoa Giáo Dục Thể Chất',
                location: 'Sân Vận Động & Đường Pitch TNU',
                reward: '+20 Thiện Cảm, Cánh Sao Băng Lấp Lánh',
                actionHint: 'Chạy hoàn thành 1 vòng quanh đường pitch sân vận động'
            }
        };
        return meta[questId] || {
            iconImg: 'assets/ui/icons/scroll_normal.png',
            icon: '<img src="assets/ui/icons/scroll_normal.png" class="w-8 h-8 object-contain drop-shadow" alt="Nhiệm vụ" />',
            badgeName: 'Nhiệm vụ',
            giver: 'Giảng viên TNU',
            location: 'Trường ĐH Tây Nguyên',
            reward: '+10 Thiện Cảm',
            actionHint: 'Khám phá trường học'
        };
    }

    renderQuestsUI() {
        const container = document.getElementById('quest-cards-list');
        if (!container) return;
        const state = window.useGameStore.state;
        const quests = state.quests || {};
        const activeQuestId = state.activeQuestId || 'do_an_k45';

        const questKeys = Object.keys(quests);
        const statsEl = document.getElementById('quest-modal-stats-text');
        if (statsEl) {
            const completedCount = questKeys.filter(k => quests[k] && quests[k].status === 'completed').length;
            statsEl.innerText = `${completedCount}/${questKeys.length} Đã xong`;
        }

        container.innerHTML = '';

        questKeys.forEach(qId => {
            const q = quests[qId];
            if (!q) return;
            const meta = this.getQuestMetadata(qId);
            const isTracked = (qId === activeQuestId);
            const isCompleted = (q.status === 'completed');

            let statusBadgeHtml = '';
            if (isCompleted) {
                statusBadgeHtml = `<span class="quest-status-badge quest-status-completed">✓ Đã xong</span>`;
            } else if (isTracked) {
                statusBadgeHtml = `<span class="quest-status-badge quest-status-active">⭐ Đang làm</span>`;
            } else if (q.status === 'can_turn_in') {
                statusBadgeHtml = `<span class="quest-status-badge quest-status-ready">⚡ Có thể nộp</span>`;
            } else if (q.status === 'in_progress') {
                statusBadgeHtml = `<span class="quest-status-badge quest-status-available">🔄 Đang tiến hành</span>`;
            } else {
                statusBadgeHtml = `<span class="quest-status-badge quest-status-available">📌 Có thể nhận</span>`;
            }

            // Tiến độ text
            let progressText = '';
            if (qId === 'do_an_k45') {
                progressText = `Tiến độ: ${q.currentCount || 0}/${q.targetCount || 3} trang tài liệu`;
            } else if (qId === 'chay_san_van_dong') {
                progressText = `Tiến độ: ${q.currentStep || 0}/${q.targetStep || 4} chặng đường`;
            } else if (qId === 'nhiem_vu_gio_qua') {
                const hasHopQua = window.useGameStore.hasItem('hop_qua_tet', 1) || window.useGameStore.hasItem('hop_banh', 1);
                progressText = isCompleted ? 'Đã giao Hộp Quà May Mắn cho Cô Bếp Trưởng' : (hasHopQua ? '✅ Đã có Hộp Quà Lễ Hội! Hãy đem giao cho Cô Bếp Trưởng' : 'Cần: 1 Hộp Quà Lễ Hội May Mắn (chế tạo tại Bàn [G])');
            } else if (qId === 'qua_tang_giao_vien') {
                const aff = state.progression.diem_thien_cam || 0;
                progressText = `Thiện Cảm: ${aff}/100 ${aff >= 100 ? '👑 (ĐÃ MỞ KHÓA TẤT CẢ TRANG PHỤC!)' : '💖 (Tiếp tục tặng quà Thầy Cô)'}`;
            } else if (qId === 'tam_thu_uoc_nguyen') {
                progressText = isCompleted ? '✓ Đã gửi tâm thư & ĐÃ MỞ KHÓA TOÀN BỘ PET' : 'Chưa gửi tâm thư tại Bảng Ước Nguyện';
            } else if (qId === 'chat_chuc_mung_20_11') {
                progressText = isCompleted ? '✓ ĐÃ MỞ KHÓA TOÀN BỘ CÁNH' : 'Chưa gửi câu chúc 20/11 (Nhấn Đi tới & Enter)';
            } else {
                progressText = isCompleted ? 'Đã hoàn thành khám phá' : 'Chưa ghé thăm';
            }

            // Nút hành động
            let actionBtnHtml = '';
            if (isCompleted) {
                actionBtnHtml = `
                    <button class="px-3 py-1.5 bg-[#e2d5bd] text-[#7c6348] border border-[#a89070] rounded-xl text-xs font-bold font-quest cursor-default flex items-center gap-1">
                        <img src="assets/ui/icons/heart_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Xong" />
                        <span>Đã xong</span>
                    </button>
                `;
            } else if (isTracked) {
                actionBtnHtml = `
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button class="quest-image2-btn font-quest text-xs py-1.5 px-3 shrink-0 flex items-center gap-1" onclick="window.uiManager.goToQuest('${qId}'); window.uiManager.closeQuestModal();" title="Tìm đường / thực hiện nhiệm vụ này">
                            <img src="assets/ui/icons/compass_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Đi tới" />
                            <span>Đi tới ngay</span>
                        </button>
                    </div>
                `;
            } else {
                actionBtnHtml = `
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button class="quest-image2-btn font-quest text-xs py-1.5 px-2.5 shrink-0 flex items-center gap-1" onclick="window.uiManager.goToQuest('${qId}'); window.uiManager.closeQuestModal();" title="Đi tới làm nhiệm vụ này">
                            <img src="assets/ui/icons/compass_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Đi tới" />
                            <span>Đi tới</span>
                        </button>
                        <button class="px-2.5 py-1.5 bg-[#fedc82] hover:bg-[#ffe699] text-[#3b2512] border-2 border-[#5c4731] rounded-xl text-xs font-bold font-quest transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1" onclick="window.uiManager.selectActiveQuest('${qId}')" title="Chọn theo dõi nhiệm vụ">
                            <img src="assets/ui/icons/scroll_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Chọn" />
                            <span>Chọn làm</span>
                        </button>
                    </div>
                `;
            }

            const card = document.createElement('div');
            card.className = `quest-card-item ${isTracked ? 'active-tracked' : ''}`;
            card.innerHTML = `
                <div class="flex items-start gap-3 min-w-0 flex-1">
                    <div class="w-12 h-12 rounded-xl bg-[#faeed0] border-2 border-[#7c6348] flex items-center justify-center p-1.5 shadow-inner shrink-0 mt-0.5">
                        ${meta.icon}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap mb-1">
                            <h4 class="font-quest font-bold text-base text-[#3b2512] leading-none">${q.title}</h4>
                            <span class="text-[10px] font-bold bg-[#f3e9c6] text-[#7c6348] border border-[#b89b72] px-2 py-0.5 rounded-full">${meta.badgeName}</span>
                            ${statusBadgeHtml}
                        </div>
                        <p class="text-xs text-[#5c4731] font-quest leading-snug mb-1.5">${q.desc || meta.actionHint}</p>
                        <div class="flex items-center gap-3 text-[11px] font-quest text-[#7c6348] flex-wrap">
                            <span class="flex items-center gap-1"><img src="assets/ui/icons/compass_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Địa điểm" /> <b>Địa điểm:</b> ${meta.location}</span>
                            <span class="flex items-center gap-1"><img src="assets/ui/icons/scroll_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Tiến độ" /> <b>${progressText}</b></span>
                            <span class="text-[#8c3b12] flex items-center gap-1"><img src="assets/ui/icons/gift_normal.png" class="w-3.5 h-3.5 object-contain inline-block shrink-0" alt="Phần thưởng" /> <b>Thưởng:</b> ${meta.reward}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center ml-2">
                    ${actionBtnHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Mở Balo Chi Tiết
    openBackpackModal() {
        const modal = document.getElementById('backpack-modal');
        if (!modal) return;
        this.renderBackpackUI();
        this.openModal(modal);
    }

    renderBackpackUI() {
        const grid = document.getElementById('backpack-items-grid');
        if (!grid) return;
        const inv = window.useGameStore.state.inventory || {};
        const i18n = window.i18n;

        const categories = [
            {
                title: '🧸 Thú Bông & Quà Hội Chợ',
                items: [
                    { key: 'thu_bong_gau', name: i18n.t('item_thu_bong_gau'), count: inv.thu_bong_gau || 0, icon: '🧸', iconImg: 'assets/items/gau_bong.png', desc: i18n.t('item_thu_bong_gau_desc') },
                    { key: 'thu_bong_capybara', name: i18n.t('item_thu_bong_capybara'), count: inv.thu_bong_capybara || 0, icon: '🦫', iconImg: 'assets/items/capybara.png', desc: i18n.t('item_thu_bong_capybara_desc') },
                    { key: 'thu_bong_vit', name: i18n.t('item_thu_bong_vit'), count: inv.thu_bong_vit || 0, icon: '🐥', iconImg: 'assets/items/thu_bong_vit.png', desc: i18n.t('item_thu_bong_vit_desc') },
                    { key: 'thu_bong_meo', name: i18n.t('item_thu_bong_meo'), count: inv.thu_bong_meo || 0, icon: '🐱', iconImg: 'assets/items/meo_bong.png', desc: i18n.t('item_thu_bong_meo_desc') },
                    { key: 'bo_bong_mini', name: i18n.t('item_bo_bong_mini'), count: inv.bo_bong_mini || 0, icon: '🐮', iconImg: 'assets/items/bup_be_bo.png', desc: i18n.t('item_bo_bong_mini_desc') },
                    { key: 'huy_hieu_xa_thu', name: i18n.t('item_huy_hieu_xa_thu'), count: inv.huy_hieu_xa_thu || 0, icon: '🎯', iconImg: 'assets/items/huy_hieu.png', desc: i18n.t('item_huy_hieu_xa_thu_desc') },
                    { key: 'vat_pham_tro_choi', name: 'Quà Trò Chơi', count: inv.vat_pham_tro_choi || 0, icon: '🎁', iconImg: 'assets/items/qua_tro_choi.png', desc: 'Hộp quà trò chơi may mắn thắt nơ đỏ tuyệt đẹp.' },
                    { key: 'bua_may_man', name: i18n.t('item_bua_may_man') || 'Bùa May Mắn', count: inv.bua_may_man || 0, icon: '🧧', iconImg: 'assets/items/bua_may_man.png', desc: i18n.t('item_bua_may_man_desc') || 'Bùa hộ mệnh bình an may mắn Hội Chợ Tây Nguyên.' }
                ]
            },
            {
                title: '🍔 Đồ Ăn & Thức Uống Lễ Hội',
                items: [
                    { key: 'mi_tron_trung', name: i18n.t('item_mi_tron_trung'), count: inv.mi_tron_trung || 0, icon: '🍜', iconImg: 'assets/items/mi_tron_trung.png', desc: i18n.t('item_mi_tron_trung_desc') },
                    { key: 'com_canh_ga', name: i18n.t('item_com_canh_ga'), count: inv.com_canh_ga || 0, icon: '🍗', iconImg: 'assets/items/com_canh_ga.png', desc: i18n.t('item_com_canh_ga_desc') },
                    { key: 'banh_cupcake', name: i18n.t('item_banh_cupcake'), count: inv.banh_cupcake || 0, icon: '🧁', iconImg: 'assets/items/banh_cupcake.png', desc: i18n.t('item_banh_cupcake_desc') },
                    { key: 'khoai_tay_chien', name: i18n.t('item_khoai_tay_chien'), count: inv.khoai_tay_chien || 0, icon: '🍟', iconImg: 'assets/items/khoai_tay_chien.png', desc: i18n.t('item_khoai_tay_chien_desc') },
                    { key: 'burger_bo', name: i18n.t('item_burger_bo'), count: inv.burger_bo || 0, icon: '🍔', iconImg: 'assets/items/hamburger.png', desc: i18n.t('item_burger_bo_desc') },
                    { key: 'hop_do_an_vat', name: 'Bắp Rang Bơ Giòn', count: inv.hop_do_an_vat || 0, icon: '🍿', iconImg: 'assets/items/bap_rang_bo.png', desc: 'Bắp rang bơ ngọt thơm lừng giòn tan tại quầy ẩm thực.' },
                    { key: 'sua_bo_tuoi', name: i18n.t('item_sua_bo_tuoi'), count: inv.sua_bo_tuoi || 0, icon: '🥛', iconImg: 'assets/items/sua.png', desc: i18n.t('item_sua_bo_tuoi_desc') },
                    { key: 'pho_mai', name: i18n.t('item_pho_mai'), count: inv.pho_mai || 0, icon: '🧀', iconImg: 'assets/items/pho_mai.png', desc: i18n.t('item_pho_mai_desc') }
                ]
            },
            {
                title: '🎁 Quà Tặng & Chế Tạo Thượng Hạng',
                items: [
                    { key: 'hop_banh', name: 'Hộp Bánh Thơm Ngon', count: inv.hop_banh || 0, icon: '🎂', iconImg: 'assets/items/qua_tro_choi.png', desc: 'Hộp bánh ngọt thơm ngon hảo hạng đưa cho Cô Bếp Trưởng hoặc dâng tặng Thầy Cô.' },
                    { key: 'gio_qua_am_thuc', name: i18n.t('item_gio_qua_am_thuc'), count: inv.gio_qua_am_thuc || 0, icon: '🧺', iconImg: 'assets/items/gio_qua_am_thuc.png', desc: i18n.t('item_gio_qua_am_thuc_desc'), isRare: true },
                    { key: 'hop_qua_tet', name: i18n.t('item_hop_qua_tet'), count: inv.hop_qua_tet || 0, icon: '🧧', iconImg: 'assets/items/hop_qua_tet.png', desc: i18n.t('item_hop_qua_tet_desc') },
                    { key: 'gio_dung', name: i18n.t('item_gio_dung'), count: inv.gio_dung || 0, icon: '🧺', iconImg: 'assets/items/gio_dung.png', desc: i18n.t('item_gio_dung_desc') },
                    { key: 'bo_hoa_hong', name: i18n.t('item_bo_hoa_hong'), count: inv.bo_hoa_hong || 0, icon: '💐', iconImg: 'assets/items/flower_bouquet.png', desc: i18n.t('item_bo_hoa_hong_desc') },
                    { key: 'vo_goi_hoa', name: i18n.t('item_vo_goi_hoa'), count: inv.vo_goi_hoa || 0, icon: '🎀', iconImg: 'assets/items/ribbon_bow.png', desc: i18n.t('item_vo_goi_hoa_desc') }
                ]
            },
            {
                title: '🌹 Hoa Hồng & Đồ Làm Vườn',
                items: [
                    { key: 'hoa_hong', name: i18n.t('item_hoa_hong'), count: inv.hoa_hong || 0, icon: '🌹', iconImg: 'assets/rose_garden/icons/flower_pink.png', desc: i18n.t('item_hoa_hong_desc') },
                    { key: 'hoa_hong_trang', name: i18n.t('item_hoa_hong_trang'), count: inv.hoa_hong_trang || 0, icon: '💮', iconImg: 'assets/rose_garden/icons/flower_white.png', desc: i18n.t('item_hoa_hong_trang_desc') },
                    { key: 'hat_giong_hoa_hong', name: i18n.t('item_hat_giong'), count: inv.hat_giong_hoa_hong || 0, icon: '🌰', iconImg: 'assets/rose_garden/icons/chestnut.png', desc: i18n.t('item_hat_giong_desc') },
                    { key: 'nuoc_trong_binh', name: i18n.t('item_nuoc_binh_tuoi'), count: inv.nuoc_trong_binh || 0, icon: '🚿', iconImg: 'assets/rose_garden/icons/shower_head.png', desc: `${i18n.t('item_nuoc_binh_tuoi_desc')} (${inv.nuoc_trong_binh || 0}/${inv.binh_tuoi_dung_tich || 5})` }
                ]
            }
        ];

        let totalItems = 0;
        categories.forEach(c => c.items.forEach(it => { totalItems += it.count; }));
        const totalEl = document.getElementById('backpack-total-items-text');
        if (totalEl) totalEl.innerText = `Tổng: ${totalItems} món`;

        let html = '';
        categories.forEach(cat => {
            html += `
                <div class="col-span-full font-bold text-xs text-[#5c4731] font-quest mt-2 mb-1 flex items-center gap-1.5 border-b border-[#e2d4b7] pb-1">
                    <span>${cat.title}</span>
                </div>
            `;
            html += cat.items.map(item => {
                const hasItem = item.count > 0;
                const iconHtml = item.iconImg 
                    ? `<img src="${item.iconImg}" class="w-10 h-10 object-contain my-1 drop-shadow transition-transform hover:scale-110" />`
                    : `<span class="text-3xl my-1.5 drop-shadow transition-transform hover:scale-110">${item.icon}</span>`;
                return `
                    <div class="backpack-item-card ${hasItem ? 'has-items' : ''}">
                        <span class="backpack-item-badge ${hasItem ? 'badge-has-item' : 'badge-no-item'}">x${item.count}</span>
                        ${iconHtml}
                        <div class="font-bold text-xs text-[#3b2512] font-quest leading-tight">${item.name}</div>
                        <div class="text-[10px] text-[#6b5037] font-quest mt-1 line-clamp-2 leading-tight">${item.desc}</div>
                        ${hasItem 
                            ? `<span class="text-[10px] text-[#1e4620] font-bold bg-[#cbf0cb] border border-[#557053] px-2 py-0.5 rounded-full mt-2 font-quest">Đang có</span>`
                            : `<span class="text-[10px] text-[#8c7355] font-semibold mt-2 font-quest">Chưa có</span>`
                        }
                    </div>
                `;
            }).join('');
        });

        grid.innerHTML = html;
    }

    // Modal Manager
    openModal(modalEl) {
        if (!modalEl) return;
        this.closeAllModals();
        modalEl.classList.add('active');
        modalEl.classList.add('modal-visible');
        this.activeModal = modalEl;
        try {
            if (window.soundSystem && typeof window.soundSystem.playModalOpen === 'function') {
                window.soundSystem.playModalOpen();
            }
        } catch (e) {
            console.warn('Sound playModalOpen error:', e);
        }
    }

    closeAllModals() {
        if (this.activeModal && this.activeModal.id === 'character-setup-modal') {
            const isCreated = window.useGameStore && window.useGameStore.state && window.useGameStore.state.progression && window.useGameStore.state.progression.is_character_created;
            if (!isCreated) return; // Bắt buộc phải tạo nhân vật trước khi vào web
        }
        document.querySelectorAll('.modal-overlay').forEach(m => {
            m.classList.remove('active');
            m.classList.remove('modal-visible');
        });
        if (window.wardrobeManager) window.wardrobeManager.stopLivePreview();
        this.activeModal = null;
    }

    // Mở Tủ Đồ
    openWardrobeModal() {
        if (window.wardrobeManager) {
            window.wardrobeManager.openModal();
        }
    }

    // Đảm bảo Modal Bàn Gói Quà luôn tồn tại trên mọi trang
    ensureCraftingModal() {
        let modal = document.getElementById('crafting-modal');
        if (modal) return modal;

        const wrapper = document.getElementById('game-wrapper') || document.body;
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'crafting-modal';
        modal.innerHTML = `
            <div class="modal-box modal-box-beige w-[720px] max-w-[96vw] max-h-[96vh] flex flex-col font-quest">
                <div class="modal-header-beige flex items-center justify-between">
                    <div class="flex items-center space-x-2 font-quest text-xl font-bold text-[#3b2512]">
                        <span class="text-2xl">🧺</span>
                        <span id="crafting-modal-header-title">XƯỞNG GÓI QUÀ & CHẾ TẠO ẨM THỰC TNU</span>
                    </div>
                    <button class="quest-modal-close-btn modal-close-btn font-quest" onclick="window.uiManager.closeAllModals()">&times;</button>
                </div>
                <div class="modal-body p-4 space-y-3 font-quest overflow-y-auto" id="crafting-modal-body-container">
                    <div id="crafting-recipe-tabs"></div>
                    <div id="crafting-recipe-banner"></div>
                    <div>
                        <div class="text-xs font-bold text-[#5c4731] uppercase tracking-wider mb-2">Nguyên Liệu Ghép Bắt Buộc:</div>
                        <div class="space-y-2 max-h-[260px] overflow-y-auto pr-1" id="crafting-ingredients-list"></div>
                    </div>
                    <button class="btn-action-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-sm" id="btn-craft-action">
                        <span>CHẾ TẠO NGAY</span>
                    </button>
                </div>
            </div>
        `;
        wrapper.appendChild(modal);
        return modal;
    }

    // Mở Bàn Gói Quà
    openCraftingModal() {
        this.ensureCraftingModal();
        const modal = document.getElementById('crafting-modal');
        if (!modal) return;

        this.openModal(modal);
        this.renderCraftingUI();
    }

    renderCraftingUI() {
        this.ensureCraftingModal();
        const cm = window.craftingManager;
        if (!cm) return;

        const currentRecipe = cm.getRecipe();
        const recipes = cm.recipes;

        // 1. Render Tabs chuyển đổi công thức
        let tabsEl = document.getElementById('crafting-recipe-tabs');
        if (!tabsEl) {
            const body = document.querySelector('#crafting-modal .modal-body');
            if (body) {
                tabsEl = document.createElement('div');
                tabsEl.id = 'crafting-recipe-tabs';
                body.insertBefore(tabsEl, body.firstChild);
            }
        }

        const recipeIconMap = {
            'hop_banh': { normal: 'assets/ui/icons/cake_normal.png', active: 'assets/ui/icons/cake_active.png' },
            'gio_qua_am_thuc': { normal: 'assets/ui/icons/basket_normal.png', active: 'assets/ui/icons/basket_active.png' },
            'hop_qua_tet': { normal: 'assets/ui/icons/gift_normal.png', active: 'assets/ui/icons/gift_active.png' },
            'bo_hoa_hong': { normal: 'assets/ui/icons/bouquet_normal.png', active: 'assets/ui/icons/bouquet_active.png' }
        };

        if (tabsEl) {
            tabsEl.className = 'flex flex-wrap gap-2 border-b-2 border-[#7c6348]/40 pb-2.5 mb-2';
            tabsEl.innerHTML = Object.keys(recipes).map(k => {
                const r = recipes[k];
                const active = r.id === currentRecipe.id;
                const rareBadge = r.isRare ? '✨ ' : '';
                const icons = recipeIconMap[r.id] || { normal: 'assets/ui/icons/gift_normal.png', active: 'assets/ui/icons/gift_active.png' };
                const iconSrc = active ? icons.active : icons.normal;
                return `
                    <button class="crafting-recipe-tab px-3 py-1.5 rounded-xl font-quest text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        active 
                            ? 'bg-[#5c4731] text-[#fbf6d9] border-[#2b1704] shadow-md scale-105 active' 
                            : 'bg-[#fbf6d9] text-[#5c4731] border-[#7c6348]/60 hover:bg-[#fff9e6]'
                    }" onclick="window.craftingManager.selectRecipe('${r.id}'); window.uiManager.renderCraftingUI();">
                        <img class="interactive-icon w-5 h-5 object-contain" src="${iconSrc}" data-normal="${icons.normal}" data-active="${icons.active}" alt="${r.name}" />
                        <span>${rareBadge}${r.name.split('(')[0].trim()}</span>
                    </button>
                `;
            }).join('');
        }

        // 2. Render Banner Chi Tiết Món
        let bannerEl = document.getElementById('crafting-recipe-banner');
        if (!bannerEl) {
            bannerEl = document.createElement('div');
            bannerEl.id = 'crafting-recipe-banner';
            const list = document.getElementById('crafting-ingredients-list');
            if (list && list.parentElement) {
                list.parentElement.parentElement.insertBefore(bannerEl, list.parentElement);
            }
        }

        if (bannerEl) {
            bannerEl.className = `p-3.5 rounded-2xl border-2 flex items-center space-x-3.5 shadow-inner ${
                currentRecipe.isRare 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-500 text-amber-950' 
                    : 'bg-[#f5ecce] border-[#7c6348] text-[#3b2512]'
            }`;
            const rareTag = currentRecipe.isRare 
                ? `<span class="inline-block px-2 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full text-[10px] font-bold tracking-wider uppercase mb-1 shadow-sm animate-pulse">${currentRecipe.badge}</span>`
                : `<span class="inline-block px-2 py-0.5 bg-[#7c6348] text-white rounded-full text-[10px] font-bold uppercase mb-1">${currentRecipe.badge}</span>`;

            bannerEl.innerHTML = `
                <div class="relative shrink-0">
                    <img src="${currentRecipe.iconImg}" alt="${currentRecipe.name}" class="w-16 h-16 object-contain drop-shadow-md rounded-xl ${currentRecipe.isRare ? 'ring-2 ring-amber-400 p-0.5 bg-white/70' : ''}" />
                </div>
                <div class="flex-1 min-w-0">
                    ${rareTag}
                    <div class="font-bold text-sm font-quest text-[#2b1704] leading-tight">${currentRecipe.name}</div>
                    <div class="text-[11px] text-[#5c4731] mt-0.5 leading-snug">${currentRecipe.description}</div>
                    <div class="text-[11px] font-bold text-emerald-800 mt-1">${currentRecipe.rewardDesc}</div>
                </div>
            `;
        }

        // 3. Render Danh Sách Nguyên Liệu
        const list = document.getElementById('crafting-ingredients-list');
        const btn = document.getElementById('btn-craft-action');
        if (list) {
            const status = cm.getIngredientsStatus(currentRecipe.id);
            list.innerHTML = '';

            status.forEach(item => {
                const row = document.createElement('div');
                row.className = `p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    item.isMet 
                        ? 'bg-emerald-50/90 border-emerald-400/80 text-emerald-950' 
                        : 'bg-rose-50/90 border-rose-300/80 text-rose-950'
                }`;
                const iconHtml = item.iconImg 
                    ? `<img src="${item.iconImg}" class="w-8 h-8 object-contain drop-shadow" />`
                    : `<span class="text-2xl">${item.icon}</span>`;
                
                const questHint = (item.isQuest && !item.isMet)
                    ? `<button class="px-2 py-0.5 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm ml-2" onclick="window.uiManager.closeAllModals(); window.uiManager.openChefMaiDialogue();">Làm Nhiệm Vụ ➡️</button>`
                    : '';

                row.innerHTML = `
                    <div class="flex items-center space-x-2.5 min-w-0">
                        ${iconHtml}
                        <div class="min-w-0">
                            <div class="font-bold font-quest text-xs truncate flex items-center">${item.name} ${questHint}</div>
                            <div class="text-[10px] text-slate-500 font-quest">Nguồn: ${item.from}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0 ml-2">
                        <span class="font-mono text-xs font-bold ${item.isMet ? 'text-emerald-700' : 'text-rose-700'}">${item.current} / ${item.required}</span>
                        <span>${item.isMet ? '✅' : '❌'}</span>
                    </div>
                `;
                list.appendChild(row);
            });
        }

        // 4. Cập nhật Nút Chế Tạo
        if (btn) {
            const canCraft = cm.canCraft(currentRecipe.id);
            btn.disabled = !canCraft;
            btn.className = canCraft 
                ? `btn-action-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-lg ${currentRecipe.isRare ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white animate-pulse' : ''}` 
                : 'btn-action-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-sm opacity-50 cursor-not-allowed';
            btn.innerHTML = `
                <img src="${currentRecipe.iconImg}" class="w-5 h-5 object-contain" />
                <span>${currentRecipe.isRare ? '🌟 CHẾ TẠO VẬT PHẨM HIẾM ĐẶC BIỆT' : '🎀 CHẾ TẠO / GÓI QUÀ NGAY'}</span>
            `;

            btn.onclick = () => {
                const res = cm.craft(currentRecipe.id);
                if (res.success) {
                    this.showToast(res.message, 'success');
                    if (res.isRare) {
                        this.showCelebrationBanner('👑 ĐẠI TIỆC ẨM THỰC THÀNH CÔNG!', 'Bạn đã chế tạo thành công [Giỏ Quà Đại Tiệc Ẩm Thực Lễ Hội] - vật phẩm hiếm nhất hội chợ!');
                    }
                    this.renderCraftingUI();
                    this.renderBackpackUI();
                } else {
                    this.showToast(res.message, 'error');
                }
            };
        }
    }

    // Đảm bảo Modal Đối Thoại NPC luôn tồn tại
    ensureDialogueModal() {
        let modal = document.getElementById('dialogue-modal');
        if (modal) return modal;

        const wrapper = document.getElementById('game-wrapper') || document.body;
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'dialogue-modal';
        modal.innerHTML = `
            <div class="modal-box modal-box-beige w-[560px] max-w-[95vw] overflow-hidden shadow-2xl font-quest">
                <div class="modal-header-beige flex items-center justify-between">
                    <div class="flex items-center space-x-2 font-quest text-lg font-bold text-[#3b2512]">
                        <span class="text-xl">💬</span>
                        <span id="dialogue-modal-header-title">TRÒ CHUYỆN & TƯƠNG TÁC</span>
                    </div>
                    <button class="quest-modal-close-btn modal-close-btn font-quest" onclick="window.uiManager.closeAllModals()" title="Đóng [Esc]">&times;</button>
                </div>
                <div class="modal-body p-4 sm:p-5 space-y-3.5 font-quest">
                    <!-- Khu vực Thông tin NPC: Avatar + Tên + Chức danh -->
                    <div class="flex items-center gap-3.5 pb-2.5 border-b border-[#7c6348]/30">
                        <div class="w-[72px] h-[72px] rounded-2xl bg-[#fffcf2] border-2 border-[#8c6d48] p-1 shadow-sm flex items-center justify-center shrink-0" id="dialogue-npc-avatar">
                            🧑‍🎓
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-quest font-bold text-xl text-[#3b2512] leading-tight flex items-center gap-2 truncate" id="dialogue-npc-name">
                                Tên NPC
                            </div>
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faeed0] border border-[#d4a373] text-[#8c3b12] text-xs font-bold font-quest mt-1 shadow-2xs truncate max-w-full" id="dialogue-npc-title">
                                Chức vụ
                            </div>
                        </div>
                    </div>

                    <!-- Bong bóng Lời thoại NPC phong cách Comic Beige -->
                    <div class="dialogue-speech-box" id="dialogue-npc-text">
                        Lời thoại...
                    </div>

                    <!-- Danh sách các nút tương tác / tặng quà / nhiệm vụ -->
                    <div class="flex flex-col space-y-2 pt-1" id="dialogue-actions">
                        <!-- Render các nút hành động -->
                    </div>
                </div>
            </div>
        `;
        wrapper.appendChild(modal);
        return modal;
    }

    // Mở trực tiếp đối thoại với Cô Mai Bếp Trưởng
    openChefMaiDialogue() {
        const chefNpc = {
            id: 'chef_mai',
            name: 'Cô Mai (Bếp Trưởng Lễ Hội)',
            role: 'chef',
            title: 'Quản Lý Ẩm Thực Đại Tiệc TNU',
            location: 'Khu Vui Chơi Hội Chợ (Map Game)',
            avatar: '👩‍🍳',
            speech: '🎁 Làm Hộp Quà Lễ Hội May Mắn nhận Giỏ Mây & +25 Thiện Cảm nhé!'
        };
        this.openDialogueModal(chefNpc);
    }

    // Mở Đối Thoại NPC
    openDialogueModal(npc) {
        this.ensureDialogueModal();
        const modal = document.getElementById('dialogue-modal');
        if (!modal) return;

        const avatarEl = document.getElementById('dialogue-npc-avatar');
        const nameEl = document.getElementById('dialogue-npc-name');
        const titleEl = document.getElementById('dialogue-npc-title');
        const textEl = document.getElementById('dialogue-npc-text');
        const actionsEl = document.getElementById('dialogue-actions');

        const i18n = window.i18n;
        if (avatarEl) {
            if (npc.skinId && window.NPC_DB) {
                const iconUrl = window.NPC_DB.getIcon(npc.skinId);
                avatarEl.innerHTML = `<img src="${iconUrl}" class="w-full h-full rounded-xl object-contain" alt="${npc.name}" />`;
            } else if (npc.avatar && (npc.avatar.includes('/') || npc.avatar.includes('.'))) {
                avatarEl.innerHTML = `<img src="${npc.avatar}" class="w-full h-full rounded-xl object-contain" alt="${npc.name}" />`;
            } else {
                avatarEl.innerHTML = `<span class="text-4xl select-none">${npc.avatar || '🧑‍🏫'}</span>`;
            }
        }
        if (nameEl) nameEl.innerText = (i18n.t(npc.nameKey) !== npc.nameKey ? i18n.t(npc.nameKey) : npc.name);
        if (titleEl) titleEl.innerText = (i18n.t(npc.titleKey) !== npc.titleKey ? i18n.t(npc.titleKey) : (npc.title || 'Bộ Môn Công Nghệ Thông Tin'));

        actionsEl.innerHTML = '';

        // 1. NPC Bếp Trưởng Lễ Hội (Nhiệm vụ 2: Chế tạo Hộp Quà Lễ Hội May Mắn đưa cho Cô Bếp Trưởng)
        if (npc.role === 'chef' || npc.id === 'chef_mai') {
            const q = window.useGameStore.state.quests.nhiem_vu_gio_qua || { status: 'not_started' };
            const hasHopQuaTet = window.useGameStore.hasItem('hop_qua_tet', 1);
            const hasHopBanh = window.useGameStore.hasItem('hop_banh', 1);
            const hasAnyGift = hasHopQuaTet || hasHopBanh;

            if (q.status === 'not_started') {
                textEl.innerText = i18n.t('npc_chef_mai_text1');
                const btn = document.createElement('button');
                btn.className = 'btn-dialogue-card btn-dialogue-quest';
                btn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>📜</span>
                        <span>${i18n.t('npc_chef_mai_btn_accept')}</span>
                    </span>
                    <span class="dialogue-reward-badge quest">Nhận Nhiệm Vụ 🌟</span>
                `;
                btn.onclick = () => {
                    window.useGameStore.setState(s => ({
                        quests: {
                            ...s.quests,
                            nhiem_vu_gio_qua: { ...s.quests.nhiem_vu_gio_qua, status: 'in_progress' }
                        }
                    }));
                    this.showToast('📜 Đã nhận nhiệm vụ Bếp Trưởng! Hãy vào Bàn Chế Tạo [G] làm 1 Hộp Quà Lễ Hội May Mắn!', 'info');
                    this.closeAllModals();
                };
                actionsEl.appendChild(btn);
            } else if (q.status === 'in_progress' && !hasAnyGift) {
                textEl.innerText = `${i18n.t('npc_chef_mai_text_progress')} (Hiện có: Hộp Quà Lễ Hội May Mắn: ${window.useGameStore.state.inventory.hop_qua_tet || 0}/1)`;
                
                const craftBtn = document.createElement('button');
                craftBtn.className = 'btn-dialogue-card btn-dialogue-festive';
                craftBtn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🎁</span>
                        <span>Mở Bàn Chế Tạo [G] Làm Hộp Quà Lễ Hội</span>
                    </span>
                    <span class="dialogue-reward-badge festive">Chế Tạo [G] 🧺</span>
                `;
                craftBtn.onclick = () => {
                    this.closeAllModals();
                    this.openCraftingModal();
                };
                actionsEl.appendChild(craftBtn);

                const playBtn = document.createElement('button');
                playBtn.className = 'btn-dialogue-card btn-dialogue-cake';
                playBtn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🍔</span>
                        <span>Vào Quầy Hứng Đồ Ăn (Tìm Cupcake, Khoai tây, Burger)</span>
                    </span>
                    <span class="dialogue-reward-badge cake">Minigame 🎮</span>
                `;
                playBtn.onclick = () => {
                    this.closeAllModals();
                    if (window.gameZoneManager) {
                        window.gameZoneManager.openGameBoard('food');
                    }
                };
                actionsEl.appendChild(playBtn);

                const cowBtn = document.createElement('button');
                cowBtn.className = 'btn-dialogue-card btn-dialogue-quest';
                cowBtn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🐄</span>
                        <span>Vào Quầy Kéo Bò (Tìm Sữa Bò Tươi)</span>
                    </span>
                    <span class="dialogue-reward-badge quest">Minigame 🥛</span>
                `;
                cowBtn.onclick = () => {
                    this.closeAllModals();
                    if (window.gameZoneManager) {
                        window.gameZoneManager.openGameBoard('cow');
                    }
                };
                actionsEl.appendChild(cowBtn);
            } else if (q.status === 'in_progress' && hasAnyGift) {
                textEl.innerText = i18n.t('npc_chef_mai_text2');
                const btn = document.createElement('button');
                btn.className = 'btn-dialogue-card btn-dialogue-quest animate-pulse';
                btn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🎉</span>
                        <span>${i18n.t('npc_chef_mai_btn_complete')}</span>
                    </span>
                    <span class="dialogue-reward-badge quest">+25 Thiện Cảm & Giỏ Mây 🧺</span>
                `;
                btn.onclick = () => {
                    if (hasHopQuaTet) {
                        window.useGameStore.removeItem('hop_qua_tet', 1);
                    } else {
                        window.useGameStore.removeItem('hop_banh', 1);
                    }
                    window.useGameStore.setState(s => ({
                        quests: {
                            ...s.quests,
                            nhiem_vu_gio_qua: { ...s.quests.nhiem_vu_gio_qua, status: 'completed', rewardCollected: true }
                        }
                    }));
                    window.useGameStore.addItem('gio_dung', 1);
                    window.useGameStore.addAffection(25);
                    if (window.soundSystem) window.soundSystem.playUnlockFanfare();
                    this.showToast('🎉 Hoàn thành nhiệm vụ Bếp Trưởng! Nhận +1 Giỏ Mây Đựng Quà & +25 Thiện Cảm!', 'success');
                    this.closeAllModals();
                    setTimeout(() => {
                        this.openCraftingModal();
                    }, 500);
                };
                actionsEl.appendChild(btn);
            } else {
                textEl.innerText = i18n.t('npc_chef_mai_text_done');
                const craftBtn = document.createElement('button');
                craftBtn.className = 'btn-dialogue-card btn-dialogue-festive';
                craftBtn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🎁</span>
                        <span>${i18n.t('npc_chef_mai_btn_craft')}</span>
                    </span>
                    <span class="dialogue-reward-badge festive">Chế Tạo [G] 🧺</span>
                `;
                craftBtn.onclick = () => {
                    this.closeAllModals();
                    this.openCraftingModal();
                };
                actionsEl.appendChild(craftBtn);
            }
        } else if (npc.role === 'quest_k45' || npc.id === 'sv_k45') {
            const q = window.useGameStore.state.quests.do_an_k45;
            if (q.status === 'not_started') {
                textEl.innerText = i18n.t('npc_sv_k45_text1');
                const btn = document.createElement('button');
                btn.className = 'btn-dialogue-card btn-dialogue-quest';
                btn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>📜</span>
                        <span>${i18n.t('npc_sv_k45_btn_accept')}</span>
                    </span>
                    <span class="dialogue-reward-badge quest">Nhiệm Vụ Đồ Án 📁</span>
                `;
                btn.onclick = () => {
                    window.useGameStore.setState(s => ({
                        quests: { ...s.quests, do_an_k45: { ...s.quests.do_an_k45, status: 'in_progress' } }
                    }));
                    this.showToast('📜 Đã nhận nhiệm vụ: Tìm đồ án cho anh sinh viên CNTT! Hãy tìm 3 trang tài liệu quanh sân trường!', 'info');
                    this.closeAllModals();
                };
                actionsEl.appendChild(btn);
            } else if (q.status === 'in_progress') {
                textEl.innerText = `Em đã nhặt được ${q.currentCount}/${q.targetCount} trang đồ án. Hãy tìm nốt quanh sân trường giúp anh nhé!`;
            } else if (q.status === 'can_turn_in') {
                textEl.innerText = i18n.t('npc_sv_k45_text2');
                const btn = document.createElement('button');
                btn.className = 'btn-dialogue-card btn-dialogue-quest animate-pulse';
                btn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <span>🎉</span>
                        <span>${i18n.t('npc_sv_k45_btn_complete')}</span>
                    </span>
                    <span class="dialogue-reward-badge quest">+20 Thiện Cảm & Cánh Băng 🪽</span>
                `;
                btn.onclick = () => {
                    window.useGameStore.setState(s => ({
                        quests: { ...s.quests, do_an_k45: { ...s.quests.do_an_k45, status: 'completed' } }
                    }));
                    window.useGameStore.addItem('vo_goi_hoa', 1);
                    window.useGameStore.addAffection(20);
                    window.useGameStore.checkAllUnlocks();
                    this.showToast('🎉 Hoàn thành nhiệm vụ: Tìm đồ án cho anh sinh viên CNTT! Nhận 1 Vỏ Gói Hoa & Mở khóa Cánh Băng!', 'success');
                    this.closeAllModals();
                };
                actionsEl.appendChild(btn);
            } else {
                textEl.innerText = 'Cảm ơn em nhiều nhé! Nhờ có em mà đồ án tốt nghiệp của anh đã hoàn thiện rồi! Chúc em luôn học tập thật tốt!';
            }
        } else if (npc.role.startsWith('teacher') || npc.role.startsWith('alumni')) {
            const textKey = 'npc_' + npc.role + '_text';
            const giftBtnKey = 'npc_' + npc.role + '_gift_btn';
            
            textEl.innerText = (i18n.t(textKey) !== textKey ? i18n.t(textKey) : (npc.speech || 'Chào em! Chúc em luôn giữ vững niềm đam mê học tập và nghiên cứu công nghệ!'));

            // Nút 1: Tặng Bó Hoa Hồng (+35 Thiện Cảm)
            const giftBtn = document.createElement('button');
            giftBtn.className = 'btn-dialogue-card btn-dialogue-rose';
            const rawTitle = (i18n.t(giftBtnKey) !== giftBtnKey ? i18n.t(giftBtnKey) : (i18n.getLocale() === 'en' ? 'Present Rose Bouquet' : 'Kính tặng Thầy/Cô Bó Hoa Hồng'));
            const cleanTitle = rawTitle.replace(/\s*\(\+35.*?\)/, '').trim();
            giftBtn.innerHTML = `
                <span class="flex items-center gap-2 text-left">
                    <img src="assets/ui/icons/rose_normal.png" class="w-5 h-5 object-contain inline-block shrink-0" alt="Hoa" onerror="this.outerHTML='💐'"/>
                    <span>${cleanTitle}</span>
                </span>
                <span class="dialogue-reward-badge rose">+35 Thiện Cảm 💖</span>
            `;
            giftBtn.onclick = () => {
                if (window.useGameStore.hasItem('bo_hoa_hong', 1)) {
                    window.useGameStore.removeItem('bo_hoa_hong', 1);
                    const res = window.useGameStore.addAffection(35);
                    if (window.soundSystem) window.soundSystem.playAffectionGain();

                    this.showToast(`💖 Kính tặng Thầy/Cô thành công! Điểm thiện cảm: ${res.current}/100!`, 'success');
                    if (res.current >= 100) {
                        window.useGameStore.unlockAllOutfits();
                    }
                    this.closeAllModals();
                } else {
                    this.showToast('Bạn chưa có Bó Hoa Hồng! Hãy sang Bàn Gói Quà [G] để ghép hoa!', 'error');
                }
            };
            actionsEl.appendChild(giftBtn);

            // Nút 2: Tặng Hộp Quà Lễ Hội May Mắn (+25 Thiện Cảm) nếu có
            if (window.useGameStore.hasItem('hop_qua_tet', 1)) {
                const tetGiftBtn = document.createElement('button');
                tetGiftBtn.className = 'btn-dialogue-card btn-dialogue-festive';
                tetGiftBtn.innerHTML = `
                    <span class="flex items-center gap-2 text-left">
                        <img src="assets/rose_garden/icons/gift_box.png" class="w-5 h-5 object-contain inline-block shrink-0" alt="Quà" onerror="this.outerHTML='🧧'"/>
                        <span>Kính tặng Hộp Quà Lễ Hội May Mắn</span>
                    </span>
                    <span class="dialogue-reward-badge festive">+25 Thiện Cảm 🎁</span>
                `;
                tetGiftBtn.onclick = () => {
                    window.useGameStore.removeItem('hop_qua_tet', 1);
                    const res = window.useGameStore.addAffection(25);
                    if (window.soundSystem) window.soundSystem.playAffectionGain();
                    this.showToast(`🧧 Kính tặng Hộp Quà thành công! Điểm thiện cảm: ${res.current}/100!`, 'success');
                    if (res.current >= 100) {
                        window.useGameStore.unlockAllOutfits();
                    }
                    this.closeAllModals();
                };
                actionsEl.appendChild(tetGiftBtn);
            }

            // Nút 3: Tặng Hộp Bánh Thơm Ngon (+20 Thiện Cảm) nếu có
            if (window.useGameStore.hasItem('hop_banh', 1)) {
                const cakeGiftBtn = document.createElement('button');
                cakeGiftBtn.className = 'btn-dialogue-card btn-dialogue-cake';
                cakeGiftBtn.innerHTML = `
                    <span class="flex items-center gap-2 text-left">
                        <img src="assets/ui/icons/cake_normal.png" class="w-5 h-5 object-contain inline-block shrink-0" alt="Bánh" onerror="this.outerHTML='🎂'"/>
                        <span>Kính tặng Hộp Bánh Thơm Ngon</span>
                    </span>
                    <span class="dialogue-reward-badge cake">+20 Thiện Cảm 🍰</span>
                `;
                cakeGiftBtn.onclick = () => {
                    window.useGameStore.removeItem('hop_banh', 1);
                    const res = window.useGameStore.addAffection(20);
                    if (window.soundSystem) window.soundSystem.playAffectionGain();
                    this.showToast(`🎂 Kính tặng Hộp Bánh thành công! Điểm thiện cảm: ${res.current}/100!`, 'success');
                    if (res.current >= 100) {
                        window.useGameStore.unlockAllOutfits();
                    }
                    this.closeAllModals();
                };
                actionsEl.appendChild(cakeGiftBtn);
            }

            // Nút 4: Tặng Giỏ Quà Đại Tiệc Ẩm Thực Lễ Hội (+60 Thiện Cảm & Pháo Hoa!) nếu có
            if (window.useGameStore.hasItem('gio_qua_am_thuc', 1)) {
                const banquetBtn = document.createElement('button');
                banquetBtn.className = 'btn-dialogue-card btn-dialogue-banquet animate-pulse';
                banquetBtn.innerHTML = `
                    <span class="flex items-center gap-2 text-left">
                        <span class="text-base">🌟</span>
                        <span>Kính dâng Giỏ Quà Đại Tiệc Ẩm Thực</span>
                    </span>
                    <span class="dialogue-reward-badge banquet">+60 Thiện Cảm & Pháo Hoa! 🎆</span>
                `;
                banquetBtn.onclick = () => {
                    window.useGameStore.removeItem('gio_qua_am_thuc', 1);
                    const res = window.useGameStore.addAffection(60);
                    if (window.soundSystem) window.soundSystem.playUnlockFanfare();
                    this.showCelebrationBanner('🎉 ĐẠI TIỆC ẨM THỰC TRI ÂN!', 'Thầy/Cô vô cùng xúc động và khen ngợi tấm lòng chân thành của bạn! (+60 Thiện Cảm)');
                    if (res.current >= 100) {
                        window.useGameStore.unlockAllOutfits();
                    }
                    this.closeAllModals();
                };
                actionsEl.appendChild(banquetBtn);
            }

            // Nút Chào hỏi / Tiếp tục
            const byeBtn = document.createElement('button');
            byeBtn.className = 'btn-dialogue-card btn-dialogue-neutral mt-2';
            byeBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2 w-full text-center">
                    <span>👋</span>
                    <span>${i18n.getLocale() === 'en' ? 'Thank you Professor, I will continue my studies!' : 'Dạ em cảm ơn Thầy/Cô, em xin phép tiếp tục học tập ạ!'}</span>
                </span>
            `;
            byeBtn.onclick = () => {
                this.closeAllModals();
            };
            actionsEl.appendChild(byeBtn);
        } else if (npc.role === 'principal') {
            const aff = window.useGameStore.state.progression.diem_thien_cam;
            textEl.innerText = aff >= 100 
                ? 'Thầy rất tự hào về em! Em là tấm gương sáng cho toàn thể sinh viên Trường Đại học Tây Nguyên!' 
                : 'Chào mừng em đến với Tòa nhà Điều Hành Trường Đại Học Tây Nguyên! Hãy tích cực học tập và tham gia các hoạt động nhé!';
            const byeBtn = document.createElement('button');
            byeBtn.className = 'btn-dialogue-card btn-dialogue-neutral mt-2';
            byeBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2 w-full text-center">
                    <span>👋</span>
                    <span>${i18n.getLocale() === 'en' ? 'Thank you Principal, I will do my best!' : 'Dạ em cảm ơn Thầy Hiệu Trưởng, em sẽ cố gắng ạ!'}</span>
                </span>
            `;
            byeBtn.onclick = () => this.closeAllModals();
            actionsEl.appendChild(byeBtn);
        }

        if (actionsEl.children.length === 0) {
            const byeBtn = document.createElement('button');
            byeBtn.className = 'btn-dialogue-card btn-dialogue-neutral mt-2';
            byeBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2 w-full text-center">
                    <span>👋</span>
                    <span>${i18n.getLocale() === 'en' ? 'Goodbye!' : 'Dạ em chào Thầy/Cô ạ!'}</span>
                </span>
            `;
            byeBtn.onclick = () => this.closeAllModals();
            actionsEl.appendChild(byeBtn);
        }

        this.openModal(modal);
    }

    // Minigame Modals
    openClawMachineModal() {
        const modal = document.getElementById('claw-machine-modal');
        if (!modal) return;
        this.openModal(modal);
        if (!window.clawGameInstance) {
            window.clawGameInstance = new ClawMachineGame('claw-canvas');
            window.clawGameInstance.init();
        }
        window.clawGameInstance.start();
    }

    openShootingGalleryModal() {
        const modal = document.getElementById('shooting-gallery-modal');
        if (!modal) return;
        this.openModal(modal);
        if (!window.shootingGameInstance) {
            window.shootingGameInstance = new ShootingGalleryGame('shooting-canvas');
            window.shootingGameInstance.init();
        }
        window.shootingGameInstance.start();
    }

    // Toast Notification
    showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        let toastIcon = '';
        const lowerMsg = (msg || '').toLowerCase();
        if (lowerMsg.includes('xu') || lowerMsg.includes('tiền') || lowerMsg.includes('coin')) {
            toastIcon = `<img src="assets/ui/icons/coin_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        } else if (lowerMsg.includes('xe buýt') || lowerMsg.includes('bus')) {
            toastIcon = `<img src="assets/ui/icons/bus_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        } else if (lowerMsg.includes('nhiệm vụ') || lowerMsg.includes('đồ án')) {
            toastIcon = `<img src="assets/ui/icons/scroll_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        } else if (lowerMsg.includes('hoa')) {
            toastIcon = `<img src="assets/ui/icons/flower_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        } else if (lowerMsg.includes('quà') || lowerMsg.includes('chế tạo')) {
            toastIcon = `<img src="assets/ui/icons/gift_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        } else if (lowerMsg.includes('thiện cảm') || lowerMsg.includes('cảm ơn') || lowerMsg.includes('cám ơn')) {
            toastIcon = `<img src="assets/ui/icons/heart_normal.png" class="w-5 h-5 object-contain inline-block mr-1.5 align-middle" />`;
        }

        const toast = document.createElement('div');
        toast.className = `rpg-toast-banner toast-${type}`;
        toast.innerHTML = `
            <div class="rpg-toast-left"></div>
            <div class="rpg-toast-mid">
                <span class="rpg-toast-text flex items-center">${toastIcon}<span>${msg}</span></span>
            </div>
            <div class="rpg-toast-right"></div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast && toast.style) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-18px) scale(0.94)';
                toast.style.transition = 'all 0.4s ease';
            }
            setTimeout(() => {
                if (toast && typeof toast.remove === 'function') {
                    toast.remove();
                } else if (toast && toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 3600);
    }

    // Bắn Pháo Hoa Mừng Mở Khóa Cánh Mới
    showUnlockCelebration(item) {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
        this.showToast(`✨ BẠN ĐÃ MỞ KHÓA THÀNH CÔNG: [${item.name}]!`, 'success');
    }

    showCelebrationBanner(title, desc) {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
        }
        this.showToast(`${title} - ${desc}`, 'success');
    }

    // ========================================================
    // CHAT BOX CONTROLLER (TRÒ CHUYỆN MMORPG VINTAGE)
    // ========================================================
    initChatChipsScroll() {
        const chipsContainers = document.querySelectorAll('.hud-chat-chips');
        chipsContainers.forEach(container => {
            // 1. Lăn chuột để cuộn ngang mượt mà (Mouse Wheel Horizontal Scroll)
            container.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    container.scrollLeft += e.deltaY * 0.9;
                } else if (e.deltaX !== 0) {
                    container.scrollLeft += e.deltaX * 0.9;
                }
            }, { passive: false });

            // 2. Kéo chuột để cuộn ngang (Drag-to-Scroll)
            let isDown = false;
            let startX = 0;
            let scrollStart = 0;
            let draggedDist = 0;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                draggedDist = 0;
                startX = e.pageX;
                scrollStart = container.scrollLeft;
                container.classList.add('is-dragging');
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const dx = e.pageX - startX;
                draggedDist += Math.abs(dx);
                container.scrollLeft = scrollStart - dx;
            });

            window.addEventListener('mouseup', () => {
                if (!isDown) return;
                isDown = false;
                container.classList.remove('is-dragging');
            });

            // Ngăn chặn bấm nhầm nút khi người dùng đang kéo lướt
            container.addEventListener('click', (e) => {
                if (draggedDist > 6) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }, true);
        });
    }

    toggleChatMinimize() {
        const box = document.getElementById('hud-chat-box');
        if (!box) return;
        box.classList.toggle('chat-collapsed');
    }

    toggleChatExpand() {
        const box = document.getElementById('hud-chat-box');
        if (!box) return;
        box.classList.remove('chat-collapsed');
        box.classList.toggle('chat-expanded');
    }

    switchChatChannel(channel, tabEl) {
        this.currentChatChannel = channel;
        // Update tabs active state & switch icon normal/active
        document.querySelectorAll('.hud-chat-tab').forEach(t => {
            t.classList.remove('active');
            const icon = t.querySelector('.interactive-icon');
            if (icon && icon.getAttribute('data-normal')) {
                icon.src = icon.getAttribute('data-normal');
            }
        });
        if (tabEl) {
            tabEl.classList.add('active');
            const icon = tabEl.querySelector('.interactive-icon');
            if (icon && icon.getAttribute('data-active')) {
                icon.src = icon.getAttribute('data-active');
                icon.classList.add('icon-pop-spring');
                setTimeout(() => icon.classList.remove('icon-pop-spring'), 450);
            }
        }

        // Update dropdown pill label
        const channelNames = {
            'school': 'Toàn trường',
            'friends': 'Bạn bè',
            'quest': 'Đồ án',
            'notice': 'Thông báo'
        };
        const curLabel = document.getElementById('txt-chat-current-channel');
        if (curLabel) curLabel.innerText = channelNames[channel] || 'Toàn trường';

        // Filter messages: nếu channel === 'school' thì hiện toàn bộ hoặc tin toàn trường
        const msgs = document.querySelectorAll('#hud-chat-messages .hud-chat-msg');
        msgs.forEach(m => {
            const msgCh = m.getAttribute('data-channel');
            if (channel === 'school' || !msgCh || msgCh === channel || msgCh === 'school') {
                m.style.display = 'flex';
            } else {
                m.style.display = 'none';
            }
        });

        // Scroll to bottom
        const container = document.getElementById('hud-chat-messages');
        if (container) container.scrollTop = container.scrollHeight;
    }

    cycleChatChannel() {
        const order = ['school', 'friends', 'quest', 'notice'];
        const currentIdx = order.indexOf(this.currentChatChannel || 'school');
        const nextChannel = order[(currentIdx + 1) % order.length];
        const tabs = document.querySelectorAll('.hud-chat-tab');
        let targetTab = null;
        tabs.forEach(t => {
            if (t.getAttribute('data-channel') === nextChannel) targetTab = t;
        });
        this.switchChatChannel(nextChannel, targetTab);
    }

    sendQuickChat(type) {
        const map = {
            'Chào': 'Xin chào toàn trường! Chúc mọi người ngày học tập vui vẻ 👋',
            'Cám ơn': 'Cảm ơn bạn nhiều nhé! ✨',
            'Giúp với': 'Có ai rảnh qua giúp mình nhặt tài liệu đồ án tốt nghiệp với! 📚',
            'Đi đâu?': 'Bây giờ nên đi khám phá khu vực nào vậy mọi người? 🗺️',
            '20/11': 'Chúc mừng ngày nhà giáo Việt Nam 20/11!',
            '😊': '( ˶ˆ ꒳ ˆ˵ ) Chúc các bạn sinh viên TNU ngày mới an lành!'
        };
        const text = map[type] || type;
        const myName = (window.useGameStore && window.useGameStore.state.progression && window.useGameStore.state.progression.ten_nhan_vat) 
            || (window.gameInstance && window.gameInstance.player && window.gameInstance.player.name) 
            || 'Bạn';
        this.addChatMessage(text, this.currentChatChannel || 'school', myName);

        // Kiểm tra câu chúc 20/11 mở khóa toàn bộ Cánh
        const clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
        if (clean.includes("20/11") || clean.includes("20-11") || (clean.includes("chuc mung") && clean.includes("nha giao"))) {
            if (window.useGameStore && typeof window.useGameStore.unlockAllWings === 'function') {
                window.useGameStore.unlockAllWings();
                this.renderQuestsUI();
                this.updateHUD();
                setTimeout(() => {
                    this.addChatMessage('💐 [Ban Giám Hiệu]: Cảm ơn em! Lời chúc 20/11 thật ý nghĩa! Nhà trường trao tặng em trọn bộ 18+ Cánh Thần Thoại!', 'notice', 'Thầy Hiệu Trưởng');
                }, 600);
            }
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        // Bật animation icon máy bay Hàng 2
        const sendBtn = document.getElementById('btn-chat-send');
        if (sendBtn) {
            const planeIcon = sendBtn.querySelector('.interactive-icon');
            if (planeIcon && planeIcon.getAttribute('data-active')) {
                planeIcon.src = planeIcon.getAttribute('data-active');
                planeIcon.classList.add('icon-pop-spring');
                setTimeout(() => {
                    planeIcon.src = planeIcon.getAttribute('data-normal');
                    planeIcon.classList.remove('icon-pop-spring');
                }, 450);
            }
        }

        const myName = (window.useGameStore && window.useGameStore.state.progression && window.useGameStore.state.progression.ten_nhan_vat) 
            || (window.gameInstance && window.gameInstance.player && window.gameInstance.player.name) 
            || 'Bạn';
        this.addChatMessage(text, this.currentChatChannel || 'school', myName);
        input.value = '';

        // KIỂM TRA NHIỆM VỤ CHAT CHÚC MỪNG 20/11 MỞ KHÓA TOÀN BỘ CÁNH
        const clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
        if (clean.includes("20/11") || 
            clean.includes("20-11") || 
            (clean.includes("chuc mung") && clean.includes("nha giao")) ||
            clean.includes("chuc mung ngay nha giao viet nam")) {
            if (window.useGameStore && typeof window.useGameStore.unlockAllWings === 'function') {
                window.useGameStore.unlockAllWings();
                this.renderQuestsUI();
                this.updateHUD();
                setTimeout(() => {
                    this.addChatMessage('💐 [Ban Giám Hiệu]: Cảm ơn em! Lời chúc 20/11 thật ý nghĩa! Nhà trường trao tặng em trọn bộ 18+ Cánh Thần Thoại!', 'notice', 'Thầy Hiệu Trưởng');
                }, 600);
            }
        }

        // Phản hồi giả lập sinh viên quanh trường Đại Học Tây Nguyên
        if (Math.random() > 0.3) {
            setTimeout(() => {
                const replies = [
                    { sender: 'Minh Tuấn (K45)', channel: 'quest', text: 'Cố lên bạn ơi, qua Tòa Hiệu Bộ nộp tài liệu đồ án nhé!' },
                    { sender: 'Sinh Viên K46', channel: 'school', text: 'Chào bạn! Hồ Sinh Thái hôm nay gió mát lắm, qua hóng gió đi!' },
                    { sender: 'SV Y Dược', channel: 'friends', text: 'Ghé thăm vườn thực nghiệm Nhà số 2 hái hoa cùng mình nha!' },
                    { sender: 'Người Hái Cà Phê', channel: 'school', text: 'Không khí Tây Nguyên mùa này thật sảng khoái và trong lành!' },
                    { sender: 'CLB Thể Thao TNU', channel: 'school', text: 'Sân vận động đang có chạy pitch, ghé rèn luyện sức khỏe nhé!' }
                ];
                const r = replies[Math.floor(Math.random() * replies.length)];
                this.addChatMessage(r.text, r.channel, r.sender);
            }, 1000);
        }
    }

    addChatMessage(text, channel = 'school', sender = 'Hệ thống') {
        const container = document.getElementById('hud-chat-messages');
        if (!container) return;

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'hud-chat-msg';
        msgDiv.setAttribute('data-channel', channel);

        const badgeHtml = `
            <div class="msg-badge-group">
                <span class="msg-bullet-lines">≡</span>
                <svg class="msg-envelope-icon" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.75" y="0.75" width="14.5" height="10.5" rx="1.5" fill="#fdfbf7" stroke="#3c2a1e" stroke-width="1.5"/>
                    <path d="M1.5 1.5L8 6.5L14.5 1.5" stroke="#3c2a1e" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
            </div>
        `;

        let prefix = '';
        if (sender === 'Bạn') {
            prefix = `<b class="text-[#8c3b12]">[Bạn]:</b> `;
        } else if (sender !== 'Hệ thống') {
            prefix = `<b class="text-[#2d6a4f]">[${sender}]:</b> `;
        }

        msgDiv.innerHTML = `
            ${badgeHtml}
            <span class="hud-chat-msg-text font-quest">${prefix}${text}</span>
            <span class="hud-chat-msg-time">${timeStr}</span>
        `;

        // Check if currently filtered
        if (this.currentChatChannel && this.currentChatChannel !== 'school' && channel !== 'school' && channel !== this.currentChatChannel) {
            msgDiv.style.display = 'none';
        }

        container.appendChild(msgDiv);

        // Keep maximum 50 messages
        while (container.children && container.children.length > 50) {
            container.removeChild(container.firstChild);
        }

        container.scrollTop = container.scrollHeight;
    }

    // ==========================================
    // QUẢN LÝ KHỞI TẠO & ĐĂNG NHẬP NHÂN VẬT (CHARACTER CREATION & LOGIN)
    // ==========================================
    initCharacterSetup() {
        const modal = document.getElementById('character-setup-modal');
        if (!modal) return;

        const state = window.useGameStore ? window.useGameStore.state : null;
        const prog = state ? state.progression : {};
        const savedName = (prog && prog.ten_nhan_vat ? prog.ten_nhan_vat : '').trim();
        const savedSkin = (prog && prog.trang_phuc_hien_tai) || 'skin_shaolin_monk';
        const isCreated = !!(prog && prog.is_character_created && savedName.length > 0);

        this.selectedStarterSkin = ['skin_shaolin_monk', 'skin_obocchaman', 'skin_ethnic_maiden'].includes(savedSkin)
            ? savedSkin
            : 'skin_shaolin_monk';

        // Điền tên vào input nếu đã có
        const inputName = document.getElementById('input-character-name');
        const counter = document.getElementById('char-name-counter');
        const hint = document.getElementById('saved-character-hint');
        const titleEl = document.getElementById('char-setup-title');
        const enterBtnText = document.getElementById('txt-confirm-enter-btn');
        const closeBtn = document.getElementById('btn-close-char-modal');

        if (inputName) {
            inputName.value = savedName;
            if (counter) counter.innerText = `${savedName.length}/20`;

            inputName.oninput = () => {
                if (counter) counter.innerText = `${inputName.value.length}/20`;
            };

            inputName.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    this.confirmCharacterSetup();
                }
            };
        }

        // Random tên
        const btnRandom = document.getElementById('btn-random-name');
        if (btnRandom) {
            btnRandom.onclick = () => {
                const sampleNames = [
                    'Cậu Mười Sữa Đá', 'Minh Tuấn K45', 'Bé Mười Sữa Đá', 'Lâm Xung', 
                    'Họa Mi Tây Nguyên', 'Tiểu Sư Huynh', 'Sơn Nữ Cao Nguyên', 'Đại Ca Buôn Ma Thuột',
                    'Bác Học Oboccha', 'Kiếm Khách TNU', 'Bảo Ngọc K46', 'Văn Toàn IT'
                ];
                const rand = sampleNames[Math.floor(Math.random() * sampleNames.length)];
                if (inputName) {
                    inputName.value = rand;
                    if (counter) counter.innerText = `${rand.length}/20`;
                    inputName.focus();
                }
            };
        }

        if (isCreated) {
            if (hint) hint.style.display = 'inline';
            if (titleEl) titleEl.innerText = `CHÀO MỪNG TRỞ LẠI TNU: ĐÔI CÁNH ĐẠI NGÀN!`;
            if (enterBtnText) enterBtnText.innerText = `TIẾP TỤC VÀO GAME [${savedName.toUpperCase()}]`;
            if (closeBtn) closeBtn.style.display = 'block';
        } else {
            if (hint) hint.style.display = 'none';
            if (titleEl) titleEl.innerText = `TNU: ĐÔI CÁNH ĐẠI NGÀN`;
            if (enterBtnText) enterBtnText.innerText = `BƯỚC VÀO KHUÔN VIÊN TRƯỜNG`;
            if (closeBtn) closeBtn.style.display = 'none';
        }

        // Chọn skin ban đầu
        this.selectStarterSkin(this.selectedStarterSkin);

        // Vẽ các icon preview
        this.renderStarterSkinPreviews();

        // Mở modal nếu chưa tạo nhân vật, nếu đã lưu dữ liệu từ trước thì vào game trực tiếp
        if (!isCreated) {
            this.openCharacterSetupModal(false);
        } else {
            this.closeCharacterSetupModal();
        }
    }

    openCharacterSetupModal(isEditing = false) {
        const modal = document.getElementById('character-setup-modal');
        if (!modal) return;

        const state = window.useGameStore ? window.useGameStore.state : null;
        const prog = state ? state.progression : {};
        const savedName = (prog && prog.ten_nhan_vat ? prog.ten_nhan_vat : '').trim();
        const closeBtn = document.getElementById('btn-close-char-modal');
        const inputName = document.getElementById('input-character-name');
        const hint = document.getElementById('saved-character-hint');
        const titleEl = document.getElementById('char-setup-title');
        const enterBtnText = document.getElementById('txt-confirm-enter-btn');

        if (prog && prog.is_character_created && savedName) {
            if (hint) hint.style.display = 'inline';
            if (titleEl) titleEl.innerText = isEditing ? 'HỒ SƠ NHÂN VẬT & ĐỔI TRANG PHỤC' : 'CHÀO MỪNG TRỞ LẠI TNU: ĐÔI CÁNH ĐẠI NGÀN!';
            if (enterBtnText) enterBtnText.innerText = isEditing ? 'LƯU & TIẾP TỤC CHƠI' : `TIẾP TỤC VÀO GAME [${savedName.toUpperCase()}]`;
            if (closeBtn) closeBtn.style.display = 'block';
        }

        modal.style.display = 'flex';
        this.openModal(modal);
        if (inputName && !savedName) {
            setTimeout(() => inputName.focus(), 150);
        }
        this.renderStarterSkinPreviews();
    }

    closeCharacterSetupModal() {
        const modal = document.getElementById('character-setup-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.classList.remove('modal-visible');
            modal.style.display = 'none';
        }
        if (this.activeModal && this.activeModal.id === 'character-setup-modal') {
            this.activeModal = null;
        }
    }

    selectStarterSkin(skinId) {
        this.selectedStarterSkin = skinId;
        const cards = document.querySelectorAll('.starter-skin-card');
        cards.forEach(card => {
            const isSelected = card.getAttribute('data-skin') === skinId;
            const badge = card.querySelector('.skin-selected-badge');
            const btn = card.querySelector('.btn-select-skin');

            if (isSelected) {
                card.classList.add('selected');
                card.classList.remove('border-[#b89b72]', 'bg-[#fffcf2]');
                card.classList.add('border-[#2d6a4f]', 'bg-[#f0fdf4]', 'ring-4', 'ring-[#2d6a4f]/30', 'scale-[1.02]');
                if (badge) badge.style.display = 'block';
                if (btn) {
                    btn.innerHTML = '<span>✔ Đang Chọn</span>';
                    btn.classList.add('bg-[#52b788]', 'text-white', 'border-[#2d6a4f]');
                }
            } else {
                card.classList.remove('selected');
                card.classList.remove('border-[#2d6a4f]', 'bg-[#f0fdf4]', 'ring-4', 'ring-[#2d6a4f]/30', 'scale-[1.02]');
                card.classList.add('border-[#b89b72]', 'bg-[#fffcf2]');
                if (badge) badge.style.display = 'none';
                if (btn) {
                    btn.innerHTML = '<span>👔 Mặc Ngay</span>';
                    btn.classList.remove('bg-[#52b788]', 'text-white', 'border-[#2d6a4f]');
                }
            }
        });
    }

    renderStarterSkinPreviews() {
        const map = {
            'skin_shaolin_monk': 'skin-preview-shaolin',
            'skin_obocchaman': 'skin-preview-obocchaman',
            'skin_ethnic_maiden': 'skin-preview-ethnic'
        };

        for (const skinId in map) {
            const canvas = document.getElementById(map[skinId]);
            if (canvas && window.bodySQLDB) {
                window.bodySQLDB.drawBodyIcon(canvas, skinId);
            }
        }
    }

    confirmCharacterSetup() {
        const inputName = document.getElementById('input-character-name');
        let name = inputName ? inputName.value.trim() : '';
        if (!name) {
            this.showToast('Vui lòng nhập tên nhân vật trước khi vào trường!', 'error');
            if (inputName) inputName.focus();
            return;
        }

        const skinId = this.selectedStarterSkin || 'skin_shaolin_monk';

        // 1. Lưu vào LocalStorage qua Zustand Store
        try {
            if (window.useGameStore) {
                window.useGameStore.setCharacterProfile(name, skinId);
                window.useGameStore.equipWing(null); // Tuyệt đối không cho cánh ban đầu
                window.useGameStore.equipPet(null);  // Tuyệt đối không cho pet ban đầu
            }
        } catch (err) {
            console.error('Lỗi khi lưu Store:', err);
        }

        // 2. ĐÓNG MODAL NGAY LẬP TỨC ĐỂ NGƯỜI CHƠI BƯỚC VÀO GAME
        this.closeCharacterSetupModal();

        // 3. Cập nhật Player & Hạt ăn mừng trong GameInstance
        try {
            if (window.gameInstance && window.gameInstance.player) {
                window.gameInstance.player.name = name;
                if (window.gameInstance.particleSystem && typeof window.gameInstance.particleSystem.burstCelebration === 'function') {
                    window.gameInstance.particleSystem.burstCelebration(window.gameInstance.player.x, window.gameInstance.player.y);
                }
            }
        } catch (err) {
            console.warn('Lỗi player setup:', err);
        }

        // 4. Bắn pháo hoa chào mừng & âm thanh
        try {
            if (window.soundSystem) {
                window.soundSystem.init();
                if (typeof window.soundSystem.playOutfitChange === 'function') {
                    window.soundSystem.playOutfitChange();
                }
            }
        } catch (err) {
            console.warn('Lỗi soundSystem:', err);
        }

        // 5. Cập nhật HUD & Toast
        try {
            this.updateHUD();
            this.showToast(`Chào mừng bạn [${name}] đến với TNU: Đôi Cánh Đại Ngàn!`, 'success');
        } catch (err) {
            console.warn('Lỗi updateHUD:', err);
        }
    }

    // ========================================================
    // HỆ THỐNG ICON TƯƠNG TÁC: ĐỔI HÀNG 1 SANG HÀNG 2 KHI ẤN
    // ========================================================
    initInteractiveIcons() {
        // Universal delegator: khi click/chạm vào bất kỳ nút nào có chứa .interactive-icon
        document.addEventListener('pointerdown', (e) => {
            const btn = e.target.closest('button, a, .hud-chat-tab, .hud-chat-chip, .hud-chat-send-btn, .hud-backpack-icon-box, .hud-mini-bar, .starter-skin-card, .quest-compact-bar, #btn-quest-goto, .quest-image2-btn');
            if (!btn) return;

            // Tìm icon bên trong hoặc chính nó
            const icon = btn.querySelector('.interactive-icon') || (btn.classList.contains('interactive-icon') ? btn : null);
            if (!icon) return;

            const activeSrc = icon.getAttribute('data-active');
            const normalSrc = icon.getAttribute('data-normal');
            if (!activeSrc) return;

            // Các tab và nút toggle được quản lý riêng theo logic chọn
            const isChatTab = btn.classList.contains('hud-chat-tab');
            const isWardrobeTab = btn.classList.contains('wardrobe-tab-btn');
            const isCraftingTab = btn.classList.contains('crafting-recipe-tab');
            const isSoundToggle = btn.id === 'btn-toggle-sound';

            if (isChatTab || isWardrobeTab || isCraftingTab || isSoundToggle) return;

            // Các nút hành động tức thì: đổi ngay sang icon Hàng 2 với hiệu ứng nảy
            icon.src = activeSrc;
            icon.classList.add('icon-pop-spring');
            btn.classList.add('is-active');

            setTimeout(() => {
                if (normalSrc) icon.src = normalSrc;
                icon.classList.remove('icon-pop-spring');
                btn.classList.remove('is-active');
            }, 450);
        });

        // Tải trước toàn bộ icon Hàng 2 (active) vào bộ nhớ đệm
        const preloadActiveIcons = () => {
            document.querySelectorAll('.interactive-icon[data-active]').forEach(img => {
                const src = img.getAttribute('data-active');
                if (src) {
                    const preloadImg = new Image();
                    preloadImg.src = src;
                }
            });
        };
        if (document.readyState === 'complete') {
            preloadActiveIcons();
        } else {
            window.addEventListener('load', preloadActiveIcons);
        }
    }
}

window.uiManager = new UIManager();
