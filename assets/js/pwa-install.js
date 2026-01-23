// ========================
// PWA Install Prompt Handler
// ========================

let deferredPrompt;
let installButton;

// Create install button UI
// Note: PWA banner styles are now in assets/css/dynamic.css
function createInstallButton() {
    // Create install prompt banner
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
        <div class="pwa-install-content">
            <div class="pwa-install-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="pwa-install-text">
                <strong>Install this app</strong>
                <span>Add to home screen for quick access</span>
            </div>
            <div class="pwa-install-actions">
                <button id="pwa-install-btn" class="pwa-install-btn">
                    <i class="fas fa-download"></i> Install
                </button>
                <button id="pwa-dismiss-btn" class="pwa-dismiss-btn" aria-label="Dismiss">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(installBanner);

    return installBanner;
}

// Check if app is already installed
function isAppInstalled() {
    // Check display-mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    // Check iOS standalone mode
    if (window.navigator.standalone === true) {
        return true;
    }
    return false;
}

// Check if user has dismissed the prompt recently
function hasUserDismissed() {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) return false;
    
    const dismissedTime = parseInt(dismissed, 10);
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    return Date.now() - dismissedTime < oneWeek;
}

// Show the install banner
function showInstallBanner() {
    if (isAppInstalled() || hasUserDismissed()) {
        return;
    }
    
    const banner = document.getElementById('pwa-install-banner') || createInstallButton();
    
    // Delay showing the banner for better UX
    setTimeout(() => {
        banner.classList.add('visible');
    }, 3000);
    
    // Setup event listeners
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for user response
                const { outcome } = await deferredPrompt.userChoice;
                
                console.log(`PWA install prompt outcome: ${outcome}`);
                
                // Clear the deferred prompt
                deferredPrompt = null;
                
                // Hide the banner
                banner.classList.remove('visible');
                
                if (outcome === 'accepted') {
                    console.log('PWA was installed');
                }
            }
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            banner.classList.remove('visible');
            localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        });
    }
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show the install banner
    showInstallBanner();
});

// Listen for successful installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    
    // Hide install banner if visible
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.classList.remove('visible');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
});

// iOS Safari install instructions (no beforeinstallprompt event)
function showIOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari && !isAppInstalled() && !hasUserDismissed()) {
        const banner = createInstallButton();
        
        // Modify for iOS
        const textEl = banner.querySelector('.pwa-install-text span');
        if (textEl) {
            textEl.textContent = 'Tap Share then "Add to Home Screen"';
        }
        
        const installBtn = banner.querySelector('.pwa-install-btn');
        if (installBtn) {
            installBtn.innerHTML = '<i class="fas fa-share-square"></i> How to Install';
            installBtn.addEventListener('click', () => {
                alert('To install this app:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm');
            });
        }
        
        setTimeout(() => {
            banner.classList.add('visible');
        }, 3000);
        
        const dismissBtn = banner.querySelector('.pwa-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                banner.classList.remove('visible');
                localStorage.setItem('pwa-install-dismissed', Date.now().toString());
            });
        }
    }
}

// Initialize iOS check after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showIOSInstallInstructions);
} else {
    showIOSInstallInstructions();
}
