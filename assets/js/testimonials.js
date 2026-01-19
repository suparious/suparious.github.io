// ========================
// Testimonials Carousel
// ========================

class TestimonialsCarousel {
    constructor(containerSelector = '.testimonials-container') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.track = this.container.querySelector('.testimonials-track');
        this.slides = this.container.querySelectorAll('.testimonial-slide');
        this.dots = this.container.querySelectorAll('.testimonial-dot');
        this.prevBtn = this.container.querySelector('.testimonial-prev');
        this.nextBtn = this.container.querySelector('.testimonial-next');

        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 6000;
        this.isAutoplayPaused = false;

        this.init();
    }

    init() {
        if (!this.track || this.slides.length === 0) return;

        // Setup navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Setup dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Setup touch/swipe support
        this.setupTouch();

        // Setup keyboard navigation
        this.setupKeyboard();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());

        // Start autoplay
        this.startAutoplay();

        // Initial state
        this.updateSlide();
    }

    setupTouch() {
        let startX = 0;
        let endX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoplay();
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.resumeAutoplay();
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    setupKeyboard() {
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }

    updateSlide() {
        // Move track
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update ARIA attributes
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    startAutoplay() {
        if (this.slides.length <= 1) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused) {
                this.next();
            }
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        this.isAutoplayPaused = true;
    }

    resumeAutoplay() {
        this.isAutoplayPaused = false;
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// ========================
// Testimonials Data
// ========================

const testimonialsData = [
    {
        text: "Shaun's expertise in AI infrastructure and Kubernetes has been instrumental in scaling our ML operations. His ability to design resilient, production-grade systems is exceptional.",
        name: "Tech Lead",
        role: "AI/ML Engineering",
        company: "Enterprise Client",
        avatar: null
    },
    {
        text: "Working with Shaun on our cloud migration was a game-changer. He brought deep knowledge of container orchestration and GitOps practices that transformed our deployment pipeline.",
        name: "Engineering Director",
        role: "Platform Engineering",
        company: "Fortune 500 Company",
        avatar: null
    },
    {
        text: "Shaun's full-stack capabilities are rare. From designing elegant React interfaces to optimizing Rust backend services, he delivers end-to-end solutions that just work.",
        name: "CTO",
        role: "Technology Strategy",
        company: "Startup",
        avatar: null
    },
    {
        text: "The AI inference platform Shaun architected handles millions of requests with impressive efficiency. His understanding of GPU optimization and model serving is top-tier.",
        name: "ML Engineer",
        role: "Machine Learning",
        company: "AI Company",
        avatar: null
    }
];

// ========================
// Initialize on DOM Ready
// ========================

document.addEventListener('DOMContentLoaded', () => {
    // Populate testimonials if container exists but is empty
    const container = document.querySelector('.testimonials-track');
    if (container && container.children.length === 0) {
        renderTestimonials(container, testimonialsData);
    }

    // Initialize carousel
    window.testimonialsCarousel = new TestimonialsCarousel();
});

function renderTestimonials(container, testimonials) {
    const html = testimonials.map(t => `
        <div class="testimonial-slide" aria-hidden="true">
            <div class="testimonial-card">
                <div class="testimonial-quote">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">${t.text}</p>
                <div class="testimonial-author">
                    ${t.avatar 
                        ? `<img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar">`
                        : `<div class="testimonial-avatar-placeholder">${t.name.charAt(0)}</div>`
                    }
                    <div class="testimonial-info">
                        <p class="testimonial-name">${t.name}</p>
                        <p class="testimonial-role">${t.role}</p>
                        <p class="testimonial-company">${t.company}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;

    // Also render dots
    const dotsContainer = document.querySelector('.testimonials-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = testimonials.map((_, i) => 
            `<span class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
        ).join('');
    }
}

// Export for external use
window.TestimonialsCarousel = TestimonialsCarousel;
window.testimonialsData = testimonialsData;
