// ==========================================================================
// ClickerGameTS Master Runtime Engine - Production Grade & Bug-Free
// ==========================================================================
"use strict";

// 1. Core State Initialization (Safely sourced from Persistent Storage)
let count = parseInt(localStorage.getItem('game_clicks') || '0', 10);
let clickPower = parseInt(localStorage.getItem('click_power') || '1', 10);
let autoClickers = parseInt(localStorage.getItem('auto_clickers') || '0', 10);
let activeUser = localStorage.getItem('game_user') || 'Guest';
let superCost = parseInt(localStorage.getItem('cost_super') || '15', 10);
let autoCost = parseInt(localStorage.getItem('cost_auto') || '50', 10);
let prestigeMultiplier = parseFloat(localStorage.getItem('prestige_mult') || '1.0');

// 2. Multi-Page DOM Element Selectors Map
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
const prestigeBtn = document.getElementById('prestige-btn');
const exportBtn = document.getElementById('export-save-btn');
const importBtn = document.getElementById('import-save-btn');

// 3. UI Synchronization Render Loop
function updateGameUI() {
    if (display) display.innerText = `Clicks: ${Math.floor(count)}`;
    
    const passiveCalculation = autoClickers * prestigeMultiplier;
    if (powerDisplay) {
        powerDisplay.innerText = `Click Power: +${clickPower} | Passive Production: ${passiveCalculation.toFixed(1)}/sec (${prestigeMultiplier}x Boost)`;
    }
    if (welcomeBanner) welcomeBanner.innerText = `Welcome, ${activeUser}!`;
    if (superCostText) superCostText.innerText = superCost.toString();
    if (autoCostText) autoCostText.innerText = autoCost.toString();
    
    if (usernameInput && !usernameInput.matches(':focus')) {
        usernameInput.value = activeUser === 'Guest' ? '' : activeUser;
    }
    
    // Safety Fallbacks for Analytics View mapping
    if (statsClicks) statsClicks.innerText = Math.floor(count).toString();
    if (statsAutoRate) statsAutoRate.innerText = `${passiveCalculation.toFixed(1)}/sec`;
    if (statsUser) statsUser.innerText = activeUser;
    if (statsProgBar) {
        const visualPercentage = Math.min((autoClickers / 50) * 100, 100);
        statsProgBar.style.width = `${visualPercentage}%`;
    }
    
    evaluateMilestoneBadges();
    
    if (superClickBtn) superClickBtn.disabled = count < superCost;
    if (autoClickBtn) autoClickBtn.disabled = count < autoCost;
    if (prestigeBtn) {
        prestigeBtn.disabled = count < 5000;
        prestigeBtn.innerText = count >= 5000 ? `Prestige (Gain +0.5x Multiplier)` : `Prestige (Requires 5k Clicks)`;
    }
}

function evaluateMilestoneBadges() {
    if (!badgeContainer) return;
    if (count >= 1000) {
        badgeContainer.innerHTML = `🚀 <span style="color: #6366f1;">Silicon Valley Legend</span> (+50% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = 'var(--badge-bg)';
    } else if (count >= 300) {
        badgeContainer.innerHTML = `⚡ <span style="color: #10b981;">Clicking Amateur Pro</span> (+20% CPS Boost Active)`;
        badgeContainer.style.backgroundColor = 'var(--badge-bg)';
    } else {
        badgeContainer.innerText = "🔒 Complete 300 clicks to unlock first badge!";
        badgeContainer.style.backgroundColor = 'var(--badge-bg)';
    }
}

// 4. Interactive Core Click Handlers & Floating Particles
clickBtn?.addEventListener('click', (event) => {
    const rollingProbability = Math.random();
    let currentGain = clickPower;
    let isCrit = false;
    
    clickBtn.classList.remove('pop-active');
    void clickBtn.offsetWidth; // Force CSS reflow calculation to restart animation frame
    clickBtn.classList.add('pop-active');

    if (rollingProbability <= 0.15) {
        currentGain = clickPower * 5;
        isCrit = true;
        if (display) {
            display.classList.remove('crit-active');
            void display.offsetWidth;
            display.classList.add('crit-active');
        }
    }
    
    count += currentGain;
    localStorage.setItem('game_clicks', count.toString());
    
    createClickParticle(event.clientX, event.clientY, currentGain, isCrit);
    updateGameUI();
});

function createClickParticle(x, y, amount, isCrit) {
    const particle = document.createElement('span');
    particle.className = 'click-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    if (isCrit) {
        particle.innerText = `🔥 CRIT +${amount}!`;
        particle.style.color = '#ef4444';
        particle.style.fontSize = '1.6rem';
    } else {
        particle.innerText = `+${amount}`;
    }
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 800); // Prevent element performance leaks
}

// 5. Upgrade Economy Store Interactions
superClickBtn?.addEventListener('click', () => {
    if (count >= superCost) {
        count -= superCost;
        clickPower += 2;
        superCost = Math.round(superCost * 1.35);
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('click_power', clickPower.toString());
        localStorage.setItem('cost_super', superCost.toString());
        updateGameUI();
    }
});

autoClickBtn?.addEventListener('click', () => {
    if (count >= autoCost) {
        count -= autoCost;
        autoClickers += 1;
        autoCost = Math.round(autoCost * 1.40);
        localStorage.setItem('game_clicks', count.toString());
        localStorage.setItem('auto_clickers', autoClickers.toString());
        localStorage.setItem('cost_auto', autoCost.toString());
        updateGameUI();
    }
});

// 6. Prestige & Profiles Modules
prestigeBtn?.addEventListener('click', () => {
    if (count >= 5000) {
        if (confirm("🌀 Are you ready to prestige? This resets your click inventory and shop upgrades, but grants a permanent +0.5x multiplier boost across all pages!")) {
            prestigeMultiplier = parseFloat((prestigeMultiplier + 0.5).toFixed(1));
            
            localStorage.clear();
            localStorage.setItem('game_user', activeUser);
            localStorage.setItem('prestige_mult', prestigeMultiplier.toString());
            
            count = 0;
            clickPower = 1;
            autoClickers = 0;
            superCost = 15;
            autoCost = 50;
            
            location.reload();
        }
    }
});

usernameInput?.addEventListener('input', () => {
    activeUser = usernameInput.value.trim() || 'Guest';
    localStorage.setItem('game_user', activeUser);
});

applyCheatBtn?.addEventListener('click', () => {
    if (!cheatInput) return;
    const code = cheatInput.value.trim().toLowerCase();
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

exportBtn?.addEventListener('click', () => {
    const saveData = {
        clicks: count, power: clickPower, autos: autoClickers,
        scost: superCost, acost: autoCost, mult: prestigeMultiplier, user: activeUser
    };
    const encryptedString = btoa(JSON.stringify(saveData));
    navigator.clipboard.writeText(encryptedString);
    alert("📋 Save encrypted! Data code copied to your device's clipboard.");
});

importBtn?.addEventListener('click', () => {
    const rawInput = prompt("📥 Paste your encrypted backup data string code here:");
    if (!rawInput) return;
    try {
        const parsedSave = JSON.parse(atob(rawInput.trim()));
        if (parsedSave.clicks !== undefined) {
            localStorage.setItem('game_clicks', parsedSave.clicks.toString());
            localStorage.setItem('click_power', parsedSave.power.toString());
            localStorage.setItem('auto_clickers', parsedSave.autos.toString());
            localStorage.setItem('cost_super', parsedSave.scost.toString());
            localStorage.setItem('cost_auto', parsedSave.acost.toString());
            localStorage.setItem('prestige_mult', parsedSave.mult.toString());
            localStorage.setItem('game_user', parsedSave.user || 'Guest');
            
            alert("🎉 Synchronization Success! System states loaded.");
            location.reload();
        }
    } catch (e) {
        alert("❌ Error: Invalid backup data code provided!");
    }
});

// 7. Background Automation & Catching Engine
const handleOfflineProduction = () => {
    const currentTime = Date.now();
    const lastSavedTime = parseInt(localStorage.getItem('game_last_active') || '0', 10);
    
    if (lastSavedTime > 0 && autoClickers > 0) {
        const timePassedSeconds = Math.floor((currentTime - lastSavedTime) / 1000);
        const activeSeconds = Math.min(timePassedSeconds, 43200); // Cap tracking calculations at 12 hours
        
        if (activeSeconds > 5) {
            const totalEarned = Math.floor(activeSeconds * (autoClickers * prestigeMultiplier));
            count += totalEarned;
            localStorage.setItem('game_clicks', count.toString());
            alert(`💤 While you were away for ${Math.floor(activeSeconds / 60)} minutes, your automated subsystems synthesized +${totalEarned} clicks!`);
        }
    }
    setInterval(() => {
        localStorage.setItem('game_last_active', Date.now().toString());
    }, 1000);
};

// Automation Loop ticker
setInterval(() => {
    if (autoClickers > 0) {
        count += (autoClickers * (prestigeMultiplier / 10)); // Dividends computed at 100ms intervals
        localStorage.setItem('game_clicks', Math.floor(count).toString());
        updateGameUI();
    }
}, 1000);

resetBtn?.addEventListener('click', () => {
    if (confirm("🚨 Are you sure you want to completely wipe all your progress?")) {
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
    }
});

window.addEventListener('storage', (e) => {
    if (localStorage.length === 0) {
        count = 0;
        clickPower = 1;
        autoClickers = 0;
        activeUser = 'Guest';
        superCost = 15;
        autoCost = 50;
        prestigeMultiplier = 1.0;
        updateGameUI();
        return;
    }
    if (e.key === 'game_clicks') count = parseInt(e.newValue || '0', 10);
    if (e.key === 'click_power') clickPower = parseInt(e.newValue || '1', 10);
    if (e.key === 'auto_clickers') autoClickers = parseInt(e.newValue || '0', 10);
    if (e.key === 'game_user') activeUser = e.newValue || 'Guest';
    if (e.key === 'cost_super') superCost = parseInt(e.newValue || '15', 10);
    if (e.key === 'cost_auto') autoCost = parseInt(e.newValue || '50', 10);
    if (e.key === 'prestige_mult') prestigeMultiplier = parseFloat(e.newValue || '1.0');
    updateGameUI();
});

const applyStoredTheme = () => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggleBtn) {
        themeToggleBtn.innerText = savedTheme === 'dark' ? "Toggle Theme ☀️" : "Toggle Theme 🌙";
    }
};

themeToggleBtn?.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('app_theme', nextTheme);
    applyStoredTheme();
});

// Boot sequences
applyStoredTheme();
handleOfflineProduction();
updateGameUI();

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
