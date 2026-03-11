// ============================================
// TROY KRAUSE PORTFOLIO - JAVASCRIPT
// Modern Interactive Features
// ============================================

// ============================================
// 1. SMOOTH SCROLL NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();

                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// 2. ACTIVE NAVIGATION TRACKING
// ============================================

// Track which section is currently in view
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100; // Offset for fixed nav

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update active state on nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Listen to scroll events (debounced for performance)
const debouncedUpdateNav = debounce(updateActiveNav, 100);
window.addEventListener('scroll', debouncedUpdateNav);

// ============================================
// 3. NAVBAR SCROLL EFFECT
// ============================================

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Listen to scroll for navbar effect
const debouncedNavbarScroll = debounce(handleNavbarScroll, 50);
window.addEventListener('scroll', debouncedNavbarScroll);

// ============================================
// 4. MOBILE MENU TOGGLE
// ============================================

const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

function toggleMobileMenu() {
    navLinksContainer.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Animate hamburger icon
    const hamburgers = navToggle.querySelectorAll('.hamburger');
    if (navLinksContainer.classList.contains('active')) {
        hamburgers[0].style.transform = 'rotate(45deg) translateY(8px)';
        hamburgers[1].style.opacity = '0';
        hamburgers[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        hamburgers[0].style.transform = 'none';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    navLinksContainer.classList.remove('active');
    navToggle.classList.remove('active');

    // Reset hamburger icon
    const hamburgers = navToggle.querySelectorAll('.hamburger');
    hamburgers[0].style.transform = 'none';
    hamburgers[1].style.opacity = '1';
    hamburgers[2].style.transform = 'none';
}

// Toggle menu on button click
if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
        if (navLinksContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// Close menu on window resize if switching to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// ============================================
// 5. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ============================================

// Options for the intersection observer
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters view
};

// Create intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            // Once animated, stop observing to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in-on-scroll class
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// ============================================
// 6. INITIAL PAGE LOAD
// ============================================

window.addEventListener('load', () => {
    // Update active nav on page load
    updateActiveNav();

    // Handle navbar state on load
    handleNavbarScroll();

    // Log success for debugging
    console.log('Portfolio loaded successfully!');
    console.log('✨ Modern IT portfolio with glassmorphism and smooth animations');
});

// ============================================
// 7. UTILITY FUNCTIONS
// ============================================

// Get scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// 8. KEYBOARD ACCESSIBILITY
// ============================================

// Allow Enter key to trigger mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
}

// Trap focus in mobile menu when open
navLinksContainer.addEventListener('keydown', (e) => {
    if (!navLinksContainer.classList.contains('active')) return;

    const focusableElements = navLinksContainer.querySelectorAll('a, button');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If Tab is pressed
    if (e.key === 'Tab') {
        // If Shift+Tab on first element, go to last
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // If Tab on last element, go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Close menu on Escape
    if (e.key === 'Escape') {
        closeMobileMenu();
        navToggle.focus();
    }
});

// ============================================
// 9. PERFORMANCE OPTIMIZATIONS
// ============================================

// Disable animations if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('scroll-behavior', 'auto');

    // Remove animation classes
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    animatedElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

// ============================================
// 10. STARFIELD CANVAS
// ============================================

(function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', debounce(resize, 200));

    // Galaxy cluster centers (percentage of viewport)
    const clusters = [
        { x: 0.85, y: 0.12, r: 0.18 },
        { x: 0.10, y: 0.45, r: 0.20 },
        { x: 0.80, y: 0.78, r: 0.15 },
        { x: 0.45, y: 0.72, r: 0.17 },
    ];

    // Nebulas with different accent colors
    const nebulas = [
        // Amber/gold nebula - top right
        { x: 0.82, y: 0.10, rx: 0.22, ry: 0.16, angle: 0.3,
          colors: [[212, 165, 116], [180, 140, 90], [155, 120, 80]] },
        // Deep blue/teal nebula - left
        { x: 0.08, y: 0.40, rx: 0.18, ry: 0.25, angle: -0.4,
          colors: [[80, 140, 200], [60, 120, 180], [100, 160, 210]] },
        // Purple/violet nebula - bottom right
        { x: 0.78, y: 0.80, rx: 0.15, ry: 0.12, angle: 0.6,
          colors: [[160, 100, 200], [140, 80, 180], [180, 120, 210]] },
        // Rose/pink nebula - bottom center
        { x: 0.42, y: 0.75, rx: 0.20, ry: 0.13, angle: -0.2,
          colors: [[200, 100, 130], [180, 80, 120], [170, 110, 140]] },
        // Emerald/green nebula - top left
        { x: 0.20, y: 0.15, rx: 0.14, ry: 0.10, angle: 0.5,
          colors: [[80, 180, 140], [60, 160, 120], [100, 190, 150]] },
        // Cyan nebula - center right
        { x: 0.92, y: 0.50, rx: 0.12, ry: 0.18, angle: -0.3,
          colors: [[80, 170, 210], [60, 150, 200], [100, 185, 220]] },
    ];

    // Generate stars once
    const totalStars = 800;
    const stars = [];

    for (let i = 0; i < totalStars; i++) {
        let x, y, size, opacity, color;

        // 40% of stars cluster around galaxy centers
        if (i < totalStars * 0.4) {
            const cluster = clusters[Math.floor(Math.random() * clusters.length)];
            // Gaussian-ish distribution around cluster center
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * Math.random() * cluster.r;
            x = cluster.x + Math.cos(angle) * dist;
            y = cluster.y + Math.sin(angle) * dist;
            // Cluster stars are bluer and brighter
            const blue = 200 + Math.floor(Math.random() * 55);
            const green = 180 + Math.floor(Math.random() * 40);
            color = `rgba(${150 + Math.floor(Math.random() * 40)}, ${green}, ${blue}, `;
            size = Math.random() < 0.15 ? 1.5 + Math.random() : 0.5 + Math.random() * 0.8;
            opacity = 0.5 + Math.random() * 0.5;
        } else {
            // Scattered background stars
            x = Math.random();
            y = Math.random();
            color = `rgba(255, 255, 255, `;
            size = Math.random() < 0.08 ? 1.2 + Math.random() : 0.3 + Math.random() * 0.7;
            opacity = 0.2 + Math.random() * 0.6;
        }

        stars.push({
            x, y, size, opacity, color,
            twinkleSpeed: 0.5 + Math.random() * 2,
            twinkleOffset: Math.random() * Math.PI * 2,
        });
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw nebulas with accent colors
        nebulas.forEach(neb => {
            const cx = neb.x * canvas.width;
            const cy = neb.y * canvas.height;
            const rx = neb.rx * canvas.width;
            const ry = neb.ry * canvas.height;
            const r = Math.max(rx, ry);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(neb.angle);
            ctx.scale(rx / r, ry / r);

            // Layered glow for depth
            neb.colors.forEach((col, i) => {
                const layerR = r * (1.2 - i * 0.25);
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, layerR);
                const alpha = 0.07 - i * 0.015;
                grad.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`);
                grad.addColorStop(0.3, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha * 0.6})`);
                grad.addColorStop(0.6, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha * 0.2})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(-layerR, -layerR, layerR * 2, layerR * 2);
            });

            ctx.restore();
        });

        // Draw stars
        const t = time * 0.001;
        stars.forEach(star => {
            const twinkle = 0.6 + 0.4 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.opacity * twinkle;
            const sx = star.x * canvas.width;
            const sy = star.y * canvas.height;

            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color + alpha + ')';
            ctx.fill();
        });

        // Draw shooting stars
        updateShootingStars(time);
        shootingStars.forEach(s => {
            if (!s.active) return;

            const progress = (time - s.startTime) / s.duration;
            if (progress > 1) { s.active = false; return; }

            const x = s.startX + (s.endX - s.startX) * progress;
            const y = s.startY + (s.endY - s.startY) * progress;

            // Fade in then out
            const fade = progress < 0.1 ? progress / 0.1
                       : progress > 0.6 ? (1 - progress) / 0.4
                       : 1;

            // Draw trail
            const tailLen = s.tailLength;
            const angle = Math.atan2(s.endY - s.startY, s.endX - s.startX);
            const tailX = x - Math.cos(angle) * tailLen;
            const tailY = y - Math.sin(angle) * tailLen;

            const grad = ctx.createLinearGradient(tailX, tailY, x, y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.7, `rgba(200, 220, 255, ${0.3 * fade})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * fade})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Bright head glow
            ctx.beginPath();
            ctx.arc(x, y, s.width * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * fade})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Shooting star system
    const shootingStars = [];
    let lastSpawn = 0;

    function spawnShootingStar(time) {
        const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4); // 30-75 degrees
        const speed = 200 + Math.random() * 300;
        const duration = 600 + Math.random() * 800;
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.5;
        const dist = speed;

        shootingStars.push({
            active: true,
            startTime: time,
            duration,
            startX,
            startY,
            endX: startX + Math.cos(angle) * dist,
            endY: startY + Math.sin(angle) * dist,
            tailLength: 60 + Math.random() * 100,
            width: 0.8 + Math.random() * 1.2,
        });
    }

    function updateShootingStars(time) {
        // Spawn new ones at random intervals (every 2-5 seconds)
        if (time - lastSpawn > 2000 + Math.random() * 3000) {
            // Sometimes spawn 2-3 at once
            const count = Math.random() < 0.2 ? 2 + Math.floor(Math.random() * 2) : 1;
            for (let i = 0; i < count; i++) {
                spawnShootingStar(time + i * 200);
            }
            lastSpawn = time;
        }

        // Clean up inactive
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            if (!shootingStars[i].active) shootingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(draw);
})();

// ============================================
// END OF SCRIPT
// ============================================
