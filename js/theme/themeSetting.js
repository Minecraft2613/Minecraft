function applyTheme() {
    const root = document.documentElement.style;
    const savedBoxColor = localStorage.getItem("--box-color");
    const savedGlowColor = localStorage.getItem("saved-glow-color");
    const savedGlowSpeed = localStorage.getItem("--glow-speed");
    const savedGlowBrightness = localStorage.getItem("--glow-brightness");
    const savedBgTheme = localStorage.getItem("--bg-theme");
    const savedGlowEnabled = localStorage.getItem("--glow-enabled");
    const savedTextLight = localStorage.getItem("--text-light");
    const savedAccentGreen = localStorage.getItem("--accent-green");
    const savedAccentBlue = localStorage.getItem("--accent-blue");

    if (savedBoxColor) root.setProperty('--box-color', savedBoxColor);
    if (savedGlowSpeed) root.setProperty('--glow-speed', savedGlowSpeed);
    if (savedGlowBrightness) root.setProperty('--glow-brightness', savedGlowBrightness);
    if (savedBgTheme) root.setProperty('--bg-theme', savedBgTheme);
    if (savedTextLight) root.setProperty('--text-light', savedTextLight);
    if (savedAccentGreen) root.setProperty('--accent-green', savedAccentGreen);
    if (savedAccentBlue) root.setProperty('--accent-blue', savedAccentBlue);

    const glowToggleCheckbox = document.getElementById("glowToggle");
    if (glowToggleCheckbox) {
        glowToggleCheckbox.checked = (savedGlowEnabled === "true");
        root.setProperty('--glow-color', (savedGlowEnabled === "true" && savedGlowColor) ? savedGlowColor : "transparent");
    } else {
        root.setProperty('--glow-color', (savedGlowEnabled === "true" && savedGlowColor) ? savedGlowColor : "transparent");
    }

    document.getElementById("boxColor").value = savedBoxColor || getComputedStyle(document.documentElement).getPropertyValue('--box-color');
    document.getElementById("glowColor").value = savedGlowColor || getComputedStyle(document.documentElement).getPropertyValue('--accent-green');
    document.getElementById("glowSpeed").value = parseFloat((savedGlowSpeed || '3s').replace('s', ''));
    document.getElementById("glowBrightness").value = parseFloat(savedGlowBrightness || '0.6');
    document.getElementById("bgTheme").value = (savedBgTheme && !savedBgTheme.startsWith("url('") && !savedBgTheme.startsWith("linear-gradient")) ? savedBgTheme : '';
    document.getElementById("textLightColor").value = savedTextLight || getComputedStyle(document.documentElement).getPropertyValue('--text-light');
    document.getElementById("accentGreenColor").value = savedAccentGreen || getComputedStyle(document.documentElement).getPropertyValue('--accent-green');
    document.getElementById("accentBlueColor").value = savedAccentBlue || getComputedStyle(document.documentElement).getPropertyValue('--accent-blue');
}

async function saveTheme() {
    const root = document.documentElement.style;
    const box = document.getElementById("boxColor").value;
    const glow = document.getElementById("glowColor").value;
    const speed = document.getElementById("glowSpeed").value + "s";
    const brightness = document.getElementById("glowBrightness").value;
    let bg = document.getElementById("bgTheme").value.trim();
    const enableGlow = document.getElementById("glowToggle").checked;
    const textLight = document.getElementById("textLightColor").value;
    const accentGreen = document.getElementById("accentGreenColor").value;
    const accentBlue = document.getElementById("accentBlueColor").value;

    localStorage.setItem("--box-color", box);
    localStorage.setItem("saved-glow-color", glow);
    localStorage.setItem("--glow-speed", speed);
    localStorage.setItem("--glow-brightness", brightness);
    localStorage.setItem("--bg-theme", bg);
    localStorage.setItem("--glow-enabled", enableGlow);
    localStorage.setItem("--text-light", textLight);
    localStorage.setItem("--accent-green", accentGreen);
    localStorage.setItem("--accent-blue", accentBlue);

    root.setProperty("--box-color", box);
    root.setProperty("--glow-color", enableGlow ? glow : "transparent");
    root.setProperty("--glow-speed", speed);
    root.setProperty("--glow-brightness", brightness);
    root.setProperty("--bg-theme", bg);
    root.setProperty("--text-light", textLight);
    root.setProperty("--accent-green", accentGreen);
    root.setProperty("--accent-blue", accentBlue);

    showCustomMessage(document.getElementById('theme-settings-content').querySelector('h2'), "🎨 Theme saved!", "success");

    const themeData = {
        userId: currentUser ? currentUser.uid : 'guest',
        theme: {
            boxColor: box,
            glowColor: glow,
            glowSpeed: speed,
            glowBrightness: brightness,
            bgTheme: bg,
            glowEnabled: enableGlow,
            textLight: textLight,
            accentGreen: accentGreen,
            accentBlue: accentBlue
        }
    };
    // Use fetch to send theme data to the worker
    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/theme.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': WORKER_API_KEY
            },
            body: JSON.stringify(themeData)
        });
        if (!response.ok) {
            console.error('Failed to save theme to worker:', await response.text());
        }
    } catch (e) {
        console.error('Error saving theme to worker:', e);
    }
}

async function resetTheme() {
    const defaults = {
        "--box-color": "#0d0d0d",
        "saved-glow-color": "#00ffcc",
        "--glow-speed": "3s",
        "--glow-brightness": "0.6",
        "--bg-theme": "linear-gradient(-45deg, #0a0a0a, #111111, #1a1a1a, #0d0d0d)",
        "--glow-enabled": "false",
        "--text-light": "#e0e0e0",
        "--accent-green": "#00ffcc",
        "--accent-blue": "#42a5f5"
    };

    for (let key in defaults) {
        localStorage.setItem(key, defaults[key]);
    }
    applyTheme();
    showCustomMessage(document.getElementById('theme-settings-content').querySelector('h2'), "🔄 Theme reset to default and glow disabled.", "success");

    // Reset theme in theme.json via worker
    try {
        const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/theme.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': WORKER_API_KEY
            },
            body: JSON.stringify({ userId: currentUser ? currentUser.uid : 'guest', theme: defaults })
        });
        if (!response.ok) {
            console.error('Failed to reset theme in worker:', await response.text());
        }
    } catch (e) {
        console.error('Error resetting theme in worker:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("glowToggle").addEventListener('change', function() {
        saveTheme();
    });

    document.getElementById("boxColor").addEventListener('input', saveTheme);
    document.getElementById("glowColor").addEventListener('input', saveTheme);
    document.getElementById("glowSpeed").addEventListener('input', saveTheme);
    document.getElementById("glowBrightness").addEventListener('input', saveTheme);
    document.getElementById("bgTheme").addEventListener('input', saveTheme);
    document.getElementById("textLightColor").addEventListener('input', saveTheme);
    document.getElementById("accentGreenColor").addEventListener('input', saveTheme);
    document.getElementById("accentBlueColor").addEventListener('input', saveTheme);

    document.querySelector('#theme-settings-content button[onclick="saveTheme()"]').addEventListener('click', saveTheme);
    document.querySelector('#theme-settings-content button[onclick="resetTheme()"]').addEventListener('click', resetTheme);

    applyTheme();
});
