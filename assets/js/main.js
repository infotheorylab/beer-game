// Main JavaScript for Beer Game Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Load content from JSON
    loadContent();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize interactive supply chain explainer
    initSupplyChainExplainer();
    
    // Initialize bullwhip chart
    initBullwhipChart();
    
    // Initialize Hugging Face embed
    initHuggingFaceEmbed();
});

// Content Loading
function loadContent() {
    fetch('/content/content.en.json')
        .then(response => response.json())
        .then(data => {
            populateContent(data);
        })
        .catch(error => {
            console.log('Using fallback content:', error);
            // Content is already in HTML as fallback
        });
}

function populateContent(data) {
    // Update document title
    if (data.site_title) {
        document.title = data.site_title;
    }
    
    // Update hero section
    if (data.slides?.hero) {
        const hero = data.slides.hero;
        updateElement('hero-title', hero.title);
        updateElement('hero-kicker', hero.kicker);
    }
    
    // Update other sections
    const sections = ['beer-game-info', 'roles', 'week', 'bullwhip', 'aiq', 'vars', 'try', 'credits'];
    sections.forEach(section => {
        if (data.slides?.[section]) {
            updateSection(section, data.slides[section]);
        }
    });
    
    // Update Hugging Face URL
    if (data.hf_embed_url) {
        const iframe = document.getElementById('hf-frame');
        const link = document.getElementById('hf-link');
        if (iframe) iframe.src = data.hf_embed_url;
        if (link) link.href = data.hf_embed_url;
    }
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
        // Special handling for titles that need highlighting
        if (id === 'hero-title' || id === 'bullwhip-title' || id === 'roles-title' || id === 'aiq-title') {
            // Don't overwrite titles with highlight spans - they're already in HTML
            return;
        }
        element.textContent = content;
    }
}

function updateSection(sectionName, sectionData) {
    // Update title
    if (sectionData.title) {
        updateElement(`${sectionName}-title`, sectionData.title);
    }
    
    // Update body text
    if (sectionData.body) {
        const element = document.getElementById(`${sectionName}-body`);
        if (element) {
            // Use innerHTML for beer-game-info to support links
            if (sectionName === 'beer-game-info') {
                element.innerHTML = sectionData.body;
            } else {
                element.textContent = sectionData.body;
            }
        }
    }
    
    // Update question text (for beer-game-info section)
    if (sectionData.question) {
        const element = document.getElementById(`${sectionName}-question`);
        if (element) {
            element.innerHTML = sectionData.question;
        }
    }
    
    // Handle special cases
    switch (sectionName) {
        case 'roles':
            updateRoles(sectionData.items);
            break;
        case 'week':
            updateWeekSteps(sectionData.steps);
            break;
        case 'aiq':
            updateBullets('aiq-bullets', sectionData.bullets);
            break;
        case 'vars':
            updateVariables(sectionData.items);
            break;
        case 'try':
            updateElement('try-cta', sectionData.cta);
            break;
    }
}

function updateRoles(roleItems) {
    if (!roleItems) return;
    
    const roleCards = document.querySelectorAll('.role-card');
    roleItems.forEach((item, index) => {
        if (roleCards[index]) {
            const nameEl = roleCards[index].querySelector('.role-name');
            const descEl = roleCards[index].querySelector('.role-description');
            if (nameEl) nameEl.textContent = item.t;
            if (descEl) descEl.textContent = item.b;
        }
    });
}

function updateWeekSteps(steps) {
    if (!steps) return;
    
    const stepLabels = document.querySelectorAll('.step-label');
    steps.forEach((step, index) => {
        if (stepLabels[index]) {
            stepLabels[index].textContent = step;
        }
    });
}

function updateBullets(containerId, bullets) {
    if (!bullets) return;
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = bullets.map(bullet => `<li>${bullet}</li>`).join('');
    }
}

function updateVariables(variables) {
    if (!variables) return;
    
    const container = document.getElementById('vars-list');
    if (container) {
        container.innerHTML = variables.map(variable => `<li>${variable}</li>`).join('');
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
}

// Interactive Supply Chain Explainer (from draft1.html)
function initSupplyChainExplainer() {
    const scrollContainer = document.querySelector('main');
    const explainerSection = document.getElementById('supply-chain-explainer-section');
    const explanationContainer = document.getElementById('explanation-container');

    if (!scrollContainer || !explainerSection || !explanationContainer) return;

    const icons = {
        customer: document.getElementById('chain-customer'),
        retailer: document.getElementById('chain-retailer'),
        wholesaler: document.getElementById('chain-wholesaler'),
        distributor: document.getElementById('chain-distributor'),
        factory: document.getElementById('chain-factory'),
    };
    const arrows = [
        document.getElementById('arrow-1'),
        document.getElementById('arrow-2'),
        document.getElementById('arrow-3'),
        document.getElementById('arrow-4'),
    ];

    const explanations = {
        customer: {
            title: "The Customer",
            text: "Their demand is the only real input to the system. They simply want to buy beer. Their demand is surprisingly stable, but their actions kickstart the entire chain.",
            highlightClass: 'highlight-amber'
        },
        retailer: {
            title: "The Retailer",
            text: "Tries to meet customer demand while keeping inventory low. They place orders to the wholesaler based on what they *think* future demand will be.",
            highlightClass: 'highlight-blue'
        },
        wholesaler: {
            title: "The Wholesaler",
            text: "Fulfills orders from many retailers. They face amplified demand variability and must order from the distributor, adding another layer of forecasting and delay.",
            highlightClass: 'highlight-purple'
        },
        distributor: {
            title: "The Distributor",
            text: "Bridges factory production and regional markets. Manages bulk inventory distribution to multiple wholesalers, facing amplified demand variability and longer lead times.",
            highlightClass: 'highlight-amber'
        },
        factory: {
            title: "The Factory",
            text: "The start of the production line. They have the longest lead times and see the most distorted demand signal, leading to massive overproduction or shortages.",
            highlightClass: 'highlight-red'
        },
        orders: {
            title: "Goods vs. Information",
            text: "Goods flow <span class='highlight-text'>downstream</span> from factory to customers, while orders (information) flow <span class='highlight-text'>upstream</span> from customers to factory. Delays in this information flow cause the bullwhip effect.",
        }
    };

    let currentStep = null;

    function updateHighlight(step) {
        if (currentStep === step) return;
        currentStep = step;

        // Clear previous state
        Object.values(icons).forEach(icon => {
            if (icon) icon.classList.remove('highlight', 'highlight-red', 'highlight-purple', 'highlight-blue', 'highlight-amber');
        });
        arrows.forEach(arrow => {
            if (arrow) {
                arrow.classList.remove('highlight');
                arrow.classList.remove('fa-long-arrow-alt-right');
                arrow.classList.add('fa-long-arrow-alt-left');
            }
        });
        explanationContainer.innerHTML = '';

        if (step && explanations[step]) {
            const explanation = explanations[step];
            const contentDiv = document.createElement('div');
            contentDiv.className = 'explanation-content';
            contentDiv.innerHTML = `
                <h3 class="explanation-title highlight-text">${explanation.title}</h3>
                <p class="explanation-text">${explanation.text}</p>
            `;
            explanationContainer.appendChild(contentDiv);

            let targetElement = icons[step];

            if (targetElement) {
                targetElement.classList.add('highlight', explanation.highlightClass);
                const iconRect = targetElement.getBoundingClientRect();
                // Position the explanation below the highlighted icon
                contentDiv.style.left = `${iconRect.left + (iconRect.width / 2) - (contentDiv.offsetWidth / 2)}px`;
                contentDiv.style.top = `${iconRect.bottom + 15}px`;
            } else if (step === 'orders') {
                arrows.forEach(arrow => {
                    if (arrow) {
                        arrow.classList.add('highlight');
                        // Flip arrows to show upstream information flow (from left-pointing to right-pointing)
                        arrow.classList.remove('fa-long-arrow-alt-left');
                        arrow.classList.add('fa-long-arrow-alt-right');
                    }
                });
                // Position above the supply chain icons, not overlapping
                contentDiv.style.left = `50%`;
                contentDiv.style.top = `25%`; // Much higher to avoid overlap
                contentDiv.style.transform = `translate(-50%, -50%)`;
            }
            
            // Trigger fade-in
            setTimeout(() => contentDiv.classList.add('visible'), 50);
        }
    }

    const steps = ['customer', 'retailer', 'wholesaler', 'distributor', 'factory', 'orders'];

    scrollContainer.addEventListener('scroll', () => {
        const { scrollTop, clientHeight } = scrollContainer;
        const sectionTop = explainerSection.offsetTop;
        const sectionHeight = explainerSection.offsetHeight;

        // Check if we are within the explainer section
        if (scrollTop >= sectionTop - clientHeight / 2 && scrollTop < sectionTop + sectionHeight - clientHeight / 2) {
            const scrollPortion = (scrollTop - sectionTop) / (sectionHeight - clientHeight);
            const stepIndex = Math.min(steps.length - 1, Math.floor(scrollPortion * steps.length));
            updateHighlight(steps[stepIndex]);
        } else {
            updateHighlight(null); // Clear when outside the section
        }
    });
}

// Bullwhip Chart (exact from draft1.html)
function initBullwhipChart() {
    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderBullwhipChart();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const chart = document.getElementById('bullwhipChart');
    if (chart) {
        chartObserver.observe(chart);
    }
}

function renderBullwhipChart() {
    const ctx = document.getElementById('bullwhipChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    const labels = Array.from({ length: 20 }, (_, i) => `Week ${i + 1}`);
    
    // Exact data from draft1.html
    const customerDemand = [8, 8, 8, 8, 12, 12, 12, 12, 8, 8, 8, 8, 12, 12, 12, 12, 8, 8, 8, 8];
    const retailerOrders = [8, 8, 8, 16, 16, 12, 12, 8, 8, 8, 16, 16, 12, 12, 8, 8, 8, 8, 12, 12];
    const wholesalerOrders = [8, 8, 12, 20, 20, 16, 8, 4, 8, 12, 20, 20, 16, 8, 4, 4, 8, 12, 16, 16];
    const factoryOrders = [8, 10, 16, 24, 24, 16, 0, 0, 4, 12, 24, 28, 20, 4, 0, 0, 8, 16, 20, 20];

    new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Factory Production',
                data: factoryOrders,
                borderColor: '#f87171', // Red - exact from draft1.html
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
            }, {
                label: 'Wholesaler Orders',
                data: wholesalerOrders,
                borderColor: '#a78bfa', // Purple - exact from draft1.html
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
            }, {
                label: 'Retailer Orders',
                data: retailerOrders,
                borderColor: '#60a5fa', // Blue - exact from draft1.html
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
            }, {
                label: 'Customer Demand',
                data: customerDemand,
                borderColor: '#f59e0b', // Amber - exact from draft1.html
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuad',
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#d1d5db' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#d1d5db' }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#d1d5db',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

// Hugging Face Embed
function initHuggingFaceEmbed() {
    // This will be populated from the JSON content
    // If no URL is provided, the iframe will show empty
}

// Utility function for smooth scrolling (optional enhancement)
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}