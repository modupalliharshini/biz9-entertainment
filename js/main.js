document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            // Only remove scrolled class if it's the home page and not always scrolled
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic animation for feedback
            const btn = this.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                btn.classList.remove('btn-gold');
                btn.classList.add('btn-success');
                this.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-gold');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Custom Flawless Mobile Menu Logic (Bypasses Bootstrap Bugs)
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (navbarToggler && navbarCollapse) {
        // Completely disable Bootstrap's native collapse to prevent freezing
        navbarToggler.removeAttribute('data-bs-toggle');
        
        // Toggle inline styles to guarantee visual update even if CSS is aggressively cached
        navbarToggler.addEventListener('click', function() {
            const isOpen = navbarCollapse.style.right === '0px' || navbarCollapse.classList.contains('custom-show');
            
            if (isOpen) {
                // Close
                navbarCollapse.style.setProperty('right', '-100vw', 'important');
                navbarCollapse.classList.remove('custom-show');
                this.classList.remove('custom-expanded');
            } else {
                // Open
                navbarCollapse.style.setProperty('right', '0px', 'important');
                navbarCollapse.classList.add('custom-show');
                this.classList.add('custom-expanded');
            }
        });

        // Auto-close when clicking any link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarCollapse.style.setProperty('right', '-100vw', 'important');
                navbarCollapse.classList.remove('custom-show');
                navbarToggler.classList.remove('custom-expanded');
            });
        });
    }

    // Landing Popup Banner Interaction Logic
    const popup = document.getElementById('popupBanner');
    const heroVideo = document.getElementById('heroVideo');
    const muteBtn = document.getElementById('muteBtn');
    const closeBtn = document.getElementById('closePopup');
    const ctaBtn = document.getElementById('ctaPopupBtn');

    if (popup) {
        // Navigation detection logic
        const perfEntries = performance.getEntriesByType("navigation");
        const isReload = perfEntries.length > 0 && perfEntries[0].type === 'reload';
        const isInternalNavigation = document.referrer && document.referrer.includes(window.location.host);

        // Show popup ONLY if it's a reload OR if it's NOT an internal navigation
        if (isReload || !isInternalNavigation) {
            // Show popup after a slight delay for better impact
            setTimeout(() => {
                popup.style.display = 'flex';
                // Use requestAnimationFrame to ensure the display change paints before adding 'active' for transition
                requestAnimationFrame(() => {
                    popup.classList.add('active');
                });
            }, 1000);
        }

        const closePopupAction = () => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 600); // Wait for transition to finish

            // Unmute and play hero video as requested
            if (heroVideo) {
                heroVideo.muted = false;
                heroVideo.play().catch(err => console.log('Auto-play blocked:', err));
                
                // Sync the mute button icon if it exists
                if (muteBtn) {
                    const icon = muteBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-volume-xmark');
                        icon.classList.add('fa-volume-high');
                    }
                }
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closePopupAction);
        if (ctaBtn) ctaBtn.addEventListener('click', closePopupAction);
        
        // Also close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopupAction();
        });
    }
});
