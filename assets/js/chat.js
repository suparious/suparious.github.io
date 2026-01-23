// ========================
// AI Chat Assistant
// Portfolio Chat Widget for suparious.com
// ========================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_URL: 'https://api.solidrust.ai/v1/chat/completions',
        MODEL: 'vllm-primary',
        MAX_TOKENS: 512,
        TEMPERATURE: 0.7,
        // Public demo key (Base64 encoded) - suparious.com specific key
        // Security enforced by PAM validation, rate limiting, CORS whitelist
        // NOTE: Requires CORS_ORIGIN on PAM to include https://suparious.com
        DEFAULT_API_KEY_ENCODED: 'c3J0X3Byb2RfY2ZmNDNkMjcyY2I1MDY0Y2I0ZTNiYjk3YjIzMWJmNDYwNDg5N2I1ZWEyMzMzYWY3NzRiOWQwZmU3MmMxNTNhMw==',
        STORAGE_KEY: 'suparious_chat_history',
        MAX_HISTORY: 20
    };

    // Portfolio context for the AI
    const SYSTEM_PROMPT = `You are Shaun's AI Assistant on suparious.com, a professional portfolio website.

About Shaun Prince:
- Full-Stack Developer & Cloud Architect with 15+ years experience
- Founder of SolidRusT Networks
- Specializes in: AI/ML Infrastructure, Kubernetes, Python, TypeScript, Rust
- Current focus: Production AI platforms with vLLM, RAG systems, multi-agent architectures
- Located in Canada
- Contact: shaun@suparious.com

Key Projects:
1. SolidRusT AI Platform - Production AI inference with vLLM, LiteLLM, automatic failover
2. Aidiant AI Council - Multi-agent system with 234 council members
3. MyAshes.ai - AI game assistant for Ashes of Creation
4. PAM Platform - API key management and Stripe billing
5. 12-node Kubernetes cluster with 5 GPU workers

Skills: Python (Expert), TypeScript (Expert), Rust (Advanced), Kubernetes (Expert), Docker (Expert), vLLM, RAG, LangChain, FluxCD/GitOps

Your role:
- Answer questions about Shaun's experience, skills, and projects
- Guide visitors to relevant sections of the portfolio
- Provide helpful information about Shaun's technical expertise
- Be friendly, professional, and concise
- If asked about hiring or contact, direct them to the contact section
- Keep responses brief (2-3 sentences for simple questions, more detail when asked)

Available portfolio sections:
- #about - About Me section
- #skills - Skills & Expertise
- #experience - Work Experience timeline
- #projects - Featured Projects
- #github - GitHub Activity
- #case-studies - Detailed case studies
- #testimonials - Testimonials
- #contact - Contact form and information

When suggesting sections, format as clickable links like: [View Projects](#projects)`;

    // Quick suggestion prompts
    const SUGGESTIONS = [
        'What are your skills?',
        'Tell me about your projects',
        'How can I contact you?',
        'Kubernetes experience?'
    ];

    // State
    let isOpen = false;
    let isLoading = false;
    let chatHistory = [];
    let elements = {};

    // Get API key (user override or default)
    function getApiKey() {
        const userKey = localStorage.getItem('srt_api_key');
        if (userKey) return userKey;
        
        try {
            return atob(CONFIG.DEFAULT_API_KEY_ENCODED);
        } catch {
            return null;
        }
    }

    // Initialize chat widget
    function init() {
        createChatWidget();
        bindEvents();
        loadChatHistory();
        
        // Show initial greeting if no history
        if (chatHistory.length === 0) {
            addMessage('assistant', "Hi! I'm Shaun's AI assistant. I can help you learn about his experience, projects, and skills. What would you like to know?");
        }
    }

    // Create chat widget HTML
    function createChatWidget() {
        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.innerHTML = `
            <button class="chat-toggle" aria-label="Open chat assistant" aria-expanded="false">
                <i class="fas fa-comments" aria-hidden="true"></i>
                <span class="chat-badge hidden" aria-live="polite">1</span>
            </button>
            
            <div class="chat-window" role="dialog" aria-label="Chat with Shaun's AI Assistant" aria-hidden="true">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <i class="fas fa-robot" aria-hidden="true"></i>
                        </div>
                        <div class="chat-header-text">
                            <h3>AI Assistant</h3>
                            <p class="chat-status">
                                <span class="chat-status-indicator" aria-hidden="true"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button class="chat-close" aria-label="Close chat">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                
                <div class="chat-messages" aria-live="polite" aria-atomic="false">
                    <!-- Messages inserted here -->
                </div>
                
                <div class="chat-suggestions" role="group" aria-label="Quick questions">
                    ${SUGGESTIONS.map(s => `<button class="suggestion-btn" type="button">${s}</button>`).join('')}
                </div>
                
                <div class="chat-input-area">
                    <div class="chat-input-container">
                        <textarea 
                            class="chat-input" 
                            placeholder="Ask about my experience, projects, or skills..." 
                            aria-label="Type your message"
                            rows="1"
                        ></textarea>
                        <button class="chat-send" aria-label="Send message" disabled>
                            <i class="fas fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chat-api-notice">
                    Powered by <a href="https://solidrust.ai" target="_blank" rel="noopener">SolidRusT AI</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Store element references
        elements = {
            widget,
            toggle: widget.querySelector('.chat-toggle'),
            window: widget.querySelector('.chat-window'),
            close: widget.querySelector('.chat-close'),
            messages: widget.querySelector('.chat-messages'),
            input: widget.querySelector('.chat-input'),
            send: widget.querySelector('.chat-send'),
            suggestions: widget.querySelector('.chat-suggestions'),
            badge: widget.querySelector('.chat-badge')
        };
    }

    // Bind event handlers
    function bindEvents() {
        // Toggle chat
        elements.toggle.addEventListener('click', toggleChat);
        elements.close.addEventListener('click', closeChat);
        
        // Input handling
        elements.input.addEventListener('input', handleInputChange);
        elements.input.addEventListener('keydown', handleKeyDown);
        elements.send.addEventListener('click', sendMessage);
        
        // Suggestion buttons
        elements.suggestions.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.input.value = btn.textContent;
                handleInputChange();
                sendMessage();
            });
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        });
        
        // Handle clicks on message links
        elements.messages.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    closeChat();
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    }

    // Toggle chat window
    function toggleChat() {
        isOpen ? closeChat() : openChat();
    }

    // Open chat
    function openChat() {
        isOpen = true;
        elements.toggle.classList.add('active');
        elements.toggle.setAttribute('aria-expanded', 'true');
        elements.window.classList.add('open');
        elements.window.setAttribute('aria-hidden', 'false');
        elements.badge.classList.add('hidden');
        elements.input.focus();
        scrollToBottom();
    }

    // Close chat
    function closeChat() {
        isOpen = false;
        elements.toggle.classList.remove('active');
        elements.toggle.setAttribute('aria-expanded', 'false');
        elements.window.classList.remove('open');
        elements.window.setAttribute('aria-hidden', 'true');
        elements.toggle.focus();
    }

    // Handle input changes
    function handleInputChange() {
        const hasText = elements.input.value.trim().length > 0;
        elements.send.disabled = !hasText || isLoading;
        
        // Auto-resize textarea
        elements.input.style.height = 'auto';
        elements.input.style.height = Math.min(elements.input.scrollHeight, 120) + 'px';
    }

    // Handle keyboard events
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!elements.send.disabled) {
                sendMessage();
            }
        }
    }

    // Send message to API
    async function sendMessage() {
        const text = elements.input.value.trim();
        if (!text || isLoading) return;
        
        // Add user message
        addMessage('user', text);
        elements.input.value = '';
        handleInputChange();
        
        // Hide suggestions after first message
        elements.suggestions.style.display = 'none';
        
        // Show typing indicator
        isLoading = true;
        elements.send.disabled = true;
        showTypingIndicator();
        
        try {
            const response = await callAPI(text);
            removeTypingIndicator();
            addMessage('assistant', response);
        } catch (error) {
            removeTypingIndicator();
            showError(error.message);
        } finally {
            isLoading = false;
            handleInputChange();
        }
    }

    // Call the AI API
    async function callAPI(userMessage) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API key not configured. Please try again later.');
        }
        
        // Build messages array with history
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            })),
            { role: 'user', content: userMessage }
        ];
        
        // Use explicit CORS mode and handle errors properly
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: messages,
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE
            })
        });
        
        if (!response.ok) {
            // Try to get error details from response
            let errorMessage = `API error: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error.message || errorData.error;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
            } catch {
                // Response wasn't JSON, use status text
                errorMessage = `API error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    }

    // Add message to chat
    function addMessage(role, content) {
        // Store in history
        chatHistory.push({ role, content, timestamp: Date.now() });
        
        // Trim history if too long
        if (chatHistory.length > CONFIG.MAX_HISTORY) {
            chatHistory = chatHistory.slice(-CONFIG.MAX_HISTORY);
        }
        
        saveChatHistory();
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${role}`;
        
        const avatarIcon = role === 'user' ? 'fa-user' : 'fa-robot';
        const processedContent = processMessageContent(content);
        
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatarIcon}" aria-hidden="true"></i>
            </div>
            <div class="message-content">${processedContent}</div>
        `;
        
        elements.messages.appendChild(messageEl);
        scrollToBottom();
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            const roleLabel = role === 'user' ? 'You said' : 'Assistant said';
            window.announceToScreenReader(`${roleLabel}: ${content}`);
        }
    }

    // Process message content (convert markdown-style links)
    function processMessageContent(content) {
        // Escape HTML
        let processed = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Convert markdown links [text](url) to HTML
        processed = processed.replace(/\[([^\]]+)\]\((#[^)]+)\)/g, '<a href="$2">$1</a>');
        processed = processed.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Convert line breaks
        processed = processed.replace(/\n/g, '<br>');
        
        return processed;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message assistant typing';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot" aria-hidden="true"></i>
            </div>
            <div class="typing-indicator" aria-label="Assistant is typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        elements.messages.appendChild(indicator);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Show error message
    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'chat-error';
        errorEl.innerHTML = `
            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        elements.messages.appendChild(errorEl);
        scrollToBottom();
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }

    // Scroll messages to bottom
    function scrollToBottom() {
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    // Save chat history to localStorage
    function saveChatHistory() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(chatHistory));
        } catch (e) {
            // localStorage might be full or disabled
        }
    }

    // Load chat history from localStorage
    function loadChatHistory() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                chatHistory = JSON.parse(saved);
                // Render saved messages
                chatHistory.forEach(msg => {
                    const messageEl = document.createElement('div');
                    messageEl.className = `chat-message ${msg.role}`;
                    const avatarIcon = msg.role === 'user' ? 'fa-user' : 'fa-robot';
                    const processedContent = processMessageContent(msg.content);
                    messageEl.innerHTML = `
                        <div class="message-avatar">
                            <i class="fas ${avatarIcon}" aria-hidden="true"></i>
                        </div>
                        <div class="message-content">${processedContent}</div>
                    `;
                    elements.messages.appendChild(messageEl);
                });
            }
        } catch (e) {
            chatHistory = [];
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging/customization
    window.SupariousChat = {
        open: openChat,
        close: closeChat,
        toggle: toggleChat,
        clearHistory: () => {
            chatHistory = [];
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            elements.messages.innerHTML = '';
            elements.suggestions.style.display = 'flex';
            addMessage('assistant', "Chat history cleared. How can I help you?");
        }
    };
})();
