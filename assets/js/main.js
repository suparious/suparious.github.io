// ========================
// Main JavaScript File
// ========================

// DOM Elements - initialized after DOMContentLoaded
let loader, navbar, navMenu, hamburger, navLinks, sections, skillBars, contactForm;

// ========================
// Utility Functions (defined early for use throughout)
// ========================

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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================
// Loading Screen
// ========================
function initLoader() {
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            initializeAnimations();
        }, 1000);
    }
}

// ========================
// Navigation
// ========================

// Mobile Menu Toggle
function initMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Update ARIA attributes
            const expanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded);
        });
    }

    // Close mobile menu when clicking nav links
    if (navLinks && hamburger && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Consolidated scroll handler - combines navbar effects and active link tracking
let lastScroll = 0;
const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;

    // Navbar scrolled effect
    if (navbar) {
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll using CSS class
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
    }

    // Active nav link on scroll
    if (sections && navLinks) {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Parallax effect for elements with data-parallax
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(currentScroll * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });

    lastScroll = currentScroll;
}, 16); // ~60fps

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================
// Particles.js Configuration
// ========================
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#4f46e5', '#7c3aed', '#06b6d4']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#4f46e5',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ========================
// Typed.js Configuration
// ========================
function initTyped() {
    if (typeof Typed !== 'undefined' && document.getElementById('typed')) {
        new Typed('#typed', {
            strings: [
                'Principal Solutions Architect',
                'AI Infrastructure Expert',
                'Open Source Leader',
                'Rust Systems Developer',
                'Gaming Automation Pioneer',
                'MLOps Platform Builder'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// ========================
// Skills Animation
// ========================
function animateSkills() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                progressBar.style.width = progress + '%';
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);

    if (skillBars) {
        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
}

// ========================
// Contact Form
// ========================
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.style.background = '';
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Error
                submitButton.innerHTML = '<i class="fas fa-times"></i> Error! Try Again';
                submitButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
}

// ========================
// GitHub Stats (Optional API Integration)
// ========================
async function fetchGitHubStats() {
    try {
        const username = 'suparious';
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (response.ok) {
            const data = await response.json();

            // Update stats if elements exist
            const reposElement = document.getElementById('github-repos');
            const followersElement = document.getElementById('github-followers');

            if (reposElement) reposElement.textContent = data.public_repos;
            if (followersElement) followersElement.textContent = data.followers;
        }
    } catch (error) {
        console.log('GitHub API fetch failed, using default values');
    }
}

// ========================
// Initialize Functions
// ========================
function initializeAnimations() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Initialize skills animation
    animateSkills();

    // Fetch GitHub stats
    fetchGitHubStats();
}

// ========================
// Custom Cursor (Optional - desktop only)
// ========================
function initCustomCursor() {
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
    }
}

// ========================
// Page Visibility API
// ========================
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // Resume animations when page is visible
            document.querySelectorAll('.paused').forEach(element => {
                element.classList.remove('paused');
            });
        } else {
            // Pause animations when page is hidden
            document.querySelectorAll('.animated').forEach(element => {
                element.classList.add('paused');
            });
        }
    });
}

// ========================
// Easter Egg (Konami Code)
// ========================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    document.body.classList.add('easter-egg');
    setTimeout(() => {
        alert('🎉 Congratulations! You found the easter egg! 🎮');
        document.body.classList.remove('easter-egg');
    }, 1000);
}

// ========================
// Performance Monitoring
// ========================
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

// ========================
// Service Worker Registration (for offline support)
// ========================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}

// ========================
// DOMContentLoaded - Initialize everything
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM references
    loader = document.getElementById('loader');
    navbar = document.getElementById('navbar');
    navMenu = document.querySelector('.nav-menu');
    hamburger = document.querySelector('.hamburger');
    navLinks = document.querySelectorAll('.nav-link');
    sections = document.querySelectorAll('section');
    skillBars = document.querySelectorAll('.skill-progress');
    contactForm = document.getElementById('contact-form');

    // Initialize components
    initMobileMenu();
    initSmoothScroll();
    initParticles();
    initTyped();
    initContactForm();
    initCustomCursor();
    initPageVisibility();
    initKonamiCode();
    initPerformanceMonitoring();

    // Add consolidated scroll listener
    window.addEventListener('scroll', handleScroll);
});

// ========================
// Window Load - Final initialization
// ========================
window.addEventListener('load', () => {
    initLoader();
    initServiceWorker();
});
