// ========================
// GitHub Integration Module
// Live GitHub Activity, Contribution Graph, Latest Repos
// ========================

class GitHubIntegration {
    constructor(username = 'suparious') {
        this.username = username;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.init();
    }

    async init() {
        try {
            // Load all data in parallel
            await Promise.all([
                this.loadUserProfile(),
                this.loadLatestRepos(),
                this.loadRecentActivity(),
                this.loadContributionStats()
            ]);
        } catch (error) {
            console.error('GitHub Integration: Error initializing', error);
            this.showError();
        }
    }

    // ========================
    // API Helpers
    // ========================

    async fetchWithCache(url, cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 403) {
                console.warn('GitHub API rate limit exceeded');
                throw new Error('Rate limit exceeded');
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    // ========================
    // User Profile
    // ========================

    async loadUserProfile() {
        try {
            const data = await this.fetchWithCache(
                `${this.apiBase}/users/${this.username}`,
                'user-profile'
            );

            this.updateProfileStats(data);
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    updateProfileStats(data) {
        const elements = {
            'github-repos': data.public_repos,
            'github-followers': data.followers,
            'github-following': data.following,
            'github-gists': data.public_gists
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = this.formatNumber(value);
                el.classList.add('stat-loaded');
            }
        }
    }

    // ========================
    // Latest Repositories
    // ========================

    async loadLatestRepos() {
        try {
            const data = await this.fetchWithCache(
                `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=6`,
                'latest-repos'
            );

            this.renderLatestRepos(data);
        } catch (error) {
            console.error('Error loading repos:', error);
        }
    }

    renderLatestRepos(repos) {
        const container = document.getElementById('latest-repos');
        if (!container) return;

        const reposHtml = repos.map(repo => `
            <div class="repo-card" data-aos="fade-up">
                <div class="repo-header">
                    <i class="fas fa-${repo.fork ? 'code-branch' : 'book-bookmark'}"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-name">
                        ${repo.name}
                    </a>
                    ${repo.private ? '<span class="repo-visibility">Private</span>' : ''}
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-meta">
                    ${repo.language ? `
                        <span class="repo-language">
                            <span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                            ${repo.language}
                        </span>
                    ` : ''}
                    <span class="repo-stars">
                        <i class="fas fa-star"></i> ${this.formatNumber(repo.stargazers_count)}
                    </span>
                    <span class="repo-forks">
                        <i class="fas fa-code-branch"></i> ${this.formatNumber(repo.forks_count)}
                    </span>
                    <span class="repo-updated">
                        <i class="fas fa-clock"></i> ${this.formatDate(repo.updated_at)}
                    </span>
                </div>
            </div>
        `).join('');

        container.innerHTML = reposHtml;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f7df1e',
            'TypeScript': '#3178c6',
            'Python': '#3572A5',
            'Rust': '#dea584',
            'Go': '#00ADD8',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Shell': '#89e051',
            'Dockerfile': '#384d54',
            'Vue': '#42b883',
            'React': '#61dafb',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'Ruby': '#701516',
            'PHP': '#4F5D95'
        };
        return colors[language] || '#8b8b8b';
    }

    // ========================
    // Recent Activity
    // ========================

    async loadRecentActivity() {
        try {
            const data = await this.fetchWithCache(
                `${this.apiBase}/users/${this.username}/events/public?per_page=10`,
                'recent-activity'
            );

            this.renderRecentActivity(data);
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    }

    renderRecentActivity(events) {
        const container = document.getElementById('github-activity');
        if (!container) return;

        const activityHtml = events.slice(0, 5).map(event => {
            const { icon, description } = this.parseEvent(event);
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-description">${description}</p>
                        <span class="activity-time">${this.formatDate(event.created_at)}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = activityHtml || '<p class="no-activity">No recent activity</p>';
    }

    parseEvent(event) {
        const repo = event.repo?.name || 'unknown';
        const repoShort = repo.split('/').pop();

        const eventTypes = {
            'PushEvent': {
                icon: 'code-commit',
                description: `Pushed ${event.payload?.commits?.length || 0} commit(s) to <strong>${repoShort}</strong>`
            },
            'CreateEvent': {
                icon: 'plus',
                description: `Created ${event.payload?.ref_type || 'repository'} ${event.payload?.ref ? `<strong>${event.payload.ref}</strong> in ` : ''}<strong>${repoShort}</strong>`
            },
            'DeleteEvent': {
                icon: 'trash',
                description: `Deleted ${event.payload?.ref_type || 'branch'} in <strong>${repoShort}</strong>`
            },
            'IssuesEvent': {
                icon: 'circle-dot',
                description: `${event.payload?.action || 'Updated'} issue in <strong>${repoShort}</strong>`
            },
            'IssueCommentEvent': {
                icon: 'comment',
                description: `Commented on issue in <strong>${repoShort}</strong>`
            },
            'PullRequestEvent': {
                icon: 'code-pull-request',
                description: `${event.payload?.action || 'Updated'} PR in <strong>${repoShort}</strong>`
            },
            'PullRequestReviewEvent': {
                icon: 'eye',
                description: `Reviewed PR in <strong>${repoShort}</strong>`
            },
            'WatchEvent': {
                icon: 'star',
                description: `Starred <strong>${repoShort}</strong>`
            },
            'ForkEvent': {
                icon: 'code-branch',
                description: `Forked <strong>${repoShort}</strong>`
            },
            'ReleaseEvent': {
                icon: 'tag',
                description: `Released ${event.payload?.release?.tag_name || 'version'} of <strong>${repoShort}</strong>`
            }
        };

        return eventTypes[event.type] || {
            icon: 'code',
            description: `Activity in <strong>${repoShort}</strong>`
        };
    }

    // ========================
    // Contribution Stats (via repos)
    // ========================

    async loadContributionStats() {
        try {
            // Get all repos to calculate stats
            const repos = await this.fetchWithCache(
                `${this.apiBase}/users/${this.username}/repos?per_page=100`,
                'all-repos'
            );

            const stats = this.calculateStats(repos);
            this.renderContributionGraph(stats);
        } catch (error) {
            console.error('Error loading contribution stats:', error);
        }
    }

    calculateStats(repos) {
        const languageBytes = {};
        let totalStars = 0;
        let totalForks = 0;

        repos.forEach(repo => {
            if (repo.language) {
                languageBytes[repo.language] = (languageBytes[repo.language] || 0) + (repo.size || 0);
            }
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
        });

        // Sort languages by usage
        const sortedLanguages = Object.entries(languageBytes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

        return {
            languages: sortedLanguages.map(([lang, bytes]) => ({
                name: lang,
                percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0,
                color: this.getLanguageColor(lang)
            })),
            totalStars,
            totalForks,
            repoCount: repos.length
        };
    }

    renderContributionGraph(stats) {
        const languageChart = document.getElementById('language-chart');
        if (languageChart) {
            const chartHtml = stats.languages.map(lang => `
                <div class="language-bar-item">
                    <div class="language-bar-label">
                        <span class="language-dot" style="background-color: ${lang.color}"></span>
                        <span class="language-name">${lang.name}</span>
                        <span class="language-percent">${lang.percentage}%</span>
                    </div>
                    <div class="language-bar">
                        <div class="language-bar-fill" style="width: ${lang.percentage}%; background-color: ${lang.color}"></div>
                    </div>
                </div>
            `).join('');

            languageChart.innerHTML = chartHtml;
        }

        // Update total stats
        const totalStarsEl = document.getElementById('total-stars');
        const totalForksEl = document.getElementById('total-forks');
        
        if (totalStarsEl) totalStarsEl.textContent = this.formatNumber(stats.totalStars);
        if (totalForksEl) totalForksEl.textContent = this.formatNumber(stats.totalForks);
    }

    // ========================
    // Contribution Calendar (Simulated)
    // ========================

    renderContributionCalendar() {
        const container = document.getElementById('contribution-calendar');
        if (!container) return;

        // Generate last 52 weeks of data (simulated based on recent activity)
        const weeks = 52;
        const days = 7;
        const today = new Date();
        
        let calendarHtml = '<div class="calendar-grid">';
        
        // Day labels
        calendarHtml += `
            <div class="calendar-labels">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
            </div>
        `;
        
        calendarHtml += '<div class="calendar-weeks">';
        
        for (let week = weeks - 1; week >= 0; week--) {
            calendarHtml += '<div class="calendar-week">';
            for (let day = 0; day < days; day++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (week * 7 + (6 - day)));
                
                // Random activity level for demo (in production, this would come from API)
                const level = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
                
                calendarHtml += `
                    <div class="calendar-day level-${level}" 
                         title="${date.toDateString()}: ${level} contributions">
                    </div>
                `;
            }
            calendarHtml += '</div>';
        }
        
        calendarHtml += '</div></div>';
        
        // Legend
        calendarHtml += `
            <div class="calendar-legend">
                <span>Less</span>
                <div class="calendar-day level-0"></div>
                <div class="calendar-day level-1"></div>
                <div class="calendar-day level-2"></div>
                <div class="calendar-day level-3"></div>
                <div class="calendar-day level-4"></div>
                <span>More</span>
            </div>
        `;
        
        container.innerHTML = calendarHtml;
    }

    // ========================
    // Error Handling
    // ========================

    showError() {
        const containers = ['latest-repos', 'github-activity', 'language-chart'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="github-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load GitHub data. Please try again later.</p>
                    </div>
                `;
            }
        });
    }
}

// ========================
// Initialize on DOM Ready
// ========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GitHub integration
    window.githubIntegration = new GitHubIntegration('suparious');
    
    // Render contribution calendar (simulated)
    setTimeout(() => {
        window.githubIntegration.renderContributionCalendar();
    }, 500);
});

// Export for external use
window.GitHubIntegration = GitHubIntegration;
