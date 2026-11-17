# 🌐 HƯỚNG DẪN ĐƯA GAME LÊN HOSTING ONLINE ĐỂ MỌI NGƯỜI CHƠI CHUNG

Dự án **TNU: Đôi Cánh Đại Ngàn (Đại Học Tây Nguyên)** đã được nâng cấp toàn diện hệ thống **Real-time Online Multiplayer** qua WebSocket và Node.js. 

Khi đưa lên hosting, tất cả người chơi ở khắp mọi nơi truy cập vào đường link đều sẽ:
- 🏃‍♂️ Thấy nhau di chuyển theo thời gian thực (60 FPS mượt mà có cơ chế chống giật LERP).
- 🪽 Thấy trang phục, 10 bộ cánh bay, kiểu tóc và Thần thú Pet đi theo của nhau.
- 💬 Chat trực tiếp với nhau (hiện cả trong khung chat và bong bóng thoại trên đầu nhân vật).
- 💌 Thấy và thả tim lời chúc 20/11 của nhau trên Bảng Ước Nguyện theo thời gian thực.
- 🗺️ Thấy vị trí của bạn bè hiển thị trên Minimap toàn trường.

---

## CÁCH 1: Triển khai MIỄN PHÍ lên RENDER.COM (Khuyên Dùng - Nhanh nhất, 2 phút)

Render hỗ trợ Node.js Web Service và WebSocket hoàn toàn miễn phí, có sẵn HTTPS và WSS.

### Các bước thực hiện:
1. **Đưa mã nguồn lên GitHub:**
   - Tạo một repository trên [GitHub](https://github.com/) (ví dụ: `tnu-adventure`).
   - Mở terminal trong thư mục `D:\Cntt` và chạy:
     ```bash
     git init
     git add .
     git commit -m "Update TNU: Đôi Cánh Đại Ngàn Online Multiplayer"
     git branch -M main
     git remote add origin <URL_GITHUB_CUA_BAN>
     git push -u origin main
     ```
2. **Tạo Web Service trên Render:**
   - Đăng nhập vào [Render.com](https://render.com/).
   - Bấm **New +** -> Chọn **Web Service**.
   - Chọn kho GitHub `tnu-adventure` của bạn.
   - Render sẽ tự động đọc file `render.yaml` hoặc cấu hình như sau:
     - **Name:** `tnu-adventure`
     - **Region:** Singapore (để mạng ping nhanh nhất cho Việt Nam)
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Instance Type:** `Free`
3. **Bấm "Deploy Web Service":**
   - Đợi khoảng 1-2 phút, Render sẽ cấp cho bạn một đường link trực tuyến (ví dụ: `https://tnu-adventure.onrender.com`).
   - Gửi đường link này cho bạn bè hoặc đăng lên nhóm lớp/trường, mọi người mở trên điện thoại, máy tính là vào chơi chung ngay lập tức!

---

## CÁCH 2: Triển khai lên RAILWAY.APP

1. Đăng nhập [Railway.app](https://railway.app/).
2. Bấm **New Project** -> Chọn **Deploy from GitHub repo**.
3. Chọn repo `tnu-adventure`. Railway tự động nhận diện `Procfile` / `server.js`.
4. Vào mục **Settings** -> **Generate Domain** để nhận link công khai.

---

## CÁCH 3: Triển khai lên MÁY CHỦ RIÊNG (VPS Ubuntu / Debian)

Nếu trường hoặc bạn có VPS riêng:
1. Cài đặt Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Tải mã nguồn về VPS và cài đặt:
   ```bash
   cd /var/www/tnu-game
   npm install
   ```
3. Chạy nền vĩnh viễn với PM2:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "tnu-adventure"
   pm2 startup
   pm2 save
   ```
4. Cấu hình Nginx chuyển hướng cổng 80/443 vào cổng 8088 (hỗ trợ nâng cấp WebSocket `Upgrade` và `Connection`).

---

## CÁCH 4: Chạy thử nghiệm Online qua NGROK hoặc CLOUDFLARE TUNNEL (Không cần up code)

Nếu bạn muốn mở máy tính của mình cho bạn bè vào chơi thử ngay lập tức mà không cần up code lên web:
1. Chạy server trên máy:
   ```bash
   npm start
   ```
2. Dùng Cloudflare Tunnel (Miễn phí, không cần đăng ký):
   - Tải `cloudflared.exe` và chạy:
     ```bash
     cloudflared tunnel --url http://localhost:8088
     ```
   - Cloudflare sẽ tạo 1 link tạm dạng `https://xxxx.trycloudflare.com`. Gửi link đó cho bất kỳ ai là họ vào chơi được ngay cùng bạn!

---

## 🛠️ CÁC THƯ VIỆN & CẤU TRÚC ĐÃ ĐƯỢC TỐI ƯU SẴN
- `server.js`: Máy chủ HTTP & WebSocket tối ưu, hỗ trợ tải file, audio streaming, phòng chơi theo từng map.
- `js/network.js`: Bộ điều khiển mạng Client, tự động phát hiện `ws://` / `wss://`, cơ chế tự kết nối lại, bù lag LERP.
- `data/wishes.json`: Lưu trữ bền vững các lời chúc 20/11 gửi tới Thầy Cô giáo.
