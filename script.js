// TV Sales Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initDashboard();
});

function initDashboard() {
    // Period Selector
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            console.log('Period changed to:', this.value);
            updateDashboardData(this.value);
        });
    }
    
    // Notification Button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            const badge = this.querySelector('.notification-badge');
            if (badge && badge.textContent !== '0') {
                badge.textContent = '0';
                badge.style.backgroundColor = '#6b7280';
                alert('Notifications cleared!');
            }
        });
    }
    
    // Client Row Click Handlers
    const clientRows = document.querySelectorAll('.client-row');
    clientRows.forEach(row => {
        row.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client');
            toggleClientDetails(clientId);
        });
    });
    
    // Task and Deal Item Hover Effects
    const interactiveItems = document.querySelectorAll('.task-item, .deal-item');
    interactiveItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // File Attachment Click Handler
    const fileAttachments = document.querySelectorAll('.file-attachment');
    fileAttachments.forEach(attachment => {
        attachment.addEventListener('click', function() {
            const fileName = this.querySelector('.file-name').textContent;
            alert(`Would download file: ${fileName}`);
        });
    });
    
    // Initialize enhanced bar charts
    initEnhancedBarCharts();
    
    // Initialize with some sample interactions
    simulateRealTimeUpdates();
    
    // Peer item click handlers
    const peerItems = document.querySelectorAll('.peer-item:not(.current-user)');
    peerItems.forEach(item => {
        item.addEventListener('click', function() {
            const peerName = this.querySelector('.peer-name').textContent;
            const contribution = this.querySelector('.contribution-text').textContent;
            showToast(`${peerName}: ${contribution} achievement`);
        });
    });
}

// Enhanced Bar Chart Data
const clientData = [
    { name: 'Star Brands Ltd', target: 600000, achieved: 520000, percentage: 86.7, color: '#10b981', category: 'high' },
    { name: 'MediaCorp India', target: 500000, achieved: 450000, percentage: 90.0, color: '#3b82f6', category: 'high' },
    { name: 'Premier Foods', target: 450000, achieved: 380000, percentage: 84.4, color: '#8b5cf6', category: 'medium' },
    { name: 'AutoMax Group', target: 350000, achieved: 310000, percentage: 88.6, color: '#f59e0b', category: 'high' },
    { name: 'HealthFirst Pharma', target: 300000, achieved: 220000, percentage: 73.3, color: '#ef4444', category: 'low' }
];

const productData = [
    { name: 'FCT', target: 1200000, achieved: 950000, percentage: 79.2, color: '#3b82f6', category: 'medium' },
    { name: 'Sponsorship', target: 800000, achieved: 625000, percentage: 78.1, color: '#8b5cf6', category: 'medium' },
    { name: 'LBAN', target: 500000, achieved: 300000, percentage: 60.0, color: '#10b981', category: 'low' }
];

const monthData = [
    { name: 'January', target: 850000, achieved: 675000, percentage: 79.4, color: '#3b82f6', category: 'medium' },
    { name: 'February', target: 900000, achieved: 792000, percentage: 88.0, color: '#10b981', category: 'high' },
    { name: 'March', target: 750000, achieved: 613000, percentage: 81.7, color: '#8b5cf6', category: 'high' }
];

// Global variables for chart state
let currentChartView = 'bars';
let currentFilter = 'all';
let currentSort = 'achievement';

function initEnhancedBarCharts() {
    renderClientChart();
    renderProductChart();
    renderMonthChart();
    initChartControls();
    initChartInteractions();
}

function renderClientChart() {
    const chartMain = document.getElementById('client-chart-main');
    const xAxis = document.getElementById('client-x-axis');
    const insights = document.querySelector('#client-insights .insight-list');
    
    if (!chartMain || !xAxis || !insights) return;
    
    chartMain.innerHTML = '';
    xAxis.innerHTML = '';
    insights.innerHTML = '';
    
    // Sort data based on current selection
    const sortedData = sortChartData([...clientData], currentSort);
    
    // Apply filter
    const filteredData = applyChartFilterToData(sortedData, currentFilter);
    
    const maxValue = Math.max(...filteredData.map(item => item.target)) || 1;
    
    // Update totals
    updateChartTotals(filteredData);
    
    filteredData.forEach((client, index) => {
        // Create bar group
        const barGroup = createBarGroup(client, maxValue, 'client');
        chartMain.appendChild(barGroup);
        
        // Create x-axis label
        const xLabel = document.createElement('div');
        xLabel.className = 'x-label';
        xLabel.textContent = client.name;
        xLabel.setAttribute('data-client', client.name);
        xLabel.setAttribute('data-category', client.category);
        xAxis.appendChild(xLabel);
        
        // Add click event to x-axis label
        xLabel.addEventListener('click', () => {
            highlightClient(client.name);
            showClientDetails(client);
        });
        
        // Add double-click for quick actions
        xLabel.addEventListener('dblclick', () => {
            quickActionPopup(client);
        });
    });
    
    // Update insights
    updateClientInsights(filteredData);
    updateSummaryCards(filteredData);
    
    // Apply current view style
    applyChartViewStyle();
}

function renderProductChart() {
    const chartMain = document.getElementById('product-chart-main');
    const xAxis = document.getElementById('product-x-axis');
    const insights = document.querySelector('#product-insights .insight-list');
    
    if (!chartMain || !xAxis || !insights) return;
    
    chartMain.innerHTML = '';
    xAxis.innerHTML = '';
    insights.innerHTML = '';
    
    const sortedData = sortChartData([...productData], currentSort);
    const filteredData = applyChartFilterToData(sortedData, currentFilter);
    
    const maxValue = Math.max(...filteredData.map(item => item.target)) || 1;
    
    filteredData.forEach(product => {
        const barGroup = createBarGroup(product, maxValue, 'product');
        chartMain.appendChild(barGroup);
        
        const xLabel = document.createElement('div');
        xLabel.className = 'x-label';
        xLabel.textContent = product.name;
        xLabel.setAttribute('data-category', product.category);
        xAxis.appendChild(xLabel);
        
        xLabel.addEventListener('click', () => {
            showProductAnalysis(product);
        });
        
        xLabel.addEventListener('dblclick', () => {
            quickActionPopup(product);
        });
    });
    
    updateProductInsights(filteredData);
    applyChartViewStyle();
}

function renderMonthChart() {
    const chartMain = document.getElementById('month-chart-main');
    const xAxis = document.getElementById('month-x-axis');
    const insights = document.querySelector('#month-insights .insight-list');
    
    if (!chartMain || !xAxis || !insights) return;
    
    chartMain.innerHTML = '';
    xAxis.innerHTML = '';
    insights.innerHTML = '';
    
    const sortedData = sortChartData([...monthData], currentSort);
    const filteredData = applyChartFilterToData(sortedData, currentFilter);
    
    const maxValue = Math.max(...filteredData.map(item => item.target)) || 1;
    
    filteredData.forEach(month => {
        const barGroup = createBarGroup(month, maxValue, 'month');
        chartMain.appendChild(barGroup);
        
        const xLabel = document.createElement('div');
        xLabel.className = 'x-label';
        xLabel.textContent = month.name;
        xLabel.setAttribute('data-category', month.category);
        xAxis.appendChild(xLabel);
        
        xLabel.addEventListener('click', () => {
            showMonthAnalysis(month);
        });
    });
    
    updateMonthInsights(filteredData);
    applyChartViewStyle();
}

function createBarGroup(item, maxValue, type) {
    const barGroup = document.createElement('div');
    barGroup.className = 'bar-group';
    barGroup.setAttribute('data-item', item.name);
    barGroup.setAttribute('data-type', type);
    barGroup.setAttribute('data-category', item.category);
    
    // Calculate bar heights
    const targetHeight = Math.max((item.target / maxValue) * 100, 2);
    const achievedHeight = Math.max((item.achieved / maxValue) * 100, 2);
    
    // Create bar container
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';
    
    // Target bar
    const targetBar = document.createElement('div');
    targetBar.className = 'bar target';
    targetBar.style.height = `${targetHeight}%`;
    targetBar.setAttribute('data-value', formatCurrency(item.target));
    targetBar.setAttribute('data-type', 'target');
    targetBar.setAttribute('data-name', item.name);
    
    const targetValue = document.createElement('div');
    targetValue.className = 'bar-value';
    targetValue.textContent = formatCurrency(item.target);
    targetBar.appendChild(targetValue);
    
    // Achieved bar
    const achievedBar = document.createElement('div');
    achievedBar.className = 'bar achieved';
    achievedBar.style.height = `${achievedHeight}%`;
    achievedBar.style.backgroundColor = item.color;
    achievedBar.setAttribute('data-value', formatCurrency(item.achieved));
    achievedBar.setAttribute('data-type', 'achieved');
    achievedBar.setAttribute('data-name', item.name);
    
    const achievedValue = document.createElement('div');
    achievedValue.className = 'bar-value';
    achievedValue.textContent = formatCurrency(item.achieved);
    achievedBar.appendChild(achievedValue);
    
    // Percentage label with category-based styling
    const percentageLabel = document.createElement('div');
    percentageLabel.className = `percentage-label ${item.category}`;
    percentageLabel.textContent = `${item.percentage.toFixed(1)}%`;
    percentageLabel.setAttribute('data-percentage', item.percentage);
    
    barContainer.appendChild(targetBar);
    barContainer.appendChild(achievedBar);
    barContainer.appendChild(percentageLabel);
    
    // Bar group label
    const barLabel = document.createElement('div');
    barLabel.className = 'bar-label';
    barLabel.textContent = item.name;
    
    barGroup.appendChild(barContainer);
    barGroup.appendChild(barLabel);
    
    // Add hover events
    [targetBar, achievedBar].forEach(bar => {
        bar.addEventListener('mouseenter', function(e) {
            const name = this.getAttribute('data-name');
            const value = this.getAttribute('data-value');
            const type = this.getAttribute('data-type');
            const itemData = getItemData(name, type);
            
            if (itemData) {
                showEnhancedTooltip(e, {
                    name: name,
                    type: type === 'target' ? 'Target' : 'Achieved',
                    value: value,
                    percentage: itemData.percentage.toFixed(1) + '%',
                    category: itemData.category,
                    color: itemData.color
                });
            }
            
            // Add glow effect
            this.style.filter = 'brightness(1.2)';
            this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        });
        
        bar.addEventListener('mouseleave', function() {
            hideEnhancedTooltip();
            this.style.filter = 'brightness(1)';
            this.style.boxShadow = 'none';
        });
        
        bar.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            const type = this.getAttribute('data-type');
            showDetailedPopup(name, type);
        });
    });
    
    // Bar group hover
    barGroup.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.zIndex = '100';
    });
    
    barGroup.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.zIndex = '1';
    });
    
    return barGroup;
}

function initChartControls() {
    console.log('Initializing chart controls...');
    
    // Toggle buttons (Client/Product/Month views)
    const toggleButtons = document.querySelectorAll('.chart-toggle .toggle-btn');
    const chartWrappers = document.querySelectorAll('.chart-wrapper');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            console.log('Switching to view:', view);
            
            // Update active button
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected chart
            chartWrappers.forEach(wrapper => {
                wrapper.classList.remove('active');
                wrapper.style.display = 'none';
            });
            
            const targetChart = document.getElementById(`${view}-chart`);
            if (targetChart) {
                targetChart.classList.add('active');
                targetChart.style.display = 'block';
            }
            
            // Re-render the chart with current filters/sort
            reRenderCurrentChart();
        });
    });
    
    // Sort control - FIXED
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        console.log('Sort select found');
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            console.log('Sort changed to:', currentSort);
            reRenderCurrentChart();
            showToast(`Sorted by ${getSortLabel(currentSort)}`);
        });
    } else {
        console.log('Sort select NOT found');
    }
    
    // View toggle buttons (Bars/Stacked/Comparison) - FIXED
    const viewButtons = document.querySelectorAll('.view-toggle .view-btn');
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                currentChartView = view;
                
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                applyChartViewStyle();
                showToast(`View changed to ${view === 'bars' ? 'Standard Bars' : view === 'stacked' ? 'Stacked Bars' : 'Comparison View'}`);
            });
        });
    }
    
    // Legend filter - FIXED
    const legendItems = document.querySelectorAll('.chart-legend .legend-item[data-filter]');
    legendItems.forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            legendItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            reRenderCurrentChart();
            showToast(`Filtered: ${getFilterLabel(filter)}`);
        });
    });
    
    // Download button
    const downloadBtn = document.getElementById('download-chart');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadChartImage);
    }
}

function initChartInteractions() {
    // Create enhanced tooltip
    createEnhancedTooltip();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to sort
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const sortSelect = document.getElementById('sortBy');
            if (sortSelect) {
                sortSelect.focus();
                showToast('Press arrow keys to change sort option');
            }
        }
        
        // Escape to clear filters
        if (e.key === 'Escape') {
            clearAllFilters();
        }
    });
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', debounce(function() {
        reRenderCurrentChart();
    }, 250));
}

function updateChartTotals(data) {
    if (data.length === 0) {
        data = clientData; // Fallback to show something
    }
    
    const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
    const totalAchieved = data.reduce((sum, item) => sum + item.achieved, 0);
    const overallPercentage = totalTarget > 0 ? (totalAchieved / totalTarget * 100).toFixed(1) : 0;
    
    // Update display
    const totalTargetEl = document.getElementById('total-target');
    const totalAchievedEl = document.getElementById('total-achieved');
    const overallPercentageEl = document.getElementById('overall-percentage');
    
    if (totalTargetEl) totalTargetEl.textContent = formatCurrency(totalTarget);
    if (totalAchievedEl) totalAchievedEl.textContent = formatCurrency(totalAchieved);
    if (overallPercentageEl) {
        overallPercentageEl.textContent = `${overallPercentage}%`;
        overallPercentageEl.className = `stat-value ${overallPercentage >= 85 ? 'highlight' : overallPercentage >= 70 ? 'warning' : 'danger'}`;
    }
}

function updateClientInsights(data) {
    const insightsContainer = document.querySelector('#client-insights .insight-list');
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    if (data.length === 0) {
        const insightEl = document.createElement('div');
        insightEl.className = 'insight-item neutral';
        insightEl.innerHTML = '<div class="insight-title">No Data</div><div class="insight-text">No clients match the current filter</div>';
        insightsContainer.appendChild(insightEl);
        return;
    }
    
    // Find top performer
    const topPerformer = [...data].sort((a, b) => b.percentage - a.percentage)[0];
    
    // Find needs attention
    const needsAttention = [...data].sort((a, b) => a.percentage - b.percentage)[0];
    
    // Calculate average
    const average = data.reduce((sum, item) => sum + item.percentage, 0) / data.length;
    
    // Create insights
    const insights = [
        {
            title: 'Top Performer',
            text: `${topPerformer.name} is leading with ${topPerformer.percentage.toFixed(1)}% achievement`,
            type: 'success'
        },
        {
            title: 'Needs Attention',
            text: `${needsAttention.name} needs focus (${needsAttention.percentage.toFixed(1)}%)`,
            type: needsAttention.percentage < 70 ? 'warning' : 'neutral'
        },
        {
            title: data.length > 1 ? 'Average' : 'Performance',
            text: `${data.length > 1 ? 'Average achievement: ' : ''}${average.toFixed(1)}%`,
            type: 'neutral'
        }
    ];
    
    insights.forEach(insight => {
        const insightEl = document.createElement('div');
        insightEl.className = `insight-item ${insight.type}`;
        
        const titleEl = document.createElement('div');
        titleEl.className = 'insight-title';
        titleEl.textContent = insight.title;
        
        const textEl = document.createElement('div');
        textEl.className = 'insight-text';
        textEl.textContent = insight.text;
        
        insightEl.appendChild(titleEl);
        insightEl.appendChild(textEl);
        insightsContainer.appendChild(insightEl);
    });
}

function updateProductInsights(data) {
    const insightsContainer = document.querySelector('#product-insights .insight-list');
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    if (data.length === 0) {
        const insightEl = document.createElement('div');
        insightEl.className = 'insight-item neutral';
        insightEl.innerHTML = '<div class="insight-title">No Data</div><div class="insight-text">No products match the current filter</div>';
        insightsContainer.appendChild(insightEl);
        return;
    }
    
    data.forEach(product => {
        const insightEl = document.createElement('div');
        insightEl.className = `insight-item ${product.percentage >= 80 ? 'success' : product.percentage >= 70 ? 'warning' : 'danger'}`;
        
        const titleEl = document.createElement('div');
        titleEl.className = 'insight-title';
        titleEl.textContent = product.name;
        
        const textEl = document.createElement('div');
        textEl.className = 'insight-text';
        textEl.textContent = `${product.percentage.toFixed(1)}% achievement (${formatCurrency(product.achieved)} of ${formatCurrency(product.target)})`;
        
        insightEl.appendChild(titleEl);
        insightEl.appendChild(textEl);
        insightsContainer.appendChild(insightEl);
    });
}

function updateMonthInsights(data) {
    const insightsContainer = document.querySelector('#month-insights .insight-list');
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    if (data.length === 0) {
        const insightEl = document.createElement('div');
        insightEl.className = 'insight-item neutral';
        insightEl.innerHTML = '<div class="insight-title">No Data</div><div class="insight-text">No months match the current filter</div>';
        insightsContainer.appendChild(insightEl);
        return;
    }
    
    const insights = [
        {
            title: 'Growth Trend',
            text: data.length > 1 ? 'Performance analysis available' : 'Single month data',
            type: 'success'
        },
        {
            title: 'Best Month',
            text: data.length > 1 ? 
                `${[...data].sort((a, b) => b.percentage - a.percentage)[0].name} showed highest achievement` : 
                `${data[0].name}: ${data[0].percentage.toFixed(1)}%`,
            type: 'success'
        }
    ];
    
    insights.forEach(insight => {
        const insightEl = document.createElement('div');
        insightEl.className = `insight-item ${insight.type}`;
        
        const titleEl = document.createElement('div');
        titleEl.className = 'insight-title';
        titleEl.textContent = insight.title;
        
        const textEl = document.createElement('div');
        textEl.className = 'insight-text';
        textEl.textContent = insight.text;
        
        insightEl.appendChild(titleEl);
        insightEl.appendChild(textEl);
        insightsContainer.appendChild(insightEl);
    });
}

function updateSummaryCards(data) {
    if (data.length === 0) {
        data = clientData; // Fallback
    }
    
    // Find top performer
    const topPerformer = [...data].sort((a, b) => b.percentage - a.percentage)[0];
    
    // Find needs attention
    const needsAttention = [...data].sort((a, b) => a.percentage - b.percentage)[0];
    
    // Calculate trend (for demo)
    const trend = data.length > 1 ? '+8% vs last quarter' : 'Single data point';
    
    // Update cards
    const topPerformerEl = document.getElementById('top-performer');
    const needsAttentionEl = document.getElementById('needs-attention');
    const trendEl = document.getElementById('trend');
    
    if (topPerformerEl) {
        topPerformerEl.textContent = `${topPerformer.name} - ${topPerformer.percentage.toFixed(1)}%`;
    }
    
    if (needsAttentionEl) {
        needsAttentionEl.textContent = `${needsAttention.name} - ${needsAttention.percentage.toFixed(1)}%`;
    }
    
    if (trendEl) {
        trendEl.textContent = trend;
    }
}

function sortChartData(data, sortBy) {
    switch(sortBy) {
        case 'name':
            return [...data].sort((a, b) => a.name.localeCompare(b.name));
        case 'achievement':
            return [...data].sort((a, b) => b.percentage - a.percentage);
        case 'target':
            return [...data].sort((a, b) => b.target - a.target);
        case 'achieved':
            return [...data].sort((a, b) => b.achieved - a.achieved);
        default:
            return data;
    }
}

function applyChartFilterToData(data, filter) {
    if (filter === 'all') return data;
    
    return data.filter(item => {
        if (filter === 'high') return item.percentage >= 85;
        if (filter === 'medium') return item.percentage >= 70 && item.percentage < 85;
        if (filter === 'low') return item.percentage < 70;
        return true;
    });
}

function reRenderCurrentChart() {
    const activeChart = document.querySelector('.chart-wrapper.active');
    if (!activeChart) return;
    
    const chartId = activeChart.id;
    
    console.log('Re-rendering chart:', chartId, 'with sort:', currentSort, 'filter:', currentFilter);
    
    if (chartId === 'client-chart') {
        renderClientChart();
    } else if (chartId === 'product-chart') {
        renderProductChart();
    } else if (chartId === 'month-chart') {
        renderMonthChart();
    }
}

function applyChartViewStyle() {
    const activeChartMain = document.querySelector('.chart-wrapper.active .chart-main');
    if (!activeChartMain) return;
    
    // Remove all view classes
    activeChartMain.classList.remove('bars-view', 'stacked-view', 'comparison-view');
    
    // Add current view class
    activeChartMain.classList.add(`${currentChartView}-view`);
    
    // Update bar styles based on view
    const bars = activeChartMain.querySelectorAll('.bar-group');
    bars.forEach((bar, index) => {
        const barContainer = bar.querySelector('.bar-container');
        const targetBar = bar.querySelector('.bar.target');
        const achievedBar = bar.querySelector('.bar.achieved');
        
        switch(currentChartView) {
            case 'stacked':
                // Stacked view: achieved bar on top of target bar
                bar.style.width = '80px';
                if (barContainer) {
                    barContainer.style.gap = '0';
                    barContainer.style.flexDirection = 'column';
                    barContainer.style.alignItems = 'center';
                }
                if (achievedBar && targetBar) {
                    achievedBar.style.position = 'absolute';
                    achievedBar.style.bottom = '0';
                    achievedBar.style.width = '100%';
                    targetBar.style.width = '100%';
                }
                break;
                
            case 'comparison':
                // Comparison view: side by side with gap
                bar.style.width = '120px';
                if (barContainer) {
                    barContainer.style.gap = '12px';
                    barContainer.style.flexDirection = 'row';
                    barContainer.style.justifyContent = 'center';
                }
                if (achievedBar && targetBar) {
                    achievedBar.style.position = 'relative';
                    achievedBar.style.width = '40%';
                    targetBar.style.width = '40%';
                }
                break;
                
            default: // 'bars'
                // Standard bars view
                bar.style.width = '100px';
                if (barContainer) {
                    barContainer.style.gap = '8px';
                    barContainer.style.flexDirection = 'row';
                    barContainer.style.justifyContent = 'center';
                }
                if (achievedBar && targetBar) {
                    achievedBar.style.position = 'relative';
                    achievedBar.style.width = '32px';
                    targetBar.style.width = '32px';
                }
                break;
        }
        
        // Add delay for animation effect
        bar.style.transitionDelay = `${index * 50}ms`;
    });
}

function highlightClient(clientName) {
    // Remove previous highlights
    document.querySelectorAll('.bar-group').forEach(bar => {
        bar.style.boxShadow = 'none';
        bar.style.border = 'none';
    });
    
    document.querySelectorAll('.x-label').forEach(label => {
        label.style.fontWeight = 'normal';
        label.style.color = '#6b7280';
        label.style.backgroundColor = 'transparent';
    });
    
    // Highlight selected client
    const targetBar = document.querySelector(`.bar-group[data-item="${clientName}"]`);
    const targetLabel = document.querySelector(`.x-label[data-client="${clientName}"]`);
    
    if (targetBar) {
        targetBar.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        targetBar.style.border = '2px solid #3b82f6';
        targetBar.style.borderRadius = '8px';
        targetBar.style.padding = '4px';
        targetBar.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
    
    if (targetLabel) {
        targetLabel.style.fontWeight = '700';
        targetLabel.style.color = '#3b82f6';
        targetLabel.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        targetLabel.style.borderRadius = '4px';
    }
}

function createEnhancedTooltip() {
    // Remove existing tooltip if any
    const existingTooltip = document.getElementById('enhanced-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'enhanced-tooltip';
    tooltip.id = 'enhanced-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #1f2937, #374151);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.875rem;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        border: 1px solid #4b5563;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        max-width: 240px;
        backdrop-filter: blur(10px);
        display: none;
    `;
    document.body.appendChild(tooltip);
}

function showEnhancedTooltip(event, data) {
    const tooltip = document.getElementById('enhanced-tooltip');
    if (!tooltip) return;
    
    let tooltipContent = '';
    
    if (data.name && data.type) {
        const categoryClass = data.category === 'high' ? 'success' : 
                             data.category === 'medium' ? 'warning' : 'danger';
        
        tooltipContent = `
            <div class="tooltip-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-weight: 600; font-size: 0.9rem; color: #93c5fd;">${data.name}</div>
                <div style="font-size: 0.75rem; padding: 2px 8px; background: ${data.color}; border-radius: 4px;">${data.type}</div>
            </div>
            <div class="tooltip-body">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #9ca3af;">Value:</span>
                    <span style="font-weight: 600;">${data.value}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #9ca3af;">Achievement:</span>
                    <span style="font-weight: 600; color: ${data.color}">${data.percentage}</span>
                </div>
            </div>
            <div class="tooltip-footer" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #4b5563; font-size: 0.7rem; color: #9ca3af;">
                Click for details • Double-click for quick action
            </div>
        `;
    }
    
    tooltip.innerHTML = tooltipContent;
    tooltip.style.display = 'block';
    
    // Position tooltip
    const x = event.clientX + 15;
    const y = event.clientY - 80;
    
    // Keep tooltip within viewport
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    if (x + tooltipRect.width > viewportWidth - 20) {
        adjustedX = x - tooltipRect.width - 30;
    }
    
    if (y + tooltipRect.height > viewportHeight - 20) {
        adjustedY = y - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${adjustedX}px`;
    tooltip.style.top = `${adjustedY}px`;
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function hideEnhancedTooltip() {
    const tooltip = document.getElementById('enhanced-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 200);
    }
}

function getItemData(name, type) {
    // Search in client data
    let item = clientData.find(item => item.name === name);
    if (item) return item;
    
    // Search in product data
    item = productData.find(item => item.name === name);
    if (item) return item;
    
    // Search in month data
    item = monthData.find(item => item.name === name);
    return item;
}

function showClientDetails(client) {
    showToast(`Client: ${client.name}\nTarget: ${formatCurrency(client.target)}\nAchieved: ${formatCurrency(client.achieved)}\nPercentage: ${client.percentage.toFixed(1)}%`);
}

function showProductAnalysis(product) {
    const analysis = `
        Product: ${product.name}
        Performance: ${product.percentage >= 80 ? 'Excellent' : product.percentage >= 70 ? 'Good' : 'Needs Improvement'}
        Recommendation: ${product.percentage < 75 ? 'Focus on upselling and promotions' : 'Maintain current strategy'}
    `;
    showToast(analysis);
}

function showMonthAnalysis(month) {
    showToast(`${month.name} Performance: ${month.percentage.toFixed(1)}%`);
}

function quickActionPopup(item) {
    const actions = `
        Quick Actions for ${item.name}:
        1. Schedule follow-up
        2. Send performance report
        3. Set up meeting
        4. Create action plan
    `;
    
    if (confirm(`${item.name} - ${item.percentage.toFixed(1)}%\n\nOpen quick actions menu?`)) {
        showToast(`Quick actions menu opened for ${item.name}`);
    }
}

function showDetailedPopup(name, type) {
    const item = getItemData(name, type);
    if (!item) return;
    
    const popup = document.createElement('div');
    popup.className = 'detailed-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        width: 400px;
        max-width: 90vw;
    `;
    
    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #111827;">${name}</h3>
            <button onclick="this.parentElement.parentElement.remove(); document.querySelector('.popup-overlay')?.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">×</button>
        </div>
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Target:</span>
                <span style="font-weight: 600;">${formatCurrency(item.target)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Achieved:</span>
                <span style="font-weight: 600; color: #10b981;">${formatCurrency(item.achieved)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="color: #6b7280;">Achievement:</span>
                <span style="font-weight: 700; color: ${item.percentage >= 85 ? '#10b981' : item.percentage >= 70 ? '#f59e0b' : '#ef4444'}">${item.percentage.toFixed(1)}%</span>
            </div>
            <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${item.percentage}%; background: ${item.color};"></div>
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <button onclick="showToast('Report generated for ${name}'); this.parentElement.parentElement.remove(); document.querySelector('.popup-overlay')?.remove()" style="flex: 1; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">Generate Report</button>
            <button onclick="showToast('Meeting scheduled for ${name}'); this.parentElement.parentElement.remove(); document.querySelector('.popup-overlay')?.remove()" style="flex: 1; padding: 8px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">Schedule Meeting</button>
            <button onclick="this.parentElement.parentElement.remove(); document.querySelector('.popup-overlay')?.remove()" style="flex: 1; padding: 8px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1999;
    `;
    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    document.body.appendChild(overlay);
}

function downloadChartImage() {
    const activeChart = document.querySelector('.chart-wrapper.active');
    if (!activeChart) return;
    
    showToast('Chart export started. This would generate a PNG image in a real application.');
    
    // Simulate download
    setTimeout(() => {
        showToast('Chart exported successfully!');
    }, 1500);
}

function clearAllFilters() {
    currentFilter = 'all';
    currentSort = 'achievement';
    currentChartView = 'bars';
    
    // Update UI
    const legendItems = document.querySelectorAll('.chart-legend .legend-item');
    legendItems.forEach(item => {
        if (item.getAttribute('data-filter') === 'all') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'achievement';
    
    const viewButtons = document.querySelectorAll('.view-toggle .view-btn');
    viewButtons.forEach(btn => {
        if (btn.getAttribute('data-view') === 'bars') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    reRenderCurrentChart();
    showToast('All filters cleared');
}

function getSortLabel(sortBy) {
    const labels = {
        'name': 'Name',
        'achievement': 'Achievement %',
        'target': 'Target Value',
        'achieved': 'Achieved Value'
    };
    return labels[sortBy] || sortBy;
}

function getFilterLabel(filter) {
    const labels = {
        'all': 'Show All',
        'high': 'High (>85%)',
        'medium': 'Medium (70-85%)',
        'low': 'Low (<70%)'
    };
    return labels[filter] || filter;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keep existing functions from original script below

function toggleClientDetails(clientId) {
    const detailsRow = document.getElementById(`client-details-${clientId}`);
    const arrow = document.querySelector(`.client-row[data-client="${clientId}"] .client-arrow`);
    
    if (!detailsRow || !arrow) return;
    
    // Close all other open client details first
    document.querySelectorAll('.client-details-row.visible').forEach(row => {
        if (row.id !== `client-details-${clientId}`) {
            row.classList.remove('visible');
            const otherClientId = row.id.replace('client-details-', '');
            const otherArrow = document.querySelector(`.client-row[data-client="${otherClientId}"] .client-arrow`);
            if (otherArrow) {
                otherArrow.classList.remove('rotated');
            }
        }
    });
    
    // Toggle the clicked client
    const isVisible = detailsRow.classList.contains('visible');
    
    if (isVisible) {
        detailsRow.classList.remove('visible');
        arrow.classList.remove('rotated');
    } else {
        detailsRow.classList.add('visible');
        arrow.classList.add('rotated');
    }
}

function updateDashboardData(period) {
    console.log(`Fetching data for ${period}...`);
    
    // Update the period in the page title
    document.title = `TV Sales Dashboard - ${period}`;
    
    // Show a loading indicator
    const periodSelect = document.getElementById('periodSelect');
    const originalButtonText = periodSelect ? periodSelect.innerHTML : '';
    if (periodSelect) {
        periodSelect.disabled = true;
        periodSelect.innerHTML = '<option>Loading...</option>';
    }
    
    // Simulate API call delay
    setTimeout(() => {
        // Update KPI values based on period (simulated)
        const kpiValues = document.querySelectorAll('.kpi-value');
        
        if (period === 'Q2 2026') {
            if (kpiValues.length >= 5) {
                kpiValues[0].textContent = '₹28,00,000';
                kpiValues[1].textContent = '₹0';
                kpiValues[2].textContent = '0.0%';
                kpiValues[3].textContent = '₹22,50,000';
                kpiValues[4].textContent = '₹28,00,000';
            }
        } else if (period === 'January 2026') {
            if (kpiValues.length >= 5) {
                kpiValues[0].textContent = '₹8,50,000';
                kpiValues[1].textContent = '₹6,75,000';
                kpiValues[2].textContent = '79.4%';
                kpiValues[3].textContent = '₹7,50,000';
                kpiValues[4].textContent = '₹1,75,000';
            }
        } else {
            // Reset to default (Q1 2026)
            if (kpiValues.length >= 5) {
                kpiValues[0].textContent = '₹25,00,000';
                kpiValues[1].textContent = '₹18,75,000';
                kpiValues[2].textContent = '75.0%';
                kpiValues[3].textContent = '₹21,50,000';
                kpiValues[4].textContent = '₹6,25,000';
            }
        }
        
        // Also update bar charts with new data
        updateBarChartData(period);
        
        // Restore the select dropdown
        if (periodSelect) {
            periodSelect.disabled = false;
            periodSelect.innerHTML = `
                <option value="Q1 2026">Q1 2026</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="January 2026">January 2026</option>
                <option value="February 2026">February 2026</option>
            `;
            periodSelect.value = period;
        }
        
        // Show a confirmation
        showToast(`Dashboard updated for ${period}`);
    }, 1000);
}

function updateBarChartData(period) {
    // Simulate different data for different periods
    let newClientData, newProductData, newMonthData;
    
    if (period === 'Q2 2026') {
        newClientData = [
            { name: 'Star Brands Ltd', target: 650000, achieved: 0, percentage: 0, color: '#10b981', category: 'low' },
            { name: 'MediaCorp India', target: 550000, achieved: 0, percentage: 0, color: '#3b82f6', category: 'low' },
            { name: 'Premier Foods', target: 500000, achieved: 0, percentage: 0, color: '#8b5cf6', category: 'low' },
            { name: 'AutoMax Group', target: 400000, achieved: 0, percentage: 0, color: '#f59e0b', category: 'low' },
            { name: 'HealthFirst Pharma', target: 350000, achieved: 0, percentage: 0, color: '#ef4444', category: 'low' }
        ];
        
        newProductData = [
            { name: 'FCT', target: 1300000, achieved: 0, percentage: 0, color: '#3b82f6', category: 'low' },
            { name: 'Sponsorship', target: 900000, achieved: 0, percentage: 0, color: '#8b5cf6', category: 'low' },
            { name: 'LBAN', target: 600000, achieved: 0, percentage: 0, color: '#10b981', category: 'low' }
        ];
        
        newMonthData = [
            { name: 'April', target: 900000, achieved: 0, percentage: 0, color: '#3b82f6', category: 'low' },
            { name: 'May', target: 950000, achieved: 0, percentage: 0, color: '#10b981', category: 'low' },
            { name: 'June', target: 950000, achieved: 0, percentage: 0, color: '#8b5cf6', category: 'low' }
        ];
    } else if (period === 'January 2026') {
        newClientData = [
            { name: 'Star Brands Ltd', target: 200000, achieved: 175000, percentage: 87.5, color: '#10b981', category: 'high' },
            { name: 'MediaCorp India', target: 180000, achieved: 162000, percentage: 90.0, color: '#3b82f6', category: 'high' },
            { name: 'Premier Foods', target: 150000, achieved: 120000, percentage: 80.0, color: '#8b5cf6', category: 'medium' },
            { name: 'AutoMax Group', target: 120000, achieved: 108000, percentage: 90.0, color: '#f59e0b', category: 'high' },
            { name: 'HealthFirst Pharma', target: 100000, achieved: 70000, percentage: 70.0, color: '#ef4444', category: 'low' }
        ];
        
        newProductData = [
            { name: 'FCT', target: 400000, achieved: 320000, percentage: 80.0, color: '#3b82f6', category: 'medium' },
            { name: 'Sponsorship', target: 300000, achieved: 225000, percentage: 75.0, color: '#8b5cf6', category: 'medium' },
            { name: 'LBAN', target: 200000, achieved: 120000, percentage: 60.0, color: '#10b981', category: 'low' }
        ];
        
        newMonthData = [
            { name: 'January', target: 850000, achieved: 675000, percentage: 79.4, color: '#3b82f6', category: 'medium' }
        ];
    } else {
        // Default to original data
        newClientData = clientData;
        newProductData = productData;
        newMonthData = monthData;
    }
    
    // Update the global data arrays
    clientData.length = 0;
    clientData.push(...newClientData);
    
    productData.length = 0;
    productData.push(...newProductData);
    
    monthData.length = 0;
    monthData.push(...newMonthData);
    
    // Re-render charts
    reRenderCurrentChart();
    showToast(`Data updated for ${period}`);
}

function simulateRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Randomly update notification count
        const badge = document.querySelector('.notification-badge');
        if (badge && Math.random() > 0.7) {
            const currentCount = parseInt(badge.textContent);
            const newCount = currentCount + 1;
            badge.textContent = newCount;
            badge.style.backgroundColor = '#ef4444';
            
            if (newCount === 1) {
                showToast('New notification received');
            }
        }
        
        // Randomly update a bar chart value (for demo purposes)
        if (Math.random() > 0.8 && clientData.length > 0) {
            const randomIndex = Math.floor(Math.random() * clientData.length);
            const randomClient = clientData[randomIndex];
            
            // Add a small random amount to achievement
            const increment = Math.floor(Math.random() * 50000);
            randomClient.achieved += increment;
            randomClient.percentage = (randomClient.achieved / randomClient.target * 100);
            randomClient.category = randomClient.percentage >= 85 ? 'high' : 
                                   randomClient.percentage >= 70 ? 'medium' : 'low';
            
            // Re-render client chart if it's active
            if (document.querySelector('#client-chart.active')) {
                reRenderCurrentChart();
                showToast(`Update: ${randomClient.name} achieved ₹${increment.toLocaleString()}`);
            }
        }
    }, 30000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(value);
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1f2937, #374151);
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        border-left: 4px solid #3b82f6;
        max-width: 300px;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

// Export functions for potential module use
window.dashboardFunctions = {
    toggleClientDetails,
    formatCurrency,
    updateDashboardData,
    renderClientChart,
    renderProductChart,
    renderMonthChart
};