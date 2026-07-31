"use strict";

// ==========================================================================
// 1. Core State Initialization (Sourced safely from Persistent LocalStorage)
// ==========================================================================
let count: number = parseInt(localStorage.getItem('game_clicks') || '0', 10);
let clickPower: number = parseInt(localStorage.getItem('click_power') || '1', 10);
let autoClickers: number = parseInt(localStorage.getItem('auto_clickers') || '0', 10);
let activeUser: string = localStorage.getItem('game_user') || 'Guest';

// ADVANCED MECHANICS: Scaled Shop Costs & Prestige Trackers
let superCost: number = parseInt(localStorage.getItem('cost_super') || '15', 10);
let autoCost: number = parseInt(localStorage.getItem('cost_auto') || '50', 10);
let prestigeMultiplier: number = parseFloat(localStorage.getItem('prestige_mult') || '1.0');

// ==========================================================================
// 2. Element Selectors Mapping (Type-Safe with Cast Assertions)
// ==========================================================================
const display = document.getElementById('counter-display') as HTMLHeadingElement | null;
const powerDisplay = document.getElementById('power-display') as HTMLParagraphElement | null;
const clickBtn = document.getElementById('my-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;
const welcomeBanner = document.getElementById('welcome-banner') as HTMLHeadingElement | null;

const superClickBtn = document.getElementById('buy-super-click') as HTMLButtonElement | null;
const autoClickBtn = document.getElementById('buy-auto-click') as HTMLButtonElement | null;
const superCostText = document.getElementById('super-cost-text') as HTMLSpanElement | null;
const autoCostText = document.getElementById('auto-cost-text') as HTMLSpanElement | null;
const badgeContainer = document.getElementById('achievement-badge') as HTMLDivElement | null;

const usernameInput = document.getElementById('username-input') as HTMLInputElement | null;
const themeToggleBtn = document.getElementById('theme-toggle-btn') as HTMLButtonElement | null;
const cheatInput = document.getElementById('cheat-input') as HTMLInputElement | null;
const applyCheatBtn = document.getElementById('apply-cheat-btn') as HTMLButtonElement | null;

const statsClicks = document.getElementById('stats-total-clicks') as HTMLDivElement | null;
const statsAutoRate = document.getElementById('stats-auto-rate') as HTMLDivElement | null;
const statsUser = document.getElementById('stats-username') as HTMLDivElement | null;
const statsProgBar = document.getElementById('stats-progress-bar') as HTMLDivElement | null;

const timeElement = document.getElementById('server-time') as HTMLParagraphElement | null;

// ==========================================================================
// 3. UI Sync Render Engine & Advanced Trackers
// ==========================================================================
function updateGameUI(): void {
    if (display) display.innerText = `Clicks: ${count}`;
    
    // UI Multiplier String Interpolation Display
    const passiveCalculation = autoClickers * prestigeMultiplier;
    if (powerDisplay) {
        powerDisplay.innerText = `Click Power: +${clickPower} | Passive Production: ${passiveCalculation.toFixed(1)}/sec (Mult: ${prestigeMultiplier}x)`;
    }
    if (welcomeBanner) welcomeBanner.innerText = `Welcome, ${activeUser}!`;
    
    // Update Shop Prices dynamically inside text slots
    if (superCostText) superCostText.innerText = superCost.toString();
    if (autoCostText) autoCostText.innerText = autoCost.toString();

    if (usernameInput && !usernameInput.matches(':focus')) {
        usernameInput.value = activeUser === 'Guest' ? '' : activeUser;
    }

    // Analytics Dashboard Elements Sync
    if (statsClicks) statsClicks.innerText = count.toString();
    if (statsAutoRate) statsAutoRate.innerText = `${passiveCalculation.toFixed(1)}/sec`;
    if (statsUser) statsUser.innerText = activeUser;
    if (statsProgBar) {
        const visualPercentage: number = Math.min((autoClickers / 50) * 100, 100);
        statsProgBar.style.width = `${visualPercentage}%`;
    }

    // Check achievement targets dynamically
    evaluateMilestoneBadges();

    // Shop Button State Controllers
    if (superClickBtn) superClickBtn.disabled = count < superCost;
    if (autoClickBtn) autoClickBtn.disabled = count < autoCost;
}

// Achievement / Prestige Milestones Evaluation System
function evaluateMilestoneBadges(): void {
    if (!badgeContainer) return;

    if (count >= 1000) {
        prestigeMultiplier = 1.5; // Unlocks 50% passive collection boost
        localStorage.setItem('prestige_mult', '1.5');
        badgeContainer.innerHTML = `🚀 <span style="color: #6366f1;">Silicon Valley Legend</span> (+50% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = '#e0e7ff';
    } else if (count >= 300) {
        prestigeMultiplier = 1.2; // Unlocks 20% passive collection boost
        localStorage.setItem('prestige_mult', '1.2');
        badgeContainer.innerHTML = `⚡ <span style="color: #10b981;">Clicking Amateur Pro</span> (+20% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = '#d1fae5';
    } else {
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
clickBtn?.addEventListener('click', (): void => {
    // MECHANIC: 15% Chance to trigger a Critical Hit (5x Multiplier)
    const rollingProbability: number = Math.random();
    let currentGain: number = clickPower;
    
    if (rollingProbability <= 0.15) {
        currentGain = clickPower * 5;
        
        // Brief styling pulse feedback to alert critical hits visually
        if (display) {
            display.style.color = '#ef4444';
            setTimeout(() => { if (display) display.style.color = ''; }, 180);
        }
    }

    count += currentGain;
    localStorage.setItem('game_clicks', count.toString());
    updateGameUI();
});

// ==========================================================================
// 5. Upgrade Shop Management (With Exponential Cost Scaling)
// ==========================================================================
superClickBtn?.addEventListener('click', (): void => {
    if (count >= superCost) {
        count -= superCost;
        clickPower += 2;
        
        // ADVANCED MATH: Cost scales exponentially by 35% with every single purchase
        superCost = Math.round(superCost * 1.35);
        
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('click_power', clickPower.toString());
        localStorage.setItem('cost_super', superCost.toString());
        updateGameUI();
    } else {
        alert("❌ Not enough clicks to purchase Super Clicker!");
    }
});

autoClickBtn?.addEventListener('click', (): void => {
    if (count >= autoCost) {
        count -= autoCost;
        autoClickers += 1;
        
        // ADVANCED MATH: Cost scales exponentially by 40% with every single purchase
        autoCost = Math.round(autoCost * 1.40);
        
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('auto_clickers', autoClickers.toString());
        localStorage.setItem('cost_auto', autoCost.toString());
        updateGameUI();
    } else {
        alert("❌ Not enough clicks to purchase Auto-Clicker!");
    }
});

// ==========================================================================
// 6. Preferences & Shared Utilities Panel
// ==========================================================================
usernameInput?.addEventListener('input', (): void => {
    activeUser = usernameInput.value.trim() || 'Guest';
    localStorage.setItem('game_user', activeUser);
    if (welcomeBanner) welcomeBanner.innerText = `Welcome, ${activeUser}!`;
});

applyCheatBtn?.addEventListener('click', (): void => {
    if (!cheatInput) return;
    const code: string = cheatInput.value.trim().toLowerCase();
    if (code === 'freeclicks') {
        count += 500;
        localStorage.setItem('game_clicks', count.toString());
        updateGameUI();
        cheatInput.value = '';
        alert('🎉 Cheat Activated! Added +500 clicks to your active balance!');
    } else {
        alert('❌ Invalid Developer Cheat Code!');
    }
});

// Background automation runtime thread
setInterval((): void => {
    if (autoClickers > 0) {
        // Multiplies basic auto units by unlocked prestige badges
        count += (autoClickers * prestigeMultiplier);
        localStorage.setItem('game_clicks', Math.floor(count).toString());
        updateGameUI();
    }
}, 1000);

resetBtn?.addEventListener('click', (): void => {
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
window.addEventListener('storage', (e: StorageEvent): void => {
    if (e.key === 'game_clicks') count = parseInt(e.newValue || '0', 10);
    if (e.key === 'click_power') clickPower = parseInt(e.newValue || '1', 10);
    if (e.key === 'auto_clickers') autoClickers = parseInt(e.newValue || '0', 10);
    if (e.key === 'game_user') activeUser = e.newValue || 'Guest';
    if (e.key === 'cost_super') superCost = parseInt(e.newValue || '15', 10);
    if (e.key === 'cost_auto') autoCost = parseInt(e.newValue || '50', 10);
    if (e.key === 'prestige_mult') prestigeMultiplier = parseFloat(e.newValue || '1.0');
    updateGameUI();
});

// Theme persistance hook
const savedTheme: string | null = localStorage.getItem('app_theme');
if (savedTheme === 'dark') {
    document.body.style.backgroundColor = '#1e293b';
    if (themeToggleBtn) themeToggleBtn.innerText = "Toggle Theme ☀️";
}

themeToggleBtn?.addEventListener('click', (): void => {
    const isDark: boolean = localStorage.getItem('app_theme') === 'dark';
    if (isDark) {
        localStorage.setItem('app_theme', 'light');
        document.body.style.backgroundColor = '#f1f5f9';
        themeToggleBtn.innerText = "Toggle Theme 🌙";
    } else {
        localStorage.setItem('app_theme', 'dark');
        document.body.style.backgroundColor = '#1e293b';
        themeToggleBtn.innerText = "Toggle Theme ☀️";
    }
});

// Dynamic UI System Clock Interface
if (timeElement) {
    const renderClock = (): void => {
        const now: Date = new Date();
        timeElement.textContent = `Server Time: ${now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        })}`;
    };
    renderClock(); 
    setInterval(renderClock, 1000);
}
