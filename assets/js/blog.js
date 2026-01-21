// ========================
// Blog System JavaScript
// ========================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        articlesPerPage: 9,
        articlesJsonPath: '/blog/articles.json',
        dateFormat: { year: 'numeric', month: 'long', day: 'numeric' }
    };

    // State
    let articles = [];
    let filteredArticles = [];
    let currentPage = 1;
    let currentFilters = {
        search: '',
        category: '',
        tag: '',
        sort: 'date-desc'
    };

    // DOM Elements
    const elements = {
        articlesGrid: document.getElementById('articles-grid'),
        featuredGrid: document.getElementById('featured-grid'),
        searchInput: document.getElementById('search-input'),
        categoryFilter: document.getElementById('category-filter'),
        sortSelect: document.getElementById('sort-select'),
        resultsCount: document.getElementById('results-count'),
        pagination: document.getElementById('pagination'),
        activeFilters: document.getElementById('active-filters'),
        categoryList: document.getElementById('category-list'),
        tagCloud: document.getElementById('tag-cloud')
    };

    // Initialize
    async function init() {
        try {
            await loadArticles();
            setupEventListeners();
            renderFeaturedArticles();
            applyFilters();
            renderSidebar();
        } catch (error) {
            console.error('Failed to initialize blog:', error);
            showError();
        }
    }

    // Load articles from JSON
    async function loadArticles() {
        try {
            const response = await fetch(CONFIG.articlesJsonPath);
            if (!response.ok) throw new Error('Failed to load articles');
            const data = await response.json();
            articles = data.articles || [];
        } catch (error) {
            console.error('Error loading articles:', error);
            articles = [];
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', debounce((e) => {
                currentFilters.search = e.target.value.toLowerCase();
                currentPage = 1;
                applyFilters();
            }, 300));
        }

        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', (e) => {
                currentFilters.category = e.target.value;
                currentPage = 1;
                applyFilters();
            });
        }

        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                currentFilters.sort = e.target.value;
                applyFilters();
            });
        }

        // Tag click handlers (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-by-tag')) {
                e.preventDefault();
                currentFilters.tag = e.target.dataset.tag;
                currentPage = 1;
                applyFilters();
            }
            
            if (e.target.classList.contains('filter-by-category')) {
                e.preventDefault();
                currentFilters.category = e.target.dataset.category;
                if (elements.categoryFilter) {
                    elements.categoryFilter.value = currentFilters.category;
                }
                currentPage = 1;
                applyFilters();
            }

            if (e.target.classList.contains('clear-filter')) {
                const filterType = e.target.dataset.filter;
                currentFilters[filterType] = '';
                if (filterType === 'category' && elements.categoryFilter) {
                    elements.categoryFilter.value = '';
                }
                if (filterType === 'search' && elements.searchInput) {
                    elements.searchInput.value = '';
                }
                currentPage = 1;
                applyFilters();
            }

            if (e.target.classList.contains('clear-all-filters')) {
                clearAllFilters();
            }

            if (e.target.classList.contains('pagination-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== currentPage) {
                    currentPage = page;
                    applyFilters();
                    scrollToResults();
                }
            }
        });
    }

    // Apply filters and render
    function applyFilters() {
        filteredArticles = articles.filter(article => {
            // Search filter
            if (currentFilters.search) {
                const searchTerms = currentFilters.search.toLowerCase();
                const searchableText = [
                    article.title,
                    article.excerpt,
                    article.category,
                    ...article.tags
                ].join(' ').toLowerCase();
                if (!searchableText.includes(searchTerms)) return false;
            }

            // Category filter
            if (currentFilters.category && article.category !== currentFilters.category) {
                return false;
            }

            // Tag filter
            if (currentFilters.tag && !article.tags.includes(currentFilters.tag)) {
                return false;
            }

            return true;
        });

        // Sort
        sortArticles();

        // Render
        renderArticles();
        renderActiveFilters();
        renderPagination();
        updateResultsCount();
    }

    // Sort articles
    function sortArticles() {
        const [sortBy, sortOrder] = currentFilters.sort.split('-');
        
        filteredArticles.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'date':
                    comparison = new Date(b.date) - new Date(a.date);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'readingTime':
                    comparison = a.readingTime - b.readingTime;
                    break;
            }
            
            return sortOrder === 'asc' ? -comparison : comparison;
        });
    }

    // Render featured articles
    function renderFeaturedArticles() {
        if (!elements.featuredGrid) return;

        const featured = articles.filter(a => a.featured).slice(0, 2);
        if (featured.length === 0) {
            elements.featuredGrid.parentElement.style.display = 'none';
            return;
        }

        elements.featuredGrid.innerHTML = featured.map(article => 
            createArticleCard(article, true)
        ).join('');
    }

    // Render articles grid
    function renderArticles() {
        if (!elements.articlesGrid) return;

        const startIndex = (currentPage - 1) * CONFIG.articlesPerPage;
        const endIndex = startIndex + CONFIG.articlesPerPage;
        const pageArticles = filteredArticles.slice(startIndex, endIndex);

        if (pageArticles.length === 0) {
            elements.articlesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        elements.articlesGrid.innerHTML = pageArticles.map(article => 
            createArticleCard(article, false)
        ).join('');
    }

    // Create article card HTML
    function createArticleCard(article, isFeatured) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', CONFIG.dateFormat);
        const categoryIcon = getCategoryIcon(article.category);
        
        return `
            <article class="article-card ${isFeatured ? 'featured' : ''}" data-aos="fade-up">
                <div class="article-image placeholder">
                    <i class="${categoryIcon}"></i>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-category" data-category="${article.category}">
                            ${article.category}
                        </span>
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="far fa-clock"></i> ${article.readingTime} min read</span>
                    </div>
                    <h3><a href="${article.url}">${article.title}</a></h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-tags">
                        ${article.tags.slice(0, 4).map(tag => 
                            `<span class="tag filter-by-tag" data-tag="${tag}">${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="article-footer">
                        <a href="${article.url}" class="read-more">
                            Read Article <i class="fas fa-arrow-right"></i>
                        </a>
                        <span class="word-count">${article.wordCount.toLocaleString()} words</span>
                    </div>
                </div>
            </article>
        `;
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            'AI & ML': 'fas fa-brain',
            'Linux': 'fab fa-linux',
            'Business': 'fas fa-briefcase',
            'History': 'fas fa-landmark',
            'Technology': 'fas fa-microchip',
            'DevOps': 'fas fa-cogs',
            'Automotive': 'fas fa-car'
        };
        return icons[category] || 'fas fa-file-alt';
    }

    // Render active filters
    function renderActiveFilters() {
        if (!elements.activeFilters) return;

        const filters = [];

        if (currentFilters.search) {
            filters.push(`
                <span class="filter-tag">
                    Search: "${currentFilters.search}"
                    <button class="clear-filter" data-filter="search">&times;</button>
                </span>
            `);
        }

        if (currentFilters.category) {
            filters.push(`
                <span class="filter-tag">
                    Category: ${currentFilters.category}
                    <button class="clear-filter" data-filter="category">&times;</button>
                </span>
            `);
        }

        if (currentFilters.tag) {
            filters.push(`
                <span class="filter-tag">
                    Tag: ${currentFilters.tag}
                    <button class="clear-filter" data-filter="tag">&times;</button>
                </span>
            `);
        }

        if (filters.length > 0) {
            filters.push('<button class="clear-filters clear-all-filters">Clear All</button>');
        }

        elements.activeFilters.innerHTML = filters.join('');
    }

    // Render pagination
    function renderPagination() {
        if (!elements.pagination) return;

        const totalPages = Math.ceil(filteredArticles.length / CONFIG.articlesPerPage);
        
        if (totalPages <= 1) {
            elements.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        elements.pagination.innerHTML = paginationHTML;
    }

    // Update results count
    function updateResultsCount() {
        if (!elements.resultsCount) return;
        
        const start = (currentPage - 1) * CONFIG.articlesPerPage + 1;
        const end = Math.min(currentPage * CONFIG.articlesPerPage, filteredArticles.length);
        
        elements.resultsCount.textContent = filteredArticles.length === 0
            ? 'No articles found'
            : `Showing ${start}-${end} of ${filteredArticles.length} articles`;
    }

    // Render sidebar
    function renderSidebar() {
        renderCategoryList();
        renderTagCloud();
    }

    // Render category list
    function renderCategoryList() {
        if (!elements.categoryList) return;

        const categoryCounts = {};
        articles.forEach(article => {
            categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
        });

        const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1]);

        elements.categoryList.innerHTML = sortedCategories.map(([category, count]) => `
            <li>
                <a href="#" class="filter-by-category" data-category="${category}">
                    <span>${category}</span>
                    <span class="category-count">${count}</span>
                </a>
            </li>
        `).join('');
    }

    // Render tag cloud
    function renderTagCloud() {
        if (!elements.tagCloud) return;

        const tagCounts = {};
        articles.forEach(article => {
            article.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        elements.tagCloud.innerHTML = sortedTags.map(([tag, count]) => `
            <a href="#" class="tag filter-by-tag" data-tag="${tag}" title="${count} articles">
                ${tag}
            </a>
        `).join('');
    }

    // Clear all filters
    function clearAllFilters() {
        currentFilters = {
            search: '',
            category: '',
            tag: '',
            sort: 'date-desc'
        };
        currentPage = 1;
        
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.categoryFilter) elements.categoryFilter.value = '';
        if (elements.sortSelect) elements.sortSelect.value = 'date-desc';
        
        applyFilters();
    }

    // Scroll to results
    function scrollToResults() {
        const resultsSection = document.querySelector('.results-info');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Show error message
    function showError() {
        if (elements.articlesGrid) {
            elements.articlesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error loading articles</h3>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
        }
    }

    // Utility: Debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Calculate reading time for content
    window.calculateReadingTime = function(text) {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return { readingTime, wordCount };
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
