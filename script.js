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
// END OF SCRIPT
// ============================================
