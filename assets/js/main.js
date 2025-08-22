// Main JavaScript for Beer Game Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Load content from JSON
    loadContent();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize interactive supply chain explainer
    initBeerGameDynamics();
    
    // Initialize progressive bullwhip chart
    initProgressiveBullwhipChart();
    
    // Initialize Hugging Face embed
    initHuggingFaceEmbed();
});

// Content Loading
function loadContent() {
    fetch('./content/content.en.json')
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
    const sections = ['beer-game-info', 'llm-beer-game', 'roles', 'week', 'aiq', 'vars', 'try', 'credits'];
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
        if (id === 'hero-title' || id === 'llm-beer-game-title' || id === 'roles-title' || id === 'aiq-title') {
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
            // Use innerHTML for sections that need HTML formatting
            if (sectionName === 'beer-game-info' || sectionName === 'llm-beer-game') {
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
            if (descEl) descEl.innerHTML = item.b;
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

// Beer Game Dynamics - Visual with Side Panel
function initBeerGameDynamics() {
    const scrollContainer = document.querySelector('main');
    const dynamicsSection = document.getElementById('beer-game-dynamics-section');
    const explanationContent = document.getElementById('dynamics-explanation-content');
    const explanationTitle = document.getElementById('explanation-title');
    const explanationText = document.getElementById('explanation-text');
    
    if (!scrollContainer || !dynamicsSection) return;
    
    // Game dynamics explanations following Wikipedia's 4-step process
    const explanations = [
        {
            title: "The Beer Game Supply Chain",
            text: "In the Beer Game, four players manage the beer supply chain: Factory, Distributor, Wholesaler, and Retailer. Each week, they follow four steps.",
            visualState: { retailer: 'normal', wholesaler: 'normal', distributor: 'normal', factory: 'normal' }
        },
        {
            title: "Step 1: Check Deliveries",
            text: "Each player receives their incoming shipments from upstream. These are orders placed two weeks ago (except retailers who can fulfill customers immediately).",
            visualState: { retailer: 'highlight', wholesaler: 'highlight', distributor: 'highlight', factory: 'highlight' }
        },
        {
            title: "Step 2: Check Orders",
            text: "Players see what their downstream partner wants. Only the retailer sees actual customer demand - everyone else sees their partner's orders.",
            visualState: { customer: 'highlight', retailer: 'normal' }
        },
        {
            title: "Step 3: Deliver Beer",
            text: "Ship beer to fulfill orders. If you don't have enough inventory, you create a backlog that must be filled when stock arrives.",
            visualState: { retailer: 'normal', wholesaler: 'normal', distributor: 'normal' }
        },
        {
            title: "Step 4: Make Order Decision",
            text: "The critical decision: How much to order from your supplier? This is where the bullwhip effect begins - small demand changes create big swings.",
            visualState: { retailer: 'backlog', wholesaler: 'backlog', distributor: 'backlog', factory: 'backlog' }
        },
        {
            title: "The Hidden Challenge",
            text: "With limited information and delivery delays, players often overreact. A small increase in customer demand causes panic ordering up the chain.",
            visualState: { customer: 'excess', retailer: 'backlog', wholesaler: 'backlog' }
        },
        {
            title: "The Bullwhip Effect",
            text: "Small variations in customer demand get amplified at each stage. The factory sees wild swings, alternating between overproduction and shutdowns.",
            visualState: { factory: 'backlog', distributor: 'excess', wholesaler: 'excess', retailer: 'normal' }
        }
    ];
    
    let currentStep = 0;
    
    // Update visual states and explanation panel
    function updateVisualization(step) {
        if (step < 0 || step >= explanations.length) return;
        
        const explanation = explanations[step];
        
        // Update explanation panel text
        if (explanationContent && explanationTitle && explanationText) {
            explanationTitle.textContent = explanation.title;
            explanationText.textContent = explanation.text;
            setTimeout(() => explanationContent.classList.add('visible'), 50);
        }
        
        // Reset all nodes to normal
        document.querySelectorAll('.stage-node').forEach(node => {
            node.classList.remove('highlight', 'excess', 'normal', 'backlog');
        });
        
        // Apply visual states
        if (explanation.visualState) {
            Object.entries(explanation.visualState).forEach(([stage, state]) => {
                const node = document.getElementById(`${stage}-node`);
                if (node) {
                    node.classList.add(state);
                }
            });
        }
    }
    
    // Hide explanation when not in section
    function hideExplanation() {
        if (explanationContent) {
            explanationContent.classList.remove('visible');
        }
    }

    // Handle scroll events
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;
        const sectionTop = dynamicsSection.offsetTop;
        const sectionHeight = dynamicsSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Check if we're in the dynamics section
        if (scrollTop >= sectionTop - viewportHeight / 2 && 
            scrollTop < sectionTop + sectionHeight - viewportHeight / 2) {
            
            // Calculate which step we're on
            const scrollProgress = (scrollTop - sectionTop) / (sectionHeight - viewportHeight);
            const newStep = Math.min(
                explanations.length - 1,
                Math.max(0, Math.floor(scrollProgress * explanations.length))
            );
            
            if (newStep !== currentStep) {
                currentStep = newStep;
                updateVisualization(currentStep);
            }
        } else {
            // Hide explanation when not in section
            hideExplanation();
        }
    });
    
    // Initialize with first explanation
    updateVisualization(0);
}

// Progressive Bullwhip Chart (Fixed Chart with Dynamic Lines)
let progressiveBullwhipChart = null;
let currentBullwhipStep = 0;

function initProgressiveBullwhipChart() {
    const scrollContainer = document.querySelector('main');
    const progressiveSection = document.getElementById('bullwhip-progressive-section');
    const explanationContainer = document.getElementById('bullwhip-explanation-container');

    if (!scrollContainer || !progressiveSection || !explanationContainer) return;
    
    // Create the initial charts
    createBullwhipChart();
    createInventoryChart();
    
    const explanations = {
        0: {
            title: "The Bullwhip Effect",
            text: "Customer demand stays remarkably stable - just a small step change from 8 to 12 units, then back to 8. This is the only real input to the system.",
            highlightClass: 'customer-text'
        },
        1: {
            title: "The Retailer Response",
            text: "The Retailer sees customer demand and tries to maintain inventory. Notice how their orders already show more variability than actual customer demand.",
            highlightClass: 'retailer-text'
        },
        2: {
            title: "The Wholesaler Amplifies",
            text: "The Wholesaler faces amplified demand from the Retailer and adds their own forecasting errors. Orders become even more volatile.",
            highlightClass: 'wholesaler-text'
        },
        3: {
            title: "The Factory Chaos",
            text: "By the time demand signals reach the Factory, they're completely distorted. Small customer changes create massive production swings - from 28 units to 0!",
            highlightClass: 'factory-text'
        },
        4: {
            title: "The Complete Bullwhip Effect",
            text: "This is the bullwhip effect: stable customer demand creates chaos upstream. Each player acts rationally but lacks information, amplifying variability at every step.",
            highlightClass: ''
        }
    };
    
    function updateBullwhipStep(step) {
        if (currentBullwhipStep === step) return;
        
        const previousStep = currentBullwhipStep;
        currentBullwhipStep = step;

        // Show the next dataset if moving forward
        if (step > previousStep && step <= 3) {
            showNextDataset(step);
        }

        // Update explanation only if step changed
        if (step !== previousStep) {
            updateBullwhipExplanation(step, explanations[step]);
        }
    }

    let scrollTimeout = null;
    
    scrollContainer.addEventListener('scroll', () => {
        // Debounce scroll events to prevent rapid updates
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const { scrollTop, clientHeight } = scrollContainer;
            const sectionTop = progressiveSection.offsetTop;
            const sectionHeight = progressiveSection.offsetHeight;

            // Check if we are within the progressive section
            if (scrollTop >= sectionTop - clientHeight / 3 && scrollTop < sectionTop + sectionHeight - clientHeight / 3) {
                const scrollPortion = (scrollTop - sectionTop) / (sectionHeight - clientHeight);
                
                // Create more precise thresholds with hysteresis
                let stepIndex = 0;
                if (scrollPortion > 0.15) stepIndex = 1;
                if (scrollPortion > 0.35) stepIndex = 2; 
                if (scrollPortion > 0.55) stepIndex = 3;
                if (scrollPortion > 0.75) stepIndex = 4;
                
                stepIndex = Math.max(0, Math.min(4, stepIndex));
                updateBullwhipStep(stepIndex);
            }
        }, 16); // ~60fps throttling
    });
}

function createBullwhipChart() {
    const ctx = document.getElementById('bullwhipProgressiveChart');
    if (!ctx) return;
    
    const labels = Array.from({ length: 20 }, (_, i) => `Week ${i + 1}`);

    // Data for the bullwhip effect chart
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Customer Demand',
                data: [4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.1,
                hidden: false
            },
            {
                label: 'Retailer Orders',
                data: [4, 4, 4, 8, 12, 15, 10, 8, 5, 5, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                borderColor: '#60a5fa',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            },
            {
                label: 'Wholesaler Orders',
                data: [4, 4, 6, 10, 16, 20, 12, 5, 0, 0, 4, 10, 12, 10, 8, 8, 8, 8, 8, 8],
                borderColor: '#a78bfa',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            },
            {
                label: 'Factory Production',
                data: [4, 5, 8, 14, 24, 32, 18, 0, 0, 0, 0, 15, 20, 15, 10, 8, 8, 8, 8, 8],
                borderColor: '#f87171',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            }
        ]
    };

    // Create the chart
    progressiveBullwhipChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#f0f0f0',
                        font: {
                            size: 14
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'The Bullwhip Effect in Action',
                    color: '#f0f0f0',
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Units Ordered',
                        color: '#f0f0f0',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function showNextDataset(step) {
    if (!progressiveBullwhipChart) return;
    
    // Show datasets progressively
    if (step <= 3) {
        progressiveBullwhipChart.data.datasets[step].hidden = false;
        progressiveBullwhipChart.update('active');
    }
    
    // Also update inventory chart visibility
    if (window.inventoryChart && step <= 3) {
        window.inventoryChart.data.datasets[step].hidden = false;
        window.inventoryChart.update('active');
    }
}

// Create Inventory/Backlog Chart
function createInventoryChart() {
    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;
    
    const labels = Array.from({ length: 20 }, (_, i) => `Week ${i + 1}`);
    
    // Inventory/Backlog data (positive = inventory, negative = backlog)
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Retailer Inventory',
                data: [12, 12, 12, 8, 4, -2, -4, -2, 2, 6, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderWidth: 3,
                tension: 0.1,
                hidden: false
            },
            {
                label: 'Wholesaler Inventory',
                data: [12, 12, 10, 6, -2, -8, -10, -6, 0, 4, 8, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            },
            {
                label: 'Distributor Inventory',
                data: [12, 11, 8, 2, -8, -16, -18, -12, -4, 2, 8, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            },
            {
                label: 'Factory Inventory',
                data: [12, 10, 6, -4, -16, -28, -30, -20, -8, 4, 12, 16, 14, 12, 12, 12, 12, 12, 12, 12],
                borderColor: '#f87171',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                borderWidth: 3,
                tension: 0.1,
                hidden: true
            }
        ]
    };
    
    // Create the chart
    window.inventoryChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#f0f0f0',
                        font: {
                            size: 14
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Inventory & Backlog Levels',
                    color: '#f0f0f0',
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                annotation: {
                    annotations: {
                        zeroLine: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                enabled: true,
                                content: 'Zero Inventory',
                                position: 'end',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: '#f0f0f0',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: -35,
                    max: 20,
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value < 0 ? `${Math.abs(value)} Backlog` : `${value} Units`;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Inventory (+) / Backlog (-)',
                        color: '#f0f0f0',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        color: '#d1d5db',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function updateBullwhipExplanation(step, explanation) {
    const container = document.getElementById('bullwhip-explanation-container');
    if (!container || !explanation) return;
    
    // Clear and update content
    container.innerHTML = `
        <div class="bullwhip-explanation-content visible">
            <h3 class="${explanation.highlightClass}">${explanation.title}</h3>
            <p>${explanation.text}</p>
        </div>
    `;
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