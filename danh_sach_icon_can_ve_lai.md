# 🎨 BẢNG TỔNG HỢP TOÀN BỘ ICON ĐANG VẼ BẰNG CODE CẦN VẼ LẠI THÀNH FILE ẢNH (.PNG)

Tài liệu này cung cấp danh sách đầy đủ tất cả các đồ họa, icon, kiểu tóc và biểu tượng trong game Đại Học Tây Nguyên (TNU) hiện đang **vẽ bằng code hình học Canvas 2D (`ctx.arc`, `ctx.bezierCurveTo`, `ctx.fillRect`)** hoặc **sử dụng ký tự Emoji làm fallback**.

---

## 🖼️ HÌNH ẢNH MINH HỌA TRỰC QUAN CÁC ICON ĐANG VẼ BẰNG CODE
Ảnh tổng hợp trực quan đã được kết xuất sẵn tại:
`assets/ui/preview_cac_icon_can_ve_lai.png`

---

## 📜 PHẦN 1: KẾT QUẢ CẮT VÀ GHÉP THANH THÔNG BÁO HOÀNG GIA RPG (3 MẢNH)

Theo đúng yêu cầu của bạn từ ảnh tải lên:
- **Mảnh trái (Left Cap)**: Huy hiệu gỗ tròn bọc ruy băng vàng hoàng gia.
- **Mảnh giữa (Middle Tube)**: Khung viền kim loại vàng hai mép trên/dưới, lòng banner màu kem — **tự động kéo giãn (stretch) linh hoạt theo đúng độ rộng của chữ**.
- **Mảnh phải (Right Cap)**: Nắp chụp hình trụ vàng bóng bẩy kèm các ngôi sao lấp lánh (sparkles ✨).

### 1. Các file ảnh đã được bóc tách nền trong suốt 100% (Clean Alpha RGBA):
| Tên Mảnh | File Ảnh Dự Án | Kích Thước | Công Dụng |
| :--- | :--- | :--- | :--- |
| **Mảnh trái** | `assets/ui/banner_toast_left.png` | 340 × 200 px | Đầu trang trí bên trái cố định |
| **Mảnh giữa** | `assets/ui/banner_toast_mid.png` | 381 × 200 px | Thân banner kéo giãn theo độ dài chữ |
| **Mảnh phải** | `assets/ui/banner_toast_right.png` | 306 × 200 px | Nắp vàng & tia sáng bên phải cố định |
| **Ảnh ghép mẫu** | `assets/ui/banner_toast_test_stitched.png` | 1046 × 200 px | Mẫu ghép liền mạch không có vết nối |

### 2. Tích hợp trực tiếp vào hệ thống game:
- **CSS Giao diện**: Đã cấu hình class `.rpg-toast-banner`, `.rpg-toast-left`, `.rpg-toast-mid`, `.rpg-toast-right` trong `css/style.css`.
- **Hàm điều khiển**: Cập nhật hàm `showToast(msg, type)` và `showCelebrationBanner(title, desc)` trong `js/ui.js` tự động sinh cấu trúc 3 mảnh flex.
- **Vị trí hiển thị**: Căn chỉnh khay `#toast-container` nằm tại vị trí tiêu điểm giữa màn hình trên cao (`index.html`), kèm hoạt ảnh đáp xuống mượt mà (`toastBannerDropIn`).
- **Trang kiểm thử riêng biệt**: Bạn có thể mở trực tiếp trang `test_banner.html` trên trình duyệt để gõ thử chữ và xem thanh thông báo co giãn thực tế.

---

## 📋 PHẦN 2: DANH SÁCH CHI TIẾT TOÀN BỘ ICON ĐANG DÙNG CODE CẦN VẼ LẠI

### NHÓM 1: CÁC KIỂU TÓC & BIỂU CẢM NHÂN VẬT CHIBI
*(Hiện đang vẽ bằng thuật toán `ctx.arc`, `ctx.bezierCurveTo` trong `js/entities.js: drawHairStyle`)*

| STT | Tên Kiểu Tóc / Chi Tiết | Cách Code Hiện Tại Đang Vẽ | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **Kiểu tóc 1: Mái ngố Chibi vuốt bồng bềnh** | Vòm cung tròn trên trán, rẽ 4 vạt mái nhọn vuốt nhẹ | 64 × 64 px | `assets/hair/hair_0.png` |
| 2 | **Kiểu tóc 2: Tóc dài nữ sinh ngang vai** | Vòm cung đỉnh đầu + 2 vạt tóc dài thả 2 bên má | 64 × 64 px | `assets/hair/hair_1.png` |
| 3 | **Kiểu tóc 3: Tóc búi buộc nơ Chibi** | Búi tóc tròn trên đỉnh đầu + chiếc nơ đỏ xinh xắn | 64 × 64 px | `assets/hair/hair_2.png` |
| 4 | **Kiểu tóc 4: Tóc xù xoăn bồng bềnh Chibi** | 5 khối hình cầu tròn ghép lại tạo mái tóc xoăn phồng | 64 × 64 px | `assets/hair/hair_3.png` |
| 5 | **Kiểu tóc 5: Tóc bím hai bên dễ thương** | Mái tóc Chibi cột 2 bím tóc con 2 bên tai | 64 × 64 px | `assets/hair/hair_4.png` |
| 6 | **Kiểu tóc 6: Tóc ngắn nam sinh thể thao** | Tóc vuốt các chỏm gai nhọn năng động | 64 × 64 px | `assets/hair/hair_5.png` |
| 7 | **Biểu cảm khuôn mặt & Mắt Chibi** | Mắt tròn đen có 2 chấm sáng lấp lánh, má hồng e ấp, mí mắt khi chớp | 48 × 48 px | `assets/characters/chibi_face.png` |
| 8 | **Hiệu ứng sao hành động (Action Sparkles)** | 4 ngôi sao vàng 4 cánh lấp lánh khi tương tác hành động | 32 × 32 px | `assets/effects/action_sparkle.png` |

---

### NHÓM 2: GHIM ĐỊA DANH BẢN ĐỒ (MINIMAP PINS)
*(Hiện đang vẽ bằng hình tròn màu và chữ ký tự Emoji trong `js/minimap.js`)*

| STT | Tên Ghim Địa Danh | Hiện Trạng Trong Code | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 9 | **Ghim Giọt Nước Vị Trí Người Chơi (💧 Player Pin)** | Code Canvas vẽ hình giọt nước xanh gradient xoay theo 4 hướng | 48 × 48 px | `assets/ui/pin_player_waterdrop.png` |
| 10 | **Ghim: Cây Ước Nguyện 20/11** | Chấm tròn tím đỏ `#ff0054` + Emoji `✨` | 40 × 40 px | `assets/ui/pin_wishing_tree.png` |
| 11 | **Ghim: Bảng Ước Nguyện Tri Ân** | Chấm tròn cam `#f77f00` + Emoji `📋` | 40 × 40 px | `assets/ui/pin_wishing_board.png` |
| 12 | **Ghim: Tòa Nhà Điều Hành TNU** | Chấm tròn vàng cam `#f39c12` + Emoji `🏛️` | 40 × 40 px | `assets/ui/pin_admin.png` |
| 13 | **Ghim: Hồ Tự Do & Căn Tin Đảo** | Chấm tròn xanh lơ `#00b4d8` + Emoji `🏞️` | 40 × 40 px | `assets/ui/pin_lake.png` |
| 14 | **Ghim: Sân Vận Động TNU** | Chấm tròn xanh ngọc `#2a9d8f` + Emoji `⚽` | 40 × 40 px | `assets/ui/pin_stadium.png` |
| 15 | **Ghim: Nhà Thi Đấu Đa Năng** | Chấm tròn xanh dương `#457b9d` + Emoji `🏟️` | 40 × 40 px | `assets/ui/pin_sports_hall.png` |
| 16 | **Ghim: Nhà Học Số 2 (Khoa Nông Lâm)** | Chấm tròn cam đất `#e76f51` + Emoji `🏢` | 40 × 40 px | `assets/ui/pin_house2.png` |
| 17 | **Ghim: Thư Viện Trung Tâm TNU** | Chấm tròn tím hoàng gia `#9b5de5` + Emoji `📖` | 40 × 40 px | `assets/ui/pin_library.png` |
| 18 | **Ghim: Giảng Đường Trung Tâm 400** | Chấm tròn đỏ tươi `#d90429` + Emoji `🏛️` | 40 × 40 px | `assets/ui/pin_hall400.png` |
| 19 | **Ghim: Cụm Giảng Đường Số 7-8-9** | Chấm tròn nâu vàng `#d4a373` + Emoji `🏫` | 40 × 40 px | `assets/ui/pin_house7.png` |

---

### NHÓM 3: KHU VƯỜN HOA TÂY NGUYÊN (ROSE GARDEN)
*(Các tài nguyên ô đất và quầy chợ trong `js/rose_garden.js` đang thiếu file ảnh nên phải vẽ bằng code hình học)*

| STT | Tên Đối Tượng Vườn Hoa | Hiện Trạng Trong Code | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 20 | **Ụ Đất Trống (Chưa Gieo Hạt)** | Ellipse màu nâu xới đất tơi xốp `#6f4e37` | 64 × 44 px | `assets/rose_garden/soil_empty.png` |
| 21 | **Ụ Đất Đã Tưới Nước** | Ellipse màu nâu đậm ẩm ướt `#3d2817` có vệt bóng nước | 64 × 44 px | `assets/rose_garden/soil_watered.png` |
| 22 | **Mầm Cây Non Mới Nhú** | Hai cành mầm xanh non vươn lên từ mặt đất | 48 × 48 px | `assets/rose_garden/sprout.png` |
| 23 | **Nụ Hoa Hồng E Ấp** | Đài hoa xanh bọc quanh nụ hồng đỏ sắp nở | 48 × 48 px | `assets/rose_garden/bud.png` |
| 24 | **Quầy Bán Hạt Giống Hoa (Cô Mai)** | Khung quầy gỗ mái bạt sọc đỏ trắng vintage | 96 × 96 px | `assets/rose_garden/seed_shop.png` |
| 25 | **Quầy Nông Cụ Làm Vườn (Bác Nông Dân)** | Quầy thợ mộc có giá treo cuốc xẻng, bình tưới | 96 × 96 px | `assets/rose_garden/tool_shop.png` |
| 26 | **Biển Gỗ Ghi Tên Ô Đất (Plot Badge)** | Bảng gỗ nhỏ hình chữ nhật bo góc cắm cọc | 48 × 24 px | `assets/rose_garden/wood_plot_badge.png` |

---

### NHÓM 4: CÂY ƯỚC NGUYỆN & BẢNG THIỆP CHÚC 20/11
*(Vật phẩm văn hóa học đường trong `js/wishing_tree.js`)*

| STT | Tên Vật Phẩm | Hiện Trạng Trong Code | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 27 | **Dải Lụa / Thẻ Ước Nguyện Đỏ May Mắn** | Dải lụa đỏ uốn lượn thắt nơ vàng treo cành cây | 36 × 72 px | `assets/items/wishing_tag_red.png` |
| 28 | **Dải Lụa / Thẻ Ước Nguyện Vàng Hoàng Gia** | Dải lụa vàng óng ánh gắn quả chuông đồng nhỏ | 36 × 72 px | `assets/items/wishing_tag_gold.png` |
| 29 | **Mảnh Giấy Note Lời Chúc (4 Màu)** | Giấy ghi chú gấp góc kiểu Post-it vintage (Vàng, Hồng, Lam, Xanh) | 48 × 48 px | `assets/items/wishing_note_paper.png` |

---

### NHÓM 5: KHU TRÒ CHƠI & MINIGAMES (KÉO BÒ & BẮN SÚNG)
*(Các hiệu ứng và kỹ năng tương tác trong `js/minigames.js`)*

| STT | Tên Chi Tiết / Icon Kỹ Năng | Hiện Trạng Trong Code | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 30 | **Thòng Lọng Cao Bồi (Lasso Loop & Rope)** | Vòng dây thừng xoay tít trên không & sợi dây kéo căng | 64 × 64 px | `assets/cow_game/lasso_rope.png` |
| 31 | **Vòng Tâm Ngắm Giằng Co (Struggle Meter)** | Vòng tròn lực kéo màu xanh/đỏ báo hiệu độ căng | 80 × 80 px | `assets/cow_game/struggle_meter.png` |
| 32 | **Khiên Năng Lượng Ma Thuật (Energy Shield)** | Vòng hào quang năng lượng phát sáng xoay quanh người | 80 × 80 px | `assets/minigames/energy_shield.png` |
| 33 | **Đạn / Cầu Lửa Ma Thuật (Magic Projectile)** | Quả cầu lửa/năng lượng phóng ra khi ngắm bắn bia | 48 × 48 px | `assets/minigames/magic_projectile.png` |

---

### NHÓM 6: VẬT PHẨM BALO & GIAO DIỆN DÙNG EMOJI LÀM FALLBACK
*(Các icon túi đồ khi mở balo hoặc nhận thưởng nhiệm vụ)*

| STT | Tên Vật Phẩm / Icon | Hiện Trạng Trong Code | Kích Thước Vẽ Khuyến Nghị | File Đích Cần Lưu |
| :---: | :--- | :--- | :---: | :--- |
| 34 | **Trang Tài Liệu Đồ Án K45** | Đang có fallback emoji `📜` trên sân trường | 48 × 48 px | `assets/items/campus_document.png` |
| 35 | **Bình Tưới Nước Vườn Hoa** | Đang dùng emoji `💧` / `🫖` trong bảng nông cụ | 64 × 64 px | `assets/items/binh_tuoi_nuoc.png` |
| 36 | **Bao Phân Bón Vi Sinh Kích Nở Hoa** | Đang dùng emoji `🧪` / `📦` trong túi đồ | 64 × 64 px | `assets/items/phan_bon.png` |
| 37 | **Đồng Xu Sinh Viên TNU (Tiền tệ chính)** | Đang dùng emoji `🪙` / `🟡` ở các đoạn thoại | 48 × 48 px | `assets/items/dong_xu_tnu.png` |
| 38 | **Huy Hiệu Trái Tim Thiện Cảm** | Đang dùng emoji `💖` / `★` ở thanh tiến độ | 48 × 48 px | `assets/items/huy_hieu_thien_cam.png` |
