# suparious.com - Infrastructure Documentation

**Purpose**: Documentation for suparious.com's role in the SolidRusT Networks infrastructure ecosystem

---

## 🌐 Overview

**suparious.com** is Shaun Prince's professional portfolio and technical publication platform, hosted on GitHub Pages. Unlike other infrastructure sites (solidrust.net, aidiant.com, techfusion.ca), this is a **pure static site** without AI chat integration or platform service dependencies.

### Key Information
- **URL**: https://suparious.com
- **Type**: Static HTML/CSS/JS portfolio site
- **Hosting**: GitHub Pages (free, SSL included)
- **Repository**: https://github.com/suparious/suparious.github.io
- **Build Process**: None (direct HTML deployment)
- **Platform Dependencies**: None (standalone site)

---

## 🏗️ Infrastructure Role

### Why Tracked as Infrastructure Submodule?

**Unlike other infrastructure sites**, suparious.com does NOT depend on the srt-hq-k8s platform services. It is tracked here for:

1. **Documentation Completeness**: Part of Shaun's technical portfolio showcasing the platform
2. **Ecosystem Awareness**: Central reference for all SolidRusT Networks properties
3. **Future Integration**: May add AI chat features (like solidrust.net) in the future
4. **Maintenance Context**: Understanding the full infrastructure landscape

### Comparison with Other Infrastructure Sites

| Site | Type | Platform Dependency | Purpose |
|------|------|---------------------|---------|
| **suparious.com** | Static Portfolio | None | Personal portfolio and publications |
| solidrust.net | React SPA | vLLM via Artemis | AI chat with hybrid inference |
| aidiant.com | React SPA | vLLM via Artemis | AI Constitutional Council |
| techfusion.ca | React SPA | vLLM via Artemis | Canadian tech community |

**Key Difference**: suparious.com is standalone, the others consume platform AI services.

---

## 📁 Repository Structure

```
suparious.github.io/
├── index.html                 # Main portfolio page
├── CNAME                     # Custom domain (suparious.com)
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Crawler instructions
├── sw.js                     # Service Worker
├── assets/
│   ├── css/                  # Styles (inherited by all pages)
│   │   ├── main.css          # Theme variables, core styles
│   │   ├── animations.css    # Animation library
│   │   └── responsive.css    # Mobile optimizations
│   └── js/                   # Scripts (inherited by all pages)
│       ├── main.js           # Core functionality
│       ├── theme.js          # Dark/light mode system
│       └── animations.js     # Scroll and hover effects
└── publications/             # Technical articles (root-level subdirectories)
    ├── corporate-marketing-failures/
    ├── nixon-carter-economic-analysis/
    ├── debian-audio-guide/
    ├── self-hosting-ai-stack/
    ├── scifi-tech-predictions/
    ├── shell-scripts/
    ├── 2012-chevy-volt-highway-guide/
    └── automotive-ac-repair-guide/
```

---

## 🚀 Deployment

### Current Deployment
- **Method**: GitHub Pages automatic deployment
- **Trigger**: Push to main branch
- **Build**: None (static files served directly)
- **CDN**: GitHub's global CDN
- **SSL**: Automatic via GitHub Pages (Let's Encrypt)

### Deployment Flow
```
Local Changes
    ↓
git push origin main
    ↓
GitHub Pages (automatic)
    ↓
https://suparious.com (live in 1-2 minutes)
```

### No Kubernetes Deployment
**Important**: Unlike most submodules in this repo, suparious.com does NOT deploy to the Kubernetes cluster. It is:
- Hosted entirely on GitHub Pages
- Has no k8s/ directory
- Has no deploy.ps1 script
- Has no Docker image

---

## 🔧 Maintenance

### Local Development
```bash
# Clone repository
cd /mnt/c/Users/shaun/repos/suparious.github.io

# Start local server
python3 -m http.server 8000

# Open browser
http://localhost:8000
```

### Making Updates
```bash
# Edit files (index.html, assets/*, publications/*)
# Test locally
# Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# Site automatically deploys within 1-2 minutes
```

### Adding Publications
1. Create `/article-name/index.html`
2. Inherit parent styles: `<link rel="stylesheet" href="../assets/css/main.css">`
3. Inherit parent scripts: `<script src="../assets/js/theme.js"></script>`
4. Update main index.html publications section
5. Update sitemap.xml for SEO
6. Test dark/light mode works
7. Push to deploy

---

## 🎯 Integration Points

### Current Integrations
- **None**: Standalone static site

### Potential Future Integrations
- **vLLM API**: Could add AI chat interface (like solidrust.net)
- **Artemis Proxy**: Would route through AWS proxy for public access
- **Prometheus Metrics**: Could track usage stats via platform
- **ChromaDB**: Could use semantic search for publication discovery

### How to Add AI Chat (Future)
If AI features are desired in the future:
1. Reference solidrust.net implementation (Rollup + WebLLM + MCP)
2. Add vLLM API endpoint: `https://artemis.hq.solidrust.net/v1/chat/completions`
3. Update CLAUDE.md to document vLLM dependency
4. Update this README to reflect platform integration
5. Add to ChromaDB as platform-dependent service

---

## 📊 Technical Specifications

### Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Animations**: Particles.js, Typed.js, AOS
- **Fonts**: Inter, Space Grotesk (Google Fonts)
- **Icons**: Font Awesome 6, Devicon
- **Form**: Formspree for contact form handling

### Performance
- **Lighthouse Performance**: 90+
- **Load Time**: < 3 seconds
- **Time to Interactive**: < 2 seconds
- **Mobile Score**: 100/100
- **SEO Score**: 100/100

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎓 Common Operations

### View Site Locally
```bash
cd /mnt/c/Users/shaun/repos/suparious.github.io
python3 -m http.server 8000
# Access: http://localhost:8000
```

### Update Portfolio Content
```bash
# Edit index.html sections
vim index.html

# Test locally
python3 -m http.server 8000

# Deploy
git add index.html
git commit -m "Update portfolio content"
git push origin main
```

### Update Styles (Affects All Pages)
```bash
# Edit theme colors
vim assets/css/main.css

# Edit animations
vim assets/css/animations.css

# Deploy
git add assets/css/
git commit -m "Update site styles"
git push origin main
```

### Troubleshooting

**Issue**: Custom domain not working
```bash
# Check CNAME file
cat CNAME
# Should contain: suparious.com

# Check DNS
dig suparious.com
# Should point to: suparious.github.io
```

**Issue**: Dark/light mode not working on articles
```bash
# Verify article includes parent scripts
grep "theme.js" /path/to/article/index.html
# Should find: <script src="../assets/js/theme.js"></script>
```

**Issue**: SSL certificate error
```bash
# Check GitHub Pages settings
# Settings → Pages → Enforce HTTPS (should be checked)
```

---

## 📚 References

### Related Documentation
- **Main README**: `/mnt/c/Users/shaun/repos/suparious.github.io/README.md`
- **CLAUDE.md**: `infrastructure/suparious-site/CLAUDE.md` (AI agent context)
- **Style Guide**: `AI_STYLE_GUIDE.md` (content writing guidelines)
- **Roadmap**: `ROADMAP.md` (development roadmap)

### External Resources
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Custom Domain Setup**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

### Other Infrastructure Sites
- **solidrust.net**: `infrastructure/solidrust-site/` (AI chat interface)
- **aidiant.com**: `infrastructure/aidiant-site/` (AI Constitutional Council)
- **techfusion.ca**: `infrastructure/techfusion-site/` (Canadian tech community)
- **Artemis Proxy**: `infrastructure/artemis-proxy/` (AWS public ingress gateway)

---

## 🔍 Validation

### Post-Update Checklist
```bash
# Local validation
python3 -m http.server 8000
# - [ ] Site loads correctly
# - [ ] Dark/light mode works (Ctrl+Shift+L)
# - [ ] All sections render properly
# - [ ] Animations trigger on scroll
# - [ ] Links navigate correctly
# - [ ] Responsive design works (resize browser)

# Browser testing
# - [ ] Chrome (latest)
# - [ ] Firefox (latest)
# - [ ] Safari (latest)
# - [ ] Mobile (iOS Safari, Chrome Mobile)

# Deploy and verify
git push origin main
# Wait 1-2 minutes

# Production verification
curl -I https://suparious.com
# Expected: HTTP 200, HTTPS redirect

# Browser test
# - [ ] https://suparious.com loads
# - [ ] SSL certificate valid (green padlock)
# - [ ] All features functional
```

---

## 📞 Support

**Repository Owner**: Shaun Prince
**Email**: shaun@suparious.com
**GitHub**: https://github.com/suparious
**LinkedIn**: https://linkedin.com/in/shaunprince

---

**Last Updated**: 2025-11-11
**Status**: Production - Active Portfolio Site
