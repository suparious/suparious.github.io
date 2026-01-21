// ========================
// Interactive Resume Feature
// Expandable details, filtering, downloads
// ========================

(function() {
    'use strict';

    // Resume data (embedded for static site)
    let resumeData = null;
    
    // State
    let activeRole = 'all';
    let expandedItems = new Set();

    // Initialize
    async function init() {
        await loadResumeData();
        enhanceTimeline();
        createControls();
        bindEvents();
    }

    // Load resume data
    async function loadResumeData() {
        try {
            const response = await fetch('/assets/data/resume.json');
            if (response.ok) {
                resumeData = await response.json();
            }
        } catch (error) {
            console.log('Resume data not loaded, using DOM content');
        }
    }

    // Create resume controls (filter + download buttons)
    function createControls() {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;

        const container = experienceSection.querySelector('.container');
        const timeline = experienceSection.querySelector('.timeline');
        if (!container || !timeline) return;

        // Create controls wrapper
        const controls = document.createElement('div');
        controls.className = 'resume-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Resume filters and downloads');

        // Role filters
        const filters = document.createElement('div');
        filters.className = 'resume-filters';
        filters.innerHTML = `
            <label id="filter-label">Filter by role:</label>
            <div role="group" aria-labelledby="filter-label">
                <button class="role-filter active" data-role="all" aria-pressed="true">All Roles</button>
                <button class="role-filter" data-role="cloud-architect" aria-pressed="false">Cloud Architect</button>
                <button class="role-filter" data-role="ai-engineer" aria-pressed="false">AI/ML Engineer</button>
                <button class="role-filter" data-role="full-stack" aria-pressed="false">Full-Stack</button>
                <button class="role-filter" data-role="devops" aria-pressed="false">DevOps</button>
            </div>
        `;

        // Download buttons
        const downloads = document.createElement('div');
        downloads.className = 'resume-downloads';
        downloads.innerHTML = `
            <button class="download-btn" id="download-pdf" aria-label="Download resume as PDF">
                <i class="fas fa-file-pdf" aria-hidden="true"></i> PDF
            </button>
            <button class="download-btn" id="print-resume" aria-label="Print resume">
                <i class="fas fa-print" aria-hidden="true"></i> Print
            </button>
        `;

        controls.appendChild(filters);
        controls.appendChild(downloads);

        // Insert before timeline
        container.insertBefore(controls, timeline);
    }

    // Enhance timeline items with expandable details
    function enhanceTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Add expandable class
            item.classList.add('expandable');
            
            // Add role data attributes based on content/position
            const roles = getRolesForItem(index);
            item.dataset.roles = roles.join(',');
            
            // Add expand indicator
            const content = item.querySelector('.timeline-content');
            if (content) {
                const body = content.querySelector('.timeline-body');
                if (body) {
                    // Create expand indicator
                    const indicator = document.createElement('div');
                    indicator.className = 'expand-indicator';
                    indicator.innerHTML = `
                        <span>View details</span>
                        <i class="fas fa-chevron-down" aria-hidden="true"></i>
                    `;
                    body.appendChild(indicator);
                    
                    // Create expanded details section
                    const details = createExpandedDetails(index);
                    body.appendChild(details);
                }
                
                // Make content focusable and add aria attributes
                content.setAttribute('tabindex', '0');
                content.setAttribute('role', 'button');
                content.setAttribute('aria-expanded', 'false');
                content.setAttribute('aria-label', 'Expand to view more details');
            }
        });
    }

    // Get roles for timeline item based on position
    function getRolesForItem(index) {
        // Map timeline items to roles based on the resume data structure
        const roleMap = [
            ['cloud-architect', 'ai-engineer', 'full-stack', 'devops'], // SolidRusT
            ['full-stack', 'devops'], // Freelance
            ['devops', 'cloud-architect'] // DevOps Engineer
        ];
        return roleMap[index] || ['full-stack'];
    }

    // Create expanded details content
    function createExpandedDetails(index) {
        const details = document.createElement('div');
        details.className = 'timeline-details';
        
        // Get additional details from resume data or use defaults
        const experienceData = resumeData?.experience?.[index];
        
        if (experienceData) {
            details.innerHTML = `
                <div class="timeline-details-content">
                    <div class="detail-section">
                        <h5>Key Achievements</h5>
                        <ul>
                            ${experienceData.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h5>Technologies Used</h5>
                        <div class="tech-pills">
                            ${experienceData.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default content based on existing DOM
            details.innerHTML = `
                <div class="timeline-details-content">
                    <div class="detail-section">
                        <h5>Additional Information</h5>
                        <p>Click to expand for more details about this role.</p>
                    </div>
                </div>
            `;
        }
        
        return details;
    }

    // Bind event handlers
    function bindEvents() {
        // Role filter buttons
        document.querySelectorAll('.role-filter').forEach(btn => {
            btn.addEventListener('click', () => filterByRole(btn.dataset.role));
        });

        // Timeline item expansion
        document.querySelectorAll('.timeline-item .timeline-content').forEach(content => {
            content.addEventListener('click', (e) => {
                // Don't expand if clicking a link
                if (e.target.tagName === 'A') return;
                toggleExpand(content.closest('.timeline-item'));
            });
            
            content.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(content.closest('.timeline-item'));
                }
            });
        });

        // Download buttons
        const pdfBtn = document.getElementById('download-pdf');
        const printBtn = document.getElementById('print-resume');
        
        if (pdfBtn) {
            pdfBtn.addEventListener('click', downloadPDF);
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
    }

    // Filter timeline by role
    function filterByRole(role) {
        activeRole = role;
        
        // Update button states
        document.querySelectorAll('.role-filter').forEach(btn => {
            const isActive = btn.dataset.role === role;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        
        // Filter timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            const roles = item.dataset.roles?.split(',') || [];
            const shouldShow = role === 'all' || roles.includes(role);
            item.classList.toggle('filtered-out', !shouldShow);
        });
        
        // Announce filter change to screen readers
        if (window.announceToScreenReader) {
            const count = document.querySelectorAll('.timeline-item:not(.filtered-out)').length;
            window.announceToScreenReader(`Showing ${count} positions for ${role === 'all' ? 'all roles' : role}`);
        }
    }

    // Toggle timeline item expansion
    function toggleExpand(item) {
        if (!item) return;
        
        const isExpanded = item.classList.contains('expanded');
        const content = item.querySelector('.timeline-content');
        const indicator = item.querySelector('.expand-indicator span');
        
        item.classList.toggle('expanded', !isExpanded);
        
        if (content) {
            content.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        }
        
        if (indicator) {
            indicator.textContent = isExpanded ? 'View details' : 'Hide details';
        }
        
        // Track expanded state
        const itemId = Array.from(item.parentElement.children).indexOf(item);
        if (isExpanded) {
            expandedItems.delete(itemId);
        } else {
            expandedItems.add(itemId);
        }
    }

    // Download as PDF (using browser print)
    function downloadPDF() {
        // Expand all items before printing
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('expanded');
        });
        
        // Trigger print dialog (user can save as PDF)
        window.print();
        
        // Restore expansion state after print dialog closes
        setTimeout(() => {
            document.querySelectorAll('.timeline-item').forEach((item, index) => {
                item.classList.toggle('expanded', expandedItems.has(index));
            });
        }, 1000);
    }

    // Generate text resume for download
    function generateTextResume() {
        if (!resumeData) return '';
        
        let text = '';
        const p = resumeData.personal;
        
        // Header
        text += `${p.name}\n`;
        text += `${p.title}\n`;
        text += `${'='.repeat(50)}\n\n`;
        
        // Contact
        text += `Email: ${p.email}\n`;
        text += `Location: ${p.location}\n`;
        text += `Website: ${p.website}\n`;
        text += `GitHub: ${p.github}\n`;
        text += `LinkedIn: ${p.linkedin}\n\n`;
        
        // Summary
        text += `SUMMARY\n${'-'.repeat(20)}\n`;
        text += `${p.summary}\n\n`;
        
        // Experience
        text += `EXPERIENCE\n${'-'.repeat(20)}\n`;
        resumeData.experience.forEach(exp => {
            const endDate = exp.current ? 'Present' : exp.endDate;
            text += `\n${exp.title}\n`;
            text += `${exp.company} | ${exp.location}\n`;
            text += `${exp.startDate} - ${endDate}\n\n`;
            text += `${exp.summary}\n\n`;
            text += `Key Achievements:\n`;
            exp.highlights.forEach(h => {
                text += `  - ${h}\n`;
            });
            text += `\nTechnologies: ${exp.technologies.join(', ')}\n`;
        });
        
        // Skills
        text += `\nSKILLS\n${'-'.repeat(20)}\n`;
        Object.entries(resumeData.skills).forEach(([category, skills]) => {
            text += `\n${category.toUpperCase()}:\n`;
            skills.forEach(s => {
                text += `  - ${s.name} (${s.level}, ${s.years} years)\n`;
            });
        });
        
        return text;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for external access
    window.SupariousResume = {
        filterByRole,
        expandAll: () => {
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.classList.add('expanded');
                const content = item.querySelector('.timeline-content');
                if (content) content.setAttribute('aria-expanded', 'true');
            });
        },
        collapseAll: () => {
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.classList.remove('expanded');
                const content = item.querySelector('.timeline-content');
                if (content) content.setAttribute('aria-expanded', 'false');
            });
            expandedItems.clear();
        },
        getResumeData: () => resumeData,
        generateText: generateTextResume
    };
})();
