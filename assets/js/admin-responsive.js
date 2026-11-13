/* Mobile navigation only; authentication and dashboard data stay in admin.html. */
(() => {
    const sidebar = document.getElementById('admin-sidebar');
    const openButton = document.getElementById('admin-nav-open');
    const closeButton = document.getElementById('admin-nav-close');
    const backdrop = document.getElementById('admin-nav-backdrop');
    const main = document.querySelector('#dashboard-section main');
    const mobile = window.matchMedia('(max-width: 1023px)');
    let previousFocus;
    let previousOverflow = '';
    let isOpen = false;

    function setOpen(open, restoreFocus = true) {
        const next = Boolean(open && mobile.matches);
        if (next && !isOpen) {
            previousFocus = document.activeElement;
            previousOverflow = document.body.style.overflow;
        }
        document.body.classList.toggle('admin-nav-visible', next);
        backdrop.hidden = !next;
        openButton.setAttribute('aria-expanded', String(next));
        sidebar.inert = mobile.matches && !next;
        main.inert = next;
        if (next) document.body.style.overflow = 'hidden';
        else if (isOpen) document.body.style.overflow = previousOverflow;
        const wasOpen = isOpen;
        isOpen = next;
        if (next) closeButton.focus();
        else if (wasOpen && restoreFocus) (previousFocus || openButton).focus();
    }
    openButton.addEventListener('click', () => setOpen(true));
    closeButton.addEventListener('click', () => setOpen(false));
    backdrop.addEventListener('click', () => setOpen(false));
    sidebar.addEventListener('click', event => {
        if (event.target.closest('.nav-item, a, button[onclick="logout()"]')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (!isOpen) return;
        if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
        if (event.key === 'Tab') {
            const controls = [...sidebar.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
                .filter(element => !element.disabled && element.getClientRects().length);
            const first = controls[0], last = controls[controls.length - 1];
            if (!first) return;
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    mobile.addEventListener('change', () => setOpen(false));
    setOpen(false, false);
    document.querySelectorAll('.view-section table').forEach(table => {
        const parent = table.parentElement;
        parent.classList.add('admin-table-scroll');
        parent.tabIndex = 0;
        parent.setAttribute('role', 'region');
        parent.setAttribute('aria-label', 'جدول بيانات، مرّر أفقيًا لعرض باقي الأعمدة');
    });
})();
