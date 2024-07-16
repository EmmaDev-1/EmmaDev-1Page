document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navPanel = document.getElementById('nav-panel');
    const panelClose = document.getElementById('panel-close');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    navbarToggle.addEventListener('click', function() {
        navPanel.classList.add('show');
        overlay.classList.add('show');
    });

    panelClose.addEventListener('click', function() {
        navPanel.classList.remove('show');
        overlay.classList.remove('show');
    });

    overlay.addEventListener('click', function() {
        navPanel.classList.remove('show');
        overlay.classList.remove('show');
    });

    navPanel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        navPanel.style.transition = 'none'; // Elimina la transición durante el arrastre
    });

    navPanel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const translateX = Math.min(0, currentX - startX);
        navPanel.style.transform = `translateX(${translateX}px)`;
    });

    navPanel.addEventListener('touchend', function() {
        isDragging = false;
        navPanel.style.transition = ''; // Restablece la transición
        navPanel.style.transform = ''; // Restablece la posición

        if (currentX - startX < -50) { // Si se arrastra más de 50px hacia la izquierda
            navPanel.classList.remove('show');
            overlay.classList.remove('show');
        }
    });

    document.addEventListener('click', function(e) {
        if (!navPanel.contains(e.target) && !navbarToggle.contains(e.target) && !isDragging) {
            navPanel.classList.remove('show');
            overlay.classList.remove('show');
        }
    });

    // Añadir event listeners para los enlaces de navegación
    const navLinks = navPanel.querySelectorAll('a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navPanel.classList.remove('show');
            overlay.classList.remove('show');
        });
    });
});
