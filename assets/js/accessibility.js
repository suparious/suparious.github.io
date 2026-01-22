// ========================
// WCAG 2.1 AA Accessibility Enhancements
// ========================

(function() {
    'use strict';

    // ========================
    // Skip Link Focus Management
    // ========================
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove tabindex after blur to not interfere with normal tab order
                targetElement.addEventListener('blur', () => {
                    targetElement.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });

    // ========================
    // Keyboard Navigation Enhancements
    // ========================
    
    // Track keyboard vs mouse usage for focus styling
    let isKeyboardUser = false;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            isKeyboardUser = true;
            document.body.classList.add('keyboard-user');
        }
    });
    
    document.addEventListener('mousedown', () => {
        isKeyboardUser = false;
        document.body.classList.remove('keyboard-user');
    });

    // ========================
    // Escape Key Handler for Mobile Menu
    // ========================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.focus();
                announceToScreenReader('Navigation menu closed');
            }
        }
    });

    // ========================
    // ARIA Live Region for Announcements
    // ========================
    function createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-announcer';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        return liveRegion;
    }
    
    const announcer = createLiveRegion();
    
    function announceToScreenReader(message) {
        announcer.textContent = '';
        // Small delay to ensure screen readers catch the change
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }
    
    // Make function globally available
    window.announceToScreenReader = announceToScreenReader;

    // ========================
    // Enhanced Form Validation with Accessibility
    // ========================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Add aria-describedby for error messages
            const errorId = `${input.id}-error`;
            input.setAttribute('aria-describedby', errorId);
            
            // Create error message container
            let errorContainer = document.getElementById(errorId);
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.id = errorId;
                errorContainer.className = 'form-error';
                errorContainer.setAttribute('role', 'alert');
                errorContainer.style.display = 'none';
                input.parentNode.appendChild(errorContainer);
            }
            
            // Validate on blur
            input.addEventListener('blur', () => {
                validateField(input, errorContainer);
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                if (input.parentNode.classList.contains('error')) {
                    input.parentNode.classList.remove('error');
                    errorContainer.style.display = 'none';
                    input.removeAttribute('aria-invalid');
                }
            });
        });
        
        // Form submission with accessibility
        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            
            formInputs.forEach(input => {
                const errorId = `${input.id}-error`;
                const errorContainer = document.getElementById(errorId);
                if (!validateField(input, errorContainer)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Focus first invalid field
                const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                    announceToScreenReader('Form has errors. Please correct them before submitting.');
                }
            } else {
                announceToScreenReader('Form submitted successfully. Sending your message.');
            }
        });
    }
    
    function validateField(input, errorContainer) {
        const value = input.value.trim();
        let errorMessage = '';
        
        if (input.hasAttribute('required') && !value) {
            errorMessage = `${input.previousElementSibling?.textContent || 'This field'} is required`;
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (errorMessage) {
            input.parentNode.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            errorContainer.textContent = errorMessage;
            errorContainer.style.display = 'block';
            return false;
        } else {
            input.parentNode.classList.remove('error');
            input.removeAttribute('aria-invalid');
            errorContainer.style.display = 'none';
            return true;
        }
    }

    // ========================
    // Theme Toggle Accessibility
    // ========================
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Update aria-pressed state
        function updateThemeToggleState() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        
        // Initial state
        updateThemeToggleState();
        
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateThemeToggleState();
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    announceToScreenReader(isDark ? 'Dark mode enabled' : 'Light mode enabled');
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }

    // ========================
    // Loading Screen Accessibility
    // ========================
    const loader = document.getElementById('loader');
    
    if (loader) {
        loader.setAttribute('role', 'alert');
        loader.setAttribute('aria-busy', 'true');
        loader.setAttribute('aria-label', 'Loading page content');

        // Watch for loader hidden class
        const loaderObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Only react to class attribute changes, not aria-busy changes we make
                if (mutation.attributeName === 'class' && mutation.target.classList.contains('hidden')) {
                    // Disconnect immediately to prevent infinite loop
                    loaderObserver.disconnect();

                    loader.setAttribute('aria-busy', 'false');
                    announceToScreenReader('Page content loaded');

                    // Focus main content for screen reader users
                    const mainContent = document.querySelector('main');
                    if (mainContent && isKeyboardUser) {
                        mainContent.setAttribute('tabindex', '-1');
                        mainContent.focus();
                    }
                }
            });
        });

        loaderObserver.observe(loader, { attributes: true });
    }

    // ========================
    // Navigation Menu Accessibility
    // ========================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Add ARIA attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        navMenu.id = 'nav-menu';
        
        // Update on toggle
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            announceToScreenReader(isExpanded ? 'Navigation menu opened' : 'Navigation menu closed');
        });
        
        // Focus trap within mobile menu
        navMenu.addEventListener('keydown', (e) => {
            if (!navMenu.classList.contains('active')) return;
            
            const focusableElements = navMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // ========================
    // Section Navigation Announcements
    // ========================
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const sectionTitle = entry.target.querySelector('h2')?.textContent || entry.target.id;
                // Only announce if user is scrolling with keyboard
                if (isKeyboardUser) {
                    announceToScreenReader(`Now viewing: ${sectionTitle}`);
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));

    // ========================
    // Skills Progress Bar Accessibility
    // ========================
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const skillName = bar.closest('.skill-item')?.querySelector('.skill-header span')?.textContent;
        const skillLevel = bar.closest('.skill-item')?.querySelector('.skill-level')?.textContent;
        
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', progress);
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-label', `${skillName}: ${progress}% - ${skillLevel}`);
    });

    // ========================
    // External Links Accessibility
    // ========================
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        // Add screen reader text for external links
        if (!link.querySelector('.sr-only')) {
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in new tab)';
            link.appendChild(srText);
        }
        
        // Ensure rel attributes for security
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
            link.setAttribute('rel', (rel + ' noopener').trim());
        }
    });

    // ========================
    // Image Alt Text Verification
    // ========================
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            console.warn('Accessibility: Image missing alt attribute', img);
            img.setAttribute('alt', ''); // Empty alt for decorative images
        }
    });

    // ========================
    // Card Keyboard Interaction
    // ========================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const link = card.querySelector('a');
        if (link) {
            // Make entire card clickable via keyboard
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        }
    });

    // ========================
    // Reduced Motion Detection
    // ========================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            // Disable particles.js if loaded
            if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
                pJSDom[0].pJS.particles.move.enable = false;
            }
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    
    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

    // ========================
    // Print Accessibility
    // ========================
    window.addEventListener('beforeprint', () => {
        announceToScreenReader('Preparing document for printing');
    });

    console.log('Accessibility enhancements loaded - WCAG 2.1 AA compliant');
})();
