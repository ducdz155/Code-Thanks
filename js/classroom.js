/**
 * ====================================================================
 * 🏫 TNU ADVENTURE: MAP 5 - LỚP HỌC TRI ÂN 20/11 (CLASSROOM MODULE)
 * ====================================================================
 * - Background: 1280x720 chuẩn nét nội thất Lớp học Tri ân 20/11
 * - NPC Cô Giáo:
 *   + Đứng tại bục giảng (x: 456, y: 258) - Chuẩn hình tròn đen theo ảnh 3
 *   + Frame 1 (teacher_female_normal.png): Áo dài hồng dịu dàng
 *   + Frame 2 (teacher_female_happy.png): Tươi cười ôm bó hoa hồng 20/11 & trái tim bay
 *   + Khi người chơi tặng hoa từ Balo: Đổi frame vĩnh viễn, phát nhạc, thưởng điểm thiện cảm!
 * - 6 Vị trí Bàn Ghế Học Sinh:
 *   + Bàn học (Phần hình vuông đen): Vật cản va chạm không thể đi xuyên
 *   + Ghế ngồi (Phần màu đỏ): Vùng tương tác Đố vui Câu hỏi 20/11
 * - Hệ thống Câu hỏi Trắc nghiệm 20/11:
 *   + 10 Câu hỏi giáo dục truyền thống Tôn Sư Trọng Đạo
 *   + Thưởng Xu Sinh Viên & Điểm Thiện Cảm khi trả lời đúng
 */

(function(window) {
    'use strict';

    const QUIZ_QUESTIONS = [
        {
            q: "Ngày Nhà Giáo Việt Nam được chính thức ban hành theo quyết định của Hội đồng Bộ trưởng vào năm nào?",
            options: [
                "Năm 1982 (Quyết định số 167-HĐBT)",
                "Năm 1975",
                "Năm 1958",
                "Năm 1990"
            ],
            correct: 0,
            explain: "Ngày 26/9/1982, Hội đồng Bộ trưởng đã ban hành Quyết định số 167-HĐBT chính thức lấy ngày 20/11 hàng năm là Ngày Nhà giáo Việt Nam!"
        },
        {
            q: "Truyền thống quý báu ngàn đời của dân tộc ta dành cho người dạy học được đúc kết qua câu tục ngữ nào?",
            options: [
                "Tôn sư trọng đạo",
                "Gần mực thì đen, gần đèn thì rạng",
                "Học thầy không tày học bạn",
                "Có công mài sắt, có ngày nên kim"
            ],
            correct: 0,
            explain: "'Tôn sư trọng đạo' là nét đẹp văn hóa ngàn đời, thể hiện sự kính trọng người thầy và coi trọng đạo lý, tri thức!"
        },
        {
            q: "Ngày Quốc tế Hiến chương các nhà giáo lần đầu tiên được tổ chức tại miền Bắc Việt Nam vào ngày nào?",
            options: [
                "20/11/1958",
                "20/11/1945",
                "20/11/1968",
                "20/11/1972"
            ],
            correct: 0,
            explain: "Ngày 20/11/1958 là ngày lễ kỷ niệm Hiến chương các nhà giáo đầu tiên được tổ chức trọng thể tại miền Bắc Việt Nam."
        },
        {
            q: "Bài hát bất hủ nào của nhạc sĩ Vũ Hoàng & Lê Văn Lộc có câu ca: 'Khi thầy viết bảng, bụi phấn rơi rơi...'?",
            options: [
                "Bụi Phấn",
                "Người Thầy",
                "Khi Tóc Thầy Bạc Trắng",
                "Bông Hồng Tặng Cô"
            ],
            correct: 0,
            explain: "'Bụi Phấn' là một trong những bài hát thiêng liêng và xúc động nhất gắn liền với tuổi học trò Việt Nam!"
        },
        {
            q: "Câu danh ngôn: 'Dưới ánh mặt trời không có nghề nào cao quý hơn nghề dạy học' là của nhà giáo dục lỗi lạc nào?",
            options: [
                "Jan Amos Comenius (Cô-men-xki)",
                "Jean-Jacques Rousseau",
                "Khổng Tử",
                "Aristotle"
            ],
            correct: 0,
            explain: "Nhà giáo dục vĩ đại người Séc Jan Amos Comenius (1592–1670) đã tôn vinh nghề dạy học là nghề cao quý bậc nhất dưới ánh mặt trời."
        },
        {
            q: "Món quà tinh thần ý nghĩa nhất mà Thầy/Cô Trường Đại học Tây Nguyên luôn mong muốn nhận được từ các em sinh viên là gì?",
            options: [
                "Sự chăm ngoan, tiến bộ vượt bậc và trưởng thành trong cuộc sống",
                "Những món quà đắt tiền",
                "Những lời khen ngợi xã giao",
                "Không cần phấn đấu học tập"
            ],
            correct: 0,
            explain: "Hạnh phúc lớn nhất của người thầy là chứng kiến các thế hệ học trò trưởng thành, cống hiến tri thức cho quê hương đất nước!"
        },
        {
            q: "Trường Đại học Tây Nguyên tự hào tọa lạc tại thành phố thủ phủ cà phê nào?",
            options: [
                "Thành phố Buôn Ma Thuột (Tỉnh Đắk Lắk)",
                "Thành phố Pleiku (Tỉnh Gia Lai)",
                "Thành phố Đà Lạt (Tỉnh Lâm Đồng)",
                "Thành phố Kon Tum"
            ],
            correct: 0,
            explain: "Trường Đại học Tây Nguyên tự hào đóng chân trên địa bàn TP. Buôn Ma Thuột - trung tâm văn hóa, kinh tế của vùng Tây Nguyên hùng vĩ!"
        },
        {
            q: "Trong game TNU Adventure, loài hoa nào được hái tại Vườn hoa sinh thái để kết thành Bó hoa dâng tặng Thầy/Cô?",
            options: [
                "Hoa Hồng Đỏ & Hoa Hồng Trắng quý hiếm",
                "Hoa Hướng Dương",
                "Hoa Dã Quỳ",
                "Hoa Cẩm Chướng"
            ],
            correct: 0,
            explain: "Những đóa hoa hồng thắm được chính tay các bạn sinh viên gieo hạt, tưới nước và chăm sóc để kính dâng Thầy/Cô!"
        },
        {
            q: "Câu thành ngữ nào nhắc nhở chúng ta về lòng biết ơn sâu sắc đối với người đã dạy dỗ mình?",
            options: [
                "Nhất tự vi sư, bán tự vi sư",
                "Uống nước nhớ nguồn",
                "Ăn quả nhớ kẻ trồng cây",
                "Tất cả các phương án trên"
            ],
            correct: 3,
            explain: "Tất cả các câu trên đều là những bài học đạo đức vô giá về sự biết ơn đối với thầy cô và các bậc tiền nhân."
        },
        {
            q: "Khẩu hiệu và tinh thần cốt lõi của sinh viên Khoa Công nghệ Thông tin - Trường ĐH Tây Nguyên là gì?",
            options: [
                "Nhiệt huyết công nghệ, sáng tạo không ngừng và tri ân nguồn cội",
                "Học đối phó thi cử",
                "Chỉ tập trung lý thuyết",
                "Không quan tâm thực hành"
            ],
            correct: 0,
            explain: "Sinh viên CNTT Tây Nguyên luôn cháy hết mình với đam mê công nghệ, gắn liền sáng tạo kỹ thuật với đạo lý làm người!"
        }
    ];

    class ClassroomManager {
        constructor() {
            this.bgImage = null;
            this.bgLoaded = false;
            this.teacherNormalImg = null;
            this.teacherHappyImg = null;
            this.spritesLoaded = false;
            this.globalTime = 0;

            // Vị trí Cô Giáo trên bục giảng (Chuẩn hình tròn đen theo Ảnh 3)
            this.teacherX = 456;
            this.teacherY = 258;
            this.teacherRadius = 65;

            // Trạng thái đã nhận hoa (Đổi frame hoa)
            const savedState = localStorage.getItem('tnu_classroom_teacher_flower_received');
            this.hasReceivedFlowers = (savedState === 'true');

            // 6 Ghế học sinh (Vùng màu đỏ theo Ảnh 3)
            this.quizChairs = [
                { id: 1, x: 487, y: 390, desk: 'Bàn số 1' },
                { id: 2, x: 467, y: 505, desk: 'Bàn số 2' },
                { id: 3, x: 446, y: 615, desk: 'Bàn số 3' },
                { id: 4, x: 795, y: 390, desk: 'Bàn số 4' },
                { id: 5, x: 815, y: 505, desk: 'Bàn số 5' },
                { id: 6, x: 835, y: 615, desk: 'Bàn số 6' }
            ];
            this.lastSteppedChairId = null;
            this.justClosedCooldown = 0;

            // Trạng thái câu hỏi hiện tại
            this.activeChair = null;
            this.currentQuestionIdx = 0;
            this.selectedAnswer = null;
            this.hasAnswered = false;
            this.heartParticles = [];

            // NPC Data để tích hợp với hệ thống Modal Đối Thoại chuẩn của Game
            this.teacherNpc = {
                id: 'teacher_classroom_mai_hoa',
                name: 'Cô Mai Hoa',
                title: 'Giảng Viên Khoa Sư Phạm / CNTT - ĐH Tây Nguyên',
                role: 'teacher_classroom',
                skinId: null,
                avatar: 'assets/classroom/teacher_female_normal.png',
                speech: 'Chào mừng các em sinh viên đến với Lớp Học Tri Ân 20/11! Chúc các em luôn giữ vững nhiệt huyết học tập và thành công trên con đường tương lai!'
            };

            this.init();
        }

        init() {
            // 1. Tải ảnh nền Lớp học
            this.bgImage = new Image();
            this.bgImage.src = 'assets/classroom/classroom_bg.png';
            this.bgImage.onload = () => { this.bgLoaded = true; };

            // 2. Tải 2 Frame Cô Giáo
            this.teacherNormalImg = new Image();
            this.teacherNormalImg.src = 'assets/classroom/teacher_female_normal.png';

            this.teacherHappyImg = new Image();
            this.teacherHappyImg.src = 'assets/classroom/teacher_female_happy.png';

            // 3. Inject Quiz Modal vào DOM
            this.ensureQuizModal();
        }

        setTeacherGiftReceived(received = true) {
            this.hasReceivedFlowers = received;
            localStorage.setItem('tnu_classroom_teacher_flower_received', received ? 'true' : 'false');
            if (this.teacherNpc) {
                this.teacherNpc.avatar = received 
                    ? 'assets/classroom/teacher_female_happy.png' 
                    : 'assets/classroom/teacher_female_normal.png';
            }
            // Tạo chùm hạt trái tim chúc mừng
            for (let i = 0; i < 25; i++) {
                this.heartParticles.push({
                    x: this.teacherX + (Math.random() - 0.5) * 60,
                    y: this.teacherY - 30 + (Math.random() - 0.5) * 40,
                    vx: (Math.random() - 0.5) * 35,
                    vy: -40 - Math.random() * 50,
                    size: 14 + Math.random() * 12,
                    alpha: 1.0,
                    life: 1.8 + Math.random() * 0.8
                });
            }
        }

        update(dt, player) {
            this.globalTime += dt;

            // Cập nhật hạt trái tim
            for (let i = this.heartParticles.length - 1; i >= 0; i--) {
                const p = this.heartParticles[i];
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
                p.alpha = Math.max(0, p.life / 2.0);
                if (p.life <= 0) {
                    this.heartParticles.splice(i, 1);
                }
            }

            // Tự động thêm tim nhỏ lơ lửng nếu cô giáo đã nhận hoa
            if (this.hasReceivedFlowers && Math.random() < 0.05) {
                this.heartParticles.push({
                    x: this.teacherX + (Math.random() - 0.5) * 50,
                    y: this.teacherY - 20,
                    vx: (Math.random() - 0.5) * 15,
                    vy: -25 - Math.random() * 20,
                    size: 12 + Math.random() * 8,
                    alpha: 0.9,
                    life: 1.5
                });
            }

            if (this.justClosedCooldown > 0) {
                this.justClosedCooldown -= dt;
            }

            // Kiểm tra vị trí người chơi gần ghế ngồi nào (Vùng màu đỏ theo Ảnh 3)
            if (player) {
                let insideChair = null;
                for (const chair of this.quizChairs) {
                    const dist = Math.hypot(player.x - chair.x, player.y - chair.y);
                    if (dist < 46) {
                        insideChair = chair;
                        break;
                    }
                }
                this.activeChair = insideChair;

                // Tự động mở câu hỏi 20/11 khi người chơi bước vào vùng màu đỏ
                if (insideChair) {
                    if (this.justClosedCooldown <= 0 && this.lastSteppedChairId !== insideChair.id) {
                        this.lastSteppedChairId = insideChair.id;
                        const modal = document.getElementById('classroom-quiz-modal');
                        const isModalOpen = modal && (modal.classList.contains('active') || modal.classList.contains('modal-visible') || modal.style.display === 'flex');
                        if (!isModalOpen) {
                            this.openQuizModal();
                        }
                    }
                } else {
                    this.lastSteppedChairId = null;
                }
            }
        }

        render(ctx, player) {
            if (!ctx) return;

            // 1. Vẽ nền Bản đồ Lớp học 1280x720
            if (this.bgLoaded && this.bgImage) {
                ctx.drawImage(this.bgImage, 0, 0, 1280, 720);
            } else {
                ctx.fillStyle = '#fef3c7';
                ctx.fillRect(0, 0, 1280, 720);
            }

            // 2. Vẽ 6 Vòng tròn ma pháp / Vùng màu đỏ tại ghế học sinh (Theo Ảnh 3)
            const pulse = (Math.sin(this.globalTime * 4.5) + 1) * 0.5;
            this.quizChairs.forEach(chair => {
                ctx.save();
                ctx.translate(chair.x, chair.y);

                // Quầng sáng đỏ dịu bừng nở
                ctx.fillStyle = `rgba(239, 68, 68, ${0.16 + pulse * 0.12})`;
                ctx.beginPath();
                ctx.ellipse(0, 0, 26 + pulse * 4, 16 + pulse * 2.5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Viền nét đứt phong cách RPG
                ctx.strokeStyle = `rgba(220, 38, 38, ${0.65 + pulse * 0.35})`;
                ctx.lineWidth = 2.2;
                ctx.setLineDash([6, 4]);
                ctx.beginPath();
                ctx.ellipse(0, 0, 26 + pulse * 4, 16 + pulse * 2.5, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Biểu tượng trang sách / cây bút mini ở tâm
                ctx.font = '14px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('📖', 0, -2);

                ctx.restore();
            });

            // 3. Vẽ Cô Giáo trên Bục Giảng (Tại x: 456, y: 258)
            this.renderTeacher(ctx, player);

            // 4. Vẽ Hạt Trái Tim Chúc Mừng Bay Lên
            if (this.heartParticles.length > 0) {
                ctx.save();
                this.heartParticles.forEach(p => {
                    ctx.globalAlpha = p.alpha;
                    ctx.font = `${Math.round(p.size)}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💖', p.x, p.y);
                });
                ctx.restore();
            }

            // 5. Hiển thị Nút bấm Prompt 3D cơ khí khi người chơi đứng gần Ghế hoặc Cô Giáo
            if (player) {
                // Gần Cô Giáo
                const distToTeacher = Math.hypot(player.x - this.teacherX, player.y - this.teacherY);
                if (distToTeacher < this.teacherRadius + 20) {
                    if (window.drawWorldPromptBadge) {
                        const promptTxt = this.hasReceivedFlowers 
                            ? '[E] Trò Chuyện Cùng Cô Giáo 🌸' 
                            : '[E] Kính Chúc & Tặng Hoa Cô Giáo 💐';
                        window.drawWorldPromptBadge(ctx, this.teacherX, this.teacherY - 120, promptTxt, {
                            theme: 'ruby'
                        });
                    }
                }

                // Gần Ghế Học Sinh (Vùng màu đỏ)
                if (this.activeChair && window.drawWorldPromptBadge) {
                    window.drawWorldPromptBadge(ctx, this.activeChair.x, this.activeChair.y - 42, '[E] Ngồi Ôn Tập & Đố Vui 20/11 📖', {
                        theme: 'gold'
                    });
                }

                // Gần Cửa Ra Sân Trường
                if (player.y > 620 && player.x > 560 && player.x < 720) {
                    if (window.drawWorldPromptBadge) {
                        window.drawWorldPromptBadge(ctx, 640, 620, '[E] Ra Sân Trường TNU 🏛️', {
                            theme: 'royal'
                        });
                    }
                }
            }
        }

        renderTeacher(ctx, player) {
            ctx.save();

            // Hiệu ứng thở nhẹ nhàng (Breathing idle)
            const bob = Math.sin(this.globalTime * 3) * 2;
            const img = this.hasReceivedFlowers ? this.teacherHappyImg : this.teacherNormalImg;

            // Bóng đổ mềm dưới chân Cô Giáo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
            ctx.beginPath();
            ctx.ellipse(this.teacherX, this.teacherY + 10, 28, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ Sprite Cô Giáo
            if (img && img.complete && img.naturalWidth > 0) {
                const drawW = this.hasReceivedFlowers ? 88 : 68;
                const drawH = 118;
                ctx.drawImage(
                    img, 
                    this.teacherX - drawW / 2, 
                    this.teacherY - drawH + 12 + bob, 
                    drawW, 
                    drawH
                );
            } else {
                // Fallback chữ
                ctx.font = '54px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(this.hasReceivedFlowers ? '💐👩‍🏫' : '👩‍🏫', this.teacherX, this.teacherY + 10);
            }

            // Thanh tên Cô Giáo trang trọng
            const namePlateY = this.teacherY - 122 + bob;
            ctx.font = 'bold 12.5px "Patrick Hand", "Nunito", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const nameText = this.hasReceivedFlowers ? '💖 Cô Mai Hoa (Đã nhận hoa) 💐' : '👩‍🏫 Cô Mai Hoa (Giảng Viên)';
            const textWidth = ctx.measureText(nameText).width;
            const plateW = textWidth + 24;
            const plateH = 24;

            ctx.fillStyle = 'rgba(251, 246, 217, 0.96)';
            ctx.strokeStyle = '#7c6348';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(this.teacherX - plateW / 2, namePlateY - plateH / 2, plateW, plateH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#3b200b';
            ctx.fillText(nameText, this.teacherX, namePlateY + 1);

            ctx.restore();
        }

        handleInteract(player) {
            if (!player) return false;

            // 1. Tương tác với Cô Giáo
            const distToTeacher = Math.hypot(player.x - this.teacherX, player.y - this.teacherY);
            if (distToTeacher < this.teacherRadius + 20) {
                this.openTeacherDialogue();
                return true;
            }

            // 2. Tương tác với Ghế Đố Vui 20/11
            if (this.activeChair) {
                this.openQuizModal();
                return true;
            }

            return false;
        }

        openTeacherDialogue() {
            if (!window.uiManager) return;

            // Đồng bộ avatar theo frame hiện tại
            this.teacherNpc.avatar = this.hasReceivedFlowers 
                ? 'assets/classroom/teacher_female_happy.png' 
                : 'assets/classroom/teacher_female_normal.png';

            if (this.hasReceivedFlowers) {
                this.teacherNpc.speech = 'Cảm ơn em rất nhiều vì bó hoa tươi thắm này! Cô rất xúc động trước tấm lòng của các em sinh viên Tây Nguyên. Chúc em luôn chăm ngoan, học giỏi và vững bước trên con đường tương lai nhé! 💖';
            } else {
                this.teacherNpc.speech = 'Chào em sinh viên thân mến! Nhân dịp Ngày Nhà Giáo Việt Nam 20/11, cô chúc các em luôn nuôi dưỡng niềm đam mê học hỏi, sáng tạo công nghệ và không ngừng tiến bước!';
            }

            window.uiManager.openDialogueModal(this.teacherNpc);

            // Bổ sung các nút hành động đặc biệt cho Cô Giáo Lớp Học
            setTimeout(() => {
                const actionsEl = document.getElementById('dialogue-actions');
                if (!actionsEl) return;

                // Nút tặng Bó Hoa Hồng (Nếu chưa tặng)
                if (!this.hasReceivedFlowers) {
                    const flowerBtn = document.createElement('button');
                    flowerBtn.className = 'btn-dialogue-card btn-dialogue-rose';
                    flowerBtn.innerHTML = `
                        <span class="flex items-center gap-2 text-left">
                            <img src="assets/ui/icons/rose_normal.png" class="w-5 h-5 object-contain inline-block shrink-0" alt="Hoa" onerror="this.outerHTML='🌹'"/>
                            <span>💐 Kính Tặng Cô Bó Hoa Hồng (Đổi Frame Rạng Rỡ)</span>
                        </span>
                        <span class="dialogue-reward-badge rose">+35 Thiện Cảm 💖</span>
                    `;
                    flowerBtn.onclick = () => {
                        if (window.useGameStore && window.useGameStore.hasItem('bo_hoa_hong', 1)) {
                            window.useGameStore.removeItem('bo_hoa_hong', 1);
                            window.useGameStore.addAffection(35);
                            window.useGameStore.addItem('student_coins', 100);
                            this.setTeacherGiftReceived(true);

                            if (window.soundSystem) window.soundSystem.playUnlockFanfare();
                            if (window.uiManager) {
                                window.uiManager.showToast('💐 Cô Mai Hoa xúc động đón nhận bó hoa và nở nụ cười rạng rỡ! (+35 Thiện Cảm & +100 Xu)', 'success');
                                window.uiManager.closeAllModals();
                            }
                        } else {
                            if (window.uiManager) {
                                window.uiManager.showToast('Balo chưa có Bó Hoa Hồng! Hãy sang Bàn Gói Quà [G] hoặc Vườn Hoa để thu thập nhé!', 'error');
                            }
                        }
                    };
                    actionsEl.prepend(flowerBtn);
                }

                // Nút vào bàn làm câu đố 20/11
                const quizBtn = document.createElement('button');
                quizBtn.className = 'btn-dialogue-card btn-dialogue-quest';
                quizBtn.innerHTML = `
                    <span class="flex items-center gap-2 text-left">
                        <span>📖</span>
                        <span>Dạ thưa Cô, em xin phép vào bàn ôn tập Câu hỏi 20/11!</span>
                    </span>
                    <span class="dialogue-reward-badge quest">Đố Vui 20/11 🎓</span>
                `;
                quizBtn.onclick = () => {
                    if (window.uiManager) window.uiManager.closeAllModals();
                    this.openQuizModal();
                };
                actionsEl.appendChild(quizBtn);
            }, 50);
        }

        // ========================================================
        // HỆ THỐNG MODAL ĐỐ VUI 20/11 (VINTAGE BEIGE COMIC STYLE)
        // ========================================================
        ensureQuizModal() {
            let modal = document.getElementById('classroom-quiz-modal');
            if (modal) return;

            modal = document.createElement('div');
            modal.id = 'classroom-quiz-modal';
            modal.className = 'modal-overlay';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-box modal-box-beige w-[720px] max-w-[95vw] max-h-[92vh] flex flex-col shadow-2xl font-quest">
                    <!-- Header -->
                    <div class="modal-header-beige shrink-0 flex items-center justify-between">
                        <div class="flex items-center space-x-2.5">
                            <span class="text-2xl drop-shadow">🏫</span>
                            <div>
                                <h3 class="text-lg font-bold text-[#3b200b]">Góc Học Tập & Đố Vui Tri Ân 20/11</h3>
                                <p class="text-xs text-[#7c6348]">Trường Đại Học Tây Nguyên - Ngày Nhà Giáo Việt Nam</p>
                            </div>
                        </div>
                        <button class="quest-modal-close-btn font-quest cursor-pointer" onclick="window.classroomManager.closeQuizModal()">&times;</button>
                    </div>

                    <!-- Body -->
                    <div class="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
                        <!-- Progress banner -->
                        <div class="flex items-center justify-between px-4 py-2.5 bg-[#f5ebd2] rounded-xl border border-[#7c6348]/40 text-xs font-bold text-[#4a3520]">
                            <span id="quiz-question-counter">Câu hỏi 1 / 10</span>
                            <span class="text-amber-800">🎁 Thưởng: +20 Xu Sinh Viên & +10 Thiện Cảm khi đúng</span>
                        </div>

                        <!-- Question Box -->
                        <div class="dialogue-speech-box p-4 text-base font-bold text-[#2d1804] leading-relaxed bg-[#fffdf8]" id="quiz-question-text">
                            Đang tải câu hỏi...
                        </div>

                        <!-- Choices Grid -->
                        <div class="grid grid-cols-1 gap-2.5" id="quiz-choices-container">
                            <!-- Injected dynamically -->
                        </div>

                        <!-- Feedback / Explanation Box -->
                        <div id="quiz-feedback-box" class="p-3.5 rounded-xl border text-xs font-bold leading-relaxed" style="display: none;">
                        </div>
                    </div>

                    <!-- Footer actions (Pinned at bottom) -->
                    <div class="p-3.5 sm:px-5 border-t border-[#7c6348]/30 flex items-center justify-between bg-[#fbf6ea] shrink-0 rounded-b-2xl">
                        <button id="quiz-leave-btn" class="px-4 py-2.5 bg-[#f4ebe1] hover:bg-[#e8dcce] active:scale-95 text-[#4a3520] border-2 border-[#7c6348] rounded-xl text-xs sm:text-sm font-bold font-quest transition-all shadow-sm cursor-pointer flex items-center gap-1.5" onclick="window.classroomManager.closeQuizModal()">
                            🚪 Đứng Dậy Rời Bàn
                        </button>
                        <button id="quiz-next-btn" class="quest-image2-btn font-quest text-xs sm:text-sm font-bold py-2.5 px-6 shadow-md transition-all cursor-pointer flex items-center gap-2" style="display: none;" onclick="window.classroomManager.nextQuestion()">
                            <span>Câu Tiếp Theo ➔</span>
                        </button>
                    </div>
                </div>
            `;

            // Click ngoài overlay để đóng
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeQuizModal();
                }
            });

            document.body.appendChild(modal);
        }

        openQuizModal() {
            this.ensureQuizModal();
            const modal = document.getElementById('classroom-quiz-modal');
            if (!modal) return;

            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.classList.add('modal-visible');

            // Bắt đầu từ câu ngẫu nhiên
            this.currentQuestionIdx = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
            this.hasAnswered = false;
            this.selectedAnswer = null;

            this.renderCurrentQuestion();

            if (window.uiManager && typeof window.uiManager.openModal === 'function') {
                window.uiManager.openModal(modal);
            }
        }

        closeQuizModal() {
            const modal = document.getElementById('classroom-quiz-modal');
            if (modal) {
                modal.classList.remove('active');
                modal.classList.remove('modal-visible');
                modal.style.display = 'none';
            }
            if (window.uiManager && typeof window.uiManager.closeAllModals === 'function') {
                window.uiManager.closeAllModals();
            }

            // Di chuyển nhân vật bước nhẹ ra lối đi (rời khỏi ghế về hành lang giữa x: 640)
            if (window.gameInstance && window.gameInstance.player) {
                const p = window.gameInstance.player;
                p.x = 640;
                if (p.y < 350) p.y = 265;
                else if (p.y < 480) p.y = 440;
                else p.y = 580;
            }

            this.activeChair = null;
            this.lastSteppedChairId = null;
            this.justClosedCooldown = 2.0; // Cooldown 2s không tự mở lại

            if (window.soundSystem && typeof window.soundSystem.playStep === 'function') {
                window.soundSystem.playStep();
            }
        }

        renderCurrentQuestion() {
            const qData = QUIZ_QUESTIONS[this.currentQuestionIdx];
            if (!qData) return;

            const counterEl = document.getElementById('quiz-question-counter');
            const textEl = document.getElementById('quiz-question-text');
            const choicesEl = document.getElementById('quiz-choices-container');
            const feedbackEl = document.getElementById('quiz-feedback-box');
            const nextBtn = document.getElementById('quiz-next-btn');

            if (counterEl) counterEl.innerText = `Câu số ${this.currentQuestionIdx + 1} / ${QUIZ_QUESTIONS.length}`;
            if (textEl) textEl.innerText = qData.q;
            if (feedbackEl) {
                feedbackEl.style.display = 'none';
                feedbackEl.className = 'p-3.5 rounded-xl border text-xs font-bold leading-relaxed';
                feedbackEl.innerText = '';
            }
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }

            this.hasAnswered = false;
            choicesEl.innerHTML = '';

            const prefixes = ['A', 'B', 'C', 'D'];
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'w-full p-3 bg-[#ffffff] hover:bg-[#fff9e6] border-2 border-[#7c6348] rounded-xl text-left font-quest text-sm font-bold text-[#3b2512] transition-all flex items-center justify-between shadow-sm group cursor-pointer';
                btn.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-[#fbf6d9] border border-[#7c6348] flex items-center justify-center text-xs text-[#8c3b12] group-hover:bg-[#fde047]">${prefixes[idx]}</span>
                        <span>${opt}</span>
                    </div>
                    <span class="opacity-0 group-hover:opacity-100 text-xs text-amber-700">Chọn ➔</span>
                `;
                btn.onclick = () => this.handleAnswer(idx);
                choicesEl.appendChild(btn);
            });
        }

        handleAnswer(choiceIdx) {
            if (this.hasAnswered) return;
            this.hasAnswered = true;

            const qData = QUIZ_QUESTIONS[this.currentQuestionIdx];
            const isCorrect = (choiceIdx === qData.correct);

            const choicesEl = document.getElementById('quiz-choices-container');
            const buttons = choicesEl.querySelectorAll('button');
            const feedbackEl = document.getElementById('quiz-feedback-box');
            const nextBtn = document.getElementById('quiz-next-btn');

            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                btn.classList.remove('cursor-pointer');
                if (idx === qData.correct) {
                    btn.className = 'w-full p-3 bg-[#dcfce7] border-2 border-[#16a34a] rounded-xl text-left font-quest text-sm font-bold text-[#14532d] shadow flex items-center justify-between';
                    btn.innerHTML += '<span class="text-sm font-bold text-[#15803d]">✅ ĐÚNG</span>';
                } else if (idx === choiceIdx && !isCorrect) {
                    btn.className = 'w-full p-3 bg-[#fee2e2] border-2 border-[#dc2626] rounded-xl text-left font-quest text-sm font-bold text-[#7f1d1d] shadow flex items-center justify-between';
                    btn.innerHTML += '<span class="text-sm font-bold text-[#b91c1c]">❌ SAI</span>';
                } else {
                    btn.className = 'w-full p-3 bg-[#f3f4f6] border border-[#d1d5db] rounded-xl text-left font-quest text-sm text-[#9ca3af] opacity-60';
                }
            });

            if (feedbackEl) {
                feedbackEl.style.display = 'block';
                if (isCorrect) {
                    feedbackEl.className = 'p-3.5 bg-[#dcfce7] border-2 border-[#16a34a] rounded-xl text-xs font-bold text-[#14532d] leading-relaxed block';
                    feedbackEl.innerHTML = `🎉 <b>CHÍNH XÁC!</b> ${qData.explain}<br><span class="text-emerald-700 font-extrabold mt-1 inline-block">🎁 Thưởng: +20 Xu Sinh Viên & +10 Điểm Thiện Cảm!</span>`;
                    
                    // Thưởng điểm an toàn tuyệt đối
                    try {
                        if (window.useGameStore && typeof window.useGameStore.addItem === 'function') {
                            window.useGameStore.addItem('student_coins', 20);
                        }
                        if (window.useGameStore && typeof window.useGameStore.addAffection === 'function') {
                            window.useGameStore.addAffection(10);
                        }
                    } catch (e) {
                        console.warn('Lỗi thưởng điểm:', e);
                    }

                    // Âm thanh an toàn tuyệt đối
                    try {
                        if (window.soundSystem) {
                            if (typeof window.soundSystem.playClawSuccess === 'function') {
                                window.soundSystem.playClawSuccess();
                            } else if (typeof window.soundSystem.playAffectionGain === 'function') {
                                window.soundSystem.playAffectionGain();
                            }
                        }
                    } catch (e) {
                        console.warn('Lỗi âm thanh:', e);
                    }
                } else {
                    feedbackEl.className = 'p-3.5 bg-[#fef2f2] border-2 border-[#ef4444] rounded-xl text-xs font-bold text-[#991b1b] leading-relaxed block';
                    feedbackEl.innerHTML = `💡 <b>CHƯA CHÍNH XÁC!</b> ${qData.explain}<br><span class="text-amber-800 font-extrabold mt-1 inline-block">Hãy tiếp tục ôn tập câu sau để nhận thưởng nhé!</span>`;
                }
            }

            // Hiện nút "Câu Tiếp Theo ➔"
            if (nextBtn) {
                nextBtn.style.display = 'inline-flex';
            }
        }

        nextQuestion() {
            this.currentQuestionIdx = (this.currentQuestionIdx + 1) % QUIZ_QUESTIONS.length;
            this.renderCurrentQuestion();
        }
    }

    // Khởi tạo Singleton ClassroomManager
    window.ClassroomManager = ClassroomManager;
    window.classroomManager = new ClassroomManager();

    // Hook vào GameEngine prototype
    if (window.GameEngine) {
        // 1. Hook phương thức vẽ Map 5
        window.GameEngine.prototype.drawMap5_Classroom = function(ctx) {
            if (window.classroomManager) {
                window.classroomManager.render(ctx, this.player);
            }
        };

        // 2. Hook phương thức update chính
        const originalUpdate = window.GameEngine.prototype.update;
        window.GameEngine.prototype.update = function(dt) {
            if (originalUpdate) originalUpdate.call(this, dt);
            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map5_classroom' && window.classroomManager) {
                window.classroomManager.update(dt, this.player);
            }
        };

        // 3. Hook phương thức tương tác handleInteract
        const originalHandleInteract = window.GameEngine.prototype.handleInteract;
        window.GameEngine.prototype.handleInteract = function() {
            const currentMapId = window.useGameStore ? window.useGameStore.state.currentMapId : 'map1_tnu';
            if (currentMapId === 'map5_classroom' && window.classroomManager) {
                const handled = window.classroomManager.handleInteract(this.player);
                if (handled) return;
            }
            if (originalHandleInteract) originalHandleInteract.call(this);
        };
    }

})(window);
