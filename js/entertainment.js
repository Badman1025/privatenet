/**
 * Entertainment Collection Site JavaScript
 * Interactive functionality for personal digital garden
 */

// Main Entertainment Application Class
class EntertainmentApp {
    constructor() {
        this.currentTheme = 'light';
        this.collections = this.loadCollections();
        this.records = this.loadRecords();
        this.todayRecommendation = null;
        
        this.init();
    }
    
    init() {
        this.setupThemeSystem();
        this.setupQuickAccess();
        this.setupCategoryTabs();
        this.setupRecordTabs();
        this.setupNoteEditor();
        this.setupToolActions();
        this.setupRecommendationSystem();
        this.setupMobileMenu();
        this.setupAnimations();
        this.renderStats();
    }
    
    // Theme System
    setupThemeSystem() {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update theme icon
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Quick Access Management
    setupQuickAccess() {
        const quickCards = document.querySelectorAll('.quick-card');
        quickCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const url = card.getAttribute('onclick');
                if (url) {
                    this.openLink(card.dataset.category);
                }
            });
        });
    }
    
    openLink(category) {
        // Default links based on category
        const links = {
            '影视': 'https://www.bilibili.com',
            '音乐': 'https://music.163.com',
            '图片': 'https://www.behance.net',
            '游戏': 'https://store.steampowered.com',
            '阅读': 'https://www.zhihu.com',
            '工具': 'https://www.google.com'
        };
        
        const url = links[category] || 'https://www.google.com';
        window.open(url, '_blank');
        
        // Add click animation
        this.addClickEffect(category);
    }
    
    addClickEffect(category) {
        const card = document.querySelector(`.quick-card[data-category="${category}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateY(-10px)';
            }, 150);
        }
    }
    
    // Category Tabs
    setupCategoryTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.dataset.tab;
                const section = btn.closest('.content-card').dataset.section;
                
                // Update active button
                btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show/hide content
                const contentContainer = btn.closest('.card-content');
                const tabPanels = contentContainer.querySelectorAll('.tab-panel');
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === tabName) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Record Tabs
    setupRecordTabs() {
        const recordTabButtons = document.querySelectorAll('.record-tabs .tab-btn');
        recordTabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.dataset.tab;
                
                // Update active button
                btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show/hide content
                const contentContainer = btn.closest('.card-content');
                const recordPanels = contentContainer.querySelectorAll('.record-panel');
                recordPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === tabName) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Note Editor
    setupNoteEditor() {
        const noteInput = document.getElementById('note-input');
        const saveBtn = document.querySelector('.note-actions .btn-primary');
        const clearBtn = document.querySelector('.note-actions .btn-outline');
        
        if (noteInput && saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNote(noteInput.value);
                noteInput.value = '';
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                noteInput.value = '';
            });
        }
        
        // Auto-save on Enter
        if (noteInput) {
            noteInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveNote(noteInput.value);
                    noteInput.value = '';
                }
            });
        }
    }
    
    saveNote(content) {
        if (!content.trim()) return;
        
        const note = {
            id: Date.now(),
            content: content.trim(),
            date: new Date().toLocaleDateString('zh-CN')
        };
        
        this.records.notes.push(note);
        this.saveRecords();
        this.renderNotes();
        
        // Show success message
        this.showNotification('笔记保存成功！');
    }
    
    renderNotes() {
        const noteList = document.querySelector('.note-list');
        if (!noteList) return;
        
        noteList.innerHTML = '';
        
        this.records.notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.innerHTML = `
                <div class="note-content">
                    <p>${note.content}</p>
                </div>
                <div class="note-meta">
                    <span class="note-date">${note.date}</span>
                    <button class="note-delete" onclick="app.deleteNote(${note.id})">删除</button>
                </div>
            `;
            noteList.appendChild(noteItem);
        });
    }
    
    deleteNote(id) {
        this.records.notes = this.records.notes.filter(note => note.id !== id);
        this.saveRecords();
        this.renderNotes();
        this.showNotification('笔记已删除');
    }
    
    // Tool Actions
    setupToolActions() {
        const toolItems = document.querySelectorAll('.tool-item');
        toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolType = item.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.openTool(toolType);
            });
        });
    }
    
    openTool(toolType) {
        const tools = {
            'converter': 'https://cloudconvert.com/',
            'image': 'https://pixlr.com/',
            'download': 'https://downsub.com/',
            'calculator': 'https://www.desmos.com/calculator',
            'notebook': '#',
            'timer': '#'
        };
        
        if (toolType === 'notebook') {
            this.openNotebook();
        } else if (toolType === 'timer') {
            this.openTimer();
        } else {
            window.open(tools[toolType], '_blank');
        }
    }
    
    openNotebook() {
        const content = prompt('请输入笔记内容：');
        if (content) {
            this.saveNote(content);
        }
    }
    
    openTimer() {
        const minutes = prompt('请输入倒计时分钟数：', '25');
        if (minutes && !isNaN(minutes)) {
            this.startTimer(parseInt(minutes));
        }
    }
    
    startTimer(minutes) {
        const seconds = minutes * 60;
        let remaining = seconds;
        
        const modal = document.createElement('div');
        modal.className = 'timer-modal';
        modal.innerHTML = `
            <div class="timer-content">
                <h3>番茄工作法计时器</h3>
                <div class="timer-display">${minutes}:00</div>
                <div class="timer-controls">
                    <button onclick="app.pauseTimer()">暂停</button>
                    <button onclick="app.resetTimer()">重置</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const timerDisplay = modal.querySelector('.timer-display');
        const interval = setInterval(() => {
            remaining--;
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            
            if (remaining <= 0) {
                clearInterval(interval);
                modal.remove();
                alert('时间到！休息一下吧~');
            }
        }, 1000);
        
        // Store interval for pause/reset
        window.currentTimer = { interval, remaining };
    }
    
    pauseTimer() {
        if (window.currentTimer) {
            clearInterval(window.currentTimer.interval);
        }
    }
    
    resetTimer() {
        if (window.currentTimer) {
            clearInterval(window.currentTimer.interval);
            document.querySelector('.timer-modal')?.remove();
        }
    }
    
    // Recommendation System
    setupRecommendationSystem() {
        this.generateDailyRecommendation();
        this.updateRecommendationDisplay();
        
        // Update recommendation every hour
        setInterval(() => {
            this.generateDailyRecommendation();
            this.updateRecommendationDisplay();
        }, 3600000);
    }
    
    generateDailyRecommendation() {
        const recommendations = [
            {
                title: '星际穿越',
                desc: '一部关于时间、爱与人类探索精神的科幻巨作',
                category: '🎬 影视',
                rating: '⭐ 9.5',
                action: () => this.openLink('影视')
            },
            {
                title: '夜曲',
                desc: '周杰伦经典作品，夜晚聆听最佳',
                category: '🎵 音乐',
                rating: '⭐ 9.8',
                action: () => this.openLink('音乐')
            },
            {
                title: 'Behance创意作品',
                desc: '发现全球最优秀的设计师作品',
                category: '🖼️ 图片',
                rating: '⭐ 9.2',
                action: () => this.openLink('图片')
            },
            {
                title: '原神',
                desc: '开放世界冒险游戏，画质精美',
                category: '🎮 游戏',
                rating: '⭐ 9.0',
                action: () => this.openLink('游戏')
            },
            {
                title: '三体',
                desc: '刘慈欣科幻巨作，必读经典',
                category: '📖 阅读',
                rating: '⭐ 9.7',
                action: () => this.openLink('阅读')
            }
        ];
        
        const randomIndex = Math.floor(Math.random() * recommendations.length);
        this.todayRecommendation = recommendations[randomIndex];
    }
    
    updateRecommendationDisplay() {
        if (!this.todayRecommendation) return;
        
        const titleEl = document.getElementById('rec-title');
        const descEl = document.getElementById('rec-desc');
        const categoryEl = document.querySelector('.rec-category');
        const ratingEl = document.querySelector('.rec-rating');
        const actionBtn = document.querySelector('.rec-action-btn');
        
        if (titleEl) titleEl.textContent = this.todayRecommendation.title;
        if (descEl) descEl.textContent = this.todayRecommendation.desc;
        if (categoryEl) categoryEl.textContent = this.todayRecommendation.category;
        if (ratingEl) ratingEl.textContent = this.todayRecommendation.rating;
        
        if (actionBtn) {
            actionBtn.onclick = this.todayRecommendation.action;
        }
    }
    
    // Mobile Menu
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }
    
    // Animations
    setupAnimations() {
        // GSAP animations for cards
        const cards = document.querySelectorAll('.content-card, .quick-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out' });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
            });
        });
        
        // Floating animation for recommendation
        const recCard = document.querySelector('.recommendation-card');
        if (recCard) {
            gsap.to(recCard, {
                y: -10,
                duration: 2,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    // Statistics
    renderStats() {
        // Update quick stats
        const stats = {
            '快捷入口': 12,
            '分类管理': 5,
            '今日': '推荐更新'
        };
        
        Object.entries(stats).forEach(([label, value]) => {
            const statEl = document.querySelector(`.stat-label[data-label="${label}"]`);
            if (statEl) {
                statEl.previousElementSibling.textContent = value;
            }
        });
    }
    
    // Utility Functions
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    loadCollections() {
        const saved = localStorage.getItem('collections');
        return saved ? JSON.parse(saved) : {
            movies: [],
            music: [],
            games: [],
            books: [],
            tools: []
        };
    }
    
    saveCollections() {
        localStorage.setItem('collections', JSON.stringify(this.collections));
    }
    
    loadRecords() {
        const saved = localStorage.getItem('records');
        return saved ? JSON.parse(saved) : {
            movies: [],
            music: [],
            notes: []
        };
    }
    
    saveRecords() {
        localStorage.setItem('records', JSON.stringify(this.records));
    }
    
    // Export/Import Data 功能已删除
}

// Global Functions for HTML onclick events
window.openLink = function(category) {
    if (window.app) {
        window.app.openLink(category);
    } else {
        // Fallback - use direct links instead of hardcoded ones
        const links = {
            '影视': 'https://www.bilibili.com',
            '音乐': 'https://music.163.com',
            '图片': 'https://www.behance.net',
            '游戏': 'https://store.steampowered.com',
            '阅读': 'https://www.zhihu.com',
            '工具': 'https://www.google.com'
        };
        window.open(links[category] || 'https://www.google.com', '_blank');
    }
};

// Direct function for Kimi AI to avoid conflicts
window.openKimiDirect = function() {
    window.open('https://www.kimi.com/', '_blank');
};

window.openTool = function(toolType) {
    if (window.app) {
        window.app.openTool(toolType);
    }
};

window.saveNote = function() {
    if (window.app) {
        const content = document.getElementById('note-input').value;
        window.app.saveNote(content);
    }
};

window.clearNote = function() {
    document.getElementById('note-input').value = '';
};


// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EntertainmentApp();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent-blue);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 3000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .timer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
        }
        
        .timer-content {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: var(--shadow-lg);
        }
        
        .timer-display {
            font-size: 3rem;
            font-weight: 700;
            margin: 1rem 0;
            color: var(--accent-blue);
        }
        
        .timer-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .timer-controls button {
            background: var(--accent-blue);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});