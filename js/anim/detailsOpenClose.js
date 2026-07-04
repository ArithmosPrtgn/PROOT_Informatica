document.querySelectorAll('details.subjectSelection').forEach(el => {
    el.addEventListener('click', e => {
        if (!e.target.closest('summary')) return;
        if (!el.open) return;
        e.preventDefault();
        el.classList.add('is-closing');
        el.addEventListener('transitionend', () => {
            el.classList.remove('is-closing');
            el.removeAttribute('open');
        }, { once: true });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggleContent').forEach((button) => {
        button.addEventListener('click', () => {
            const calloutBox = button.closest('.calloutBox');
            if (calloutBox) {
                calloutBox.classList.toggle('collapsed');
            }
        });
    });
});
 