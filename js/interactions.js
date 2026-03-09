/**
 * Digital Canvas - Additional Interactions
 * Enhanced user interactions and micro-animations
 */

// Initialize additional interactions
document.addEventListener('DOMContentLoaded', () => {
    initScrollIndicators();
    initFormInteractions();
    initSocialShare();
    initCopyEmail();
    initScrollProgress();
    initFocusManagement();
    initKeyboardShortcuts();
    initTooltips();
    initLazyLoading();
});

/**
 * Scroll Progress Indicator
 */
function initScrollProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * Enhanced Form Interactions
 */
function initFormInteractions() {
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });
    
    // Character counter for textarea
    const messageInput = document.getElementById('message');
    if (messageInput) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0 / 500';
        messageInput.parentNode.appendChild(counter);
        
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            counter.textContent = `${count} / 500`;
            
            if (count > 450) {
                counter.style.color = '#ff0055';
            } else {
                counter.style.color = '#a0a8b3';
            }
        });
    }
}

function validateInput(input) {
    const value = input.value.trim();
    const parent = input.parentElement;
    
    // Remove existing validation classes
    parent.classList.remove('valid', 'invalid');
    
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && emailRegex.test(value)) {
            parent.classList.add('valid');
        } else if (value) {
            parent.classList.add('invalid');
        }
    } else if (input.type === 'text' || input.tagName === 'TEXTAREA') {
        if (value.length > 2) {
            parent.classList.add('valid');
        } else if (value.length > 0) {
            parent.classList.add('invalid');
        }
    }
}

/**
 * Social Share Functionality
 */
function initSocialShare() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'github':
                    shareUrl = 'https://github.com/';
                    break;
                default:
                    shareUrl = url;
            }
            
            if (shareUrl !== url) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

/**
 * Copy Email Functionality
 */
function initCopyEmail() {
    const emailElements = document.querySelectorAll('.info-item span:contains("@")');
    
    emailElements.forEach(email => {
        email.style.cursor = 'pointer';
        email.style.position = 'relative';
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Click to copy';
        email.appendChild(tooltip);
        
        email.addEventListener('click', async () => {
            const emailText = email.textContent;
            
            try {
                await navigator.clipboard.writeText(emailText);
                
                // Update tooltip
                tooltip.textContent = 'Copied!';
                tooltip.style.backgroundColor = '#00ff88';
                tooltip.style.color = '#000';
                
                setTimeout(() => {
                    tooltip.textContent = 'Click to copy';
                    tooltip.style.backgroundColor = '#333';
                    tooltip.style.color = '#fff';
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    });
}

/**
 * Scroll Indicators
 */
function initScrollIndicators() {
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const nextSection = indicator.closest('section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Add hover animation
        indicator.addEventListener('mouseenter', () => {
            const arrow = indicator.querySelector('.scroll-arrow');
            gsap.to(arrow, {
                y: 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        indicator.addEventListener('mouseleave', () => {
            const arrow = indicator.querySelector('.scroll-arrow');
            gsap.to(arrow, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Focus Management
 */
function initFocusManagement() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.href.split('#')[1]);
            if (target) {
                target.focus();
            }
        });
    }
    
    // Focus trap for mobile menu
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    mobileMenu.addEventListener('keydown', (e) => {
        const focusableContent = mobileMenu.querySelectorAll(focusableElements);
        const firstElement = focusableContent[0];
        const lastElement = focusableContent[focusableContent.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

/**
 * Keyboard Shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
            menuToggle.focus();
        }
        
        // Scroll to top with Home
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Scroll to bottom with End
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
        
        // Toggle theme with T
        if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

/**
 * Tooltips
 */
function initTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-global';
    document.body.appendChild(tooltip);
    
    // Show tooltip on hover
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        const title = target.getAttribute('title');
        
        if (title) {
            tooltip.textContent = title;
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        }
    });
    
    // Position tooltip
    document.addEventListener('mousemove', (e) => {
        const tooltip = document.querySelector('.tooltip-global');
        if (tooltip && tooltip.style.opacity === '1') {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        }
    });
    
    // Hide tooltip
    document.addEventListener('mouseout', (e) => {
        const tooltip = document.querySelector('.tooltip-global');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }
    });
    
    // Remove title attributes to prevent default tooltips
    const elementsWithTitles = document.querySelectorAll('[title]');
    elementsWithTitles.forEach(el => {
        el.removeAttribute('title');
    });
}

/**
 * Lazy Loading
 */
function initLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Enhanced Portfolio Interactions
 */
function initPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const image = item.querySelector('img');
        const overlay = item.querySelector('.overlay');
        
        // Add zoom effect on hover
        item.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        // Click to expand (simulate modal)
        item.addEventListener('click', () => {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'portfolio-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const modalImage = document.createElement('img');
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            
            const modalClose = document.createElement('button');
            modalClose.className = 'modal-close';
            modalClose.innerHTML = '&times;';
            
            modalContent.appendChild(modalClose);
            modalContent.appendChild(modalImage);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Animate modal
            gsap.fromTo(modalContent, {
                scale: 0.8,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Close modal
            const closeModal = () => {
                gsap.to(modalContent, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        modal.remove();
                    }
                });
            };
            
            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Keyboard close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
    });
}

/**
 * Blog Post Interactions
 */
function initBlogInteractions() {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const readMore = post.querySelector('.read-more');
        
        // Add hover effect to read more button
        readMore.addEventListener('mouseenter', () => {
            gsap.to(readMore, {
                x: 5,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        readMore.addEventListener('mouseleave', () => {
            gsap.to(readMore, {
                x: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        // Add click animation
        readMore.addEventListener('click', (e) => {
            e.preventDefault();
            const link = readMore.getAttribute('href');
            
            gsap.to(readMore, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            
            setTimeout(() => {
                if (link) {
                    window.location.href = link;
                }
            }, 200);
        });
    });
}

/**
 * Contact Form Enhancements
 */
function initContactFormEnhancements() {
    const form = document.getElementById('contactForm');
    if (form) {
        // Add typing animation to form fields
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'translateY(-5px)';
                input.parentElement.style.boxShadow = '0 10px 20px rgba(0, 243, 255, 0.2)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'translateY(0)';
                input.parentElement.style.boxShadow = 'none';
            });
        });
        
        // Add typing sound effect (subtle)
        const messageInput = document.getElementById('message');
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                // Add subtle typing indicator
                const typingIndicator = document.createElement('span');
                typingIndicator.className = 'typing-indicator';
                typingIndicator.textContent = 'Typing...';
                
                // Remove existing indicator
                const existingIndicator = form.querySelector('.typing-indicator');
                if (existingIndicator) {
                    existingIndicator.remove();
                }
                
                form.appendChild(typingIndicator);
                
                // Hide after 2 seconds of no typing
                clearTimeout(messageInput.dataset.timeout);
                messageInput.dataset.timeout = setTimeout(() => {
                    const indicator = form.querySelector('.typing-indicator');
                    if (indicator) {
                        indicator.remove();
                    }
                }, 2000);
            });
        }
    }
}

/**
 * Utility Functions
 */
function createRippleEffect(element, color = '#00f3ff') {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = element.offsetWidth / 2;
    const y = element.offsetHeight / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    ripple.style.background = color;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize all interactions
function initAllInteractions() {
    initScrollProgress();
    initFormInteractions();
    initSocialShare();
    initCopyEmail();
    initScrollIndicators();
    initFocusManagement();
    initKeyboardShortcuts();
    initTooltips();
    initLazyLoading();
    initPortfolioInteractions();
    initBlogInteractions();
    initContactFormEnhancements();
}

// Export for use in other modules
window.DigitalCanvasInteractions = {
    initAllInteractions,
    createRippleEffect
};