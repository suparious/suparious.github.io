# CLAUDE.md - AI Assistant Context

**Attach this to every suparious.github.io conversation. Contains everything needed to help effectively.**

---

## ⚡ QUICK START

**Job**: Help with suparious.com portfolio website (GitHub Pages)
**Rule**: No workarounds, no temp fixes, complete solutions only
**User**: Shaun Prince - Expert developer, intolerant of cruft
**Preference**: Direct command execution with immediate verification

**Process**:
1. Read prompt fully
2. Check project structure and content requirements
3. Use decision trees below
4. Execute commands directly when possible
5. Validate end-to-end in browser

---

## 🌐 PROJECT OVERVIEW

**Vision**: Professional portfolio and technical publication platform showcasing 20+ years of experience in Cloud Architecture, AI Engineering, and DevOps.

### What is suparious.com?
- **Public Website**: https://suparious.com (GitHub Pages)
- **Primary Purpose**: Portfolio and technical publications
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Particles.js, Typed.js, AOS
- **Deployment**: Automatic via GitHub Pages on push to main
- **Type**: Static site (no build process required)

### Key Features
1. **Modern Portfolio**: Interactive resume with animations and effects
2. **Technical Publications**: 8+ in-depth technical articles and guides
3. **Dark/Light Mode**: Automatic theme detection with manual toggle
4. **Responsive Design**: Optimized for all devices
5. **Progressive Web Features**: Service Worker for offline support
6. **SEO Optimized**: Meta tags, sitemap, structured data

### Core Sections
- **Hero**: Animated introduction with particle effects
- **About**: Professional bio with code display
- **Skills**: Categorized expertise with progress bars
- **Experience**: Interactive timeline of work history
- **Projects**: Featured projects and GitHub integration (31+ open source projects)
- **Publications**: Technical articles and guides
- **Contact**: Contact form with validation

---

## 📊 PROJECT STATUS

**Current Version**: 2.0.0 (December 2024)
**Status**: Production - Active portfolio site

### ✅ Version 2.0.0 Features (COMPLETE)
- Modern glassmorphism UI design
- Dark/light mode with automatic detection
- Interactive particle.js background
- Typed.js dynamic role animation
- AOS scroll-triggered animations
- 8+ technical publication articles
- Responsive design for all devices
- Service Worker for offline support
- SEO optimized with sitemap

### 📝 Content Management
**Publications Directory Structure**:
- Each article in own subdirectory at root level (e.g., `/article-name/index.html`)
- Articles inherit parent site styles and themes via relative paths
- Standard navbar and footer maintained across all articles
- Dark/light mode works automatically when parent scripts included

**Current Publications**:
1. Corporate Marketing Failures - Analysis of corporate communication blunders
2. Nixon vs Carter Economic Analysis - Historical economic policy comparison
3. Debian Audio Production Guide - Complete Linux audio workstation setup
4. Self-Hosting AI Stack - Guide to self-hosted AI infrastructure
5. Sci-Fi Tech Predictions - Analysis of technology predictions in science fiction
6. Shell Scripts Collection - Curated collection of useful shell scripts
7. 2012 Chevy Volt Highway Guide - Long-distance EV travel tips
8. Automotive AC Repair Guide - DIY automotive air conditioning repair

---

## 📚 PLATFORM INTEGRATION

**Related Repositories**:
- **solidrust.github.io**: `/Users/shaun/repos/solidrust.github.io/` - SolidRusT main site (AI chat example)
- **srt-inference-proxy**: `/Users/shaun/repos/srt-inference-proxy/` - Artemis proxy (if AI features added)

**Potential Future Integration**:
- **Artemis Proxy**: `https://artemis.hq.solidrust.net/v1/chat/completions` for AI chat
- **Pattern**: See solidrust.net for working AI chat integration

**When NOT to Query**:
- ❌ HTML/CSS/JavaScript development (use project README)
- ❌ Static site design patterns (standard web development)
- ❌ GitHub Pages configuration (see GitHub docs)
- ❌ Content writing and article creation (use AI_STYLE_GUIDE.md)

---

## 🏗️ ARCHITECTURE

### Site Structure
```
User (suparious.com)
    ↓
GitHub Pages (static hosting)
    ↓
index.html (main portfolio)
    ├── assets/css/ (styles, themes)
    ├── assets/js/ (animations, interactivity)
    └── publications/ (technical articles)
```

### Content Inheritance Pattern
```
Root Site (index.html)
    ├── assets/css/main.css (theme variables, core styles)
    ├── assets/css/animations.css (animation library)
    ├── assets/css/responsive.css (mobile optimizations)
    ├── assets/js/main.js (core functionality)
    ├── assets/js/theme.js (dark/light mode system)
    └── assets/js/animations.js (scroll and hover animations)
        ↓ (inherited by all articles via ../)
Articles (/publication-name/index.html)
    └── Links: ../assets/css/*, ../assets/js/*
```

### Key Design Patterns
- **CSS Variables**: Centralized theming via CSS custom properties
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile-First**: Responsive design starts with mobile, enhances for desktop
- **Accessibility**: WCAG 2.1 A compliant, semantic HTML
- **Performance**: Lazy loading, optimized assets, service worker caching

---

**Last Updated**: 2026-01-22
**Status**: Production - Active Portfolio Site
**Maintained By**: Shaun Prince
**Used With**: Claude Code

---

## Ecosystem Context

This repo is part of the **SolidRusT Networks** ecosystem managed by [srt-concierge](https://poseidon.hq.solidrust.net:30008/shaun/srt-concierge).

For cross-repo context, service dependencies, and platform strategy:
- **Repo inventory**: `/Users/shaun/repos/srt-concierge/docs/REPOSITORY-METADATA.md`
- **Service map**: `/Users/shaun/repos/srt-concierge/docs/PRODUCTION-SERVICES.md`
- **Network topology**: `/Users/shaun/repos/srt-concierge/docs/NETWORK-TOPOLOGY.md`
- **Team registry**: `/Users/shaun/repos/srt-concierge/docs/TEAM-REGISTRY.md`
