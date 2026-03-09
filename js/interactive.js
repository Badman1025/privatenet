/**
 * Interactive Features JavaScript
 * Handles music player, games, virtual pet, and other interactive elements
 */

// Music Player Class
class MusicPlayer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.songs = [
            {
                title: 'Neon Dreams',
                artist: 'Synthwave Collective',
                duration: 222,
                genre: 'Synthwave',
                color: '#00f3ff'
            },
            {
                title: 'Digital Rain',
                artist: 'Cyberpunk Sound',
                duration: 185,
                genre: 'Ambient',
                color: '#b967ff'
            },
            {
                title: 'Code Flow',
                artist: 'Developer Beats',
                duration: 256,
                genre: 'Lo-fi',
                color: '#00e5ff'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupVisualizer();
        this.bindEvents();
        this.loadSong(0);
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    setupVisualizer() {
        this.visualizerCanvas = document.getElementById('visualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        // Set canvas size
        this.visualizerCanvas.width = 800;
        this.visualizerCanvas.height = 200;
        
        this.animateVisualizer();
    }
    
    animateVisualizer() {
        if (!this.analyser) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            this.visualizerCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.visualizerCtx.fillRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
            
            const barWidth = (this.visualizerCanvas.width / bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 255 * this.visualizerCanvas.height;
                
                this.visualizerCtx.fillStyle = `rgba(0, 243, 255, ${dataArray[i] / 255})`;
                this.visualizerCtx.fillRect(x, this.visualizerCanvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
    
    loadSong(index) {
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        // Update UI
        document.getElementById('song-title').textContent = song.title;
        document.getElementById('song-artist').textContent = song.artist;
        document.getElementById('song-duration').textContent = this.formatTime(song.duration);
        document.getElementById('song-genre').textContent = song.genre;
        
        // Update colors
        document.documentElement.style.setProperty('--current-color', song.color);
        
        // Simulate audio loading
        this.updateProgress(0);
    }
    
    playPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
        
        // Simulate progress
        this.startProgress();
    }
    
    pause() {
        this.isPlaying = false;
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
    }
    
    next() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) this.play();
    }
    
    prev() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) this.play();
    }
    
    startProgress() {
        const song = this.songs[this.currentSongIndex];
        let currentTime = 0;
        
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentTime += 0.1;
            const progress = (currentTime / song.duration) * 100;
            
            this.updateProgress(progress);
            document.getElementById('current-time').textContent = this.formatTime(Math.floor(currentTime));
            
            if (progress >= 100) {
                clearInterval(interval);
                this.next();
            }
        }, 100);
    }
    
    updateProgress(percentage) {
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${percentage}%`;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Virtual Pet Class
class VirtualPet {
    constructor() {
        this.stats = {
            happiness: 80,
            hunger: 30,
            energy: 70
        };
        
        this.petElement = document.getElementById('pet-avatar');
        this.happinessBar = document.getElementById('happiness-bar');
        this.hungerBar = document.getElementById('hunger-bar');
        this.energyBar = document.getElementById('energy-bar');
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.bindEvents();
        
        // Auto-decrease stats over time
        setInterval(() => {
            this.decreaseStats();
            this.updateStats();
        }, 5000);
    }
    
    updateStats() {
        // Update bars
        this.happinessBar.style.width = `${this.stats.happiness}%`;
        this.hungerBar.style.width = `${100 - this.stats.hunger}%`;
        this.energyBar.style.width = `${this.stats.energy}%`;
        
        // Update pet appearance based on stats
        this.updatePetAppearance();
    }
    
    updatePetAppearance() {
        const pet = this.petElement;
        
        // Happiness affects color
        if (this.stats.happiness > 70) {
            pet.style.borderColor = '#00ff88';
            pet.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
        } else if (this.stats.happiness > 30) {
            pet.style.borderColor = '#ffff00';
            pet.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.3)';
        } else {
            pet.style.borderColor = '#ff0055';
            pet.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.3)';
        }
        
        // Energy affects size
        const scale = 0.8 + (this.stats.energy / 100) * 0.4;
        pet.style.transform = `scale(${scale})`;
    }
    
    decreaseStats() {
        this.stats.happiness = Math.max(0, this.stats.happiness - 2);
        this.stats.hunger = Math.min(100, this.stats.hunger + 3);
        this.stats.energy = Math.max(0, this.stats.energy - 1);
    }
    
    feed() {
        this.stats.hunger = Math.max(0, this.stats.hunger - 30);
        this.stats.happiness = Math.min(100, this.stats.happiness + 10);
        this.showActionEffect('feed');
    }
    
    play() {
        this.stats.happiness = Math.min(100, this.stats.happiness + 20);
        this.stats.energy = Math.max(0, this.stats.energy - 20);
        this.showActionEffect('play');
    }
    
    sleep() {
        this.stats.energy = Math.min(100, this.stats.energy + 50);
        this.stats.happiness = Math.max(0, this.stats.happiness - 5);
        this.showActionEffect('sleep');
    }
    
    pet() {
        this.stats.happiness = Math.min(100, this.stats.happiness + 5);
        this.showActionEffect('pet');
    }
    
    showActionEffect(action) {
        const effect = document.createElement('div');
        effect.className = 'pet-effect';
        effect.textContent = action === 'feed' ? 'Yum!' : 
                           action === 'play' ? 'Wheee!' : 
                           action === 'sleep' ? 'Zzz...' : 'Purr~';
        
        effect.style.position = 'absolute';
        effect.style.top = '0';
        effect.style.left = '50%';
        effect.style.transform = 'translateX(-50%)';
        effect.style.color = '#fff';
        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'floatUp 1s ease-out';
        
        this.petElement.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    bindEvents() {
        document.querySelectorAll('.pet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this[action]();
            });
        });
    }
}

// Mini Games Class
class MiniGames {
    constructor() {
        this.currentGame = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = card.dataset.game;
                this.startGame(gameType);
            });
        });
    }
    
    startGame(type) {
        this.currentGame = type;
        
        // Create game overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="game-modal">
                <button class="close-game">✕</button>
                <h3>${this.getGameTitle(type)}</h3>
                <div class="game-content" id="game-content"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Initialize specific game
        this.initGame(type);
        
        // Close button
        overlay.querySelector('.close-game').addEventListener('click', () => {
            overlay.remove();
            this.currentGame = null;
        });
    }
    
    getGameTitle(type) {
        const titles = {
            'pixel-art': 'Pixel Canvas',
            'memory-match': 'Memory Match',
            'typing-race': 'Typing Race',
            'puzzle': 'Logic Puzzle'
        };
        return titles[type] || 'Game';
    }
    
    initGame(type) {
        const content = document.getElementById('game-content');
        
        switch(type) {
            case 'pixel-art':
                this.initPixelArt(content);
                break;
            case 'memory-match':
                this.initMemoryMatch(content);
                break;
            case 'typing-race':
                this.initTypingRace(content);
                break;
            case 'puzzle':
                this.initPuzzle(content);
                break;
        }
    }
    
    initPixelArt(container) {
        container.innerHTML = `
            <div class="pixel-grid" id="pixel-grid"></div>
            <div class="pixel-tools">
                <button class="tool-btn active" data-color="#00f3ff">Cyan</button>
                <button class="tool-btn" data-color="#b967ff">Purple</button>
                <button class="tool-btn" data-color="#ff0055">Pink</button>
                <button class="tool-btn" data-color="#00e5ff">Blue</button>
                <button class="tool-btn" data-color="#000000">Black</button>
                <button class="tool-btn" data-color="#ffffff">Eraser</button>
            </div>
            <button class="clear-btn">Clear Canvas</button>
        `;
        
        const grid = document.getElementById('pixel-grid');
        const tools = document.querySelectorAll('.tool-btn');
        let currentColor = '#00f3ff';
        
        // Create 20x20 grid
        for (let i = 0; i < 400; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.addEventListener('mousedown', () => {
                pixel.style.backgroundColor = currentColor;
            });
            pixel.addEventListener('mouseover', (e) => {
                if (e.buttons === 1) {
                    pixel.style.backgroundColor = currentColor;
                }
            });
            grid.appendChild(pixel);
        }
        
        // Tool selection
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                currentColor = tool.dataset.color;
            });
        });
        
        // Clear button
        document.querySelector('.clear-btn').addEventListener('click', () => {
            document.querySelectorAll('.pixel').forEach(pixel => {
                pixel.style.backgroundColor = '';
            });
        });
    }
    
    initMemoryMatch(container) {
        const emojis = ['🎨', '🧠', '⌨️', '🧩', '🎵', '🎮', '☕', '📚'];
        const cards = [...emojis, ...emojis];
        cards.sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="memory-grid" id="memory-grid"></div>
            <div class="game-stats">
                <span>Moves: <span id="moves">0</span></span>
                <span>Time: <span id="time">0</span>s</span>
            </div>
            <button class="restart-btn">Restart</button>
        `;
        
        const grid = document.getElementById('memory-grid');
        let moves = 0;
        let time = 0;
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let matchedPairs = 0;
        
        // Create cards
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = emoji;
            
            const back = document.createElement('div');
            back.className = 'card-back';
            
            card.appendChild(front);
            card.appendChild(back);
            card.addEventListener('click', () => this.flipCard(card));
            grid.appendChild(card);
        });
        
        // Timer
        const timer = setInterval(() => {
            time++;
            document.getElementById('time').textContent = time;
        }, 1000);
        
        this.flipCard = (card) => {
            if (lockBoard) return;
            if (card === firstCard) return;
            
            card.classList.add('flipped');
            
            if (!firstCard) {
                firstCard = card;
                return;
            }
            
            secondCard = card;
            moves++;
            document.getElementById('moves').textContent = moves;
            
            this.checkForMatch();
        };
        
        this.checkForMatch = () => {
            let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
            
            if (isMatch) {
                matchedPairs++;
                if (matchedPairs === emojis.length) {
                    setTimeout(() => {
                        alert(`Congratulations! You won in ${moves} moves and ${time} seconds!`);
                        clearInterval(timer);
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                }, 1000);
            }
            
            [firstCard, secondCard] = [null, null];
        };
    }
    
    initTypingRace(container) {
        const sentences = [
            "The quick brown fox jumps over the lazy dog",
            "Programming is the art of telling a computer what to do",
            "Creativity is intelligence having fun",
            "Code is poetry written in logic",
            "Every great developer you know got there by solving problems"
        ];
        
        container.innerHTML = `
            <div class="typing-display">
                <p id="target-text">${sentences[0]}</p>
                <input type="text" id="typing-input" placeholder="Start typing...">
            </div>
            <div class="typing-stats">
                <span>WPM: <span id="wpm">0</span></span>
                <span>Accuracy: <span id="accuracy">0</span>%</span>
                <span>Time: <span id="typing-time">0</span>s</span>
            </div>
            <button class="restart-typing">New Sentence</button>
        `;
        
        const input = document.getElementById('typing-input');
        const targetText = document.getElementById('target-text');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const timeDisplay = document.getElementById('typing-time');
        
        let startTime = null;
        let totalChars = 0;
        let correctChars = 0;
        let timeElapsed = 0;
        
        input.addEventListener('input', (e) => {
            if (!startTime) startTime = Date.now();
            
            const typed = e.target.value;
            const target = targetText.textContent;
            
            // Calculate accuracy
            correctChars = 0;
            for (let i = 0; i < typed.length; i++) {
                if (typed[i] === target[i]) correctChars++;
            }
            
            const acc = Math.round((correctChars / typed.length) * 100) || 0;
            accuracyDisplay.textContent = acc;
            
            // Calculate WPM
            timeElapsed = (Date.now() - startTime) / 1000;
            const words = typed.split(' ').length;
            const wpm = Math.round((words / timeElapsed) * 60);
            wpmDisplay.textContent = wpm;
            timeDisplay.textContent = Math.floor(timeElapsed);
            
            // Check completion
            if (typed === target) {
                alert(`Complete! ${wpm} WPM, ${acc}% accuracy in ${Math.floor(timeElapsed)}s`);
                this.restartTyping();
            }
        });
        
        document.querySelector('.restart-typing').addEventListener('click', () => {
            this.restartTyping();
        });
    }
    
    restartTyping() {
        const sentences = [
            "The quick brown fox jumps over the lazy dog",
            "Programming is the art of telling a computer what to do",
            "Creativity is intelligence having fun",
            "Code is poetry written in logic",
            "Every great developer you know got there by solving problems"
        ];
        
        document.getElementById('target-text').textContent = sentences[Math.floor(Math.random() * sentences.length)];
        document.getElementById('typing-input').value = '';
        document.getElementById('wpm').textContent = '0';
        document.getElementById('accuracy').textContent = '0';
        document.getElementById('typing-time').textContent = '0';
        startTime = null;
        totalChars = 0;
        correctChars = 0;
        timeElapsed = 0;
    }
    
    initPuzzle(container) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ''];
        numbers.sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="puzzle-grid" id="puzzle-grid"></div>
            <div class="puzzle-stats">
                <span>Moves: <span id="puzzle-moves">0</span></span>
            </div>
            <button class="shuffle-btn">Shuffle</button>
        `;
        
        const grid = document.getElementById('puzzle-grid');
        let moves = 0;
        
        const createPuzzle = () => {
            grid.innerHTML = '';
            numbers.forEach((num, index) => {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';
                tile.textContent = num;
                tile.dataset.index = index;
                
                if (!num) {
                    tile.classList.add('empty');
                }
                
                tile.addEventListener('click', () => this.moveTile(tile));
                grid.appendChild(tile);
            });
        };
        
        createPuzzle();
        
        document.querySelector('.shuffle-btn').addEventListener('click', () => {
            numbers.sort(() => Math.random() - 0.5);
            moves = 0;
            document.getElementById('puzzle-moves').textContent = moves;
            createPuzzle();
        });
    }
    
    moveTile(tile) {
        const index = parseInt(tile.dataset.index);
        const emptyIndex = Array.from(document.querySelectorAll('.puzzle-tile')).findIndex(t => t.classList.contains('empty'));
        
        // Check if adjacent
        const isAdjacent = (index === emptyIndex - 1 && index % 4 !== 3) ||
                          (index === emptyIndex + 1 && emptyIndex % 4 !== 3) ||
                          (index === emptyIndex - 4) ||
                          (index === emptyIndex + 4);
        
        if (isAdjacent) {
            // Swap
            const emptyTile = document.querySelector('.empty');
            const tempText = tile.textContent;
            tile.textContent = emptyTile.textContent;
            emptyTile.textContent = tempText;
            
            // Update classes
            tile.classList.add('empty');
            emptyTile.classList.remove('empty');
            
            // Update data-index
            tile.dataset.index = emptyIndex;
            emptyTile.dataset.index = index;
            
            moves++;
            document.getElementById('puzzle-moves').textContent = moves;
            
            this.checkWin();
        }
    }
    
    checkWin() {
        const tiles = document.querySelectorAll('.puzzle-tile');
        const winCondition = Array.from(tiles).every((tile, index) => {
            if (index === 15) return tile.classList.contains('empty');
            return parseInt(tile.textContent) === index + 1;
        });
        
        if (winCondition) {
            alert(`Congratulations! You solved the puzzle in ${moves} moves!`);
        }
    }
}

// Personal Avatar Class
class PersonalAvatar {
    constructor() {
        this.canvas = document.getElementById('personal-avatar');
        this.ctx = this.canvas.getContext('2d');
        this.mood = 'creative';
        this.outfit = 'casual';
        this.accessories = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.drawAvatar();
    }
    
    bindEvents() {
        document.querySelectorAll('.avatar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this[action]();
            });
        });
        
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');
                this.changeMood(e.target.style.background);
            });
        });
    }
    
    drawAvatar() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background glow
        const gradient = ctx.createRadialGradient(200, 200, 50, 200, 200, 200);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw avatar body
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(200, 200, 80, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(170, 180, 10, 0, Math.PI * 2);
        ctx.arc(230, 180, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(200, 220, 30, 0, Math.PI);
        ctx.stroke();
        
        // Draw outfit
        if (this.outfit === 'casual') {
            ctx.fillStyle = '#00f3ff';
            ctx.fillRect(150, 240, 100, 40);
        } else if (this.outfit === 'formal') {
            ctx.fillStyle = '#b967ff';
            ctx.fillRect(140, 240, 120, 50);
            // Tie
            ctx.fillStyle = '#00e5ff';
            ctx.fillRect(195, 290, 10, 20);
        }
        
        // Draw accessories
        this.accessories.forEach(accessory => {
            this.drawAccessory(accessory);
        });
    }
    
    drawAccessory(type) {
        const ctx = this.ctx;
        
        switch(type) {
            case 'glasses':
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(170, 180, 15, 0, Math.PI * 2);
                ctx.arc(230, 180, 15, 0, Math.PI * 2);
                ctx.stroke();
                // Bridge
                ctx.beginPath();
                ctx.moveTo(185, 180);
                ctx.lineTo(215, 180);
                ctx.stroke();
                break;
                
            case 'hat':
                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.arc(200, 120, 40, 0, Math.PI);
                ctx.fill();
                // Brim
                ctx.fillRect(160, 150, 80, 10);
                break;
                
            case 'necklace':
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(200, 260, 20, 0, Math.PI);
                ctx.fill();
                break;
        }
    }
    
    changeMood(color) {
        this.mood = color;
        document.getElementById('current-mood').textContent = this.getMoodText(color);
        this.drawAvatar();
    }
    
    getMoodText(color) {
        const moodMap = {
            '#00f3ff': 'Creative',
            '#b967ff': 'Focused',
            '#00e5ff': 'Calm',
            '#ff0055': 'Energetic'
        };
        return moodMap[color] || 'Creative';
    }
    
    changeOutfit() {
        this.outfit = this.outfit === 'casual' ? 'formal' : 'casual';
        this.drawAvatar();
    }
    
    addAccessories() {
        const accessories = ['glasses', 'hat', 'necklace'];
        const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
        
        if (!this.accessories.includes(randomAccessory)) {
            this.accessories.push(randomAccessory);
        }
        
        this.drawAvatar();
    }
}

// Code Playground Class
class CodePlayground {
    constructor() {
        this.editor = document.getElementById('code-editor');
        this.preview = document.getElementById('code-preview');
        this.tabs = document.querySelectorAll('.tab-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updatePreview();
    }
    
    bindEvents() {
        this.editor.addEventListener('input', () => {
            this.updatePreview();
        });
        
        document.querySelector('.run-btn').addEventListener('click', () => {
            this.updatePreview();
        });
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                // In a real implementation, this would switch between different files
            });
        });
    }
    
    updatePreview() {
        const code = this.editor.value;
        const previewDoc = this.preview.contentDocument;
        
        if (previewDoc) {
            previewDoc.open();
            previewDoc.write(code);
            previewDoc.close();
        }
    }
}

// Initialize all interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize music player
    const musicPlayer = new MusicPlayer();
    
    // Initialize virtual pet
    const virtualPet = new VirtualPet();
    
    // Initialize mini games
    const miniGames = new MiniGames();
    
    // Initialize personal avatar
    const personalAvatar = new PersonalAvatar();
    
    // Initialize code playground
    const codePlayground = new CodePlayground();
    
    // Bind music player controls
    document.getElementById('play-pause').addEventListener('click', () => {
        musicPlayer.playPause();
    });
    
    document.getElementById('next-song').addEventListener('click', () => {
        musicPlayer.next();
    });
    
    document.getElementById('prev-song').addEventListener('click', () => {
        musicPlayer.prev();
    });
    
    // Bind mood theme selection
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const theme = e.target.closest('.theme-card').dataset.theme;
            document.body.setAttribute('data-theme', theme);
            
            // Update music player color
            const colors = {
                'energetic': '#ff0055',
                'chill': '#00f3ff',
                'creative': '#b967ff',
                'retro': '#ffcc00'
            };
            
            musicPlayer.loadSong(musicPlayer.currentSongIndex);
            document.documentElement.style.setProperty('--current-color', colors[theme]);
        });
    });
    
    // Bind playlist buttons
    document.querySelectorAll('.playlist-play').forEach(btn => {
        btn.addEventListener('click', () => {
            musicPlayer.play();
            // In a real implementation, this would load the specific playlist
        });
    });
    
    // Bind personality quiz
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.disabled = true;
                opt.style.opacity = '0.5';
            });
            e.target.style.backgroundColor = '#00f3ff';
            e.target.style.color = '#000';
            
            document.querySelector('.quiz-result').style.display = 'block';
        });
    });
    
    // Bind skill tree interactions
    document.querySelectorAll('.skill-node').forEach(node => {
        node.addEventListener('click', () => {
            node.style.transform = 'scale(1.05)';
            setTimeout(() => {
                node.style.transform = 'translateY(-5px)';
            }, 200);
        });
    });
    
    // Bind recommendation interactions
    document.querySelectorAll('.rec-card li').forEach(item => {
        item.addEventListener('click', () => {
            item.style.color = '#fff';
            item.style.fontWeight = 'bold';
        });
    });
    
    // Add floating animation to achievements
    const achievements = document.querySelectorAll('.achievement-card');
    achievements.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Initialize progress bars animation
    const progressBars = document.querySelectorAll('.stat-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
});

// Add CSS animations for new elements
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
    
    .game-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .game-modal {
        background: #1a1d24;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: var(--spacing-lg);
        width: 80%;
        max-width: 600px;
        position: relative;
    }
    
    .close-game {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .pixel-grid {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 2px;
        background: #000;
        padding: 10px;
        border-radius: 8px;
    }
    
    .pixel {
        width: 10px;
        height: 10px;
        background: #fff;
        cursor: crosshair;
    }
    
    .pixel-tools {
        display: flex;
        gap: 5px;
        margin: 10px 0;
    }
    
    .tool-btn {
        padding: 5px 10px;
        border: 1px solid #fff;
        background: transparent;
        color: #fff;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .tool-btn.active {
        background: #fff;
        color: #000;
    }
    
    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }
    
    .memory-card {
        aspect-ratio: 1;
        background: #333;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        cursor: pointer;
        perspective: 1000px;
    }
    
    .memory-card.flipped .card-front {
        transform: rotateY(180deg);
    }
    
    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: transform 0.6s;
    }
    
    .card-back {
        background: #00f3ff;
        transform: rotateY(180deg);
    }
    
    .puzzle-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
    }
    
    .puzzle-tile {
        aspect-ratio: 1;
        background: #333;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .puzzle-tile:hover {
        background: #555;
    }
    
    .puzzle-tile.empty {
        background: transparent;
        border: 2px dashed #666;
        cursor: default;
    }
    
    .achievement-card {
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);