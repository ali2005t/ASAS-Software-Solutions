// Global ASAS Custom Toast Notifications
window.showToast = function(message, type = "success") {
    // Ensure container exists
    let container = document.getElementById('asas-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'asas-toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            direction: rtl;
        `;
        document.body.appendChild(container);
    }

    // Play Bell Sound (Soft, non-intrusive base64 ding)
    try {
        const osc = new (window.AudioContext || window.webkitAudioContext)();
        const o = osc.createOscillator();
        const g = osc.createGain();
        o.type = 'sine';
        o.frequency.value = 830.6; // G5
        g.gain.exponentialRampToValueAtTime(0.00001, osc.currentTime + 1.5);
        o.connect(g);
        g.connect(osc.destination);
        o.start(0);
        o.stop(osc.currentTime + 1.5);
    } catch(e) {}

    // Create Toast Element
    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    
    toast.style.cssText = `
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border-right: 4px solid ${isSuccess ? '#10b981' : (type==='error' ? '#ef4444' : '#3b82f6')};
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        border-left: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
        opacity: 0;
    `;

    const icon = document.createElement('i');
    icon.className = isSuccess ? 'fas fa-check-circle text-emerald-500' : (type==='error' ? 'fas fa-exclamation-circle text-red-500' : 'fas fa-info-circle text-blue-500');
    icon.style.cssText = `
        font-size: 20px;
        color: ${isSuccess ? '#10b981' : (type==='error' ? '#ef4444' : '#3b82f6')};
    `;

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

// Override native alert to use our custom toast
window.alert = function(msg) {
    if (msg.includes("خطأ") || msg.includes("Error") || msg.includes("فشل") || msg.includes("لا يكفي")) {
        window.showToast(msg, "error");
    } else {
        window.showToast(msg, "success");
    }
};
