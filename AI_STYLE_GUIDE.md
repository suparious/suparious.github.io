# Website Style Guide & Article Writing Documentation for AI Agents

## Overview
This documentation is designed to help AI agents (like Claude) create content that seamlessly integrates with the suparious.com website theme and structure.

## Site Architecture

### Core Theme System
The website uses a sophisticated theme system with:
- **Light/Dark Mode Support**: Automatic theme detection and manual toggle
- **CSS Variables**: All colors and spacing defined in `:root` for consistency
- **Responsive Design**: Mobile-first approach with breakpoints at 768px, 1024px

### File Structure
```
/
├── assets/
│   ├── css/
│   │   ├── main.css         # Core styles and variables
│   │   ├── animations.css   # Animation definitions
│   │   └── responsive.css   # Responsive breakpoints
│   └── js/
│       ├── main.js          # Core functionality
│       ├── theme.js         # Theme management
│       └── animations.js    # Animation controllers
├── [article-name]/
│   ├── index.html           # Article page
│   └── README.md            # Article content source
├── 404.html                 # Error page
├── 403.html                 # Access denied page
├── 500.html                 # Server error page
└── 503.html                 # Service unavailable page
```

## Design System

### Color Palette
```css
/* Light Mode */
--primary-color: #4f46e5;      /* Indigo */
--secondary-color: #7c3aed;    /* Purple */
--accent-color: #06b6d4;       /* Cyan */
--text-primary: #0f172a;       /* Near black */
--text-secondary: #475569;     /* Gray */
--text-muted: #94a3b8;         /* Light gray */
--background: #ffffff;         /* White */
--surface: #ffffff;            /* White */

/* Dark Mode */
--primary-color: #6366f1;      /* Light indigo */
--secondary-color: #a78bfa;    /* Light purple */
--accent-color: #22d3ee;       /* Light cyan */
--text-primary: #f1f5f9;       /* Near white */
--text-secondary: #cbd5e1;     /* Light gray */
--background: #0a0a0f;         /* Near black */
--surface: #1a1a24;            /* Dark surface */
```

### Typography
```css
--font-primary: 'Inter', sans-serif;        /* Body text */
--font-heading: 'Space Grotesk', sans-serif; /* Headings */
--font-mono: 'Courier New', monospace;      /* Code blocks */
```

### Spacing System
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

## Creating New Articles

### Article Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Article Title] - Shaun Prince</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="[Article description 150-160 chars]">
    <meta name="keywords" content="[Relevant keywords]">
    <meta name="author" content="Shaun Prince">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Main Site CSS (use ../ prefix for sub-directories) -->
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/animations.css">
    <link rel="stylesheet" href="../assets/css/responsive.css">
</head>
```

### Article Components

#### 1. Hero Section
```html
<section class="article-hero">
    <div class="container">
        <h1>[Article Title]</h1>
        <div class="article-meta">
            <span><i class="fas fa-calendar"></i> [Date]</span>
            <span><i class="fas fa-user"></i> Shaun Prince</span>
            <span><i class="fas fa-clock"></i> [X] min read</span>
        </div>
    </div>
</section>
```

#### 2. Table of Contents
```html
<div class="toc">
    <h3>Table of Contents</h3>
    <ul>
        <li><a href="#section1">Section 1 Title</a></li>
        <li><a href="#section2">Section 2 Title</a></li>
    </ul>
</div>
```

#### 3. Content Sections
```html
<article class="article-content">
    <h2 id="section1">Section Title</h2>
    <p>Paragraph content with <strong>emphasized text</strong>.</p>
    
    <div class="highlight-box">
        <h3>Key Point</h3>
        <p>Important information highlighted.</p>
    </div>
</article>
```

#### 4. Code Blocks
```html
<pre><code class="language-python">
def example_function():
    return "Hello, World!"
</code></pre>
```

#### 5. Call-to-Action
```html
<div class="article-cta">
    <h3>About This [Topic]</h3>
    <p>Brief description of the article's value.</p>
    <a href="../index.html#contact" class="btn btn-primary">
        <i class="fas fa-envelope"></i> Contact for Consultation
    </a>
</div>
```

## Style Classes Reference

### Buttons
- `.btn` - Base button class
- `.btn-primary` - Primary action (gradient background)
- `.btn-secondary` - Secondary action (outline style)
- `.btn-sm` - Small button variant
- `.btn-block` - Full width button

### Text Utilities
- `.gradient-text` - Applies gradient to text
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-muted` - Muted text color

### Layout
- `.container` - Max-width container (1200px)
- `.section` - Standard section padding
- `.section-title` - Section heading style

### Components
- `.highlight-box` - Emphasized content box
- `.case-study` - Case study card with left border
- `.metric` - Statistics display
- `.badge` - Small label/tag

## Writing Guidelines for AI Agents

### Content Structure
1. **Start with a compelling hook** - Grab attention in the first paragraph
2. **Use clear hierarchy** - H2 for main sections, H3 for subsections
3. **Break up text** - Use short paragraphs (3-4 sentences max)
4. **Include visual breaks** - Use highlight boxes, lists, and code blocks
5. **End with a CTA** - Always include a call-to-action

### Tone and Voice
- **Professional yet approachable** - Technical expertise with human touch
- **Action-oriented** - Focus on solutions and outcomes
- **Data-driven** - Support claims with specific metrics
- **Forward-thinking** - Emphasize innovation and future potential

### SEO Best Practices
1. **Title**: 50-60 characters for optimal display
2. **Meta Description**: 150-160 characters
3. **Keywords**: 5-10 relevant terms
4. **Headers**: Include keywords naturally in H2/H3 tags
5. **Internal Links**: Link to relevant sections of main site

### Technical Considerations
1. **Images**: Use lazy loading for performance
2. **External Links**: Add `target="_blank" rel="noopener"`
3. **Accessibility**: Include alt text for images
4. **Mobile**: Test responsive behavior at 768px breakpoint

## Article Categories & Topics

### Current Article Types on Site
1. **Technical Guides** (e.g., self-hosting-ai-stack)
   - Comprehensive how-to content
   - Code examples and configurations
   - Reference sections with links

2. **Business Analysis** (e.g., corporate-marketing-failures)
   - Case studies with metrics
   - Industry insights
   - Data-driven conclusions

3. **Historical Analysis** (e.g., nixon-carter-economic-analysis)
   - Research-based content
   - Comparative analysis
   - Citation-heavy

4. **Technology Predictions** (e.g., scifi-tech-predictions)
   - Cultural commentary
   - Forward-looking analysis
   - Entertainment angle

5. **Practical Guides** (e.g., automotive-ac-repair-guide)
   - Step-by-step instructions
   - Technical specifications
   - Professional reference material

## Common Patterns to Follow

### For Case Studies
```html
<div class="case-study">
    <div class="case-study-header">
        <h2>Company Name: Brief Title</h2>
        <div class="loss-badge">Key Metric</div>
    </div>
    <div class="case-metrics">
        <!-- 3-4 key metrics -->
    </div>
    <p>Detailed analysis...</p>
</div>
```

### For Technical Content
```html
<div class="highlight-box">
    <h3>Implementation Details</h3>
    <ul>
        <li><strong>Technology:</strong> Description</li>
        <li><strong>Challenge:</strong> Description</li>
        <li><strong>Solution:</strong> Description</li>
    </ul>
</div>
```

### For References
```html
<div class="references">
    <h2>References and Further Reading</h2>
    <h3>Category Name</h3>
    <ul>
        <li><a href="URL" target="_blank">Resource Name</a> - Description</li>
    </ul>
</div>
```

## Maintaining Consistency

### Theme Integration Checklist
- [ ] All CSS files linked with correct relative paths
- [ ] Theme toggle button included in navigation
- [ ] Dark mode tested and working
- [ ] Mobile responsive at 768px breakpoint
- [ ] Animations use CSS variables for timing
- [ ] Colors use CSS variables, not hard-coded values

### Quality Assurance
- [ ] Links tested and working
- [ ] Images optimized (< 200KB each)
- [ ] Reading time calculated (avg 200 words/minute)
- [ ] SEO meta tags populated
- [ ] Back navigation link included
- [ ] Footer consistent with main site

## Example Article Creation Workflow

1. **Create directory**: `/article-name/`
2. **Create index.html** using the template
3. **Write content** following style guidelines
4. **Add to publications** section in main index.html
5. **Test all links** and responsive behavior
6. **Verify theme** consistency in light/dark modes

## Advanced Features

### Adding Interactive Elements
```javascript
// Add to article's script section
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
```

### Custom Article Styles
Place within `<style>` tags in article head:
```css
/* Custom styles that extend main theme */
.article-specific-class {
    /* Use CSS variables for consistency */
    color: var(--primary-color);
    padding: var(--spacing-lg);
    background: var(--surface);
}
```

## Conclusion
This guide ensures that any content created by AI agents will seamlessly integrate with the existing website design and maintain the professional, modern aesthetic that defines suparious.com. Always prioritize user experience, accessibility, and performance while maintaining the established visual identity.