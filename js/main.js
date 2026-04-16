(function() {
    'use strict';

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function updateThemeIcon(isDark) {
        const btn = $('.theme-toggle');
        if (!btn) return;
        const moon = btn.querySelector('.fa-moon-o');
        const sun = btn.querySelector('.fa-sun-o');
        if (moon && sun) {
            moon.style.display = isDark ? 'none' : 'inline';
            sun.style.display = isDark ? 'inline' : 'none';
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon(!isDark);
    }

    function initNavbar() {
        const navbar = $('.navbar');
        const hamburger = $('.hamburger');
        const navLinks = $('.nav-links');

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('open');
                navLinks.classList.toggle('open');
            });
            navLinks.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    hamburger.classList.remove('open');
                    navLinks.classList.remove('open');
                });
            });
        }

        const themeBtn = $('.theme-toggle');
        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

        const path = location.pathname.split('/').pop() || 'index.html';
        navLinks.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                a.classList.add('active');
            }
        });
    }

    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        $$('.fade-in-element, .fade-in-left, .fade-in-right, .scale-in').forEach(el => observer.observe(el));

        const hero = $('#hero');
        if (hero) setTimeout(() => hero.classList.add('show'), 100);
    }

    function initTypingEffect() {
        const el = $('#typing-target');
        if (!el) return;
        const texts = JSON.parse(el.dataset.texts || '[]');
        let ti = 0, ci = 0, deleting = false;

        function type() {
            const current = texts[ti];
            if (!deleting) {
                el.textContent = current.substring(0, ci + 1);
                ci++;
                if (ci === current.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                el.textContent = current.substring(0, ci - 1);
                ci--;
                if (ci === 0) {
                    deleting = false;
                    ti = (ti + 1) % texts.length;
                }
            }
            setTimeout(type, deleting ? 40 : 100);
        }
        type();
    }

    function initStatsCounter() {
        $$('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target);
            if (!target) return;
            let current = 0;
            const increment = target / 60;
            const suffix = el.dataset.suffix || '';

            const obs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current) + suffix;
                    }, 25);
                    obs.disconnect();
                }
            }, { threshold: 0.5 });
            obs.observe(el);
        });
    }

    function initSkillBars() {
        $$('.skill-fill').forEach(bar => {
            const w = bar.dataset.width;
            if (!w) return;
            const obs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    bar.style.width = w + '%';
                    setTimeout(() => bar.classList.add('animate'), w * 10);
                    obs.disconnect();
                }
            }, { threshold: 0.3 });
            obs.observe(bar);
        });
    }

    function initLightbox() {
        const overlay = $('#lightbox-overlay');
        if (!overlay) return;
        const img = overlay.querySelector('.lightbox-content img');
        const closeBtn = overlay.querySelector('.lightbox-close');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');
        const counter = overlay.querySelector('.lightbox-counter');
        let currentIndex = 0;
        let galleryImages = [];

        function openLightbox(src, allImages, idx) {
            galleryImages = allImages;
            currentIndex = idx;
            img.src = src;
            counter.textContent = `${idx + 1} / ${allImages.length}`;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
            img.src = galleryImages[currentIndex];
            counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        }

        $$('.image-gallery').forEach(gallery => {
            const imgs = Array.from(gallery.querySelectorAll('img')).map(i => i.src);
            imgs.forEach((src, i) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'position:relative;display:inline-block;cursor:pointer';
                const origImg = gallery.querySelectorAll('img')[i];
                if (origImg) {
                    origImg.parentNode.insertBefore(wrapper, origImg);
                    wrapper.appendChild(origImg);
                    origImg.addEventListener('click', () => openLightbox(src, imgs, i));
                }
            });
        });

        $$('.hero-gallery img').forEach(gimg => {
            gimg.addEventListener('click', () => {
                const allHeroImgs = Array.from($$('.hero-gallery img')).map(i => i.src);
                const idx = allHeroImgs.indexOf(gimg.src);
                openLightbox(gimg.src, allHeroImgs, idx >= 0 ? idx : 0);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
        overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    function initTabFilter() {
        const tabs = $$('.filter-tab');
        const sections = $$('[data-category]');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;

                sections.forEach(sec => {
                    const cat = sec.dataset.category;
                    if (filter === 'all' || cat === filter) {
                        sec.style.display = '';
                        sec.style.opacity = '0';
                        sec.style.transform = 'translateY(16px)';
                        requestAnimationFrame(() => {
                            sec.style.transition = 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
                            sec.style.opacity = '1';
                            sec.style.transform = 'translateY(0)';
                        });
                    } else {
                        sec.style.display = 'none';
                    }
                });
            });
        });
    }

    function initBackToTop() {
        const btn = $('.back-to-top');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initSmoothLinks() {
        $$('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = $(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    const inits = [initTheme, initNavbar, initAnimations, initTypingEffect, initStatsCounter, initSkillBars, initLightbox, initTabFilter, initBackToTop, initSmoothLinks];
    inits.forEach(fn => { try { fn(); } catch(e) { console.warn('[Init] ' + (fn.name || 'anonymous') + ':', e.message); } });

})();
