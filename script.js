"use strict";
// ==========================================================================
// 1. Core State Initialization (Sourced safely from Persistent LocalStorage)
// ==========================================================================
let count = parseInt(localStorage.getItem('game_clicks') || '0', 10);
let clickPower = parseInt(localStorage.getItem('click_power') || '1', 10);
let autoClickers = parseInt(localStorage.getItem('auto_clickers') || '0', 10);
let activeUser = localStorage.getItem('game_user') || 'Guest';
// ADVANCED MECHANICS: Scaled Shop Costs & Prestige Trackers
let superCost = parseInt(localStorage.getItem('cost_super') || '15', 10);
let autoCost = parseInt(localStorage.getItem('cost_auto') || '50', 10);
let prestigeMultiplier = parseFloat(localStorage.getItem('prestige_mult') || '1.0');
// ==========================================================================
// 2. Element Selectors Mapping (Type-Safe with Cast Assertions)
// ==========================================================================
const display = document.getElementById('counter-display');
const powerDisplay = document.getElementById('power-display');
const clickBtn = document.getElementById('my-btn');
const resetBtn = document.getElementById('reset-btn');
const welcomeBanner = document.getElementById('welcome-banner');
const superClickBtn = document.getElementById('buy-super-click');
const autoClickBtn = document.getElementById('buy-auto-click');
const superCostText = document.getElementById('super-cost-text');
const autoCostText = document.getElementById('auto-cost-text');
const badgeContainer = document.getElementById('achievement-badge');
const usernameInput = document.getElementById('username-input');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const cheatInput = document.getElementById('cheat-input');
const applyCheatBtn = document.getElementById('apply-cheat-btn');
const statsClicks = document.getElementById('stats-total-clicks');
const statsAutoRate = document.getElementById('stats-auto-rate');
const statsUser = document.getElementById('stats-username');
const statsProgBar = document.getElementById('stats-progress-bar');
const timeElement = document.getElementById('server-time');
// ==========================================================================
// 3. UI Sync Render Engine & Advanced Trackers
// ==========================================================================
function updateGameUI() {
    if (display)
        display.innerText = `Clicks: ${count}`;
    // UI Multiplier String Interpolation Display
    const passiveCalculation = autoClickers * prestigeMultiplier;
    if (powerDisplay) {
        powerDisplay.innerText = `Click Power: +${clickPower} | Passive Production: ${passiveCalculation.toFixed(1)}/sec (Mult: ${prestigeMultiplier}x)`;
    }
    if (welcomeBanner)
        welcomeBanner.innerText = `Welcome, ${activeUser}!`;
    // Update Shop Prices dynamically inside text slots
    if (superCostText)
        superCostText.innerText = superCost.toString();
    if (autoCostText)
        autoCostText.innerText = autoCost.toString();
    if (usernameInput && !usernameInput.matches(':focus')) {
        usernameInput.value = activeUser === 'Guest' ? '' : activeUser;
    }
    // Analytics Dashboard Elements Sync
    if (statsClicks)
        statsClicks.innerText = count.toString();
    if (statsAutoRate)
        statsAutoRate.innerText = `${passiveCalculation.toFixed(1)}/sec`;
    if (statsUser)
        statsUser.innerText = activeUser;
    if (statsProgBar) {
        const visualPercentage = Math.min((autoClickers / 50) * 100, 100);
        statsProgBar.style.width = `${visualPercentage}%`;
    }
    // Check achievement targets dynamically
    evaluateMilestoneBadges();
    // Shop Button State Controllers
    if (superClickBtn)
        superClickBtn.disabled = count < superCost;
    if (autoClickBtn)
        autoClickBtn.disabled = count < autoCost;
}
// Achievement / Prestige Milestones Evaluation System
function evaluateMilestoneBadges() {
    if (!badgeContainer)
        return;
    if (count >= 1000) {
        prestigeMultiplier = 1.5; // Unlocks 50% passive collection boost
        localStorage.setItem('prestige_mult', '1.5');
        badgeContainer.innerHTML = `🚀 <span style="color: #6366f1;">Silicon Valley Legend</span> (+50% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = '#e0e7ff';
    }
    else if (count >= 300) {
        prestigeMultiplier = 1.2; // Unlocks 20% passive collection boost
        localStorage.setItem('prestige_mult', '1.2');
        badgeContainer.innerHTML = `⚡ <span style="color: #10b981;">Clicking Amateur Pro</span> (+20% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = '#d1fae5';
    }
    else {
        prestigeMultiplier = 1.0;
        localStorage.setItem('prestige_mult', '1.0');
        badgeContainer.innerText = "🔒 Complete 300 clicks to unlock first badge!";
        badgeContainer.style.backgroundColor = '#f1f5f9';
    }
}
// Initial System Call
updateGameUI();
// ==========================================================================
// 4. Click Actions (With Random Critical Calculations)
// ==========================================================================
clickBtn?.addEventListener('click', () => {
    // MECHANIC: 15% Chance to trigger a Critical Hit (5x Multiplier)
    const rollingProbability = Math.random();
    let currentGain = clickPower;
    if (rollingProbability <= 0.15) {
        currentGain = clickPower * 5;
        // Brief styling pulse feedback to alert critical hits visually
        if (display) {
            display.style.color = '#ef4444';
            setTimeout(() => { if (display)
                display.style.color = ''; }, 180);
        }
    }
    count += currentGain;
    localStorage.setItem('game_clicks', count.toString());
    updateGameUI();
});
// ==========================================================================
// 5. Upgrade Shop Management (With Exponential Cost Scaling)
// ==========================================================================
superClickBtn?.addEventListener('click', () => {
    if (count >= superCost) {
        count -= superCost;
        clickPower += 2;
        // ADVANCED MATH: Cost scales exponentially by 35% with every single purchase
        superCost = Math.round(superCost * 1.35);
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('click_power', clickPower.toString());
        localStorage.setItem('cost_super', superCost.toString());
        updateGameUI();
    }
    else {
        alert("❌ Not enough clicks to purchase Super Clicker!");
    }
});
autoClickBtn?.addEventListener('click', () => {
    if (count >= autoCost) {
        count -= autoCost;
        autoClickers += 1;
        // ADVANCED MATH: Cost scales exponentially by 40% with every single purchase
        autoCost = Math.round(autoCost * 1.40);
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('auto_clickers', autoClickers.toString());
        localStorage.setItem('cost_auto', autoCost.toString());
        updateGameUI();
    }
    else {
        alert("❌ Not enough clicks to purchase Auto-Clicker!");
    }
});
// ==========================================================================
// 6. Preferences & Shared Utilities Panel
// ==========================================================================
usernameInput?.addEventListener('input', () => {
    activeUser = usernameInput.value.trim() || 'Guest';
    localStorage.setItem('game_user', activeUser);
    if (welcomeBanner)
        welcomeBanner.innerText = `Welcome, ${activeUser}!`;
});
applyCheatBtn?.addEventListener('click', () => {
    if (!cheatInput)
        return;
    const code = cheatInput.value.trim().toLowerCase();
    if (code === 'freeclicks') {
        count += 500;
        localStorage.setItem('game_clicks', count.toString());
        updateGameUI();
        cheatInput.value = '';
        alert('🎉 Cheat Activated! Added +500 clicks to your active balance!');
    }
    else {
        alert('❌ Invalid Developer Cheat Code!');
    }
});
// Background automation runtime thread
setInterval(() => {
    if (autoClickers > 0) {
        // Multiplies basic auto units by unlocked prestige badges
        count += (autoClickers * prestigeMultiplier);
        localStorage.setItem('game_clicks', Math.floor(count).toString());
        updateGameUI();
    }
}, 1000);
resetBtn?.addEventListener('click', () => {
    localStorage.clear();
    count = 0;
    clickPower = 1;
    autoClickers = 0;
    activeUser = 'Guest';
    superCost = 15;
    autoCost = 50;
    prestigeMultiplier = 1.0;
    updateGameUI();
    location.reload();
});
// Cross-tab synchronization event listener
window.addEventListener('storage', (e) => {
    if (e.key === 'game_clicks')
        count = parseInt(e.newValue || '0', 10);
    if (e.key === 'click_power')
        clickPower = parseInt(e.newValue || '1', 10);
    if (e.key === 'auto_clickers')
        autoClickers = parseInt(e.newValue || '0', 10);
    if (e.key === 'game_user')
        activeUser = e.newValue || 'Guest';
    if (e.key === 'cost_super')
        superCost = parseInt(e.newValue || '15', 10);
    if (e.key === 'cost_auto')
        autoCost = parseInt(e.newValue || '50', 10);
    if (e.key === 'prestige_mult')
        prestigeMultiplier = parseFloat(e.newValue || '1.0');
    updateGameUI();
});
// Theme persistance hook
const savedTheme = localStorage.getItem('app_theme');
if (savedTheme === 'dark') {
    document.body.style.backgroundColor = '#1e293b';
    if (themeToggleBtn)
        themeToggleBtn.innerText = "Toggle Theme ☀️";
}
themeToggleBtn?.addEventListener('click', () => {
    const isDark = localStorage.getItem('app_theme') === 'dark';
    if (isDark) {
        localStorage.setItem('app_theme', 'light');
        document.body.style.backgroundColor = '#f1f5f9';
        themeToggleBtn.innerText = "Toggle Theme 🌙";
    }
    else {
        localStorage.setItem('app_theme', 'dark');
        document.body.style.backgroundColor = '#1e293b';
        themeToggleBtn.innerText = "Toggle Theme ☀️";
    }
});
// Dynamic UI System Clock Interface
if (timeElement) {
    const renderClock = () => {
        const now = new Date();
        timeElement.textContent = `Server Time: ${now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        })}`;
    };
    renderClock();
    setInterval(renderClock, 1000);
}
// Add this right at the very bottom of your script.js file!
const prestigeBtn = document.getElementById('prestige-btn');

prestigeBtn?.addEventListener('click', () => {
    if (count >= 5000) {
        prestigeMultiplier += 1.0; 
        localStorage.setItem('prestige_mult', prestigeMultiplier.toString());
        
        // Reset balances back to baseline
        count = 0;
        clickPower = 1;
        autoClickers = 0;
        superCost = 15;
        autoCost = 50;

        localStorage.setItem('game_clicks', '0');
        localStorage.setItem('click_power', '1');
        localStorage.setItem('auto_clickers', '0');
        localStorage.setItem('cost_super', '15');
        localStorage.setItem('cost_auto', '50');

        alert('🌀 Timelines Shattered! You earned a permanent +1.0x Global Yield Multiplier!');
        updateGameUI();
    } else {
        alert('🔒 You need at least 5,000 Clicks to trigger a Quantum Prestige update!');
    }
});

// Passive generation tick loop
setInterval(() => {
    if (autoClickers > 0) {
        count += Math.round(autoClickers * prestigeMultiplier);
        localStorage.setItem('game_clicks', count.toString());
        updateGameUI();
    }
}, 1000);

