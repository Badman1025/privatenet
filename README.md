# Feng's Homepage - Personal Entertainment Collection Site

A modern personal entertainment collection website showcasing various practical tools, entertainment resources, and research platforms. Built with cutting-edge web technologies featuring smooth animations, responsive design, and excellent user experience.

## 🚀 Features

### 🎨 **Visual Design**
- **Dark Theme with Neon Accents**: Futuristic aesthetics with electric blue, purple, and cyan highlights
- **Custom Cursor**: Interactive cursor with trailing effects and hover responses
- **Floating Elements**: Dynamic background elements with smooth animations
- **Neon Glow Effects**: Text and button effects with pulsing and flickering animations
- **Parallax Scrolling**: Depth and immersion through layered scrolling effects

### ⚡ **Interactive Elements**
- **Smooth Animations**: GSAP-powered animations throughout the site
- **Scroll-triggered Effects**: Elements animate into view as you scroll
- **Categorized Quick Access**: Quick access links organized by category
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Real-time Weather Display**: Shows current time and weather information

### 📱 **Responsive Design**
- **Mobile-first Approach**: Optimized for all screen sizes
- **Touch-friendly**: Enhanced interactions for mobile devices
- **Adaptive Layouts**: Grid systems that adapt to different viewports
- **Performance Optimized**: Fast loading and smooth interactions

### 🔧 **Technical Features**
- **Theme Toggle**: Light/dark mode with smooth transitions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Optimized images, lazy loading, and efficient animations
- **Modern JavaScript**: ES6+ features with comprehensive error handling

## 🛠️ Tech Stack

### Frontend Technologies
- **HTML5**: Semantic markup for SEO and accessibility
- **CSS3**: Advanced CSS with custom properties and animations
- **JavaScript (ES6+)**: Modern JavaScript with modules and async/await
- **GSAP**: Professional-grade animation library
- **ScrollTrigger**: Advanced scroll-based animations

### Design & Styling
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Variables**: Theme management and consistent styling
- **Media Queries**: Responsive design for all devices
- **Font Awesome**: Icon library for consistent visuals

### Performance & Optimization
- **Lazy Loading**: Images and content load as needed
- **Intersection Observer**: Efficient scroll detection
- **Debouncing/Throttling**: Optimized event handling
- **CSS Transforms**: Hardware-accelerated animations

## 📁 Project Structure

```
privatenet/
├── index.html              # Main HTML file with semantic structure
├── css/                    # Stylesheets
│   ├── styles.css         # Main styles with theme variables
│   ├── animations.css     # Advanced animations and effects
│   ├── entertainment.css  # Entertainment section styles
│   └── responsive.css     # Responsive design for all devices
├── js/                     # JavaScript files
│   ├── main.js           # Core functionality and interactions
│   ├── animations.js     # GSAP animations and scroll effects
│   ├── interactions.js   # Enhanced user interactions
│   └── entertainment.js  # Entertainment functionality
├── assets/                 # Static assets
│   ├── images/           # Project images and content
│   ├── icons/           # Custom icons and favicon
│   └── fonts/           # Custom fonts (optional)
└── README.md            # Project documentation
```

## 🎯 Key Sections

### 1. **Header Section**
- Personal avatar and information display
- Theme toggle button
- Mobile menu button
- Time and weather display

### 2. **Today's Good Mood**
- Capricorn daily horoscope recommendations
- Kugou Music quick access
- Real-time time and weather information
- Dynamic recommendation cards

### 3. **Entertainment Section**
- Dandanju (Video & Film)
- Dadaqu (Entertainment & Leisure)
- Bilibili (Bilibili)
- Categorized quick cards

### 4. **Tools Section**
- Software Academy (Software Learning)
- PDF24 (PDF Tools Collection)
- CleverPDF (PDF Processing Tools)
- Practical Tools Collection

### 5. **Research Section**
- GitHub (Code Hosting)
- Ruijing Academic (Academic Resources)
- IBS 2.0 (Bioinformatics Tools)
- Biorender (Research Drawing)
- BioGDP (Bioinformatics Data Analysis)
- FreePik (Research Image Materials)

### 6. **Management Section**
- WeChat Public Platform (Official Account Management)
- Weifujian X (Document Management)
- Weifujian (Cloud Documents)
- Digitalplat Platform (Domain Management)
- CloudFlare (Domain Hosting)
- APA Database (Research Resources)

## 🌙 Theme System

The website features a sophisticated theme system:

- **Dark Theme (Default)**: Futuristic dark background with neon accents
- **Light Theme**: Clean white theme with subtle shadows
- **Auto-detection**: Respects system theme preferences
- **Smooth Transitions**: Theme changes animate smoothly
- **Persistent Storage**: Theme preference saved to localStorage

## 🎮 Keyboard Shortcuts

Enhanced keyboard navigation:
- **Home**: Scroll to top
- **End**: Scroll to bottom
- **Escape**: Close modals and mobile menu
- **Ctrl/Cmd + T**: Toggle theme
- **Tab**: Navigate interactive elements

## 📱 Mobile Features

- **Hamburger Menu**: Collapsible navigation for small screens
- **Touch Optimizations**: Larger touch targets and swipe gestures
- **Adaptive Animations**: Reduced motion for better performance
- **Mobile-first Design**: Prioritizes mobile experience

## 🔧 Customization

### Colors
Edit CSS variables in `:root` to customize the color scheme:
```css
--neon-blue: #00f3ff;
--neon-purple: #b967ff;
--neon-cyan: #00e5ff;
--neon-pink: #ff0055;
--neon-green: #00ff88;
```

### Typography
Update font families in CSS variables:
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-secondary: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Animations
Modify animation durations and easing in the JavaScript files:
```javascript
// In animations.js
defaults: {
    ease: 'power3.out',
    duration: 1
}
```

## 🚀 Performance Features

- **Optimized Assets**: Compressed images and efficient file sizes
- **Lazy Loading**: Images load only when visible
- **Efficient Animations**: Hardware-accelerated CSS transforms
- **Minimal Dependencies**: Only essential external libraries
- **Code Splitting**: Organized JavaScript for better loading

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📝 Usage

1. **Local Development**:
   ```bash
   # Open index.html in your browser
   # Or use a local server for better experience
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

2. **Deployment**:
   - Upload all files to your web server
   - Ensure proper file permissions
   - Test on different devices and browsers

3. **Content Updates**:
   - Edit `index.html` for content changes
   - Update CSS files for styling changes
   - Modify JavaScript files for functionality changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **GSAP**: For the incredible animation library
- **Font Awesome**: For the icon library
- **Google Fonts**: For the typography
- **Modern CSS**: For the styling capabilities

## 📞 Contact

For questions, suggestions:
- Email: [zy2023023069@stu.imust.edu.cn](mailto:zy2023023069@stu.imust.edu.cn)
- Website: [privatenet.github.io](https://www.privatenet.dpdns.org/)
- GitHub: [Badman1025](https://github.com/Badman1025)

---

**Built with ❤️ using modern web technologies**
