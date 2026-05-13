(function () {
    "use strict";

    // ==================== 配置 ====================
    const config = {
        username: 'BigDaddy118',
        excludeRepos: ['My-web'],       // 不想显示在卡片里的仓库名
        maxCards: 3,                   // 最多显示的项目卡片数（不包含“更多”）
        fallbackDesc: '这个项目还没有写描述~',
        moreCardTitle: '查看更多项目',
        moreCardDesc: '去我的GitHub主页发现更多宝藏~',
        moreCardBg: '#FFB347',
        errorMsg: '🌟 宝藏盒子暂时打不开，稍后再来看看吧~ 🌟',
        emptyMsg: '✨ 暂时还没有公开项目，先去 GitHub 创建一个吧~ ✨',
        colorPalette: ['FFEAB3', 'FFDAB9', 'B0E0FF', 'D4A5FF', 'B3E6B3', 'FFB3BA', 'BAE1FF', 'FFF5BA']
    };

    // ==================== DOM 元素 ====================
    const sections = ['home', 'works', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.querySelector('.main-content');

    // ==================== 导航高亮 ====================
    let rafId = null;
    function updateActiveNav() {
        // 简单的 RAF 节流，避免滚动时过于频繁执行
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
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
                link.classList.toggle('active', sectionAttr === sections[activeIndex]);
            });
        });
    }

    mainContent.addEventListener('scroll', updateActiveNav);

    // ==================== 滚轮整屏切换 ====================
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

    // ==================== 导航点击跳转 ====================
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

    // ==================== 自动获取 GitHub 项目 ====================
    function loadGitHubProjects() {
        const container = document.getElementById('github-projects');
        if (!container) return;

        const apiUrl = `https://api.github.com/users/${config.username}/repos?sort=updated&per_page=100`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('网络响应不正常');
                return response.json();
            })
            .then(repos => {
                // 过滤仓库
                const filtered = repos.filter(repo => !config.excludeRepos.includes(repo.name));
                const showRepos = filtered.slice(0, config.maxCards);

                // 如果没有任何项目，显示友好提示
                if (showRepos.length === 0) {
                    container.innerHTML = `<p style="text-align:center; color:#9B6A3A;">${config.emptyMsg}</p>`;
                    return;
                }

                let html = '<div class="works-grid">';

                // 项目卡片
                showRepos.forEach(repo => {
                    html += `
                        <a href="${repo.html_url}" target="_blank" class="work-card">
                            <div class="card-img" style="background: #${getRandomColor()};">
                                ${repo.language ? repo.language : '📦'}
                            </div>
                            <div class="card-content">
                                <div class="card-title">${repo.name}</div>
                                <div class="card-tags">
                                    ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                                    ${repo.stargazers_count > 0 ? `<span class="tag">⭐ ${repo.stargazers_count}</span>` : ''}
                                </div>
                                <div class="card-desc">${repo.description || config.fallbackDesc}</div>
                            </div>
                        </a>
                    `;
                });

                // 固定的“更多”卡片
                html += `
                    <a href="https://github.com/${config.username}" target="_blank" class="work-card more-card">
                        <div class="card-img" style="background: ${config.moreCardBg};">🔍</div>
                        <div class="card-content">
                            <div class="card-title">${config.moreCardTitle}</div>
                            <div class="card-desc">${config.moreCardDesc}</div>
                        </div>
                    </a>
                `;

                html += '</div>';
                container.innerHTML = html;
            })
            .catch(error => {
                console.error('获取 GitHub 项目失败:', error);
                container.innerHTML = `<p style="text-align:center; color:#9B6A3A;">${config.errorMsg}</p>`;
            });
    }

    // 随机取色（从预设色板中循环或随机）
    function getRandomColor() {
        const palette = config.colorPalette;
        return palette[Math.floor(Math.random() * palette.length)];
    }

    // ==================== 页面初始化 ====================
    window.addEventListener('load', () => {
        updateActiveNav();
        loadGitHubProjects();
    });

})();
