import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8088', 10);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = path.resolve(__dirname);
const DATA_DIR = path.join(ROOT, 'data');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

// MIME types dictionary
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.warn('Cannot create data dir:', e.message);
    }
}

// In-memory state
let wishes = [];
try {
    if (fs.existsSync(WISHES_FILE)) {
        wishes = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf-8'));
    }
} catch (e) {
    console.warn('Failed to load wishes.json:', e.message);
}

function saveWishesToFile() {
    try {
        fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
    } catch (e) {
        console.warn('Failed to save wishes.json:', e.message);
    }
}

// Connected players: Map<ws, PlayerData>
const clients = new Map();
const chatHistory = [];
const MAX_CHAT_HISTORY = 60;

// HTTP Server
const server = http.createServer((req, res) => {
    req.on('error', () => {});
    res.on('error', () => {});

    // Allow CORS for API calls
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let reqUrl;
    try {
        reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch {
        res.writeHead(400);
        res.end('Bad Request');
        return;
    }

    const pathname = decodeURIComponent(reqUrl.pathname);

    // API Routes
    if (pathname === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            onlinePlayers: clients.size,
            uptime: process.uptime(),
            timestamp: Date.now()
        }));
        return;
    }

    if (pathname === '/api/wishes' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ wishes }));
        return;
    }

    // Static File Serving
    let safePath = pathname;
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    const normalized = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT, normalized);

    // Security check: ensure path stays within ROOT
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // SPA fallback or 404
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        const mtime = stats.mtime.toUTCString();

        // 1. Kiểm tra Cache 304 Not Modified để tiết kiệm 100% băng thông khi tải lại
        if (req.headers['if-modified-since'] === mtime) {
            res.writeHead(304);
            res.end();
            return;
        }

        // 2. Hỗ trợ HTTP Range Requests cho toàn bộ định dạng âm thanh (.m4a, .mp4, .mp3, .wav, .ogg, .aac)
        const range = req.headers.range;
        const isAudioVideo = (ext === '.m4a' || ext === '.mp4' || ext === '.mp3' || ext === '.wav' || ext === '.ogg' || ext === '.aac');
        if (range && isAudioVideo) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const maxChunk = 512 * 1024; // Stream từng block 512KB để không làm nghẽn băng thông tải ảnh
            let end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + maxChunk, stats.size - 1);
            if (end >= stats.size) end = stats.size - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
                'Last-Modified': mtime,
                'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
            });

            const stream = fs.createReadStream(filePath, { start, end });
            stream.pipe(res);
            return;
        }

        // 3. Phục vụ tài nguyên tĩnh với Nén Gzip & Header Cache tốc độ cao
        const isCompressible = (ext === '.html' || ext === '.js' || ext === '.mjs' || ext === '.css' || ext === '.json' || ext === '.svg');
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const shouldGzip = isCompressible && acceptEncoding.includes('gzip');

        const cacheControl = ext === '.html'
            ? 'no-cache, must-revalidate'
            : (isCompressible 
                ? 'public, max-age=86400, stale-while-revalidate=3600' 
                : 'public, max-age=604800, stale-while-revalidate=86400');

        if (shouldGzip) {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Encoding': 'gzip',
                'Last-Modified': mtime,
                'Cache-Control': cacheControl,
                'Vary': 'Accept-Encoding'
            });
            const rawStream = fs.createReadStream(filePath);
            const gzipStream = zlib.createGzip({ level: 6 });
            rawStream.pipe(gzipStream).pipe(res);
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Last-Modified': mtime,
            'Cache-Control': cacheControl,
            'Accept-Ranges': 'bytes'
        });

        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
        });
        stream.pipe(res);
    });
});

// WebSocket Server
const wss = new WebSocketServer({ server });

function broadcast(data, excludeWs = null, targetMap = null) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    for (const [ws, player] of clients.entries()) {
        if (ws === excludeWs || ws.readyState !== WebSocket.OPEN) continue;
        if (targetMap && player.mapId !== targetMap) continue;
        try {
            ws.send(message);
        } catch (e) {
            console.warn('Broadcast send error:', e.message);
        }
    }
}

function getAllPlayers() {
    return Array.from(clients.values()).filter(p => !!p.id);
}

wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`[WS] Client connected from ${clientIp}. Total: ${clients.size + 1}`);

    // Temporary player data until 'join' message arrives
    const player = {
        id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: 'Sinh Viên TNU',
        badgeColor: '#f4a261',
        outfitId: 'outfit_1000',
        wingId: null,
        petId: null,
        hairStyle: 0,
        hairColor: '#4a2810',
        skinTone: '#ffe5d9',
        mapId: 'map1_tnu',
        x: 1725,
        y: 3062,
        direction: 'down',
        isMoving: false,
        animFrame: 0,
        animTimer: 0,
        lastSeen: Date.now()
    };
    clients.set(ws, player);

    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw);
            handleClientMessage(ws, data);
        } catch (e) {
            console.warn('[WS] Malformed packet:', e.message);
        }
    });

    ws.on('close', () => {
        const leavingPlayer = clients.get(ws);
        clients.delete(ws);
        if (leavingPlayer && leavingPlayer.id) {
            console.log(`[WS] Player ${leavingPlayer.name} (${leavingPlayer.id}) disconnected. Remaining: ${clients.size}`);
            broadcast({
                type: 'playerLeave',
                id: leavingPlayer.id,
                onlineCount: clients.size
            });
        }
    });

    ws.on('error', (err) => {
        console.warn('[WS] Socket error:', err.message);
    });
});

function handleClientMessage(ws, data) {
    const player = clients.get(ws);
    if (!player) return;

    player.lastSeen = Date.now();

    switch (data.type) {
        case 'join': {
            if (data.profile) {
                if (data.profile.name) player.name = data.profile.name;
                if (data.profile.outfitId) player.outfitId = data.profile.outfitId;
                if (data.profile.wingId !== undefined) player.wingId = data.profile.wingId;
                if (data.profile.petId !== undefined) player.petId = data.profile.petId;
                if (data.profile.hairStyle !== undefined) player.hairStyle = data.profile.hairStyle;
                if (data.profile.hairColor) player.hairColor = data.profile.hairColor;
                if (data.profile.skinTone) player.skinTone = data.profile.skinTone;
                if (data.profile.badgeColor) player.badgeColor = data.profile.badgeColor;
            }
            if (data.mapId) player.mapId = data.mapId;
            if (typeof data.x === 'number') player.x = data.x;
            if (typeof data.y === 'number') player.y = data.y;

            // 1. Send welcome packet to the new player
            const welcomePacket = {
                type: 'welcome',
                id: player.id,
                players: getAllPlayers(),
                wishes: wishes,
                chatHistory: chatHistory.slice(-40),
                onlineCount: clients.size
            };
            ws.send(JSON.stringify(welcomePacket));

            // 2. Announce new player to all existing players
            broadcast({
                type: 'playerJoin',
                player: { ...player },
                onlineCount: clients.size
            }, ws);

            console.log(`[WS] Player joined: "${player.name}" on ${player.mapId} (${clients.size} online)`);
            break;
        }

        case 'move': {
            if (typeof data.x === 'number') player.x = data.x;
            if (typeof data.y === 'number') player.y = data.y;
            if (data.direction) player.direction = data.direction;
            player.isMoving = !!data.isMoving;
            if (typeof data.animFrame === 'number') player.animFrame = data.animFrame;
            if (typeof data.animTimer === 'number') player.animTimer = data.animTimer;
            if (data.mapId) player.mapId = data.mapId;

            // Broadcast movement to all other players in the same map
            broadcast({
                type: 'playerMove',
                id: player.id,
                x: player.x,
                y: player.y,
                direction: player.direction,
                isMoving: player.isMoving,
                animFrame: player.animFrame,
                animTimer: player.animTimer,
                mapId: player.mapId
            }, ws, player.mapId);
            break;
        }

        case 'profile': {
            if (data.profile) {
                Object.assign(player, data.profile);
                broadcast({
                    type: 'playerProfile',
                    id: player.id,
                    profile: data.profile
                }, ws);
            }
            break;
        }

        case 'changeMap': {
            const oldMap = player.mapId;
            player.mapId = data.mapId;
            if (typeof data.x === 'number') player.x = data.x;
            if (typeof data.y === 'number') player.y = data.y;

            // Tell players on the old map that this player left that map
            broadcast({
                type: 'playerChangeMap',
                id: player.id,
                fromMap: oldMap,
                toMap: player.mapId,
                player: { ...player }
            }, ws);
            break;
        }

        case 'chat': {
            const text = (data.text || '').trim().substring(0, 300);
            if (!text) return;

            const chatMsg = {
                type: 'chat',
                id: player.id,
                sender: data.sender || player.name || 'Sinh Viên TNU',
                text: text,
                channel: data.channel || 'school',
                mapId: player.mapId,
                time: Date.now()
            };

            chatHistory.push(chatMsg);
            if (chatHistory.length > MAX_CHAT_HISTORY) chatHistory.shift();

            // Broadcast to everyone (or per-map depending on channel)
            broadcast(chatMsg);
            break;
        }

        case 'addWish': {
            if (!data.wish || !data.wish.content) return;
            const newWish = {
                id: 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                author: data.wish.author || player.name || 'Sinh viên TNU',
                target: data.wish.target || 'Quý Thầy Cô Đại Học Tây Nguyên',
                tag: data.wish.tag || 'Tri Ân 20/11',
                content: data.wish.content.substring(0, 500),
                likes: 0,
                color: data.wish.color || '#fff3b0',
                time: new Date().toLocaleDateString('vi-VN')
            };
            wishes.unshift(newWish);
            saveWishesToFile();

            broadcast({
                type: 'newWish',
                wish: newWish,
                authorName: newWish.author
            });
            break;
        }

        case 'likeWish': {
            const targetWish = wishes.find(w => w.id === data.wishId);
            if (targetWish) {
                targetWish.likes = (targetWish.likes || 0) + 1;
                saveWishesToFile();
                broadcast({
                    type: 'wishLiked',
                    wishId: targetWish.id,
                    likes: targetWish.likes
                });
            }
            break;
        }

        case 'ping': {
            try {
                ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            } catch {}
            break;
        }
    }
}

// Heartbeat ping interval to keep cloud proxies alive (Render, Glitch, Railway, Fly.io, etc.)
const interval = setInterval(() => {
    try {
        for (const [ws, player] of clients.entries()) {
            if (!ws || ws.readyState === 3 /* CLOSED */) {
                clients.delete(ws);
                continue;
            }
            if (!ws.isAlive) {
                const pName = player?.name || 'Unknown';
                const pId = player?.id || 'unknown';
                console.log(`[WS] Terminating inactive socket for ${pName} (${pId})`);
                clients.delete(ws);
                if (player && player.id) {
                    broadcast({
                        type: 'playerLeave',
                        id: player.id,
                        onlineCount: clients.size
                    });
                }
                try { ws.terminate(); } catch {}
                continue;
            }
            ws.isAlive = false;
            try {
                ws.ping();
            } catch {
                try { ws.terminate(); } catch {}
            }
        }
    } catch (e) {
        console.error('[WS Interval Error]', e.message);
    }
}, 25000);

wss.on('close', () => {
    clearInterval(interval);
});

// Guard against unhandled crashes
process.on('uncaughtException', (err) => {
    console.error('[SERVER ERROR] Uncaught exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[SERVER ERROR] Unhandled rejection at:', promise, 'reason:', reason);
});

// Start Server
server.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 TNU: ĐÔI CÁNH ĐẠI NGÀN - ONLINE MULTIPLAYER SERVER STARTED!`);
    console.log(`📍 Web & WebSocket Server: http://${HOST}:${PORT}`);
    console.log(`🌐 Local Link: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
