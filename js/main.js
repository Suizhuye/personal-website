/* ===== 共享脚本 - 汪洢静个人网站 ===== */

document.addEventListener('DOMContentLoaded', function() {

    // ---- 导航栏滚动效果 ----
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // ---- 汉堡菜单 ----
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // ---- 当前页高亮 ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ---- 滚动动画 (Intersection Observer) ----
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-element, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
        animObserver.observe(el);
    });

    // Hero 立即显示
    setTimeout(() => {
        const hero = document.getElementById('hero');
        if (hero) hero.classList.add('show');
    }, 120);

});
