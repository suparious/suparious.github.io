// ========================
// PWA Install Prompt Handler
// ========================

let deferredPrompt;
let installButton;

// Create install button UI
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
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .pwa-install-banner {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(150%);
            background: linear-gradient(135deg, var(--card-bg, #1e293b) 0%, var(--card-bg-alt, #0f172a) 100%);
            border: 1px solid var(--border-color, #334155);
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 420px;
            width: calc(100% - 40px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pwa-install-banner.visible {
            transform: translateX(-50%) translateY(0);
        }
        
        .pwa-install-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .pwa-install-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--primary-color, #4f46e5) 0%, var(--secondary-color, #7c3aed) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .pwa-install-icon i {
            font-size: 24px;
            color: white;
        }
        
        .pwa-install-text {
            flex: 1;
            min-width: 0;
        }
        
        .pwa-install-text strong {
            display: block;
            color: var(--text-color, #f1f5f9);
            font-size: 16px;
            margin-bottom: 2px;
        }
        
        .pwa-install-text span {
            display: block;
            color: var(--text-muted, #94a3b8);
            font-size: 13px;
        }
        
        .pwa-install-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        
        .pwa-install-btn {
            background: linear-gradient(135deg, var(--primary-color, #4f46e5) 0%, var(--secondary-color, #7c3aed) 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .pwa-install-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }
        
        .pwa-install-btn:active {
            transform: translateY(0);
        }
        
        .pwa-dismiss-btn {
            background: transparent;
            border: none;
            color: var(--text-muted, #94a3b8);
            width: 36px;
            height: 36px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, color 0.2s;
        }
        
        .pwa-dismiss-btn:hover {
            background: var(--border-color, #334155);
            color: var(--text-color, #f1f5f9);
        }
        
        @media (max-width: 480px) {
            .pwa-install-banner {
                bottom: 10px;
                padding: 12px 16px;
            }
            
            .pwa-install-content {
                gap: 12px;
            }
            
            .pwa-install-icon {
                width: 40px;
                height: 40px;
            }
            
            .pwa-install-icon i {
                font-size: 20px;
            }
            
            .pwa-install-text strong {
                font-size: 14px;
            }
            
            .pwa-install-text span {
                font-size: 12px;
            }
            
            .pwa-install-btn {
                padding: 8px 16px;
                font-size: 13px;
            }
        }
    `;
    
    document.head.appendChild(styles);
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
