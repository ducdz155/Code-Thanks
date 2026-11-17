/**
 * AUDIO SYSTEM (Web Audio API Synthesizer)
 * Tự động tổng hợp âm thanh hiệu ứng (SFX) và giai điệu nhạc nền (BGM)
 * Chạy 100% độc lập không cần file bên ngoài, không lo lỗi CORS.
 */

class SoundSystem {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.currentTrack = 'campus'; // campus, garden, arcade, boutique
        this.bgmAudio = null;
        this.bgmVolume = 0.20; // Giảm âm lượng vừa êm dịu (20%), không chói tai, phù hợp trải nghiệm game
        this.audioSrc = 'assets/audio/bgm_main.m4a';
        this.unlocked = false;

        this.setupAutoplayUnlock();
    }

    // Tự động lắng nghe cử chỉ tương tác đầu tiên để vượt qua chính sách Autoplay của trình duyệt
    setupAutoplayUnlock() {
        const unlock = () => {
            if (this.unlocked) return;
            this.unlocked = true;
            this.init();
            if (!this.isMuted && (!this.bgmAudio || this.bgmAudio.paused)) {
                this.playBGM(this.currentTrack);
            }
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('pointerdown', unlock, { once: true, passive: true });
        window.addEventListener('keydown', unlock, { once: true, passive: true });
        window.addEventListener('touchstart', unlock, { once: true, passive: true });
        window.addEventListener('click', unlock, { once: true, passive: true });
    }

    initBGM() {
        if (!this.bgmAudio) {
            try {
                this.bgmAudio = new Audio(this.audioSrc);
                this.bgmAudio.loop = true;
                this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
                this.bgmAudio.preload = 'auto';
            } catch (e) {
                console.warn('Lỗi khởi tạo HTML5 Audio:', e);
            }
        }
    }

    // Khởi tạo AudioContext khi người chơi tương tác đầu tiên
    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        this.initBGM();
    }

    setVolume(vol) {
        this.bgmVolume = Math.max(0, Math.min(1, vol));
        if (this.bgmAudio && !this.isMuted) {
            this.bgmAudio.volume = this.bgmVolume;
        }
    }

    updateSoundIcons() {
        // Cập nhật tất cả icon hình ảnh (#sound-icon-img)
        const soundImgs = document.querySelectorAll('#sound-icon-img, .sound-icon-img');
        soundImgs.forEach(img => {
            img.src = this.isMuted ? 'assets/ui/icons/sound_muted.png' : 'assets/ui/icons/sound_normal.png';
            img.classList.add('icon-pop-spring');
            setTimeout(() => img.classList.remove('icon-pop-spring'), 450);
        });

        // Cập nhật các icon dạng text/emoji
        const soundSpans = document.querySelectorAll('#sound-icon, .sound-icon-text');
        soundSpans.forEach(span => {
            span.innerText = this.isMuted ? '🔇' : '🔊';
        });

        // Cập nhật title tooltip trên các nút bấm âm thanh
        const soundBtns = document.querySelectorAll('#btn-toggle-sound');
        soundBtns.forEach(btn => {
            btn.title = this.isMuted 
                ? 'Bật Âm Thanh (Đang tắt)' 
                : `Tắt Âm Thanh (Đang phát - Âm lượng ${Math.round(this.bgmVolume * 100)}%)`;
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.init();

        if (this.isMuted) {
            this.stopBGM();
            if (window.uiManager && typeof window.uiManager.showToast === 'function') {
                window.uiManager.showToast('🔇 Đã tắt nhạc nền và hiệu ứng âm thanh', 'info');
            }
        } else {
            this.playBGM(this.currentTrack);
            if (window.uiManager && typeof window.uiManager.showToast === 'function') {
                window.uiManager.showToast(`🔊 Đã bật nhạc nền (Âm lượng ${Math.round(this.bgmVolume * 100)}%)`, 'success');
            }
        }

        this.updateSoundIcons();
        return this.isMuted;
    }

    // Phát âm thanh tiếng bước chân
    playStep() {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Tiếng nhặt vật phẩm rải rác
    playPickup() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Tiếng hái hoa hồng thường
    playHarvestRose() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25]; // C5, E5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    // Tiếng hái hoa hồng trắng quý hiếm (Hiệu ứng lấp lánh thần tiên)
    playHarvestRareRose() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + i * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }

    // Tiếng máy gắp thú hạ càng / di chuyển
    playClawMove() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(160, now + 0.04);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Tiếng máy gắp thú thành công
    playClawSuccess() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.1;

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.18);
        });
    }

    // Tiếng bắn súng minigame
    playGunShot() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;

        // Noise buffer cho tiếng nổ pop
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start(now);
    }

    // Tiếng bắn trúng bia
    playTargetHit() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Tiếng ghép Bó hoa hồng thành công (Hoành tráng)
    playCraftSuccess() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.35 } // C6
        ];
        let accTime = now;
        melody.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, accTime);

            gain.gain.setValueAtTime(0.22, accTime);
            gain.gain.exponentialRampToValueAtTime(0.01, accTime + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(accTime);
            osc.stop(accTime + item.d);
            accTime += item.d;
        });
    }

    // Tiếng tặng hoa cho Giáo viên & nhận điểm thiện cảm
    playGiftGiven() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.1;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.4);
        });
    }

    // Tiếng mở khóa 100 điểm thiện cảm / Mở khóa cửa hàng
    playUnlockFanfare() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const fanfare = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 523.25, t: 0.15, d: 0.15 },
            { f: 523.25, t: 0.30, d: 0.15 },
            { f: 659.25, t: 0.45, d: 0.3 },
            { f: 587.33, t: 0.75, d: 0.15 },
            { f: 659.25, t: 0.90, d: 0.15 },
            { f: 783.99, t: 1.05, d: 0.6 }
        ];
        fanfare.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + item.t;

            osc.type = 'square';
            osc.frequency.setValueAtTime(item.f, startTime);

            gain.gain.setValueAtTime(0.16, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + item.d);
        });
    }

    // Tiếng đổi trang phục
    playOutfitChange() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Tiếng mở cửa sổ / Balo / Tủ đồ
    playModalOpen() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Alias cho playPickup / playWarp
    playPickItem() { this.playPickup(); }
    playAffectionGain() { this.playGiftGiven(); }
    playWarp() { this.playPortalWarp(); }

    // Tiếng chuyển cổng dịch chuyển Portal
    playPortalWarp() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Nhạc nền BGM: Ưu tiên phát file nhạc gốc cực hay, lặp vô tận, âm lượng dịu dàng
    playBGM(track = 'campus') {
        this.currentTrack = track;
        if (this.isMuted) return;

        this.initBGM();

        // 1. Phát file nhạc nền âm thanh thực tế (m4a)
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.bgmVolume;
            if (this.bgmAudio.paused) {
                const playPromise = this.bgmAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.bgmPlaying = true;
                    }).catch(err => {
                        console.log('Chờ người chơi tương tác để phát BGM:', err.message);
                    });
                }
            } else {
                this.bgmPlaying = true;
            }
            return;
        }

        // 2. Fallback sang Web Audio Synthesizer nếu file âm thanh chưa sẵn sàng
        if (!this.ctx) return;
        this.stopBGM();
        this.bgmPlaying = true;

        let noteIndex = 0;
        // Bảng hợp âm giai điệu êm dịu cho 4 bản đồ
        let melody = [];
        if (track === 'campus') {
            // Giai điệu học đường tươi sáng, trong trẻo
            melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23];
        } else if (track === 'garden') {
            // Giai điệu vườn hoa lãng mạn, thanh thoát
            melody = [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00];
        } else if (track === 'arcade') {
            // Giai điệu trò chơi 8-bit rộn ràng
            melody = [440.00, 554.37, 659.25, 880.00, 659.25, 554.37, 493.88, 622.25, 739.99, 987.77, 739.99, 622.25];
        } else {
            // Boutique & Workshop ấm cúng
            melody = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 220.00, 277.18, 329.63, 440.00, 329.63, 277.18];
        }

        const playNextNote = () => {
            if (!this.bgmPlaying || this.isMuted || !this.ctx) return;
            const freq = melody[noteIndex % melody.length];
            noteIndex++;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = track === 'arcade' ? 'square' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.025, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.38);

            this.bgmTimer = setTimeout(playNextNote, 420);
        };

        playNextNote();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

// Khởi tạo Singleton Audio
window.soundSystem = new SoundSystem();
