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

// Wait for Chart.js and DOM to load
window.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load');
        return;
    }
    initializeDashboard();
});

function initializeDashboard() {
    Chart.defaults.color = '#A0A0A0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";

    createResidualChart();
    createBreakdownChart();
    createSparklines();
    
    console.log('%c DataPrecedence Dashboard Ready ', 'background: #D4AF37; color: #0A0A0A; font-weight: bold; padding: 8px;');
}

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
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1A1A1A',
                        titleColor: '#FFFFFF',
                        bodyColor: '#A0A0A0',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += context.datasetIndex === 0 ? 
                                        '$' + context.parsed.y.toLocaleString() : 
                                        '$' + context.parsed.y + 'M';
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
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
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
                        grid: { drawOnChartArea: false },
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (error) {
        console.error('Error creating residual chart:', error);
    }
}

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
                    backgroundColor: ['rgba(212, 175, 55, 0.8)', 'rgba(244, 208, 63, 0.8)'],
                    borderColor: ['#D4AF37', '#F4D03F'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
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
                                if (label) label += ': ';
                                if (context.parsed !== null) {
                                    label += '$' + context.parsed.toLocaleString();
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    label += ' (' + percentage + '%)';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating breakdown chart:', error);
    }
}

function createSparklines() {
    const sparklineData = [
        { id: 'spark1', data: [720, 735, 745, 738, 750, 768, 754, 775, 790, 812, 801, 847] },
        { id: 'spark2', data: [1205, 1212, 1218, 1215, 1223, 1230, 1239, 1243, 1245, 1244, 1239, 1247] },
        { id: 'spark3', data: [598, 605, 612, 608, 615, 625, 652, 645, 658, 672, 652, 679] },
        { id: 'spark4', data: [95, 98, 101, 99, 104, 108, 108, 112, 116, 119, 108, 125] }
    ];

    sparklineData.forEach(({ id, data }) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        
        try {
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.map((_, i) => i),
                    datasets: [{
                        data: data,
                        borderColor: 'rgba(212, 175, 55, 1)',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: { x: { display: false }, y: { display: false } }
                }
            });
        } catch (error) {
            console.error(`Error creating sparkline ${id}:`, error);
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #D4AF37;
        color: #0A0A0A;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Multi-page content data
const pageContent = {
    payouts: () => `
        <div class="page-header">
            <h1 class="page-title">Payout History</h1>
            <p class="page-subtitle">All residual payments and transactions</p>
        </div>
        
        <div class="filters-bar">
            <select class="filter-select"><option>All Time</option><option>Last 30 Days</option></select>
            <select class="filter-select"><option>All Status</option><option>Completed</option><option>Pending</option></select>
            <input type="text" class="search-input" placeholder="Search transactions...">
        </div>
        
        <div class="kpi-grid" style="margin-top: 24px;">
            <div class="kpi-card"><div class="kpi-label">Total Paid YTD</div><div class="kpi-value">$847,293</div><div class="kpi-subtext">Across 12 payments</div></div>
            <div class="kpi-card"><div class="kpi-label">Next Payout</div><div class="kpi-value">$289,442</div><div class="kpi-subtext">Feb 15, 2026</div></div>
            <div class="kpi-card"><div class="kpi-label">Avg. Payout</div><div class="kpi-value">$70,608</div><div class="kpi-subtext">Per month</div></div>
            <div class="kpi-card"><div class="kpi-label">Pending Amount</div><div class="kpi-value">$42,180</div><div class="kpi-subtext">Processing</div></div>
        </div>
        
        <div class="table-card" style="margin-top: 32px;">
            <div class="table-header"><h3 class="table-title">Recent Payouts</h3><button class="table-action">Download CSV</button></div>
            <table class="data-table">
                <thead><tr><th>Date</th><th>Transaction ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Receipt</th></tr></thead>
                <tbody>
                    <tr><td>Jan 15, 2026</td><td><code class="mid-code">TXN-2026-0115</code></td><td><strong>$847,293.42</strong></td><td>ACH Transfer</td><td><span class="status-badge success">Completed</span></td><td><a href="#" class="action-link">View</a></td></tr>
                    <tr><td>Dec 15, 2025</td><td><code class="mid-code">TXN-2025-1215</code></td><td><strong>$754,120.18</strong></td><td>ACH Transfer</td><td><span class="status-badge success">Completed</span></td><td><a href="#" class="action-link">View</a></td></tr>
                    <tr><td>Nov 15, 2025</td><td><code class="mid-code">TXN-2025-1115</code></td><td><strong>$835,294.67</strong></td><td>ACH Transfer</td><td><span class="status-badge success">Completed</span></td><td><a href="#" class="action-link">View</a></td></tr>
                    <tr><td>Feb 15, 2026</td><td><code class="mid-code">TXN-2026-0215</code></td><td><strong>$289,442.00</strong></td><td>ACH Transfer</td><td><span class="status-badge pending">Scheduled</span></td><td><a href="#" class="action-link">--</a></td></tr>
                </tbody>
            </table>
        </div>
    `,
    
    merchants: () => `
        <div class="page-header">
            <h1 class="page-title">Merchant Portfolio</h1>
            <p class="page-subtitle">1,247 active merchants generating residuals</p>
        </div>
        
        <div class="filters-bar">
            <select class="filter-select"><option>All Merchants</option><option>High Volume (>$1M)</option></select>
            <select class="filter-select"><option>All Industries</option><option>Retail</option><option>Healthcare</option></select>
            <input type="text" class="search-input" placeholder="Search merchants...">
        </div>
        
        <div class="kpi-grid" style="margin-top: 24px;">
            <div class="kpi-card"><div class="kpi-label">Active Merchants</div><div class="kpi-value">1,247</div><div class="kpi-subtext">+8 this month</div></div>
            <div class="kpi-card"><div class="kpi-label">Total Volume</div><div class="kpi-value">$124.8M</div><div class="kpi-subtext">Monthly processing</div></div>
            <div class="kpi-card"><div class="kpi-label">Avg. Ticket Size</div><div class="kpi-value">$127.43</div><div class="kpi-subtext">Per transaction</div></div>
            <div class="kpi-card"><div class="kpi-label">Retention Rate</div><div class="kpi-value">97.6%</div><div class="kpi-subtext">Last 12 months</div></div>
        </div>
        
        <div class="table-card" style="margin-top: 32px;">
            <div class="table-header"><h3 class="table-title">All Merchants</h3><button class="table-action">Add Merchant</button></div>
            <table class="data-table">
                <thead><tr><th>Merchant</th><th>MID</th><th>Industry</th><th>Monthly Volume</th><th>Residual</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">AE</div><span>Apex Electronics</span></div></td><td><code class="mid-code">789456123</code></td><td>Retail</td><td><strong>$2.4M</strong></td><td><strong>$18,420</strong></td><td><span class="status-badge success">Active</span></td></tr>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">SM</div><span>Summit Medical</span></div></td><td><code class="mid-code">654321987</code></td><td>Healthcare</td><td><strong>$1.8M</strong></td><td><strong>$14,850</strong></td><td><span class="status-badge success">Active</span></td></tr>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">BH</div><span>Blue Horizon Retail</span></div></td><td><code class="mid-code">321987654</code></td><td>Retail</td><td><strong>$1.6M</strong></td><td><strong>$12,640</strong></td><td><span class="status-badge success">Active</span></td></tr>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">GF</div><span>GreenLeaf Pharmacy</span></div></td><td><code class="mid-code">147258369</code></td><td>Healthcare</td><td><strong>$1.4M</strong></td><td><strong>$11,480</strong></td><td><span class="status-badge success">Active</span></td></tr>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">PT</div><span>Prime Tech Solutions</span></div></td><td><code class="mid-code">963852741</code></td><td>Technology</td><td><strong>$1.2M</strong></td><td><strong>$9,840</strong></td><td><span class="status-badge success">Active</span></td></tr>
                    <tr><td><div class="merchant-cell"><div class="merchant-avatar">CC</div><span>Coastal Cafe Group</span></div></td><td><code class="mid-code">852963741</code></td><td>Restaurant</td><td><strong>$980K</strong></td><td><strong>$8,820</strong></td><td><span class="status-badge success">Active</span></td></tr>
                </tbody>
            </table>
        </div>
    `,
    
    analytics: () => `
        <div class="page-header">
            <h1 class="page-title">Analytics & Insights</h1>
            <p class="page-subtitle">Performance trends and business intelligence</p>
        </div>
        
        <div class="kpi-grid" style="margin-top: 24px;">
            <div class="kpi-card"><div class="kpi-label">Growth Rate</div><div class="kpi-value">+12.4%</div><div class="kpi-subtext">YoY residual growth</div></div>
            <div class="kpi-card"><div class="kpi-label">Chargeback Rate</div><div class="kpi-value">0.12%</div><div class="kpi-subtext">Industry avg: 0.47%</div></div>
            <div class="kpi-card"><div class="kpi-label">Customer Lifetime Value</div><div class="kpi-value">$127K</div><div class="kpi-subtext">Per merchant</div></div>
            <div class="kpi-card"><div class="kpi-label">Portfolio Health</div><div class="kpi-value">Excellent</div><div class="kpi-subtext">98.2 score</div></div>
        </div>
        
        <div class="charts-row" style="margin-top: 32px;">
            <div class="chart-card large">
                <div class="chart-header"><h3 class="chart-title">Industry Breakdown</h3></div>
                <div class="analytics-grid">
                    <div class="analytics-item"><div class="analytics-bar" style="width: 35%; background: #D4AF37;"></div><span class="analytics-label">Retail</span><span class="analytics-value">35%</span></div>
                    <div class="analytics-item"><div class="analytics-bar" style="width: 25%; background: #F4D03F;"></div><span class="analytics-label">Healthcare</span><span class="analytics-value">25%</span></div>
                    <div class="analytics-item"><div class="analytics-bar" style="width: 18%; background: #D4AF37;"></div><span class="analytics-label">Restaurants</span><span class="analytics-value">18%</span></div>
                    <div class="analytics-item"><div class="analytics-bar" style="width: 12%; background: #F4D03F;"></div><span class="analytics-label">E-commerce</span><span class="analytics-value">12%</span></div>
                    <div class="analytics-item"><div class="analytics-bar" style="width: 10%; background: #D4AF37;"></div><span class="analytics-label">Other</span><span class="analytics-value">10%</span></div>
                </div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">Key Metrics</h3></div>
                <div class="metrics-list">
                    <div class="metric-row"><span class="metric-name">Avg Transaction Size</span><span class="metric-stat">$127.43</span></div>
                    <div class="metric-row"><span class="metric-name">Transactions/Day</span><span class="metric-stat">34,892</span></div>
                    <div class="metric-row"><span class="metric-name">Peak Processing Hour</span><span class="metric-stat">2-3 PM</span></div>
                    <div class="metric-row"><span class="metric-name">Mobile Transactions</span><span class="metric-stat">42%</span></div>
                    <div class="metric-row"><span class="metric-name">Repeat Customer Rate</span><span class="metric-stat">67%</span></div>
                </div>
            </div>
        </div>
    `,
    
    reports: () => `
        <div class="page-header">
            <h1 class="page-title">Reports & Documents</h1>
            <p class="page-subtitle">Generate and download reports</p>
        </div>
        
        <div class="report-generator" style="margin-top: 32px;">
            <div class="chart-card">
                <h3 class="chart-title">Generate New Report</h3>
                <div class="form-grid">
                    <div class="form-group"><label>Report Type</label><select class="filter-select"><option>Month-End Summary</option><option>Merchant Performance</option></select></div>
                    <div class="form-group"><label>Date Range</label><select class="filter-select"><option>Last Month</option><option>Last Quarter</option></select></div>
                    <div class="form-group"><label>Format</label><select class="filter-select"><option>PDF</option><option>Excel (XLSX)</option></select></div>
                    <div class="form-group"><button class="download-report-btn">Generate Report</button></div>
                </div>
            </div>
        </div>
        
        <div class="table-card" style="margin-top: 32px;">
            <div class="table-header"><h3 class="table-title">Recent Reports</h3></div>
            <table class="data-table">
                <thead><tr><th>Report Name</th><th>Type</th><th>Date Range</th><th>Generated</th><th>Download</th></tr></thead>
                <tbody>
                    <tr><td><strong>January 2026 Month-End Report</strong></td><td>Summary</td><td>Jan 1-31, 2026</td><td>Jan 15, 2026</td><td><a href="#" class="action-link">PDF</a> | <a href="#" class="action-link">Excel</a></td></tr>
                    <tr><td><strong>Q4 2025 Portfolio Analysis</strong></td><td>Analytics</td><td>Oct-Dec 2025</td><td>Jan 5, 2026</td><td><a href="#" class="action-link">PDF</a> | <a href="#" class="action-link">Excel</a></td></tr>
                    <tr><td><strong>2025 Year-End Tax Summary</strong></td><td>Tax</td><td>Jan-Dec 2025</td><td>Jan 2, 2026</td><td><a href="#" class="action-link">PDF</a> | <a href="#" class="action-link">Excel</a></td></tr>
                </tbody>
            </table>
        </div>
    `,
    
    settings: () => `
        <div class="page-header">
            <h1 class="page-title">Account Settings</h1>
            <p class="page-subtitle">Manage your account and preferences</p>
        </div>
        
        <div class="settings-grid" style="margin-top: 32px;">
            <div class="chart-card">
                <h3 class="chart-title">Profile Information</h3>
                <div class="settings-form">
                    <div class="form-group"><label>Full Name</label><input type="text" class="filter-select" value="John Doe" readonly></div>
                    <div class="form-group"><label>Email Address</label><input type="email" class="filter-select" value="john.doe@isopartner.com" readonly></div>
                    <div class="form-group"><label>Phone Number</label><input type="tel" class="filter-select" value="+1 (555) 123-4567" readonly></div>
                    <div class="form-group"><label>ISO Partner ID</label><input type="text" class="filter-select" value="ISO-2024-0892" readonly></div>
                </div>
            </div>
            
            <div class="chart-card">
                <h3 class="chart-title">Notification Preferences</h3>
                <div class="settings-toggles">
                    <div class="setting-item"><div><div class="setting-name">Email Notifications</div><div class="setting-desc">Receive monthly reports via email</div></div><div class="toggle-switch active"></div></div>
                    <div class="setting-item"><div><div class="setting-name">Payout Alerts</div><div class="setting-desc">Get notified when payouts are processed</div></div><div class="toggle-switch active"></div></div>
                    <div class="setting-item"><div><div class="setting-name">Merchant Updates</div><div class="setting-desc">Alerts for new merchant additions</div></div><div class="toggle-switch"></div></div>
                </div>
            </div>
        </div>
        
        <div class="kpi-grid" style="margin-top: 32px;">
            <div class="kpi-card"><div class="kpi-label">Account Age</div><div class="kpi-value">4 Years</div><div class="kpi-subtext">Since Jan 2022</div></div>
            <div class="kpi-card"><div class="kpi-label">Last Login</div><div class="kpi-value">Today</div><div class="kpi-subtext">3:24 PM EST</div></div>
            <div class="kpi-card"><div class="kpi-label">Data Access</div><div class="kpi-value">Full</div><div class="kpi-subtext">Admin privileges</div></div>
            <div class="kpi-card"><div class="kpi-label">Security Score</div><div class="kpi-value">Excellent</div><div class="kpi-subtext">2FA Enabled</div></div>
        </div>
    `
};

// Navigation handler
function navigateToPage(pageName) {
    const mainContent = document.querySelector('.main-content');
    
    if (pageName === 'dashboard') {
        // Show dashboard content
        document.querySelectorAll('.header, .kpi-grid, .charts-row, .tables-row').forEach(el => {
            if (el) el.style.display = '';
        });
        
        // Remove dynamic content
        const dynamicContent = document.querySelector('.dynamic-page-content');
        if (dynamicContent) dynamicContent.remove();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Hide dashboard content
        document.querySelectorAll('.header, .kpi-grid, .charts-row, .tables-row').forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        // Remove previous dynamic content
        const oldDynamic = document.querySelector('.dynamic-page-content');
        if (oldDynamic) oldDynamic.remove();
        
        // Create new page content
        const pageContainer = document.createElement('div');
        pageContainer.className = 'dynamic-page-content';
        pageContainer.innerHTML = pageContent[pageName]();
        mainContent.appendChild(pageContainer);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showNotification(`Viewing ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`);
}

// Setup navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        const page = this.getAttribute('data-page');
        navigateToPage(page);
    });
});

document.documentElement.style.scrollBehavior = 'smooth';
