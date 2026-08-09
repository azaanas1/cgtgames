// =================================================================
// 📊 STANDALONE TELEMETRY & RENDERING ENGINE FOR ANALYTICS.HTML
// =================================================================

// 1. Session Initialization Benchmarks
if (!window.sessionStartTime) {
    window.sessionStartTime = Date.now();
}

// Global data array to hold the history points for our custom timeline chart
const productionHistory = new Array(30).fill(0); 

// 2. Local State Tracker Utility
function getHydratedState() {
    return {
        count: parseFloat(localStorage.getItem('game_clicks') || '0'),
        activeUser: localStorage.getItem('game_user') || 'Guest',
        
        // Read active upgrade levels to accurately reconstruct passive yield
        autoClickerLvl: parseInt(localStorage.getItem('lvl_autoClicker') || '0'),
        quantumChipLvl: parseInt(localStorage.getItem('lvl_quantumChip') || '0'),
        prestigeMult: parseFloat(localStorage.getItem('prestige_mult') || '1.0')
    };
}

// 3. Independent Passive Yield Calculation Engine
function calculatePassiveProductionRate(state) {
    let basePassiveRate = 0;
    basePassiveRate += state.autoClickerLvl * 1;
    basePassiveRate += state.quantumChipLvl * 5;
    
    return basePassiveRate * state.prestigeMult;
}

// 4. Custom Lightweight Canvas Graph Drawer Engine
function drawPerformanceChart(currentRate) {
    const canvas = document.getElementById('performance-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 🔥 FIXED: Force internal canvas resolution to match its displayed layout boxes
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 140;

    const width = canvas.width;
    const height = canvas.height;

    // Scroll data to the left and push the latest value to history track array
    productionHistory.shift();
    productionHistory.push(currentRate);

    // Canvas Background Clean
    ctx.clearRect(0, 0, width, height);

    // Compute relative vertical grid constraint dynamically based on peak item spikes
    const maxVal = Math.max(...productionHistory, 10); 
    const padding = 20;
    const graphHeight = height - padding * 2;
    const graphWidth = width;

    // Build the structural gradient fill for style consistency
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)'); // Light Sky Blue semi-opaque tint
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    // Begin Rendering Vector Path Lines
    ctx.beginPath();
    for (let i = 0; i < productionHistory.length; i++) {
        const x = (i / (productionHistory.length - 1)) * graphWidth;
        const y = height - padding - ((productionHistory[i] / maxVal) * graphHeight);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    // Draw bottom fill shape layer below vector peaks
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Re-draw stroke accent outline highlight
    ctx.beginPath();
    for (let i = 0; i < productionHistory.length; i++) {
        const x = (i / (productionHistory.length - 1)) * graphWidth;
        const y = height - padding - ((productionHistory[i] / maxVal) * graphHeight);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#0284c7'; // Vivid deep blue accent stroke line 
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 5. Primary UI Presentation Field Sync Hook
function renderAnalyticsDashboard() {
    const state = getHydratedState();
    const passiveRate = calculatePassiveProductionRate(state);

    // Card 1: Session Balance Layout Update
    const totalClicksEl = document.getElementById('stats-total-clicks');
    if (totalClicksEl) {
        totalClicksEl.textContent = Math.floor(state.count).toLocaleString();
    }

    // Card 2: Passive Production Rate Output Display
    const autoRateEl = document.getElementById('stats-auto-rate');
    const progressBarEl = document.getElementById('stats-progress-bar');
    if (autoRateEl) {
        autoRateEl.textContent = `${passiveRate.toFixed(1)}/sec`;
        if (progressBarEl) {
            progressBarEl.style.width = passiveRate > 0 ? '100%' : '0%';
        }
    }

    // Card 4: Subsystem Analytics List Node Dynamic Mapping
    const statsUserEl = document.getElementById('stats-username');
    if (statsUserEl) {
        statsUserEl.textContent = state.activeUser;
    }

    const manualClicksEl = document.getElementById('stats-manual-clicks');
    if (manualClicksEl) {
        manualClicksEl.textContent = Math.floor(state.count).toLocaleString();
    }

    const critRatioEl = document.getElementById('stats-crit-ratio');
    if (critRatioEl) {
        critRatioEl.textContent = "15.0%"; 
    }

    // Dynamic Server Uptime Telemetry String Generator
    const uptimeEl = document.getElementById('stats-uptime');
    if (uptimeEl) {
        const totalSeconds = Math.floor((Date.now() - window.sessionStartTime) / 1000);
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        uptimeEl.textContent = `${mins}:${secs}`;
    }
}

// 6. Smooth Background Resource Production Loop (100ms Interval)
setInterval(() => {
    const state = getHydratedState();
    const passiveRate = calculatePassiveProductionRate(state);
    
    if (passiveRate > 0) {
        const newCount = state.count + (passiveRate / 10);
        localStorage.setItem('game_clicks', newCount.toString());
        renderAnalyticsDashboard();
    }
}, 100);

// 7. Graph Timeline Matrix Tick Counter (1000ms Interval)
setInterval(() => {
    const state = getHydratedState();
    const passiveRate = calculatePassiveProductionRate(state);
    drawPerformanceChart(passiveRate);
}, 1000);

// 8. Runtime Lifecycle Engine Setup Hooks
document.addEventListener('DOMContentLoaded', () => {
    const initialState = getHydratedState();
    const initialRate = calculatePassiveProductionRate(initialState);
    
    // Prime visualization panels immediately on structural assembly mount
    renderAnalyticsDashboard();
    drawPerformanceChart(initialRate);
    
    // Cross-tab data change hook
    window.addEventListener('storage', () => {
        renderAnalyticsDashboard();
    });
});
