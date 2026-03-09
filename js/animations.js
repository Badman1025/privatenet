/**
 * Digital Canvas - GSAP Animations
 * Advanced animations and interactions using GSAP library
 */

// Initialize GSAP animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollTriggerAnimations();
    initCursorAnimations();
    initFloatingElements();
    initNeonEffects();
    initParticleEffects();
    initParallaxEffects();
});

/**
 * Hero Section Animations
 */
function initHeroAnimations() {
    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            duration: 1
        }
    });

    // Hero title animation
    tl.from('.hero-title', {
        y: 50,
        opacity: 0,
        stagger: 0.2
    })
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0
    }, '-=0.5')
    .from('.stat-item', {
        y: 30,
        opacity: 0,
        stagger: 0.2
    }, '-=0.5')
    .from('.hero-buttons .btn', {
        y: 30,
        opacity: 0,
        stagger: 0.2
    }, '-=0.5')
    .from('.avatar-container', {
        scale: 0,
        opacity: 0,
        rotation: 360
    }, '-=1');

    // Floating elements animation
    const floatingTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {
            ease: 'sine.inOut'
        }
    });

    floatingTl.to('.element-1', {
        y: -20,
        x: 20,
        rotation: 5,
        duration: 4
    })
    .to('.element-2', {
        y: 20,
        x: -20,
        rotation: -5,
        duration: 4
    }, '-=4')
    .to('.element-3', {
        y: -15,
        x: 15,
        rotation: 3,
        duration: 3
    }, '-=4')
    .to('.element-4', {
        y: 15,
        x: -15,
        rotation: -3,
        duration: 3
    }, '-=3');
}

/**
 * Scroll-triggered Animations
 */
function initScrollTriggerAnimations() {
    // Section fade-in animations
    gsap.utils.toArray('.animate-on-scroll').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Skills section animation
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        ScrollTrigger.create({
            trigger: skillsSection,
            start: 'top 70%',
            onEnter: () => animateSkillBarsGSAP(),
            once: true
        });
    }

    // Portfolio items stagger animation
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        gsap.from('.portfolio-item', {
            scrollTrigger: {
                trigger: portfolioGrid,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    // Blog posts animation
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        gsap.from('.blog-post', {
            scrollTrigger: {
                trigger: blogGrid,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            stagger: 0.3,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    // Timeline animation
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

function animateSkillBarsGSAP() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    skillProgresses.forEach((progress, index) => {
        const width = progress.getAttribute('data-width');
        gsap.fromTo(progress, {
            width: 0
        }, {
            width: width + '%',
            duration: 1.5,
            ease: 'power2.out',
            delay: index * 0.1
        });
    });
}

/**
 * Custom Cursor Animations
 */
function initCursorAnimations() {
    if (!window.matchMedia('(hover: none)').matches) {
        // Only initialize cursor on devices with hover support
        const cursorDot = document.getElementById('cursor-dot');
        const cursorRing = document.getElementById('cursor-ring');
        
        let cursorX = 0;
        let cursorY = 0;
        let ringX = 0;
        let ringY = 0;
        
        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });
        
        // Animation loop
        const animateCursor = () => {
            // Lerp the ring position for smooth trailing effect
            ringX += (cursorX - ringX) * 0.15;
            ringY += (cursorY - ringY) * 0.15;
            
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Cursor interactions
        document.addEventListener('mousedown', () => {
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(0.8)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(0.8)`;
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
        });
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .filter-btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(2)`;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1.5)`;
                cursorDot.style.background = '#ffffff';
                cursorRing.style.borderColor = '#ffffff';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
                cursorDot.style.background = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue').trim();
                cursorRing.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue').trim();
            });
        });
    }
}

/**
 * Floating Elements Animation
 */
function initFloatingElements() {
    // Floating elements with GSAP
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        gsap.to(element, {
            y: index % 2 === 0 ? -20 : 20,
            x: index % 2 === 0 ? 20 : -20,
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 4 + index,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    });
    
    // Avatar ring rotation
    gsap.to('.avatar-ring', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });
    
    // Avatar core pulse
    gsap.to('.avatar-core', {
        scale: 1.05,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
}

/**
 * Neon Effects Animation
 */
function initNeonEffects() {
    // Neon text effects
    const neonTexts = document.querySelectorAll('.highlight, .neon-effect');
    
    neonTexts.forEach(text => {
        gsap.fromTo(text, {
            textShadow: '0 0 0px rgba(0, 243, 255, 0)'
        }, {
            textShadow: '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
            duration: 1,
            ease: 'power2.out',
            repeat: -1,
            yoyo: true
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                boxShadow: 'none',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Particle Effects
 */
function initParticleEffects() {
    // Create particles for hero section
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        for (let i = 0; i < 20; i++) {
            createParticle(heroVisual);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color
        const colors = ['#00f3ff', '#b967ff', '#00e5ff', '#ff0055'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        container.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            y: -100 - Math.random() * 100,
            x: (Math.random() - 0.5) * 50,
            opacity: 0,
            duration: 3 + Math.random() * 2,
            ease: 'power2.in',
            onComplete: () => {
                particle.remove();
                createParticle(container);
            }
        });
    }
}

/**
 * Parallax Effects
 */
function initParallaxEffects() {
    // Parallax scrolling for hero section
    const heroContent = document.querySelector('.hero-content');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (heroContent) {
        ScrollTrigger.create({
            trigger: heroContent,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                const scrollProgress = self.progress;
                
                // Move content opposite to scroll
                gsap.to(heroContent, {
                    y: scrollProgress * 50,
                    ease: 'none'
                });
                
                // Move floating elements at different speeds
                floatingElements.forEach((element, index) => {
                    gsap.to(element, {
                        y: scrollProgress * (20 + index * 10),
                        x: scrollProgress * (10 - index * 5),
                        ease: 'none'
                    });
                });
            }
        });
    }
    
    // Parallax for about section image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        ScrollTrigger.create({
            trigger: aboutImage,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
            onUpdate: (self) => {
                gsap.to(aboutImage, {
                    y: self.progress * 30,
                    ease: 'none'
                });
            }
        });
    }
}

/**
 * Scroll-triggered Background Changes
 */
function initBackgroundChanges() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 20%',
            onEnter: () => {
                // Change background color based on section
                const colors = [
                    'linear-gradient(135deg, #0f1115 0%, #1a1d24 100%)',
                    'linear-gradient(135deg, #1a1d24 0%, #242831 100%)',
                    'linear-gradient(135deg, #242831 0%, #1a1d24 100%)',
                    'linear-gradient(135deg, #1a1d24 0%, #0f1115 100%)'
                ];
                
                document.body.style.background = colors[index % colors.length];
            },
            onLeaveBack: () => {
                document.body.style.background = 'linear-gradient(135deg, #0f1115 0%, #1a1d24 100%)';
            }
        });
    });
}

/**
 * Loading Animation
 */
function initLoadingAnimation() {
    const loadingBar = document.querySelector('.loading-bar');
    
    if (loadingBar) {
        gsap.to(loadingBar, {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                loadingBar.style.display = 'none';
            }
        });
    }
}

/**
 * Interactive Hover Effects
 */
function initInteractiveEffects() {
    // Portfolio item hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.overlay');
        const projectInfo = item.querySelector('.project-info');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            gsap.fromTo(projectInfo, {
                y: 20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            });
            
            gsap.to(projectInfo, {
                y: 20,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });
        });
    });
    
    // Blog post hover effects
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', () => {
            gsap.to(post, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        post.addEventListener('mouseleave', () => {
            gsap.to(post, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Utility Functions
 */
function getRandomColor() {
    const colors = ['#00f3ff', '#b967ff', '#00e5ff', '#ff0055', '#00ff88'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomPosition(max) {
    return Math.random() * max;
}

// Initialize all animations
function initAllAnimations() {
    initHeroAnimations();
    initScrollTriggerAnimations();
    initCursorAnimations();
    initFloatingElements();
    initNeonEffects();
    initParticleEffects();
    initParallaxEffects();
    initInteractiveEffects();
}

// Export for use in other modules
window.DigitalCanvasAnimations = {
    initAllAnimations,
    initHeroAnimations,
    initScrollTriggerAnimations,
    initCursorAnimations
};