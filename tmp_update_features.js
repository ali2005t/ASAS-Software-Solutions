const fs = require('fs');

try {
    let content = fs.readFileSync('admin.html', 'utf8');

    // 1. Add notification Bell UI
    content = content.replace(
        '<!-- Top Controls (Language Toggle) -->\r\n            <div class="relative z-20 flex justify-end mb-8">',
        `<!-- Top Audio For Notifications -->\r\n            <audio id="notification-sound" src="assets/audio/toast.mp3" preload="auto"></audio>\r\n            <!-- Top Controls -->\r\n            <div class="relative z-20 flex justify-end gap-3 mb-8">\r\n                <!-- Notification Bell -->\r\n                <button id="notification-bell" onclick="window.clearNotificationBadge()" class="relative bg-white/5 border border-white/5 w-10 h-10 rounded-xl text-slate-400 hover:text-cyan-500 hover:bg-white/10 transition-all flex items-center justify-center">\r\n                    <i class="fas fa-bell"></i>\r\n                    <span id="notification-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex flex-col items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">0</span>\r\n                </button>`
    );
    // fallback if CRLF doesn't match
    if (!content.includes('id="notification-bell"')) {
        content = content.replace(
            /<!-- Top Controls \(Language Toggle\) -->\s*<div class="relative z-20 flex justify-end mb-8">/,
            `<!-- Top Audio For Notifications -->\n            <audio id="notification-sound" src="assets/audio/toast.mp3" preload="auto"></audio>\n            <!-- Top Controls -->\n            <div class="relative z-20 flex justify-end gap-3 mb-8">\n                <!-- Notification Bell -->\n                <button id="notification-bell" onclick="window.clearNotificationBadge()" class="relative bg-white/5 border border-white/5 w-10 h-10 rounded-xl text-slate-400 hover:text-cyan-500 hover:bg-white/10 transition-all flex items-center justify-center">\n                    <i class="fas fa-bell"></i>\n                    <span id="notification-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex flex-col items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">0</span>\n                </button>`
        );
    }

    // 2. Add Badge JS logic
    const badgeJs = `
        window.notificationCount = 0;
        window.triggerRealtimeNotification = () => {
            const badge = document.getElementById('notification-badge');
            if(!badge) return;
            window.notificationCount++;
            badge.innerText = window.notificationCount;
            badge.classList.remove('hidden');
            try {
                const audio = document.getElementById('notification-sound');
                if(audio) audio.play().catch(e => console.log('Audio auto-play prevented'));
            } catch(e) {}
        };
        window.clearNotificationBadge = () => {
            window.notificationCount = 0;
            const badge = document.getElementById('notification-badge');
            if(badge) {
                badge.innerText = '0';
                badge.classList.add('hidden');
            }
        };\n\n`;

    // insert right before unsubLeads declarations
    content = content.replace(
        'let unsubLeads = null;',
        badgeJs + '        let unsubLeads = null;\n        let isInitialLeadsLoad = true;'
    );

    // 3. Update loadLeads
    content = content.replace(
        'unsubLeads = onSnapshot(query(collection(db, "leads"), orderBy("created_at", "desc")), (snap) => {',
        `unsubLeads = onSnapshot(query(collection(db, "leads"), orderBy("created_at", "desc")), (snap) => {
                if(!isInitialLeadsLoad) {
                    snap.docChanges().forEach(change => { if(change.type === 'added') window.triggerRealtimeNotification(); });
                }
                isInitialLeadsLoad = false;`
    );

    // 4. Update loadResellers
    content = content.replace(
        'window.loadResellers = () => {',
        'let isInitialResellersLoad = true;\n        window.loadResellers = () => {'
    );
    content = content.replace(
        'unsubResellers = onSnapshot(query(collection(db, "resellers"), orderBy("created_at", "desc")), (snap) => {',
        `unsubResellers = onSnapshot(query(collection(db, "resellers"), orderBy("created_at", "desc")), (snap) => {
                if(!isInitialResellersLoad) {
                    snap.docChanges().forEach(change => { if(change.type === 'added') window.triggerRealtimeNotification(); });
                }
                isInitialResellersLoad = false;`
    );

    // 5. Inject WhatsApp button for SOLD leads
    const targetSoldContent = `                    } else if (l.status === 'sold') {
                        actionBtn = \`
                            <div class="flex flex-col items-center gap-1">
                                <span class="text-xs text-emerald-500 font-bold">تم إنهاء العملية (\${l.commission_granted || 0} ج)</span>
                                \${l.activation_key ? \`<span class="text-[10px] text-cyan-500 font-mono border border-cyan-500/30 px-1 py-0.5 rounded bg-cyan-500/10">\${l.activation_key}</span>\` : ''}
                            </div>
                        \`;
                    } else {`;

    const newSoldContent = `                    } else if (l.status === 'sold') {
                        const msg = encodeURIComponent('أهلاً بك يا ' + l.name + '،\\nتم تفعيل المنظومة (' + l.business_type + ') بنجاح! 🎉\\n\\n🔑 كود التفعيل: ' + l.activation_key + '\\n\\nلأي مساعدة فنية نحن بخدمتك.\\nفريق ASAS Software Solutions');
                        let phoneNum = l.phone ? l.phone.replace(/\\D/g, '') : '';
                        if(phoneNum.startsWith('01')) phoneNum = '2' + phoneNum;
                        actionBtn = \`
                            <div class="flex flex-col items-center gap-1 w-full">
                                <span class="text-xs text-emerald-500 font-bold">تم إنهاء العملية (\${l.commission_granted || 0} ج)</span>
                                \${l.activation_key ? \`<span class="text-[10px] text-cyan-500 font-mono border border-cyan-500/30 px-1 py-0.5 rounded bg-cyan-500/10">\${l.activation_key}</span>\` : ''}
                                <a href="https://wa.me/\${phoneNum}?text=\${msg}" target="_blank" class="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] mt-1 transition flex items-center justify-center gap-1">
                                    <i class="fab fa-whatsapp text-sm"></i> إرسال للعميل واتس آب
                                </a>
                            </div>
                        \`;
                    } else {`;

    // fallback regex replacement ignoring exact whitespace
    content = content.replace(/} else if \(l\.status === 'sold'\) \{\s*actionBtn = `[\s\S]*?`;\s*\} else \{/, newSoldContent);

    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully updated admin.html');
} catch (e) {
    console.error('Error updating:', e);
}
