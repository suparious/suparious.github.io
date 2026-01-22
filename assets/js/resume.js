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
        // Check if experience section exists
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;

        await loadResumeData();
        enhanceTimeline();
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

    // Enhance timeline items with expandable details
    function enhanceTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            // Add expandable class
            item.classList.add('expandable');

            // Add role data attributes if not already present from HTML
            if (!item.dataset.roles) {
                const roles = getRolesForItem(index);
                item.dataset.roles = roles.join(',');
            }

            // Setup existing expand button in header (from HTML)
            const expandBtn = item.querySelector('.timeline-expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleExpand(item);
                });
            }

            // Setup existing timeline-details (from HTML) - populate with resume data if available
            const existingDetails = item.querySelector('.timeline-details');
            if (existingDetails && resumeData?.experience?.[index]) {
                populateDetails(existingDetails, index);
            }

            // Make content focusable and add aria attributes
            const content = item.querySelector('.timeline-content');
            if (content) {
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
            ['full-stack', 'devops', 'cloud-architect'], // Freelance
            ['devops', 'cloud-architect'] // DevOps Engineer
        ];
        return roleMap[index] || ['full-stack'];
    }

    // Populate existing timeline details with resume data
    function populateDetails(detailsEl, index) {
        const experienceData = resumeData?.experience?.[index];
        if (!experienceData) return;

        // Check if already has timeline-details-content (avoid duplicate population)
        if (detailsEl.querySelector('.timeline-details-content')) return;

        // Add additional details from resume data
        const additionalContent = document.createElement('div');
        additionalContent.className = 'timeline-details-content';
        additionalContent.innerHTML = `
            <div class="detail-section">
                <h5>Technologies Used</h5>
                <div class="tech-pills">
                    ${experienceData.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                </div>
            </div>
        `;

        // Append additional content
        detailsEl.appendChild(additionalContent);
    }

    // Bind event handlers
    function bindEvents() {
        // Role filter buttons - use existing HTML class (resume-filter-btn)
        document.querySelectorAll('.resume-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => filterByRole(btn.dataset.role));
        });

        // Timeline item expansion via content click
        document.querySelectorAll('.timeline-item .timeline-content').forEach(content => {
            content.addEventListener('click', (e) => {
                // Don't expand if clicking a link or button
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
                    e.target.closest('button')) return;
                toggleExpand(content.closest('.timeline-item'));
            });

            content.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(content.closest('.timeline-item'));
                }
            });
        });

        // Download button - use existing HTML element
        const pdfBtn = document.getElementById('download-pdf');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', downloadPDF);
        }
    }

    // Filter timeline by role
    function filterByRole(role) {
        activeRole = role;

        // Update button states - use existing HTML class (resume-filter-btn)
        document.querySelectorAll('.resume-filter-btn').forEach(btn => {
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
        const expandBtn = item.querySelector('.timeline-expand-btn');
        const details = item.querySelector('.timeline-details');

        item.classList.toggle('expanded', !isExpanded);

        if (content) {
            content.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        }

        if (expandBtn) {
            expandBtn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        }

        if (details) {
            details.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
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
            const details = item.querySelector('.timeline-details');
            if (details) details.setAttribute('aria-hidden', 'false');
        });

        // Trigger print dialog (user can save as PDF)
        window.print();

        // Restore expansion state after print dialog closes
        setTimeout(() => {
            document.querySelectorAll('.timeline-item').forEach((item, index) => {
                const shouldExpand = expandedItems.has(index);
                item.classList.toggle('expanded', shouldExpand);
                const details = item.querySelector('.timeline-details');
                if (details) details.setAttribute('aria-hidden', shouldExpand ? 'false' : 'true');
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
