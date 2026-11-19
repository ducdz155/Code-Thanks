/**
 * ====================================================================
 * 📖 TNU ADVENTURE: CUỐN SÁCH TRI ÂN 20/11 - TRƯỜNG ĐẠI HỌC TÂY NGUYÊN
 * ====================================================================
 * - Hiệu ứng lật sách 3D chân thực (Realistic Dual-Face 3D Page Flip):
 *   + Tự động xoay trang 3D có độ cong, đổ bóng động và âm thanh xào xạc.
 * - Nội dung văn bản đặt trực tiếp vừa khít trong các cuộn giấy nền:
 *   + Trang 2: Khớp 100% hai cuộn giấy vẽ sẵn trên nền (không dùng hộp thẻ màu trắng/be).
 *   + Trang 3: Lồng ảnh thực tế ngày 20/11 TNU vào khung polaroid, chữ phấn bảng xanh,
 *              vùng ánh sáng kỳ ảo chứa tâm tư và nút nhận quà tri ân.
 * - Sử dụng icon game chuẩn từ thư mục assets/ui/icons/.
 * - Cuốn sách lơ lửng bồng bềnh tại bãi cỏ Map 1 (x: 1960, y: 2985).
 */

(function(window) {
    'use strict';

    class TributeBookManager {
        constructor() {
            this.isOpen = false;
            this.currentPage = 0; // 0: Bìa, 1: Trang Đôi 1, 2: Trang Đôi 2, 3: Trang Đôi 3
            this.totalPages = 3;
            this.isFlipping = false;
            this.globalTime = 0;

            // Vị trí cuốn sách trên Bản đồ Map 1
            this.worldX = 1960;
            this.worldY = 2985;
            this.worldRadius = 75;

            // Ảnh bìa siêu nhẹ để vẽ cuốn sách trong thế giới game (load tức thì < 10ms)
            this.coverImg = new Image();
            this.coverImg.src = 'assets/book/book_world_icon.png';

            // Tiền tải ngầm toàn bộ 4 trang sách chất lượng cao vào bộ nhớ đệm
            ['assets/book_cover.png?v=20261119_3', 'assets/page_1.png?v=20261119_3', 'assets/page_2.png?v=20261119_3', 'assets/page_3.png?v=20261119_3'].forEach(src => {
                const preImg = new Image();
                preImg.src = src;
            });

            // Trạng thái nhận quà tri ân
            const savedGift = localStorage.getItem('tnu_tribute_book_gift_claimed');
            this.hasClaimedGift = (savedGift === 'true');

            // Hạt lơ lửng trang trí trên sách
            this.particles = [];
            this.initParticles();

            // Web Audio API
            this.audioCtx = null;

            // Inject Modal vào DOM
            this.ensureModalDOM();

            // Lắng nghe bàn phím
            this.setupKeyboard();
        }

        initParticles() {
            const icons = ['✨', '🌸', '🌟', '🍂', '💫', '💖'];
            this.particles = [];
            for (let i = 0; i < 16; i++) {
                this.particles.push({
                    x: Math.random() * 95,
                    y: Math.random() * 90,
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    size: 13 + Math.random() * 11,
                    duration: 4.5 + Math.random() * 4,
                    delay: Math.random() * 4
                });
            }
        }

        playPaperFlipSound() {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtxClass) return;
                if (!this.audioCtx) {
                    this.audioCtx = new AudioCtxClass();
                }
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }

                const ctx = this.audioCtx;
                const bufferSize = Math.floor(ctx.sampleRate * 0.32);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);

                // Âm thanh sột soạt lật trang giấy tự nhiên
                for (let i = 0; i < bufferSize; i++) {
                    const decay = Math.exp(-i / (ctx.sampleRate * 0.09));
                    data[i] = (Math.random() * 2 - 1) * decay;
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1550, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.28);
                filter.Q.setValueAtTime(2.4, ctx.currentTime);

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.42, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.30);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                noise.start();
            } catch (err) {
                console.warn('Audio flip error:', err);
            }
        }

        ensureModalDOM() {
            if (document.getElementById('tribute-book-modal')) return;

            const modal = document.createElement('div');
            modal.id = 'tribute-book-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="tribute-book-viewport">
                    <!-- Nút đóng góc trên -->
                    <div class="tribute-book-top-bar">
                        <div class="flex items-center gap-2">
                            <img src="assets/ui/icons/flower_normal.png" class="w-5 h-5 object-contain" alt="20/11" />
                            <span class="font-extrabold tracking-wide text-xs sm:text-sm">CUỐN SÁCH TRI ÂN 20/11 — TRƯỜNG ĐẠI HỌC TÂY NGUYÊN</span>
                        </div>
                        <button class="tribute-book-close-btn" onclick="window.tributeBookManager.closeBook()" title="Đóng Sách [Esc]">&times;</button>
                    </div>

                    <!-- Khung sách 3D (3D Page-Flip Container) -->
                    <div class="tribute-book-wrap" id="tribute-book-wrap">
                        <!-- Gáy sách trung tâm & Đổ bóng hai trang -->
                        <div class="tribute-book-spine" id="tribute-book-spine"></div>
                        <div class="tribute-book-gutter-shadow" id="tribute-book-gutter"></div>

                        <!-- Vùng bấm mép trang trái / phải để lật trực tiếp (Đã xóa popup che chữ) -->
                        <div class="book-edge-hotspot book-edge-left" id="hotspot-left" onclick="window.tributeBookManager.prevPage()" title="Lật về trang trước"></div>
                        <div class="book-edge-hotspot book-edge-right" id="hotspot-right" onclick="window.tributeBookManager.nextPage()" title="Lật sang trang sau"></div>

                        <!-- Container chứa nội dung trang hiện tại -->
                        <div id="tribute-book-content" class="w-full h-full relative">
                            <!-- Injected dynamically -->
                        </div>

                        <!-- Hạt bay trang trí (Stars & Petals) -->
                        <div id="tribute-particles-container" class="absolute inset-0 pointer-events-none overflow-hidden">
                        </div>
                    </div>

                    <!-- Thanh điều khiển trang dưới chân sách màu Be vintage ấm cúng -->
                    <div class="tribute-book-control-bar">
                        <!-- Nút trang trước -->
                        <button id="book-btn-prev" class="tribute-book-nav-btn" onclick="window.tributeBookManager.prevPage()">
                            <img src="assets/ui/icons/scroll_normal.png" class="w-4 h-4 object-contain inline-block" />
                            <span>Trang Trước</span>
                        </button>

                        <!-- Chỉ số trang & Các chấm vàng -->
                        <div class="tribute-book-page-pill">
                            <span id="book-page-label" class="tribute-book-page-text">Trang Bìa</span>
                            <div class="flex items-center gap-2" id="book-indicator-dots">
                                <span class="tribute-book-dot active cursor-pointer hover:scale-125" onclick="window.tributeBookManager.goToPage(0)" title="Trang Bìa"></span>
                                <span class="tribute-book-dot cursor-pointer hover:scale-125" onclick="window.tributeBookManager.goToPage(1)" title="Trang 1: Hành Trình"></span>
                                <span class="tribute-book-dot cursor-pointer hover:scale-125" onclick="window.tributeBookManager.goToPage(2)" title="Trang 2: Bài Học Đầu Tiên"></span>
                                <span class="tribute-book-dot cursor-pointer hover:scale-125" onclick="window.tributeBookManager.goToPage(3)" title="Trang 3: Ký Ức & Tri Ân"></span>
                            </div>
                        </div>

                        <!-- Nút trang sau -->
                        <button id="book-btn-next" class="tribute-book-nav-btn" onclick="window.tributeBookManager.nextPage()">
                            <span>Trang Sau</span>
                            <img src="assets/ui/icons/scroll_normal.png" class="w-4 h-4 object-contain inline-block" />
                        </button>
                    </div>
                </div>
            `;

            // Click ra ngoài modal để đóng
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeBook();
                }
            });

            document.body.appendChild(modal);

            // Render các hạt bay
            const pContainer = document.getElementById('tribute-particles-container');
            if (pContainer) {
                pContainer.innerHTML = this.particles.map(p => `
                    <div class="tribute-floating-particle" style="left: ${p.x}%; top: ${p.y}%; font-size: ${p.size}px; animation-duration: ${p.duration}s; animation-delay: ${p.delay}s;">
                        ${p.icon}
                    </div>
                `).join('');
            }
        }

        setupKeyboard() {
            window.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                    e.preventDefault();
                    this.nextPage();
                } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    this.prevPage();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeBook();
                }
            });
        }

        openBook(startPage = 0) {
            this.ensureModalDOM();
            const modal = document.getElementById('tribute-book-modal');
            if (!modal) return;

            this.isOpen = true;
            this.currentPage = startPage;
            this.isFlipping = false;

            this.renderPageContent();

            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.classList.add('modal-visible');

            if (window.uiManager) {
                window.uiManager.activeModal = modal;
            }

            if (window.soundSystem && typeof window.soundSystem.playModalOpen === 'function') {
                window.soundSystem.playModalOpen();
            }
            this.playPaperFlipSound();
        }

        closeBook() {
            const modal = document.getElementById('tribute-book-modal');
            if (modal) {
                modal.classList.remove('active');
                modal.classList.remove('modal-visible');
                modal.style.display = 'none';
            }
            if (window.uiManager && modal && window.uiManager.activeModal === modal) {
                window.uiManager.activeModal = null;
            }
            this.isOpen = false;
            this.isFlipping = false;

            if (window.soundSystem && typeof window.soundSystem.playStep === 'function') {
                window.soundSystem.playStep();
            }
        }

        nextPage() {
            if (this.isFlipping) return;
            if (this.currentPage >= this.totalPages) return;
            this.runRealisticFlip('next', this.currentPage + 1);
        }

        prevPage() {
            if (this.isFlipping) return;
            if (this.currentPage <= 0) return;
            this.runRealisticFlip('prev', this.currentPage - 1);
        }

        goToPage(targetPage) {
            if (this.isFlipping) return;
            if (targetPage === this.currentPage) return;
            if (targetPage < 0 || targetPage > this.totalPages) return;

            const dir = (targetPage > this.currentPage) ? 'next' : 'prev';
            this.runRealisticFlip(dir, targetPage);
        }

        getPageBg(pageIdx) {
            if (pageIdx === 0) return 'assets/book_cover.png?v=20261119_3';
            if (pageIdx === 1) return 'assets/page_1.png?v=20261119_3';
            if (pageIdx === 2) return 'assets/page_2.png?v=20261119_3';
            if (pageIdx === 3) return 'assets/page_3.png?v=20261119_3';
            return 'assets/page_1.png?v=20261119_3';
        }

        /**
         * HIỆU ỨNG LẬT SÁCH 3D CHÂN THỰC 2 GIAI ĐOẠN (FLAWLESS 2-PHASE 3D PAGE FLIP):
         * - Không đảo mặt backface hay ghép nối đối xứng dễ lỗi.
         * - Giai đoạn 1: Nửa trang cũ gập cong 3D từ mép ngoài vào gáy sách (0deg -> 90deg), hé lộ trang mới bên dưới.
         * - Giai đoạn 2: Nửa trang mới bung mở 3D từ gáy sách ra mép ngoài (90deg -> 0deg), đáp êm ái lên trang đối diện.
         * - Đổ bóng sâu nếp gấp trung tâm và ánh sáng bóng bẩy sống động.
         */
        runRealisticFlip(direction, targetPage) {
            this.isFlipping = true;
            this.playPaperFlipSound();

            const wrap = document.getElementById('tribute-book-wrap');
            if (!wrap) {
                this.currentPage = targetPage;
                this.renderPageContent();
                this.isFlipping = false;
                return;
            }

            const fromPage = this.currentPage;
            const toPage = targetPage;

            // Xóa container lật cũ nếu còn
            const oldContainer = wrap.querySelector('.book-flip-container');
            if (oldContainer) oldContainer.remove();

            // Nếu lật từ hoặc về Bìa (Page 0): Chuyển cảnh 3D mở gáy sách toàn tập
            if (fromPage === 0 || toPage === 0) {
                wrap.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease';
                wrap.style.transform = (direction === 'next') ? 'rotateY(-14deg) scale(0.96)' : 'rotateY(14deg) scale(0.96)';
                
                setTimeout(() => {
                    this.currentPage = toPage;
                    this.renderPageContent();
                    wrap.style.transform = 'rotateY(0deg) scale(1)';
                    setTimeout(() => {
                        this.isFlipping = false;
                    }, 250);
                }, 220);
                return;
            }

            // LẬT TRANG ĐÔI (Pages 1, 2, 3):
            const container = document.createElement('div');
            container.className = 'book-flip-container';

            const fromBg = this.getPageBg(fromPage);
            const toBg = this.getPageBg(toPage);

            if (direction === 'next') {
                // NEXT: Lật từ phải sang trái
                // 1. Tấm giữ nửa trái của trang cũ (che nửa trái của trang mới bên dưới)
                const stayLeft = document.createElement('div');
                stayLeft.className = 'book-flip-half';
                stayLeft.style.left = '0';
                stayLeft.style.backgroundPosition = 'left center';
                stayLeft.style.backgroundImage = `url("${fromBg}")`;
                container.appendChild(stayLeft);

                // 2. Tấm nửa phải trang cũ gập vào gáy sách (0deg -> -90deg)
                const foldRight = document.createElement('div');
                foldRight.className = 'book-flip-half flip-fold-in-right';
                foldRight.style.backgroundImage = `url("${fromBg}")`;
                container.appendChild(foldRight);

                // Cập nhật nền trang mới và nội dung trang mới ngay bên dưới
                this.currentPage = toPage;
                this.renderPageContent();
                wrap.appendChild(container);

                // Sau 200ms (khi tấm phải đã gập thẳng vào gáy sách):
                setTimeout(() => {
                    foldRight.remove();
                    stayLeft.remove();

                    // 3. Tấm nửa trái trang mới mở ra từ gáy sách đáp xuống bên trái (90deg -> 0deg)
                    const unfoldLeft = document.createElement('div');
                    unfoldLeft.className = 'book-flip-half flip-unfold-out-left';
                    unfoldLeft.style.backgroundImage = `url("${toBg}")`;
                    container.appendChild(unfoldLeft);

                    setTimeout(() => {
                        container.remove();
                        this.isFlipping = false;
                    }, 220);
                }, 200);
            } else {
                // PREV: Lật từ trái sang phải
                // 1. Tấm giữ nửa phải của trang cũ (che nửa phải của trang mới bên dưới)
                const stayRight = document.createElement('div');
                stayRight.className = 'book-flip-half';
                stayRight.style.left = '50%';
                stayRight.style.backgroundPosition = 'right center';
                stayRight.style.backgroundImage = `url("${fromBg}")`;
                container.appendChild(stayRight);

                // 2. Tấm nửa trái trang cũ gập vào gáy sách (0deg -> 90deg)
                const foldLeft = document.createElement('div');
                foldLeft.className = 'book-flip-half flip-fold-in-left';
                foldLeft.style.backgroundImage = `url("${fromBg}")`;
                container.appendChild(foldLeft);

                this.currentPage = toPage;
                this.renderPageContent();
                wrap.appendChild(container);

                setTimeout(() => {
                    foldLeft.remove();
                    stayRight.remove();

                    // 3. Tấm nửa phải trang mới mở ra từ gáy sách đáp xuống bên phải (-90deg -> 0deg)
                    const unfoldRight = document.createElement('div');
                    unfoldRight.className = 'book-flip-half flip-unfold-out-right';
                    unfoldRight.style.backgroundImage = `url("${toBg}")`;
                    container.appendChild(unfoldRight);

                    setTimeout(() => {
                        container.remove();
                        this.isFlipping = false;
                    }, 220);
                }, 200);
            }
        }

        renderPageContent() {
            const wrap = document.getElementById('tribute-book-wrap');
            const contentEl = document.getElementById('tribute-book-content');
            const spineEl = document.getElementById('tribute-book-spine');
            const gutterEl = document.getElementById('tribute-book-gutter');
            const btnPrev = document.getElementById('book-btn-prev');
            const btnNext = document.getElementById('book-btn-next');
            const pageLabel = document.getElementById('book-page-label');
            const dotsEl = document.getElementById('book-indicator-dots');

            if (!wrap || !contentEl) return;

            // Cập nhật trạng thái nút điều hướng
            if (btnPrev) btnPrev.disabled = (this.currentPage <= 0);
            if (btnNext) btnNext.disabled = (this.currentPage >= this.totalPages);

            // Cập nhật nhãn trang
            if (pageLabel) {
                if (this.currentPage === 0) {
                    pageLabel.innerText = 'Trang Bìa';
                } else {
                    pageLabel.innerText = `Trang ${this.currentPage} / ${this.totalPages}`;
                }
            }

            // Cập nhật chỉ số chấm tròn
            if (dotsEl) {
                const dots = dotsEl.querySelectorAll('span');
                dots.forEach((dot, idx) => {
                    if (idx === this.currentPage) {
                        dot.className = 'tribute-book-dot active';
                    } else {
                        dot.className = 'tribute-book-dot';
                    }
                });
            }

            // ==========================================
            // TRANG 0: BÌA SÁCH (COVER - assets/book_cover.png)
            // ==========================================
            if (this.currentPage === 0) {
                wrap.style.backgroundImage = 'url("assets/book_cover.png?v=20261119_3")';
                wrap.style.aspectRatio = '764 / 1024';
                wrap.style.maxWidth = '520px';
                if (spineEl) spineEl.style.display = 'none';
                if (gutterEl) gutterEl.style.display = 'none';

                contentEl.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 text-center relative z-20">
                        <!-- Top Badge -->
                        <div class="pt-4 animate-pulse">
                            <span class="px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-bold font-quest tracking-widest shadow-lg flex items-center gap-1.5">
                                <img src="assets/ui/icons/flower_normal.png" class="w-4 h-4 object-contain inline-block" />
                                <span>KỶ NIỆM NGÀY NHÀ GIÁO VIỆT NAM</span>
                            </span>
                        </div>

                        <!-- Center Title Header ánh kim -->
                        <div class="space-y-3 my-auto max-w-md">
                            <h1 class="text-2xl sm:text-3xl font-extrabold font-handwriting text-gold-emboss tracking-wider leading-snug">
                                TRƯỜNG ĐẠI HỌC TÂY NGUYÊN
                            </h1>
                            <div class="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                            <h2 class="text-xl sm:text-2xl font-bold font-handwriting text-amber-200 drop-shadow-md">
                                Tri Ân Người Khai Sáng Tri Thức
                            </h2>
                            <p class="text-xs sm:text-sm font-tribute-body text-amber-100/90 leading-relaxed drop-shadow italic px-4 font-medium">
                                "Suốt bốn thập kỷ ươm mầm tri thức giữa lòng đại ngàn Tây Nguyên hùng vĩ, chở bao ước mơ sinh viên vươn tới tương lai."
                            </p>
                        </div>

                        <!-- Nút Mở Sách Khám Phá -->
                        <div class="pb-6">
                            <button class="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-[#2d1804] border-2 border-[#fff3b0] rounded-2xl text-base font-extrabold font-quest shadow-2xl transition-all flex items-center gap-2 cursor-pointer group hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]" onclick="window.tributeBookManager.nextPage()">
                                <img src="assets/ui/icons/scroll_normal.png" class="w-6 h-6 object-contain group-hover:rotate-12 transition-transform" />
                                <span>MỞ SÁCH TRI ÂN ➔</span>
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            // Trang đôi 1, 2, 3: Tỷ lệ chuẩn 1024 / 571
            wrap.style.aspectRatio = '1024 / 571';
            wrap.style.maxWidth = '1060px';
            if (spineEl) spineEl.style.display = 'block';
            if (gutterEl) gutterEl.style.display = 'block';

            // ==========================================
            // TRANG 1: HÀNH TRÌNH TRI THỨC (assets/page_1.png)
            // ==========================================
            if (this.currentPage === 1) {
                wrap.style.backgroundImage = 'url("assets/page_1.png?v=20261119_3")';

                contentEl.innerHTML = `
                    <div class="w-full h-full relative z-20">
                        <!-- Tiêu đề vòm phía trên -->
                        <div class="text-center pt-2">
                            <div class="inline-flex items-center gap-2">
                                <img src="assets/ui/icons/flower_normal.png" class="w-5 h-5 object-contain" />
                                <h2 class="text-base sm:text-2xl font-extrabold font-handwriting text-gold-emboss drop-shadow-lg tracking-wide">
                                    Hành Trình Thắp Sáng Tri Thức — ĐH Tây Nguyên
                                </h2>
                                <img src="assets/ui/icons/flower_normal.png" class="w-5 h-5 object-contain" />
                            </div>
                            <p class="text-[11px] sm:text-xs text-amber-200/90 italic font-tribute-body">Kính tặng các thế hệ giảng viên Trường Đại Học Tây Nguyên</p>
                        </div>

                        <!-- Vùng nội dung nửa trang trái (Gieo Mầm Tri Thức) -->
                        <div style="position: absolute; left: 8.5%; top: 28%; width: 36.5%; height: 60%;" class="p-3 sm:p-5 rounded-2xl bg-[#091e3a]/45 border border-cyan-400/35 backdrop-blur-sm space-y-2 text-[#e0f2fe] shadow-lg flex flex-col justify-center">
                            <h3 class="text-sm sm:text-lg font-bold font-handwriting text-amber-300 flex items-center gap-2 border-b border-amber-300/30 pb-1">
                                <img src="assets/ui/icons/compass_normal.png" class="w-4 h-4 object-contain inline-block" />
                                <span>Gieo Mầm Tri Thức Giữa Đại Ngàn</span>
                            </h3>
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify drop-shadow">
                                Suốt hơn bốn thập kỷ xây dựng và trưởng thành, dưới mái trường Đại học Tây Nguyên thân yêu, các thế hệ thầy cô giáo đã tận tụy cống hiến trọn vẹn tâm huyết và tuổi xuân, gieo từng mầm xanh tri thức giữa lòng đất đỏ bazan bao la.
                            </p>
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify drop-shadow">
                                Từ những trang giáo án thâu đêm bên ánh đèn bàn, từng dòng code logic, từng công trình nghiên cứu đã chắp cánh cho hàng vạn kỹ sư, cử nhân tỏa đi khắp mọi miền Tổ quốc.
                            </p>
                        </div>

                        <!-- Vùng nội dung nửa trang phải (Ngọn Hải Đăng Giữa Biển Đời) -->
                        <div style="position: absolute; left: 55.5%; top: 28%; width: 36.5%; height: 60%;" class="p-3 sm:p-5 rounded-2xl bg-[#091e3a]/45 border border-cyan-400/35 backdrop-blur-sm space-y-2 text-[#e0f2fe] shadow-lg flex flex-col justify-center">
                            <h3 class="text-sm sm:text-lg font-bold font-handwriting text-amber-300 flex items-center gap-2 border-b border-amber-300/30 pb-1">
                                <img src="assets/ui/icons/bouquet_normal.png" class="w-4 h-4 object-contain inline-block" />
                                <span>Ngọn Hải Đăng Giữa Biển Đời</span>
                            </h3>
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify drop-shadow">
                                Như ngọn hải đăng vững vàng rực sáng giữa biển đêm, ngọn lửa đam mê, đức khiêm nhường và sự bao dung của quý thầy cô luôn soi đường chỉ lối cho biết bao thế hệ sinh viên.
                            </p>
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify drop-shadow">
                                Dù mai này đi muôn phương, chúng em vẫn mãi khắc ghi trong tim bóng hình người thầy, người cô Trường Đại học Tây Nguyên — những người thầm lặng thắp sáng tương lai!
                            </p>
                        </div>
                    </div>
                `;
                return;
            }

            // ========================================================
            // TRANG 2: BÀI HỌC ĐẦU TIÊN (assets/page_2.png)
            // KHÔNG DÙNG HỘP BẢNG MÀU TRẮNG/BE - CHỮ ĐẶT VỪA KHÍT TRÊN NỀN
            // ========================================================
            if (this.currentPage === 2) {
                wrap.style.backgroundImage = 'url("assets/page_2.png?v=20261119_3")';

                contentEl.innerHTML = `
                    <div class="w-full h-full relative z-20 select-none">
                        <!-- Nửa trang trái: Vừa khít cuộn giấy vẽ trên nền -->
                        <div style="position: absolute; left: 9.5%; top: 11.5%; width: 26.8%; height: 64%;" class="flex flex-col justify-center text-[#291305] p-1 sm:p-2">
                            <!-- Tiêu đề với icon -->
                            <div class="flex items-center gap-1.5 pb-1 mb-2 border-b border-[#92400e]/30">
                                <img src="assets/ui/icons/scroll_normal.png" class="w-5 h-5 object-contain" alt="Bài học" />
                                <h3 class="text-base sm:text-lg font-bold font-handwriting text-[#78350f]">Bài Học Đầu Tiên</h3>
                            </div>
                            <!-- Đoạn văn tự sự xúc động -->
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify mb-2 font-medium">
                                Em vẫn nhớ như in những ngày đầu bỡ ngỡ bước chân qua cánh cổng trường Đại học Tây Nguyên. Giảng đường thênh thang, bao lo lắng của những cô cậu tân sinh viên xa nhà dường như tan biến trước ánh mắt ấm áp và nụ cười đôn hậu của Thầy Cô.
                            </p>
                            <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-justify font-medium">
                                Bài học đầu tiên Thầy Cô trao cho chúng em không chỉ là những dòng lệnh hay thuật toán chuyên môn khô khan, mà là bài học về nhân cách làm người, nghị lực vượt khó, tình yêu nghề thiết tha và khát vọng cống hiến cho quê hương xứ sở.
                            </p>
                        </div>

                        <!-- Nửa trang phải: Vừa khít cuộn giấy bên phải -->
                        <div style="position: absolute; left: 64.5%; top: 11.5%; width: 26.8%; height: 64%;" class="flex flex-col justify-center text-[#291305] p-1 sm:p-2">
                            <!-- Tiêu đề Thơ -->
                            <div class="flex items-center justify-center gap-1.5 pb-1 mb-2 border-b border-[#92400e]/30">
                                <img src="assets/ui/icons/bouquet_normal.png" class="w-5 h-5 object-contain" alt="Thơ" />
                                <h3 class="text-base sm:text-lg font-bold font-handwriting text-[#78350f]">Thưa Thầy Cô</h3>
                            </div>
                            <!-- Bài thơ 8 câu cảm động -->
                            <div class="text-[11px] sm:text-[13px] font-handwriting text-[#291305] leading-relaxed italic text-center space-y-1 py-1 font-semibold">
                                <p>Bụi phấn trắng bay nghiêng chiều giảng võng,</p>
                                <p>Tiếng giảng bài sâu lắng giữa ngàn xanh.</p>
                                <p>Thầy như người lái con thuyền tri thức,</p>
                                <p>Chở bao mùa mơ ước chạm trời thanh.</p>
                                <div class="h-0.5 w-16 mx-auto bg-amber-600/40 my-1"></div>
                                <p>Dẫu năm tháng tóc pha màu sương gió,</p>
                                <p>Tâm huyết xưa vẫn vẹn nét son ngời.</p>
                                <p>Cảm ơn Người - người lái đò thầm lặng,</p>
                                <p>Dìu bước em bay bổng giữa cuộc đời!</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }

            // ========================================================
            // TRANG 3: GÓC KÝ ỨC & TÂM TƯ 20/11 (assets/page_3.png)
            // LỒNG ẢNH THẬT 20/11, CHỮ PHẤN BẢNG VÀ TÂM TƯ TRONG VÙNG SÁNG
            // ========================================================
            if (this.currentPage === 3) {
                wrap.style.backgroundImage = 'url("assets/page_3.png?v=20261119_3")';

                contentEl.innerHTML = `
                    <div class="w-full h-full relative z-20 select-none">
                        <!-- 1. Chữ phấn trắng & vàng trên bảng đen trung tâm của nền -->
                        <div style="position: absolute; left: 17%; top: 29.5%; width: 15.5%; height: 38%;" class="flex flex-col items-center justify-center text-center p-1 pointer-events-none">
                            <div class="flex items-center gap-1 text-[#fef08a] text-[10px] sm:text-xs font-bold font-handwriting tracking-wide">
                                <img src="assets/ui/icons/flower_normal.png" class="w-3.5 h-3.5 object-contain inline-block" />
                                <span>TRI ÂN THẦY CÔ</span>
                            </div>
                            <div class="text-[#fde047] text-[11px] sm:text-xs font-extrabold font-quest my-0.5 tracking-wider">
                                20 / 11 / 2026
                            </div>
                            <div class="w-14 h-px bg-white/40 my-1"></div>
                            <div class="text-white text-[9px] sm:text-[10px] font-handwriting italic leading-tight drop-shadow">
                                Nhiệt Huyết Công Nghệ<br>
                                Tự Hào Tây Nguyên!
                            </div>
                        </div>

                        <!-- 2. Chú thích nhỏ chân ảnh polaroid 20/11 - nghiêng tự nhiên theo viền ảnh polaroid -->
                        <div style="position: absolute; left: 2.2%; top: 61.2%; width: 14.5%; transform: rotate(-14.7deg); white-space: nowrap;" class="text-[10px] sm:text-[11px] font-bold text-center text-[#3b2512] font-handwriting drop-shadow-sm pointer-events-none">
                            💐 Chúc Mừng 20/11
                        </div>
                        <div style="position: absolute; left: 32.5%; top: 61.2%; width: 15%; transform: rotate(14deg); white-space: nowrap;" class="text-[10px] sm:text-[11px] font-bold text-center text-[#3b2512] font-handwriting drop-shadow-sm pointer-events-none">
                            🏅 Kỷ Niệm 20/11
                        </div>

                        <!-- 3. Nửa trang phải: Văn bản và Nút bấm nằm vừa khít trong vùng sáng kỳ ảo -->
                        <div style="position: absolute; left: 54.5%; top: 12%; width: 33.5%; height: 76%;" class="flex flex-col justify-between p-2 sm:p-3 text-[#1e293b]">
                            <!-- Tiêu đề với icon thật -->
                            <div class="border-b border-sky-400/40 pb-1 flex items-center justify-between">
                                <div class="flex items-center gap-1.5">
                                    <img src="assets/ui/icons/heart_normal.png" class="w-5 h-5 object-contain" alt="Thiện cảm" />
                                    <h3 class="text-base sm:text-xl font-bold font-handwriting text-[#0f172a]">
                                        Tâm Tư Gửi Thầy Cô
                                    </h3>
                                </div>
                                <span class="text-xs font-bold font-quest text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-300/50">20/11</span>
                            </div>

                            <!-- Nội dung thư tri ân viết tay -->
                            <div class="space-y-2 my-auto py-1">
                                <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-[#1e293b] text-justify font-semibold">
                                    Nhân Ngày Nhà Giáo Việt Nam 20/11, tập thể sinh viên xin kính dâng lên quý Thầy Cô muôn đóa hoa tươi thắm nhất cùng lòng tri ân sâu sắc và sự biết ơn vô hạn.
                                </p>
                                <p class="text-[11px] sm:text-[13px] font-tribute-body leading-relaxed text-[#1e293b] text-justify font-semibold">
                                    Kính chúc quý Thầy Cô luôn dồi dào sức khỏe, ngập tràn niềm vui, giữ mãi ngọn lửa nhiệt huyết và đam mê trên sự nghiệp trồng người cao cả giữa đại ngàn Tây Nguyên!
                                </p>
                                <div class="text-right text-[11px] sm:text-[13px] font-handwriting font-bold text-[#0f172a] italic pt-0.5">
                                    — Tập thể Sinh viên Trường Đại học Tây Nguyên —
                                </div>
                            </div>

                            <!-- Nút nhận quà tri ân nằm trong vùng sáng -->
                            <div class="pt-1">
                                <button class="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white border-2 border-[#166534] rounded-xl text-xs sm:text-sm font-bold font-quest shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]" onclick="window.tributeBookManager.claimTributeGift()">
                                    <img src="assets/ui/icons/gift_normal.png" class="w-5 h-5 object-contain" alt="Quà" />
                                    <span>ĐÓNG SÁCH & NHẬN QUÀ TRI ÂN</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
        }

        claimTributeGift() {
            // Thưởng quà tri ân
            if (window.useGameStore) {
                window.useGameStore.addItem('student_coins', 100);
                window.useGameStore.addAffection(30);
                window.useGameStore.checkAllUnlocks();
            }

            localStorage.setItem('tnu_tribute_book_gift_claimed', 'true');
            this.hasClaimedGift = true;

            if (window.uiManager && typeof window.uiManager.showCelebrationBanner === 'function') {
                window.uiManager.showCelebrationBanner(
                    '🎉 PHẦN THƯỞNG TRI ÂN 20/11!',
                    'Bạn vừa hoàn thành đọc trọn vẹn Cuốn Sách Tri Ân! Nhận ngay +100 Xu Sinh Viên & +30 Điểm Thiện Cảm!'
                );
            }

            if (window.soundSystem && typeof window.soundSystem.playUnlockFanfare === 'function') {
                window.soundSystem.playUnlockFanfare();
            }

            this.closeBook();
        }

        // ==========================================
        // VẼ CUỐN SÁCH LƠ LỬNG TRÊN BẢN ĐỒ MAP 1
        // ==========================================
        update(dt, player) {
            this.globalTime += dt;
        }

        renderWorld(ctx, player) {
            if (!ctx) return;

            const x = this.worldX;
            const y = this.worldY;
            const t = this.globalTime;

            // Dao động bồng bềnh lơ lửng
            const bob = Math.sin(t * 2.8) * 6.5;
            const tilt = Math.sin(t * 1.5) * 0.05;
            const pulse = (Math.sin(t * 3.5) + 1) * 0.5;

            ctx.save();

            // 1. Vòng tròn ma thuật ánh vàng dưới mặt đất
            ctx.save();
            ctx.translate(x, y + 26);
            ctx.scale(1, 0.45);
            ctx.rotate(t * 0.6);

            ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + pulse * 0.35})`;
            ctx.lineWidth = 2.2;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(0, 0, 32 + pulse * 4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(251, 191, 36, ${0.12 + pulse * 0.08})`;
            ctx.beginPath();
            ctx.arc(0, 0, 26, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // 2. Bóng đổ mềm
            ctx.fillStyle = `rgba(0, 0, 0, ${0.28 - (bob / 40)})`;
            ctx.beginPath();
            ctx.ellipse(x, y + 26, 22 - (bob / 2), 7 - (bob / 4), 0, 0, Math.PI * 2);
            ctx.fill();

            // 3. Cuốn sách lơ lửng
            ctx.save();
            ctx.translate(x, y + bob);
            ctx.rotate(tilt);

            const bookW = 46;
            const bookH = 62;

            ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
            ctx.shadowBlur = 14 + pulse * 8;

            if (this.coverImg && this.coverImg.complete && this.coverImg.naturalWidth > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(-bookW / 2, -bookH / 2, bookW, bookH, 6);
                ctx.clip();
                ctx.drawImage(this.coverImg, -bookW / 2, -bookH / 2, bookW, bookH);
                ctx.restore();

                ctx.strokeStyle = '#ffd166';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(-bookW / 2, -bookH / 2, bookW, bookH, 6);
                ctx.stroke();
            } else {
                ctx.fillStyle = '#1e3a8a';
                ctx.beginPath();
                ctx.roundRect(-bookW / 2, -bookH / 2, bookW, bookH, 6);
                ctx.fill();
                ctx.font = '28px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('📖', 0, 0);
            }

            // Gáy sách dập vàng
            ctx.fillStyle = '#b45309';
            ctx.fillRect(-bookW / 2, -bookH / 2, 4, bookH);

            ctx.restore();

            // 4. Các vì sao nhỏ bay lơ lửng quanh sách
            for (let i = 0; i < 4; i++) {
                const angle = t * 1.8 + (i * Math.PI / 2);
                const starRadius = 32 + Math.sin(t * 3 + i) * 6;
                const sx = x + Math.cos(angle) * starRadius;
                const sy = y + bob + Math.sin(angle) * (starRadius * 0.6);

                ctx.font = '12px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fde047';
                ctx.fillText('✨', sx, sy);
            }

            // 5. Thanh tên cuốn sách
            const namePlateY = y - 48 + bob;
            const nameText = '📖 Cuốn Sách Tri Ân 20/11 🌟';
            ctx.font = 'bold 12px "Patrick Hand", "Nunito", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textW = ctx.measureText(nameText).width;
            const plateW = textW + 20;
            const plateH = 22;

            ctx.fillStyle = 'rgba(254, 249, 195, 0.95)';
            ctx.strokeStyle = '#854d0e';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(x - plateW / 2, namePlateY - plateH / 2, plateW, plateH, 11);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#713f12';
            ctx.fillText(nameText, x, namePlateY + 1);

            // 6. Gợi ý tương tác [E] khi người chơi đến gần
            if (player) {
                const dist = Math.hypot(player.x - x, player.y - y);
                if (dist < this.worldRadius) {
                    if (window.drawWorldPromptBadge) {
                        window.drawWorldPromptBadge(ctx, x, namePlateY - 26, '[E] Mở Cuốn Sách Tri Ân 20/11 📖', {
                            theme: 'gold',
                            pointer: true
                        });
                    }
                }
            }

            ctx.restore();
        }

        checkInteract(px, py) {
            const dist = Math.hypot(px - this.worldX, py - this.worldY);
            if (dist < this.worldRadius) {
                this.openBook();
                return true;
            }
            return false;
        }
    }

    // Khởi tạo Singleton
    window.TributeBookManager = TributeBookManager;
    window.tributeBookManager = new TributeBookManager();

})(window);
