/**
 * Digital Canvas - Main JavaScript
 * Interactive functionality and user experience enhancements
 */

// DOM Elements
const preloader = document.getElementById('preloader');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// State Management
let isDarkTheme = true;
let cursorVisible = true;
let cursorEnlarged = false;
let cursorTimeout = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initScrollToTop();
    initContactForm();
    initPortfolioFiltering();
    initSmoothScrolling();
    initAccessibility();
});

/**
 * Preloader Animation
 */
function initPreloader() {
    // Simulate loading time
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
}

/**
 * Theme Management
 */
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
    } else {
        // Check system preference
        isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    updateTheme();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        updateTheme();
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            isDarkTheme = e.matches;
            updateTheme();
        }
    });
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    
    // Update theme toggle icon
    themeToggle.innerHTML = isDarkTheme 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
    
    // Add theme transition class for smooth color changes
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

/**
 * Navigation Enhancement
 */
function initNavigation() {
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update active navigation
                updateActiveNav(link);
                
                // Scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavOnScroll();
        updateNavbarOnScroll();
    });
    
    // Initial active nav update
    updateActiveNavOnScroll();
}

function updateActiveNav(clickedLink) {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    clickedLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 100;
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function updateNavbarOnScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking on mobile links
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Update menu button animation
    const spans = menuToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        // Hamburger to X
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        // X to hamburger
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    
    // Reset menu button
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Observe skills section
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function animateSkillBars() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    skillProgresses.forEach(progress => {
        const width = progress.getAttribute('data-width');
        progress.style.width = width + '%';
    });
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                showFormMessage('Please fill in all fields correctly.', 'error');
                return;
            }
            
            // Simulate form submission
            submitForm(data);
        });
    }
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || data.name.trim().length < 2) {
        return false;
    }
    
    if (!data.email || !emailRegex.test(data.email)) {
        return false;
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        return false;
    }
    
    return true;
}

function submitForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    
    // Insert message
    contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

/**
 * Portfolio Filtering
 */
function initPortfolioFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Animate filtering
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for mobile menu
    mobileMenu.addEventListener('transitionend', () => {
        if (mobileMenu.classList.contains('active')) {
            const firstLink = mobileMenu.querySelector('.mobile-link');
            if (firstLink) firstLink.focus();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
            menuToggle.focus();
        }
        
        // Tab navigation enhancements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Utility Functions
 */
function debounce(func, wait = 20, immediate = false) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

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
    }
}

// 导出数据功能
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        stats: {
            links: 156,
            records: 89,
            tools: 24
        },
        categories: {
            entertainment: 3,
            tools: 3,
            research: 6,
            management: 3
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'digital-garden-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入数据功能
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    alert('数据导入成功！\n链接数: ' + data.stats.links + '\n记录数: ' + data.stats.records + '\n工具数: ' + data.stats.tools);
                } catch (error) {
                    alert('导入失败：文件格式错误');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// 打开Kimi AI助手功能
function openKimi() {
    try {
        // 尝试使用多种方式打开链接
        window.open('https://www.kimi.com/', '_blank', 'noopener,noreferrer');
        
        // 如果window.open被阻止，尝试创建一个临时链接
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'https://www.kimi.com/';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 100);
    } catch (error) {
        console.error('打开Kimi失败:', error);
        alert('无法打开Kimi AI助手，请稍后重试');
    }
}

// 添加当前时间显示功能
function updateTimeDisplay() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
        timeElement.textContent = timeString;
    }
}

// 添加天气显示功能（独立更新，不随时间闪动）
async function updateWeatherDisplay() {
    const weatherElement = document.getElementById('current-weather');
    if (!weatherElement) return;
    
    try {
        // 使用免费的天气API获取天气信息
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FShanghai');
        const data = await response.json();
        
        if (data && data.current) {
            const weatherCode = data.current.weather_code;
            const temperature = Math.round(data.current.temperature_2m);
            const windSpeed = Math.round(data.current.wind_speed_10m);
            
            const weatherEmoji = getWeatherEmoji(weatherCode);
            const weatherText = getWeatherText(weatherCode);
            
            weatherElement.innerHTML = `${weatherEmoji} ${weatherText} ${temperature}°C 风速${windSpeed}km/h`;
        } else {
            // 如果API调用失败，显示默认天气信息
            weatherElement.innerHTML = '🌤️ 天气数据加载中...';
        }
    } catch (error) {
        console.warn('天气数据获取失败:', error);
        weatherElement.innerHTML = '🌤️ 天气数据加载中...';
    }
}

// 获取天气emoji
function getWeatherEmoji(code) {
    const weatherMap = {
        0: '☀️',   // Clear sky
        1: '🌤️',   // Mainly clear
        2: '⛅',    // Partly cloudy
        3: '☁️',    // Overcast
        45: '🌫️',   // Fog
        48: '🌫️',   // Depositing rime fog
        51: '🌦️',   // Light drizzle
        53: '🌧️',   // Moderate drizzle
        55: '🌧️',   // Dense drizzle
        61: '🌦️',   // Slight rain
        63: '🌧️',   // Moderate rain
        65: '暴雨',  // Heavy rain
        71: '🌨️',   // Slight snow fall
        73: '❄️',   // Moderate snow fall
        75: '❄️',   // Heavy snow fall
        80: '🌦️',   // Slight rain showers
        81: '🌧️',   // Moderate rain showers
        82: '暴雨',  // Violent rain showers
        95: '⛈️'    // Thunderstorm
    };
    return weatherMap[code] || '🌤️';
}

// 获取天气文字描述
function getWeatherText(code) {
    const weatherMap = {
        0: '晴天',
        1: '晴间多云',
        2: '多云',
        3: '阴天',
        45: '雾',
        48: '雾',
        51: '小毛毛雨',
        53: '毛毛雨',
        55: '大雨',
        61: '小雨',
        63: '中雨',
        65: '大雨',
        71: '小雪',
        73: '中雪',
        75: '大雪',
        80: '小阵雨',
        81: '中阵雨',
        82: '大阵雨',
        95: '雷暴'
    };
    return weatherMap[code] || '天气';
}

// 初始化时间显示
document.addEventListener('DOMContentLoaded', () => {
    // 更新时间显示
    updateTimeDisplay();
    
    // 每秒更新时间
    setInterval(updateTimeDisplay, 1000);
    
    // 初始化天气显示
    updateWeatherDisplay();
    
    // 每5分钟更新一次天气（避免API调用过于频繁）
    setInterval(updateWeatherDisplay, 5 * 60 * 1000);
    
    // 初始化恭喜发财按钮点击事件
    initCaishenClick();
});

/**
 * 初始化恭喜发财按钮点击事件
 */
function initCaishenClick() {
    const caishenTitle = document.getElementById('caishen-title');
    if (caishenTitle) {
        caishenTitle.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 检查是否为夜间模式
            const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
            
            if (isDarkTheme) {
                // 夜间模式下允许访问CodeManage
                window.open('CodeManage/index.html', '_blank');
            } else {
                // 白天模式下显示提示信息
                alert('只有在夜间模式下才能访问CodeManage功能哦！\n请先点击右上角的月亮图标切换到夜间模式。');
                
                // 可选：添加视觉反馈效果
                caishenTitle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    caishenTitle.style.transform = 'scale(1)';
                }, 150);
            }
        });
        
        // 添加悬停效果
        caishenTitle.addEventListener('mouseenter', () => {
            caishenTitle.style.cursor = 'pointer';
            caishenTitle.style.textShadow = '0 0 10px #00f3ff, 0 0 20px #00f3ff';
        });
        
        caishenTitle.addEventListener('mouseleave', () => {
            caishenTitle.style.textShadow = 'none';
        });
    }
}
