document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll Animations ───
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ─── Animated Counters ───
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out curve
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                if (target >= 1000000) {
                    counter.textContent = (current / 1000000).toFixed(1) + 'M+';
                } else if (target >= 1000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'k+';
                } else {
                    counter.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counters when stats come into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ─── Mobile Hamburger Menu ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ─── Multi-Format Content Data ───
    const contentLibrary = {
        thread: [
            { label: '🧵 Thread 1/7', text: 'The future of AI isn\'t chatbots. It\'s autonomous agents that repurpose your content into 30 pieces automatically.' },
            { label: '🧵 Thread 2/7', text: 'Creators spend 80% of time on distribution, only 20% creating. That\'s a massive bottleneck we\'re fixing.' },
            { label: '🧵 Thread 3/7', text: 'With RepurposAI, paste one blog post and get a full week of social content in under 60 seconds.' },
            { label: '🧵 Thread 4/7', text: 'Our engine doesn\'t just summarize. It extracts the emotional hooks, key data points, and converts them into scroll-stoppers.' },
            { label: '🧵 Thread 5/7', text: 'Early users report saving 15+ hours/week. That\'s nearly two full workdays reclaimed for actual creation.' },
        ],
        linkedin: [
            { label: '💼 LinkedIn Post', text: 'I just discovered something that changed my entire content workflow.\n\nFor months, I was spending 4+ hours distributing every blog post across LinkedIn, Twitter, and my newsletter.\n\nThen I tried RepurposAI.\n\nPaste one link → Get optimized content for every platform.\n\nThe LinkedIn output matches my professional tone perfectly. The thread format drives engagement. The newsletter summary saves my subscribers time.\n\nIf you\'re a creator still manually repurposing content, you\'re leaving hours on the table.' },
        ],
        newsletter: [
            { label: '📧 Subject Line', text: '🚀 This Week: How AI Is Redefining Content Distribution' },
            { label: '📧 Opening', text: 'Hey Reader,\n\nEver feel like you spend more time promoting your content than creating it? You\'re not alone — 80% of creators report the same bottleneck.' },
            { label: '📧 Key Insight', text: 'The solution isn\'t to work harder. It\'s to let AI handle the reformatting while you focus on what matters: creating original, valuable content.' },
            { label: '📧 CTA', text: 'Try RepurposAI free — paste any blog post or video and see the magic for yourself. No credit card required.' },
        ]
    };

    let currentFormat = 'thread';
    let generatedData = null; // stores generated content so tabs can switch

    // ─── DOM References ───
    const generateBtn = document.getElementById('generateBtn');
    const contentUrl = document.getElementById('contentUrl');
    const mockupBody = document.getElementById('mockupBody');
    const statusMessage = document.getElementById('statusMessage');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const mockupActions = document.getElementById('mockupActions');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputTabs = document.getElementById('outputTabs');

    // ─── Tab Switching ───
    outputTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.getAttribute('data-format');

            // Update active tab visuals
            outputTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFormat = format;

            // If content has been generated, re-render with new format
            if (generatedData) {
                renderContent(contentLibrary[format], format);
            }
        });
    });

    // ─── Render Content ───
    function renderContent(pieces, format) {
        mockupBody.replaceChildren();

        pieces.forEach((piece, index) => {
            setTimeout(() => {
                const postDiv = document.createElement('div');
                postDiv.className = 'generated-post';
                if (format === 'linkedin') postDiv.classList.add('linkedin');
                if (format === 'newsletter') postDiv.classList.add('newsletter');

                const labelSpan = document.createElement('span');
                labelSpan.className = 'post-label';
                if (format === 'linkedin') labelSpan.classList.add('linkedin-label');
                if (format === 'newsletter') labelSpan.classList.add('newsletter-label');
                labelSpan.textContent = piece.label;

                const textP = document.createElement('p');
                textP.textContent = piece.text;

                postDiv.appendChild(labelSpan);
                postDiv.appendChild(textP);
                mockupBody.appendChild(postDiv);
            }, index * 350);
        });
    }

    // ─── URL Validation ───
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }

    // ─── Generate Button ───
    generateBtn.addEventListener('click', () => {
        const url = contentUrl.value.trim();

        if (!url) {
            statusMessage.textContent = "⚠ Please enter a URL to begin.";
            statusMessage.style.color = "#ff5f56";
            return;
        }

        if (!isValidUrl(url)) {
            statusMessage.textContent = "⚠ Please enter a valid URL (e.g. https://example.com/article).";
            statusMessage.style.color = "#ff5f56";
            return;
        }

        // Start progress
        generateBtn.disabled = true;
        progressContainer.classList.add('active');
        progressBar.style.width = '0%';
        mockupActions.style.display = 'none';
        mockupBody.replaceChildren();
        statusMessage.style.color = "var(--text-secondary)";

        const steps = [
            { progress: 20, text: "🔍 Fetching and parsing content..." },
            { progress: 45, text: "🧠 Extracting key insights and hooks..." },
            { progress: 70, text: "✍️ Generating multi-format content..." },
            { progress: 90, text: "✨ Polishing and formatting output..." },
            { progress: 100, text: "✅ Content generated successfully!" },
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                progressBar.style.width = step.progress + '%';
                statusMessage.textContent = step.text;

                // Final step — render content
                if (index === steps.length - 1) {
                    statusMessage.style.color = "#27c93f";
                    progressContainer.classList.remove('active');

                    generatedData = contentLibrary;
                    renderContent(contentLibrary[currentFormat], currentFormat);

                    // Show action buttons
                    mockupActions.style.display = 'flex';
                    generateBtn.disabled = false;
                }
            }, (index + 1) * 800);
        });
    });

    // ─── Copy to Clipboard ───
    copyBtn.addEventListener('click', () => {
        if (!generatedData) return;

        const pieces = generatedData[currentFormat];
        const textToCopy = pieces.map(p => p.label + '\n' + p.text).join('\n\n---\n\n');

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Copied to clipboard!');
        }).catch(() => {
            // Fallback: select from a temporary textarea
            showToast('Copy failed. Try selecting manually.');
        });
    });

    // ─── Download as .txt ───
    downloadBtn.addEventListener('click', () => {
        if (!generatedData) return;

        const pieces = generatedData[currentFormat];
        const textContent = pieces.map(p => p.label + '\n' + p.text).join('\n\n---\n\n');

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'repurposai-' + currentFormat + '.txt';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);

        showToast('Downloaded ' + currentFormat + '.txt');
    });

    // ─── Toast Notification ───
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2500);
    }

    // ─── Keyboard: Enter to generate ───
    contentUrl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateBtn.click();
        }
    });

});

// End of script
