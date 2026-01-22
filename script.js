// Load pages module
const script = document.createElement("script");
script.src = "pages.js";
document.head.appendChild(script);

// Sample data for residual trends
const residualTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Total Residuals',
            data: [654000, 682000, 698000, 715000, 742000, 768000, 789000, 801000, 824000, 835000, 754000, 847000],
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            borderWidth: 2
        },
        {
            label: 'Processing Volume',
            data: [89, 92, 95, 98, 103, 107, 110, 113, 117, 120, 108, 125],
            borderColor: '#F4D03F',
            backgroundColor: 'rgba(244, 208, 63, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            borderWidth: 2,
            yAxisID: 'y1'
        }
    ]
};

// Wait for Chart.js to load
window.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load');
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.parentElement.innerHTML = '<p style="color: #A0A0A0; text-align: center; padding: 40px;">Charts failed to load. Please refresh the page.</p>';
        });
        return;
    }

    initializeDashboard();
});

function initializeDashboard() {
    // Chart configuration
    Chart.defaults.color = '#A0A0A0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";

    // Initialize all charts
    createResidualChart();
    createBreakdownChart();
    createSparklines();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('%c DataPrecedence Dashboard Ready ', 'background: #D4AF37; color: #0A0A0A; font-weight: bold; padding: 8px;');
}

// Residual Trends Chart
function createResidualChart() {
    const residualCtx = document.getElementById('residualChart');
    if (!residualCtx) return;
    
    try {
        new Chart(residualCtx, {
            type: 'line',
            data: residualTrendsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1A1A1A',
                        titleColor: '#FFFFFF',
                        bodyColor: '#A0A0A0',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    if (context.datasetIndex === 0) {
                                        label += '$' + context.parsed.y.toLocaleString();
                                    } else {
                                        label += '$' + context.parsed.y + 'M';
                                    }
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating residual chart:', error);
        residualCtx.parentElement.innerHTML = '<p style="color: #EF4444; text-align: center; padding: 40px;">Error loading chart</p>';
    }
}

// Revenue Breakdown Chart
function createBreakdownChart() {
    const breakdownCtx = document.getElementById('breakdownChart');
    if (!breakdownCtx) return;
    
    try {
        new Chart(breakdownCtx, {
            type: 'doughnut',
            data: {
                labels: ['Card Present', 'Card Not Present'],
                datasets: [{
                    data: [492847, 354446],
                    backgroundColor: [
                        'rgba(212, 175, 55, 0.8)',
                        'rgba(244, 208, 63, 0.8)'
                    ],
                    borderColor: [
                        '#D4AF37',
                        '#F4D03F'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1A1A1A',
                        titleColor: '#FFFFFF',
                        bodyColor: '#A0A0A0',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += '$' + context.parsed.toLocaleString();
                                }
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                label += ' (' + percentage + '%)';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating breakdown chart:', error);
        breakdownCtx.parentElement.innerHTML = '<p style="color: #EF4444; text-align: center; padding: 40px;">Error loading chart</p>';
    }
}

// Mini sparkline charts for KPI cards
function createSparkline(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    try {
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.1)'),
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    } catch (error) {
        console.error('Error creating sparkline:', canvasId, error);
    }
}

// Create all sparklines
function createSparklines() {
    createSparkline('spark1', [720, 735, 745, 738, 750, 768, 754, 775, 790, 812, 801, 847], 'rgba(212, 175, 55, 1)');
    createSparkline('spark2', [1205, 1212, 1218, 1215, 1223, 1230, 1239, 1243, 1245, 1244, 1239, 1247], 'rgba(212, 175, 55, 1)');
    createSparkline('spark3', [598, 605, 612, 608, 615, 625, 652, 645, 658, 672, 652, 679], 'rgba(212, 175, 55, 1)');
    createSparkline('spark4', [95, 98, 101, 99, 104, 108, 108, 112, 116, 119, 108, 125], 'rgba(212, 175, 55, 1)');
}

// Setup event listeners
function setupEventListeners() {
    // Export button functionality
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Show professional message
            showNotification('Export functionality will be available when connected to your backend API.');
        });
    }

    // Download report button functionality
    const downloadBtn = document.querySelector('.download-report-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            showNotification('Full month-end report download will be available in production.');
        });
    }

    // View all merchants button
    const tableAction = document.querySelector('.table-action');
    if (tableAction) {
        tableAction.addEventListener('click', function() {
            showNotification('Full merchant list view coming in production version.');
        });
    }

    // Period selector functionality
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Period changed to:', this.textContent);
        });
    });
}

// Professional notification system
function showNotification(message) {
    // Remove any existing notifications
    const existing = document.querySelector('.dashboard-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'dashboard-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: #1A1A1A;
        color: #FFFFFF;
        padding: 16px 24px;
        border-radius: 8px;
        border: 1px solid #D4AF37;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        const page = this.getAttribute('data-page');
        
        if (page === 'dashboard') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showNotification(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
        }
    });
});

// Add smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// Log ready
console.log('%c DataPrecedence Dashboard Ready ', 'background: #D4AF37; color: #0A0A0A; font-weight: bold; padding: 8px;');
console.log('Prototype v1.0 - Connect to APIs for real data');
