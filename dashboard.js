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

// Chart configuration
Chart.defaults.color = '#A0A0A0';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";

// Residual Trends Chart
const residualCtx = document.getElementById('residualChart');
if (residualCtx) {
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
}

// Revenue Breakdown Chart
const breakdownCtx = document.getElementById('breakdownChart');
if (breakdownCtx) {
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
}

// Mini sparkline charts for KPI cards
function createSparkline(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
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
}

// Create sparklines
createSparkline('spark1', [720, 735, 745, 738, 750, 768, 754, 775, 790, 812, 801, 847], 'rgba(212, 175, 55, 1)');
createSparkline('spark2', [1205, 1212, 1218, 1215, 1223, 1230, 1239, 1243, 1245, 1244, 1239, 1247], 'rgba(212, 175, 55, 1)');
createSparkline('spark3', [598, 605, 612, 608, 615, 625, 652, 645, 658, 672, 652, 679], 'rgba(212, 175, 55, 1)');
createSparkline('spark4', [95, 98, 101, 99, 104, 108, 108, 112, 116, 119, 108, 125], 'rgba(212, 175, 55, 1)');

// Export button functionality
document.querySelector('.export-btn')?.addEventListener('click', function() {
    alert('Export functionality will connect to your backend API to generate and download the full report.');
});

// Download report button functionality
document.querySelector('.download-report-btn')?.addEventListener('click', function() {
    alert('Full month-end report download will be available when connected to your data source.');
});

// View all merchants button
document.querySelector('.table-action')?.addEventListener('click', function() {
    alert('This will navigate to the full merchants list page in the production version.');
});

// Period selector functionality
document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // In production, this would trigger data refresh for the selected period
        console.log('Period changed to:', this.textContent);
    });
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Log ready message
console.log('%c DataPrecedence Dashboard Ready ', 'background: #D4AF37; color: #0A0A0A; font-weight: bold; padding: 8px;');
console.log('This is a prototype dashboard. Connect to your APIs to load real data.');
