export function parseVideoUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    let url;
    try { url = new URL(raw); } catch { throw new Error('أدخل رابط فيديو كامل وصحيح.'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('استخدم رابط فيديو آمن يبدأ بـ https://');
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
        id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    }
    if (id && /^[\w-]{11}$/.test(id)) return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}`, url: url.href };
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
        const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
        if (match) {
            const hash = match[2] || url.searchParams.get('h');
            const player = new URL(`https://player.vimeo.com/video/${match[1]}`);
            if (hash) player.searchParams.set('h', hash);
            return { type: 'iframe', src: player.href, url: url.href };
        }
    }
    if (/\.(mp4|webm)$/i.test(url.pathname)) return { type: 'video', src: url.href, url: url.href };
    throw new Error('استخدم رابط YouTube أو Vimeo أو رابط ملف MP4 / WebM مباشر.');
}

export function renderVideo(container, value, title) {
    container.replaceChildren();
    container.hidden = true;
    let source;
    try { source = parseVideoUrl(value); } catch (error) { console.warn(error.message); return false; }
    if (!source) return false;
    const player = document.createElement(source.type);
    player.src = source.src;
    player.className = 'asas-video-player';
    if (source.type === 'iframe') {
        player.title = title;
        player.loading = 'lazy';
        player.allow = 'fullscreen; picture-in-picture; encrypted-media';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
    } else {
        player.controls = true;
        player.playsInline = true;
        player.preload = 'metadata';
        player.setAttribute('aria-label', title);
    }
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'فتح الفيديو في صفحة مستقلة';
    container.append(player, link);
    container.hidden = false;
    return true;
}
