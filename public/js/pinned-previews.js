window.addEventListener('scroll', function () {
    const leftSection = document.querySelector('.left-section');
    const rightSection = document.querySelector('.right-section');
    const mobileBreakpoint = 551;

    // Only apply this logic for mobile devices
    if (window.innerWidth <= mobileBreakpoint) {
        const leftSectionEnd = leftSection.offsetTop + leftSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition >= leftSectionEnd) {
            rightSection.classList.remove('pinned'); // Remove the pinned class
        } else {
            rightSection.classList.add('pinned'); // Add the pinned class
        }
    } else {
        // Reset styles for larger screens
        rightSection.classList.remove('pinned');
    }
});



function toggleMenu() {
    const menu = document.querySelector('.main-navigation .menu');
    menu.classList.toggle('open');
}

window.addEventListener('scroll', function () {
    const menu = document.querySelector('.main-navigation .menu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    }
});