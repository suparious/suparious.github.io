// ========================
// Theme Management
// ========================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }
    
    init() {
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener to theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Add keyboard shortcut (Ctrl/Cmd + Shift + L)
        this.addKeyboardShortcut();
    }
    
    getStoredTheme() {
        return localStorage.getItem('theme');
    }
    
    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }
    
    getPreferredTheme() {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    applyTheme(theme) {
        // Set theme attribute on document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#0a0a0f' : '#ffffff';
        }
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
        
        // Store current theme
        this.currentTheme = theme;
        this.setStoredTheme(theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Add animation class
        this.animateThemeChange();
    }
    
    animateThemeChange() {
        // Add transition class to body
        document.body.classList.add('theme-transition');
        
        // Remove class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    watchSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Modern browsers
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    // Only apply if user hasn't manually set theme
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            } else {
                // Fallback for older browsers
                darkModeQuery.addListener((e) => {
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    }
    
    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggleTheme();
                this.showThemeToast();
            }
        });
    }
    
    showThemeToast() {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.innerHTML = `
            <i class="fas fa-${this.currentTheme === 'dark' ? 'moon' : 'sun'}"></i>
            <span>${this.currentTheme === 'dark' ? 'Dark' : 'Light'} mode activated</span>
        `;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px var(--shadow-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '10000',
            animation: 'slideInUp 0.3s ease'
        });
        
        // Append to body
        document.body.appendChild(toast);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
}

// ========================
// Theme-aware Features
// ========================

class ThemeAwareFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        // Listen for theme changes
        window.addEventListener('themechange', (e) => {
            this.onThemeChange(e.detail.theme);
        });
        
        // Initialize with current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.onThemeChange(currentTheme);
    }
    
    onThemeChange(theme) {
        // Update particles color based on theme
        this.updateParticlesColor(theme);
        
        // Update chart colors if any
        this.updateChartColors(theme);
        
        // Update syntax highlighting if any
        this.updateSyntaxHighlighting(theme);
    }
    
    updateParticlesColor(theme) {
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
            const particles = pJSDom[0].pJS;
            if (particles) {
                const colors = theme === 'dark' 
                    ? ['#6366f1', '#a78bfa', '#22d3ee']
                    : ['#4f46e5', '#7c3aed', '#06b6d4'];
                
                particles.particles.color.value = colors;
                particles.particles.line_linked.color = colors[0];
                particles.fn.particlesRefresh();
            }
        }
    }
    
    updateChartColors(theme) {
        // Update any charts with theme-appropriate colors
        const charts = document.querySelectorAll('.chart');
        charts.forEach(chart => {
            // Update chart colors based on theme
            const isDark = theme === 'dark';
            // Implementation depends on chart library used
        });
    }
    
    updateSyntaxHighlighting(theme) {
        // Update code syntax highlighting theme
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.className = block.className.replace(/theme-\w+/, `theme-${theme}`);
        });
    }
}

// ========================
// CSS Custom Properties Manager
// ========================

class CSSVariablesManager {
    constructor() {
        this.root = document.documentElement;
        this.init();
    }
    
    init() {
        // Get all CSS variables
        this.variables = this.getCSSVariables();
        
        // Listen for theme changes
        window.addEventListener('themechange', () => {
            this.updateVariables();
        });
    }
    
    getCSSVariables() {
        const styles = getComputedStyle(this.root);
        const variables = {};
        
        // Get all CSS custom properties
        for (let i = 0; i < styles.length; i++) {
            const property = styles[i];
            if (property.startsWith('--')) {
                variables[property] = styles.getPropertyValue(property);
            }
        }
        
        return variables;
    }
    
    setVariable(name, value) {
        this.root.style.setProperty(name, value);
    }
    
    getVariable(name) {
        return getComputedStyle(this.root).getPropertyValue(name);
    }
    
    updateVariables() {
        // Re-fetch variables after theme change
        this.variables = this.getCSSVariables();
    }
}

// ========================
// Theme Transition Styles
// ========================

const themeTransitionStyles = `
    .theme-transition,
    .theme-transition *,
    .theme-transition *::before,
    .theme-transition *::after {
        transition: background-color 300ms ease,
                    color 300ms ease,
                    border-color 300ms ease,
                    box-shadow 300ms ease !important;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;

// Inject transition styles
const styleSheet = document.createElement('style');
styleSheet.textContent = themeTransitionStyles;
document.head.appendChild(styleSheet);

// ========================
// Initialize Theme Manager
// ========================

let themeManager;
let themeAwareFeatures;
let cssVariablesManager;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    themeAwareFeatures = new ThemeAwareFeatures();
    cssVariablesManager = new CSSVariablesManager();
});

// ========================
// Export for use in other modules
// ========================

window.ThemeManager = ThemeManager;
window.ThemeAwareFeatures = ThemeAwareFeatures;
window.CSSVariablesManager = CSSVariablesManager;
