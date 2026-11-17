/**
 * GIFT & GOURMET CRAFTING SYSTEM (Hệ Thống Gói Quà & Chế Tạo Ẩm Thực TNU)
 * Vị trí: Bàn Gói Quà & Xưởng Ẩm Thực Hội Chợ
 * 
 * 3 Công thức chế tạo chính:
 *  1. Bó Hoa Hồng Tây Nguyên (bo_hoa_hong):
 *     - 10 Hoa hồng thường (hoa_hong)
 *     - 1 Hoa hồng trắng hiếm (hoa_hong_trang)
 *     - 1 Vỏ gói hoa đặc biệt từ nhiệm vụ (vo_goi_hoa)
 * 
 *  2. Hộp Quà Lễ Hội May Mắn (hop_qua_tet - Ảnh 4):
 *     - 1 Bánh Cupcake dâu (banh_cupcake)
 *     - 1 Khoai tây chiên giòn (khoai_tay_chien)
 *     - 1 Burger bò đặc biệt (burger_bo)
 *     - 1 Sữa bò tươi nguyên chất (sua_bo_tuoi)
 * 
 *  3. Giỏ Quà Đại Tiệc Ẩm Thực (gio_qua_am_thuc - Ảnh 3 - VẬT PHẨM HIẾM ĐẶC BIỆT):
 *     - Chế tạo từ TẤT CẢ các món đồ ăn hội chợ:
 *       + 1 Mì Trộn Trứng Ốp La (mi_tron_trung - Ảnh 1)
 *       + 1 Cơm Cánh Gà Rán Giòn (com_canh_ga - Ảnh 2)
 *       + 1 Burger Bò Đặc Biệt (burger_bo)
 *       + 1 Khoai Tây Chiên Giòn (khoai_tay_chien)
 *       + 1 Bánh Cupcake Dâu (banh_cupcake)
 *       + 1 Sữa Bò Tươi Nguyên Chất (sua_bo_tuoi)
 *       + 1 Phô Mai Thượng Hạng (pho_mai)
 *     - BẮT BUỘC NGUYÊN LIỆU HIẾM TỪ NHIỆM VỤ:
 *       + 1 Giỏ Mây Đựng Quà Cao Cấp (gio_dung - Nhận từ nhiệm vụ Bếp Trưởng)
 *       + 1 Hộp Quà Lễ Hội May Mắn (hop_qua_tet - Ảnh 4 - Nhận từ nhiệm vụ hoặc chế tạo)
 *     - Khi chế tạo thành công: Nhận Giỏ Quà Đại Tiệc Ẩm Thực Lễ Hội (+60 Điểm Thiện Cảm, hiệu ứng pháo hoa cực đẹp!)
 */

class CraftingManager {
    constructor() {
        this.recipes = {
            hop_banh: {
                id: 'hop_banh',
                name: 'Hộp Bánh Thơm Ngon Bếp Trưởng',
                isRare: false,
                badge: '🎂 NHIỆM VỤ BẾP TRƯỞNG',
                icon: '🎂',
                iconImg: 'assets/items/qua_tro_choi.png',
                description: 'Hộp bánh ngọt hảo hạng thơm ngậy mùi bơ sữa và nướng vàng rực rỡ, chế tạo để đưa cho Cô Bếp Trưởng ở Khu Vui Chơi hoặc làm quà tặng Thầy Cô!',
                rewardDesc: '🎁 Đưa cho Cô Bếp Trưởng nhận Giỏ Mây & Hộp Quà Lễ Hội (+25 Thiện Cảm), hoặc tặng Thầy Cô (+20 Thiện Cảm)!',
                ingredients: [
                    { key: 'banh_cupcake', name: 'Bánh Cupcake Dâu', required: 1, icon: '🧁', iconImg: 'assets/items/banh_cupcake.png', from: 'Khu Vui Chơi' },
                    { key: 'sua_bo_tuoi', name: 'Sữa Bò Tươi TNU', required: 1, icon: '🥛', iconImg: 'assets/items/sua.png', from: 'Quầy Kéo Bò / Hội Chợ' }
                ],
                result: {
                    key: 'hop_banh',
                    amount: 1,
                    iconImg: 'assets/items/qua_tro_choi.png'
                }
            },
            gio_qua_am_thuc: {
                id: 'gio_qua_am_thuc',
                name: 'Giỏ Quà Đại Tiệc Ẩm Thực Lễ Hội',
                isRare: true,
                badge: '🌟 VẬT PHẨM HIẾM ĐẶC BIỆT',
                icon: '🧺',
                iconImg: 'assets/items/gio_qua_am_thuc.png',
                description: 'Tuyệt phẩm lễ hội gói trọn TẤT CẢ sơn hào hải vị ẩm thực hội chợ cùng Giỏ Mây Đựng Quà và Hộp Quà Tết Hoàng Gia nhận từ nhiệm vụ Bếp Trưởng!',
                rewardDesc: '💖 Dâng tặng Thầy/Cô nhận ngay +60 Điểm Thiện Cảm & Pháo hoa rực rỡ!',
                ingredients: [
                    { key: 'mi_tron_trung', name: 'Mì Trộn Trứng Ốp La (Ảnh 1)', required: 1, icon: '🍜', iconImg: 'assets/items/mi_tron_trung.png', from: 'Quầy Hứng Đồ Ăn' },
                    { key: 'com_canh_ga', name: 'Cơm Cánh Gà Rán (Ảnh 2)', required: 1, icon: '🍗', iconImg: 'assets/items/com_canh_ga.png', from: 'Quầy Hứng Đồ Ăn' },
                    { key: 'burger_bo', name: 'Burger Bò Đặc Biệt', required: 1, icon: '🍔', iconImg: 'assets/items/hamburger.png', from: 'Hội Chợ' },
                    { key: 'khoai_tay_chien', name: 'Khoai Tây Chiên Giòn', required: 1, icon: '🍟', iconImg: 'assets/items/khoai_tay_chien.png', from: 'Hội Chợ' },
                    { key: 'banh_cupcake', name: 'Bánh Cupcake Dâu', required: 1, icon: '🧁', iconImg: 'assets/items/banh_cupcake.png', from: 'Hội Chợ' },
                    { key: 'sua_bo_tuoi', name: 'Sữa Bò Tươi TNU', required: 1, icon: '🥛', iconImg: 'assets/items/sua.png', from: 'Quầy Kéo Bò' },
                    { key: 'pho_mai', name: 'Phô Mai Thượng Hạng', required: 1, icon: '🧀', iconImg: 'assets/items/pho_mai.png', from: 'Quầy Kéo Bò' },
                    { key: 'gio_dung', name: 'Giỏ Mây Đựng Quà (Nhiệm Vụ)', required: 1, icon: '🧺', iconImg: 'assets/items/gio_dung.png', isQuest: true, from: 'Nhiệm Vụ Bếp Trưởng' },
                    { key: 'hop_qua_tet', name: 'Hộp Quà Lễ Hội May Mắn (Ảnh 4)', required: 1, icon: '🧧', iconImg: 'assets/items/hop_qua_tet.png', isQuest: true, from: 'Nhiệm Vụ hoặc Chế Tạo' }
                ],
                result: {
                    key: 'gio_qua_am_thuc',
                    amount: 1,
                    iconImg: 'assets/items/gio_qua_am_thuc.png'
                }
            },
            hop_qua_tet: {
                id: 'hop_qua_tet',
                name: 'Hộp Quà Lễ Hội May Mắn (Ảnh 4)',
                isRare: false,
                badge: '🧧 QUÀ TẾT HOÀNG GIA',
                icon: '🧧',
                iconImg: 'assets/items/hop_qua_tet.png',
                description: 'Hộp quà Tết rực rỡ hoa văn hoàng gia, gói trọn hương vị các món đồ ăn vặt thơm ngon hội chợ.',
                rewardDesc: '💖 Dâng tặng nhận +25 Điểm Thiện Cảm hoặc làm nguyên liệu chế tạo Giỏ Quà Hiếm.',
                ingredients: [
                    { key: 'banh_cupcake', name: 'Bánh Cupcake Dâu', required: 1, icon: '🧁', iconImg: 'assets/items/banh_cupcake.png', from: 'Quầy Hứng Đồ Ăn' },
                    { key: 'khoai_tay_chien', name: 'Khoai Tây Chiên Giòn', required: 1, icon: '🍟', iconImg: 'assets/items/khoai_tay_chien.png', from: 'Quầy Hứng Đồ Ăn' },
                    { key: 'burger_bo', name: 'Burger Bò Đặc Biệt', required: 1, icon: '🍔', iconImg: 'assets/items/hamburger.png', from: 'Quầy Hứng Đồ Ăn' },
                    { key: 'sua_bo_tuoi', name: 'Sữa Bò Tươi TNU', required: 1, icon: '🥛', iconImg: 'assets/items/sua.png', from: 'Quầy Kéo Bò' }
                ],
                result: {
                    key: 'hop_qua_tet',
                    amount: 1,
                    iconImg: 'assets/items/hop_qua_tet.png'
                }
            },
            bo_hoa_hong: {
                id: 'bo_hoa_hong',
                name: 'Bó Hoa Hồng Đại Học Tây Nguyên Rực Rỡ',
                isRare: false,
                badge: '💐 HOA TRI ÂN THẦY CÔ',
                icon: '💐',
                iconImg: 'assets/items/flower_bouquet.png',
                description: 'Bó hoa tươi thắm kết hợp 10 bông hồng đỏ thắm, 1 đóa hồng trắng thuần khiết và bọc bằng vỏ gói hoa tinh tế.',
                rewardDesc: '💖 Kính tặng Thầy/Cô nhận ngay +35 Điểm Thiện Cảm!',
                ingredients: [
                    { key: 'hoa_hong', name: 'Hoa Hồng Thường', required: 10, icon: '🌹', iconImg: 'assets/items/rose_red.png', from: 'Vườn Hoa Hồng' },
                    { key: 'hoa_hong_trang', name: 'Hoa Hồng Trắng Hiếm', required: 1, icon: '💮', iconImg: 'assets/items/rose_white.png', from: 'Vườn Hoa Hồng' },
                    { key: 'vo_goi_hoa', name: 'Vỏ Gói Hoa Đặc Biệt', required: 1, icon: '🎀', iconImg: 'assets/items/ribbon_bow.png', from: 'Nhiệm Vụ SV K45' }
                ],
                result: {
                    key: 'bo_hoa_hong',
                    amount: 1,
                    iconImg: 'assets/items/flower_bouquet.png'
                }
            }
        };

        this.selectedRecipeId = 'gio_qua_am_thuc';
    }

    // Giữ tương thích ngược với code cũ gọi .recipe
    get recipe() {
        return this.recipes[this.selectedRecipeId] || this.recipes.bo_hoa_hong;
    }

    set recipe(val) {
        // no-op
    }

    selectRecipe(recipeId) {
        if (this.recipes[recipeId]) {
            this.selectedRecipeId = recipeId;
            return true;
        }
        return false;
    }

    getRecipe(recipeId = null) {
        return this.recipes[recipeId || this.selectedRecipeId] || this.recipes.gio_qua_am_thuc;
    }

    // Kiểm tra xem người chơi có đủ nguyên liệu không
    canCraft(recipeId = null) {
        const r = this.getRecipe(recipeId);
        const inv = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.inventory) || (window.gameState && window.gameState.inventory) || {};
        for (const ing of r.ingredients) {
            if ((inv[ing.key] || 0) < ing.required) {
                return false;
            }
        }
        return true;
    }

    // Lấy thông tin trạng thái chi tiết của từng nguyên liệu
    getIngredientsStatus(recipeId = null) {
        const r = this.getRecipe(recipeId);
        const inv = (window.useGameStore && window.useGameStore.state && window.useGameStore.state.inventory) || (window.gameState && window.gameState.inventory) || {};
        return r.ingredients.map(ing => {
            const current = inv[ing.key] || 0;
            return {
                key: ing.key,
                name: ing.name,
                icon: ing.icon,
                iconImg: ing.iconImg,
                required: ing.required,
                current: current,
                isMet: current >= ing.required,
                isQuest: ing.isQuest || false,
                from: ing.from || ''
            };
        });
    }

    // Thực hiện thao tác gói quà / chế tạo
    craft(recipeId = null) {
        const r = this.getRecipe(recipeId);
        if (!this.canCraft(r.id)) {
            const missing = this.getIngredientsStatus(r.id)
                .filter(i => !i.isMet)
                .map(i => `${i.name} (cần ${i.required}, hiện có ${i.current})`)
                .join(', ');
            return {
                success: false,
                message: `Bạn chưa đủ nguyên liệu để chế tạo [${r.name}]! Còn thiếu: ${missing}`
            };
        }

        // Trừ đúng số lượng nguyên liệu theo công thức
        for (const ing of r.ingredients) {
            if (window.useGameStore && typeof window.useGameStore.removeItem === 'function') {
                window.useGameStore.removeItem(ing.key, ing.required);
            } else if (window.gameState && typeof window.gameState.removeItem === 'function') {
                window.gameState.removeItem(ing.key, ing.required);
            }
        }

        // Cộng vật phẩm kết quả vào túi đồ
        if (window.useGameStore && typeof window.useGameStore.addItem === 'function') {
            window.useGameStore.addItem(r.result.key, r.result.amount);
        } else if (window.gameState && typeof window.gameState.addItem === 'function') {
            window.gameState.addItem(r.result.key, r.result.amount);
        }

        // Thống kê chế tạo
        if (window.useGameStore && typeof window.useGameStore.updateStats === 'function') {
            window.useGameStore.updateStats('itemsCrafted', 1);
        }

        // Âm thanh chúc mừng
        if (window.soundSystem) {
            if (r.isRare && typeof window.soundSystem.playUnlockFanfare === 'function') {
                window.soundSystem.playUnlockFanfare();
            } else if (typeof window.soundSystem.playCraftSuccess === 'function') {
                window.soundSystem.playCraftSuccess();
            }
        }

        // Lưu trạng thái
        if (window.useGameStore && typeof window.useGameStore.saveToStorage === 'function') {
            window.useGameStore.saveToStorage();
        } else if (window.gameState && typeof window.gameState.saveToStorage === 'function') {
            window.gameState.saveToStorage();
        }

        return {
            success: true,
            isRare: r.isRare || false,
            message: `🎉 Chúc mừng bạn đã chế tạo thành công [${r.name}]!`
        };
    }
}

window.craftingManager = new CraftingManager();
