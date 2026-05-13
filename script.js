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

    // ==================== 自动获取 GitHub 项目 ====================
    function loadGitHubProjects() {
        const container = document.getElementById('github-projects');
        if (!container) return; // 页面上没有容器就不执行

        const username = 'BigDaddy118';
        const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            })
            .then(repos => {
                // 过滤：排除 fork 的仓库，以及自己的网站仓库（避免重复）
                const filteredRepos = repos; // 暂时不过滤，查看所有仓库

                if (filteredRepos.length === 0) {
                    container.innerHTML = '<p style="text-align:center; color:#9B6A3A;">✨ 暂时还没有公开项目，先去 GitHub 创建一个吧~ ✨</p>';
                    return;
                }

                let html = '<div class="works-grid">'; // 复用原来的网格布局样式
                filteredRepos.forEach(repo => {
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
                                <div class="card-desc">${repo.description || '这个项目还没有写描述~'}</div>
                            </div>
                        </a>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            })
            .catch(error => {
                console.error('获取 GitHub 项目失败:', error);
                container.innerHTML = '<p style="text-align:center; color:#9B6A3A;">🌟 宝藏盒子暂时打不开，稍后再来看看吧~ 🌟</p>';
            });
    }

    // 随机生成淡色背景（让卡片颜色像原来一样活泼）
    function getRandomColor() {
        const colors = ['FFEAB3', 'FFDAB9', 'B0E0FF', 'D4A5FF', 'B3E6B3', 'FFB3BA', 'BAE1FF', 'FFF5BA'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 页面加载完成后自动执行
    window.addEventListener('load', () => {
        updateActiveNav();
        loadGitHubProjects(); // 在这里调用项目加载
    });

})();
