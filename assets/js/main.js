// Main JavaScript for Beer Game Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Load content from JSON
    loadContent();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize interactive supply chain explainer
    initBeerGameDynamics();
    
    // Initialize beer game mechanics with steps
    initBeerGameMechanics();
    
    // Initialize progressive bullwhip chart
    initProgressiveBullwhipChart();
    
    // Initialize AIQ content switching
    initAIQContentSwitching();
    
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
    const sections = ['beer-game-info', 'week', 'aiq', 'try', 'credits'];
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
        if (id === 'hero-title' || id === 'aiq-title') {
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
        case 'week':
            updateWeekSteps(sectionData.steps);
            break;
        case 'aiq':
            updateBullets('aiq-bullets', sectionData.bullets);
            break;
        case 'try':
            updateElement('try-cta', sectionData.cta);
            break;
    }
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

// Beer Game Mechanics - Step-by-step explanation for Section 3
function initBeerGameMechanics() {
    const scrollContainer = document.querySelector('main');
    const mechanicsSection = document.getElementById('beer-game-mechanics-section');
    const explanationPanel = document.getElementById('dynamics-explanation-panel');
    const explanationContent = document.getElementById('dynamics-explanation-content');
    const explanationTitle = document.getElementById('explanation-title');
    const explanationText = document.getElementById('explanation-text');
    
    if (!scrollContainer || !mechanicsSection) return;
    
    // Game mechanics explanations for "How the Beer Game Works"
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
        
        // Control beer flow animation - only on Step 1 (Check Deliveries)
        const beerIcons = document.querySelectorAll('#beer-game-mechanics-section .beer-icon');
        if (step === 1) {
            // Add animation for Step 1: Check Deliveries
            beerIcons.forEach(icon => icon.classList.add('animate'));
        } else {
            // Remove animation for all other steps
            beerIcons.forEach(icon => icon.classList.remove('animate'));
        }
        
        // Control arriving beer visibility - highlight in Step 1, permanent afterwards
        const arrivingBeers = document.querySelectorAll('#beer-game-mechanics-section .arriving-beer');
        if (step === 1) {
            // Show and highlight arriving beer for Step 1: Check Deliveries
            arrivingBeers.forEach(beer => {
                beer.classList.add('highlight');
                beer.classList.remove('permanent');
                // Ensure arriving beer is visible even if it has step3-remove class
                beer.classList.remove('removing');
            });
        } else if (step > 1 && step < 3) {
            // Make arriving beer permanent (visible but not highlighted) for step 2
            arrivingBeers.forEach(beer => {
                beer.classList.remove('highlight');
                beer.classList.add('permanent');
                beer.classList.remove('removing');
            });
        } else if (step >= 3) {
            // Step 3 and beyond: arriving beers with step3-remove will be handled by beer removal logic
            arrivingBeers.forEach(beer => {
                beer.classList.remove('highlight');
                if (!beer.classList.contains('step3-remove')) {
                    beer.classList.add('permanent');
                }
            });
        } else {
            // Hide arriving beer for step 0
            arrivingBeers.forEach(beer => {
                beer.classList.remove('highlight', 'permanent', 'removing');
            });
        }
        
        // Control arrow direction - reverse in Step 2 (Check Orders)
        const arrowVisuals = document.querySelectorAll('#beer-game-mechanics-section .arrow-visual');
        if (step === 2) {
            // Reverse arrows for Step 2: Check Orders (orders flow upstream →)
            arrowVisuals.forEach(arrow => arrow.classList.add('reverse'));
        } else {
            // Normal arrow direction for all other steps (beer flows downstream ←)
            arrowVisuals.forEach(arrow => arrow.classList.remove('reverse'));
        }
        
        // Control flow direction text highlighting
        const beerDirection = document.querySelector('#beer-game-mechanics-section .beer-direction');
        const orderDirection = document.querySelector('#beer-game-mechanics-section .order-direction');
        
        if (step === 2) {
            // Step 2: Highlight orders flow, dim beer flow
            if (beerDirection) {
                beerDirection.classList.remove('highlighted');
                beerDirection.classList.add('dimmed');
            }
            if (orderDirection) {
                orderDirection.classList.remove('dimmed');
                orderDirection.classList.add('highlighted');
            }
        } else {
            // All other steps: Highlight beer flow, dim orders flow
            if (beerDirection) {
                beerDirection.classList.remove('dimmed');
                beerDirection.classList.add('highlighted');
            }
            if (orderDirection) {
                orderDirection.classList.remove('highlighted');
                orderDirection.classList.add('dimmed');
            }
        }
        
        // Control order box visibility - show in Step 2 and remain in Steps 3-4
        const orderBoxes = document.querySelectorAll('#beer-game-mechanics-section .order-box');
        if (step >= 2) {
            // Show order boxes from Step 2 onwards (Check Orders, Deliver Beer, Make Order Decision)
            orderBoxes.forEach(box => box.classList.add('order-show'));
        } else {
            // Hide order boxes in Steps 0-1 (Supply Chain overview, Check Deliveries)
            orderBoxes.forEach(box => box.classList.remove('order-show'));
        }
        
        // Control status icons in order boxes - show in Step 3 (Deliver Beer)
        const statusIcons = document.querySelectorAll('#beer-game-mechanics-section .status-icon');
        if (step === 3) {
            // Show status icons in Step 3: Deliver Beer
            statusIcons.forEach(icon => icon.classList.add('status-show'));
        } else {
            // Hide status icons in all other steps
            statusIcons.forEach(icon => icon.classList.remove('status-show'));
        }
        
        // Control order numbers vs question marks - show ? only in Step 4 (Make Order Decision)
        const orderNumbers = document.querySelectorAll('#beer-game-mechanics-section .order-number');
        const orderQuestions = document.querySelectorAll('#beer-game-mechanics-section .order-question');
        if (step === 4) {
            // Step 4: Show question marks, hide numbers
            orderNumbers.forEach(num => num.classList.add('step4-hide'));
            orderQuestions.forEach(q => q.classList.add('show-step4'));
        } else {
            // All other steps: Show numbers, hide question marks
            orderNumbers.forEach(num => num.classList.remove('step4-hide'));
            orderQuestions.forEach(q => q.classList.remove('show-step4'));
        }
        
        // Control beer inventory changes - Step 3 (Deliver Beer)
        const step3RemoveBeers = document.querySelectorAll('#beer-game-mechanics-section .step3-remove');
        const step3ShowElements = document.querySelectorAll('#beer-game-mechanics-section .step3-show');
        
        // Control distributor inventory grid background for backlog
        const distributorGrid = document.querySelector('#distributor-node .inventory-grid');
        
        if (step >= 3) {
            // Step 3 and beyond: Show backlog elements for distributor
            step3ShowElements.forEach(element => element.classList.add('show-step3'));
            
            // Add red background to distributor's inventory grid
            if (distributorGrid) {
                distributorGrid.classList.add('backlog-background');
            }
            
            if (step === 3) {
                // Step 3 only: Remove beers with animation
                setTimeout(() => {
                    step3RemoveBeers.forEach(beer => beer.classList.add('removing'));
                }, 500); // Delay for visual effect
            }
        } else {
            // Steps 0-2: Reset beer visibility and hide backlog elements
            step3RemoveBeers.forEach(beer => beer.classList.remove('removing'));
            step3ShowElements.forEach(element => element.classList.remove('show-step3'));
            
            // Remove red background from distributor's inventory grid
            if (distributorGrid) {
                distributorGrid.classList.remove('backlog-background');
            }
        }
        
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
        if (explanationPanel) {
            explanationPanel.style.display = 'none';
        }
    }
    
    // Show explanation panel
    function showExplanation() {
        if (explanationPanel) {
            explanationPanel.style.display = 'flex';
        }
    }

    // Handle scroll events
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;
        const sectionTop = mechanicsSection.offsetTop;
        const sectionHeight = mechanicsSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Check if we're in the mechanics section
        if (scrollTop >= sectionTop - viewportHeight / 2 && 
            scrollTop < sectionTop + sectionHeight - viewportHeight / 2) {
            
            // Show the explanation panel when entering the section
            showExplanation();
            
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
    
    // Initialize panel as hidden and ensure no beer animations
    hideExplanation();
    
    // Ensure beer icons start without animation
    const beerIcons = document.querySelectorAll('#beer-game-mechanics-section .beer-icon');
    beerIcons.forEach(icon => icon.classList.remove('animate'));
    
    // Ensure arriving beer starts hidden
    const arrivingBeers = document.querySelectorAll('#beer-game-mechanics-section .arriving-beer');
    arrivingBeers.forEach(beer => beer.classList.remove('highlight', 'permanent', 'removing'));
    
    // Ensure order boxes start hidden
    const orderBoxes = document.querySelectorAll('#beer-game-mechanics-section .order-box');
    orderBoxes.forEach(box => box.classList.remove('order-show'));
    
    // Ensure status icons start hidden
    const statusIcons = document.querySelectorAll('#beer-game-mechanics-section .status-icon');
    statusIcons.forEach(icon => icon.classList.remove('status-show'));
    
    // Ensure step3 elements start hidden
    const step3ShowElements = document.querySelectorAll('#beer-game-mechanics-section .step3-show');
    step3ShowElements.forEach(element => element.classList.remove('show-step3'));
    
    // Ensure step3 remove beers start without removing animation
    const step3RemoveBeers = document.querySelectorAll('#beer-game-mechanics-section .step3-remove');
    step3RemoveBeers.forEach(beer => beer.classList.remove('removing'));
    
    // Ensure distributor grid starts without backlog background
    const distributorGrid = document.querySelector('#distributor-node .inventory-grid');
    if (distributorGrid) {
        distributorGrid.classList.remove('backlog-background');
    }
    
    // Ensure order question marks start hidden and numbers are visible
    const orderNumbers = document.querySelectorAll('#beer-game-mechanics-section .order-number');
    const orderQuestions = document.querySelectorAll('#beer-game-mechanics-section .order-question');
    orderNumbers.forEach(num => num.classList.remove('step4-hide'));
    orderQuestions.forEach(q => q.classList.remove('show-step4'));
    
    // Initialize with Step 0 state to ensure arriving beer is hidden initially
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

// AIQ Section Content Switching
function initAIQContentSwitching() {
    const scrollContainer = document.querySelector('main');
    const aiqSection = document.getElementById('aiq-section');
    const descriptionContent = document.getElementById('aiq-description');
    const bulletsContent = document.getElementById('aiq-bullets-content');
    
    if (!scrollContainer || !aiqSection) return;
    
    let currentContent = 'description';
    
    function updateAIQContent() {
        const rect = aiqSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within the section
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));
        
        // Switch content when user scrolls halfway through the section
        const shouldShowBullets = scrollProgress > 0.5;
        
        if (shouldShowBullets && currentContent === 'description') {
            currentContent = 'bullets';
            descriptionContent.classList.remove('active');
            bulletsContent.classList.add('active');
        } else if (!shouldShowBullets && currentContent === 'bullets') {
            currentContent = 'description';
            bulletsContent.classList.remove('active');
            descriptionContent.classList.add('active');
        }
    }
    
    // Listen for scroll events
    scrollContainer.addEventListener('scroll', updateAIQContent);
    window.addEventListener('resize', updateAIQContent);
    
    // Initial state
    updateAIQContent();
}

// Utility function for smooth scrolling (optional enhancement)
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}