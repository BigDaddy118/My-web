(function () {
    "use strict";

    const sections = ['home', 'works', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.querySelector('.main-content');

    function updateActiveNav() {
        const scrollPos = mainContent.scrollTop;
        const viewHeight = mainContent.clientHeight;

        let activeIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const sectionEl = document.getElementById(sections[i]);
            if (!sectionEl) continue;
            const offsetTop = sectionEl.offsetTop;
            if (scrollPos + viewHeight / 3 >= offsetTop) {
                activeIndex = i;
            }
        }

        navLinks.forEach((link) => {
            const sectionAttr = link.getAttribute('data-section');
            if (sectionAttr === sections[activeIndex]) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    mainContent.addEventListener('scroll', updateActiveNav);

    // 滚轮整屏切换
    let isScrolling = false;
    mainContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const currentIndex = getCurrentSectionIndex();
        const targetIndex = Math.min(sections.length - 1, Math.max(0, currentIndex + direction));

        if (targetIndex !== currentIndex) {
            isScrolling = true;
            const targetSection = document.getElementById(sections[targetIndex]);
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(() => {
                isScrolling = false;
                updateActiveNav();
            }, 600);
        } else {
            isScrolling = false;
        }
    }, { passive: false });

    function getCurrentSectionIndex() {
        const scrollPos = mainContent.scrollTop;
        const viewHeight = mainContent.clientHeight;
        for (let i = 0; i < sections.length; i++) {
            const section = document.getElementById(sections[i]);
            const offsetTop = section.offsetTop;
            const offsetBottom = offsetTop + section.offsetHeight;
            if (scrollPos + viewHeight / 2 >= offsetTop && scrollPos + viewHeight / 2 < offsetBottom) {
                return i;
            }
        }
        return 0;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(updateActiveNav, 100);
            }
        });
    });

    window.addEventListener('load', () => {
        updateActiveNav();
    });

})();