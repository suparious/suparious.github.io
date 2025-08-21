# 🚀 Shaun Prince - Portfolio Website

[![Website](https://img.shields.io/badge/Website-suparious.com-blue)](https://suparious.com)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-lightgrey)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-purple)](ROADMAP.md)

A modern, interactive portfolio website showcasing 20+ years of experience in Cloud Architecture, AI Engineering, and DevOps. Built with cutting-edge web technologies and designed to make a lasting impression.

## ✨ Features

### 🎨 Modern Design
- **Dark/Light Mode** - Automatic theme detection with manual toggle (Ctrl+Shift+L)
- **Glassmorphism UI** - Modern frosted glass effects throughout
- **Animated Gradients** - Eye-catching gradient animations
- **Responsive Design** - Perfect on all devices from mobile to 4K displays

### 🎭 Interactive Elements
- **Particles.js Background** - Interactive particle network animation
- **Typed.js Effects** - Dynamic role typing animation
- **AOS Animations** - Smooth scroll-triggered animations
- **3D Card Effects** - Hover interactions with depth
- **Magnetic Buttons** - Buttons that follow cursor movement

### 📱 Progressive Web Features
- **Offline Support** - Service Worker for offline functionality
- **Fast Loading** - Optimized assets and lazy loading
- **SEO Optimized** - Meta tags, sitemap, and structured data
- **Accessibility** - WCAG 2.1 A compliant

### 📊 Sections
- **Hero** - Animated introduction with particles
- **About** - Professional bio with code display
- **Skills** - Categorized expertise with progress bars
- **Experience** - Interactive timeline of work history
- **Projects** - Featured projects and GitHub integration
- **Publications** - Technical articles and guides
- **Contact** - Modern contact form with validation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Animations**: Particles.js, Typed.js, AOS (Animate On Scroll)
- **Icons**: Font Awesome 6, Devicon
- **Fonts**: Inter, Space Grotesk
- **Form Handling**: Formspree
- **Hosting**: GitHub Pages
- **Domain**: suparious.com

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/suparious/suparious.github.io.git
   cd suparious.github.io
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

The site automatically deploys to GitHub Pages when pushing to the `main` branch.

```bash
git add .
git commit -m "Update: your message here"
git push origin main
```

## 📁 Project Structure

```
suparious.github.io/
├── index.html              # Main portfolio page
├── 404.html               # Custom 404 error page
├── sw.js                  # Service Worker for offline support
├── robots.txt             # SEO crawler instructions
├── sitemap.xml            # SEO sitemap
├── CNAME                  # Custom domain configuration
├── README.md              # This documentation file
├── ROADMAP.md             # Development roadmap and version history
├── LICENSE                # MIT License
├── assets/
│   ├── css/
│   │   ├── main.css       # Core styles and theme variables (inherited by all articles)
│   │   ├── animations.css # Animation library (inherited by all articles)
│   │   └── responsive.css # Mobile optimizations (inherited by all articles)
│   └── js/
│       ├── main.js        # Core functionality (inherited by all articles)
│       ├── theme.js       # Dark/light mode system (inherited by all articles)
│       └── animations.js  # Scroll and hover animations
├── publications/          # Article subdirectories (each inherits parent styles/scripts)
│   ├── corporate-marketing-failures/     # Example of properly configured article
│   │   └── index.html                   # Inherits ../assets/css/* and ../assets/js/*
│   ├── nixon-carter-economic-analysis/
│   │   └── index.html
│   ├── debian-audio-guide/
│   │   └── index.html
│   ├── self-hosting-ai-stack/
│   │   └── index.html
│   ├── scifi-tech-predictions/
│   │   └── index.html
│   ├── shell-scripts/
│   │   └── index.html
│   ├── 2012-chevy-volt-highway-guide/
│   │   └── index.html
│   └── automotive-ac-repair-guide/
│       └── index.html
└── backup/               # Backup of previous version
```

## 🎯 Performance Metrics

- **Lighthouse Score**: 90+ (Performance, SEO, Accessibility)
- **Load Time**: < 3 seconds
- **Time to Interactive**: < 2 seconds
- **Mobile Responsive**: 100/100
- **SEO Score**: 100/100

## 🔧 Customization

### Changing Colors

Edit CSS variables in `/assets/css/main.css`:

```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #7c3aed;
    --accent-color: #06b6d4;
    /* ... more variables */
}
```

### Updating Content

1. **Personal Info**: Edit the HTML in `index.html`
2. **Projects**: Update the projects section in `index.html`
3. **Skills**: Modify skill percentages in the data attributes
4. **Contact**: Form endpoint in the contact form action attribute

### Adding New Publications

1. **Create a new directory** in the root (e.g., `/article-name/`)
2. **Create `index.html`** in the new directory with this structure:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <!-- Standard meta tags -->
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Article Title - Shaun Prince</title>
       
       <!-- SEO Meta Tags -->
       <meta name="description" content="Article description">
       <meta name="keywords" content="relevant, keywords">
       <meta name="author" content="Shaun Prince">
       
       <!-- IMPORTANT: Inherit parent site styles and themes -->
       <link rel="stylesheet" href="../assets/css/main.css">
       <link rel="stylesheet" href="../assets/css/animations.css">
       <link rel="stylesheet" href="../assets/css/responsive.css">
       
       <!-- Use Google Fonts and Font Awesome from CDN -->
       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
       
       <!-- Article-specific styles (if needed) -->
       <style>
           /* Custom styles for this article */
       </style>
   </head>
   <body>
       <!-- Use the standard navbar from main site -->
       <nav id="navbar" class="navbar">...</nav>
       
       <!-- Article content -->
       <article class="article-content">...</article>
       
       <!-- Footer -->
       <footer class="footer">...</footer>
       
       <!-- IMPORTANT: Inherit parent site JavaScript -->
       <script src="../assets/js/main.js"></script>
       <script src="../assets/js/theme.js"></script>
   </body>
   </html>
   ```
3. **Update the publications section** in `index.html`
4. **Add to `sitemap.xml`** for SEO
5. **Test theme switching** to ensure dark/light modes work correctly

### Article Best Practices

#### CSS and Theme Inheritance
- **Always inherit parent styles**: Link to `../assets/css/main.css`, `animations.css`, and `responsive.css`
- **Use CSS variables**: Leverage the parent site's CSS variables for consistent theming
- **Test dark mode**: Ensure your article looks good in both light and dark themes
- **Avoid hardcoded colors**: Use `var(--primary-color)`, `var(--text-primary)`, etc.

#### JavaScript Integration
- **Include parent scripts**: Always include `../assets/js/main.js` and `../assets/js/theme.js`
- **Theme toggle**: The theme switcher should work automatically if scripts are included
- **Mobile menu**: The hamburger menu requires the parent scripts to function

#### Navigation Structure
- **Back to Portfolio link**: Include a prominent link back to the main site
- **Standard navbar**: Copy the navbar structure from existing articles
- **Consistent footer**: Use the same footer structure across all articles

#### Content Guidelines
- **SEO optimization**: Include proper meta tags and Open Graph tags
- **Responsive design**: Test on mobile, tablet, and desktop
- **Accessibility**: Use semantic HTML and proper heading hierarchy
- **Performance**: Optimize images and minimize custom CSS/JS

## 🐛 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Future Enhancements

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [suparious.com](https://suparious.com)
- **Email**: shaun@suparious.com
- **LinkedIn**: [linkedin.com/in/shaunprince](https://linkedin.com/in/shaunprince)
- **GitHub**: [github.com/suparious](https://github.com/suparious)

## 🙏 Acknowledgments

- Particles.js for the interactive background
- Typed.js for the typing animation
- AOS for scroll animations
- Font Awesome and Devicon for icons
- Google Fonts for typography
- Formspree for form handling
- GitHub Pages for hosting

---

**Built with ❤️ and ☕ by Shaun Prince**

*Last Updated: December 2024 | Version 2.0.0*
