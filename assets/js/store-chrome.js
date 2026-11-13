(() => {
    const body = document.body;
    const themeButton = document.getElementById('theme-toggle');
    const icon = themeButton.querySelector('i');
    const menu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-btn');
    const closeButton = document.getElementById('close-menu');
    const mobile = window.matchMedia('(max-width: 1023px)');
    let savedOverflow = '';
    let menuOpen = false;
    function updateTheme() {
        const light = body.classList.contains('light-mode');
        icon.classList.toggle('fa-sun', light);
        icon.classList.toggle('fa-moon', !light);
        themeButton.setAttribute('aria-pressed', String(light));
    }
    themeButton.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        updateTheme();
        try { localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark'); } catch {}
    });
    function setMenu(open) {
        const next = Boolean(open && mobile.matches);
        if (next && !menuOpen) savedOverflow = body.style.overflow;
        menu.classList.toggle('translate-x-full', !next);
        menu.inert = !next;
        menuButton.setAttribute('aria-expanded', String(next));
        if (next) { body.style.overflow = 'hidden'; closeButton.focus(); }
        else if (menuOpen) { body.style.overflow = savedOverflow; menuButton.focus(); }
        menuOpen = next;
    }
    menuButton.addEventListener('click', () => setMenu(!menuOpen));
    closeButton.addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
        if (!menuOpen) return;
        if (event.key === 'Escape') setMenu(false);
        if (event.key === 'Tab') {
            const controls = [closeButton, ...menu.querySelectorAll('a')];
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    mobile.addEventListener('change', () => setMenu(false));
    updateTheme();
    setMenu(false);
})();
