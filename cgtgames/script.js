"use strict";

/*
 * CGTGames™
 * Easter Egg & Archive Engine
 */

const STORAGE_KEY = "cgtgames_discovered";

const defaultSecrets = [
    "dolphin",
    "clickergamets",
    "cgt",
    "404",
    "cgtgames"
];

let discovered = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

const counter = document.getElementById("secret-counter");
const message = document.getElementById("secret-message");
const secretInput = document.getElementById("secret-input");
const secretButton = document.getElementById("secret-button");

function saveDiscoveries() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(discovered)
    );
}

function updateCounter() {
    if (counter) {
        counter.textContent =
            `${discovered.length}/${defaultSecrets.length} Easter Eggs Found`;
    }
}

function showMessage(text) {
    if (!message) {
        return;
    }

    message.textContent = text;

    message.classList.remove("secret-pop");

    void message.offsetWidth;

    message.classList.add("secret-pop");
}

function discoverSecret(secret, text) {
    if (!discovered.includes(secret)) {
        discovered.push(secret);
        saveDiscoveries();
        updateCounter();

        showMessage(`🎉 ${text}`);
        return;
    }

    showMessage(`👀 You already discovered "${secret}"!`);
}

function checkSecret(value) {
    const code = value
        .trim()
        .toLowerCase();

    switch (code) {
        case "dolphin":
            discoverSecret(
                "dolphin",
                "🐬 Dolphin systems detected!"
            );
            break;

        case "clickergamets":
            discoverSecret(
                "clickergamets",
                "🖱️ ClickerGameTS discovered!"
            );
            break;

        case "cgt":
            discoverSecret(
                "cgt",
                "🚀 CGT abbreviation unlocked!"
            );
            break;

        case "404":
            discoverSecret(
                "404",
                "❓ You found the 404 archive secret!"
            );
            break;

        case "cgtgames":
            discoverSecret(
                "cgtgames",
                "🏆 CGTGames master secret unlocked!"
            );
            break;

        default:
            showMessage(
                "❌ Nothing happened... or did it?"
            );
    }

    if (secretInput) {
        secretInput.value = "";
    }
}

secretButton?.addEventListener("click", () => {
    checkSecret(secretInput?.value || "");
});

secretInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkSecret(secretInput.value);
    }
});

/*
 * Konami-style keyboard Easter egg
 */

const secretSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
];

let sequencePosition = 0;

window.addEventListener("keydown", (event) => {
    if (event.key === secretSequence[sequencePosition]) {
        sequencePosition++;

        if (sequencePosition === secretSequence.length) {
            discoverSecret(
                "keyboard",
                "⌨️ Secret keyboard sequence discovered!"
            );

            sequencePosition = 0;
        }

        return;
    }

    sequencePosition = 0;
});

/*
 * Hidden CGT title interaction
 */

const logo = document.getElementById("cgt-logo");

let logoClicks = 0;

logo?.addEventListener("click", () => {
    logoClicks++;

    if (logoClicks >= 5) {
        discoverSecret(
            "logo",
            "👀 You clicked the CGT logo five times."
        );

        logoClicks = 0;
    }
});

/*
 * Reset discoveries
 * Useful during development.
 */

window.resetCGTGamesSecrets = () => {
    localStorage.removeItem(STORAGE_KEY);
    discovered = [];
    updateCounter();

    showMessage(
        "🧹 Easter egg discoveries reset."
    );
};

updateCounter();