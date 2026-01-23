// ========================
// Advanced Animation System
// ========================

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTextAnimations();
        this.initializeCounters();
    }
    
    // ========================
    // Intersection Observers
    // ========================
    
    setupIntersectionObservers() {
        // Fade in observer
        this.createObserver('fadeIn', {
            threshold: 0.1,
            rootMargin: '50px'
        }, (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    this.observers.get('fadeIn').unobserve(entry.target);
                }
            });
        });
        
        // Slide in observer
        this.createObserver('slideIn', {
            threshold: 0.2,
            rootMargin: '0px'
        }, (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const direction = entry.target.dataset.slideDirection || 'up';
                    entry.target.classList.add(`animate-slide-in-${direction}`);
                    this.observers.get('slideIn').unobserve(entry.target);
                }
            });
        });
        
        // Scale observer
        this.createObserver('scale', {
            threshold: 0.3
        }, (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-scale');
                    this.observers.get('scale').unobserve(entry.target);
                }
            });
        });
        
        // Observe elements
        this.observeElements();
    }
    
    createObserver(name, options, callback) {
        const observer = new IntersectionObserver(callback, options);
        this.observers.set(name, observer);
        return observer;
    }
    
    observeElements() {
        // Fade in elements
        document.querySelectorAll('[data-animate="fade"]').forEach(el => {
            this.observers.get('fadeIn').observe(el);
        });
        
        // Slide in elements
        document.querySelectorAll('[data-animate="slide"]').forEach(el => {
            this.observers.get('slideIn').observe(el);
        });
        
        // Scale elements
        document.querySelectorAll('[data-animate="scale"]').forEach(el => {
            this.observers.get('scale').observe(el);
        });
    }
    
    // ========================
    // Scroll Animations
    // ========================
    
    setupScrollAnimations() {
        this.setupParallaxScrolling();
        this.setupProgressBar();
        this.setupRevealOnScroll();
    }
    
    setupParallaxScrolling() {
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const offset = scrolled * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
            
            // Parallax for background images
            document.querySelectorAll('[data-bg-parallax]').forEach(element => {
                const speed = parseFloat(element.dataset.bgParallax) || 0.5;
                const offset = scrolled * speed;
                element.style.backgroundPosition = `center ${offset}px`;
            });
        }, 10));
    }
    
    setupProgressBar() {
        // Scroll progress bar - styles are in assets/css/dynamic.css
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', this.throttle(() => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / windowHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, 10));
    }
    
    setupRevealOnScroll() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    // ========================
    // Hover Effects
    // ========================
    
    setupHoverEffects() {
        this.setup3DCardEffect();
        this.setupMagneticButtons();
        this.setupTiltEffect();
    }
    
    setup3DCardEffect() {
        document.querySelectorAll('[data-3d-card]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
    
    setupMagneticButtons() {
        document.querySelectorAll('[data-magnetic]').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    setupTiltEffect() {
        document.querySelectorAll('[data-tilt]').forEach(element => {
            const maxTilt = element.dataset.tiltMax || 20;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const tiltX = -(y - centerY) / (rect.height / 2) * maxTilt;
                const tiltY = (x - centerX) / (rect.width / 2) * maxTilt;
                
                element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
    
    // ========================
    // Text Animations
    // ========================
    
    setupTextAnimations() {
        this.setupTypewriterEffect();
        this.setupTextScramble();
        this.setupSplitText();
    }
    
    setupTypewriterEffect() {
        document.querySelectorAll('[data-typewriter]').forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 100;
            element.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            };
            
            // Start when element is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    typeWriter();
                    observer.disconnect();
                }
            });
            observer.observe(element);
        });
    }
    
    setupTextScramble() {
        class TextScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';
                this.update = this.update.bind(this);
            }
            
            setText(newText) {
                const oldText = this.el.innerText;
                const length = Math.max(oldText.length, newText.length);
                const promise = new Promise((resolve) => this.resolve = resolve);
                this.queue = [];
                for (let i = 0; i < length; i++) {
                    const from = oldText[i] || '';
                    const to = newText[i] || '';
                    const start = Math.floor(Math.random() * 40);
                    const end = start + Math.floor(Math.random() * 40);
                    this.queue.push({ from, to, start, end });
                }
                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }
            
            update() {
                let output = '';
                let complete = 0;
                for (let i = 0, n = this.queue.length; i < n; i++) {
                    let { from, to, start, end, char } = this.queue[i];
                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += char;
                    } else {
                        output += from;
                    }
                }
                this.el.innerHTML = output;
                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }
            
            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }
        
        document.querySelectorAll('[data-scramble]').forEach(element => {
            const fx = new TextScramble(element);
            const originalText = element.textContent;
            
            element.addEventListener('mouseenter', () => {
                fx.setText(originalText);
            });
        });
    }
    
    setupSplitText() {
        document.querySelectorAll('[data-split-text]').forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('split-char');
                element.appendChild(span);
            });
        });
    }
    
    // ========================
    // Counter Animations
    // ========================
    
    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.counterDuration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // ========================
    // Utility Functions
    // ========================
    
    throttle(func, limit) {
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
    
    debounce(func, wait) {
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
}

// ========================
// Initialize Animation Controller
// ========================
// Note: Animation styles are now in assets/css/dynamic.css

let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
});

// Export for use in other modules
window.AnimationController = AnimationController;
