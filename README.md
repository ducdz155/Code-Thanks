# 🏫 TNU: ĐÔI CÁNH ĐẠI NGÀN (WINGS OF THE HIGHLANDS) 🪽
### *Social Hangout Đại Học Tây Nguyên - Phiên Bản 10 Loại Cánh, Chuẩn Sơ Đồ Trường, Tủ Đồ Nhiệm Vụ & Minigame*

Dự án Web App **TNU: Đôi Cánh Đại Ngàn** kết hợp đồ họa 2D/3D hiện đại, lấy bối cảnh thực tế tại **Trường Đại học Tây Nguyên (567 Lê Duẩn, TP. Buôn Ma Thuột, Tỉnh Đắk Lắk)** theo chuẩn sơ đồ quy hoạch, ảnh vệ tinh Google Maps và hình ảnh thực tế.

---

## 🚀 CÔNG NGHỆ ÁP DỤNG (TECH STACK)
- **Three.js & Canvas 2D/3D:** Vẽ khuôn viên trường, hiệu ứng nước gợn sóng, mặt cỏ sân bóng, nhân vật Chibi và 10 loại cánh bay.
- **Zustand Reactive Store:** Quản lý tập trung `useGameStore` (Inventory, Wardrobe Unlocks, Quests, Affection 0-100, Settings). Tự động lưu và đồng bộ LocalStorage.
- **Nipple.js:** Cần điều khiển cảm ứng ảo (Virtual Touch Joystick) 360 độ góc dưới bên trái, tối ưu cho Mobile, Tablet và Desktop.
- **Tailwind CSS & Framer Motion Style:** Giao diện HUD Glassmorphism cao cấp, bo góc mượt, hiệu ứng đổ bóng neon và animation trượt mở modal êm dịu.
- **Agency i18n (Bilingual System):** Hỗ trợ song ngữ **Tiếng Việt 🇻🇳 & English 🇬🇧** chuyển đổi tức thì không cần reload trang.
- **Web Audio API Synthesizer:** Âm thanh SFX và nhạc nền BGM độc lập, chạy offline 100%.

---

## 🗺️ BẢN ĐỒ CHUẨN SƠ ĐỒ TRƯỜNG ĐH TÂY NGUYÊN
Bản đồ được số hóa chính xác từ sơ đồ nhà trường (`media_1794733976884_2eb28a61.jpg`), ảnh vệ tinh (`media_1794734090723_664ec014.jpg`) và ảnh thực tế (`media_1794734155384_56b8f448.jpg`):

1. **Cổng Chính 567 Lê Duẩn (QL14):** Lối vào chính hướng Tây Bắc với bốt bảo vệ và biển trường uy nghi.
2. **Tòa Nhà Hiệu Bộ (Nhà Điều Hành 7 Tầng):** Tòa nhà trung tâm đồ sộ màu vàng kem, mái ngói vát đỏ nâu, biển hiệu *"TRƯỜNG ĐẠI HỌC TÂY NGUYÊN"*.
3. **Biển Chữ 3D "I ❤️ TAY NGUYEN UNIVERSITY":** Đặt trang trọng trên bồn hoa tròn phía trước Tòa Hiệu Bộ (giống ảnh thực tế 100%).
4. **Hồ Nước Sinh Thái TNU & Cầu Gỗ Ngắm Cảnh:** Hồ nước xanh ngọc uốn lượn tự nhiên bên cạnh **Nhà số 7 (Thư viện Trung Tâm)** và **Nhà số 8**, có cầu gỗ nối sang đảo hoa và chòi bát giác.
5. **Các Khối Giảng Đường Học Thuật:**
   - **Nhà số 7:** Thư viện Trung Tâm TNU (3 tầng).
   - **Nhà số 8:** Giảng đường Khoa học Tự nhiên.
   - **Nhà số 9:** Khoa Sư Phạm.
   - **Nhà số 10:** Phòng Thí Nghiệm & Nghiên Cứu.
   - **Nhà số 2:** Khoa Nông Lâm & Khoa Y Dược.
   - **Nhà số 5 & Nhà số 6:** Dãy Giảng Đường Lý Thuyết & CNTT.
6. **Nhà Thi Đấu Đa Năng TNU:** Khu liên hợp thể thao trong nhà.
7. **Sân Vận Động Trường ĐH Tây Nguyên:** Sân cỏ bóng đá tiêu chuẩn có vạch kẻ, khung thành và **đường pitch điền kinh màu đỏ cam** bao quanh hình bầu dục như ảnh vệ tinh.
8. **Khu Ký Túc Xá & Đời Sống:**
   - KTX Du học sinh Lào & Campuchia.
   - KTX Nam.
   - KTX Nữ & Căn tin Sinh Viên.
   - Trung tâm Giáo Dục Quốc Phòng và An Ninh (GDQP-AN).
   - Trường THPT Thực Hành Cao Nguyên.
   - Cổng phụ đường Y Wang ở góc Đông Nam.

---

## 🪽 HỆ THỐNG 10 LOẠI CÁNH & CƠ CHẾ VỖ CÁNH (FLAPPING ANIMATION)
10 loại cánh được vẽ chi tiết theo bản mẫu của người dùng (`media_1794733815472_3b0e6f33.jpg`), vỗ quanh trục pivot (Left `+a`, Right `-a`):

| ID Cánh | Tên Cánh (Tiếng Việt) | Name (English) | Hiệu Ứng Hạt | Điều Kiện Mở Khóa (Quest / Milestone) |
|---|---|---|---|---|
| `wing_fairy` | **Cánh Tiên Lam Ngọc** | Fairy Pixie Wings | Bụi sao tím lam | Hái đủ 10 đóa Hoa Hồng tại Vườn hoa |
| `wing_angel` | **Cánh Thiên Thần Ánh Kim** | Holy Angel Wings | Lông vũ & Hào quang | Đạt mốc **100 Điểm Thiện Cảm** với Thầy Cô |
| `wing_bat` | **Cánh Dơi Huyền Bí** | Shadow Bat Wings | Khói tím ma mị | Đạt **80+ Điểm** tại Quầy Bắn Súng Hội Chợ |
| `wing_butterfly` | **Cánh Bướm Hồng Phấn** | Flora Butterfly Wings | Phấn hoa hồng rơi | Hái được đóa **Hoa Hồng Trắng Quý Hiếm** |
| `wing_leaf` | **Cánh Lá Non Sinh Thái** | Verdant Leaf Wings | Mầm xanh thảo mộc | Ghé thăm **Nhà số 2 - Khoa Nông Lâm** |
| `wing_cloud` | **Cánh Mây Bồng Bềnh** | Fluffy Nimbus Wings | Sương mù mờ ảo | Dạo bước qua **Cầu Gỗ Hồ Nước Sinh Thái** |
| `wing_flame` | **Cánh Lửa Phượng Hoàng** | Blazing Phoenix Wings | Đốm than hồng rực | Thắng **3 lượt liên tiếp** tại Máy Gắp Thú |
| `wing_crystal` | **Cánh Băng Pha Lê** | Frost Crystal Wings | Tinh thể tuyết lam | Giúp SV K45 tìm lại **3 trang Đồ Án Tốt Nghiệp** |
| `wing_star` | **Cánh Sao Băng Vũ Trụ** | Meteor Astral Wings | Vệt sao băng vàng | Chạy hoàn thành **1 vòng Sân Vận Động TNU** |
| `wing_dragon` | **Cánh Rồng Lục Bảo** | Emerald Dragon Wings | Hào quang rồng ngọc | **Thủ Lĩnh Học Đường**: Đạt 100 Thiện cảm & làm hết đồ án |

---

## 👗 TỦ ĐỒ THỜI TRANG & DIỆN MẠO (WARDROBE SYSTEM)
- **Tab 1: 🪽 Cánh Bay Frames:** Toàn bộ cánh frame animation (Cánh Cơ Giới Hexagon 14 frames, Cánh Thiên Thần Nơ Hồng 3 frames) cùng các loại cánh thần thoại.
- **Tab 2: 🐾 Thú Cưng Frames (Companion Pets):** 35 bộ thần thú đi theo người chơi chuyển động cực mượt (Cáo Vàng Kim Hồ, Hỏa Kỳ Lân, Hắc Long Vương, Bạch Tuyết Cửu Vĩ, Lôi Thú Hoàng Kim, Huyết Lân Ma Thú, Băng Tuyết Tinh Linh, Viêm Hỏa Long Vương, Thổ Khuyển Linh Thú, Cơ Giáp Hộ Vệ, Thanh Long Thần Xà, Hoa Linh Tinh Nữ, Bạch Ngân Cổ Long, Cổ Tháp Phù Điêu, Anh Đào Linh Hồ, Tinh Vân Thần Ưng, Anh Đào Thỏ Ngọc, Hoàng Kim Hổ Con, Ngân Nguyệt Cửu Vĩ, Dạ Hành Thần Điêu, Xích Hỏa Sư Điêu, Nham Thạch Sư Điêu, Kim Sí Thần Phụng, Dung Nham Cự Thú, Kim Giác Lôi Thú, Quang Minh Tinh Linh, U Hồn Hắc Lang, Huyết Long Thần Thú, Thương Hải Thần Long, Hồng Điệp Tiên Linh, Bảo Trúc Linh Miêu, Thái Cổ Long Thần, Bạch Ngân Báo Thần, Lam Tinh Sứ Giả 7 frames, Xích Kim Thần Thú 4 frames), quản lý bằng bảng SQL `pets_schema.sql` và `PetSQLDatabase`, tự động preload texture và xoay hướng nhìn linh hoạt.
- **Tab 3: 👔 Trang Phục (Hỗ trợ 6 Bộ Frame Anime 12 Frames Độc Quyền):**
  1. *Chiến Binh Cổ Đại (Set 1) - ⚡ 12 FRAMES:* Bộ dũng sĩ cổ đại từ `body/1.jpg` với áo choàng da nâu, vòng cổ và thắt lưng hoàng kim.
  2. *Váy Dạ Hội Hoàng Gia (Set 2) - ⚡ 12 FRAMES:* Váy dạ hội công chúa từ `body/2.jpg` với đầm dạ hội xanh thẫm, ren trắng, chuỗi ngọc trai và găng tay tiểu thư.
  3. *Blazer Mùa Hè Năng Động (Set 3) - ⚡ 12 FRAMES:* Trang phục thể thao trẻ trung từ `body/3.jpg` với áo blazer trắng khoác ngoài, áo thun xanh và giày sneaker.
  4. *Áo Choàng Giáng Sinh Noel (Set 4) - ⚡ 12 FRAMES:* Bộ áo choàng đỏ viền lông tuyết từ `body/4.jpg` đính bông len tinh nghịch và bốt mùa đông.
  5. *Trang Phục Nữ Thần Rừng (Set 5) - ⚡ 12 FRAMES:* Xiêm y ngọc lục bảo từ `body/5.jpg` gắn sừng vàng hộ vệ thiên nhiên và áo choàng đại ngàn.
  6. *Chiến Binh Hoàng Gia (Set 1000) - ⚡ 12 FRAMES:* Bộ trang phục hiệp sĩ hoàng tộc từ `body/1000.jpg` với áo choàng trắng viền vàng kim quý tộc.
  7. *Đồng Phục TNU Năng Động* (Mặc định).
  8. *Áo Dài Truyền Thống Nữ Sinh* (Mở khi đạt 35 điểm thiện cảm).
  9. *Áo Blouse Bác Sĩ TNU* (Mở khi đạt 70 điểm thiện cảm).
  10. *Lễ Phục Cử Nhân Tốt Nghiệp* (Mở khi đạt 100 điểm thiện cảm).
  11. *Trang Phục Thổ Cẩm Tây Nguyên* (Trang phục truyền thống đại ngàn).
- **Tab 4: 👑 Kiểu Đầu Frames (Dragon Boy & Chibi Anime 4 Hướng):**
  1. *Kiểu Đầu Videl Song Bính (Dragon Boy):* 4 hướng (`9390.png` thẳng, `9391.png` phải/trái lật gương, `9392.png` nhìn đằng sau).
  2. *Tiểu Thư Tóc Vàng Nơ Xanh (Quý Tộc):* 4 hướng (`17784.png` thẳng, `17785.png` phải/trái, `17786.png` nhìn đằng sau).
  3. *Chiến Binh Vương Miện Vàng (Hoàng Tử):* 4 hướng (`21714.png` thẳng, `21715.png` phải/trái, `21716.png` nhìn đằng sau).
  - Tọa độ đầu được căn chỉnh chuẩn xác (`dy: -52` đến `-70`) để cằm nhân vật nằm vừa vặn trên mép cổ áo, để lộ trọn vẹn cổ, ngực và chi tiết áo. Bảng tên danh hiệu được nâng cao lên `y = -98` tạo khoảng trống thoáng đãng trên đỉnh vương miện.
  - Quản lý qua bảng SQL `heads_schema.sql` & `js/head_db.js` với GPU texture preloading, hỗ trợ chuyển đổi mượt mà giữa các kiểu đầu và đầu Chibi tùy biến màu tóc.
- **Live 3D Character Preview:** Bục quay thời trang xoay 360 độ hiển thị nhân vật vỗ cánh, thần thú Pet và Kiểu Đầu Frame 4 hướng (kể cả nhìn đằng sau) theo thời gian thực!

---

## 🎮 HƯỚNG DẪN KHỞI CHẠY (HOW TO RUN)

### Cách 1: Mở Trực Tiếp (Không Cần Cài Đặt)
- Chỉ cần nhấp đúp mở file `index.html` trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).
- Toàn bộ thư viện đã được nhúng sẵn cục bộ trong thư mục `vendor/` đảm bảo chạy mượt 100% kể cả khi không có kết nối Internet!

### Cách 2: Chạy Server Phát Triển (Vite / Node.js)
```bash
cd D:\Cntt
npm install
npm run dev
```

---

## 🕹️ PHÍM ĐIỀU KHIỂN
- **Di chuyển:** Phím `W`, `A`, `S`, `D` hoặc `Phím Mũi Tên`.
- **Cảm ứng (Mobile / Tablet):** Sử dụng cần điều khiển ảo **Virtual Touch Joystick** ở góc dưới bên trái màn hình.
- **Tương tác:** Phím `E` hoặc `Space` (Trò chuyện NPC, hái hoa hồng, nhặt đồ án, chơi game).
- **Phím tắt nhanh:**
  - `C`: Mở Tủ Đồ Thời Trang & 10 Loại Cánh.
  - `G`: Mở Bàn Gói Quà.
  - `Q`: Mở Bảng Nhiệm Vụ Sinh Viên.
  - `ESC`: Đóng các cửa sổ giao diện.
